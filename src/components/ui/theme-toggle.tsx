
import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  return (
    <Button
      variant="outline"
      size="sm"
      disabled
      className="relative w-fit h-9 transition-colors hover:bg-muted opacity-50 cursor-not-allowed"
    >
      <Sun className="h-4 w-4" />
      <span className="ml-2 text-sm">
        Light
      </span>
    </Button>
  );
}
