import { useFetch } from "@/hooks/useFetch";
import { Button } from "@heroui/button";
import { Spinner, Tooltip } from "@heroui/react";
import { type FC, memo,  useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ShowToast from "../toast/ShowToast";
import { MdRadioButtonChecked } from "react-icons/md";

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
const ButtonMarkPresent: FC<ButtonType> = ({
  onPress,
  permissionType,
  isLoading,
  isDisabled,
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
            color="success"
            content="Mark Present"
            radius="full"
            placement="top"
            className="px-5"
            closeDelay={0}
            showArrow
            classNames={{
              base: "pointer-events-none"
            }}
          >
            <Button
              isIconOnly
              color="success"
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
                <MdRadioButtonChecked size={20} />
              )}
            </Button>
          </Tooltip>
        ) : (
          <Button
            color="success"
            radius="full"
            size="sm"
            variant="light"
            onPress={handleNotPermission}
            isIconOnly
            className="opacity-50"
          >
            <MdRadioButtonChecked  size={20} />
          </Button>
        )
      }
    </>
  );
};

export default memo(ButtonMarkPresent);
