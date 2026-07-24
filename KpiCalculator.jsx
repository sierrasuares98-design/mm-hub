import React, { useState } from 'react';
import { TrendingUp, Users, Target, Award, Calculator, CheckCircle, Percent } from 'lucide-react';

export default function KpiCalculator() {
  const [activeKpiTab, setActiveKpiTab] = useState('group'); // 'group' or 'individual'

  // --- GROUP KPI STATE ---
  const [reachPrev, setReachPrev] = useState('');
  const [reachCurr, setReachCurr] = useState('');
  const [vTiktok, setVTiktok] = useState('');
  const [vReels, setVReels] = useState('');
  const [vYt, setVYt] = useState('');
  
  const [engInteractions, setEngInteractions] = useState('');
  const [engViews, setEngViews] = useState('');
  
  const [valShares, setValShares] = useState('');
  const [valSaves, setValSaves] = useState('');
  const [valTotalInt, setValTotalInt] = useState('');

  const [ctrClicks, setCtrClicks] = useState('');
  const [ctrViews, setCtrViews] = useState('');
  const [leadChats, setLeadChats] = useState('');

  // Group Computations
  const reachGrowth = reachPrev ? (((Number(reachCurr) - Number(reachPrev)) / Number(reachPrev)) * 100).toFixed(1) : 0;
  const totalViews = Number(vTiktok) + Number(vReels) + Number(vYt);
  const engRate = engViews ? ((Number(engInteractions) / Number(engViews)) * 100).toFixed(2) : 0;
  const totalSharesSaves = Number(valShares) + Number(valSaves);
  const valRatio = valTotalInt ? ((totalSharesSaves / Number(valTotalInt)) * 100).toFixed(1) : 0;
  const ctrRate = ctrViews ? ((Number(ctrClicks) / Number(ctrViews)) * 100).toFixed(2) : 0;
  const leadGenRate = ctrClicks ? ((Number(leadChats) / Number(ctrClicks)) * 100).toFixed(1) : 0;

  // --- INDIVIDUAL KPI STATE ---
  const [indRole, setIndRole] = useState('scriptwriter'); // scriptwriter, video, graphic
  
  // Scriptwriter
  const [swShort, setSwShort] = useState('');
  const [swLong, setSwLong] = useState('');
  const [swArticle, setSwArticle] = useState('');
  const [swTalent, setSwTalent] = useState('');
  const [swTarget, setSwTarget] = useState(35);
  const [swTotalTask, setSwTotalTask] = useState('');
  const [swOnTime, setSwOnTime] = useState('');

  // Video
  const [vdShort, setVdShort] = useState('');
  const [vdComplex, setVdComplex] = useState('');
  const [vdLong, setVdLong] = useState('');
  const [edShort, setEdShort] = useState('');
  const [edComplex, setEdComplex] = useState('');
  const [edLong, setEdLong] = useState('');
  const [edIndepth, setEdIndepth] = useState('');
  const [vdTarget, setVdTarget] = useState(75);
  const [vdTotalTask, setVdTotalTask] = useState('');
  const [vdOnTime, setVdOnTime] = useState('');
  const [vdRevisions, setVdRevisions] = useState('');

  // Graphic
  const [gdSimple, setGdSimple] = useState('');
  const [gdComplex, setGdComplex] = useState('');
  const [gdPrint, setGdPrint] = useState('');
  const [gdMerch, setGdMerch] = useState('');
  const [gdPack, setGdPack] = useState('');
  const [gdTarget, setGdTarget] = useState(45);
  const [gdTotalTask, setGdTotalTask] = useState('');
  const [gdOnTime, setGdOnTime] = useState('');
  const [gdRevisions, setGdRevisions] = useState('');

  // Individual Computations
  const swPoints = (Number(swShort) * 1) + (Number(swLong) * 3) + (Number(swArticle) * 2) + (Number(swTalent) * 1);
  const swCapScore = swTarget ? ((swPoints / swTarget) * 100).toFixed(1) : 0;
  const swSlaScore = swTotalTask ? ((Number(swOnTime) / Number(swTotalTask)) * 100).toFixed(1) : 0;

  const vdPoints = (Number(vdShort) * 1) + (Number(vdComplex) * 2) + (Number(vdLong) * 3) + 
                   (Number(edShort) * 1) + (Number(edComplex) * 2) + (Number(edLong) * 3) + (Number(edIndepth) * 5);
  const vdCapScore = vdTarget ? ((vdPoints / vdTarget) * 100).toFixed(1) : 0;
  const vdSlaScore = vdTotalTask ? ((Number(vdOnTime) / Number(vdTotalTask)) * 100).toFixed(1) : 0;
  const vdRevScore = vdTotalTask ? (Number(vdRevisions) / Number(vdTotalTask)).toFixed(2) : 0;

  const gdPoints = (Number(gdSimple) * 1) + (Number(gdComplex) * 2) + (Number(gdPrint) * 2) + (Number(gdMerch) * 3) + (Number(gdPack) * 4);
  const gdCapScore = gdTarget ? ((gdPoints / gdTarget) * 100).toFixed(1) : 0;
  const gdSlaScore = gdTotalTask ? ((Number(gdOnTime) / Number(gdTotalTask)) * 100).toFixed(1) : 0;
  const gdRevScore = gdTotalTask ? (Number(gdRevisions) / Number(gdTotalTask)).toFixed(2) : 0;


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 rounded bg-blue-600/20 text-blue-400"><Calculator size={20} /></span>
            Kalkulator KPI Multimedia
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">Hitung otomatis skor KPI Divisi (Group) maupun Perseorangan (Individual).</p>
        </div>
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1">
          <button 
            onClick={() => setActiveKpiTab('group')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition ${activeKpiTab === 'group' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            KPI Divisi (Group)
          </button>
          <button 
            onClick={() => setActiveKpiTab('individual')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition ${activeKpiTab === 'individual' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            KPI Perseorangan
          </button>
        </div>
      </div>

      {activeKpiTab === 'group' && (
        <div className="space-y-6 animate-slide-in">
          {/* Awareness & Reach */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-zinc-800/30 p-4 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2"><TrendingUp size={16} className="text-indigo-400"/> Top of Funnel (Awareness & Reach)</h4>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">1. Pertumbuhan Reach (Target: 10-15%)</h5>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-zinc-500">Reach Bulan Lalu</label>
                    <input type="number" value={reachPrev} onChange={e=>setReachPrev(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none"/>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-zinc-500">Reach Bulan Ini</label>
                    <input type="number" value={reachCurr} onChange={e=>setReachCurr(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none"/>
                  </div>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg flex justify-between items-center border border-zinc-800/50">
                  <span className="text-xs text-zinc-400">Pertumbuhan Reach:</span>
                  <span className={`font-bold text-lg ${reachGrowth >= 10 ? 'text-emerald-400' : 'text-red-400'}`}>{reachGrowth}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">2. Total Video Views</h5>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">TikTok</label>
                    <input type="number" value={vTiktok} onChange={e=>setVTiktok(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">IG Reels</label>
                    <input type="number" value={vReels} onChange={e=>setVReels(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">YouTube</label>
                    <input type="number" value={vYt} onChange={e=>setVYt(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none"/>
                  </div>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg flex justify-between items-center border border-zinc-800/50">
                  <span className="text-xs text-zinc-400">Akumulasi Views:</span>
                  <span className="font-bold text-lg text-indigo-400">{totalViews.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Consideration & Engagement */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-zinc-800/30 p-4 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2"><Users size={16} className="text-pink-400"/> Middle of Funnel (Consideration & Engagement)</h4>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">1. Engagement Rate (ER)</h5>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-zinc-500">Total Interaksi (Like+Comment+dll)</label>
                    <input type="number" value={engInteractions} onChange={e=>setEngInteractions(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"/>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-zinc-500">Total Views / Reach</label>
                    <input type="number" value={engViews} onChange={e=>setEngViews(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"/>
                  </div>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg flex justify-between items-center border border-zinc-800/50">
                  <span className="text-xs text-zinc-400">ER Score:</span>
                  <span className="font-bold text-lg text-pink-400">{engRate}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">2. Value Content Indicator</h5>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">Total Shares</label>
                    <input type="number" value={valShares} onChange={e=>setValShares(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">Total Saves</label>
                    <input type="number" value={valSaves} onChange={e=>setValSaves(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-500">Total Interaksi</label>
                    <input type="number" value={valTotalInt} onChange={e=>setValTotalInt(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"/>
                  </div>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg flex justify-between items-center border border-zinc-800/50">
                  <span className="text-xs text-zinc-400">Rasio Value Content:</span>
                  <span className="font-bold text-lg text-pink-400">{valRatio}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action & Commerce */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-zinc-800/30 p-4 border-b border-zinc-800">
              <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2"><Target size={16} className="text-emerald-400"/> Bottom of Funnel (Action & Commerce)</h4>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">1. Click-Through Rate (CTR)</h5>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-zinc-500">Klik Link Bio</label>
                    <input type="number" value={ctrClicks} onChange={e=>setCtrClicks(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"/>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-zinc-500">Profile Views / Imp.</label>
                    <input type="number" value={ctrViews} onChange={e=>setCtrViews(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"/>
                  </div>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg flex justify-between items-center border border-zinc-800/50">
                  <span className="text-xs text-zinc-400">CTR Organik (Target 0.9-1.6%):</span>
                  <span className={`font-bold text-lg ${ctrRate >= 0.9 ? 'text-emerald-400' : 'text-amber-400'}`}>{ctrRate}%</span>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">2. Lead Generation (Konversi WA)</h5>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-zinc-500">Jumlah Chat WA</label>
                    <input type="number" value={leadChats} onChange={e=>setLeadChats(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"/>
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-zinc-500">Total Klik Link Bio</label>
                    <input type="number" value={ctrClicks} disabled className="w-full bg-zinc-950/50 border border-zinc-800 rounded p-2 text-sm text-zinc-500 cursor-not-allowed"/>
                  </div>
                </div>
                <div className="bg-zinc-950 p-3 rounded-lg flex justify-between items-center border border-zinc-800/50">
                  <span className="text-xs text-zinc-400">Lead Gen Rate:</span>
                  <span className="font-bold text-lg text-emerald-400">{leadGenRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeKpiTab === 'individual' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden animate-slide-in">
          <div className="bg-zinc-800/50 p-4 border-b border-zinc-800 flex flex-col md:flex-row gap-4 justify-between md:items-center">
            <h4 className="text-sm font-bold text-zinc-200 flex items-center gap-2"><Award size={16} className="text-amber-400"/> Sistem Poin Eksekutor</h4>
            <select 
              value={indRole} 
              onChange={e => setIndRole(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 text-sm text-zinc-200 rounded-lg p-2 focus:outline-none focus:border-amber-500"
            >
              <option value="scriptwriter">Scriptwriter & Talent</option>
              <option value="video">Videographer & Editor</option>
              <option value="graphic">Graphic Designer</option>
            </select>
          </div>
          
          <div className="p-6 space-y-8">
            
            {/* SCRIPTWRITER */}
            {indRole === 'scriptwriter' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Short Script (1 pt)</label>
                    <input type="number" value={swShort} onChange={e=>setSwShort(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" placeholder="Jumlah"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Long Script (3 pt)</label>
                    <input type="number" value={swLong} onChange={e=>setSwLong(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" placeholder="Jumlah"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">SEO Article (2 pt)</label>
                    <input type="number" value={swArticle} onChange={e=>setSwArticle(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" placeholder="Jumlah"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Talent Session (1 pt)</label>
                    <input type="number" value={swTalent} onChange={e=>setSwTalent(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" placeholder="Jumlah"/>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-500">Naskah Selesai Tepat Waktu</label>
                    <input type="number" value={swOnTime} onChange={e=>setSwOnTime(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none" placeholder="Cth: 20"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Total Naskah (Semua)</label>
                    <input type="number" value={swTotalTask} onChange={e=>setSwTotalTask(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none" placeholder="Cth: 22"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Target Poin Bulanan</label>
                    <input type="number" value={swTarget} onChange={e=>setSwTarget(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none"/>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-zinc-500">Poin Terkumpul</p>
                    <p className="text-2xl font-black text-white">{swPoints} <span className="text-sm font-normal text-zinc-400">/ {swTarget}</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Capacity Score</p>
                    <p className={`text-2xl font-black ${swCapScore >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{swCapScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">SLA On-Time (Target &ge;90%)</p>
                    <p className={`text-2xl font-black ${swSlaScore >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>{swSlaScore}%</p>
                  </div>
                </div>
              </div>
            )}

            {/* VIDEO */}
            {indRole === 'video' && (
              <div className="space-y-6">
                <div>
                  <h5 className="text-xs font-bold text-indigo-400 mb-3 border-b border-zinc-800 pb-2">SHOOTING</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500">Short Shoot (1 pt)</label>
                      <input type="number" value={vdShort} onChange={e=>setVdShort(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500">Complex Shoot (2 pt)</label>
                      <input type="number" value={vdComplex} onChange={e=>setVdComplex(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500">Long/Event Shoot (3 pt)</label>
                      <input type="number" value={vdLong} onChange={e=>setVdLong(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-indigo-500 focus:outline-none"/>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-pink-400 mb-3 border-b border-zinc-800 pb-2">EDITING</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500">Short Edit (1 pt)</label>
                      <input type="number" value={edShort} onChange={e=>setEdShort(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500">Complex Edit (2 pt)</label>
                      <input type="number" value={edComplex} onChange={e=>setEdComplex(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500">Long YT (3 pt)</label>
                      <input type="number" value={edLong} onChange={e=>setEdLong(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500">In-Depth YT (5 pt)</label>
                      <input type="number" value={edIndepth} onChange={e=>setEdIndepth(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-pink-500 focus:outline-none"/>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-zinc-800 pt-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-500">Video On-Time</label>
                    <input type="number" value={vdOnTime} onChange={e=>setVdOnTime(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-red-400">Total Klik Revisi</label>
                    <input type="number" value={vdRevisions} onChange={e=>setVdRevisions(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-red-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Total Video Dikerjakan</label>
                    <input type="number" value={vdTotalTask} onChange={e=>setVdTotalTask(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Target Poin Bulanan</label>
                    <input type="number" value={vdTarget} onChange={e=>setVdTarget(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none"/>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500">Total Poin</p>
                    <p className="text-2xl font-black text-white">{vdPoints}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Capacity Score</p>
                    <p className={`text-2xl font-black ${vdCapScore >= 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{vdCapScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">SLA On-Time</p>
                    <p className={`text-2xl font-black ${vdSlaScore >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>{vdSlaScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Revision Rate (&le;2.0)</p>
                    <p className={`text-2xl font-black ${vdRevScore <= 2 ? 'text-emerald-400' : 'text-red-400'}`}>{vdRevScore}x</p>
                  </div>
                </div>
              </div>
            )}

            {/* GRAPHIC */}
            {indRole === 'graphic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Simple (1 pt)</label>
                    <input type="number" value={gdSimple} onChange={e=>setGdSimple(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-teal-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Complex/Carousel (2 pt)</label>
                    <input type="number" value={gdComplex} onChange={e=>setGdComplex(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-teal-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Print Banner (2 pt)</label>
                    <input type="number" value={gdPrint} onChange={e=>setGdPrint(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-teal-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Merch/Apparel (3 pt)</label>
                    <input type="number" value={gdMerch} onChange={e=>setGdMerch(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-teal-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Packaging (4 pt)</label>
                    <input type="number" value={gdPack} onChange={e=>setGdPack(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-teal-500 focus:outline-none"/>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-zinc-800 pt-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-500">Request Tepat Waktu</label>
                    <input type="number" value={gdOnTime} onChange={e=>setGdOnTime(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-emerald-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-red-400">Total Klik Revisi</label>
                    <input type="number" value={gdRevisions} onChange={e=>setGdRevisions(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-red-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Total Request Masuk</label>
                    <input type="number" value={gdTotalTask} onChange={e=>setGdTotalTask(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none"/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500">Target Poin Bulanan</label>
                    <input type="number" value={gdTarget} onChange={e=>setGdTarget(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-zinc-200 focus:border-amber-500 focus:outline-none"/>
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-xl grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500">Total Poin</p>
                    <p className="text-2xl font-black text-white">{gdPoints}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Capacity Score</p>
                    <p className={`text-2xl font-black ${gdCapScore >= 100 ? 'text-emerald-400' : 'text-teal-400'}`}>{gdCapScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">SLA Fulfillment</p>
                    <p className={`text-2xl font-black ${gdSlaScore >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>{gdSlaScore}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Revision Rate (&le;2.0)</p>
                    <p className={`text-2xl font-black ${gdRevScore <= 2 ? 'text-emerald-400' : 'text-red-400'}`}>{gdRevScore}x</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
