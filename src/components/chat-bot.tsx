'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Sparkles, MessageCircle } from 'lucide-react';

interface KnowledgeEntry {
    keywords: string[];
    response: string;
    priority?: number;
}

const knowledgeBase: KnowledgeEntry[] = [
    {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'sup', 'yo', 'good morning', 'good evening', 'good afternoon'],
        response: "Hey there! 👋 I'm Krish's AI assistant. I can tell you about his services, skills, projects, availability, or help you start a project inquiry. What would you like to know?",
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
        response: "Here are some of Krish's notable projects:\n\n🎵 **EchoNest** — AI-powered music recommendation engine\n🔬 **VemyPipeline** — End-to-end MLOps pipeline with ZenML\n📱 **SnapText** — OCR mobile app with ML Kit\n🤖 **AI Agents** — Custom autonomous agents for task automation\n🎮 **Game AI** — Intelligent game-playing bots\n\nYou can see them in the Portfolio section above! Want to discuss a similar project?",
        priority: 2,
    },
    {
        keywords: ['experience', 'background', 'career', 'job', 'intern', 'work history', 'resume'],
        response: "Krish's professional journey:\n\n💼 **Freelance ML & Software Engineer** (2023–Present) — MLOps, LLMs, full-stack dev\n🧪 **ML Engineer Intern @ Mentorness** (2024) — Predictive models, fraud detection\n📱 **Flutter Developer @ Prelax Infotech** (2023) — SnapText OCR app\n🌐 **PHP Developer @ For Each Next** (2022) — Web development foundations\n\nHe's been building AI solutions professionally since 2022!",
        priority: 2,
    },
    {
        keywords: ['price', 'cost', 'rate', 'charge', 'budget', 'pricing', 'how much', 'afford', 'quote', 'estimate', 'fee'],
        response: "Pricing depends on the project scope and complexity. Here's a rough guide:\n\n💡 **Consultation/Advisory:** Starting from $50/hr\n🤖 **AI Agent / LLM Project:** $2,000–$15,000+\n⚙️ **MLOps Pipeline Setup:** $3,000–$10,000+\n📱 **Full-Stack App:** $5,000–$20,000+\n\nFor an accurate quote, please describe your project in the contact form or email Krish directly at ukideashare0021@gmail.com",
        priority: 3,
    },
    {
        keywords: ['available', 'free', 'hire', 'freelance', 'contract', 'open', 'taking', 'accept', 'booking', 'schedule'],
        response: "Yes! Krish is currently **available for freelance projects** and consulting work. 🟢\n\nHe typically responds within 24 hours. You can:\n📧 Email: ukideashare0021@gmail.com\n📝 Use the contact form on this page\n💬 Describe your project right here in chat!\n\nWhat kind of project are you planning?",
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
        response: "Krish has deep expertise in LLMs:\n\n🧠 **Fine-tuning** — Custom LLMs for specific domains\n📚 **RAG Systems** — Retrieval Augmented Generation with vector databases\n🔗 **LangChain** — Building LLM-powered applications\n🤖 **Agent Frameworks** — Multi-step reasoning agents\n🔧 **Deployment** — Optimized inference pipelines\n\nWant to discuss an LLM project? Just describe your use case!",
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
        response: "Krish builds AI Agents that can:\n\n🧠 **Reason** — Multi-step problem solving\n🔧 **Use Tools** — API calls, database queries, web scraping\n📋 **Execute Tasks** — Automated workflows end-to-end\n🔄 **Learn** — Adapt from feedback and context\n\nUse cases: customer support bots, data analysis agents, research assistants, workflow automation. What process would you like to automate?",
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
    const msg = userMessage.toLowerCase().trim();

    // Score each knowledge entry
    let bestMatch: KnowledgeEntry | null = null;
    let bestScore = 0;

    for (const entry of knowledgeBase) {
        let score = 0;
        for (const keyword of entry.keywords) {
            if (msg.includes(keyword)) {
                score += keyword.split(' ').length; // Multi-word matches score higher
            }
        }
        if (entry.priority) score *= entry.priority;

        if (score > bestScore) {
            bestScore = score;
            bestMatch = entry;
        }
    }

    if (bestMatch && bestScore > 0) {
        return bestMatch.response;
    }

    // Fallback responses
    const fallbacks = [
        "Interesting question! While I may not have a specific answer for that, I can tell you about Krish's services, projects, skills, pricing, or availability. What would you like to know? 😊",
        "I'm not sure about that one, but I can help you with info about Krish's AI/ML services, his portfolio projects, or help you get started with a project inquiry. Try asking about his skills or services!",
        "That's outside my knowledge area, but feel free to ask about Krish's expertise in AI Agents, LLMs, RAG, MLOps, or mobile development. Or you can email him at ukideashare0021@gmail.com for specific questions!",
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

// AI Chatbot placeholder messages
const botMessages = [
    {
        from: 'bot' as const,
        text: "Hey there! 👋 I'm Krish's AI assistant. How can I help you today?",
    },
    {
        from: 'bot' as const,
        text: "Ask me about Krish's services, skills, projects, pricing, availability, or anything about his portfolio!",
    },
];

export const ChatBot = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ from: 'bot' | 'user'; text: string }>>(botMessages);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isTyping]);

    const handleChatSend = () => {
        if (!chatInput.trim() || isTyping) return;
        const userMsg = chatInput.trim();
        setChatMessages((prev) => [
            ...prev,
            { from: 'user' as const, text: userMsg },
        ]);
        setChatInput('');
        setIsTyping(true);

        // Simulate AI thinking delay (400-1000ms)
        const thinkTime = 400 + Math.random() * 600;
        setTimeout(() => {
            const aiResponse = getAIResponse(userMsg);
            setChatMessages((prev) => [
                ...prev,
                { from: 'bot' as const, text: aiResponse },
            ]);
            setIsTyping(false);
        }, thinkTime);
    };

    return (
        <div className="chatbot-wrapper">
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        className="chatbot-window"
                        initial={{ opacity: 0, scale: 0.85, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
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
                            <button
                                onClick={() => setChatOpen(false)}
                                className="chatbot-close"
                                aria-label="Close chat"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chat messages */}
                        <div className="chatbot-messages">
                            {chatMessages.map((msg, i) => (
                                <motion.div
                                    key={`msg-${i}-${msg.from}`}
                                    className={`chatbot-msg ${msg.from === 'bot' ? 'chatbot-msg-bot' : 'chatbot-msg-user'}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.3 }}
                                >
                                    <div className={`chatbot-msg-avatar ${msg.from === 'bot' ? 'chatbot-msg-avatar-bot' : 'chatbot-msg-avatar-user'}`}>
                                        {msg.from === 'bot' ? <Bot className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                    </div>
                                    <div className={`chatbot-msg-bubble ${msg.from === 'bot' ? 'chatbot-msg-bubble-bot' : 'chatbot-msg-bubble-user'}`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    className="chatbot-msg chatbot-msg-bot"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="chatbot-msg-avatar chatbot-msg-avatar-bot">
                                        <Bot className="w-3 h-3" />
                                    </div>
                                    <div className="chatbot-msg-bubble chatbot-msg-bubble-bot chatbot-typing">
                                        <span className="typing-dot" />
                                        <span className="typing-dot" />
                                        <span className="typing-dot" />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat input */}
                        <div className="chatbot-input-area">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                                placeholder="Type a message..."
                                className="chatbot-input"
                            />
                            <button
                                onClick={handleChatSend}
                                className="chatbot-send"
                                aria-label="Send message"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat toggle button */}
            <motion.button
                className="chatbot-toggle magnetic-btn"
                onClick={() => setChatOpen(!chatOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle AI chat"
            >
                <AnimatePresence mode="wait">
                    {chatOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};
