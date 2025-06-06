import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

export const toast = {
  success: ({ title, description, action }: ToastProps) => {
    return sonnerToast.success(title ?? description, {
      description: title ? description : undefined,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },
  error: ({ title, description, action }: ToastProps) => {
    return sonnerToast.error(title ?? description, {
      description: title ? description : undefined,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },
  info: ({ title, description, action }: ToastProps) => {
    return sonnerToast(title ?? description, {
      description: title ? description : undefined,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },
  warning: ({ title, description, action }: ToastProps) => {
    return sonnerToast.warning(title ?? description, {
      description: title ? description : undefined,
      action: action
        ? {
            label: action.label,
            onClick: action.onClick,
          }
        : undefined,
    });
  },
  promise: async <T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};
