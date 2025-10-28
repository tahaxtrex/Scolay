
import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { ChatBubbleIcon, CloseIcon, SendIcon } from './icons';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chatRef.current) {
            try {
                const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY! });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: "You are a friendly and helpful assistant for Scolay, an e-commerce platform for school supplies in Morocco. Answer user questions about the service, how to find supply lists, and the ordering process. Keep your answers concise and helpful.",
                    },
                });
                
                if (messages.length === 0) {
                    setMessages([
                        { role: 'model', content: "Hello! How can I help you with your school supply shopping today?" }
                    ]);
                }
            } catch (error) {
                console.error("Failed to initialize Gemini Chat:", error);
                setMessages([
                    { role: 'model', content: "Sorry, I'm having trouble connecting right now. Please try again later." }
                ]);
            }
        }
    }, [isOpen, messages.length]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading || !chatRef.current) return;

        const userMessage: Message = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: userMessage.content });
            const modelMessage: Message = { role: 'model', content: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Gemini API Error:", error);
            const errorMessage: Message = { role: 'model', content: "Oops! Something went wrong. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-5 right-5 z-50">
    {/* Chat Window */}
    {/* ADDED: "absolute bottom-0 right-0" 
      This pins the window to the bottom-right of the parent.
    */}
    <div className={`absolute bottom-0 right-0 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
            {/* Header */}
            <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
                <h3 className="font-semibold">Scolay Assistant</h3>
                <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded-full">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 rounded-lg px-3 py-2">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-2 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask a question..."
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button type="submit" className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300" disabled={isLoading || !inputValue.trim()}>
                        <SendIcon className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    </div>

    {/* Floating Button */}
    {/* ADDED: "absolute bottom-0 right-0" 
      This pins the button to the same spot as the window.
    */}
    <button
        onClick={() => setIsOpen(true)}
        className={`absolute bottom-0 right-0 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all duration-300 ease-in-out ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open chat"
    >
        <ChatBubbleIcon className="w-7 h-7" />
    </button>
</div>
    );
};

export default Chatbot;
