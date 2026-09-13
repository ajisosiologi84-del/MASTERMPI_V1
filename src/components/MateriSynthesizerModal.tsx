import React, { useState } from 'react';
import { MateriItem, SoalLatih, MpiConfig } from '../types';
import { generateMateriFromSoal } from '../utils/materiSynthesizer';
import { getMateriIconBadge } from '../utils/iconHelper';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  ArrowRight,
  RefreshCw,
  Eye,
  FileSpreadsheet
} from 'lucide-react';

interface MateriSynthesizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  soalList: SoalLatih[];
  config?: MpiConfig;
  onApplyMateri: (generatedMateri: MateriItem[], replaceAll: boolean) => void;
}

export const MateriSynthesizerModal: React.FC<MateriSynthesizerModalProps> = ({
  isOpen,
  onClose,
  soalList,
  config,
  onApplyMateri
}) => {
  const [activePreviewBab, setActivePreviewBab] = useState(0);
  const [replaceAll, setReplaceAll] = useState(true);

  if (!isOpen) return null;

  const generated = generateMateriFromSoal(soalList, config);
  const currentBab = generated[activePreviewBab] || generated[0];
  const iconBadge = currentBab ? getMateriIconBadge(currentBab, activePreviewBab, 20) : null;

  const handleApply = () => {
    sound.playSuccess();
    onApplyMateri(generated, replaceAll);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header Modal */}
        <div className="p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg font-black shrink-0">
              <Sparkles size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Otomasi Kurikulum Merdeka
                </span>
                <span className="text-xs text-blue-200">
                  Disintesis dari {soalList.length} Butir Soal Bank Asesmen
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                Penyusun Otomatis Modul Materi (5 Bab Terstruktur)
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left: 5 Bab Selector */}
          <div className="md:col-span-4 bg-slate-50 p-4 border-r border-slate-200 overflow-y-auto space-y-2">
            <div className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-2 px-1">
              Pratinjau 5 Bab Hasil Sintesis:
            </div>

            {generated.map((m, idx) => {
              const isSelected = idx === activePreviewBab;
              const badge = getMateriIconBadge(m, idx, 16);

              return (
                <div
                  key={m.id || idx}
                  onClick={() => {
                    sound.playClick();
                    setActivePreviewBab(idx);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-400/20'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${badge.bgClass} border ${badge.borderClass}`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-blue-600">
                        Bab {idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-[80px]">
                        {m.kategori.split(' ')[0]}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight mt-0.5">
                      {m.judul}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="p-3 mt-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 text-xs leading-relaxed">
              <span className="font-bold block mb-1">💡 Solusi Cerdas Guru:</span>
              Sistem mengekstrak kompetensi, narasi stimulus, pembahasan ilmiah, dan butir kuis mini dari soal evaluasi HOTS yang Anda miliki.
            </div>
          </div>

          {/* Right: Selected Bab Detail Preview */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-5 bg-white">
            {currentBab && iconBadge && (
              <>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${iconBadge.bgClass} border ${iconBadge.borderClass}`}>
                        {currentBab.kategori}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Bab {activePreviewBab + 1} dari 5
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {currentBab.judul}
                    </h3>
                  </div>

                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBadge.bgClass} border ${iconBadge.borderClass}`}>
                    {iconBadge.icon}
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                    Ringkasan Intisari Materi:
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                    {currentBab.ringkasan}
                  </div>
                </div>

                {/* Key Points */}
                <div>
                  <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                    Poin Kunci Capaian Pembelajaran:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {currentBab.poinKunci.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sample Case Study & Concrete Examples */}
                <div>
                  <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1 flex items-center justify-between">
                    <span>Studi Kasus &amp; Contoh Nyata (Dari Soal):</span>
                    <span className="text-[10px] text-amber-700 font-bold">Stimulus &amp; Konteks Soal</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950">
                    <span className="font-bold block mb-1 text-slate-900">{currentBab.studiKasus.judul}</span>
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed">{currentBab.studiKasus.deskripsi}</p>
                  </div>
                </div>

                {/* Table: Matrix of Concepts & Examples */}
                {currentBab.mediaList && currentBab.mediaList[0]?.tabelData && (
                  <div>
                    <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5 flex items-center justify-between">
                      <span>{currentBab.mediaList[0].judul}:</span>
                      <span className="text-[10px] text-blue-600 font-bold">Sintesis Konsep &amp; Contoh</span>
                    </div>
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                            {currentBab.mediaList[0].tabelData.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-2 font-black text-[11px]">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentBab.mediaList[0].tabelData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/80">
                              <td className="p-2 font-bold text-slate-800 align-top">
                                {row[0]}
                              </td>
                              <td className="p-2 text-slate-600 align-top">
                                {row[1]}
                              </td>
                              <td className="p-2 text-blue-900 bg-blue-50/40 font-medium align-top">
                                {row[2]}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Mini Quiz */}
                <div>
                  <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                    Kuis Mini Pemahaman (Otomatis dari Bank Soal):
                  </div>
                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-1.5">
                    <div className="font-bold text-indigo-950">
                      ❓ {currentBab.kuisMini.tanya}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {currentBab.kuisMini.opsi.map((op, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-1.5 rounded-lg border text-[11px] flex items-center gap-1.5 ${
                            oIdx === currentBab.kuisMini.kunci
                              ? 'bg-emerald-100/70 border-emerald-300 font-bold text-emerald-950'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="truncate">{op}</span>
                          {oIdx === currentBab.kuisMini.kunci && (
                            <span className="text-[10px] text-emerald-700 font-black ml-auto">Kunci ✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="radio"
                name="applyMode"
                checked={replaceAll}
                onChange={() => setReplaceAll(true)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span>Gantikan Seluruh Materi (Rekomendasi 5 Bab)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="radio"
                name="applyMode"
                checked={!replaceAll}
                onChange={() => setReplaceAll(false)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span>Tambahkan ke Materi yang Ada</span>
            </label>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
            >
              Batal
            </button>

            <button
              onClick={handleApply}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Sparkles size={15} />
              <span>Terapkan Modul 5 Bab ke MPI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
