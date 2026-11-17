/**
 * Structured Project & Research Data
 */

export const FLAGSHIP_PROJECTS = [
  {
    id: 'microshift',
    title: 'MicroShift',
    subtitle: 'Enterprise Part-Time Job Portal & Escrow Service',
    category: 'Full-Stack Enterprise',
    badge: 'ASP.NET Core & Neon PostgreSQL',
    liveUrl: 'https://microshift.onrender.com',
    loginUrl: 'https://microshift.onrender.com/Identity/Account/Login',
    registerUrl: 'https://microshift.onrender.com/Identity/Account/Register',
    githubUrl: 'https://github.com/KrishnaKamolRoyShuvo',
    database: 'Neon Serverless PostgreSQL (microshift)',
    adminCredentials: {
      email: 'admin112@microshift.com',
      password: 'Pass@1234'
    },
    techStack: [
      'ASP.NET Core MVC',
      'C#',
      'Entity Framework Core',
      'Neon PostgreSQL',
      'Stripe Escrow',
      'SignalR WebSockets',
      'Leaflet.js',
      'EXIF Metadata Analysis'
    ],
    description: 'An enterprise-grade marketplace platform engineered for flexible part-time job matching, secure financial escrow, and verified dispute resolution.',
    keyPoints: [
      'Engineered location-based radius matching and geospatial queries using Leaflet.js with interactive maps.',
      'Architected end-to-end Stripe escrow payment pipeline with automated milestones and fund releases.',
      'Implemented real-time bi-directional messaging and live alert dispatching via SignalR WebSockets.',
      'Designed EXIF metadata forensic scanner to inspect image coordinates, timestamps, and camera parameters for fraud dispute evidence.',
      'Configured role-based security with ASP.NET Identity, admin moderation panels, and worker trust badges.'
    ]
  },
  {
    id: 'school-management',
    title: 'School Management & Admission System',
    subtitle: 'Dual-Portal Academic Management Platform',
    category: 'Full-Stack EdTech',
    badge: 'Dual Portal Architecture',
    liveUrl: 'https://school-admission-6bz8.onrender.com',
    adminUrl: 'https://school-admission-6bz8.onrender.com/admin',
    backendApi: 'https://school-management-system-r060.onrender.com',
    githubUrl: 'https://github.com/KrishnaKamolRoyShuvo',
    database: 'Neon Serverless PostgreSQL (neondb)',
    techStack: [
      'React.js',
      'Node.js / Express',
      'Neon Serverless PostgreSQL',
      'RESTful APIs',
      'JWT Authentication',
      'Role-Based Access Control',
      'Tailwind CSS'
    ],
    description: 'High-availability academic admission and student administration platform supporting self-service applicant onboarding and granular administrative oversight.',
    keyPoints: [
      'Engineered high-throughput student admission portal with multi-step document submission and verification.',
      'Built a separate secure Admin Operations Portal for academic staff, grade records, and audit reporting.',
      'Integrated serverless Neon PostgreSQL for resilient, scalable data persistence with connection pooling.',
      'Implemented JWT session lifecycle management and role-based permissions (Students, Staff, SuperAdmin).'
    ]
  },
  {
    id: 'car-parking',
    title: 'Car Parking & Slot Monetization Platform',
    subtitle: 'Dynamic Pricing & Real-Time Slot Reservation',
    category: 'MERN Cloud Application',
    badge: 'MERN Stack & Real-Time Sync',
    liveUrl: 'https://github.com/KrishnaKamolRoyShuvo',
    githubUrl: 'https://github.com/KrishnaKamolRoyShuvo',
    database: 'MongoDB Atlas',
    techStack: [
      'MongoDB',
      'Express.js',
      'React.js',
      'Node.js',
      'Socket.io',
      'Stripe Payments',
      'Tailwind CSS'
    ],
    description: 'Smart parking ecosystem allowing drivers to book verified parking spaces and property owners to monetize unused parking spots in real-time.',
    keyPoints: [
      'Developed dynamic surge pricing algorithms based on geographic location, spot category, duration, and peak hours.',
      'Real-time parking slot occupancy status tracking with live WebSocket status updates.',
      'Peer-to-peer parking spot leasing allowing registered users to list spaces and earn automated payout splits.',
      'Granular role-based analytics dashboards tracking driver journeys, revenue streams, and occupancy metrics.'
    ]
  }
];

export const RESEARCH_PUBLICATIONS = [
  {
    type: 'Peer-Reviewed Conference Publication (Springer Nature)',
    title: 'Advanced Fake News Detection: A Benchmark Study Using Machine Learning, Deep Learning and Ensemble Methods',
    authors: '3rd Author | ICACCP 2025',
    publisher: 'Springer Nature (Pages 396–406)',
    doi: '10.1007/978-3-032-13555-1_34',
    doiUrl: 'https://doi.org/10.1007/978-3-032-13555-1_34',
    abstract: 'Conducted a rigorous empirical benchmark comparing transformer architectures (BERT, RoBERTa), recurrent neural nets (BiLSTM), and stacked ensemble classifiers to evaluate cross-domain syntactic and semantic veracity detection in linguistic datasets.'
  },
  {
    type: 'Undergraduate Engineering Thesis (IUBAT 2026)',
    title: 'Bangla Sign Language Detection with Machine Learning Multi-Modal Approach',
    authors: 'Krishna Kamol Roy Shuvo & Research Team',
    publisher: 'Department of Computer Science & Engineering, IUBAT',
    doi: 'Vision Transformer (ViT) + CNN-LSTM Late Fusion',
    doiUrl: 'https://github.com/KrishnaKamolRoyShuvo',
    abstract: 'Architected a novel multi-modal dual-stream neural pipeline fusing spatial visual features via Vision Transformer (ViT) with temporal keypoint sequences using CNN-LSTM to accurately classify continuous Bangla sign language gestures.'
  }
];
