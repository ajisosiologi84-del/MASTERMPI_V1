import { AnimasiConfig, AnimasiMasuk, AnimasiInteraksi, KecepatanAnimasi } from '../types';

export const OPSI_ANIMASI_MASUK: { id: AnimasiMasuk; label: string; deskripsi: string }[] = [
  { id: 'none', label: 'Tanpa Animasi (Standar)', deskripsi: 'Muncul langsung tanpa transisi' },
  { id: 'fade-in', label: 'Fade In (Transisi Halus)', deskripsi: 'Memudar masuk dengan anggun' },
  { id: 'slide-up', label: 'Slide Up (Meluncur Naik)', deskripsi: 'Meluncur dinamis dari bawah ke atas' },
  { id: 'bounce-in', label: 'Bounce In (Memantul Ceria)', deskripsi: 'Efek memantul elastis khas game edukatif' },
  { id: 'flip', label: 'Flip 3D (Balik Kartu)', deskripsi: 'Memutar perspektif 3D seperti membalik kartu' },
  { id: 'zoom-in', label: 'Zoom In (Membesar Dinamis)', deskripsi: 'Membesar dari skala kecil ke penuh' },
  { id: 'float', label: 'Float (Melayang Mengambang)', deskripsi: 'Efek mengambang terus-menerus bernuansa hidup' },
  { id: 'pulse', label: 'Pulse (Berdenyut Interaktif)', deskripsi: 'Berdenyut lembut menarik perhatian' },
];

export const OPSI_ANIMASI_INTERAKSI: { id: AnimasiInteraksi; label: string; deskripsi: string }[] = [
  { id: 'none', label: 'Standar (Hover Biasa)', deskripsi: 'Tanpa efek hover khusus' },
  { id: 'hover-lift', label: 'Hover Lift 3D (Terangkat)', deskripsi: 'Elemen sedikit terangkat dan berbayang saat cursor mendekat' },
  { id: 'glow', label: 'Pendaran Cahaya (Glow Pulse)', deskripsi: 'Berpendar lembut seperti tombol aktif futuristik' },
  { id: 'shake', label: 'Shake (Getar Respon)', deskripsi: 'Bergetar saat respon salah atau penegasan penting' },
  { id: 'scale-tap', label: 'Scale Tap (Efek Tekan)', deskripsi: 'Mengecil saat diklik/ditekan seperti tombol fisik' },
];

export const OPSI_KECEPATAN_ANIMASI: { id: KecepatanAnimasi; label: string }[] = [
  { id: 'cepat', label: 'Cepat (0.3s)' },
  { id: 'normal', label: 'Normal (0.6s)' },
  { id: 'lambat', label: 'Lembut / Lambat (1.2s)' },
];

export function getAnimationClasses(animasi?: AnimasiConfig): string {
  if (!animasi) return '';
  const classes: string[] = [];

  if (animasi.masuk && animasi.masuk !== 'none') {
    classes.push(`anim-${animasi.masuk}`);
  }

  if (animasi.interaksi && animasi.interaksi !== 'none') {
    classes.push(`anim-${animasi.interaksi}`);
  }

  if (animasi.kecepatan) {
    classes.push(`anim-speed-${animasi.kecepatan}`);
  }

  return classes.join(' ');
}
