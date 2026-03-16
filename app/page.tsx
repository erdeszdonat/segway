"use client";
import { useState, useEffect } from 'react';

// --- KERESKEDŐK LISTÁJA (A CSV ADATOK ALAPJÁN) ---
const KERESKEDOK = [
  { slug: "andl-papa", nev: "ANDL Kft.", varos: "Pápa", cim: "8500 Pápa, Külső-Veszprémi út 64", lat: 47.330, lon: 17.460, telefon: "+36307803644" },
  { slug: "andl-gyor", nev: "ANDL Kft.", varos: "Győr", cim: "9024 Győr, Pápai út 22.", lat: 47.683, lon: 17.635, telefon: "+36305431437" },
  { slug: "andl-veszprem", nev: "ANDL Kft.", varos: "Veszprém", cim: "8200 Veszprém, Házgyári út 20.", lat: 47.093, lon: 17.911, telefon: "+36302776417" },
  { slug: "robot1-papa", nev: "ROBOT1.HU", varos: "Pápa", cim: "8500 Pápa, Külső-Veszprémi út 64", lat: 47.331, lon: 17.461, telefon: "+36300131013" },
  { slug: "pro-mower", nev: "Pro-Mower Kft.", varos: "Budaörs", cim: "2040 Budaörs, Kamaraerdei út 11", lat: 47.452, lon: 18.970, telefon: "+36205215214" },
  { slug: "hosagep-budaors", nev: "Hosagép Kft.", varos: "Budaörs", cim: "2040 Budaörs, Szabadság út 77", lat: 47.461, lon: 18.953, telefon: "+3623789320" },
  { slug: "hosagep-budapest", nev: "Hosagép Kft.", varos: "Budapest", cim: "1182 Budapest, Üllői út 555", lat: 47.430, lon: 19.180, telefon: "+36706235540" },
  { slug: "mega-plusz", nev: "Mega-Plusz Kft.", varos: "Szeged", cim: "6728 Szeged, Vásárhelyi Pál utca 16", lat: 46.253, lon: 20.141, telefon: "+36300186060" },
  { slug: "kabel-elektro", nev: "Kábel-Elektro Kft.", varos: "Békéscsaba", cim: "5600 Békéscsaba, Mokry utca 15", lat: 46.680, lon: 21.090, telefon: "+36204368346" },
  { slug: "gronway", nev: "Grönway Kft.", varos: "Miskolc", cim: "3526 Miskolc, Szeles utca 27", lat: 48.103, lon: 20.783, telefon: "+3646357369" },
  { slug: "agro-takacs", nev: "Agro Takács Kft.", varos: "Keszthely", cim: "8360 Keszthely, Bercsényi Miklós utca 72", lat: 46.767, lon: 17.243, telefon: "+36303965422" },
  { slug: "bako", nev: "Bakó és Társa Kft.", varos: "Szombathely", cim: "9700 Szombathely, Vasút út 10.", lat: 47.230, lon: 16.621, telefon: "+36305840176" }
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

    let modell = "";
    let indoklas = "";
    let link = "";
    const arnyekolt = arnyekoltValue === 'igen';

    if (meret <= 500) {
      if (lejto <= 30) {
        modell = "Segway Navimow i105E";
        indoklas = "Kisebb kertekhez ez a legoptimálisabb választás.";
        link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-i105e";
      } else {
        modell = "Segway Navimow H206E";
        indoklas = "A meredekebb lejtők miatt a nagyobb kapaszkodóképességű H-szériát javasoljuk.";
        link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-h206e-rb1aa-12-05-02-0001.html";
      }
    } else if (meret <= 1000) {
      if (lejto > 30) {
        modell = "Segway Navimow i210E AWD";
        indoklas = "Az összkerekes hajtásnak köszönhetően a meredek kerti szakaszokat is könnyedén kezeli.";
        link = "https://segwayrobotfunyiro.hu/robotfunyiro/navimow-i210e-awd-rb1aa-12-07-03-0001.html";
      } else {
        modell = "Segway Navimow H210E";
        indoklas = "Tökéletes választás 1000 m²-ig, robusztus kialakítással.";
        link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-h210e-rb1aa-12-05-01-0001.html";
      }
    } else if (meret <= 1500) {
      modell = "Segway Navimow H215E";
      indoklas = "Nagy teljesítményű gép, amely 1500 m²-ig biztosítja a kert tökéletes ápoltságát.";
      link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-h215e-rb1aa-12-05-03-0001.html";
    } else if (meret <= 3000) {
      modell = "Segway Navimow H230E";
      indoklas = "A legnagyobb kapacitású H-szériás modell nagy családi kertekhez.";
      link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-h230e-rb1aa-12-05-04-0001.html";
    } else if (meret <= 4200) {
      modell = "Segway Navimow X420E";
      indoklas = "Az új generációs X-széria nagy területekre és professzionális felhasználásra.";
      link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-x420e-rb1aa-12-06-01-0002.html";
    } else {
      modell = "Segway Navimow X450E";
      indoklas = "A csúcsmodell, amely az extrém nagy területeken is hatékonyan dolgozik.";
      link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-x450e-rb1aa-12-06-03-0001.html";
    }

    setIsAnimating(true);
    setEredmeny(null);
    setProgress(0);

    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 1;
      if (currentProgress <= 100) setProgress(currentProgress);
      if (currentProgress >= 100) clearInterval(progressInterval);
    }, 30);

    setTimeout(() => {
      clearInterval(progressInterval);
      setIsAnimating(false);
      setEredmeny({ modell, indoklas, link, kereskedo: nearestKereskedo, tavolsag: tavolsagKm });
    }, 3200);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-2 md:p-6 font-sans bg-cover bg-fixed transition-all duration-500" 
      style={{ 
        backgroundImage: "url('https://segwayrobotfunyiro.hu/media/bg/segway-navimow-x3.jpg')",
        backgroundPosition: "center"
      }}>
      
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>

      <main className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden border border-white/40">
        
        {/* --- VILÁGOSSZÜRKE FEJLÉC, KISEBB PADDING --- */}
        <div className="bg-gray-100 p-4 md:p-6 text-center border-b border-gray-200">
          
          <div className="flex justify-center mb-4">
               <img 
                 src="/logo.svg" 
                 alt="Segway Navimow Logo" 
                 className="h-12 md:h-16 w-auto object-contain"
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                 }}
               />
          </div>

          <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter italic text-gray-900">
            Robotfűnyíró Kalkulátor
          </h1>
          <p className="mt-1 text-gray-600 font-bold text-xs md:text-sm max-w-md mx-auto leading-relaxed opacity-90">
            Találja meg a tökéletes Segway Navimow robotfűnyírót másodpercek alatt!
          </p>
        </div>
        
        <form onSubmit={szamolas} className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Kert mérete (m²)</label>
              <div className="relative">
                <input name="meret" type="number" placeholder="Pl. 500" required 
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-orange-500 transition-all text-gray-950 font-bold text-base outline-none shadow-sm" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">m²</span>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Max. Lejtő (%)</label>
              <div className="relative">
                <input name="lejto" type="number" placeholder="Pl. 25" required 
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-orange-500 transition-all text-gray-950 font-bold text-base outline-none shadow-sm" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">%</span>
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">GPS árnyékoltság (Adottság)</label>
              <div className="grid grid-cols-2 gap-3">
                <div onClick={() => setArnyekoltValue("nem")}
                  className={`cursor-pointer border-2 rounded-xl p-3 flex items-center gap-3 transition-all duration-300 ${arnyekoltValue === 'nem' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${arnyekoltValue === 'nem' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>☀️</div>
                  <div className="font-black text-[10px] text-gray-900 uppercase">Tiszta</div>
                </div>

                <div onClick={() => setArnyekoltValue("igen")}
                  className={`cursor-pointer border-2 rounded-xl p-3 flex items-center gap-3 transition-all duration-300 ${arnyekoltValue === 'igen' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${arnyekoltValue === 'igen' ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>🌳</div>
                  <div className="font-black text-[10px] text-gray-900 uppercase">Zárt</div>
                </div>
              </div>
              <input type="hidden" name="arnyekolt" value={arnyekoltValue} />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Település</label>
              <input name="telepules" type="text" placeholder="Pl. Esztergom" required 
                onChange={() => setCityError("")}
                className={`w-full px-4 py-2.5 bg-white border ${cityError ? 'border-red-500' : 'border-gray-200'} rounded-xl outline-none font-bold text-sm text-gray-900 shadow-sm transition-all`} />
              {cityError && <p className="text-[9px] text-red-500 font-black mt-1 uppercase ml-1">{cityError}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">E-mail cím</label>
              <input name="email" type="email" placeholder="nev@email.hu" required 
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none font-bold text-sm text-gray-900 shadow-sm transition-all" />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-gray-200 text-orange-500 cursor-pointer" />
                <span className="text-[10px] text-gray-500 font-bold leading-tight">
                  Elfogadom az Adatvédelmi tájékoztatót.
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={isCheckingCity}
                className="w-full bg-[#111] hover:bg-orange-600 text-white py-3.5 px-6 rounded-xl font-black text-base uppercase tracking-widest shadow-xl transform active:scale-[0.98] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3">
                {isCheckingCity ? (
                  <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Ideális gép mutatása"
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* --- EREDMÉNY MODAL --- */}
      {eredmeny && !isAnimating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 my-auto">
            
            <button onClick={() => setEredmeny(null)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full font-bold z-50">✕</button>

            <div className="bg-orange-500 p-8 text-center text-white">
              <span className="inline-block bg-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Kalkulált eredmény</span>
              <h2 className="text-3xl font-black tracking-tighter italic drop-shadow-lg">{eredmeny.modell}</h2>
            </div>
            
            <div className="p-6 md:p-10 text-center">
              <p className="text-gray-700 font-bold leading-relaxed text-lg mb-8">{eredmeny.indoklas}</p>
              
              <div className="space-y-4">
                <a href={eredmeny.link} target="_blank" rel="noreferrer" 
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-orange-500 text-white rounded-xl font-black text-lg uppercase tracking-wider hover:bg-orange-600 shadow-lg transform active:scale-[0.98] transition-all">
                  Megtekintem a terméket
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>

                {eredmeny.kereskedo && (
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 text-left">
                    <p className="text-[10px] font-black text-orange-600 uppercase mb-2 flex items-center gap-2 italic">
                       📍 Legközelebbi partnerünk
                    </p>
                    <h3 className="font-black text-gray-950 text-xl tracking-tight">{eredmeny.kereskedo.nev}</h3>
                    <p className="text-xs text-gray-500 font-bold mt-1">
                      {eredmeny.kereskedo.cim} 
                      {eredmeny.tavolsag !== null && <span className="text-orange-600 ml-2">(~{eredmeny.tavolsag} km)</span>}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${eredmeny.kereskedo.lat},${eredmeny.kereskedo.lon}`} target="_blank" rel="noreferrer" className="bg-white border border-gray-200 py-2 rounded-lg text-center text-[10px] font-black uppercase tracking-widest hover:border-orange-500 transition-all">Útvonal</a>
                        <a href={`tel:${eredmeny.kereskedo.telefon}`} className="bg-gray-900 text-white py-2 rounded-lg text-center text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Hívás</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ANIMÁCIÓ --- */}
      {isAnimating && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 border-8 border-orange-500 border-t-transparent rounded-full animate-spin mb-8"></div>
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-[0.2em] italic">
             Navimow elemzése...
          </h2>
          <p className="text-white font-black mt-4 text-5xl">{progress}%</p>
        </div>
      )}
    </div>
  );
}
