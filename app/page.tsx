"use client";
import { useState, useEffect } from 'react';

// --- KERESKEDŐK LISTÁJA ---
const KERESKEDOK = [
  { slug: "robotcentrum", nev: "Robotfűnyírócentrum - Robotfűnyíró szaküzlet", varos: "Budapest", cim: "1118 Budapest, Rétköz utca 7.", lat: 47.465, lon: 18.995, telefon: "+36 30 111 1111" },
  { slug: "bako", nev: "Bakó és Társa Kft. Gazda-ABC és Kertigép Centrum", varos: "Szombathely", cim: "9700 Szombathely, Vasút út 10.", lat: 47.230, lon: 16.621, telefon: "+36 30 606 8000" },
  { slug: "mega-szeged", nev: "Husqvarna Szeged - MEGA-PLUSZ Kft.", varos: "Szeged", cim: "6720 Szeged", lat: 46.253, lon: 20.141, telefon: "+36 30 222 2222" },
  { slug: "hosagep", nev: "Husqvarna - kerti gépek - Hosagép Kft.", varos: "Budaörs", cim: "2040 Budaörs, Szabadság út 77.", lat: 47.461, lon: 18.953, telefon: "+36 20 355 4031" },
  { slug: "mokry", nev: "Husqvarna Szakkereskedés Mokry Műszaki Áruház", varos: "Békéscsaba", cim: "5600 Békéscsaba, Mokry u. 16.", lat: 46.680, lon: 21.090, telefon: "+36 20 436 8346" },
  { slug: "andl-veszprem", nev: "ANDL Kft. - Husqvarna szaküzlet", varos: "Veszprém", lat: 47.093, lon: 17.911, telefon: "+36 30 333 3333", cim: "8200 Veszprém" },
  { slug: "gronway", nev: "Grönway Kft.", varos: "Budapest", lat: 47.530, lon: 19.120, telefon: "+36 30 444 4444", cim: "1152 Budapest" },
  { slug: "rotacio", nev: "Rotáció Kft.", varos: "Tata", lat: 47.650, lon: 18.310, telefon: "+36 30 555 5555", cim: "2890 Tata" },
  { slug: "kert-plusz", nev: "Kert-Plusz Kft.", varos: "Székesfehérvár", lat: 47.190, lon: 18.410, telefon: "+36 30 666 6666", cim: "8000 Székesfehérvár" },
  { slug: "barta", nev: "Barta GT Bt", varos: "Eger", cim: "3300 Eger", lat: 47.900, lon: 20.370, telefon: "+36 30 444 5555" }
];

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function App() {
  const [isPartner, setIsPartner] = useState(false);
  const [fixedDealer, setFixedDealer] = useState<any>(null);
  const [eredmeny, setEredmeny] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [arnyekoltValue, setArnyekoltValue] = useState("nem");
  const [cityError, setCityError] = useState("");
  const [isCheckingCity, setIsCheckingCity] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPartner(params.get('partner') === '1');
    const dealerSlug = params.get('dealer');
    if (dealerSlug) {
      const found = KERESKEDOK.find(k => k.slug === dealerSlug);
      if (found) setFixedDealer(found);
    }
  }, []);

  const szamolas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const meret = Number(formData.get('meret'));
    const lejto = Number(formData.get('lejto'));
    const telepules = formData.get('telepules') as string;

    setIsCheckingCity(true);
    setCityError("");

    let nearestKereskedo = fixedDealer || KERESKEDOK[0];
    let tavolsagKm: number | null = null;

    if (!fixedDealer) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(telepules)}, Hungary`);
        const data = await res.json();
        if (!data || data.length === 0) {
          setCityError("Nem találjuk ezt a települést. Lehet, hogy elírta a nevét?");
          setIsCheckingCity(false);
          return;
        }
        const userLat = parseFloat(data[0].lat);
        const userLon = parseFloat(data[0].lon);
        let minDistance = Infinity;
        for (const k of KERESKEDOK) {
          const dist = getDistanceFromLatLonInKm(userLat, userLon, k.lat, k.lon);
          if (dist < minDistance) {
            minDistance = dist;
            nearestKereskedo = k;
            tavolsagKm = Math.round(dist);
          }
        }
      } catch (err) { console.error(err); }
    }

    setIsCheckingCity(false);

    // Módosított Gép logika (i108E nélkül)
    let modell = "";
    let indoklas = "";
    const arnyekolt = arnyekoltValue === 'igen';

    if (meret <= 500) {
      if (lejto <= 30) {
        modell = "Segway Navimow i105E";
        indoklas = "Kisebb kertekhez ez a legoptimálisabb választás, okos kamerás akadályelkerüléssel.";
      } else {
        modell = "Segway Navimow H500E";
        indoklas = "A meredek lejtő miatt a nagyobb kapaszkodóképességű H-széria szükséges a stabil működéshez.";
      }
    } else if (meret <= 800) {
      // i108E kivéve, helyette H800E javasolt erre a méretre
      modell = "Segway Navimow H800E";
      indoklas = "Ekkora területre a robusztusabb H-szériát javasoljuk, amely magabiztosan kezeli a közepes kerteket.";
    } else if (meret <= 1500) {
      modell = arnyekolt ? "Segway Navimow H1500E + VisionFence" : "Segway Navimow H1500E";
      indoklas = arnyekolt ? "A fák/falak miatt a VisionFence kamera elengedhetetlen a pontos navigációhoz." : "Nagy teljesítményű, robusztus gép nagy kertekbe.";
    } else if (meret <= 3000) {
      modell = arnyekolt ? "Segway Navimow H3000E + VisionFence" : "Segway Navimow H3000E";
      indoklas = "A legnagyobb kapacitású csúcsmodell, amely megbirkózik a legnagyobb területekkel is.";
    } else {
      modell = "Ipari megoldás / Több robot";
      indoklas = "Ekkora területre érdemes több gépben vagy ipari Segway megoldásban gondolkodni.";
    }

    setIsAnimating(true);
    setEredmeny(null);
    setProgress(0);

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 1;
      if (currentProgress <= 100) setProgress(currentProgress);
      if (currentProgress >= 100) clearInterval(progressInterval);
    }, 44);

    setTimeout(() => {
      clearInterval(progressInterval);
      setIsAnimating(false);
      setEredmeny({ modell, indoklas, kereskedo: nearestKereskedo, tavolsag: tavolsagKm });
    }, 4500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 font-sans bg-cover bg-center bg-fixed" 
      style={{ backgroundImage: "url('https://segwayrobotfunyiro.hu/media/bg/segway-navimow-x3.jpg')" }}>
      
      {/* Sötétítő réteg a háttéren az olvashatóságért */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>

      <main className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] rounded-[2.5rem] overflow-hidden border border-white/40">
        
        {/* Fejléc logóval */}
        <div className="bg-gradient-to-br from-[#111] to-[#333] p-8 md:p-10 text-white text-center border-b border-orange-500/20">
          <div className="flex justify-center mb-6">
             {/* Segway Navimow SVG Logo */}
             <svg width="220" height="40" viewBox="0 0 220 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                <path d="M12.5 10H5V30H12.5V22H18V30H25.5V10H18V18H12.5V10Z" fill="white"/>
                <path d="M35 10H42.5V23.5C42.5 25.5 44 27 46 27C48 27 49.5 25.5 49.5 23.5V10H57V23.5C57 29.5 52 34.5 46 34.5C40 34.5 35 29.5 35 23.5V10Z" fill="#ff5a00"/>
                <path d="M68 10H75.5V30H68V10Z" fill="white"/>
                <path d="M85 10H92.5V30H85V10Z" fill="white"/>
                <text x="105" y="28" fill="white" fontSize="22" fontWeight="900" fontFamily="sans-serif">NAVIMOW</text>
             </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight italic text-[#ff5a00]">
            Robotfűnyíró Kalkulátor
          </h1>
          <p className="mt-3 text-gray-200 font-medium text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Találja meg a kertjéhez tökéletes Segway Navimow robotfűnyírót másodpercek alatt!
          </p>
          {fixedDealer && (
            <div className="mt-4 inline-block px-4 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-xs font-bold text-orange-400">
              Partnerünk: {fixedDealer.nev}
            </div>
          )}
        </div>
        
        <form onSubmit={szamolas} className="p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Kert mérete (m²)</label>
              <div className="relative">
                <input name="meret" type="number" placeholder="Pl. 500" required 
                  className="w-full pl-5 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-900 font-bold text-lg outline-none shadow-sm" />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-black">m²</span>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Max. Lejtő (%)</label>
              <div className="relative">
                <input name="lejto" type="number" placeholder="Pl. 25" required 
                  className="w-full pl-5 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-900 font-bold text-lg outline-none shadow-sm" />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-black">%</span>
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">GPS árnyékoltság (Fák / Falak)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div onClick={() => setArnyekoltValue("nem")}
                  className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${arnyekoltValue === 'nem' ? 'border-orange-500 bg-orange-50/50 shadow-md' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${arnyekoltValue === 'nem' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-gray-200 grayscale opacity-60'}`}>☀️</div>
                  <div className="font-bold text-sm text-gray-800">Tiszta terep</div>
                </div>

                <div onClick={() => setArnyekoltValue("igen")}
                  className={`cursor-pointer border-2 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${arnyekoltValue === 'igen' ? 'border-orange-500 bg-orange-50/50 shadow-md' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${arnyekoltValue === 'igen' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-gray-200 grayscale opacity-60'}`}>🌳</div>
                  <div className="font-bold text-sm text-gray-800">Fák és Falak</div>
                </div>
              </div>
              <input type="hidden" name="arnyekolt" value={arnyekoltValue} />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Település</label>
              <input name="telepules" type="text" placeholder="Pl. Esztergom" required 
                onChange={() => setCityError("")}
                className={`w-full px-5 py-4 bg-gray-50 border ${cityError ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none font-bold text-gray-900 shadow-sm transition-all`} />
              {cityError && <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-wider ml-1">{cityError}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">E-mail cím</label>
              <input name="email" type="email" placeholder="nev@email.hu" required 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none font-bold text-gray-900 shadow-sm transition-all" />
            </div>

            <div className="md:col-span-2 mt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                <span className="text-[11px] text-gray-500 font-medium leading-relaxed group-hover:text-gray-700 transition-colors">
                  Elfogadom az <a href="#" className="text-orange-600 font-bold hover:underline">Adatvédelmi tájékoztatót</a>, és hozzájárulok az adatok kezeléséhez.
                </span>
              </label>
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" disabled={isCheckingCity}
                className="w-full bg-[#111] hover:bg-orange-600 text-white py-5 px-6 rounded-2xl font-black text-lg uppercase tracking-[0.15em] shadow-xl hover:shadow-orange-500/30 transform active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3">
                {isCheckingCity ? "Ellenőrzés..." : "Mutasd az ideális gépet"}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* --- EREDMÉNY MODAL --- */}
      {eredmeny && !isAnimating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_0_80px_rgba(255,90,0,0.3)] border border-white/20 overflow-hidden animate-in zoom-in-95 duration-500 my-auto">
            
            <button onClick={() => setEredmeny(null)} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-950 rounded-full transition-all font-bold">✕</button>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-10 text-center text-white">
              <span className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">A Te géped</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter italic drop-shadow-lg">{eredmeny.modell}</h2>
            </div>
            
            <div className="p-8 md:p-10 text-center">
              <p className="text-gray-700 font-medium leading-relaxed text-lg mb-8">{eredmeny.indoklas}</p>
              
              {eredmeny.kereskedo && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${eredmeny.kereskedo.lat},${eredmeny.kereskedo.lon}`} target="_blank" rel="noreferrer" 
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-orange-600 hover:shadow-lg transition-all transform active:scale-[0.97]">
                      📍 Útvonalterv
                    </a>
                    <a href={`tel:${eredmeny.kereskedo.telefon.replace(/\s+/g, '')}`} 
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-950 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-gray-800 transition-all transform active:scale-[0.97]">
                      📞 Hívás indítása
                    </a>
                  </div>

                  <div className="p-5 bg-orange-50 rounded-[2rem] border border-orange-100 text-left">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                       Legközelebbi partner
                    </p>
                    <h3 className="font-black text-gray-900 text-xl leading-tight">{eredmeny.kereskedo.nev}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1 leading-snug">
                      {eredmeny.kereskedo.cim} 
                      {eredmeny.tavolsag !== null && <span className="text-orange-600 font-bold ml-1">(~{eredmeny.tavolsag} km)</span>}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- PRÉMIUM ANIMÁCIÓ --- */}
      {isAnimating && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
             <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
             <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
             <div className="absolute w-12 h-12 bg-orange-500/20 rounded-full animate-ping"></div>
             <div className="text-3xl text-orange-500 relative z-10">🔍</div>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-[0.2em] mb-10 drop-shadow-xl">
             Navimow elemzése...
          </h2>
          <div className="w-full max-w-sm bg-white/10 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-[0_0_20px_rgba(255,90,0,0.5)] transition-all duration-75 ease-linear"
                 style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-white font-black mt-6 text-4xl tracking-tighter italic">{progress}%</p>
        </div>
      )}
    </div>
  );
}
