import { Button } from "@heroui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@heroui/react";
import { type FC, memo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Icons } from "@/assets/icons/Index";
import { useFetch } from "@/hooks/useFetch";
import ShowToast from "../toast/ShowToast";

interface ButtonProps {
  confirmDelete: () => void;
  id: number;
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

const ButtonDelete: FC<ButtonProps> = ({
  confirmDelete,
  permissionType,
  id,
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
        permissionType && permissions?.includes(permissionType) ? (
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
          {permissionType && permissions?.includes(permissionType || "") ? (
            <Button
              {...props}
              id={id.toString()}
              content={t("delete")}
              radius="full"
              variant="light"
              color="danger"
              size="sm"
              isIconOnly
            >
              {userPermLoading ? (
                <Spinner size="sm" color="white" />
              ) : (
                <Icons.TrashIcon size={17} />
              )}

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
        ) : (
        <Button
          color="danger"
          radius="full"
          size="sm"
          variant="light"
          onPress={handleNotPermission}
          isIconOnly
          className="opacity-50"
        >
          <Icons.TrashIcon size={17} />
        </Button>
        )
      }
    </>
  );
};

export default memo(ButtonDelete);
