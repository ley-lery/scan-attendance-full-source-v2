/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useMemo, useCallback, memo, useTransition } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Profile from "@/assets/profile/profile.png";
import {
  Avatar,
  Button,
  Tooltip,
  ScrollShadow,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
} from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { AiOutlineMinusCircle, AiOutlineUser } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineArrowLeft } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouteCache } from "@/hooks/useCacheRoute"; // Import the cache hook
import ConfirmDialog from "@/components/ui/dialog/ConfirmDialog";
import { decodeToken } from "@/utils/jwt";
import { LuLogOut } from "react-icons/lu";
import { getRoleMenus } from "./index";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import AccountSwitcher from "@/components/ui/switch/AccountSwitcher";
import { PiUserCirclePlusLight, PiWarningCircleFill } from "react-icons/pi";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/hero-ui";
import { useDisclosure } from "@/god-ui";

// Loading overlay component - only shows for new routes
const LoadingOverlay = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/40"
  >
    <Spinner size="sm" color="primary" variant="gradient"  />
  </motion.div>
));

LoadingOverlay.displayName = "LoadingOverlay";

// Memoized submenu item component
const SubMenuItem = memo(({ 
  subItem, 
  isActive, 
  menuGroupTitle, 
  onSubMenuClick,
  t,
  isPending
}: any) => (
  <div className="relative">
    <span
      className={cn(
        "absolute -left-[1.3rem] top-[.8rem] h-2 w-2 rounded-full",
        isActive ? "bg-black dark:bg-white" : "bg-zinc-500 dark:bg-zinc-300"
      )}
    />
    <Link
      to={subItem.to}
      onClick={(e) => {
        e.preventDefault();
        onSubMenuClick(menuGroupTitle, subItem.to);
      }}
      className={cn(
        "relative flex cursor-pointer items-center justify-between gap-2 rounded-[11px] px-4 py-1 text-sm transition-colors duration-300",
        isActive
          ? "bg-zinc-900/10 text-black dark:bg-white/10 dark:text-zinc-200"
          : "text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/10",
        isPending && "pointer-events-none opacity-50"
      )}
    >
      {isActive && (
        <MdOutlineArrowLeft className="absolute -left-0 -top-0.5 flex -translate-x-5 text-4xl text-zinc-200 dark:text-white/10" />
      )}
      <div className="flex items-center gap-2 *:text-zinc-500 *:dark:text-zinc-400">
        <span className="text-lg">
          <subItem.icon size={16} />
        </span>
        <h3 className="text-sm flex items-center gap-2">
          {t(subItem.title)}
          {subItem.status !== 'Ready' && (
            <Tooltip 
              content={subItem.statusMsg || 'Not Ready'} 
              color="danger" 
              showArrow 
              placement="right" 
              closeDelay={0} 
              delay={0}
              classNames={{ base: "pointer-events-none" }}
            >
              <span className="text-[11px] text-danger rounded-full z-10">
                <PiWarningCircleFill size={12} />
              </span>
            </Tooltip>
          )}
        </h3>
      </div>
      {/* {isPending && <Spinner size="sm" className="ml-auto" />} */}
    </Link>
  </div>
));

SubMenuItem.displayName = "SubMenuItem";

// Memoized menu group component
const MenuGroup = memo(({ 
  menuGroup, 
  isActive, 
  isOpen, 
  toggle, 
  currentPath,
  onMenuClick,
  onSubMenuClick,
  t,
  isPending
}: any) => {
  const hasSubmenu = menuGroup.items.length > 0;

  return (
    <li className="mb-0.5 relative">
      <div
        onClick={() => onMenuClick(menuGroup.title, hasSubmenu, menuGroup.to)}
        className={cn(
          "flex cursor-pointer items-center justify-between rounded-[12px] py-1 duration-300",
          !toggle ? "px-3" : "px-[.55rem]",
          isActive
            ? "bg-black/10 text-zinc-900 dark:bg-white/10 dark:text-zinc-200"
            : "text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-700",
          isPending && "pointer-events-none opacity-50"
        )}
      >
        <div className="flex items-center gap-x-2 whitespace-nowrap">
          <span className={cn(
            "text-lg flex",
            isActive ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-600 dark:text-zinc-400"
          )}>
            <menuGroup.icon size={16} />
          </span>
          {!toggle && (
            <h2 className={cn(
              "mt-1 text-sm flex items-center gap-2",
              isActive ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-600 dark:text-zinc-400"
            )}>
              {t(menuGroup.title)}
              {menuGroup.status !== 'Ready' && (
                <Tooltip 
                  content={menuGroup.statusMsg || 'Not Ready'} 
                  color="danger" 
                  showArrow 
                  placement="right" 
                  closeDelay={0} 
                  delay={0}
                  classNames={{ base: "pointer-events-none" }}
                >
                  <span className="text-[11px] text-danger rounded-full z-10">
                    <PiWarningCircleFill size={12} />
                  </span>
                </Tooltip>
              )}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* {isPending && <Spinner size="sm" />} */}
          {hasSubmenu && !toggle && (
            <span className="text-zinc-500">
              {isOpen ? <AiOutlineMinusCircle size={20} /> : <IoIosAddCircleOutline size={20} />}
            </span>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && hasSubmenu && (
          <motion.ul
            className="relative my-1 ml-3 space-y-1 border-l-2 border-zinc-400/30 pl-4 dark:border-zinc-600/30"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {menuGroup.items.map((subItem: any) => (
              <SubMenuItem
                key={subItem.to}
                subItem={subItem}
                isActive={currentPath === subItem.to}
                menuGroupTitle={menuGroup.title}
                onSubMenuClick={onSubMenuClick}
                t={t}
                isPending={isPending}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
});

MenuGroup.displayName = "MenuGroup";

// Memoized profile popover
const ProfilePopover = memo(({ toggle, activeAccount, onLogoutOpen, t }: any) => (
  toggle ? (
    <Tooltip content="Profile" placement="right" radius="sm" color="foreground" closeDelay={0}>
      <Popover
        placement="right-start"
        showArrow={true}
        classNames={{
          content: "border border-white dark:border-transparent bg-zinc-100 outline-none dark:bg-zinc-800",
        }}
      >
        <PopoverTrigger>
          <Avatar isBordered color="default" src={Profile} className="min-w-10 cursor-pointer" />
        </PopoverTrigger>
        <PopoverContent>
          <div className="grid grid-cols-1 py-1">
            <Button
              variant="light"
              radius="sm"
              startContent={<AiOutlineUser />}
              className="justify-start dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Signed as <span className="capitalize">{activeAccount?.user.assign_type}</span>
            </Button>
            <Button
              onPress={onLogoutOpen}
              variant="light"
              color="danger"
              radius="sm"
              startContent={<LuLogOut />}
              className="justify-start"
            >
              {t("logout")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </Tooltip>
  ) : (
    <Avatar isBordered color="default" src={Profile} className="min-w-10" />
  )
));

ProfilePopover.displayName = "ProfilePopover";

const Sidebar = ({ toggle }: { toggle: boolean }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [focusedSubmenu, setFocusedSubmenu] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, activeAccount } = useAuth();
  
  // Use the route cache hook
  const { isRouteVisited, markRouteVisited } = useRouteCache();
  
  // Memoize token data
  const tokenData = useMemo(() => decodeToken(), []);
  
  // Memoize menus based on role
  const menus = useMemo(
    () => getRoleMenus(activeAccount?.user.assign_type ?? "Student"),
    [activeAccount?.user.assign_type]
  );

  // Optimized menu matching with early exit
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Mark current route as visited
    markRouteVisited(currentPath);
    
    for (const section of menus) {
      for (const menuGroup of section.items) {
        // Check direct menu match
        if (menuGroup.items.length === 0 && menuGroup.to) {
          if (currentPath === menuGroup.to || currentPath.startsWith(`${menuGroup.to}/`)) {
            setActiveMenu(menuGroup.title);
            setOpenMenu(null);
            setFocusedSubmenu(null);
            return;
          }
        }
        
        // Check submenu match
        for (const subItem of menuGroup.items) {
          if (currentPath === subItem.to || currentPath.startsWith(`${subItem.to}/`)) {
            setActiveMenu(menuGroup.title);
            setOpenMenu(menuGroup.title);
            setFocusedSubmenu(subItem.to || null);
            return;
          }
        }
      }
    }
    
    // No match found
    setActiveMenu(null);
    setOpenMenu(null);
    setFocusedSubmenu(null);
  }, [location.pathname, menus, markRouteVisited]);

  // Memoized callbacks with smart transition
  const handleMenuClick = useCallback((title: string, hasSubmenus: boolean, to?: string) => {
    if (!hasSubmenus) {
      setActiveMenu(title);
      setOpenMenu(null);
      setFocusedSubmenu(null);
      if (to) {
        // Only show loading for routes not visited yet
        if (isRouteVisited(to)) {
          navigate(to);
        } else {
          startTransition(() => {
            navigate(to);
          });
        }
      }
      return;
    }

    setOpenMenu(prev => prev === title ? null : title);
    setActiveMenu(title);
    setFocusedSubmenu(null);
  }, [navigate, isRouteVisited]);

  const handleSubMenuClick = useCallback((menuGroupTitle: string, subItemTo: string) => {
    setActiveMenu(menuGroupTitle);
    setFocusedSubmenu(subItemTo);
    setOpenMenu(menuGroupTitle);
    
    // Only show loading for routes not visited yet
    if (isRouteVisited(subItemTo)) {
      navigate(subItemTo);
    } else {
      startTransition(() => {
        navigate(subItemTo);
      });
    }
  }, [navigate, isRouteVisited]);

  return (
    <>
      <AnimatePresence>
        {isPending && <LoadingOverlay />}
      </AnimatePresence>
      
      <ConfirmDialog
        isOpen={isOpen}
        onClose={onClose}
        confirm={logout}
        confirmLabel={t("logout")}
        confirmIcon={<LogOut size={16} />}
        title={t("accountLogout")}
        message={t("accountLogoutMessage")}
      />
      <div className="h-full w-full space-y-5 px-5 dark:bg-zinc-900">
        <div className="flex items-center justify-center gap-2 py-4">
          <h2 className="whitespace-nowrap font-medium capitalize">
            {tokenData?.branch?.toUpperCase()}
          </h2>
        </div>
        
        <div className="my-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ProfilePopover 
              toggle={toggle}
              activeAccount={activeAccount}
              onLogoutOpen={onOpen}
              t={t}
            />
            <div hidden={toggle}>
              <h3 className="whitespace-nowrap text-center text-lg font-medium capitalize">
                {activeAccount?.user.username || "Guest"}
              </h3>
              <p className="text-sm capitalize text-zinc-500">
                {activeAccount?.user.assign_type}
              </p>
            </div>
          </div>
          
          <Popover
            placement="right-start"
            classNames={{
              base: "border-none shadow-none",
              content: "rounded-2xl border border-white dark:border-zinc-800 bg-zinc-100/80 outline-none dark:bg-zinc-800/80 backdrop-blur-sm shadow-lg shadow-zinc-300/50 dark:shadow-black/20 custom-backdrop",
            }}
          >
            <PopoverTrigger>
              <Button
                isIconOnly
                endContent={<BsThreeDotsVertical />}
                radius="full"
                variant="light"
                className={toggle ? "hidden" : "flex"}
              />
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <div className="grid grid-cols-1 py-1">
                <h2 className="text-sm font-medium capitalize mt-2 text-zinc-500 dark:text-zinc-400">
                  {t("accountSwitcher")}
                </h2>
                <Divider />
                <AccountSwitcher />
                <h2 className="text-sm font-medium capitalize mt-2 text-zinc-500 dark:text-zinc-400">
                  {t("account")}
                </h2>
                <Divider />
                <Button
                  onPress={() => navigate("/login")}
                  variant="light"
                  radius="md"
                  size="sm"
                  startContent={<PiUserCirclePlusLight size={16} />}
                  className="justify-start dark:text-zinc-400 dark:hover:text-zinc-50 mt-2"
                >
                  {t("addAccount")}
                </Button>
                <Button
                  onPress={onOpen}
                  variant="light"
                  color="danger"
                  radius="md"
                  size="sm"
                  startContent={<LuLogOut size={16} />}
                  className="justify-start"
                >
                  {t("logout")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <ScrollShadow className="has-scrollbar h-[34rem] scrollbar-hide 3xl:h-[75vh]">
          {!toggle && (
            <ul className="space-y-1">
              {menus.map((section, sectionIndex) => (
                <div key={`section-${sectionIndex}`} className="mb-3">
                  {section.group && (
                    <span className={cn(
                      'text-xs flex text-zinc-500 dark:text-zinc-400 border-b border-black/5 dark:border-white/5 mb-2'
                    )}>
                      {t(section.group)}
                    </span>
                  )}
                  {section.items.map((menuGroup: any) => (
                    <MenuGroup
                      key={menuGroup.title}
                      menuGroup={menuGroup}
                      isActive={activeMenu === menuGroup.title}
                      isOpen={openMenu === menuGroup.title}
                      toggle={toggle}
                      currentPath={location.pathname}
                      onMenuClick={handleMenuClick}
                      onSubMenuClick={handleSubMenuClick}
                      t={t}
                      isPending={isPending}
                    />
                  ))}
                </div>
              ))}
            </ul>
          )}

          {toggle && (
            <ul className="space-y-2">
              {menus.map((section, sectionIndex) => (
                <div key={`dropdown-section-${sectionIndex}`}>
                  {section.items.map((menuGroup: any) => (
                    <li key={menuGroup.title}>
                      <Dropdown placement="right-start" showArrow={true} className="dark:bg-zinc-800">
                        <DropdownTrigger>
                          <div
                            className={cn(
                              "flex cursor-pointer items-center justify-between rounded-2xl py-2 duration-300",
                              !toggle ? "px-3" : "px-0",
                              activeMenu === menuGroup.title
                                ? "bg-black/20 text-zinc-900 dark:bg-white/10 dark:text-zinc-200"
                                : "text-zinc-700 hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-700"
                            )}
                          >
                            <Tooltip
                              content={t(menuGroup.title)}
                              placement="right"
                              radius="sm"
                              color="foreground"
                              showArrow
                              classNames={{ base: "ml-2" }}
                              closeDelay={0}
                            >
                              <button
                                onClick={() => {
                                  if (menuGroup.items.length === 0 && menuGroup.to) {
                                    setActiveMenu(menuGroup.title);
                                    if (isRouteVisited(menuGroup.to)) {
                                      navigate(menuGroup.to);
                                    } else {
                                      startTransition(() => {
                                        navigate(menuGroup.to);
                                      });
                                    }
                                  }
                                }}
                                className={cn(
                                  "cursor-pointer flex items-center justify-center w-full gap-2 py-0.5",
                                  activeMenu === menuGroup.title
                                    ? "*:text-zinc-700 *:dark:text-zinc-200"
                                    : "*:text-zinc-600 dark:*:text-zinc-400"
                                )}
                              >
                                <span className="text-xl">
                                  <menuGroup.icon />
                                </span>
                                {!toggle && <h4>{t(menuGroup.title)}</h4>}
                              </button>
                            </Tooltip>
                            {menuGroup.items.length > 0 && !toggle && (
                              <span className="text-zinc-500">
                                <IoIosAddCircleOutline size={20} />
                              </span>
                            )}
                          </div>
                        </DropdownTrigger>
                        {menuGroup.items.length > 0 && (
                          <DropdownMenu aria-label={menuGroup.title}>
                            {menuGroup.items.map((item: any, itemIndex: any) => (
                              <DropdownItem
                                key={`${item.to}-${itemIndex}`}
                                className={cn(
                                  "flex items-center gap-2",
                                  location.pathname === item.to
                                    ? "bg-zinc-900/10 text-black dark:bg-white/10 dark:text-zinc-200"
                                    : "text-zinc-700 dark:text-white"
                                )}
                              >
                                <Link
                                  to={item.to}
                                  className="flex items-center gap-2 w-full"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSubMenuClick(menuGroup.title, item.to);
                                  }}
                                >
                                  <span className="text-lg">
                                    <item.icon />
                                  </span>
                                  <span>{t(item.title)}</span>
                                  {location.pathname === item.to && (
                                    <i className="ml-auto flex h-2 w-2 rounded-full bg-green-500" />
                                  )}
                                </Link>
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        )}
                      </Dropdown>
                    </li>
                  ))}
                </div>
              ))}
            </ul>
          )}
        </ScrollShadow>
        
        <div className="pt-4">
          {!toggle ? (
            <Button
              onPress={onOpen}
              variant="light"
              color="danger"
              endContent={<FiLogOut size={18} />}
              radius="lg"
              className="w-full justify-between"
              isDisabled={isPending}
            >
              Logout
            </Button>
          ) : (
            <Button
              onPress={onOpen}
              variant="light"
              color="danger"
              endContent={<FiLogOut size={18} />}
              radius="lg"
              isIconOnly
              isDisabled={isPending}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Sidebar);