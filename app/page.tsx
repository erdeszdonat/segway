"use client";
import { useState, useEffect } from 'react';

export default function SegwayKalkulator() {
  const [isPartner, setIsPartner] = useState(false);
  const [eredmeny, setEredmeny] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false); // ÚJ: Animáció állapota

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

    // Animáció indítása, és az eredmény késleltetett megjelenítése
    setIsAnimating(true);
    setEredmeny(null); // Eltüntetjük az előző eredményt, ha volt

    setTimeout(() => {
      setIsAnimating(false);
      setEredmeny({ modell, link, indoklas });
    }, 4500); // 4.5 másodperc múlva mutatja meg az eredményt (amikor a verseny véget ér)
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 md:p-8 font-sans bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/hatter.jpg')" }}
    >
      {/* Sötétítő réteg a háttérképre, hogy a kalkulátor "lebegjen" és olvasható maradjon */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      <main className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden border border-white/40">
        
        {/* Fejléc */}
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
            
            {/* Kert mérete */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Kert mérete</label>
              <div className="relative">
                <input name="meret" type="number" placeholder="Pl. 500" required 
                  className="w-full pl-5 pr-12 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-lg outline-none placeholder:text-gray-400 placeholder:font-normal shadow-sm" />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">m²</span>
              </div>
            </div>

            {/* Lejtő */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Max. Lejtő</label>
              <div className="relative">
                <input name="lejto" type="number" placeholder="Pl. 25" required 
                  className="w-full pl-5 pr-12 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-lg outline-none placeholder:text-gray-400 placeholder:font-normal shadow-sm" />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
              </div>
            </div>

            {/* Fák / Falak */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">GPS árnyékoltság (Vannak magas fák/falak?)</label>
              <select name="arnyekolt" className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-base outline-none cursor-pointer shadow-sm appearance-none">
                <option value="nem" className="font-medium">Nincsenek, teljesen tiszta a terep</option>
                <option value="igen" className="font-medium">Vannak magasabb fák és/vagy falak</option>
              </select>
            </div>

            {/* Település */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Település</label>
              <input name="telepules" type="text" placeholder="Pl. Esztergom" required 
                className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-base outline-none placeholder:text-gray-400 placeholder:font-normal shadow-sm" />
            </div>

            {/* E-mail */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">E-mail cím</label>
              <input name="email" type="email" placeholder="nev@email.hu" required 
                className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-base outline-none placeholder:text-gray-400 placeholder:font-normal shadow-sm" />
            </div>

            {/* Partner Extra Mező */}
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

            {/* Gomb */}
            <div className="md:col-span-2 mt-4">
              <button type="submit" 
                className="w-full bg-[#111] text-white py-5 px-6 rounded-xl font-black text-lg uppercase tracking-[0.2em] hover:bg-[#ff5a00] hover:shadow-[0_10px_30px_rgba(255,90,0,0.4)] transform active:scale-[0.98] transition-all duration-300">
                Mutasd az ideális gépet
              </button>
            </div>
          </div>
        </form>

        {/* Eredmény Panel - Látványosan kiemelve */}
        {eredmeny && (
          <div className="mx-6 md:mx-10 mb-10 p-1 bg-gradient-to-br from-[#ff5a00] to-orange-400 rounded-3xl animate-in zoom-in-95 duration-500 shadow-2xl">
            <div className="bg-white rounded-[1.4rem] p-8 text-center h-full">
              <span className="inline-block bg-orange-100 text-[#ff5a00] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
                A Te géped:
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
                {eredmeny.modell}
              </h2>
              <p className="text-base text-gray-600 font-medium leading-relaxed max-w-lg mx-auto mb-8">
                {eredmeny.indoklas}
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <a href={eredmeny.link} target="_blank" rel="noreferrer" 
                  className="w-full md:w-auto px-8 py-4 bg-[#ff5a00] text-white rounded-xl font-bold text-sm md:text-base hover:bg-[#e04f00] hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  Megnézem a Robot1.hu-n
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  {isPartner 
                    ? "✓ Kérését rögzítettük, szakértőnk hamarosan hívja!" 
                    : "✓ Keresse fel a legközelebbi Segway márkakereskedőt!"}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- RETRO NEON VERSENY ANIMÁCIÓ --- */}
      {isAnimating && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden">
          {/* Retro rácsos háttér */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#db277733_1px,transparent_1px),linear-gradient(to_bottom,#db277733_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(500px)_rotateX(60deg)] origin-bottom animate-[grid-move_2s_linear_infinite] opacity-50"></div>
          
          <h2 className="absolute top-20 text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 uppercase tracking-[0.3em] animate-pulse italic drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
            Algoritmus Fut...
          </h2>

          {/* Versenypálya */}
          <div className="relative w-full h-80 border-y-4 border-pink-500/30 flex flex-col justify-evenly bg-gray-900/50 backdrop-blur-sm overflow-hidden shadow-[inset_0_0_50px_rgba(219,39,119,0.3)]">
            
            {/* 1. Versenyző: Neon Kék (Vesztes) */}
            <div className="absolute w-24 h-10 bg-gray-800 rounded-t-2xl rounded-b-lg border-2 border-cyan-400 shadow-[0_0_20px_#22d3ee] animate-[race-loser-1_4.5s_ease-in-out_forwards]">
              <div className="absolute -bottom-3 left-2 w-6 h-6 border-2 border-cyan-400 rounded-full bg-black"></div>
              <div className="absolute -bottom-3 right-2 w-7 h-7 border-2 border-cyan-400 rounded-full bg-black"></div>
              <div className="absolute top-2 right-1 w-4 h-1.5 bg-cyan-200 rounded-full shadow-[0_0_10px_#22d3ee]"></div>
            </div>

            {/* 2. Versenyző: Neon Sárga (A NYERTES - Középen) */}
            <div className="absolute w-24 h-10 bg-gray-800 rounded-t-2xl rounded-b-lg border-2 border-yellow-400 shadow-[0_0_30px_#facc15] z-10 animate-[race-winner_4.5s_ease-in-out_forwards] mt-24">
              <div className="absolute -bottom-3 left-2 w-6 h-6 border-2 border-yellow-400 rounded-full bg-black shadow-[0_0_10px_#facc15]"></div>
              <div className="absolute -bottom-3 right-2 w-7 h-7 border-2 border-yellow-400 rounded-full bg-black shadow-[0_0_10px_#facc15]"></div>
              <div className="absolute top-2 right-1 w-4 h-1.5 bg-yellow-200 rounded-full shadow-[0_0_15px_#facc15]"></div>
              {/* Sebességvonalak a nyertes mögött */}
              <div className="absolute top-1/2 -left-12 w-10 h-0.5 bg-yellow-400/80 rounded-full shadow-[0_0_5px_#facc15]"></div>
              <div className="absolute top-1/4 -left-16 w-12 h-0.5 bg-yellow-400/60 rounded-full shadow-[0_0_5px_#facc15]"></div>
            </div>

            {/* 3. Versenyző: Neon Rózsaszín (Vesztes) */}
            <div className="absolute w-24 h-10 bg-gray-800 rounded-t-2xl rounded-b-lg border-2 border-pink-500 shadow-[0_0_20px_#ec4899] animate-[race-loser-2_4.5s_ease-in-out_forwards] mt-48">
              <div className="absolute -bottom-3 left-2 w-6 h-6 border-2 border-pink-500 rounded-full bg-black"></div>
              <div className="absolute -bottom-3 right-2 w-7 h-7 border-2 border-pink-500 rounded-full bg-black"></div>
              <div className="absolute top-2 right-1 w-4 h-1.5 bg-pink-200 rounded-full shadow-[0_0_10px_#ec4899]"></div>
            </div>

          </div>

          <p className="absolute bottom-10 text-pink-500 font-bold tracking-[0.5em] text-sm animate-pulse">
            TÖKÉLETES GÉP KERESÉSE...
          </p>

          <style>{`
            @keyframes grid-move {
              0% { background-position: 0 0; }
              100% { background-position: 0 4rem; }
            }
            @keyframes race-winner {
              0% { transform: translateX(-150px); }
              20% { transform: translateX(calc(30vw - 50px)); }
              60% { transform: translateX(calc(40vw - 50px)); }
              80% { transform: translateX(calc(50vw - 50px)); }
              100% { transform: translateX(120vw); }
            }
            @keyframes race-loser-1 {
              0% { transform: translateX(-150px); }
              30% { transform: translateX(calc(45vw - 50px)); }
              70% { transform: translateX(calc(30vw - 50px)); }
              100% { transform: translateX(-200px); }
            }
            @keyframes race-loser-2 {
              0% { transform: translateX(-150px); }
              40% { transform: translateX(calc(35vw - 50px)); }
              60% { transform: translateX(calc(45vw - 50px)); }
              100% { transform: translateX(-200px); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
