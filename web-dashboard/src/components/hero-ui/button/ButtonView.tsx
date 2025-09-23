import { Icons } from "@/assets/icons/Index";
import AuthService from "@/services/auth.service.ts";
// import UserService from "@/services/user.service.ts";
import { Button, Tooltip } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface UserProfile {
  id: number | null;
}

interface ButtonProps {
  onPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  permissionType?: string;
}
const ButtonView = ({ onPress, permissionType }: ButtonProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<UserProfile>({ id: null });
  const [permissions, setPermissions] = useState<string>("studentView");

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
    <Tooltip
      color="success"
      content={t("viewDetail")}
      radius="full"
      className="px-5"
      closeDelay={0}
    >
      <Button
        onPress={(event) => onPress?.(event)}
        isIconOnly
        radius="full"
        color="success"
        variant="light"
        className={`${!permissions.includes(permissionType) ? "hidden" : "flex"}`}
      >
        <Icons.EyeOutlineIcon size={18} />
      </Button>
    </Tooltip>
  );
};

export default ButtonView;
