import { CONFIG, MATERI, dataBermain, dtLatih } from '../data/mpiData';
import { MpiConfig, MateriItem, GameItem, SoalLatih } from '../types';

export function generateStandaloneMpiHtml(
  customConfig?: MpiConfig,
  customMateri?: MateriItem[],
  customBermain?: GameItem[],
  customLatih?: SoalLatih[]
): string {
  const activeConfig: MpiConfig = customConfig || CONFIG;
  const activeMateri: MateriItem[] = customMateri || MATERI;
  const activeBermain: GameItem[] = customBermain || dataBermain;
  const rawLatih: SoalLatih[] = customLatih || dtLatih;
  const filteredLatih = rawLatih.filter(q => q.aktifUntukBerlatih !== false);
  const activeLatih: SoalLatih[] = filteredLatih.length > 0 ? filteredLatih : rawLatih;
  const fotoProfilUrl = activeConfig.fotoProfil || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

  const configJson = JSON.stringify(activeConfig, null, 2);
  const materiJson = JSON.stringify(activeMateri, null, 2);
  const dataBermainJson = JSON.stringify(activeBermain, null, 2);
  const dtLatihJson = JSON.stringify(activeLatih, null, 2);

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <meta name="theme-color" content="#1e3a8a">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>${activeConfig.judul} - ${activeConfig.mataPelajaran} (${activeConfig.fase})</title>
  <style>
    /* ==========================================================================
       CSS BASE & TEMPLATE MPI OFFLINE KURIKULUM MERDEKA
       100% Offline Ready - Responsif Maksimal untuk Android & iPhone
       ========================================================================== */
    :root {
      --primary: #1e3a8a;
      --primary-light: #3b82f6;
      --primary-dark: #172554;
      --secondary: #0d9488;
      --accent: #f59e0b;
      --success: #16a34a;
      --danger: #dc2626;
      --bg: #f8fafc;
      --surface: #ffffff;
      --text: #0f172a;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --radius: 14px;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* HEADER */
    header {
      background: linear-gradient(135deg, var(--primary-dark), var(--primary));
      color: white;
      padding: 1.25rem 1.5rem;
      box-shadow: var(--shadow);
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .brand-title {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 0.875rem;
      color: #cbd5e1;
      font-weight: 500;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-sound {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 9999px;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: background 0.2s;
    }

    .btn-sound:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    /* NAV TABS */
    nav.nav-tabs {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      position: sticky;
      top: 68px;
      z-index: 40;
    }

    .tab-btn {
      background: transparent;
      border: none;
      padding: 0.65rem 1.25rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--text-muted);
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background-color: #eff6ff;
      color: var(--primary);
    }

    .tab-btn:hover:not(.active) {
      background-color: #f1f5f9;
      color: var(--text);
    }

    .tab-btn.tab-locked {
      opacity: 0.72;
      color: #64748b;
    }

    .tab-lock-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 800;
      background: #fef3c7;
      color: #b45309;
      border: 1px solid #fde68a;
    }

    .tab-done-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-size: 0.68rem;
      font-weight: 800;
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }

    .prereq-ribbon {
      background: #0f172a;
      color: #e2e8f0;
      padding: 0.55rem 1.25rem;
      font-size: 0.8rem;
      border-bottom: 1px solid #1e293b;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
    }

    .prereq-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .prereq-modal-box {
      background: #ffffff;
      border-radius: 24px;
      max-width: 460px;
      width: 100%;
      padding: 1.75rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1.5px solid #fde68a;
      animation: fadeIn 0.25s ease;
    }

    /* MAIN CONTENT */
    main {
      max-width: 1100px;
      width: 100%;
      margin: 1.5rem auto;
      padding: 0 1rem;
      flex: 1;
    }

    .section-view {
      display: none;
      animation: fadeIn 0.3s ease;
    }

    .section-view.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* CARDS & CONTAINERS */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      box-shadow: var(--shadow);
      margin-bottom: 1.5rem;
    }

    /* MATERI STYLES */
    .materi-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 1.5rem;
    }

    @media (max-width: 860px) {
      .materi-grid {
        grid-template-columns: 1fr;
      }
    }

    .submateri-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .submateri-btn {
      text-align: left;
      padding: 0.85rem 1rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text);
      cursor: pointer;
      transition: all 0.15s;
    }

    .submateri-btn.active {
      background: var(--primary);
      color: white;
      border-color: var(--primary);
    }

    .submateri-btn.locked {
      background: #f1f5f9;
      color: #94a3b8;
      border-color: #e2e8f0;
      opacity: 0.75;
      cursor: not-allowed;
    }

    .submateri-btn.completed {
      border-left: 4px solid var(--success);
    }

    .materi-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }

    .materi-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--primary-dark);
      margin-bottom: 0.75rem;
    }

    .materi-box {
      background: #f8fafc;
      border-left: 4px solid var(--primary-light);
      padding: 1rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.25rem;
      font-size: 0.95rem;
    }

    .poin-kunci {
      margin: 1rem 0;
      padding-left: 1.25rem;
    }

    .poin-kunci li {
      margin-bottom: 0.5rem;
      color: #334155;
    }

    .mini-kuis-box {
      background: #fefce8;
      border: 1px solid #fef08a;
      border-radius: 8px;
      padding: 1.25rem;
      margin-top: 1.5rem;
    }

    .mini-kuis-opsi {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }

    .mini-btn {
      text-align: left;
      padding: 0.6rem 0.85rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.15s;
    }

    .mini-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    /* GAME MODULE STYLES */
    .game-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }

    .game-num-btn {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background: white;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      transition: all 0.15s;
    }

    .game-num-btn.active {
      background: var(--secondary);
      color: white;
      border-color: var(--secondary);
    }

    .game-num-btn.done {
      background: #ecfdf5;
      color: #047857;
      border-color: #a7f3d0;
    }

    .game-container {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
    }

    .game-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
    }

    .game-type-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #f1f5f9;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #475569;
    }

    /* Jodoh Game */
    .jodoh-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .item-selectable {
      padding: 0.85rem 1rem;
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.15s;
      user-select: none;
    }

    .item-selectable:hover {
      border-color: var(--primary-light);
      background: #eff6ff;
    }

    .item-selectable.selected {
      border-color: var(--primary);
      background: #dbeafe;
      font-weight: 700;
    }

    .item-selectable.matched {
      border-color: var(--success);
      background: #dcfce7;
      color: #166534;
      cursor: default;
    }

    /* Klik Game */
    .klik-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .item-klik-card {
      padding: 1rem;
      border: 2px solid var(--border);
      border-radius: 8px;
      background: #fafafa;
      cursor: pointer;
      text-align: center;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.15s;
    }

    .item-klik-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }

    .item-klik-card.clicked-correct {
      background: #dcfce7;
      border-color: var(--success);
      color: #15803d;
    }

    .item-klik-card.clicked-wrong {
      background: #fee2e2;
      border-color: var(--danger);
      color: #b91c1c;
    }

    /* Urut Game */
    .urut-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .urut-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
    }

    .urut-ctrls {
      display: flex;
      gap: 0.25rem;
    }

    .btn-reorder {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      width: 28px;
      height: 28px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 800;
    }

    /* Kumpul Game */
    .kumpul-zone {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin: 1rem 0;
    }

    .kumpul-item {
      padding: 0.65rem 1rem;
      background: #f8fafc;
      border: 2px dashed #cbd5e1;
      border-radius: 9999px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .kumpul-item.collected {
      background: #dcfce7;
      border-color: var(--success);
      color: #15803d;
      border-style: solid;
    }

    .kumpul-item.pengecoh-clicked {
      background: #fee2e2;
      border-color: var(--danger);
      color: #b91c1c;
      border-style: solid;
    }

    /* EVALUASI / BERLATIH STYLES */
    .latih-progress-bar {
      display: flex;
      gap: 0.35rem;
      margin-bottom: 1.25rem;
    }

    .latih-step {
      flex: 1;
      height: 6px;
      background: #e2e8f0;
      border-radius: 9999px;
    }

    .latih-step.active {
      background: var(--primary);
    }

    .latih-step.correct {
      background: var(--success);
    }

    .latih-step.incorrect {
      background: var(--danger);
    }

    .stimulus-box {
      background: #f8fafc;
      border-left: 4px solid var(--secondary);
      padding: 1rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.25rem;
      font-size: 0.95rem;
      color: #334155;
    }

    .soal-tanya {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text);
    }

    .opsi-list {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-bottom: 1.5rem;
    }

    .opsi-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .opsi-item:hover {
      border-color: var(--primary-light);
      background: #f8fafc;
    }

    .opsi-item.selected {
      border-color: var(--primary);
      background: #eff6ff;
      font-weight: 600;
    }

    .opsi-item.ans-correct {
      border-color: var(--success);
      background: #dcfce7;
      color: #14532d;
    }

    .opsi-item.ans-wrong {
      border-color: var(--danger);
      background: #fee2e2;
      color: #7f1d1d;
    }

    .opsi-marker {
      width: 26px;
      height: 26px;
      border-radius: 9999px;
      background: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .opsi-item.selected .opsi-marker {
      background: var(--primary);
      color: white;
    }

    .pembahasan-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 1.25rem;
      margin-top: 1rem;
      font-size: 0.95rem;
      color: #166534;
      animation: fadeIn 0.3s;
    }

    .btn-action {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: background 0.2s;
    }

    .btn-action:hover {
      background: var(--primary-dark);
    }

    .btn-action:disabled {
      background: #94a3b8;
      cursor: not-allowed;
    }

    /* MODAL EXPORT & DIALOG */
    .report-card {
      text-align: center;
      padding: 2.5rem 1.5rem;
    }

    .score-circle {
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: var(--primary);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      box-shadow: 0 8px 16px rgba(30, 58, 138, 0.25);
    }

    .score-number {
      font-size: 2.75rem;
      font-weight: 800;
      line-height: 1;
    }

    .score-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    /* MULTIMEDIA & ANIMASI OFFLINE STYLES */
    .mpi-media-container {
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .mpi-media-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.85rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .mpi-media-img {
      max-width: 100%;
      height: auto;
      border-radius: 6px;
      display: block;
      margin: 0 auto;
    }
    .mpi-media-caption {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 0.35rem;
      text-align: center;
      font-style: italic;
    }
    .mpi-media-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      margin: 0.5rem 0;
    }
    .mpi-media-table th, .mpi-media-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    .mpi-media-table th {
      background-color: #f1f5f9;
      font-weight: 700;
      color: #1e293b;
    }
    .mpi-media-audio {
      width: 100%;
      margin-top: 0.5rem;
    }
    .mpi-media-video {
      width: 100%;
      aspect-ratio: 16 / 9;
      border-radius: 6px;
      border: 0;
    }

    /* ANIMASI KEYFRAMES & UTILITIES */
    @keyframes mpiFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes mpiSlideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes mpiBounceIn { 0% { opacity: 0; transform: scale(0.9); } 60% { opacity: 1; transform: scale(1.03); } 100% { transform: scale(1); } }
    @keyframes mpiPulseSlow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }

    .anim-fade-in { animation: mpiFadeIn 0.4s ease-out both; }
    .anim-slide-up { animation: mpiSlideUp 0.4s ease-out both; }
    .anim-bounce-in { animation: mpiBounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    .anim-zoom-in { animation: mpiBounceIn 0.4s ease-out both; }
    .anim-pulse { animation: mpiPulseSlow 3s infinite ease-in-out; }
    .anim-hover-lift:hover { transform: translateY(-3px); transition: transform 0.2s ease; }
    .anim-scale-tap:active { transform: scale(0.97); }

    /* GERBANG MASUK SISWA & ANIMASI IDENTITAS KARYA */
    .gate-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: radial-gradient(circle at 50% 20%, #1e1b4b 0%, #090d16 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      overflow-y: auto;
      transition: opacity 0.35s ease, visibility 0.35s ease, transform 0.35s ease;
    }
    .gate-overlay.gate-hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: scale(1.02);
    }
    .gate-card {
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
      max-width: 640px;
      width: 100%;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      margin: auto;
      max-height: 92dvh;
      display: flex;
      flex-direction: column;
    }
    @media (max-width: 640px) {
      .gate-overlay {
        padding: 0.5rem;
      }
      .gate-card {
        border-radius: 20px;
        max-height: 94dvh;
      }
      .gate-header-blue {
        padding: 1.25rem 1rem !important;
      }
      .gate-header-dark {
        padding: 1.1rem 1rem !important;
      }
      .gate-input {
        font-size: 16px !important; /* Mencegah auto-zoom di iOS Safari */
        padding: 0.85rem 1rem !important;
      }
      header {
        padding: 0.6rem 0.75rem !important;
      }
      .header-title {
        font-size: 0.95rem !important;
      }
      .nav-tabs {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding: 0.4rem 0.5rem !important;
      }
      .tab-btn {
        padding: 0.45rem 0.75rem !important;
        font-size: 0.8rem !important;
        white-space: nowrap;
      }
      .jodoh-grid {
        grid-template-columns: 1fr !important;
        gap: 0.75rem !important;
      }
    }
    .gate-header-blue {
      background: linear-gradient(135deg, #1d4ed8, #4338ca, #1e1b4b);
      color: white;
      padding: 1.75rem 2rem;
      text-align: center;
      flex-shrink: 0;
    }
    .gate-header-dark {
      background: linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a);
      color: white;
      padding: 1.4rem 1.75rem;
      border-bottom: 1px solid #1e293b;
      flex-shrink: 0;
    }
    .gate-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .gate-input-group {
      margin-bottom: 1.25rem;
      text-align: left;
    }
    .gate-input-label {
      display: block;
      font-size: 0.78rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #334155;
      margin-bottom: 0.4rem;
    }
    .gate-input {
      width: 100%;
      padding: 0.85rem 1rem;
      border-radius: 12px;
      border: 1.5px solid #cbd5e1;
      font-size: 16px; /* 16px to prevent iOS zoom */
      font-weight: 600;
      color: #0f172a;
      outline: none;
      transition: all 0.2s;
      box-sizing: border-box;
      background: #f8fafc;
    }
    .gate-input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }
    .identitas-items-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin: 1rem 0;
      text-align: left;
    }
    @media (max-width: 640px) {
      .identitas-items-grid {
        grid-template-columns: 1fr;
      }
    }
    .identitas-row {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      padding: 0.75rem 0.9rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
    }
    .identitas-row.col-span-2 {
      grid-column: 1 / -1;
    }
    .identitas-row.highlight-blue {
      background: #eff6ff;
      border-color: #bfdbfe;
    }
    .identitas-row.highlight-amber {
      background: #fffbeb;
      border-color: #fde68a;
    }
    .identitas-row.highlight-emerald {
      background: #ecfdf5;
      border-color: #a7f3d0;
    }
    .identitas-num-badge {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 900;
      font-size: 0.78rem;
      flex-shrink: 0;
    }
    .identitas-meta-title {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      display: block;
      margin-bottom: 0.15rem;
    }
    .identitas-meta-val {
      font-size: 0.88rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      display: block;
    }
    .identitas-foto-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
    }
    .identitas-foto-img {
      width: 72px;
      height: 72px;
      border-radius: 16px;
      object-fit: cover;
      border: 2.5px solid #10b981;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);
      background: #ffffff;
      flex-shrink: 0;
    }
    .btn-student {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      border-radius: 8px;
      border: 1px solid #3b82f6;
      background: #1e293b;
      color: #93c5fd;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-student:hover {
      background: #2563eb;
      color: #ffffff;
    }

    /* STEP 3 SEPERTI GAMBAR: Mau melakukan apa hari ini? */
    .gate-step3-card {
      background: #fcf8f2 !important;
      border: 1px solid #e8ded1 !important;
      border-radius: 34px !important;
      max-width: 980px !important;
      padding: 2.25rem 2.5rem;
      width: 100%;
      box-sizing: border-box;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7);
    }
    @media (max-width: 640px) {
      .gate-step3-card {
        padding: 1.5rem 1.25rem !important;
        border-radius: 24px !important;
      }
    }
    .modules-choice-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin: 1.75rem 0 1rem;
    }
    @media (max-width: 768px) {
      .modules-choice-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
    }
    .module-card-choice {
      border: 3px solid transparent;
      border-radius: 32px;
      padding: 2rem 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      cursor: pointer;
      min-height: 350px;
      box-shadow: 0 12px 24px -6px rgba(0,0,0,0.25);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      outline: none;
      box-sizing: border-box;
    }
    .module-card-choice:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 22px 35px -8px rgba(0,0,0,0.35);
      border-color: rgba(255,255,255,0.4);
    }
    .module-card-choice:active {
      transform: scale(0.97);
    }
    .module-card-choice.card-belajar {
      background: #335372;
    }
    .module-card-choice.card-belajar:hover {
      background: #2a455f;
    }
    .module-card-choice.card-bermain {
      background: #b8332c;
    }
    .module-card-choice.card-bermain:hover {
      background: #9f2a24;
    }
    .module-card-choice.card-berlatih {
      background: #c96f2d;
    }
    .module-card-choice.card-berlatih:hover {
      background: #af5e23;
    }
    .module-card-circle {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.12);
      border: 3px solid rgba(255,255,255,0.8);
      margin-bottom: 0.75rem;
      transition: transform 0.3s ease;
      flex-shrink: 0;
    }
    .module-card-choice:hover .module-card-circle {
      transform: scale(1.08);
    }
    .module-icon-box {
      width: 52px;
      height: 42px;
      border-radius: 8px;
      border: 1.5px dashed;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }
    .module-card-title {
      font-size: 1.85rem;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 0.02em;
      margin: 0.5rem 0 0.85rem;
    }
    .module-card-pill {
      background: rgba(0, 0, 0, 0.25);
      color: #ffffff;
      padding: 0.65rem 1.25rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 800;
      letter-spacing: 0.02em;
      width: 95%;
      box-sizing: border-box;
      backdrop-filter: blur(4px);
    }

    @media print {
      header, .nav-tabs, .btn-action, button, .header-controls, .gate-overlay { display: none !important; }
      body { background: white !important; color: black !important; }
      .section-view { display: block !important; }
      .report-card { box-shadow: none !important; border: 1px solid #ccc !important; }
    }
  </style>
</head>
<body>

  <!-- =========================================================================
       GERBANG MASUK SISWA & ANIMASI IDENTITAS KARYA (STEP 1 & 2)
       ========================================================================= -->
  <div id="gateOverlay" class="gate-overlay">
    
    <!-- STEP 1: ISIAN NAMA SISWA DAN KELAS -->
    <div id="gateStep1" class="gate-card anim-bounce-in">
      <div class="gate-header-blue" style="background: linear-gradient(135deg, #020617, #0f172a, #1e1b4b); border-bottom: 1px solid rgba(56,189,248,0.25);">
        <!-- Animated SIGMA Logo in Step 1 -->
        <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem;">
          <div style="width: 54px; height: 54px; border-radius: 16px; background: linear-gradient(135deg, #090d16, #1e1b4b); border: 1.5px solid rgba(56, 189, 248, 0.6); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(6, 182, 212, 0.45); position: relative; margin-bottom: 0.5rem;">
            <svg viewBox="0 0 100 100" style="width: 76%; height: 76%;" fill="none">
              <path d="M 20 22 L 82 22 C 86 22 88 26 85 29 L 75 40 L 48 40 L 32 26 C 28 22 24 22 20 22 Z" fill="#38bdf8" />
              <path d="M 80 26 L 46 50 L 34 50 L 68 26 Z" fill="#06b6d4" />
              <path d="M 46 50 L 80 74 L 68 74 L 34 50 Z" fill="#6366f1" />
              <path d="M 20 78 L 82 78 C 86 78 88 74 85 71 L 75 60 L 48 60 L 32 74 C 28 78 24 78 20 78 Z" fill="#38bdf8" />
              <rect x="18" y="22" width="10" height="56" rx="4" fill="#38bdf8" />
              <circle cx="43" cy="50" r="5" fill="#34d399" />
              <circle cx="43" cy="50" r="9" stroke="#34d399" stroke-width="1.5" stroke-dasharray="2 2" />
              <path d="M 76 12 L 68 24 H 74 L 70 34 L 80 20 H 74 L 76 12 Z" fill="#fbbf24" />
            </svg>
            <div style="position: absolute; bottom: -2px; right: -2px; width: 10px; height: 10px; border-radius: 50%; background: #10b981; border: 2px solid #020617;"></div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.35rem;">
            <span style="font-weight: 900; color: #ffffff; letter-spacing: 0.05em; font-size: 1.1rem;">SIGMA</span>
            <span style="font-weight: 900; color: #22d3ee; letter-spacing: 0.05em; font-size: 1.1rem;">OFFLINE</span>
            <span style="background: rgba(6,182,212,0.2); color: #67e8f9; border: 1px solid rgba(6,182,212,0.4); font-size: 0.65rem; font-weight: 900; padding: 0.1rem 0.4rem; border-radius: 9999px;">100% OFFLINE</span>
          </div>
          <div style="font-size: 0.72rem; color: #94a3b8; font-weight: 500; margin-top: 0.15rem;">Smart Interactive Gamification & Media for Autonomous Learning</div>
        </div>

        <h1 style="font-size: 1.45rem; font-weight: 900; margin: 0.25rem 0; letter-spacing: -0.02em; color: #ffffff;">
          Portal Pembelajaran Mandiri
        </h1>
        <p style="font-size: 0.85rem; color: #bae6fd; margin: 0.25rem auto 0; max-width: 480px;">
          ${activeConfig.judul} • ${activeConfig.mataPelajaran} (${activeConfig.kelas})
        </p>
      </div>

      <div style="padding: 1.75rem 2rem;">
        <p style="text-align: center; color: #475569; font-size: 0.88rem; margin-bottom: 1.5rem;">
          Silakan isi identitas diri Anda sebelum membuka materi pembelajaran, bermain mini-game, dan melakukan evaluasi.
        </p>

        <div id="gateAlertBox" style="display: none; padding: 0.75rem 1rem; border-radius: 12px; background: #fff1f2; border: 1px solid #fecdd3; color: #be123c; font-size: 0.85rem; font-weight: 700; text-align: center; margin-bottom: 1.25rem;"></div>

        <form id="formGateSiswa" onsubmit="handleGateStep1Submit(event)">
          <div class="gate-input-group">
            <label class="gate-input-label" for="inputGateNama">
              👤 Nama Lengkap Siswa <span style="color: #e11d48;">*</span>
            </label>
            <input 
              type="text" 
              id="inputGateNama" 
              class="gate-input" 
              placeholder="Ketik nama lengkap Anda di sini..." 
              autocomplete="name" 
              required 
            />
            <span style="display: block; font-size: 0.75rem; color: #94a3b8; margin-top: 0.35rem;">
              Nama Anda akan dicantumkan secara otomatis pada kartu rapor & hasil evaluasi.
            </span>
          </div>

          <div class="gate-input-group">
            <label class="gate-input-label" for="inputGateKelas">
              🎓 Kelas / Rombel Siswa <span style="color: #e11d48;">*</span>
            </label>
            <input 
              type="text" 
              id="inputGateKelas" 
              class="gate-input" 
              placeholder="Contoh: ${activeConfig.kelas} IPS 1" 
              value="${activeConfig.kelas}" 
              required 
            />
          </div>

          <div style="margin-top: 1.75rem;">
            <button 
              type="submit" 
              id="btnGateLanjut" 
              class="btn-action anim-hover-lift" 
              style="width: 100%; justify-content: center; padding: 0.95rem 1.5rem; font-size: 1rem; font-weight: 800; border-radius: 14px; background: linear-gradient(135deg, #2563eb, #4f46e5); box-shadow: 0 10px 20px -5px rgba(37,99,235,0.4);"
            >
              Lanjutkan →
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- STEP 2: ANIMASI 1. IDENTITAS KARYA MEDIA PEMBELAJARAN (8 POIN) -->
    <div id="gateStep2" class="gate-card anim-slide-up" style="display: none; max-height: 92vh; display: flex; flex-direction: column;">
      
      <!-- Header Step 2 -->
      <div class="gate-header-dark">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <div class="gate-badge" style="background: rgba(16,185,129,0.2); color: #6ee7b7; border: 1px solid rgba(16,185,129,0.3);">
            ✓ Siswa Terdaftar: <span id="labelBadgeNama">-</span> (<span id="labelBadgeKelas">-</span>)
          </div>
          <button 
            type="button" 
            onclick="backToGateStep1()" 
            style="background: transparent; border: none; color: #94a3b8; font-size: 0.78rem; cursor: pointer; text-decoration: underline;"
          >
            ← Ganti Nama
          </button>
        </div>

        <h2 style="font-size: 1.3rem; font-weight: 900; margin: 0; color: #ffffff; display: flex; align-items: center; gap: 0.5rem;">
          <span>🌟</span> 1. Identitas Karya Media Pembelajaran :
        </h2>
        <p style="font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0;">
          Identitas resmi kurikulum, sasaran capaian belajar, serta profil pendidik pembuat karya.
        </p>
      </div>

      <!-- Content Step 2 (Scrollable 8 Poin Identitas Karya) -->
      <div style="padding: 1.5rem 1.75rem; overflow-y: auto; flex: 1;">
        
        <div class="identitas-items-grid">
          
          <!-- 1. NAMA (Judul Karya MPI) -->
          <div class="identitas-row col-span-2 highlight-blue">
            <div class="identitas-num-badge" style="background: #2563eb;">1</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #1e40af;">1. NAMA (Judul Karya MPI) :</span>
              <span class="identitas-meta-val" style="font-size: 1.05rem; font-weight: 800; color: #0f172a;">
                ${activeConfig.judul}
              </span>
            </div>
          </div>

          <!-- 2. Mata Pelajaran -->
          <div class="identitas-row">
            <div class="identitas-num-badge" style="background: #4f46e5;">2</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #64748b;">2. Mata Pelajaran :</span>
              <span class="identitas-meta-val">${activeConfig.mataPelajaran}</span>
            </div>
          </div>

          <!-- 3. Kelas/Fase -->
          <div class="identitas-row">
            <div class="identitas-num-badge" style="background: #4f46e5;">3</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #64748b;">3. Kelas/Fase :</span>
              <span class="identitas-meta-val">${activeConfig.kelas} / ${activeConfig.fase}</span>
            </div>
          </div>

          <!-- 4. Topik Materi / Elemen / Materi -->
          <div class="identitas-row col-span-2">
            <div class="identitas-num-badge" style="background: #4f46e5;">4</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #64748b;">4. Topik Materi / Elemen / Materi :</span>
              <span class="identitas-meta-val">${activeConfig.topikMateri || activeConfig.judul}</span>
            </div>
          </div>

          <!-- 5. Tujuan Pembelajaran / Sub-elemen / Submateri -->
          <div class="identitas-row col-span-2 highlight-amber">
            <div class="identitas-num-badge" style="background: #d97706;">5</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #92400e;">5. Tujuan Pembelajaran / Sub-elemen / Submateri :</span>
              <p style="margin: 0.2rem 0 0; font-size: 0.85rem; color: #334155; line-height: 1.5; font-weight: 500;">
                ${activeConfig.tujuanPembelajaran || 'Peserta didik mampu memahami, menganalisis konsep materi secara komprehensif, dan menyelesaikan tantangan asesmen evaluasi.'}
              </p>
            </div>
          </div>

          <!-- 6. Nama Pengembang -->
          <div class="identitas-row">
            <div class="identitas-num-badge" style="background: #059669;">6</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #64748b;">6. Nama Pengembang :</span>
              <span class="identitas-meta-val" style="font-weight: 800; color: #0f172a;">
                ${activeConfig.namaPengembang || activeConfig.penyusun || 'Pendidik'}
              </span>
            </div>
          </div>

          <!-- 7. Asal Sekolah -->
          <div class="identitas-row">
            <div class="identitas-num-badge" style="background: #059669;">7</div>
            <div style="min-width: 0; flex: 1;">
              <span class="identitas-meta-title" style="color: #64748b;">7. Asal Sekolah :</span>
              <span class="identitas-meta-val">${activeConfig.sekolah || activeConfig.instansi || 'SMA Unggulan'}</span>
            </div>
          </div>

          <!-- 8. FOTO PROFIL PENGEMBANG -->
          <div class="identitas-row col-span-2 highlight-emerald">
            <div class="identitas-num-badge" style="background: #059669;">8</div>
            <div class="identitas-foto-card">
              <img 
                src="${fotoProfilUrl}" 
                alt="Foto Profil Pengembang" 
                class="identitas-foto-img" 
                onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'" 
              />
              <div style="min-width: 0; flex: 1;">
                <span class="identitas-meta-title" style="color: #065f46;">8. FOTO PROFIL PENGEMBANG :</span>
                <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a;">
                  ${activeConfig.namaPengembang || activeConfig.penyusun || 'Pendidik'}
                </div>
                ${activeConfig.jabatan ? `<div style="font-size: 0.8rem; color: #059669; font-weight: 700;">${activeConfig.jabatan}</div>` : ''}
                <div style="font-size: 0.8rem; color: #475569;">
                  ${activeConfig.sekolah || activeConfig.instansi || 'Pendidik'}
                  ${activeConfig.nip ? ` • NIP: ${activeConfig.nip}` : ''}
                </div>
                ${(activeConfig.mediaSosial || activeConfig.kontak) ? `<div style="font-size: 0.78rem; color: #0d9488; font-weight: 600; margin-top: 0.2rem;">${[activeConfig.mediaSosial, activeConfig.kontak].filter(Boolean).join(' • ')}</div>` : ''}
              </div>
            </div>
          </div>

        </div>

        <div style="margin-top: 1.25rem;">
          <button 
            type="button" 
            id="btnGateToStep3" 
            onclick="goToGateStep3()" 
            class="btn-action anim-hover-lift" 
            style="width: 100%; justify-content: center; padding: 1rem 1.5rem; font-size: 1.05rem; font-weight: 900; border-radius: 14px; background: linear-gradient(135deg, #2563eb, #4f46e5); box-shadow: 0 10px 25px -5px rgba(37,99,235,0.4);"
          >
            Pilih Aktivitas Pembelajaran →
          </button>
        </div>

      </div>

    </div>

    <!-- STEP 3: PILIHAN MODUL (SEPERTI GAMBAR USER: "Mau melakukan apa hari ini?") -->
    <div id="gateStep3" class="gate-card gate-step3-card anim-slide-up" style="display: none;">
      
      <!-- Top Bar: Info Siswa & Kembali ke Identitas Karya -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; padding-bottom: 1rem; border-bottom: 1px solid #ebdcca;">
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.85rem; border-radius: 9999px; background: #ffffff; border: 1px solid #e2e8f0; font-size: 0.78rem; font-weight: 700; color: #334155; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
          <span>Peserta Didik: <strong id="lblStep3StudentNama" style="color: #0f172a;">-</strong> (<strong id="lblStep3StudentKelas" style="color: #0f172a;">-</strong>)</span>
        </div>
        <button 
          type="button" 
          onclick="backToGateStep2()" 
          style="background: transparent; border: none; color: #64748b; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.35rem; padding: 0.35rem 0.65rem; border-radius: 8px;"
        >
          ← Lihat Identitas Karya
        </button>
      </div>

      <!-- Headline & Subtitle persis seperti gambar user -->
      <div style="text-align: center; margin-top: 1.5rem;">
        <h1 style="color: #9c2518; font-size: 2.35rem; font-weight: 900; margin: 0; letter-spacing: -0.02em; line-height: 1.2;">
          Mau melakukan apa hari ini?
        </h1>
        <p style="color: #475569; font-size: 1rem; margin: 0.75rem auto 0; max-width: 580px; line-height: 1.5;">
          Mulailah dari <strong style="color: #0f172a; font-weight: 900;">Belajar</strong>, lanjut ke <strong style="color: #0f172a; font-weight: 900;">Bermain</strong>, lalu uji dirimu di <strong style="color: #0f172a; font-weight: 900;">Berlatih</strong>.
        </p>
      </div>

      <!-- 3 Kartu Pilihan Berurutan: 1. Belajar, 2. Bermain, 3. Berlatih -->
      <div class="modules-choice-grid">
        
        <!-- KARTU 1: BELAJAR (Materi Pembelajaran) -->
        <button 
          type="button" 
          id="btnSelectBelajar" 
          onclick="selectModuleAndEnter('materi')" 
          class="module-card-choice card-belajar"
        >
          <div class="module-card-circle">
            <div class="module-icon-box" style="border-color: #7dd3fc; background: #f0f9ff;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span style="font-size: 11px; font-weight: 800; color: #475569;">Belajar</span>
          </div>

          <div class="module-card-title">Belajar</div>

          <div class="module-card-pill">
            Materi Pembelajaran
          </div>
        </button>

        <!-- KARTU 2: BERMAIN (Permainan Interaktif) -->
        <button 
          type="button" 
          id="btnSelectBermain" 
          onclick="selectModuleAndEnter('bermain')" 
          class="module-card-choice card-bermain"
        >
          <div class="module-card-circle">
            <div class="module-icon-box" style="border-color: #fda4af; background: #fff1f2;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="6" y1="12" x2="10" y2="12"/>
                <line x1="8" y1="10" x2="8" y2="14"/>
                <line x1="15" y1="13" x2="15.01" y2="13"/>
                <line x1="18" y1="11" x2="18.01" y2="11"/>
                <rect x="2" y="6" width="20" height="12" rx="2"/>
              </svg>
            </div>
            <span style="font-size: 11px; font-weight: 800; color: #475569;">Bermain</span>
          </div>

          <div class="module-card-title">Bermain</div>

          <div class="module-card-pill">
            ${activeBermain.length} Permainan Interaktif
          </div>
        </button>

        <!-- KARTU 3: BERLATIH (Soal Evaluasi) -->
        <button 
          type="button" 
          id="btnSelectBerlatih" 
          onclick="selectModuleAndEnter('latih')" 
          class="module-card-choice card-berlatih"
        >
          <div class="module-card-circle">
            <div class="module-icon-box" style="border-color: #fcd34d; background: #fffbeb;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <span style="font-size: 11px; font-weight: 800; color: #475569;">Berlatih</span>
          </div>

          <div class="module-card-title">Berlatih</div>

          <div class="module-card-pill">
            ${activeLatih.length} Soal Evaluasi
          </div>
        </button>

      </div>

      <!-- Footer Info -->
      <div style="text-align: center; margin-top: 1.5rem;">
        <span style="font-size: 0.78rem; color: #64748b;">
          💡 Klik salah satu kartu di atas untuk langsung membuka modul yang Anda inginkan.
        </span>
      </div>

    </div>

  </div>

  <!-- HEADER -->
  <header>
    <div class="header-container">
      <div style="display: flex; align-items: center; gap: 0.85rem;">
        <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #020617, #0f172a); border: 1.5px solid rgba(56, 189, 248, 0.6); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(6, 182, 212, 0.4); flex-shrink: 0; position: relative;">
          <svg viewBox="0 0 100 100" style="width: 82%; height: 82%;" fill="none">
            <path d="M 16 26 C 16 22 20 18 24 18 L 26 18 C 30 18 34 22 34 26 L 34 76 C 34 80 30 84 26 84 L 24 84 C 20 84 16 80 16 76 Z" fill="#38bdf8" />
            <path d="M 66 26 C 66 22 70 18 74 18 L 76 18 C 80 18 84 22 84 26 L 84 76 C 84 80 80 84 76 84 L 74 84 C 70 84 66 80 66 76 Z" fill="#38bdf8" />
            <path d="M 26 22 L 50 60 L 42 66 L 22 32 Z" fill="#06b6d4" />
            <path d="M 74 22 L 50 60 L 58 66 L 78 32 Z" fill="#6366f1" />
            <polygon points="50,14 58,26 42,26" fill="#fbbf24" />
            <circle cx="50" cy="62" r="6" fill="#34d399" />
            <path d="M 78 8 L 71 18 H 76 L 73 26 L 81 15 H 76 L 78 8 Z" fill="#fbbf24" />
          </svg>
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <div class="brand-title">${activeConfig.judul}</div>
            <span style="background: rgba(6,182,212,0.25); color: #67e8f9; border: 1px solid rgba(6,182,212,0.4); font-size: 0.65rem; font-weight: 900; padding: 0.15rem 0.5rem; border-radius: 9999px; text-transform: uppercase;">⚡ MASTERMPI</span>
            <span style="background: rgba(245,158,11,0.2); color: #fde68a; border: 1px solid rgba(245,158,11,0.3); font-size: 0.62rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: 9999px;">@ajisosiologi 2026</span>
          </div>
          <div class="brand-subtitle">${activeConfig.mataPelajaran} • ${activeConfig.fase} (${activeConfig.kelas}) • Smart MPI &amp; Gamification Engine</div>
        </div>
      </div>
      <div class="header-controls">
        <button id="btnHeaderStudent" onclick="reopenGate()" class="btn-student" title="Klik untuk melihat Identitas Karya atau ubah nama">
          👤 <span id="hdrStudentName">Peserta Didik</span> (<span id="hdrStudentClass">${activeConfig.kelas}</span>)
        </button>
        <button id="btnSoundToggle" class="btn-sound">🔊 Suara: AKTIF</button>
      </div>
    </div>
  </header>

  <!-- PREREQUISITE PROGRESS RIBBON -->
  <div class="prereq-ribbon" id="prereqRibbon">
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 0.68rem; font-weight: 900; padding: 0.15rem 0.45rem; border-radius: 4px; text-transform: uppercase;">
        Alur Wajib MPI
      </span>
      <span style="color: #94a3b8; font-size: 0.78rem;">
        1. Modul Belajar (Kuis Mini) ➔ 2. Modul Bermain ➔ 3. Modul Berlatih
      </span>
    </div>
    <div style="display: flex; align-items: center; gap: 0.85rem; font-size: 0.78rem;" id="ribbonStatusContainer">
      <div id="ribbonMateriStatus">📖 Materi: <strong id="ribbonMateriCount">0/${activeMateri.length} Bab</strong></div>
      <span style="color: #475569;">•</span>
      <div id="ribbonBermainStatus">🎮 Bermain: <strong id="ribbonBermainText" style="color: #fbbf24;">🔒 Terkunci</strong></div>
      <span style="color: #475569;">•</span>
      <div id="ribbonBerlatihStatus">📝 Berlatih: <strong id="ribbonBerlatihText" style="color: #fbbf24;">🔒 Terkunci</strong></div>
    </div>
  </div>

  <!-- NAVIGATION TABS -->
  <nav class="nav-tabs" id="navTabsContainer">
    <button class="tab-btn active" id="tabBtnMateri" onclick="switchTab('materi')">
      📖 1. Modul Materi <span id="tabMateriBadge" class="tab-done-badge" style="display:none;">✓ Selesai</span>
    </button>
    <button class="tab-btn tab-locked" id="tabBtnBermain" onclick="switchTab('bermain')">
      <span id="tabBermainLockIcon">🔒</span> 2. Modul Bermain <span id="tabBermainBadge" class="tab-lock-badge">Terkunci</span>
    </button>
    <button class="tab-btn tab-locked" id="tabBtnBerlatih" onclick="switchTab('berlatih')">
      <span id="tabBerlatihLockIcon">🔒</span> 3. Modul Berlatih <span id="tabBerlatihBadge" class="tab-lock-badge">Terkunci</span>
    </button>
  </nav>

  <!-- PREREQUISITE ALERT DIALOG MODAL -->
  <div class="prereq-modal-overlay" id="prereqModalOverlay">
    <div class="prereq-modal-box">
      <div style="width: 56px; height: 56px; border-radius: 16px; background: #fef3c7; color: #b45309; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 1.75rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);">
        🔒
      </div>
      <h3 id="prereqModalTitle" style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 0.5rem;">
        Modul Masih Terkunci!
      </h3>
      <p id="prereqModalDesc" style="font-size: 0.875rem; color: #475569; line-height: 1.5; margin: 0 0 1.25rem;">
        Sesuai alur MPI, selesaikan prasyarat terlebih dahulu.
      </p>
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <button type="button" id="prereqActionBtn" onclick="handlePrereqAction()" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: #2563eb; color: #ffffff; font-size: 0.875rem; font-weight: 800; border: none; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
          Buka Modul Prasyarat
        </button>
        <button type="button" onclick="closePrereqModal()" style="width: 100%; padding: 0.6rem 1rem; border-radius: 12px; background: transparent; color: #64748b; font-size: 0.8rem; font-weight: 700; border: none; cursor: pointer;">
          Tutup
        </button>
      </div>
    </div>
  </div>

  <!-- MAIN CONTAINER -->
  <main>
    <!-- TAB 1: MODUL MATERI -->
    <section id="view-materi" class="section-view active">
      <div class="materi-grid">
        <div class="submateri-list" id="submateriList"></div>
        <div class="card" id="materiDetailBox"></div>
      </div>
    </section>

    <!-- TAB 2: MODUL BERMAIN -->
    <section id="view-bermain" class="section-view">
      <div class="card">
        <div class="game-nav" id="gameNavContainer"></div>
        <div class="game-container" id="gameCanvas"></div>
      </div>
    </section>

    <!-- TAB 3: MODUL BERLATIH -->
    <section id="view-berlatih" class="section-view">
      <div class="card" id="latihContainer"></div>
    </section>
  </main>

  <!-- FOOTER IDENTITAS PENGEMBANG -->
  <footer style="margin-top: auto; padding: 1.25rem 1.5rem; background: #ffffff; border-top: 1px solid #e2e8f0; font-size: 0.85rem; color: #64748b;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.75rem;">
      <div>
        <strong style="color: #0f172a;">${activeConfig.judul}</strong> • ${activeConfig.mataPelajaran} (${activeConfig.kelas} / ${activeConfig.fase})
        ${activeConfig.topikMateri ? `<br><span style="font-size: 0.8rem; color: #475569;">Topik: ${activeConfig.topikMateri}</span>` : ''}
        <div style="margin-top: 0.35rem; font-size: 0.75rem; color: #94a3b8;">
          Generator: <strong style="color: #2563eb;">MASTERMPI</strong> (Smart MPI &amp; Gamification Engine) • <em>@ajisosiologi 2026</em>
        </div>
      </div>
      <div style="text-align: right;">
        <span>Pendidik / Pengembang Karya: <strong style="color: #0f172a;">${activeConfig.namaPengembang || activeConfig.penyusun || 'Pendidik Kreatif'}</strong></span>
        ${activeConfig.jabatan ? `<br><span style="font-size: 0.8rem; color: #475569;">Jabatan: ${activeConfig.jabatan}</span>` : ''}
        ${activeConfig.nip ? ` • <span style="font-size: 0.8rem; color: #475569;">NIP: ${activeConfig.nip}</span>` : ''}
        ${activeConfig.sekolah ? `<br><span>Instansi: ${activeConfig.sekolah}</span>` : ''}
        ${activeConfig.kontak ? `<br><span style="font-size: 0.8rem; color: #0284c7;">Kontak: ${activeConfig.kontak}</span>` : ''}
      </div>
    </div>
  </footer>

  <script>
    // =========================================================================
    // INJEKSI DATA KONFIGURASI MPI OFFLINE KURIKULUM MERDEKA
    // =========================================================================
    const CONFIG = ${configJson};
    const MATERI = ${materiJson};
    const dataBermain = ${dataBermainJson};
    const dtLatih = ${dtLatihJson};

    // =========================================================================
    // 100% OFFLINE AUDIO SYNTHESIZER (WEB AUDIO API)
    // =========================================================================
    class OfflineAudio {
      constructor() {
        this.ctx = null;
        this.enabled = true;
      }
      init() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      }
      click() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.frequency.setValueAtTime(450, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.04);
        } catch(e){}
      }
      success() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.setValueAtTime(659.25, now + 0.08);
          osc.frequency.setValueAtTime(783.99, now + 0.16);
          osc.frequency.setValueAtTime(1046.50, now + 0.24);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.45);
        } catch(e){}
      }
      error() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(190, now);
          osc.frequency.setValueAtTime(120, now + 0.1);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        } catch(e){}
      }
    }
    const audio = new OfflineAudio();

    // =========================================================================
    // IDENTITAS SISWA & GERBANG ANIMASI KARYA
    // =========================================================================
    var currentStudent = {
      nama: '',
      kelas: CONFIG.kelas || 'Kelas XI'
    };

    function handleGateStep1Submit(e) {
      if (e) e.preventDefault();
      var inputNama = document.getElementById('inputGateNama');
      var inputKelas = document.getElementById('inputGateKelas');
      var alertBox = document.getElementById('gateAlertBox');

      var namaVal = (inputNama.value || '').trim();
      var kelasVal = (inputKelas.value || '').trim();

      if (!namaVal) {
        audio.error();
        alertBox.style.display = 'block';
        alertBox.textContent = '⚠️ Mohon isikan nama lengkap siswa terlebih dahulu!';
        inputNama.focus();
        return false;
      }

      if (!kelasVal) {
        kelasVal = CONFIG.kelas || 'Kelas XI';
      }

      audio.success();
      alertBox.style.display = 'none';

      currentStudent.nama = namaVal;
      currentStudent.kelas = kelasVal;

      // Update badges in Step 2, Step 3, and Header
      var lblNama = document.getElementById('labelBadgeNama');
      var lblKelas = document.getElementById('labelBadgeKelas');
      var hdrNama = document.getElementById('hdrStudentName');
      var hdrKelas = document.getElementById('hdrStudentClass');
      var s3Nama = document.getElementById('lblStep3StudentNama');
      var s3Kelas = document.getElementById('lblStep3StudentKelas');

      if (lblNama) lblNama.textContent = namaVal;
      if (lblKelas) lblKelas.textContent = kelasVal;
      if (hdrNama) hdrNama.textContent = namaVal;
      if (hdrKelas) hdrKelas.textContent = kelasVal;
      if (s3Nama) s3Nama.textContent = namaVal;
      if (s3Kelas) s3Kelas.textContent = kelasVal;

      // Transition to Step 2 with animation
      var step1 = document.getElementById('gateStep1');
      var step2 = document.getElementById('gateStep2');
      var step3 = document.getElementById('gateStep3');
      if (step3) step3.style.display = 'none';
      step1.style.display = 'none';
      step2.style.display = 'flex';
      step2.className = 'gate-card anim-slide-up';
      return false;
    }

    function backToGateStep1() {
      audio.click();
      var step1 = document.getElementById('gateStep1');
      var step2 = document.getElementById('gateStep2');
      var step3 = document.getElementById('gateStep3');
      if (step3) step3.style.display = 'none';
      step2.style.display = 'none';
      step1.style.display = 'block';
      step1.className = 'gate-card anim-fade-in';
      document.getElementById('inputGateNama').focus();
    }

    function goToGateStep3() {
      audio.success();
      var step2 = document.getElementById('gateStep2');
      var step3 = document.getElementById('gateStep3');
      step2.style.display = 'none';
      step3.style.display = 'block';
      step3.className = 'gate-card gate-step3-card anim-slide-up';
    }

    function backToGateStep2() {
      audio.click();
      var step3 = document.getElementById('gateStep3');
      var step2 = document.getElementById('gateStep2');
      step3.style.display = 'none';
      step2.style.display = 'flex';
      step2.className = 'gate-card anim-slide-up';
    }

    // =========================================================================
    // MPI PREREQUISITE & PROGRESS TRACKING STATE
    // =========================================================================
    var completedBabIds = [];
    var completedGamesCount = 0;
    var currentPrereqTarget = 'materi';

    function isMateriAllCompleted() {
      return completedBabIds.length >= MATERI.length;
    }

    function isBermainAllCompleted() {
      return completedGamesCount > 0 || gameProgress.some(Boolean);
    }

    function showPrereqModal(title, desc, targetTab) {
      currentPrereqTarget = targetTab || 'materi';
      var modal = document.getElementById('prereqModalOverlay');
      var titleEl = document.getElementById('prereqModalTitle');
      var descEl = document.getElementById('prereqModalDesc');
      var btnEl = document.getElementById('prereqActionBtn');
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      if (btnEl) {
        btnEl.textContent = currentPrereqTarget === 'materi' 
          ? '📖 Buka Modul Materi' 
          : '🎮 Buka Modul Bermain';
      }
      if (modal) modal.style.display = 'flex';
    }

    function closePrereqModal() {
      var modal = document.getElementById('prereqModalOverlay');
      if (modal) modal.style.display = 'none';
    }

    function handlePrereqAction() {
      closePrereqModal();
      var overlay = document.getElementById('gateOverlay');
      if (overlay) overlay.classList.add('gate-hidden');
      switchTab(currentPrereqTarget);
    }

    function updateMpiProgressUI() {
      var materiDone = isMateriAllCompleted();
      var bermainDone = isBermainAllCompleted();

      // Update Ribbon
      var rCount = document.getElementById('ribbonMateriCount');
      var rBermain = document.getElementById('ribbonBermainText');
      var rBerlatih = document.getElementById('ribbonBerlatihText');
      var tabMatBadge = document.getElementById('tabMateriBadge');
      var tabBerBadge = document.getElementById('tabBermainBadge');
      var tabLatBadge = document.getElementById('tabBerlatihBadge');
      var tabBerBtn = document.getElementById('tabBtnBermain');
      var tabLatBtn = document.getElementById('tabBtnBerlatih');
      var tabBerIcon = document.getElementById('tabBermainLockIcon');
      var tabLatIcon = document.getElementById('tabBerlatihLockIcon');

      if (rCount) rCount.textContent = completedBabIds.length + '/' + MATERI.length + ' Bab';
      if (tabMatBadge) tabMatBadge.style.display = materiDone ? 'inline-flex' : 'none';

      if (rBermain) {
        if (bermainDone) {
          rBermain.innerHTML = '<span style="color:#4ade80;">✓ Selesai</span>';
        } else if (materiDone) {
          rBermain.innerHTML = '<span style="color:#38bdf8;">✨ Terbuka</span>';
        } else {
          rBermain.innerHTML = '<span style="color:#fbbf24;">🔒 Terkunci</span>';
        }
      }

      if (rBerlatih) {
        if (bermainDone) {
          rBerlatih.innerHTML = '<span style="color:#38bdf8;">✨ Terbuka</span>';
        } else {
          rBerlatih.innerHTML = '<span style="color:#fbbf24;">🔒 Terkunci</span>';
        }
      }

      // Tab Bermain button
      if (tabBerBtn) {
        if (materiDone) {
          tabBerBtn.classList.remove('tab-locked');
          if (tabBerIcon) tabBerIcon.textContent = '🎮';
          if (tabBerBadge) {
            tabBerBadge.className = bermainDone ? 'tab-done-badge' : 'tab-done-badge';
            tabBerBadge.textContent = bermainDone ? '✓ Selesai' : 'Terbuka';
          }
        } else {
          tabBerBtn.classList.add('tab-locked');
          if (tabBerIcon) tabBerIcon.textContent = '🔒';
          if (tabBerBadge) {
            tabBerBadge.className = 'tab-lock-badge';
            tabBerBadge.textContent = 'Terkunci';
          }
        }
      }

      // Tab Berlatih button
      if (tabLatBtn) {
        if (bermainDone) {
          tabLatBtn.classList.remove('tab-locked');
          if (tabLatIcon) tabLatIcon.textContent = '📝';
          if (tabLatBadge) {
            tabLatBadge.className = 'tab-done-badge';
            tabLatBadge.textContent = 'Terbuka';
          }
        } else {
          tabLatBtn.classList.add('tab-locked');
          if (tabLatIcon) tabLatIcon.textContent = '🔒';
          if (tabLatBadge) {
            tabLatBadge.className = 'tab-lock-badge';
            tabLatBadge.textContent = 'Terkunci';
          }
        }
      }
    }

    function selectModuleAndEnter(tabId) {
      if (tabId === 'bermain' && !isMateriAllCompleted()) {
        audio.error();
        showPrereqModal(
          'Modul Bermain Terkunci!',
          'Sesuai aturan alur MPI: Prasyarat masuk Modul Bermain harus menyelesaikan seluruh bab pada Modul Materi dan menjawab Kuis Mini Refleksi Cepat (Checkpoint Siswa) dengan benar terlebih dahulu.',
          'materi'
        );
        return;
      }

      if (tabId === 'latih' && (!isMateriAllCompleted() || !isBermainAllCompleted())) {
        audio.error();
        showPrereqModal(
          'Modul Berlatih Terkunci!',
          'Sesuai aturan alur MPI: Prasyarat masuk Modul Berlatih harus menyelesaikan Modul Belajar (Materi) dan Modul Bermain terlebih dahulu sebelum mengerjakan asesmen evaluasi.',
          isMateriAllCompleted() ? 'bermain' : 'materi'
        );
        return;
      }

      audio.success();
      var overlay = document.getElementById('gateOverlay');
      overlay.classList.add('gate-hidden');
      switchTab(tabId === 'latih' ? 'berlatih' : tabId);
    }

    function enterMpiApplication() {
      audio.success();
      var overlay = document.getElementById('gateOverlay');
      overlay.classList.add('gate-hidden');
    }

    function reopenGate() {
      audio.click();
      var overlay = document.getElementById('gateOverlay');
      overlay.classList.remove('gate-hidden');
      var step1 = document.getElementById('gateStep1');
      var step2 = document.getElementById('gateStep2');
      var step3 = document.getElementById('gateStep3');
      if (currentStudent.nama) {
        step1.style.display = 'none';
        step2.style.display = 'none';
        step3.style.display = 'block';
        step3.className = 'gate-card gate-step3-card anim-slide-up';
      } else {
        if (step3) step3.style.display = 'none';
        step2.style.display = 'none';
        step1.style.display = 'block';
        step1.className = 'gate-card anim-bounce-in';
      }
    }

    document.getElementById('btnSoundToggle').addEventListener('click', () => {
      audio.enabled = !audio.enabled;
      document.getElementById('btnSoundToggle').textContent = audio.enabled ? '🔊 Suara: AKTIF' : '🔇 Suara: MATI';
      if (audio.enabled) audio.click();
    });

    // =========================================================================
    // NAVIGASI TAB DENGAN ATURAN PRASYARAT MPI
    // =========================================================================
    function switchTab(tabId) {
      if (tabId === 'bermain' && !isMateriAllCompleted()) {
        audio.error();
        showPrereqModal(
          'Modul Bermain Terkunci!',
          'Sesuai aturan alur MPI: Prasyarat masuk Modul Bermain harus menyelesaikan seluruh bab pada Modul Materi dan menjawab Kuis Mini Refleksi Cepat (Checkpoint Siswa) dengan benar.',
          'materi'
        );
        return;
      }

      if (tabId === 'berlatih' && (!isMateriAllCompleted() || !isBermainAllCompleted())) {
        audio.error();
        showPrereqModal(
          'Modul Berlatih Terkunci!',
          'Sesuai aturan alur MPI: Prasyarat masuk Modul Berlatih harus menyelesaikan Modul Belajar (Materi) dan Modul Bermain terlebih dahulu sebelum mengerjakan asesmen evaluasi.',
          isMateriAllCompleted() ? 'bermain' : 'materi'
        );
        return;
      }

      audio.click();
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.section-view').forEach(sec => sec.classList.remove('active'));
      
      const tabIdx = tabId === 'materi' ? 0 : tabId === 'bermain' ? 1 : 2;
      document.querySelectorAll('.tab-btn')[tabIdx].classList.add('active');
      document.getElementById('view-' + tabId).classList.add('active');
    }

    // =========================================================================
    // MULTIMEDIA & ANIMASI ENGINE OFFLINE
    // =========================================================================
    function getAnimClass(anim) {
      if (!anim) return 'anim-fade-in';
      var classes = [];
      if (anim.masuk === 'fade-in') classes.push('anim-fade-in');
      else if (anim.masuk === 'slide-up') classes.push('anim-slide-up');
      else if (anim.masuk === 'bounce-in') classes.push('anim-bounce-in');
      else if (anim.masuk === 'zoom-in') classes.push('anim-zoom-in');
      else classes.push('anim-fade-in');

      if (anim.interaksi === 'pulse') classes.push('anim-pulse');
      else if (anim.interaksi === 'hover-lift') classes.push('anim-hover-lift');
      else if (anim.interaksi === 'scale-tap') classes.push('anim-scale-tap');

      return classes.join(' ');
    }

    function renderOfflineMedia(mediaList, pos) {
      if (!mediaList || !Array.isArray(mediaList) || mediaList.length === 0) return '';
      var filtered = mediaList.filter(function(m) { return (m.posisi || 'atas') === pos; });
      if (filtered.length === 0) return '';

      return '<div class="mpi-media-container">' + filtered.map(function(item) {
        var content = '';
        if (item.tipe === 'gambar' || item.tipe === 'infografis' || item.tipe === 'visual_lainnya') {
          content = '<img src="' + item.url + '" class="mpi-media-img" alt="' + (item.judul || '') + '" onerror="this.style.display=\\'none\\'" />';
        } else if (item.tipe === 'tabel' && item.tabelData) {
          var t = item.tabelData;
          content = '<div style="overflow-x:auto;"><table class="mpi-media-table"><thead><tr>' +
            t.headers.map(function(h) { return '<th>' + h + '</th>'; }).join('') +
            '</tr></thead><tbody>' +
            t.rows.map(function(r) { return '<tr>' + r.map(function(c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') +
            '</tbody></table></div>';
        } else if (item.tipe === 'musik' || item.tipe === 'audio') {
          content = '<audio controls class="mpi-media-audio"><source src="' + item.url + '">Browser tidak mendukung audio.</audio>';
        } else if (item.tipe === 'video') {
          var vUrl = item.url || '';
          if (vUrl.indexOf('watch?v=') !== -1) {
            var vidParts = vUrl.split('watch?v=')[1].split('&')[0];
            vUrl = 'https://www.youtube-nocookie.com/embed/' + vidParts;
          } else if (vUrl.indexOf('youtu.be/') !== -1) {
            var vidParts2 = vUrl.split('youtu.be/')[1].split('?')[0];
            vUrl = 'https://www.youtube-nocookie.com/embed/' + vidParts2;
          }
          
          if (vUrl.indexOf('youtube') !== -1 || vUrl.indexOf('youtu.be') !== -1) {
            content = '<iframe src="' + vUrl + '" class="mpi-media-video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
              '<div style="font-size:0.75rem; color:#64748b; margin-top:5px; text-align:center;">ℹ️ <em>Pemutaran video YouTube memerlukan sambungan internet.</em></div>';
          } else {
            content = '<video controls class="mpi-media-video" style="background:#000; border-radius:8px;"><source src="' + vUrl + '">Browser Anda tidak mendukung pemutaran berkas video lokal ini.</video>';
          }
        }

        return '<div class="mpi-media-card">' +
          '<div style="font-weight:700; font-size:0.85rem; color:var(--primary); margin-bottom:4px;">' + (item.judul || 'Media Visual/Tabel') + '</div>' +
          content +
          (item.deskripsi ? '<div class="mpi-media-caption">' + item.deskripsi + '</div>' : '') +
        '</div>';
      }).join('') + '</div>';
    }

    // =========================================================================
    // MODUL 1: MATERI CONTROLLER
    // =========================================================================
    let activeMateriIdx = 0;
    const MATERI_ICONS = ['📖', '👥', '⚖️', '🛡️', '🌐', '💡', '📚', '🔍'];

    function renderMateriSidebar() {
      const el = document.getElementById('submateriList');
      el.innerHTML = MATERI.map((m, idx) => {
        const icon = MATERI_ICONS[idx % MATERI_ICONS.length];
        const isUnlocked = idx === 0 || completedBabIds.indexOf(idx - 1) !== -1;
        const isDone = completedBabIds.indexOf(idx) !== -1;
        const isActive = idx === activeMateriIdx;

        let btnClass = 'submateri-btn';
        if (isActive) btnClass += ' active';
        if (isDone) btnClass += ' completed';
        if (!isUnlocked) btnClass += ' locked';

        const clickAction = isUnlocked 
          ? \`selectMateri(\${idx})\` 
          : \`audio.error(); showPrereqModal('Bab \${idx + 1} Masih Terkunci', 'Sesuai aturan alur pembelajaran MPI: Anda wajib menyelesaikan Bab \${idx} dan menjawab Kuis Mini Refleksi Cepat dengan benar terlebih dahulu!', 'materi')\`;

        return \`
          <button class="\${btnClass}" onclick="\${clickAction}" style="display:flex; align-items:flex-start; gap:0.6rem; text-align:left; width:100%;">
            <span style="font-size:1.25rem; line-height:1; padding-top:2px;">\${!isUnlocked ? '🔒' : icon}</span>
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;">
                <span style="font-size:0.75rem; opacity:0.8; font-weight:700;">Bab \${idx + 1}</span>
                \${isDone ? '<span style="font-size:0.7rem; font-weight:800; color:#16a34a; background:#dcfce7; padding:1px 5px; border-radius:4px;">✓ Selesai</span>' : (!isUnlocked ? '<span style="font-size:0.7rem; font-weight:700; color:#94a3b8;">Terkunci</span>' : '<span style="font-size:0.7rem; font-weight:700; color:#3b82f6;">Aktif</span>')}
              </div>
              <div style="font-weight:600; line-height:1.3; font-size:0.875rem;">\${m.judul}</div>
            </div>
          </button>
        \`;
      }).join('');
    }

    function selectMateri(idx) {
      audio.click();
      activeMateriIdx = idx;
      renderMateriSidebar();
      renderMateriDetail();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function retryCurrentMiniKuis() {
      audio.click();
      var fb = document.getElementById('miniKuisFeedback');
      if (fb) fb.style.display = 'none';
      var box = document.getElementById('materiDetailBox');
      if (box) box.scrollIntoView({ behavior: 'smooth' });
    }

    function renderMateriDetail() {
      const m = MATERI[activeMateriIdx];
      const box = document.getElementById('materiDetailBox');
      const icon = MATERI_ICONS[activeMateriIdx % MATERI_ICONS.length];
      const isDone = completedBabIds.indexOf(activeMateriIdx) !== -1;

      box.className = 'card ' + getAnimClass(m.animasi);
      box.innerHTML = \`
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.6rem; margin-bottom:0.5rem;">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span style="font-size:1.5rem;">\${icon}</span>
            <span class="materi-badge" style="margin:0;">\${m.kategori} • Bab \${activeMateriIdx + 1} dari \${MATERI.length}</span>
          </div>
          \${isDone ? '<span style="display:inline-flex; align-items:center; gap:4px; font-size:0.75rem; font-weight:800; color:#15803d; background:#dcfce7; border:1px solid #bbf7d0; padding:0.25rem 0.6rem; border-radius:9999px;">✓ Bab Ini Telah Tuntas</span>' : ''}
        </div>
        <h2 class="materi-title">\${m.judul}</h2>
        \${renderOfflineMedia(m.mediaList, 'atas')}
        <div class="materi-box">\${m.ringkasan}</div>
        
        <h3 style="font-size:1.05rem; font-weight:700; margin-bottom:0.5rem; color:var(--primary);">Poin Kunci Kurikulum:</h3>
        <ul class="poin-kunci">
          \${m.poinKunci.map(p => \`<li>\${p}</li>\`).join('')}
        </ul>

        \${m.penjelasanLengkap.map(text => \`<p style="margin-bottom:0.75rem; color:#334155;">\${text}</p>\`).join('')}

        <div style="background:#f1f5f9; padding:1rem; border-radius:8px; margin:1rem 0;">
          <strong style="color:var(--primary-dark); font-size:0.9rem;">\${m.studiKasus.judul}</strong>
          <p style="font-size:0.875rem; color:#475569; margin-top:0.35rem;">\${m.studiKasus.deskripsi}</p>
        </div>

        \${renderOfflineMedia(m.mediaList, 'bawah')}

        <!-- CHECKPOINT MINI KUIS SISWA WAJIB -->
        <div class="mini-kuis-box" style="border: 2px solid #fef08a; background: #fffbeb; border-radius: 16px; padding: 1.25rem; margin-top: 1.5rem;">
          <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.4rem;">
            <span style="font-size:1.2rem;">⚡</span>
            <strong style="color:#854d0e; font-size:0.95rem;">Kuis Mini Refleksi Cepat (Checkpoint Siswa Wajib)</strong>
          </div>
          <p style="font-size:0.8rem; color:#78350f; margin-bottom:0.75rem;">
            Sesuai aturan alur MPI, jawab kuis refleksi di bawah ini dengan benar untuk membuka bab berikutnya / Modul Bermain.
          </p>
          <div style="font-weight:700; font-size:0.95rem; margin-bottom:0.75rem; color:#1e293b; background:white; padding:0.75rem 1rem; border-radius:10px; border:1px solid #fde68a;">
            \${m.kuisMini.tanya}
          </div>
          <div class="mini-kuis-opsi" id="miniKuisOpsi">
            \${m.kuisMini.opsi.map((op, i) => \`
              <button class="mini-btn" onclick="checkMiniKuis(\${i})" style="text-align:left; font-weight:600; padding:0.6rem 0.85rem; border-radius:8px; margin-bottom:0.4rem; background:white; border:1.5px solid #cbd5e1; cursor:pointer;">
                <span style="display:inline-block; width:22px; font-weight:800; color:var(--primary);">\${String.fromCharCode(65 + i)}.</span> \${op}
              </button>
            \`).join('')}
          </div>
          <div id="miniKuisFeedback" style="margin-top:0.85rem; display:none; padding:1rem; border-radius:12px;"></div>
        </div>
      \`;
    }

    function checkMiniKuis(pilihan) {
      const m = MATERI[activeMateriIdx];
      const fb = document.getElementById('miniKuisFeedback');
      fb.style.display = 'block';

      if (pilihan === m.kuisMini.kunci) {
        if (completedBabIds.indexOf(activeMateriIdx) === -1) {
          completedBabIds.push(activeMateriIdx);
        }
        audio.success();
        updateMpiProgressUI();
        renderMateriSidebar();

        const isLastBab = activeMateriIdx >= MATERI.length - 1;
        fb.style.background = '#dcfce7';
        fb.style.border = '1.5px solid #86efac';
        fb.innerHTML = \`
          <div style="display:flex; align-items:flex-start; gap:0.5rem; color:#15803d; font-weight:700; font-size:0.9rem; margin-bottom:0.75rem;">
            <span style="font-size:1.25rem;">✅</span>
            <div>
              <div>Jawaban Benar! Checkpoint Bab \${activeMateriIdx + 1} Tuntas.</div>
              <div style="font-size:0.82rem; font-weight:500; color:#166534; margin-top:0.25rem;">\${m.kuisMini.penjelasan}</div>
            </div>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.5rem;">
            \${!isLastBab ? \`
              <button onclick="selectMateri(\${activeMateriIdx + 1})" style="background:#16a34a; color:white; font-weight:800; font-size:0.85rem; padding:0.6rem 1.1rem; border-radius:8px; border:none; cursor:pointer; box-shadow:0 2px 4px rgba(22,163,74,0.3);">
                ➡️ Lanjut ke Bab Berikutnya (Bab \${activeMateriIdx + 2})
              </button>
            \` : \`
              <button onclick="switchTab('bermain')" style="background:#e11d48; color:white; font-weight:800; font-size:0.85rem; padding:0.6rem 1.1rem; border-radius:8px; border:none; cursor:pointer; box-shadow:0 2px 4px rgba(225,29,72,0.3);">
                🎮 Selamat! Seluruh Bab Tuntas. Buka Modul Bermain
              </button>
            \`}
          </div>
        \`;
      } else {
        audio.error();
        fb.style.background = '#fee2e2';
        fb.style.border = '1.5px solid #fca5a5';

        const hasPrevBab = activeMateriIdx > 0;
        fb.innerHTML = \`
          <div style="display:flex; align-items:flex-start; gap:0.5rem; color:#b91c1c; font-weight:700; font-size:0.9rem; margin-bottom:0.75rem;">
            <span style="font-size:1.25rem;">❌</span>
            <div>
              <div>Jawaban Belum Tepat!</div>
              <div style="font-size:0.82rem; font-weight:500; color:#991b1b; margin-top:0.25rem;">
                Sesuai aturan alur MPI, Anda harus memahami materi sebelum melanjutkan. Silakan telaah uraian materi di atas atau kembali ke Bab Sebelumnya untuk memperkuat pemahaman.
              </div>
            </div>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-top:0.5rem;">
            \${hasPrevBab ? \`
              <button onclick="selectMateri(\${activeMateriIdx - 1})" style="background:#dc2626; color:white; font-weight:800; font-size:0.85rem; padding:0.6rem 1.1rem; border-radius:8px; border:none; cursor:pointer; box-shadow:0 2px 4px rgba(220,38,38,0.3); display:inline-flex; align-items:center; gap:0.35rem;">
                🔙 Kembali ke BAB Sebelumnya (Bab \${activeMateriIdx})
              </button>
              <button onclick="retryCurrentMiniKuis()" style="background:#ffffff; color:#dc2626; font-weight:700; font-size:0.85rem; padding:0.6rem 1rem; border-radius:8px; border:1.5px solid #fca5a5; cursor:pointer;">
                🔄 Coba Jawab Lagi
              </button>
            \` : \`
              <button onclick="retryCurrentMiniKuis()" style="background:#dc2626; color:white; font-weight:800; font-size:0.85rem; padding:0.6rem 1.1rem; border-radius:8px; border:none; cursor:pointer; box-shadow:0 2px 4px rgba(220,38,38,0.3);">
                🔄 Pelajari Ulang Bab 1 & Coba Lagi
              </button>
            \`}
          </div>
        \`;
      }
    }

    // =========================================================================
    // MODUL 2: BERMAIN (10 GAME INTERAKTIF)
    // =========================================================================
    let activeGameIdx = 0;
    const gameProgress = new Array(dataBermain.length).fill(false);
    const GAME_ICONS = ['🧩', '🎯', '🔢', '💎', '⚡', '🔀', '🛡️', '🏆', '✨', '🔗'];

    function renderGameNav() {
      const el = document.getElementById('gameNavContainer');
      el.innerHTML = dataBermain.map((g, idx) => {
        const icon = GAME_ICONS[idx % GAME_ICONS.length];
        return \`
          <button class="game-num-btn \${idx === activeGameIdx ? 'active' : ''} \${gameProgress[idx] ? 'done' : ''}" onclick="selectGame(\${idx})" title="Game \${idx + 1}: \${g.tipe}">
            <span style="font-size:0.9rem;">\${icon}</span>
            <span style="font-size:0.75rem; font-weight:700; margin-top:2px;">G\${idx + 1}</span>
          </button>
        \`;
      }).join('');
    }

    function selectGame(idx) {
      audio.click();
      activeGameIdx = idx;
      renderGameNav();
      renderGameContent();
    }

    function renderGameContent() {
      const g = dataBermain[activeGameIdx];
      const canvas = document.getElementById('gameCanvas');
      canvas.className = 'game-container ' + getAnimClass(g.animasi);
      let typeLabel = '';
      if (g.tipe === 'jodoh') typeLabel = 'Menjodohkan Konsep';
      else if (g.tipe === 'klik') typeLabel = 'Tantangan Klik Kilat';
      else if (g.tipe === 'urut') typeLabel = 'Urutkan Tahapan';
      else if (g.tipe === 'kumpul') typeLabel = 'Koleksi Karakter';
      else if (g.tipe === 'sambung') typeLabel = 'Rantai Sebab-Akibat';

      let innerHtml = \`
        <div class="game-header">
          <div>
            <span class="game-type-badge">\${typeLabel} (Aktivitas \${activeGameIdx + 1}/10)</span>
            <h3 style="font-size:1.2rem; font-weight:800; margin-top:0.35rem; color:var(--primary-dark);">\${g.judul}</h3>
          </div>
          <div style="font-size:0.875rem; color:var(--text-muted);">
            Status: \${gameProgress[activeGameIdx] ? '<strong style="color:var(--success);">TUNTAS ⭐</strong>' : 'Belum Selesai'}
          </div>
        </div>
        \${renderOfflineMedia(g.mediaList, 'atas')}
        <p style="font-size:0.95rem; color:#475569; margin-bottom:1.25rem;">\${g.instruksi}</p>
        <div id="gamePlayArea"></div>
        \${renderOfflineMedia(g.mediaList, 'bawah')}

        <!-- Bottom Game Nav Step -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-top:1.5rem; padding-top:1.25rem; border-top:1px solid #e2e8f0;">
          <button 
            type="button" 
            onclick="prevGameStep()" 
            \${activeGameIdx === 0 ? 'disabled' : ''} 
            style="padding:0.55rem 1.1rem; border-radius:8px; border:1px solid #cbd5e1; background:white; color:#334155; font-weight:700; font-size:0.85rem; cursor:\${activeGameIdx === 0 ? 'not-allowed' : 'pointer'}; opacity:\${activeGameIdx === 0 ? '0.4' : '1'}; transition:all 0.2s;"
          >
            ← Game Sebelumnya \${activeGameIdx > 0 ? '(G' + activeGameIdx + ')' : ''}
          </button>

          <div style="font-size:0.8rem; font-weight:700; color:#64748b;">
            Game \${activeGameIdx + 1} dari \${dataBermain.length}
          </div>

          \${activeGameIdx < dataBermain.length - 1 ? \`
            <button 
              type="button" 
              onclick="nextGameStep()" 
              style="padding:0.55rem 1.25rem; border-radius:8px; border:none; background:var(--secondary); color:white; font-weight:800; font-size:0.85rem; cursor:pointer; box-shadow:0 2px 4px rgba(13,148,136,0.3); transition:all 0.2s;"
            >
              Game Selanjutnya (G\${activeGameIdx + 2}) →
            </button>
          \` : \`
            <button 
              type="button" 
              onclick="switchTab('berlatih')" 
              style="padding:0.55rem 1.25rem; border-radius:8px; border:none; background:var(--primary); color:white; font-weight:800; font-size:0.85rem; cursor:pointer; box-shadow:0 2px 4px rgba(79,70,229,0.3); transition:all 0.2s;"
            >
              🏆 Lanjut ke Modul Berlatih →
            </button>
          \`}
        </div>
      \`;
      canvas.innerHTML = innerHtml;

      // Render Sub-engine based on type
      if (g.tipe === 'jodoh') initGameJodoh(g);
      else if (g.tipe === 'klik') initGameKlik(g);
      else if (g.tipe === 'urut') initGameUrut(g);
      else if (g.tipe === 'kumpul') initGameKumpul(g);
      else if (g.tipe === 'sambung') initGameSambung(g);
    }

    function prevGameStep() {
      if (activeGameIdx > 0) {
        selectGame(activeGameIdx - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function nextGameStep() {
      if (activeGameIdx < dataBermain.length - 1) {
        selectGame(activeGameIdx + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // --- GAME ENGINE: JODOH ---
    let jodohSelectedLeft = null;
    let jodohMatches = {};
    function initGameJodoh(g) {
      jodohSelectedLeft = null;
      jodohMatches = {};
      const area = document.getElementById('gamePlayArea');
      const pairs = g.pasangan;
      const shufRight = [...pairs].sort(() => Math.random() - 0.5);

      area.innerHTML = \`
        <div class="jodoh-grid">
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            <strong style="color:var(--text-muted); font-size:0.85rem;">KOLOM KIRI:</strong>
            \${pairs.map(p => \`<div class="item-selectable" id="left_\${p.id}" onclick="clickJodohLeft('\${p.id}')">\${p.kiri}</div>\`).join('')}
          </div>
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            <strong style="color:var(--text-muted); font-size:0.85rem;">KOLOM KANAN:</strong>
            \${shufRight.map(p => \`<div class="item-selectable" id="right_\${p.id}" onclick="clickJodohRight('\${p.id}')">\${p.kanan}</div>\`).join('')}
          </div>
        </div>
        <div id="jodohMsg" style="margin-top:1rem; font-weight:700;"></div>
      \`;
    }

    function clickJodohLeft(id) {
      if (jodohMatches[id]) return;
      audio.click();
      document.querySelectorAll('[id^="left_"]').forEach(el => el.classList.remove('selected'));
      const el = document.getElementById('left_' + id);
      if (el) el.classList.add('selected');
      jodohSelectedLeft = id;
    }

    function clickJodohRight(id) {
      if (!jodohSelectedLeft || jodohMatches[id]) return;
      const g = dataBermain[activeGameIdx];
      if (jodohSelectedLeft === id) {
        audio.success();
        jodohMatches[id] = true;
        document.getElementById('left_' + id).className = 'item-selectable matched';
        document.getElementById('right_' + id).className = 'item-selectable matched';
        jodohSelectedLeft = null;
        if (Object.keys(jodohMatches).length === g.pasangan.length) {
          if (!gameProgress[activeGameIdx]) {
            gameProgress[activeGameIdx] = true;
            completedGamesCount++;
          }
          renderGameNav();
          updateMpiProgressUI();
          document.getElementById('jodohMsg').innerHTML = '<span style="color:var(--success);">🎉 Hebat! Semua pasangan berhasil dicocokkan dengan benar!</span>';
        }
      } else {
        audio.error();
        document.getElementById('jodohMsg').innerHTML = '<span style="color:var(--danger);">⚠️ Pasangan belum cocok. Coba hubungkan dengan item lainnya!</span>';
      }
    }

    // --- GAME ENGINE: KLIK ---
    function initGameKlik(g) {
      const area = document.getElementById('gamePlayArea');
      area.innerHTML = \`
        <div class="klik-grid">
          \${g.itemKlik.map((item, idx) => \`
            <div class="item-klik-card" id="klik_\${idx}" onclick="handleKlikCard(\${idx})">\${item.teks}</div>
          \`).join('')}
        </div>
        <div id="klikStatusMsg" style="margin-top:1rem; font-weight:700;"></div>
      \`;
    }

    function handleKlikCard(idx) {
      const g = dataBermain[activeGameIdx];
      const item = g.itemKlik[idx];
      const el = document.getElementById('klik_' + idx);
      if (el.classList.contains('clicked-correct') || el.classList.contains('clicked-wrong')) return;

      if (item.benar) {
        audio.success();
        el.classList.add('clicked-correct');
        el.innerHTML += ' ✅';
      } else {
        audio.error();
        el.classList.add('clicked-wrong');
        el.innerHTML += ' ❌';
      }

      // Check if all correct are found
      const correctCount = g.itemKlik.filter(i => i.benar).length;
      const clickedCorrect = document.querySelectorAll('.item-klik-card.clicked-correct').length;
      if (clickedCorrect === correctCount) {
        if (!gameProgress[activeGameIdx]) {
          gameProgress[activeGameIdx] = true;
          completedGamesCount++;
        }
        renderGameNav();
        updateMpiProgressUI();
        document.getElementById('klikStatusMsg').innerHTML = '<span style="color:var(--success);">🏆 Sempurna! Anda berhasil menemukan seluruh item yang tepat!</span>';
      }
    }

    // --- GAME ENGINE: URUT ---
    let currentUrutan = [];
    function initGameUrut(g) {
      currentUrutan = [...g.urutanBenar].sort(() => Math.random() - 0.5);
      renderUrutView();
    }

    function renderUrutView() {
      const area = document.getElementById('gamePlayArea');
      area.innerHTML = \`
        <div class="urut-list">
          \${currentUrutan.map((teks, idx) => \`
            <div class="urut-item">
              <div class="urut-ctrls">
                <button class="btn-reorder" onclick="moveUrut(\${idx}, -1)" \${idx === 0 ? 'disabled' : ''}>▲</button>
                <button class="btn-reorder" onclick="moveUrut(\${idx}, 1)" \${idx === currentUrutan.length - 1 ? 'disabled' : ''}>▼</button>
              </div>
              <div style="font-weight:600; font-size:0.9rem; flex:1;">\${teks}</div>
            </div>
          \`).join('')}
        </div>
        <div style="margin-top:1.25rem; display:flex; gap:1rem; align-items:center;">
          <button class="btn-action" onclick="checkUrutan()">Periksa Urutan</button>
          <div id="urutFeedback" style="font-weight:700;"></div>
        </div>
      \`;
    }

    function moveUrut(idx, dir) {
      audio.click();
      const target = idx + dir;
      const tmp = currentUrutan[idx];
      currentUrutan[idx] = currentUrutan[target];
      currentUrutan[target] = tmp;
      renderUrutView();
    }

    function checkUrutan() {
      const g = dataBermain[activeGameIdx];
      const isMatch = currentUrutan.every((val, i) => val === g.urutanBenar[i]);
      const fb = document.getElementById('urutFeedback');
      if (isMatch) {
        audio.success();
        if (!gameProgress[activeGameIdx]) {
          gameProgress[activeGameIdx] = true;
          completedGamesCount++;
        }
        renderGameNav();
        updateMpiProgressUI();
        fb.innerHTML = '<span style="color:var(--success);">🌟 Tepat Sekali! Urutan tahapan sudah sangat logis dan benar!</span>';
      } else {
        audio.error();
        fb.innerHTML = '<span style="color:var(--danger);">⚠️ Urutan belum tepat. Cermati alur tahapannya kembali!</span>';
      }
    }

    // --- GAME ENGINE: KUMPUL ---
    function initGameKumpul(g) {
      const area = document.getElementById('gamePlayArea');
      area.innerHTML = \`
        <div class="kumpul-zone">
          \${g.itemKumpul.map((item, idx) => \`
            <div class="kumpul-item" id="kumpul_\${idx}" onclick="handleKumpulItem(\${idx})">\${item.teks}</div>
          \`).join('')}
        </div>
        <div id="kumpulMsg" style="margin-top:1rem; font-weight:700;"></div>
      \`;
    }

    function handleKumpulItem(idx) {
      const g = dataBermain[activeGameIdx];
      const item = g.itemKumpul[idx];
      const el = document.getElementById('kumpul_' + idx);
      if (el.classList.contains('collected') || el.classList.contains('pengecoh-clicked')) return;

      if (item.benar) {
        audio.success();
        el.classList.add('collected');
      } else {
        audio.error();
        el.classList.add('pengecoh-clicked');
      }

      const totalCorrect = g.itemKumpul.filter(i => i.benar).length;
      const found = document.querySelectorAll('.kumpul-item.collected').length;
      if (found === totalCorrect) {
        if (!gameProgress[activeGameIdx]) {
          gameProgress[activeGameIdx] = true;
          completedGamesCount++;
        }
        renderGameNav();
        updateMpiProgressUI();
        document.getElementById('kumpulMsg').innerHTML = '<span style="color:var(--success);">🎯 Keren! Seluruh karakteristik yang dicari berhasil terkumpul!</span>';
      }
    }

    // --- GAME ENGINE: SAMBUNG ---
    let sambungMatches = {};
    let selectedSebab = null;
    function initGameSambung(g) {
      sambungMatches = {};
      selectedSebab = null;
      const area = document.getElementById('gamePlayArea');
      const chain = g.rantaiLogika;
      const shufAkibat = [...chain].sort(() => Math.random() - 0.5);

      area.innerHTML = \`
        <div class="jodoh-grid">
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            <strong style="color:var(--text-muted); font-size:0.85rem;">SEBAB / AKSI:</strong>
            \${chain.map((c, i) => \`<div class="item-selectable" id="sebab_\${i}" onclick="selectSebab(\${i})">\${c.sebab}</div>\`).join('')}
          </div>
          <div style="display:flex; flex-direction:column; gap:0.6rem;">
            <strong style="color:var(--text-muted); font-size:0.85rem;">AKIBAT / RESOLUSI:</strong>
            \${shufAkibat.map((c, i) => \`<div class="item-selectable" id="akibat_\${i}" onclick="selectAkibat('\${c.akibat}', \${i})">\${c.akibat}</div>\`).join('')}
          </div>
        </div>
        <div id="sambungFeedback" style="margin-top:1rem; font-weight:700;"></div>
      \`;
    }

    function selectSebab(idx) {
      if (sambungMatches[idx]) return;
      audio.click();
      document.querySelectorAll('[id^="sebab_"]').forEach(el => el.classList.remove('selected'));
      document.getElementById('sebab_' + idx).classList.add('selected');
      selectedSebab = idx;
    }

    function selectAkibat(akibatText, elIdx) {
      if (selectedSebab === null) return;
      const g = dataBermain[activeGameIdx];
      const targetAkibat = g.rantaiLogika[selectedSebab].akibat;

      if (akibatText === targetAkibat) {
        audio.success();
        sambungMatches[selectedSebab] = true;
        document.getElementById('sebab_' + selectedSebab).className = 'item-selectable matched';
        document.getElementById('akibat_' + elIdx).className = 'item-selectable matched';
        selectedSebab = null;

        if (Object.keys(sambungMatches).length === g.rantaiLogika.length) {
          if (!gameProgress[activeGameIdx]) {
            gameProgress[activeGameIdx] = true;
            completedGamesCount++;
          }
          renderGameNav();
          updateMpiProgressUI();
          document.getElementById('sambungFeedback').innerHTML = '<span style="color:var(--success);">✨ Rantai logika tersambung dengan sangat utuh dan tepat!</span>';
        }
      } else {
        audio.error();
        document.getElementById('sambungFeedback').innerHTML = '<span style="color:var(--danger);">⚠️ Akibat belum cocok dengan sebab yang dipilih. Coba telaah lagi!</span>';
      }
    }

    // =========================================================================
    // MODUL 3: BERLATIH (10 SOAL EVALUASI HOTS)
    // =========================================================================
    let currentSoalIdx = 0;
    const userAnswers = new Array(dtLatih.length).fill(null);
    const answerSubmitted = new Array(dtLatih.length).fill(false);

    function renderLatihModule() {
      const container = document.getElementById('latihContainer');
      const q = dtLatih[currentSoalIdx];
      const isDone = answerSubmitted[currentSoalIdx];

      let typeBadge = 'Pilihan Ganda';
      if (q.t === 'pg_kompleks') typeBadge = 'Pilihan Ganda Kompleks (MCMA)';
      else if (q.t === 'jodoh') typeBadge = 'Menjodohkan Konsep';
      else if (q.t === 'drag_word') typeBadge = 'Mengisi Rumpang Kalimat';

      container.className = 'card ' + getAnimClass(q.animasi);
      container.innerHTML = \`
        <div class="latih-progress-bar">
          \${dtLatih.map((soal, i) => {
            let cls = '';
            if (answerSubmitted[i]) {
              cls = checkAnswerCorrectness(i) ? 'correct' : 'incorrect';
            } else if (i === currentSoalIdx) {
              cls = 'active';
            }
            return \`<div class="latih-step \${cls}" onclick="navSoal(\${i})" style="cursor:pointer;" title="Soal \${i+1}"></div>\`;
          }).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <span class="game-type-badge">\${typeBadge} • No. \${q.no} dari \${dtLatih.length}</span>
          <div style="font-weight:700; color:var(--text-muted); font-size:0.85rem;">Soal Asesmen HOTS</div>
        </div>

        \${renderOfflineMedia(q.mediaList, 'atas')}

        \${q.stimulus ? \`<div class="stimulus-box"><strong>WACANA STIMULUS:</strong><br>\${q.stimulus}</div>\` : ''}

        <div class="soal-tanya">\${q.tanya}</div>
        <div id="soalInteractionArea"></div>

        \${isDone ? \`
          <div class="pembahasan-box">
            <strong>💡 KUNCI & PEMBAHASAN MENDALAM:</strong><br>
            \${q.msg}
          </div>
        \` : ''}

        \${renderOfflineMedia(q.mediaList, 'bawah')}

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem;">
          <button class="mini-btn" onclick="prevSoal()" \${currentSoalIdx === 0 ? 'disabled' : ''}>← Sebelumnya</button>
          \${!isDone ? \`
            <button class="btn-action" onclick="submitCurrentAnswer()">Kunci Jawaban</button>
          \` : (currentSoalIdx < dtLatih.length - 1 ? \`
            <button class="btn-action" onclick="nextSoal()">Soal Selanjutnya →</button>
          \` : \`
            <button class="btn-action" style="background:var(--success);" onclick="showReportCard()">Lihat Rapor Evaluasi 📊</button>
          \`)}
        </div>
      \`;

      renderSoalInteraction(q, isDone);
    }

    function renderSoalInteraction(q, isDone) {
      const area = document.getElementById('soalInteractionArea');
      const currAns = userAnswers[currentSoalIdx];

      if (q.t === 'pg') {
        const letters = ['A', 'B', 'C', 'D', 'E'];
        area.innerHTML = \`
          <div class="opsi-list">
            \${q.opsi.map((op, idx) => {
              let cls = '';
              if (currAns === idx) cls = 'selected';
              if (isDone) {
                if (idx === q.j) cls = 'ans-correct';
                else if (currAns === idx) cls = 'ans-wrong';
              }
              return \`
                <div class="opsi-item \${cls}" onclick="\${!isDone ? \`selectPgAnswer(\${idx})\` : ''}">
                  <div class="opsi-marker">\${letters[idx]}</div>
                  <div style="font-size:0.95rem;">\${op}</div>
                </div>
              \`;
            }).join('')}
          </div>
        \`;
      } else if (q.t === 'pg_kompleks') {
        const selectedArr = Array.isArray(currAns) ? currAns : [];
        const letters = ['A', 'B', 'C', 'D', 'E'];
        area.innerHTML = \`
          <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.5rem;">*Pilihlah satu atau lebih opsi jawaban yang menurut Anda benar:</div>
          <div class="opsi-list">
            \${q.opsi.map((op, idx) => {
              const isSel = selectedArr.includes(idx);
              let cls = isSel ? 'selected' : '';
              if (isDone) {
                if (q.j.includes(idx)) cls = 'ans-correct';
                else if (isSel) cls = 'ans-wrong';
              }
              return \`
                <div class="opsi-item \${cls}" onclick="\${!isDone ? \`toggleMcmaAnswer(\${idx})\` : ''}">
                  <div class="opsi-marker">\${isSel ? '✓' : letters[idx]}</div>
                  <div style="font-size:0.95rem;">\${op}</div>
                </div>
              \`;
            }).join('')}
          </div>
        \`;
      } else if (q.t === 'jodoh') {
        area.innerHTML = \`
          <div style="background:#f8fafc; padding:1rem; border-radius:8px; border:1px solid var(--border);">
            <div style="font-size:0.9rem; margin-bottom:0.75rem; font-weight:600;">Cocokkan pasangan konsep berikut:</div>
            <div style="display:flex; flex-direction:column; gap:0.5rem;">
              \${q.pasanganJodoh.map((p, idx) => \`
                <div style="background:white; padding:0.75rem; border-radius:6px; border:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:1rem;">
                  <strong style="color:var(--primary); font-size:0.9rem;">\${p.kiri}</strong>
                  <span style="color:#64748b; font-size:0.85rem;">➔</span>
                  <span style="font-size:0.875rem; color:#334155; text-align:right;">\${p.kanan}</span>
                </div>
              \`).join('')}
            </div>
            <div style="margin-top:1rem; font-size:0.85rem; color:#475569;">
              Apakah Anda menyetujui pemetaan pasangan konsep sosiologis di atas?
            </div>
            <div style="margin-top:0.5rem; display:flex; gap:0.5rem;">
              <button class="mini-btn \${currAns === 1 ? 'selected' : ''}" onclick="\${!isDone ? 'userAnswers['+currentSoalIdx+'] = 1; renderLatihModule();' : ''}">Ya, Pasangan Sesuai</button>
              <button class="mini-btn \${currAns === 0 ? 'selected' : ''}" onclick="\${!isDone ? 'userAnswers['+currentSoalIdx+'] = 0; renderLatihModule();' : ''}">Belum Sesuai</button>
            </div>
          </div>
        \`;
      } else if (q.t === 'drag_word') {
        const words = q.kataPilihan || [];
        const answeredWords = Array.isArray(currAns) ? currAns : [];
        area.innerHTML = \`
          <div style="background:#f8fafc; padding:1.25rem; border-radius:8px; border:1px solid var(--border);">
            <div style="font-size:1rem; line-height:1.8; margin-bottom:1rem; color:#1e293b;">
              Kelompok <strong style="color:var(--primary); text-decoration:underline;">\${answeredWords[0] || '[KATA 1]'}</strong> ditandai oleh pergaulan dan kerja sama <strong style="color:var(--primary); text-decoration:underline;">\${answeredWords[1] || '[KATA 2]'}</strong> yang bersifat mendalam, langgeng, dan tatap muka secara langsung, seperti yang ditemukan pada lingkungan <strong style="color:var(--primary); text-decoration:underline;">\${answeredWords[2] || '[KATA 3]'}</strong>.
            </div>
            <div style="font-size:0.85rem; font-weight:700; color:#64748b; margin-bottom:0.5rem;">Pilihan Kata:</div>
            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
              \${words.map(w => \`
                <button class="mini-btn" onclick="\${!isDone ? \`insertWordAnswer('\${w}')\` : ''}">\${w}</button>
              \`).join('')}
              \${!isDone ? \`<button class="mini-btn" style="color:var(--danger);" onclick="userAnswers[currentSoalIdx] = []; renderLatihModule();">↺ Reset Kata</button>\` : ''}
            </div>
          </div>
        \`;
      }
    }

    function selectPgAnswer(idx) {
      audio.click();
      userAnswers[currentSoalIdx] = idx;
      renderLatihModule();
    }

    function toggleMcmaAnswer(idx) {
      audio.click();
      let arr = Array.isArray(userAnswers[currentSoalIdx]) ? [...userAnswers[currentSoalIdx]] : [];
      if (arr.includes(idx)) arr = arr.filter(i => i !== idx);
      else arr.push(idx);
      userAnswers[currentSoalIdx] = arr;
      renderLatihModule();
    }

    function insertWordAnswer(w) {
      audio.click();
      let arr = Array.isArray(userAnswers[currentSoalIdx]) ? [...userAnswers[currentSoalIdx]] : [];
      if (arr.length < 3 && !arr.includes(w)) {
        arr.push(w);
        userAnswers[currentSoalIdx] = arr;
        renderLatihModule();
      }
    }

    function checkAnswerCorrectness(i) {
      const q = dtLatih[i];
      const ans = userAnswers[i];
      if (ans === null || ans === undefined) return false;

      if (q.t === 'pg') {
        return ans === q.j;
      } else if (q.t === 'pg_kompleks') {
        if (!Array.isArray(ans)) return false;
        const sortedAns = [...ans].sort();
        const sortedKey = [...q.j].sort();
        return JSON.stringify(sortedAns) === JSON.stringify(sortedKey);
      } else if (q.t === 'jodoh') {
        return ans === 1;
      } else if (q.t === 'drag_word') {
        if (!Array.isArray(ans) || ans.length !== q.j.length) return false;
        return ans.every((word, idx) => word === q.j[idx]);
      }
      return false;
    }

    function submitCurrentAnswer() {
      if (userAnswers[currentSoalIdx] === null || userAnswers[currentSoalIdx] === undefined) {
        alert('Mohon pilih atau lengkapi jawaban terlebih dahulu!');
        return;
      }
      answerSubmitted[currentSoalIdx] = true;
      if (checkAnswerCorrectness(currentSoalIdx)) {
        audio.success();
      } else {
        audio.error();
      }
      renderLatihModule();
    }

    function navSoal(idx) {
      audio.click();
      currentSoalIdx = idx;
      renderLatihModule();
    }

    function prevSoal() {
      if (currentSoalIdx > 0) navSoal(currentSoalIdx - 1);
    }

    function nextSoal() {
      if (currentSoalIdx < dtLatih.length - 1) navSoal(currentSoalIdx + 1);
    }

    function showReportCard() {
      audio.success();
      let correctCount = 0;
      for (let i = 0; i < dtLatih.length; i++) {
        if (checkAnswerCorrectness(i)) correctCount++;
      }
      const score = Math.round((correctCount / dtLatih.length) * 100);
      const isLulus = score >= CONFIG.kkm;

      const container = document.getElementById('latihContainer');
      container.innerHTML = \`
        <div class="report-card">
          <div class="score-circle anim-bounce-in" style="background:\${isLulus ? 'var(--success)' : 'var(--danger)'};">
            <span class="score-number">\${score}</span>
            <span class="score-label">NILAI AKHIR</span>
          </div>
          <h2 style="font-size:1.5rem; font-weight:800; color:var(--text); margin-bottom:0.5rem;">
            \${isLulus ? '🎉 SELAMAT! ANDA TUNTAS KKM' : '📚 PERLU REMEDIAL / PENGUATAN'}
          </h2>
          
          <!-- Identitas Siswa pada Lembar Rapor Evaluasi -->
          <div style="display:inline-flex; flex-wrap:wrap; justify-content:center; gap:1.25rem; padding:0.6rem 1.25rem; background:#f1f5f9; border:1px solid #cbd5e1; border-radius:12px; margin-bottom:1.25rem; font-size:0.85rem; color:#334155;">
            <div>Nama Peserta Didik: <strong style="color:#0f172a;">\${currentStudent.nama || 'Peserta Didik'}</strong></div>
            <div>Kelas / Rombel: <strong style="color:#0f172a;">\${currentStudent.kelas || CONFIG.kelas}</strong></div>
            <div>Mata Pelajaran: <strong style="color:#0f172a;">\${CONFIG.mataPelajaran}</strong></div>
          </div>

          <p style="color:var(--text-muted); font-size:0.95rem; max-width:550px; margin:0 auto 1.5rem;">
            Pencapaian: <strong>\${correctCount}</strong> benar dari <strong>\${dtLatih.length}</strong> butir soal Asesmen Kurikulum Merdeka (Target KKM: <strong>\${CONFIG.kkm}</strong>).
          </p>

          <!-- Table Analisis Butir Soal -->
          <div style="max-width:650px; margin:0 auto 1.5rem; overflow-x:auto;">
            <table class="mpi-media-table" style="font-size:0.8rem;">
              <thead>
                <tr>
                  <th style="width:45px; text-align:center;">No</th>
                  <th>Bentuk Soal</th>
                  <th style="width:110px; text-align:center;">Status</th>
                </tr>
              </thead>
              <tbody>
                \${dtLatih.map((s, idx) => {
                  const correct = checkAnswerCorrectness(idx);
                  return '<tr>' +
                    '<td style="text-align:center; font-weight:bold;">' + (idx + 1) + '</td>' +
                    '<td>' + (s.t === 'pg' ? 'Pilihan Ganda' : s.t === 'pg_kompleks' ? 'PG Kompleks' : s.t === 'jodoh' ? 'Menjodohkan' : 'Mengisi Rumpang') + '</td>' +
                    '<td style="text-align:center; font-weight:bold; color:' + (correct ? 'var(--success)' : 'var(--danger)') + ';">' +
                      (correct ? '✓ Benar' : '✗ Salah') +
                    '</td>' +
                  '</tr>';
                }).join('')}
              </tbody>
            </table>
          </div>

          <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.75rem;">
            <button class="btn-action" style="background:#0d9488;" onclick="window.print()">
              🖨️ Cetak / Download PDF Rekap Nilai
            </button>
            <button class="btn-action" onclick="resetLatih()">↺ Ulangi Latihan</button>
            <button class="btn-action" style="background:#475569;" onclick="navSoal(0)">🔍 Review Pembahasan</button>
          </div>
        </div>
      \`;
    }

    function resetLatih() {
      audio.click();
      for (let i = 0; i < dtLatih.length; i++) {
        userAnswers[i] = null;
        answerSubmitted[i] = false;
      }
      currentSoalIdx = 0;
      renderLatihModule();
    }

    // =========================================================================
    // INITIALIZATION ON LOAD
    // =========================================================================
    window.addEventListener('DOMContentLoaded', () => {
      renderMateriSidebar();
      renderMateriDetail();
      renderGameNav();
      renderGameContent();
      renderLatihModule();
      updateMpiProgressUI();
    });
  </script>
</body>
</html>`;
}

export const generateStandaloneHtml = (params: {
  config?: MpiConfig;
  materi?: MateriItem[];
  bermain?: GameItem[];
  latih?: SoalLatih[];
}): string => {
  return generateStandaloneMpiHtml(
    params.config,
    params.materi,
    params.bermain,
    params.latih
  );
};
