import { Button } from "@/components/hero-ui";
import { type FC, useEffect, useState,  memo } from "react";
import { useTranslation } from "react-i18next";
import { useFetch } from "@/hooks/useFetch";
import ShowToast from "../toast/ShowToast";
import { Spinner, Tooltip } from "@heroui/react";
import { CgClose } from "react-icons/cg";

interface ButtonType {
  onPress?: () => void;
  permissionType?: string | undefined;
  isDisabled?: boolean;
  isLoading?: boolean;
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

const ButtonCancelLeave: FC<ButtonType> = ({ onPress, permissionType, isDisabled, isLoading, ...props }) => {
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
      permissionType && permissions?.includes(permissionType) 
      ?
        <Tooltip content={t("cancelLeave")} color="danger">
          <Button
            color="danger"
            radius="full"
            size="sm"
            onPress={onPress}
            isIconOnly
            startContent={ isLoading ? <Spinner size="sm" color="danger" /> : <CgClose size={16} />}
            variant="light"
            {...props}
            isDisabled={isDisabled || userPermLoading || isLoading}
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
            startContent={ isLoading ? <Spinner size="sm" color="danger" /> : <CgClose size={16} />}
            variant="light"
            {...props}
            isDisabled={isDisabled || userPermLoading || isLoading}
          />
        </Tooltip>
      }
    </>
  );
};

export default memo(ButtonCancelLeave);
