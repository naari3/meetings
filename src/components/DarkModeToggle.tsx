import { useState, useRef, useEffect } from "react";
import { useDarkMode, type Theme } from "../hooks/useDarkMode";

export default function DarkModeToggle() {
	const { theme, setTheme } = useDarkMode();
	const [isOpen, setIsOpen] = useState(false);
	const popoverRef = useRef<HTMLDivElement>(null);

	const getThemeIcon = (currentTheme: Theme) => {
		if (currentTheme === "light") {
			return (
				<svg
					className="w-5 h-5 text-yellow-500"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fillRule="evenodd"
						d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
						clipRule="evenodd"
					/>
				</svg>
			);
		} else if (currentTheme === "dark") {
			return (
				<svg
					className="w-5 h-5 text-gray-600 dark:text-gray-300"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
				</svg>
			);
		} else {
			// system
			return (
				<svg
					className="w-5 h-5 text-blue-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			);
		}
	};

	const themeOptions = [
		{
			key: "light" as Theme,
			label: "ライト",
			icon: (
				<svg
					className="w-4 h-4 text-yellow-500"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fillRule="evenodd"
						d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
						clipRule="evenodd"
					/>
				</svg>
			),
		},
		{
			key: "dark" as Theme,
			label: "ダーク",
			icon: (
				<svg
					className="w-4 h-4 text-gray-600 dark:text-gray-300"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
				</svg>
			),
		},
		{
			key: "system" as Theme,
			label: "システム",
			icon: (
				<svg
					className="w-4 h-4 text-blue-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			),
		},
	];

	const handleSelectTheme = (selectedTheme: Theme) => {
		setTheme(selectedTheme);
		setIsOpen(false);
	};

	// クリック外で閉じる
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className="relative" ref={popoverRef}>
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
				aria-label="テーマを選択"
				title={`現在: ${theme === 'light' ? 'ライト' : theme === 'dark' ? 'ダーク' : 'システム'}モード`}
			>
				{getThemeIcon(theme)}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50">
					<div className="py-1">
						{themeOptions.map((option) => (
							<button
								key={option.key}
								type="button"
								onClick={() => handleSelectTheme(option.key)}
								className={`w-full px-3 py-2 text-left flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
									theme === option.key
										? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
										: "text-gray-700 dark:text-gray-300"
								}`}
							>
								{option.icon}
								<span className="text-sm font-medium">{option.label}</span>
								{theme === option.key && (
									<svg
										className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-300"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fillRule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								)}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
