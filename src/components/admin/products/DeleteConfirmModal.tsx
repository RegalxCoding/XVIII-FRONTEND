'use client';

import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  productName,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl p-7 relative"
        style={{
          background: '#1a1410',
          border: '1px solid rgba(248,113,113,0.25)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
          animation: 'scaleIn 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
          style={{ color: 'rgba(237,227,208,0.4)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#EDE3D0'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.4)'; }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171' }}
        >
          <AlertTriangle size={22} strokeWidth={1.8} />
        </div>

        {/* Content */}
        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: '#EDE3D0', fontFamily: 'Georgia, serif' }}
        >
          Delete Product?
        </h2>
        <p
          className="text-sm mb-1"
          style={{ color: 'rgba(237,227,208,0.6)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          You are about to delete{' '}
          <span style={{ color: '#EDE3D0', fontWeight: 600 }}>&ldquo;{productName}&rdquo;</span>.
        </p>
        <p
          className="text-sm mb-7"
          style={{ color: 'rgba(237,227,208,0.4)', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
        >
          This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            id="delete-modal-cancel"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: 'rgba(237,227,208,0.06)',
              border: '1px solid rgba(237,227,208,0.12)',
              color: 'rgba(237,227,208,0.7)',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(237,227,208,0.1)';
              (e.currentTarget as HTMLElement).style.color = '#EDE3D0';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(237,227,208,0.06)';
              (e.currentTarget as HTMLElement).style.color = 'rgba(237,227,208,0.7)';
            }}
          >
            Cancel
          </button>
          <button
            id="delete-modal-confirm"
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: 'rgba(248,113,113,0.15)',
              border: '1px solid rgba(248,113,113,0.35)',
              color: '#f87171',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#ef4444';
              (e.currentTarget as HTMLElement).style.color = '#fff';
              (e.currentTarget as HTMLElement).style.borderColor = '#ef4444';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.15)';
              (e.currentTarget as HTMLElement).style.color = '#f87171';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,113,113,0.35)';
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scaleIn {
          from { transform: scale(0.94); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
