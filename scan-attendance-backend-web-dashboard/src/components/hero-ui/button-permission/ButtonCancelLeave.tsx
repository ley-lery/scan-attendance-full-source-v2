import { Button } from "@heroui/button";
import { type FC, useEffect, useState,  memo } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "@/hooks/useFetch";
import ShowToast from "../toast/ShowToast";
import { Tooltip } from "@heroui/react";
import { CgClose } from "react-icons/cg";

interface ButtonType {
  onPress?: () => void;
  permissionType?: string | undefined;
  isDisabled?: boolean;
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

const ButtonCancelLeave: FC<ButtonType> = ({ onPress, permissionType, isDisabled, ...props }) => {
  const { t } = useTranslation();
  
  const [permissions, setPermissions] = useState<string[]>([]);

 

  // Load user's existing permissions
  const { data: userPermissionExists, loading: userPermLoading } = useFetch<{ data: UserPermissionData }>("/userpermission/current");

  useEffect(() => {
    const permission = userPermissionExists?.data?.rows[0].permissions;
    setPermissions(permission);
    console.log("permissions", permissions);
  }, [userPermissionExists]);

  const handleNotPermission = () => {
    ShowToast({ color: "danger", description: t("notPermission") });
  };

 
  return (
    <>
    {
      permissionType && permissions?.includes(permissionType) 
      ?
        <Tooltip content={t("cancelLeave")} color="danger">
          <Button
            color="danger"
            radius="full"
            size="sm"
            onPress={onPress}
            isIconOnly
            startContent={ <CgClose size={16} />}
            variant="light"
            {...props}
            isDisabled={isDisabled || userPermLoading}
          />
        </Tooltip>
      :
        <Tooltip content={t("notPermission")} color="danger">
          <Button
            color="danger"
            radius="full"
            size="sm"
            onPress={handleNotPermission}
            isIconOnly
            startContent={<CgClose size={16} />}
            variant="light"
            {...props}
            isDisabled={isDisabled || userPermLoading}
          />
        </Tooltip>
      }
    </>
  );
};

export default memo(ButtonCancelLeave);
