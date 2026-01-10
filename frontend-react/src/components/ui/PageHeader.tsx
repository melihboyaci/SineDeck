import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";
import type { IconType } from "react-icons";
interface Props {
  title: string;
  subtitle?: string;
  icon?: IconType;
  iconColor?: string;
  iconBgColor?: string;
  backUrl?: string;
  action?: ReactNode;
}
export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-purple-600",
  iconBgColor = "bg-purple-100 dark:bg-purple-900/30",
  backUrl,
  action,
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="mb-6">
      {backUrl && (
        <button
          onClick={() => navigate(backUrl)}
          className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-4"
        >
          <HiArrowLeft /> Geri Dön
        </button>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}
            >
              <Icon className={`text-xl ${iconColor}`} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              {title}
            </h1>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}