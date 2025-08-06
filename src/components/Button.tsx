import type { ReactNode } from "react";

interface ButtonProps {
	variant: "navigation" | "viewToggle" | "primary" | "secondary";
	active?: boolean;
	onClick: () => void;
	children: ReactNode;
	className?: string;
	disabled?: boolean;
}

export default function Button({
	variant,
	active = false,
	onClick,
	children,
	className = "",
	disabled = false,
}: ButtonProps) {
	const baseStyles =
		"font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

	const variantStyles = {
		navigation:
			"p-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 focus:ring-blue-500",
		viewToggle: `px-3 py-2 rounded-lg text-sm ${
			active
				? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:from-blue-600 hover:to-blue-700"
				: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm"
		} focus:ring-blue-500`,
		primary: `px-4 py-2 rounded-lg text-sm shadow-sm border ${
			active
				? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-600"
				: "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300"
		} focus:ring-blue-500`,
		secondary:
			"px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-sm border border-green-600 focus:ring-green-500",
	};

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`${baseStyles} ${variantStyles[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
		>
			{children}
		</button>
	);
}
