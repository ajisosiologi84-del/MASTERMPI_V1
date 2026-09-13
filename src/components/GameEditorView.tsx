import React, { useState } from 'react';
import { GameItem, GameType, SoalLatih, MpiConfig } from '../types';
import { sound } from '../utils/audio';
import { MediaAnimasiManager } from './MediaAnimasiManager';
import { ConfirmDialog } from './ConfirmDialog';
import { GameSynthesizerModal } from './GameSynthesizerModal';
import { getGameIconBadge } from '../utils/iconHelper';
import { 
  Gamepad2, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Eye, 
  Edit3, 
  Flame,
  Layers,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  Shuffle,
  Clock,
  Wand2
} from 'lucide-react';

interface GameEditorViewProps {
  gameList: GameItem[];
  onUpdateGameList: (list: GameItem[]) => void;
  onGoToPreview: () => void;
  soalList?: SoalLatih[];
  config?: MpiConfig;
}

export const GameEditorView: React.FC<GameEditorViewProps> = ({
  gameList,
  onUpdateGameList,
  onGoToPreview,
  soalList = [],
  config
}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [showAddGameModal, setShowAddGameModal] = useState(false);
  const [newGameType, setNewGameType] = useState<GameType>('jodoh');
  const [newGameTitle, setNewGameTitle] = useState('');
  const [deleteTargetGame, setDeleteTargetGame] = useState<GameItem | null>(null);
  const [alertDialog, setAlertDialog] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: ''
  });

  const safeIdx = Math.min(selectedIdx, Math.max(0, gameList.length - 1));
  const currentGame = gameList[safeIdx];

  const handleUpdateCurrent = (field: keyof GameItem, value: any) => {
    const updated = [...gameList];
    updated[safeIdx] = {
      ...updated[safeIdx],
      [field]: value
    };
    onUpdateGameList(updated);
  };

  const handleApplySynthesized = (generated: GameItem[], replaceAll: boolean) => {
    if (replaceAll) {
      onUpdateGameList(generated);
      setSelectedIdx(0);
    } else {
      const highestId = gameList.length > 0 ? Math.max(...gameList.map(g => g.id)) : 0;
      const remapped = generated.map((g, idx) => ({
        ...g,
        id: highestId + idx + 1
      }));
      onUpdateGameList([...gameList, ...remapped]);
    }
    sound.playSuccess();
  };

  // Add a new game
  const handleOpenAddGame = () => {
    sound.playClick();
    setNewGameType('jodoh');
    setNewGameTitle(`Aktivitas Game ${gameList.length + 1}`);
    setShowAddGameModal(true);
  };

  const handleConfirmAddGame = () => {
    if (!newGameTitle.trim()) {
      setAlertDialog({
        isOpen: true,
        message: 'Nama aktivitas game wajib diisi!'
      });
      return;
    }

    sound.playSuccess();
    const nextId = Date.now();
    let newGame: GameItem;

    if (newGameType === 'jodoh') {
      newGame = {
        id: nextId,
        tipe: 'jodoh',
        judul: newGameTitle,
        instruksi: 'Jodohkan istilah sosiologi di kolom kiri dengan pasangan konsep yang tepat di kolom kanan!',
        pasangan: [
          { id: 'p1', kiri: 'Istilah Konsep 1', kanan: 'Uraian definisi atau contoh 1' },
          { id: 'p2', kiri: 'Istilah Konsep 2', kanan: 'Uraian definisi atau contoh 2' },
          { id: 'p3', kiri: 'Istilah Konsep 3', kanan: 'Uraian definisi atau contoh 3' },
        ],
        mediaList: [],
        animasi: { masuk: 'bounce-in', interaksi: 'scale-tap', kecepatan: 'normal' }
      };
    } else if (newGameType === 'klik') {
      newGame = {
        id: nextId,
        tipe: 'klik',
        judul: newGameTitle,
        instruksi: 'Klik hanya opsi yang sesuai dengan kriteria yang diminta!',
        targetKategori: 'Konsep yang Benar',
        itemKlik: [
          { teks: 'Ciri atau Fakta Benar 1', benar: true },
          { teks: 'Pengecoh / Tidak Sesuai 1', benar: false },
          { teks: 'Ciri atau Fakta Benar 2', benar: true },
          { teks: 'Pengecoh / Tidak Sesuai 2', benar: false },
        ],
        mediaList: [],
        animasi: { masuk: 'bounce-in', interaksi: 'scale-tap', kecepatan: 'normal' }
      };
    } else if (newGameType === 'urut') {
      newGame = {
        id: nextId,
        tipe: 'urut',
        judul: newGameTitle,
        instruksi: 'Susun tahapan atau proses berikut secara berurutan dari awal hingga akhir!',
        urutanBenar: [
          'Tahap 1: Pembentukan awal / pengenalan',
          'Tahap 2: Interaksi intensif & kesepakatan norma',
          'Tahap 3: Pelaksanaan peran & keterpaduan sosial',
        ],
        mediaList: [],
        animasi: { masuk: 'bounce-in', interaksi: 'scale-tap', kecepatan: 'normal' }
      };
    } else if (newGameType === 'kumpul') {
      newGame = {
        id: nextId,
        tipe: 'kumpul',
        judul: newGameTitle,
        instruksi: 'Kumpulkan semua kata kunci esensial sebelum waktu habis!',
        itemKumpul: [
          { teks: 'Kata Kunci 1', benar: true, poin: 10 },
          { teks: 'Pengecoh 1', benar: false, poin: -5 },
          { teks: 'Kata Kunci 2', benar: true, poin: 10 },
          { teks: 'Pengecoh 2', benar: false, poin: -5 },
        ],
        mediaList: [],
        animasi: { masuk: 'bounce-in', interaksi: 'scale-tap', kecepatan: 'normal' }
      };
    } else {
      newGame = {
        id: nextId,
        tipe: 'sambung',
        judul: newGameTitle,
        instruksi: 'Hubungkan fenomena sebab dengan akibat sosial yang ditimbulkannya!',
        rantaiLogika: [
          { sebab: 'Sebab / Faktor Pemicu 1', akibat: 'Dampak / Konsekuensi Sosial 1' },
          { sebab: 'Sebab / Faktor Pemicu 2', akibat: 'Dampak / Konsekuensi Sosial 2' },
        ],
        mediaList: [],
        animasi: { masuk: 'bounce-in', interaksi: 'scale-tap', kecepatan: 'normal' }
      };
    }

    const updated = [...gameList, newGame];
    onUpdateGameList(updated);
    setSelectedIdx(updated.length - 1);
    setShowAddGameModal(false);
  };

  // Delete game handler
  const handleRequestDeleteGame = (game: GameItem) => {
    sound.playClick();
    if (gameList.length <= 1) {
      setAlertDialog({
        isOpen: true,
        message: 'MPI harus memiliki minimal 1 aktivitas permainan edukatif.'
      });
      return;
    }
    setDeleteTargetGame(game);
  };

  const handleConfirmDeleteGame = () => {
    if (!deleteTargetGame) return;
    sound.playSuccess();
    const updated = gameList.filter(g => g.id !== deleteTargetGame.id);
    onUpdateGameList(updated);
    setSelectedIdx(Math.max(0, safeIdx - 1));
    setDeleteTargetGame(null);
  };

  // ================= CRUDS FOR SPECIFIC GAME MECHANICS =================

  // 1. Tipe 'jodoh'
  const handleAddPasangan = () => {
    sound.playClick();
    const currentPasangan = currentGame.pasangan ? [...currentGame.pasangan] : [];
    currentPasangan.push({
      id: `p_${Date.now()}`,
      kiri: `Istilah ${currentPasangan.length + 1}`,
      kanan: `Definisi ${currentPasangan.length + 1}`
    });
    handleUpdateCurrent('pasangan', currentPasangan);
  };

  const handleDeletePasangan = (pIdx: number) => {
    sound.playClick();
    const currentPasangan = currentGame.pasangan ? [...currentGame.pasangan] : [];
    if (currentPasangan.length <= 1) {
      setAlertDialog({
        isOpen: true,
        message: 'Permainan menjodohkan harus memiliki minimal 1 pasangan konsep.'
      });
      return;
    }
    currentPasangan.splice(pIdx, 1);
    handleUpdateCurrent('pasangan', currentPasangan);
  };

  const handleUpdatePasangan = (pIdx: number, field: 'kiri' | 'kanan', val: string) => {
    const currentPasangan = currentGame.pasangan ? [...currentGame.pasangan] : [];
    currentPasangan[pIdx] = {
      ...currentPasangan[pIdx],
      [field]: val
    };
    handleUpdateCurrent('pasangan', currentPasangan);
  };

  // 2. Tipe 'klik'
  const handleAddItemKlik = () => {
    sound.playClick();
    const items = currentGame.itemKlik ? [...currentGame.itemKlik] : [];
    items.push({
      teks: `Pilihan Opsi ${items.length + 1}`,
      benar: true
    });
    handleUpdateCurrent('itemKlik', items);
  };

  const handleDeleteItemKlik = (idx: number) => {
    sound.playClick();
    const items = currentGame.itemKlik ? [...currentGame.itemKlik] : [];
    if (items.length <= 1) {
      setAlertDialog({
        isOpen: true,
        message: 'Game kategori klik harus memiliki minimal 1 opsi jawaban.'
      });
      return;
    }
    items.splice(idx, 1);
    handleUpdateCurrent('itemKlik', items);
  };

  const handleUpdateItemKlik = (idx: number, field: 'teks' | 'benar', val: any) => {
    const items = currentGame.itemKlik ? [...currentGame.itemKlik] : [];
    items[idx] = {
      ...items[idx],
      [field]: val
    };
    handleUpdateCurrent('itemKlik', items);
  };

  // 3. Tipe 'urut'
  const handleAddUrutan = () => {
    sound.playClick();
    const steps = currentGame.urutanBenar ? [...currentGame.urutanBenar] : [];
    steps.push(`Tahap ${steps.length + 1}: Deskripsi tahapan baru`);
    handleUpdateCurrent('urutanBenar', steps);
  };

  const handleDeleteUrutan = (idx: number) => {
    sound.playClick();
    const steps = currentGame.urutanBenar ? [...currentGame.urutanBenar] : [];
    if (steps.length <= 1) {
      setAlertDialog({
        isOpen: true,
        message: 'Game urutan harus memiliki minimal 1 tahapan proses.'
      });
      return;
    }
    steps.splice(idx, 1);
    handleUpdateCurrent('urutanBenar', steps);
  };

  const handleUpdateUrutan = (idx: number, val: string) => {
    const steps = currentGame.urutanBenar ? [...currentGame.urutanBenar] : [];
    steps[idx] = val;
    handleUpdateCurrent('urutanBenar', steps);
  };

  const handleMoveUrutan = (idx: number, direction: 'up' | 'down') => {
    sound.playClick();
    const steps = currentGame.urutanBenar ? [...currentGame.urutanBenar] : [];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const temp = steps[idx];
    steps[idx] = steps[targetIdx];
    steps[targetIdx] = temp;
    handleUpdateCurrent('urutanBenar', steps);
  };

  // 4. Tipe 'kumpul'
  const handleAddItemKumpul = () => {
    sound.playClick();
    const items = currentGame.itemKumpul ? [...currentGame.itemKumpul] : [];
    items.push({
      teks: `Kata Kunci ${items.length + 1}`,
      benar: true,
      poin: 10
    });
    handleUpdateCurrent('itemKumpul', items);
  };

  const handleDeleteItemKumpul = (idx: number) => {
    sound.playClick();
    const items = currentGame.itemKumpul ? [...currentGame.itemKumpul] : [];
    if (items.length <= 1) {
      setAlertDialog({
        isOpen: true,
        message: 'Game kumpul kata harus memiliki minimal 1 kata kunci.'
      });
      return;
    }
    items.splice(idx, 1);
    handleUpdateCurrent('itemKumpul', items);
  };

  const handleUpdateItemKumpul = (idx: number, field: 'teks' | 'benar', val: any) => {
    const items = currentGame.itemKumpul ? [...currentGame.itemKumpul] : [];
    items[idx] = {
      ...items[idx],
      [field]: val,
      poin: field === 'benar' ? (val ? 10 : -5) : items[idx].poin
    };
    handleUpdateCurrent('itemKumpul', items);
  };

  // 5. Tipe 'sambung'
  const handleAddRantaiLogika = () => {
    sound.playClick();
    const chains = currentGame.rantaiLogika ? [...currentGame.rantaiLogika] : [];
    chains.push({
      sebab: `Faktor Sebab ${chains.length + 1}`,
      akibat: `Dampak Akibat ${chains.length + 1}`
    });
    handleUpdateCurrent('rantaiLogika', chains);
  };

  const handleDeleteRantaiLogika = (idx: number) => {
    sound.playClick();
    const chains = currentGame.rantaiLogika ? [...currentGame.rantaiLogika] : [];
    if (chains.length <= 1) {
      setAlertDialog({
        isOpen: true,
        message: 'Game sambung kata berantai harus memiliki minimal 1 relasi logis.'
      });
      return;
    }
    chains.splice(idx, 1);
    handleUpdateCurrent('rantaiLogika', chains);
  };

  const handleUpdateRantaiLogika = (idx: number, field: 'sebab' | 'akibat', val: string) => {
    const chains = currentGame.rantaiLogika ? [...currentGame.rantaiLogika] : [];
    chains[idx] = {
      ...chains[idx],
      [field]: val
    };
    handleUpdateCurrent('rantaiLogika', chains);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      
      {/* Header Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-teal-100 text-teal-800">
              Langkah 3 • Gamifikasi Edukatif
            </span>
            <span className="text-xs text-slate-500 font-medium">Interaktif & Real-Time</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Gamepad2 className="text-teal-600" size={26} />
            <span>Penyusun Modul Bermain & Simulasi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Kelola, edit, tambah, dan hapus seluruh aktivitas gamifikasi edukatif (Menjodohkan konsep, Klik tepat kategori, Urutkan tahapan, Kumpulkan kata kunci, dan Sambung kata berantai).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Automatic Game Generator Button from Soal */}
          <button
            id="btn-auto-generate-games"
            onClick={() => {
              sound.playClick();
              setIsAutoModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition"
            title="Otomatis susun 5 aktivitas game interaktif berdasarkan kumpulan soal evaluasi"
          >
            <Sparkles size={15} className="text-amber-300 animate-pulse" />
            <span>Susun Otomatis dari Soal</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {soalList.length} Soal
            </span>
          </button>

          <button
            onClick={handleOpenAddGame}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
          >
            <Plus size={15} />
            <span>+ Tambah Game</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoToPreview();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Eye size={15} />
            <span>Uji Main di Preview</span>
          </button>
        </div>
      </div>

      {/* Auto Generator Banner Promotion */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
            <Wand2 size={20} />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
              ✨ Solusi Otomatis Penyusun 5 Aktivitas Game Interaktif
            </div>
            <div className="text-slate-600 text-xs">
              Miliki bank soal? Sistem dapat menyarikan pasangan konsep, kuis pilah ciri benar/salah, alur kronologis, kata kunci esensial, dan rantai logika menjadi 5 aktivitas game seketika!
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsAutoModalOpen(true);
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center gap-1.5"
        >
          <Sparkles size={14} className="text-amber-300" />
          <span>Buka Penyusun Otomatis Game</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Game Navigation Pills (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">
                Daftar Game ({gameList.length} Aktivitas)
              </span>
              <button
                type="button"
                onClick={handleOpenAddGame}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <Plus size={13} /> Tambah
              </button>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {gameList.map((g, idx) => {
                const isCurrent = idx === safeIdx;
                const badge = getGameIconBadge(g, idx, 16);
                return (
                  <div
                    key={g.id || idx}
                    onClick={() => {
                      sound.playClick();
                      setSelectedIdx(idx);
                    }}
                    className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-2.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-teal-50/90 border-teal-500 shadow-sm ring-1 ring-teal-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${badge.bgClass} border ${badge.borderClass}`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                            isCurrent ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            Game {idx + 1}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-500">
                            {g.tipe}
                          </span>
                        </div>
                        <div className={`text-xs font-bold truncate ${
                          isCurrent ? 'text-teal-950 font-black' : 'text-slate-800'
                        }`}>
                          {g.judul}
                        </div>
                      </div>
                    </div>

                    {gameList.length > 1 && (
                      <button
                        title="Hapus Game Ini"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestDeleteGame(g);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Editor for Selected Game (8 cols) */}
        <div className="lg:col-span-8">
          {currentGame ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              
              {/* Header Title & Delete Button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl shrink-0 ${getGameIconBadge(currentGame, safeIdx, 24).bgClass} border ${getGameIconBadge(currentGame, safeIdx, 24).borderClass}`}>
                    {getGameIconBadge(currentGame, safeIdx, 24).icon}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-teal-600 tracking-wider">
                      Konfigurasi Game {safeIdx + 1} • {getGameIconBadge(currentGame, safeIdx, 24).label} ({currentGame.tipe.toUpperCase()})
                    </span>
                    <h2 className="text-lg font-black text-slate-900 leading-snug">
                      {currentGame.judul}
                    </h2>
                  </div>
                </div>

                {gameList.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRequestDeleteGame(currentGame)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    <span>Hapus Game</span>
                  </button>
                )}
              </div>

              {/* Judul & Mekanika */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Nama Aktivitas Game
                  </label>
                  <input
                    type="text"
                    value={currentGame.judul}
                    onChange={(e) => handleUpdateCurrent('judul', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                    Mekanika Game
                  </label>
                  <div className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-bold">
                    {currentGame.tipe === 'jodoh' && '1. Menjodohkan Pasangan Istilah'}
                    {currentGame.tipe === 'klik' && '2. Klik Tepat Kategori'}
                    {currentGame.tipe === 'urut' && '3. Susun Urutan Tahapan'}
                    {currentGame.tipe === 'kumpul' && '4. Kumpulkan Kata Kunci'}
                    {currentGame.tipe === 'sambung' && '5. Sambung Kata Berantai'}
                  </div>
                </div>
              </div>

              {/* Instruksi / Prompt */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5">
                  Instruksi / Tantangan bagi Siswa
                </label>
                <textarea
                  rows={2}
                  value={currentGame.instruksi || ''}
                  onChange={(e) => handleUpdateCurrent('instruksi', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
                />
              </div>

              {/* ================= EDITABLE PARAMETERS BASED ON TYPE ================= */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5">
                
                {/* 1. TIPE JODOH */}
                {currentGame.tipe === 'jodoh' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                          Pasangan Istilah (Kolom Kiri & Kolom Kanan):
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Siswa akan menjodohkan konsep di kiri dengan padanannya di kanan secara interaktif.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddPasangan}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                      >
                        <Plus size={13} /> Tambah Pasangan
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {currentGame.pasangan?.map((p, pIdx) => (
                        <div key={p.id || pIdx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {pIdx + 1}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                            <input
                              type="text"
                              value={p.kiri}
                              onChange={(e) => handleUpdatePasangan(pIdx, 'kiri', e.target.value)}
                              placeholder="Istilah / Konsep (Kiri)..."
                              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                            />
                            <input
                              type="text"
                              value={p.kanan}
                              onChange={(e) => handleUpdatePasangan(pIdx, 'kanan', e.target.value)}
                              placeholder="Definisi / Contoh (Kanan)..."
                              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeletePasangan(pIdx)}
                            title="Hapus Pasangan Ini"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. TIPE KLIK KATEGORI */}
                {currentGame.tipe === 'klik' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                          Pilihan Item Jawaban & Kategori Target:
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Tentukan teks opsi dan tandai apakah opsi tersebut adalah jawaban BENAR (✓) atau PENGECOH (✗).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddItemKlik}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                      >
                        <Plus size={13} /> Tambah Opsi
                      </button>
                    </div>

                    <div className="mb-2">
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Kategori Target yang Harus Diklik:
                      </label>
                      <input
                        type="text"
                        value={currentGame.targetKategori || ''}
                        onChange={(e) => handleUpdateCurrent('targetKategori', e.target.value)}
                        placeholder="Contoh: Ciri-Ciri Kelompok Primer / Paguyuban"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      {currentGame.itemKlik?.map((item, iIdx) => (
                        <div key={iIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              handleUpdateItemKlik(iIdx, 'benar', !item.benar);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                              item.benar
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                            title="Klik untuk mengubah status Benar / Pengecoh"
                          >
                            {item.benar ? <Check size={13} /> : <X size={13} />}
                            <span>{item.benar ? 'Benar' : 'Pengecoh'}</span>
                          </button>

                          <input
                            type="text"
                            value={item.teks}
                            onChange={(e) => handleUpdateItemKlik(iIdx, 'teks', e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
                          />

                          <button
                            type="button"
                            onClick={() => handleDeleteItemKlik(iIdx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. TIPE URUTAN TAHAPAN */}
                {currentGame.tipe === 'urut' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                          Tahapan Urutan Kronologis yang Benar:
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Urutkan langkah di bawah ini dari tahap 1 hingga selesai. Siswa akan menyusunnya secara interaktif.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddUrutan}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                      >
                        <Plus size={13} /> Tambah Tahap
                      </button>
                    </div>

                    <div className="space-y-2">
                      {currentGame.urutanBenar?.map((step, sIdx) => (
                        <div key={sIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-black flex items-center justify-center text-xs shrink-0">
                            {sIdx + 1}
                          </span>

                          <input
                            type="text"
                            value={step}
                            onChange={(e) => handleUpdateUrutan(sIdx, e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-800"
                          />

                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              disabled={sIdx === 0}
                              onClick={() => handleMoveUrutan(sIdx, 'up')}
                              className="p-1.5 rounded text-slate-500 hover:text-teal-700 disabled:opacity-30 transition"
                              title="Pindah ke Atas"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={sIdx === (currentGame.urutanBenar?.length || 0) - 1}
                              onClick={() => handleMoveUrutan(sIdx, 'down')}
                              className="p-1.5 rounded text-slate-500 hover:text-teal-700 disabled:opacity-30 transition"
                              title="Pindah ke Bawah"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUrutan(sIdx)}
                              className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Hapus Tahap Ini"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. TIPE KUMPUL KATA KUNCI */}
                {currentGame.tipe === 'kumpul' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                          Daftar Kata Kunci (Valid & Pengecoh):
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Tandai kata kunci yang bernilai poin (+10) dan kata pengacau/pengecoh (-5).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddItemKumpul}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                      >
                        <Plus size={13} /> Tambah Kata
                      </button>
                    </div>

                    <div className="space-y-2">
                      {currentGame.itemKumpul?.map((item, kIdx) => (
                        <div key={kIdx} className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              handleUpdateItemKumpul(kIdx, 'benar', !item.benar);
                            }}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition shrink-0 flex items-center gap-1 ${
                              item.benar
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                            title="Klik untuk mengubah status Valid / Pengecoh"
                          >
                            <span>{item.benar ? '★ Kata Valid (+10)' : '✗ Pengecoh (-5)'}</span>
                          </button>

                          <input
                            type="text"
                            value={item.teks}
                            onChange={(e) => handleUpdateItemKumpul(kIdx, 'teks', e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800"
                          />

                          <button
                            type="button"
                            onClick={() => handleDeleteItemKumpul(kIdx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. TIPE SAMBUNG KATA BERANTAI */}
                {currentGame.tipe === 'sambung' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                          Rantai Logika Sebab - Akibat:
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Tuliskan hubungan kausalitas fenomena sosiologis untuk disambungkan oleh siswa.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddRantaiLogika}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                      >
                        <Plus size={13} /> Tambah Rantai
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {currentGame.rantaiLogika?.map((chain, cIdx) => (
                        <div key={cIdx} className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                            {cIdx + 1}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                            <input
                              type="text"
                              value={chain.sebab}
                              onChange={(e) => handleUpdateRantaiLogika(cIdx, 'sebab', e.target.value)}
                              placeholder="Faktor Pemicu / Sebab..."
                              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900"
                            />
                            <input
                              type="text"
                              value={chain.akibat}
                              onChange={(e) => handleUpdateRantaiLogika(cIdx, 'akibat', e.target.value)}
                              placeholder="Dampak Sosial / Akibat..."
                              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-700"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteRantaiLogika(cIdx)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* CRUD Media & Efek Animasi Gamifikasi */}
              <MediaAnimasiManager
                titleLabel={`Game "${currentGame.judul}"`}
                mediaList={currentGame.mediaList || []}
                animasi={currentGame.animasi || { masuk: 'bounce-in', interaksi: 'scale-tap', kecepatan: 'normal' }}
                onUpdateMediaList={(list) => handleUpdateCurrent('mediaList', list)}
                onUpdateAnimasi={(anim) => handleUpdateCurrent('animasi', anim)}
              />

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Pilih game untuk melihat detail.</div>
          )}
        </div>

      </div>

      {/* ================= MODAL TAMBAH GAME BARU ================= */}
      {showAddGameModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-tap">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2 text-slate-900 font-black">
                <Gamepad2 size={20} className="text-teal-600" />
                <span>Tambah Aktivitas Permainan Baru</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddGameModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Judul Aktivitas Game *
                </label>
                <input
                  type="text"
                  value={newGameTitle}
                  onChange={(e) => setNewGameTitle(e.target.value)}
                  placeholder="Contoh: Menjodohkan Paguyuban vs Patembayan"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[10px]">
                  Pilih Mekanika Permainan
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'jodoh', title: '1. Menjodohkan Pasangan Istilah', desc: 'Hubungkan istilah konsep kiri ke kanan' },
                    { id: 'klik', title: '2. Klik Tepat Kategori', desc: 'Pilih opsi yang sesuai kriteria sasaran' },
                    { id: 'urut', title: '3. Susun Urutan Tahapan', desc: 'Urutkan proses secara kronologis' },
                    { id: 'kumpul', title: '4. Kumpulkan Kata Kunci', desc: 'Klik kata kunci esensial sebelum waktu habis' },
                    { id: 'sambung', title: '5. Sambung Kata Berantai', desc: 'Hubungkan kausalitas sebab dengan akibat' }
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        sound.playClick();
                        setNewGameType(m.id as GameType);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        newGameType === m.id
                          ? 'border-teal-500 bg-teal-50/80 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-slate-900">{m.title}</div>
                      <div className="text-[11px] text-slate-500">{m.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddGameModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAddGame}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Buat Aktivitas Game</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetGame !== null}
        title="Hapus Aktivitas Game?"
        message={`Apakah Anda yakin ingin menghapus permainan "${deleteTargetGame?.judul}"?\n\nSeluruh konfigurasi parameter dan media di dalamnya akan dihapus.`}
        confirmLabel="Ya, Hapus Game"
        cancelLabel="Batal"
        isDanger={true}
        onConfirm={handleConfirmDeleteGame}
        onCancel={() => setDeleteTargetGame(null)}
      />

      {/* Warning/Alert Dialog */}
      <ConfirmDialog
        isOpen={alertDialog.isOpen}
        title="Pemberitahuan"
        message={alertDialog.message}
        mode="alert"
        onConfirm={() => setAlertDialog({ isOpen: false, message: '' })}
        onCancel={() => setAlertDialog({ isOpen: false, message: '' })}
      />

      {/* Automated Game Synthesizer Modal from Soal */}
      <GameSynthesizerModal
        isOpen={isAutoModalOpen}
        onClose={() => setIsAutoModalOpen(false)}
        soalList={soalList}
        config={config}
        onApplyGames={handleApplySynthesized}
      />

    </div>
  );
};
