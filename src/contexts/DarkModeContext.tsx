
import * as React from 'react';

type DarkModeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = React.createContext<DarkModeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Check for saved preference or system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(savedDarkMode === 'true');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  React.useEffect(() => {
    // Apply dark mode to the document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      // Additional classes for better text contrast in dark mode
      document.documentElement.classList.add('dark-enhanced');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('dark-enhanced');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => React.useContext(DarkModeContext);
