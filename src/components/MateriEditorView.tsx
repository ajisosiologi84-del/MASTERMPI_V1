import React, { useState } from 'react';
import { MateriItem, SoalLatih, MpiConfig } from '../types';
import { sound } from '../utils/audio';
import { MediaAnimasiManager } from './MediaAnimasiManager';
import { MateriSynthesizerModal } from './MateriSynthesizerModal';
import { getMateriIconBadge, AVAILABLE_MATERI_ICONS } from '../utils/iconHelper';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Eye, 
  Sparkles, 
  Wand2, 
  AlertTriangle,
  ChevronRight,
  Smile
} from 'lucide-react';

interface MateriEditorViewProps {
  materiList: MateriItem[];
  onUpdateMateriList: (list: MateriItem[]) => void;
  onGoToPreview: () => void;
  soalList?: SoalLatih[];
  config?: MpiConfig;
}

export const MateriEditorView: React.FC<MateriEditorViewProps> = ({
  materiList,
  onUpdateMateriList,
  onGoToPreview,
  soalList = [],
  config
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [deleteConfirmIdx, setDeleteConfirmIdx] = useState<number | null>(null);

  const safeIdx = Math.min(activeIdx, Math.max(0, materiList.length - 1));
  const currentItem = materiList[safeIdx];

  const handleUpdateCurrent = (field: keyof MateriItem, value: any) => {
    const updated = [...materiList];
    updated[safeIdx] = {
      ...updated[safeIdx],
      [field]: value
    };
    onUpdateMateriList(updated);
  };

  const handleUpdateKuisMini = (field: string, value: any) => {
    const updated = [...materiList];
    updated[safeIdx] = {
      ...updated[safeIdx],
      kuisMini: {
        ...updated[safeIdx].kuisMini,
        [field]: value
      }
    };
    onUpdateMateriList(updated);
  };

  const handleUpdateKuisOption = (optionIdx: number, val: string) => {
    const updated = [...materiList];
    const newOptions = [...updated[safeIdx].kuisMini.opsi];
    newOptions[optionIdx] = val;
    updated[safeIdx] = {
      ...updated[safeIdx],
      kuisMini: {
        ...updated[safeIdx].kuisMini,
        opsi: newOptions
      }
    };
    onUpdateMateriList(updated);
  };

  const handleAddMateri = () => {
    sound.playClick();
    const newId = materiList.length > 0 ? Math.max(...materiList.map(m => m.id)) + 1 : 1;
    const newMateri: MateriItem = {
      id: newId,
      judul: `Sub-Materi ${newId}: Topik Bahasan Baru`,
      kategori: 'Kurikulum Merdeka',
      ikon: 'BookOpen',
      ringkasan: 'Tuliskan ringkasan pokok materi di sini untuk pengantar peserta didik.',
      poinKunci: [
        'Konsep Dasar 1',
        'Ciri atau Karakteristik 2',
        'Contoh Nyata di Masyarakat 3'
      ],
      penjelasanLengkap: [
        'Paragraf penjelasan 1: Uraian materi terperinci.',
        'Paragraf penjelasan 2: Hubungan konsep dengan konteks kehidupan sehari-hari.'
      ],
      studiKasus: {
        judul: 'Studi Kasus Kontekstual',
        deskripsi: 'Deskripsikan studi kasus atau fenomena kontekstual yang relevan dengan topik ini.'
      },
      kuisMini: {
        tanya: 'Apakah konsep utama dari sub-materi ini?',
        opsi: ['Pilihan Jawaban A', 'Pilihan Jawaban B', 'Pilihan Jawaban C', 'Pilihan Jawaban D'],
        kunci: 0,
        penjelasan: 'Penjelasan mengapa pilihan A adalah jawaban yang tepat.'
      }
    };

    const updated = [...materiList, newMateri];
    onUpdateMateriList(updated);
    setActiveIdx(updated.length - 1);
    sound.playSuccess();
  };

  const executeDeleteMateri = () => {
    if (deleteConfirmIdx === null) return;
    if (materiList.length <= 1) {
      sound.playError();
      setDeleteConfirmIdx(null);
      return;
    }
    sound.playClick();
    const updated = materiList.filter((_, i) => i !== deleteConfirmIdx);
    onUpdateMateriList(updated);
    setActiveIdx(Math.max(0, deleteConfirmIdx - 1));
    setDeleteConfirmIdx(null);
  };

  const handleApplySynthesized = (generated: MateriItem[], replaceAll: boolean) => {
    if (replaceAll) {
      onUpdateMateriList(generated);
      setActiveIdx(0);
    } else {
      const highestId = materiList.length > 0 ? Math.max(...materiList.map(m => m.id)) : 0;
      const remapped = generated.map((m, idx) => ({
        ...m,
        id: highestId + idx + 1
      }));
      onUpdateMateriList([...materiList, ...remapped]);
    }
    sound.playSuccess();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      
      {/* Header Bar */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              Langkah 2 • Penyusun Materi
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Daftar Sub-Materi (5 Bab Kurikulum Merdeka)
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="text-blue-600" size={26} />
            <span>Penyusun Modul Materi Pembelajaran</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Kelola judul bab, ikon visual, ringkasan teori, poin-poin kunci, narasi kontekstual, studi kasus, serta kuis mini refleksi pemahaman siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Automatic Generator Button from Soal */}
          <button
            id="btn-auto-generate-materi"
            onClick={() => {
              sound.playClick();
              setIsAutoModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition"
            title="Otomatis susun 5 Bab materi berdasarkan kumpulan soal evaluasi"
          >
            <Sparkles size={15} className="text-amber-300 animate-pulse" />
            <span>Susun Otomatis dari Soal</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
              {soalList.length} Soal
            </span>
          </button>

          <button
            onClick={handleAddMateri}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
          >
            <Plus size={15} />
            <span>Tambah Bab</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoToPreview();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Eye size={15} />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {/* Auto Generator Banner Promotion */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
            <Wand2 size={20} />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-xs sm:text-sm">
              ✨ Solusi Otomatis Penyusun 5 Bab Modul Pembelajaran
            </div>
            <div className="text-slate-600 text-xs">
              Miliki bank soal? Sistem dapat menyarikan kompetensi, wacana stimulus, pembahasan mendalam, dan kuis mini menjadi 5 Bab Sub-Materi terstruktur seketika!
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsAutoModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 flex items-center gap-1.5"
        >
          <Sparkles size={14} className="text-amber-300" />
          <span>Buka Penyusun Otomatis</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Submateri Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Layers size={14} className="text-blue-600" />
                <span>Daftar Sub-Materi ({materiList.length} Bab)</span>
              </span>
            </div>

            <div className="space-y-2.5">
              {materiList.map((m, idx) => {
                const isCurrent = idx === safeIdx;
                const badge = getMateriIconBadge(m, idx, 16);

                return (
                  <div
                    key={m.id || idx}
                    className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-2.5 cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50/90 border-blue-500 shadow-sm ring-1 ring-blue-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                    }`}
                    onClick={() => {
                      sound.playClick();
                      setActiveIdx(idx);
                    }}
                  >
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      {/* Engaging Icon for this Bab */}
                      <div className={`p-2 rounded-xl shrink-0 ${badge.bgClass} border ${badge.borderClass}`}>
                        {badge.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                            isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            Bab {idx + 1}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold truncate">
                            {m.kategori}
                          </span>
                        </div>
                        <div className={`text-xs font-bold truncate ${
                          isCurrent ? 'text-blue-950 font-black' : 'text-slate-800'
                        }`}>
                          {m.judul}
                        </div>
                      </div>
                    </div>

                    {materiList.length > 1 && (
                      <button
                        title="Hapus Bab Ini"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmIdx(idx);
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

        {/* Right Form Editor (8 cols) */}
        <div className="lg:col-span-8">
          {currentItem ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              {/* Header Editor with Icon Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700">
                    {getMateriIconBadge(currentItem, safeIdx, 24).icon}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                      Editor Bab {safeIdx + 1} • {currentItem.kategori}
                    </span>
                    <h2 className="text-lg font-black text-slate-900 leading-snug">
                      {currentItem.judul}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Icon & Category Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ikon Menarik Sub-Materi:
                  </label>
                  <select
                    value={currentItem.ikon || 'BookOpen'}
                    onChange={(e) => handleUpdateCurrent('ikon', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
                  >
                    {AVAILABLE_MATERI_ICONS.map(ic => (
                      <option key={ic.id} value={ic.id}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kategori / Alur Bab:
                  </label>
                  <input
                    type="text"
                    value={currentItem.kategori}
                    onChange={(e) => handleUpdateCurrent('kategori', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-800"
                    placeholder="Contoh: Fondasi Teori, Tipologi Sosial, Harmoni"
                  />
                </div>
              </div>

              {/* Judul Bab */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Lengkap Bab Sub-Materi:
                </label>
                <input
                  type="text"
                  value={currentItem.judul}
                  onChange={(e) => handleUpdateCurrent('judul', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-white text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Ringkasan Intisari */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan Intisari Materi (Executive Summary):
                </label>
                <textarea
                  rows={3}
                  value={currentItem.ringkasan}
                  onChange={(e) => handleUpdateCurrent('ringkasan', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Poin Kunci Kurikulum */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Poin Kunci Capaian Pembelajaran (Pisahkan per baris):
                </label>
                <textarea
                  rows={3}
                  value={currentItem.poinKunci.join('\n')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').filter(l => l.trim().length > 0);
                    handleUpdateCurrent('poinKunci', lines);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 font-mono leading-relaxed"
                />
              </div>

              {/* Penjelasan Lengkap (Paragraf Teori) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Uraian Penjelasan Lengkap (Pisahkan antarparagraf dengan baris baru):
                </label>
                <textarea
                  rows={5}
                  value={currentItem.penjelasanLengkap.join('\n\n')}
                  onChange={(e) => {
                    const paragraphs = e.target.value.split(/\n\s*\n/).filter(p => p.trim().length > 0);
                    handleUpdateCurrent('penjelasanLengkap', paragraphs);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 leading-relaxed"
                />
              </div>

              {/* Studi Kasus */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                  Studi Kasus Kontekstual Bab Ini:
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Judul Kasus:
                  </label>
                  <input
                    type="text"
                    value={currentItem.studiKasus.judul}
                    onChange={(e) => handleUpdateCurrent('studiKasus', {
                      ...currentItem.studiKasus,
                      judul: e.target.value
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Narasi Kasus / Permasalahan Nyata:
                  </label>
                  <textarea
                    rows={3}
                    value={currentItem.studiKasus.deskripsi}
                    onChange={(e) => handleUpdateCurrent('studiKasus', {
                      ...currentItem.studiKasus,
                      deskripsi: e.target.value
                    })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Kuis Mini Pemahaman Siswa */}
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-amber-900 tracking-wider">
                  <HelpCircle size={15} />
                  <span>Kuis Mini Refleksi Cepat (Checkpoint Siswa):</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Pertanyaan Kuis:
                  </label>
                  <input
                    type="text"
                    value={currentItem.kuisMini.tanya}
                    onChange={(e) => handleUpdateKuisMini('tanya', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-700">
                    Opsi Jawaban & Kunci Benar:
                  </label>
                  {currentItem.kuisMini.opsi.map((op, opIdx) => (
                    <div key={opIdx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateKuisMini('kunci', opIdx)}
                        title="Jadikan Kunci Jawaban Benar"
                        className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition shrink-0 ${
                          currentItem.kuisMini.kunci === opIdx
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {String.fromCharCode(65 + opIdx)}
                      </button>
                      <input
                        type="text"
                        value={op}
                        onChange={(e) => handleUpdateKuisOption(opIdx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Ulasan / Pembahasan Kuis Mini:
                  </label>
                  <input
                    type="text"
                    value={currentItem.kuisMini.penjelasan}
                    onChange={(e) => handleUpdateKuisMini('penjelasan', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-700"
                  />
                </div>
              </div>

              {/* CRUD Media & Animasi MPI untuk Sub-Materi Ini */}
              <MediaAnimasiManager
                titleLabel={`Sub-Materi "${currentItem.judul}"`}
                mediaList={currentItem.mediaList || []}
                animasi={currentItem.animasi || { masuk: 'fade-in', interaksi: 'hover-lift', kecepatan: 'normal' }}
                onUpdateMediaList={(list) => handleUpdateCurrent('mediaList', list)}
                onUpdateAnimasi={(anim) => handleUpdateCurrent('animasi', anim)}
              />

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Pilih sub-materi di samping untuk mengedit.</div>
          )}
        </div>

      </div>

      {/* Confirmation Modal for Delete Bab */}
      {deleteConfirmIdx !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200 animate-scale-up">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-2.5 rounded-xl bg-rose-100">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Hapus Sub-Materi?</h3>
            </div>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus <b>"{materiList[deleteConfirmIdx]?.judul}"</b>? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmIdx(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                onClick={executeDeleteMateri}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intelligent Synthesizer Modal */}
      <MateriSynthesizerModal
        isOpen={isAutoModalOpen}
        onClose={() => setIsAutoModalOpen(false)}
        soalList={soalList}
        config={config}
        onApplyMateri={handleApplySynthesized}
      />

    </div>
  );
};
