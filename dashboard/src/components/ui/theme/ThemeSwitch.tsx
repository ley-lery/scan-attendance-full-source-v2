import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // On mount, read the current theme from <html> or localStorage
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center">
      <Button
        variant="light"
        radius="full"
        isIconOnly
        onPress={toggleTheme}
        className="hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-zinc-500" />
        ) : (
          <Sun className="h-5 w-5 text-zinc-300" />
        )}
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
