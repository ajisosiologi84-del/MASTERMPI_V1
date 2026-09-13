import React, { useState, useRef, useEffect } from 'react';
import { MpiConfig } from '../types';
import { DAFTAR_MATA_PELAJARAN, DAFTAR_KELAS, DAFTAR_FASE } from '../data/subjectOptions';
import { sound } from '../utils/audio';
import { bgm, BGM_TRACKS, BgmTrackType } from '../utils/bgmEngine';
import { 
  UserCheck, 
  School, 
  BookOpen, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  Clock, 
  Award,
  Eye,
  Layers,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
  Check,
  RotateCcw,
  FileBadge,
  Phone,
  Briefcase,
  HelpCircle,
  Smartphone,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sliders,
  FileAudio
} from 'lucide-react';

interface IdentitasEditorProps {
  config: MpiConfig;
  onChangeConfig: (newConfig: MpiConfig) => void;
  onGoToPreview: () => void;
}

// Preset Avatar Cepat untuk Pendidik & Pengembang
const AVATAR_PRESETS = [
  {
    label: 'Guru Pria',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Guru Wanita',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Pendidik Muda',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'
  },
  {
    label: 'Ilustrasi Edukasi',
    url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=300&q=80'
  }
];

export const IdentitasEditor: React.FC<IdentitasEditorProps> = ({
  config,
  onChangeConfig,
  onGoToPreview
}) => {
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [bgmStatus, setBgmStatus] = useState(bgm.getStatus());
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = bgm.subscribe(() => {
      setBgmStatus(bgm.getStatus());
    });
    return unsub;
  }, []);

  const handleChange = (field: keyof MpiConfig, value: any) => {
    const updated = {
      ...config,
      [field]: value
    };

    // Auto-sync field alias untuk kompatibilitas data
    if (field === 'namaPengembang') {
      updated.penyusun = value;
    } else if (field === 'penyusun') {
      updated.namaPengembang = value;
    }

    if (field === 'sekolah') {
      updated.instansi = value;
    } else if (field === 'instansi') {
      updated.sekolah = value;
    }

    onChangeConfig(updated);
    showSaveToast();
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file audio terlalu besar (> 8MB). Silakan gunakan file MP3 ringkas agar media pembelajaran tetap ringan.');
      return;
    }

    sound.playSuccess();
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64Audio = reader.result;
        bgm.setCustomAudio(base64Audio);
        if (!bgmStatus.isPlaying) {
          bgm.play();
        }
        onChangeConfig({
          ...config,
          bgmTrack: 'custom',
          customAudioUrl: base64Audio,
          customAudioName: file.name
        });
        showSaveToast();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectBgmTrack = (trackId: BgmTrackType) => {
    sound.playClick();
    bgm.setTrack(trackId, trackId === 'custom' ? config.customAudioUrl : undefined);
    if (!bgmStatus.isPlaying) {
      bgm.play();
    }
    onChangeConfig({
      ...config,
      bgmTrack: trackId
    });
    showSaveToast();
  };

  const showSaveToast = () => {
    setSaveSuccessMsg(true);
    setTimeout(() => {
      setSaveSuccessMsg(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto terlalu besar. Mohon pilih foto berukuran di bawah 2MB agar media offline tetap ringan.');
        return;
      }
      sound.playClick();
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          handleChange('fotoProfil', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetToExample = () => {
    sound.playSuccess();
    onChangeConfig({
      ...config,
      namaPengembang: "Aji Sosiologi, S.Pd., M.Pd.",
      penyusun: "Aji Sosiologi, S.Pd., M.Pd.",
      jabatan: "Guru Pengampu Sosiologi & Fasilitator Pembelajaran",
      nip: "19840512 200801 1 003",
      sekolah: "SMA Negeri Unggulan 1 Indonesia",
      instansi: "SMA Negeri Unggulan 1 Indonesia",
      mediaSosial: "YouTube: Sosiologi Edukasi • IG: @ajisosiologi",
      kontak: "ajisosiologi84@gmail.com",
      fotoProfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      kkm: 75,
      durasiMenit: 45
    });
    showSaveToast();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      
      {/* Page Title & Status Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              Langkah 1 • Metadata & Identitas MPI
            </span>
            <span className="text-xs text-slate-500 font-medium">Kurikulum Merdeka</span>
            {saveSuccessMsg && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 animate-fade-in">
                <Check size={12} /> Tersimpan
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Identitas Karya & Pendidik Pengembang MPI
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Kelola profil pendidik pengembang dan rincian kurikulum media interaktif Anda. Semua perubahan otomatis tersinkronisasi dan tercetak pada tajuk, gerbang pembuka, sertifikat, serta berkas ekspor HTML 100% offline.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="identitas-preview-btn"
            onClick={() => {
              sound.playClick();
              onGoToPreview();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition"
          >
            <Eye size={16} />
            <span>Buka Live Preview</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form Area (2 Kolom) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* =========================================================================
              BAGIAN 1: IDENTITAS KARYA MEDIA PEMBELAJARAN (KURIKULUM MERDEKA)
             ========================================================================= */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" />
                <span>1. Identitas Karya Media Pembelajaran</span>
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Data Kurikulum
              </span>
            </div>

            {/* NAMA / Judul Karya MPI */}
            <div>
              <label htmlFor="input-judul" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                NAMA (Judul Karya MPI) <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-judul"
                type="text"
                value={config.judul ?? ''}
                onChange={(e) => handleChange('judul', e.target.value)}
                placeholder="Contoh: Kelompok Sosial di Masyarakat"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold bg-slate-50/50"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Judul utama modul interaktif yang akan tampil di tajuk atas dan halaman muka.
              </span>
            </div>

            {/* Mata Pelajaran (Dropdown) */}
            <div>
              <label htmlFor="input-mapel" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Mata Pelajaran <span className="text-rose-500">*</span>
              </label>
              <select
                id="input-mapel"
                value={config.mataPelajaran ?? 'Sosiologi'}
                onChange={(e) => {
                  sound.playClick();
                  handleChange('mataPelajaran', e.target.value);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {DAFTAR_MATA_PELAJARAN.map((mp) => (
                  <option key={mp} value={mp}>
                    {mp}
                  </option>
                ))}
              </select>
            </div>

            {/* Kelas & Fase (Side by side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="input-kelas" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  Kelas (X / XI / XII) <span className="text-rose-500">*</span>
                </label>
                <select
                  id="input-kelas"
                  value={config.kelas ?? 'Kelas XI'}
                  onChange={(e) => {
                    sound.playClick();
                    handleChange('kelas', e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {DAFTAR_KELAS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="input-fase" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  Fase (E / F) <span className="text-rose-500">*</span>
                </label>
                <select
                  id="input-fase"
                  value={config.fase ?? 'Fase F'}
                  onChange={(e) => {
                    sound.playClick();
                    handleChange('fase', e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {DAFTAR_FASE.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Topik Materi / Elemen / Materi */}
            <div>
              <label htmlFor="input-topik" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Topik Materi / Elemen / Materi <span className="text-rose-500">*</span>
              </label>
              <input
                id="input-topik"
                type="text"
                value={config.topikMateri ?? ''}
                onChange={(e) => handleChange('topikMateri', e.target.value)}
                placeholder="Contoh: Kelompok Sosial di Masyarakat & Dinamika Kelompok"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Tujuan Pembelajaran / Sub-elemen / Submateri */}
            <div>
              <label htmlFor="input-tp" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                Tujuan Pembelajaran / Sub-elemen / Submateri <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="input-tp"
                rows={3}
                value={config.tujuanPembelajaran ?? ''}
                onChange={(e) => handleChange('tujuanPembelajaran', e.target.value)}
                placeholder="Contoh: Peserta didik mampu menganalisis hakikat, syarat pembentukan, ragam klasifikasi, serta dinamika kelompok sosial dan kepemimpinan dalam konteks masyarakat modern."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 leading-relaxed"
              />
            </div>

          </div>

          {/* =========================================================================
              BAGIAN 2: IDENTITAS PENDIDIK & PENGEMBANG KARYA (LENGKAP & DAPAT DIEDIT)
             ========================================================================= */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500/30 p-5 sm:p-6 shadow-md space-y-5 relative overflow-hidden">
            
            {/* Header Bagian 2 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                    2. Identitas Pendidik & Pengembang Karya
                  </h2>
                  <p className="text-xs text-emerald-700 font-medium">
                    Dapat diedit dan otomatis terintegrasi ke seluruh modul
                  </p>
                </div>
              </div>

              {/* Tombol Isi Contoh Cepat */}
              <button
                type="button"
                onClick={handleResetToExample}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition self-start sm:self-auto cursor-pointer"
                title="Isi dengan contoh format profil guru sosiologi lengkap"
              >
                <Sparkles size={13} className="text-amber-500" />
                <span>Isi Contoh Profil</span>
              </button>
            </div>

            {/* Form Fields Identitas Pendidik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Nama Lengkap & Gelar */}
              <div className="sm:col-span-2">
                <label htmlFor="input-pengembang" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Nama Lengkap Pendidik & Gelar <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">Dicetak di Sertifikat & Tajuk</span>
                </label>
                <input
                  id="input-pengembang"
                  type="text"
                  value={config.namaPengembang ?? config.penyusun ?? ''}
                  onChange={(e) => handleChange('namaPengembang', e.target.value)}
                  placeholder="Contoh: Aji Sosiologi, S.Pd., M.Pd."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-bold bg-slate-50/50"
                />
              </div>

              {/* Jabatan / Peran / Guru Mata Pelajaran */}
              <div>
                <label htmlFor="input-jabatan" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <Briefcase size={13} className="text-emerald-600" />
                  <span>Jabatan / Peran Pendidik</span>
                </label>
                <input
                  id="input-jabatan"
                  type="text"
                  value={config.jabatan ?? ''}
                  onChange={(e) => handleChange('jabatan', e.target.value)}
                  placeholder="Contoh: Guru Sosiologi / Guru Penggerak"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* NIP / NUPTK (Opsional) */}
              <div>
                <label htmlFor="input-nip" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <FileBadge size={13} className="text-emerald-600" />
                  <span>NIP / NUPTK / ID Guru (Opsional)</span>
                </label>
                <input
                  id="input-nip"
                  type="text"
                  value={config.nip ?? ''}
                  onChange={(e) => handleChange('nip', e.target.value)}
                  placeholder="Contoh: 19840512 200801 1 003"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Asal Sekolah / Instansi */}
              <div className="sm:col-span-2">
                <label htmlFor="input-sekolah" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <School size={13} className="text-emerald-600" />
                  <span>Asal Sekolah / Lembaga Pendidikan <span className="text-rose-500">*</span></span>
                </label>
                <input
                  id="input-sekolah"
                  type="text"
                  value={config.sekolah ?? config.instansi ?? ''}
                  onChange={(e) => handleChange('sekolah', e.target.value)}
                  placeholder="Contoh: SMA Negeri Unggulan 1 Indonesia"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold"
                />
              </div>

              {/* Media Sosial & Kanal Publikasi */}
              <div>
                <label htmlFor="input-medsos" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <Share2 size={13} className="text-emerald-600" />
                  <span>Media Sosial / Kanal Edukasi</span>
                </label>
                <input
                  id="input-medsos"
                  type="text"
                  value={config.mediaSosial ?? ''}
                  onChange={(e) => handleChange('mediaSosial', e.target.value)}
                  placeholder="Contoh: @ajisosiologi / YouTube: Sosiologi Edukasi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              {/* Kontak WhatsApp / Email */}
              <div>
                <label htmlFor="input-kontak" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <Phone size={13} className="text-emerald-600" />
                  <span>Kontak Email / WhatsApp (Opsional)</span>
                </label>
                <input
                  id="input-kontak"
                  type="text"
                  value={config.kontak ?? ''}
                  onChange={(e) => handleChange('kontak', e.target.value)}
                  placeholder="Contoh: ajisosiologi84@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

            </div>

            {/* Pengaturan Foto Profil Pengembang (File Upload, Presets, URL) */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 via-slate-50 to-teal-50/70 border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Camera size={15} className="text-emerald-600" />
                  <span>8. Foto Profil Pengembang Karya (Offline-Ready)</span>
                </label>
                <span className="text-[11px] text-emerald-700 font-semibold">Tampil di layar pembuka & footer</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                
                {/* Lingkaran Pratinjau Foto */}
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-white flex items-center justify-center relative">
                    {config.fotoProfil ? (
                      <img 
                        src={config.fotoProfil} 
                        alt={config.namaPengembang || 'Pengembang'} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <UserCheck size={28} className="text-emerald-500" />
                        <span className="text-[10px] font-bold mt-1 text-slate-500">Tanpa Foto</span>
                      </div>
                    )}
                  </div>

                  {config.fotoProfil && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        handleChange('fotoProfil', '');
                      }}
                      title="Hapus foto profil"
                      className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>

                {/* Tombol Unggah File & Presets */}
                <div className="flex-1 w-full space-y-2.5">
                  
                  {/* Action Bar: Upload File & Preset Selection */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition active:scale-98">
                      <Upload size={14} />
                      <span>Unggah Foto dari Laptop (JPG/PNG)</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>

                    {config.fotoProfil && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          handleChange('fotoProfil', '');
                        }}
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>

                  {/* Pilihan Avatar Siap Pakai */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block mb-1">
                      Atau pilih avatar default cepat:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            handleChange('fotoProfil', preset.url);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                            config.fotoProfil === preset.url
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="w-4 h-4 rounded-full object-cover" />
                          <span>{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input URL Alternatif */}
                  <div>
                    <input
                      type="text"
                      value={config.fotoProfil ?? ''}
                      onChange={(e) => handleChange('fotoProfil', e.target.value)}
                      placeholder="Atau tempelkan tautan URL gambar (https://...)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                </div>
              </div>
            </div>

            {/* KKM & Durasi Pembelajaran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <label htmlFor="input-kkm" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <Award size={14} className="text-emerald-600" />
                  <span>Kriteria Kelulusan Minimal (KKM)</span>
                </label>
                <div className="relative">
                  <input
                    id="input-kkm"
                    type="number"
                    min="0"
                    max="100"
                    value={config.kkm ?? 75}
                    onChange={(e) => handleChange('kkm', parseInt(e.target.value, 10) || 75)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-black focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">Poin</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Nilai ambang kelulusan untuk memperoleh predikat TUNTAS pada kuis evaluasi.
                </span>
              </div>

              <div>
                <label htmlFor="input-durasi" className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
                  <Clock size={14} className="text-emerald-600" />
                  <span>Estimasi Durasi Belajar (Menit)</span>
                </label>
                <div className="relative">
                  <input
                    id="input-durasi"
                    type="number"
                    min="5"
                    max="240"
                    value={config.durasiMenit ?? 45}
                    onChange={(e) => handleChange('durasiMenit', parseInt(e.target.value, 10) || 45)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm font-black focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">Menit</span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Waktu acuan bagi peserta didik dalam mempelajari modul dan latihan soal.
                </span>
              </div>
            </div>

            {/* PENGATURAN MUSIK LATAR BELAKANG (BGM OFFLINE) */}
            <div className="pt-4 border-t border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    <Music size={16} />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-800 block">
                      Musik Latar Pengiring (BGM Offline)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Otomatis tertanam ke berkas HTML ekspor offline
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      bgm.togglePlay();
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition ${
                      bgmStatus.isPlaying
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                    }`}
                  >
                    {bgmStatus.isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    <span>{bgmStatus.isPlaying ? 'Jeda' : 'Putar Tes'}</span>
                  </button>
                </div>
              </div>

              {/* Offline Badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-900">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>
                  <strong>100% Bebas Kuota:</strong> Synthesizer beroperasi langsung melalui Web Audio API peramban siswa tanpa butuh unduh MP3 eksternal.
                </span>
              </div>

              {/* Track Selector Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BGM_TRACKS.map(t => {
                  const isSelected = (config.bgmTrack || 'lofi') === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectBgmTrack(t.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-teal-50 border-teal-500 text-teal-950 ring-2 ring-teal-400/30'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-base mb-1">{t.icon}</div>
                      <div className="font-extrabold text-xs text-slate-900 truncate">{t.title}</div>
                      <div className="text-[10px] text-teal-700 font-bold uppercase">{t.genre}</div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Audio Upload Row */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                <input
                  type="file"
                  ref={audioInputRef}
                  onChange={handleAudioUpload}
                  accept="audio/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-dashed border-teal-400 bg-teal-50/40 hover:bg-teal-50 text-teal-800 text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <FileAudio size={15} />
                  <span>Unggah Audio MP3 Sendiri</span>
                </button>

                {config.customAudioUrl && (
                  <div className="flex-1 flex items-center justify-between gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                    <span className="truncate text-slate-700 font-bold">🎵 {config.customAudioName || 'Audio Kustom Tersimpan'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        handleChange('customAudioUrl', undefined);
                        handleChange('customAudioName', undefined);
                        handleSelectBgmTrack('lofi');
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1"
                      title="Hapus"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================================
            KOLOM KANAN: LIVE PREVIEW KARTU IDENTITAS REALTIME
           ========================================================================= */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4 sticky top-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Sparkles size={14} /> Pratinjau Identitas Realtime
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 size={11} /> Sinkron Langsung
              </span>
            </div>

            {/* Header Mockup */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase font-bold text-amber-400">
                  {config.mataPelajaran || 'Mata Pelajaran'} • {config.fase} ({config.kelas})
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full font-bold">
                  KKM: {config.kkm}
                </span>
              </div>
              <div className="text-base font-black leading-snug text-white">
                {config.judul || 'Judul Karya MPI'}
              </div>
              <div className="text-xs text-slate-300 font-medium line-clamp-2">
                Topik: {config.topikMateri || '-'}
              </div>
            </div>

            {/* Author Card Mockup */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900/90 border border-indigo-500/30 space-y-3">
              <span className="text-[10px] font-black uppercase text-cyan-300 tracking-wider block">
                Profil Pendidik Pengembang Karya:
              </span>
              
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-400 shrink-0 bg-slate-800 flex items-center justify-center shadow-md">
                  {config.fotoProfil ? (
                    <img
                      src={config.fotoProfil}
                      alt={config.namaPengembang || 'Pengembang'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  ) : (
                    <span className="text-lg font-black text-emerald-300">
                      {((config.namaPengembang || config.penyusun || 'P').charAt(0)).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-extrabold text-white text-sm truncate">
                    {config.namaPengembang || config.penyusun || 'Nama Pendidik'}
                  </div>
                  {config.jabatan && (
                    <div className="text-xs text-emerald-300 font-semibold truncate">
                      {config.jabatan}
                    </div>
                  )}
                  <div className="text-xs text-slate-300 truncate">
                    {config.sekolah || config.instansi || 'Nama Sekolah / Instansi'}
                  </div>
                  {config.nip && (
                    <div className="text-[10px] text-slate-400 truncate">
                      NIP: {config.nip}
                    </div>
                  )}
                </div>
              </div>

              {/* Media Sosial & Kontak */}
              {(config.mediaSosial || config.kontak) && (
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-cyan-200/90 space-y-0.5">
                  {config.mediaSosial && (
                    <div className="truncate flex items-center gap-1.5">
                      <Share2 size={12} className="text-cyan-400 shrink-0" />
                      <span>{config.mediaSosial}</span>
                    </div>
                  )}
                  {config.kontak && (
                    <div className="truncate flex items-center gap-1.5 text-slate-300">
                      <Phone size={12} className="text-emerald-400 shrink-0" />
                      <span>{config.kontak}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tujuan Pembelajaran Box */}
            <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-700/40 text-xs text-blue-100">
              <div className="flex items-center gap-1.5 font-bold text-blue-300 uppercase tracking-wider text-[10px] mb-1">
                <Target size={13} /> Tujuan Pembelajaran:
              </div>
              <p className="line-clamp-4 leading-relaxed text-[11px] text-slate-300">
                {config.tujuanPembelajaran || 'Tujuan pembelajaran akan ditampilkan di sini.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  sound.playSuccess();
                  onGoToPreview();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-98"
              >
                <CheckCircle2 size={16} />
                <span>Simpan & Buka Pratinjau MPI</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
