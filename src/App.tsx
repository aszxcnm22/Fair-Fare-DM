/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './views/Dashboard';
import { Chatbot } from './views/Chatbot';
import { SafetyHub } from './views/SafetyHub';
import { Settings as SettingsView } from './views/Settings';
import { LayoutDashboard, MessageSquare, ShieldAlert, Settings } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mapRoute, setMapRoute] = useState<string | null>(null);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'th'>('th');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpot, setSelectedSpot] = useState<{lat: number, lng: number, name: string} | null>(null);

  const handleSetMapRoute = (route: string | null) => {
    setMapRoute(route);
    if (route) {
      setSelectedSpot(null);
      setSearchQuery('');
    }
  };

  const touristSpots = [
    { name: language === 'th' ? 'พระบรมมหาราชวัง' : 'Grand Palace, Bangkok', lat: 13.7500, lng: 100.4913 },
    { name: language === 'th' ? 'ตลาดนัดจตุจักร' : 'Chatuchak Weekend Market', lat: 13.8040, lng: 100.5484 },
    { name: language === 'th' ? 'วัดอรุณราชวราราม' : 'Wat Arun', lat: 13.7437, lng: 100.4889 },
    { name: language === 'th' ? 'สยามพารากอน' : 'Siam Paragon', lat: 13.7468, lng: 100.5346 },
    { name: language === 'th' ? 'เอเชียทีค' : 'Asiatique The Riverfront', lat: 13.7042, lng: 100.5034 }
  ];

  const handleSpotSelect = (spot: {lat: number, lng: number, name: string}) => {
    setSelectedSpot(spot);
    setSearchQuery(spot.name);
    setActiveTab('dashboard');
  };

  const navItems = [
    { id: "dashboard", label: language === 'th' ? "แดชบอร์ด" : "Dashboard", icon: LayoutDashboard },
    { id: "chatbot", label: language === 'th' ? "แชทบอท" : "Chatbot", icon: MessageSquare },
    { id: "safety", label: language === 'th' ? "ความปลอดภัย" : "Safety", icon: ShieldAlert },
    { id: "settings", label: language === 'th' ? "ตั้งค่า" : "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
      </div>
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64 relative w-full border-0">
        <TopBar 
          language={language} 
          setLanguage={setLanguage} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          touristSpots={touristSpots}
          onSpotSelect={handleSpotSelect}
        />
        
        <div className="flex-1 overflow-hidden relative pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 font-sans">
          {activeTab === 'dashboard' && (
            <Dashboard 
              setActiveTab={setActiveTab} 
              mapRoute={mapRoute} 
              setMapRoute={handleSetMapRoute} 
              language={language}
              selectedSpot={selectedSpot}
              setSelectedSpot={setSelectedSpot}
            />
          )}
          {activeTab === 'chatbot' && <Chatbot setActiveTab={setActiveTab} setMapRoute={handleSetMapRoute} initialPrompt={initialChatPrompt} setInitialPrompt={setInitialChatPrompt} language={language} />}
          {activeTab === 'safety' && <SafetyHub setActiveTab={setActiveTab} setInitialChatPrompt={setInitialChatPrompt} language={language} />}
          {activeTab === 'settings' && <SettingsView language={language} setLanguage={setLanguage} />}
        </div>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex items-center justify-around px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
           {navItems.map((item) => {
             const Icon = item.icon;
             const isActive = activeTab === item.id;
             return (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={cn(
                   "flex flex-col items-center justify-center w-full h-16 space-y-1 transition-colors",
                   isActive ? "text-primary" : "text-slate-400 hover:text-slate-600"
                 )}
               >
                 <Icon size={20} className={isActive ? "fill-primary/10" : ""} />
                 <span className="text-[10px] font-medium">{item.label}</span>
               </button>
             );
           })}
        </div>
      </main>
    </div>
  );
}
