
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/contexts/DarkModeContext";

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleDarkMode}
      className="relative w-fit h-9 transition-colors hover:bg-muted"
    >
      <Sun className={`h-4 w-4 transition-transform ${isDarkMode ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
      <Moon className={`absolute h-4 w-4 transition-transform ${isDarkMode ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
      <span className="ml-2 text-sm">
        {isDarkMode ? "Dark" : "Light"}
      </span>
    </Button>
  );
}
