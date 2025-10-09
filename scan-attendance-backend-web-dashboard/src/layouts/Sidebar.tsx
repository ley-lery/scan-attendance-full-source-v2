/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import  { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useNavigation } from "react-router-dom";
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
} from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { AiOutlineMinusCircle, AiOutlineUser } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { MdOutlineArrowLeft } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import ConfirmDialog from "@/components/ui/dialog/ConfirmDialog";
// import { useBranch } from "@/context/BranchContext";
import { decodeToken } from "@/utils/jwt";
import { LuLogOut } from "react-icons/lu";
import { getRoleMenus } from "./index";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import AccountSwitcher from "@/components/ui/switch/AccountSwitcher";
import { PiUserCirclePlusLight } from "react-icons/pi";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/hero-ui";
import { useDisclosure } from "@/god-ui";


const Sidebar = ({ toggle }: { toggle: boolean }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [focusedSubmenu, setFocusedSubmenu] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, activeAccount } = useAuth();
  const tokenData = decodeToken();
  focusedSubmenu; // use like this to can build or deploy

  // ============ Dynamically determine role based on token ===========
  const menus = getRoleMenus(activeAccount?.user.assign_type ?? "Student");

  

  // Fixed useEffect to properly match menu structure
  useEffect(() => {
    let matchedMenu: string | null = null;
    let matchedSubmenu: string | null = null;

    // Loop through sections
    menus.forEach((section: any) => {
      // Loop through menu groups in each section
      section.items.forEach((menuGroup: any) => {
        // Check if any sub-item matches the current path
        const foundSubItem = menuGroup.items.find((subItem: any) =>
          location.pathname === subItem.to || location.pathname.startsWith(subItem.to + '/')
        );

        // Check if the menu group itself has a direct route (no sub-items)
        const isDirectMenuMatch = menuGroup.items.length === 0 && 
          menuGroup.to && 
          (location.pathname === menuGroup.to || location.pathname.startsWith(menuGroup.to + '/'));

        if (foundSubItem) {
          matchedMenu = menuGroup.title;
          matchedSubmenu = foundSubItem.to;
        } else if (isDirectMenuMatch) {
          matchedMenu = menuGroup.title;
          matchedSubmenu = null;
        }
      });
    });

    // Set the states
    if (matchedMenu) {
      setActiveMenu(matchedMenu);
      setOpenMenu(matchedMenu); // Keep the menu open if it has sub-items
      setFocusedSubmenu(matchedSubmenu);
    } else {
      // If no match found, reset states
      setActiveMenu(null);
      setOpenMenu(null);
      setFocusedSubmenu(null);
    }
  }, [location.pathname, menus]);

  const toggleMenu = (title: string, hasSubmenus: boolean) => {
    if (!hasSubmenus) {
      // For menu items without submenus, just set as active
      setActiveMenu(title);
      setOpenMenu(null);
      setFocusedSubmenu(null);
      return;
    }

    // For menu items with submenus, toggle the dropdown
    if (openMenu === title) {
      setOpenMenu(null);
    } else {
      setOpenMenu(title);
      setActiveMenu(title);
    }
    setFocusedSubmenu(null);
  };

  const handleSubMenuClick = (menuGroupTitle: string, subItemTo: string) => {
    setActiveMenu(menuGroupTitle);
    setFocusedSubmenu(subItemTo);
    setOpenMenu(menuGroupTitle); // Keep parent menu open
  };

  return (
    <>
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
            {!toggle
              ? tokenData?.branch?.toUpperCase()
              : tokenData?.branch?.toUpperCase()}
          </h2>
        </div>
        <div className="my-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {toggle ? (
              <Tooltip
                content="Profile"
                placement="right"
                radius="sm"
                color="foreground"
                closeDelay={0}
              >
                <Popover
                  placement="right-start" 
                  showArrow={true} 
                  classNames={{
                    content: " border border-white dark:border-transparent bg-zinc-100 outline-none dark:bg-zinc-800",
                  }}
                >
                  <PopoverTrigger>
                    <Avatar
                      isBordered
                      color="default"
                      src={`${Profile}`}
                      className="min-w-10 cursor-pointer"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="grid grid-cols-1 py-1">
                      <Button
                        variant="light"
                        radius="sm"
                        startContent={<AiOutlineUser />}
                        className="justify-start dark:text-zinc-400 dark:hover:text-zinc-50"
                      >
                        Signed as{" "}
                        <span className="capitalize">{activeAccount?.user.assign_type}</span>
                      </Button>
                      <Button
                        onPress={onOpen}
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
              <Avatar
                isBordered
                color="default"
                src={`${Profile}`}
                className="min-w-10"
              />
            )}
            <div hidden={toggle}>
              <h3 className="whitespace-nowrap text-center text-lg font-medium capitalize">
                {activeAccount?.user.username ? activeAccount?.user.username : "Guest"}
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
                className={`${toggle ? "hidden" : "flex"}`}
              />
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <div className="grid grid-cols-1 py-1">
                <h2 className="text-sm font-medium capitalize mt-2 text-zinc-500 dark:text-zinc-400">{t("accountSwitcher")}</h2>
                <Divider/>
                <AccountSwitcher />
                <h2 className="text-sm font-medium capitalize mt-2 text-zinc-500 dark:text-zinc-400">{t("account")}</h2>
                <Divider/>
                <Button
                  onPress={() => navigate("/login")}
                  variant="light"
                  radius="md"
                  size='sm'
                  startContent={<PiUserCirclePlusLight size={16}/>}
                  className="justify-start dark:text-zinc-400 dark:hover:text-zinc-50 mt-2"
                >
                  {t("addAccount")}
                </Button>
                <Button
                  onPress={onOpen}
                  variant="light"
                  color="danger"
                  radius="md"
                  size='sm'
                  startContent={<LuLogOut size={16}/>}
                  className="justify-start"
                >
                  {t("logout")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="pr-4"></div>
        <ScrollShadow className="has-scrollbar h-[34rem] scrollbar-hide 3xl:h-[75vh]">
          {/* ============= Default Menu List ============== */}
          {!toggle && (
            <ul className="space-y-1">
              {menus.map((section, sectionIndex) => (
                <div key={`section-${sectionIndex}`} className="mb-3">
                  {/* Section Group Header */}
                  {section.group && (
                    <span className={cn('text-xs flex text-zinc-500 dark:text-zinc-400 border-b border-black/5 dark:border-white/5 mb-2')}>
                      {t(section.group)}
                    </span>
                  )}
                  
                  {/* Menu Items in Section */}
                  {section.items.map((menuGroup: any) => (
                    <li key={menuGroup.title} className="mb-0.5">
                      <div
                        onClick={() => {
                          if (menuGroup.items.length > 0) {
                            toggleMenu(menuGroup.title, true);
                          } else if (menuGroup.to) {
                            setActiveMenu(menuGroup.title);
                            navigate(menuGroup.to);
                          }
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded-[12px] py-1 duration-300 ${
                          !toggle ? "px-3" : "px-[.55rem]"
                        } ${
                          activeMenu === menuGroup.title
                            ? "bg-black/10 text-zinc-900 dark:bg-white/10 dark:text-zinc-200"
                            : "text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-700"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-x-2 whitespace-nowrap ${
                            activeMenu === menuGroup.title 
                              ? "*:text-zinc-700 *:dark:text-zinc-200" 
                              : "*:text-zinc-600 dark:*:text-zinc-400"
                          }`}
                        >
                          <span className="text-lg flex">
                            <menuGroup.icon size={16}/>
                          </span>
                          {!toggle && <h2 className="mt-1 text-sm">{t(menuGroup.title)}</h2>}
                        </div>
                        {menuGroup.items.length > 0 && !toggle && (
                          <span className="text-zinc-500">
                            {openMenu === menuGroup.title ? (
                              <AiOutlineMinusCircle size={20} />
                            ) : (
                              <IoIosAddCircleOutline size={20} />
                            )}
                          </span>
                        )}
                      </div>

                      {/* Submenu Items */}
                      <AnimatePresence initial={false}>
                        {openMenu === menuGroup.title && menuGroup.items.length > 0 && (
                          <motion.ul
                            className="relative my-1 ml-3 space-y-1 border-l-2 border-zinc-400/30 pl-4 dark:border-zinc-600/30"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {menuGroup.items.map((subItem : any) => (
                              <div key={subItem.to} className="relative">
                                {/* Timeline dot */}
                                <span
                                  className={`absolute -left-[1.3rem] top-[.8rem] h-2 w-2 rounded-full ${
                                    location.pathname === subItem.to 
                                      ? "bg-black dark:bg-white" 
                                      : "bg-zinc-500 dark:bg-zinc-300"
                                  }`}
                                />

                                {/* Timeline content */}
                                <Link
                                  to={subItem.to}
                                  onClick={() => handleSubMenuClick(menuGroup.title, subItem.to)}
                                  className={`relative flex cursor-pointer items-center justify-between gap-2 rounded-[11px] px-4 py-1 text-sm transition-colors duration-300 ${
                                    location.pathname === subItem.to
                                      ? "bg-zinc-900/10 text-black dark:bg-white/10 dark:text-zinc-200"
                                      : "text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/10"
                                  }`}
                                >
                                  {location.pathname === subItem.to && (
                                    <MdOutlineArrowLeft className="absolute -left-0 -top-0.5 flex -translate-x-5 text-4xl text-zinc-200 dark:text-white/10" />
                                  )}
                                  <div className="flex items-center gap-2 *:text-zinc-500 *:dark:text-zinc-400">
                                    <span className="text-lg">
                                      <subItem.icon size={16}/>
                                    </span>
                                    <span className="text-sm">{t(subItem.title)}</span>
                                  </div>
                                  {location.pathname === subItem.to && (
                                    <i className="flex h-2 w-2 rounded-full bg-green-500" />
                                  )}
                                </Link>
                              </div>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ))}
                </div>
              ))}
            </ul>
          )}
           
          {/* ============= Responsive Menu List ============== */}
          {toggle && (
            <ul className="space-y-2">
              {menus.map((section, sectionIndex) => (
                <div key={`dropdown-section-${sectionIndex}`}>
                  {section.items.map((menuGroup : any) => (
                    <li key={menuGroup.title}>
                      <Dropdown
                        placement="right-start"
                        showArrow={true}
                        className="dark:bg-zinc-800"
                      >
                        <DropdownTrigger>
                          <div
                            className={`flex cursor-pointer items-center justify-between rounded-2xl py-2 duration-300 ${
                              !toggle ? "px-3" : "px-0"
                            } ${
                              activeMenu === menuGroup.title
                                ? "bg-black/20 text-zinc-900 dark:bg-white/10 dark:text-zinc-200"
                                : "text-zinc-700 hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-700"
                            }`}
                          >
                            <Tooltip
                              content={t(menuGroup.title)}
                              placement="right"
                              radius="sm"
                              color="foreground"
                              showArrow
                              classNames={{
                                base: "ml-2",
                              }}
                              closeDelay={0}
                            >
                              <button
                                onClick={() => {
                                  if (menuGroup.items.length === 0 && menuGroup.to) {
                                    setActiveMenu(menuGroup.title);
                                    navigate(menuGroup.to);
                                  }
                                }}
                                className={`cursor-pointer flex items-center justify-center w-full gap-2 py-0.5 ${
                                  activeMenu === menuGroup.title
                                    ? "*:text-zinc-700 *:dark:text-zinc-200"
                                    : "*:text-zinc-600 dark:*:text-zinc-400"
                                }`}
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
                            {menuGroup.items.map((item : any, itemIndex : any) => (
                              <DropdownItem
                                key={`${item.to}-${itemIndex}`}
                                className={`flex items-center gap-2 ${
                                  location.pathname === item.to
                                    ? "bg-zinc-900/10 text-black dark:bg-white/10 dark:text-zinc-200"
                                    : "text-zinc-700 dark:text-white"
                                }`}
                              >
                                <Link 
                                  to={item.to}
                                  className="flex items-center gap-2 w-full"
                                  onClick={() => handleSubMenuClick(menuGroup.title, item.to)}
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
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;