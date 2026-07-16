import React, { useState, useEffect } from 'react';

const BRANDS = [
  { id: 'all', name: 'All Brands', color: 'border-zinc-700 bg-zinc-800' },
  { id: 'holding', name: 'Nusafarm Holding', color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400' },
  { id: 'nusaqu', name: 'Nusaqu Fresh Milk', color: 'border-blue-500/30 bg-blue-950/20 text-blue-400' },
  { id: 'nusawaste', name: 'Nusawaste Bio', color: 'border-teal-500/30 bg-teal-950/20 text-teal-400' },
  { id: 'bekasi', name: 'Cabang Bekasi', color: 'border-amber-500/30 bg-amber-950/20 text-amber-400' },
  { id: 'bandung', name: 'Cabang Bandung', color: 'border-violet-500/30 bg-violet-950/20 text-violet-400' }
];

const CREATORS = [
  { name: 'Fahri (Magang Medsos)', role: 'Social Media Associate', avatar: 'FM', initialRevisionRate: 2.3 },
  { name: 'Siti (Designer)', role: 'Graphic Designer', avatar: 'SD', initialRevisionRate: 1.1 },
  { name: 'Budi (Editor)', role: 'Video Editor', avatar: 'BE', initialRevisionRate: 1.8 },
  { name: 'Amalia (Copywriter)', role: 'Creative Copy', avatar: 'AC', initialRevisionRate: 0.9 },
  { name: 'Rio (Videographer)', role: 'Creative Director', avatar: 'RV', initialRevisionRate: 1.5 }
];

const INITIAL_CONTENT_CARDS = [
  {
    id: 'c-1',
    title: 'A Day in the Life of a Modern Chicken Breeder',
    brand: 'holding',
    platform: 'TikTok',
    assignee: 'Fahri (Magang Medsos)',
    revisionCount: 1,
    stage: 'Editing', 
    status: 'Editing',
    date: '2026-07-16',
    notes: 'Needs catchy modern hook sound.'
  },
  {
    id: 'c-2',
    title: 'Nusawaste Organic Household Sorting Tutorial',
    brand: 'nusawaste',
    platform: 'Instagram',
    assignee: 'Siti (Designer)',
    revisionCount: 0,
    stage: 'Editing',
    status: 'QC SPV',
    date: '2026-07-18',
    notes: 'Ready for supervisor final sign off.'
  },
  {
    id: 'c-3',
    title: 'Nusaqu High-Protein Fresh Milk Launch Post',
    brand: 'nusaqu',
    platform: 'Instagram',
    assignee: 'Amalia (Copywriter)',
    revisionCount: 2,
    stage: 'Ide',
    status: 'Ide',
    date: '2026-07-19',
    notes: 'Brainstorming creative angles for fitness markets.'
  },
  {
    id: 'c-4',
    title: 'Grand Opening Promo - Booth Cabang Bekasi',
    brand: 'bekasi',
    platform: 'Facebook',
    assignee: 'Budi (Editor)',
    revisionCount: 3,
    stage: 'Publish',
    status: 'Scheduled',
    date: '2026-07-20',
    notes: 'Scheduled for automatic posting at 10:00 AM.'
  },
  {
    id: 'c-5',
    title: 'Nusawaste Biogas Eco-Energy Explainer Clip',
    brand: 'nusawaste',
    platform: 'YouTube',
    assignee: 'Rio (Videographer)',
    revisionCount: 0,
    stage: 'Script/Brief',
    status: 'Production/Shooting',
    date: '2026-07-17',
    notes: 'Shooting at compost field location.'
  }
];

const INITIAL_DIVISION_REQUESTS = [
  {
    no: 'REQ-2026-001',
    tanggalRequest: '2026-07-15',
    pemohon: 'Rudi Wijaya (Sales Div)',
    jenisKebutuhan: 'Desain Grafis',
    namaProject: 'Brosur Pakan Sapi Premium Q3',
    briefVisual: 'Dominasi warna hijau alam, letakkan logo holding di pojok kanan atas, tonjolkan diskon 15%.',
    estimasiSelesai: '2026-07-21',
    pic: 'Siti (Designer)',
    status: 'Proses Desain', // Stages: 'Review & Antrean', 'Proses Desain', 'QC & Revisi Divisi', 'Selesai'
    linkHasilAkhir: ''
  },
  {
    no: 'REQ-2026-002',
    tanggalRequest: '2026-07-16',
    pemohon: 'Indah Kusuma (PR Div)',
    jenisKebutuhan: 'Video Pendek',
    namaProject: 'Video CSR Nusawaste Go-Green',
    briefVisual: 'Video cinematic durasi 30 detik untuk IG Reels, background penanaman pohon mangrove.',
    estimasiSelesai: '2026-07-18', // Less than 3 days -> high priority
    pic: 'Budi (Editor)',
    status: 'Review & Antrean',
    linkHasilAkhir: ''
  },
  {
    no: 'REQ-2026-003',
    tanggalRequest: '2026-07-12',
    pemohon: 'Hendra (Exhibition Team)',
    jenisKebutuhan: 'Print Banner',
    namaProject: 'Roll Banner Expo Peternakan Nasional',
    briefVisual: 'Ukuran 80x200cm, resolusi cetak tinggi, pasang foto sapi perah kualitas unggul.',
    estimasiSelesai: '2026-07-15',
    pic: 'Rio (Videographer)',
    status: 'Selesai',
    linkHasilAkhir: 'https://drive.google.com/file/d/sample-banner/view'
  }
];

const PIPELINE_STAGES = [
  { key: 'Ide', label: 'Ide / Draft', icon: '💡', desc: 'Brainstorming & ideasi awal konten' },
  { key: 'Script/Brief', label: 'Script / Brief', icon: '📝', desc: 'Penyusunan naskah & konsep visual' },
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
  const [activeTab, setActiveTab] = useState('pabrik-konten'); // 'pabrik-konten', 'control-center'
  const [selectedBrand, setSelectedBrand] = useState('all');
  
  /* State lists */
  const [contentCards, setContentCards] = useState(INITIAL_CONTENT_CARDS);
  const [requests, setRequests] = useState(INITIAL_DIVISION_REQUESTS);
  
  /* UI view & active states */
  const [pabrikViewMode, setPabrikViewMode] = useState('pipeline'); 
  const [activeSubTab, setActiveSubTab] = useState('Ide'); 
  const [activeRequestSubTab, setActiveRequestSubTab] = useState('Review & Antrean');

  /* Modals and forms state */
  const [toast, setToast] = useState(null);
  const [qcModalCard, setQcModalCard] = useState(null); 
  const [viewDetailCard, setViewDetailCard] = useState(null); 
  const [viewRequestDetail, setViewRequestDetail] = useState(null);

  /* Form state for request */
  const [requestDraft, setRequestDraft] = useState({
    pemohon: '',
    jenisKebutuhan: 'Desain Grafis',
    namaProject: '',
    briefVisual: '',
    estimasiSelesai: '',
    pic: 'Belum Ditunjuk',
    linkHasilAkhir: ''
  });
  const [slaWarning, setSlaWarning] = useState(false);

  /* Custom state for temporary request action forms (assigning PIC / updating link) */
  const [assigningRequestId, setAssigningRequestId] = useState(null);
  const [tempPic, setTempPic] = useState('Siti (Designer)');
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
      triggerToast('Ide disetujui! Berhasil dipindahkan ke tahap Script/Brief.');
    } else if (currentStage === 'Script/Brief') {
      setContentCards(prev => prev.map(c => 
        c.id === cardId 
          ? { ...c, stage: 'Editing', status: 'Editing', notes: `${c.notes || ''} | Script disetujui` } 
          : c
      ));
      triggerToast('Script disetujui! Konten masuk ke antrean Editing.');
    } else if (currentStage === 'Editing') {
      const card = contentCards.find(c => c.id === cardId);
      if (card) {
        setQcModalCard(card);
      }
    }
  };

  const handleQcApproval = (approve) => {
    if (!qcModalCard) return;

    if (approve) {
      setContentCards(prev => prev.map(c => 
        c.id === qcModalCard.id 
          ? { ...c, stage: 'Publish', status: 'Scheduled', notes: `${c.notes} | Disetujui oleh SPV` } 
          : c
      ));
      triggerToast(`Konten disetujui oleh SPV! Siap dijadwalkan.`);
    } else {
      setContentCards(prev => prev.map(c => 
        c.id === qcModalCard.id 
          ? { 
              ...c, 
              stage: 'Editing',
              status: 'Editing', 
              revisionCount: c.revisionCount + 1, 
              notes: `${c.notes} | Revisi diminta oleh SPV` 
            } 
          : c
      ));
      triggerToast(`Revisi diminta. Konten dikembalikan ke tahap Editing.`, 'warning');
    }
    setQcModalCard(null);
  };

  const publishNow = (cardId) => {
    setContentCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, status: 'Published' } : c
    ));
    triggerToast('Konten berhasil diterbitkan secara Live!');
  };

  const handleSlaDateChange = (dateVal) => {
    setRequestDraft(prev => ({ ...prev, estimasiSelesai: dateVal }));
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

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!requestDraft.pemohon || !requestDraft.namaProject || !requestDraft.estimasiSelesai) {
      triggerToast('Mohon lengkapi seluruh kolom wajib!', 'error');
      return;
    }

    const nextIdNum = requests.length + 1;
    const requestNo = `REQ-2026-${nextIdNum.toString().padStart(3, '0')}`;

    const newRequest = {
      no: requestNo,
      tanggalRequest: '2026-07-16',
      pemohon: requestDraft.pemohon,
      jenisKebutuhan: requestDraft.jenisKebutuhan,
      namaProject: requestDraft.namaProject,
      briefVisual: requestDraft.briefVisual || 'Tidak ada brief visual khusus.',
      estimasiSelesai: requestDraft.estimasiSelesai,
      pic: requestDraft.pic,
      status: 'Review & Antrean',
      linkHasilAkhir: ''
    };

    setRequests([newRequest, ...requests]);
    triggerToast(`Permintaan ${requestNo} sukses diajukan ke Antrean Review!`);
    
    // Clear draft form
    setRequestDraft({
      pemohon: '',
      jenisKebutuhan: 'Desain Grafis',
      namaProject: '',
      briefVisual: '',
      estimasiSelesai: '',
      pic: 'Belum Ditunjuk',
      linkHasilAkhir: ''
    });
    setSlaWarning(false);
    setActiveRequestSubTab('Review & Antrean');
  };

  const assignRequestPic = (reqNo) => {
    setRequests(prev => prev.map(r => 
      r.no === reqNo 
        ? { ...r, pic: tempPic, status: 'Proses Desain' } 
        : r
    ));
    setAssigningRequestId(null);
    triggerToast(`Permintaan ${reqNo} disetujui & ditugaskan kepada ${tempPic}.`);
  };

  const advanceRequestToQc = (reqNo) => {
    setRequests(prev => prev.map(r => 
      r.no === reqNo 
        ? { ...r, status: 'QC & Revisi Divisi' } 
        : r
    ));
    triggerToast(`Aset ${reqNo} telah diselesaikan oleh desainer & diajukan ke QC Divisi.`);
  };

  const completeRequestWithLink = (reqNo) => {
    if (!tempDeliverableLink) {
      triggerToast('Mohon lampirkan Link Hasil Akhir sebagai bukti serah terima.', 'error');
      return;
    }
    setRequests(prev => prev.map(r => 
      r.no === reqNo 
        ? { ...r, linkHasilAkhir: tempDeliverableLink, status: 'Selesai' } 
        : r
    ));
    setDeliveryRequestId(null);
    setTempDeliverableLink('');
    triggerToast(`Sukses! Permintaan ${reqNo} ditandai selesai dan link hasil akhir dikirim.`);
  };

  const deleteRequest = (reqNo) => {
    setRequests(prev => prev.filter(r => r.no !== reqNo));
    triggerToast(`Permintaan ${reqNo} berhasil dihapus.`);
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
  const consistencyScore = Math.round(((publishedCount + scheduledCount) / totalRelevantContent) * 100);

  const filteredContentCards = selectedBrand === 'all' 
    ? contentCards 
    : contentCards.filter(c => c.brand === selectedBrand);

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

            <div className="p-6 bg-zinc-950/40 border-t border-zinc-800/80 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleQcApproval(false)}
                className="flex-1 bg-zinc-800 hover:bg-red-950/30 hover:text-red-400 hover:border-red-900/50 border border-zinc-700 text-zinc-200 font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2"
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
                <span className="text-zinc-500 block">Estimasi Selesai</span>
                <span className="text-violet-400 font-bold">{viewRequestDetail.estimasiSelesai}</span>
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

      {}
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
          
          <div className="mt-6 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow">
              SP
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-zinc-100 block truncate">Pak Supervisor</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Head of Multimedia
              </span>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 space-y-1.5">
          <button
            onClick={() => setActiveTab('pabrik-konten')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === 'pabrik-konten'
                ? 'bg-gradient-to-r from-violet-950/60 to-zinc-900 text-violet-300 border-l-4 border-violet-500'
                : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100'
            }`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Workspace Dashboard
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
              {activeTab === 'pabrik-konten' ? 'Pabrik Konten & Creative Request Portal' : 'KPI Control Center SPV'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {activeTab === 'pabrik-konten' 
                ? 'Kelola publikasi media sosial organic sekaligus awasi request terintegrasi dari divisi eksternal.' 
                : 'Analisis produktivitas tim, rata-rata revisi crew magang, dan ketepatan waktu rilis bulanan.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500">Filter Akun Brand:</span>
            <div className="inline-flex rounded-lg bg-zinc-950 p-1 border border-zinc-800">
              {BRANDS.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap ${
                    selectedBrand === brand.id
                      ? 'bg-zinc-800 text-white shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {brand.name === 'All Brands' ? 'Semua' : brand.name.replace('Nusa', '').replace('Cabang ', '')}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Workspace body */}
        <section className="p-6 flex-1 space-y-12 overflow-y-auto">

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

                    <button
                      onClick={() => {
                        const title = prompt("Masukkan Judul Ide Konten:");
                        if (!title) return;
                        const brandInput = prompt("Masukkan Akun Brand (holding, nusaqu, nusawaste, bekasi, bandung):", "holding");
                        const platform = prompt("Platform (TikTok, Instagram, YouTube, Facebook):", "TikTok");
                        const assignee = prompt("Kreator (contoh: Fahri (Magang Medsos), Siti (Designer)):", "Fahri (Magang Medsos)");
                        const targetDate = prompt("Target Tanggal Rilis (YYYY-MM-DD):", "2026-07-20");
                        
                        if (title && brandInput && platform) {
                          addNewContentCard({
                            title,
                            brand: brandInput,
                            platform,
                            assignee: assignee || 'Fahri (Magang Medsos)',
                            date: targetDate || '2026-07-20',
                            notes: 'Ditambahkan via menu cepat.'
                          });
                        }
                      }}
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-1.5"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                      Quick Add Idea
                    </button>
                  </div>
                </div>

                {pabrikViewMode === 'pipeline' ? (
                  <div className="space-y-4">
                    {/* Horizontal pipeline stage toggles */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-zinc-900/40 p-1.5 rounded-xl border border-zinc-900">
                      {PIPELINE_STAGES.map(stage => {
                        const count = filteredContentCards.filter(c => c.stage === stage.key).length;
                        const isActive = activeSubTab === stage.key;
                        return (
                          <button
                            key={stage.key}
                            onClick={() => setActiveSubTab(stage.key)}
                            className={`p-3 rounded-lg text-left transition-all ${
                              isActive ? 'bg-zinc-800 border border-zinc-700 shadow-md ring-1 ring-violet-500/30' : 'hover:bg-zinc-900/60 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-lg">{stage.icon}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold ${isActive ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                                {count} Konten
                              </span>
                            </div>
                            <div className="mt-2">
                              <h4 className={`text-xs font-bold ${isActive ? 'text-violet-400' : 'text-zinc-300'}`}>{stage.label}</h4>
                              <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{stage.desc}</p>
                            </div>
                          </button>
                        );
                      })}
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
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${brandObj?.color || 'border-zinc-700'}`}>
                                      {brandObj?.name.replace('Nusa', '')}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 font-medium">{card.platform}</span>
                                  </div>
                                  <h4 className="text-sm font-bold text-zinc-200 group-hover:text-white leading-snug">{card.title}</h4>
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
                                    <button
                                      onClick={() => advancePipelineStage(card.id, 'Script/Brief')}
                                      className="w-full bg-zinc-950 hover:bg-violet-950/40 hover:text-violet-400 text-zinc-300 border border-zinc-800 rounded-lg py-2 text-xs font-bold transition"
                                    >
                                      Setujui Script & Lanjut Editing ➔
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
                      {[1, 2, 3].map(i => (
                        <div key={`empty-${i}`} className="bg-zinc-950/20 p-2 min-h-[80px] border-r border-b border-zinc-800/40" />
                      ))}
                      {Array.from({ length: 31 }, (_, index) => {
                        const dayNumber = index + 1;
                        const dateStr = `2026-07-${dayNumber.toString().padStart(2, '0')}`;
                        const dayCards = filteredContentCards.filter(c => c.date === dateStr);
                        const isToday = dayNumber === 16;
                        return (
                          <div key={dayNumber} className={`p-2 min-h-[90px] bg-zinc-950/60 border-r border-b border-zinc-800 flex flex-col justify-between ${isToday ? 'ring-1 ring-inset ring-indigo-500/50 bg-indigo-950/20' : ''}`}>
                            <span className={`text-[10px] font-black ${isToday ? 'bg-indigo-500 text-white px-1.5 py-0.5 rounded-full' : 'text-zinc-500'}`}>{dayNumber}</span>
                            <div className="space-y-1 mt-1">
                              {dayCards.map(card => (
                                <div key={card.id} onClick={() => setViewDetailCard(card)} className="text-[8px] p-0.5 rounded border truncate bg-zinc-900 border-zinc-800 text-zinc-300 cursor-pointer">
                                  {card.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ======================================================================= */}
              {/* TIER 2: PAPAN REQUEST DIVISI (CROSS-DIVISIONAL FLOW)                     */}
              {/* ======================================================================= */}
              <div className="space-y-6 pt-4 border-t border-zinc-900">
                
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
                            <option value="Print Banner">Print Banner</option>
                            <option value="Materi Sosmed">Materi Sosmed</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-400 uppercase">Estimasi Selesai <span className="text-red-400">*</span></label>
                          <input
                            type="date"
                            required
                            value={requestDraft.estimasiSelesai}
                            onChange={(e) => handleSlaDateChange(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:outline-none rounded-lg p-2.5 text-xs text-zinc-100 transition"
                          />
                        </div>
                      </div>

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
                                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-[11px] text-zinc-100"
                                          >
                                            {CREATORS.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                          </select>
                                          <div className="flex gap-1.5">
                                            <button 
                                              onClick={() => assignRequestPic(req.no)}
                                              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-1 rounded"
                                            >
                                              Konfirmasi
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
                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-center shrink-0 min-w-[120px]">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">Status Operasional</span>
                  <span className="text-emerald-400 font-extrabold text-sm flex items-center justify-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    OPTIMAL
                  </span>
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

            </div>
          )}

        </section>

      </main>

    </div>
  );
}
