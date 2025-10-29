import { useFetch } from "@/hooks/useFetch";
import { Button } from "@/components/hero-ui";
import { Spinner, Tooltip } from "@heroui/react";
import { type FC, memo,  useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ShowToast from "../toast/ShowToast";
import { RiLogoutCircleRFill } from "react-icons/ri";

interface ButtonType {
  onPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  permissionType: string | undefined;
  isLoading?: boolean;
  isDisabled?: boolean
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
const ButtonMarkPermission: FC<ButtonType> = ({
  onPress,
  permissionType,
  isDisabled,
  isLoading,
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
    ShowToast({ color: "danger", description: t("notPermission"), delay: 0 });
  };

  return (
    <>
      {
        permissionType && permissions?.includes(permissionType || "") ? (
          <Tooltip
            color="primary"
            content="Mark Permission"
            radius="full"
            placement="left"
            className="px-5"
            closeDelay={0}
            showArrow
            classNames={{
              base: "pointer-events-none"
            }}
          >
            <Button
              isIconOnly
              color="primary"
              variant="light"
              radius="full"
              onPress={(event: any) => onPress?.(event)}
              size="sm"
              isDisabled={isDisabled}
              isLoading={isLoading}
              {...props}
            >
              {userPermLoading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <RiLogoutCircleRFill  size={20} />
              )}
            </Button>
          </Tooltip>
        ) : (
          <Button
            color="primary"
            radius="full"
            size="sm"
            variant="light"
            onPress={handleNotPermission}
            isIconOnly
            className="opacity-50"
          >
            <RiLogoutCircleRFill  size={20} />
          </Button>
        )
      }
    </>
  );
};

export default memo(ButtonMarkPermission);
