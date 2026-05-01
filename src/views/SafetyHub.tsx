import { ShieldAlert, PhoneCall, MapPin, AlertTriangle, ArrowRight, CheckCircle2, Navigation, Loader2, X } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState, useEffect } from 'react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function SafetyHub({ 
  setActiveTab, 
  setInitialChatPrompt,
  language = 'en'
}: { 
  setActiveTab?: (tab: string) => void, 
  setInitialChatPrompt?: (prompt: string | null) => void,
  language?: 'en' | 'th'
}) {
  const defaultCenter: [number, number] = [13.746, 100.53];
  const [currentLocation, setCurrentLocation] = useState<[number, number]>(defaultCenter);
  const [locationName, setLocationName] = useState(language === 'th' ? "เขตปทุมวัน, กรุงเทพฯ" : "Pathum Wan, Bangkok");
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
          setLocationName(language === 'th' ? "ตำแหน่งปัจจุบันของคุณ" : "Your Current Location");
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    }
  }, [language]);

  const t = {
    title: language === 'th' ? "ความช่วยเหลือฉุกเฉิน" : "Emergency Assistance",
    touristPolice: language === 'th' ? "ตำรวจท่องเที่ยว" : "Tourist Police",
    touristPoliceDesc: language === 'th' ? "เจ้าหน้าที่ช่วยเหลือนักท่องเที่ยว (พูดภาษาอังกฤษได้)" : "English speaking assistance for foreigners.",
    medicalEmergency: language === 'th' ? "ฉุกเฉินทางการแพทย์" : "Medical Emergency",
    medicalEmergencyDesc: language === 'th' ? "เรียกรถพยาบาลและกู้ภัยเร่งด่วน" : "Ambulance and urgent medical response.",
    generalPolice: language === 'th' ? "แจ้งเหตุด่วนเหตุร้าย" : "General Police",
    generalPoliceDesc: language === 'th' ? "แจ้งเหตุด่วน (ภาษาไทยเป็นหลัก)" : "Local police dispatch (Thai primary).",
    currentLoc: language === 'th' ? "ตำแหน่งปัจจุบัน" : "Current Location",
    gpsActive: language === 'th' ? "ระบบ GPS ทำงาน" : "GPS Active",
    nearestPolice: language === 'th' ? "สถานีตำรวจที่ใกล้ที่สุด" : "Nearest Police Station",
    scamsTitle: language === 'th' ? "กลโกงที่พบบ่อย" : "Common Tourist Scams",
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col">
      
      {/* Header (Wireframe 3) */}
      <div className="p-6 flex justify-between items-center bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <ShieldAlert size={20} />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">{t.title}</h2>
        </div>
        <button 
          onClick={() => setActiveTab && setActiveTab('dashboard')}
          className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        
        {/* Emergency Contacts List (Wireframe 3) */}
        <div className="space-y-4">
          <a 
            href="tel:1155" target="_top"
            className="flex items-center gap-4 bg-white p-5 rounded-[2rem] border-2 border-slate-100 hover:border-red-500 transition-all shadow-sm group active:scale-[0.98]"
          >
            <div className="w-16 h-16 bg-red-600 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200 group-hover:scale-110 transition-transform">
              <ShieldAlert size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-xl text-slate-800 leading-tight">{t.touristPolice}</h3>
              <p className="text-slate-500 text-xs mt-1 font-medium italic">{t.touristPoliceDesc}</p>
            </div>
            <div className="text-red-600 font-black text-2xl tracking-tighter">1155</div>
          </a>

          <a 
            href="tel:1669" target="_top"
            className="flex items-center gap-4 bg-white p-5 rounded-[2rem] border-2 border-slate-100 hover:border-orange-500 transition-all shadow-sm group active:scale-[0.98]"
          >
            <div className="w-16 h-16 bg-orange-500 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
              <PhoneCall size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-xl text-slate-800 leading-tight">{t.medicalEmergency}</h3>
              <p className="text-slate-500 text-xs mt-1 font-medium italic">{t.medicalEmergencyDesc}</p>
            </div>
            <div className="text-orange-500 font-black text-2xl tracking-tighter">1669</div>
          </a>

          <a 
            href="tel:191" target="_top"
            className="flex items-center gap-4 bg-white p-5 rounded-[2rem] border-2 border-slate-100 hover:border-blue-500 transition-all shadow-sm group active:scale-[0.98]"
          >
            <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
              <ShieldAlert size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-xl text-slate-800 leading-tight">{t.generalPolice}</h3>
              <p className="text-slate-500 text-xs mt-1 font-medium italic">{t.generalPoliceDesc}</p>
            </div>
            <div className="text-blue-600 font-black text-2xl tracking-tighter">191</div>
          </a>
        </div>

        {/* Current Location Context */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-10 -mt-10" />
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">{t.currentLoc}</h3>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-primary" />
                    <span className="text-lg font-bold">{locationName}</span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-primary/20 text-primary text-[10px] font-black rounded-full border border-primary/30 uppercase">
                  {t.gpsActive}
                </div>
              </div>
              
              <div className="h-40 rounded-3xl overflow-hidden border border-white/10 mb-6 bg-slate-800">
                <MapContainer center={currentLocation} zoom={14} scrollWheelZoom={false} className="h-full w-full" zoomControl={false}>
                  <TileLayer 
                      attribution='&copy; Google Maps'
                      url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" 
                  />
                  <Marker position={currentLocation}></Marker>
                  <MapUpdater center={currentLocation} />
                </MapContainer>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/search/Police+Station/@${currentLocation[0]},${currentLocation[1]},14z`, '_blank')}
                  className="bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-primary transition-all flex items-center justify-center gap-2"
                >
                  <Navigation size={16} /> {t.nearestPolice.split(' ')[0]}
                </button>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps?q=${currentLocation[0]},${currentLocation[1]}`, '_blank')}
                  className="bg-white/10 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-white/20 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <MapPin size={16} /> GOOGLE MAPS
                </button>
              </div>
           </div>
        </div>

        <div className="pt-4 px-4 pb-8">
           <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={20} className="text-orange-500" />
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{t.scamsTitle}</h3>
           </div>
           <div className="space-y-3">
              <div onClick={() => {
                   if (setInitialChatPrompt) setInitialChatPrompt(language === 'th' ? "มีคนบอกฉันว่าวัดพระแก้วปิด..." : "A friendly local just told me the Grand Palace is closed...");
                   if (setActiveTab) setActiveTab('chatbot');
                }} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:border-primary transition-all cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 text-sm">{language === 'th' ? "กลโกงวัดปิด" : "Grand Palace Scam"}</span>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
              </div>
              <div onClick={() => {
                   if (setInitialChatPrompt) setInitialChatPrompt(language === 'th' ? "มีคนพยายามโน้มน้าวให้ฉันซื้ออัญมณี..." : "Someone is trying to persuade me to buy gems...");
                   if (setActiveTab) setActiveTab('chatbot');
                }} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:border-primary transition-all cursor-pointer group">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700 text-sm">{language === 'th' ? "กลโกงอัญมณี" : "Gem Scam"}</span>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
