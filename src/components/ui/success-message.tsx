import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  description?: string;
  isVisible: boolean;
  onClose?: () => void;
  position?: 'top-right' | 'top-center' | 'bottom-right';
  variant?: 'success' | 'warning' | 'info';
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  description,
  isVisible,
  onClose,
  position = 'top-right',
  variant = 'success'
}) => {
  if (!isVisible) return null;

  const positionClasses = {
    'top-right': 'top-6 right-6',
    'top-center': 'top-6 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-6 right-6'
  };

  const variantStyles = {
    success: {
      gradient: 'from-green-600 to-emerald-600',
      border: 'border-green-500/30',
      shadow: 'shadow-green-500/20',
      iconBg: 'bg-white/20',
      decoration1: 'bg-green-400/20',
      decoration2: 'bg-emerald-400/20',
      text: 'text-green-100'
    },
    warning: {
      gradient: 'from-yellow-600 to-orange-600',
      border: 'border-yellow-500/30',
      shadow: 'shadow-yellow-500/20',
      iconBg: 'bg-white/20',
      decoration1: 'bg-yellow-400/20',
      decoration2: 'bg-orange-400/20',
      text: 'text-yellow-100'
    },
    info: {
      gradient: 'from-blue-600 to-cyan-600',
      border: 'border-blue-500/30',
      shadow: 'shadow-blue-500/20',
      iconBg: 'bg-white/20',
      decoration1: 'bg-blue-400/20',
      decoration2: 'bg-cyan-400/20',
      text: 'text-blue-100'
    }
  };

  const style = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed ${positionClasses[position]} z-50`}
    >
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${style.gradient} border ${style.border} shadow-xl ${style.shadow} p-4 pr-12`}>
        {/* Background decoration */}
        <div className={`absolute top-0 right-0 w-16 h-16 ${style.decoration1} rounded-full blur-xl`}></div>
        <div className={`absolute bottom-0 left-0 w-12 h-12 ${style.decoration2} rounded-full blur-lg`}></div>

        {/* Content */}
        <div className="relative flex items-center gap-3">
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${style.iconBg} flex items-center justify-center`}>
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{message}</p>
            {description && <p className={`${style.text} text-xs`}>{description}</p>}
          </div>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-3 h-3 text-white" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
