import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, CheckCircle, Clock, AlertTriangle, MessageSquare, TrendingUp, Users, Calculator } from 'lucide-react';
import { supabase } from './supabaseClient';
import KpiCalculator from './KpiCalculator';

const BRANDS = [
  { id: 'all', name: 'Semua Akun', color: 'border-zinc-700 bg-zinc-800' },
  { id: 'ig-nusaqu', name: 'IG @nusaqu.id', color: 'border-pink-500/30 bg-pink-950/20 text-pink-400' },
  { id: 'ig-nsf', name: 'IG @nusasentosafarm', color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400' },
  { id: 'ig-bekasi', name: 'IG @nusaqu.bekasi', color: 'border-blue-500/30 bg-blue-950/20 text-blue-400' },
  { id: 'ig-bandung', name: 'IG @nusaqu.bandung', color: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-400' },
  { id: 'ig-klaten', name: 'IG @nusaqu.klaten', color: 'border-violet-500/30 bg-violet-950/20 text-violet-400' },
  { id: 'thr-nusaqu', name: 'Thr @nusaqu.id', color: 'border-zinc-500/30 bg-zinc-950/20 text-zinc-400' },
  { id: 'tt-nusaqu', name: 'TT @nusaqu.id', color: 'border-black/30 bg-zinc-900/80 text-white' },
  { id: 'tt-nsf', name: 'TT @nusasentosafarm', color: 'border-black/30 bg-zinc-900/80 text-white' },
  { id: 'yt-nsf', name: 'YT Nusa Sentosa Farm', color: 'border-red-500/30 bg-red-950/20 text-red-400' },
  { id: 'yt-nusaqu', name: 'YT NusaQu Indonesia', color: 'border-red-500/30 bg-red-950/20 text-red-400' },
  { id: 'ig-nusafeed', name: 'IG @nusafeed', color: 'border-amber-500/30 bg-amber-950/20 text-amber-400' },
  { id: 'ig-nusawaste', name: 'IG @nusawaste.id', color: 'border-teal-500/30 bg-teal-950/20 text-teal-400' },
  { id: 'ig-qurban', name: 'IG @qurbanpraktiscom', color: 'border-orange-500/30 bg-orange-950/20 text-orange-400' },
  { id: 'ig-nusaacademy', name: 'IG @nusaacademy.id', color: 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400' },
  { id: 'ig-bunaaqiqah', name: 'IG @bunaaqiqah', color: 'border-rose-500/30 bg-rose-950/20 text-rose-400' },
  { id: 'ig-nusahub', name: 'IG @nusahub.co', color: 'border-fuchsia-500/30 bg-fuchsia-950/20 text-fuchsia-400' },
  { id: 'ig-nusameat', name: 'IG @nusameat.id', color: 'border-red-500/30 bg-red-950/20 text-red-400' },
  { id: 'ig-nusarich', name: 'IG @nusa_rich', color: 'border-yellow-500/30 bg-yellow-950/20 text-yellow-400' }
];

const CREATORS = [
  { name: 'Fathan', role: 'Creative Content Marketing', avatar: 'FT', initialRevisionRate: 1.0 },
  { name: 'Naufal', role: 'Creative Content Marketing', avatar: 'NF', initialRevisionRate: 1.2 },
  { name: 'Resti', role: 'Creative Content Marketing', avatar: 'RS', initialRevisionRate: 1.1 },
  { name: 'Tyo', role: 'Creative Content Marketing', avatar: 'TY', initialRevisionRate: 1.5 }
];

const INITIAL_CONTENT_CARDS = [];

const INITIAL_PILLARS = [
  { id: 1, brand: 'all', name: 'Edukasi & Tips', description: 'Membagikan insight, life hack, atau pengetahuan terkait industri.', targetPercentage: 40 },
  { id: 2, brand: 'all', name: 'Hiburan & Tren', description: 'Meme, parodi, atau mengikuti tren audio/video viral.', targetPercentage: 30 },
  { id: 3, brand: 'all', name: 'Hard Selling', description: 'Promosi langsung, diskon, pengumuman produk baru dengan CTA beli.', targetPercentage: 20 },
  { id: 4, brand: 'all', name: 'Behind the Scenes', description: 'Memperlihatkan kultur tim untuk kedekatan emosional.', targetPercentage: 10 }
];

const PIPELINE_STAGES = [
  { key: 'Ide', label: 'Ide / Draft', icon: '💡', desc: 'Brainstorming & ideasi awal konten' },
  { key: 'Script/Brief', label: 'Script / Brief', icon: '📝', desc: 'Penyusunan naskah & konsep visual' },
  { key: 'Produksi', label: 'Produksi / Syuting', icon: '🎥', desc: 'Proses take video, VO, atau penyediaan aset mentah' },
  { key: 'Editing', label: 'Editing & QC', icon: '🎬', desc: 'Produksi video, desain grafis & audit' },
  { key: 'Publish', label: 'Publish / Sched', icon: '🚀', desc: 'Konten terbit atau terjadwal rapi' }
];

const REQUEST_STAGES = [
  { key: 'Review & Antrean', label: 'Review & Antrean', icon: '📥', color: 'text-amber-400 bg-amber-500/10' },
  { key: 'Proses Desain', label: 'Proses Desain / Editing', icon: '💻', color: 'text-blue-400 bg-blue-500/10' },
  { key: 'QC & Revisi Divisi', label: 'QC & Revisi Divisi', icon: '🔍', color: 'text-violet-400 bg-violet-500/10' },
  { key: 'Selesai', label: 'Selesai & Kirim', icon: '✅', color: 'text-emerald-400 bg-emerald-500/10' }
];

export default function App() {
  const [session, setSession] = useState(null);
  const [isInitializingAuth, setIsInitializingAuth] = useState(true);
  const [bypassAuth, setBypassAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('beranda');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [jobdeskUser, setJobdeskUser] = useState('Fathan');
  const isPublicMode = new URLSearchParams(window.location.search).get('view') === 'request';
  
  /* State lists */
  const [contentCards, setContentCards] = useState(INITIAL_CONTENT_CARDS);
  const [requests, setRequests] = useState([]);
  const [checkins, setCheckins] = useState([]);
  const [disciplinaryRecords, setDisciplinaryRecords] = useState([]);
  const [pillars, setPillars] = useState(INITIAL_PILLARS);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitializingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session || isPublicMode) fetchRequests();
  }, [session, isPublicMode]);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching requests from Supabase:', error);
    } else if (data) {
      setRequests(data);
    }
  };
  
  /* UI view & active states */
  const [pabrikViewMode, setPabrikViewMode] = useState('pipeline'); 
  const [activeSubTab, setActiveSubTab] = useState('Ide'); 
  const [activeRequestSubTab, setActiveRequestSubTab] = useState('Review & Antrean');

  /* Modals and forms state */
  const [toast, setToast] = useState(null);
  const [qcModalCard, setQcModalCard] = useState(null); 
  const [revisionNote, setRevisionNote] = useState('');
  const [viewDetailCard, setViewDetailCard] = useState(null); 
  const [viewRequestDetail, setViewRequestDetail] = useState(null);
  const [showAddIdeaModal, setShowAddIdeaModal] = useState(false);
  const [writeScriptModal, setWriteScriptModal] = useState(null);
  const [tempScript, setTempScript] = useState('');
  const [newIdeaDraft, setNewIdeaDraft] = useState({
    title: '',
    brand: 'ig-nusaqu',
    collaborator: '',
    assignee: 'Fathan',
    date: '2026-07-20',
    notes: 'Ditambahkan via menu cepat.',
    format: 'Reels / Video'
  });

  const [checkinForm, setCheckinForm] = useState({
    name: 'Fathan',
    time: '08:30',
    plan: ''
  });

  const handleCheckinSubmit = (e) => {
    e.preventDefault();
    if (!checkinForm.plan) {
      triggerToast('Plan hari ini wajib diisi!', 'error');
      return;
    }
    const isLate = checkinForm.time > '08:15';
    setCheckins(prev => [
      {
        id: Date.now(),
        name: checkinForm.name,
        time: checkinForm.time,
        plan: checkinForm.plan,
        date: new Date().toLocaleDateString('id-ID'),
        isLate
      },
      ...prev
    ]);
    
    triggerToast(`Check-in berhasil untuk ${checkinForm.name}!`);
    
    if (isLate) {
      setDisciplinaryRecords(prevRecords => {
        const personRecords = prevRecords.filter(r => r.name === checkinForm.name);
        const hasSP2 = personRecords.some(r => r.type === 'SP2');
        const hasSP1 = personRecords.some(r => r.type === 'SP1');
        const hasCommitment = personRecords.some(r => r.type === 'Komitmen');

        let newType = 'Komitmen';
        let reason = `Sistem (Auto): Absen telat jam ${checkinForm.time} (Toleransi 08:15).`;

        if (hasSP2) {
           newType = 'Pelanggaran Fatal'; 
           reason = `Sistem (Auto): Telat kembali setelah SP2. Harap panggil HRD!`;
        } else if (hasSP1) {
           newType = 'SP2';
           reason = `Sistem (Auto): Mengulangi keterlambatan. Eskalasi otomatis ke SP 2!`;
        } else if (hasCommitment) {
           newType = 'SP1';
           reason = `Sistem (Auto): Melanggar Surat Komitmen. Eskalasi otomatis ke SP 1.`;
        }

        setTimeout(() => triggerToast(`🚨 AUTO-SANKSI: ${checkinForm.name} dijatuhi ${newType} karena absen telat!`, 'error'), 1000);

        return [...prevRecords, {
          id: Date.now() + 1,
          name: checkinForm.name,
          type: newType,
          reason,
          date: new Date().toLocaleDateString('id-ID')
        }];
      });
    }

    setCheckinForm(prev => ({ ...prev, plan: '' }));
  };

  const handleAddIdeaSubmit = (e) => {
    e.preventDefault();
    if (!newIdeaDraft.title) {
      triggerToast('Judul ide tidak boleh kosong!', 'error');
      return;
    }
    
    let autoPlatform = 'Instagram';
    if (newIdeaDraft.brand.startsWith('tt-')) autoPlatform = 'TikTok';
    if (newIdeaDraft.brand.startsWith('yt-')) autoPlatform = 'YouTube';
    if (newIdeaDraft.brand.startsWith('thr-')) autoPlatform = 'Threads';
    if (newIdeaDraft.brand.startsWith('fb-')) autoPlatform = 'Facebook';

    addNewContentCard({
      title: newIdeaDraft.title,
      brand: newIdeaDraft.brand,
      collaborator: newIdeaDraft.collaborator || undefined,
      platform: autoPlatform,
      format: newIdeaDraft.format,
      assignee: newIdeaDraft.assignee,
      date: newIdeaDraft.date,
      notes: newIdeaDraft.notes
    });
    const todayStr = new Date().toLocaleDateString('id-ID');
    const taskText = `\n- [Auto Task] Bikin konten: ${newIdeaDraft.title}`;
    
    setCheckins(prev => {
      const existingIdx = prev.findIndex(c => c.name === newIdeaDraft.assignee && c.date === todayStr);
      if (existingIdx >= 0) {
        const newArr = [...prev];
        newArr[existingIdx] = {
          ...newArr[existingIdx],
          plan: newArr[existingIdx].plan + taskText
        };
        return newArr;
      } else {
        const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        return [{
          id: Date.now() + Math.random(),
          name: newIdeaDraft.assignee,
          time: nowStr,
          plan: taskText.trim(),
          date: todayStr,
          isLate: nowStr > '08:00'
        }, ...prev];
      }
    });

    setShowAddIdeaModal(false);
    setNewIdeaDraft({
      title: '',
      brand: 'ig-nusaqu',
      collaborator: '',
      assignee: 'Fathan',
      date: '2026-07-20',
      notes: 'Ditambahkan via menu cepat.'
    });
  };

  const [requestDraft, setRequestDraft] = useState({
    pemohon: '',
    jenisKebutuhan: 'Desain Grafis',
    namaProject: '',
    briefVisual: '',
    deadlinePemohon: '',
    pic: 'Belum Ditunjuk',
    linkHasilAkhir: '',
    eventDate: '',
    eventLocation: ''
  });
  const [slaWarning, setSlaWarning] = useState(false);

  const [assigningRequestId, setAssigningRequestId] = useState(null);
  const [tempPic, setTempPic] = useState('Fathan');
  const [tempEstimasiMulmed, setTempEstimasiMulmed] = useState('');
  const [deliveryRequestId, setDeliveryRequestId] = useState(null);
  const [tempDeliverableLink, setTempDeliverableLink] = useState('');

  const BENCHMARK_DATE = new Date('2026-07-16');

  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const advancePipelineStage = (cardId, currentStage) => {
    if (currentStage === 'Ide') {
      setContentCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, stage: 'Script/Brief', status: 'Scripting', notes: `${c.notes || ''} | Ide disetujui` } 
          : c
      ));
      setActiveSubTab('Script/Brief');
      triggerToast('Ide disetujui! Berhasil dipindahkan ke tahap Script/Brief.');
    } else if (currentStage === 'Script/Brief') {
      setContentCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, stage: 'Produksi', status: 'Syuting/Take', notes: `${c.notes || ''} | Script disetujui` } 
          : c
      ));
      setActiveSubTab('Produksi');
      triggerToast('Script disetujui! Konten masuk ke tahap Produksi/Syuting.');
    } else if (currentStage === 'Produksi') {
      setContentCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, stage: 'Editing', status: 'Editing', notes: `${c.notes || ''} | Aset mentah siap` } 
          : c
      ));
      setActiveSubTab('Editing');
      triggerToast('Aset selesai! Konten dilempar ke meja Editing.');
    } else if (currentStage === 'Editing') {
      const card = contentCards.find(c => c.id === cardId);
      if (card) {
        setQcModalCard(card);
        setRevisionNote('');
      }
    }
  };

  const handleQcApproval = (approve) => {
    if (!qcModalCard) return;

    if (approve) {
      if (revisionNote.trim() !== '') {
        triggerToast('Gagal! Anda mengetik catatan revisi tetapi malah memencet tombol "Setujui". Hapus catatan jika memang ingin menyetujui.', 'error');
        return;
      }
      setContentCards(prev => prev.map(c => 
        c.id === qcModalCard.id 
          ? { ...c, stage: 'Publish', status: 'Scheduled', notes: `${c.notes} | Disetujui oleh SPV` } 
          : c
      ));
      setActiveSubTab('Publish');
      triggerToast(`Konten disetujui oleh SPV! Siap dijadwalkan.`);
    } else {
      if (!revisionNote.trim()) {
        triggerToast('Wajib mengisi catatan revisi agar tim tahu apa yang perlu diperbaiki!', 'error');
        return;
      }
      setContentCards(prev => prev.map(c => 
        c.id === qcModalCard.id 
          ? { 
              ...c, 
              stage: 'Editing',
              status: 'Editing', 
              revisionCount: c.revisionCount + 1, 
              notes: `${c.notes} | Revisi SPV: ${revisionNote}` 
            } 
          : c
      ));
      triggerToast(`Konten dikembalikan untuk Revisi.`);
    }
    setQcModalCard(null);
    setRevisionNote('');
  };

  const publishNow = (cardId) => {
    setContentCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, status: 'Published' } : c
    ));
    triggerToast('Konten berhasil diterbitkan secara Live!');
  };

  const handleSlaDateChange = (dateVal) => {
    setRequestDraft(prev => ({ ...prev, deadlinePemohon: dateVal }));
    if (!dateVal) {
      setSlaWarning(false);
      return;
    }

    const selectedDate = new Date(dateVal);
    const diffTime = selectedDate.getTime() - BENCHMARK_DATE.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 3) {
      setSlaWarning(true);
    } else {
      setSlaWarning(false);
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    const count = requests.length + 1;
    const requestNo = `REQ-MM-${String(count).padStart(3, '0')}`;

    let finalBrief = requestDraft.briefVisual || 'Tidak ada brief visual khusus.';
    if (requestDraft.jenisKebutuhan === 'Syuting / Liputan Event') {
      finalBrief = `[LIPUTAN EVENT]\n📅 Waktu: ${requestDraft.eventDate ? requestDraft.eventDate.replace('T', ', Jam ') : '-'}\n📍 Lokasi: ${requestDraft.eventLocation || '-'}\n\nDetail Tambahan: ${finalBrief}`;
    }

    const newRequest = {
      no: requestNo,
      tanggalRequest: new Date().toISOString().split('T')[0],
      pemohon: requestDraft.pemohon,
      jenisKebutuhan: requestDraft.jenisKebutuhan,
      namaProject: requestDraft.namaProject,
      briefVisual: finalBrief,
      deadlinePemohon: requestDraft.deadlinePemohon,
      estimasiSelesai: requestDraft.deadlinePemohon,
      estimasiMulmed: '',
      pic: requestDraft.pic,
      status: 'Review & Antrean',
      linkHasilAkhir: ''
    };

    const { error } = await supabase.from('requests').insert([newRequest]);

    if (error) {
      triggerToast('Gagal menyimpan ke database Supabase!', 'error');
      console.error(error);
    } else {
      setRequests([newRequest, ...requests]);
      triggerToast(`Permintaan ${requestNo} sukses diajukan ke Antrean Review!`);
    }
    
    setRequestDraft({
      pemohon: '',
      jenisKebutuhan: 'Desain Grafis',
      namaProject: '',
      briefVisual: '',
      deadlinePemohon: '',
      pic: 'Belum Ditunjuk',
      linkHasilAkhir: '',
      eventDate: '',
      eventLocation: ''
    });
    
    setSlaWarning(false);
    setActiveRequestSubTab('Review & Antrean');
  };

  const assignRequestPic = async (reqNo) => {
    if (!tempEstimasiMulmed) {
      triggerToast('Estimasi penyelesaian dari Multimedia harus diisi!', 'error');
      return;
    }

    const { error } = await supabase
      .from('requests')
      .update({ pic: tempPic, estimasiMulmed: tempEstimasiMulmed, status: 'Proses Desain' })
      .eq('no', reqNo);

    if (error) {
      triggerToast('Gagal update ke database!', 'error');
      console.error(error);
    } else {
      setRequests(prev => prev.map(r => 
        r.no === reqNo 
          ? { ...r, pic: tempPic, estimasiMulmed: tempEstimasiMulmed, status: 'Proses Desain' } 
          : r
      ));
      setAssigningRequestId(null);
      setTempEstimasiMulmed('');
      triggerToast(`Permintaan ${reqNo} disetujui & ditugaskan kepada ${tempPic}.`);
    }
  };

  const advanceRequestToQc = async (reqNo) => {
    const { error } = await supabase
      .from('requests')
      .update({ status: 'QC & Revisi Divisi' })
      .eq('no', reqNo);

    if (error) {
      triggerToast('Gagal update ke database!', 'error');
      console.error(error);
    } else {
      setRequests(prev => prev.map(r => 
        r.no === reqNo 
          ? { ...r, status: 'QC & Revisi Divisi' } 
          : r
      ));
      triggerToast(`Aset ${reqNo} telah diselesaikan oleh desainer & diajukan ke QC Divisi.`);
    }
  };

  const completeRequestWithLink = async (reqNo) => {
    if (!tempDeliverableLink) {
      triggerToast('Mohon lampirkan Link Hasil Akhir sebagai bukti serah terima.', 'error');
      return;
    }

    const { error } = await supabase
      .from('requests')
      .update({ linkHasilAkhir: tempDeliverableLink, status: 'Selesai' })
      .eq('no', reqNo);

    if (error) {
      triggerToast('Gagal update ke database!', 'error');
      console.error(error);
    } else {
      setRequests(prev => prev.map(r => 
        r.no === reqNo 
          ? { ...r, linkHasilAkhir: tempDeliverableLink, status: 'Selesai' } 
          : r
      ));
      setDeliveryRequestId(null);
      setTempDeliverableLink('');
      triggerToast(`Sukses! Permintaan ${reqNo} ditandai selesai dan link hasil akhir dikirim.`);
    }
  };

  const deleteRequest = async (reqNo) => {
    const { error } = await supabase
      .from('requests')
      .delete()
      .eq('no', reqNo);

    if (error) {
      triggerToast('Gagal menghapus dari database!', 'error');
      console.error(error);
    } else {
      setRequests(prev => prev.filter(r => r.no !== reqNo));
      triggerToast(`Permintaan ${reqNo} berhasil dihapus.`);
    }
  };

  /* Quick add content card idea */
  const addNewContentCard = (cardData) => {
    setContentCards(prev => [...prev, {
      id: `c-${Date.now()}`,
      ...cardData,
      revisionCount: 0,
      stage: 'Ide',
      status: 'Ide'
    }]);
    triggerToast('Ide baru berhasil ditambahkan ke sub-tab Ide!');
    setActiveSubTab('Ide');
  };

  const creatorAverages = CREATORS.map(creator => {
    const assignedCards = contentCards.filter(c => c.assignee === creator.name);
    if (assignedCards.length === 0) {
      return { ...creator, calculatedRate: creator.initialRevisionRate };
    }
    const totalRevisions = assignedCards.reduce((acc, c) => acc + c.revisionCount, 0);
    const rate = Number((totalRevisions / assignedCards.length).toFixed(1));
    return { ...creator, calculatedRate: rate };
  });

  const totalRequests = requests.length;
  const completedRequestsOnTime = requests.filter(r => {
    if (r.status !== 'Selesai') return false;
    const estDate = new Date(r.estimasiSelesai);
    const reqDate = new Date(r.tanggalRequest);
    return estDate >= reqDate; // Safe simple proxy
  }).length;
  const slaPercentage = totalRequests > 0 ? Math.round((completedRequestsOnTime / totalRequests) * 100) : 92;

  const publishedCount = contentCards.filter(c => c.status === 'Published').length;
  const scheduledCount = contentCards.filter(c => c.status === 'Scheduled').length;
  const totalRelevantContent = contentCards.length;
  const consistencyScore = totalRelevantContent > 0 ? Math.round(((publishedCount + scheduledCount) / totalRelevantContent) * 100) : 0;

  const filteredContentCards = selectedBrand === 'all' 
    ? contentCards 
    : contentCards.filter(c => c.brand === selectedBrand);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error logging in:', error.message);
      triggerToast('Gagal login dengan Google', 'error');
    }
  };

  if (isInitializingAuth) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white font-sans"><div className="animate-pulse font-bold tracking-widest text-zinc-500 uppercase">Loading Session...</div></div>;
  }

  if (isPublicMode) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-violet-600">
        <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl relative">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-900/30">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Form Request Divisi</h2>
              <p className="text-xs text-zinc-400">Pengajuan aset kreatif MM Hub lintas divisi</p>
            </div>
          </div>
          
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Nama & Divisi Pemohon <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                placeholder="Contoh: Rudi (Marketing Div)"
                value={requestDraft.pemohon}
                onChange={(e) => setRequestDraft(prev => ({ ...prev, pemohon: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-zinc-100 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Jenis Kebutuhan</label>
                <select
                  value={requestDraft.jenisKebutuhan}
                  onChange={(e) => setRequestDraft(prev => ({ ...prev, jenisKebutuhan: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-zinc-100 transition"
                >
                  <option value="Desain Grafis">Desain Grafis</option>
                  <option value="Video Pendek">Video Pendek</option>
                  <option value="Syuting / Liputan Event">Syuting / Liputan Event</option>
                  <option value="Print Banner">Print Banner</option>
                  <option value="Materi Sosmed">Materi Sosmed</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase">Deadline Diminta <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  required
                  value={requestDraft.deadlinePemohon}
                  onChange={(e) => handleSlaDateChange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-zinc-100 transition"
                />
              </div>
            </div>

            {requestDraft.jenisKebutuhan === 'Syuting / Liputan Event' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800 animate-slide-in">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Waktu Acara <span className="text-red-400">*</span></label>
                  <input
                    type="datetime-local"
                    required={requestDraft.jenisKebutuhan === 'Syuting / Liputan Event'}
                    value={requestDraft.eventDate}
                    onChange={(e) => setRequestDraft(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-zinc-100 transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Lokasi <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="Cth: Gedung A"
                    required={requestDraft.jenisKebutuhan === 'Syuting / Liputan Event'}
                    value={requestDraft.eventLocation}
                    onChange={(e) => setRequestDraft(prev => ({ ...prev, eventLocation: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-zinc-100 transition"
                  />
                </div>
              </div>
            )}

            {slaWarning && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-300 leading-relaxed animate-pulse">
                ⚠️ <strong>Tenggat SLA Kurang dari 3 Hari!</strong> Request diprioritaskan tinggi dan membutuhkan approval manual Supervisor.
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Nama Project / Judul <span className="text-red-400">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. Desain Baliho Promo Nusafarm"
                value={requestDraft.namaProject}
                onChange={(e) => setRequestDraft(prev => ({ ...prev, namaProject: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-zinc-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase">Brief Visual</label>
              <textarea
                rows="4"
                placeholder="Tuliskan ukuran, referensi warna, pesan utama, dll..."
                value={requestDraft.briefVisual}
                onChange={(e) => setRequestDraft(prev => ({ ...prev, briefVisual: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-zinc-100 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-lg shadow-violet-900/20 mt-4"
            >
              Kirim Request Divisi
            </button>
          </form>
        </div>

        {toast && (
          <div className={`fixed top-4 right-4 p-4 rounded-xl border z-50 ${toast.type === 'error' ? 'bg-red-500/90 border-red-500 text-white' : 'bg-emerald-500/90 border-emerald-500 text-white'} animate-slide-in text-sm font-bold shadow-2xl backdrop-blur-md`}>
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  if (!session && !bypassAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white p-4 font-sans selection:bg-violet-600">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-900/30">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold mb-2 tracking-tight">MM HUB</h1>
          <p className="text-sm text-zinc-400 mb-8">Login untuk mengakses Control Panel SPV</p>
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-zinc-900 hover:bg-zinc-200 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 mb-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Masuk dengan Google
          </button>
          <button 
            onClick={() => setBypassAuth(true)}
            className="w-full bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700 font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
          >
            Bypass Login (Mode Dev)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans flex flex-col md:flex-row antialiased overflow-x-hidden selection:bg-violet-600 selection:text-white">
      
      {/* Toast Overlay */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-2xl max-w-sm">
          <div className={`w-3 h-3 rounded-full ${toast.type === 'error' ? 'bg-red-500 shadow-red-500/50' : toast.type === 'warning' ? 'bg-amber-500 shadow-amber-500/50' : 'bg-emerald-500 shadow-emerald-500/50'} shadow-lg`} />
          <span className="text-sm font-medium text-zinc-200">{toast.message}</span>
        </div>
      )}

      {/* QC SPV Overlay Modal for Social Media */}
      {qcModalCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-zinc-800/80 flex justify-between items-start">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-violet-400">Quality Control Audit</span>
                <h3 className="text-xl font-bold mt-1 text-zinc-100">Review: {qcModalCard.title}</h3>
              </div>
              <button onClick={() => setQcModalCard(null)} className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 transition">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-xs">Penanggung Jawab</span>
                  <span className="font-semibold text-zinc-200 mt-0.5 block">{qcModalCard.assignee}</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-800">
                  <span className="text-zinc-500 block text-xs">Revisi Terkumpul</span>
                  <span className="font-bold text-amber-400 mt-0.5 block">{qcModalCard.revisionCount}</span>
                </div>
              </div>
              <p className="text-sm text-zinc-300 bg-zinc-950/60 p-4 rounded-lg border border-zinc-800 italic">
                "{qcModalCard.notes || 'Belum ada instruksi tambahan.'}"
              </p>
            </div>

            <div className="p-6 border-t border-zinc-800/80 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Catatan Revisi SPV (Wajib jika minta revisi)</label>
                <textarea
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Ketik bagian mana yang perlu diperbaiki oleh editor..."
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-red-500/50 resize-none"
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleQcApproval(false)}
                  className="flex-1 bg-zinc-900 hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/50 border border-zinc-800 text-zinc-300 font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                >
                  ✕ Minta Revisi (+1)
                </button>
                <button
                  onClick={() => handleQcApproval(true)}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  ✓ Setujui & Jadwalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SM Content Detail Viewer Modal */}
      {viewDetailCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-md border ${BRANDS.find(b => b.id === viewDetailCard.brand)?.color || 'border-zinc-700'}`}>
                {BRANDS.find(b => b.id === viewDetailCard.brand)?.name}
              </span>
              <button onClick={() => setViewDetailCard(null)} className="text-zinc-400 hover:text-zinc-200 text-lg">✕</button>
            </div>
            <h3 className="text-lg font-bold text-zinc-100 mb-3">{viewDetailCard.title}</h3>
            
            <div className="space-y-2 text-sm text-zinc-300">
              <p><strong className="text-zinc-500">Platform:</strong> {viewDetailCard.platform}</p>
              <p><strong className="text-zinc-500">Kreator:</strong> {viewDetailCard.assignee}</p>
              <p><strong className="text-zinc-500">Target Tanggal:</strong> {viewDetailCard.date}</p>
              <p><strong className="text-zinc-500">Status Internal:</strong> {viewDetailCard.status}</p>
              <p><strong className="text-zinc-500">Total Revisi:</strong> {viewDetailCard.revisionCount}</p>
              <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 mt-2">
                <span className="text-[10px] text-zinc-500 uppercase block font-bold mb-1">Catatan Deskripsi</span>
                <p className="text-xs italic">"{viewDetailCard.notes || 'Tidak ada deskripsi tambahan.'}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {viewRequestDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-1 rounded border border-zinc-700">
                  {viewRequestDetail.no}
                </span>
                <h3 className="text-lg font-bold text-zinc-100 mt-2">{viewRequestDetail.namaProject}</h3>
              </div>
              <button onClick={() => setViewRequestDetail(null)} className="text-zinc-400 hover:text-zinc-200 text-lg">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border-y border-zinc-800/80 py-3">
              <div>
                <span className="text-zinc-500 block">Tanggal Request</span>
                <span className="text-zinc-200 font-medium">{viewRequestDetail.tanggalRequest}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Nama & Divisi Pemohon</span>
                <span className="text-zinc-200 font-medium">{viewRequestDetail.pemohon}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Jenis Kebutuhan</span>
                <span className="text-zinc-200 font-medium">{viewRequestDetail.jenisKebutuhan}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Deadline Pemohon</span>
                <span className="text-amber-400 font-bold">{viewRequestDetail.deadlinePemohon || viewRequestDetail.estimasiSelesai}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Estimasi Mulmed</span>
                <span className="text-emerald-400 font-bold">{viewRequestDetail.estimasiMulmed || 'Belum Diestimasi'}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">PIC Desainer / Editor</span>
                <span className="text-zinc-200 font-medium">{viewRequestDetail.pic}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Status Tahapan</span>
                <span className="text-amber-400 font-semibold">{viewRequestDetail.status}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-zinc-500 font-bold block">Brief Visual</span>
              <p className="text-xs text-zinc-300 bg-zinc-950 p-3 rounded-lg border border-zinc-800/80 leading-relaxed">
                {viewRequestDetail.briefVisual}
              </p>
            </div>

            {viewRequestDetail.linkHasilAkhir && (
              <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Serah Terima Selesai</span>
                  <span className="text-xs text-zinc-400 block mt-0.5 truncate max-w-xs">{viewRequestDetail.linkHasilAkhir}</span>
                </div>
                <a 
                  href={viewRequestDetail.linkHasilAkhir} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg transition font-bold whitespace-nowrap"
                >
                  Buka Link Aset
                </a>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setViewRequestDetail(null)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-4 py-2 rounded-lg transition"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Export Helper */}
      {(() => {
        // Expose a global function so it can be called from the UI below without being a re-created closure every render, or just a simple function here.
        // Actually better to define it as a standard function so we can just bind it.
      })()}

      <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col shrink-0">
        
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-900/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-md font-extrabold tracking-tight text-white uppercase">MM HUB</h1>
              <p className="text-[10px] text-violet-400 font-bold tracking-widest uppercase">SPV Control Panel</p>
            </div>
          </div>
          
          <div className="mt-6 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow overflow-hidden">
                {session?.user?.user_metadata?.avatar_url ? (
                  <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  'U'
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-zinc-100 block truncate">
                  {session?.user?.user_metadata?.full_name || session?.user?.email || 'User Terdaftar'}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online
                </span>
              </div>
            </div>
            <button 
              onClick={() => supabase.auth.signOut()}
              title="Logout"
              className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-900 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>

        <nav className="p-4 flex-1 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab('pillars')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'pillars'
                ? 'bg-gradient-to-r from-cyan-950/60 to-zinc-900 text-cyan-300 border-l-4 border-cyan-500'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Pilar & Strategi Konten
          </button>

          <button
            onClick={() => setActiveTab('beranda')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'beranda'
                ? 'bg-gradient-to-r from-blue-950/60 to-zinc-900 text-blue-300 border-l-4 border-blue-500'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Action (Beranda)
          </button>
          
          <div>
            <button
              onClick={() => { setActiveTab('pabrik-konten'); setPabrikViewMode('pipeline'); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === 'pabrik-konten'
                  ? 'bg-zinc-800/80 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                Workspace Dashboard
              </div>
            </button>
            
            {activeTab === 'pabrik-konten' && pabrikViewMode === 'pipeline' && (
              <div className="mt-2 ml-4 pl-4 border-l border-zinc-800 space-y-1">
                {PIPELINE_STAGES.map(stage => {
                  const isActive = activeSubTab === stage.key;
                  return (
                    <button
                      key={stage.key}
                      onClick={() => setActiveSubTab(stage.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                        isActive 
                          ? 'bg-violet-950/40 text-violet-300 border-l-2 border-violet-500' 
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border-l-2 border-transparent'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{stage.icon}</span>
                        {stage.label}
                      </span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50"></span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('jobdesk-pribadi')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'jobdesk-pribadi'
                ? 'bg-gradient-to-r from-pink-950/60 to-zinc-900 text-pink-300 border-l-4 border-pink-500'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Jobdesk Pribadi
          </button>

          <button
            onClick={() => setActiveTab('request-divisi')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'request-divisi'
                ? 'bg-gradient-to-r from-amber-950/60 to-zinc-900 text-amber-300 border-l-4 border-amber-500'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Request Divisi
          </button>

          <button
            onClick={() => setActiveTab('control-center')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'control-center'
                ? 'bg-gradient-to-r from-violet-950/60 to-zinc-900 text-violet-300 border-l-4 border-violet-500'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
            Control Center SPV
          </button>

          <button
            onClick={() => setActiveTab('daily-checkin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'daily-checkin'
                ? 'bg-gradient-to-r from-emerald-950/60 to-zinc-900 text-emerald-300 border-l-4 border-emerald-500'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Daily Check-in
          </button>

          <button
            onClick={() => setActiveTab('disciplinary')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'disciplinary'
                ? 'bg-gradient-to-r from-rose-950/60 to-zinc-900 text-rose-300 border-l-4 border-rose-500'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Review & Komitmen
          </button>

          <button
            onClick={() => setActiveTab('kpi-kalkulator')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'kpi-kalkulator'
                ? 'bg-gradient-to-r from-teal-950/60 to-zinc-900 text-teal-300 border-l-4 border-teal-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <Calculator className="w-5 h-5 shrink-0" />
            Kalkulator KPI
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/30 text-xs text-zinc-500 space-y-2">
          <div className="flex justify-between">
            <span>SLA On-Time:</span>
            <span className="text-emerald-400 font-bold">{slaPercentage}%</span>
          </div>
          <div className="flex justify-between">
            <span>Post Consistency:</span>
            <span className="text-indigo-400 font-bold">{consistencyScore}%</span>
          </div>
        </div>
      </aside>

      {}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        
        {/* Dynamic header navigation */}
        <header className="border-b border-zinc-900 bg-zinc-900/40 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {activeTab === 'beranda' ? 'Quick Action Dashboard' : activeTab === 'jobdesk-pribadi' ? 'Jobdesk Harian Eksekutor' : activeTab === 'pabrik-konten' ? 'Pabrik Konten (Organic Social Media)' : activeTab === 'request-divisi' ? 'Papan Request Divisi' : activeTab === 'daily-checkin' ? 'Morning Briefing & Absensi' : activeTab === 'disciplinary' ? 'Review & Surat Komitmen' : activeTab === 'kpi-kalkulator' ? 'Kalkulator KPI (Group & Individu)' : 'KPI Control Center SPV'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {activeTab === 'beranda'
                ? 'Ringkasan peringatan penting yang butuh perhatian Anda segera.'
                : activeTab === 'pabrik-konten' 
                ? 'Kelola publikasi media sosial organic dengan workflow berjenjang.' 
                : activeTab === 'request-divisi'
                  ? 'Awasi request terintegrasi dari divisi eksternal.'
                  : activeTab === 'daily-checkin'
                    ? 'Log check-in harian tim dan tracker kedisiplinan kerja.'
                    : activeTab === 'disciplinary'
                      ? 'Dashboard review kinerja, surat komitmen, dan peringatan (SP).'
                      : activeTab === 'kpi-kalkulator'
                        ? 'Hitung otomatis skor KPI dan performa berdasarkan rumus yang telah ditentukan.'
                        : 'Analisis produktivitas tim, rata-rata revisi crew magang, dan ketepatan waktu rilis bulanan.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500">Filter Akun:</span>
            <select 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-violet-500 cursor-pointer max-w-[200px]"
            >
              {BRANDS.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Workspace body */}
        <section className="p-6 flex-1 space-y-12 overflow-y-auto">

          {/* ======================================================================= */}
          {/* TAB 0: QUICK ACTION (BERANDA)                                           */}
          {/* ======================================================================= */}
          {activeTab === 'beranda' && (
            <div className="space-y-6">
              {(() => {
                const editingCount = contentCards.filter(c => c.stage === 'Editing').length;
                const todayStr = new Date().toLocaleDateString('id-ID');
                const absentCount = CREATORS.filter(c => !checkins.some(ci => ci.name === c.name && ci.date === todayStr)).length;
                
                // Get urgent requests (deadline within 3 days and not done)
                const urgentRequests = requests.filter(r => {
                  if (r.status === 'Selesai') return false;
                  const diffDays = Math.ceil((new Date(r.estimasiSelesai) - new Date()) / (1000 * 60 * 60 * 24));
                  return diffDays <= 3;
                }).length;

                const isAllClear = editingCount === 0 && absentCount === 0 && urgentRequests === 0;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isAllClear && (
                      <div className="md:col-span-3 bg-gradient-to-r from-emerald-900/40 to-teal-900/20 p-8 rounded-2xl border border-emerald-500/30 text-center flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 border border-emerald-500/50">
                          <span className="text-3xl">🎉</span>
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-400 mb-2">Semua Aman Terkendali, Bos!</h3>
                        <p className="text-sm text-emerald-500/80">Tidak ada aksi mendesak yang butuh atensi saat ini.</p>
                      </div>
                    )}

                    {!isAllClear && (
                      <>
                        <div className={`p-6 rounded-2xl border ${editingCount > 0 ? 'bg-amber-950/20 border-amber-500/30' : 'bg-zinc-900/40 border-zinc-800'}`}>
                          <div className="text-3xl mb-3">{editingCount > 0 ? '👀' : '✅'}</div>
                          <h3 className={`text-lg font-bold ${editingCount > 0 ? 'text-amber-400' : 'text-zinc-500'}`}>Review QC Konten</h3>
                          <p className="text-xs text-zinc-400 mt-1 mb-4">
                            {editingCount > 0 ? `Ada ${editingCount} konten di tahap Editing menunggu review QC Anda.` : 'Tidak ada draf yang butuh review QC.'}
                          </p>
                          {editingCount > 0 && (
                            <button onClick={() => { setActiveTab('pabrik-konten'); setActiveSubTab('Editing'); }} className="text-xs font-bold text-amber-500 hover:text-amber-400 underline">
                              Review Sekarang ➔
                            </button>
                          )}
                        </div>

                        <div className={`p-6 rounded-2xl border ${absentCount > 0 ? 'bg-red-950/20 border-red-500/30' : 'bg-zinc-900/40 border-zinc-800'}`}>
                          <div className="text-3xl mb-3">{absentCount > 0 ? '🚨' : '✅'}</div>
                          <h3 className={`text-lg font-bold ${absentCount > 0 ? 'text-red-400' : 'text-zinc-500'}`}>Kehadiran Tim</h3>
                          <p className="text-xs text-zinc-400 mt-1 mb-4">
                            {absentCount > 0 ? `Terdapat ${absentCount} orang yang belum melakukan Check-in absen pagi hari ini.` : 'Seluruh anggota tim sudah absen hari ini.'}
                          </p>
                          {absentCount > 0 && (
                            <button onClick={() => setActiveTab('daily-checkin')} className="text-xs font-bold text-red-500 hover:text-red-400 underline">
                              Lihat Tracker ➔
                            </button>
                          )}
                        </div>

                        <div className={`p-6 rounded-2xl border ${urgentRequests > 0 ? 'bg-blue-950/20 border-blue-500/30' : 'bg-zinc-900/40 border-zinc-800'}`}>
                          <div className="text-3xl mb-3">{urgentRequests > 0 ? '🔥' : '✅'}</div>
                          <h3 className={`text-lg font-bold ${urgentRequests > 0 ? 'text-blue-400' : 'text-zinc-500'}`}>SLA Request Divisi</h3>
                          <p className="text-xs text-zinc-400 mt-1 mb-4">
                            {urgentRequests > 0 ? `Terdapat ${urgentRequests} tiket request divisi yang hampir jatuh tempo (< 3 hari).` : 'Tidak ada tiket request mendesak.'}
                          </p>
                          {urgentRequests > 0 && (
                            <button onClick={() => setActiveTab('request-divisi')} className="text-xs font-bold text-blue-500 hover:text-blue-400 underline">
                              Pantau Papan Request ➔
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === 'pabrik-konten' && (
            <>
              {/* ======================================================================= */}
              {/* TIER 1: PABRIK KONTEN (SOCIAL MEDIA WORKFLOWS)                          */}
              {/* ======================================================================= */}
              <div className="space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-zinc-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="p-1.5 rounded bg-violet-600/10 text-violet-400 text-sm">🎬</span>
                      Pabrik Konten (Organic Social Media)
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Alur berjenjang internal multimedia untuk merencanakan dan menerbitkan konten organic.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-lg bg-zinc-950 p-1 border border-zinc-800">
                      <button
                        onClick={() => setPabrikViewMode('pipeline')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                          pabrikViewMode === 'pipeline' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Workflow Pipeline
                      </button>
                      <button
                        onClick={() => setPabrikViewMode('calendar')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                          pabrikViewMode === 'calendar' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Calendar View
                      </button>
                    </div>

                    {activeSubTab === 'Ide' && (
                      <button
                        onClick={() => setShowAddIdeaModal(true)}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambahkan Ide
                      </button>
                    )}
                  </div>
                </div>

                {/* Brand Content Counters */}
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 w-full">
                  <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                    Content Radar (18 Akun Aktif)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2">
                    {BRANDS.filter(b => b.id !== 'all').map(brand => {
                      const count = contentCards.filter(c => c.brand === brand.id || c.collaborator === brand.id).length;
                      const isZero = count === 0;
                      return (
                        <div key={brand.id} className={`flex flex-col p-2.5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${isZero ? 'bg-red-950/20 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)] hover:border-red-500/50' : 'bg-zinc-950/60 border-zinc-800 hover:border-violet-500/50 hover:bg-zinc-900'}`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`shrink-0 w-1.5 h-1.5 rounded-full ${isZero ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]'}`} />
                            <span className={`text-sm font-black leading-none ${isZero ? 'text-red-400' : 'text-zinc-100'}`}>{count}</span>
                          </div>
                          <span className={`text-[9px] font-semibold leading-tight line-clamp-2 ${isZero ? 'text-red-300' : 'text-zinc-400'}`} title={brand.name}>
                            {brand.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {pabrikViewMode === 'pipeline' ? (
                  <div className="space-y-4">
                    {/* PIPELINE NAVIGATION TABS */}
                    <div className="flex bg-zinc-900/40 p-1.5 rounded-xl border border-zinc-800/60 overflow-x-auto no-scrollbar">
                      {PIPELINE_STAGES.map(stage => (
                        <button
                          key={stage.key}
                          onClick={() => setActiveSubTab(stage.key)}
                          className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg min-w-[120px] transition-all duration-300 relative ${
                            activeSubTab === stage.key
                              ? 'bg-zinc-800 shadow-md text-white transform scale-[1.02] border border-zinc-700/50'
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40'
                          }`}
                        >
                          <span className="text-xl mb-1 filter drop-shadow-md">{stage.icon}</span>
                          <span className="text-[11px] font-bold tracking-wide">{stage.label}</span>
                          {activeSubTab === stage.key && (
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1/3 h-0.5 rounded-full bg-violet-500 animate-pulse"></div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Active SM pipeline cards list */}
                    <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 min-h-[220px]">
                      {filteredContentCards.filter(c => c.stage === activeSubTab).length === 0 ? (
                        <div className="py-12 text-center text-zinc-500 text-xs">
                          Belum ada draf konten pada tahap {activeSubTab}.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredContentCards.filter(c => c.stage === activeSubTab).map(card => {
                            const brandObj = BRANDS.find(b => b.id === card.brand);
                            return (
                              <div
                                key={card.id}
                                onClick={() => setViewDetailCard(card)}
                                className="group bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 rounded-xl p-4 transition-all duration-200 relative flex flex-col justify-between space-y-4 cursor-pointer"
                              >
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border truncate max-w-[120px] ${brandObj?.color || 'border-zinc-700'}`}>
                                      {brandObj?.name || card.brand}
                                    </span>
                                    <div className="flex gap-1">
                                      <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/30">
                                        {card.format || 'Reels / Video'}
                                      </span>
                                      <span className="text-[10px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 font-medium">{card.platform}</span>
                                    </div>
                                  </div>
                                  <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white leading-snug">{card.title}</h4>
                                  {card.collaborator && (
                                    <div className="mt-1.5 flex items-center gap-1 text-[9px] font-bold text-violet-400 bg-violet-950/20 px-1.5 py-0.5 rounded w-fit border border-violet-900/30">
                                      🤝 Collab: {BRANDS.find(b => b.id === card.collaborator)?.name || card.collaborator}
                                    </div>
                                  )}
                                  <p className="text-xs text-zinc-500 line-clamp-2 mt-1">{card.notes}</p>
                                </div>

                                <div className="pt-3 border-t border-zinc-800/60 flex justify-between items-center text-[11px]" onClick={e => e.stopPropagation()}>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-extrabold flex items-center justify-center text-[9px]">
                                      {card.assignee.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-zinc-400">{card.assignee.split(' ')[0]}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded text-[9px] font-bold">REV: {card.revisionCount}</span>
                                    <span className="text-zinc-500">{card.date}</span>
                                  </div>
                                </div>

                                <div className="pt-2" onClick={e => e.stopPropagation()}>
                                  {activeSubTab === 'Ide' && (
                                    <button
                                      onClick={() => advancePipelineStage(card.id, 'Ide')}
                                      className="w-full bg-zinc-950 hover:bg-violet-950/40 hover:text-violet-400 text-zinc-300 border border-zinc-800 rounded-lg py-2 text-xs font-bold transition"
                                    >
                                      Setujui Ide & Lanjut Scripting ➔
                                    </button>
                                  )}
                                  {activeSubTab === 'Script/Brief' && (
                                    <div className="space-y-2">
                                      <button
                                        onClick={() => {
                                          setWriteScriptModal(card);
                                          setTempScript(card.scriptContent || '');
                                        }}
                                        className="w-full bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5"
                                      >
                                        <span className="text-[10px]">📝</span> Tulis Naskah
                                      </button>
                                      <button
                                        onClick={() => advancePipelineStage(card.id, 'Script/Brief')}
                                        className="w-full bg-violet-600/10 hover:bg-violet-600/30 text-violet-400 border border-violet-500/30 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center"
                                      >
                                        Setujui Script ➔
                                      </button>
                                    </div>
                                  )}
                                  {activeSubTab === 'Produksi' && (
                                    <button
                                      onClick={() => advancePipelineStage(card.id, 'Produksi')}
                                      className="w-full bg-violet-600/10 hover:bg-violet-600/30 text-violet-400 border border-violet-500/30 rounded-lg py-2 text-xs font-bold transition flex items-center justify-center"
                                    >
                                      Syuting/Aset Selesai ➔
                                    </button>
                                  )}
                                  {activeSubTab === 'Editing' && (
                                    <button
                                      onClick={() => advancePipelineStage(card.id, 'Editing')}
                                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg py-2 text-xs font-extrabold transition shadow"
                                    >
                                      Review QC SPV 👑
                                    </button>
                                  )}
                                  {activeSubTab === 'Publish' && (
                                    <div className="flex items-center justify-between gap-2 text-xs">
                                      <span className={`px-2 py-0.5 rounded ${card.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {card.status}
                                      </span>
                                      {card.status !== 'Published' && (
                                        <button onClick={() => publishNow(card.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded font-bold">Publish Now</button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Calendar view */
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                    <div className="grid grid-cols-7 gap-1 bg-zinc-800 border border-zinc-800 rounded-xl overflow-hidden">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="bg-zinc-900 p-2 text-center text-xs font-bold text-zinc-400 border-b border-zinc-800">{day}</div>
                      ))}
                      {(() => {
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = now.getMonth();
                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                        const firstDayOfWeek = new Date(year, month, 1).getDay();
                        
                        const blanks = Array.from({ length: firstDayOfWeek }).map((_, i) => (
                          <div key={`empty-${i}`} className="bg-zinc-950/20 p-2 min-h-[80px] border-r border-b border-zinc-800/40" />
                        ));
                        
                        const days = Array.from({ length: daysInMonth }, (_, index) => {
                          const dayNumber = index + 1;
                          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                          const dayCards = filteredContentCards.filter(c => c.date === dateStr);
                          
                          const todayLocalStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                          const isToday = dateStr === todayLocalStr;
                          
                          return (
                            <div 
                              key={dayNumber} 
                              onClick={() => {
                                setNewIdeaDraft(prev => ({ ...prev, date: dateStr }));
                                setShowAddIdeaModal(true);
                              }}
                              className={`p-2 min-h-[90px] bg-zinc-950/60 border-r border-b border-zinc-800 flex flex-col justify-between cursor-pointer hover:bg-zinc-800/40 transition relative ${isToday ? 'ring-1 ring-inset ring-indigo-500/50 bg-indigo-950/20' : ''}`}
                            >
                              {isToday && <div className="absolute top-0 right-0 w-full h-0.5 bg-indigo-500"></div>}
                              <div className="flex justify-between items-start">
                                <span className={`text-[10px] font-black ${isToday ? 'bg-indigo-500 text-white px-1.5 py-0.5 rounded-full' : 'text-zinc-500'}`}>
                                  {dayNumber}
                                </span>
                                {isToday && <span className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest mt-0.5">Today</span>}
                              </div>
                              <div className="space-y-1 mt-1">
                                {dayCards.map(card => (
                                  <div 
                                    key={card.id} 
                                    onClick={(e) => { e.stopPropagation(); setViewDetailCard(card); }} 
                                    className="flex flex-col text-[8px] p-1.5 rounded border bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-violet-500 transition"
                                  >
                                    <span className="font-bold text-cyan-400 mb-0.5 border-b border-zinc-800 pb-0.5">{card.format || 'Reels / Video'}</span>
                                    <span className="truncate mt-0.5">{card.title}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        });
                        
                        return [...blanks, ...days];
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'jobdesk-pribadi' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="p-1.5 rounded bg-pink-600/10 text-pink-400 text-sm">👤</span>
                    Jobdesk Harian Eksekutor
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Daftar tugas harian khusus untuk masing-masing PIC.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-400 font-semibold">Pilih Eksekutor:</span>
                  <select 
                    value={jobdeskUser}
                    onChange={(e) => setJobdeskUser(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-zinc-100 font-bold rounded-lg py-2 px-4 focus:outline-none focus:border-pink-500"
                  >
                    {CREATORS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Kolom Pending / Proses */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 flex flex-col min-h-[500px]">
                  <h4 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Sedang Dikerjakan (Proses)
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {requests.filter(r => r.pic === jobdeskUser && r.status === 'Proses Desain').map(req => (
                      <div key={req.no} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">{req.no}</span>
                        </div>
                        <h5 className="text-sm font-bold text-zinc-200">{req.namaProject}</h5>
                        <p className="text-xs text-zinc-500 mt-1">Pemohon: {req.pemohon}</p>
                        
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-500">Deadline Pemohon:</span>
                            <span className="text-amber-400 font-bold">{req.deadlinePemohon || req.estimasiSelesai}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-500">Estimasi Mulmed:</span>
                            <span className="text-emerald-400 font-bold">{req.estimasiMulmed || req.estimasiSelesai || 'Belum'}</span>
                          </div>
                          {req.deadlinePemohon && req.estimasiMulmed && req.estimasiMulmed > req.deadlinePemohon && (
                            <div className="mt-2 bg-red-950/40 border border-red-900/50 p-1.5 rounded text-[10px] text-red-400 flex items-center gap-1">
                              <span>⚠️</span> Deadline bentrok! Butuh diskusi dengan {req.pemohon}.
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-zinc-800">
                          <button
                            onClick={() => advanceRequestToQc(req.no)}
                            className="w-full bg-zinc-900 hover:bg-blue-950/40 hover:text-blue-400 text-zinc-300 border border-zinc-800 rounded-lg py-1.5 text-[10px] font-bold transition"
                          >
                            Selesai Edit & Ajukan QC ➔
                          </button>
                        </div>
                      </div>
                    ))}
                    {requests.filter(r => r.pic === jobdeskUser && r.status === 'Proses Desain').length === 0 && (
                      <p className="text-xs text-zinc-500 text-center py-8">Tidak ada task yang sedang dikerjakan.</p>
                    )}
                  </div>
                </div>

                {/* Kolom Menunggu QC */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 flex flex-col min-h-[500px]">
                  <h4 className="text-sm font-bold text-violet-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                    Menunggu QC / Revisi
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {requests.filter(r => r.pic === jobdeskUser && r.status === 'QC & Revisi Divisi').map(req => (
                       <div key={req.no} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">{req.no}</span>
                        </div>
                        <h5 className="text-sm font-bold text-zinc-200">{req.namaProject}</h5>
                        <p className="text-xs text-zinc-500 mt-1">Pemohon: {req.pemohon}</p>

                        <div className="mt-4 pt-3 border-t border-zinc-800">
                          {deliveryRequestId === req.no ? (
                            <div className="space-y-2 bg-zinc-900 p-2 rounded border border-zinc-700">
                              <label className="text-[9px] font-bold text-zinc-400 block uppercase">Link Hasil Akhir:</label>
                              <input 
                                type="url"
                                required
                                placeholder="https://drive.google.com/..."
                                value={tempDeliverableLink}
                                onChange={(e) => setTempDeliverableLink(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded p-1 text-[11px] text-zinc-100"
                              />
                              <div className="flex gap-1.5">
                                <button 
                                  onClick={() => completeRequestWithLink(req.no)}
                                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-1 rounded"
                                >
                                  Kirim Aset
                                </button>
                                <button 
                                  onClick={() => setDeliveryRequestId(null)}
                                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] px-2 py-1 rounded"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setDeliveryRequestId(req.no);
                                setTempDeliverableLink('https://drive.google.com/file/d/project-asset-link/view');
                              }}
                              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-[10px] py-1.5 rounded-lg transition"
                            >
                              ✓ Selesaikan & Kirim ➔
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {requests.filter(r => r.pic === jobdeskUser && r.status === 'QC & Revisi Divisi').length === 0 && (
                      <p className="text-xs text-zinc-500 text-center py-8">Tidak ada task yang menunggu QC.</p>
                    )}
                  </div>
                </div>

                {/* Kolom Selesai */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 flex flex-col min-h-[500px]">
                  <h4 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Selesai & Dikirim
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {requests.filter(r => r.pic === jobdeskUser && r.status === 'Selesai').map(req => (
                       <div key={req.no} className="bg-zinc-950 border border-emerald-900/30 p-4 rounded-xl opacity-75">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">{req.no}</span>
                        </div>
                        <h5 className="text-sm font-bold text-zinc-200">{req.namaProject}</h5>
                        <a href={req.linkHasilAkhir} target="_blank" rel="noreferrer" className="text-[10px] text-emerald-400 underline mt-2 block">Lihat Hasil Akhir</a>
                      </div>
                    ))}
                    {requests.filter(r => r.pic === jobdeskUser && r.status === 'Selesai').length === 0 && (
                      <p className="text-xs text-zinc-500 text-center py-8">Belum ada task yang selesai.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'request-divisi' && (
            <>
              {/* ======================================================================= */}
              {/* TIER 2: PAPAN REQUEST DIVISI (CROSS-DIVISIONAL FLOW)                     */}
              {/* ======================================================================= */}
              <div className="space-y-6">
                
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="p-1.5 rounded bg-amber-600/10 text-amber-400 text-sm">📥</span>
                      Papan Request Divisi (Cross-Divisional Assets)
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Alur penyelesaian permintaan visual, materi promosi, dan desain grafis dari divisi luar.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Form Request */}
                  <div className="lg:col-span-4 bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800 space-y-4">
                    <div className="border-b border-zinc-800 pb-3">
                      <h4 className="text-sm font-bold text-zinc-200">Form Request Multimedia</h4>
                      <p className="text-[11px] text-zinc-500">Formulir lengkap pengajuan aset kreatif lintas divisi.</p>
                    </div>

                    <form onSubmit={handleRequestSubmit} className="space-y-3.5">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Nama & Divisi Pemohon <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Rudi (Marketing Div)"
                          value={requestDraft.pemohon}
                          onChange={(e) => setRequestDraft(prev => ({ ...prev, pemohon: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-zinc-100 transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Jenis Kebutuhan</label>
                          <select
                            value={requestDraft.jenisKebutuhan}
                            onChange={(e) => setRequestDraft(prev => ({ ...prev, jenisKebutuhan: e.target.value }))}
                            className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-zinc-100 transition"
                          >
                            <option value="Desain Grafis">Desain Grafis</option>
                            <option value="Video Pendek">Video Pendek</option>
                            <option value="Syuting / Liputan Event">Syuting / Liputan Event</option>
                            <option value="Print Banner">Print Banner</option>
                            <option value="Materi Sosmed">Materi Sosmed</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Deadline Diminta <span className="text-red-400">*</span></label>
                          <input
                            type="date"
                            required
                            value={requestDraft.deadlinePemohon}
                            onChange={(e) => handleSlaDateChange(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-zinc-100 transition"
                          />
                        </div>
                      </div>

                      {requestDraft.jenisKebutuhan === 'Syuting / Liputan Event' && (
                        <div className="grid grid-cols-2 gap-3 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800 animate-slide-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase">Waktu Acara <span className="text-red-400">*</span></label>
                            <input
                              type="datetime-local"
                              required={requestDraft.jenisKebutuhan === 'Syuting / Liputan Event'}
                              value={requestDraft.eventDate}
                              onChange={(e) => setRequestDraft(prev => ({ ...prev, eventDate: e.target.value }))}
                              className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-zinc-100 transition"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-zinc-400 uppercase">Lokasi <span className="text-red-400">*</span></label>
                            <input
                              type="text"
                              placeholder="Cth: Gedung A"
                              required={requestDraft.jenisKebutuhan === 'Syuting / Liputan Event'}
                              value={requestDraft.eventLocation}
                              onChange={(e) => setRequestDraft(prev => ({ ...prev, eventLocation: e.target.value }))}
                              className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-zinc-100 transition"
                            />
                          </div>
                        </div>
                      )}

                      {/* Strict SLA Alert */}
                      {slaWarning && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-[11px] text-amber-300 leading-relaxed animate-pulse">
                          ⚠️ <strong>Tenggat SLA Kurang dari 3 Hari!</strong> Request diprioritaskan tinggi dan membutuhkan approval manual Supervisor.
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Nama Project / Judul <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Desain Baliho Promo Nusafarm"
                          value={requestDraft.namaProject}
                          onChange={(e) => setRequestDraft(prev => ({ ...prev, namaProject: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-zinc-100 transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Brief Visual</label>
                        <textarea
                          rows="3"
                          placeholder="Tuliskan ukuran, referensi warna, pesan utama, dll..."
                          value={requestDraft.briefVisual}
                          onChange={(e) => setRequestDraft(prev => ({ ...prev, briefVisual: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-zinc-100 transition"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-bold py-2.5 rounded-lg text-xs transition"
                      >
                        Kirim Request Divisi
                      </button>
                    </form>
                  </div>

                  {/* Right Column: Multi-stage pipeline of divisional requests */}
                  <div className="lg:col-span-8 space-y-4">
                    
                    {/* Horizontal sub-tabs for Requests */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-zinc-900/40 p-1 rounded-xl border border-zinc-900">
                      {REQUEST_STAGES.map(stage => {
                        const count = requests.filter(r => r.status === stage.key).length;
                        const isSelected = activeRequestSubTab === stage.key;
                        return (
                          <button
                            key={stage.key}
                            onClick={() => setActiveRequestSubTab(stage.key)}
                            className={`p-2.5 rounded-lg text-left transition-all ${
                              isSelected ? 'bg-zinc-800 border border-zinc-700 shadow-md' : 'hover:bg-zinc-900/60'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{stage.icon}</span>
                              <span className="text-[9px] bg-zinc-950 px-1.5 py-0.5 rounded font-bold text-zinc-400">{count} Aset</span>
                            </div>
                            <h5 className="text-[11px] font-bold text-zinc-200 mt-1.5 truncate">{stage.key}</h5>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Request Grid List */}
                    <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5 min-h-[300px]">
                      
                      {requests.filter(r => r.status === activeRequestSubTab).length === 0 ? (
                        <div className="py-16 text-center text-zinc-500 text-xs">
                          Belum ada request dari divisi lain di tahap {activeRequestSubTab}.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {requests.filter(r => r.status === activeRequestSubTab).map(req => {
                            const estDateObj = new Date(req.estimasiSelesai);
                            const diffDays = Math.ceil((estDateObj.getTime() - BENCHMARK_DATE.getTime()) / (1000 * 60 * 60 * 24));
                            const isUrgent = diffDays < 3 && req.status === 'Review & Antrean';

                            return (
                              <div
                                key={req.no}
                                onClick={() => setViewRequestDetail(req)}
                                className={`bg-zinc-900 hover:bg-zinc-800/80 border p-4 rounded-xl transition cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                                  isUrgent ? 'border-amber-500/40 shadow-lg shadow-amber-950/10' : 'border-zinc-800'
                                }`}
                              >
                                {isUrgent && (
                                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500" />
                                )}

                                <div>
                                  <div className="flex justify-between items-center text-[9px] mb-2">
                                    <span className="font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                                      {req.no}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded font-bold ${isUrgent ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                      {diffDays < 0 ? 'TERLAMBAT' : `Sisa ${diffDays} Hari`}
                                    </span>
                                  </div>

                                  <h4 className="text-sm font-bold text-zinc-200 leading-snug">{req.namaProject}</h4>
                                  
                                  <div className="mt-2 text-[11px] text-zinc-400 space-y-1">
                                    <p><strong className="text-zinc-500">Kebutuhan:</strong> {req.jenisKebutuhan}</p>
                                    <p><strong className="text-zinc-500">Pemohon:</strong> {req.pemohon}</p>
                                    <p><strong className="text-zinc-500">PIC Desainer:</strong> {req.pic}</p>
                                  </div>
                                </div>

                                {/* Detailed sequential pipeline actions for requests */}
                                <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                                  
                                  {req.status === 'Review & Antrean' && (
                                    <>
                                      {assigningRequestId === req.no ? (
                                        <div className="space-y-2 bg-zinc-950 p-2 rounded border border-zinc-800">
                                          <label className="text-[9px] font-bold text-zinc-400 block uppercase">Pilih PIC Kreator:</label>
                                          <select 
                                            value={tempPic} 
                                            onChange={(e) => setTempPic(e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-[11px] text-zinc-100 mb-1"
                                          >
                                            {CREATORS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                          </select>
                                          <label className="text-[9px] font-bold text-zinc-400 block uppercase mt-1">Estimasi Selesai (Tim Mulmed):</label>
                                          <input 
                                            type="date"
                                            value={tempEstimasiMulmed}
                                            onChange={(e) => setTempEstimasiMulmed(e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-[11px] text-zinc-100"
                                          />
                                          <div className="flex gap-1.5 mt-2">
                                            <button 
                                              onClick={() => assignRequestPic(req.no)}
                                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-1 rounded"
                                            >
                                              Simpan
                                            </button>
                                            <button 
                                              onClick={() => setAssigningRequestId(null)}
                                              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] px-2 py-1 rounded"
                                            >
                                              Batal
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setAssigningRequestId(req.no);
                                            setTempPic(CREATORS[0].name);
                                          }}
                                          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-[11px] py-1.5 rounded-lg transition"
                                        >
                                          ✓ Setujui & Tunjuk PIC ➔
                                        </button>
                                      )}
                                    </>
                                  )}

                                  {req.status === 'Proses Desain' && (
                                    <button
                                      onClick={() => advanceRequestToQc(req.no)}
                                      className="w-full bg-zinc-950 hover:bg-blue-950/40 hover:text-blue-400 text-zinc-300 border border-zinc-800 rounded-lg py-1.5 text-xs font-bold transition"
                                    >
                                      Selesai Edit & Ajukan QC Divisi ➔
                                    </button>
                                  )}

                                  {req.status === 'QC & Revisi Divisi' && (
                                    <>
                                      {deliveryRequestId === req.no ? (
                                        <div className="space-y-2 bg-zinc-950 p-2 rounded border border-zinc-800">
                                          <label className="text-[9px] font-bold text-zinc-400 block uppercase">Link Hasil Akhir (G-Drive/Figma):</label>
                                          <input 
                                            type="url"
                                            required
                                            placeholder="https://drive.google.com/..."
                                            value={tempDeliverableLink}
                                            onChange={(e) => setTempDeliverableLink(e.target.value)}
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-[11px] text-zinc-100"
                                          />
                                          <div className="flex gap-1.5">
                                            <button 
                                              onClick={() => completeRequestWithLink(req.no)}
                                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-1 rounded"
                                            >
                                              Serah Terima Aset
                                            </button>
                                            <button 
                                              onClick={() => setDeliveryRequestId(null)}
                                              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] px-2 py-1 rounded"
                                            >
                                              Batal
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            setDeliveryRequestId(req.no);
                                            setTempDeliverableLink('https://drive.google.com/file/d/project-asset-link/view');
                                          }}
                                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs py-1.5 rounded-lg transition"
                                        >
                                          ✓ Selesaikan & Kirim Aset ➔
                                        </button>
                                      )}
                                    </>
                                  )}

                                  {req.status === 'Selesai' && (
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="text-emerald-400 font-bold">✓ Selesai & Terkirim</span>
                                      <button 
                                        onClick={() => deleteRequest(req.no)}
                                        className="text-zinc-500 hover:text-red-400 transition"
                                      >
                                        Hapus
                                      </button>
                                    </div>
                                  )}

                                </div>

                              </div>
                            );
                          })}
                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </div>
            </>
          )}

          {/* ======================================================================= */}
          {/* TAB: CONTENT PILLARS (STRATEGI KONTEN)                                  */}
          {/* ======================================================================= */}
          {activeTab === 'pillars' && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="p-1.5 rounded bg-cyan-600/10 text-cyan-400 text-sm">🏛️</span>
                    Pilar & Strategi Konten
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Definisikan arah komunikasi brand, kategori konten, dan target distribusinya.</p>
                </div>
                <button 
                  onClick={() => {
                    const name = prompt('Nama Pilar Baru (Misal: Edukasi Bisnis):');
                    if (name) {
                      setPillars(prev => [...prev, { id: Date.now(), brand: selectedBrand, name, description: 'Deskripsi pilar belum diisi.', targetPercentage: 0 }]);
                      triggerToast('Pilar berhasil ditambahkan!', 'success');
                    }
                  }}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <span>+</span> Tambah Pilar Baru
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {pillars.filter(p => selectedBrand === 'all' || p.brand === 'all' || p.brand === selectedBrand).map(pillar => (
                  <div key={pillar.id} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between group hover:border-cyan-500/30 transition">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-base font-bold text-zinc-100 group-hover:text-cyan-400 transition">{pillar.name}</h4>
                        <span className="bg-zinc-950 text-cyan-400 px-2 py-1 rounded text-[10px] font-black border border-cyan-900/30">
                          {pillar.targetPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">{pillar.description}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-zinc-800/60 flex gap-2">
                      <button 
                        onClick={() => {
                          const newDesc = prompt(`Ubah deskripsi untuk ${pillar.name}:`, pillar.description);
                          const newPct = prompt(`Ubah target porsi konten (%) untuk ${pillar.name}:`, pillar.targetPercentage);
                          if (newDesc && newPct) {
                            setPillars(prev => prev.map(p => p.id === pillar.id ? { ...p, description: newDesc, targetPercentage: parseInt(newPct) || 0 } : p));
                            triggerToast('Pilar berhasil diperbarui!');
                          }
                        }}
                        className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-[10px] font-bold py-1.5 rounded border border-zinc-800 transition"
                      >
                        Edit Pilar
                      </button>
                      <button 
                        onClick={() => {
                          if(window.confirm(`Hapus pilar ${pillar.name}?`)) {
                            setPillars(prev => prev.filter(p => p.id !== pillar.id));
                          }
                        }}
                        className="bg-zinc-950 hover:bg-red-950/40 text-red-500 text-[10px] font-bold px-3 py-1.5 rounded border border-zinc-800 hover:border-red-900/30 transition"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB: DISCIPLINARY & COMMITMENT                                          */}
          {/* ======================================================================= */}
          {activeTab === 'disciplinary' && (
            <div className="space-y-6">
              
              <div className="bg-rose-950/20 p-6 rounded-2xl border border-rose-900/50">
                <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
                  <span className="text-xl">⚖️</span> Dewan Etik & Kedisiplinan Tim
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Pantau pelanggaran SOP (seperti telat check-in pagi atau mangkir tugas). Terbitkan Surat Komitmen, SP 1, hingga SP 2 secara berjenjang jika anggota tim menolak bekerja sama.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {CREATORS.map(creator => {
                  const records = disciplinaryRecords.filter(r => r.name === creator.name);
                  const hasSP2 = records.some(r => r.type === 'SP2');
                  const hasSP1 = records.some(r => r.type === 'SP1');
                  const hasCommitment = records.some(r => r.type === 'Komitmen');

                  // Determine active status badge
                  let statusBadge = <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">Aman</span>;
                  if (hasSP2) statusBadge = <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded text-[10px] font-bold">Dalam Pengawasan SP2</span>;
                  else if (hasSP1) statusBadge = <span className="bg-orange-500/20 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded text-[10px] font-bold">Peringatan SP1</span>;
                  else if (hasCommitment) statusBadge = <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold">Surat Komitmen</span>;

                  return (
                    <div key={creator.name} className={`bg-zinc-900/40 border ${hasSP2 ? 'border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-zinc-800'} rounded-2xl p-5 flex flex-col justify-between`}>
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center font-black">
                              {creator.avatar}
                            </div>
                            <div>
                              <h4 className="font-bold text-zinc-200 text-sm">{creator.name}</h4>
                              <p className="text-[10px] text-zinc-500">{creator.role}</p>
                            </div>
                          </div>
                          {statusBadge}
                        </div>

                        <div className="space-y-2 mb-6">
                          <h5 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-1">Riwayat Pelanggaran</h5>
                          {records.length === 0 ? (
                            <p className="text-xs text-zinc-600 italic">Belum ada catatan indisipliner.</p>
                          ) : (
                            <ul className="space-y-2">
                              {records.map(rec => (
                                <li key={rec.id} className="text-[10px] bg-zinc-950 p-2 rounded border border-zinc-800/80">
                                  <div className="flex justify-between items-center mb-1">
                                    <strong className={`
                                      ${rec.type === 'SP2' ? 'text-red-400' : rec.type === 'SP1' ? 'text-orange-400' : 'text-amber-400'}
                                    `}>{rec.type}</strong>
                                    <span className="text-zinc-600">{rec.date}</span>
                                  </div>
                                  <span className="text-zinc-400">{rec.reason}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-zinc-800/60 space-y-2">
                        <p className="text-[10px] text-zinc-500 text-center mb-2">Tindakan Pendisiplinan (SPV Only)</p>
                        <button 
                          onClick={() => {
                            const reason = prompt(`Berikan alasan Surat Komitmen untuk ${creator.name} (Misal: Telat check-in 3 hari berturut-turut, tidak mengerjakan konten):`);
                            if(reason) {
                              setDisciplinaryRecords(prev => [...prev, { id: Date.now(), name: creator.name, type: 'Komitmen', reason, date: new Date().toLocaleDateString('id-ID') }]);
                              triggerToast(`Surat Komitmen untuk ${creator.name} diterbitkan.`, 'success');
                            }
                          }}
                          className="w-full bg-zinc-950 hover:bg-amber-950/40 text-amber-500 border border-amber-900/30 rounded-lg py-2 text-xs font-bold transition"
                        >
                          📝 Buat Surat Komitmen
                        </button>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <button 
                            onClick={() => {
                              const reason = prompt(`Berikan alasan Surat Peringatan (SP 1) untuk ${creator.name}:`);
                              if(reason) {
                                setDisciplinaryRecords(prev => [...prev, { id: Date.now(), name: creator.name, type: 'SP1', reason, date: new Date().toLocaleDateString('id-ID') }]);
                                triggerToast(`SP 1 untuk ${creator.name} resmi diterbitkan!`, 'warning');
                              }
                            }}
                            className="w-full bg-zinc-950 hover:bg-orange-950/40 text-orange-500 border border-orange-900/30 rounded-lg py-2 text-xs font-bold transition"
                          >
                            ⚠️ SP 1
                          </button>
                          
                          <button 
                            onClick={() => {
                              if(window.confirm(`PERINGATAN: Anda akan menerbitkan SP 2 untuk ${creator.name}. Lanjutkan?`)) {
                                const reason = prompt(`Alasan final SP 2 untuk ${creator.name}:`);
                                if(reason) {
                                  setDisciplinaryRecords(prev => [...prev, { id: Date.now(), name: creator.name, type: 'SP2', reason, date: new Date().toLocaleDateString('id-ID') }]);
                                  triggerToast(`SP 2 FINAL untuk ${creator.name} diterbitkan!`, 'error');
                                }
                              }
                            }}
                            className="w-full bg-zinc-950 hover:bg-red-950/40 text-red-500 border border-red-900/30 rounded-lg py-2 text-xs font-bold transition"
                          >
                            🚨 SP 2
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 2: CONTROL CENTER (SPV KPI ANALYTICS)                               */}
          {/* ======================================================================= */}
          {activeTab === 'control-center' && (
            <div className="space-y-8">
              
              <div className="bg-gradient-to-r from-violet-950/40 via-zinc-900 to-indigo-950/20 p-6 rounded-2xl border border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-violet-400">KPI Audit Matriks</span>
                  <h3 className="text-xl font-bold mt-1 text-zinc-100">Supervisor Control Intelligence</h3>
                  <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                    Evaluasi performa bulanan, pengawasan kriteria draf rilis, penyelesaian tiket SLA divisi, dan konsistensi publikasi.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      let csvContent = "data:text/csv;charset=utf-8,";
                      csvContent += "ID,Judul Konten,Brand,Platform,PIC (Assignee),Tahap,Status,Total Revisi,Tanggal Rilis\n";
                      contentCards.forEach(c => {
                        const row = [
                          c.id,
                          `"${c.title.replace(/"/g, '""')}"`,
                          c.brand,
                          c.platform,
                          c.assignee,
                          c.stage,
                          c.status,
                          c.revisionCount,
                          c.date
                        ].join(",");
                        csvContent += row + "\n";
                      });
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `Laporan_Konten_${new Date().toLocaleDateString('id-ID').replace(/\//g, '-')}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      triggerToast("Laporan CSV berhasil diunduh!", "success");
                    }}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Tarik Laporan Akhir Bulan
                  </button>
                  <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-center min-w-[120px]">
                    <span className="text-[10px] text-zinc-500 block uppercase font-bold">Status Operasional</span>
                    <span className="text-emerald-400 font-extrabold text-sm flex items-center justify-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      OPTIMAL
                    </span>
                  </div>
                </div>
              </div>

              {/* KPI Analytics Widgets Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Widget A: Average Revision Rate per Asset */}
                <div className="lg:col-span-5 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 space-y-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Rasio Revisi per Aset</h4>
                      <span className="text-[10px] bg-red-950/40 border border-red-900/50 text-red-400 font-bold px-2 py-0.5 rounded">
                        Limit SPV: Max 2.0
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">Rata-rata frekuensi revisi draf yang diajukan oleh anak magang/crew.</p>
                  </div>

                  <div className="space-y-4">
                    {creatorAverages.map(creator => {
                      const isOverLimit = creator.calculatedRate > 2.0;
                      const barPercentage = Math.min((creator.calculatedRate / 4.0) * 100, 100);

                      return (
                        <div key={creator.name} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-zinc-200">{creator.name}</span>
                            <span className={`font-bold ${isOverLimit ? 'text-red-400' : 'text-emerald-400'}`}>
                              {creator.calculatedRate} Revisi {isOverLimit && '⚠️'}
                            </span>
                          </div>

                          <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${
                                isOverLimit 
                                  ? 'bg-gradient-to-r from-red-600 to-rose-500' 
                                  : 'bg-gradient-to-r from-violet-600 to-indigo-500'
                              }`}
                              style={{ width: `${barPercentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-xs bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-zinc-500 leading-relaxed">
                    💡 <strong className="text-zinc-300">Tips Supervisor:</strong> Hubungi desainer yang memiliki rata-rata revisi &gt; 2.0 untuk sesi coaching draf media sosial.
                  </div>
                </div>

                {/* Widget B: SLA Fulfillment Rate */}
                <div className="lg:col-span-4 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300">SLA Fulfillment Rate</h4>
                    <p className="text-xs text-zinc-500 mt-1">Persentase tiket visual divisi luar yang diselesaikan tepat waktu sebelum batas target SLA.</p>
                  </div>

                  <div className="relative flex justify-center items-center">
                    <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#18181b" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="40" fill="transparent" stroke="url(#slaGrad)" strokeWidth="8" 
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * slaPercentage) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="slaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <div className="absolute text-center">
                      <span className="text-3xl font-extrabold text-white tracking-tight">{slaPercentage}%</span>
                      <span className="text-[9px] text-zinc-500 block font-bold uppercase mt-0.5">SLA MET</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 block uppercase">Total Request</span>
                      <span className="text-base font-bold text-emerald-400 mt-0.5 block">{totalRequests} Assets</span>
                    </div>
                    <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
                      <span className="text-[10px] text-zinc-500 block uppercase">Target Minimal</span>
                      <span className="text-base font-bold text-zinc-300 mt-0.5 block">90%</span>
                    </div>
                  </div>
                </div>

                {/* Widget C: Content Consistency Score */}
                <div className="lg:col-span-3 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Konsistensi Publikasi</h4>
                    <p className="text-xs text-zinc-500 mt-1">Rasio volume konten yang dijadwalkan & tayang dibanding total ide direncanakan.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 block tracking-tight">
                        {consistencyScore}%
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1 block">Consistency Rating</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Tayang & Sched:</span>
                        <span className="text-zinc-300 font-semibold">{publishedCount + scheduledCount} konten</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Total Draft:</span>
                        <span className="text-zinc-300 font-semibold">{totalRelevantContent} konten</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2 text-[9px] text-zinc-500 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Posted</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Sched</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span> Backlog</span>
                  </div>
                </div>

              </div>

                {/* Widget D: Kedisiplinan & Log Kehadiran */}
                <div className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 space-y-6 mt-8">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Kedisiplinan & Log Kehadiran</h4>
                    <p className="text-xs text-zinc-500 mt-1">Laporan absen pagi (Check-in) tim beserta tracker keterlambatan harian.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {CREATORS.map(creator => {
                      const creatorCheckins = checkins.filter(c => c.name === creator.name);
                      const lateCount = creatorCheckins.filter(c => c.isLate).length;
                      const onTimeCount = creatorCheckins.length - lateCount;
                      
                      return (
                        <div key={creator.name} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/80">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                              {creator.avatar}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-zinc-200 block">{creator.name}</span>
                              <span className="text-[9px] text-zinc-500 block uppercase">{creator.role}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-lg">
                              <span className="block font-bold text-emerald-400">{onTimeCount}</span>
                              <span className="text-[9px] text-zinc-500 uppercase">On-Time</span>
                            </div>
                            <div className={`p-2 rounded-lg ${lateCount > 0 ? 'bg-red-950/20 border border-red-900/30' : 'bg-zinc-900 border border-zinc-800/50'}`}>
                              <span className={`block font-bold ${lateCount > 0 ? 'text-red-400' : 'text-zinc-500'}`}>{lateCount}</span>
                              <span className="text-[9px] text-zinc-500 uppercase">Late</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 4: DAILY CHECK-IN TEAM                                              */}
          {/* ======================================================================= */}
          {activeTab === 'daily-checkin' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkin Form Widget */}
              <div className="lg:col-span-1 bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 self-start">
                <h3 className="text-lg font-bold text-zinc-100 mb-6 flex items-center gap-2">
                  <span className="p-1.5 rounded bg-emerald-600/20 text-emerald-400">⏱️</span>
                  Check-in Hari Ini
                </h3>
                <form onSubmit={handleCheckinSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Nama Tim</label>
                    <select
                      required
                      value={checkinForm.name}
                      onChange={(e) => setCheckinForm({...checkinForm, name: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {CREATORS.map(c => <option key={c.name} value={c.name}>{c.name} - {c.role}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Jam Kedatangan (Maks 08:00)</label>
                    <input
                      type="time"
                      required
                      value={checkinForm.time}
                      onChange={(e) => setCheckinForm({...checkinForm, time: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Daily Plan / Target Selesai Hari Ini</label>
                    <textarea
                      required
                      rows={4}
                      value={checkinForm.plan}
                      onChange={(e) => setCheckinForm({...checkinForm, plan: e.target.value})}
                      placeholder="1. Edit video Nusaqu&#10;2. Bikin script konten NSF&#10;3. Follow-up divisi ..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30 transition">
                    Submit Check-in
                  </button>
                </form>
              </div>

              {/* Feed/History Log */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-zinc-100">Live Team Tracker</h3>
                  <span className="text-[10px] text-zinc-500 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                    Total Check-in: {checkins.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {checkins.length === 0 ? (
                    <div className="bg-zinc-900/20 border border-zinc-800/50 rounded-2xl p-12 text-center text-zinc-500">
                      Belum ada laporan absen hari ini. Silakan tim mengisi check-in di samping.
                    </div>
                  ) : (
                    checkins.map(ci => (
                      <div key={ci.id} className={`p-5 rounded-2xl border ${ci.isLate ? 'bg-red-950/10 border-red-900/30' : 'bg-zinc-900/40 border-zinc-800'} flex gap-4`}>
                        <div className="shrink-0 flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-lg ${ci.isLate ? 'bg-red-900/50 text-red-300' : 'bg-emerald-900/50 text-emerald-300'}`}>
                            {CREATORS.find(c => c.name === ci.name)?.avatar || 'U'}
                          </div>
                          <span className={`text-[9px] mt-2 font-bold px-1.5 py-0.5 rounded ${ci.isLate ? 'bg-red-500/20 text-red-400' : 'bg-zinc-800 text-zinc-400'}`}>
                            {ci.time}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="font-bold text-zinc-100 text-sm mr-2">{ci.name}</span>
                              {ci.isLate && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">LATE</span>}
                            </div>
                            <span className="text-[10px] text-zinc-500">{ci.date}</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/50 mt-2">
                            {ci.plan}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

        </section>

        {showAddIdeaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setShowAddIdeaModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="p-1.5 rounded bg-violet-600/20 text-violet-400">💡</span>
                Tambahkan Ide Konten
              </h3>
              
              <form onSubmit={handleAddIdeaSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Judul Konten <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newIdeaDraft.title}
                    onChange={(e) => setNewIdeaDraft({...newIdeaDraft, title: e.target.value})}
                    placeholder="Contoh: Vlog Panen Sapi Perah"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Akun Utama <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={newIdeaDraft.brand}
                      onChange={(e) => setNewIdeaDraft({...newIdeaDraft, brand: e.target.value, collaborator: e.target.value === newIdeaDraft.collaborator ? '' : newIdeaDraft.collaborator})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      {BRANDS.filter(b => b.id !== 'all').map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Kolaborator (Opsional)</label>
                    <select
                      value={newIdeaDraft.collaborator}
                      onChange={(e) => setNewIdeaDraft({...newIdeaDraft, collaborator: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      <option value="">-- Tidak Ada --</option>
                      {BRANDS.filter(b => b.id !== 'all' && b.id !== newIdeaDraft.brand).map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Format</label>
                    <select
                      value={newIdeaDraft.format}
                      onChange={(e) => setNewIdeaDraft({...newIdeaDraft, format: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      <option value="Reels / Video">Reels / Video</option>
                      <option value="Feed / Carousel">Feed / Carousel</option>
                      <option value="Story">Story</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">PIC Kreator</label>
                    <select
                      value={newIdeaDraft.assignee}
                      onChange={(e) => setNewIdeaDraft({...newIdeaDraft, assignee: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      {CREATORS.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Target Rilis</label>
                    <input
                      type="date"
                      value={newIdeaDraft.date}
                      onChange={(e) => setNewIdeaDraft({...newIdeaDraft, date: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-violet-500 cursor-text"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddIdeaModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white transition">Batal</button>
                  <button type="submit" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/30 transition">Simpan Ide</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {writeScriptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setWriteScriptModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="p-1.5 rounded bg-blue-600/20 text-blue-400">📝</span>
                Tulis Naskah / Script
              </h3>
              <p className="text-sm text-zinc-400 mb-6 font-semibold">{writeScriptModal.title}</p>
              
              <div className="space-y-4">
                <textarea
                  value={tempScript}
                  onChange={(e) => setTempScript(e.target.value)}
                  placeholder="Tulis naskah video/caption di sini..."
                  rows={10}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-200 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                ></textarea>

                <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-center border-t border-zinc-800/80 gap-4">
                  <button 
                    onClick={() => {
                       const waUrl = `https://wa.me/?text=${encodeURIComponent(`*Script Konten: ${writeScriptModal.title}*\n\n${tempScript}`)}`;
                       window.open(waUrl, '_blank');
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2"
                  >
                    Kirim ke WA ➔
                  </button>
                  
                  <div className="flex gap-3 w-full sm:w-auto justify-end">
                    <button onClick={() => setWriteScriptModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white transition">Batal</button>
                    <button 
                      onClick={() => {
                        setContentCards(prev => prev.map(c => 
                          c.id === writeScriptModal.id ? { ...c, scriptContent: tempScript } : c
                        ));
                        setWriteScriptModal(null);
                        triggerToast('Naskah berhasil disimpan!');
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 transition"
                    >
                      Simpan Naskah
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* TAB: KALKULATOR KPI                                                     */}
        {/* ======================================================================= */}
        {activeTab === 'kpi-kalkulator' && (
          <div className="p-6">
            <KpiCalculator />
          </div>
        )}

      </main>

    </div>
  );
}
