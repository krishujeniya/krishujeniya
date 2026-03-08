'use client';

import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Github,
    Linkedin,
    Youtube,
    Twitter,
    Mail,
    MessageCircle,
    X,
    Bot,
    User,
    Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { AnimatedSection } from '@/components/ui/animated-section';

const socialLinks = [
    { name: 'YouTube', icon: Youtube, url: 'https://www.youtube.com/@ai-drago' },
    { name: 'X (Twitter)', icon: Twitter, url: 'https://twitter.com/krishujeniya' },
    { name: 'Telegram', icon: Send, url: 'https://t.me/krishujeniya' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/krishujeniya' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/krishujeniya' },
];

// AI Chatbot placeholder messages
const botMessages = [
    {
        from: 'bot' as const,
        text: "Hey there! 👋 I'm Krish's AI assistant. How can I help you today?",
    },
    {
        from: 'bot' as const,
        text: "I can tell you about Krish's services, past projects, availability, or help you get started on a project inquiry.",
    },
];

export const ContactSection: FC = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ from: 'bot' | 'user'; text: string }>>(botMessages);
    const [chatInput, setChatInput] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleChatSend = () => {
        if (!chatInput.trim()) return;
        setChatMessages((prev) => [
            ...prev,
            { from: 'user' as const, text: chatInput },
        ]);
        setChatInput('');

        // Simulate bot response
        setTimeout(() => {
            setChatMessages((prev) => [
                ...prev,
                {
                    from: 'bot' as const,
                    text: "Thanks for reaching out! I've noted your inquiry. Krish will get back to you within 24 hours. In the meantime, feel free to explore the portfolio above!",
                },
            ]);
        }, 1200);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder — form submission logic
        setFormData({ name: '', email: '', message: '' });
    };

    const isFieldActive = (field: string) =>
        focusedField === field || formData[field as keyof typeof formData].length > 0;

    return (
        <>
            <AnimatedSection id="contact" className="container mx-auto px-4">
                <h2 className="section-title">
                    <span className="section-title-accent">/</span> Let&apos;s Connect
                </h2>
                <p className="section-subtitle">
                    Have a project in mind? Let&apos;s build something remarkable together.
                </p>

                <div className="contact-layout">
                    {/* Contact Form */}
                    <motion.form
                        className="contact-form"
                        onSubmit={handleFormSubmit}
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Name field */}
                        <div className={`form-field ${isFieldActive('name') ? 'active' : ''}`}>
                            <label htmlFor="contact-name" className="form-label">
                                Your Name
                            </label>
                            <input
                                id="contact-name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                                className="form-input"
                                required
                            />
                            <div className="form-field-border" />
                        </div>

                        {/* Email field */}
                        <div className={`form-field ${isFieldActive('email') ? 'active' : ''}`}>
                            <label htmlFor="contact-email" className="form-label">
                                Your Email
                            </label>
                            <input
                                id="contact-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                className="form-input"
                                required
                            />
                            <div className="form-field-border" />
                        </div>

                        {/* Message field */}
                        <div className={`form-field ${isFieldActive('message') ? 'active' : ''}`}>
                            <label htmlFor="contact-message" className="form-label">
                                Tell me about your project
                            </label>
                            <textarea
                                id="contact-message"
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                onFocus={() => setFocusedField('message')}
                                onBlur={() => setFocusedField(null)}
                                className="form-input form-textarea"
                                required
                            />
                            <div className="form-field-border" />
                        </div>

                        <button type="submit" className="btn-primary magnetic-btn form-submit-btn">
                            <span>Send Message</span>
                            <Send className="w-4 h-4" />
                        </button>
                    </motion.form>

                    {/* Info side */}
                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="contact-info-block">
                            <h3 className="contact-info-title">Get in Touch</h3>
                            <p className="contact-info-text">
                                Ready to discuss your AI project or need an MLOps consultation?
                                Reach out via email or connect on social media.
                            </p>
                            <Link
                                href="mailto:ukideashare0021@gmail.com"
                                className="contact-email-link"
                            >
                                <Mail className="w-5 h-5" />
                                <span>ukideashare0021@gmail.com</span>
                            </Link>
                        </div>

                        <div className="contact-socials">
                            <p className="contact-socials-label">Find me on</p>
                            <div className="contact-socials-grid">
                                {socialLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={link.name}
                                        className="social-icon-btn magnetic-btn"
                                    >
                                        <link.icon className="w-5 h-5" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="footer-bar">
                    <p className="footer-text">
                        Proudly building open-source AI tools since 2022.
                    </p>
                    <p className="footer-copyright">
                        © {currentYear} Krish Ujeniya. All Rights Reserved.
                    </p>
                </div>
            </AnimatedSection>

            {/* AI Chatbot Widget */}
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
                                        key={i}
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
        </>
    );
};
