import { MessageCircle, Send, ShoppingCart, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Message = {
  id: number;
  type: "user" | "bot";
  text: string;
};

type ProductContext = {
  id?: number | string;
  name?: string;
  price?: number | string;
  stockQuantity?: number;
  seller?: string;
};

const ChatWidget: React.FC<{ product?: ProductContext }> = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showBubblePopup, setShowBubblePopup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show bubble popup on component mount (website load)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubblePopup(true);
    }, 3000); // Show popup after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Auto-hide popup after 6 seconds
  useEffect(() => {
    if (showBubblePopup) {
      const timer = setTimeout(() => {
        setShowBubblePopup(false);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [showBubblePopup]);

  // Reset chat state when closing the widget
  useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setInputText("");
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const navigate = useNavigate();

  // Follow project convention: check sessionStorage first then localStorage for accessToken
  const isAuthenticated = () => !!sessionStorage.getItem("accessToken") || !!localStorage.getItem("accessToken");

  const redirectToLogin = () => {
    // Use react-router navigation like other pages (BuyerDashboard)
    navigate("/login");
  };

  // Dummy server call: simulates 300ms server read and returns an object with several keys
  const sendToServer = async (message: string): Promise<Record<string, string>> => {
    // In a real app you'd POST to something like `/api/buyer/products/${product?.id}/chat`
    // Here we simulate latency and return a predictable object
    await new Promise((r) => setTimeout(r, 300));
    return {
      buyer: `Buyer note received: ${message}`,
      seller: `Seller reply for product ${product?.id ?? 'unknown'}: we will check.`,
      support: `Support record created for message: "${message}"`
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const text = inputText.trim();
    setInputText("");

    const userMessage: Message = {
      id: messageIdRef.current++,
      type: 'user',
      text,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Send to dummy server (passes product id implicitly)
      const resp = await sendToServer(text);

      // Turn each returned field into a bot message
      const botMessages: Message[] = Object.entries(resp).map(([k, v]) => ({
        id: messageIdRef.current++,
        type: 'bot',
        text: `${k}: ${v}`,
      }));

      setMessages(prev => [...prev, ...botMessages]);
    } catch (err) {
      console.error('Chat send error', err);
      const errorMessage: Message = {
        id: messageIdRef.current++,
        type: 'bot',
        text: 'Unable to send message right now. Please try again later.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-xl shadow-2xl w-80 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#cd2733]/20 to-[#7c3aed]/20 p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <h3 className="text-gray-900 font-bold">ShobShopping Assistant</h3>
                  <p className="text-xs text-gray-600">Support • Fast answers about this product</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white text-lg hover:cursor-pointer"
              >
                <X />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white"
                      : "bg-gray-50 text-gray-900"
                  }`}
                >
                  {message.type === "bot" ? (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  ) : (
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#cd2733] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#7c3aed] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#f97316] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="p-4 border-t border-gray-700">
            {isAuthenticated() ? (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={product?.name ? `Ask about "${product.name}" — e.g. is it in stock?` : "Ask about this product, delivery or returns..."}
                  disabled={isLoading}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="px-3 py-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-4">
                <div className="text-sm text-gray-700">Please log in to chat about this product.</div>
                <button
                  onClick={redirectToLogin}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Login
                </button>
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">
              ShobShopping Support Service
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center hover:cursor-pointer relative"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </button>
    </div>
  );
};

export default ChatWidget;
