import AuthService from "@/services/auth.service.ts";
import { Button } from "@heroui/button";
import { FC, useEffect, useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
// import UserService from "@/services/user.service.ts";
import { Icons } from "@/assets/icons/Index";

interface ButtonType {
  onPress?: () => void;
  permissionType?: string | undefined;
}

interface UserProfile {
  id: string;
  username: string;
  image: string;
}

const ButtonAdd: FC<ButtonType> = ({ onPress, permissionType, ...props }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<UserProfile>({
    id: "",
    username: "",
    image: "",
  });
  const [permissions, setPermissions] = useState<string>("studentCreate");

  const loadData: (token: string) => Promise<void> = useCallback(
    async (token: string): Promise<void> => {
      try {
        const res = await AuthService.userProfile(token);
        // console.log(res, "user logged in");
        if (res) setData(res.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error(error);
        }
      }
    },
    [],
  );

  // const loadPermissions = useCallback(async (userId: number): Promise<void> => {
  //   try {
  //     const res = await UserService.getPermissionById(userId);
  //     const perm = res.data.data.rows.map(
  //       (data: { permission: string }): string => data.permission,
  //     );
  //     setPermissions(perm);
  //     // console.log(res.data.data.rows, "permission");
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error(error.message);
  //     } else {
  //       console.error(error);
  //     }
  //   }
  // }, []);

  useEffect((): void => {
    const token: string | null = localStorage.getItem("token");
    if (token) {
      loadData(token);
    }
  }, [loadData]);

  // useEffect((): void => {
  //   if (data.id) {
  //     loadPermissions(Number(data.id));
  //   }
  // }, [data.id, loadPermissions]);
  return (
    <Button
      color="primary"
      radius="md"
      size="sm"
      endContent={<Icons.AddIcon size={18} />}
      onPress={onPress}
      className={`py-[1.1rem] px-[1.2rem] text-[.8rem] ${
        permissionType && permissions?.includes(permissionType) // permissionType && permissions?.includes(permissionType)
          ? "flex"
          : "hidden"
      }`}
      
      {...props}
    >
      {t("addNew")}
    </Button>
  );
};

export default memo(ButtonAdd);
