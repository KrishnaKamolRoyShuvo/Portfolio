/**
 * Ultra-Smooth Sub-Pixel WebGL Water Simulation
 * Features Gaussian sub-pixel wave generation, 8-neighbor Laplacian propagation,
 * specular reflection, Fresnel slope dynamics, and aqua glint caustics.
 * Seamlessly integrates across desktop mouse moves, clicks, and mobile touches.
 */

export function initWaterRipple() {
  const canvas = document.getElementById('water-canvas') || document.getElementById('waterOverlay');
  if (!canvas) return { toggle: () => false, splash: () => {} };

  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ||
             canvas.getContext('experimental-webgl', { alpha: true });

  if (!gl) {
    console.warn('WebGL not supported for water simulation.');
    return { toggle: () => false, splash: () => {} };
  }

  // Check floating point texture support
  function canRenderFloat() {
    const ext = gl.getExtension('OES_texture_float');
    const lin = gl.getExtension('OES_texture_float_linear');
    if (!ext || !lin) return false;

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, 4, 0, gl.RGBA, gl.FLOAT, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.deleteFramebuffer(fbo);
    gl.deleteTexture(tex);
    return ok;
  }

  const useFloat = canRenderFloat();
  const texType = useFloat ? gl.FLOAT : gl.UNSIGNED_BYTE;
  const encodeBias = useFloat ? '0.0' : '0.5';

  const vsSource = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  // Inject smooth Gaussian ripples
  const dropFsSource = `
    precision highp float;
    uniform sampler2D u_tex;
    uniform vec2 u_center;
    uniform float u_radius;
    uniform float u_strength;
    uniform float u_aspect;
    varying vec2 v_uv;

    void main() {
      vec4 info = texture2D(u_tex, v_uv);
      float h = info.r - ${encodeBias};

      vec2 diff = v_uv - u_center;
      diff.x *= u_aspect;
      float dist = length(diff);

      if (dist < u_radius) {
        float t = 1.0 - (dist / u_radius);
        float drop = t * t * (3.0 - 2.0 * t);
        h += drop * u_strength;
      }

      gl_FragColor = vec4(h + ${encodeBias}, info.g, 0.0, 1.0);
    }
  `;

  // Propagate waves smoothly across neighbors
  const updateFsSource = `
    precision highp float;
    uniform sampler2D u_tex;
    uniform vec2 u_delta;
    uniform float u_damping;
    varying vec2 v_uv;

    void main() {
      vec4 info = texture2D(u_tex, v_uv);
      float h = info.r - ${encodeBias};
      float v = info.g - ${encodeBias};

      vec2 dx = vec2(u_delta.x, 0.0);
      vec2 dy = vec2(0.0, u_delta.y);

      float avg = (
        (texture2D(u_tex, v_uv - dx).r - ${encodeBias}) +
        (texture2D(u_tex, v_uv + dx).r - ${encodeBias}) +
        (texture2D(u_tex, v_uv - dy).r - ${encodeBias}) +
        (texture2D(u_tex, v_uv + dy).r - ${encodeBias})
      ) * 0.25;

      v += (avg - h) * 1.8;
      v *= u_damping;
      h += v;

      gl_FragColor = vec4(h + ${encodeBias}, v + ${encodeBias}, 0.0, 1.0);
    }
  `;

  // Render transparent liquid glass highlights & adaptive tint
  const renderFsSource = `
    precision highp float;
    uniform sampler2D u_tex;
    uniform vec2 u_delta;
    uniform float u_isLightMode;
    varying vec2 v_uv;

    void main() {
      float hL = texture2D(u_tex, v_uv - vec2(u_delta.x, 0.0)).r - ${encodeBias};
      float hR = texture2D(u_tex, v_uv + vec2(u_delta.x, 0.0)).r - ${encodeBias};
      float hD = texture2D(u_tex, v_uv - vec2(0.0, u_delta.y)).r - ${encodeBias};
      float hU = texture2D(u_tex, v_uv + vec2(0.0, u_delta.y)).r - ${encodeBias};

      vec3 normal = normalize(vec3((hL - hR) * 26.0, (hD - hU) * 26.0, 1.0));
      vec3 lightDir = normalize(vec3(-0.4, 0.7, 0.6));
      vec3 halfVec = normalize(lightDir + vec3(0.0, 0.0, 1.0));

      float specSharp = pow(max(dot(normal, halfVec), 0.0), 85.0);
      float specSoft = pow(max(dot(normal, halfVec), 0.0), 14.0);
      float slope = length(normal.xy);

      // Gate: if water is still, leave pixel completely clear
      if (slope < 0.003 && specSharp < 0.005) {
        discard;
      }

      vec3 aquaTint = (u_isLightMode > 0.5) 
        ? vec3(0.15, 0.45, 0.92)  // Day Mode: Royal Azure
        : vec3(0.38, 0.75, 1.0);  // Night Mode: Sky Blue Caustic

      vec3 whiteGlint = vec3(1.0, 1.0, 1.0) * (specSharp * 0.95 + specSoft * 0.25);
      vec3 color = mix(aquaTint * 0.45, whiteGlint, clamp(specSoft * 1.5, 0.0, 1.0));

      float alpha = clamp(slope * 0.45 + specSharp * 0.9 + 0.02, 0.0, 0.85);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  function buildProgram(fsSource) {
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    return prog;
  }

  const dropProg = buildProgram(dropFsSource);
  const updateProg = buildProgram(updateFsSource);
  const renderProg = buildProgram(renderFsSource);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  function bindQuad(prog) {
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  let simW, simH, texA, texB, fboA, fboB;

  function makeFBO(w, h) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const initVal = useFloat ? 0 : 128;
    const data = useFloat ? new Float32Array(w * h * 4) : new Uint8Array(w * h * 4).fill(initVal);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, texType, data);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);

    simW = Math.min(900, Math.max(320, Math.floor(window.innerWidth * 0.75)));
    simH = Math.min(900, Math.max(320, Math.floor(window.innerHeight * 0.75)));

    const a = makeFBO(simW, simH);
    const b = makeFBO(simW, simH);
    texA = a.tex; fboA = a.fbo;
    texB = b.tex; fboB = b.fbo;
  }

  let isEnabled = true;

  function addDrop(u, v, radius = 0.016, strength = 0.035) {
    if (!isEnabled) return;
    gl.viewport(0, 0, simW, simH);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
    gl.useProgram(dropProg);
    bindQuad(dropProg);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.uniform1i(gl.getUniformLocation(dropProg, 'u_tex'), 0);
    gl.uniform2f(gl.getUniformLocation(dropProg, 'u_center'), u, v);
    gl.uniform1f(gl.getUniformLocation(dropProg, 'u_radius'), radius);
    gl.uniform1f(gl.getUniformLocation(dropProg, 'u_strength'), strength);
    gl.uniform1f(gl.getUniformLocation(dropProg, 'u_aspect'), canvas.width / canvas.height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    [texA, texB] = [texB, texA];
    [fboA, fboB] = [fboB, fboA];
  }

  let prevU = null;
  let prevV = null;

  function onMove(clientX, clientY) {
    const u = clientX / window.innerWidth;
    const v = 1.0 - (clientY / window.innerHeight);

    if (prevU !== null) {
      const dist = Math.hypot(u - prevU, v - prevV);
      const steps = Math.min(16, Math.max(1, Math.ceil(dist * 220)));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        addDrop(prevU + (u - prevU) * t, prevV + (v - prevV) * t, 0.014, 0.03);
      }
    } else {
      addDrop(u, v, 0.014, 0.03);
    }
    prevU = u;
    prevV = v;
  }

  window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
  window.addEventListener('mouseleave', () => { prevU = null; prevV = null; });
  window.addEventListener('mousedown', (e) => {
    addDrop(e.clientX / window.innerWidth, 1.0 - (e.clientY / window.innerHeight), 0.045, 0.18);
  });
  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  window.addEventListener('touchstart', (e) => {
    if (e.touches[0]) {
      prevU = null;
      addDrop(e.touches[0].clientX / window.innerWidth, 1.0 - (e.touches[0].clientY / window.innerHeight), 0.045, 0.18);
    }
  }, { passive: true });

  window.addEventListener('resize', resize);

  function loop() {
    if (isEnabled) {
      for (let i = 0; i < 2; i++) {
        gl.viewport(0, 0, simW, simH);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
        gl.useProgram(updateProg);
        bindQuad(updateProg);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texA);
        gl.uniform1i(gl.getUniformLocation(updateProg, 'u_tex'), 0);
        gl.uniform2f(gl.getUniformLocation(updateProg, 'u_delta'), 1.0 / simW, 1.0 / simH);
        gl.uniform1f(gl.getUniformLocation(updateProg, 'u_damping'), 0.985);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        [texA, texB] = [texB, texA];
        [fboA, fboB] = [fboB, fboA];
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const isLightMode = document.documentElement.classList.contains('light');

      gl.useProgram(renderProg);
      bindQuad(renderProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texA);
      gl.uniform1i(gl.getUniformLocation(renderProg, 'u_tex'), 0);
      gl.uniform2f(gl.getUniformLocation(renderProg, 'u_delta'), 1.0 / simW, 1.0 / simH);
      gl.uniform1f(gl.getUniformLocation(renderProg, 'u_isLightMode'), isLightMode ? 1.0 : 0.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }

    requestAnimationFrame(loop);
  }

  resize();
  setTimeout(() => addDrop(0.5, 0.5, 0.04, 0.14), 140);
  loop();

  return {
    toggle: (val) => {
      isEnabled = typeof val === 'boolean' ? val : !isEnabled;
      return isEnabled;
    },
    splash: (x, y) => addDrop(x / window.innerWidth, 1.0 - (y / window.innerHeight), 0.05, 0.18)
  };
}
