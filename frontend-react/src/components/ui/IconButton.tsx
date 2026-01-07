import type { ButtonHTMLAttributes } from "react";
import type { IconType } from "react-icons";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconType;
  variant?: "primary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function IconButton({
  icon: Icon,
  variant = "ghost",
  size = "md",
  label,
  className = "",
  ...props
}: Props) {
  const variantStyles = {
    primary:
      "text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20",
    danger:
      "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20",
    ghost:
      "text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700",
  };

  const sizeStyles = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-3",
  };

  const iconSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <button
      className={`rounded-lg transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      title={label}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
}
