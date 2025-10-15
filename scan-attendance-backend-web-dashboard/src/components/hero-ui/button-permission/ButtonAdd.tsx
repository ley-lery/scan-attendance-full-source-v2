import { Button } from "@/components/hero-ui";
import { type FC, useEffect, useState,  memo } from "react";
import { useTranslation } from "react-i18next";
import { Icons } from "@/assets/icons/Index";
import { useFetch } from "@/hooks/useFetch";
import ShowToast from "../toast/ShowToast";
import { Spinner } from "@heroui/react";

interface ButtonType {
  onPress?: () => void;
  permissionType?: string | undefined;
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

const ButtonAdd: FC<ButtonType> = ({ onPress, permissionType, ...props }) => {
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
     {/* have permission  */}
      <Button
        color="primary"
        radius="md"
        size="sm"
        endContent={<Icons.AddIcon size={18} />}
        onPress={onPress}
        className={` ${
          permissionType && permissions?.includes(permissionType) // permissionType && permissions?.includes(permissionType)
            ? "flex"
            : "hidden"
        }`}
        
        {...props}
      >
        {t("addNew")}
      </Button>
      {/* not have permission */}
      <Button
        color="primary"
        radius="md"
        size="sm"
        endContent={userPermLoading ? (
          <Spinner size="sm" color="white" />
        ) : (
          <Icons.AddIcon size={18} />
        )}
        onPress={handleNotPermission}
        className={` ${
          permissionType && !permissions?.includes(permissionType) // permissionType && permissions?.includes(permissionType)
            ? "flex opacity-50"
            : "hidden"
        }`}
        {...props}
      >
        {t("addNew")}
      </Button>
    </>
  );
};

export default memo(ButtonAdd);
