import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Mic, Send } from 'lucide-react';
import { generateAIAdvice } from '../lib/calculations';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Money Mentor. Ask me anything about personal finance, investments, tax saving, or budgeting. I\'m here to help!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [age, setAge] = useState(25);
  const [income, setIncome] = useState(50000);
  const [expenses, setExpenses] = useState(30000);
  const [savings, setSavings] = useState(100000);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    const advice = generateAIAdvice(income, expenses, savings, age, input);
    const assistantMessage: Message = { role: 'assistant', content: advice };

    setTimeout(() => {
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[600px]">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-6 h-6 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-800">AI Money Mentor</h2>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <input
          type="number"
          placeholder="Income"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <input
          type="number"
          placeholder="Expenses"
          value={expenses}
          onChange={(e) => setExpenses(Number(e.target.value))}
          className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <input
          type="number"
          placeholder="Savings"
          value={savings}
          onChange={(e) => setSavings(Number(e.target.value))}
          className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 rounded-lg p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about investments, tax saving, SIP, budgeting..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <button
          onClick={toggleVoiceInput}
          className={`p-3 rounded-lg transition-colors ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
          title="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

      {isListening && (
        <p className="text-sm text-red-600 mt-2 text-center animate-pulse">
          Listening... Speak now
        </p>
      )}
    </div>
  );
}
