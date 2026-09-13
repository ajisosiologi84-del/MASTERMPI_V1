/**
 * DATA MEDIA PEMBELAJARAN INTERAKTIF (MPI) OFFLINE
 * Kurikulum Merdeka - Sosiologi SMA Fase F (Kelas XI)
 * Topik: Kelompok Sosial di Masyarakat
 */

import { MpiConfig, MateriItem, GameItem, SoalLatih } from '../types';

export const CONFIG: MpiConfig = {
  judul: "Kelompok Sosial di Masyarakat",
  subJudul: "Media Pembelajaran Interaktif (MPI) Sosiologi SMA Fase F",
  mataPelajaran: "Sosiologi",
  fase: "Fase F",
  kelas: "Kelas XI",
  topikMateri: "Kelompok Sosial di Masyarakat",
  tujuanPembelajaran: "Peserta didik mampu menganalisis hakikat, syarat pembentukan, ragam klasifikasi, serta dinamika kelompok sosial dan kepemimpinan dalam konteks masyarakat modern.",
  namaPengembang: "Aji Sosiologi",
  sekolah: "SMA Negeri Unggulan",
  mediaSosial: "@ajisosiologi",
  fotoProfil: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  penyusun: "Aji Sosiologi",
  instansi: "SMA Negeri Unggulan",
  kkm: 75,
  durasiMenit: 45,
  bgmTrack: 'lofi',
  bgmVolume: 0.35,
  bgmAutoPlay: true
};

export const MATERI: MateriItem[] = [
  {
    id: 1,
    judul: "Hakikat dan Syarat Pembentukan Kelompok Sosial",
    kategori: "Konsep Dasar",
    ikon: "Users",
    ringkasan: "Kelompok sosial bukan sekadar kumpulan individu (agregasi fisik), melainkan kesatuan manusia yang hidup bersama karena adanya hubungan timbal balik yang intensif, kesadaran keanggotaan, serta faktor pengikat yang disepakati bersama.",
    poinKunci: [
      "Menurut Soerjono Soekanto, syarat kelompok sosial mencakup kesadaran sebagai bagian kelompok, hubungan timbal balik, faktor pengikat (kepentingan/ideologi/darah), berstruktur, dan bersistem.",
      "Perbedaan mendasar kelompok sosial dengan agregasi (kerumunan) adalah adanya pola interaksi berulang dan norma yang mengikat.",
      "Dorongan naluriah gregariousness manusia mendorong pembentukan kelompok demi bertahan hidup dan aktualisasi diri."
    ],
    penjelasanLengkap: [
      "Dalam sosiologi, tidak semua kumpulan orang di ruang publik dapat disebut sebagai kelompok sosial. Kerumunan orang di halte bus atau antrean tiket bioskop hanyalah kumpulan sementara (agregat sosial) karena tidak memiliki struktur hubungan dan kesadaran identitas bersama.",
      "Kelompok sosial terbentuk atas dasar kesamaan faktor pengikat: garis keturunan (genealogis), kesamaan wilayah tempat tinggal (teritorial), kesamaan kepentingan kerja/profesi, serta kesamaan ideologi/tujuan hidup.",
      "Interaksi dalam kelompok sosial senantiasa menghasilkan struktur sosial berupa status, peran, norma kelompok, dan pola kepemimpinan yang menjaga kelangsungan ikatan anggota."
    ],
    studiKasus: {
      judul: "Studi Kasus: Komunitas Sahabat Peduli Lingkungan",
      deskripsi: "Sekelompok pemuda di desa Sukamaju rutin bertemu tiap akhir pekan membersihkan sungai, memiliki kepengurusan terdaftar, dan membuat AD/ART. Ini adalah kelompok sosial sejati karena memiliki interaksi timbal balik, struktur, dan tujuan bersama."
    },
    kuisMini: {
      tanya: "Manakah di bawah ini yang membedakan 'kelompok sosial' sejati dari sekadar 'kerumunan orang' di stasiun kereta?",
      opsi: [
        "Jumlah orang yang berkumpul lebih dari 100 orang",
        "Adanya kesadaran jenis, hubungan timbal balik, dan norma bersama",
        "Kumpulan orang yang berada di satu lokasi geografis secara bersamaan",
        "Orang-orang yang memakai atribut pakaian seragam"
      ],
      kunci: 1,
      penjelasan: "Tepat! Kelompok sosial mensyaratkan adanya kesadaran keanggotaan (we-feeling), pola interaksi timbal balik berkelanjutan, dan aturan atau norma pengikat, bukan sekadar keberadaan fisik di tempat yang sama."
    }
  },
  {
    id: 2,
    judul: "Ragam dan Klasifikasi Kelompok Sosial",
    kategori: "Tipologi Sosial",
    ikon: "Layers",
    ringkasan: "Para sosiolog mengklasifikasikan kelompok sosial berdasarkan ikatan batin, struktur formalitas, identifikasi diri, serta keterikatan norma.",
    poinKunci: [
      "Ferdinand Tönnies: Gemeinschaft (Paguyuban - intim, privat, eksklusif seperti keluarga) vs Gesellschaft (Patembayan - kontraktual, formal, impersonal seperti perusahaan/serikat buruh).",
      "Charles Horton Cooley: Kelompok Primer (tatap muka intim, langgeng, keluarga/sahabat karib) vs Kelompok Sekunder (formal, tujuan instrumental, organisasi bisnis).",
      "William Graham Sumner: In-Group ('kelompok kami', rasa solidaritas & kesetiaan) vs Out-Group ('kelompok mereka', berpotensi memicu stereotip atau antipati).",
      "Robert K. Merton: Membership Group (diakui secara fisik/administratif) vs Reference Group (kelompok acuan dalam bersikap/gaya hidup walau bukan anggota resmi)."
    ],
    penjelasanLengkap: [
      "Paguyuban (Gemeinschaft) terbagi menjadi tiga jenis: Gemeinschaft by blood (ikatan darah/keluarga), Gemeinschaft of place (ikatan ketetanggaan/RT/desa), dan Gemeinschaft of mind (kesamaan visi/ideologi keagamaan).",
      "Patembayan (Gesellschaft) mendominasi kehidupan masyarakat perkotaan modern di mana relasi sosial diatur oleh hukum formal, perjanjian kontrak kerja, dan orientasi pamrih/keuntungan.",
      "Pemahaman konsep In-Group dan Out-Group sangat krusial dalam menganalisis fenomena etnosentrisme, fanatisme suporter sepak bola, dan polarisasi sosial di masyarakat multikultural."
    ],
    studiKasus: {
      judul: "Studi Kasus: Arisan Keluarga vs Serikat Karyawan Pabrik",
      deskripsi: "Arisan trah keluarga berkumpul atas dasar ikatan darah dan batin tanpa kontrak tertulis (Gemeinschaft by blood), sedangkan serikat pekerja pabrik dibangun dengan asas kontrak kerja profesional dan AD/ART hukum tertulis (Gesellschaft)."
    },
    kuisMini: {
      tanya: "Seorang mahasiswa arsitektur sering meniru gaya berpakaian dan etos kerja ikatan arsitek profesional dunia meskipun ia belum lulus. Ikatan arsitek tersebut berfungsi sebagai...",
      opsi: [
        "In-Group",
        "Membership Group",
        "Reference Group",
        "Gemeinschaft of blood"
      ],
      kunci: 2,
      penjelasan: "Benar! Reference group adalah kelompok sosial yang dijadikan acuan atau pedoman oleh seseorang dalam membentuk kepribadian dan perilakunya meskipun ia belum resmi menjadi anggota."
    }
  },
  {
    id: 3,
    judul: "Dinamika Kelompok Sosial dan Kepemimpinan",
    kategori: "Proses Sosial",
    ikon: "Activity",
    ringkasan: "Kelompok sosial bersifat dinamis dan mengalami perubahan akibat faktor internal (konflik antaranggota, pergantian pemimpin) maupun eksternal (perubahan lingkungan alam, situasi ekonomi-politik).",
    poinKunci: [
      "Model Perkembangan Kelompok Bruce Tuckman: 5 tahapan yaitu Forming (pembentukan), Storming (timbulnya konflik/gesekan), Norming (konsensus norma), Performing (kinerja optimal), dan Adjourning (pembubaran/evaluasi).",
      "Kohesivitas & Konformitas: Dorongan anggota untuk menyesuaikan diri dengan norma kelompok, yang jika berlebihan dapat menimbulkan fenomena 'Groupthink' (penurunan daya kritis demi keseragaman).",
      "Tipe Kepemimpinan: Otoriter (pemimpin mendominasi keputusan), Demokratis (mengutamakan partisipasi anggota), dan Laissez-faire (kebebasan mutlak kepada anggota)."
    ],
    penjelasanLengkap: [
      "Dinamika kelompok mencakup proses bagaimana anggota saling berinteraksi, beradaptasi, mengambil keputusan bersama, dan menyelesaikan perbedaan persepsi.",
      "Konflik dalam tahap 'Storming' bukanlah kegagalan kelompok, melainkan fase wajar pendewasaan sosial di mana anggota menguji batasan peran dan otoritas sebelum mencapai tahap kesepakatan norma ('Norming').",
      "Kepemimpinan demokratis terbukti paling efektif membangun kohesi jangka panjang pada kelompok masyarakat modern karena mengakomodasi gagasan dan memperkuat rasa memiliki (sense of belonging)."
    ],
    studiKasus: {
      judul: "Studi Kasus: Dinamika Pengurus OSIS Baru",
      deskripsi: "Pada bulan pertama kepengurusan OSIS, timbul perdebatan sengit mengenai anggaran kegiatan pensi (fase Storming). Setelah diadakan musyawarah mufakat menyepakati SOP keuangan baru (fase Norming), kepengurusan sukses menggelar acara dengan lancar (fase Performing)."
    },
    kuisMini: {
      tanya: "Ketika anggota kelompok ragu menyuarakan pendapat kritis karena takut merusak keharmonisan kelompok sehingga keputusan yang diambil justru keliru, fenomena ini disebut...",
      opsi: [
        "Social Loafing",
        "Groupthink",
        "Kolektivitas Mekanik",
        "Disorganisasi Sosial"
      ],
      kunci: 1,
      penjelasan: "Tepat sekali! Groupthink adalah kondisi psikososial ketika keinginan mencapai konsensus ekstrem membungkam pemikiran kritis dan pandangan alternatif dalam kelompok."
    }
  },
  {
    id: 4,
    judul: "Masalah Partikularisme dan Hubungan Antarkelompok",
    kategori: "Isu Kontemporer",
    ikon: "AlertTriangle",
    ringkasan: "Dalam masyarakat majemuk dan era digital, loyalitas kelompok yang sempit dapat melahirkan partikularisme, primordialisme berlebihan, eksklusi sosial, hingga polarisasi berbasis algoritma ruang gema (echo chamber).",
    poinKunci: [
      "Partikularisme Kelompok: Sikap yang mengutamakan kepentingan kelompoknya sendiri di atas kepentingan publik atau keadilan universal.",
      "Primordialisme & Etnosentrisme: Menilai budaya kelompok lain menggunakan ukuran kelompoknya sendiri yang dianggap paling unggul.",
      "Pola Hubungan Antarkelompok menurut Banton & Kinloch: Akulturasi, Asimilasi, Dominasi, Paternalisme, dan Integrasi/Pluralisme.",
      "Tantangan Digital: Filter bubble dan algoritma media sosial memicu radikalisasi In-Group dan prasangka mendalam terhadap Out-Group."
    ],
    penjelasanLengkap: [
      "Kurikulum Merdeka mendorong profil pelajar Pancasila yang mampu bersikap inklusif dan merayakan kebhinekaan global di tengah maraknya partikularisme kelompok.",
      "Eksklusi sosial terjadi ketika kelompok minoritas atau kelompok rentan dipinggirkan dari akses ekonomi, politik, dan ruang sosial oleh kelompok dominan.",
      "Transformasi konflik antarkelompok membutuhkan ruang perjumpaan lintas identitas (cross-cutting affiliations) dan literasi digital kritis agar ruang publik virtual tidak terbelah oleh sentimen kebencian."
    ],
    studiKasus: {
      judul: "Studi Kasus: Algoritma Media Sosial dan Polarisasi Pelajar",
      deskripsi: "Dua kelompok suporter sekolah saling melempar ejekan di media sosial karena algoritma linimasa terus menyodorkan konten provokatif (echo chamber). Setelah difasilitasi program dialog kolaboratif bakti sosial bersama, ketegangan mereda."
    },
    kuisMini: {
      tanya: "Sikap seorang pimpinan instansi yang hanya mau merekrut pegawai baru dari suku atau almamaternya sendiri tanpa memedulikan kompetensi objektif merupakan perwujudan dari...",
      opsi: [
        "Partikularisme dan Primordialisme sempit",
        "Pluralisme budaya",
        "Universalitas birokrasi",
        "Solidaritas organik modern"
      ],
      kunci: 0,
      penjelasan: "Tepat! Partikularisme kelompok mementingkan kelompok sendiri dengan mengabaikan prinsip meritokrasi objektif, yang kerap berakar dari primordialisme sempit."
    }
  },
  {
    id: 5,
    judul: "Harmonisasi Sosial dan Rekomendasi Pemecahan Masalah",
    kategori: "Integrasi & Harmoni",
    ikon: "HeartHandshake",
    ringkasan: "Mewujudkan kohesi dan integrasi sosial dalam masyarakat majemuk menuntut sikap inklusif, penegakan keadilan hukum, ruang perjumpaan lintas batas (cross-cutting), serta penguatan profil pelajar Pancasila yang toleran dan kolaboratif.",
    poinKunci: [
      "Integrasi Sosial: Proses penyesuaian unsur-unsur yang berbeda dalam masyarakat sehingga menjadi satu kesatuan yang utuh dan harmonis.",
      "Modal Sosial (Social Capital): Kepercayaan (trust), jaringan sosial (social network), dan norma timbal balik yang memperkuat daya rekat antarkelompok.",
      "Ruang Perjumpaan Lintas Batas (Cross-cutting Affiliations & Cross-cutting Loyalties): Mengurangi potensi konflik tajam dengan menciptakan keanggotaan ganda yang saling silang.",
      "Profil Pelajar Pancasila: Menghayati dimensi Berkebinekaan Global dan Gotong Royong sebagai benteng pencegah eksklusi sosial."
    ],
    penjelasanLengkap: [
      "Kemajemukan suku, agama, dan stratifikasi sosial di Indonesia dapat menjadi kekuatan bangsa bila dikelola dengan prinsip keadilan dan musyawarah mufakat, namun berpotensi memicu perpecahan bila dibiarkan larut dalam sentimen partikularistik.",
      "Penyelesaian konflik antarkelompok memerlukan pendekatan transformatif: bukan sekadar meredam bentrokan fisik, tetapi membongkar stereotip negatif dan prasangka melalui dialog deliberatif yang setara.",
      "Di lingkungan sekolah dan masyarakat, penciptaan proyek kolaborasi lintas kelompok (social project) terbukti secara sosiologis paling ampuh menumbuhkan empati dan meluruhkan sekat-sekat kelompok 'kami' versus 'mereka'."
    ],
    studiKasus: {
      judul: "Studi Kasus: Gerakan Festival Budaya & Gotong Royong Lintas Iman",
      deskripsi: "Warga di sebuah kelurahan heterogen menyelenggarakan Festival Kebinekaan dan pasar murah bersama menjelang hari raya keagamaan. Keterlibatan pemuda lintas iman dalam kepanitiaan bersama sukses menghapus stigma lama dan mempererat kerukunan warga."
    },
    kuisMini: {
      tanya: "Strategi sosiologis manakah yang paling efektif untuk mencegah konflik horizontal antarkelompok primordial dalam masyarakat multikultural?",
      opsi: [
        "Memisahkan wilayah pemukiman antarkelompok secara terisolasi (segregasi)",
        "Memfasilitasi kerja sama lintas identitas dan ruang perjumpaan bersama yang setara",
        "Mengharuskan kelompok minoritas meninggalkan seluruh identitas budayanya",
        "Menyerahkan seluruh resolusi kepada pihak yang memiliki kekuatan ekonomi terbesar"
      ],
      kunci: 1,
      penjelasan: "Tepat sekali! Menciptakan ruang dialog setara dan kerja sama nyata lintas kelompok (cross-cutting) terbukti meruntuhkan prasangka serta membangun integrasi sosial yang kokoh."
    }
  }
];

export const dataBermain: GameItem[] = [
  {
    id: 1,
    tipe: 'jodoh',
    judul: "Tebak Pasangan: Tokoh & Konsep Kelompok Sosial",
    instruksi: "Pasangkan nama sosiolog di sebelah kiri dengan konsep kelompok sosial yang dirumuskannya di sebelah kanan!",
    pasangan: [
      { id: "p1", kiri: "Ferdinand Tönnies", kanan: "Gemeinschaft (Paguyuban) & Gesellschaft (Patembayan)" },
      { id: "p2", kiri: "Charles Horton Cooley", kanan: "Primary Group (Kelompok Primer) & Secondary Group" },
      { id: "p3", kiri: "William Graham Sumner", kanan: "In-Group (Kelompok Kami) & Out-Group (Kelompok Mereka)" },
      { id: "p4", kiri: "Emile Durkheim", kanan: "Solidaritas Mekanik & Solidaritas Organik" }
    ]
  },
  {
    id: 2,
    tipe: 'klik',
    judul: "Tantangan Kilat: Pilah Ciri Paguyuban (Gemeinschaft)",
    instruksi: "Klik semua pernyataan yang merupakan ciri sejati dari Paguyuban (Gemeinschaft)! Hati-hati dengan ciri Patembayan!",
    waktuDetik: 30,
    targetKategori: "Ciri Paguyuban (Gemeinschaft)",
    itemKlik: [
      { teks: "Ikatan batin murni, alami, dan kekal", benar: true },
      { teks: "Hubungan bersifat personal dan intim", benar: true },
      { teks: "Berdasarkan perjanjian kontrak kerja tertulis", benar: false },
      { teks: "Bersifat eksklusif (hanya untuk kelompoknya)", benar: true },
      { teks: "Orientasi pamrih ekonomi dan efisiensi waktu", benar: false },
      { teks: "Contohnya adalah ikatan keluarga dan rukun tetangga", benar: true },
      { teks: "Contohnya adalah perseroan terbatas (PT) dan serikat buruh", benar: false },
      { teks: "Berasal dari kemauan batiniah (Wesenwille)", benar: true }
    ]
  },
  {
    id: 3,
    tipe: 'urut',
    judul: "Susun Runtut: 5 Tahapan Perkembangan Kelompok (Bruce Tuckman)",
    instruksi: "Urutkan tahapan dinamika kelompok Bruce Tuckman dari fase permulaan hingga fase akhir evaluasi!",
    urutanBenar: [
      "Forming (Fase Orientasi & Penjajakan Anggota)",
      "Storming (Fase Timbulnya Konflik & Perbedaan Pendapat)",
      "Norming (Fase Pembentukan Konsensus & Aturan Bersama)",
      "Performing (Fase Kerja Sama Produktif & Sinergi Kinerja)",
      "Adjourning (Fase Penyelesaian Tugas & Pembubaran/Evaluasi)"
    ]
  },
  {
    id: 4,
    tipe: 'kumpul',
    judul: "Koleksi Karakter: Ciri Khas Kelompok Primer",
    instruksi: "Pilih dan kumpulkan semua karakteristik yang tergolong ke dalam Kelompok Primer (Primary Group)!",
    itemKumpul: [
      { teks: "Interaksi tatap muka langsung (face-to-face)", benar: true, poin: 20 },
      { teks: "Hubungan intim, mendalam, dan bersifat personal", benar: true, poin: 20 },
      { teks: "Aturan hukum formal dengan sanksi tertulis tegas", benar: false, poin: -10 },
      { teks: "Terdapat perasaan senasib sepenanggungan (we-feeling)", benar: true, poin: 20 },
      { teks: "Hubungan didasari asas transaksional pamrih", benar: false, poin: -10 },
      { teks: "Jumlah anggota relatif kecil dan tahan lama", benar: true, poin: 20 },
      { teks: "Dibatasi oleh masa kontrak kerja spesifik", benar: false, poin: -10 },
      { teks: "Keluarga inti dan sahabat karib masa kecil", benar: true, poin: 20 }
    ]
  },
  {
    id: 5,
    tipe: 'sambung',
    judul: "Rantai Logika: Sebab-Akibat Fenomena Polarisasi Digital",
    instruksi: "Hubungkan setiap fenomena pemicu di sebelah kiri dengan akibat sosiologis yang ditimbulkannya di sebelah kanan!",
    rantaiLogika: [
      { sebab: "Algoritma rekomendasi media sosial yang homogen", akibat: "Terciptanya ruang gema (echo chamber) antarpengguna" },
      { sebab: "Menguatnya fanatisme identitas kelompok yang kaku", akibat: "Meningkatnya prasangka dan stereotip terhadap out-group" },
      { sebab: "Kurangnya interaksi dialogis lintas kelompok sosial", akibat: "Rendahnya empati dan munculnya eksklusi sosial" },
      { sebab: "Fasilitasi ruang perjumpaan budaya yang inklusif", akibat: "Terwujudnya integrasi sosial dan kerukunan multikultural" }
    ]
  },
  {
    id: 6,
    tipe: 'jodoh',
    judul: "Pasangkan Konsep: Bentuk Kelompok & Realitas di Indonesia",
    instruksi: "Jodohkan contoh kelompok sosial nyata di Indonesia dengan konsep sosiologis yang tepat!",
    pasangan: [
      { id: "p5", kiri: "Masyarakat Adat Kampung Naga Tasikmalaya", kanan: "Gemeinschaft of Place (Paguyuban Wilayah)" },
      { id: "p6", kiri: "Ikatan Dokter Indonesia (IDI)", kanan: "Kelompok Okupasional / Asosiasi Profesi" },
      { id: "p7", kiri: "Remaja yang mengidolakan girlband Korea dan meniru gayanya", kanan: "Reference Group (Kelompok Acuan)" },
      { id: "p8", kiri: "Keluarga Besar Bani Kartowiyono yang rutin halalbihalal", kanan: "Gemeinschaft by Blood (Ikatan Darah)" }
    ]
  },
  {
    id: 7,
    tipe: 'klik',
    judul: "Cepat Tanggap: Pilah Sikap Inklusif vs Partikularisme",
    instruksi: "Klik hanya sikap-sikap yang mencerminkan Keterbukaan & Sikap Inklusif Pelajar Pancasila!",
    waktuDetik: 30,
    targetKategori: "Sikap Inklusif dalam Keberagaman",
    itemKlik: [
      { teks: "Menghargai perbedaan pendapat saat musyawarah kelas", benar: true },
      { teks: "Hanya mau berteman dengan teman yang satu suku saja", benar: false },
      { teks: "Memberi ruang setara bagi penyandang disabilitas di sekolah", benar: true },
      { teks: "Menganggap budaya kelompoknya yang paling sempurna dan unggul", benar: false },
      { teks: "Membangun kerja sama lintas agama dalam kegiatan sosial", benar: true },
      { teks: "Menolak membeli produk dari pedagang berbeda ras", benar: false },
      { teks: "Mengembangkan empati dan prasangka positif antarkelompok", benar: true },
      { teks: "Menyebarkan narasi kebencian terhadap suporter tim lawan", benar: false }
    ]
  },
  {
    id: 8,
    tipe: 'urut',
    judul: "Spektrum Relasi: Urutkan Tingkat Keterbukaan Antarkelompok",
    instruksi: "Urutkan pola hubungan antarkelompok dari yang paling eksklusif/represif hingga yang paling inklusif/harmonis!",
    urutanBenar: [
      "1. Genosida & Eksploitasi (Pemusnahan atau penindasan mutlak)",
      "2. Segregasi (Pemisahan ras/etnis secara paksa)",
      "3. Paternalisme (Dominasi kelompok penguasa atas kelompok pribumi)",
      "4. Akulturasi (Percampuran unsur kebudayaan tanpa hilang identitas)",
      "5. Integrasi & Pluralisme (Pengakuan kesetaraan hak dalam kebhinekaan)"
    ]
  },
  {
    id: 9,
    tipe: 'kumpul',
    judul: "Koleksi Teori: Karakteristik Solidaritas Organik (Durkheim)",
    instruksi: "Tangkap semua ciri masyarakat dengan Solidaritas Organik menurut Emile Durkheim!",
    itemKumpul: [
      { teks: "Terdapat pembagian kerja (spesialisasi) yang sangat tinggi", benar: true, poin: 20 },
      { teks: "Kesadaran kolektif sangat kuat mendominasi individu", benar: false, poin: -10 },
      { teks: "Hukum yang berlaku bersifat restitutif (pemulihan hak)", benar: true, poin: 20 },
      { teks: "Hukum bersifat represif dan menghukum dengan kejam", benar: false, poin: -10 },
      { teks: "Saling ketergantungan fungsional antarprofesi di kota", benar: true, poin: 20 },
      { teks: "Masyarakat homogen tanpa spesialisasi keahlian", benar: false, poin: -10 },
      { teks: "Ikatan didasarkan pada kebutuhan saling melengkapi", benar: true, poin: 20 },
      { teks: "Individualisme diakui dan berkembang secara profesional", benar: true, poin: 20 }
    ]
  },
  {
    id: 10,
    tipe: 'sambung',
    judul: "Alur Damai: Rantai Mediasi & Resolusi Konflik Kelompok",
    instruksi: "Sambungkan tahapan pemecahan konflik antarkelompok dengan aksi nyata yang dilakukan di lapangan!",
    rantaiLogika: [
      { sebab: "1. Identifikasi Akar Masalah", akibat: "Memetakan perbedaan kepentingan dan prasangka antarpihak" },
      { sebab: "2. Menunjuk Pihak Ketiga yang Netral", akibat: "Memulai proses mediasi tanpa memihak salah satu kubu" },
      { sebab: "3. Dialog Terbuka & Negosiasi", akibat: "Menyampaikan aspirasi dan mencari titik temu win-win solution" },
      { sebab: "4. Perjanjian Kesepakatan Bersama", akibat: "Menciptakan konsensus baru dan mekanisme pemulihan harmoni" }
    ]
  }
];

export const dtLatih: SoalLatih[] = [
  {
    no: 1,
    t: 'pg',
    aktifUntukBerlatih: true,
    isHots: true,
    stimulus: "Di sebuah kompleks perumahan, warga rutin mengadakan kerja bakti setiap bulan, membentuk pengurus RT, membuat grup komunikasi warga, dan menyepakati aturan jam malam demi kenyamanan bersama. Warga merasa saling memiliki ikatan batin dan saling tolong-menolong saat ada tetangga tertimpa musibah.",
    tanya: "Berdasarkan wacana di atas, kumpulan warga tersebut telah memenuhi syarat sebagai kelompok sosial menurut Soerjono Soekanto karena...",
    opsi: [
      "Tinggal di wilayah geografis yang sama meskipun jarang berkomunikasi",
      "Memiliki kesadaran bersama, hubungan timbal balik, faktor pengikat, dan sistem norma",
      "Memiliki jumlah anggota yang lebih dari 100 orang dalam satu kartu keluarga",
      "Mempunyai kesamaan hobi dan mata pencaharian yang seragam",
      "Dipimpin oleh aparat keamanan pemerintah setempat"
    ],
    j: 1,
    msg: "Pembahasan: Menurut Soerjono Soekanto, syarat terbentuknya kelompok sosial adalah: 1) Ada kesadaran bahwa ia merupakan bagian dari kelompok, 2) Ada hubungan timbal balik antaranggota, 3) Ada faktor pengikat (kepentingan, aturan bersama), 4) Berstruktur, berkaidah, dan memiliki pola perilaku, 5) Bersistem dan berproses. Warga kompleks perumahan tersebut memenuhi seluruh kriteria ini."
  },
  {
    no: 2,
    t: 'pg_kompleks',
    aktifUntukBerlatih: true,
    isHots: true,
    stimulus: "Masyarakat adat Baduy Dalam di Banten mempertahankan pola hidup leluhur secara turun-temurun tanpa listrik dan internet. Hubungan antarwarga terjalin sangat erat berlandaskan ikatan batin yang tulus, nilai gotong royong mendalam, dan rasa kebersamaan yang tidak dinilai dengan materi atau kontrak formal.",
    tanya: "Berdasarkan tipologi Ferdinand Tönnies, manakah pernyataan yang BENAR mengenai ciri-ciri paguyuban (Gemeinschaft) yang tercermin pada masyarakat tersebut? (Pilih lebih dari satu jawaban benar)",
    opsi: [
      "Hubungan sosial bersifat intim, pribadi, dan eksklusif",
      "Ikatan didasarkan pada perjanjian kerja dan pamrih ekonomis",
      "Bersumber dari kemauan kodrati murni (Wesenwille)",
      "Terbentuk atas dasar pembagian kerja spesifik dan kontraktual",
      "Memiliki solidaritas yang berakar pada tradisi dan ikatan batin alamiah"
    ],
    j: [0, 2, 4],
    msg: "Pembahasan: Gemeinschaft (Paguyuban) dicirikan oleh: hubungan intim, pribadi, eksklusif, bersumber dari kemauan kodrati (Wesenwille), dan didasarkan pada ikatan batin murni/tradisi. Opsi B dan D merupakan ciri Gesellschaft (Patembayan) yang rasional dan kontraktual."
  },
  {
    no: 3,
    t: 'jodoh',
    aktifUntukBerlatih: true,
    isHots: true,
    stimulus: "Sosiologi membedakan berbagai bentuk kelompok sosial berdasarkan sudut pandang individu dalam mengidentifikasi diri dan orang lain di lingkungannya.",
    tanya: "Pasangkan konsep kelompok sosial di kolom kiri dengan deskripsi perilaku sosiologis yang tepat di kolom kanan!",
    pasanganJodoh: [
      { kiri: "In-Group", kanan: "Kelompok sosial tempat individu mengidentifikasikan dirinya dengan simpati dan loyalitas tinggi ('kelompok kami')" },
      { kiri: "Out-Group", kanan: "Kelompok luar yang dianggap sebagai lawan, pesaing, atau ditandai sikap antipati ('kelompok mereka')" },
      { kiri: "Reference Group", kanan: "Kelompok yang dijadikan acuan atau standar oleh seseorang dalam bersikap meski bukan anggota resmi" },
      { kiri: "Membership Group", kanan: "Kelompok di mana seseorang secara fisik dan administratif terdaftar resmi sebagai anggota" }
    ],
    j: [
      { kiri: "In-Group", kanan: "Kelompok sosial tempat individu mengidentifikasikan dirinya dengan simpati dan loyalitas tinggi ('kelompok kami')" },
      { kiri: "Out-Group", kanan: "Kelompok luar yang dianggap sebagai lawan, pesaing, atau ditandai sikap antipati ('kelompok mereka')" },
      { kiri: "Reference Group", kanan: "Kelompok yang dijadikan acuan atau standar oleh seseorang dalam bersikap meski bukan anggota resmi" },
      { kiri: "Membership Group", kanan: "Kelompok di mana seseorang secara fisik dan administratif terdaftar resmi sebagai anggota" }
    ],
    msg: "Pembahasan: In-group dan out-group dirumuskan oleh W.G. Sumner. In-group melahirkan perasaan 'kami' (in-group feeling), sedangkan out-group melahirkan jarak sosial 'mereka'. Robert K. Merton membedakan membership group (keanggotaan administratif) dan reference group (acuan nilai dan norma perilaku)."
  },
  {
    no: 4,
    t: 'pg',
    aktifUntukBerlatih: true,
    isHots: true,
    stimulus: "Di kawasan industri Cikarang, ribuan karyawan bekerja di pabrik otomotif modern. Setiap pekerja memiliki spesialisasi khusus (bagian mesin, perakitan, pengecatan, hingga quality control). Mereka saling membutuhkan keahlian satu sama lain untuk memproduksi sebuah mobil utuh, dan hukum ketenagakerjaan mengatur hak serta kompensasi mereka.",
    tanya: "Menurut teori Emile Durkheim, jenis solidaritas yang mendasari keterikatan kelompok kerja tersebut adalah...",
    opsi: [
      "Solidaritas Mekanik karena semua pekerja memiliki tujuan hidup yang seragam",
      "Solidaritas Tradisional karena didasarkan pada adat istiadat setempat",
      "Solidaritas Organik karena didasarkan pada pembagian kerja dan saling ketergantungan fungsional",
      "Gemeinschaft by blood karena para pekerja telah menganggap rekan kerjanya seperti saudara",
      "Kelompok Primer karena para pekerja bertemu setiap hari di pabrik"
    ],
    j: 2,
    msg: "Pembahasan: Emile Durkheim membedakan Solidaritas Mekanik (masyarakat sederhana/homogen, pembagian kerja rendah, kesadaran kolektif dominan) dengan Solidaritas Organik (masyarakat kompleks/industri, pembagian kerja tinggi, saling ketergantungan antarspesialisasi, dan hukum restitutif)."
  },
  {
    no: 5,
    t: 'pg_kompleks',
    aktifUntukBerlatih: true,
    isHots: true,
    stimulus: "Menjelang pemilihan kepala daerah atau pengurus organisasi pemuda, kerap muncul narasi di media sosial yang mengimbau agar hanya memilih calon dari kelompok etnis atau agama tertentu. Narasi ini memicu segregasi sosial di mana warga enggan menghadiri kegiatan lingkungan lintas kelompok.",
    tanya: "Manakah dampak negatif dari partikularisme kelompok dan primordialisme sempit berdasarkan stimulus di atas? (Pilih lebih dari satu jawaban benar)",
    opsi: [
      "Menghambat terwujudnya integrasi dan kohesi sosial dalam masyarakat multikultural",
      "Memperkuat prinsip meritokrasi dan profesionalisme dalam pemilihan pemimpin",
      "Memicu polarisasi sosial dan diskriminasi terhadap kelompok minoritas",
      "Mendorong tumbuhnya rasa toleransi dan multikulturalisme global",
      "Menimbulkan eksklusi sosial di mana akses partisipasi publik terhambat"
    ],
    j: [0, 2, 4],
    msg: "Pembahasan: Partikularisme kelompok adalah sikap mementingkan kelompok sendiri secara sempit. Dampak negatifnya antara lain: merusak integrasi sosial bangsa, menyuburkan diskriminasi/polarisasi, dan menciptakan eksklusi sosial bagi kelompok lain. Pilihan B dan D merupakan kebalikan dari dampak partikularisme."
  },
  {
    no: 6,
    t: 'drag_word',
    aktifUntukBerlatih: true,
    isHots: true,
    stimulus: "Charles Horton Cooley mengemukakan bahwa kelompok sosial pertama yang dimasuki oleh manusia sejak dini memainkan peranan krusial dalam membentuk kepribadian dasar dan nilai-nilai kemanusiaan.",
    tanya: "Lengkapilah kalimat rumpang sosiologis di bawah ini dengan memilih kata yang tepat!",
    kalimatRumpang: "Kelompok [KATA_1] ditandai oleh pergaulan dan kerja sama [KATA_2] yang bersifat mendalam, langgeng, dan tatap muka secara langsung, seperti yang ditemukan pada lingkungan [KATA_3].",
    kataPilihan: ["Primer", "Sekunder", "Intim", "Formal", "Keluarga", "Perusahaan"],
    j: ["Primer", "Intim", "Keluarga"],
    msg: "Pembahasan: Menurut Charles Horton Cooley, 'Kelompok Primer' (Primary Group) ditandai oleh pergaulan dan kerja sama tatap muka yang akrab/intim, bersifat mendasar dan kekal, dengan contoh utama adalah keluarga dan kelompok teman sepermainan (peer group)."
  },
  {
    no: 7,
    t: 'pg',
    aktifUntukBerlatih: true,
    isHots: true,
    stimulus: "Sebuah kelompok riset ilmiah remaja baru saja dibentuk. Setelah dua minggu berjalan, mulai timbul gesekan antaranggotanya. Sebagian anggota merasa pembagian tugas tidak adil, ketua kelompok dinilai terlalu dominan, dan terjadi perdebatan panas mengenai topik penelitian yang akan dipilih hingga komunikasi sempat terhenti.",
    tanya: "Ditinjau dari model perkembangan kelompok Bruce Tuckman, kelompok riset tersebut saat ini sedang berada pada tahap...",
    opsi: [
      "Forming, karena kelompok baru saja diperkenalkan satu sama lain",
      "Storming, karena mulai timbul konflik interpersonal, perebutan peran, dan resistensi emosional",
      "Norming, karena anggota telah menyepakati aturan dan struktur kepemimpinan baru",
      "Performing, karena kelompok sudah mampu memproduksi karya ilmiah bermutu tinggi",
      "Adjourning, karena kelompok memutuskan untuk membubarkan diri secara permanen"
    ],
    j: 1,
    msg: "Pembahasan: Menurut Bruce Tuckman, tahap perkembangan kelompok adalah: Forming (orientasi), Storming (fase konflik/pergolakan akibat gesekan kepribadian dan peran), Norming (konsensus aturan dan kohesi), Performing (kerja optimal), dan Adjourning (pembubaran). Kelompok riset tersebut sedang mengalami fase Storming."
  },
  {
    no: 8,
    t: 'pg_kompleks',
    aktifUntukBerlatih: true,
    isHots: true,
    stimulus: "Kelompok sosial bukanlah entitas statis melainkan senantiasa mengalami perubahan (dinamika sosial). Terkadang sebuah organisasi kemahasiswaan yang awalnya sangat solid dapat mengalami perpecahan atau justru bertransformasi menjadi lebih adaptif.",
    tanya: "Faktor internal manakah yang dapat mendorong terjadinya dinamika dalam suatu kelompok sosial? (Pilih lebih dari satu jawaban benar)",
    opsi: [
      "Konflik antaranggota atau faksi di dalam kelompok",
      "Perubahan kondisi iklim dan bencana alam di lingkungan sekitar",
      "Perbedaan kepentingan dan orientasi tujuan antaranggota",
      "Pergantian struktur kepemimpinan dan gaya kepemimpinan",
      "Invasi militer atau tekanan kebijakan politik dari negara lain"
    ],
    j: [0, 2, 3],
    msg: "Pembahasan: Faktor pendorong dinamika kelompok dibagi menjadi: 1) Faktor Internal: konflik antaranggota, perbedaan kepentingan/tujuan, dan pergantian kepemimpinan. 2) Faktor Eksternal: perubahan lingkungan alam (bencana), perubahan situasi ekonomi/politik makro, dan tekanan kelompok lain. Jadi jawaban internal adalah A, C, dan D."
  },
  {
    no: 9,
    t: 'jodoh',
    aktifUntukBerlatih: true,
    isHots: true,
    stimulus: "Michael Banton dan para sosiolog membagi pola hubungan antarkelompok ras dan etnis di masyarakat berdasarkan derajat penerimaan sosial dan perlakuan kekuasaan.",
    tanya: "Pasangkan pola hubungan antarkelompok di kolom kiri dengan contoh manifestasi sosiologisnya di kolom kanan!",
    pasanganJodoh: [
      { kiri: "Paternalisme", kanan: "Bentuk dominasi kelompok pendatang atas kelompok pribumi di mana penguasa memosisikan diri sebagai pelindung sekaligus pengontrol (misal: era kolonial Hindia Belanda)" },
      { kiri: "Asimilasi", kanan: "Peleburan dua kebudayaan berbeda menjadi satu kebudayaan baru sehingga identitas kebudayaan asli berangsur-angsur hilang" },
      { kiri: "Akulturasi", kanan: "Pertemuan dua unsur kebudayaan berbeda yang saling berbaur tanpa menghilangkan ciri kepribadian budaya masing-masing" },
      { kiri: "Pluralisme / Integrasi", kanan: "Pola hubungan yang mengakui dan menghormati hak kesetaraan martabat setiap kelompok dalam satu ikatan kewarganegaraan" }
    ],
    j: [
      { kiri: "Paternalisme", kanan: "Bentuk dominasi kelompok pendatang atas kelompok pribumi di mana penguasa memosisikan diri sebagai pelindung sekaligus pengontrol (misal: era kolonial Hindia Belanda)" },
      { kiri: "Asimilasi", kanan: "Peleburan dua kebudayaan berbeda menjadi satu kebudayaan baru sehingga identitas kebudayaan asli berangsur-angsur hilang" },
      { kiri: "Akulturasi", kanan: "Pertemuan dua unsur kebudayaan berbeda yang saling berbaur tanpa menghilangkan ciri kepribadian budaya masing-masing" },
      { kiri: "Pluralisme / Integrasi", kanan: "Pola hubungan yang mengakui dan menghormati hak kesetaraan martabat setiap kelompok dalam satu ikatan kewarganegaraan" }
    ],
    msg: "Pembahasan: Banton mengemukakan pola hubungan antarkelompok: akulturasi (perpaduan tanpa hilang ciri asli), asimilasi (peleburan jadi kebudayaan tunggal baru), paternalisme (penguasaan kolonial paternal), dominasi (penaklukan), dan pluralisme/integrasi (koeksistensi setara dalam kebhinekaan)."
  },
  {
    no: 10,
    t: 'pg',
    aktifUntukBerlatih: true,
    isHots: true,
    stimulus: "Dalam ruang media sosial, pengguna kerap berinteraksi hanya dengan akun-akun yang memiliki pandangan politik dan ideologi serupa. Algoritma platform secara berkesinambungan hanya menyajikan informasi yang memvalidasi keyakinan mereka, sementara pandangan dari kelompok lain diabaikan atau diserang dengan narasi permusuhan.",
    tanya: "Fenomena sosiologis digital di mana individu terisolasi dalam ruang gema informasi kelompoknya sendiri sehingga memperkuat prasangka terhadap kelompok luar dikenal sebagai...",
    opsi: [
      "Social Mobility dan Difusi Budaya",
      "Echo Chamber dan Filter Bubble yang memperparah polarisasi sosial",
      "Gemeinschaft of mind yang mempererat toleransi lintas bangsa",
      "Konvergensi Budaya Universal",
      "Transformasi Solidaritas Mekanik menjadi Organik"
    ],
    j: 1,
    msg: "Pembahasan: Echo Chamber (ruang gema) dan Filter Bubble adalah fenomena komunikasi digital di mana algoritma menyaring konten sehingga pengguna hanya terpapar informasi yang sejalan dengan prasangkanya sendiri. Hal ini memperkuat polarisasi in-group vs out-group dan menghambat dialog inklusif yang sehat di masyarakat demokratis."
  }
];
