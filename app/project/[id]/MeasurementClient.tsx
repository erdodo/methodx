"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Square, TimerReset, CopyPlus, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { saveObservation, createOperation } from "@/app/actions/data";
import { useRouter } from "next/navigation";

function fmt(ms: number) {
  let cs = Math.floor((ms % 1000) / 10);
  let s  = Math.floor(ms / 1000) % 60;
  let m  = Math.floor(ms / 60000);
  return (m ? String(m).padStart(2,'0') + ':' : '') +
         String(s).padStart(2,'0') + '.' + String(cs).padStart(2,'0');
}

export default function MeasurementClient({ project, personnel, dbObservations }: any) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("timer");
  const [rating, setRating] = useState(100);
  const [newOpName, setNewOpName] = useState("");
  
  // Default to first line for operations simplicity
  const defaultLine = project.lines[0];
  const allOperations = defaultLine?.operations || [];
  
  const [activeOperationId, setActiveOperationId] = useState<string | null>(
    allOperations.length > 0 ? allOperations[0].id : null
  );
  
  const [activePersonnelId, setActivePersonnelId] = useState<string | null>(
    personnel.length > 0 ? personnel[0].id : null
  );

  const [observations, setObservations] = useState<any[]>(
    dbObservations.map((o: any) => ({
      id: o.id,
      opName: o.operation.name,
      observed: o.observedTime,
      rating: o.rating,
      normal: o.normalTime,
      ts: new Date(o.timestamp)
    }))
  );

  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const clockRef = useRef<HTMLDivElement>(null);

  const startTsRef = useRef<number | null>(null);
  const lapBaseRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startTsRef.current) {
      const nowElapsed = Date.now() - startTsRef.current;
      setElapsed(nowElapsed);
      if (clockRef.current) {
        clockRef.current.textContent = fmt(nowElapsed);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const tStart = () => {
    if (isRunning || !activeOperationId || !activePersonnelId) return;
    setIsRunning(true);
    startTsRef.current = Date.now() - elapsed;
    lapBaseRef.current = lapBaseRef.current || Date.now();
    rafRef.current = requestAnimationFrame(tick);
  };

  const tStop = async () => {
    if (!isRunning) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsRunning(false);
    
    const finalElapsed = Date.now() - (startTsRef.current || 0);
    setElapsed(finalElapsed);
    
    await addObs(finalElapsed);
    
    setElapsed(0);
    startTsRef.current = null;
    lapBaseRef.current = null;
    if (clockRef.current) clockRef.current.textContent = '00:00.00';
  };

  const tLap = async () => {
    if (!isRunning) return;
    const now = Date.now();
    const lapMs = now - (lapBaseRef.current || now);
    lapBaseRef.current = now;
    await addObs(lapMs);
  };

  const tReset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsRunning(false);
    setElapsed(0);
    startTsRef.current = null;
    lapBaseRef.current = null;
    if (clockRef.current) clockRef.current.textContent = '00:00.00';
  };

  const addObs = async (ms: number) => {
    const secs = parseFloat((ms / 1000).toFixed(3));
    const normal = parseFloat(((secs * rating) / 100).toFixed(3));
    const op = allOperations.find((o: any) => o.id === activeOperationId);
    if (!op || !activePersonnelId) return;
    
    const obs = {
      operationId: activeOperationId,
      personnelId: activePersonnelId,
      opName: op.name,
      observed: secs,
      rating,
      normal,
      ts: new Date()
    };

    setObservations(prev => [obs, ...prev]);

    // Background save
    await saveObservation(obs);
  };

  const handleAddOperation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpName || !defaultLine) return;
    const formData = new FormData();
    formData.append("name", newOpName);
    const res = await createOperation(project.id, defaultLine.id, formData);
    if (res.success) {
      setNewOpName("");
    }
  };

  const doExport = () => {
    if(!observations.length) { alert('Önce en az bir ölçüm yapın!'); return; }
    const data = [
      ['metodX — İş Etüdü Raporu'],
      ['Proje:', project.name],
      ['Tarih:', new Date().toLocaleDateString('tr-TR')],
      ['Toplam Gözlem:', observations.length],
      [],
      ['#','Operasyon','Gözlenen Süre (s)','Rating (%)','Normal Süre (s)','Zaman Damgası'],
      ...[...observations].reverse().map((o,i) => [i+1, o.opName, o.observed, o.rating, o.normal, o.ts.toLocaleTimeString('tr-TR')])
    ];

    if (observations.length > 1) {
      let vals = observations.map(o => o.observed);
      let avg  = vals.reduce((a,b) => a+b, 0) / vals.length;
      let std  = Math.sqrt(vals.reduce((a,b) => a + Math.pow(b-avg,2), 0) / vals.length);
      let avgR = observations.reduce((a,b) => a + b.rating, 0) / observations.length;
      data.push(
        [],
        ['— ÖZET İSTATİSTİKLER —'],
        ['Ortalama Süre (s)', avg.toFixed(3)],
        ['Standart Sapma (s)', std.toFixed(3)],
        ['Varyasyon Katsayısı (%)', (std/avg*100).toFixed(2)],
        ['Ortalama Rating (%)', avgR.toFixed(1)],
        ['Normal Süre (s)', (avg*avgR/100).toFixed(3)],
        ['Gözlem Sayısı', observations.length]
      );
    }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{wch:5},{wch:25},{wch:20},{wch:14},{wch:17},{wch:20}];
    XLSX.utils.book_append_sheet(wb, ws, 'Gözlemler');
    XLSX.writeFile(wb, `metodX_${project.name}_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const getRatingHint = (v: number) => {
    if(v < 80) return <><b className="text-[var(--text2)]">Çok yavaş</b> — Acemi veya yorgun çalışan.</>;
    if(v < 95) return <><b className="text-[var(--text2)]">Yavaşın altı</b> — Normalden biraz yavaş.</>;
    if(v <= 105) return <><b className="text-[var(--text2)]">Normal hız</b> — Ortalama deneyimli bir çalışan.</>;
    if(v <= 120) return <><b className="text-[var(--text2)]">Hızlı</b> — Deneyimli, tempolu çalışan.</>;
    return <><b className="text-[var(--text2)]">Çok hızlı</b> — İstisnai tempoya dikkat edin.</>;
  };

  const activeOpObj = allOperations.find((o: any) => o.id === activeOperationId);
  const activePerObj = personnel.find((p: any) => p.id === activePersonnelId);

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 md:p-8">
      <div className="max-w-[1080px] mx-auto">
        
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--text2)] hover:text-[var(--blue)] font-semibold transition-colors text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-[var(--border)]">
            <ArrowLeft size={16} /> Panoya Dön
          </Link>
        </div>

        <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--r-xl)] shadow-[var(--shadow-lg)] overflow-hidden">
          {/* App Bar */}
          <div className="bg-[var(--bg3)] border-b border-[var(--border)] px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="text-xs text-[var(--text3)] ml-2 font-medium">
              metodX · {project.name} · {new Date().toLocaleDateString('tr-TR')}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] overflow-x-auto bg-[var(--bg2)] hide-scrollbar">
            {['timer', 'analysis', 'rating', 'howto'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-5 py-3 text-[0.82rem] font-semibold whitespace-nowrap border-b-[2.5px] transition-colors ${activeTab === t ? 'text-[var(--blue)] border-[var(--blue)]' : 'text-[var(--text3)] border-transparent hover:text-[var(--text2)]'}`}
              >
                {t === 'timer' ? '⏱ Kronometre' : t === 'analysis' ? '📈 Analiz' : t === 'rating' ? '❓ Rating Nedir?' : '📖 Nasıl Kullanılır?'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* TIMER TAB */}
            {activeTab === 'timer' && (
              <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
                
                {/* Left Panel */}
                <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--r)] p-4 flex flex-col gap-1 h-fit">
                  <div className="text-[0.66rem] font-bold tracking-widest uppercase text-[var(--text3)] mb-2">Operasyonlar</div>
                  
                  {allOperations.length === 0 ? (
                    <div className="text-xs text-[var(--text3)] italic py-2">Operasyon Yok</div>
                  ) : (
                    allOperations.map((op: any, i: number) => (
                      <div
                        key={op.id}
                        onClick={() => setActiveOperationId(op.id)}
                        className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-[0.8rem] font-medium transition-colors ${activeOperationId === op.id ? 'bg-[var(--blue-lt)] text-[var(--blue)]' : 'text-[var(--text2)] hover:bg-[var(--bg4)] hover:text-[var(--text)]'}`}
                      >
                        <span className={`font-mono text-[0.67rem] px-1.5 py-0.5 rounded text-center min-w-[1.6rem] ${activeOperationId === op.id ? 'bg-[var(--blue-md)] text-[var(--blue)]' : 'bg-[var(--bg4)] text-[var(--text3)]'}`}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="truncate">{op.name}</span>
                      </div>
                    ))
                  )}

                  <form onSubmit={handleAddOperation} className="mt-3 flex gap-2">
                    <input value={newOpName} onChange={e => setNewOpName(e.target.value)} placeholder="+ Yeni" className="flex-1 min-w-0 bg-white border border-[var(--border)] rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[var(--blue)]" />
                    <button type="submit" className="bg-[var(--blue-lt)] text-[var(--blue)] px-2 rounded hover:bg-[var(--blue-md)]">+</button>
                  </form>

                  <hr className="border-t border-[var(--border)] my-4" />
                  
                  <div className="text-[0.65rem] font-bold tracking-widest uppercase text-[var(--text3)] mb-1.5">Çalışan (Personel)</div>
                  {personnel.length === 0 ? (
                    <Link href="/" className="text-xs text-[var(--blue)] underline">Personel Ekle</Link>
                  ) : (
                    <select
                      value={activePersonnelId || ''}
                      onChange={e => setActivePersonnelId(e.target.value)}
                      className="w-full bg-white border border-[var(--border)] rounded px-2 py-2 text-xs font-semibold text-[var(--text2)] outline-none"
                    >
                      {personnel.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  )}
                  {activePerObj && <div className="text-[0.72rem] text-[var(--text3)] mt-1">{activePerObj.experienceLevel} Düzey</div>}
                </div>

                {/* Right Panel */}
                <div className="flex flex-col gap-4">
                  
                  {/* Timer Face */}
                  <div className="bg-gradient-to-br from-[var(--blue-lt)] to-white border-[1.5px] border-[var(--blue-md)] rounded-[var(--r-lg)] p-6 text-center shadow-sm relative overflow-hidden">
                    <div className="text-[0.65rem] font-bold tracking-[0.1em] uppercase text-[var(--blue)] mb-2">
                      {activeOpObj ? activeOpObj.name.toUpperCase() : 'OPERASYON SEÇİN'}
                    </div>
                    
                    <div ref={clockRef} className={`font-mono text-5xl md:text-6xl font-medium tracking-tight leading-none mb-6 transition-colors ${isRunning ? 'text-[var(--green)]' : elapsed > 0 ? 'text-[var(--amber)]' : 'text-[var(--text)]'}`}>
                      00:00.00
                    </div>

                    <div className="bg-white border border-[var(--border)] rounded-xl p-4 shadow-sm max-w-sm mx-auto">
                      <div className="text-[0.7rem] font-bold text-[var(--text2)] mb-2 text-left">Performans Rating'i</div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[var(--text3)] font-mono">%60</span>
                        <input type="range" min="60" max="140" value={rating} onChange={e => setRating(parseInt(e.target.value))} className="flex-1 accent-[var(--blue)] h-1 cursor-pointer" />
                        <span className="text-xs text-[var(--text3)] font-mono">%140</span>
                        <div className="font-mono text-xs font-medium text-[var(--blue)] bg-[var(--blue-lt)] border border-[var(--blue-md)] px-2 py-1 rounded-md min-w-[3.4rem] text-center">%{rating}</div>
                      </div>
                      <div className="text-[0.72rem] text-[var(--text3)] mt-2 text-left leading-relaxed">
                        {getRatingHint(rating)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mt-6">
                      <button onClick={tStart} disabled={isRunning || !activeOperationId} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold shadow-[0_2px_8px_rgba(22,163,74,0.22)] bg-[var(--green)] text-white hover:bg-[#15803d] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:translate-y-0 hover:-translate-y-[1px]">
                        <Play size={16} fill="currentColor" /> Başlat
                      </button>
                      <button onClick={tStop} disabled={!isRunning} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold shadow-[0_2px_8px_rgba(220,38,38,0.18)] bg-[var(--red)] text-white hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:translate-y-0 hover:-translate-y-[1px]">
                        <Square size={16} fill="currentColor" /> Durdur
                      </button>
                      <button onClick={tLap} disabled={!isRunning} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold border-[1.5px] border-[var(--border2)] bg-[var(--bg3)] text-[var(--text)] hover:bg-[var(--bg4)] disabled:opacity-50 transition-all">
                        <CopyPlus size={16} /> Tur Al
                      </button>
                      <button onClick={tReset} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-bold border-[1.5px] border-[var(--border)] bg-[var(--bg3)] text-[var(--text2)] hover:bg-[var(--bg4)] transition-all">
                        <TimerReset size={16} /> Sıfırla
                      </button>
                    </div>
                  </div>

                  {/* Observations Table */}
                  <div className="bg-[var(--bg2)] border border-[var(--border)] rounded-[var(--r)] overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg3)] border-b border-[var(--border)]">
                      <div className="flex items-center gap-2">
                        <span className="text-[0.68rem] font-bold tracking-widest uppercase text-[var(--text3)]">Gözlemler</span>
                        <span className="bg-[var(--blue-md)] text-[var(--blue)] text-[0.7rem] font-bold px-2 py-0.5 rounded-full">{observations.length}</span>
                      </div>
                      <button onClick={doExport} className="flex items-center gap-1.5 bg-[var(--green-lt)] border-[1.5px] border-[var(--green-md)] text-[var(--green)] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[var(--green-md)] transition-colors">
                        <Download size={14} /> Excel İndir
                      </button>
                    </div>
                    <div className="overflow-x-auto max-h-[220px]">
                      <table className="w-full text-left border-collapse text-[0.77rem]">
                        <thead className="sticky top-0 bg-[var(--bg3)] text-[var(--text3)] text-[0.66rem] font-bold uppercase tracking-wider z-10 shadow-sm">
                          <tr>
                            <th className="px-3 py-2 border-b border-[var(--border)]">#</th>
                            <th className="px-3 py-2 border-b border-[var(--border)]">Operasyon</th>
                            <th className="px-3 py-2 border-b border-[var(--border)]">Gözlenen (s)</th>
                            <th className="px-3 py-2 border-b border-[var(--border)]">Rating</th>
                            <th className="px-3 py-2 border-b border-[var(--border)]">Normal (s)</th>
                            <th className="px-3 py-2 border-b border-[var(--border)]">Sapma</th>
                          </tr>
                        </thead>
                        <tbody>
                          {observations.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="text-center py-8 text-[var(--text3)] italic text-[0.82rem]">
                                ▶ Başlat'a bas, operasyonu ölç, ■ Durdur ile kaydet
                              </td>
                            </tr>
                          ) : (
                            observations.map((o, i) => {
                              const n = observations.length - i;
                              const currentVals = observations.map(x => x.observed);
                              const currentAvg = currentVals.reduce((a,b)=>a+b,0) / currentVals.length;
                              const dev = ((o.observed - currentAvg) / currentAvg * 100);
                              return (
                                <tr key={i} className="hover:bg-[var(--blue-lt)] group border-b border-black/5 last:border-0">
                                  <td className="px-3 py-2 text-[var(--text)] font-mono text-[0.74rem]">{n}</td>
                                  <td className="px-3 py-2 text-[var(--text)] font-semibold">{o.opName}</td>
                                  <td className="px-3 py-2 text-[var(--text)] font-mono text-[0.74rem]">{o.observed.toFixed(2)}</td>
                                  <td className="px-3 py-2 text-[var(--amber)] font-mono text-[0.74rem]">%{(o.rating)}</td>
                                  <td className="px-3 py-2 text-[var(--text)] font-mono text-[0.74rem]">{o.normal.toFixed(2)}</td>
                                  <td className={`px-3 py-2 font-mono text-[0.73rem] font-medium ${dev > 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
                                    {dev > 0 ? '+' : ''}{dev.toFixed(1)}%
                                  </td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Other tabs simplified for brevity if needed, but adding exactly from prototype */}
            {activeTab === 'analysis' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--r)] p-4">
                    <div className="text-[0.63rem] font-bold tracking-widest uppercase text-[var(--text3)] mb-1">Toplam Gözlem</div>
                    <div className="text-3xl font-extrabold text-[var(--blue)] tracking-tight leading-none">{observations.length}</div>
                  </div>
                  <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--r)] p-4">
                    <div className="text-[0.63rem] font-bold tracking-widest uppercase text-[var(--text3)] mb-1">Ortalama Süre</div>
                    <div className="text-3xl font-extrabold text-[var(--green)] tracking-tight leading-none">
                      {observations.length ? (observations.reduce((a,b)=>a+b.observed,0)/observations.length).toFixed(1) + 's' : '—'}
                    </div>
                  </div>
                  <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--r)] p-4">
                    <div className="text-[0.63rem] font-bold tracking-widest uppercase text-[var(--text3)] mb-1">Normal Süre</div>
                    <div className="text-3xl font-extrabold text-[#7c3aed] tracking-tight leading-none">
                      {observations.length ? (observations.reduce((a,b)=>a+b.normal,0)/observations.length).toFixed(1) + 's' : '—'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'rating' && (
              <div className="max-w-xl">
                 <div className="text-sm text-[var(--text2)] leading-relaxed mb-4">
                  Kronometre sadece <b className="text-[var(--text)]">gözlenen süreyi</b> ölçer. Ama her çalışan aynı hızda çalışmaz. <b className="text-[var(--text)]">Rating</b>, o anki çalışanın hızını &quot;ortalama&quot; çalışana göre puanlamanızı sağlar.
                 </div>
                 <div className="bg-[var(--bg3)] border border-[var(--border)] rounded-[var(--r)] p-4 inline-block mt-2">
                    <div className="text-[0.68rem] font-bold uppercase tracking-widest text-[var(--text3)] mb-2">Hesaplama Formülü</div>
                    <div className="font-mono text-sm bg-white border border-[var(--border)] rounded-md px-3 py-2 inline-block">Normal Süre = Gözlenen Süre × Rating / 100</div>
                 </div>
              </div>
            )}

            {activeTab === 'howto' && (
              <div className="max-w-xl space-y-3">
                 <div className="flex gap-4 p-4 rounded-xl bg-[var(--blue-lt)] border border-[var(--blue-md)]">
                   <div className="w-7 h-7 bg-[var(--blue)] text-white rounded-full flex items-center justify-center font-bold shrink-0 text-sm">1</div>
                   <div><div className="font-bold text-sm mb-1">Operasyon Seçin</div><div className="text-sm text-[var(--text2)]">Sol listeden ölçmek istediğiniz operasyonu ve çalışan personeli seçin.</div></div>
                 </div>
                 <div className="flex gap-4 p-4 rounded-xl bg-[var(--green-lt)] border border-[var(--green-md)]">
                   <div className="w-7 h-7 bg-[var(--green)] text-white rounded-full flex items-center justify-center font-bold shrink-0 text-sm">2</div>
                   <div><div className="font-bold text-sm mb-1">▶ Başlat → ■ Durdur</div><div className="text-sm text-[var(--text2)]">Başlat'a basın, operasyon bitince Durdur'a basın. Ölçüm otomatik kaydedilir.</div></div>
                 </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
