import { Icons } from "@/assets/icons/Index";
import { useFetch } from "@/hooks/useFetch";
import { Button } from "@/components/hero-ui";
import { Spinner, Tooltip } from "@heroui/react";
import { type FC, memo, type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ShowToast from "../toast/ShowToast";

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

interface UserPermissionData {
  permissions: Array<{
    user_id: number;
    username: string;
    email: string;
    assign_type: string;
    is_active: number;
    permissions: number[];
  }>;
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
  const [permissions, setPermissions] = useState<string[]>([]);

  // Load user's existing permissions
  const { data: userPermissionExists, loading: userPermLoading } = useFetch<{ data: UserPermissionData }>("/userpermission/current");

  useEffect(() => {
    const permission = userPermissionExists?.data?.rows[0].permissions;
    setPermissions(permission);
  }, [userPermissionExists]);

  const handleNotPermission = () => {
    ShowToast({ color: "danger", description: t("notPermission") });
  };

  return (
    <>
      {
        permissionType && permissions?.includes(permissionType || "") ? (
          <Tooltip
            color={tooltipColor}
            content={content}
            radius={radius}
            placement={tooltipPlacement}
            className="px-5"
            closeDelay={0}
            showArrow
            classNames={{
              base: "pointer-events-none"
            }}
          >
            <Button
              isIconOnly
              color={color}
              variant={variant}
              radius={radius}
              onPress={(event: any) => onPress?.(event)}
              endContent={endContent}
              size="sm"
              {...props}
            >
              {userPermLoading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <Icons.PencilOutlineIcon size={17} />
              )}
            </Button>
          </Tooltip>
        ) : (
          <Button
            color="secondary"
            radius="full"
            size="sm"
            variant="light"
            onPress={handleNotPermission}
            isIconOnly
            className="opacity-50"
          >
            <Icons.PencilOutlineIcon size={17} />
          </Button>
        )
      }
    </>
  );
};

export default memo(ButtonEdit);
