/**
 * Real WebGL Water Ripple Simulation
 * Authentic 2D wave equation with heightmap ping-pong framebuffers,
 * normal-map displacement, specular reflection, and physical damping.
 * Guaranteed zero screen-wash with hard thresholding and buffer clearing.
 */

export function initWaterRipple() {
  const canvas = document.getElementById('water-canvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false });
  if (!gl) {
    console.warn('WebGL not supported, falling back.');
    return { toggle: () => false, splash: () => {} };
  }

  // Extensions
  const ext = gl.getExtension('OES_texture_float');
  const type = ext ? gl.FLOAT : gl.UNSIGNED_BYTE;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const simResolution = 256;
  const simWidth = simResolution;
  const simHeight = Math.floor(simResolution * (height / width)) || simResolution;

  // Base Vertex Shader
  const baseVertexShader = `
    attribute vec2 a_position;
    varying vec2 v_uv;
    void main() {
      v_uv = (a_position + 1.0) * 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  // Drop Shader
  const dropFragmentShader = `
    precision highp float;
    varying vec2 v_uv;
    uniform sampler2D u_texture;
    uniform vec2 u_center;
    uniform float u_radius;
    uniform float u_strength;

    void main() {
      vec4 info = texture2D(u_texture, v_uv);
      float d = distance(v_uv, u_center);
      if (d < u_radius) {
        float factor = (cos(d / u_radius * 3.14159265) + 1.0) * 0.5;
        info.r += factor * u_strength;
      }
      gl_FragColor = info;
    }
  `;

  // Wave Simulation Update Shader
  const updateFragmentShader = `
    precision highp float;
    varying vec2 v_uv;
    uniform sampler2D u_texture;
    uniform vec2 u_delta;

    void main() {
      vec4 info = texture2D(u_texture, v_uv);
      vec2 dx = vec2(u_delta.x, 0.0);
      vec2 dy = vec2(0.0, u_delta.y);

      float average = (
        texture2D(u_texture, v_uv - dx).r +
        texture2D(u_texture, v_uv + dx).r +
        texture2D(u_texture, v_uv - dy).r +
        texture2D(u_texture, v_uv + dy).r
      ) * 0.25;

      info.g += (average - info.r) * 2.0;
      info.g *= 0.955; // Natural fluid viscosity damping
      info.r += info.g;

      // Noise gate to prevent numerical float drift
      if (abs(info.r) < 0.0001) info.r = 0.0;
      if (abs(info.g) < 0.0001) info.g = 0.0;

      gl_FragColor = info;
    }
  `;

  // Caustic / Specular Render Shader with strict thresholding
  const renderFragmentShader = `
    precision highp float;
    varying vec2 v_uv;
    uniform sampler2D u_texture;
    uniform vec2 u_delta;
    uniform vec3 u_lightColor;
    uniform float u_isLightMode;

    void main() {
      vec2 dx = vec2(u_delta.x, 0.0);
      vec2 dy = vec2(0.0, u_delta.y);

      float valL = texture2D(u_texture, v_uv - dx).r;
      float valR = texture2D(u_texture, v_uv + dx).r;
      float valB = texture2D(u_texture, v_uv - dy).r;
      float valT = texture2D(u_texture, v_uv + dy).r;

      vec2 grad = vec2(valL - valR, valB - valT) * 4.0;
      float waveDistort = length(grad);

      // Hard gate: zero out calm water completely so the screen never washes out
      if (waveDistort < 0.008) {
        discard;
      }

      vec3 normal = normalize(vec3(grad, 1.0));
      vec3 lightDir = normalize(vec3(0.2, 0.4, 0.9));
      float specular = pow(max(0.0, dot(normal, lightDir)), 20.0);

      float alpha = clamp(waveDistort * 1.5 + specular * 0.6, 0.0, 0.55);
      vec3 col = mix(u_lightColor, vec3(1.0), specular * 0.7);

      gl_FragColor = vec4(col, alpha);
    }
  `;

  function createShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function createProgram(vsSrc, fsSrc) {
    const p = gl.createProgram();
    gl.attachShader(p, createShader(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(p, createShader(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(p);
    return p;
  }

  const dropProg = createProgram(baseVertexShader, dropFragmentShader);
  const updateProg = createProgram(baseVertexShader, updateFragmentShader);
  const renderProg = createProgram(baseVertexShader, renderFragmentShader);

  // Fullscreen quad buffer
  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  function createTexture() {
    const t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, simWidth, simHeight, 0, gl.RGBA, type, null);
    return t;
  }

  function createFBO(tex) {
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return fbo;
  }

  let texA = createTexture();
  let texB = createTexture();
  let fboA = createFBO(texA);
  let fboB = createFBO(texB);

  let isEnabled = true;
  let hasActivity = true;
  let activityTimer = 240;

  function addDrop(x, y, radius = 0.04, strength = 0.05) {
    if (!isEnabled) return;
    hasActivity = true;
    activityTimer = 240;

    const nx = x / width;
    const ny = 1.0 - y / height;

    gl.useProgram(dropProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
    gl.viewport(0, 0, simWidth, simHeight);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.uniform1i(gl.getUniformLocation(dropProg, 'u_texture'), 0);
    gl.uniform2f(gl.getUniformLocation(dropProg, 'u_center'), nx, ny);
    gl.uniform1f(gl.getUniformLocation(dropProg, 'u_radius'), radius);
    gl.uniform1f(gl.getUniformLocation(dropProg, 'u_strength'), strength);

    const posLoc = gl.getAttribLocation(dropProg, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    let tempFbo = fboA; fboA = fboB; fboB = tempFbo;
    let tempTex = texA; texA = texB; texB = tempTex;
  }

  let lastX = -1;
  let lastY = -1;
  let lastMoveTime = 0;

  window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    const x = e.clientX;
    const y = e.clientY;

    if (lastX >= 0) {
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 18 && now - lastMoveTime > 30) {
        const radius = Math.min(0.03 + dist * 0.0005, 0.07);
        const strength = Math.min(0.03 + dist * 0.0006, 0.08);
        addDrop(x, y, radius, strength);
        lastMoveTime = now;
        lastX = x;
        lastY = y;
      }
    } else {
      lastX = x;
      lastY = y;
    }
  });

  window.addEventListener('pointerdown', (e) => {
    addDrop(e.clientX, e.clientY, 0.065, 0.15);
    setTimeout(() => {
      addDrop(e.clientX, e.clientY, 0.045, 0.08);
    }, 70);
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  function clearScreen() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function render() {
    requestAnimationFrame(render);
    if (!isEnabled) {
      clearScreen();
      return;
    }

    if (!hasActivity) return;

    if (activityTimer > 0) {
      activityTimer--;
      if (activityTimer === 0) {
        hasActivity = false;
        clearScreen();
        return;
      }
    }

    const isLightMode = document.documentElement.classList.contains('light');

    // 1. Step simulation
    gl.useProgram(updateProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
    gl.viewport(0, 0, simWidth, simHeight);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.uniform1i(gl.getUniformLocation(updateProg, 'u_texture'), 0);
    gl.uniform2f(gl.getUniformLocation(updateProg, 'u_delta'), 1.0 / simWidth, 1.0 / simHeight);

    let posLoc = gl.getAttribLocation(updateProg, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    let tempFbo = fboA; fboA = fboB; fboB = tempFbo;
    let tempTex = texA; texA = texB; texB = tempTex;

    // 2. Render to screen with clean transparent background
    clearScreen();

    gl.useProgram(renderProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width, height);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texA);
    gl.uniform1i(gl.getUniformLocation(renderProg, 'u_texture'), 0);
    gl.uniform2f(gl.getUniformLocation(renderProg, 'u_delta'), 1.0 / simWidth, 1.0 / simHeight);

    if (isLightMode) {
      gl.uniform3f(gl.getUniformLocation(renderProg, 'u_lightColor'), 0.05, 0.45, 0.7);
      gl.uniform1f(gl.getUniformLocation(renderProg, 'u_isLightMode'), 1.0);
    } else {
      gl.uniform3f(gl.getUniformLocation(renderProg, 'u_lightColor'), 0.06, 0.82, 0.94);
      gl.uniform1f(gl.getUniformLocation(renderProg, 'u_isLightMode'), 0.0);
    }

    posLoc = gl.getAttribLocation(renderProg, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  render();

  return {
    toggle: (val) => {
      isEnabled = typeof val === 'boolean' ? val : !isEnabled;
      if (isEnabled) {
        hasActivity = true;
        activityTimer = 240;
      } else {
        clearScreen();
      }
      return isEnabled;
    },
    splash: (x, y) => addDrop(x, y, 0.06, 0.15)
  };
}
