'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

// ─────────────────────────────────────────
// Toast Item Type
// ─────────────────────────────────────────

export interface ToastMessage {
  id: string;
  productName: string;
}

// ─────────────────────────────────────────
// Minimal event bus for toast — avoids
// prop-drilling through the whole tree.
// Replace with zustand slice if preferred.
// ─────────────────────────────────────────

type Listener = (msg: ToastMessage) => void;
const listeners: Set<Listener> = new Set();

export function fireCartToast(productName: string) {
  const msg: ToastMessage = {
    id: `${Date.now()}-${Math.random()}`,
    productName,
  };
  listeners.forEach((fn) => fn(msg));
}

// ─────────────────────────────────────────
// CartToast — premium confirmation popup
// ─────────────────────────────────────────

export default function CartToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const add = useCallback((msg: ToastMessage) => {
    setToasts((prev) => [...prev, msg]);
    // Auto-dismiss after 2.8 s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== msg.id));
    }, 2800);
  }, []);

  useEffect(() => {
    listeners.add(add);
    return () => { listeners.delete(add); };
  }, [add]);

  return (
    // Fixed bottom-right toast stack
    <div
      aria-live="polite"
      aria-label="Cart notifications"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto"
          >
            <div
              className="
                flex items-center gap-4
                bg-[#1e1812] border border-[#B8956A]/30
                px-5 py-4 min-w-[260px] max-w-[320px]
                shadow-[0_8px_40px_rgba(0,0,0,0.6)]
              "
            >
              {/* Check icon */}
              <div className="w-7 h-7 flex items-center justify-center bg-[#B8956A]/15 border border-[#B8956A]/30 shrink-0">
                <Check size={12} strokeWidth={2.5} className="text-[#B8956A]" />
              </div>

              {/* Text */}
              <div>
                <p
                  className="text-[#EDE3D0] text-[11px] font-medium mb-0.5"
                  style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
                >
                  Added to Cart
                </p>
                <p
                  className="text-[#EDE3D0]/45 text-[10px] tracking-[0.05em]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {toast.productName}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
