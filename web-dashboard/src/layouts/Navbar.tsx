import { Button } from "@heroui/react";
import ThemeSwitcher from "@/components/ui/theme/ThemeSwitch";
import SwitchTranslate from "@/components/ui/switch/SwitchTranslate";
import { LayoutDashboard, Menu } from "lucide-react";
const Layout1 = ({ toggle }: { toggle: () => void }) => {

  const handleToggle = () => toggle();

  return (
    <div className="flex h-full items-center justify-between pr-4 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <Button
          onPress={handleToggle}
          isIconOnly
          endContent={<Menu size={18} />}
          radius="full"
          variant="light"
          className="text-zinc-500 hover:text-zinc-600"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button
          isIconOnly
          radius="full"
          variant="light"
          endContent={<LayoutDashboard size={16} />}
          className="text-black hover:text-black dark:text-white dark:hover:text-white"
        />
        <SwitchTranslate />
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Layout1;
