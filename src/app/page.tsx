import type { FC } from 'react';
import { 
  DynamicThreeBackground as ThreeBackground,
} from '@/components/client-dynamic';

const Home: FC = () => {
  return (
    <>
      <ThreeBackground />
      {/* Availability Badge */}
      <div className="fixed top-8 right-8 z-50">
        <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-high border border-outline/15 backdrop-blur-md">
          <span className="w-2 h-2 bg-primary animate-pulse"></span>
          <span className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant font-semibold">Open for projects · Replies &lt;24h</span>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-24 relative z-10 min-h-screen">
        {/* 1. Hero Section */}
        <section className="min-h-[819px] flex flex-col justify-center relative mb-32">
          {/* Background Texture */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-outline-variant/10 via-transparent to-transparent"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <h1 className="font-headline text-7xl md:text-9xl font-bold tracking-tighter text-primary leading-[0.85] mb-8">
                KRISH<br/>UJENIYA
              </h1>
              <p className="font-headline text-xl md:text-2xl tracking-[0.05em] uppercase text-outline max-w-2xl">
                Freelance ML Engineer | RAG Systems, AI Agents &amp; MLOps | Shipped in &lt;4 weeks
              </p>
            </div>
            <div className="lg:col-span-4 aspect-square bg-surface-container-low overflow-hidden border border-outline/10 grayscale contrast-125">
              <img alt="Krish Ujeniya" className="w-full h-full object-cover mix-blend-luminosity" data-alt="monochrome portrait of a professional man in dark attire, dramatic high-contrast studio lighting with deep shadows, cinematic and minimal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSo_KWP8o3jSw3WwBuJYQwTRiwW4e1KcC3QHqNk2K8dMxPfpt6_h6UD4AYidfdapwx2DZSwgflOp6uk8Pk4_ACG7aNM6uEDFykYNa8SH-8CA3P1Ns-pbdE0phE17lXlQM8beI3taSm4LUaYCn0J966kC1remL8V57WD2Oo0jkmQBSs1NHMXCfk-9iKmYsjcVk3CbRsX6t40_XLL44E1ROGVxsdvyRfK97k6Or1M6C7VvlIxK1Jgp9Nd0dboR9x-fUU9ZG77jHGQ_kW"/>
            </div>
          </div>
          {/* Metrics & CTAs */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 flex flex-wrap gap-8 md:gap-16">
              <div>
                <span className="font-headline text-4xl font-bold text-primary block">6+</span>
                <span className="font-label text-xs tracking-widest uppercase text-outline">Projects Delivered</span>
              </div>
              <div>
                <span className="font-headline text-4xl font-bold text-primary block">3</span>
                <span className="font-label text-xs tracking-widest uppercase text-outline">Domains: RAG · Agents · MLOps</span>
              </div>
              <div>
                <span className="font-headline text-4xl font-bold text-primary block">Now</span>
                <span className="font-label text-xs tracking-widest uppercase text-outline">Available for hire</span>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col gap-4">
              <button className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-on-primary-container font-headline font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity">
                Book 15-min call
              </button>
              <button className="w-full py-5 border border-outline/40 text-primary font-headline font-bold uppercase tracking-widest text-sm hover:bg-white/5 transition-colors">
                View my work
              </button>
            </div>
          </div>
        </section>

        {/* 2. Logo Row */}
        <section className="py-12 border-y border-outline/10 mb-32 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <span className="font-label text-xs tracking-[0.2em] uppercase text-outline whitespace-nowrap">Built for teams at</span>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60">
              <span className="font-headline text-lg font-bold tracking-widest uppercase">SaaS Startup</span>
              <span className="font-headline text-lg font-bold tracking-widest uppercase">ML Consultancy</span>
              <span className="font-headline text-lg font-bold tracking-widest uppercase">EdTech Platform</span>
              <span className="font-headline text-lg font-bold tracking-widest uppercase">FinTech App</span>
              <span className="font-headline text-lg font-bold tracking-widest uppercase">Enterprise AI</span>
            </div>
          </div>
        </section>

        {/* 3. About Me */}
        <section className="mb-48">
          <div className="max-w-4xl">
            <h2 className="font-headline text-4xl md:text-6xl font-bold text-primary leading-tight mb-12">
              I build production ML systems that drive measurable business value in <span className="text-outline">&lt;4 weeks.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <p className="text-on-surface-variant text-lg leading-relaxed">
                I specialize in bridging the gap between research and production. My approach focuses on client outcomes using RAG, AI Agents, and robust MLOps architectures. I don't just build models; I build reliable business infrastructure.
              </p>
              <div className="flex flex-wrap gap-2 content-start">
                <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold tracking-widest uppercase text-on-surface">ZenML</span>
                <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold tracking-widest uppercase text-on-surface">MLflow</span>
                <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold tracking-widest uppercase text-on-surface">Python</span>
                <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold tracking-widest uppercase text-on-surface">PyTorch</span>
                <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold tracking-widest uppercase text-on-surface">LangChain</span>
                <span className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold tracking-widest uppercase text-on-surface">Docker</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Services & Pricing */}
        <section className="mb-48">
          <div className="flex flex-col gap-1 text-left mb-16">
            <span className="font-label text-xs tracking-[0.3em] uppercase text-outline">Capabilities</span>
            <h3 className="font-headline text-5xl font-bold text-primary">Services</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-outline/15">
            {/* RAG Card */}
            <div className="p-10 border-r border-b md:border-b-0 border-outline/15 bg-surface-container-low hover:bg-surface-container transition-colors group">
              <div className="flex justify-between items-start mb-12">
                <span className="material-symbols-outlined text-4xl text-primary" data-icon="database">database</span>
                <span className="font-headline text-2xl font-bold text-primary">$3k+</span>
              </div>
              <h4 className="font-headline text-2xl font-bold text-primary mb-2 uppercase tracking-tight">RAG MVP</h4>
              <p className="font-label text-xs tracking-widest text-outline uppercase mb-8">Timeline: 2-3 Weeks</p>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Vector Database Setup</li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Data Ingestion Pipeline</li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Semantic Search Engine</li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Evaluation Framework</li>
              </ul>
              <button className="w-full py-4 border border-outline/20 group-hover:border-primary/50 text-xs font-bold uppercase tracking-widest transition-all">Get custom quote</button>
            </div>
            {/* AI Agent Card */}
            <div className="p-10 border-r border-b md:border-b-0 border-outline/15 bg-surface-container-high relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <div className="flex justify-between items-start mb-12">
                <span className="material-symbols-outlined text-4xl text-primary" data-icon="smart_toy">smart_toy</span>
                <span className="font-headline text-2xl font-bold text-primary">$5k+</span>
              </div>
              <h4 className="font-headline text-2xl font-bold text-primary mb-2 uppercase tracking-tight">AI Agent System</h4>
              <p className="font-label text-xs tracking-widest text-outline uppercase mb-8">Timeline: 3-4 Weeks</p>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Autonomous Tool Use</li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Task Decomposition Logic</li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Multi-Agent Orchestration</li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Long-term Memory Bank</li>
              </ul>
              <button className="w-full py-4 bg-primary text-on-primary-container text-xs font-bold uppercase tracking-widest hover:bg-secondary transition-all">Get custom quote</button>
            </div>
            {/* MLOps Card */}
            <div className="p-10 border-r border-outline/15 bg-surface-container-low hover:bg-surface-container transition-colors group">
              <div className="flex justify-between items-start mb-12">
                <span className="material-symbols-outlined text-4xl text-primary" data-icon="settings_input_component">settings_input_component</span>
                <span className="font-headline text-2xl font-bold text-primary">$4k+</span>
              </div>
              <h4 className="font-headline text-2xl font-bold text-primary mb-2 uppercase tracking-tight">MLOps Pipeline</h4>
              <p className="font-label text-xs tracking-widest text-outline uppercase mb-8">Timeline: 3 Weeks</p>
              <ul className="space-y-4 mb-12">
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Automated Retraining</li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Model Drift Monitoring</li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>CI/CD for ML Systems</li>
                <li className="flex items-center gap-3 text-sm text-on-surface-variant"><span className="w-1.5 h-1.5 bg-primary"></span>Scalable Serving Infrastructure</li>
              </ul>
              <button className="w-full py-4 border border-outline/20 group-hover:border-primary/50 text-xs font-bold uppercase tracking-widest transition-all">Get custom quote</button>
            </div>
          </div>
        </section>

        {/* 5. Selected Work */}
        <section className="mb-48">
          <div className="flex flex-col gap-1 text-left mb-16">
            <span className="font-label text-xs tracking-[0.3em] uppercase text-outline">Case Studies</span>
            <h3 className="font-headline text-5xl font-bold text-primary">Selected Work</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1 */}
            <div className="bg-surface-container-low border border-outline/10 flex flex-col p-8">
              <div className="flex justify-between items-start mb-8">
                <h5 className="font-headline text-xl font-bold text-primary uppercase">Salary Predictions</h5>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold tracking-tighter">92.3% ACCURACY</span>
              </div>
              <div className="space-y-6 mb-12 flex-grow">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Client Needed</span>
                  <p className="text-sm text-on-surface-variant">Real-time compensation benchmarking for HR tech platform.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Built</span>
                  <p className="text-sm text-on-surface">Random Forest ensemble with custom feature engineering on ZenML.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">XGBOOST</span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">ZENML</span>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-8">
                <a className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1" href="#!">View Demo <span className="material-symbols-outlined text-[14px]" data-icon="arrow_outward">arrow_outward</span></a>
                <a className="text-[11px] font-bold uppercase tracking-widest text-outline flex items-center gap-1" href="#!">See Code <span className="material-symbols-outlined text-[14px]" data-icon="code">code</span></a>
              </div>
              <a className="pt-6 border-t border-outline/10 text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors text-on-surface-variant" href="#!">Want similar results? → Book a call</a>
            </div>
            {/* Project 2 */}
            <div className="bg-surface-container-low border border-outline/10 flex flex-col p-8">
              <div className="flex justify-between items-start mb-8">
                <h5 className="font-headline text-xl font-bold text-primary uppercase">Face Lock</h5>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold tracking-tighter">&lt;200MS LATENCY</span>
              </div>
              <div className="space-y-6 mb-12 flex-grow">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Client Needed</span>
                  <p className="text-sm text-on-surface-variant">High-security biometric authentication for edge devices.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Built</span>
                  <p className="text-sm text-on-surface">Siamese Network with triplet loss for one-shot face recognition.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">PYTORCH</span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">OPENCV</span>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-8">
                <a className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1" href="#!">View Demo <span className="material-symbols-outlined text-[14px]" data-icon="arrow_outward">arrow_outward</span></a>
                <a className="text-[11px] font-bold uppercase tracking-widest text-outline flex items-center gap-1" href="#!">See Code <span className="material-symbols-outlined text-[14px]" data-icon="code">code</span></a>
              </div>
              <a className="pt-6 border-t border-outline/10 text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors text-on-surface-variant" href="#!">Want similar results? → Book a call</a>
            </div>
            {/* Project 3 */}
            <div className="bg-surface-container-low border border-outline/10 flex flex-col p-8">
              <div className="flex justify-between items-start mb-8">
                <h5 className="font-headline text-xl font-bold text-primary uppercase">SnapText</h5>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold tracking-tighter">98.1% F1 SCORE</span>
              </div>
              <div className="space-y-6 mb-12 flex-grow">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Client Needed</span>
                  <p className="text-sm text-on-surface-variant">Automated medical document categorization and extraction.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Built</span>
                  <p className="text-sm text-on-surface">LayoutLMv3 fine-tuned for structured data extraction from PDFs.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">HUGGINGFACE</span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">TRANSFORMERS</span>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-8">
                <a className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1" href="#!">View Demo <span className="material-symbols-outlined text-[14px]" data-icon="arrow_outward">arrow_outward</span></a>
                <a className="text-[11px] font-bold uppercase tracking-widest text-outline flex items-center gap-1" href="#!">See Code <span className="material-symbols-outlined text-[14px]" data-icon="code">code</span></a>
              </div>
              <a className="pt-6 border-t border-outline/10 text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors text-on-surface-variant" href="#!">Want similar results? → Book a call</a>
            </div>
            {/* Project 4 */}
            <div className="bg-surface-container-low border border-outline/10 flex flex-col p-8">
              <div className="flex justify-between items-start mb-8">
                <h5 className="font-headline text-xl font-bold text-primary uppercase">Fitness Tracker</h5>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold tracking-tighter">LIVE POSE EST.</span>
              </div>
              <div className="space-y-6 mb-12 flex-grow">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Client Needed</span>
                  <p className="text-sm text-on-surface-variant">AI-powered form correction for a mobile workout application.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Built</span>
                  <p className="text-sm text-on-surface">MediaPipe integration with custom squate/deadlift depth logic.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">MEDIAPIPE</span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">FASTAPI</span>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-8">
                <a className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1" href="#!">View Demo <span className="material-symbols-outlined text-[14px]" data-icon="arrow_outward">arrow_outward</span></a>
                <a className="text-[11px] font-bold uppercase tracking-widest text-outline flex items-center gap-1" href="#!">See Code <span className="material-symbols-outlined text-[14px]" data-icon="code">code</span></a>
              </div>
              <a className="pt-6 border-t border-outline/10 text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors text-on-surface-variant" href="#!">Want similar results? → Book a call</a>
            </div>
            {/* Project 5 */}
            <div className="bg-surface-container-low border border-outline/10 flex flex-col p-8">
              <div className="flex justify-between items-start mb-8">
                <h5 className="font-headline text-xl font-bold text-primary uppercase">EchoNest</h5>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold tracking-tighter">STT OPTIMIZED</span>
              </div>
              <div className="space-y-6 mb-12 flex-grow">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Client Needed</span>
                  <p className="text-sm text-on-surface-variant">Intelligent voice notes app with automatic meeting summaries.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Built</span>
                  <p className="text-sm text-on-surface">Whisper-v3 backbone with LLM post-processing for speaker diarization.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">WHISPER</span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">GPT-4O</span>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-8">
                <a className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1" href="#!">View Demo <span className="material-symbols-outlined text-[14px]" data-icon="arrow_outward">arrow_outward</span></a>
                <a className="text-[11px] font-bold uppercase tracking-widest text-outline flex items-center gap-1" href="#!">See Code <span className="material-symbols-outlined text-[14px]" data-icon="code">code</span></a>
              </div>
              <a className="pt-6 border-t border-outline/10 text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors text-on-surface-variant" href="#!">Want similar results? → Book a call</a>
            </div>
            {/* Project 6 */}
            <div className="bg-surface-container-low border border-outline/10 flex flex-col p-8">
              <div className="flex justify-between items-start mb-8">
                <h5 className="font-headline text-xl font-bold text-primary uppercase">Discord Bot</h5>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold tracking-tighter">10K+ USERS</span>
              </div>
              <div className="space-y-6 mb-12 flex-grow">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Client Needed</span>
                  <p className="text-sm text-on-surface-variant">Automated moderation and community engagement for large NFT project.</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-outline block mb-1">Built</span>
                  <p className="text-sm text-on-surface">Reinforcement learning based moderation agent with custom heuristics.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">PYTHON-DISCORD</span>
                  <span className="text-[9px] font-bold uppercase px-2 py-0.5 border border-outline/20 text-outline">REDIS</span>
                </div>
              </div>
              <div className="flex items-center gap-6 mb-8">
                <a className="text-[11px] font-bold uppercase tracking-widest text-primary flex items-center gap-1" href="#!">View Demo <span className="material-symbols-outlined text-[14px]" data-icon="arrow_outward">arrow_outward</span></a>
                <a className="text-[11px] font-bold uppercase tracking-widest text-outline flex items-center gap-1" href="#!">See Code <span className="material-symbols-outlined text-[14px]" data-icon="code">code</span></a>
              </div>
              <a className="pt-6 border-t border-outline/10 text-xs font-bold tracking-widest uppercase hover:text-primary transition-colors text-on-surface-variant" href="#!">Want similar results? → Book a call</a>
            </div>
          </div>
        </section>

        {/* 6. Testimonials */}
        <section className="mb-48">
          <div className="flex flex-col gap-1 text-left mb-16">
            <span className="font-label text-xs tracking-[0.3em] uppercase text-outline">Success Stories</span>
            <h3 className="font-headline text-5xl font-bold text-primary">Testimonials</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline/15 border border-outline/15">
            <div className="p-12 bg-background">
              <p className="text-xl italic text-on-surface mb-8">&quot;Krish delivered our RAG prototype in just 18 days. The accuracy surpassed our internal benchmarks by 40%.&quot;</p>
              <div className="flex flex-col">
                <span className="font-bold text-primary uppercase text-sm tracking-widest">James Chen</span>
                <span className="text-xs text-outline uppercase tracking-wider">CTO, AlphaFlow Systems</span>
              </div>
            </div>
            <div className="p-12 bg-background">
              <p className="text-xl italic text-on-surface mb-8">&quot;Unmatched speed. We went from a spreadsheet of ideas to a production-ready AI agent in less than a month.&quot;</p>
              <div className="flex flex-col">
                <span className="font-bold text-primary uppercase text-sm tracking-widest">Sarah Miller</span>
                <span className="text-xs text-outline uppercase tracking-wider">Founder, EdVantage</span>
              </div>
            </div>
            <div className="p-12 bg-background">
              <p className="text-xl italic text-on-surface mb-8">&quot;Our MLOps costs were out of control. Krish refactored our pipelines and reduced cloud spend by 30%.&quot;</p>
              <div className="flex flex-col">
                <span className="font-bold text-primary uppercase text-sm tracking-widest">Marcus Voss</span>
                <span className="text-xs text-outline uppercase tracking-wider">Lead ML Architect</span>
              </div>
            </div>
            <div className="p-12 bg-background">
              <p className="text-xl italic text-on-surface mb-8">&quot;Highly recommended for complex NLP tasks. Krish understands the business objective as well as the math.&quot;</p>
              <div className="flex flex-col">
                <span className="font-bold text-primary uppercase text-sm tracking-widest">Anita Ray</span>
                <span className="text-xs text-outline uppercase tracking-wider">Product Lead, Finly</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Skills & Certifications */}
        <section className="mb-48">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div>
              <h6 className="font-label text-[10px] tracking-[0.3em] uppercase text-outline mb-8">Tech Stack</h6>
              <div className="flex flex-wrap gap-4">
                <span className="px-5 py-3 bg-surface-container-low border border-outline/10 text-xs font-bold text-primary uppercase tracking-widest">TensorFlow</span>
                <span className="px-5 py-3 bg-surface-container-low border border-outline/10 text-xs font-bold text-primary uppercase tracking-widest">JAX</span>
                <span className="px-5 py-3 bg-surface-container-low border border-outline/10 text-xs font-bold text-primary uppercase tracking-widest">Kubernetes</span>
                <span className="px-5 py-3 bg-surface-container-low border border-outline/10 text-xs font-bold text-primary uppercase tracking-widest">Vector DBs</span>
                <span className="px-5 py-3 bg-surface-container-low border border-outline/10 text-xs font-bold text-primary uppercase tracking-widest">DVC</span>
                <span className="px-5 py-3 bg-surface-container-low border border-outline/10 text-xs font-bold text-primary uppercase tracking-widest">Weights &amp; Biases</span>
              </div>
            </div>
            <div>
              <h6 className="font-label text-[10px] tracking-[0.3em] uppercase text-outline mb-8">Certifications</h6>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-outline/10">
                  <span className="font-headline font-bold text-primary uppercase tracking-wide">AWS Certified Machine Learning – Specialty</span>
                  <span className="material-symbols-outlined text-outline text-lg" data-icon="lock" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-outline/10">
                  <span className="font-headline font-bold text-primary uppercase tracking-wide">DeepLearning.AI TensorFlow Developer</span>
                  <span className="material-symbols-outlined text-outline text-lg" data-icon="lock" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-outline/10">
                  <span className="font-headline font-bold text-primary uppercase tracking-wide">Google Cloud Professional ML Engineer</span>
                  <span className="material-symbols-outlined text-outline text-lg" data-icon="lock" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Contact Section */}
        <section className="relative p-12 md:p-24 bg-surface-container-low overflow-hidden border border-outline/5">
          {/* Subtle Mesh Gradient */}
          <div className="absolute inset-0 -z-10 opacity-30" style={{ background: 'radial-gradient(at 50% 0%, #353535 0%, transparent 70%), radial-gradient(at 0% 100%, #1f1f1f 0%, transparent 50%)' }}></div>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="font-headline text-5xl md:text-7xl font-bold text-primary mb-4 tracking-tighter">START A PROJECT</h3>
              <p className="text-outline uppercase tracking-[0.2em] text-xs">Typically replies within 24 hours</p>
            </div>
            <form className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative">
                  <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:ring-0 focus:border-primary text-primary px-0 py-4 placeholder:text-outline/40 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest transition-all" placeholder="Name" type="text"/>
                </div>
                <div className="relative">
                  <input className="w-full bg-transparent border-0 border-b border-outline/30 focus:ring-0 focus:border-primary text-primary px-0 py-4 placeholder:text-outline/40 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest transition-all" placeholder="Email" type="email"/>
                </div>
              </div>
              <div className="relative">
                <select className="w-full bg-transparent border-0 border-b border-outline/30 focus:ring-0 focus:border-primary text-primary px-0 py-4 uppercase text-xs tracking-widest transition-all appearance-none">
                  <option className="bg-background">Project Type</option>
                  <option className="bg-background">RAG Development</option>
                  <option className="bg-background">AI Agent Design</option>
                  <option className="bg-background">MLOps Pipeline</option>
                  <option className="bg-background">Other ML Solution</option>
                </select>
              </div>
              <div className="relative">
                <textarea className="w-full bg-transparent border-0 border-b border-outline/30 focus:ring-0 focus:border-primary text-primary px-0 py-4 placeholder:text-outline/40 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest transition-all resize-none" placeholder="Tell me about your project" rows={4}></textarea>
              </div>
              <button className="w-full py-6 bg-primary text-on-primary-container font-headline font-bold text-lg uppercase tracking-[0.2em] hover:bg-secondary transition-all flex items-center justify-center gap-3" type="button">
                Send Inquiry <span className="material-symbols-outlined" data-icon="send">send</span>
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-surface-container-lowest py-24 border-t border-outline/10 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="text-center md:text-left">
            <span className="font-headline text-3xl font-black text-primary tracking-tighter block mb-2">VOID_ML</span>
            <span className="font-label text-[10px] tracking-widest uppercase text-outline">© 2024 KRISH UJENIYA. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex gap-12">
            <a className="font-label text-[10px] tracking-widest uppercase text-outline hover:text-primary transition-colors" href="https://twitter.com/krish_ux">Twitter (X)</a>
            <a className="font-label text-[10px] tracking-widest uppercase text-outline hover:text-primary transition-colors" href="https://linkedin.com/in/krishujeniya">LinkedIn</a>
            <a className="font-label text-[10px] tracking-widest uppercase text-outline hover:text-primary transition-colors" href="https://github.com/krishujeniya">GitHub</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
