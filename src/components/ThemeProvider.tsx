"use client";

import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext<{
  theme: "dark";
}>({
  theme: "dark",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
