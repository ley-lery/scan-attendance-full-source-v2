/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import  { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Profile from "@/assets/profile/profile.png";
import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  ScrollShadow,
} from "@heroui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import AuthService from "@/services/auth.service.ts";
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
interface User {
  username: string;
  email: string;
  assign_type: string;
}


const Sidebar = ({ toggle }: { toggle: boolean }) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState<User>();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [focusedSubmenu, setFocusedSubmenu] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const tokenData = decodeToken();

  // ============ Dynamically determine role based on token ===========
  const role = decodeToken()?.assign_type ?? "Student";
  const menus = getRoleMenus(role);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile(token);
    }
  }, []);

  const getProfile = async (token: string) => {
    try {
      const res = await AuthService.userProfile(token);
      const data = res.data.user.userData;
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    let matchedMenu: string | null = null;
    let matchedSubmenu: string | null = null;

    menus.forEach((menu: any) => {
      //Match sub-items (nested)
      const foundSub = menu.items.find((item: any) =>
        location.pathname.startsWith(item.to),
      );

      //Match top-level menu with no items
      const isTopLevelMatch = !menu.items.length && location.pathname.startsWith(menu.to);

      if (foundSub) {
        matchedMenu = menu.title;
        matchedSubmenu = foundSub.to;
      } else if (isTopLevelMatch) {
        matchedMenu = menu.title;
      }
    });

    setOpenMenu(matchedMenu);
    setFocusedSubmenu(matchedSubmenu);
    setActiveMenu(matchedMenu);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);


  const toggleMenu = (title: string, hasSubmenus: boolean) => {
    if (!hasSubmenus) {
      setOpenMenu(null);
      setActiveMenu(null);
      setFocusedSubmenu(null);

      return;
    }

    if (openMenu === title) {
      setOpenMenu(null);
    } else {
      setOpenMenu(title);
    }
    // setActiveMenu(title);
    setFocusedSubmenu(null);
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        confirm={logout}
        confirmLabel={t("logout")}
        confirmIcon={<LogOut size={16} />}
        title={t("accountLogout")}
        message={t("accountLogoutMessage")}
      />
      <div className="h-full w-full space-y-5 px-5 dark:bg-zinc-900">
        <div className="flex items-center justify-center gap-2 py-4">
          {/* <img src={Logo} alt="logo" className="size-10" /> */}
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
                    content: "border border-white dark:border-transparent bg-zinc-100 outline-none dark:bg-zinc-800",
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
                        <span className="capitalize">{user?.assign_type}</span>
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
                {user?.username ? user?.username : "Guest"}
              </h3>
              <p className="text-sm capitalize text-zinc-500">
                {user?.assign_type}
              </p>
            </div>
          </div>
          <Popover 
            placement="right-start" 
            showArrow={true} 
            classNames={{
              content: "border border-white dark:border-transparent bg-zinc-100 outline-none dark:bg-zinc-800",
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
            <PopoverContent>
              <div className="grid grid-cols-1 py-1">
                <Button
                  variant="light"
                  radius="lg"
                  startContent={<AiOutlineUser />}
                  className="justify-start dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  Signed as{" "}
                  <span className="capitalize">{user?.assign_type}</span>
                </Button>
                <Button
                  onPress={onOpen}
                  variant="light"
                  color="danger"
                  radius="lg"
                  startContent={<LuLogOut />}
                  className="justify-start"
                >
                  {t("logout")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="pr-4">
          {/* searh menu or link 
          {!toggle && (
            <Input
              placeholder="Search..."
              startContent={<CiSearch size={24} className="text-zinc-400" />}
              radius="lg"
              isClearable
              classNames={{
                inputWrapper: "bg-zinc-200 dark:bg-zinc-800",
              }}
            />
          )} */}
        </div>
        <ScrollShadow className="has-scrollbar h-[34rem] scrollbar-hide 3xl:h-[75vh]">
          {/* ============= Default Menu List ============== */}
          {!toggle && (
            <ul className="space-y-1">
              {menus.map((menu: any) => (
                <li key={menu.title}>
                  <div
                    onClick={() =>
                      menu.items.length > 0 ? toggleMenu(menu.title, menu.items.length > 0) : navigate(menu.to)
                    }
                    className={`flex cursor-pointer items-center justify-between rounded-2xl py-1.5 duration-300 ${!toggle ? "px-3" : "px-[.55rem]"} ${
                      activeMenu === menu.title
                        ? "bg-black/10 text-zinc-900 dark:bg-white/10 dark:text-zinc-200"
                        : "text-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-700"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-x-2 whitespace-nowrap ${activeMenu === menu.title ? "*:text-zinc-700 *:dark:text-zinc-200" : "*:text-zinc-600 dark:*:text-zinc-400"}`}
                    >
                      <span className="text-lg flex">{<menu.icon />}</span>
                      {!toggle && <h2 className="mt-1 text-base">{t(menu.title)}</h2>}
                    </div>
                    {menu.items.length > 0 && !toggle && (
                      <span className="text-zinc-500">
                        {openMenu === menu.title ? (
                          <AiOutlineMinusCircle size={20} />
                        ) : (
                          <IoIosAddCircleOutline size={20} />
                        )}
                      </span>
                    )}
                  </div>

                  <AnimatePresence initial={false}>
                    {openMenu === menu.title && (
                      <motion.ul
                        className="relative my-1 ml-3 space-y-1 border-l-2 border-zinc-400/30 pl-4 dark:border-zinc-600/30"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {menu.items.map((item: any) => (
                          <div key={item.to} className="relative">
                            {/* Timeline dot */}
                            <span
                              className={`absolute -left-[1.3rem] top-[.8rem] h-2 w-2 rounded-full ${location.pathname === item.to ? "bg-black dark:bg-white" : "bg-zinc-500 dark:bg-zinc-300"}`}
                            />

                            {/* Timeline content */}
                            <Link
                              to={item.to}
                              className={`bord relative flex cursor-pointer items-center justify-between gap-2 rounded-xl px-4 py-2 text-sm transition-colors duration-300 ${
                                location.pathname === item.to
                                  ? "bg-zinc-900/10 text-black dark:bg-white/10 dark:text-zinc-200"
                                  : "text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/10"
                              }`}
                            >
                              {location.pathname === item.to && (
                                <MdOutlineArrowLeft className="absolute -left-0 -top-0.5 flex -translate-x-5 text-4xl text-zinc-200 dark:text-white/10" />
                              )}
                              <div className="flex items-center gap-2 *:text-zinc-500 *:dark:text-zinc-400">
                                <span className=" text-lg">
                                  {"icon" in item && <item.icon /> ? <item.icon /> : ""}
                                </span>
                                <span>{t(item.title)}</span>
                              </div>
                              {location.pathname === item.to && (
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
            </ul>
          )}
          {/* ============= Responsive Menu List ============== */}
          {toggle && (
            <ul className="space-y-2">
              {menus.map((menu: any) => (
                <li key={menu.title}>
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
                          activeMenu === menu.title
                            ? "bg-black/20 text-zinc-900 dark:bg-white/10 dark:text-zinc-200"
                            : "text-zinc-700 hover:bg-zinc-200 dark:text-white dark:hover:bg-zinc-700"
                        }`}
                      >
                        <Tooltip
                          content={t(menu.title)}
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
                              if (menu.items.length === 0 && menu.to) {
                                setActiveMenu(menu.title);
                                navigate(menu.to);
                              }
                            }}
                            className={`cursor-pointer flex items-center justify-center w-full gap-2 py-0.5 ${
                              activeMenu === menu.title
                                ? "*:text-zinc-700 *:dark:text-zinc-200"
                                : "*:text-zinc-600 dark:*:text-zinc-400"
                            }`}
                          >

                            <span className="text-xl">{<menu.icon />}</span>
                            {!toggle && <h4>{t(menu.title)}</h4>}
                          </button>
                        </Tooltip>

                        {menu.items.length > 0 && !toggle && (
                          <span className="text-zinc-500">
                            <IoIosAddCircleOutline size={20} />
                          </span>
                        )}
                      </div>
                    </DropdownTrigger>

                    {menu.items.length > 0 && (
                      <DropdownMenu aria-label={menu.title}>
                        {menu.items.map((item: any, index: number) => (
                          <DropdownItem
                            key={index}
                            as={Link}
                            startContent={
                              "icon" in item && item.icon ? item.icon : ""
                            }
                            className={`flex items-center gap-2 ${
                              location.pathname === item.to
                                ? "bg-zinc-900/10 text-black dark:bg-white/10 dark:text-zinc-200"
                                : "text-zinc-700 dark:text-white"
                            }`}
                          >
                            <Link to={item.to}>
                              <p className="flex items-center gap-2">
                                <span className="text-lg">
                                  {"icon" in item && item.icon ? <item.icon /> : ""}
                                </span>
                                <span>{item.title}</span>
                                {location.pathname === item.to && (
                                  <i className="ml-auto flex h-2 w-2 rounded-full bg-green-500" />
                                )}
                              </p>
                            </Link>
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    )}
                  </Dropdown>
                </li>
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
