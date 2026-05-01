import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  AlertTriangle, Users, Store, Banknote, ShieldPlus, 
  ChevronRight, MessageSquare, MapPin, Navigation, 
  Search, CloudRain, Flame, Menu, X, Share2, Plus, Minus,
  Car, Train, Footprints, RotateCcw, ArrowRight, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { ChatInterface } from '../components/ChatInterface';
// Fix for missing marker icons in leaflet
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

export function Dashboard({ 
  setActiveTab, 
  mapRoute, 
  setMapRoute,
  language = 'en',
  selectedSpot,
  setSelectedSpot
}: { 
  setActiveTab?: (tab: string) => void, 
  mapRoute?: string | null, 
  setMapRoute?: (route: string | null) => void,
  language?: 'en' | 'th',
  selectedSpot?: {lat: number, lng: number, name: string} | null,
  setSelectedSpot?: (spot: {lat: number, lng: number, name: string} | null) => void
}) {
  
  const translations = {
    en: {
      searchPlaceholder: "Search destination...",
      recommendedSpots: "Recommended Tourist Spots",
      crowdHeatmap: "Crowd Heatmap",
      rainViewer: "Rain Viewer",
      weatherWarning: "General Weather Warning",
      weatherWarningDesc: "Monitor the rain viewer map. Click on blue zones for details.",
      selectArea: "Select an area on the map",
      insightsTitle: "Area Insights",
      crowdLevel: "Crowd Level",
      marketStatus: "Market/Area Status",
      tipHeatmap: "Tip: Click on heatmap zones for details.",
      touristNeeds: "Common Tourist Needs",
      findAtm: "Find ATM",
      pharmacy: "Pharmacy",
      policeTitle: "Nearest Police Station",
      policeDesc: "Tap to navigate using current location",
      aiChat: "AI Copilot Chat",
      aiChatDesc: "Get translation or travel advice",
      currentPos: "Current Location",
      destination: "Destination",
      navigatingTo: "Navigating to",
      lightRain: "Light Rain Expected",
      drizzle: "Drizzle",
      heavyStorm: "Heavy Thunderstorm",
      moderate: "Moderate",
      highCrowd: "High Crowd Area",
      findIndoor: "Find Indoor Spots",
      weatherInfo: "Weather Information",
      openInMaps: "Open in Google Maps",
      hiddenGems: "Nearby Hidden Gems",
      safeRoute: "Safe Route Recommendation",
      peakHours: "Peak Hours (Busy)",
      normalTraffic: "Normal Foot Traffic",
      extremelyCrowded: "Extremely Crowded",
      seekShelter: "Seek indoor shelter immediately",
      weatherAdvice: "Weather Advice",
      crowdAdvice: "Crowd Insight",
    },
    th: {
      searchPlaceholder: "ค้นหาสถานที่...",
      recommendedSpots: "สถานที่ท่องเที่ยวแนะนำ",
      crowdHeatmap: "แผนที่ความหนาแน่น",
      rainViewer: "เรดาร์น้ำฝน",
      weatherWarning: "คำเตือนสภาพอากาศทั่วไป",
      weatherWarningDesc: "ติดตามแผนที่เรดาร์น้ำฝน คลิกที่โซนสีฟ้าเพื่อดูรายละเอียด",
      selectArea: "เลือกพื้นที่บนแผนที่",
      insightsTitle: "ข้อมูลเชิงลึกเฉพาะจุด",
      crowdLevel: "ความหนาแน่น",
      marketStatus: "สถานะพื้นที่/ตลาด",
      tipHeatmap: "คำแนะนำ: คลิกที่โซนความหนาแน่นเพื่อดูข้อมูล",
      touristNeeds: "สิ่งจำเป็นสำหรับนักท่องเที่ยว",
      findAtm: "หาตู้ ATM",
      pharmacy: "ร้านยา",
      policeTitle: "สถานีตำรวจที่ใกล้ที่สุด",
      policeDesc: "กดเพื่อนำทางโดยใช้ตำแหน่งปัจจุบัน",
      aiChat: "คุยกับ AI Copilot",
      aiChatDesc: "รับความช่วยเหลือด้านภาษาหรือคำแนะนำ",
      currentPos: "ตำแหน่งปัจจุบัน",
      destination: "จุดหมายปลายทาง",
      navigatingTo: "กำลังนำทางไป",
      lightRain: "คาดว่าฝนจะตกเล็กน้อย",
      drizzle: "ฝนปรอยๆ",
      heavyStorm: "พายุฝนฟ้าคะนองรุนแรง",
      moderate: "ปานกลาง",
      highCrowd: "พื้นที่หนาแน่นสูง",
      findIndoor: "หาที่พักในร่ม",
      weatherInfo: "ข้อมูลสภาพอากาศ",
      openInMaps: "เปิดใน Google Maps",
      hiddenGems: "สถานที่ลับใกล้เคียง",
      safeRoute: "แนะนำเส้นทางที่ปลอดภัย",
      peakHours: "ช่วงเวลาเร่งด่วน (คนเยอะ)",
      normalTraffic: "การสัญจรปกติ",
      extremelyCrowded: "หนาแน่นมากเป็นพิเศษ",
      seekShelter: "กรุณาหาที่หลบในอาคารทันที",
      weatherAdvice: "คำแนะนำสภาพอากาศ",
      crowdAdvice: "ข้อมูลฝูงชน",
    }
  };

  const t = translations[language];

    const isPhuketSafeRoute = mapRoute?.includes('Old Phuket Town');
    const isPhuketOriginalRoute = mapRoute?.includes('Bang Rong');
    const isPhuketRoute = isPhuketSafeRoute || isPhuketOriginalRoute;
    const isBangkokSafeRoute = mapRoute?.includes('Lumpini');
    
    const isThaiGemRoute = mapRoute?.includes('Talad Noi');
    const isPhuketGemRoute = mapRoute?.includes('Old Phuket Town'); // We reuse phuket safe route as gem route here for simplicity or define specialized one
    const isGemRoute = isThaiGemRoute || isPhuketGemRoute;

    const phuketSafePositions: [number, number][] = [
      [7.8961, 98.2974], // Patong
      [7.8920, 98.3300],
      [7.8837, 98.3910]  // Old Town
    ];

    const phuketOriginalPositions: [number, number][] = [
      [7.8961, 98.2974],
      [7.8980, 98.3200],
      [7.8804, 98.3923],
      [7.9500, 98.3900],
      [8.0487, 98.4149]
    ];

    const bangkokSafePositions: [number, number][] = [
      [13.7500, 100.4913], // Grand Palace
      [13.7440, 100.5100],
      [13.7314, 100.5416]  // Lumpini Park
    ];

    const taladNoiPositions: [number, number][] = [
        [13.7500, 100.4913],
        [13.7450, 100.5050],
        [13.7380, 100.5130] // Talad Noi
    ];

    function MapAutoCenter({ positions, active }: { positions: [number, number][], active: boolean }) {
      const map = useMap();
      useEffect(() => {
        if (active && positions.length > 0) {
          const bounds = L.latLngBounds(positions);
          map.fitBounds(bounds, { padding: [50, 50], animate: true });
        }
      }, [active, positions, map]);
      return null;
    }
  const defaultBangkokCenter: [number, number] = [13.7563, 100.5018];
  
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultBangkokCenter);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [resetCount, setResetCount] = useState(0);

  // Helper to sync user location
  const syncLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          setMapCenter(coords);
          setZoomLevel(15);
          setResetCount(prev => prev + 1); // Force MapUpdater trigger
        },
        (error) => {
          console.error("Error getting location:", error);
          // Only fallback if no location already set
          if (!userLocation) {
            setMapCenter(defaultBangkokCenter);
            setZoomLevel(13);
          }
          setResetCount(prev => prev + 1);
        },
        { enableHighAccuracy: true }
      );
    }
  };

  // Get current location on mount
  useEffect(() => {
    syncLocation();
  }, []);

  useEffect(() => {
    if (isPhuketRoute) {
      setMapCenter([7.96, 98.35]);
      setZoomLevel(11);
    } else if (isBangkokSafeRoute || isThaiGemRoute) {
      setMapCenter([13.74, 100.51]);
      setZoomLevel(14);
    }
  }, [isPhuketRoute, isBangkokSafeRoute, isThaiGemRoute]);

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showRain, setShowRain] = useState(true);
  
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showRouteInfo, setShowRouteInfo] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navStep, setNavStep] = useState(0);

  const currentRoutePositions = isThaiGemRoute ? taladNoiPositions : (isPhuketSafeRoute ? phuketSafePositions : (isPhuketOriginalRoute ? phuketOriginalPositions : (isBangkokSafeRoute ? bangkokSafePositions : [])));

  useEffect(() => {
    let interval: any;
    if (isNavigating && currentRoutePositions.length > 0) {
      interval = setInterval(() => {
        setNavStep(prev => (prev + 1) % currentRoutePositions.length);
      }, 3000);
    } else {
      setNavStep(0);
    }
    return () => clearInterval(interval);
  }, [isNavigating, currentRoutePositions]);

  const handleActionClick = (filter: string, message: string) => {
    setActiveFilter(filter);
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (mapRoute) {
      setShowRouteInfo(true);
    } else {
      setShowRouteInfo(false);
    }
  }, [mapRoute]);

  // New states for interactivity
  const [selectedAreaInfo, setSelectedAreaInfo] = useState<{name: string, crowdLevel: string, marketStatus: string, color: string} | null>(null);
  const [selectedWeatherInfo, setSelectedWeatherInfo] = useState<{name: string, warning: string, severity: 'heavy' | 'moderate' | 'light', color: string} | null>(null);
  
  useEffect(() => {
    if (selectedSpot) {
      setMapCenter([selectedSpot.lat, selectedSpot.lng]);
      setZoomLevel(15);
      setNotification(`${t.navigatingTo} ${selectedSpot.name}`);
      setTimeout(() => setNotification(null), 3000);
      // We don't null selectedSpot here if we want to keep focusing on it if the prop changes again
      // But typically we might want to clear it if we move the map manually.
    }
  }, [selectedSpot, t.navigatingTo]);

  const indoorLocations = isPhuketRoute ? [
    { name: language === 'th' ? 'ห้างเซ็นทรัล ภูเก็ต' : 'Central Phuket', lat: 7.8918, lng: 98.3681 },
    { name: language === 'th' ? 'จังซีลอน ป่าตอง' : 'Jungceylon Patong', lat: 7.8920, lng: 98.2988 },
    { name: language === 'th' ? 'ภูเก็ต ทริคอาย มิวเซียม' : 'Phuket Trickeye Museum', lat: 7.8837, lng: 98.3934 },
    { name: language === 'th' ? 'บลูทรี ภูเก็ต' : 'Blue Tree Phuket (Indoor Area)', lat: 7.9861, lng: 98.3347 },
  ] : [
    { name: language === 'th' ? 'สยามพารากอน' : 'Siam Paragon', lat: 13.7461, lng: 100.5348 },
    { name: language === 'th' ? 'สยามเซ็นเตอร์' : 'Siam Center', lat: 13.7462, lng: 100.5328 },
    { name: language === 'th' ? 'มาบุญครอง (MBK)' : 'MBK Center', lat: 13.7445, lng: 100.5299 },
    { name: language === 'th' ? 'เซ็นทรัลเวิลด์' : 'CentralWorld', lat: 13.7468, lng: 100.5393 },
    { name: language === 'th' ? 'พิพิธภัณฑสถานแห่งชาติ' : 'National Museum Bangkok', lat: 13.7579, lng: 100.4923 },
    { name: language === 'th' ? 'ไอคอนสยาม' : 'ICONSIAM', lat: 13.7267, lng: 100.5105 },
  ];

  const atmLocations = isPhuketRoute ? [
    { name: 'K-Bank ATM (Patong)', lat: 7.8921, lng: 98.2965 },
    { name: 'SCB ATM (Central Phuket)', lat: 7.8915, lng: 98.3675 },
    { name: 'Bangkok Bank (Phuket Town)', lat: 7.8845, lng: 98.3910 },
  ] : [
    { name: 'K-Bank ATM (Siam Square)', lat: 13.7455, lng: 100.5340 },
    { name: 'SCB ATM (CentralWorld)', lat: 13.7465, lng: 100.5395 },
    { name: 'ATM Bangkok Bank (Grand Palace Area)', lat: 13.7510, lng: 100.4920 },
  ];

  const pharmacyLocations = isPhuketRoute ? [
    { name: 'Boots (Jungceylon Patong)', lat: 7.8925, lng: 98.2990 },
    { name: 'Watsons (Central Phuket)', lat: 7.8910, lng: 98.3685 },
    { name: 'Phuket Town Drugstore', lat: 7.8850, lng: 98.3900 },
  ] : [
    { name: 'Boots (Siam Paragon)', lat: 13.7465, lng: 100.5350 },
    { name: 'Watsons (MBK Center)', lat: 13.7448, lng: 100.5305 },
    { name: 'Fascino Pharmacy (Siriraj)', lat: 13.7570, lng: 100.4860 },
  ];

  const mockLocations = {
    indoors: indoorLocations,
    atms: atmLocations,
    pharmacies: pharmacyLocations
  };

  return (
    <div className="h-full relative overflow-hidden bg-slate-100">
      
      {/* Search Bar / AI Chat Input (Wireframe 1) */}
      <div className="absolute bottom-6 left-0 right-0 z-[1000] px-4 pointer-events-none">
        <div className="max-w-xl mx-auto w-full pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-500 ease-in-out">
            {/* Input area */}
            <div className="p-4 flex items-center gap-3">
               <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder={language === 'th' ? "ไปที่ไหนดี?..." : "Where to?..."}
                 className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                 onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                     // Trigger chatbot with this input
                     setActiveTab && setActiveTab('chatbot');
                   }
                 }}
               />
               <button 
                 onClick={() => setActiveTab && setActiveTab('chatbot')}
                 className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-slate-800 transition-colors"
               >
                 <ArrowRight size={18} />
               </button>
            </div>
            
            {/* Suggested interaction pill */}
            <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
               <button onClick={() => setMapRoute && setMapRoute('Bangkok Safe')} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-tight hover:bg-white hover:border-slate-300 transition-all">
                  Safe Route
               </button>
               <button onClick={() => setShowRain(!showRain)} className={cn("whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all", showRain ? "bg-blue-500 text-white" : "bg-slate-50 text-slate-500 border border-slate-100")}>
                  Rain Viewer
               </button>
               <button onClick={() => setShowHeatmap(!showHeatmap)} className={cn("whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tight transition-all", showHeatmap ? "bg-red-500 text-white" : "bg-slate-50 text-slate-500 border border-slate-100")}>
                  Crowd Meter
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Button (Floating on map) */}
      <div className="absolute bottom-32 right-4 z-[999] flex flex-col gap-3">
          <button 
            onClick={() => setActiveTab && setActiveTab('safety')}
            className="w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-red-700 transition-all active:scale-90 animate-pulse border-4 border-red-100"
          >
            <ShieldAlert size={28} />
          </button>
          
          <button 
            onClick={() => {
              setMapRoute && setMapRoute(null);
              syncLocation();
              setNotification(language === 'th' ? "กำลังกลับไปยังตำแหน่งปัจจุบัน..." : "Returning to your location...");
              setTimeout(() => setNotification(null), 2000);
            }}
            className="w-14 h-14 bg-white text-slate-600 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-all active:scale-90 border border-slate-200"
            title="Recenter Map"
          >
            <RotateCcw size={20} />
          </button>
      </div>

      {/* Map Content */}
      <div className="absolute inset-0 z-0">
        <MapContainer center={mapCenter} zoom={zoomLevel} scrollWheelZoom={true} zoomControl={false} className="h-full w-full">
          <MapUpdater center={mapCenter} zoom={zoomLevel} key={`map-update-${resetCount}`} />
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          />
          
          {/* User Current Location Marker (Pulse Effect) */}
          {userLocation && (
            <Marker 
              key="user-location-marker"
              position={userLocation} 
              zIndexOffset={1000}
              icon={L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="relative flex items-center justify-center w-6 h-6">
                        <div class="absolute w-full h-full bg-blue-500 rounded-full animate-ping opacity-40"></div>
                        <div class="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-md"></div>
                      </div>`,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
              })}
            >
              <Popup className="rounded-xl overflow-hidden font-sans">
                <div className="p-1 font-bold text-slate-800 tracking-tight">{t.currentPos}</div>
              </Popup>
            </Marker>
          )}
          
          {/* Default Marker (Destination/Selected Spot) */}
          {!isPhuketRoute && (!userLocation || Math.abs(mapCenter[0] - userLocation[0]) > 0.0001) && (
            <Marker key="destination-marker" position={mapCenter} />
          )}

          {isThaiGemRoute && (
              <>
                 <MapAutoCenter positions={taladNoiPositions} active={true} />
                 <Polyline positions={taladNoiPositions} color="#f59e0b" weight={5} opacity={0.9} dashArray="10, 10" />
                 <Marker key="talad-noi-start" position={taladNoiPositions[0]} />
                 <Marker key="talad-noi-end" position={taladNoiPositions[taladNoiPositions.length - 1]} />
              </>
            )}

            {isPhuketRoute && (
              <>
                 <MapAutoCenter positions={isPhuketSafeRoute ? phuketSafePositions : phuketOriginalPositions} active={true} />
                 <Polyline positions={isPhuketSafeRoute ? phuketSafePositions : phuketOriginalPositions} color={isPhuketSafeRoute ? "#10b981" : "#3b82f6"} weight={5} opacity={0.9} />
                 <Marker key="phuket-start" position={isPhuketSafeRoute ? phuketSafePositions[0] : phuketOriginalPositions[0]} />
                 <Marker key="phuket-end" position={isPhuketSafeRoute ? phuketSafePositions[phuketSafePositions.length - 1] : phuketOriginalPositions[phuketOriginalPositions.length - 1]} />
              </>
            )}

            {isBangkokSafeRoute && (
              <>
                 <MapAutoCenter positions={bangkokSafePositions} active={true} />
                 <Polyline positions={bangkokSafePositions} color="#10b981" weight={5} opacity={0.9} />
                 <Marker key="bkk-safe-start" position={bangkokSafePositions[0]} />
                 <Marker key="bkk-safe-end" position={bangkokSafePositions[bangkokSafePositions.length - 1]} />
              </>
            )}

            {/* Render dynamically filtered markers */}
            {activeFilter && mockLocations[activeFilter as keyof typeof mockLocations]?.map((loc: any, idx) => (
              <Marker key={`filter-${activeFilter}-${idx}`} position={[loc.lat, loc.lng]}>
                <Popup className="rounded-xl overflow-hidden font-sans">
                  <div className="p-2">
                    <div className="font-bold text-slate-800 tracking-tight">{loc.name}</div>
                    <button 
                      onClick={() => window.open(`https://www.google.com/maps?q=${loc.lat},${loc.lng}`, '_blank')}
                      className="mt-2 text-[10px] bg-primary text-white px-2 py-1 rounded-lg font-bold uppercase"
                    >
                      {t.openInMaps}
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {showHeatmap && (
              <>
                {/* Siam Area */}
                <Circle 
                  key="heatmap-siam-outer"
                  center={[13.746, 100.534]} 
                  pathOptions={{ fillColor: '#ef4444', color: '#ef4444', fillOpacity: 0.35, stroke: false }} 
                  radius={1400} 
                  eventHandlers={{
                    click: () => setSelectedAreaInfo({ 
                      name: language === 'th' ? 'สยามสแควร์' : 'Siam Square', 
                      crowdLevel: language === 'th' ? 'หนาแน่นมาก' : 'Extremely High', 
                      marketStatus: t.peakHours, 
                      color: 'bg-red-500' 
                    })
                  }}
                />
                <Circle key="heatmap-siam-inner" center={[13.746, 100.534]} pathOptions={{ fillColor: '#ef4444', color: '#ef4444', fillOpacity: 0.5, stroke: false }} radius={600} />
                
                {/* Silom Area */}
                <Circle 
                  key="heatmap-silom"
                  center={[13.725, 100.523]} 
                  pathOptions={{ fillColor: '#f97316', color: '#f97316', fillOpacity: 0.3, stroke: false }} 
                  radius={1000} 
                  eventHandlers={{
                    click: () => setSelectedAreaInfo({ 
                      name: language === 'th' ? 'สีลม' : 'Silom', 
                      crowdLevel: t.moderate, 
                      marketStatus: t.normalTraffic, 
                      color: 'bg-orange-500' 
                    })
                  }}
                />
                
                {/* Chatuchak Area */}
                <Circle 
                  key="heatmap-chatuchak"
                  center={[13.804, 100.548]} 
                  pathOptions={{ fillColor: '#ef4444', color: '#ef4444', fillOpacity: 0.3, stroke: false }} 
                  radius={1100} 
                  eventHandlers={{
                    click: () => setSelectedAreaInfo({ 
                      name: language === 'th' ? 'จตุจักร' : 'Chatuchak', 
                      crowdLevel: language === 'th' ? 'สูงมาก' : 'Very High', 
                      marketStatus: language === 'th' ? 'คนเยอะมาก (วันหยุด)' : 'Peak Weekend Crowd', 
                      color: 'bg-red-600' 
                    })
                  }}
                />

                {/* Chinatown Area */}
                <Circle 
                  key="heatmap-chinatown"
                  center={[13.741, 100.508]} 
                  pathOptions={{ fillColor: '#f97316', color: '#f97316', fillOpacity: 0.4, stroke: false }} 
                  radius={800} 
                  eventHandlers={{
                    click: () => setSelectedAreaInfo({ 
                      name: language === 'th' ? 'เยาวราช' : 'Chinatown', 
                      crowdLevel: language === 'th' ? 'สูง' : 'High', 
                      marketStatus: language === 'th' ? 'สตรีทฟู้ดกำลังคึกคัก' : 'Night Market Active', 
                      color: 'bg-orange-600' 
                    })
                  }}
                />
              </>
            )}

            {showRain && (
              <>
                {/* Bang Sue / Northern BKK */}
                <Circle 
                  key="rainbow-northern"
                  center={[13.78, 100.55]} 
                  pathOptions={{ fillColor: '#3b82f6', color: '#3b82f6', fillOpacity: 0.25, stroke: false }} 
                  radius={2000} 
                  eventHandlers={{
                    click: () => setSelectedWeatherInfo({ 
                      name: language === 'th' ? 'บางซื่อ / จตุจักร' : 'Bang Sue / Chatuchak', 
                      warning: language === 'th' ? 'คาดว่าฝนจะตกใน 15 นาที ควรหาที่พักในร่ม' : 'Rain expected in 15 mins. Find shelter.', 
                      severity: 'light', 
                      color: 'text-blue-500' 
                    })
                  }}
                />
                
                {/* Sukhumvit / East BKK */}
                <Circle 
                  key="rainbow-eastern"
                  center={[13.71, 100.60]} 
                  pathOptions={{ fillColor: '#60a5fa', color: '#60a5fa', fillOpacity: 0.2, stroke: false }} 
                  radius={2500} 
                  eventHandlers={{
                    click: () => setSelectedWeatherInfo({ 
                      name: language === 'th' ? 'สุขุมวิท / เอกมัย' : 'Sukhumvit / Ekkamai', 
                      warning: language === 'th' ? 'ฝนกำลังปรอยๆ แนะนำให้พกร่ม' : 'Light drizzle. Umbrella recommended.', 
                      severity: 'moderate', 
                      color: 'text-blue-400' 
                    })
                  }}
                />
                
                {/* Riverside / West BKK */}
                <Circle 
                  key="rainbow-riverside"
                  center={[13.74, 100.48]} 
                  pathOptions={{ fillColor: '#1e3a8a', color: '#1e3a8a', fillOpacity: 0.4, stroke: false }} 
                  radius={1800} 
                  eventHandlers={{
                    click: () => setSelectedWeatherInfo({ 
                      name: language === 'th' ? 'ริมแม่น้ำเจ้าพระยา' : 'Riverside / Thonburi', 
                      warning: language === 'th' ? 'พายุรุนแรง! เลี่ยงการเดินทางทางน้ำ' : 'Heavy Storm! Avoid river travel.', 
                      severity: 'heavy', 
                      color: 'text-blue-800' 
                    })
                  }}
                />
              </>
            )}

             {/* Removed duplicated individual marker logic below to avoid clutter */}
        </MapContainer>
      </div>

       {/* Enhanced Rain/Crowd Overlay visualization */}
       {showRain && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden mix-blend-multiply opacity-20">
            <motion.div 
              animate={{ x: [0, 100, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 blur-[100px] rounded-full"
            />
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm shadow-2xl font-medium animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          {notification}
        </div>
      )}

      <AnimatePresence>
        {selectedAreaInfo && (
          <motion.div 
            key="area-info-card"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-32 left-4 right-4 md:left-6 md:right-auto md:w-80 z-[1002] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className={`h-2 w-full ${selectedAreaInfo.color}`} />
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{t.crowdAdvice}</h3>
                  <h4 className="text-xl font-bold text-slate-800">{selectedAreaInfo.name}</h4>
                </div>
                <button onClick={() => setSelectedAreaInfo(null)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                  <Users size={18} className="text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{t.crowdLevel}</div>
                    <div className="text-sm font-bold text-slate-700">{selectedAreaInfo.crowdLevel}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                  <Flame size={18} className="text-orange-500" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">{t.marketStatus}</div>
                    <div className="text-sm font-bold text-slate-700">{selectedAreaInfo.marketStatus}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedWeatherInfo && (
          <motion.div 
            key="weather-info-card"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-32 left-4 right-4 md:left-6 md:right-auto md:w-80 z-[1002] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="h-2 w-full bg-blue-500" />
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">{t.weatherAdvice}</h3>
                  <h4 className="text-xl font-bold text-slate-800">{selectedWeatherInfo.name}</h4>
                </div>
                <button onClick={() => setSelectedWeatherInfo(null)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={18} className="text-slate-400" />
                </button>
              </div>
              
              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <CloudRain size={20} className={selectedWeatherInfo.color} />
                <p className="text-sm font-medium text-blue-900 leading-relaxed">
                  {selectedWeatherInfo.warning}
                </p>
              </div>
              
              <button 
                onClick={() => {
                  setActiveFilter('indoors');
                  setSelectedWeatherInfo(null);
                  setNotification(language === 'th' ? "กำลังแสดงสถานที่พักในร่มที่ใกล้ที่สุด..." : "Showing nearest indoor spots...");
                }}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                {t.findIndoor}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
