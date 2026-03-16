"use client";
import { useState, useEffect } from 'react';

// --- KERESKEDŐK LISTÁJA ---
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
        indoklas = "Kisebb kertekhez ez a legoptimálisabb választás, okos kamerás akadályelkerüléssel.";
        link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-i105e";
      } else {
        modell = "Segway Navimow H206E";
        indoklas = "A meredekebb lejtők miatt a nagyobb kapaszkodóképességű H-szériát javasoljuk.";
        link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-h206e-rb1aa-12-05-02-0001.html";
      }
    } else if (meret <= 1000) {
      if (lejto > 30) {
        modell = "Segway Navimow i210E AWD";
        indoklas = "Az összkerekes hajtásnak köszönhetően a legmeredekebb kerti szakaszokat is könnyedén kezeli.";
        link = "https://segwayrobotfunyiro.hu/robotfunyiro/navimow-i210e-awd-rb1aa-12-07-03-0001.html";
      } else {
        modell = "Segway Navimow H210E";
        indoklas = "Tökéletes választás 1000 m²-ig, robusztus kialakítással és megbízható navigációval.";
        link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-h210e-rb1aa-12-05-01-0001.html";
      }
    } else if (meret <= 1500) {
      modell = "Segway Navimow H215E";
      indoklas = "Nagy teljesítményű gép, amely 1500 m²-ig biztosítja a kert tökéletes ápoltságát.";
      link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-h215e-rb1aa-12-05-03-0001.html";
    } else if (meret <= 3000) {
      modell = "Segway Navimow H230E";
      indoklas = "A legnagyobb kapacitású H-szériás modell, amely a legnagyobb családi kertekkel is megbirkózik.";
      link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-h230e-rb1aa-12-05-04-0001.html";
    } else if (meret <= 4200) {
      modell = "Segway Navimow X420E";
      indoklas = "Az új generációs X-széria nagy területekre és professzionális felhasználásra lett tervezve.";
      link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-x420e-rb1aa-12-06-01-0002.html";
    } else {
      modell = "Segway Navimow X450E";
      indoklas = "A Segway Navimow csúcsmodellje, amely az extrém nagy területeken is kiváló hatékonysággal dolgozik.";
      link = "https://segwayrobotfunyiro.hu/robotfunyiro/segway-navimow-x450e-rb1aa-12-06-03-0001.html";
    }

    if (arnyekolt && !modell.includes("X")) {
      indoklas += " A fák és falak miatti GPS árnyékoltság ellenére a gép kiválóan navigál.";
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
      setEredmeny({ modell, indoklas, link, kereskedo: nearestKereskedo, tavolsag: tavolsagKm });
    }, 4500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8 lg:p-12 font-sans bg-cover bg-fixed transition-all duration-500" 
      style={{ 
        backgroundImage: "url('https://segwayrobotfunyiro.hu/media/bg/segway-navimow-x3.jpg')",
        backgroundPosition: "center"
      }}>
      
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      <main className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-2xl shadow-[0_40px_100px_-15px_rgba(0,0,0,0.7)] rounded-[2.5rem] overflow-hidden border border-white/40">
        
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 md:p-12 text-white text-center border-b border-orange-500/20">
          
          {/* --- MEGNÖVELT LOGÓ, FEHÉR BOX NÉLKÜL, DROP SHADOW-VAL --- */}
          <div className="flex justify-center mb-10">
               <img 
                 src="/logo.svg" 
                 alt="Segway Navimow Logo" 
                 className="h-24 md:h-32 w-auto object-contain"
                 style={{ filter: "drop-shadow(0 0 15px rgba(255, 255, 255, 0.4))" }}
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   const parent = e.currentTarget.parentElement;
                   if (parent) {
                     const text = document.createElement('span');
                     text.className = "text-[#ff5a00] font-black text-4xl tracking-tighter italic";
                     text.innerText = "NAVIMOW";
                     parent.appendChild(text);
                   }
                 }}
               />
          </div>

          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic text-[#ff5a00] drop-shadow-md">
            Robotfűnyíró Kalkulátor
          </h1>
          <p className="mt-4 text-gray-200 font-bold text-sm md:text-lg max-w-md mx-auto leading-relaxed opacity-90">
            Találja meg a kertjéhez tökéletes Segway Navimow robotfűnyírót másodpercek alatt!
          </p>
          {fixedDealer && (
            <div className="mt-5 inline-flex items-center gap-2 px-5 py-2 bg-orange-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Partnerünk: {fixedDealer.nev}
            </div>
          )}
        </div>
        
        <form onSubmit={szamolas} className="p-6 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="flex flex-col">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Kert mérete (m²)</label>
              <div className="relative group">
                <input name="meret" type="number" placeholder="Pl. 500" required 
                  className="w-full pl-6 pr-14 py-5 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-950 font-black text-xl outline-none shadow-inner" />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-black group-focus-within:text-orange-500 transition-colors">m²</span>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Max. Lejtő (%)</label>
              <div className="relative group">
                <input name="lejto" type="number" placeholder="Pl. 25" required 
                  className="w-full pl-6 pr-14 py-5 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-950 font-black text-xl outline-none shadow-inner" />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-black group-focus-within:text-orange-500 transition-colors">%</span>
              </div>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">GPS árnyékoltság (Kert adottság)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div onClick={() => setArnyekoltValue("nem")}
                  className={`cursor-pointer border-2 rounded-[1.5rem] p-5 flex items-center gap-5 transition-all duration-500 group ${arnyekoltValue === 'nem' ? 'border-orange-500 bg-orange-50/80 shadow-xl' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 ${arnyekoltValue === 'nem' ? 'bg-orange-500 text-white rotate-12 scale-110' : 'bg-gray-200 grayscale opacity-50 group-hover:grayscale-0'}`}>☀️</div>
                  <div>
                    <div className="font-black text-base text-gray-900 uppercase tracking-tighter">Tiszta terep</div>
                    <div className="text-[11px] text-gray-500 font-bold">Nincsenek zavaró akadályok</div>
                  </div>
                </div>

                <div onClick={() => setArnyekoltValue("igen")}
                  className={`cursor-pointer border-2 rounded-[1.5rem] p-5 flex items-center gap-5 transition-all duration-500 group ${arnyekoltValue === 'igen' ? 'border-orange-500 bg-orange-50/80 shadow-xl' : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all duration-500 ${arnyekoltValue === 'igen' ? 'bg-orange-500 text-white rotate-12 scale-110' : 'bg-gray-200 grayscale opacity-50 group-hover:grayscale-0'}`}>🌳</div>
                  <div>
                    <div className="font-black text-base text-gray-900 uppercase tracking-tighter">Fák és Falak</div>
                    <div className="text-[11px] text-gray-500 font-bold">Zártabb, árnyékoltabb kert</div>
                  </div>
                </div>
              </div>
              <input type="hidden" name="arnyekolt" value={arnyekoltValue} />
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">Település</label>
              <input name="telepules" type="text" placeholder="Pl. Esztergom" required 
                onChange={() => setCityError("")}
                className={`w-full px-6 py-5 bg-gray-50 border-2 ${cityError ? 'border-red-500 bg-red-50' : 'border-gray-100'} rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none font-black text-gray-900 transition-all shadow-inner`} />
              {cityError && <p className="text-[11px] text-red-500 font-black mt-2 uppercase tracking-widest ml-1">{cityError}</p>}
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">E-mail cím</label>
              <input name="email" type="email" placeholder="nev@email.hu" required 
                className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-orange-500/10 outline-none font-black text-gray-900 transition-all shadow-inner" />
            </div>

            <div className="md:col-span-2 px-1">
              <label className="flex items-start gap-4 cursor-pointer group">
                <input type="checkbox" required className="mt-1 w-6 h-6 rounded-lg border-gray-200 text-orange-500 focus:ring-orange-500 transition-all cursor-pointer shadow-sm" />
                <span className="text-[12px] text-gray-500 font-bold leading-relaxed group-hover:text-gray-800 transition-colors">
                  Elfogadom az <a href="#" className="text-orange-600 border-b-2 border-orange-500/20 hover:border-orange-500 transition-all">Adatvédelmi tájékoztatót</a>, és hozzájárulok a megadott adatok szakértői kezeléséhez.
                </span>
              </label>
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" disabled={isCheckingCity}
                className="w-full bg-[#111] hover:bg-orange-600 text-white py-6 px-8 rounded-[1.5rem] font-black text-xl uppercase tracking-[0.2em] shadow-2xl hover:shadow-orange-500/40 transform active:scale-[0.98] transition-all duration-500 disabled:opacity-70 flex items-center justify-center gap-4">
                {isCheckingCity ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-500 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-[0_0_100px_rgba(255,90,0,0.4)] border border-white/20 overflow-hidden animate-in zoom-in-95 duration-700 my-auto">
            
            <button onClick={() => setEredmeny(null)} className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-950 rounded-full transition-all font-bold z-50">✕</button>

            <div className="bg-gradient-to-br from-[#ff5a00] to-[#e04f00] p-12 text-center text-white relative">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              <span className="relative z-10 inline-block bg-white/20 px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md">Kalkulált eredmény</span>
              <h2 className="relative z-10 text-4xl md:text-5xl font-black tracking-tighter italic drop-shadow-2xl">{eredmeny.modell}</h2>
            </div>
            
            <div className="p-10 md:p-12 text-center">
              <p className="text-gray-700 font-bold leading-relaxed text-xl mb-10">{eredmeny.indoklas}</p>
              
              <div className="space-y-6">
                <a href={eredmeny.link} target="_blank" rel="noreferrer" 
                  className="w-full flex items-center justify-center gap-4 px-8 py-6 bg-orange-500 text-white rounded-[1.5rem] font-black text-xl uppercase tracking-widest hover:bg-orange-600 hover:shadow-2xl transition-all transform active:scale-[0.98] shadow-lg">
                  Megtekintem a terméket
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>

                {eredmeny.kereskedo && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${eredmeny.kereskedo.lat},${eredmeny.kereskedo.lon}`} target="_blank" rel="noreferrer" 
                      className="flex items-center justify-center gap-2 px-6 py-5 bg-gray-50 text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-white hover:border-orange-500 transition-all transform active:scale-[0.97] shadow-sm">
                      📍 Útvonalterv
                    </a>
                    <a href={`tel:${eredmeny.kereskedo.telefon.replace(/\s+/g, '')}`} 
                      className="flex items-center justify-center gap-2 px-6 py-5 bg-gray-950 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-gray-800 transition-all transform active:scale-[0.97] shadow-lg">
                      📞 Hívás indítása
                    </a>
                  </div>
                )}

                {eredmeny.kereskedo && (
                  <div className="p-6 bg-orange-50/50 rounded-[2.5rem] border-2 border-orange-100 text-left shadow-inner mt-4">
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                       <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                       Legközelebbi partnerünk
                    </p>
                    <h3 className="font-black text-gray-950 text-2xl leading-tight tracking-tight">{eredmeny.kereskedo.nev}</h3>
                    <p className="text-base text-gray-500 font-bold mt-2 leading-relaxed">
                      {eredmeny.kereskedo.cim} 
                      {eredmeny.tavolsag !== null && <span className="text-orange-600 ml-2">(~{eredmeny.tavolsag} km)</span>}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PRÉMIUM ANIMÁCIÓ --- */}
      {isAnimating && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center">
          <div className="relative w-36 h-36 mb-12 flex items-center justify-center">
             <div className="absolute inset-0 border-8 border-white/5 rounded-full"></div>
             <div className="absolute inset-0 border-8 border-orange-500 rounded-full border-t-transparent animate-spin"></div>
             <div className="absolute w-16 h-16 bg-orange-500/10 rounded-full animate-ping"></div>
             <div className="text-5xl text-orange-500 relative z-10 animate-pulse">🔍</div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-[0.3em] mb-12 drop-shadow-2xl italic">
             Navimow elemzése...
          </h2>
          <div className="w-full max-w-md bg-white/5 h-4 rounded-full overflow-hidden border border-white/10 p-1 shadow-2xl">
            <div className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full shadow-[0_0_40px_rgba(255,90,0,0.6)] transition-all duration-75 ease-linear"
                 style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-white font-black mt-8 text-6xl tracking-tighter italic drop-shadow-lg">{progress}%</p>
        </div>
      )}
    </div>
  );
}
