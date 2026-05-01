import { Search, Bell, User, MapPin } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  language?: 'en' | 'th';
  setLanguage?: (lang: 'en' | 'th') => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  touristSpots?: { name: string, lat: number, lng: number }[];
  onSpotSelect?: (spot: { name: string, lat: number, lng: number }) => void;
}

export function TopBar({ 
  language = 'en', 
  setLanguage,
  searchQuery = '',
  setSearchQuery,
  touristSpots = [],
  onSpotSelect
}: TopBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSpots = touristSpots.filter(spot => 
    spot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-40 shrink-0">
      <div className="flex items-center gap-2 text-primary font-semibold text-lg">
        <span className="md:hidden w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 19-9-9 19-2-8-8-2z"/><path d="M11 13 3 21"/></svg>
        </span>
        <span className="hidden md:inline-block">
        </span>
        <span className="md:hidden inline-block text-base tracking-tight"> Fair Fare</span>
      </div>

      <div className="flex-1 ml-4 md:mx-8 max-w-xl relative">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={language === 'th' ? "ค้นหาสถานที่..." : "Search destination..."} 
            className="w-full pl-9 md:pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all md:placeholder-shown:text-sm placeholder:text-xs"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && searchQuery && filteredSpots.length > 0 && (
          <div className="absolute mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {filteredSpots.map((spot, idx) => (
              <button 
                key={idx}
                onMouseDown={() => onSpotSelect?.(spot)}
                className="w-full px-4 py-3 hover:bg-slate-50 flex items-center gap-3 text-left transition-colors border-b last:border-0 border-slate-100 group"
              >
                <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <MapPin size={16} />
                </div>
                <span className="text-sm text-slate-700 font-medium">{spot.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4 text-neutral ml-2">
        <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200">
            <button 
                onClick={() => setLanguage?.('th')}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'th' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                TH
            </button>
            <button 
                onClick={() => setLanguage?.('en')}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'en' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
                EN
            </button>
        </div>
        
        <button className="hover:text-primary transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-tertiary rounded-full border border-white"></span>
        </button>
        <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-primary transition-colors shrink-0 overflow-hidden bg-slate-50">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}
