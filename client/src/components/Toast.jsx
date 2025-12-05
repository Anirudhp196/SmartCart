const toastColors = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-rose-500 text-white',
  info: 'bg-slate-800 text-white',
};

const Toast = ({ message, type = 'info', onClose }) => (
  <div className={`pointer-events-auto rounded-md px-4 py-3 shadow-lg transition ${toastColors[type] || toastColors.info}`}>
    <div className="flex items-start gap-3">
      <div className="text-sm font-medium leading-5">{message}</div>
      <button
        type="button"
        onClick={onClose}
        className="text-sm font-semibold opacity-80 hover:opacity-100"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  </div>
);

export default Toast;

