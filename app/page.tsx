"use client";
import React, { useState, useEffect } from "react";

function ServiceCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  // Belső állapot a mobil érintéses/kattintásos forgatáshoz
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="group h-64 w-full [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`relative h-full w-full rounded-3xl transition-transform duration-700 [transform-style:preserve-3d] shadow-lg hover:shadow-xl md:group-hover:[transform:rotateY(180deg)] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* Kártya EJE */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm p-6 text-center border border-white/60 [backface-visibility:hidden]">
          <span className="text-5xl mb-4">{icon}</span>
          <h3 className="text-xl font-bold text-[#17394E]">{title}</h3>
          
          {/* Vizuális indikátor a kártya forgatáshoz (Előlap) */}
          <div className="absolute bottom-5 right-5 flex items-center gap-1.5 text-[#4F9FCF] bg-[#4F9FCF]/10 px-3 py-1.5 rounded-full transition-all group-hover:bg-[#4F9FCF]/20">
            <span className="text-[10px] font-bold uppercase tracking-wider">Részletek</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
        
        {/* Kártya HÁTULJA */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-[#4F9FCF] to-[#2E6F97] p-6 text-center [transform:rotateY(180deg)] [backface-visibility:hidden] border border-[#7FBCE4]/50 shadow-inner">
          <span className="text-3xl mb-2 opacity-80">{icon}</span>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-[#F4FBFF] font-medium">{desc}</p>
          
          {/* Vissza indikátor (Hátlap) */}
          <div className="absolute bottom-5 left-5 flex items-center gap-1.5 text-[#A8D6F0] bg-[#A8D6F0]/10 px-3 py-1.5 rounded-full transition-all hover:bg-[#A8D6F0]/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 animate-pulse">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-wider">Vissza</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function getOnCallStatus(): { isOpen: boolean; label: string; timeText: string } {
  const now = new Date();
  const budapestTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Budapest" })
  );
  const month = budapestTime.getMonth() + 1;
  const date = budapestTime.getDate();
  const day = budapestTime.getDay();
  const hour = budapestTime.getHours();
  const minute = budapestTime.getMinutes();
  const totalMinutes = hour * 60 + minute;

  // 1. KIVÉTEL: Március 14-15. Ünnepi nyitvatartás (09:00 - 15:00)
  if (month === 3 && (date >= 12 && date <= 15)) {
    const isActuallyHoliday = (date === 14 || date === 15);
    const isInHolidayHours = isActuallyHoliday && totalMinutes >= 540 && totalMinutes < 900;
    
    if (isInHolidayHours) {
      return { 
        isOpen: true, 
        label: "Ünnepi Ügyelet Nyitva",
        timeText: "03.14 - 03.15: 09:00 - 15:00"
      };
    }
    return { 
      isOpen: false, 
      label: "Jelenleg nem folyik ügyeleti ellátás",
      timeText: "03.14 - 03.15: 09:00 - 15:00"
    };
  }

  // 2. NORMÁL REND: Hétvége (07:00 - 13:00)
  const isSatOrSun = day === 0 || day === 6;
  const isInHours = totalMinutes >= 420 && totalMinutes < 780;

  if (isSatOrSun && isInHours) {
    return { 
      isOpen: true, 
      label: "Esztergomi Lakosok Ügyelete",
      timeText: "Szo - Vas: 07:00 - 13:00"
    };
  }
  return { 
    isOpen: false, 
    label: "Jelenleg nem folyik ügyeleti ellátás",
    timeText: "Szo - Vas: 07:00 - 13:00"
  };
}

export default function App() {
  const [dentalData, setDentalData] = useState<any>(null);
  const [status, setStatus] = useState({ isOpen: false, label: "Kiszámolás alatt...", timeText: "..." });

  useEffect(() => {
    setStatus(getOnCallStatus());
  }, []);

  useEffect(() => {
    async function fetchSupabaseData() {
      let supabaseUrl = "";
      let supabaseKey = "";
      
      try {
        if (typeof process !== "undefined" && process.env) {
          supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
          supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
        }
      } catch (err) {
        console.warn("Környezeti változók nem elérhetők.");
      }

      if (!supabaseUrl || !supabaseKey) return;

      try {
        const res = await fetch(
          `${supabaseUrl}/rest/v1/on_call?service_type=eq.dental&select=*`,
          {
            headers: {
              apikey: supabaseKey,
              Authorization: `Bearer ${supabaseKey}`,
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setDentalData(data[0]);
        }
      } catch (e) {
        console.error("Hiba az adatok lekérésekor:", e);
      }
    }

    fetchSupabaseData();
  }, []);

  const name = dentalData?.name || "Crown Dental Kft.";
  const address = dentalData?.address || "2500 Esztergom, Petőfi Sándor utca 11.";
  const phone = "06 30 589 2468";
  const mapsUrl = "https://maps.app.goo.gl/1bnCmbFnTZGTRJeQA";

  const services = [
    { title: "Fogeltávolítás", desc: "Sürgősségi extrakció panaszos, nem menthető fogak esetén.", icon: "🦷" },
    { title: "Vérzéscsillapítás", desc: "Vérzések profi ellátása és megszüntetése.", icon: "🩸" },
    { title: "Idegentest-eltávolítás", desc: "Beékelődött tárgyak vagy ételmaradékok szakszerű eltávolítása.", icon: "🔍" },
    { title: "Törött fog lecsiszolása", desc: "Éles, vágó felületek korrekciója a nyelv és lágyrész védelmében.", icon: "💎" },
    { title: "Gyökércsatorna megnyitása", desc: "Feszítő fájdalom megszüntetése gyulladt fogak trepanálásával.", icon: "⚡" },
    { title: "Diagnosztika & Röntgen", desc: "Csak akkor, ha ez szükséges a kezeléshez.", icon: "📸" },
  ];

  return (
    <main className="relative min-h-screen bg-[#F4FBFF] text-[#17394E] flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex-grow pb-16">
        {/* 1. NAVIGATION */}
        <div style={{ position: 'absolute', top: '1rem', left: 0, right: 0, zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1rem', gap: '0.5rem', pointerEvents: 'none' }}>
          <nav className="bg-[#7FBCE4]/95 backdrop-blur-md text-[#17394E] py-3 px-6 md:px-8 rounded-full shadow-2xl flex items-center gap-4 md:gap-8 border border-[#A8D6F0]/60" style={{ pointerEvents: 'auto' }}>
            <div className="flex items-center gap-3 font-bold tracking-tighter text-lg border-r border-[#4F9FCF]/50 pr-4 md:pr-6 uppercase shrink-0" style={{ fontFamily: "'DM Serif Display', serif" }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Esztergom_c%C3%ADmere.jpg" alt="Esztergom" className="h-9 w-auto rounded-sm object-contain" />
              Esztergom
            </div>

            <div className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest text-[#245A78]">
              <a href="/esztergomi-lakosok" className="hover:text-[#0F2B3D] hover:scale-110 transition-all">Esztergomi Lakosok</a>
            </div>

            <div className="bg-[#4F9FCF] h-2 w-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(79,159,207,0.9)] shrink-0"></div>
          </nav>

          <div className="flex md:hidden gap-2 flex-wrap justify-center" style={{ pointerEvents: 'auto' }}>
            <a href="/esztergomi-lakosok" className="bg-[#6EB5DE]/95 backdrop-blur-md text-[#17394E] hover:text-[#0F2B3D] hover:bg-[#5DA9D5] text-[11px] font-semibold uppercase tracking-widest px-4 py-2 rounded-full border border-[#A8D6F0]/60 shadow-lg transition-all">
              Esztergomi Lakosok
            </a>
          </div>
        </div>

        {/* 2. HERO SECTION */}
        <section className="relative min-h-[100dvh] md:min-h-[85vh] w-full flex flex-col items-center justify-center text-center overflow-hidden pt-44 pb-36 md:pt-40 md:pb-48">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#2E6F97]/80 via-[#7FBCE4]/30 to-[#F4FBFF] pointer-events-none z-10"></div>
            <img src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=1974&auto=format&fit=crop" alt="Rendelő" className="w-full h-full object-cover relative z-0" />
          </div>

          <div className="relative z-20 w-full max-w-[95vw] xl:max-w-[85vw] px-4 md:px-6 mt-8 md:mt-12 flex flex-col items-center">
            <h1 className="flex justify-between items-center w-full text-[7.5vw] sm:text-[6.5vw] md:text-[5.5vw] lg:text-[4.8vw] whitespace-nowrap text-white mb-6 md:mb-8 tracking-tight leading-tight font-bold drop-shadow-xl">
              <span>Fogorvosi</span>
              <span>Ügyeleti</span>
              <span>Ellátás</span>
            </h1>

            <div className="mx-auto rounded-3xl border border-red-300/60 bg-red-500/30 px-6 py-5 md:px-8 shadow-2xl backdrop-blur-md w-full max-w-4xl">
              <p className="text-[11px] sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-wide text-white leading-relaxed drop-shadow-md">
                A sürgősségi ellátás csak érvényes esztergomi lakcímkártya esetében térítésmentes!
              </p>
            </div>
          </div>
        </section>

        {/* 3. FLOATING GLASS ISLAND CARD */}
        <section className="max-w-4xl mx-auto -mt-24 relative z-20 px-4">
          <div className="rounded-[3.5rem] p-8 md:p-12 border border-white/30" style={{ background: "rgba(255, 255, 255, 0.45)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", boxShadow: "0 8px 60px rgba(23, 57, 78, 0.12), 0 2px 20px rgba(23, 57, 78, 0.06), inset 0 1px 0 rgba(255,255,255,0.6)" }}>
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
              <div className="flex items-center gap-3 bg-[#DCEFFA]/70 px-5 py-2 rounded-full">
                <span className="relative flex h-3 w-3">
                  {status.isOpen ? (
                    <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></>
                  ) : (
                    <><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></>
                  )}
                </span>
                <span className={`text-xs font-bold uppercase tracking-wider ${status.isOpen ? "text-[#245A78]" : "text-red-700"}`}>{status.label}</span>
              </div>
              <div className="text-center md:text-right">
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1 font-bold">Rendelési idő</p>
                <p className="text-sm font-semibold text-[#245A78] bg-white/60 px-4 py-1 rounded-full shadow-sm inline-block">{status.timeText}</p>
              </div>
            </div>

            <div className="text-center flex flex-col items-center">
              <p className="text-xs uppercase tracking-[0.4em] text-[#6AAFD8] mb-4 font-bold">Ügyeletet Ellátja</p>
              <h2 className="text-4xl md:text-6xl text-[#17394E] mb-8 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>{name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <div className="bg-white/40 p-6 rounded-3xl border border-white/50 flex items-center gap-4 text-left group hover:bg-white/70 hover:shadow-md transition">
                  <span className="text-2xl opacity-50 transition-opacity">📍</span>
                  <div><p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Helyszín</p><p className="text-sm font-medium">{address}</p></div>
                </div>
                <div className="bg-white/40 p-6 rounded-3xl border border-white/50 flex items-center gap-4 text-left group hover:bg-white/70 hover:shadow-md transition">
                  <span className="text-2xl opacity-50 transition-opacity">📞</span>
                  <div><p className="text-[10px] uppercase font-bold text-stone-400 tracking-widest">Telefonszám</p><p className="text-sm font-bold text-[#4B97C7]">{phone}</p></div>
                </div>
              </div>
              <a href={mapsUrl} target="_blank" className="mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#17394E] hover:text-[#4B97C7] transition group">
                Útvonaltervezés indítása <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* 4. SZOLGÁLTATÁSOK */}
        <section className="max-w-6xl mx-auto mt-28 px-4 text-center">
          <h2 className="text-4xl mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>Sürgősségi Ellátásaink</h2>
          <div className="h-1 w-12 bg-[#7FBCE4] mx-auto rounded-full mb-16"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((s, i) => <ServiceCard key={i} title={s.title} desc={s.desc} icon={s.icon} />)}
          </div>
        </section>
      </div>

      <footer className="bg-[#17394E] text-white pt-16 pb-12 px-6 md:px-12 mt-10 rounded-t-[3rem] border-t border-[#2E6F97]/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <div className="flex items-center gap-3 font-bold text-xl uppercase mb-5" style={{ fontFamily: "'DM Serif Display', serif" }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Esztergom_c%C3%ADmere.jpg" alt="Esztergom" className="h-10 w-auto rounded-sm bg-white/10 p-1" />
              Esztergomi Ügyelet
            </div>
            <p className="text-[#A8D6F0] text-sm leading-relaxed">Sürgősségi fogászati ellátás kizárólag Esztergom lakosai számára.</p>
          </div>
          <div>
            <h4 className="text-[#7FBCE4] font-bold uppercase text-xs mb-6">Elérhetőségek</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">📍 <span className="text-white/90">{address}</span></li>
              <li className="flex items-center gap-3">📞 <span className="text-white font-bold">{phone}</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#7FBCE4] font-bold uppercase text-xs mb-6">Információk</h4>
            <p className="text-sm text-[#A8D6F0] mb-2">Üzemeltető: <strong>{name}</strong></p>
            <p className="text-sm text-[#A8D6F0]">Támogató: <strong>Esztergom Város Önkormányzata</strong></p>
          </div>
        </div>
      </footer>
    </main>
  );
}
