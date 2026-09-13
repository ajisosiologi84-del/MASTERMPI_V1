/**
 * Type definitions for Media Pembelajaran Interaktif (MPI) Offline
 * Kurikulum Merdeka - Sosiologi SMA Fase F
 */

export interface MpiConfig {
  judul: string; // NAMA / Judul Karya MPI
  subJudul?: string;
  mataPelajaran: string; // Dropdown Mapel
  fase: string; // Fase E / Fase F
  kelas: string; // Kelas X, Kelas XI, Kelas XII
  topikMateri: string; // Topik Materi
  tujuanPembelajaran: string; // Tujuan Pembelajaran
  namaPengembang: string; // Nama Pengembang
  sekolah: string; // Sekolah
  mediaSosial: string; // Media Sosial
  fotoProfil?: string; // FOTO PROFIL PENGEMBANG (Data URL Base64 or Image URL)
  penyusun?: string;
  instansi?: string;
  jabatan?: string; // Jabatan / Guru Mapel
  nip?: string; // NIP / NUPTK / No. Registrasi
  kontak?: string; // Email / WhatsApp
  kkm: number;
  durasiMenit: number;
  logoUrl?: string;
  coverUrl?: string;
  bgmTrack?: 'lofi' | 'cheerful' | 'acoustic' | 'synthwave' | 'custom';
  customAudioUrl?: string;
  customAudioName?: string;
  bgmVolume?: number;
  bgmAutoPlay?: boolean;
}

export interface MiniKuis {
  tanya: string;
  opsi: string[];
  kunci: number; // 0-based index
  penjelasan: string;
}

export type MediaType = 'gambar' | 'infografis' | 'tabel' | 'visual_lain' | 'musik' | 'video';

export interface TabelData {
  judul?: string;
  headers: string[];
  rows: string[][];
}

export interface MediaItem {
  id: string;
  tipe: MediaType;
  judul: string;
  keterangan?: string;
  url?: string; // Data URL Base64 or relative/online link
  tabelData?: TabelData;
  posisi?: 'atas' | 'bawah'; // posisi penempatan media
}

export type AnimasiMasuk = 'none' | 'fade-in' | 'slide-up' | 'bounce-in' | 'flip' | 'zoom-in' | 'float' | 'pulse';
export type AnimasiInteraksi = 'none' | 'hover-lift' | 'glow' | 'shake' | 'scale-tap';
export type KecepatanAnimasi = 'cepat' | 'normal' | 'lambat';

export interface AnimasiConfig {
  masuk: AnimasiMasuk;
  interaksi?: AnimasiInteraksi;
  kecepatan?: KecepatanAnimasi;
}

export interface MateriItem {
  id: number;
  judul: string;
  kategori: string;
  ikon: string;
  ringkasan: string;
  poinKunci: string[];
  penjelasanLengkap: string[];
  studiKasus: {
    judul: string;
    deskripsi: string;
  };
  kuisMini: MiniKuis;
  mediaList?: MediaItem[];
  animasi?: AnimasiConfig;
}

export type GameType = 'jodoh' | 'klik' | 'urut' | 'kumpul' | 'sambung';

export interface GameItem {
  id: number;
  tipe: GameType;
  judul: string;
  instruksi: string;
  waktuDetik?: number;
  // Khusus tipe 'jodoh'
  pasangan?: Array<{ kiri: string; kanan: string; id: string }>;
  // Khusus tipe 'klik'
  targetKategori?: string;
  itemKlik?: Array<{ teks: string; benar: boolean }>;
  // Khusus tipe 'urut'
  urutanBenar?: string[];
  // Khusus tipe 'kumpul'
  itemKumpul?: Array<{ teks: string; benar: boolean; poin: number }>;
  // Khusus tipe 'sambung'
  rantaiLogika?: Array<{ sebab: string; akibat: string }>;
  mediaList?: MediaItem[];
  animasi?: AnimasiConfig;
}

export type SoalType = 'pg' | 'pg_kompleks' | 'jodoh' | 'drag_word';

export interface SoalLatih {
  no: number;
  kompetensi?: string;
  subKompetensi?: string;
  bentukSoalOriginal?: string;
  t: SoalType;
  stimulus?: string;
  tanya: string;
  opsi?: string[];
  // Untuk 'pg' (number 0..4), untuk 'pg_kompleks' (number[]), untuk 'jodoh' (array pasangan), untuk 'drag_word' (kata kunci)
  j: number | number[] | Array<{ kiri: string; kanan: string }> | string[];
  pasanganJodoh?: Array<{ kiri: string; kanan: string }>;
  kalimatRumpang?: string; // e.g. "Kelompok sosial primer memiliki sifat hubungan yang [1] dan tatap muka secara [2]."
  kataPilihan?: string[];
  msg: string; // Pembahasan mendalam HOTS
  aktifUntukBerlatih?: boolean; // Apakah diikutsertakan oleh admin dalam Modul Siswa Berlatih (default: true)
  isHots?: boolean; // Penanda butir soal HOTS (Higher Order Thinking Skills)
  mediaList?: MediaItem[];
  animasi?: AnimasiConfig;
}
