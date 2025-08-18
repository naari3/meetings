import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export function useDarkMode() {
	const [theme, setTheme] = useState<Theme>(() => {
		if (typeof window === "undefined") return "system";

		const saved = localStorage.getItem("theme");
		if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
			return saved as Theme;
		}

		return "system";
	});

	const getEffectiveTheme = (currentTheme: Theme): boolean => {
		if (currentTheme === "system") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches;
		}
		return currentTheme === "dark";
	};

	const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
		if (typeof window === "undefined") return false;
		return getEffectiveTheme(theme);
	});

	useEffect(() => {
		const root = window.document.documentElement;

		const effectiveIsDark = getEffectiveTheme(theme);
		setIsDarkMode(effectiveIsDark);

		if (effectiveIsDark) {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}

		localStorage.setItem("theme", theme);
	}, [theme]);

	useEffect(() => {
		if (theme !== "system") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			const effectiveIsDark = getEffectiveTheme(theme);
			setIsDarkMode(effectiveIsDark);

			const root = window.document.documentElement;
			if (effectiveIsDark) {
				root.classList.add("dark");
			} else {
				root.classList.remove("dark");
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	const toggleTheme = () => {
		setTheme((prev) => {
			if (prev === "light") return "dark";
			if (prev === "dark") return "system";
			return "light";
		});
	};

	const setThemeMode = (newTheme: Theme) => {
		setTheme(newTheme);
	};

	return { 
		theme, 
		isDarkMode, 
		toggleTheme, 
		setTheme: setThemeMode 
	};
}
