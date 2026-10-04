"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const hydrated = useRef(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    const initialTheme: Theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    const timer = window.setTimeout(() => {
      setTheme(initialTheme);
      hydrated.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    if (hydrated.current) window.localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
