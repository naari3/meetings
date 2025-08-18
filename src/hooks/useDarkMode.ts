import { useEffect, useState } from "react";

export function useDarkMode() {
	const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
		if (typeof window === "undefined") return false;

		const saved = localStorage.getItem("darkMode");
		if (saved !== null) {
			return JSON.parse(saved);
		}

		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	useEffect(() => {
		const root = window.document.documentElement;

		if (isDarkMode) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}

		localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		setIsDarkMode((prev) => !prev);
	};

	return { isDarkMode, toggleDarkMode };
}
