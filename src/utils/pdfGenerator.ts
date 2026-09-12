import jsPDF from 'jspdf';
import { MpiConfig, SoalLatih } from '../types';

export interface StudentScoreData {
  namaSiswa: string;
  nomorInduk: string;
  kelas: string;
  sekolah: string;
  score: number;
  kkm: number;
  totalSoal: number;
  totalBenar: number;
  totalSalah: number;
  answers: { [key: number]: any };
  isAnswerCorrect: (index: number) => boolean;
  tanggal: string;
}

export function generateScorePdf(
  config: MpiConfig,
  soalList: SoalLatih[],
  studentData: StudentScoreData
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const isLulus = studentData.score >= studentData.kkm;

  // Header Banner / Kop Resmi
  doc.setFillColor(30, 41, 59); // Slate-800
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('LAPORAN HASIL EVALUASI MEDIA PEMBELAJARAN INTERAKTIF (MPI)', pageWidth / 2, 11, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Kurikulum Merdeka • ${config.mataPelajaran} (${config.fase} - ${config.kelas})`, pageWidth / 2, 18, { align: 'center' });
  doc.text(`Judul MPI: "${config.judul}"`, pageWidth / 2, 23, { align: 'center' });

  let y = 36;

  // 1. Box Identitas Peserta Didik & Media
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('I. IDENTITAS PESERTA DIDIK & KARYA MPI', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  // Left column
  doc.text(`Nama Siswa`, 18, y + 13);
  doc.text(`:  ${studentData.namaSiswa || 'Peserta Didik'}`, 48, y + 13);

  doc.text(`NIS / No. Absen`, 18, y + 19);
  doc.text(`:  ${studentData.nomorInduk || '-'} / ${studentData.kelas || config.kelas}`, 48, y + 19);

  doc.text(`Sekolah / Instansi`, 18, y + 25);
  doc.text(`:  ${studentData.sekolah || config.sekolah || 'SMA/SMK'}`, 48, y + 25);

  // Right column
  const rightX = 115;
  doc.text(`Tanggal Tes`, rightX, y + 13);
  doc.text(`:  ${studentData.tanggal}`, rightX + 28, y + 13);

  doc.text(`Mata Pelajaran`, rightX, y + 19);
  doc.text(`:  ${config.mataPelajaran}`, rightX + 28, y + 19);

  doc.text(`Pengembang MPI`, rightX, y + 25);
  doc.text(`:  ${config.namaPengembang || config.penyusun}`, rightX + 28, y + 25);

  y += 36;

  // 2. Box Hasil Skor & Status Kelulusan
  const scoreBoxColor = isLulus ? [16, 185, 129] : [239, 68, 68]; // Emerald vs Rose
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(isLulus ? 236 : 254, isLulus ? 253 : 242, isLulus ? 245 : 242);
  doc.roundedRect(14, y, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('II. REKAPITULASI HASIL EVALUASI BELAJAR', 18, y + 6);

  // Big Score Badge
  doc.setFillColor(scoreBoxColor[0], scoreBoxColor[1], scoreBoxColor[2]);
  doc.roundedRect(pageWidth - 55, y + 4, 37, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${studentData.score}`, pageWidth - 36.5, y + 14, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text(`SKOR AKHIR`, pageWidth - 36.5, y + 20, { align: 'center' });

  // Stats
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Kriteria Ketercapaian (KKM) :  ${studentData.kkm}`, 18, y + 13);
  doc.text(`Jawaban Benar / Total Soal    :  ${studentData.totalBenar} dari ${studentData.totalSoal} Soal`, 18, y + 18);
  
  const akurasi = Math.round((studentData.totalBenar / studentData.totalSoal) * 100);
  doc.text(`Akurasi Pengerjaan              :  ${akurasi}%`, 18, y + 23);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isLulus ? 4 : 185, isLulus ? 120 : 28, isLulus ? 87 : 28);
  doc.text(`STATUS: ${isLulus ? 'TUNTAS KRITERIA KETERCAPAIAN (LULUS)' : 'BELUM TUNTAS (PERLU PENGAYAAN / REMEDIAL)'}`, 80, y + 13);

  y += 34;

  // 3. Tabel Rincian Analisis Butir Soal
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('III. TABEL RINCIAN ANALISIS BUTIR SOAL ASESMEN HOTS', 14, y);
  y += 4;

  // Table Header
  doc.setFillColor(51, 65, 85);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');

  doc.text('NO', 16, y + 4.5);
  doc.text('BENTUK SOAL', 25, y + 4.5);
  doc.text('KOMPETENSI / POKOK BAHASAN', 52, y + 4.5);
  doc.text('STATUS', 145, y + 4.5);
  doc.text('SKOR', 175, y + 4.5);

  y += 7;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  soalList.forEach((q, idx) => {
    const isCorrect = studentData.isAnswerCorrect(idx);
    const rowBg = idx % 2 === 0 ? 255 : 248;
    doc.setFillColor(rowBg, rowBg, rowBg);
    doc.rect(14, y, pageWidth - 28, 6.5, 'F');

    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, 6.5, 'S');

    doc.setTextColor(30, 41, 59);
    doc.text(`${idx + 1}`, 17, y + 4.5);

    const bentukLabel = q.t === 'pg' ? 'Pilihan Ganda' :
                        q.t === 'pg_kompleks' ? 'PG Kompleks' :
                        q.t === 'jodoh' ? 'Menjodohkan' : 'Isian Rumpang';
    doc.text(bentukLabel, 25, y + 4.5);

    const kompetensiText = q.kompetensi || q.subKompetensi || q.tanya.substring(0, 45) + '...';
    doc.text(kompetensiText.length > 55 ? kompetensiText.substring(0, 52) + '...' : kompetensiText, 52, y + 4.5);

    if (isCorrect) {
      doc.setTextColor(16, 185, 129);
      doc.setFont('helvetica', 'bold');
      doc.text('BENAR (✓)', 145, y + 4.5);
      doc.text('10 Poin', 175, y + 4.5);
    } else {
      doc.setTextColor(239, 68, 68);
      doc.setFont('helvetica', 'bold');
      doc.text('SALAH (✕)', 145, y + 4.5);
      doc.text('0 Poin', 175, y + 4.5);
    }

    doc.setFont('helvetica', 'normal');
    y += 6.5;
  });

  y += 6;

  // 4. Catatan dan Rekomendasi Refleksi
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'FD');
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Catatan & Rekomendasi Pendidik:', 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const rekomendasi = isLulus 
    ? `Peserta didik telah menguasai kompetensi dasar dengan predikat sangat baik. Disarankan untuk melanjutkan ke materi pengayaan dan studi kasus kontekstual tingkat lanjut.`
    : `Peserta didik disarankan melakukan refleksi pada konsep yang belum tuntas melalui Modul Materi dan menyelesaikan kembali soal latihan pada sesi remedial terbimbing.`;
  doc.text(doc.splitTextToSize(rekomendasi, pageWidth - 40), 18, y + 10);

  y += 28;

  // 5. Kolom Tanda Tangan
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  const signLeftX = 25;
  const signRightX = 135;

  doc.text('Mengetahui,', signLeftX, y);
  doc.text('Orang Tua / Wali Murid', signLeftX, y + 4.5);

  doc.text(`${studentData.sekolah || config.sekolah || 'Tempat'}, ${studentData.tanggal}`, signRightX, y);
  doc.text('Guru Mata Pelajaran / Pengembang', signRightX, y + 4.5);

  y += 20;

  doc.line(signLeftX, y, signLeftX + 45, y);
  doc.line(signRightX, y, signRightX + 48, y);

  doc.text('( .................................................. )', signLeftX, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`${config.namaPengembang || config.penyusun || 'Pendidik'}`, signRightX, y + 4.5);

  // Download PDF
  const sanitizedName = (studentData.namaSiswa || 'Siswa').toLowerCase().replace(/[^a-z0-9]/g, '_');
  doc.save(`Rekap_Nilai_${sanitizedName}_MPI.pdf`);
}
