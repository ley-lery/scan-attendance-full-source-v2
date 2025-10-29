import { Icons } from "@/assets/icons/Index";
import { Button, Spinner, Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ShowToast from "../toast/ShowToast";
import { useFetch } from "@/hooks/useFetch";

interface ButtonProps {
  onPress?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  permissionType?: string;
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
const ButtonView = ({ onPress, permissionType }: ButtonProps) => {
  const { t } = useTranslation();
  const [permissions, setPermissions] = useState<string[]>([]);

  // Load user's existing permissions
  const { data: userPermissionExists, loading: userPermLoading } = useFetch<{ data: UserPermissionData }>('/userpermission/current');

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
          content={t("viewDetail")}
          radius="full"
          className="px-5"
          closeDelay={0}
          classNames={{
            base: "pointer-events-none"
          }}
          showArrow
        >
          <Button
            onPress={(event: any) => onPress?.(event)}
            isIconOnly
            radius="full"
            color="success"
            variant="light"
            size="sm"
          >
           {userPermLoading ? (
             <Spinner size="sm" color="white" />
           ) : (
             <Icons.EyeOutlineIcon size={17} />
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
          <Icons.EyeOutlineIcon size={17} />
        </Button>
      )
    }
    </>
  );
};

export default ButtonView;
