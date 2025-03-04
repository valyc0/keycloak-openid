import { useToast } from '../components/Toast/ToastContext';

let toastInstance = null;

export const setToastInstance = (instance) => {
  toastInstance = instance;
};

export const useGlobalToast = () => {
  const toast = useToast();
  if (!toastInstance) {
    setToastInstance(toast);
  }
  return toast;
};

export const showGlobalToast = (message, type) => {
  if (toastInstance) {
    toastInstance.showToast(message, type);
  }
};