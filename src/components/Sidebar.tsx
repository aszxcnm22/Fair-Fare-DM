import { cn } from "../lib/utils";
import { LayoutDashboard, MessageSquare, ShieldAlert, Wallet, Settings, HelpCircle, MapPin } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language?: 'en' | 'th';
}

export function Sidebar({ activeTab, setActiveTab, language = 'en' }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: language === 'th' ? "แดชบอร์ด" : "Dashboard", icon: LayoutDashboard },
    { id: "chatbot", label: language === 'th' ? "แชทบอท" : "AI Chatbot", icon: MessageSquare },
    { id: "safety", label: language === 'th' ? "คลังความปลอดภัย" : "Safety Hub", icon: ShieldAlert },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
          <MapPin size={24} className="fill-current text-white/20" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-primary-dark leading-tight">
            {language === 'th' ? <>ค่าโดย<br/>สารยุติธรรม</> : <>Fair Fare</>}
          </h1>
          <p className="text-[10px] text-neutral uppercase tracking-wider mt-1">
            {language === 'th' ? "เพื่อนร่วมทางที่ชาญฉลาดของคุณ" : "Your Wise Local Companion"}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left",
                isActive 
                  ? "bg-primary-light text-primary font-medium" 
                  : "text-neutral hover:bg-slate-50 hover:text-primary"
              )}
            >
              <Icon size={20} className={isActive ? "text-primary" : "text-neutral"} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 mt-auto">
        <button 
          onClick={() => setActiveTab('settings')}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 text-sm text-left",
            activeTab === 'settings' ? "bg-slate-100 text-primary font-medium" : "text-neutral hover:bg-slate-50 hover:text-primary"
          )}
        >
          <Settings size={18} />
          {language === 'th' ? "ตั้งค่า" : "Settings"}
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral hover:bg-slate-50 hover:text-primary transition-all duration-200 text-sm text-left">
          <HelpCircle size={18} />
          {language === 'th' ? "ช่วยเหลือ" : "Support"}
        </button>
        
        <a href="tel:1155" target="_top" className="w-full flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-tertiary text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm text-center">
          <span className="font-bold">SOS</span> {language === 'th' ? "แจ้งเหตุฉุกเฉิน" : "Emergency SOS"}
        </a>
      </div>
    </aside>
  );
}
