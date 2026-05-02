import toast from 'react-hot-toast';

// Shortcut helpers — use these anywhere in the app
export const showSuccess = (msg) => toast.success(msg);
export const showError   = (msg) => toast.error(msg);
export const showInfo    = (msg) => toast(msg, { icon: 'ℹ️' });
export const showWarning = (msg) => toast(msg, { icon: '⚠️' });
export const showLoading = (msg) => toast.loading(msg);
export const dismissToast = (id) => toast.dismiss(id);

export default toast;