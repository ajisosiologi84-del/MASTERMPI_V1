import * as XLSX from 'xlsx';
import { SoalLatih, SoalType } from '../types';

export const EXCEL_COLUMNS = [
  'No Soal',
  'Kompetensi',
  'Sub Kompetensi',
  'Bentuk Soal',
  'Soal (Stimulus + Pertanyaan)',
  'Opsi_A',
  'Opsi_B',
  'Opsi_C',
  'Opsi_D',
  'Opsi_E',
  'Kunci Jawaban',
  'Pembahasan'
];

/**
 * Normalizes header string for robust matching
 */
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Maps a single row object from Excel/TSV to SoalLatih
 */
export function mapRowToSoalLatih(row: Record<string, any>, index: number): SoalLatih {
  // Normalize row keys
  const normalizedRow: Record<string, any> = {};
  for (const [key, val] of Object.entries(row)) {
    normalizedRow[normalizeKey(key)] = val !== undefined && val !== null ? String(val).trim() : '';
  }

  // Get field by variations of keys
  const getField = (possibleKeys: string[]): string => {
    for (const k of possibleKeys) {
      const norm = normalizeKey(k);
      if (normalizedRow[norm] !== undefined && normalizedRow[norm] !== '') {
        return normalizedRow[norm];
      }
    }
    return '';
  };

  const noStr = getField(['No Soal', 'No', 'Nomor']);
  const no = parseInt(noStr, 10) || (index + 1);

  const kompetensi = getField(['Kompetensi', 'KD', 'Capaian Pembelajaran', 'CP']);
  const subKompetensi = getField(['Sub Kompetensi', 'SubKompetensi', 'Indikator', 'Materi']);
  const bentukSoalRaw = getField(['Bentuk Soal', 'Bentuk', 'Tipe Soal', 'Tipe']);
  const soalRaw = getField(['Soal (Stimulus + Pertanyaan)', 'Soal', 'Stimulus + Pertanyaan', 'Pertanyaan']);
  
  const opsiA = getField(['Opsi_A', 'Opsi A', 'Pilihan A', 'A']);
  const opsiB = getField(['Opsi_B', 'Opsi B', 'Pilihan B', 'B']);
  const opsiC = getField(['Opsi_C', 'Opsi C', 'Pilihan C', 'C']);
  const opsiD = getField(['Opsi_D', 'Opsi D', 'Pilihan D', 'D']);
  const opsiE = getField(['Opsi_E', 'Opsi E', 'Pilihan E', 'E']);

  const kunciRaw = getField(['Kunci Jawaban', 'Kunci', 'Jawaban', 'Kunci_Jawaban']);
  const pembahasan = getField(['Pembahasan', 'Penjelasan', 'Keterangan', 'Pembahasan Soal']);

  // Detect SoalType
  const bentukNorm = bentukSoalRaw.toLowerCase();
  let t: SoalType = 'pg';
  if (bentukNorm.includes('kompleks') || bentukNorm.includes('mcma') || bentukNorm.includes('ganda kompleks')) {
    t = 'pg_kompleks';
  } else if (bentukNorm.includes('jodoh') || bentukNorm.includes('pasang')) {
    t = 'jodoh';
  } else if (bentukNorm.includes('rumpang') || bentukNorm.includes('drag') || bentukNorm.includes('isian') || bentukNorm.includes('word')) {
    t = 'drag_word';
  } else {
    t = 'pg';
  }

  // Parse Stimulus and Pertanyaan if combined
  let stimulus = '';
  let tanya = soalRaw;
  if (soalRaw.includes('---') || soalRaw.includes('\n\n')) {
    const parts = soalRaw.split(/\n\s*\n|---/).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      stimulus = parts[0];
      tanya = parts.slice(1).join('\n\n');
    }
  } else if (soalRaw.toLowerCase().startsWith('wacana:') || soalRaw.toLowerCase().startsWith('stimulus:')) {
    const match = soalRaw.match(/^(?:wacana|stimulus):\s*([^]+?)(?:pertanyaan|soal):\s*([^]+)$/i);
    if (match) {
      stimulus = match[1].trim();
      tanya = match[2].trim();
    }
  }

  // Build Options
  const opsi: string[] = [];
  if (opsiA) opsi.push(opsiA);
  if (opsiB) opsi.push(opsiB);
  if (opsiC) opsi.push(opsiC);
  if (opsiD) opsi.push(opsiD);
  if (opsiE) opsi.push(opsiE);

  // Parse Answer Key
  let j: any = 0;
  if (t === 'pg') {
    const letter = kunciRaw.toUpperCase().trim();
    if (letter === 'A' || letter === '1') j = 0;
    else if (letter === 'B' || letter === '2') j = 1;
    else if (letter === 'C' || letter === '3') j = 2;
    else if (letter === 'D' || letter === '4') j = 3;
    else if (letter === 'E' || letter === '5') j = 4;
    else {
      const parsedNum = parseInt(kunciRaw, 10);
      j = !isNaN(parsedNum) && parsedNum >= 0 && parsedNum <= 4 ? parsedNum : 0;
    }
  } else if (t === 'pg_kompleks') {
    // Parse letters like "A, C, D" or "A; B" or JSON array
    const letters = kunciRaw.toUpperCase().split(/[,;\s]+/).map(s => s.trim()).filter(Boolean);
    const indices: number[] = [];
    for (const l of letters) {
      if (l === 'A' || l === '0') indices.push(0);
      else if (l === 'B' || l === '1') indices.push(1);
      else if (l === 'C' || l === '2') indices.push(2);
      else if (l === 'D' || l === '3') indices.push(3);
      else if (l === 'E' || l === '4') indices.push(4);
    }
    j = indices.length > 0 ? indices : [0, 1];
  } else if (t === 'jodoh') {
    j = kunciRaw.toLowerCase().includes('sesuai') || kunciRaw === '1' || kunciRaw.toLowerCase() === 'benar' ? 1 : 0;
  } else if (t === 'drag_word') {
    // Keywords separated by comma
    j = kunciRaw.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
    if (j.length === 0) j = ['primer', 'langsung', 'keluarga'];
  }

  // Special structures for Menjodohkan or Drag word
  let pasanganJodoh: Array<{ kiri: string; kanan: string }> | undefined;
  if (t === 'jodoh') {
    pasanganJodoh = [
      { kiri: opsiA || 'Gemeinschaft by Blood', kanan: opsiB || 'Ikatan kekerabatan/darah keluarga' },
      { kiri: opsiC || 'Gesellschaft', kanan: opsiD || 'Ikatan pamrih kontraktual & profesional' },
    ];
  }

  let kataPilihan: string[] | undefined;
  if (t === 'drag_word') {
    kataPilihan = opsi.length > 0 ? opsi : ['primer', 'langsung', 'keluarga', 'sekunder', 'kontraktual'];
  }

  return {
    no,
    kompetensi: kompetensi || 'Kompetensi Kurikulum Merdeka',
    subKompetensi: subKompetensi || 'Sub Kompetensi',
    bentukSoalOriginal: bentukSoalRaw || (t === 'pg' ? 'Pilihan Ganda' : t),
    t,
    stimulus: stimulus || undefined,
    tanya: tanya || 'Pertanyaan asesmen sosiologis',
    opsi: opsi.length > 0 ? opsi : ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
    j,
    pasanganJodoh,
    kataPilihan,
    msg: pembahasan || 'Jawaban didasarkan pada konsep dan teori Kurikulum Merdeka.',
    aktifUntukBerlatih: true,
    isHots: (kompetensi + ' ' + subKompetensi + ' ' + stimulus + ' ' + soalRaw + ' ' + pembahasan).toLowerCase().includes('hots') || (stimulus && stimulus.length > 40) || t === 'pg_kompleks' || t === 'jodoh'
  };
}

/**
 * Parses an Excel file (.xlsx / .xls) buffer into SoalLatih array
 */
export async function parseExcelFile(file: File): Promise<SoalLatih[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error('Workbook tidak memiliki lembar kerja (worksheet).');
  }

  const worksheet = workbook.Sheets[sheetName];
  const rows: Array<Record<string, any>> = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  if (!rows || rows.length === 0) {
    throw new Error('Lembar kerja kosong atau data baris tidak ditemukan.');
  }

  return rows.map((row, idx) => mapRowToSoalLatih(row, idx));
}

/**
 * Parses TSV / CSV text pasted directly from Excel
 */
export function parsePastedExcelText(text: string): SoalLatih[] {
  const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) {
    throw new Error('Data yang disalin minimal harus memiliki 1 baris header dan 1 baris data.');
  }

  // Detect delimiter (Tab or Comma or Semicolon)
  const headerLine = lines[0];
  let delimiter = '\t';
  if (!headerLine.includes('\t')) {
    if (headerLine.includes(';')) delimiter = ';';
    else if (headerLine.includes(',')) delimiter = ',';
  }

  const headers = headerLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
  const results: SoalLatih[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = line.split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
    const rowObj: Record<string, any> = {};
    headers.forEach((h, colIdx) => {
      rowObj[h] = values[colIdx] || '';
    });
    results.push(mapRowToSoalLatih(rowObj, i - 1));
  }

  return results;
}

/**
 * Generates and downloads a standardized template Excel (.xlsx) file
 */
export function downloadExcelTemplate() {
  const sampleData = [
    {
      'No Soal': 1,
      'Kompetensi': 'Menganalisis hakikat dan syarat pembentukan kelompok sosial',
      'Sub Kompetensi': 'Syarat pembentukan kelompok sosial menurut Soerjono Soekanto',
      'Bentuk Soal': 'Pilihan Ganda',
      'Soal (Stimulus + Pertanyaan)': 'Sekelompok pemuda di desa bersepakat mendirikan komunitas bank sampah untuk mengatasi limbah plastik di lingkungan mereka. Komunitas ini memiliki jadwal kerja bakti rutin mingguan dan struktur kepengurusan terdaftar.\n\nFaktor utama yang mengikat kelompok pemuda tersebut menurut syarat Soerjono Soekanto adalah...',
      'Opsi_A': 'Kesamaan genealogis atau pertalian darah leluhur',
      'Opsi_B': 'Kesamaan kepentingan dan tujuan bersama menyelesaikan masalah lingkungan',
      'Opsi_C': 'Keterpaksaan akibat sanksi dari tetua adat setempat',
      'Opsi_D': 'Dorongan mencari keuntungan materi finansial',
      'Opsi_E': 'Kesamaan latar belakang pekerjaan pokok anggota',
      'Kunci Jawaban': 'B',
      'Pembahasan': 'Soerjono Soekanto mensyaratkan adanya faktor pengikat bersama (common objective/interest) seperti kesamaan kepentingan peduli lingkungan hidup di antara anggota kelompok.'
    },
    {
      'No Soal': 2,
      'Kompetensi': 'Mengklasifikasi ragam bentuk kelompok sosial',
      'Sub Kompetensi': 'Karakteristik Gemeinschaft dan Gesellschaft Ferdinand Tönnies',
      'Bentuk Soal': 'Pilihan Ganda',
      'Soal (Stimulus + Pertanyaan)': 'Paguyuban (Gemeinschaft) dan Patembayan (Gesellschaft) dibedakan berdasarkan sifat ikatan antaranggota. Ciri utama dari paguyuban adalah ikatan yang bersifat...',
      'Opsi_A': 'Formal, kontraktual, dan berorientasi profit',
      'Opsi_B': 'Alami, kekal, intim, dan berakar dari batiniah murni',
      'Opsi_C': 'Terikat oleh kontrak kerja tertulis berjangka waktu',
      'Opsi_D': 'Bersifat individualistis dan impersonal',
      'Opsi_E': 'Hanya berlangsung saat ada kepentingan bisnis bersama',
      'Kunci Jawaban': 'B',
      'Pembahasan': 'Ferdinand Tönnies mendefinisikan Gemeinschaft sebagai bentuk kehidupan bersama di mana anggota-anggotanya diikat oleh hubungan batin murni yang bersifat alami dan kekal (intim, privat, eksklusif).'
    },
    {
      'No Soal': 3,
      'Kompetensi': 'Mengklasifikasi ragam bentuk kelompok sosial',
      'Sub Kompetensi': 'Kelompok Primer dan Sekunder Charles Horton Cooley',
      'Bentuk Soal': 'Pilihan Ganda Kompleks',
      'Soal (Stimulus + Pertanyaan)': 'Manakah di antara pernyataan berikut yang merupakan karakteristik khas dari kelompok sosial primer (Primary Group)? (Pilihlah jawaban yang benar)',
      'Opsi_A': 'Interaksi tatap muka yang intim, personal, dan mendalam',
      'Opsi_B': 'Hubungan terikat pada aturan tertulis dan hierarki formal',
      'Opsi_C': 'Keanggotaan bersifat langgeng dan tidak dapat digantikan dengan mudah',
      'Opsi_D': 'Orientasi hubungan hanya berfokus pada efisiensi tugas kerja',
      'Opsi_E': 'Contoh nyata adalah keluarga inti dan kelompok persahabatan dekat',
      'Kunci Jawaban': 'A, C, E',
      'Pembahasan': 'Kelompok primer menurut Charles Horton Cooley bercirikan pergaulan intim tatap muka (face-to-face), bersifat langgeng, tidak mudah digantikan (keluarga, sahabat), bukan hubungan formal-kontraktual.'
    },
    {
      'No Soal': 4,
      'Kompetensi': 'Menganalisis dinamika kelompok sosial',
      'Sub Kompetensi': 'Tahapan Perkembangan Kelompok Bruce Tuckman',
      'Bentuk Soal': 'Pilihan Ganda',
      'Soal (Stimulus + Pertanyaan)': 'Pada suatu organisasi siswa, terjadi perdebatan sengit antardivisi mengenai alokasi anggaran dan gaya kepemimpinan. Masing-masing anggota saling mempertahankan pendapat sebelum akhirnya menyepakati aturan baru.\n\nFenomena perdebatan tersebut mencerminkan tahapan dinamika kelompok...',
      'Opsi_A': 'Forming (Pembentukan awal)',
      'Opsi_B': 'Storming (Timbulnya konflik dan friksi ide)',
      'Opsi_C': 'Norming (Penyepakatan norma dan struktur)',
      'Opsi_D': 'Performing (Pencapaian kinerja optimal)',
      'Opsi_E': 'Adjourning (Pembubaran kelompok)',
      'Kunci Jawaban': 'B',
      'Pembahasan': 'Tahap Storming ditandai dengan munculnya perbedaan pendapat, persaingan kepemimpinan, dan friksi sebelum tercapai konsensus bersama.'
    },
    {
      'No Soal': 5,
      'Kompetensi': 'Menganalisis hubungan antarkelompok di era digital',
      'Sub Kompetensi': 'Polarisasi sosial dan echo chamber di media sosial',
      'Bentuk Soal': 'Pilihan Ganda',
      'Soal (Stimulus + Pertanyaan)': 'Kecenderungan algoritma media sosial yang hanya merekomendasikan konten dan opini serupa sehingga memperkuat bias konfirmasi kelompok dikenal sebagai...',
      'Opsi_A': 'Social Ingrouping',
      'Opsi_B': 'Filter Bubble & Echo Chamber',
      'Opsi_C': 'Cultural Diffusion',
      'Opsi_D': 'Structural Assimilation',
      'Opsi_E': 'Pluralistic Society',
      'Kunci Jawaban': 'B',
      'Pembahasan': 'Filter bubble dan echo chamber adalah fenomena ruang gema di mana algoritma mengisolasi pengguna hanya dengan sudut pandang sejenis sehingga memicu polarisasi kelompok.'
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData, { header: EXCEL_COLUMNS });
  
  // Set column widths for readability
  worksheet['!cols'] = [
    { wch: 8 },  // No Soal
    { wch: 30 }, // Kompetensi
    { wch: 28 }, // Sub Kompetensi
    { wch: 20 }, // Bentuk Soal
    { wch: 45 }, // Soal
    { wch: 25 }, // Opsi A
    { wch: 25 }, // Opsi B
    { wch: 25 }, // Opsi C
    { wch: 25 }, // Opsi D
    { wch: 25 }, // Opsi E
    { wch: 15 }, // Kunci Jawaban
    { wch: 40 }  // Pembahasan
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Format_Soal_MPI');
  XLSX.writeFile(workbook, 'Template_Soal_MPI_Kurikulum_Merdeka.xlsx');
}

/**
 * Downloads questions as CSV
 */
export function downloadCsvTemplate() {
  const headers = EXCEL_COLUMNS.join(';');
  const sampleRow = `1;Menganalisis kelompok sosial;Hakikat kelompok sosial;Pilihan Ganda;Berikut ini yang merupakan syarat kelompok sosial adalah...;Adanya hubungan timbal balik;Hanya satu arah;Kumpulan acak;Tanpa aturan;Fisik semata;A;Syarat mutlak kelompok sosial adalah interaksi timbal balik.`;
  const csvContent = `${headers}\n${sampleRow}`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Template_Soal_MPI.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
