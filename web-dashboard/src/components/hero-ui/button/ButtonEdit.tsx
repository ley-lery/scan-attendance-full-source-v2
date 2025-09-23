import { Icons } from "@/assets/icons/Index";
import AuthService from "@/services/auth.service.ts";
// import UserService from "@/services/user.service.ts";
import { Button } from "@heroui/button";
import { Tooltip } from "@heroui/react";
import { FC, memo, ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface UserProfile {
  id: number | null;
}

interface ButtonType {
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  tooltipColor?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  onPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  endContent?: React.ReactElement | ReactNode;
  content?: string;
  tooltipPlacement?:
    | "top"
    | "bottom"
    | "right"
    | "left"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
  permissionType: string | undefined;
}
const ButtonEdit: FC<ButtonType> = ({
  color,
  variant,
  radius,
  onPress,
  endContent,
  content = "content",
  tooltipColor = "default",
  tooltipPlacement = "top",
  permissionType,
  ...props
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState<UserProfile>({ id: null });
  const [permissions, setPermissions] = useState<string>("studentModify");

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
      color={tooltipColor}
      content={content}
      radius={radius}
      placement={tooltipPlacement}
      className="px-5"
      closeDelay={0}
    >
      <Button
        isIconOnly
        color={color}
        variant={variant}
        radius={radius}
        onPress={(event) => onPress?.(event)}
        endContent={endContent}
        className={`${!permissions.includes(permissionType) ? "hidden" : "flex"}`}
        {...props}
      >
        <Icons.PencilOutlineIcon size={18} />
      </Button>
    </Tooltip>
  );
};

export default memo(ButtonEdit);
