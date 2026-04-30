import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  showClose = true,
  actions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={showClose ? onClose : undefined}
      />
      <div className="relative bg-surface border border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-lg font-semibold font-heading">{title}</h3>
          {showClose && (
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="p-5">{children}</div>
        {actions && (
          <div className="flex gap-3 p-5 border-t border-border bg-surface2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
