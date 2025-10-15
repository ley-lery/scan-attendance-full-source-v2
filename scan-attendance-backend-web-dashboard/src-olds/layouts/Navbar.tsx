import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import ThemeSwitcher from "@/components/ui/theme/ThemeSwitch";
import SwitchTranslate from "@/components/ui/switch/SwitchTranslate";
import { Menu } from "lucide-react";
import { FaBell } from "react-icons/fa";
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
        <Popover classNames={{content: 'bg-white/30 dark:bg-black/50 backdrop-blur-sm shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50 border border-white dark:border-transparent'}}>
            <PopoverTrigger>
              <Button
                isIconOnly
                radius="full"
                variant="light"
                endContent={<FaBell size={16} />}
                className="text-zinc-600 hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-300"
              />
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col gap-2  p-4">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-600 dark:text-zinc-300 text-sm">No Older Notification</span>
                </div>
              </div>
            </PopoverContent>
        </Popover>
        <SwitchTranslate />
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default Layout1;
