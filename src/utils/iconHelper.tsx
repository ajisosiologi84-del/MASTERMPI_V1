import React from 'react';
import {
  Puzzle,
  Target,
  ListOrdered,
  Gem,
  Zap,
  HeartHandshake,
  ShieldCheck,
  Milestone,
  Sparkles,
  Workflow,
  MousePointerClick,
  GitCompare,
  Layers,
  Gamepad2,
  BookOpen,
  Users,
  TrendingUp,
  ShieldAlert,
  Award,
  Lightbulb,
  Compass,
  Globe2,
  Activity,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { GameItem, GameType, MateriItem } from '../types';

export interface IconBadgeConfig {
  icon: React.ReactNode;
  colorName: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  label: string;
}

/**
 * Returns a colorful icon and color scheme for a game by index or type
 */
export function getGameIconBadge(game: GameItem, index: number, size = 18): IconBadgeConfig {
  const gameNumber = index + 1;

  // Specific thematic mapping for standard 10 games
  switch (gameNumber) {
    case 1:
      return {
        icon: <Puzzle size={size} />,
        colorName: 'indigo',
        bgClass: 'bg-indigo-50 text-indigo-700',
        textClass: 'text-indigo-600',
        borderClass: 'border-indigo-200',
        label: 'Tebak Pasangan'
      };
    case 2:
      return {
        icon: <Target size={size} />,
        colorName: 'teal',
        bgClass: 'bg-teal-50 text-teal-700',
        textClass: 'text-teal-600',
        borderClass: 'border-teal-200',
        label: 'Tantangan Kilat'
      };
    case 3:
      return {
        icon: <ListOrdered size={size} />,
        colorName: 'amber',
        bgClass: 'bg-amber-50 text-amber-700',
        textClass: 'text-amber-600',
        borderClass: 'border-amber-200',
        label: 'Susun Runtut'
      };
    case 4:
      return {
        icon: <Gem size={size} />,
        colorName: 'emerald',
        bgClass: 'bg-emerald-50 text-emerald-700',
        textClass: 'text-emerald-600',
        borderClass: 'border-emerald-200',
        label: 'Koleksi Karakter'
      };
    case 5:
      return {
        icon: <Zap size={size} />,
        colorName: 'rose',
        bgClass: 'bg-rose-50 text-rose-700',
        textClass: 'text-rose-600',
        borderClass: 'border-rose-200',
        label: 'Rantai Logika'
      };
    case 6:
      return {
        icon: <GitCompare size={size} />,
        colorName: 'blue',
        bgClass: 'bg-blue-50 text-blue-700',
        textClass: 'text-blue-600',
        borderClass: 'border-blue-200',
        label: 'Pasang Konsep'
      };
    case 7:
      return {
        icon: <ShieldCheck size={size} />,
        colorName: 'cyan',
        bgClass: 'bg-cyan-50 text-cyan-700',
        textClass: 'text-cyan-600',
        borderClass: 'border-cyan-200',
        label: 'Cepat Tanggap'
      };
    case 8:
      return {
        icon: <Milestone size={size} />,
        colorName: 'violet',
        bgClass: 'bg-violet-50 text-violet-700',
        textClass: 'text-violet-600',
        borderClass: 'border-violet-200',
        label: 'Spektrum Relasi'
      };
    case 9:
      return {
        icon: <Sparkles size={size} />,
        colorName: 'orange',
        bgClass: 'bg-orange-50 text-orange-700',
        textClass: 'text-orange-600',
        borderClass: 'border-orange-200',
        label: 'Koleksi Teori'
      };
    case 10:
      return {
        icon: <Workflow size={size} />,
        colorName: 'fuchsia',
        bgClass: 'bg-fuchsia-50 text-fuchsia-700',
        textClass: 'text-fuchsia-600',
        borderClass: 'border-fuchsia-200',
        label: 'Alur Damai'
      };
    default:
      // Fallback by game type
      if (game.tipe === 'jodoh') {
        return {
          icon: <Puzzle size={size} />,
          colorName: 'indigo',
          bgClass: 'bg-indigo-50 text-indigo-700',
          textClass: 'text-indigo-600',
          borderClass: 'border-indigo-200',
          label: 'Menjodohkan'
        };
      } else if (game.tipe === 'klik') {
        return {
          icon: <MousePointerClick size={size} />,
          colorName: 'teal',
          bgClass: 'bg-teal-50 text-teal-700',
          textClass: 'text-teal-600',
          borderClass: 'border-teal-200',
          label: 'Klik Kategori'
        };
      } else if (game.tipe === 'urut') {
        return {
          icon: <ListOrdered size={size} />,
          colorName: 'amber',
          bgClass: 'bg-amber-50 text-amber-700',
          textClass: 'text-amber-600',
          borderClass: 'border-amber-200',
          label: 'Susun Urutan'
        };
      } else if (game.tipe === 'kumpul') {
        return {
          icon: <Gem size={size} />,
          colorName: 'emerald',
          bgClass: 'bg-emerald-50 text-emerald-700',
          textClass: 'text-emerald-600',
          borderClass: 'border-emerald-200',
          label: 'Kumpul Kata'
        };
      } else {
        return {
          icon: <Zap size={size} />,
          colorName: 'rose',
          bgClass: 'bg-rose-50 text-rose-700',
          textClass: 'text-rose-600',
          borderClass: 'border-rose-200',
          label: 'Sambung Logika'
        };
      }
  }
}

/**
 * Returns a rich thematic icon and badge styling for Sub-Materi chapters (Bab 1 to 5)
 */
export function getMateriIconBadge(item: MateriItem, index: number, size = 18): IconBadgeConfig {
  const babNumber = index + 1;
  const iconStr = (item.ikon || '').toLowerCase();

  // Check explicit icon or fallback to Bab number
  if (iconStr === 'bookopen' || iconStr === 'buku' || babNumber === 1) {
    return {
      icon: <BookOpen size={size} />,
      colorName: 'blue',
      bgClass: 'bg-blue-50 text-blue-700',
      textClass: 'text-blue-600',
      borderClass: 'border-blue-200',
      label: 'Bab 1 • Fondasi'
    };
  }

  if (iconStr === 'layers' || iconStr === 'users' || babNumber === 2) {
    return {
      icon: <Layers size={size} />,
      colorName: 'indigo',
      bgClass: 'bg-indigo-50 text-indigo-700',
      textClass: 'text-indigo-600',
      borderClass: 'border-indigo-200',
      label: 'Bab 2 • Tipologi'
    };
  }

  if (iconStr === 'activity' || iconStr === 'trendingup' || babNumber === 3) {
    return {
      icon: <TrendingUp size={size} />,
      colorName: 'emerald',
      bgClass: 'bg-emerald-50 text-emerald-700',
      textClass: 'text-emerald-600',
      borderClass: 'border-emerald-200',
      label: 'Bab 3 • Dinamika'
    };
  }

  if (iconStr === 'alerttriangle' || iconStr === 'shieldalert' || babNumber === 4) {
    return {
      icon: <ShieldAlert size={size} />,
      colorName: 'amber',
      bgClass: 'bg-amber-50 text-amber-700',
      textClass: 'text-amber-600',
      borderClass: 'border-amber-200',
      label: 'Bab 4 • Isu & Kasus'
    };
  }

  if (iconStr === 'hearthandshake' || iconStr === 'award' || iconStr === 'globe' || babNumber === 5) {
    return {
      icon: <HeartHandshake size={size} />,
      colorName: 'rose',
      bgClass: 'bg-rose-50 text-rose-700',
      textClass: 'text-rose-600',
      borderClass: 'border-rose-200',
      label: 'Bab 5 • Solusi & Harmoni'
    };
  }

  // Generic fallback for Bab > 5
  return {
    icon: <Sparkles size={size} />,
    colorName: 'purple',
    bgClass: 'bg-purple-50 text-purple-700',
    textClass: 'text-purple-600',
    borderClass: 'border-purple-200',
    label: `Bab ${babNumber}`
  };
}

export const AVAILABLE_MATERI_ICONS = [
  { id: 'BookOpen', label: 'Buku & Fondasi Teori', icon: <BookOpen size={16} /> },
  { id: 'Layers', label: 'Lapisan & Ragam Tipologi', icon: <Layers size={16} /> },
  { id: 'Users', label: 'Kelompok & Masyarakat', icon: <Users size={16} /> },
  { id: 'TrendingUp', label: 'Dinamika & Perkembangan', icon: <TrendingUp size={16} /> },
  { id: 'ShieldAlert', label: 'Isu Masalah & Konflik', icon: <ShieldAlert size={16} /> },
  { id: 'HeartHandshake', label: 'Integrasi & Harmoni Sosial', icon: <HeartHandshake size={16} /> },
  { id: 'Lightbulb', label: 'Gagasan & Inovasi Sosial', icon: <Lightbulb size={16} /> },
  { id: 'Compass', label: 'Arah Kebijakan & Pedoman', icon: <Compass size={16} /> },
  { id: 'Award', label: 'Pencapaian & Evaluasi', icon: <Award size={16} /> },
  { id: 'Globe2', label: 'Masyarakat Global & Digital', icon: <Globe2 size={16} /> }
];
