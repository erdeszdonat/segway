"use client";
import { useState, useEffect } from 'react';

export default function SegwayKalkulator() {
  const [isPartner, setIsPartner] = useState(false);
  const [eredmeny, setEredmeny] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPartner(params.get('partner') === '1');
  }, []);

  const szamolas = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const meret = Number(formData.get('meret'));
    const lejto = Number(formData.get('lejto'));
    const arnyekolt = formData.get('arnyekolt') === 'igen';

    let modell = "";
    let link = "";
    let indoklas = "";

    // LOGIKA A 14 TÍPUSHOZ
    if (meret <= 500) {
      if (lejto <= 30) {
        modell = "Segway Navimow i105E";
        link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-i105e";
        indoklas = "Kisebb kertekhez ez a legoptimálisabb választás, okos kamerás akadályelkerüléssel.";
      } else {
        modell = "Segway Navimow H500E";
        link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-h500e";
        indoklas = "A meredek lejtő miatt a nagyobb kapaszkodóképességű H-széria szükséges a stabil működéshez.";
      }
    } 
    else if (meret <= 800) {
      if (lejto <= 30) {
        modell = "Segway Navimow i108E";
        link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-i108e";
        indoklas = "Az okos i-széria nagyobb akkumulátoros változata, tökéletes közepes kertekhez 800 m²-ig.";
      } else {
        modell = "Segway Navimow H800E";
        link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-h800e";
        indoklas = "Meredekebb, tagolt kertbe a H-széria 800 m²-es típusát javasoljuk.";
      }
    }
    else if (meret <= 1500) {
      modell = arnyekolt ? "Segway Navimow H1500E + VisionFence" : "Segway Navimow H1500E";
      link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-h1500e";
      indoklas = arnyekolt ? "A fák/falak miatt a VisionFence kamera elengedhetetlen a pontos navigációhoz." : "Nagy teljesítményű, robusztus gép közepes és nagy kertekbe.";
    }
    else if (meret <= 3000) {
      modell = arnyekolt ? "Segway Navimow H3000E + VisionFence" : "Segway Navimow H3000E";
      link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-h3000e";
      indoklas = "A legnagyobb kapacitású csúcsmodell, amely megbirkózik a legnagyobb területekkel is.";
    }
    else {
      modell = "Ipari megoldás / Több robot";
      indoklas = "Ekkora területre érdemes több gépben vagy ipari Segway megoldásban gondolkodni a hatékonyság érdekében.";
      link = "https://robot1.hu/robotfunyirok/segway-navimow";
    }

    // Animáció indítása
    setIsAnimating(true);
    setEredmeny(null);
    setProgress(0);

    // Százalékos számláló (0-100% kipörgetése)
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 1;
      if (currentProgress <= 100) {
        setProgress(currentProgress);
      }
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 44); // 44ms * 100 = ~4.4 másodperc alatt ér a végére

    // 4.5 másodperc múlva jelenik meg az eredmény ablak
    setTimeout(() => {
      clearInterval(progressInterval);
      setIsAnimating(false);
      setEredmeny({ modell, link, indoklas });
    }, 4500); 
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 md:p-8 font-sans bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/hatter.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* --- FŐ KALKULÁTOR ŰRLAP --- */}
      <main className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden border border-white/40">
        
        <div className="bg-gradient-to-r from-[#ff5a00] to-[#e04f00] p-8 md:p-10 text-white text-center shadow-inner">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic">
            Navimow Szakértő
          </h1>
          <p className="mt-2 text-orange-100 font-medium text-sm md:text-base tracking-wide">
            Találja meg a kertjéhez tökéletes robotfűnyírót másodpercek alatt!
          </p>
        </div>
        
        <form onSubmit={szamolas} className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Kert mérete</label>
              <div className="relative">
                <input name="meret" type="number" placeholder="Pl. 500" required 
                  className="w-full pl-5 pr-12 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-lg outline-none placeholder:text-gray-400 placeholder:font-normal shadow-sm" />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">m²</span>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Max. Lejtő</label>
              <div className="relative">
                <input name="lejto" type="number" placeholder="Pl. 25" required 
                  className="w-full pl-5 pr-12 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-lg outline-none placeholder:text-gray-400 placeholder:font-normal shadow-sm" />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">GPS árnyékoltság (Vannak magas fák/falak?)</label>
              <select name="arnyekolt" className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-base outline-none cursor-pointer shadow-sm appearance-none">
                <option value="nem" className="font-medium">Nincsenek, teljesen tiszta a terep</option>
                <option value="igen" className="font-medium">Vannak magasabb fák és/vagy falak</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Település</label>
              <input name="telepules" type="text" placeholder="Pl. Esztergom" required 
                className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-base outline-none placeholder:text-gray-400 placeholder:font-normal shadow-sm" />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">E-mail cím</label>
              <input name="email" type="email" placeholder="nev@email.hu" required 
                className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-base outline-none placeholder:text-gray-400 placeholder:font-normal shadow-sm" />
            </div>

            {isPartner && (
              <div className="flex flex-col md:col-span-2 mt-2">
                <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border-2 border-blue-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                  <label className="text-xs font-black text-blue-700 uppercase tracking-widest mb-3 block">Telefonszám (Ingyenes Visszahíváshoz)</label>
                  <input name="telefon" type="tel" placeholder="+36 30 123 4567" required 
                    className="w-full px-5 py-4 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 font-bold text-lg outline-none placeholder:text-gray-400 shadow-inner" />
                </div>
              </div>
            )}

            <div className="md:col-span-2 mt-4">
              <button type="submit" 
                className="w-full bg-[#111] text-white py-5 px-6 rounded-xl font-black text-lg uppercase tracking-[0.2em] hover:bg-[#ff5a00] hover:shadow-[0_10px_30px_rgba(255,90,0,0.4)] transform active:scale-[0.98] transition-all duration-300">
                Mutasd az ideális gépet
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* --- KÜLÖN ABLAK (MODAL) AZ EREDMÉNYNEK --- */}
      {eredmeny && !isAnimating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_0_60px_rgba(255,90,0,0.3)] border border-orange-500/20 overflow-hidden animate-in zoom-in-95 duration-500">
            
            {/* Bezáró X */}
            <button 
              onClick={() => setEredmeny(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="bg-gradient-to-br from-[#ff5a00] to-orange-400 p-8 text-center text-white">
              <span className="inline-block bg-white/20 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 backdrop-blur-md">
                A Te géped
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-md">
                {eredmeny.modell}
              </h2>
            </div>
            
            <div className="p-8 text-center">
              <p className="text-base text-gray-700 font-medium leading-relaxed mb-8">
                {eredmeny.indoklas}
              </p>
              
              <a href={eredmeny.link} target="_blank" rel="noreferrer" 
                className="w-full flex items-center justify-center gap-2 px-8 py-5 bg-[#111] text-white rounded-xl font-black text-lg uppercase tracking-wider hover:bg-[#ff5a00] hover:shadow-[0_10px_30px_rgba(255,90,0,0.4)] transform active:scale-[0.98] transition-all">
                Megnézem a terméket
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
              
              <p className="mt-6 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                {isPartner 
                  ? "✓ Kérését rögzítettük, szakértőnk hamarosan hívja!" 
                  : "✓ Keresse fel a legközelebbi Segway márkakereskedőt!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- PRÉMIUM ELEMZŐ ANIMÁCIÓ --- */}
      {isAnimating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="flex flex-col items-center max-w-lg w-full animate-in slide-in-from-bottom-4 duration-500">
            
            {/* Szofisztikált GPS / Radar betöltő */}
            <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#ff5a00] rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute w-10 h-10 bg-[#ff5a00]/20 rounded-full animate-ping"></div>
              <svg className="w-8 h-8 text-[#ff5a00] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest text-center mb-8 drop-shadow-lg">
              Ideális Navimow keresése...
            </h2>

            {/* Elegáns Százalék és Töltőcsík Kártya */}
            <div className="w-full bg-white/10 p-6 md:p-8 rounded-3xl border border-white/20 backdrop-blur-xl shadow-2xl">
              <div className="flex justify-between items-end mb-4">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Kerti adatok elemzése</span>
                <span className="text-4xl font-black text-[#ff5a00] drop-shadow-md">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#ff5a00] to-orange-400 rounded-full transition-all duration-[50ms] ease-linear"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
