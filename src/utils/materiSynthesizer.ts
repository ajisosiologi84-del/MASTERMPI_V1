import { SoalLatih, MateriItem, MpiConfig, MediaItem } from '../types';

/**
 * Intelligent Learning Material Synthesizer
 * Generates 5 structured Sub-Materi (Bab 1 to 5) based on uploaded/bank questions
 */
export function generateMateriFromSoal(
  soalList: SoalLatih[],
  config?: MpiConfig
): MateriItem[] {
  if (!soalList || soalList.length === 0) {
    return [];
  }

  const topikUtama = config?.topikMateri || config?.judul || 'Materi Pembelajaran Interaktif';
  const mapel = config?.mataPelajaran || 'Sosiologi';
  const fase = config?.fase || 'Fase F';
  const kelas = config?.kelas || 'Kelas XI';

  // Group questions into 5 thematic pedagogical buckets
  const totalQuestions = soalList.length;
  const bucketSize = Math.max(1, Math.ceil(totalQuestions / 5));

  const clusters: SoalLatih[][] = [[], [], [], [], []];
  soalList.forEach((q, idx) => {
    const clusterIdx = Math.min(4, Math.floor(idx / bucketSize));
    clusters[clusterIdx].push(q);
  });

  // Helper to extract unique clean sentences from questions & explanations
  const extractCleanSentences = (questions: SoalLatih[]): string[] => {
    const sentences: string[] = [];
    questions.forEach(q => {
      if (q.msg) {
        const parts = q.msg.split(/(?<=[.?!])\s+/).map(s => s.replace(/^pembahasan[:\s-]*/i, '').trim()).filter(s => s.length > 20);
        sentences.push(...parts);
      }
      if (q.stimulus && q.stimulus.length > 30) {
        sentences.push(q.stimulus.trim());
      }
    });
    return Array.from(new Set(sentences));
  };

  // Helper to pick best representative mini quiz from cluster questions
  const createMiniKuisFromQuestions = (questions: SoalLatih[], fallbackTitle: string) => {
    // Prefer PG question with at least 3 options
    const pgQ = questions.find(q => q.t === 'pg' && q.opsi && q.opsi.length >= 3) || questions[0];

    if (pgQ && pgQ.opsi && pgQ.opsi.length >= 2) {
      const kunciIdx = typeof pgQ.j === 'number' && pgQ.j >= 0 && pgQ.j < pgQ.opsi.length ? pgQ.j : 0;
      return {
        tanya: pgQ.tanya || `Manakah prinsip utama terkait ${fallbackTitle}?`,
        opsi: pgQ.opsi.slice(0, 4),
        kunci: kunciIdx,
        penjelasan: pgQ.msg ? pgQ.msg.replace(/^pembahasan[:\s-]*/i, '') : 'Jawaban ini sesuai dengan konsep teoritis yang telah dianalisis pada materi pembelajaran.'
      };
    }

    return {
      tanya: `Apakah pemahaman esensial yang dipelajari pada materi ${fallbackTitle}?`,
      opsi: [
        `Menganalisis prinsip dan fenomena terkait ${topikUtama} secara mendalam`,
        `Menghafalkan istilah tanpa menghubungkan dengan konteks sosial nyata`,
        `Mengabaikan keterkaitan antar konsep dalam kehidupan bermasyarakat`,
        `Membatasi pemahaman hanya pada tataran teori tanpa aplikasi`
      ],
      kunci: 0,
      penjelasan: `Tepat sekali! Memahami ${fallbackTitle} menuntut kemampuan analisis komprehensif yang menghubungkan teori dengan realitas sosial.`
    };
  };

  // Default pedagogical template definitions for 5 Bab
  const babBlueprints = [
    {
      bab: 1,
      kategori: 'Fondasi Teori & Hakikat Konsep',
      ikon: 'BookOpen',
      defaultTitle: `Hakikat dan Definisi Dasar ${topikUtama}`,
      focusWords: ['hakikat', 'definisi', 'syarat', 'dasar', 'pengertian', 'prinsip', 'indikator']
    },
    {
      bab: 2,
      kategori: 'Klasifikasi & Tipologi Sosial',
      ikon: 'Layers',
      defaultTitle: `Ragam Klasifikasi dan Tipologi ${topikUtama}`,
      focusWords: ['ragam', 'klasifikasi', 'jenis', 'bentuk', 'tipe', 'tipologi', 'perbedaan', 'kategori']
    },
    {
      bab: 3,
      kategori: 'Dinamika & Karakteristik Proses',
      ikon: 'TrendingUp',
      defaultTitle: `Karakteristik dan Dinamika Proses ${topikUtama}`,
      focusWords: ['dinamika', 'karakteristik', 'proses', 'tahapan', 'perkembangan', 'faktor', 'hubungan']
    },
    {
      bab: 4,
      kategori: 'Analisis Kasus & Masalah Nyata',
      ikon: 'ShieldAlert',
      defaultTitle: `Analisis Fenomena Kritis dan Masalah Nyata`,
      focusWords: ['analisis', 'kasus', 'konflik', 'masalah', 'partikularisme', 'isu', 'dampak', 'tantangan']
    },
    {
      bab: 5,
      kategori: 'Solusi, Harmoni & Rekomendasi',
      ikon: 'HeartHandshake',
      defaultTitle: `Harmonisasi, Rekomendasi dan Profil Pelajar Pancasila`,
      focusWords: ['solusi', 'rekomendasi', 'harmoni', 'integrasi', 'kebijakan', 'pancasila', 'pencegahan', 'toleransi']
    }
  ];

  return babBlueprints.map((blueprint, bIdx) => {
    const qCluster = clusters[bIdx].length > 0 ? clusters[bIdx] : soalList;
    const extractedSentences = extractCleanSentences(qCluster);

    // Determine specific title based on question competencies or fallback
    const matchedCompetencies = qCluster
      .map(q => q.subKompetensi || q.kompetensi)
      .filter(Boolean) as string[];

    let babJudul = blueprint.defaultTitle;
    if (matchedCompetencies.length > 0) {
      const topComp = matchedCompetencies[0].trim();
      if (topComp.length >= 6 && topComp.length <= 60) {
        babJudul = `${topComp} (${blueprint.defaultTitle.split(' ')[0]} ${topikUtama})`;
      }
    }

    // Build Ringkasan (Executive Summary)
    let ringkasan = '';
    if (extractedSentences.length > 0) {
      ringkasan = extractedSentences[0].slice(0, 240);
      if (!ringkasan.endsWith('.')) ringkasan += '.';
    } else {
      ringkasan = `Modul ini menguraikan secara komprehensif tentang ${blueprint.defaultTitle.toLowerCase()} dalam kerangka pembelajaran ${mapel} ${fase} (${kelas}). Peserta didik dibimbing untuk memahami fondasi teori, analisis empiris, serta penerapannya dalam kehidupan masyarakat multikultural.`;
    }

    // Build Key Points (Poin Kunci)
    const poinKunci: string[] = [];
    qCluster.forEach(q => {
      if (poinKunci.length < 4) {
        if (q.tanya && q.tanya.length > 15) {
          const cleanQ = q.tanya.replace(/\?.*$/, '').replace(/^(berdasarkan|menurut|perhatikan)[^,]+,\s*/i, '').trim();
          if (cleanQ.length > 20) {
            poinKunci.push(`Poin Analisis: ${cleanQ.charAt(0).toUpperCase() + cleanQ.slice(1)}.`);
          }
        }
      }
    });

    if (poinKunci.length < 3) {
      poinKunci.push(
        `Memahami esensi dan karakteristik utama dari ${blueprint.defaultTitle} berdasarkan kajian ilmiah ${mapel}.`,
        `Mengidentifikasi keterkaitan antara indikator konsep dengan realitas empiris di lingkungan masyarakat sekitar.`,
        `Mengembangkan daya bernalar kritis dan kepedulian sosial sesuai Profil Pelajar Pancasila.`
      );
    }

    // Build Detailed Explanatory Paragraphs (Penjelasan Lengkap)
    const penjelasanLengkap: string[] = [];
    
    // Paragraph 1: Theoretical Conceptual Background
    penjelasanLengkap.push(
      `Dalam kajian ${mapel} Kurikulum Merdeka pada ${fase} (${kelas}), pemahaman mengenai ${blueprint.defaultTitle.toLowerCase()} memegang peranan fundamental. Para ilmuwan sosiologi menekankan bahwa fenomena sosial tidak dapat dipahami secara parsial atau sekadar kasat mata, melainkan harus dianalisis melalui struktur hubungan timbal balik, pola nilai, serta norma yang melembaga.`
    );

    // Paragraph 2: Synthesized Explanations from Questions & Answers
    const combinedMsgs = qCluster
      .map(q => q.msg)
      .filter(Boolean)
      .map(m => m.replace(/^pembahasan[:\s-]*/i, '').trim())
      .slice(0, 3)
      .join(' ');

    if (combinedMsgs.length > 40) {
      penjelasanLengkap.push(
        `Berdasarkan telaah butir asesmen dan pembahasan ilmiah: ${combinedMsgs.slice(0, 500)}.`
      );
    } else {
      penjelasanLengkap.push(
        `Karakteristik penting pada bab ini menitikberatkan pada kemampuan mengklasifikasikan fakta sosial dan membedakan gejala interaksi manusia. Di era transformasi masyarakat modern dan digital, dinamika yang timbul sering kali menghadirkan tantangan baru yang menuntut penalaran kritis serta objektivitas ilmiah.`
      );
    }

    // Paragraph 3: Practical Sociological Reflection
    penjelasanLengkap.push(
      `Peserta didik diharapkan tidak hanya menguasai konsep secara tekstual, tetapi juga mampu mengontekstualisasikannya ke dalam realitas kebangsaan Indonesia yang majemuk. Dengan menguasai kompetensi ini, peserta didik dapat menumbuhkan sikap inklusif, menghargai keberagaman, dan berkontribusi aktif dalam mewujudkan kohesi sosial.`
    );

    // Build Case Study (Studi Kasus)
    const richStimulusQ = qCluster.find(q => q.stimulus && q.stimulus.length > 50) || qCluster[0];
    const studiKasus = {
      judul: `Studi Kasus Kontekstual: Analisis Dinamika ${blueprint.kategori}`,
      deskripsi: richStimulusQ && richStimulusQ.stimulus
        ? richStimulusQ.stimulus
        : `Di sebuah lingkungan masyarakat yang sedang mengalami modernisasi pesat, terjadi pergeseran pola hubungan sosial antargenerasi. Munculnya teknologi digital mempercepat interaksi namun di sisi lain menciptakan fragmentasi identitas. Melalui bab ini, peserta didik diajak mengamati dan merumuskan solusi atas permasalahan nyata tersebut.`
    };

    // Build Checkpoint Mini Quiz (Kuis Mini)
    const kuisMini = createMiniKuisFromQuestions(qCluster, blueprint.defaultTitle);

    // Build structured comparison table / media prompt
    const mediaList: MediaItem[] = [
      {
        id: `table-materi-${blueprint.bab}`,
        tipe: 'tabel',
        judul: `Matriks Ringkasan Konseptual: Bab ${blueprint.bab}`,
        keterangan: `Tabel perbandingan indikator dan dimensi konsep Bab ${blueprint.bab} hasil sintesis bank soal.`,
        posisi: 'bawah',
        tabelData: {
          judul: `Tabel Indikator Kunci - Bab ${blueprint.bab}`,
          headers: ['Dimensi Konsep', 'Karakteristik Teori', 'Contoh Nyata di Masyarakat'],
          rows: [
            ['Prinsip Inti', `Fokus kajian pada ${blueprint.defaultTitle.toLowerCase()}`, 'Teramati dalam interaksi harian masyarakat'],
            ['Indikator Empiris', 'Pola hubungan terstruktur dan berulang', 'Kegiatan gotong royong, asosiasi profesi, atau komunitas digital'],
            ['Relevansi Pancasila', 'Penguatan nilai gotong royong dan kebinekaan global', 'Menghormati hak warga dan menjaga keutuhan bangsa']
          ]
        }
      }
    ];

    return {
      id: blueprint.bab,
      judul: babJudul,
      kategori: blueprint.kategori,
      ikon: blueprint.ikon,
      ringkasan,
      poinKunci,
      penjelasanLengkap,
      studiKasus,
      kuisMini,
      mediaList,
      animasi: { masuk: 'fade-in', interaksi: 'hover-lift', kecepatan: 'normal' }
    };
  });
}
