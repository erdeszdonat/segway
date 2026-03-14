"use client";
import { useState, useEffect } from 'react';

// --- KERESKEDŐK LISTÁJA ---
const KERESKEDOK = [
  { nev: "Robotfűnyírócentrum - Robotfűnyíró szaküzlet", varos: "Budapest", cim: "1118 Budapest, Rétköz utca 7.", lat: 47.465, lon: 18.995, telefon: "+36 30 111 1111" },
  { nev: "Bakó és Társa Kft. Gazda-ABC és Kertigép Centrum", varos: "Szombathely", cim: "9700 Szombathely, Vasút út 10.", lat: 47.230, lon: 16.621, telefon: "+36 30 606 8000" },
  { nev: "Husqvarna Szeged - MEGA-PLUSZ Kft.", varos: "Szeged", cim: "6720 Szeged", lat: 46.253, lon: 20.141, telefon: "+36 30 222 2222" },
  { nev: "Husqvarna - kerti gépek, kerti eszközök - Hosagép Kft.", varos: "Budaörs", cim: "2040 Budaörs, Szabadság út 77.", lat: 47.461, lon: 18.953, telefon: "+36 20 355 4031" },
  { nev: "Husqvarna Szakkereskedés és Márkaszerviz Mokry Műszaki Áruház", varos: "Békéscsaba", cim: "5600 Békéscsaba, Mokry u. 16.", lat: 46.680, lon: 21.090, telefon: "+36 20 436 8346" },
  { nev: "ANDL Kft. - Husqvarna, AS-Motor szaküzlet", varos: "Veszprém", cim: "8200 Veszprém", lat: 47.093, lon: 17.911, telefon: "+36 30 333 3333" },
  { nev: "ANDL Kft. - Husqvarna, AS-Motor szaküzlet", varos: "Balatonfüred", cim: "8230 Balatonfüred", lat: 46.960, lon: 17.880, telefon: "+36 30 333 3334" },
  { nev: "ANDL Kft. - Husqvarna, AS-Motor szaküzlet", varos: "Pápa", cim: "8500 Pápa", lat: 47.330, lon: 17.460, telefon: "+36 30 333 3335" },
  { nev: "Grönway Kft.", varos: "Budapest", cim: "1152 Budapest", lat: 47.530, lon: 19.120, telefon: "+36 30 444 4444" },
  { nev: "Rotáció Kft.", varos: "Tata", cim: "2890 Tata", lat: 47.650, lon: 18.310, telefon: "+36 30 555 5555" },
  { nev: "Kert-Plusz Kft.", varos: "Székesfehérvár", cim: "8000 Székesfehérvár", lat: 47.190, lon: 18.410, telefon: "+36 30 666 6666" },
  { nev: "Husqvarna Zsombó - MEGA-PLUSZ Kft.", varos: "Zsombó", cim: "6792 Zsombó", lat: 46.330, lon: 19.980, telefon: "+36 30 777 7777" },
  { nev: "Vízöntők Bt.", varos: "Kiskunhalas", cim: "6400 Kiskunhalas", lat: 46.430, lon: 19.480, telefon: "+36 30 888 8888" },
  { nev: "Vízöntők Bt.", varos: "Baja", cim: "6500 Baja", lat: 46.180, lon: 18.950, telefon: "+36 30 888 8889" },
  { nev: "Nagy és Társa Kft", varos: "Debrecen", cim: "4025 Debrecen", lat: 47.530, lon: 21.620, telefon: "+36 30 999 9999" },
  { nev: "Zöld Éden Kft.", varos: "Kecskemét", cim: "6000 Kecskemét", lat: 46.900, lon: 19.690, telefon: "+36 30 000 0000" },
  { nev: "STIGA Szakkereskedés (Szol-Garden Kft.)", varos: "Szolnok", cim: "5000 Szolnok", lat: 47.170, lon: 20.190, telefon: "+36 30 111 2222" },
  { nev: "Huber Kft.", varos: "Miskolc", cim: "3525 Miskolc", lat: 48.100, lon: 20.780, telefon: "+36 30 222 3333" },
  { nev: "Agro Takács Kft.", varos: "Győr", cim: "9024 Győr", lat: 47.680, lon: 17.630, telefon: "+36 30 333 4444" },
  { nev: "Barta GT Bt", varos: "Eger", cim: "3300 Eger", lat: 47.900, lon: 20.370, telefon: "+36 30 444 5555" }
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

export default function SegwayKalkulator() {
  const [isPartner, setIsPartner] = useState(false);
  const [eredmeny, setEredmeny] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [arnyekoltValue, setArnyekoltValue] = useState("nem");
  
  // Hibakezelés és töltés állapotok
  const [cityError, setCityError] = useState("");
  const [isCheckingCity, setIsCheckingCity] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsPartner(params.get('partner') === '1');
  }, []);

  const szamolas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const meret = Number(formData.get('meret'));
    const lejto = Number(formData.get('lejto'));
    const telepules = formData.get('telepules') as string;

    // --- 1. TELEPÜLÉS ELLENŐRZÉSE ---
    setIsCheckingCity(true);
    setCityError("");

    let nearestKereskedo = KERESKEDOK[0];
    let tavolsagKm: number | null = null;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(telepules)}, Hungary`);
      const data = await res.json();
      
      // HA NEM TALÁLJA A VÁROST:
      if (!data || data.length === 0) {
        setCityError("Nem találjuk ezt a települést. Lehet, hogy elírta a nevét?");
        setIsCheckingCity(false);
        return; // MEGÁLLÍTJUK A FOLYAMATOT
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
    } catch (err) {
      console.error("Geocoding hiba, megyünk tovább alapértelmezettel", err);
    }

    setIsCheckingCity(false);

    // --- 2. GÉP LOGIKA ---
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
    } 
    else if (meret <= 800) {
      if (lejto <= 30) {
        modell = "Segway Navimow i108E";
        indoklas = "Az okos i-széria nagyobb akkumulátoros változata, tökéletes közepes kertekhez 800 m²-ig.";
      } else {
        modell = "Segway Navimow H800E";
        indoklas = "Meredekebb, tagolt kertbe a H-széria 800 m²-es típusát javasoljuk.";
      }
    }
    else if (meret <= 1500) {
      modell = arnyekolt ? "Segway Navimow H1500E + VisionFence" : "Segway Navimow H1500E";
      indoklas = arnyekolt ? "A fák/falak miatt a VisionFence kamera elengedhetetlen a pontos navigációhoz." : "Nagy teljesítményű, robusztus gép közepes és nagy kertekbe.";
    }
    else if (meret <= 3000) {
      modell = arnyekolt ? "Segway Navimow H3000E + VisionFence" : "Segway Navimow H3000E";
      indoklas = "A legnagyobb kapacitású csúcsmodell, amely megbirkózik a legnagyobb területekkel is.";
    }
    else {
      modell = "Ipari megoldás / Több robot";
      indoklas = "Ekkora területre érdemes több gépben vagy ipari Segway megoldásban gondolkodni a hatékonyság érdekében.";
    }

    // --- 3. ANIMÁCIÓ ---
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
      setEredmeny({ 
        modell, indoklas, 
        kereskedo: nearestKereskedo, 
        tavolsag: tavolsagKm 
      });
    }, 4500);
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 md:p-8 font-sans bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/hatter.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

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
              <div className="flex items-center gap-2 mb-2 ml-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                  GPS árnyékoltság
                </label>
                <div className="group relative flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-gray-600 hover:bg-[#ff5a00] hover:text-white transition-colors cursor-help">
                  <span className="text-[10px] font-black">?</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs font-medium rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl text-center">
                    A Navimow műholdas (EFLS) navigációt használ. Ha sok a magas fa vagy épület, a gépnek szüksége lehet a VisionFence kamerára a tökéletes vágáshoz.
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div onClick={() => setArnyekoltValue("nem")}
                  className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 ${arnyekoltValue === 'nem' ? 'border-[#ff5a00] bg-orange-50 shadow-md transform scale-[1.02]' : 'border-gray-200 bg-gray-50 hover:border-orange-200'}`}>
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-2xl transition-colors ${arnyekoltValue === 'nem' ? 'bg-[#ff5a00] text-white shadow-inner' : 'bg-gray-200 grayscale opacity-70'}`}>☀️</div>
                  <div>
                    <h3 className={`font-bold text-sm ${arnyekoltValue === 'nem' ? 'text-[#ff5a00]' : 'text-gray-700'}`}>Tiszta terep</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">Nincsenek magas fák vagy falak, tisztán rálátni az égre.</p>
                  </div>
                </div>

                <div onClick={() => setArnyekoltValue("igen")}
                  className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 ${arnyekoltValue === 'igen' ? 'border-[#ff5a00] bg-orange-50 shadow-md transform scale-[1.02]' : 'border-gray-200 bg-gray-50 hover:border-orange-200'}`}>
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center text-2xl transition-colors ${arnyekoltValue === 'igen' ? 'bg-[#ff5a00] text-white shadow-inner' : 'bg-gray-200 grayscale opacity-70'}`}>🌳</div>
                  <div>
                    <h3 className={`font-bold text-sm ${arnyekoltValue === 'igen' ? 'text-[#ff5a00]' : 'text-gray-700'}`}>Fák és Falak</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">Vannak magasabb fák, sűrű lombok, vagy épületek a szélén.</p>
                  </div>
                </div>
              </div>
              {/* Rejtett input az űrlaphoz */}
              <input type="hidden" name="arnyekolt" value={arnyekoltValue} />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2 ml-1">Település</label>
              <input name="telepules" type="text" placeholder="Pl. Esztergom" required 
                onChange={() => setCityError("")}
                className={`w-full px-5 py-4 bg-gray-100 border ${cityError ? 'border-red-500 ring-4 ring-red-500/20' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-4 focus:ring-[#ff5a00]/20 focus:border-[#ff5a00] transition-all text-gray-900 font-bold text-base outline-none placeholder:text-gray-400 shadow-sm`} />
              
              {/* --- HIBAÜZENET A TELEPÜLÉSHEZ --- */}
              {cityError && (
                <div className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1 ml-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {cityError}
                </div>
              )}
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

            {/* --- KÖTELEZŐ GDPR CHECKBOX --- */}
            <div className="md:col-span-2 mt-2 px-1">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                  <input type="checkbox" required className="peer sr-only" />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded bg-white peer-checked:bg-[#ff5a00] peer-checked:border-[#ff5a00] transition-colors"></div>
                  <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="text-xs text-gray-500 font-medium leading-relaxed">
                  Elfogadom az <a href="#" className="text-[#ff5a00] hover:underline font-bold transition-all">Adatvédelmi tájékoztatót</a>, és hozzájárulok, hogy a megadott elérhetőségeimen az eredményekkel kapcsolatban felkeressenek.
                </span>
              </label>
            </div>

            <div className="md:col-span-2 mt-2">
              <button type="submit" disabled={isCheckingCity}
                className="w-full bg-[#111] text-white py-5 px-6 rounded-xl font-black text-lg uppercase tracking-[0.2em] hover:bg-[#ff5a00] hover:shadow-[0_10px_30px_rgba(255,90,0,0.4)] transform active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-3">
                {isCheckingCity ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Ellenőrzés...</>
                ) : (
                  "Mutasd az ideális gépet"
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* --- KÜLÖN ABLAK (MODAL) --- */}
      {eredmeny && !isAnimating && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-[0_0_60px_rgba(255,90,0,0.3)] border border-orange-500/20 overflow-hidden animate-in zoom-in-95 duration-500 my-auto">
            
            <button onClick={() => setEredmeny(null)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors z-10">
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
              <p className="text-base text-gray-700 font-medium leading-relaxed mb-6">
                {eredmeny.indoklas}
              </p>
              
              {eredmeny.kereskedo && (
                <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${eredmeny.kereskedo.lat},${eredmeny.kereskedo.lon}`} target="_blank" rel="noreferrer" 
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-[#ff5a00] text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#e04f00] hover:shadow-[0_5px_15px_rgba(255,90,0,0.4)] transform active:scale-[0.98] transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    Útvonalterv
                  </a>
                  <a href={`tel:${eredmeny.kereskedo.telefon.replace(/\s+/g, '')}`} 
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-4 bg-[#111] text-white rounded-xl font-black text-sm uppercase tracking-wider hover:bg-gray-800 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)] transform active:scale-[0.98] transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    Hívás indítása
                  </a>
                </div>
              )}

              {eredmeny.kereskedo && (
                <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 text-left shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📍</span>
                    <p className="text-[10px] font-black text-[#ff5a00] uppercase tracking-widest">Önhöz legközelebbi partnerünk</p>
                  </div>
                  <h3 className="font-black text-gray-900 text-lg">{eredmeny.kereskedo.nev}</h3>
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    {eredmeny.kereskedo.cim} 
                    {eredmeny.tavolsag !== null && (
                      <span className="text-[#ff5a00] font-bold ml-1">
                        (~{eredmeny.tavolsag} km)
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- PRÉMIUM ANIMÁCIÓ --- */}
      {isAnimating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="flex flex-col items-center max-w-lg w-full animate-in slide-in-from-bottom-4 duration-500">
            
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
