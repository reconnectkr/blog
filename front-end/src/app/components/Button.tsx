interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "danger";
}

export const Button: React.FC<ButtonProps> = ({
  className,
  variant = "default",
  ...props
}) => {
  const baseStyle =
    "px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500";
  const variantStyles = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
};
