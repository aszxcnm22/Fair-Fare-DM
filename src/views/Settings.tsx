import { Globe, Moon, Bell, Shield, User } from "lucide-react";

interface SettingsProps {
  language: 'en' | 'th';
  setLanguage: (lang: 'en' | 'th') => void;
}

export function Settings({ language, setLanguage }: SettingsProps) {
  const t = {
    title: language === 'th' ? "การตั้งค่า" : "Settings",
    language: language === 'th' ? "ภาษา" : "Language",
    appearance: language === 'th' ? "รูปลักษณ์" : "Appearance",
    notifications: language === 'th' ? "การแจ้งเตือน" : "Notifications",
    privacy: language === 'th' ? "ความเป็นส่วนตัว" : "Privacy",
    account: language === 'th' ? "บัญชี" : "Account",
    en: language === 'th' ? "อังกฤษ" : "English",
    th: language === 'th' ? "ไทย" : "Thai",
    darkMode: language === 'th' ? "โหมดมืด" : "Dark Mode",
    comingSoon: language === 'th' ? "เร็วๆ นี้" : "Coming Soon",
  };

  return (
    <div className="h-full p-4 md:p-8 overflow-y-auto max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-8">{t.title}</h2>

      <div className="space-y-6">
        {/* Language Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
              <Globe size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{t.language}</h3>
              <p className="text-xs text-slate-500">Select your preferred interface language</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setLanguage('en')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                language === 'en' 
                  ? 'border-primary bg-primary-light text-primary' 
                  : 'border-slate-100 hover:border-slate-200 text-slate-600'
              }`}
            >
              <span className="text-2xl">🇺🇸</span>
              <span className="font-medium">{t.en}</span>
            </button>
            <button
              onClick={() => setLanguage('th')}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                language === 'th' 
                  ? 'border-primary bg-primary-light text-primary' 
                  : 'border-slate-100 hover:border-slate-200 text-slate-600'
              }`}
            >
              <span className="text-2xl">🇹🇭</span>
              <span className="font-medium">{t.th}</span>
            </button>
          </div>
        </section>

        {/* Other sections (Mocked for UI) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                    <Moon size={20} className="text-indigo-500" />
                    <h3 className="font-semibold text-slate-800">{t.appearance}</h3>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-slate-600">{t.darkMode}</span>
                    <div className="w-10 h-6 bg-slate-200 rounded-full relative">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>
                <p className="text-[10px] text-primary font-medium mt-4">{t.comingSoon}</p>
            </section>

            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                    <Bell size={20} className="text-orange-500" />
                    <h3 className="font-semibold text-slate-800">{t.notifications}</h3>
                </div>
                <div className="text-sm text-slate-600 mt-4">Manage alerts and messages</div>
                <p className="text-[10px] text-primary font-medium mt-4">{t.comingSoon}</p>
            </section>

            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                    <Shield size={20} className="text-emerald-500" />
                    <h3 className="font-semibold text-slate-800">{t.privacy}</h3>
                </div>
                <div className="text-sm text-slate-600 mt-4">Security and data control</div>
                <p className="text-[10px] text-primary font-medium mt-4">{t.comingSoon}</p>
            </section>

            <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                    <User size={20} className="text-sky-500" />
                    <h3 className="font-semibold text-slate-800">{t.account}</h3>
                </div>
                <div className="text-sm text-slate-600 mt-4">Profile and preferences</div>
                <p className="text-[10px] text-primary font-medium mt-4">{t.comingSoon}</p>
            </section>
        </div>
      </div>
    </div>
  );
}
