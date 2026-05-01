import { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Folder, MessageSquare, Plus, Hospital, UtensilsCrossed, AlertOctagon, Bot, User as UserIcon, History, X, Navigation, Trash2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { getGenAI, SYSTEM_INSTRUCTION } from '../lib/gemini';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
  image?: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

export function ChatInterface({ 
  setActiveTab, 
  setMapRoute, 
  initialPrompt, 
  setInitialPrompt,
  language = 'en',
  showSidebars = true
}: { 
  setActiveTab?: (tab: string) => void, 
  setMapRoute?: (route: string) => void,
  initialPrompt?: string | null,
  setInitialPrompt?: (prompt: string | null) => void,
  language?: 'en' | 'th',
  showSidebars?: boolean
}) {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('thailand-copilot-sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          return parsed.map((s: any) => ({
            ...s,
            updatedAt: new Date(s.updatedAt)
          }));
        }
      } catch (e) {
        console.error("Failed to parse sessions from local storage", e);
      }
    }
    return [{
      id: 'default',
      title: language === 'th' ? 'การสนทนาปัจจุบัน' : 'Current Chat',
      messages: [
        {
          role: 'model',
          content: language === 'th' 
            ? 'สวัสดีค่ะ! ฉันคือผู้ช่วยส่วนตัวสำหรับการเดินทางในไทยของคุณ มีอะไรให้ฉันช่วยวันนี้ไหมคะ? ฉันสามารถช่วยเรื่องการแปลภาษา ข้อมูลฉุกเฉิน การวางแผนงบประมาณ หรือเคล็ดลับคนท้องถิ่นได้ค่ะ' 
            : 'Sawasdee ka! I am your Thai Travel Copilot. How can I help you today? I can help with real-time translation, emergency support, budgeting, or local tips.'
        }
      ],
      updatedAt: new Date()
    }];
  });

  const t = {
    history: language === 'th' ? "ประวัติการสนทนา" : "History",
    conversations: language === 'th' ? "การสนทนา" : "Conversations",
    topicFolders: language === 'th' ? "หัวข้อแนะนำ" : "Topic Folders",
    allergies: language === 'th' ? "ความแพ้และสุขภาพ" : "Allergies & Health",
    safety: language === 'th' ? "กลโกงและความปลอดภัย" : "Scams & Safety",
    etiquette: language === 'th' ? "มารยาทและวัฒนธรรม" : "Cultural Etiquette",
    budgeting: language === 'th' ? "การจัดการงบประมาณ" : "Budgeting",
    recent: language === 'th' ? "ล่าสุด" : "Recent",
    newChat: language === 'th' ? "แชทใหม่" : "New Chat",
    placeholder: language === 'th' ? "พิมพ์ข้อความหรืออัปโหลดรูปภาพ..." : "Type your response or upload a photo...",
    mistakeWarning: language === 'th' ? "AI อาจให้ข้อมูลผิดพลาดได้ โปรดตรวจสอบข้อมูลที่เป็นทางการอีกครั้ง" : "AI can make mistakes. Verify critical health or safety information.",
    suggestions: language === 'th' ? "คำแนะนำอัจฉริยะ" : "Smart Suggestions",
    warning: language === 'th' ? "คำเตือนสำคัญ" : "CRITICAL WARNING",
    routeGenerated: language === 'th' ? "สร้างเส้นทางแบบอินเทอร์แอกทีฟแล้ว" : "Interactive Route Generated",
    viewFullMap: language === 'th' ? "ดูแผนที่ฉบับเต็ม" : "View Full Map",
    currentLocation: language === 'th' ? "ตำแหน่งปัจจุบัน" : "Current Location",
    destination: language === 'th' ? "จุดหมายปลายทาง" : "Destination",
  };
  
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return localStorage.getItem('thailand-copilot-current-session') || 'default';
  });

  useEffect(() => {
    localStorage.setItem('thailand-copilot-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('thailand-copilot-current-session', currentSessionId);
    }
  }, [currentSessionId]);
  
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession.messages;

  const setMessages = (newMessages: Message[] | ((prev: Message[]) => Message[])) => {
    setSessions(prevSessions => prevSessions.map(session => {
      if (session.id === currentSessionId) {
        const updatedMessages = typeof newMessages === 'function' ? newMessages(session.messages) : newMessages;
        
        let newTitle = session.title;
        // Auto-generate title from first user message
        if (session.messages.length === 1 && updatedMessages.length > 1 && updatedMessages[1].role === 'user') {
          newTitle = updatedMessages[1].content.slice(0, 25) + '...';
        }

        return {
          ...session,
          title: newTitle,
          messages: updatedMessages,
          updatedAt: new Date()
        };
      }
      return session;
    }));
  };

  const createNewChat = () => {
    const newId = Date.now().toString();
    setSessions(prev => [
      {
        id: newId,
        title: language === 'th' ? 'แชทใหม่' : 'New Chat',
        messages: [
          {
            role: 'model',
            content: language === 'th' ? 'สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ?' : 'Sawasdee ka! How can I help you today?'
          }
        ],
        updatedAt: new Date()
      },
      ...prev
    ]);
    setCurrentSessionId(newId);
    if (window.innerWidth < 1024) {
      setShowHistory(false);
    }
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => {
      const remaining = prev.filter(s => s.id !== id);
      if (remaining.length === 0) {
        const newId = Date.now().toString();
        setCurrentSessionId(newId);
        return [{
            id: newId,
            title: language === 'th' ? 'แชทใหม่' : 'New Chat',
            messages: [
              {
                role: 'model',
                content: language === 'th' 
                  ? 'สวัสดีค่ะ! ฉันคือผู้ช่วยส่วนตัวสำหรับการเดินทางในไทยของคุณ มีอะไรให้ฉันช่วยวันนี้ไหมคะ?' 
                  : 'Sawasdee ka! I am your Thai Travel Copilot. How can I help you today?'
              }
            ],
            updatedAt: new Date()
        }];
      } else if (currentSessionId === id) {
        setCurrentSessionId(remaining[0].id);
      }
      return remaining;
    });
  };

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<{file: File, base64: string} | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedPromptRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSelectedImage({ file, base64 });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const sendMessage = async (text: string, imageObj?: {file: File, base64: string} | null) => {
    if ((!text.trim() && !imageObj) || isLoading) return;

    const userMsg: Message = { role: 'user', content: text, image: imageObj?.base64 };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const ai = getGenAI();
      const newMessages = [...currentSession.messages, userMsg];
      
      const contents = newMessages.map(msg => {
        const parts: any[] = [];
        if (msg.content) {
          parts.push({ text: msg.content });
        }
        if (msg.image) {
          const mimeType = msg.image.substring(msg.image.indexOf(":")+1, msg.image.indexOf(";"));
          const base64Data = msg.image.split(',')[1];
          parts.push({ inlineData: { data: base64Data, mimeType } });
        }
        return {
          role: msg.role,
          parts
        };
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });
      
      setMessages(prev => [...prev, { role: 'model', content: response.text || 'Sorry, I couldn\'t generate a response.' }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      let errorMessage = 'An error occurred while communicating with the AI. Please ensure your API key is configured correctly.';
      const errStr = error?.message || String(error);
      if (errStr.includes('high demand')) {
        errorMessage = 'The AI model is currently experiencing high demand. Please wait a moment and try again.';
      } else if (error?.status === 429 || errStr.includes('429') || errStr.includes('quota')) {
        errorMessage = 'You have exceeded your Gemini API quota limit. Please try again later or check your billing details.';
      }
      setMessages(prev => [...prev, { role: 'model', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    const imageToSend = selectedImage;
    removeImage();
    await sendMessage(userMessage, imageToSend);
  };

  const handleSuggestionClick = (prompt: string) => {
    if (window.innerWidth < 1024) {
      setShowHistory(false);
    }
    sendMessage(prompt);
  };

  useEffect(() => {
    if (initialPrompt) {
      if (!isLoading && processedPromptRef.current !== initialPrompt) {
        processedPromptRef.current = initialPrompt;
        sendMessage(initialPrompt);
        if (setInitialPrompt) {
          setInitialPrompt(null);
        }
      }
    } else {
      processedPromptRef.current = null;
    }
  }, [initialPrompt, isLoading, setInitialPrompt]);

  const renderMessageContent = (content: string): React.ReactNode => {
    const routeRegex = /\[MAP_ROUTE:\s*(.*?)\]/;
    const match = content.match(routeRegex);
    
    if (match) {
      const parts = content.split(match[0]);
      const routeRaw = match[1];
      const locations = routeRaw.split('->').map(s => s.trim());
      
      return (
        <>
          {parts[0] && renderMessageContent(parts[0])}
          <div className="my-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <Navigation size={18} className="text-primary" />
               <h4 className="font-bold text-slate-800 text-sm">{t.routeGenerated}</h4>
             </div>
             <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
               <div className="relative">
                 <div className="absolute -left-6 bg-blue-500 w-3 h-3 rounded-full outline outline-4 outline-blue-50 mt-1"></div>
                 <p className="text-sm font-semibold text-slate-800">{locations[0]}</p>
                 <p className="text-xs text-slate-500">{t.currentLocation}</p>
               </div>
               <div className="relative">
                 <div className="absolute -left-6 bg-red-500 w-3 h-3 rounded-full outline outline-4 outline-red-50 mt-1"></div>
                 <p className="text-sm font-semibold text-slate-800">{locations[1]}</p>
                 <p className="text-xs text-slate-500">{t.destination}</p>
               </div>
             </div>
             <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => {
                     setMapRoute && setMapRoute(routeRaw);
                     setActiveTab && setActiveTab('dashboard');
                  }}
                  className="flex-1 bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 transition shadow-sm text-center cursor-pointer active:scale-[0.98]"
                >
                  {t.viewFullMap}
                </button>
             </div>
          </div>
          {parts[1] && renderMessageContent(parts[1])}
        </>
      );
    }

    const warningRegex = /\[WARNING_CRITICAL:\s*(.*?)\]/;
    const warningMatch = content.match(warningRegex);
    if (warningMatch) {
       const parts = content.split(warningMatch[0]);
       return (
        <>
          {parts[0] && <Markdown>{parts[0]}</Markdown>}
          <div className="my-4 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
             <div className="flex items-start gap-3">
               <div className="bg-red-100 text-red-600 p-2 rounded-xl shrink-0 mt-0.5">
                  <AlertOctagon size={20} />
               </div>
               <div>
                 <h4 className="font-bold text-red-800 text-sm">{t.warning}</h4>
                 <div className="text-red-700 text-sm mt-1 leading-relaxed"><Markdown>{warningMatch[1]}</Markdown></div>
               </div>
             </div>
          </div>
          {parts[1] && <Markdown>{parts[1]}</Markdown>}
        </>
       );
    }

    return <Markdown>{content}</Markdown>;
  };

  return (
    <div className={cn(
      "h-full p-0 flex flex-col gap-4 md:gap-6 bg-slate-50 relative",
      showSidebars ? "sm:p-4 md:p-6 lg:grid lg:grid-cols-4" : "w-full"
    )}>
      
      {/* Left Sidebar - Topic Folders */}
      {showSidebars && (
        <div className={cn(
          "flex-col gap-6 h-full overflow-y-auto bg-slate-50 lg:bg-transparent absolute lg:static inset-0 z-30 p-4 lg:p-0 transition-transform duration-300 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0",
          showHistory ? "flex translate-x-0" : "hidden lg:flex lg:translate-x-0"
        )}>
          {/* Mobile Header for History */}
          <div className="lg:hidden flex justify-between items-center mb-2 pb-2 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-lg">{t.history}</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 bg-slate-200 rounded-full text-slate-600"><X size={18}/></button>
          </div>
          <div>
             <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="font-semibold text-sm text-slate-500 uppercase tracking-wider">{t.conversations}</h3>
              <button onClick={createNewChat} className="text-primary hover:bg-primary-light p-1 rounded transition-colors"><Plus size={16}/></button>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-slate-400 px-2 py-2 uppercase tracking-wide">{t.topicFolders}</div>
              <button onClick={() => handleSuggestionClick('What are the critical points about Allergies & Health in Thailand?')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-white rounded-xl transition-colors font-medium">
                <Folder size={18} className="text-tertiary" /> {t.allergies}
              </button>
              <button onClick={() => handleSuggestionClick('What are the common Scams & Safety concerns in Thailand?')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-white rounded-xl transition-colors font-medium">
                <Folder size={18} className="text-secondary" /> {t.safety}
              </button>
              <button onClick={() => handleSuggestionClick('What is the general Cultural Etiquette in Thailand?')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-white rounded-xl transition-colors font-medium">
                <Folder size={18} className="text-primary" /> {t.etiquette}
              </button>
              <button onClick={() => handleSuggestionClick('How can I better manage my Budgeting in Thailand?')} className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-white rounded-xl transition-colors font-medium">
                <Folder size={18} className="text-green-600" /> {t.budgeting}
              </button>
            </div>
          </div>

          <div>
              <div className="text-xs font-semibold text-slate-400 px-2 py-2 uppercase tracking-wide">{t.recent}</div>
              <div className="space-y-2">
                  {sessions.map(session => (
                      <div 
                        key={session.id}
                        onClick={() => {
                           setCurrentSessionId(session.id);
                           if (window.innerWidth < 1024) setShowHistory(false);
                        }} 
                        className={cn(
                          "rounded-xl p-3 cursor-pointer transition-colors border group relative",
                          currentSessionId === session.id 
                            ? "bg-primary-light/50 border-primary/10" 
                            : "hover:bg-white border-transparent hover:border-slate-200"
                        )}
                      >
                          <div className="flex items-center justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2 overflow-hidden">
                                  <MessageSquare size={14} className={currentSessionId === session.id ? "text-primary shrink-0" : "text-slate-400 shrink-0"}/>
                                  <span className={cn(
                                    "text-sm truncate",
                                    currentSessionId === session.id ? "font-semibold text-slate-800" : "font-medium text-slate-700"
                                  )}>
                                    {session.title}
                                  </span>
                              </div>
                              <button
                                onClick={(e) => deleteChat(e, session.id)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all flex-shrink-0"
                                title="Delete chat"
                              >
                                 <Trash2 size={14} />
                              </button>
                          </div>
                          <p className={cn("text-[10px]", currentSessionId === session.id ? "text-slate-500" : "text-slate-400")}>
                            {session.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className={cn(
        "bg-white sm:rounded-3xl border-0 sm:border border-slate-200 sm:shadow-sm flex flex-col overflow-hidden relative h-full",
        showSidebars ? "lg:col-span-2" : "w-full"
      )}>
        
        {/* Mobile top bar for chat */}
        <div className="lg:hidden flex items-center justify-between p-3 border-b border-slate-100 bg-white shrink-0 shadow-sm z-10">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Bot size={18} /> Thai Travel Copilot
            </div>
            <button 
                onClick={() => setShowHistory(true)} 
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
            >
                <History size={14} /> {t.history}
            </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                msg.role === 'user' ? "bg-slate-100 text-slate-600" : "bg-secondary text-white"
              )}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={18} />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl",
                msg.role === 'user' 
                  ? "bg-primary text-white rounded-tr-sm" 
                  : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-sm"
              )}>
                <div className={cn("prose prose-sm max-w-none", msg.role === 'user' ? "prose-invert" : "")}>
                    {msg.image && (
                      <div className="mb-2">
                         <img src={msg.image} alt="Uploaded content" className="w-48 h-auto rounded-lg object-cover" />
                      </div>
                    )}
                    {msg.content && renderMessageContent(msg.content)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[85%]">
               <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center shrink-0 mt-1">
                <Bot size={18} />
              </div>
              <div className="bg-slate-50 border border-slate-100 text-slate-800 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2">
          {selectedImage && (
             <div className="relative inline-block ml-2 self-start ring-1 ring-slate-200 rounded-lg p-1 bg-slate-50">
                <img src={selectedImage.base64} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                <button 
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-0.5 hover:bg-slate-700 transition"
                >
                  <X size={14} />
                </button>
             </div>
          )}

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full p-2 pr-3">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-primary transition-colors"
            >
              <ImageIcon size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.placeholder} 
              className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2"
            />
            <button 
              onClick={handleSend}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Send size={18} className="translate-x-px translate-y-px" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            {t.mistakeWarning}
          </p>
        </div>
      </div>

      {/* Right Sidebar - Smart Suggestions */}
      {showSidebars && (
        <div className="hidden lg:flex flex-col gap-4 h-full overflow-y-auto">
          <div className="flex items-center gap-2 mb-2 text-slate-800">
              <span className="text-secondary"><Bot size={20}/></span>
              <h3 className="font-semibold">{t.suggestions}</h3>
          </div>

          <div onClick={() => handleSuggestionClick('Find nearest hospital')} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-orange-200 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                  <div className="bg-orange-50 text-orange-500 p-2 rounded-xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Hospital size={18} />
                  </div>
                  <div>
                      <h4 className="font-semibold text-sm text-slate-800">Find Nearest Hospital</h4>
                      <p className="text-xs text-slate-500 mt-1">Locate international hospitals equipped for severe allergic reactions.</p>
                  </div>
              </div>
          </div>

           <div onClick={() => handleSuggestionClick('Safe Thai dishes to eat')} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="flex items-start gap-3">
                  <div className="bg-blue-50 text-blue-500 p-2 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <UtensilsCrossed size={18} />
                  </div>
                  <div>
                      <h4 className="font-semibold text-sm text-slate-800">Safe Thai Dishes</h4>
                      <p className="text-xs text-slate-500 mt-1">Generate a list of 100% peanut-free traditional Thai meals.</p>
                  </div>
              </div>
          </div>

          <div className="mt-6">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Trending Safety Topics</div>
              <div onClick={() => handleSuggestionClick('Identify common Tuk-Tuk scams')} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-tertiary-light transition-colors cursor-pointer group">
                  <div className="flex items-start gap-3">
                      <div className="bg-tertiary-light text-tertiary p-2 rounded-full shrink-0">
                          <AlertOctagon size={16} />
                      </div>
                      <div>
                          <h4 className="font-semibold text-sm text-slate-800 -mt-0.5">Common Tuk-Tuk Scams</h4>
                          <p className="text-xs text-slate-500 mt-1">Learn how to avoid overcharging and forced shopping detours.</p>
                      </div>
                  </div>
              </div>
          </div>

          <div className="mt-6">
              <div className="text-xs font-bold text-[#E53E3E] uppercase tracking-wide mb-3 flex items-center gap-1"><AlertOctagon size={14}/> Test Scenario Guide</div>
              <div className="space-y-2">
                 <div onClick={() => handleSuggestionClick("I want to go to Andaman Bay, but I don't know where the pier is. How do I get there like a local? I don't want to get scammed by taxis again.")} className="bg-red-50 border border-red-100 rounded-xl p-3 shadow-sm hover:border-red-300 transition-colors cursor-pointer group">
                     <h4 className="font-semibold text-xs text-red-800">1. Transportation Plan</h4>
                     <p className="text-[10px] text-red-600 mt-1">Test map trigger & scam warning</p>
                 </div>
                 <div onClick={() => handleSuggestionClick("I saw this street food. Can I fly my drone near the village and do I need to take my shoes off?")} className="bg-red-50 border border-red-100 rounded-xl p-3 shadow-sm hover:border-red-300 transition-colors cursor-pointer group">
                     <h4 className="font-semibold text-xs text-red-800">2. Drone & Etiquette</h4>
                     <p className="text-[10px] text-red-600 mt-1">Test local laws & guidelines</p>
                 </div>
              </div>
          </div>

          <div className="mt-auto bg-slate-100 p-4 rounded-xl flex items-start gap-3 text-slate-500">
              <AlertOctagon size={16} className="shrink-0 mt-0.5" />
              <p className="text-xs">Suggestions dynamically update based on your conversation context to keep you safe.</p>
          </div>
        </div>
      )}
    </div>
  );
}
