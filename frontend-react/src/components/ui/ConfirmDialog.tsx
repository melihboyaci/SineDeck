import { HiExclamation } from "react-icons/hi";
import Button from "./Button";

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Sil",
  cancelText = "İptal",
  onConfirm,
  onCancel,
  variant = "danger",
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm p-6 shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              variant === "danger"
                ? "bg-red-100 dark:bg-red-900/30"
                : "bg-yellow-100 dark:bg-yellow-900/30"
            }`}
          >
            <HiExclamation
              className={`text-2xl ${
                variant === "danger" ? "text-red-600" : "text-yellow-600"
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            fullWidth
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
