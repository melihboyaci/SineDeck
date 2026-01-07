import { FormHTMLAttributes, ReactNode } from "react";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
}

export default function FormCard({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <form
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-5 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}
