import React, { useState, useRef } from 'react';
import { SoalLatih } from '../types';
import { 
  parseExcelFile, 
  parsePastedExcelText, 
  downloadExcelTemplate, 
  downloadCsvTemplate,
  EXCEL_COLUMNS 
} from '../utils/excelParser';
import { sound } from '../utils/audio';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Clipboard, 
  RefreshCw, 
  Check, 
  FileText,
  Eye,
  HelpCircle,
  Layers,
  Trash2,
  Sparkles,
  BookOpen,
  Gamepad2,
  ArrowRight
} from 'lucide-react';

interface UploadExcelViewProps {
  currentSoalList: SoalLatih[];
  onUpdateSoalList: (newSoalList: SoalLatih[]) => void;
  onGoToPreview: () => void;
  onNavigateMenu?: (menu: 'materi' | 'bermain' | 'preview') => void;
}

export const UploadExcelView: React.FC<UploadExcelViewProps> = ({
  currentSoalList,
  onUpdateSoalList,
  onGoToPreview,
  onNavigateMenu
}) => {
  const [parsedQuestions, setParsedQuestions] = useState<SoalLatih[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handler (.xlsx, .xls, .csv)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      sound.playClick();
      const results = await parseExcelFile(file);
      if (results.length === 0) {
        throw new Error('Tidak ditemukan data soal yang valid dalam file ini.');
      }
      setParsedQuestions(results);
      setSuccessMessage(`Berhasil membaca ${results.length} soal dari file "${file.name}".`);
      sound.playSuccess();
    } catch (err: any) {
      sound.playError();
      setErrorMessage(err?.message || 'Gagal memproses file Excel. Pastikan format kolom sesuai ketentuan.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag & Drop Handler
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setIsProcessing(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      try {
        sound.playClick();
        const results = await parseExcelFile(file);
        setParsedQuestions(results);
        setSuccessMessage(`Berhasil membaca ${results.length} soal dari file "${file.name}".`);
        sound.playSuccess();
      } catch (err: any) {
        sound.playError();
        setErrorMessage(err?.message || 'Gagal memproses file Excel.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Text Paste Handler (from Excel clipboard TSV)
  const handleParsePastedText = () => {
    if (!pastedText.trim()) {
      setErrorMessage('Silakan tempelkan (paste) tabel teks dari Excel terlebih dahulu.');
      return;
    }
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      sound.playClick();
      const results = parsePastedExcelText(pastedText);
      setParsedQuestions(results);
      setSuccessMessage(`Berhasil mengurai ${results.length} soal dari teks yang disalin.`);
      sound.playSuccess();
    } catch (err: any) {
      sound.playError();
      setErrorMessage(err?.message || 'Gagal membaca teks tabel Excel. Pastikan baris header terikut disalin.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Apply parsed questions to active bank
  const handleApplyQuestions = (replace: boolean) => {
    if (!parsedQuestions || parsedQuestions.length === 0) return;
    sound.playSuccess();

    if (replace) {
      onUpdateSoalList(parsedQuestions);
      setSuccessMessage(`Berhasil memperbarui bank soal! Total ${parsedQuestions.length} soal siap diuji.`);
    } else {
      const merged = [...currentSoalList, ...parsedQuestions].map((q, idx) => ({ ...q, no: idx + 1 }));
      onUpdateSoalList(merged);
      setSuccessMessage(`Berhasil menambahkan ${parsedQuestions.length} soal baru. Total kini: ${merged.length} soal.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      
      {/* Header Title */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Langkah 4 • Import Soal Otomatis
            </span>
            <span className="text-xs text-slate-500 font-medium">12 Kolom Standar Excel</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="text-emerald-600" size={26} />
            <span>Upload Soal Format Excel (.xlsx / .csv)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Unggah berkas Microsoft Excel atau salin langsung tabel soal dari Google Sheets/Excel. Sistem otomatis memetakan stimulus, bentuk soal, pilihan jawaban A-E, kunci jawaban, dan pembahasan HOTS.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="download-template-excel-btn"
            onClick={() => {
              sound.playClick();
              downloadExcelTemplate();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Download size={15} />
            <span>Unduh Template (.xlsx)</span>
          </button>

          <button
            id="download-template-csv-btn"
            onClick={() => {
              sound.playClick();
              downloadCsvTemplate();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
          >
            <Download size={14} />
            <span>Template CSV</span>
          </button>
        </div>
      </div>

      {/* Ketentuan 12 Kolom Banner */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 mb-6 shadow-sm border border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <CheckCircle2 size={16} />
            <span>Ketentuan Format 12 Kolom Resmi Header Excel:</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Mendukung: PG, PG Kompleks (MCMA), Menjodohkan, & Rumpang
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono">
          {EXCEL_COLUMNS.map((col, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 flex items-center gap-1.5"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                {idx + 1}
              </span>
              <span className="truncate font-semibold" title={col}>
                {col}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Messages */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
          <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Terjadi Kesalahan:</div>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold">Sukses Memproses Data:</div>
            <p>{successMessage}</p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onGoToPreview();
            }}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shrink-0"
          >
            <Eye size={13} /> Uji di Live Preview
          </button>
        </div>
      )}

      {/* Input Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Method 1: File Drag & Drop */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-2">
              <UploadCloud size={18} className="text-blue-600" />
              <span>Metode 1: Unggah File Excel (.xlsx / .xls / .csv)</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Pilih file langsung dari perangkat Anda atau seret file ke area kotak di bawah ini.
            </p>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/30 transition group flex flex-col items-center justify-center min-h-[160px]"
            >
              <FileSpreadsheet size={40} className="text-slate-400 group-hover:text-emerald-600 transition mb-2" />
              <div className="text-sm font-bold text-slate-700 group-hover:text-emerald-900">
                Klik untuk memilih file atau seret file ke sini
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Format yang didukung: Microsoft Excel (.xlsx, .xls) dan CSV (.csv)
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Ukuran file maksimal: 10 MB</span>
            <button
              onClick={() => downloadExcelTemplate()}
              className="text-emerald-700 hover:underline font-bold"
            >
              Belum punya template? Unduh di sini
            </button>
          </div>
        </div>

        {/* Method 2: Copy Paste Spreadsheet Text */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-2">
              <Clipboard size={18} className="text-indigo-600" />
              <span>Metode 2: Salin & Tempel Tabel (Quick Paste)</span>
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Blok sel tabel di Microsoft Excel / Google Sheets (sertakan baris header), tekan <b>Ctrl + C</b>, lalu tempel di kotak berikut:
            </p>

            <textarea
              rows={6}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Tempelkan baris tabel Excel di sini (termasuk header No Soal, Kompetensi, dll)..."
              className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none bg-slate-50"
            />
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setPastedText('')}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Bersihkan Teks
            </button>

            <button
              id="parse-pasted-excel-btn"
              disabled={isProcessing || !pastedText.trim()}
              onClick={handleParsePastedText}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <RefreshCw size={14} className={isProcessing ? 'animate-spin' : ''} />
              <span>Proses Teks Tabel</span>
            </button>
          </div>
        </div>

      </div>

      {/* Preview Parsed Questions Table */}
      {parsedQuestions && parsedQuestions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8 animate-fade-in">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileText size={20} className="text-emerald-600" />
                <span>Hasil Ekstraksi Data Soal ({parsedQuestions.length} Butir Soal Terbaca)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Periksa kesesuaian stimulus, opsi, dan kunci jawaban sebelum diterapkan ke dalam MPI.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setParsedQuestions(null);
                  setSuccessMessage(null);
                  setErrorMessage(null);
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs transition"
              >
                Bersihkan
              </button>

              <button
                id="apply-replace-soal-btn"
                onClick={() => handleApplyQuestions(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <Check size={16} />
                <span>Gantikan Soal Aktif ({parsedQuestions.length} Soal)</span>
              </button>

              <button
                id="apply-append-soal-btn"
                onClick={() => handleApplyQuestions(false)}
                className="px-3.5 py-2 rounded-xl border border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold text-xs transition"
              >
                + Tambahkan ke Soal
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">No</th>
                  <th className="py-3 px-3 w-28">Tipe / Bentuk</th>
                  <th className="py-3 px-4">Kompetensi & Pertanyaan</th>
                  <th className="py-3 px-3 w-40">Opsi Jawaban</th>
                  <th className="py-3 px-3 w-24 text-center">Kunci</th>
                  <th className="py-3 px-4 w-48">Pembahasan</th>
                  <th className="py-3 px-2 w-12 text-center">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedQuestions.map((q, qIdx) => (
                  <tr key={qIdx} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 text-center font-bold text-slate-600">
                      {q.no}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 block text-center">
                        {q.bentukSoalOriginal || q.t}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {q.kompetensi && (
                        <div className="text-[11px] font-bold text-indigo-900 mb-0.5">
                          {q.kompetensi}
                        </div>
                      )}
                      {q.stimulus && (
                        <div className="text-[11px] text-slate-500 italic mb-1 bg-slate-50 p-1.5 rounded border border-slate-200">
                          {q.stimulus}
                        </div>
                      )}
                      <div className="font-semibold text-slate-900 line-clamp-2">
                        {q.tanya}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 space-y-0.5">
                      {q.opsi && q.opsi.length > 0 ? (
                        q.opsi.slice(0, 3).map((op, oIdx) => (
                          <div key={oIdx} className="truncate text-[11px]">
                            <span className="font-bold text-slate-500">{String.fromCharCode(65 + oIdx)}:</span> {op}
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">-</span>
                      )}
                      {q.opsi && q.opsi.length > 3 && (
                        <div className="text-[10px] text-slate-400 font-bold">+{q.opsi.length - 3} opsi lainnya</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2.5 py-1 rounded-md font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {Array.isArray(q.j)
                          ? (q.j as any[]).join(', ')
                          : typeof q.j === 'number'
                          ? String.fromCharCode(65 + q.j)
                          : String(q.j)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px] line-clamp-3">
                      {q.msg}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          const updated = parsedQuestions.filter((_, i) => i !== qIdx).map((item, idx) => ({ ...item, no: idx + 1 }));
                          setParsedQuestions(updated.length > 0 ? updated : null);
                        }}
                        title="Hapus baris ini dari hasil ekstrak"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Intelligent Auto-Synthesis Quick Actions for Materi and Games */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-6 mb-8 text-white shadow-lg border border-indigo-700/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                Sintesis Cerdas Berbasis Soal
              </span>
              <span className="text-xs text-blue-200">
                Tersedia {currentSoalList.length} Soal Aktif
              </span>
            </div>
            <h3 className="text-lg font-black text-white">
              Otomasi Lengkap: Susun Materi & Game Langsung dari Bank Soal
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Setelah mengunggah atau memiliki bank soal, sistem dapat mengekstrak seluruh konsep esensial menjadi 5 Bab Modul Belajar dan 5 Aktivitas Game Interaktif hanya dalam 1 klik!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Quick Action 1: Materi */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex flex-col justify-between backdrop-blur-xs">
            <div>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase mb-1">
                <BookOpen size={16} />
                <span>Penyusun Materi Otomatis</span>
              </div>
              <div className="font-bold text-white text-sm mb-1">
                Sintesis 5 Bab Modul Belajar
              </div>
              <p className="text-xs text-blue-100/80 mb-3">
                Ekstrak capaian kompetensi, wacana stimulus, pembahasan mendalam, dan kuis mini ke dalam 5 Bab terstruktur.
              </p>
            </div>
            {onNavigateMenu && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigateMenu('materi');
                }}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles size={14} className="text-amber-300" />
                <span>Buka Penyusun Materi</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>

          {/* Quick Action 2: Game */}
          <div className="p-4 rounded-2xl bg-white/10 border border-white/15 flex flex-col justify-between backdrop-blur-xs">
            <div>
              <div className="flex items-center gap-2 text-pink-300 text-xs font-black uppercase mb-1">
                <Gamepad2 size={16} />
                <span>Penyusun Game Otomatis</span>
              </div>
              <div className="font-bold text-white text-sm mb-1">
                Sintesis 5 Aktivitas Game Interaktif
              </div>
              <p className="text-xs text-blue-100/80 mb-3">
                Buat kuis tebak pasangan (Jodoh), pilah ciri (Klik), susun kronologi (Urut), tangkap kata kunci (Kumpul), dan sebab-akibat (Sambung).
              </p>
            </div>
            {onNavigateMenu && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onNavigateMenu('bermain');
                }}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles size={14} className="text-amber-300" />
                <span>Buka Penyusun Game</span>
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Current Active Bank Status */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-extrabold text-sm text-slate-900">
            Status Bank Soal MPI Aktif Saat Ini:
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            Saat ini tersedia <strong className="text-slate-900">{currentSoalList.length} butir soal</strong> dalam modul evaluasi HOTS.
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onGoToPreview();
          }}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-2"
        >
          <Eye size={16} />
          <span>Buka Preview Evaluasi Siswa</span>
        </button>
      </div>

    </div>
  );
};
