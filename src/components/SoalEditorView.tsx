import React, { useState } from 'react';
import { SoalLatih } from '../types';
import { sound } from '../utils/audio';
import { MediaAnimasiManager } from './MediaAnimasiManager';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Edit3, 
  HelpCircle, 
  CheckCircle2, 
  Eye, 
  Download, 
  Upload,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { downloadExcelTemplate } from '../utils/excelParser';

interface SoalEditorViewProps {
  soalList: SoalLatih[];
  onUpdateSoalList: (list: SoalLatih[]) => void;
  onGoToUploadExcel: () => void;
  onGoToPreview: () => void;
}

export const SoalEditorView: React.FC<SoalEditorViewProps> = ({
  soalList,
  onUpdateSoalList,
  onGoToUploadExcel,
  onGoToPreview
}) => {
  const [selectedNo, setSelectedNo] = useState(0);

  const safeIdx = Math.min(selectedNo, Math.max(0, soalList.length - 1));
  const currentSoal = soalList[safeIdx];

  const handleUpdateCurrent = (field: keyof SoalLatih, value: any) => {
    const updated = [...soalList];
    updated[safeIdx] = {
      ...updated[safeIdx],
      [field]: value
    };
    onUpdateSoalList(updated);
  };

  const handleUpdateOption = (optIdx: number, val: string) => {
    const updated = [...soalList];
    const currentOptions = updated[safeIdx].opsi ? [...updated[safeIdx].opsi!] : [];
    currentOptions[optIdx] = val;
    updated[safeIdx] = {
      ...updated[safeIdx],
      opsi: currentOptions
    };
    onUpdateSoalList(updated);
  };

  const handleAddQuestion = () => {
    sound.playClick();
    const nextNo = soalList.length + 1;
    const newQuestion: SoalLatih = {
      no: nextNo,
      t: 'pg',
      tanya: 'Tuliskan butir pertanyaan asesmen HOTS baru di sini...',
      stimulus: 'Tuliskan narasi stimulus atau pengantar kontekstual di sini...',
      opsi: [
        'Pilihan Jawaban A',
        'Pilihan Jawaban B',
        'Pilihan Jawaban C',
        'Pilihan Jawaban D',
        'Pilihan Jawaban E'
      ],
      j: 0,
      msg: 'Penjelasan dan ulasan ilmiah mengapa kunci jawaban tersebut benar berdasarkan materi.',
      kompetensi: 'Memahami Konsep Dasar',
      subKompetensi: 'Analisis Fenomena',
      bentukSoalOriginal: 'Pilihan Ganda'
    };

    const updated = [...soalList, newQuestion];
    onUpdateSoalList(updated);
    setSelectedNo(updated.length - 1);
    sound.playSuccess();
  };

  const handleDeleteQuestion = (idx: number) => {
    if (soalList.length <= 1) {
      alert('MPI harus memiliki minimal 1 butir soal evaluasi.');
      return;
    }
    if (confirm(`Hapus soal nomor ${idx + 1}?`)) {
      sound.playClick();
      const updated = soalList.filter((_, i) => i !== idx).map((q, i) => ({ ...q, no: i + 1 }));
      onUpdateSoalList(updated);
      setSelectedNo(Math.max(0, idx - 1));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      
      {/* Header Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-800">
              Langkah 3 • Bank Soal Asesmen
            </span>
            <span className="text-xs text-slate-500 font-medium">HOTS Kurikulum Merdeka</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="text-indigo-600" size={26} />
            <span>Penyusun Bank Soal Evaluasi & HOTS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Atur butir soal evaluasi interaktif. Anda dapat mengedit langsung di editor ini atau memanfaatkan fitur import file Excel untuk memasukkan puluhan soal sekaligus.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onGoToUploadExcel();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            <FileSpreadsheet size={15} />
            <span>Upload Format Excel</span>
          </button>

          <button
            onClick={handleAddQuestion}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
          >
            <Plus size={15} />
            <span>+ Soal Baru</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoToPreview();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Eye size={15} />
            <span>Pratinjau</span>
          </button>
        </div>
      </div>

      {/* Quick Excel Promo Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-800/60 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <div className="text-xs font-black uppercase text-emerald-400 tracking-wider">
              Punya Naskah Soal di Microsoft Excel atau Google Sheets?
            </div>
            <div className="text-xs text-slate-300">
              Gunakan menu <b>Upload Format Excel</b> untuk import otomatis dengan 12 kolom resmi (Stimulus, Bentuk Soal, Opsi A-E, Kunci, Pembahasan).
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onGoToUploadExcel();
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-xs"
        >
          <span>Buka Menu Upload Excel</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Question Matrix (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase text-slate-600 tracking-wider">
                Daftar Soal ({soalList.length} Butir)
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {soalList.map((q, idx) => {
                const isCurrent = idx === safeIdx;
                return (
                  <div
                    key={q.no || idx}
                    onClick={() => {
                      sound.playClick();
                      setSelectedNo(idx);
                    }}
                    className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-2 cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-50/90 border-indigo-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          Soal {idx + 1}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {q.bentukSoalOriginal || q.t}
                        </span>
                      </div>
                      <div className={`text-xs font-semibold line-clamp-2 ${
                        isCurrent ? 'text-indigo-950 font-bold' : 'text-slate-700'
                      }`}>
                        {q.tanya}
                      </div>
                    </div>

                    {soalList.length > 1 && (
                      <button
                        title="Hapus Soal Ini"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(idx);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
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

        {/* Right Editor Form (8 cols) */}
        <div className="lg:col-span-8">
          {currentSoal ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                    Editor Butir Soal {safeIdx + 1}
                  </span>
                  <h2 className="text-lg font-black text-slate-900">
                    Konfigurasi Soal & Stimulus HOTS
                  </h2>
                </div>
              </div>

              {/* Kompetensi & Bentuk Soal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Bentuk / Tipe Soal
                  </label>
                  <select
                    value={currentSoal.t}
                    onChange={(e) => handleUpdateCurrent('t', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800"
                  >
                    <option value="pg">Pilihan Ganda (PG)</option>
                    <option value="pg_kompleks">Pilihan Ganda Kompleks (MCMA)</option>
                    <option value="jodoh">Menjodohkan Konsep</option>
                    <option value="drag_word">Mengisi Rumpang Kalimat</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Kompetensi
                  </label>
                  <input
                    type="text"
                    value={currentSoal.kompetensi || ''}
                    onChange={(e) => handleUpdateCurrent('kompetensi', e.target.value)}
                    placeholder="Contoh: Klasifikasi Kelompok"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                    Sub Kompetensi
                  </label>
                  <input
                    type="text"
                    value={currentSoal.subKompetensi || ''}
                    onChange={(e) => handleUpdateCurrent('subKompetensi', e.target.value)}
                    placeholder="Contoh: Analisis Paguyuban"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Stimulus */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Stimulus / Narasi Kasus (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={currentSoal.stimulus || ''}
                  onChange={(e) => handleUpdateCurrent('stimulus', e.target.value)}
                  placeholder="Kutipan artikel, data statistik, infografis, atau kasus masyarakat..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Pertanyaan Utama */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Kalimat Pertanyaan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={currentSoal.tanya}
                  onChange={(e) => handleUpdateCurrent('tanya', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Opsi Jawaban (A, B, C, D, E) */}
              {currentSoal.opsi && currentSoal.opsi.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      Pilihan Jawaban (A - E)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Klik huruf untuk memilih Kunci Jawaban
                    </span>
                  </div>

                  {currentSoal.opsi.map((op, oIdx) => {
                    const isCorrect = typeof currentSoal.j === 'number'
                      ? currentSoal.j === oIdx
                      : Array.isArray(currentSoal.j)
                      ? (currentSoal.j as any[]).includes(oIdx)
                      : false;

                    return (
                      <div key={oIdx} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            if (currentSoal.t === 'pg_kompleks') {
                              const curr = Array.isArray(currentSoal.j) ? [...currentSoal.j] : [currentSoal.j];
                              if (curr.includes(oIdx)) {
                                handleUpdateCurrent('j', curr.filter(x => x !== oIdx));
                              } else {
                                handleUpdateCurrent('j', [...curr, oIdx].sort());
                              }
                            } else {
                              handleUpdateCurrent('j', oIdx);
                            }
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center shrink-0 transition ${
                            isCorrect
                              ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400/40'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {String.fromCharCode(65 + oIdx)}
                        </button>
                        <input
                          type="text"
                          value={op}
                          onChange={(e) => handleUpdateOption(oIdx, e.target.value)}
                          className={`flex-1 px-3 py-2 rounded-xl border text-xs ${
                            isCorrect ? 'border-emerald-400 bg-emerald-50/20 font-semibold' : 'border-slate-300'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pembahasan */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Pembahasan / Ulasan Jawaban Benar
                </label>
                <textarea
                  rows={3}
                  value={currentSoal.msg}
                  onChange={(e) => handleUpdateCurrent('msg', e.target.value)}
                  placeholder="Ulasan konsep teoretis mengapa pilihan tersebut tepat..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* CRUD Media & Animasi MPI untuk Butir Soal Ini */}
              <MediaAnimasiManager
                titleLabel={`Soal No. ${safeIdx + 1}`}
                mediaList={currentSoal.mediaList || []}
                animasi={currentSoal.animasi || { masuk: 'slide-up', interaksi: 'none', kecepatan: 'normal' }}
                onUpdateMediaList={(list) => handleUpdateCurrent('mediaList', list)}
                onUpdateAnimasi={(anim) => handleUpdateCurrent('animasi', anim)}
              />

            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">Pilih butir soal untuk mengedit.</div>
          )}
        </div>

      </div>

    </div>
  );
};
