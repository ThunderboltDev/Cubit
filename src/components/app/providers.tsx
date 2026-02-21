"use client";

import { type PropsWithChildren, useEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ScrambleProvider } from "@/contexts/scramble";
import { useSettingsStore } from "@/stores/settings";

export function Providers({ children }: PropsWithChildren) {
	const theme = useSettingsStore((store) => store.theme);
	const setTheme = useSettingsStore((store) => store.setTheme);

	const applyTheme = (newTheme: typeof theme) => {
		const root = document.documentElement;
		root.classList.remove("light", "dark");

		if (newTheme === "system") {
			const prefersDark = window.matchMedia(
				"(prefers-color-scheme: dark)"
			).matches;
			root.classList.add(prefersDark ? "dark" : "light");
		} else {
			root.classList.add(newTheme);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: initial theme load
	useEffect(() => {
		applyTheme(theme);

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			if (useSettingsStore.getState().theme === "system") {
				applyTheme("system");
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme]);

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	useHotkeys("l", toggleTheme, { preventDefault: true });

	return <ScrambleProvider>{children}</ScrambleProvider>;
}
