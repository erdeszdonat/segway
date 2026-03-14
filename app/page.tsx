"use client";
import { useState, useEffect } from 'react';

export default function SegwayKalkulator() {
  const [isPartner, setIsPartner] = useState(false);
  const [eredmeny, setEredmeny] = useState<any>(null);

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

    // LOGIKA A 14 TÍPUSHOZ (Kert mérete, Lejtés és GPS viszonyok alapján)
    if (meret <= 500) {
      if (lejto <= 30) {
        modell = "Segway Navimow i105E";
        link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-i105e";
        indoklas = "Kisebb kertekhez ez a legoptimálisabb választás, beépített kamerás akadályelkerüléssel.";
      } else {
        modell = "Segway Navimow H500E";
        link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-h500e";
        indoklas = "Bár a kert kicsi, a meredek lejtő miatt a nagyobb kapaszkodóképességű H-széria szükséges.";
      }
    } 
    else if (meret <= 800) {
      if (lejto <= 30) {
        modell = "Segway Navimow i108E";
        link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-i108e";
        indoklas = "Az i-széria nagyobb akkumulátoros változata, tökéletes 800 m²-ig.";
      } else {
        modell = "Segway Navimow H800E";
        link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-h800e";
        indoklas = "Meredekebb kertbe a H-széria 800 m²-es típusát javasoljuk.";
      }
    }
    else if (meret <= 1500) {
      modell = arnyekolt ? "Segway Navimow H1500E + VisionFence" : "Segway Navimow H1500E";
      link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-h1500e";
      indoklas = arnyekolt ? "A magas fák/falak miatt a VisionFence kamera segít a navigációban." : "Nagy teljesítményű gép közepes méretű kertekbe.";
    }
    else if (meret <= 3000) {
      modell = arnyekolt ? "Segway Navimow H3000E + VisionFence" : "Segway Navimow H3000E";
      link = "https://robot1.hu/robotfunyirok/segway-navimow/segway-navimow-h3000e";
      indoklas = "A legnagyobb kapacitású modell, amely megbirkózik a legnagyobb területekkel is.";
    }
    else {
      modell = "Ipari megoldás / Több robot";
      indoklas = "Ekkora területre érdemes több gépben vagy ipari Segway megoldásban gondolkodni.";
      link = "https://robot1.hu/robotfunyirok/segway-navimow";
    }

    setEredmeny({ modell, link, indoklas });
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-2 font-sans">
      <main className="w-full max-w-md bg-white shadow-2xl rounded-[2.5rem] overflow-hidden border border-gray-100">
        
        <div className="bg-[#ff5a00] p-6 text-white text-center">
          <h1 className="text-xl font-black uppercase italic">Navimow Szakértő</h1>
          <p className="text-xs opacity-90">Válaszoljon 4 kérdésre a pontos ajánlathoz!</p>
        </div>
        
        <form onSubmit={szamolas} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kert (m²)</label>
              <input name="meret" type="number" placeholder="500" required className="w-full p-3 mt-1 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[#ff5a00] outline-none font-bold" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lejtő (%)</label>
              <input name="lejto" type="number" placeholder="25" required className="w-full p-3 mt-1 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[#ff5a00] outline-none font-bold" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vannak magas fák vagy falak?</label>
            <select name="arnyekolt" className="w-full p-3 mt-1 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[#ff5a00] outline-none font-bold">
              <option value="nem">Nincs, nyílt a terep</option>
              <option value="igen">Igen, sok az árnyékolt rész</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Település</label>
            <input name="telepules" type="text" placeholder="Pl. Esztergom" required className="w-full p-3 mt-1 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[#ff5a00] outline-none font-bold" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">E-mail cím</label>
            <input name="email" type="email" placeholder="pelda@email.hu" required className="w-full p-3 mt-1 bg-gray-50 rounded-xl focus:ring-2 focus:ring-[#ff5a00] outline-none font-bold" />
          </div>

          {isPartner && (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
              <label className="text-[10px] font-bold text-blue-600 uppercase">Telefonszám (Visszahíváshoz)</label>
              <input name="telefon" type="tel" placeholder="+36 30..." required className="w-full p-2 mt-1 bg-white rounded-lg outline-none font-bold border-none shadow-sm" />
            </div>
          )}

          <button type="submit" className="w-full bg-black text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#ff5a00] transition-all shadow-lg active:scale-95">
            Melyik gép kell nekem?
          </button>
        </form>

        {eredmeny && (
          <div className="mx-4 mb-6 p-5 bg-gray-900 rounded-3xl text-white animate-in slide-in-from-bottom-2">
            <span className="text-[#ff5a00] text-[10px] font-black uppercase">Javasolt modell:</span>
            <h2 className="text-xl font-black mt-1">{eredmeny.modell}</h2>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">{eredmeny.indoklas}</p>
            
            <a href={eredmeny.link} target="_blank" className="inline-block mt-4 bg-white text-black px-5 py-2 rounded-lg font-bold text-xs hover:bg-[#ff5a00] hover:text-white transition-colors">
              Megnézem a Robot1.hu-n
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
