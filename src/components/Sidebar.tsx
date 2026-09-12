import React from 'react';
import { 
  UserCheck, 
  BookOpen, 
  Gamepad2, 
  HelpCircle, 
  FileSpreadsheet, 
  Eye, 
  Download, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  ExternalLink,
  GraduationCap,
  FileJson
} from 'lucide-react';
import { sound } from '../utils/audio';
import { MpiConfig } from '../types';
import { SigmaLogo } from './SigmaLogo';

export type ActiveMenu = 
  | 'identitas' 
  | 'materi' 
  | 'bermain' 
  | 'soal' 
  | 'upload_excel' 
  | 'preview'
  | 'backup_json';

interface SidebarProps {
  activeMenu: ActiveMenu;
  onSelectMenu: (menu: ActiveMenu) => void;
  onOpenExportModal: () => void;
  config: MpiConfig;
  totalMateri: number;
  totalGames: number;
  totalSoal: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  onOpenExportModal,
  config,
  totalMateri,
  totalGames,
  totalSoal,
  isCollapsed,
  onToggleCollapse
}) => {
  const menuItems: {
    id: ActiveMenu;
    label: string;
    subLabel: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'identitas',
      label: 'Identitas MPI',
      subLabel: 'Data Karya & Pendidik',
      icon: <UserCheck size={18} />,
      badge: 'Langkah 1',
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'materi',
      label: 'Penyusun Materi',
      subLabel: 'Modul Teori & Kuis Mini',
      icon: <BookOpen size={18} />,
      badge: `${totalMateri} Bab`,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'bermain',
      label: 'Penyusun Game',
      subLabel: 'Modul Gamifikasi Siswa',
      icon: <Gamepad2 size={18} />,
      badge: `${totalGames} Game`,
      badgeColor: 'bg-teal-100 text-teal-800'
    },
    {
      id: 'soal',
      label: 'Penyusun Bank Soal',
      subLabel: 'Asesmen HOTS & MCMA',
      icon: <HelpCircle size={18} />,
      badge: `${totalSoal} Soal`,
      badgeColor: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 'upload_excel',
      label: 'Upload Format Excel',
      subLabel: '12 Kolom Format Resmi',
      icon: <FileSpreadsheet size={18} />,
      badge: 'Excel / CSV',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'preview',
      label: 'Live Preview MPI',
      subLabel: 'Pratinjau Interaktif Siswa',
      icon: <Eye size={18} />,
      badge: 'Simulasi',
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'backup_json',
      label: 'Cadangan Portabel (Master Backup JSON)',
      subLabel: 'Untuk Pindah Perangkat',
      icon: <FileJson size={18} />,
      badge: 'JSON Sync',
      badgeColor: 'bg-indigo-100 text-indigo-800'
    }
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar (Hidden on small mobile screens < md) */}
      <aside
        className={`hidden md:flex bg-slate-900 text-slate-200 border-r border-slate-800 flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
            {!isCollapsed && (
              <SigmaLogo 
                size="sm" 
                showText={true} 
                showSubtitle={true}
                animated={true}
              />
            )}

            {isCollapsed && (
              <SigmaLogo 
                size="sm" 
                showText={false} 
                showSubtitle={false}
                animated={true}
              />
            )}

            <button
              title={isCollapsed ? 'Perluas Menu' : 'Ciutkan Menu'}
              onClick={() => {
                sound.playClick();
                onToggleCollapse();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Section Label */}
          {!isCollapsed && (
            <div className="px-5 pt-4 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Komponen Penyusun MPI
            </div>
          )}

          {/* Vertical Menu Navigation */}
          <nav className="px-3 py-2 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-menu-${item.id}`}
                  onClick={() => {
                    sound.playClick();
                    onSelectMenu(item.id);
                  }}
                  title={item.label}
                  className={`w-full text-left rounded-xl transition-all flex items-center gap-3 p-3 group relative cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className={`shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {item.icon}
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                      <div className="truncate">
                        <div className="text-xs font-extrabold truncate">
                          {item.label}
                        </div>
                        <div className={`text-[10px] truncate ${
                          isActive ? 'text-blue-100' : 'text-slate-400'
                        }`}>
                          {item.subLabel}
                        </div>
                      </div>

                      {item.badge && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : item.badgeColor
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Footer Section with Export Action */}
        <div className="p-3 border-t border-slate-800/80 space-y-3">
          {/* Export HTML Offline Button */}
          <button
            id="sidebar-export-html-btn"
            onClick={() => {
              sound.playSuccess();
              onOpenExportModal();
            }}
            title="Ekspor File HTML Offline"
            className="w-full py-3 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-sm transition flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Download size={16} className="group-hover:translate-y-0.5 transition" />
            {!isCollapsed && <span>Ekspor File HTML Offline</span>}
          </button>

          {/* Mini Identity summary when not collapsed */}
          {!isCollapsed && (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-[11px] space-y-0.5">
              <div className="text-[10px] font-extrabold uppercase text-slate-400">
                Karya MPI Aktif:
              </div>
              <div className="font-bold text-white truncate" title={config.judul}>
                {config.judul || 'Media Pembelajaran Interaktif'}
              </div>
              <div className="text-slate-300 truncate">
                {config.mataPelajaran} • {config.kelas}
              </div>
              <div className="text-[10px] text-blue-300 font-medium truncate">
                Oleh: {config.namaPengembang || config.penyusun}
              </div>
              <div className="pt-1 mt-1 border-t border-slate-700/60 flex items-center justify-between text-[9px] text-slate-400">
                <span className="font-bold text-cyan-300">MASTERMPI</span>
                <span className="text-amber-300 font-semibold">@ajisosiologi 2026</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar (Visible ONLY on small mobile screens < md) */}
      <nav 
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-slate-300 flex items-center justify-around px-1 py-1.5 shadow-2xl safe-area-bottom"
      >
        {menuItems.map((item) => {
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-${item.id}`}
              onClick={() => {
                sound.playClick();
                onSelectMenu(item.id);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all cursor-pointer relative ${
                isActive 
                  ? 'text-blue-400 font-black' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-blue-600/20 scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight leading-none mt-1 truncate max-w-[58px]">
                {item.id === 'identitas' ? 'Identitas' :
                 item.id === 'materi' ? 'Materi' :
                 item.id === 'bermain' ? 'Game' :
                 item.id === 'soal' ? 'Soal' :
                 item.id === 'upload_excel' ? 'Excel' :
                 item.id === 'preview' ? 'Preview' : 'JSON'}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
