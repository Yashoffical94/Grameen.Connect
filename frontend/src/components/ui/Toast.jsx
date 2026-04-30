import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ toasts, removeToast }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: 'bg-primary',
    error: 'bg-danger',
    info: 'bg-blue',
    warning: 'bg-accent',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 ${colors[toast.type]} text-background px-4 py-3 rounded-lg shadow-lg min-w-[300px] animate-slide-up`}
          >
            <Icon size={20} className="flex-shrink-0" />
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:bg-black/20 rounded p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
