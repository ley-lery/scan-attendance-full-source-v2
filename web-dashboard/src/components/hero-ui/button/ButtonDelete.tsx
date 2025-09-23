import AuthService from "@/services/auth.service.ts";
import { Button } from "@heroui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@heroui/react";
import { FC, useEffect, useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { IoIosClose } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";
// import UserService from "@/services/user.service.ts";
import { Icons } from "@/assets/icons/Index";

interface ButtonProps {
  confirmDelete: () => void;
  id: number;
  permissionType?: string;
}

interface UserProfile {
  id: number | null;
}

const ButtonDelete: FC<ButtonProps> = ({
  confirmDelete,
  permissionType,
  id,
  ...props
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<UserProfile>({ id: null });
  const [permissions, setPermissions] = useState<string>("studentDelete");

  // const loadData = useCallback(async (token: string) => {
  //   try {
  //     const res = await AuthService.userProfile(token);
  //     if (res) setData(res.data);
  //   } catch (error: any) {
  //     console.error(error.message);
  //   }
  // }, []);
  // const loadPermissions = useCallback(async (userId: number) => {
  //   try {
  //     const res = await UserService.getPermissionById(userId);
  //     const perm = res.data.data.rows.map((data: any) => data.permission); // Extract the permissionName
  //     setPermissions(perm);
  //   } catch (error: any) {
  //     console.error(error.message);
  //   }
  // }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     loadData(token);
  //   }
  // }, [loadData]);

  // useEffect(() => {
  //   if (data.id) {
  //     loadPermissions(data.id);
  //   }
  // }, [data.id, loadPermissions]);

  return (
    <Popover
      placement="left"
      showArrow={true}
      radius="lg"
      color="default"
      classNames={{
        content: "border border-gray-200 dark:border-zinc-700",
      }}
    >
      {/* <Tooltip content={t("delete")} color="danger" radius="sm" closeDelay={0}> */}
      <PopoverTrigger>
        {permissions.includes(permissionType) ? (
          <Button
            {...props}
            id={id.toString()}
            content={t("delete")}
            radius="full"
            variant="light"
            color="danger"
            isIconOnly
          >
            <Icons.TrashIcon size={17} />
          </Button>
        ) : (
          ""
        )}
      </PopoverTrigger>
      {/* </Tooltip> */}
      <PopoverContent>
        {(titleProps) => (
          <div className="space-y-4 px-4 py-2">
            <p {...titleProps}>{t("warning")}</p>
            <div className="flex items-center justify-center space-x-2">
              <Button variant="light" color="danger" radius="full" size="md">
                {/* <IoIosClose size={20} /> */}
                {t("cancel", "Cancel")}
              </Button>
              <Button
                onPress={confirmDelete}
                radius="full"
                variant="light"
                color="secondary"
                size="md"
              >
                {t("confirm")}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default memo(ButtonDelete);
