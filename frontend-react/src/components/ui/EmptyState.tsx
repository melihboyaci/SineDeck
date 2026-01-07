import type { ReactNode } from "react";
import type { IconType } from "react-icons";

interface Props {
  icon: IconType;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  dashed?: boolean;
}

export default function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
  dashed = true,
}: Props) {
  return (
    <div
      className={`text-center py-12 rounded-xl ${
        dashed
          ? "bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600"
          : "bg-gray-50 dark:bg-gray-800"
      }`}
    >
      <Icon className="text-5xl text-gray-400 mx-auto mb-3" />
      <p className="text-gray-600 dark:text-gray-300 font-medium">{title}</p>
      {subtitle && (
        <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
          {subtitle}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
