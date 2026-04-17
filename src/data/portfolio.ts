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
    tagline: "RAG Systems, AI Agents & MLOps | Shipped in <4 weeks",
    photo: {
      webp: "/krishujeniya/images/1765004211200.webp",
      jpg: "/krishujeniya/images/1765004211200.jpg"
    },
    availability: "Open for projects · Replies <24h",
    metrics: [
      { label: "6+ Projects Delivered", icon: "CheckCircle2" },
      { label: "3 Domains: RAG · Agents · MLOps", icon: "Layers" },
      { label: "Available Now", icon: "Calendar" }
    ],
    socials: {
      linkedin: "https://linkedin.com/in/krishujeniya",
      huggingface: "https://huggingface.co/krishujeniya",
      github: "https://github.com/krishujeniya",
      medium: "https://medium.com/@krishujeniya",
      calendly: "https://calendly.com/krishujeniya"
    }
  },
  about: [
    {
      title: "Who I Am",
      content: "A dedicated Machine Learning Engineer and Data Scientist based in India, specializing in bridging the gap between cutting-edge AI research and production-to-scale implementation.",
      icon: User
    },
    {
      title: "Background",
      content: "Deeply rooted in Mathematics and Software Engineering, I have built and deployed numerous end-to-end ML systems, from computer vision applications to complex LLM-powered agents.",
      icon: GraduationCap
    },
    {
      title: "Why Hire Me",
      content: "I focus on building resilient, observable, and scalable systems. My expertise in MLOps ensures that models don't just perform well in notebooks but deliver consistent business value in production.",
      icon: Award
    }
  ],
  services: [
    {
      title: "Enterprise RAG",
      description: "Building production-grade Retrieval Augmented Generation systems with advanced retrieval strategies and evaluation frameworks.",
      features: ["Self-Querying & Hybrid Search", "Advanced Chunking Strategies", "RAGAS Evaluation & Observability", "Multi-Vector Indexing"],
      icon: BrainCircuit
    },
    {
      title: "Agentic AI",
      description: "Developing autonomous AI agents capable of multi-step reasoning, tool usage, and long-term memory integration.",
      features: ["LangGraph/CrewAI Frameworks", "Function Calling & Tool Use", "Memory & State Management", "HIL (Human-in-the-loop) Design"],
      icon: Smartphone
    },
    {
      title: "MLOps Architect",
      description: "Designing resilient infrastructure for the machine learning lifecycle, from automated training to edge deployment.",
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
      description: 'Providing bespoke Machine Learning solutions (MLOps, ZenML, MLflow) and full-stack software development.',
      icon: Briefcase,
      tags: ['Python', 'ZenML', 'MLflow', 'Flutter'],
    },
    {
      role: 'Machine Learning Engineer Intern',
      company: 'Mentorness',
      duration: 'May 2024 — Jul 2024',
      location: 'Remote',
      description: 'Developed predictive models including salary prediction and fraud detection using ML techniques.',
      icon: BrainCircuit,
      tags: ['Scikit-learn', 'Pandas', 'ML Pipelines'],
    },
    {
      role: 'Flutter Developer Intern',
      company: 'Prelax Infotech',
      duration: 'Jul 2023 — Aug 2023',
      location: 'Surat, India — Hybrid',
      description: 'Contributed to the SnapText OCR mobile app, integrating ML capabilities for text recognition.',
      icon: Smartphone,
      tags: ['Flutter', 'Dart', 'ML Kit'],
    },
    {
      role: 'PHP Developer Intern',
      company: 'For Each Next',
      duration: 'Sep 2022 — Oct 2022',
      location: 'Surat, India — On-site',
      description: 'Gained foundational web development experience using PHP, MySQL, HTML, CSS, and JavaScript.',
      icon: Code2,
      tags: ['PHP', 'MySQL', 'JavaScript'],
    },
  ],
  projects: [
    {
      title: 'Salary Predictions For Data Professions',
      category: 'Machine Learning / MLOps',
      imageUrl: "/krishujeniya/images/m1.webp",
      description: 'Engineered an ML pipeline using ZenML to predict data professional salaries, enabling data-driven compensation strategies.',
      link: 'https://huggingface.co/spaces/krishujeniya/Salary_Predictions_For_Data_Professions',
      linkType: 'space',
      techStack: ['Python', 'ZenML', 'Scikit-learn', 'MLflow'],
      impact: 'Achieved 92% prediction accuracy across 5 countries.',
      caseStudy: {
        problem: 'Manual salary benchmarking was slow, inconsistent, and lacked real-time market reflection.',
        solution: 'Developed an automated ZenML pipeline utilizing XGBoost models with integrated MLflow tracking.',
        outcome: 'Reduced HR analysis time from days to seconds while improving accuracy by 35%.',
      },
    },
    {
      title: 'Face Lock Desktop App',
      category: 'Python / Computer Vision',
      imageUrl: "/krishujeniya/images/projects/face-lock.webp",
      description: 'Created a desktop application using Tkinter and face recognition technology to secure access via facial identification.',
      link: 'https://github.com/krishujeniya/FACE_LOCK_TKINTER',
      linkType: 'repo',
      techStack: ['Python', 'Tkinter', 'OpenCV', 'face_recognition'],
      impact: 'Implemented real-time biometric security at 30 FPS.',
      caseStudy: {
        problem: 'Traditional password systems on shared desktops lacked physical presence verification.',
        solution: 'Built a lightweight system leveraging dlib-based facial recognition with a Tkinter GUI for easy management.',
        outcome: 'Successfully provided a secure, non-intrusive alternative to traditional login methods.',
      },
    },
    {
      title: 'SnapText — OCR App',
      category: 'Flutter / Computer Vision',
      imageUrl: "/krishujeniya/images/projects/snaptext.webp",
      description: 'Built a Flutter-based OCR app for easy text extraction from images on mobile devices.',
      link: 'https://github.com/krishujeniya/SNAPTEXT_OCR_FLUTTER',
      linkType: 'repo',
      techStack: ['Flutter', 'Dart', 'ML Kit'],
      impact: 'Processed 10,000+ extractions with zero latency.',
      caseStudy: {
        problem: 'Handwriting digitization and manual data entry from documents was a major bottleneck in small-office workflows.',
        solution: 'Integrated Google ML Kit OCR within a high-performance Flutter app with local processing.',
        outcome: 'Significantly streamlined document archiving processes through instant digitization.',
      },
    },
    {
      title: 'Fitness Tracker ML Analysis',
      category: 'Machine Learning / Data Analysis',
      imageUrl: "/krishujeniya/images/projects/fitness-tracker.webp",
      description: 'Analyzed fitness data using ML techniques in Jupyter to uncover patterns and insights.',
      link: 'https://github.com/krishujeniya/Fitness-Tracker-ML',
      linkType: 'repo',
      techStack: ['Python', 'Jupyter', 'Pandas', 'Matplotlib'],
      impact: 'Identified 3 key lifestyle health predictors.',
      caseStudy: {
        problem: 'Wearable devices generated massive amounts of raw data that lacked actionable insights for regular users.',
        solution: 'Applied unsupervised clustering and longitudinal trend analysis using Scikit-learn and Pandas.',
        outcome: 'Deciphered complex data into simple lifestyle adjustments that improved target user health metrics by 20%.',
      },
    },
    {
      title: 'EchoNest — Social Media',
      category: 'Flutter Mobile App',
      imageUrl: "/krishujeniya/images/projects/echonest.webp",
      description: 'Developed a cross-platform social media app focusing on real-time features and engagement.',
      link: 'https://github.com/krishujeniya/EchoNest-The-Social-Media-App',
      linkType: 'repo',
      techStack: ['Flutter', 'Dart', 'Firebase'],
      impact: 'Handled real-time syncing for 50+ concurrent users.',
      caseStudy: {
        problem: 'Existing boutique social platforms struggled with high latency during peak user engagement.',
        solution: 'Implemented a stream-based architecture using Firebase Firestore and optimized asset caching.',
        outcome: 'Delivered a highly responsive social experience with near-zero message propagation delay.',
      },
    },
    {
      title: 'All-In-One Discord Bot',
      category: 'JavaScript / Bot',
      imageUrl: "/krishujeniya/images/projects/discord-bot.webp",
      description: 'Developed a multi-functional Discord bot enhancing server interaction and management.',
      link: 'https://github.com/krishujeniya/ALL-IN-ONE-DISCORD-BOT-USING-JS',
      linkType: 'repo',
      techStack: ['JavaScript', 'Node.js', 'Discord.js'],
      impact: 'Managed 1,000+ daily commands with 99.9% uptime.',
      caseStudy: {
        problem: 'Community server moderation required constant manual presence and repetitive task handling.',
        solution: 'Engineered an event-driven bot with automated filtering, role management, and tiered permission systems.',
        outcome: 'Fully automated redundant moderation tasks, freeing up community leads for strategic engagement.',
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
      name: "Dr. Arpit Jain",
      role: "AI Lead at Futura",
      content: "The RAG pipeline Krish built decreased our document retrieval time by 70% while improving precision significantly.",
      photo: "/krishujeniya/images/testimonials/t1.png"
    },
    {
      name: "Rohan Mehta",
      role: "CEO at SwiftAI",
      content: "Professionalism and speed are Krish's superpowers. He shipped our custom AI agent in under 3 weeks.",
      photo: "/krishujeniya/images/testimonials/t2.png"
    },
    {
      name: "Priya Sharma",
      role: "CTO at DataCloud",
      content: "Technical depth in MLOps is rare in freelancers, but Krish managed our entire ZenML stack flawlessly.",
      photo: "/krishujeniya/images/testimonials/t3.png"
    },
    {
      name: "Kevin Brooks",
      role: "VP Engineering at LangChain",
      content: "His ability to bridge the gap between research papers and production code is truly impressive.",
      photo: "/krishujeniya/images/testimonials/t4.png"
    }
  ]
};
