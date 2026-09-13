import { SoalLatih, GameItem, MpiConfig } from '../types';

/**
 * Intelligent Game Synthesizer for MPI Kurikulum Merdeka
 * Synthesizes 5 interactive game activities (Jodoh, Klik, Urut, Kumpul, Sambung)
 * directly from uploaded/bank evaluation questions (e.g. 30 questions from Excel).
 */
export function generateGamesFromSoal(
  soalList: SoalLatih[],
  config?: MpiConfig
): GameItem[] {
  if (!soalList || soalList.length === 0) {
    return [];
  }

  const topikUtama = config?.topikMateri || config?.judul || 'Materi Pembelajaran';
  const mapel = config?.mataPelajaran || 'Sosiologi';
  const fase = config?.fase || 'Fase F';
  const kelas = config?.kelas || 'Kelas XI';

  // Helper: extract clean text helper
  const cleanText = (str: string, maxLen = 120): string => {
    if (!str) return '';
    return str
      .replace(/^pembahasan[:\s-]*/i, '')
      .replace(/^[0-9]+[.)]\s*/, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLen);
  };

  // --------------------------------------------------------------------------
  // 1. EXTRACT REUSABLE ASSETS FROM BANK SOAL
  // --------------------------------------------------------------------------

  // A. Collect all explicit matching pairs if any questions have type 'jodoh'
  const explicitPairs: Array<{ kiri: string; kanan: string }> = [];
  soalList.forEach(q => {
    if (q.t === 'jodoh' && Array.isArray(q.pasanganJodoh) && q.pasanganJodoh.length > 0) {
      q.pasanganJodoh.forEach(p => {
        if (p.kiri && p.kanan) {
          explicitPairs.push({ kiri: cleanText(p.kiri, 60), kanan: cleanText(p.kanan, 80) });
        }
      });
    } else if (Array.isArray(q.j) && q.j.length > 0 && typeof q.j[0] === 'object' && (q.j[0] as any).kiri) {
      (q.j as Array<{ kiri: string; kanan: string }>).forEach(p => {
        if (p.kiri && p.kanan) {
          explicitPairs.push({ kiri: cleanText(p.kiri, 60), kanan: cleanText(p.kanan, 80) });
        }
      });
    }
  });

  // B. Collect correct answer texts and wrong distractor texts from PG/MCMA
  const correctStatements: string[] = [];
  const wrongStatements: string[] = [];
  const termAnswerPairs: Array<{ kiri: string; kanan: string }> = [];

  soalList.forEach(q => {
    if (q.opsi && q.opsi.length >= 2) {
      // Determine correct options
      let correctIndices: number[] = [];
      if (typeof q.j === 'number') {
        correctIndices = [q.j];
      } else if (Array.isArray(q.j)) {
        correctIndices = (q.j as any[]).filter(x => typeof x === 'number');
      }

      q.opsi.forEach((opt, oIdx) => {
        const cleaned = cleanText(opt, 90);
        if (cleaned.length >= 4) {
          if (correctIndices.includes(oIdx)) {
            correctStatements.push(cleaned);

            // If question has a clean short prompt/competence, create a term-answer pair
            const term = q.subKompetensi || q.kompetensi || q.tanya.replace(/\?.*$/, '').replace(/^(berdasarkan|menurut|perhatikan)[^,]+,\s*/i, '');
            if (term && term.length >= 5 && term.length <= 60) {
              termAnswerPairs.push({
                kiri: cleanText(term, 50),
                kanan: cleaned
              });
            }
          } else {
            wrongStatements.push(cleaned);
          }
        }
      });
    }

    // Extract from drag_word or stimulus
    if (q.kataPilihan && Array.isArray(q.kataPilihan)) {
      q.kataPilihan.forEach(k => {
        if (k && k.length >= 3) correctStatements.push(cleanText(k, 40));
      });
    }
  });

  // C. Extract causal sentences from explanations & stimulus
  const causeEffectPairs: Array<{ sebab: string; akibat: string }> = [];
  soalList.forEach(q => {
    if (q.msg && q.msg.length > 25) {
      const cleanMsg = cleanText(q.msg, 240);
      // Look for causal connectors (sehingga, mengakibatkan, karena, akibatnya, oleh karena itu)
      const match = cleanMsg.split(/(?:sehingga|mengakibatkan|akibatnya|memicu|oleh karena itu|maka)/i);
      if (match.length >= 2 && match[0].trim().length >= 15 && match[1].trim().length >= 15) {
        causeEffectPairs.push({
          sebab: cleanText(match[0], 90),
          akibat: cleanText(match[1], 90)
        });
      }
    }
  });

  // --------------------------------------------------------------------------
  // 2. BUILD THE 5 ENGAGING GAME ACTIVITIES
  // --------------------------------------------------------------------------

  const results: GameItem[] = [];

  // ==========================================================================
  // GAME 1: TIPE 'JODOH' (Menjodohkan Konsep & Pasangan Karakteristik)
  // ==========================================================================
  let game1Pairs: Array<{ id: string; kiri: string; kanan: string }> = [];

  if (explicitPairs.length >= 3) {
    game1Pairs = explicitPairs.slice(0, 5).map((p, idx) => ({
      id: `p${idx + 1}`,
      kiri: p.kiri,
      kanan: p.kanan
    }));
  } else if (termAnswerPairs.length >= 3) {
    game1Pairs = termAnswerPairs.slice(0, 4).map((p, idx) => ({
      id: `p${idx + 1}`,
      kiri: p.kiri,
      kanan: p.kanan
    }));
  } else {
    // Fallback based on question topics
    const sampleQuestions = soalList.slice(0, 4);
    game1Pairs = sampleQuestions.map((q, idx) => {
      const label = q.subKompetensi || q.kompetensi || `Konsep Pokok ${idx + 1}`;
      const answer = (q.opsi && typeof q.j === 'number' && q.opsi[q.j]) ? q.opsi[q.j] : cleanText(q.tanya, 70);
      return {
        id: `p${idx + 1}`,
        kiri: cleanText(label, 45),
        kanan: cleanText(answer, 80)
      };
    });
  }

  // Ensure we have at least 3 pairs
  if (game1Pairs.length < 3) {
    game1Pairs = [
      { id: 'p1', kiri: `Prinsip Dasar ${topikUtama}`, kanan: `Fondasi utama pemahaman materi ${mapel} ${fase}` },
      { id: 'p2', kiri: `Analisis Karakteristik`, kanan: `Ciri esensial yang membedakan fenomena dalam masyarakat` },
      { id: 'p3', kiri: `Penerapan Kontekstual`, kanan: `Implementasi pemecahan masalah dalam realitas sosial` }
    ];
  }

  results.push({
    id: 1,
    tipe: 'jodoh',
    judul: `Tebak Pasangan: Konsep & Karakteristik ${topikUtama}`,
    instruksi: `Pasangkan istilah/konsep materi di sebelah kiri dengan pasangan definisi atau penjelasan yang tepat di sebelah kanan!`,
    waktuDetik: 60,
    pasangan: game1Pairs,
    animasi: { masuk: 'bounce-in', interaksi: 'scale-tap', kecepatan: 'normal' }
  });

  // ==========================================================================
  // GAME 2: TIPE 'KLIK' (Detektif Ciri & Kategori Fakta Benar)
  // ==========================================================================
  const distinctCorrect = Array.from(new Set(correctStatements)).filter(s => s.length >= 8).slice(0, 5);
  const distinctWrong = Array.from(new Set(wrongStatements)).filter(s => s.length >= 8).slice(0, 4);

  let game2Items: Array<{ teks: string; benar: boolean }> = [];
  distinctCorrect.forEach(c => game2Items.push({ teks: c, benar: true }));
  distinctWrong.forEach(w => game2Items.push({ teks: w, benar: false }));

  // Fallback if not enough extracted
  if (game2Items.length < 6) {
    game2Items = [
      { teks: `Memperkuat kohesi dan integrasi positif dalam ${topikUtama}`, benar: true },
      { teks: `Mengedepankan analisis kritis dan data empiris valid`, benar: true },
      { teks: `Menerapkan sikap etnosentrisme dan partikularisme sempit`, benar: false },
      { teks: `Menumbuhkan toleransi dalam kebinekaan global`, benar: true },
      { teks: `Mengabaikan norma sosial demi keuntungan pribadi/kelompok`, benar: false },
      { teks: `Membangun kerja sama kolaboratif yang inklusif`, benar: true },
      { teks: `Menyebarkan prasangka dan stereotip tanpa konfirmasi`, benar: false }
    ];
  }

  results.push({
    id: 2,
    tipe: 'klik',
    judul: `Tantangan Kilat: Pilah Ciri & Fakta ${topikUtama}`,
    instruksi: `Klik semua kartu pernyataan yang BENAR dan sesuai dengan konsep ${topikUtama}! Hindari pernyataan pengecoh!`,
    waktuDetik: 45,
    targetKategori: `Pernyataan & Karakteristik Benar ${topikUtama}`,
    itemKlik: game2Items.slice(0, 8),
    animasi: { masuk: 'zoom-in', interaksi: 'scale-tap', kecepatan: 'normal' }
  });

  // ==========================================================================
  // GAME 3: TIPE 'URUT' (Menyusun Alur, Kronologi & Hierarki Proses)
  // ==========================================================================
  const processCompetencies = soalList
    .map(q => q.subKompetensi || q.kompetensi)
    .filter(Boolean) as string[];

  const uniqueComps = Array.from(new Set(processCompetencies)).slice(0, 5);
  let urutan: string[] = [];

  if (uniqueComps.length >= 4) {
    urutan = uniqueComps.map((comp, idx) => `Tahap ${idx + 1}: ${cleanText(comp, 70)}`);
  } else {
    urutan = [
      `Fase 1: Identifikasi dan Pemetaan Awal Fenomena ${topikUtama}`,
      `Fase 2: Eksplorasi Konsep, Norma, dan Karakteristik Sosial`,
      `Fase 3: Analisis Kritis Masalah dan Dinamika Lapangan`,
      `Fase 4: Perumusan Solusi Kolaboratif & Penguatan Harmoni`,
      `Fase 5: Evaluasi dan Refleksi Profil Pelajar Pancasila`
    ];
  }

  results.push({
    id: 3,
    tipe: 'urut',
    judul: `Susun Runtut: Alur & Tahapan Pemahaman ${topikUtama}`,
    instruksi: `Gunakan tombol panah ke atas (▲) dan ke bawah (▼) untuk menyusun tahapan konsep ini secara runtut dari fase awal hingga fase akhir!`,
    waktuDetik: 60,
    urutanBenar: urutan,
    animasi: { masuk: 'slide-up', interaksi: 'glow', kecepatan: 'normal' }
  });

  // ==========================================================================
  // GAME 4: TIPE 'KUMPUL' (Tangkap Cepat Istilah & Kata Kunci Esensial)
  // ==========================================================================
  const positiveWords: string[] = [];
  const negativeWords: string[] = [
    'Etnosentrisme Sempit',
    'Partikularisme Kelompok',
    'Prasangka Sosial (Prejudice)',
    'Stereotip Negatif',
    'Disintegrasi Sosial',
    'Eksklusi Sosial'
  ];

  soalList.forEach(q => {
    if (q.subKompetensi) positiveWords.push(cleanText(q.subKompetensi, 40));
    if (q.kompetensi) positiveWords.push(cleanText(q.kompetensi, 40));
    if (q.opsi && typeof q.j === 'number' && q.opsi[q.j]) {
      const ans = cleanText(q.opsi[q.j], 35);
      if (ans.length >= 4 && ans.length <= 40) positiveWords.push(ans);
    }
  });

  const uniquePositives = Array.from(new Set(positiveWords)).slice(0, 5);
  const game4Items: Array<{ teks: string; benar: boolean; poin: number }> = [];

  uniquePositives.forEach(pos => {
    game4Items.push({ teks: pos, benar: true, poin: 20 });
  });

  negativeWords.slice(0, Math.max(3, 8 - game4Items.length)).forEach(neg => {
    game4Items.push({ teks: neg, benar: false, poin: -10 });
  });

  // Ensure minimum items
  if (game4Items.length < 6) {
    game4Items.push(
      { teks: `Solidaritas Positif`, benar: true, poin: 20 },
      { teks: `Inklusivitas Sosial`, benar: true, poin: 20 },
      { teks: `Sikap Diskriminatif`, benar: false, poin: -10 }
    );
  }

  results.push({
    id: 4,
    tipe: 'kumpul',
    judul: `Koleksi Karakter: Kata Kunci Esensial ${topikUtama}`,
    instruksi: `Kumpulkan semua konsep dan kata kunci positif terkait ${topikUtama} sebelum waktu habis (+20 poin). Hati-hati jangan sampai mengklik konsep negatif (-10 poin)!`,
    waktuDetik: 45,
    itemKumpul: game4Items.slice(0, 8),
    animasi: { masuk: 'bounce-in', interaksi: 'scale-tap', kecepatan: 'normal' }
  });

  // ==========================================================================
  // GAME 5: TIPE 'SAMBUNG' (Rantai Logika Sebab-Akibat Fenomena)
  // ==========================================================================
  let game5Pairs: Array<{ sebab: string; akibat: string }> = [];

  if (causeEffectPairs.length >= 3) {
    game5Pairs = causeEffectPairs.slice(0, 4);
  } else {
    // Generate context-aware cause and effect based on questions
    game5Pairs = [
      {
        sebab: `Timbulnya perbedaan pandangan dan kepentingan yang tajam antaranggota`,
        akibat: `Dapat memicu konflik sosial jika tidak dimediasi secara bijak`
      },
      {
        sebab: `Kuatnya ikatan batin murni dan rasa senasib sepenanggungan (we-feeling)`,
        akibat: `Memperkokoh solidaritas mekanik dan kohesivitas kelompok sosial`
      },
      {
        sebab: `Penerapan aturan formal, spesialisasi kerja, dan orientasi rasional-kontraktual`,
        akibat: `Membentuk karakteristik kelompok patembayan (gesellschaft) modern`
      },
      {
        sebab: `Adanya ruang dialog kolaboratif yang inklusif dan perjumpaan lintas identitas`,
        akibat: `Mereduksi prasangka antarkelompok serta membangun integrasi sosial yang kokoh`
      }
    ];
  }

  results.push({
    id: 5,
    tipe: 'sambung',
    judul: `Rantai Logika: Sebab-Akibat Fenomena ${topikUtama}`,
    instruksi: `Hubungkan setiap fenomena SEBAB di sisi kiri dengan AKIBAT sosiologis logis yang ditimbulkannya di sisi kanan!`,
    waktuDetik: 60,
    rantaiLogika: game5Pairs,
    animasi: { masuk: 'bounce-in', interaksi: 'glow', kecepatan: 'normal' }
  });

  return results;
}
