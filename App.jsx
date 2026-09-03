import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, CheckCircle, Clock, AlertTriangle, MessageSquare, TrendingUp, Users, Calculator, Trash2, Plus } from 'lucide-react';
import { supabase } from './supabaseClient';
import KpiCalculator from './KpiCalculator';

const BRANDS = [
  { id: 'all', name: 'Semua Akun', color: 'border-[#33415E] bg-[#1D2536]' },
  { id: 'ig-nusaqu', name: 'IG @nusaqu.id', color: 'border-pink-500/30 bg-pink-950/20 text-pink-400' },
  { id: 'ig-nsf', name: 'IG @nusasentosafarm', color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400' },
  { id: 'ig-bekasi', name: 'IG @nusaqu.bekasi', color: 'border-blue-500/30 bg-blue-950/20 text-blue-400' },
  { id: 'ig-bandung', name: 'IG @nusaqu.bandung', color: 'border-indigo-500/30 bg-indigo-950/20 text-indigo-400' },
  { id: 'ig-klaten', name: 'IG @nusaqu.klaten', color: 'border-violet-500/30 bg-violet-950/20 text-violet-400' },
  { id: 'thr-nusaqu', name: 'Thr @nusaqu.id', color: 'border-zinc-500/30 bg-[#0A0D14]/20 text-slate-400' },
  { id: 'tt-nusaqu', name: 'TT @nusaqu.id', color: 'border-black/30 bg-[#131824]/80 text-white' },
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
  { name: 'Tyo', role: 'Creative Content Marketing', avatar: 'TY', initialRevisionRate: 1.5 },
  { name: 'Aldo', role: 'Junior Production Assistant', avatar: 'AL', initialRevisionRate: 1.0 },
  { name: 'Halim', role: 'Creative Content Marketing', avatar: 'HL', initialRevisionRate: 1.0 }
];

const INITIAL_CONTENT_CARDS = [];

const INITIAL_PILLARS = [
  { id: 1, brand: 'all', name: 'Entertainment & High-Reach', description: 'Tujuan: Menghentikan scrolling, memicu viralitas, tambah followers awam. Target: TikTok & IG Reels. Tone: Santai, humoris, relatable.', targetPercentage: 25 },
  { id: 2, brand: 'all', name: 'Edukasi Terapan & Transparansi', description: 'Tujuan: Edukasi logika pembeli, kikis keraguan, bangun otoritas tepercaya. Target: YT Long-Form, IG Reels, TikTok. Tone: Informatif, tajam, objektif.', targetPercentage: 25 },
  { id: 3, brand: 'all', name: 'Branding & Brand Gravity', description: 'Tujuan: Pride, persepsi kelas atas, jaminan mutu Bintang 5 via figur Pak Nanang. Target: IG Nusaqu & YT. Tone: Premium, inspiratif, berwibawa.', targetPercentage: 20 },
  { id: 4, brand: 'all', name: 'Social Proof & Validation', description: 'Tujuan: Kikis keraguan akhir, memicu FOMO (bukti transaksi/testimoni). Target: IG Nusafarm, Meta Ads, IG Reels. Tone: Meyakinkan, dramatis, authentic.', targetPercentage: 15 },
  { id: 5, brand: 'all', name: 'Konversi & Direct Sales', description: 'Tujuan: Dorong transaksi instan (qualified leads & booking). Target: IG Nusafarm, TikTok Live, Meta Ads. Tone: Persuasif, action-oriented, hard-sell.', targetPercentage: 15 }
];

const PIPELINE_STAGES = [
  { key: 'Ide', label: 'Ide / Draft', icon: '💡', desc: 'Brainstorming & ideasi awal konten' },
  { key: 'Script/Brief', label: 'Script / Brief', icon: '📝', desc: 'Penyusunan naskah & konsep visual' },
  { key: 'Produksi', label: 'Produksi / Syuting', icon: '🎥', desc: 'Proses take video, VO, atau penyediaan aset mentah' },
  { key: 'Editing', label: 'Editing & QC SPV', icon: '🎬', desc: 'Produksi video, desain grafis & audit oleh SPV' },
  { key: 'Manager', label: 'Approval Manager', icon: '👑', desc: 'Review akhir oleh Manager' },
  { key: 'Publish', label: 'Publish / Sched', icon: '🚀', desc: 'Konten terbit atau terjadwal rapi' }
];

const REQUEST_STAGES = [
  { key: 'Review & Antrean', label: 'Review & Antrean', icon: '📥', color: 'text-amber-400 bg-amber-500/10' },
  { key: 'Proses Desain', label: 'Proses Desain / Editing', icon: '💻', color: 'text-blue-400 bg-blue-500/10' },
  { key: 'QC & Revisi Divisi', label: 'QC & Revisi SPV', icon: '🔍', color: 'text-violet-400 bg-violet-500/10' },
  { key: 'Approval Manager', label: 'Approval Manager', icon: '👑', color: 'text-fuchsia-400 bg-fuchsia-500/10' },
  { key: 'Selesai', label: 'Selesai & Kirim', icon: '✅', color: 'text-emerald-400 bg-emerald-500/10' }
];

export default function App() {
  const [session, setSession] = useState(null);
  const [isInitializingAuth, setIsInitializingAuth] = useState(true);
  const [bypassAuth, setBypassAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('beranda');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [jobdeskUser, setJobdeskUser] = useState('Fathan');
  const isPublicMode = window.location.pathname === '/request' || window.location.hash.includes('request') || new URLSearchParams(window.location.search).get('view') === 'request';
  
  /* State lists */
  const [contentCards, setContentCards] = useState(() => { const saved = localStorage.getItem('mmhub_contentCards'); return saved ? JSON.parse(saved) : INITIAL_CONTENT_CARDS; });
  const [requests, setRequests] = useState([]);
  const [checkins, setCheckins] = useState(() => {
    const saved = localStorage.getItem('mmhub_checkins');
    return saved ? JSON.parse(saved) : [];
  });
  const [disciplinaryRecords, setDisciplinaryRecords] = useState(() => {
    const saved = localStorage.getItem('mmhub_disciplinary');
    return saved ? JSON.parse(saved) : [];
  });
  const [pillars, setPillars] = useState(() => {
    const saved = localStorage.getItem('mmhub_pillars');
    return saved ? JSON.parse(saved) : INITIAL_PILLARS;
  });

  

  useEffect(() => {
    localStorage.setItem('mmhub_pillars', JSON.stringify(pillars));
  }, [pillars]);

  useEffect(() => {
    localStorage.setItem('mmhub_checkins', JSON.stringify(checkins));
  }, [checkins]);

  useEffect(() => {
    localStorage.setItem('mmhub_disciplinary', JSON.stringify(disciplinaryRecords));
  }, [disciplinaryRecords]);

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
    if (session || isPublicMode || bypassAuth) { fetchRequests(); fetchContentCards(); }
  }, [session, isPublicMode, bypassAuth]);

  
  const fetchContentCards = async () => {
    const { data, error } = await supabase.from('content_cards').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setContentCards(data.map(d => ({ ...d, revisionCount: d.revision_count || 0 })));
    }
  };
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
  const [editingContentId, setEditingContentId] = useState(null);
  const [editJobModal, setEditJobModal] = useState(null);
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
    time: '08:30'
  });

  // SPV Quick Add form uses uncontrolled inputs now

  const handleCheckinSubmit = async (e) => {
    e.preventDefault();
    
    const isLate = checkinForm.time > '08:15';
    setCheckins(prev => [
      {
        id: Date.now(),
        name: checkinForm.name,
        time: checkinForm.time,
        plan: isLate ? "Hadir (Terlambat)" : "Hadir (Tepat Waktu)",
        date: new Date().toLocaleDateString('id-ID'),
        isLate
      },
      ...prev
    ]);
    
    triggerToast(`Check-in sukses!`);

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

    setCheckinForm(prev => ({ ...prev, time: '' }));
  };

  const handleQuickAddJob = async (e, creatorName) => {
    e.preventDefault();
    const form = e.target;
    const input = form.elements.taskName;
    const taskName = input.value;
    
    if (!taskName.trim()) {
      triggerToast('Nama tugas tidak boleh kosong!', 'error');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const count = requests.length + 1;
    const requestNo = `SPV-${String(count).padStart(3, '0')}-${Math.floor(Math.random()*1000)}`;

    const newReq = {
      no: requestNo,
      tanggalRequest: today,
      pemohon: 'Supervisor',
      jenisKebutuhan: 'Tugas SPV',
      namaProject: taskName,
      briefVisual: 'Tugas ditambahkan langsung oleh Supervisor ke agenda harian.',
      deadlinePemohon: today,
      estimasiSelesai: today,
      estimasiMulmed: '',
      pic: creatorName,
      status: 'Proses Desain', 
      linkHasilAkhir: ''
    };

    const { error } = await supabase.from('requests').insert([newReq]);
    
    if (error) {
      triggerToast('Gagal menambahkan tugas SPV ke database.', 'error');
    } else {
      setRequests([newReq, ...requests]);
      triggerToast(`Tugas berhasil ditambahkan untuk ${creatorName}!`);
      input.value = '';
    }
  };

  const handleEditJobSave = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('requests')
      .update({
        namaProject: editJobModal.namaProject,
        briefVisual: editJobModal.briefVisual,
        deadlinePemohon: editJobModal.deadlinePemohon,
        estimasiMulmed: editJobModal.estimasiMulmed
      })
      .eq('no', editJobModal.no);

    if (error) {
      triggerToast('Gagal menyimpan perubahan.', 'error');
    } else {
      setRequests(requests.map(r => r.no === editJobModal.no ? editJobModal : r));
      triggerToast('Tugas berhasil diperbarui!');
      setEditJobModal(null);
    }
  };

  const handleAddIdeaSubmit = async (e) => {
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

    const cardData = {
      title: newIdeaDraft.title,
      brand: newIdeaDraft.brand,
      collaborator: newIdeaDraft.collaborator || undefined,
      platform: autoPlatform,
      format: newIdeaDraft.format,
      assignee: newIdeaDraft.assignee,
      date: newIdeaDraft.date,
      notes: newIdeaDraft.notes
    };

    if (editingContentId) {
      const dbCardData = { ...cardData };
      delete dbCardData.format;
      delete dbCardData.collaborator;
      const { error } = await supabase.from('content_cards').update(dbCardData).eq('id', editingContentId);
      if (error) {
         triggerToast('Gagal mengupdate Supabase: ' + error.message, 'error');
         console.error('Supabase error:', error);
         return;
      }
      setContentCards(prev => prev.map(c => c.id === editingContentId ? { ...c, ...cardData } : c));
      triggerToast('Ide konten berhasil diperbarui!', 'success');
      setEditingContentId(null);
    } else {
      addNewContentCard(cardData);
    }
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
    headline: '',
    referensiVisual: '',
    infoWajib: '',
    briefVisual: '',
    deadlinePemohon: '',
    pic: 'Belum Ditunjuk',
    linkHasilAkhir: '',
    eventDate: '',
    eventLocation: ''
  });

  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    
    const count = requests.length + 1;
    const requestNo = `FDBK-${String(count).padStart(3, '0')}`;
    
    const newFeedback = {
      no: requestNo,
      tanggalRequest: new Date().toISOString().split('T')[0],
      pemohon: 'Anonim',
      jenisKebutuhan: 'Saran & Kritik',
      namaProject: 'Masukan Pengguna',
      briefVisual: feedbackText,
      deadlinePemohon: new Date().toISOString().split('T')[0],
      estimasiSelesai: new Date().toISOString().split('T')[0],
      estimasiMulmed: '',
      pic: 'Semua Tim',
      status: 'Feedback',
      linkHasilAkhir: ''
    };

    const { error } = await supabase.from('requests').insert([newFeedback]);
    if (error) {
      triggerToast('Gagal mengirim saran, coba lagi!', 'error');
    } else {
      setRequests([newFeedback, ...requests]);
      triggerToast('Terima kasih! Saran & kritik Anda telah kami terima.', 'success');
      setFeedbackText('');
    }
  };

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

  const advancePipelineStage = async (cardId, currentStage) => {
    const card = contentCards.find(c => c.id === cardId);
    if (!card) return;
    let updatedCard = { ...card };

    if (currentStage === 'Ide') {
      updatedCard = { ...card, stage: 'Script/Brief', status: 'Scripting', notes: `${card.notes || ''} | Ide disetujui` };
      setActiveSubTab('Script/Brief');
      triggerToast('Ide disetujui! Berhasil dipindahkan ke tahap Script/Brief.');
    } else if (currentStage === 'Script/Brief') {
      updatedCard = { ...card, stage: 'Produksi', status: 'Syuting/Take', notes: `${card.notes || ''} | Script disetujui` };
      setActiveSubTab('Produksi');
      triggerToast('Script disetujui! Konten masuk ke tahap Produksi/Syuting.');
    } else if (currentStage === 'Produksi') {
      updatedCard = { ...card, stage: 'Editing', status: 'Editing', notes: `${card.notes || ''} | Aset mentah siap` };
      setActiveSubTab('Editing');
      triggerToast('Aset selesai! Konten dilempar ke meja Editing.');
    } else if (currentStage === 'Editing') {
      setQcModalCard(card);
      setRevisionNote('');
      return;
    } else if (currentStage === 'Manager') {
      setQcModalCard(card);
      setRevisionNote('');
      return;
    }
    
    setContentCards(prev => prev.map(c => c.id === cardId ? updatedCard : c));
    const dbCard = { ...updatedCard, revision_count: updatedCard.revisionCount };
    delete dbCard.revisionCount; delete dbCard.format; delete dbCard.collaborator;
    const { error } = await supabase.from('content_cards').upsert(dbCard);
    if (error) triggerToast('Gagal mengupdate database: ' + error.message, 'error');
  };

  const handleQcApproval = async (approve) => {
    if (!qcModalCard) return;
    let updatedCard = { ...qcModalCard };
    const isManager = qcModalCard.stage === 'Manager';

    if (approve) {
      if (revisionNote.trim() !== '') {
        triggerToast('Gagal! Anda mengetik catatan revisi tetapi malah memencet tombol "Setujui". Hapus catatan jika memang ingin menyetujui.', 'error');
        return;
      }
      if (isManager) {
        updatedCard = { ...qcModalCard, stage: 'Publish', status: 'Scheduled', notes: `${qcModalCard.notes} | Disetujui oleh Manager` };
        setActiveSubTab('Publish');
        triggerToast(`Konten disetujui oleh Manager! Siap dijadwalkan.`);
      } else {
        updatedCard = { ...qcModalCard, stage: 'Manager', status: 'Menunggu Manager', notes: `${qcModalCard.notes} | Disetujui oleh SPV` };
        setActiveSubTab('Manager');
        triggerToast(`Konten disetujui oleh SPV! Diteruskan ke Manager.`);
      }
    } else {
      if (!revisionNote.trim()) {
        triggerToast('Wajib mengisi catatan revisi agar tim tahu apa yang perlu diperbaiki!', 'error');
        return;
      }
      updatedCard = {
        ...qcModalCard, 
        stage: 'Editing',
        status: 'Editing', 
        revisionCount: qcModalCard.revisionCount + 1, 
        notes: `${qcModalCard.notes} | Revisi ${isManager ? 'Manager' : 'SPV'}: ${revisionNote}`
      };
      triggerToast(`Konten dikembalikan untuk Revisi.`);
    }
    
    setContentCards(prev => prev.map(c => c.id === qcModalCard.id ? updatedCard : c));
    const dbCard = { ...updatedCard, revision_count: updatedCard.revisionCount };
    delete dbCard.revisionCount; delete dbCard.format; delete dbCard.collaborator;
    const { error } = await supabase.from('content_cards').upsert(dbCard);
    if (error) triggerToast('Gagal mengupdate database: ' + error.message, 'error');
    setQcModalCard(null);
  };

  const publishNow = async (cardId) => {
    const card = contentCards.find(c => c.id === cardId);
    if (!card) return;
    const updatedCard = { ...card, status: 'Published' };
    
    setContentCards(prev => prev.map(c => c.id === cardId ? updatedCard : c));
    const dbCard = { ...updatedCard, revision_count: updatedCard.revisionCount };
    delete dbCard.revisionCount; delete dbCard.format; delete dbCard.collaborator;
    const { error } = await supabase.from('content_cards').upsert(dbCard);
    if (error) triggerToast('Gagal mengupdate database: ' + error.message, 'error');
    triggerToast('Konten berhasil diterbitkan secara Live!');
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    const count = requests.length + 1;
    const requestNo = `REQ-MM-${String(count).padStart(3, '0')}`;

    let finalBrief = requestDraft.briefVisual || 'Tidak ada brief visual khusus.';

    let extraFields = [];
    if (requestDraft.headline) extraFields.push(`📌 Headline: ${requestDraft.headline}`);
    if (requestDraft.referensiVisual) extraFields.push(`🎨 Referensi Visual: ${requestDraft.referensiVisual}`);
    if (requestDraft.infoWajib) extraFields.push(`📝 Info Wajib: ${requestDraft.infoWajib}`);
    
    if (extraFields.length > 0) {
      finalBrief += `\n\n=== DETAIL TAMBAHAN ===\n${extraFields.join('\n')}`;
    }

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
      headline: '',
      referensiVisual: '',
      infoWajib: '',
      briefVisual: '',
      deadlinePemohon: '',
      pic: 'Belum Ditunjuk',
      linkHasilAkhir: '',
      eventDate: '',
      eventLocation: ''
    });
    
    setActiveRequestSubTab('Review & Antrean');
  };

  const unassignRequest = async (reqNo) => {
    if (!window.confirm('Apakah Anda yakin ingin membatalkan/mengembalikan tugas ini ke antrean?')) return;
    const { error } = await supabase
      .from('requests')
      .update({ pic: null, estimasiMulmed: null, status: 'Review & Antrean' })
      .eq('no', reqNo);
    
    if (error) {
      triggerToast('Gagal membatalkan tugas!', 'error');
      console.error(error);
    } else {
      triggerToast('Tugas berhasil dikembalikan ke antrean.', 'success');
      fetchRequests();
      if (viewRequestDetail && viewRequestDetail.no === reqNo) {
        setViewRequestDetail(null);
      }
    }
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

  const revertRequestToProsesDesain = async (reqNo) => {
    if (!window.confirm('Kembalikan tugas ini ke Sedang Dikerjakan (Proses)?')) return;
    const { error } = await supabase
      .from('requests')
      .update({ status: 'Proses Desain' })
      .eq('no', reqNo);
      
    if (error) {
      triggerToast('Gagal update ke database!', 'error');
      console.error(error);
    } else {
      setRequests(prev => prev.map(r => 
        r.no === reqNo 
          ? { ...r, status: 'Proses Desain' } 
          : r
      ));
      triggerToast(`Tugas ${reqNo} dikembalikan ke Proses Desain!`, 'success');
    }
  };

  const forwardRequestToManager = async (reqNo) => {
    if (!window.confirm('Teruskan tugas ini ke Manager untuk final approval?')) return;
    const { error } = await supabase
      .from('requests')
      .update({ status: 'Approval Manager' })
      .eq('no', reqNo);
      
    if (error) {
      triggerToast('Gagal update ke database!', 'error');
      console.error(error);
    } else {
      setRequests(prev => prev.map(r => 
        r.no === reqNo 
          ? { ...r, status: 'Approval Manager' } 
          : r
      ));
      triggerToast(`Tugas ${reqNo} diteruskan ke Manager!`, 'success');
    }
  };

  const revertRequestToQcDivisi = async (reqNo) => {
    if (!window.confirm('Kembalikan tugas ini ke Menunggu QC / Revisi?')) return;
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
      triggerToast(`Tugas ${reqNo} dikembalikan ke Menunggu QC / Revisi!`, 'success');
    }
  };

  const archiveRequest = async (reqNo) => {
    if (!window.confirm('Arsipkan tugas ini? (Tugas akan dipindahkan ke Menu Arsip)')) return;
    const { error } = await supabase
      .from('requests')
      .update({ status: 'Arsip' })
      .eq('no', reqNo);
      
    if (error) {
      triggerToast('Gagal mengarsipkan tugas!', 'error');
      console.error(error);
    } else {
      setRequests(prev => prev.map(r => 
        r.no === reqNo 
          ? { ...r, status: 'Arsip' } 
          : r
      ));
      triggerToast(`Tugas ${reqNo} berhasil diarsipkan!`, 'success');
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
  const addNewContentCard = async (cardData) => {
    const newCard = {
      id: `c-${Date.now()}`,
      ...cardData,
      revisionCount: 0,
      stage: 'Ide',
      status: 'Ide'
    };
    const dbCard = { ...newCard, revision_count: newCard.revisionCount };
    delete dbCard.revisionCount;
    // Remove fields not in Supabase yet
    delete dbCard.format;
    delete dbCard.collaborator;

    const { error } = await supabase.from('content_cards').insert(dbCard);
    if (error) {
      triggerToast('Gagal menyimpan ke Supabase: ' + error.message, 'error');
      console.error('Supabase error:', error);
      return;
    }
    
    setContentCards(prev => [...prev, newCard]);
    triggerToast('Ide baru berhasil ditambahkan ke sub-tab Ide!');
    setActiveSubTab('Ide');
  };

  const deleteContentCard = async (cardId) => {
    if (window.confirm('Yakin ingin membatalkan/menghapus konten ini?')) {
      const { error } = await supabase.from('content_cards').delete().eq('id', cardId);
      if (error) {
        triggerToast('Gagal menghapus dari Supabase: ' + error.message, 'error');
        return;
      }
      setContentCards(prev => prev.filter(c => c.id !== cardId));
      triggerToast('Konten berhasil dibatalkan/dihapus.', 'success');
    }
  };

  const openEditContentModal = (card) => {
    setEditingContentId(card.id);
    setNewIdeaDraft({
      title: card.title,
      brand: card.brand,
      collaborator: card.collaborator || '',
      assignee: card.assignee,
      date: card.date,
      notes: card.notes || '',
      format: card.format || 'Reels / Video'
    });
    setShowAddIdeaModal(true);
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
    return <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center text-white font-sans"><div className="animate-pulse font-bold tracking-widest text-slate-1000 uppercase">Loading Session...</div></div>;
  }

  if (isPublicMode) {
    return (
      <div className="min-h-screen bg-[#0A0D14] text-white font-sans p-4 md:p-8 selection:bg-violet-600 flex items-center justify-center">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* KOLOM KIRI: Kumpulan Form */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 1. Form Request Divisi */}
            <div className="bg-[#131824] border border-[#263045] p-8 rounded-2xl shadow-2xl relative">
              <div className="flex items-center gap-3 mb-6 border-b border-[#263045] pb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-900/30">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Form Request Divisi</h2>
                  <p className="text-xs text-slate-400">Pengajuan aset kreatif MM Hub lintas divisi</p>
                </div>
              </div>
              
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Nama & Divisi Pemohon <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rudi (Marketing Div)"
                    value={requestDraft.pemohon}
                    onChange={(e) => setRequestDraft(prev => ({ ...prev, pemohon: e.target.value }))}
                    className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Kebutuhan</label>
                    <select
                      value={requestDraft.jenisKebutuhan}
                      onChange={(e) => setRequestDraft(prev => ({ ...prev, jenisKebutuhan: e.target.value }))}
                      className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition"
                    >
                      <option value="Desain Grafis">Desain Grafis</option>
                      <option value="Video Pendek">Video Pendek</option>
                      <option value="Syuting / Liputan Event">Syuting / Liputan Event</option>
                      <option value="Print Banner">Print Banner</option>
                      <option value="Materi Sosmed">Materi Sosmed</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Deadline Diminta <span className="text-red-400">*</span></label>
                    <input
                      type="date"
                      required
                      value={requestDraft.deadlinePemohon}
                      onChange={(e) => setRequestDraft(prev => ({ ...prev, deadlinePemohon: e.target.value }))}
                      className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition"
                    />
                  </div>
                </div>

                {requestDraft.jenisKebutuhan === 'Syuting / Liputan Event' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0A0D14]/50 p-4 rounded-xl border border-[#263045] animate-slide-in">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Waktu Acara <span className="text-red-400">*</span></label>
                      <input
                        type="datetime-local"
                        required={requestDraft.jenisKebutuhan === 'Syuting / Liputan Event'}
                        value={requestDraft.eventDate}
                        onChange={(e) => setRequestDraft(prev => ({ ...prev, eventDate: e.target.value }))}
                        className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Lokasi <span className="text-red-400">*</span></label>
                      <input
                        type="text"
                        placeholder="Cth: Gedung A"
                        required={requestDraft.jenisKebutuhan === 'Syuting / Liputan Event'}
                        value={requestDraft.eventLocation}
                        onChange={(e) => setRequestDraft(prev => ({ ...prev, eventLocation: e.target.value }))}
                        className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Project / Judul <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Desain Baliho Promo Nusafarm"
                    value={requestDraft.namaProject}
                    onChange={(e) => setRequestDraft(prev => ({ ...prev, namaProject: e.target.value }))}
                    className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Headline <span className="text-zinc-600">(Opsional)</span></label>
                  <input
                    type="text"
                    placeholder="Contoh: Promo Spesial Akhir Tahun!"
                    value={requestDraft.headline}
                    onChange={(e) => setRequestDraft(prev => ({ ...prev, headline: e.target.value }))}
                    className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Referensi Visual <span className="text-zinc-600">(Opsional)</span></label>
                  <input
                    type="text"
                    placeholder="Link Drive / Referensi Desain"
                    value={requestDraft.referensiVisual}
                    onChange={(e) => setRequestDraft(prev => ({ ...prev, referensiVisual: e.target.value }))}
                    className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Informasi Wajib di Desain <span className="text-zinc-600">(Opsional)</span></label>
                  <textarea
                    rows="2"
                    placeholder="Contoh: Logo harus ada, warna dominan merah"
                    value={requestDraft.infoWajib}
                    onChange={(e) => setRequestDraft(prev => ({ ...prev, infoWajib: e.target.value }))}
                    className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Brief Visual Tambahan</label>
                  <textarea
                    rows="4"
                    placeholder="Tuliskan ukuran, referensi warna, pesan utama, dll..."
                    value={requestDraft.briefVisual}
                    onChange={(e) => setRequestDraft(prev => ({ ...prev, briefVisual: e.target.value }))}
                    className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition resize-none"
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
            
            {/* 2. Kotak Saran & Kritik */}
            <div className="bg-[#131824] border border-[#263045] p-6 rounded-2xl shadow-2xl relative">
              <div className="flex items-center gap-3 mb-4 border-b border-[#263045] pb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">Kotak Saran & Kritik</h3>
                  <p className="text-[10px] text-slate-400">Masukan Anda membantu kami berkembang</p>
                </div>
              </div>
              <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                <textarea
                  rows="3"
                  placeholder="Tuliskan saran, kritik, atau ide untuk tim MM Hub..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-[#0A0D14] border border-[#263045] focus:border-emerald-500 focus:outline-none rounded-lg p-3 text-sm text-slate-100 transition resize-none"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#1D2536] hover:bg-zinc-700 text-slate-300 hover:text-white font-bold py-2.5 rounded-xl text-xs transition border border-[#33415E]"
                >
                  Kirim Saran Tertutup
                </button>
              </form>
            </div>

          </div>

          {/* KOLOM KANAN: Daftar Antrean */}
          <div className="lg:col-span-7 bg-[#131824] border border-[#263045] p-8 rounded-2xl shadow-2xl relative flex flex-col h-[85vh]">
            <div className="flex items-center gap-3 mb-6 border-b border-[#263045] pb-4 shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-900/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Status & Antrean</h2>
                <p className="text-xs text-slate-400">Pantau progres request yang sedang dikerjakan</p>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col xl:flex-row gap-6 pr-2">
              
              {/* KOLOM KIRI: Antrean */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center justify-between border-b border-[#263045] pb-2">
                  <span>Antrean Request</span>
                  <span className="text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-full">{requests.filter(r => r.status === 'Review & Antrean').length}</span>
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                  {requests.filter(r => r.status === 'Review & Antrean').length === 0 ? (
                    <div className="text-center text-slate-1000 text-xs py-10">Antrean kosong.</div>
                  ) : (
                    requests.filter(r => r.status === 'Review & Antrean').map(req => (
                      <div key={req.no} className="bg-[#0A0D14] border border-[#263045]/50 p-4 rounded-xl flex flex-col justify-between gap-4 hover:border-[#33415E] transition">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-slate-1000 px-2 py-0.5 rounded bg-[#131824]">REQ-{req.no}</span>
                            <span className="font-bold text-sm text-slate-200">{req.namaProject}</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-2">
                            <span className="text-slate-1000">Pemohon:</span> {req.pemohon} <span className="mx-1 text-zinc-700">|</span> <span className="text-slate-1000">Tipe:</span> {req.jenisKebutuhan}
                          </p>
                          <div className="text-[10px] text-slate-1000 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Target: {new Date(req.deadlinePemohon).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <span className="text-[10px] font-bold px-3 py-1.5 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20">{req.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* KOLOM KANAN: Proses & Selesai */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center justify-between border-b border-[#263045] pb-2">
                  <span>Sedang Dikerjakan</span>
                  <span className="text-[10px] bg-blue-500/10 px-2 py-0.5 rounded-full">{requests.filter(r => r.status === 'Proses Desain' || r.status === 'QC & Revisi Divisi' || r.status === 'Selesai').length}</span>
                </h3>
                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                  {requests.filter(r => r.status === 'Proses Desain' || r.status === 'QC & Revisi Divisi' || r.status === 'Selesai').length === 0 ? (
                    <div className="text-center text-slate-1000 text-xs py-10">Belum ada request yang sedang dikerjakan.</div>
                  ) : (
                    requests.filter(r => r.status === 'Proses Desain' || r.status === 'QC & Revisi Divisi' || r.status === 'Selesai').map(req => (
                      <div key={req.no} className="bg-[#0A0D14] border border-[#263045]/50 p-4 rounded-xl flex flex-col justify-between gap-4 hover:border-[#33415E] transition">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-bold text-slate-1000 px-2 py-0.5 rounded bg-[#131824]">REQ-{req.no}</span>
                            <span className="font-bold text-sm text-slate-200">{req.namaProject}</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-2">
                            <span className="text-slate-1000">Pemohon:</span> {req.pemohon} <span className="mx-1 text-zinc-700">|</span> <span className="text-slate-1000">Tipe:</span> {req.jenisKebutuhan}
                          </p>
                          <div className="text-[10px] text-slate-1000 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Target: {new Date(req.deadlinePemohon).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                          </div>
                        </div>
                        <div className="flex flex-col items-start justify-between mt-3 xl:mt-0">
                          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${
                            req.status === 'Proses Desain' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            req.status === 'QC & Revisi Divisi' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            {req.status}
                          </span>
                          
                          {req.pic && (
                            <div className="text-[10px] text-slate-400 mt-3 flex items-center gap-1.5 bg-[#131824] px-2.5 py-1 rounded-md">
                              PIC: <span className="font-bold text-slate-300">{req.pic}</span>
                            </div>
                          )}
                          
                          {req.linkHasilAkhir && req.status === 'Selesai' && (
                            <a href={req.linkHasilAkhir} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline mt-2 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Lihat Hasil
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

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
      <div className="min-h-screen bg-[#0A0D14] flex items-center justify-center text-white p-4 font-sans selection:bg-violet-600">
        <div className="bg-[#131824] border border-[#263045] p-8 rounded-2xl max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-900/30">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold mb-2 tracking-tight">MM HUB</h1>
          <p className="text-sm text-slate-400 mb-8">Login untuk mengakses Control Panel SPV</p>
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white text-zinc-900 hover:bg-zinc-200 font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 mb-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Masuk dengan Google
          </button>
          <button 
            onClick={() => setBypassAuth(true)}
            className="w-full bg-[#1D2536] text-slate-400 hover:text-slate-200 hover:bg-zinc-700 font-medium py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
          >
            Bypass Login (Mode Dev)
          </button>
          {/* (Modal removed from here) */}
        </div>
      </div>
    );
  }
  
  const renderRequestCard = (req) => {
    const estDateObj = new Date(req.estimasiSelesai);
                            const diffDays = Math.ceil((estDateObj.getTime() - BENCHMARK_DATE.getTime()) / (1000 * 60 * 60 * 24));
                            const isUrgent = diffDays < 3 && req.status === 'Review & Antrean';

                            return (
                              <div
                                key={req.no}
                                onClick={() => setViewRequestDetail(req)}
                                className={`bg-[#131824] hover:bg-[#1D2536]/80 border p-4 rounded-xl transition cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden ${
                                  isUrgent ? 'border-amber-500/40 shadow-lg shadow-amber-950/10' : 'border-[#263045]'
                                }`}
                              >
                                {isUrgent && (
                                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-amber-500" />
                                )}

                                <div>
                                  <div className="flex justify-between items-center text-[9px] mb-2">
                                    <span className="font-mono bg-[#0A0D14] px-2 py-0.5 rounded border border-[#263045] text-slate-400">
                                      {req.no}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded font-bold ${isUrgent ? 'bg-amber-500/10 text-amber-400' : 'bg-[#1D2536] text-slate-400'}`}>
                                      {diffDays < 0 ? 'TERLAMBAT' : `Sisa ${diffDays} Hari`}
                                    </span>
                                  </div>

                                  <h4 className="text-sm font-bold text-slate-200 leading-snug">{req.namaProject}</h4>
                                  
                                  <div className="mt-2 text-[11px] text-slate-400 space-y-1">
                                    <p><strong className="text-slate-1000">Kebutuhan:</strong> {req.jenisKebutuhan}</p>
                                    <div className="flex items-center flex-wrap gap-2">
                                      <p><strong className="text-slate-1000">Pemohon:</strong> <span className="text-slate-300 font-semibold">{req.pemohon}</span></p>
                                      {req.pemohon === 'Supervisor' ? (
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">TUGAS SPV</span>
                                      ) : (
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">REQ DIVISI</span>
                                      )}
                                    </div>
                                    <p><strong className="text-slate-1000">PIC Desainer:</strong> {req.pic}</p>
                                  </div>
                                </div>

                                {/* Detailed sequential pipeline actions for requests */}
                                <div className="pt-3 border-t border-[#263045]/80 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                                  
                                  {req.status === 'Review & Antrean' && (
                                    <>
                                      {assigningRequestId === req.no ? (
                                        <div className="space-y-2 bg-[#0A0D14] p-2 rounded border border-[#263045]">
                                          <label className="text-[9px] font-bold text-slate-400 block uppercase">Pilih PIC Kreator:</label>
                                          <select 
                                            value={tempPic} 
                                            onChange={(e) => setTempPic(e.target.value)}
                                            className="w-full bg-[#131824] border border-[#33415E] rounded p-1 text-[11px] text-slate-100 mb-1"
                                          >
                                            {CREATORS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                          </select>
                                          <label className="text-[9px] font-bold text-slate-400 block uppercase mt-1">Estimasi Selesai (Tim Mulmed):</label>
                                          <input 
                                            type="date"
                                            value={tempEstimasiMulmed}
                                            onChange={(e) => setTempEstimasiMulmed(e.target.value)}
                                            className="w-full bg-[#131824] border border-[#33415E] rounded p-1 text-[11px] text-slate-100"
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
                                              className="bg-[#1D2536] hover:bg-zinc-700 text-slate-300 text-[10px] px-2 py-1 rounded"
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
                                      className="w-full bg-[#0A0D14] hover:bg-blue-950/40 hover:text-blue-400 text-slate-300 border border-[#263045] rounded-lg py-1.5 text-xs font-bold transition"
                                    >
                                      Selesai Edit & Ajukan QC Divisi ➔
                                    </button>
                                  )}

                                  {req.status === 'QC & Revisi Divisi' && (
                                    <>
                                      {deliveryRequestId === req.no ? (
                                        <div className="space-y-2 bg-[#0A0D14] p-2 rounded border border-[#263045]">
                                          <label className="text-[9px] font-bold text-slate-400 block uppercase">Link Hasil Akhir (G-Drive/Figma):</label>
                                          <input 
                                            type="url"
                                            required
                                            placeholder="https://drive.google.com/..."
                                            value={tempDeliverableLink}
                                            onChange={(e) => setTempDeliverableLink(e.target.value)}
                                            className="w-full bg-[#131824] border border-[#33415E] rounded p-1 text-[11px] text-slate-100"
                                          />
                                          <div className="flex flex-col gap-2 mt-2">
                                            <button 
                                              onClick={async () => {
                                                if (!tempDeliverableLink || tempDeliverableLink === 'https://drive.google.com/file/d/project-asset-link/view') {
                                                  triggerToast('Mohon lampirkan Link Hasil Akhir yang valid.', 'error');
                                                  return;
                                                }
                                                await completeRequestWithLink(req.no);
                                                const text = encodeURIComponent(`Halo ${req.pemohon}, request divisi untuk project "${req.namaProject}" sudah selesai dikerjakan! 🎉\n\nBerikut link hasilnya:\n${tempDeliverableLink}\n\nTerima kasih!`);
                                                window.open(`https://wa.me/?text=${text}`, '_blank');
                                              }}
                                              className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white text-[10px] font-bold py-2 rounded flex items-center justify-center gap-1.5 transition shadow-lg shadow-[#25D366]/20"
                                            >
                                              ✅ Kirim Aset & Share WA
                                            </button>
                                            <div className="flex gap-1.5">
                                              <button 
                                                onClick={() => completeRequestWithLink(req.no)}
                                                className="flex-1 bg-[#1D2536] hover:bg-zinc-700 text-slate-300 border border-[#33415E] text-[10px] font-bold py-1.5 rounded transition"
                                              >
                                                Kirim Saja
                                              </button>
                                              <button 
                                                onClick={() => setDeliveryRequestId(null)}
                                                className="bg-red-950/50 hover:bg-red-900 text-red-400 border border-red-900/50 text-[10px] px-3 py-1.5 rounded font-bold transition"
                                              >
                                                Batal
                                              </button>
                                            </div>
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
                                        className="text-slate-1000 hover:text-red-400 transition"
                                      >
                                        Hapus
                                      </button>
                                    </div>
                                  )}

                                </div>

                              </div>
                            );
  };
  const pendingRequestsCount = requests.filter(r => r.status === 'Review & Antrean').length;
  const myJobdeskCount = requests.filter(r => r.status === 'Proses Desain').length + contentCards.filter(c => c.stage !== 'Publish').length;

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 font-sans flex flex-col md:flex-row antialiased overflow-x-hidden selection:bg-violet-600 selection:text-white">
      
      {/* Toast Overlay */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in flex items-center gap-3 bg-[#131824] border border-[#263045] p-4 rounded-xl shadow-2xl max-w-sm">
          <div className={`w-3 h-3 rounded-full ${toast.type === 'error' ? 'bg-red-500 shadow-red-500/50' : toast.type === 'warning' ? 'bg-amber-500 shadow-amber-500/50' : 'bg-emerald-500 shadow-emerald-500/50'} shadow-lg`} />
          <span className="text-sm font-medium text-slate-200">{toast.message}</span>
        </div>
      )}

      {/* QC SPV Overlay Modal for Social Media */}
      {qcModalCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#131824] border border-[#263045] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#263045]/80 flex justify-between items-start">
              <div>
                <span className={`text-xs uppercase font-extrabold tracking-widest ${qcModalCard.stage === 'Manager' ? 'text-fuchsia-400' : 'text-violet-400'}`}>
                  {qcModalCard.stage === 'Manager' ? 'Approval Manager Audit' : 'Quality Control Audit'}
                </span>
                <h3 className="text-xl font-bold mt-1 text-slate-100\">Review: {qcModalCard.title}</h3>
              </div>
              <button onClick={() => setQcModalCard(null)} className="p-1 rounded-lg hover:bg-[#1D2536] text-slate-400 transition">✕</button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-[#0A0D14]/60 p-3 rounded-lg border border-[#263045]">
                  <span className="text-slate-1000 block text-xs">Penanggung Jawab</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{qcModalCard.assignee}</span>
                </div>
                <div className="bg-[#0A0D14]/60 p-3 rounded-lg border border-[#263045]">
                  <span className="text-slate-1000 block text-xs">Revisi Terkumpul</span>
                  <span className="font-bold text-amber-400 mt-0.5 block">{qcModalCard.revisionCount}</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 bg-[#0A0D14]/60 p-4 rounded-lg border border-[#263045] italic">
                "{qcModalCard.notes || 'Belum ada instruksi tambahan.'}"
              </p>
            </div>

            <div className="p-6 border-t border-[#263045]/80 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Catatan Revisi {qcModalCard.stage === 'Manager' ? 'Manager' : 'SPV'} (Wajib jika minta revisi)</label>
                <textarea
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Ketik bagian mana yang perlu diperbaiki oleh editor..."
                  rows={3}
                  className="w-full bg-[#0A0D14] border border-[#263045] rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-red-500/50 resize-none"
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleQcApproval(false)}
                  className="flex-1 bg-[#131824] hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/50 border border-[#263045] text-slate-300 font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
                >
                  ✕ Minta Revisi (+1)
                </button>
                <button
                  onClick={() => handleQcApproval(true)}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  ✓ {qcModalCard.stage === 'Manager' ? 'Setujui & Jadwalkan' : 'Teruskan ke Manager'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SM Content Detail Viewer Modal */}
      {viewDetailCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131824] border border-[#263045] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-md border ${BRANDS.find(b => b.id === viewDetailCard.brand)?.color || 'border-[#33415E]'}`}>
                {BRANDS.find(b => b.id === viewDetailCard.brand)?.name}
              </span>
              <button onClick={() => setViewDetailCard(null)} className="text-slate-400 hover:text-slate-200 text-lg">✕</button>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-3">{viewDetailCard.title}</h3>
            
            <div className="space-y-2 text-sm text-slate-300">
              <p><strong className="text-slate-1000">Platform:</strong> {viewDetailCard.platform}</p>
              <p><strong className="text-slate-1000">Kreator:</strong> {viewDetailCard.assignee}</p>
              <p><strong className="text-slate-1000">Target Tanggal:</strong> {viewDetailCard.date}</p>
              <p><strong className="text-slate-1000">Status Internal:</strong> {viewDetailCard.status}</p>
              <p><strong className="text-slate-1000">Total Revisi:</strong> {viewDetailCard.revisionCount}</p>
              <div className="bg-[#0A0D14] p-3 rounded-lg border border-[#263045] mt-2">
                <span className="text-[10px] text-slate-1000 uppercase block font-bold mb-1">Catatan Deskripsi</span>
                <p className="text-xs italic">"{viewDetailCard.notes || 'Tidak ada deskripsi tambahan.'}"</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {}
      {viewRequestDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131824] border border-[#263045] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono bg-[#1D2536] text-slate-400 px-2 py-1 rounded border border-[#33415E]">
                  {viewRequestDetail.no}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mt-2">{viewRequestDetail.namaProject}</h3>
              </div>
              <button onClick={() => setViewRequestDetail(null)} className="text-slate-400 hover:text-slate-200 text-lg">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs border-y border-[#263045]/80 py-3">
              <div>
                <span className="text-slate-1000 block">Tanggal Request</span>
                <span className="text-slate-200 font-medium">{viewRequestDetail.tanggalRequest}</span>
              </div>
              <div>
                <span className="text-slate-1000 block">Nama & Divisi Pemohon</span>
                <span className="text-slate-200 font-medium">{viewRequestDetail.pemohon}</span>
              </div>
              <div>
                <span className="text-slate-1000 block">Jenis Kebutuhan</span>
                <span className="text-slate-200 font-medium">{viewRequestDetail.jenisKebutuhan}</span>
              </div>
              <div>
                <span className="text-slate-1000 block">Deadline Pemohon</span>
                <span className="text-amber-400 font-bold">{viewRequestDetail.deadlinePemohon || viewRequestDetail.estimasiSelesai}</span>
              </div>
              <div>
                <span className="text-slate-1000 block">Estimasi Mulmed</span>
                <span className="text-emerald-400 font-bold">{viewRequestDetail.estimasiMulmed || 'Belum Diestimasi'}</span>
              </div>
              <div>
                <span className="text-slate-1000 block">PIC Desainer / Editor</span>
                <span className="text-slate-200 font-medium">{viewRequestDetail.pic}</span>
              </div>
              <div>
                <span className="text-slate-1000 block">Status Tahapan</span>
                <span className="text-amber-400 font-semibold">{viewRequestDetail.status}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-1000 font-bold block">Brief Visual</span>
              <p className="text-xs text-slate-300 bg-[#0A0D14] p-3 rounded-lg border border-[#263045]/80 leading-relaxed">
                {viewRequestDetail.briefVisual}
              </p>
            </div>

            {viewRequestDetail.linkHasilAkhir && (
              <div className="bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">Serah Terima Selesai</span>
                  <span className="text-xs text-slate-400 block mt-0.5 truncate">{viewRequestDetail.linkHasilAkhir}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a 
                    href={viewRequestDetail.linkHasilAkhir} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-[#1D2536] hover:bg-zinc-700 text-slate-300 text-[10px] px-3 py-1.5 rounded-lg transition font-bold whitespace-nowrap"
                  >
                    Buka Link
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Halo ${viewRequestDetail.pemohon}, request divisi untuk project "${viewRequestDetail.namaProject}" sudah selesai dikerjakan! 🎉\n\nBerikut link hasilnya:\n${viewRequestDetail.linkHasilAkhir}\n\nTerima kasih!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-3 py-1.5 rounded-lg transition font-bold whitespace-nowrap flex items-center gap-1.5"
                  >
                    Share WA
                  </a>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <div>
                {viewRequestDetail.pic && viewRequestDetail.status !== 'Selesai' && (
                  <button 
                    onClick={() => unassignRequest(viewRequestDetail.no)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs px-4 py-2 rounded-lg transition font-bold"
                  >
                    Batalkan Penugasan
                  </button>
                )}
              </div>
              <button 
                onClick={() => setViewRequestDetail(null)}
                className="bg-[#1D2536] hover:bg-zinc-700 text-slate-200 text-xs px-4 py-2 rounded-lg transition"
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

      <aside className="w-full md:w-64 bg-[#131824] border-b md:border-b-0 md:border-r border-[#263045] flex flex-col shrink-0">
        
        <div className="p-6 border-b border-[#263045]">
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
          
          <div className="mt-6 bg-[#0A0D14]/60 p-3 rounded-xl border border-[#263045]/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow overflow-hidden">
                  {session?.user?.user_metadata?.avatar_url ? (
                    <img src={session.user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    'U'
                  )}
                </div>
                {myJobdeskCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 border border-zinc-900 rounded-full"></span>
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-100 block truncate">
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
              className="text-slate-1000 hover:text-red-400 p-1.5 rounded-lg hover:bg-[#131824] transition"
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
                : 'text-slate-400 hover:bg-[#1D2536]/40 hover:text-slate-100'
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
                : 'text-slate-400 hover:bg-[#1D2536]/40 hover:text-slate-100'
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
                  ? 'bg-[#1D2536]/80 text-slate-100'
                  : 'text-slate-400 hover:bg-[#1D2536]/40 hover:text-slate-100'
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
              <div className="mt-2 ml-4 pl-4 border-l border-[#263045] space-y-1">
                {PIPELINE_STAGES.map(stage => {
                  const isActive = activeSubTab === stage.key;
                  return (
                    <button
                      key={stage.key}
                      onClick={() => setActiveSubTab(stage.key)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                        isActive 
                          ? 'bg-violet-950/40 text-violet-300 border-l-2 border-violet-500' 
                          : 'text-slate-1000 hover:text-slate-300 hover:bg-[#131824]/50 border-l-2 border-transparent'
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
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'jobdesk-pribadi'
                ? 'bg-gradient-to-r from-pink-950/60 to-zinc-900 text-pink-300 border-l-4 border-pink-500'
                : 'text-slate-400 hover:bg-[#1D2536]/40 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Jobdesk Pribadi</span>
            </div>
            {myJobdeskCount > 0 && (
              <span className="bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-pink-900/50">
                {myJobdeskCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('request-divisi')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'request-divisi'
                ? 'bg-gradient-to-r from-amber-950/60 to-zinc-900 text-amber-300 border-l-4 border-amber-500'
                : 'text-slate-400 hover:bg-[#1D2536]/40 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Request Divisi</span>
            </div>
            {pendingRequestsCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-amber-900/50 animate-pulse">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('control-center')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'control-center'
                ? 'bg-gradient-to-r from-violet-950/60 to-zinc-900 text-violet-300 border-l-4 border-violet-500'
                : 'text-slate-400 hover:bg-[#1D2536]/40 hover:text-slate-100'
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
                : 'text-slate-400 hover:bg-[#1D2536]/40 hover:text-slate-100'
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
                : 'text-slate-400 hover:bg-[#1D2536]/40 hover:text-slate-100'
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
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#131824]/50'
            }`}
          >
            <Calculator className="w-5 h-5 shrink-0" />
            Kalkulator KPI
          </button>
          
          <button
            onClick={() => setActiveTab('saran-kritik')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'saran-kritik'
                ? 'bg-gradient-to-r from-emerald-950/60 to-zinc-900 text-emerald-300 border-l-4 border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#131824]/50'
            }`}
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            Saran & Kritik
          </button>

          <button
            onClick={() => setActiveTab('arsip')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'arsip'
                ? 'bg-gradient-to-r from-zinc-800 to-zinc-900 text-slate-300 border-l-4 border-zinc-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#131824]/50'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Menu Arsip
          </button>
        </nav>

        <div className="p-4 border-t border-[#263045]/80 bg-[#0A0D14]/30 text-xs text-slate-1000 space-y-2">
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
      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0D14]">
        
        {/* Dynamic header navigation */}
        <header className="border-b border-zinc-900 bg-[#131824]/40 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {activeTab === 'beranda' ? 'Quick Action Dashboard' : activeTab === 'jobdesk-pribadi' ? 'Jobdesk Harian Eksekutor' : activeTab === 'pabrik-konten' ? 'Pabrik Konten (Organic Social Media)' : activeTab === 'request-divisi' ? 'Papan Request Divisi' : activeTab === 'daily-checkin' ? 'Morning Briefing & Absensi' : activeTab === 'disciplinary' ? 'Review & Surat Komitmen' : activeTab === 'kpi-kalkulator' ? 'Kalkulator KPI (Group & Individu)' : 'KPI Control Center SPV'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
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
            <span className="text-slate-1000">Filter Akun:</span>
            <select 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-[#0A0D14] border border-[#263045] text-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:border-violet-500 cursor-pointer max-w-[200px]"
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
                        <div className={`p-6 rounded-2xl border ${editingCount > 0 ? 'bg-amber-950/20 border-amber-500/30' : 'bg-[#131824]/40 border-[#263045]'}`}>
                          <div className="text-3xl mb-3">{editingCount > 0 ? '👀' : '✅'}</div>
                          <h3 className={`text-lg font-bold ${editingCount > 0 ? 'text-amber-400' : 'text-slate-1000'}`}>Review QC Konten</h3>
                          <p className="text-xs text-slate-400 mt-1 mb-4">
                            {editingCount > 0 ? `Ada ${editingCount} konten di tahap Editing menunggu review QC Anda.` : 'Tidak ada draf yang butuh review QC.'}
                          </p>
                          {editingCount > 0 && (
                            <button onClick={() => { setActiveTab('pabrik-konten'); setActiveSubTab('Editing'); }} className="text-xs font-bold text-amber-500 hover:text-amber-400 underline">
                              Review Sekarang ➔
                            </button>
                          )}
                        </div>

                        <div className={`p-6 rounded-2xl border ${absentCount > 0 ? 'bg-red-950/20 border-red-500/30' : 'bg-[#131824]/40 border-[#263045]'}`}>
                          <div className="text-3xl mb-3">{absentCount > 0 ? '🚨' : '✅'}</div>
                          <h3 className={`text-lg font-bold ${absentCount > 0 ? 'text-red-400' : 'text-slate-1000'}`}>Kehadiran Tim</h3>
                          <p className="text-xs text-slate-400 mt-1 mb-4">
                            {absentCount > 0 ? `Terdapat ${absentCount} orang yang belum melakukan Check-in absen pagi hari ini.` : 'Seluruh anggota tim sudah absen hari ini.'}
                          </p>
                          {absentCount > 0 && (
                            <button onClick={() => setActiveTab('daily-checkin')} className="text-xs font-bold text-red-500 hover:text-red-400 underline">
                              Lihat Tracker ➔
                            </button>
                          )}
                        </div>

                        <div className={`p-6 rounded-2xl border ${urgentRequests > 0 ? 'bg-blue-950/20 border-blue-500/30' : 'bg-[#131824]/40 border-[#263045]'}`}>
                          <div className="text-3xl mb-3">{urgentRequests > 0 ? '🔥' : '✅'}</div>
                          <h3 className={`text-lg font-bold ${urgentRequests > 0 ? 'text-blue-400' : 'text-slate-1000'}`}>SLA Request Divisi</h3>
                          <p className="text-xs text-slate-400 mt-1 mb-4">
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
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#263045] pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="p-1.5 rounded bg-violet-600/10 text-violet-400 text-sm">🎬</span>
                      Pabrik Konten (Organic Social Media)
                    </h3>
                    <p className="text-xs text-slate-1000 mt-0.5">Alur berjenjang internal multimedia untuk merencanakan dan menerbitkan konten organic.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-lg bg-[#0A0D14] p-1 border border-[#263045]">
                      <button
                        onClick={() => setPabrikViewMode('pipeline')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                          pabrikViewMode === 'pipeline' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Workflow Pipeline
                      </button>
                      <button
                        onClick={() => setPabrikViewMode('calendar')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition ${
                          pabrikViewMode === 'calendar' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-slate-200'
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
                <div className="bg-[#131824]/30 border border-[#263045]/50 rounded-2xl p-4 w-full">
                  <h4 className="text-[10px] font-bold text-slate-1000 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                    Content Radar (18 Akun Aktif)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-2">
                    {BRANDS.filter(b => b.id !== 'all').map(brand => {
                      const count = contentCards.filter(c => c.brand === brand.id || c.collaborator === brand.id).length;
                      const isZero = count === 0;
                      return (
                        <div key={brand.id} className={`flex flex-col p-2.5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${isZero ? 'bg-red-950/20 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.05)] hover:border-red-500/50' : 'bg-[#0A0D14]/60 border-[#263045] hover:border-violet-500/50 hover:bg-[#131824]'}`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className={`shrink-0 w-1.5 h-1.5 rounded-full ${isZero ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]'}`} />
                            <span className={`text-sm font-black leading-none ${isZero ? 'text-red-400' : 'text-slate-100'}`}>{count}</span>
                          </div>
                          <span className={`text-[9px] font-semibold leading-tight line-clamp-2 ${isZero ? 'text-red-300' : 'text-slate-400'}`} title={brand.name}>
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
                    <div className="flex bg-[#131824]/40 p-1.5 rounded-xl border border-[#263045]/60 overflow-x-auto no-scrollbar">
                      {PIPELINE_STAGES.map(stage => (
                        <button
                          key={stage.key}
                          onClick={() => setActiveSubTab(stage.key)}
                          className={`flex-1 flex flex-col items-center justify-center p-3 rounded-lg min-w-[120px] transition-all duration-300 relative ${
                            activeSubTab === stage.key
                              ? 'bg-[#1D2536] shadow-md text-white transform scale-[1.02] border border-[#33415E]/50'
                              : 'text-slate-1000 hover:text-slate-300 hover:bg-[#1D2536]/40'
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
                    <div className="bg-[#131824]/20 border border-zinc-900 rounded-2xl p-6 min-h-[220px]">
                      {filteredContentCards.filter(c => c.stage === activeSubTab).length === 0 ? (
                        <div className="py-12 text-center text-slate-1000 text-xs">
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
                                className="group bg-[#131824] hover:bg-[#1D2536]/80 border border-[#263045] rounded-xl p-4 transition-all duration-200 relative flex flex-col justify-between space-y-4 cursor-pointer"
                              >
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border truncate max-w-[120px] ${brandObj?.color || 'border-[#33415E]'}`}>
                                      {brandObj?.name || card.brand}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <button onClick={(e) => { e.stopPropagation(); deleteContentCard(card.id); }} className="opacity-0 group-hover:opacity-100 p-1 text-slate-1000 hover:text-red-400 transition bg-[#1D2536] rounded" title="Batalkan/Hapus Konten">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                      </button>
                                      <button onClick={(e) => { e.stopPropagation(); openEditContentModal(card); }} className="opacity-0 group-hover:opacity-100 p-1 text-slate-1000 hover:text-white transition bg-[#1D2536] rounded" title="Edit Konten">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                      </button>
                                      <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/30">
                                        {card.format || 'Reels / Video'}
                                      </span>
                                      <span className="text-[10px] text-slate-400 bg-[#0A0D14] px-2 py-0.5 rounded border border-[#263045] font-medium">{card.platform}</span>
                                    </div>
                                  </div>
                                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white leading-snug">{card.title}</h4>
                                  {card.collaborator && (
                                    <div className="mt-1.5 flex items-center gap-1 text-[9px] font-bold text-violet-400 bg-violet-950/20 px-1.5 py-0.5 rounded w-fit border border-violet-900/30">
                                      🤝 Collab: {BRANDS.find(b => b.id === card.collaborator)?.name || card.collaborator}
                                    </div>
                                  )}
                                  <p className="text-xs text-slate-1000 line-clamp-2 mt-1">{card.notes}</p>
                                </div>

                                <div className="pt-3 border-t border-[#263045]/60 flex justify-between items-center text-[11px]" onClick={e => e.stopPropagation()}>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded-full bg-[#1D2536] text-slate-300 font-extrabold flex items-center justify-center text-[9px]">
                                      {card.assignee.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="text-slate-400">{card.assignee.split(' ')[0]}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="bg-[#1D2536] text-slate-400 px-1.5 py-0.5 rounded text-[9px] font-bold">REV: {card.revisionCount}</span>
                                    <span className="text-slate-1000">{card.date}</span>
                                  </div>
                                </div>

                                <div className="pt-2" onClick={e => e.stopPropagation()}>
                                  {activeSubTab === 'Ide' && (
                                    <button
                                      onClick={() => advancePipelineStage(card.id, 'Ide')}
                                      className="w-full bg-[#0A0D14] hover:bg-violet-950/40 hover:text-violet-400 text-slate-300 border border-[#263045] rounded-lg py-2 text-xs font-bold transition"
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
                                        className="w-full bg-[#0A0D14] hover:bg-[#1D2536] text-slate-300 border border-[#263045] rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5"
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
                                      Selesai Edit & Ajukan QC SPV
                                    </button>
                                  )}
                                  {activeSubTab === 'Manager' && (
                                    <button
                                      onClick={() => advancePipelineStage(card.id, 'Manager')}
                                      className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white rounded-lg py-2 text-xs font-extrabold transition shadow"
                                    >
                                      Review Approval Manager 👑
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
                  <div className="bg-[#131824]/40 border border-[#263045] rounded-2xl p-6">
                    <div className="grid grid-cols-7 gap-1 bg-[#1D2536] border border-[#263045] rounded-xl overflow-hidden">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="bg-[#131824] p-2 text-center text-xs font-bold text-slate-400 border-b border-[#263045]">{day}</div>
                      ))}
                      {(() => {
                        const now = new Date();
                        const year = now.getFullYear();
                        const month = now.getMonth();
                        const daysInMonth = new Date(year, month + 1, 0).getDate();
                        const firstDayOfWeek = new Date(year, month, 1).getDay();
                        
                        const blanks = Array.from({ length: firstDayOfWeek }).map((_, i) => (
                          <div key={`empty-${i}`} className="bg-[#0A0D14]/20 p-2 min-h-[80px] border-r border-b border-[#263045]/40" />
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
                              className={`p-2 min-h-[90px] bg-[#0A0D14]/60 border-r border-b border-[#263045] flex flex-col justify-between cursor-pointer hover:bg-[#1D2536]/40 transition relative ${isToday ? 'ring-1 ring-inset ring-indigo-500/50 bg-indigo-950/20' : ''}`}
                            >
                              {isToday && <div className="absolute top-0 right-0 w-full h-0.5 bg-indigo-500"></div>}
                              <div className="flex justify-between items-start">
                                <span className={`text-[10px] font-black ${isToday ? 'bg-indigo-500 text-white px-1.5 py-0.5 rounded-full' : 'text-slate-1000'}`}>
                                  {dayNumber}
                                </span>
                                {isToday && <span className="text-[8px] font-bold text-indigo-300 uppercase tracking-widest mt-0.5">Today</span>}
                              </div>
                              <div className="space-y-1 mt-1">
                                {dayCards.map(card => (
                                  <div 
                                    key={card.id} 
                                    onClick={(e) => { e.stopPropagation(); setViewDetailCard(card); }} 
                                    className="flex flex-col text-[8px] p-1.5 rounded border bg-[#131824] border-[#263045] text-slate-300 hover:text-white hover:border-violet-500 transition"
                                  >
                                    <span className="font-bold text-cyan-400 mb-0.5 border-b border-[#263045] pb-0.5">{card.format || 'Reels / Video'}</span>
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#263045] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="p-1.5 rounded bg-pink-600/10 text-pink-400 text-sm">👤</span>
                    Jobdesk Harian Eksekutor
                  </h3>
                  <p className="text-xs text-slate-1000 mt-0.5">Daftar tugas harian khusus untuk masing-masing PIC.</p>
                </div>
              </div>

              <div className="space-y-12">
                {CREATORS.map(creator => (
                  <div key={creator.name} className="bg-[#0A0D14] border border-[#263045] p-6 rounded-3xl shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[#1D2536] flex items-center justify-center font-black text-pink-400 text-sm border border-[#33415E] shadow-md">
                          {creator.avatar}
                        </div>
                        {(requests.filter(r => r.pic === creator.name && r.status === 'Proses Desain').length + contentCards.filter(c => c.assignee === creator.name && c.stage !== 'Publish').length) > 0 && (
                          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-950 animate-bounce shadow-lg shadow-red-500/50">
                            {requests.filter(r => r.pic === creator.name && r.status === 'Proses Desain').length + contentCards.filter(c => c.assignee === creator.name && c.stage !== 'Publish').length}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span>Jobdesk {creator.name}</span>
                        <span className="text-[10px] text-slate-1000 font-normal">
                          {requests.filter(r => r.pic === creator.name && r.status === 'Proses Desain').length + contentCards.filter(c => c.assignee === creator.name && c.stage !== 'Publish').length} Task Aktif
                        </span>
                      </div>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Kolom Pending / Proses */}
                <div className="bg-[#131824]/30 border border-[#263045] rounded-2xl p-4 flex flex-col min-h-[500px]">
                  <h4 className="text-sm font-bold text-blue-400 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                      Sedang Dikerjakan (Proses)
                    </div>
                  </h4>
                  <form onSubmit={(e) => handleQuickAddJob(e, creator.name)} className="mb-4 flex gap-2">
                    <input 
                      type="text" 
                      name="taskName"
                      required
                      placeholder={`+ Tambah tugas untuk ${creator.name}...`} 
                      className="flex-1 bg-[#0A0D14] border border-[#263045] focus:border-blue-500 focus:outline-none rounded-lg px-3 py-2 text-xs text-slate-100 transition"
                    />
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 rounded-lg text-xs transition">
                      Add
                    </button>
                  </form>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {requests.filter(r => r.pic === creator.name && r.status === 'Proses Desain').map(req => (
                      <div key={req.no} className="bg-[#0A0D14] border border-[#263045] p-4 rounded-xl relative group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono bg-[#131824] px-2 py-0.5 rounded text-slate-400">{req.no}</span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => unassignRequest(req.no)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-1000 hover:text-red-400 transition bg-[#1D2536] rounded" title="Batalkan Penugasan">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <button onClick={() => setEditJobModal(req)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-1000 hover:text-white transition bg-[#1D2536] rounded" title="Edit Jobdesk">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                          </div>
                        </div>
                        <h5 className="text-sm font-bold text-slate-200">{req.namaProject}</h5>
                        <div className="flex items-center flex-wrap gap-2 mt-1 mb-1">
                          <p className="text-xs text-slate-1000">Pemohon: <span className="font-semibold text-slate-400">{req.pemohon}</span></p>
                          {req.pemohon === 'Supervisor' ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">TUGAS SPV</span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">REQ DIVISI</span>
                          )}
                        </div>

                        {req.briefVisual && (
                          <div className="mt-2 bg-[#131824]/50 rounded-lg p-2 border border-[#263045]/80">
                            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                              <strong className="text-slate-1000">Brief:</strong> {req.briefVisual}
                            </p>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setViewRequestDetail(req); }}
                              className="text-[9px] text-blue-400 font-bold hover:text-blue-300 mt-1.5 flex items-center gap-1"
                            >
                              Baca Selengkapnya <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                          </div>
                        )}
                        
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-1000">Deadline Pemohon:</span>
                            <span className="text-amber-400 font-bold">{req.deadlinePemohon || req.estimasiSelesai}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-1000">Estimasi Mulmed:</span>
                            <span className="text-emerald-400 font-bold">{req.estimasiMulmed || req.estimasiSelesai || 'Belum'}</span>
                          </div>
                          {req.deadlinePemohon && req.estimasiMulmed && req.estimasiMulmed > req.deadlinePemohon && (
                            <div className="mt-2 bg-red-950/40 border border-red-900/50 p-1.5 rounded text-[10px] text-red-400 flex items-center gap-1">
                              <span>⚠️</span> Deadline bentrok! Butuh diskusi dengan {req.pemohon}.
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-[#263045] flex flex-col gap-2">
                          <button
                            onClick={() => advanceRequestToQc(req.no)}
                            className="w-full bg-[#131824] hover:bg-blue-950/40 hover:text-blue-400 text-slate-300 border border-[#263045] rounded-lg py-1.5 text-[10px] font-bold transition"
                          >
                            Selesai Edit & Ajukan QC ➔
                          </button>
                          <button
                            onClick={() => unassignRequest(req.no)}
                            className="w-full bg-[#131824] hover:bg-amber-950/40 hover:text-amber-400 text-slate-1000 border border-[#263045] rounded-lg py-1.5 text-[10px] font-bold transition"
                          >
                            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                            Kembalikan ke Antrean
                          </button>
                        </div>
                      </div>
                    ))}
                    {contentCards.filter(c => c.assignee === creator.name && c.stage !== 'Publish').map(card => (
                      <div key={`cc-${card.id}`} className="bg-[#0A0D14] border border-violet-900/40 p-4 rounded-xl relative group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono bg-violet-900/30 px-2 py-0.5 rounded text-violet-400">{card.id}</span>
                          <button 
                            onClick={() => { setActiveTab('pabrik-konten'); setActiveSubTab(card.stage); }} 
                            className="text-[9px] bg-[#1D2536] hover:bg-zinc-700 text-slate-300 px-2 py-1 rounded transition flex items-center gap-1"
                          >
                            Buka di Pabrik
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </button>
                        </div>
                        <h5 className="text-sm font-bold text-slate-200">{card.title}</h5>
                        <div className="flex items-center flex-wrap gap-2 mt-1 mb-1">
                          <p className="text-xs text-slate-1000">Platform: <span className="font-semibold text-slate-400">{card.platform}</span></p>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">
                            PABRIK KONTEN
                          </span>
                        </div>

                        {card.notes && (
                          <div className="mt-2 bg-[#131824]/50 rounded-lg p-2 border border-[#263045]/80">
                            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                              <strong className="text-slate-1000">Notes:</strong> {card.notes}
                            </p>
                          </div>
                        )}
                        
                        <div className="mt-3 space-y-1 pb-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-1000">Target Tanggal:</span>
                            <span className="text-amber-400 font-bold">{card.date}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-1000">Tahap:</span>
                            <span className="text-blue-400 font-bold">{card.stage} ({card.status})</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {requests.filter(r => r.pic === creator.name && r.status === 'Proses Desain').length === 0 && contentCards.filter(c => c.assignee === creator.name && c.stage !== 'Publish').length === 0 && (
                      <p className="text-xs text-slate-1000 text-center py-8">Tidak ada task yang sedang dikerjakan.</p>
                    )}
                  </div>
                </div>

                {/* Kolom Menunggu Review */}
                <div className="bg-[#131824]/30 border border-[#263045] rounded-2xl p-4 flex flex-col min-h-[500px]">
                  <h4 className="text-sm font-bold text-violet-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                    Menunggu Review (SPV & Manager)
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {requests.filter(r => r.pic === creator.name && (r.status === 'QC & Revisi Divisi' || r.status === 'Approval Manager')).map(req => (
                       <div key={req.no} className={`bg-[#0A0D14] border ${req.status === 'Approval Manager' ? 'border-fuchsia-900/50' : 'border-[#263045]'} p-4 rounded-xl relative group`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono bg-[#131824] px-2 py-0.5 rounded text-slate-400">{req.no}</span>
                          <div className="flex items-center gap-1">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${req.status === 'Approval Manager' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'bg-violet-500/20 text-violet-400'}`}>
                              {req.status === 'Approval Manager' ? 'DI MANAGER' : 'DI SPV'}
                            </span>
                          </div>
                        </div>
                        <h5 className="text-sm font-bold text-slate-200">{req.namaProject}</h5>
                        <div className="flex items-center flex-wrap gap-2 mt-1 mb-1">
                          <p className="text-xs text-slate-1000">Pemohon: <span className="font-semibold text-slate-400">{req.pemohon}</span></p>
                          {req.pemohon === 'Supervisor' ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30">TUGAS SPV</span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-500/20 text-violet-400 border border-violet-500/30">REQ DIVISI</span>
                          )}
                        </div>

                        {req.briefVisual && (
                          <div className="mt-2 bg-[#131824]/50 rounded-lg p-2 border border-[#263045]/80">
                            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                              <strong className="text-slate-1000">Brief:</strong> {req.briefVisual}
                            </p>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setViewRequestDetail(req); }}
                              className="text-[9px] text-violet-400 font-bold hover:text-violet-300 mt-1.5 flex items-center gap-1"
                            >
                              Baca Selengkapnya <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                          </div>
                        )}

                        <div className="mt-4 pt-3 border-t border-[#263045]">
                          {deliveryRequestId === req.no ? (
                            <div className="space-y-2 bg-[#131824] p-2 rounded border border-[#33415E]">
                              <label className="text-[9px] font-bold text-slate-400 block uppercase">Link Hasil Akhir:</label>
                              <input 
                                type="url"
                                required
                                placeholder="https://drive.google.com/..."
                                value={tempDeliverableLink}
                                onChange={(e) => setTempDeliverableLink(e.target.value)}
                                className="w-full bg-[#0A0D14] border border-[#263045] rounded p-1 text-[11px] text-slate-100"
                              />
                              <div className="flex flex-col gap-2 mt-2">
                                <button 
                                  onClick={async () => {
                                    if (!tempDeliverableLink || tempDeliverableLink === 'https://drive.google.com/file/d/project-asset-link/view') {
                                      triggerToast('Mohon lampirkan Link Hasil Akhir yang valid.', 'error');
                                      return;
                                    }
                                    await completeRequestWithLink(req.no);
                                    const text = encodeURIComponent(`Halo ${req.pemohon}, request divisi untuk project "${req.namaProject}" sudah selesai dikerjakan! 🎉\n\nBerikut link hasilnya:\n${tempDeliverableLink}\n\nTerima kasih!`);
                                    window.open(`https://wa.me/?text=${text}`, '_blank');
                                  }}
                                  className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white text-[10px] font-bold py-2 rounded flex items-center justify-center gap-1.5 transition shadow-lg shadow-[#25D366]/20"
                                >
                                  ✅ Kirim Aset & Share WA
                                </button>
                                <div className="flex gap-1.5">
                                  <button 
                                    onClick={() => completeRequestWithLink(req.no)}
                                    className="flex-1 bg-[#1D2536] hover:bg-zinc-700 text-slate-300 border border-[#33415E] text-[10px] font-bold py-1.5 rounded transition"
                                  >
                                    Kirim Saja
                                  </button>
                                  <button 
                                    onClick={() => setDeliveryRequestId(null)}
                                    className="bg-red-950/50 hover:bg-red-900 text-red-400 border border-red-900/50 text-[10px] px-3 py-1.5 rounded font-bold transition"
                                  >
                                    Batal
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {req.status === 'QC & Revisi Divisi' ? (
                                <>
                                  <button
                                    onClick={() => forwardRequestToManager(req.no)}
                                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white font-bold text-[10px] py-1.5 rounded-lg transition"
                                  >
                                    Teruskan ke Manager ➔
                                  </button>
                                  <button
                                    onClick={() => revertRequestToProsesDesain(req.no)}
                                    className="w-full bg-[#131824] hover:bg-red-950/40 hover:text-red-400 text-slate-400 border border-[#263045] rounded-lg py-1.5 text-[10px] font-bold transition"
                                  >
                                    Revisi (Ke Eksekutor)
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setDeliveryRequestId(req.no);
                                      setTempDeliverableLink('https://drive.google.com/file/d/project-asset-link/view');
                                    }}
                                    className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white font-bold text-[10px] py-1.5 rounded-lg transition"
                                  >
                                    ✓ Approve Manager & Selesai ➔
                                  </button>
                                  <button
                                    onClick={() => revertRequestToQcDivisi(req.no)}
                                    className="w-full bg-[#131824] hover:bg-violet-950/40 hover:text-violet-400 text-slate-400 border border-[#263045] rounded-lg py-1.5 text-[10px] font-bold transition"
                                  >
                                    Revisi (Kembalikan ke SPV)
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {requests.filter(r => r.pic === creator.name && (r.status === 'QC & Revisi Divisi' || r.status === 'Approval Manager')).length === 0 && (
                      <p className="text-xs text-slate-1000 text-center py-8">Tidak ada task yang menunggu review.</p>
                    )}
                  </div>
                </div>

                {/* Kolom Selesai */}
                <div className="bg-[#131824]/30 border border-[#263045] rounded-2xl p-4 flex flex-col min-h-[500px]">
                  <h4 className="text-sm font-bold text-emerald-400 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Selesai & Dikirim
                  </h4>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {requests.filter(r => r.pic === creator.name && r.status === 'Selesai').map(req => (
                       <div key={req.no} className="bg-[#0A0D14] border border-emerald-900/30 p-4 rounded-xl opacity-75">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono bg-[#131824] px-2 py-0.5 rounded text-slate-400">{req.no}</span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-200">{req.namaProject}</h5>
                        <div className="flex gap-2 mt-3">
                          <a href={req.linkHasilAkhir} target="_blank" rel="noreferrer" className="flex-1 bg-[#1D2536] hover:bg-zinc-700 text-slate-300 text-[10px] py-1.5 rounded-md text-center transition font-bold">
                            Buka GDrive
                          </a>
                          <a 
                            href={`https://wa.me/?text=${encodeURIComponent(`Halo ${req.pemohon}, request divisi untuk project "${req.namaProject}" sudah selesai dikerjakan! 🎉\n\nBerikut link hasilnya:\n${req.linkHasilAkhir}\n\nTerima kasih!`)}`}
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/50 py-1.5 rounded-md text-center transition font-bold"
                          >
                            Kirim WA
                          </a>
                        </div>
                        <div className="mt-2 pt-2 border-t border-[#263045] flex gap-2">
                          <button
                            onClick={() => revertRequestToQcDivisi(req.no)}
                            className="flex-1 bg-[#131824] hover:bg-violet-950/40 hover:text-violet-400 text-slate-1000 border border-[#263045] rounded-lg py-1.5 text-[10px] font-bold transition"
                          >
                            Kembali ke QC
                          </button>
                          <button
                            onClick={() => archiveRequest(req.no)}
                            className="flex-1 bg-[#131824] hover:bg-[#1D2536] text-slate-400 border border-[#263045] rounded-lg py-1.5 text-[10px] font-bold transition flex items-center justify-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                            Arsipkan
                          </button>
                        </div>
                      </div>
                    ))}
                    {requests.filter(r => r.pic === creator.name && r.status === 'Selesai').length === 0 && (
                      <p className="text-xs text-slate-1000 text-center py-8">Belum ada task yang selesai.</p>
                    )}
                  </div>
                    </div>
                  </div>
                </div>
                ))}
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
                    <p className="text-xs text-slate-1000 mt-0.5">Alur penyelesaian permintaan visual, materi promosi, dan desain grafis dari divisi luar.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Form Request */}
                  <div className="lg:col-span-4 bg-[#131824]/40 p-5 rounded-2xl border border-[#263045] space-y-4">
                    <div className="border-b border-[#263045] pb-3">
                      <h4 className="text-sm font-bold text-slate-200">Form Request Multimedia</h4>
                      <p className="text-[11px] text-slate-1000">Formulir lengkap pengajuan aset kreatif lintas divisi.</p>
                    </div>

                    <form onSubmit={handleRequestSubmit} className="space-y-3.5">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nama & Divisi Pemohon <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Rudi (Marketing Div)"
                          value={requestDraft.pemohon}
                          onChange={(e) => setRequestDraft(prev => ({ ...prev, pemohon: e.target.value }))}
                          className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Jenis Kebutuhan</label>
                          <select
                            value={requestDraft.jenisKebutuhan}
                            onChange={(e) => setRequestDraft(prev => ({ ...prev, jenisKebutuhan: e.target.value }))}
                            className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                          >
                            <option value="Desain Grafis">Desain Grafis</option>
                            <option value="Video Pendek">Video Pendek</option>
                            <option value="Syuting / Liputan Event">Syuting / Liputan Event</option>
                            <option value="Print Banner">Print Banner</option>
                            <option value="Materi Sosmed">Materi Sosmed</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Deadline Diminta <span className="text-red-400">*</span></label>
                          <input
                            type="date"
                            required
                            value={requestDraft.deadlinePemohon}
                            onChange={(e) => setRequestDraft(prev => ({ ...prev, deadlinePemohon: e.target.value }))}
                            className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                          />
                        </div>
                      </div>

                      {requestDraft.jenisKebutuhan === 'Syuting / Liputan Event' && (
                        <div className="grid grid-cols-2 gap-3 bg-[#131824]/50 p-3 rounded-lg border border-[#263045] animate-slide-in">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Waktu Acara <span className="text-red-400">*</span></label>
                            <input
                              type="datetime-local"
                              required={requestDraft.jenisKebutuhan === 'Syuting / Liputan Event'}
                              value={requestDraft.eventDate}
                              onChange={(e) => setRequestDraft(prev => ({ ...prev, eventDate: e.target.value }))}
                              className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Lokasi <span className="text-red-400">*</span></label>
                            <input
                              type="text"
                              placeholder="Cth: Gedung A"
                              required={requestDraft.jenisKebutuhan === 'Syuting / Liputan Event'}
                              value={requestDraft.eventLocation}
                              onChange={(e) => setRequestDraft(prev => ({ ...prev, eventLocation: e.target.value }))}
                              className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Project / Judul <span className="text-red-400">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Desain Baliho Promo Nusafarm"
                          value={requestDraft.namaProject}
                          onChange={(e) => setRequestDraft(prev => ({ ...prev, namaProject: e.target.value }))}
                          className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Headline <span className="text-zinc-600">(Opsional)</span></label>
                        <input
                          type="text"
                          placeholder="Contoh: Promo Spesial Akhir Tahun!"
                          value={requestDraft.headline}
                          onChange={(e) => setRequestDraft(prev => ({ ...prev, headline: e.target.value }))}
                          className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Referensi Visual <span className="text-zinc-600">(Opsional)</span></label>
                        <input
                          type="text"
                          placeholder="Link Drive / Referensi Desain"
                          value={requestDraft.referensiVisual}
                          onChange={(e) => setRequestDraft(prev => ({ ...prev, referensiVisual: e.target.value }))}
                          className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Informasi Wajib di Desain <span className="text-zinc-600">(Opsional)</span></label>
                        <textarea
                          rows="2"
                          placeholder="Contoh: Logo harus ada, warna dominan merah"
                          value={requestDraft.infoWajib}
                          onChange={(e) => setRequestDraft(prev => ({ ...prev, infoWajib: e.target.value }))}
                          className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Brief Visual Tambahan</label>
                        <textarea
                          rows="3"
                          placeholder="Tuliskan ukuran, referensi warna, pesan utama, dll..."
                          value={requestDraft.briefVisual}
                          onChange={(e) => setRequestDraft(prev => ({ ...prev, briefVisual: e.target.value }))}
                          className="w-full bg-[#0A0D14] border border-[#263045] focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
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
                  <div className="lg:col-span-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    {/* KOLOM KIRI: ANTREAN */}
                    <div className="bg-[#131824]/20 border border-zinc-900 rounded-2xl p-5 flex flex-col min-h-[500px]">
                      <h4 className="text-sm font-bold text-amber-400 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          Antrean Request Divisi
                        </div>
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">
                          {requests.filter(r => r.status === 'Review & Antrean').length}
                        </span>
                      </h4>
                      
                      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                        {requests.filter(r => r.status === 'Review & Antrean').length === 0 ? (
                          <div className="py-16 text-center text-slate-1000 text-xs">Belum ada request di antrean.</div>
                        ) : (
                          requests.filter(r => r.status === 'Review & Antrean').map(req => renderRequestCard(req))
                        )}
                      </div>
                    </div>

                    {/* KOLOM KANAN: DIKERJAKAN TIM */}
                    <div className="bg-[#131824]/20 border border-zinc-900 rounded-2xl p-5 flex flex-col min-h-[500px]">
                      <h4 className="text-sm font-bold text-blue-400 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                          Daftar Kerjaan Tim (Proses)
                        </div>
                        <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                          {requests.filter(r => r.status === 'Proses Desain' || r.status === 'QC & Revisi Divisi').length}
                        </span>
                      </h4>
                      
                      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                        {requests.filter(r => r.status === 'Proses Desain' || r.status === 'QC & Revisi Divisi').length === 0 ? (
                          <div className="py-16 text-center text-slate-1000 text-xs">Belum ada request yang sedang dikerjakan.</div>
                        ) : (
                          requests.filter(r => r.status === 'Proses Desain' || r.status === 'QC & Revisi Divisi').map(req => renderRequestCard(req))
                        )}
                      </div>
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
                  <p className="text-xs text-slate-400 mt-0.5">Definisikan arah komunikasi brand, kategori konten, dan target distribusinya.</p>
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
                  <div key={pillar.id} className="bg-[#131824]/60 border border-[#263045] rounded-2xl p-5 flex flex-col justify-between group hover:border-cyan-500/30 transition">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition">{pillar.name}</h4>
                        <span className="bg-[#0A0D14] text-cyan-400 px-2 py-1 rounded text-[10px] font-black border border-cyan-900/30">
                          {pillar.targetPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">{pillar.description}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-[#263045]/60 flex gap-2">
                      <button 
                        onClick={() => {
                          const newDesc = prompt(`Ubah deskripsi untuk ${pillar.name}:`, pillar.description);
                          const newPct = prompt(`Ubah target porsi konten (%) untuk ${pillar.name}:`, pillar.targetPercentage);
                          if (newDesc && newPct) {
                            setPillars(prev => prev.map(p => p.id === pillar.id ? { ...p, description: newDesc, targetPercentage: parseInt(newPct) || 0 } : p));
                            triggerToast('Pilar berhasil diperbarui!');
                          }
                        }}
                        className="flex-1 bg-[#0A0D14] hover:bg-[#1D2536] text-slate-300 text-[10px] font-bold py-1.5 rounded border border-[#263045] transition"
                      >
                        Edit Pilar
                      </button>
                      <button 
                        onClick={() => {
                          if(window.confirm(`Hapus pilar ${pillar.name}?`)) {
                            setPillars(prev => prev.filter(p => p.id !== pillar.id));
                          }
                        }}
                        className="bg-[#0A0D14] hover:bg-red-950/40 text-red-500 text-[10px] font-bold px-3 py-1.5 rounded border border-[#263045] hover:border-red-900/30 transition"
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
                <p className="text-xs text-slate-400 mt-1">
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
                    <div key={creator.name} className={`bg-[#131824]/40 border ${hasSP2 ? 'border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 'border-[#263045]'} rounded-2xl p-5 flex flex-col justify-between`}>
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1D2536] text-slate-300 flex items-center justify-center font-black">
                              {creator.avatar}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-200 text-sm">{creator.name}</h4>
                              <p className="text-[10px] text-slate-1000">{creator.role}</p>
                            </div>
                          </div>
                          {statusBadge}
                        </div>

                        <div className="space-y-2 mb-6">
                          <h5 className="text-[10px] font-bold text-slate-1000 uppercase tracking-widest border-b border-[#263045] pb-1">Riwayat Pelanggaran</h5>
                          {records.length === 0 ? (
                            <p className="text-xs text-zinc-600 italic">Belum ada catatan indisipliner.</p>
                          ) : (
                            <ul className="space-y-2">
                              {records.map(rec => (
                                <li key={rec.id} className="text-[10px] bg-[#0A0D14] p-2 rounded border border-[#263045]/80">
                                  <div className="flex justify-between items-center mb-1">
                                    <strong className={`
                                      ${rec.type === 'SP2' ? 'text-red-400' : rec.type === 'SP1' ? 'text-orange-400' : 'text-amber-400'}
                                    `}>{rec.type}</strong>
                                    <span className="text-zinc-600">{rec.date}</span>
                                  </div>
                                  <span className="text-slate-400">{rec.reason}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#263045]/60 space-y-2">
                        <p className="text-[10px] text-slate-1000 text-center mb-2">Tindakan Pendisiplinan (SPV Only)</p>
                        <button 
                          onClick={() => {
                            const reason = prompt(`Berikan alasan Surat Komitmen untuk ${creator.name} (Misal: Telat check-in 3 hari berturut-turut, tidak mengerjakan konten):`);
                            if(reason) {
                              setDisciplinaryRecords(prev => [...prev, { id: Date.now(), name: creator.name, type: 'Komitmen', reason, date: new Date().toLocaleDateString('id-ID') }]);
                              triggerToast(`Surat Komitmen untuk ${creator.name} diterbitkan.`, 'success');
                            }
                          }}
                          className="w-full bg-[#0A0D14] hover:bg-amber-950/40 text-amber-500 border border-amber-900/30 rounded-lg py-2 text-xs font-bold transition"
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
                            className="w-full bg-[#0A0D14] hover:bg-orange-950/40 text-orange-500 border border-orange-900/30 rounded-lg py-2 text-xs font-bold transition"
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
                            className="w-full bg-[#0A0D14] hover:bg-red-950/40 text-red-500 border border-red-900/30 rounded-lg py-2 text-xs font-bold transition"
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
              
              <div className="bg-gradient-to-r from-violet-950/40 via-zinc-900 to-indigo-950/20 p-6 rounded-2xl border border-[#263045]/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-violet-400">KPI Audit Matriks</span>
                  <h3 className="text-xl font-bold mt-1 text-slate-100">Supervisor Control Intelligence</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
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
                    className="bg-[#1D2536] hover:bg-zinc-700 text-slate-300 border border-[#33415E] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Tarik Laporan Akhir Bulan
                  </button>
                  <div className="bg-[#0A0D14] border border-[#263045] p-3 rounded-xl text-center min-w-[120px]">
                    <span className="text-[10px] text-slate-1000 block uppercase font-bold">Status Operasional</span>
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
                <div className="lg:col-span-5 bg-[#131824]/40 p-6 rounded-2xl border border-[#263045] space-y-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Rasio Revisi per Aset</h4>
                      <span className="text-[10px] bg-red-950/40 border border-red-900/50 text-red-400 font-bold px-2 py-0.5 rounded">
                        Limit SPV: Max 2.0
                      </span>
                    </div>
                    <p className="text-xs text-slate-1000 mt-1">Rata-rata frekuensi revisi draf yang diajukan oleh anak magang/crew.</p>
                  </div>

                  <div className="space-y-4">
                    {creatorAverages.map(creator => {
                      const isOverLimit = creator.calculatedRate > 2.0;
                      const barPercentage = Math.min((creator.calculatedRate / 4.0) * 100, 100);

                      return (
                        <div key={creator.name} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-200">{creator.name}</span>
                            <span className={`font-bold ${isOverLimit ? 'text-red-400' : 'text-emerald-400'}`}>
                              {creator.calculatedRate} Revisi {isOverLimit && '⚠️'}
                            </span>
                          </div>

                          <div className="h-2.5 w-full bg-[#0A0D14] rounded-full overflow-hidden border border-[#263045]">
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

                  <div className="text-xs bg-[#0A0D14] p-3 rounded-xl border border-[#263045] text-slate-1000 leading-relaxed">
                    💡 <strong className="text-slate-300">Tips Supervisor:</strong> Hubungi desainer yang memiliki rata-rata revisi &gt; 2.0 untuk sesi coaching draf media sosial.
                  </div>
                </div>

                {/* Widget B: SLA Fulfillment Rate */}
                <div className="lg:col-span-4 bg-[#131824]/40 p-6 rounded-2xl border border-[#263045] flex flex-col justify-between space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">SLA Fulfillment Rate</h4>
                    <p className="text-xs text-slate-1000 mt-1">Persentase tiket visual divisi luar yang diselesaikan tepat waktu sebelum batas target SLA.</p>
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
                      <span className="text-[9px] text-slate-1000 block font-bold uppercase mt-0.5">SLA MET</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-[#0A0D14] p-2.5 rounded-xl border border-[#263045]">
                      <span className="text-[10px] text-slate-1000 block uppercase">Total Request</span>
                      <span className="text-base font-bold text-emerald-400 mt-0.5 block">{totalRequests} Assets</span>
                    </div>
                    <div className="bg-[#0A0D14] p-2.5 rounded-xl border border-[#263045]">
                      <span className="text-[10px] text-slate-1000 block uppercase">Target Minimal</span>
                      <span className="text-base font-bold text-slate-300 mt-0.5 block">90%</span>
                    </div>
                  </div>
                </div>

                {/* Widget C: Content Consistency Score */}
                <div className="lg:col-span-3 bg-[#131824]/40 p-6 rounded-2xl border border-[#263045] flex flex-col justify-between space-y-6">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Konsistensi Publikasi</h4>
                    <p className="text-xs text-slate-1000 mt-1">Rasio volume konten yang dijadwalkan & tayang dibanding total ide direncanakan.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 block tracking-tight">
                        {consistencyScore}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Consistency Rating</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-1000">Tayang & Sched:</span>
                        <span className="text-slate-300 font-semibold">{publishedCount + scheduledCount} konten</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-1000">Total Draft:</span>
                        <span className="text-slate-300 font-semibold">{totalRelevantContent} konten</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between gap-2 text-[9px] text-slate-1000 bg-[#0A0D14] p-2.5 rounded-lg border border-[#263045]">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Posted</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Sched</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span> Backlog</span>
                  </div>
                </div>

              </div>

                {/* Widget D: Kedisiplinan & Log Kehadiran */}
                <div className="bg-[#131824]/40 p-6 rounded-2xl border border-[#263045] space-y-6 mt-8">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Kedisiplinan & Log Kehadiran</h4>
                    <p className="text-xs text-slate-1000 mt-1">Laporan absen pagi (Check-in) tim beserta tracker keterlambatan harian.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {CREATORS.map(creator => {
                      const creatorCheckins = checkins.filter(c => c.name === creator.name);
                      const lateCount = creatorCheckins.filter(c => c.isLate).length;
                      const onTimeCount = creatorCheckins.length - lateCount;
                      
                      return (
                        <div key={creator.name} className="bg-[#0A0D14] p-4 rounded-xl border border-[#263045]/80">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-[#1D2536] flex items-center justify-center text-xs font-bold text-slate-300">
                              {creator.avatar}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-200 block">{creator.name}</span>
                              <span className="text-[9px] text-slate-1000 block uppercase">{creator.role}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="bg-emerald-950/20 border border-emerald-900/30 p-2 rounded-lg">
                              <span className="block font-bold text-emerald-400">{onTimeCount}</span>
                              <span className="text-[9px] text-slate-1000 uppercase">On-Time</span>
                            </div>
                            <div className={`p-2 rounded-lg ${lateCount > 0 ? 'bg-red-950/20 border border-red-900/30' : 'bg-[#131824] border border-[#263045]/50'}`}>
                              <span className={`block font-bold ${lateCount > 0 ? 'text-red-400' : 'text-slate-1000'}`}>{lateCount}</span>
                              <span className="text-[9px] text-slate-1000 uppercase">Late</span>
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
              <div className="lg:col-span-1 bg-[#131824]/40 p-6 rounded-2xl border border-[#263045] self-start">
                <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center gap-2">
                  <span className="p-1.5 rounded bg-emerald-600/20 text-emerald-400">⏱️</span>
                  Check-in Hari Ini
                </h3>
                <form onSubmit={handleCheckinSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Nama Tim</label>
                    <select
                      required
                      value={checkinForm.name}
                      onChange={(e) => setCheckinForm({...checkinForm, name: e.target.value})}
                      className="w-full bg-[#0A0D14] border border-[#263045] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {CREATORS.map(c => <option key={c.name} value={c.name}>{c.name} - {c.role}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Jam Kedatangan (Maks 08:00)</label>
                    <input
                      type="time"
                      required
                      value={checkinForm.time}
                      onChange={(e) => setCheckinForm({...checkinForm, time: e.target.value})}
                      className="w-full bg-[#0A0D14] border border-[#263045] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30 transition">
                    Submit Check-in
                  </button>
                </form>
              </div>

              {/* Feed/History Log */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-100">Live Team Tracker</h3>
                  <span className="text-[10px] text-slate-1000 bg-[#0A0D14] px-3 py-1 rounded-full border border-[#263045]">
                    Total Check-in: {checkins.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {checkins.length === 0 ? (
                    <div className="bg-[#131824]/20 border border-[#263045]/50 rounded-2xl p-12 text-center text-slate-1000">
                      Belum ada laporan absen hari ini. Silakan tim mengisi check-in di samping.
                    </div>
                  ) : (
                    checkins.map(ci => (
                      <div key={ci.id} className={`p-5 rounded-2xl border ${ci.isLate ? 'bg-red-950/10 border-red-900/30' : 'bg-[#131824]/40 border-[#263045]'} flex gap-4`}>
                        <div className="shrink-0 flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shadow-lg ${ci.isLate ? 'bg-red-900/50 text-red-300' : 'bg-emerald-900/50 text-emerald-300'}`}>
                            {CREATORS.find(c => c.name === ci.name)?.avatar || 'U'}
                          </div>
                          <span className={`text-[9px] mt-2 font-bold px-1.5 py-0.5 rounded ${ci.isLate ? 'bg-red-500/20 text-red-400' : 'bg-[#1D2536] text-slate-400'}`}>
                            {ci.time}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <span className="font-bold text-slate-100 text-sm mr-2">{ci.name}</span>
                              {ci.isLate && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold">LATE</span>}
                            </div>
                            <span className="text-[10px] text-slate-1000">{ci.date}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap bg-[#0A0D14]/40 p-3 rounded-xl border border-[#263045]/50 mt-2">
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
            <div className="bg-[#131824] border border-[#263045] rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => { setShowAddIdeaModal(false); setEditingContentId(null); }} className="absolute top-4 right-4 text-slate-1000 hover:text-white">
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
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">Judul Konten <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={newIdeaDraft.title}
                    onChange={(e) => setNewIdeaDraft({...newIdeaDraft, title: e.target.value})}
                    placeholder="Contoh: Vlog Panen Sapi Perah"
                    className="w-full bg-[#0A0D14] border border-[#263045] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Akun Utama <span className="text-red-500">*</span></label>
                    <select
                      required
                      value={newIdeaDraft.brand}
                      onChange={(e) => setNewIdeaDraft({...newIdeaDraft, brand: e.target.value, collaborator: e.target.value === newIdeaDraft.collaborator ? '' : newIdeaDraft.collaborator})}
                      className="w-full bg-[#0A0D14] border border-[#263045] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      {BRANDS.filter(b => b.id !== 'all').map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Kolaborator (Opsional)</label>
                    <select
                      value={newIdeaDraft.collaborator}
                      onChange={(e) => setNewIdeaDraft({...newIdeaDraft, collaborator: e.target.value})}
                      className="w-full bg-[#0A0D14] border border-[#263045] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
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
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Format</label>
                    <select
                      value={newIdeaDraft.format}
                      onChange={(e) => setNewIdeaDraft({...newIdeaDraft, format: e.target.value})}
                      className="w-full bg-[#0A0D14] border border-[#263045] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      <option value="Reels / Video">Reels / Video</option>
                      <option value="Feed / Carousel">Feed / Carousel</option>
                      <option value="Story">Story</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">PIC Kreator</label>
                    <select
                      value={newIdeaDraft.assignee}
                      onChange={(e) => setNewIdeaDraft({...newIdeaDraft, assignee: e.target.value})}
                      className="w-full bg-[#0A0D14] border border-[#263045] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                    >
                      {CREATORS.map(c => (
                        <option key={c.name} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Target Rilis</label>
                    <input
                      type="date"
                      value={newIdeaDraft.date}
                      onChange={(e) => setNewIdeaDraft({...newIdeaDraft, date: e.target.value})}
                      className="w-full bg-[#0A0D14] border border-[#263045] rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-violet-500 cursor-text"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => { setShowAddIdeaModal(false); setEditingContentId(null); }} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition">Batal</button>
                  <button type="submit" className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/30 transition">{editingContentId ? 'Update Ide' : 'Simpan Ide'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {writeScriptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#131824] border border-[#263045] rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setWriteScriptModal(null)} className="absolute top-4 right-4 text-slate-1000 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="p-1.5 rounded bg-blue-600/20 text-blue-400">📝</span>
                Tulis Naskah / Script
              </h3>
              <p className="text-sm text-slate-400 mb-6 font-semibold">{writeScriptModal.title}</p>
              
              <div className="space-y-4">
                <textarea
                  value={tempScript}
                  onChange={(e) => setTempScript(e.target.value)}
                  placeholder="Tulis naskah video/caption di sini..."
                  rows={10}
                  className="w-full bg-[#0A0D14] border border-[#263045] rounded-lg p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                ></textarea>

                <div className="pt-4 flex flex-col-reverse sm:flex-row justify-between items-center border-t border-[#263045]/80 gap-4">
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
                    <button onClick={() => setWriteScriptModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition">Batal</button>
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

        {/* TAB: SARAN & KRITIK                                                     */}
        {/* ======================================================================= */}
        {activeTab === 'saran-kritik' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#263045] pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="p-1.5 rounded bg-emerald-600/10 text-emerald-400 text-sm">💡</span>
                  Kotak Saran & Kritik
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Daftar masukan dan feedback dari pengguna / tim lintas divisi.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.filter(r => r.status === 'Feedback').length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-1000 text-xs">
                  Belum ada saran & kritik yang masuk.
                </div>
              ) : (
                requests.filter(r => r.status === 'Feedback').map(req => (
                  <div key={req.no} className="bg-[#131824]/50 p-5 rounded-2xl border border-[#263045] flex flex-col gap-3">
                    <div className="flex justify-between items-start border-b border-[#263045]/50 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                          {req.tanggalRequest}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">"{req.briefVisual}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'arsip' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-[#263045] pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="p-1.5 rounded bg-[#1D2536] text-slate-300 text-sm">📦</span>
                  Menu Arsip
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Daftar semua tugas yang telah selesai dan diarsipkan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.filter(r => r.status === 'Arsip').length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-1000 text-xs">
                  Belum ada tugas yang diarsipkan.
                </div>
              ) : (
                requests.filter(r => r.status === 'Arsip').map(req => (
                  <div key={req.no} className="bg-[#0A0D14] border border-[#263045] p-5 rounded-2xl flex flex-col gap-3 shadow-lg opacity-80 hover:opacity-100 transition">
                    <div className="flex justify-between items-start border-b border-[#263045] pb-3">
                      <div>
                        <span className="text-[10px] font-mono bg-[#131824] px-2 py-0.5 rounded text-slate-400">{req.no}</span>
                        <h5 className="text-sm font-bold text-slate-200 mt-1.5">{req.namaProject}</h5>
                      </div>
                      <span className="text-[10px] bg-[#1D2536] text-slate-400 px-2 py-0.5 rounded-full border border-[#33415E]">Arsip</span>
                    </div>
                    
                    <div className="text-[11px] text-slate-400 space-y-1">
                      <p><span className="text-slate-1000">Pemohon:</span> {req.pemohon}</p>
                      <p><span className="text-slate-1000">PIC:</span> {req.pic || '-'}</p>
                      {req.linkHasilAkhir && (
                        <p className="mt-2">
                          <a href={req.linkHasilAkhir} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Lihat Hasil Akhir</a>
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal Edit Jobdesk */}
        {editJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#131824] border border-[#263045] rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button onClick={() => setEditJobModal(null)} className="absolute top-4 right-4 text-slate-1000 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <h2 className="text-xl font-bold text-white mb-2">Edit Tugas</h2>
              <p className="text-xs text-slate-400 mb-6 font-mono">{editJobModal.no}</p>
              
              <form onSubmit={handleEditJobSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Project / Tugas</label>
                  <input
                    type="text"
                    required
                    value={editJobModal.namaProject}
                    onChange={(e) => setEditJobModal(prev => ({ ...prev, namaProject: e.target.value }))}
                    className="w-full bg-[#0A0D14] border border-[#263045] focus:border-blue-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Brief / Notes</label>
                  <textarea
                    rows="3"
                    value={editJobModal.briefVisual}
                    onChange={(e) => setEditJobModal(prev => ({ ...prev, briefVisual: e.target.value }))}
                    className="w-full bg-[#0A0D14] border border-[#263045] focus:border-blue-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Deadline Pemohon</label>
                    <input
                      type="date"
                      value={editJobModal.deadlinePemohon}
                      onChange={(e) => setEditJobModal(prev => ({ ...prev, deadlinePemohon: e.target.value }))}
                      className="w-full bg-[#0A0D14] border border-[#263045] focus:border-blue-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Estimasi Mulmed</label>
                    <input
                      type="date"
                      value={editJobModal.estimasiMulmed || ''}
                      onChange={(e) => setEditJobModal(prev => ({ ...prev, estimasiMulmed: e.target.value }))}
                      className="w-full bg-[#0A0D14] border border-[#263045] focus:border-blue-500 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 transition"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-2 border-t border-[#263045]">
                  <button type="button" onClick={() => setEditJobModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition">Batal</button>
                  <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 transition">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
