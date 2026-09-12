import React from 'react';
import { AlertTriangle, Trash2, X, Check, Info } from 'lucide-react';
import { sound } from '../utils/audio';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  mode?: 'confirm' | 'alert';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Hapus',
  cancelLabel = 'Batal',
  isDanger = true,
  mode = 'confirm',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 transform animate-scale-tap"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-3.5 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isDanger ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
          }`}>
            {isDanger ? <Trash2 size={22} /> : <AlertTriangle size={22} />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-black text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onCancel();
            }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          {mode === 'confirm' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onCancel();
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm transition"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onConfirm();
                }}
                className={`px-4 py-2 rounded-xl text-white font-black text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 ${
                  isDanger 
                    ? 'bg-rose-600 hover:bg-rose-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isDanger && <Trash2 size={15} />}
                <span>{confirmLabel}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onCancel();
              }}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition shadow-xs"
            >
              Mengerti
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
