'use client';

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Send, X, Bot, User, Sparkles, MessageCircle, RotateCcw } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

gsap.registerPlugin(useGSAP);

interface KnowledgeEntry {
    keywords: string[];
    response: string;
    priority?: number;
}

const projectKnowledgeEntries: KnowledgeEntry[] = portfolioData.projects.map(project => {
    const rawName = project.title.split('—')[0].trim().toLowerCase();
    const tokens = rawName.split(/\s+/).filter(t => t.length > 2);
    const keywords = [rawName, ...tokens];
    return {
        keywords,
        response: `**${project.title}** (${project.category})\n\n${project.description}\n\n💡 **Impact:** ${project.impact}\n\nExplore: [View Case Study](#projects) · [Project Source](${project.link})`,
        priority: 4,
    };
});

const knowledgeBase: KnowledgeEntry[] = [
    ...projectKnowledgeEntries,
    {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo', 'good morning', 'good evening', 'good afternoon'],
        response: "Hey there! 👋 I'm Krish's AI assistant. I can answer questions about his skills, projects, and services. Chat messages are interactive and not stored as inquiries; to submit a project inquiry or message Krish directly, please use the Contact form on this page or email ukideashare0021@gmail.com. What would you like to know?",
        priority: 1,
    },
    {
        keywords: ['service', 'offer', 'what do you do', 'what can you do', 'help with', 'provide', 'work on'],
        response: "Krish specializes in three core areas:\n\n🤖 **AI Agent Development** — Autonomous agents with complex reasoning & tool usage\n🧠 **LLM Solutions & RAG** — Fine-tuning LLMs, building RAG pipelines for knowledge retrieval\n⚙️ **MLOps Pipelines** — End-to-end ML lifecycle with ZenML, MLflow & automated deployment\n\nWant details on any of these?",
        priority: 2,
    },
    {
        keywords: ['skill', 'tech', 'technology', 'stack', 'tools', 'framework', 'language', 'programming'],
        response: "Krish's tech stack includes:\n\n**Languages:** Python, Dart, JavaScript, PHP\n**ML/AI:** TensorFlow, PyTorch, Scikit-learn, Hugging Face, LangChain\n**MLOps:** ZenML, MLflow, DVC, Docker\n**LLMs:** GPT, Gemini, RAG, Vector DBs (Pinecone, Chroma)\n**Mobile:** Flutter, Dart\n**Web:** Next.js, React, Node.js\n**Cloud:** AWS, GCP, Azure basics\n\nAnything specific you'd like to explore?",
        priority: 2,
    },
    {
        keywords: ['project', 'portfolio', 'built', 'created', 'developed', 'work', 'example', 'case study', 'past work'],
        response: "Here are Krish's featured projects in the portfolio:\n\n🧠 **AmberClaw** — Zero-trust AI agent runtime with persistent memory & RAG\n📊 **Salary Predictions** — Production MLOps pipeline on Hugging Face Spaces\n📱 **Scanlark** — On-device OCR mobile app using Flutter & ML Kit\n👁️ **Hajree** — Biometric attendance with anti-spoofing liveness detection\n📈 **Activity Recognition** — Sensor telemetry classification & ML analysis\n🌐 **Saygrove** — Cross-platform social media app with real-time Firebase sync\n🤖 **Discord Automation Bot** — High-uptime community automation bot\n\nYou can explore each project with its case study and repository links in the Projects section above!",
        priority: 2,
    },
    {
        keywords: ['experience', 'background', 'career', 'job', 'intern', 'work history', 'resume'],
        response: "Krish's professional background:\n\n🎓 **AI & Data Engineering Trainee** (Microsoft Partner Program, Jul 2026)\n🔬 **AI & Quantum Technologies Trainee** (IBM SkillsBuild, Jun 2026)\n💼 **Freelance ML & Software Engineer** (2023–Present) — RAG systems, agents, MLOps\n🧪 **ML Engineer Intern @ Mentorness** (2024) — Scikit-learn predictive modeling\n📱 **Flutter Developer Intern @ Prelax Infotech** (2023) — SnapText on-device OCR\n🌐 **PHP Developer Intern @ For Each Next** (2022) — Web development foundations\n\nHe has software engineering experience dating back to 2022, specializing in machine learning and AI pipelines since 2023.",
        priority: 2,
    },
    {
        keywords: ['price', 'cost', 'rate', 'charge', 'budget', 'pricing', 'how much', 'afford', 'quote', 'estimate', 'fee'],
        response: "Pricing depends on the project scope and complexity. Here's a rough guide:\n\n💡 **Consultation/Advisory:** Starting from $50/hr\n🤖 **AI Agent / LLM Project:** $2,000–$15,000+\n⚙️ **MLOps Pipeline Setup:** $3,000–$10,000+\n📱 **Full-Stack App:** $5,000–$20,000+\n\nFor a specific quote, please submit your project details through the Contact form on this page or email Krish directly at ukideashare0021@gmail.com.",
        priority: 3,
    },
    {
        keywords: ['available', 'free', 'hire', 'freelance', 'contract', 'open', 'taking', 'accept', 'booking', 'schedule'],
        response: "Yes! Krish is currently **available for freelance projects** and consulting work. 🟢\n\nHe typically responds within 24 hours.\n\nTo ensure your project details reach Krish, please submit them through the **Contact form** on this page (or email ukideashare0021@gmail.com). Messages in this chat window are for interactive questions only and are not forwarded or saved.",
        priority: 3,
    },
    {
        keywords: ['contact', 'email', 'reach', 'connect', 'social', 'linkedin', 'github', 'twitter', 'telegram', 'youtube'],
        response: "You can reach Krish through:\n\n📧 **Email:** ukideashare0021@gmail.com\n💼 **LinkedIn:** linkedin.com/in/krishujeniya\n🐙 **GitHub:** github.com/krishujeniya\n🐦 **Twitter/X:** @krishujeniya\n📺 **YouTube:** @ai-drago\n✈️ **Telegram:** @krishujeniya\n\nOr just fill out the contact form right here! 👆",
        priority: 2,
    },
    {
        keywords: ['certificate', 'certification', 'credential', 'qualified', 'certified', 'course', 'education'],
        response: "Krish holds certifications in:\n\n🎓 **Generative AI** — Industry certified\n🤖 **Machine Learning & Deep Learning**\n📝 **NLP (Natural Language Processing)**\n🐍 **Python** — Advanced level\n🌐 **ChatGPT & AI Tools**\n🔥 **Flask (Web Framework)**\n\nAll certificates are available in the Documents section above! You can download them directly.",
        priority: 2,
    },
    {
        keywords: ['llm', 'large language', 'gpt', 'gemini', 'chatgpt', 'openai', 'fine-tune', 'fine tune', 'finetune'],
        response: "Krish has deep expertise in LLMs:\n\n🧠 **Fine-tuning** — Custom LLMs for specific domains\n📚 **RAG Systems** — Retrieval Augmented Generation with vector databases\n🔗 **LangChain** — Building LLM-powered applications\n🤖 **Agent Frameworks** — Multi-step reasoning agents\n🔧 **Deployment** — Optimized inference pipelines\n\nTo discuss an LLM project with Krish, submit an inquiry in the Contact section below!",
        priority: 3,
    },
    {
        keywords: ['rag', 'retrieval', 'augmented', 'knowledge base', 'vector', 'embedding', 'semantic search'],
        response: "RAG (Retrieval Augmented Generation) is one of Krish's specialties:\n\n📊 **Vector Databases:** Pinecone, Chroma, Weaviate\n🔍 **Embedding Models:** OpenAI, Sentence Transformers\n📄 **Document Processing:** PDF, web, database ingestion\n🎯 **Use Cases:** Internal knowledge bots, customer support, document Q&A\n\nRAG lets your AI access your specific data without expensive fine-tuning!",
        priority: 3,
    },
    {
        keywords: ['mlops', 'pipeline', 'zenml', 'mlflow', 'deploy', 'deployment', 'production', 'model', 'lifecycle'],
        response: "Krish builds production-grade MLOps pipelines:\n\n🔄 **ZenML** — Orchestrating ML workflows\n📊 **MLflow** — Experiment tracking & model registry\n🐳 **Docker** — Containerized deployments\n🚀 **CI/CD** — Automated model retraining & deployment\n📈 **Monitoring** — Model drift detection & performance tracking\n\nFrom data ingestion to production — the full ML lifecycle!",
        priority: 3,
    },
    {
        keywords: ['flutter', 'mobile', 'app', 'android', 'ios', 'cross-platform', 'dart'],
        response: "Krish also builds mobile apps with Flutter:\n\n📱 **Cross-platform** — iOS & Android from a single codebase\n🎨 **Beautiful UI** — Material Design & custom widgets\n🤖 **ML Integration** — On-device ML models, ML Kit\n📸 **OCR Apps** — Like SnapText (text recognition)\n\nHe can integrate AI capabilities directly into mobile apps!",
        priority: 2,
    },
    {
        keywords: ['ai agent', 'autonomous', 'agent', 'automate', 'automation', 'workflow', 'bot'],
        response: "Krish builds AI Agents that can:\n\n🧠 **Reason** — Multi-step problem solving\n🔧 **Use Tools** — API calls, database queries, web scraping\n📋 **Execute Tasks** — Automated workflows end-to-end\n🔄 **Learn** — Adapt from feedback and context\n\nHave a workflow in mind? Reach out through the Contact form below to discuss an engagement!",
        priority: 3,
    },
    {
        keywords: ['timeline', 'how long', 'duration', 'time', 'deadline', 'turnaround', 'delivery', 'when'],
        response: "Typical project timelines:\n\n⚡ **Quick Consultation:** 1–3 days\n🤖 **AI Agent/Chatbot:** 2–4 weeks\n📊 **MLOps Pipeline:** 3–6 weeks\n📱 **Full-Stack App:** 4–8 weeks\n🧠 **LLM/RAG System:** 2–5 weeks\n\nTimelines vary by complexity. Krish is flexible and can work on tight deadlines too!",
        priority: 2,
    },
    {
        keywords: ['thank', 'thanks', 'appreciate', 'awesome', 'great', 'perfect', 'cool', 'nice', 'amazing'],
        response: "You're welcome! 😊 Glad I could help. If you need anything else or want to start a project, just reach out through the contact form or email ukideashare0021@gmail.com. Krish would love to hear from you! 🚀",
        priority: 1,
    },
    {
        keywords: ['bye', 'goodbye', 'see you', 'later', 'ttyl', 'gotta go'],
        response: "Thanks for stopping by! 👋 Feel free to come back anytime. If you're ready to start a project, the contact form is right here. Have a great day! 🌟",
        priority: 1,
    },
    {
        keywords: ['who are you', 'what are you', 'are you ai', 'are you a bot', 'are you real', 'who is this'],
        response: "I'm Krish's AI portfolio assistant! 🤖 I'm here to help you learn about Krish's skills, services, and projects. I can answer questions about his work, provide pricing info, and help you get started with a project inquiry.\n\nThink of me as a smart FAQ with personality! 😄",
        priority: 2,
    },
    {
        keywords: ['location', 'where', 'based', 'country', 'city', 'remote', 'timezone'],
        response: "Krish is based in **India** 🇮🇳 and works **remotely** with clients worldwide. He's flexible with timezones and has experience collaborating with teams across the globe.\n\nRemote-first means no geographical barriers! 🌍",
        priority: 2,
    },
];

const getAIResponse = (userMessage: string): string => {
    const rawMsg = userMessage.toLowerCase().trim();
    const isNegated = /\b(no|not|never|stop|quit|don['\s]?t|won['\s]?t|can['\s]?t)\b/i.test(rawMsg);
    const normalizedMsg = rawMsg.replace(/[^a-z0-9]+/g, ' ').trim();
    const words = normalizedMsg.split(/\s+/);

    if (isNegated && words.length <= 4 && (words.includes('hire') || words.includes('start') || words.includes('contact') || words.includes('book'))) {
        return "Understood! No worries at all. Feel free to explore Krish's projects or research papers at your own pace.";
    }

    let bestMatch: KnowledgeEntry | null = null;
    let bestScore = 0;

    for (const entry of knowledgeBase) {
        let score = 0;
        for (const keyword of entry.keywords) {
            const normalizedKeyword = keyword.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
            const matchesKeyword = ` ${normalizedMsg} `.includes(` ${normalizedKeyword} `);
            if (matchesKeyword) {
                const keywordWeight = keyword.split(' ').length;
                score += keywordWeight * 10;
            }
        }
        if (entry.priority) score *= entry.priority;
        if (isNegated && words.length <= 4) score *= 0.2;
        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    if (bestMatch && bestScore >= 10) {
        return bestMatch.response;
    }

    const fallbacks = [
        "Interesting question! While I may not have a specific answer for that, I can tell you about Krish's services, projects, skills, pricing, or availability. What would you like to know? 😊",
        "I'm not sure about that one, but I can help you with info about Krish's AI/ML services, his portfolio projects, or help you get started with a project inquiry.",
        "That's outside my knowledge area, but feel free to ask about Krish's expertise in AI Agents, LLMs, RAG, MLOps, or mobile development.",
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

const botMessages = [
    { from: 'bot' as const, text: "Hey there! 👋 I'm Krish's AI assistant. How can I help you today?" },
    { from: 'bot' as const, text: "Ask me about Krish's services, skills, projects, or background. (Note: To send a project proposal directly to Krish, please use the Contact form below)." },
];

export const ChatBot = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const nextIdRef = useRef(botMessages.length);
    const [chatMessages, setChatMessages] = useState<Array<{ id: number; from: 'bot' | 'user'; text: string }>>(
        botMessages.map((m, i) => ({ ...m, id: i }))
    );
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const windowRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const closeIconRef = useRef<HTMLDivElement>(null);
    const openIconRef = useRef<HTMLDivElement>(null);
    const isMounted = useRef(true);
    const previousChatOpenRef = useRef(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        isMounted.current = true;

        // Test automation or reduced motion: show immediately
        const isReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isAutomated = typeof navigator !== 'undefined' && (navigator as any).webdriver;
        if (isReduced || isAutomated || (typeof document !== 'undefined' && document.body.classList.contains('hero-ready'))) {
            setIsReady(true);
            return () => { isMounted.current = false; };
        }

        const handleReady = () => setIsReady(true);
        window.addEventListener('hero-typing-complete', handleReady, { once: true });
        const fallbackTimer = setTimeout(() => setIsReady(true), 12000);

        return () => {
            isMounted.current = false;
            window.removeEventListener('hero-typing-complete', handleReady);
            clearTimeout(fallbackTimer);
        };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isTyping]);

    // Close chat on Escape key or click outside
    useEffect(() => {
        if (!chatOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setChatOpen(false);
            }
        };
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;
            if (
                windowRef.current &&
                !windowRef.current.contains(target) &&
                toggleRef.current &&
                !toggleRef.current.contains(target)
            ) {
                setChatOpen(false);
            }
        };

        const toggleButton = toggleRef.current;
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside, { passive: true });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            toggleButton?.focus();
        };
    }, [chatOpen]);

    // Animate chat window open/close
    useEffect(() => {
        const win = windowRef.current;
        if (!win) return;
        const wasOpen = previousChatOpenRef.current;
        previousChatOpenRef.current = chatOpen;
        gsap.killTweensOf(win);

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(typeof navigator !== 'undefined' && navigator.webdriver);
        if (reduceMotion) {
            gsap.set(win, { display: chatOpen ? 'flex' : 'none', opacity: 1, scale: 1, y: 0 });
            if (chatOpen) inputRef.current?.focus({ preventScroll: true });
            return;
        }
        if (chatOpen) {
            gsap.set(win, { display: 'flex' });
            inputRef.current?.focus({ preventScroll: true });
            gsap.fromTo(win,
                { opacity: 0, scale: 0.85, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power3.out' }
            );
        } else if (wasOpen) {
            gsap.to(win, {
                opacity: 0, scale: 0.85, y: 20, duration: 0.25, ease: 'power2.in',
                onComplete: () => gsap.set(win, { display: 'none' }),
            });
        } else {
            gsap.set(win, { display: 'none', opacity: 0, scale: 0.85, y: 20 });
        }
    }, [chatOpen]);

    // Toggle button icon swap
    useEffect(() => {
        const close = closeIconRef.current;
        const open = openIconRef.current;
        if (!close || !open) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(typeof navigator !== 'undefined' && navigator.webdriver);
        if (chatOpen) {
            gsap.set(open, { display: 'none' });
            gsap.set(close, { display: 'flex', rotate: reduceMotion ? 0 : -90, opacity: reduceMotion ? 1 : 0 });
            if (!reduceMotion) gsap.to(close, { rotate: 0, opacity: 1, duration: 0.2, ease: 'power2.out' });
        } else {
            gsap.set(close, { display: 'none' });
            gsap.set(open, { display: 'flex', rotate: 0, opacity: 1 });
        }
    }, [chatOpen]);

    // Toggle button hover
    useGSAP(() => {
        const btn = toggleRef.current;
        if (!btn) return;
        const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(typeof navigator !== 'undefined' && navigator.webdriver);
        const onEnter = () => {
            if (!isReduced()) gsap.to(btn, { scale: 1.1, duration: 0.2, ease: 'power2.out' });
        };
        const onLeave = () => {
            if (!isReduced()) gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
        };
        const onDown = () => {
            if (!isReduced()) gsap.to(btn, { scale: 0.95, duration: 0.1 });
        };
        btn.addEventListener('mouseenter', onEnter);
        btn.addEventListener('mouseleave', onLeave);
        btn.addEventListener('mousedown', onDown);
        btn.addEventListener('mouseup', onLeave);
        return () => {
            btn.removeEventListener('mouseenter', onEnter);
            btn.removeEventListener('mouseleave', onLeave);
            btn.removeEventListener('mousedown', onDown);
            btn.removeEventListener('mouseup', onLeave);
        };
    }, []);

    const handleChatSend = useCallback(() => {
        if (!chatInput.trim() || isTyping) return;
        const userMsg = chatInput.trim().slice(0, 500);
        const userMsgId = nextIdRef.current++;
        setChatMessages((prev) => [...prev, { id: userMsgId, from: 'user' as const, text: userMsg }].slice(-50));
        setChatInput('');
        setIsTyping(true);
        const thinkTime = 400 + Math.random() * 600;
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (!isMounted.current) return;
            const aiResponse = getAIResponse(userMsg);
            const botMsgId = nextIdRef.current++;
            setChatMessages((prev) => [...prev, { id: botMsgId, from: 'bot' as const, text: aiResponse }].slice(-50));
            setIsTyping(false);
            typingTimeoutRef.current = null;
        }, thinkTime);
    }, [chatInput, isTyping]);

    const handleClearChat = useCallback(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        setIsTyping(false);
        setChatInput('');
        setChatMessages(botMessages.map((m, i) => ({ ...m, id: i })));
    }, []);

    return (
        <div className={`chatbot-wrapper transition-all duration-700 ease-out ${isReady ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {/* Chat window — always rendered, shown/hidden by GSAP */}
            <div
                ref={windowRef}
                className="chatbot-window"
                id="chat-window"
                role="dialog"
                aria-label="AI Assistant"
                style={{ display: 'none' }}
            >
                {/* Chat header */}
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <div className="chatbot-avatar">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="chatbot-name">Krish&apos;s AI Assistant</p>
                            <p className="chatbot-status">
                                <span className="chatbot-status-dot" />
                                Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleClearChat}
                            className="chatbot-close"
                            title="Clear conversation"
                            aria-label="Clear conversation"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setChatOpen(false)}
                            className="chatbot-close"
                            aria-label="Close chat"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Chat messages */}
                <div
                    className="chatbot-messages"
                    aria-live="polite"
                    aria-atomic="false"
                >
                    {chatMessages.map((msg) => (
                        <ChatMsg key={msg.id} msg={msg} />
                    ))}
                    {isTyping && (
                        <ChatMsg
                            msg={{ id: -1, from: 'bot', text: '__typing__' }}
                            isTyping
                        />
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Chat input */}
                <div className="chatbot-input-area">
                    <input
                        ref={inputRef}
                        type="text"
                        maxLength={500}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                        placeholder="Type a message..."
                        className="chatbot-input"
                        aria-label="Chat message"
                    />
                    <button
                        onClick={handleChatSend}
                        className="chatbot-send"
                        aria-label="Send message"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Chat toggle button */}
            <button
                ref={toggleRef}
                className={`chatbot-toggle magnetic-btn transition-all duration-700 ease-out hover:scale-105 active:scale-95 ${isReady ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-0 opacity-0 pointer-events-none'}`}
                onClick={() => setChatOpen(!chatOpen)}
                aria-label="Toggle AI chat"
                aria-expanded={chatOpen}
                aria-controls="chat-window"
            >
                <div ref={openIconRef} style={{ display: 'flex' }}>
                    <MessageCircle className="w-6 h-6" />
                </div>
                <div ref={closeIconRef} style={{ display: 'none' }}>
                    <X className="w-6 h-6" />
                </div>
            </button>
        </div>
    );
};

// Individual chat message with GSAP entrance
function ChatMsg({ msg, isTyping = false }: { msg: { id: number; from: 'bot' | 'user'; text: string }; isTyping?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const skipMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || Boolean(typeof navigator !== 'undefined' && navigator.webdriver);
        if (ref.current && !skipMotion) {
            gsap.from(ref.current, { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out' });
        }
    }, []);

    return (
        <div
            ref={ref}
            className={`chatbot-msg ${msg.from === 'bot' ? 'chatbot-msg-bot' : 'chatbot-msg-user'}`}
        >
            <div className={`chatbot-msg-avatar ${msg.from === 'bot' ? 'chatbot-msg-avatar-bot' : 'chatbot-msg-avatar-user'}`}>
                {msg.from === 'bot' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
            </div>
            {isTyping ? (
                <div className="chatbot-msg-bubble chatbot-msg-bubble-bot chatbot-typing">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                </div>
            ) : (
                <div
                    className={`chatbot-msg-bubble ${msg.from === 'bot' ? 'chatbot-msg-bubble-bot' : 'chatbot-msg-bubble-user'} whitespace-pre-wrap`}
                >
                    {(() => {
                        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                        const parts: ReactNode[] = [];
                        let lastIndex = 0;
                        let match: RegExpExecArray | null;
                        while ((match = linkRegex.exec(msg.text)) !== null) {
                            if (match.index > lastIndex) {
                                parts.push(msg.text.slice(lastIndex, match.index));
                            }
                            parts.push(
                                <a
                                    key={match.index}
                                    href={match[2]}
                                    target={match[2].startsWith('#') ? undefined : '_blank'}
                                    rel={match[2].startsWith('#') ? undefined : 'noopener noreferrer'}
                                    className="underline text-white font-medium hover:text-white/80 transition-colors"
                                >
                                    {match[1]}
                                </a>
                            );
                            lastIndex = match.index + match[0].length;
                        }
                        if (lastIndex < msg.text.length) {
                            parts.push(msg.text.slice(lastIndex));
                        }
                        return parts.map((part, i) => {
                            if (typeof part !== 'string') return part;
                            return part.split(/(\*\*[\s\S]*?\*\*)/).map((sub, j) =>
                                sub.startsWith('**') && sub.endsWith('**') ? <strong key={`${i}-${j}`}>{sub.slice(2, -2)}</strong> : sub
                            );
                        });
                    })()}
                </div>
            )}
        </div>
    );
}
