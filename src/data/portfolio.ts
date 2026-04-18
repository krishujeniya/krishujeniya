import { 
  Award, 
  Database, 
  Shield, 
  Cloud, 
  GitBranch, 
  Megaphone, 
  Link2, 
  BrainCircuit, 
  Briefcase, 
  Smartphone, 
  Code2,
  User,
  GraduationCap
} from 'lucide-react';

export const portfolioData = {
  profile: {
    name: "Krish Ujeniya",
    role: "Freelance ML Engineer",
    tagline: "I build RAG systems, AI agents, and MLOps pipelines that actually make it to production — typically in under 4 weeks.",
    photo: {
      webp: "/krishujeniya/images/1765004211200.webp",
      jpg: "/krishujeniya/images/1765004211200.jpg"
    },
    availability: "Open for projects · Replies <24h",
    metrics: [
      { label: "< 4 Weeks — Fastest full system delivered", icon: "CheckCircle2" },
      { label: "3 Domains — RAG · Agents · MLOps", icon: "Layers" },
      { label: "Production Only — Every system ships live", icon: "Calendar" }
    ],
    socials: {
      linkedin: "https://linkedin.com/in/krishujeniya",
      huggingface: "https://huggingface.co/krishujeniya",
      github: "https://github.com/krishujeniya",
      medium: "https://medium.com/@krishujeniya",
      calendar: "https://calendar.app.google/FaaoY3w8L8TYLNr48"
    }
  },
  about: [
    {
      title: "My Approach",
      content: "I treat every ML system like infrastructure, not a science experiment. That means drift detection, failure fallbacks, cost guardrails, and clean documentation — so your team owns it long after our engagement ends.",
      icon: User
    },
    {
      title: "Where I Come From",
      content: "Mathematics and software engineering background. I've shipped computer vision pipelines, on-device OCR apps, multi-agent systems, and enterprise RAG architectures — both solo and embedded with product teams.",
      icon: GraduationCap
    },
    {
      title: "What You Actually Get",
      content: "Weekly demos, clear communication, and no disappearing after deployment. You get a documented, monitored, maintainable system — with observability baked in from day one. Reliability isn't a premium add-on. It's the baseline.",
      icon: Award
    }
  ],
  services: [
    {
      title: "Enterprise RAG",
      description: "Your team shouldn't spend hours hunting through scattered documents and getting wrong answers. I build RAG systems with hybrid search, reranking, and evaluation built in — so the right answer surfaces in seconds, not hours.",
      features: ["Self-Querying & Hybrid Search", "Advanced Chunking Strategies", "RAGAS Evaluation & Observability", "Multi-Vector Indexing"],
      icon: BrainCircuit
    },
    {
      title: "Agentic AI",
      description: "From internal research assistants to customer-facing automation — I build multi-agent systems that handle complex workflows while keeping humans in the loop where it matters. Monitored, production-deployed, with proper safeguards.",
      features: ["LangGraph/CrewAI Frameworks", "Function Calling & Tool Use", "Memory & State Management", "HIL (Human-in-the-loop) Design"],
      icon: Smartphone
    },
    {
      title: "MLOps Architect",
      description: "Models that only work in notebooks don't generate revenue. I build the full ML lifecycle — reproducible pipelines, experiment tracking, drift detection, and CI/CD for ML — so your models stay accurate long after go-live.",
      features: ["CI/CD for Machine Learning", "ZenML/MLflow Infrastructure", "Model Monitoring & Drift Detection", "Kubernetes/Cloud Orchestration"],
      icon: Database
    }
  ],
  experience: [
    {
      role: 'Freelance ML & Software Engineer',
      company: 'Self-Employed',
      duration: '2023 — Present',
      location: 'Remote',
      description: 'Ship production-ready ML systems for startups and engineering teams — RAG pipelines, autonomous agents, and MLOps infrastructure. Every project includes monitoring, documentation, and full handover.',
      icon: Briefcase,
      tags: ['Python', 'ZenML', 'MLflow', 'Flutter'],
    },
    {
      role: 'Machine Learning Engineer Intern',
      company: 'Mentorness',
      duration: 'May 2024 — Jul 2024',
      location: 'Remote',
      description: 'Built production-ready salary prediction and fraud detection models using scikit-learn pipelines — from feature engineering through evaluation and deployment.',
      icon: BrainCircuit,
      tags: ['Scikit-learn', 'Pandas', 'ML Pipelines'],
    },
    {
      role: 'Flutter Developer Intern',
      company: 'Prelax Infotech',
      duration: 'Jul 2023 — Aug 2023',
      location: 'Surat, India — Hybrid',
      description: 'Built the ML integration layer for SnapText, an on-device OCR app — enabling real-time text extraction without cloud dependency.',
      icon: Smartphone,
      tags: ['Flutter', 'Dart', 'ML Kit'],
    },
    {
      role: 'PHP Developer Intern',
      company: 'For Each Next',
      duration: 'Sep 2022 — Oct 2022',
      location: 'Surat, India — On-site',
      description: 'Built full-stack web modules using PHP, MySQL, and JavaScript — foundational engineering experience that shaped my approach to production systems.',
      icon: Code2,
      tags: ['PHP', 'MySQL', 'JavaScript'],
    },
  ],
  projects: [
    {
      title: 'Salary Predictions For Data Professions',
      category: 'Machine Learning / MLOps',
      imageUrl: "/krishujeniya/images/m1.webp",
      description: 'End-to-end ML pipeline that predicts data professional salaries across 5 countries — replacing spreadsheet guesswork with a reproducible, tracked system.',
      link: 'https://huggingface.co/spaces/krishujeniya/Salary_Predictions_For_Data_Professions',
      linkType: 'space',
      techStack: ['Python', 'ZenML', 'Scikit-learn', 'MLflow'],
      impact: '92% prediction accuracy. Fully reproducible pipeline, zero manual steps.',
      caseStudy: {
        problem: 'Compensation teams were making offers based on gut feel and outdated surveys. No internal model existed to benchmark against actual market data — leading to mis-hires and wasted budget.',
        solution: 'Designed a ZenML pipeline from raw data through feature engineering, model training, and MLflow experiment tracking — deployed as a FastAPI endpoint teams could query directly.',
        outcome: '92% prediction accuracy. HR analysis went from days of spreadsheet work to a single API call.',
      },
    },
    {
      title: 'Face Lock Desktop App',
      category: 'Python / Computer Vision',
      imageUrl: "/krishujeniya/images/projects/face-lock.webp",
      description: 'Lightweight desktop security app — offline face recognition with zero cloud dependency. Sub-second unlock, handles lighting variance gracefully.',
      link: 'https://github.com/krishujeniya/FACE_LOCK_TKINTER',
      linkType: 'repo',
      techStack: ['Python', 'Tkinter', 'OpenCV', 'face_recognition'],
      impact: 'Sub-200ms recognition. 98%+ accuracy under varied lighting. Fully air-gapped.',
      caseStudy: {
        problem: 'Shared desktops needed physical presence verification. Existing solutions were either cloud-dependent (latency + privacy risk) or required expensive hardware.',
        solution: 'Built a locally-running face recognition system using dlib and OpenCV with a clean Tkinter interface. No internet required, no external API costs.',
        outcome: 'Sub-200ms recognition time on standard hardware. 98%+ accuracy under varied lighting. Zero external dependencies.',
      },
    },
    {
      title: 'SnapText — OCR App',
      category: 'Flutter / Computer Vision',
      imageUrl: "/krishujeniya/images/projects/snaptext.webp",
      description: 'On-device OCR app built with Flutter — extracts text from photos in under 2 seconds without sending anything to a server.',
      link: 'https://github.com/krishujeniya/SNAPTEXT_OCR_FLUTTER',
      linkType: 'repo',
      techStack: ['Flutter', 'Dart', 'ML Kit'],
      impact: '< 2 second extraction on mid-range Android. 95%+ accuracy. Zero server costs.',
      caseStudy: {
        problem: 'Mobile users needed fast, reliable text capture from physical documents — receipts, labels, notes — without shipping images to external servers.',
        solution: 'Integrated ML Kit\'s on-device text recognition in Flutter. Entire inference pipeline runs locally — no network calls, no API costs, no privacy concerns.',
        outcome: 'Under 2 second full text extraction. 95%+ accuracy on printed text. Zero server costs — 100% on-device.',
      },
    },
    {
      title: 'Fitness Tracker ML Analysis',
      category: 'Machine Learning / Data Analysis',
      imageUrl: "/krishujeniya/images/projects/fitness-tracker.webp",
      description: 'ML-driven analysis of wearable fitness data — turning raw sensor readings into actionable health insights using clustering and trend analysis.',
      link: 'https://github.com/krishujeniya/Fitness-Tracker-ML',
      linkType: 'repo',
      techStack: ['Python', 'Jupyter', 'Pandas', 'Matplotlib'],
      impact: 'Identified 3 key lifestyle predictors. Target metrics improved 20%.',
      caseStudy: {
        problem: 'Wearable devices generated massive raw data but offered no actionable interpretation. Users couldn\'t tell what actually mattered.',
        solution: 'Applied unsupervised clustering and longitudinal trend analysis to surface the patterns that correlated with real health improvements.',
        outcome: 'Identified 3 key lifestyle predictors. Translated complex data into simple adjustments that improved target metrics by 20%.',
      },
    },
    {
      title: 'EchoNest — Social Media',
      category: 'Flutter Mobile App',
      imageUrl: "/krishujeniya/images/projects/echonest.webp",
      description: 'Cross-platform social media app with real-time messaging, feed sync, and optimized asset delivery — built for responsive community engagement.',
      link: 'https://github.com/krishujeniya/EchoNest-The-Social-Media-App',
      linkType: 'repo',
      techStack: ['Flutter', 'Dart', 'Firebase'],
      impact: 'Near-zero message delay. 50+ concurrent users with consistent responsiveness.',
      caseStudy: {
        problem: 'Small social platforms struggled with high latency during peak engagement — messages delayed, feeds stale, users leaving.',
        solution: 'Stream-based architecture using Firebase Firestore with aggressive asset caching and optimistic UI updates.',
        outcome: 'Near-zero message propagation delay. Handled 50+ concurrent users with consistent responsiveness.',
      },
    },
    {
      title: 'All-In-One Discord Bot',
      category: 'JavaScript / Bot',
      imageUrl: "/krishujeniya/images/projects/discord-bot.webp",
      description: 'Multi-function Discord bot handling moderation, role management, and community automation — 1,000+ daily commands at 99.9% uptime.',
      link: 'https://github.com/krishujeniya/ALL-IN-ONE-DISCORD-BOT-USING-JS',
      linkType: 'repo',
      techStack: ['JavaScript', 'Node.js', 'Discord.js'],
      impact: '1,000+ daily commands. 99.9% uptime. Zero manual moderation needed.',
      caseStudy: {
        problem: 'Community servers needed constant manual moderation — repetitive tasks, role assignments, and content filtering eating up volunteer time.',
        solution: 'Event-driven bot with automated content filtering, tiered permissions, and scheduled community management workflows.',
        outcome: 'Fully automated redundant moderation. Community leads freed up for strategic engagement instead of manual housekeeping.',
      },
    },
  ],
  documents: [
    {
      name: 'Certificates',
      path: 'Certificates',
      icon: Award,
      description: 'Industry-recognized certifications in AI, ML, NLP and more.',
      files: [
        { name: 'GenAI.jpeg', type: 'JPEG' },
        { name: 'ChatGPT.pdf', type: 'PDF' },
        { name: 'FDM Certificate.pdf', type: 'PDF' },
        { name: 'FLASK UDEMY.pdf', type: 'PDF' },
        { name: 'ai.pdf', type: 'PDF' },
        { name: 'deep learning .pdf', type: 'PDF' },
        { name: 'ml.pdf', type: 'PDF' },
        { name: 'nlp.pdf', type: 'PDF' },
        { name: 'python.pdf', type: 'PDF' },
      ],
    },
    {
      name: 'MLOps',
      path: 'MLOps',
      icon: BrainCircuit,
      description: 'Machine Learning operations, DSA, NLP, and Neural Networks resources.',
      files: [
        { name: 'AI_info.pdf', type: 'PDF' },
        { name: 'ML_info.pdf', type: 'PDF' },
        { name: 'NLP_info.pdf', type: 'PDF' },
        { name: 'NeuralNetworks_info.pdf', type: 'PDF' },
        { name: 'OOPs_in_python.pdf', type: 'PDF' },
        { name: 'ML/Introduction_ML.pdf', type: 'PDF' },
        { name: 'ML/Supervised_Learning.pdf', type: 'PDF' },
        { name: 'ML/Unsupervised_Learning.pdf', type: 'PDF' },
        { name: 'ML/Preparing_Model.pdf', type: 'PDF' },
        { name: 'ML/Modeling_Evaluation.pdf', type: 'PDF' },
        { name: 'ML/Python_Lib_ML.pdf', type: 'PDF' },
        { name: 'DSA/Basic_of_DSA.pdf', type: 'PDF' },
        { name: 'DSA/Linked_Lists.pdf', type: 'PDF' },
        { name: 'DSA/Stack_Queue.pdf', type: 'PDF' },
        { name: 'DSA/Trees.pdf', type: 'PDF' },
        { name: 'DSA/Searching_Sorting_001.pdf', type: 'PDF' },
        { name: 'DSA/Searching_Sorting_002.pdf', type: 'PDF' },
      ],
    },
    {
      name: 'Cloud',
      path: 'Cloud',
      icon: Cloud,
      description: 'Cloud computing, security, virtualization, and data center guides.',
      files: [
        { name: 'Overview_Cloud.pdf', type: 'PDF' },
        { name: 'Intro_Cloud_Computing.pdf', type: 'PDF' },
        { name: 'Cloud_Security_and_Compliance.pdf', type: 'PDF' },
        { name: 'Cloud_Storage_and_Database_Services.pdf', type: 'PDF' },
        { name: 'Data_Center_Architecture.pdf', type: 'PDF' },
        { name: 'Emerging_Technologies_with_Cloud_Computing.pdf', type: 'PDF' },
        { name: 'Virtualization_Hypervisors.pdf', type: 'PDF' },
      ],
    },
    {
      name: 'CyberSecurity',
      path: 'CyberSecurity',
      icon: Shield,
      description: 'Cryptography, ethical hacking, network security, and forensics.',
      files: [
        { name: 'Overview_CS.pdf', type: 'PDF' },
        { name: 'Cryptography.pdf', type: 'PDF' },
        { name: 'Ethical_Hacking_Data_Forensics.pdf', type: 'PDF' },
        { name: 'Network_Crime_Security.pdf', type: 'PDF' },
      ],
    },
    {
      name: 'DBMS',
      path: 'DBMS',
      icon: Database,
      description: 'Database management — SQL, normalization, ER diagrams, and transactions.',
      files: [
        { name: 'Overview_DBMS.pdf', type: 'PDF' },
        { name: 'Introduction.pptx', type: 'PPTX' },
        { name: 'ER_Diagrams.ppt', type: 'PPT' },
        { name: 'SQL_Commands.ppt', type: 'PPT' },
        { name: 'Constraints.ppt', type: 'PPT' },
        { name: 'Operators_Joins.pptx', type: 'PPTX' },
        { name: 'Normalization .ppt', type: 'PPT' },
        { name: 'Transaction_Management.pdf', type: 'PDF' },
        { name: 'DBMS_by_leaf_notes.pdf', type: 'PDF' },
      ],
    },
    {
      name: 'DevOps',
      path: 'DevOps',
      icon: GitBranch,
      description: 'Software development lifecycle, Agile, SRS, and risk management.',
      files: [
        { name: 'Overview_SD.pdf', type: 'PDF' },
        { name: 'About_Software_Development.pdf', type: 'PDF' },
        { name: 'SDLC.pptx', type: 'PPTX' },
        { name: 'Aglie.pptx', type: 'PPTX' },
        { name: 'SRS.pptx', type: 'PPTX' },
        { name: 'Risk_Management.pptx', type: 'PPTX' },
        { name: 'Software_Design.pdf', type: 'PDF' },
        { name: 'Software_Coding_and_Testing.pdf', type: 'PDF' },
        { name: 'Software_Life_cycle_models.pdf', type: 'PDF' },
      ],
    },
    {
      name: 'BlockChain',
      path: 'BlockChain',
      icon: Link2,
      description: 'Introduction to blockchain technology and distributed ledger concepts.',
      files: [
        { name: 'Intro_BlockChain.pdf', type: 'PDF' },
      ],
    },
    {
      name: 'Digital Marketing',
      path: 'DigitalMarketing',
      icon: Megaphone,
      description: 'Digital marketing strategy, entrepreneurship, and GPT prompting guides.',
      files: [
        { name: 'Overview_DM.pdf', type: 'PDF' },
        { name: 'Gpt_001.pdf', type: 'PDF' },
        { name: 'Gpt_002.pdf', type: 'PDF' },
        { name: 'Entrepreneurship/Overview_Entrepreneurship.pdf', type: 'PDF' },
        { name: 'Entrepreneurship/Gpt_001.pdf', type: 'PDF' },
        { name: 'Entrepreneurship/Gpt_002_1.pdf', type: 'PDF' },
        { name: 'Entrepreneurship/Gpt_002_2.pdf', type: 'PDF' },
        { name: 'Entrepreneurship/Gpt_003.pdf', type: 'PDF' },
      ],
    },
  ],
  testimonials: [
    {
      name: "NDA Client",
      role: "CTO, Series-A Startup",
      content: "Krish delivered a production RAG system in under 3 weeks. The handover documentation was thorough enough that our junior engineer could maintain it independently.",
      photo: "/krishujeniya/images/testimonials/t1.webp"
    },
    {
      name: "NDA Client",
      role: "Engineering Lead, Data Platform",
      content: "His MLOps setup saved us from what would have been weeks of manual pipeline work. Everything was tracked, versioned, and reproducible from day one.",
      photo: "/krishujeniya/images/testimonials/t2.webp"
    }
  ]
};
