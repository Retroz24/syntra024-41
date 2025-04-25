
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { Toggle } from "@/components/ui/toggle";

export function ModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Toggle 
      aria-label="Toggle dark mode" 
      pressed={isDarkMode}
      onPressedChange={toggleDarkMode}
      className="border-0"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle dark mode</span>
    </Toggle>
  );
}
