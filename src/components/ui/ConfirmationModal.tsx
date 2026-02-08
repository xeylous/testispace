"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info' | 'success' | 'warning';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm: handleConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'info'
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const onDismiss = (e: React.MouseEvent) => {
    // Check if clicked outside
    if (e.target === e.currentTarget) {
        onClose();
    }
  };


  const getIcon = () => {
    switch (type) {
      case 'danger': return <AlertCircle size={32} className="text-red-500" />;
      case 'success': return <CheckCircle size={32} className="text-green-500" />;
      case 'warning': return <AlertCircle size={32} className="text-yellow-500" />;
      default: return <Info size={32} className="text-blue-500" />;
    }
  };

  const getConfirmStyle = () => {
    switch (type) {
      case 'danger': return "bg-red-500 hover:bg-red-600 shadow-red-500/20";
      case 'success': return "bg-green-500 hover:bg-green-600 shadow-green-500/20";
      case 'warning': return "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20";
      default: return "bg-primary hover:bg-primary/90 shadow-primary/20";
    }
  };

  return (
    <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onDismiss}
    >
      <div 
        ref={modalRef}
        className="relative bg-background border border-border w-full max-w-md p-6 rounded-2xl shadow-2xl scale-100 opacity-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={20} />
        </button>

        <div className={`mb-4 p-4 rounded-full bg-secondary/50`}>
          {getIcon()}
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed px-4">
          {message}
        </p>

        <div className="flex gap-3 w-full">
          {cancelText && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-secondary transition-colors text-foreground font-medium text-sm"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
                handleConfirm();
                onClose(); // Ensure modal closes and scroll is restored
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all shadow-lg text-sm ${getConfirmStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
