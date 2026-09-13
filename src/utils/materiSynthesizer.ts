import { SoalLatih, MateriItem, MpiConfig, MediaItem } from '../types';

/**
 * Intelligent Learning Material Synthesizer
 * Generates 5 coherent, deeply contextualized Sub-Materi (Bab 1 to 5)
 * strictly derived from uploaded assessment questions, including real case stimuli,
 * deep explanations (HOTS msg), competencies, and concrete examples.
 */
export function generateMateriFromSoal(
  soalList: SoalLatih[],
  config?: MpiConfig
): MateriItem[] {
  if (!soalList || soalList.length === 0) {
    return [];
  }

  const topikUtama = config?.topikMateri || config?.judul || 'Materi Pembelajaran';
  const mapel = config?.mataPelajaran || 'Sosiologi';
  const fase = config?.fase || 'Fase F';
  const kelas = config?.kelas || 'Kelas XI';

  // Helper to extract clean keywords/terms from text
  const cleanExtract = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/^pembahasan[:\s-]*/i, '')
      .replace(/^(berdasarkan|menurut|perhatikan|pernyataan|manakah|berikut ini|yang merupakan|adalah)\s+/i, '')
      .trim();
  };

  // Helper to get clean correct answer text from a question
  const getCorrectAnswerText = (q: SoalLatih): string => {
    if (q.t === 'pg' && q.opsi && typeof q.j === 'number' && q.opsi[q.j]) {
      return q.opsi[q.j].trim();
    }
    if (q.t === 'pg_kompleks' && q.opsi && Array.isArray(q.j)) {
      const correctIndices = q.j as number[];
      return correctIndices.map(idx => q.opsi?.[idx]).filter(Boolean).join(', ');
    }
    if (q.t === 'jodoh' && (q.pasanganJodoh || Array.isArray(q.j))) {
      const pairs = (q.pasanganJodoh || q.j) as Array<{ kiri: string; kanan: string }>;
      if (Array.isArray(pairs) && pairs.length > 0) {
        return pairs.slice(0, 3).map(p => `${p.kiri} ↔ ${p.kanan}`).join('; ');
      }
    }
    if (q.t === 'drag_word' && q.kataPilihan && q.kataPilihan.length > 0) {
      return q.kataPilihan.join(', ');
    }
    return '';
  };

  // Helper to extract concrete examples from question (stimulus, question stem, options, msg)
  const extractExampleFromQuestion = (q: SoalLatih, fallbackConcept: string): string => {
    // 1. If stimulus is a concrete case / scenario
    if (q.stimulus && q.stimulus.length > 25 && q.stimulus.length <= 250) {
      return q.stimulus.replace(/^kasus[:\s-]*/i, '').trim();
    }
    
    // 2. Search in explanation (msg) for example keywords
    if (q.msg) {
      const exMatch = q.msg.match(/(?:contohnya|misalnya|sebagai contoh|seperti|contoh nyata|wujudnya)\s*[:,\s]+([^.!?\n]{15,180})/i);
      if (exMatch && exMatch[1]) {
        return `Contoh: ${exMatch[1].trim()}`;
      }
    }

    // 3. Search in question stem
    if (q.tanya) {
      const tanyaMatch = q.tanya.match(/(?:contoh|misalnya|wujud|kasus|fenomena|penerapan)\s+dari\s+([^,?]+)/i);
      if (tanyaMatch && tanyaMatch[1]) {
        const correctAns = getCorrectAnswerText(q);
        if (correctAns) {
          return `${correctAns} (penerapan pada ${tanyaMatch[1].trim()})`;
        }
      }
    }

    // 4. Use correct answer with context
    const correctAns = getCorrectAnswerText(q);
    if (correctAns && correctAns.length > 5) {
      return `Penerapan/Wujud: ${correctAns}`;
    }

    return `Manifestasi nyata dari ${fallbackConcept} dalam konteks pembelajaran ${mapel}`;
  };

  // 1. Group questions into 5 Pedagogical Clusters
  const totalQuestions = soalList.length;
  const clusters: SoalLatih[][] = [[], [], [], [], []];

  // Check if questions have distinct subKompetensi / kompetensi
  const compMap = new Map<string, SoalLatih[]>();
  soalList.forEach(q => {
    const compKey = (q.subKompetensi || q.kompetensi || '').trim();
    if (compKey) {
      if (!compMap.has(compKey)) compMap.set(compKey, []);
      compMap.get(compKey)!.push(q);
    }
  });

  const uniqueCompetencies = Array.from(compMap.keys()).filter(k => k.length > 0);

  if (uniqueCompetencies.length >= 5) {
    // Assign top 5 competencies to the 5 clusters
    for (let i = 0; i < 5; i++) {
      const comp = uniqueCompetencies[i];
      clusters[i].push(...(compMap.get(comp) || []));
    }
    // Distribute remaining competencies
    for (let i = 5; i < uniqueCompetencies.length; i++) {
      const comp = uniqueCompetencies[i];
      const targetCluster = i % 5;
      clusters[targetCluster].push(...(compMap.get(comp) || []));
    }
  } else {
    // Distribute evenly across 5 sequential clusters
    const bucketSize = Math.max(1, Math.ceil(totalQuestions / 5));
    soalList.forEach((q, idx) => {
      const clusterIdx = Math.min(4, Math.floor(idx / bucketSize));
      clusters[clusterIdx].push(q);
    });
  }

  // Ensure every cluster has at least 1 question (fallback to nearest)
  clusters.forEach((cluster, cIdx) => {
    if (cluster.length === 0) {
      cluster.push(soalList[cIdx % soalList.length]);
    }
  });

  // Default pedagogical blueprints matching 5 standard Kurikulum Merdeka stages
  const pedagogicalArchetypes = [
    {
      bab: 1,
      defaultKategori: 'Fondasi Teori & Hakikat Konsep',
      defaultTheme: 'Hakikat, Definisi Dasar, dan Prinsip Utama',
      ikon: 'BookOpen',
      pedagogicalRole: 'fondasi awal dan pemahaman definisi'
    },
    {
      bab: 2,
      defaultKategori: 'Klasifikasi & Karakteristik Tipologi',
      defaultTheme: 'Ragam Bentuk, Klasifikasi, dan Karakteristik Pembeda',
      ikon: 'Layers',
      pedagogicalRole: 'klasifikasi ragam dan tipologi konsep'
    },
    {
      bab: 3,
      defaultKategori: 'Dinamika & Mekanisme Proses',
      defaultTheme: 'Dinamika, Mekanisme Proses, dan Faktor Pembentuk',
      ikon: 'TrendingUp',
      pedagogicalRole: 'analisis proses, dinamika, dan faktor pembentuk'
    },
    {
      bab: 4,
      defaultKategori: 'Analisis Kasus Kritis & Problematika',
      defaultTheme: 'Studi Kasus Kontekstual, Isu Kritis, dan Dampak Nyata',
      ikon: 'ShieldAlert',
      pedagogicalRole: 'kajian fenomena kritis, problematika, dan studi kasus'
    },
    {
      bab: 5,
      defaultKategori: 'Solusi Aplikatif & Sintesis Harmoni',
      defaultTheme: 'Solusi Nyata, Rekomendasi Aplikatif, dan Integrasi',
      ikon: 'HeartHandshake',
      pedagogicalRole: 'solusi aplikatif, harmonisasi, dan refleksi Profil Pelajar Pancasila'
    }
  ];

  // Helper to pick best representative mini quiz from cluster questions
  const createMiniKuisFromQuestions = (questions: SoalLatih[], babJudul: string) => {
    // Prefer PG question with full options and clear explanation
    const pgQ = questions.find(q => q.t === 'pg' && q.opsi && q.opsi.length >= 3 && q.msg) ||
                questions.find(q => q.t === 'pg' && q.opsi && q.opsi.length >= 2) ||
                questions[0];

    if (pgQ && pgQ.opsi && pgQ.opsi.length >= 2) {
      const kunciIdx = typeof pgQ.j === 'number' && pgQ.j >= 0 && pgQ.j < pgQ.opsi.length ? pgQ.j : 0;
      return {
        tanya: pgQ.tanya || `Manakah prinsip utama terkait materi ${babJudul}?`,
        opsi: pgQ.opsi.slice(0, 4),
        kunci: kunciIdx,
        penjelasan: pgQ.msg 
          ? pgQ.msg.replace(/^pembahasan[:\s-]*/i, '').trim()
          : `Jawaban ini tepat dan sesuai dengan prinsip ilmiah pada materi ${babJudul}.`
      };
    }

    // Fallback if non-PG question was passed
    const correctAns = getCorrectAnswerText(pgQ);
    return {
      tanya: pgQ.tanya || `Apakah pemahaman esensial yang dipelajari pada ${babJudul}?`,
      opsi: [
        correctAns || `Menganalisis prinsip dan fenomena ${topikUtama} secara mendalam dan terstruktur`,
        `Menghafalkan istilah tanpa menghubungkan dengan konteks nyata di lingkungan`,
        `Mengabaikan keterkaitan antar konsep dalam pemecahan masalah`,
        `Membatasi pemahaman hanya pada tataran hafalan tanpa penalaran analitis`
      ],
      kunci: 0,
      penjelasan: pgQ.msg 
        ? pgQ.msg.replace(/^pembahasan[:\s-]*/i, '').trim()
        : `Tepat sekali! Memahami ${babJudul} menuntut kemampuan analisis komprehensif yang menghubungkan teori dengan kasus nyata.`
    };
  };

  // Generate the 5 Materi Items
  return pedagogicalArchetypes.map((archetype, bIdx) => {
    const qCluster = clusters[bIdx];
    
    // 1. Identify specific competencies & topics from this question cluster
    const clusterCompetencies = Array.from(
      new Set(qCluster.map(q => (q.subKompetensi || q.kompetensi || '').trim()).filter(Boolean))
    );

    // 2. Identify top terms / focus topics from questions in this cluster
    const clusterQuestionPhrases = qCluster.map(q => {
      const t = q.tanya || '';
      return cleanExtract(t);
    }).filter(t => t.length > 10);

    let specificTopicName = clusterCompetencies.length > 0 ? clusterCompetencies[0] : '';
    if (!specificTopicName && clusterQuestionPhrases.length > 0) {
      // Pick cleanest short phrase
      const shortest = [...clusterQuestionPhrases].sort((a, b) => a.length - b.length)[0];
      if (shortest && shortest.length <= 60) {
        specificTopicName = shortest.replace(/\?.*$/, '').trim();
      }
    }

    // Construct tailored Bab Title and Category
    let babJudul = '';
    let babKategori = archetype.defaultKategori;

    if (specificTopicName) {
      babJudul = `${archetype.defaultTheme.split(',')[0]}: ${specificTopicName}`;
      babKategori = `${archetype.defaultKategori.split(' ')[0]} - ${specificTopicName.slice(0, 30)}`;
    } else {
      babJudul = `${archetype.defaultTheme} (${topikUtama})`;
    }

    // 3. Extract deep explanations (msg) and stimuli from questions
    const clusterExplanations = qCluster
      .map(q => q.msg ? cleanExtract(q.msg) : '')
      .filter(m => m.length > 20);

    const clusterStimuli = qCluster
      .map(q => q.stimulus ? q.stimulus.trim() : '')
      .filter(s => s.length > 30);

    // 4. Construct Ringkasan (Executive Summary) strictly derived from questions
    let ringkasan = '';
    if (clusterExplanations.length > 0) {
      const leadSentence = clusterExplanations[0];
      const secondSentence = clusterExplanations.length > 1 ? ` ${clusterExplanations[1]}` : '';
      ringkasan = `${leadSentence}${secondSentence}`.slice(0, 260);
      if (!ringkasan.endsWith('.')) ringkasan += '.';
    } else if (clusterStimuli.length > 0) {
      ringkasan = `Modul Bab ${archetype.bab} menganalisis fenomena: "${clusterStimuli[0].slice(0, 180)}..." dengan menekankan ${archetype.pedagogicalRole}.`;
    } else {
      ringkasan = `Bab ${archetype.bab} menyajikan telaah mendalam tentang ${babJudul.toLowerCase()} dalam kerangka ${mapel} ${fase} (${kelas}), membimbing peserta didik memahami keterkaitan konsep dengan realitas nyata.`;
    }

    // 5. Construct Poin Kunci (Key Learning Points) directly from question competencies & answers
    const poinKunci: string[] = [];
    qCluster.forEach((q, qIdx) => {
      if (poinKunci.length < 4) {
        const correctAns = getCorrectAnswerText(q);
        const qClean = cleanExtract(q.tanya).replace(/\?.*$/, '').trim();
        
        if (q.msg && q.msg.length > 20) {
          const cleanMsg = cleanExtract(q.msg);
          const firstSentence = cleanMsg.split(/(?<=[.?!])\s+/)[0];
          if (firstSentence && firstSentence.length > 15 && firstSentence.length < 160) {
            poinKunci.push(`${firstSentence.endsWith('.') ? firstSentence : firstSentence + '.'}`);
            return;
          }
        }

        if (qClean && correctAns) {
          poinKunci.push(`Analisis ${qClean.slice(0, 70)}: ${correctAns.slice(0, 80)}.`);
        } else if (qClean) {
          poinKunci.push(`Prinsip ${qClean.slice(0, 110)}.`);
        }
      }
    });

    // Ensure at least 3 points
    if (poinKunci.length < 3) {
      poinKunci.push(
        `Memahami hakikat dan dimensi esensial ${specificTopicName || topikUtama} melalui kajian teoritis dan empiris.`,
        `Mengidentifikasi indikator pembeda serta hubungan kausalitas dalam materi ${babJudul}.`,
        `Mengembangkan kemampuan bernalar kritis dan solusi kontekstual sesuai Profil Pelajar Pancasila.`
      );
    }

    // 6. Construct Penjelasan Lengkap (3 In-depth Paragraphs) grounded in question content
    const penjelasanLengkap: string[] = [];
    
    // Paragraph 1: Conceptual Foundation
    penjelasanLengkap.push(
      `Dalam capaian pembelajaran ${mapel} (${fase}, ${kelas}) pada materi "${topikUtama}", penguasaan terhadap ${babJudul.toLowerCase()} memiliki posisi yang sangat esensial. ${
        specificTopicName 
          ? `Topik ini secara khusus membedah aspek ${specificTopicName} agar peserta didik mampu mengidentifikasi karakteristik mendasar tanpa kekeliruan konseptual.` 
          : `Melalui pembahasan ini, peserta didik diarahkan untuk memahami konsep secara komprehensif mulai dari definisi, indikator, hingga batasan teoritisnya.`
      }`
    );

    // Paragraph 2: Synthesized Substantive Explanation from Question Bank
    if (clusterExplanations.length > 0) {
      const combinedExplanation = clusterExplanations.slice(0, 3).join(' ');
      penjelasanLengkap.push(
        `Berdasarkan telaah mendalam dari butir-butir asesmen: ${combinedExplanation.slice(0, 520)}${combinedExplanation.length > 520 ? '...' : ''}`
      );
    } else {
      penjelasanLengkap.push(
        `Setiap gejala dan indikator pada ${babJudul} memiliki relasi terstruktur. Peserta didik diharapkan tidak hanya sekadar menghafal istilah, melainkan mampu menelaah faktor pendorong, proses dinamika, serta konsekuensi logis yang timbul dalam struktur kehidupan nyata.`
      );
    }

    // Paragraph 3: Contextual Application & Examples
    const exampleHighlights = qCluster
      .map(q => extractExampleFromQuestion(q, specificTopicName || topikUtama))
      .filter(ex => ex && !ex.startsWith('Manifestasi'))
      .slice(0, 2);

    if (exampleHighlights.length > 0) {
      penjelasanLengkap.push(
        `Penerapan dan Contoh Nyata: Pada konteks praktis, konsep ini dapat diamati melalui berbagai fenomena seperti ${exampleHighlights.join(' serta ')}. Pemahaman ini memperkuat nalar kritis peserta didik dalam memecahkan persoalan nyata di sekitarnya.`
      );
    } else {
      penjelasanLengkap.push(
        `Relevansi praktis dari penguasaan konsep ini tercermin dalam kemampuan menganalisis fenomena nyata di lingkungan sekitar. Dengan menguasai materi ini, peserta didik dapat menumbuhkan sikap objektif, solutif, serta berkarakter sesuai dengan nilai-nilai luhur Pancasila.`
      );
    }

    // 7. Construct Studi Kasus & Contoh Nyata (Case Study & Contextual Example)
    // Find rich stimulus or build from question scenario
    const richStimulusQ = qCluster.find(q => q.stimulus && q.stimulus.length > 40) ||
                          soalList.find(q => q.stimulus && q.stimulus.length > 40) ||
                          qCluster[0];

    const caseStudyTitle = `Studi Kasus & Contoh Nyata: ${specificTopicName || archetype.defaultTheme.split(',')[0]}`;
    let caseStudyDesc = '';

    if (richStimulusQ && richStimulusQ.stimulus && richStimulusQ.stimulus.length > 30) {
      caseStudyDesc = `${richStimulusQ.stimulus.trim()} \n\nAnalisis Konsep: Berdasarkan stimulus kasus di atas, fenomena ini mencerminkan keterkaitan langsung dengan ${babJudul.toLowerCase()}. Peserta didik diajak untuk mengidentifikasi variabel kunci, penyebab peristiwa, dan merumuskan respons kritis berbasis ilmu ${mapel}.`;
    } else {
      // Build concrete example narrative from question questions & answers
      const exampleItems = qCluster.map(q => {
        const ex = extractExampleFromQuestion(q, specificTopicName);
        const correctAns = getCorrectAnswerText(q);
        return correctAns ? `${q.tanya.replace(/\?.*$/, '')} (Wujud: ${correctAns})` : ex;
      }).slice(0, 2);

      caseStudyDesc = `Contoh Kontekstual di Lapangan: Dalam konteks nyata kehidupan bermasyarakat/lingkungan, fenomena ${specificTopicName || topikUtama} dapat diobservasi pada kasus: ${exampleItems.join('; ')}. Fenomena ini membuktikan bahwa teori yang dipelajari memiliki manifestasi konkret dan membutuhkan analisis objektif dalam penyelesaiannya.`;
    }

    const studiKasus = {
      judul: caseStudyTitle,
      deskripsi: caseStudyDesc
    };

    // 8. Construct Checkpoint Mini Quiz
    const kuisMini = createMiniKuisFromQuestions(qCluster, babJudul);

    // 9. Construct Structured Comparison Matrix & Real Examples Table (Tabel Matriks Konsep & Contoh Nyata)
    const tableRows: string[][] = [];
    qCluster.slice(0, 4).forEach((q, rowIdx) => {
      const conceptCol = (q.subKompetensi || q.kompetensi || cleanExtract(q.tanya).slice(0, 35) || `Aspek ${rowIdx + 1}`).trim();
      
      let theoryCol = '';
      if (q.msg) {
        theoryCol = cleanExtract(q.msg).split(/(?<=[.?!])\s+/)[0].slice(0, 95);
      }
      if (!theoryCol) {
        theoryCol = `Prinsip kajian pada ${babJudul.toLowerCase()}`;
      }

      const exampleCol = extractExampleFromQuestion(q, conceptCol).slice(0, 110);

      tableRows.push([
        conceptCol,
        theoryCol,
        exampleCol
      ]);
    });

    if (tableRows.length < 3) {
      tableRows.push(
        [
          `Indikator ${specificTopicName || 'Esensial'}`,
          `Karakteristik dan syarat keterpenuhan konsep ${babJudul.toLowerCase()}`,
          `Teramati dalam fenomena empiris lingkungan sekitar peserta didik`
        ],
        [
          'Implementasi Profil Pelajar',
          'Penalaran kritis, kreativitas, dan kepedulian sosial',
          'Penerapan sikap bijak dan solusi adaptif dalam kehidupan sehari-hari'
        ]
      );
    }

    const mediaList: MediaItem[] = [
      {
        id: `table-materi-bab-${archetype.bab}`,
        tipe: 'tabel',
        judul: `Matriks Konsep, Indikator & Contoh Nyata (Bab ${archetype.bab})`,
        keterangan: `Tabel sintesis konsep kunci, landasan teoretis, dan contoh nyata hasil telaah bank soal ${topikUtama}.`,
        posisi: 'bawah',
        tabelData: {
          judul: `Tabel Sintesis Konsep & Contoh Nyata - Bab ${archetype.bab}`,
          headers: ['Konsep / Aspek Bahasan', 'Karakteristik Teoretis', 'Contoh Nyata / Kasus Nyata'],
          rows: tableRows
        }
      }
    ];

    return {
      id: archetype.bab,
      judul: babJudul,
      kategori: babKategori,
      ikon: archetype.ikon,
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
