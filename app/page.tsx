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

      {/* --- RETRO NEON VERSENY ANIMÁCIÓ (Fűnyírással, kerülgetéssel) --- */}
      {isAnimating && (
        <div className="fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center overflow-hidden">
          {/* Háttér rács */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#22c55e22_1px,transparent_1px),linear-gradient(to_bottom,#22c55e22_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(500px)_rotateX(60deg)] origin-bottom animate-[grid-move_2s_linear_infinite] opacity-60"></div>
          
          <h2 className="absolute top-20 text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 uppercase tracking-widest animate-pulse drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] text-center px-4">
            Ideális Navimow keresése...
          </h2>

          {/* Versenypálya / Kert */}
          <div className="relative w-full h-80 border-y-4 border-green-500/30 flex flex-col justify-evenly bg-gray-900/80 backdrop-blur-sm overflow-hidden shadow-[inset_0_0_50px_rgba(34,197,94,0.1)]">
            
            {/* --- 1. Sáv: Neon Kék (Nekimegy a falnak) --- */}
            <div className="relative w-full h-12">
              {/* Piros téglafal akadály */}
              <div className="absolute top-1 left-[45%] w-8 h-10 bg-red-500/80 border-2 border-red-400 rounded shadow-[0_0_20px_#ef4444] flex flex-col justify-between p-1 z-20">
                <div className="w-full h-1 bg-red-900/50"></div>
                <div className="w-full h-1 bg-red-900/50"></div>
              </div>
              {/* Kék robot */}
              <div className="absolute top-1 left-0 w-24 h-10 bg-gray-800 rounded-lg border-2 border-cyan-400 shadow-[0_0_20px_#22d3ee] animate-[race-crash_4.5s_ease-in-out_forwards] z-30">
                <div className="absolute top-1 right-1 w-4 h-2 bg-cyan-200 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
              </div>
            </div>

            {/* --- 2. Sáv: Neon Sárga (A NYERTES - Kikerüli a fát és lenyírja a füvet) --- */}
            <div className="relative w-full h-12 z-40">
              {/* Zöld neon fa akadály */}
              <div className="absolute top-1 left-[35%] text-4xl drop-shadow-[0_0_15px_#22c55e] z-20">🌲</div>
              
              {/* Lenyírt fű nyomvonal (zöld sáv ami követi a robotot) */}
              <div className="absolute top-2 left-0 h-8 bg-green-500/40 border-y border-green-400/50 shadow-[0_0_15px_#22c55e] rounded-r-full animate-[mow-trail_4.5s_ease-in-out_forwards] z-10"></div>
              
              {/* Sárga nyertes robot (kikerüli a fát) */}
              <div className="absolute top-1 left-0 w-24 h-10 bg-gray-800 rounded-xl border-2 border-yellow-400 shadow-[0_0_30px_#facc15] animate-[race-winner-dodge_4.5s_ease-in-out_forwards] z-30">
                <div className="absolute -bottom-2 left-2 w-6 h-6 border-2 border-yellow-400 rounded-full bg-black shadow-[0_0_10px_#facc15]"></div>
                <div className="absolute -bottom-2 right-2 w-7 h-7 border-2 border-yellow-400 rounded-full bg-black shadow-[0_0_10px_#facc15]"></div>
                <div className="absolute top-1 right-2 w-6 h-2 bg-yellow-200 rounded-full shadow-[0_0_15px_#facc15]"></div>
                {/* Villogó Navimow radar tetején */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* --- 3. Sáv: Neon Rózsaszín (Elakad a magas fűben) --- */}
            <div className="relative w-full h-12">
              {/* Magas fű akadály */}
              <div className="absolute top-0 left-[60%] w-32 h-12 border-l-4 border-r-4 border-green-700/80 repeating-linear-gradient-to-r from-green-800 to-green-600 z-20 opacity-70">
                 <div className="text-green-400 tracking-widest font-bold mt-2 opacity-50 text-center">||||||||</div>
              </div>
              {/* Rózsaszín robot */}
              <div className="absolute top-1 left-0 w-24 h-10 bg-gray-800 rounded-lg border-2 border-pink-500 shadow-[0_0_20px_#ec4899] animate-[race-stuck_4.5s_ease-in-out_forwards] z-30">
                <div className="absolute top-1 right-1 w-4 h-2 bg-pink-200 rounded-full shadow-[0_0_10px_#ec4899]"></div>
              </div>
            </div>

          </div>

          {/* Százalék jelző */}
          <div className="absolute bottom-6 left-0 w-full text-center z-50">
            <span className="text-[#ff5a00] font-black text-3xl md:text-4xl tracking-widest drop-shadow-[0_0_15px_rgba(255,90,0,0.8)]">
              {progress}%
            </span>
          </div>

          {/* Töltőcsík alul */}
          <div className="absolute bottom-0 left-0 w-full h-3 bg-gray-900">
            <div className="h-full bg-[#ff5a00] shadow-[0_0_20px_#ff5a00] animate-[load-bar_4.5s_linear_forwards]"></div>
          </div>

          <style>{`
            @keyframes grid-move {
              0% { background-position: 0 0; }
              100% { background-position: 0 4rem; }
            }
            @keyframes load-bar {
              0% { width: 0%; }
              100% { width: 100%; }
            }
            /* Sárga Nyertes: Kikerüli a fát (felugrik, visszamegy), majd elhúz */
            @keyframes race-winner-dodge {
              0% { transform: translate(-150px, 0); }
              25% { transform: translate(calc(35vw - 100px), 0); }
              35% { transform: translate(calc(35vw - 50px), -40px) rotate(-10deg); } /* Kikerülés fel */
              45% { transform: translate(calc(35vw + 50px), -40px) rotate(10deg); }
              55% { transform: translate(calc(35vw + 100px), 0) rotate(0deg); } /* Visszatérés a sávba */
              100% { transform: translate(120vw, 0); }
            }
            /* Lenyírt fű nyomvonal (követi a sárga robotot) */
            @keyframes mow-trail {
              0% { width: 0; }
              25% { width: calc(35vw - 50px); }
              55% { width: calc(35vw + 100px); }
              100% { width: 120vw; }
            }
            /* Kék: Nekimegy a falnak és megáll */
            @keyframes race-crash {
              0% { transform: translate(-150px, 0); }
              35% { transform: translate(calc(45vw - 110px), 0); }
              38% { transform: translate(calc(45vw - 110px), -5px); } /* Ütközés rázkódás */
              40% { transform: translate(calc(45vw - 110px), 5px); }
              42% { transform: translate(calc(45vw - 110px), 0); }
              100% { transform: translate(calc(45vw - 110px), 0); }
            }
            /* Rózsaszín: Belassul és elakad a fűben */
            @keyframes race-stuck {
              0% { transform: translate(-150px, 0); }
              40% { transform: translate(calc(60vw - 50px), 0); }
              60% { transform: translate(calc(60vw - 10px), 0); } /* Lelassul */
              100% { transform: translate(calc(60vw), 0); } /* Megáll */
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
