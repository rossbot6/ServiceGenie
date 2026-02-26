import { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false); // Always start in light mode

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
      console.log('🎨 Applying dark theme');
    } else {
      root.classList.remove('dark');
      console.log('🌞 Applying light theme');
    }
  }, [isDark]);

  const toggle = () => {
    const newState = !isDark;
    setIsDark(newState);
    localStorage.setItem('servicegenie-theme', newState ? 'dark' : 'light');
  };

  const value = {
    isDark,
    toggle,
    setIsDark
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}