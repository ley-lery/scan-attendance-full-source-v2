import ShowToast from "@/components/hero-ui/toast/ShowToast";
import { Modal, ModalContent, ModalBody, ModalFooter, ModalHeader } from "@/god-ui";
import { useFetch } from "@/hooks/useFetch";
import { useMutation } from "@/hooks/useMutation";
import {
  Button,
  Checkbox,
  Chip,
  ScrollShadow,
  Spinner,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuCircleCheckBig } from "react-icons/lu";

interface PermissionProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: number | null;
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface FormLoadData {
  user: number;
  permissions: Permission[];
}

interface UserPermissionData {
  permissions: Array<{
    role_id: number;
    permissions: number[];
  }>;
}

const Permission = ({ isOpen = false, onClose, roleId }: PermissionProps) => {
  
  if (!isOpen) return null;

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
  
  const { t } = useTranslation();
  
  // Update permission
  const { mutate: updatePermission } = useMutation();

  // Load all permissions available
  const { data: formLoad, loading: formLoadLoading } = useFetch<{ data: FormLoadData }>("/rolepermission/formload");
  
  // Load user's existing permissions
  const { data: userPermissionExists, loading: userPermLoading } = useFetch<{ data: UserPermissionData }>(
    roleId ? `/rolepermission/${roleId}` : ""
  );

  useEffect(() => {
    console.log("formLoad permission", formLoad);
    if (formLoad?.data) {
      // Group permissions by table/resource name
      const grouped: Record<string, Permission[]> = {};
      formLoad.data.permissions.forEach((perm: Permission) => {
        const resource = getResourceFromPermission(perm.name);
        if (!grouped[resource]) {
          grouped[resource] = [];
        }
        grouped[resource].push(perm);
      });
      setGroupedPermissions(grouped);
    }
  }, [formLoad]);

  useEffect(() => {
    const userPermissionExistsData = userPermissionExists?.data?.permissions;
    console.log("userPermissionExistsData", userPermissionExists?.data);
    if (userPermissionExistsData && userPermissionExistsData.length > 0) {
      const userData = userPermissionExistsData[0];
      
      // Set selected permissions
      setSelectedPermissions(userData.permissions || []);
    }
  }, [userPermissionExists]);

  // Check if a specific permission is selected
  const isChecked = (permissionId: number) => selectedPermissions.includes(permissionId);

  // Handle individual checkbox change
  const handleChange = (permissionId: number, checked: boolean) => {
    setSelectedPermissions((prev) => {
      if (checked) {
        // Add only if not already present and not null
        return permissionId != null && !prev.includes(permissionId) 
          ? [...prev, permissionId] 
          : prev;
      } else {
        // Remove the permission
        return prev.filter((id) => id !== permissionId);
      }
    });
  };

  // Check if all permissions for a resource are selected
  const isAllChecked = (resource: string) => {
    const resourcePerms = groupedPermissions[resource] || [];
    return resourcePerms.length > 0 && resourcePerms.every((perm) => selectedPermissions.includes(perm.id));
  };

  // Handle "All" checkbox for a specific resource
  const handleAllChange = (resource: string, checked: boolean) => {
    const resourcePerms = groupedPermissions[resource] || [];
    // Filter out any null/undefined IDs
    const resourcePermIds = resourcePerms.map(p => p.id).filter(id => id != null);
    
    setSelectedPermissions((prev) => {
      const filtered = prev.filter((id) => !resourcePermIds.includes(id));
      return checked ? [...filtered, ...resourcePermIds] : filtered;
    });
  };

  // Handle "Unselect All"
  const handleUnselectAll = () => {
    setSelectedPermissions([]);
    ShowToast({ color: "warning", description: t("allPermissionsDeselected") });
  };

  // Handle "Select All"
  const handleSelectAll = () => {
    const allPermissionIds = Object.values(groupedPermissions)
      .flat()
      .map(perm => perm.id)
      .filter(id => id != null); // Filter out null/undefined
    setSelectedPermissions(allPermissionIds);
    ShowToast({ color: "success", description: t("allPermissionsSelected") });
  };

  // Handle "Apply"
  const onApply = async () => {
    if (!roleId) {
      ShowToast({ color: "danger", description: t("roleIdRequired") });
      return;
    }

    // Filter out null/undefined values and ensure unique IDs
    const validPermissions = [...new Set(selectedPermissions.filter(id => id != null))];

    const payload = {
      role: roleId,
      permissions: validPermissions,
    };

    try {
      console.log("Applied Permissions:", payload);
      await updatePermission('/rolepermission', payload, "POST");
      ShowToast({ color: "success", description: t("permissionApplied") });
      onClose();
    } catch (error) {
      ShowToast({ color: "danger", description: t("permissionError") });
      console.error("Error applying permissions:", error);
    }
  };

  // Get action and resource from permission name (e.g., "update:user" -> {action: "update", resource: "user"})
  const getActionFromPermission = (permName: string): string => {
    const parts = permName.split(":");
    return parts[0] || permName; // First part is the action
  };
  
  const getResourceFromPermission = (permName: string): string => {
    const parts = permName.split(":");
    return parts[1] || parts[0]; // Second part is the resource/table
  };

  // Standard actions for table headers for CRUD
  const actions = ["create", "view", "update", "delete"];

  // student leave actions for request, approve, reject
  const studentLeaveActions = ["request", "approve", "reject", "cancel"];

  const isLoading = formLoadLoading || userPermLoading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      isDraggable
      radius="lg"
    >
      <ModalContent>
        {() => (
          <>
            {
              isLoading && (
                <div className="flex items-center justify-center min-h-36 inset-0 absolute bg-white/20 dark:bg-black/20 backdrop-blur-sm z-50">
                <Spinner variant="spinner" size="sm" label={t("loading")} />
              </div>
              )
            }
            <ModalHeader>
              <h2>{t("permission")}</h2>
            </ModalHeader>
            <ModalBody>
              <ScrollShadow className="has-scrollbar h-full max-h-96">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10 bg-white dark:bg-[#18181b] shadow-sm">
                    <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#18181b]">
                      <th className="p-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {t("table")}
                      </th>
                      {actions.map((action) => (
                        <th key={action} className="p-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          {t(action)}
                        </th>
                      ))}
                      <th className="p-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {t("all")}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {Object.entries(groupedPermissions).map(([resource, perms]) => (
                      <tr key={resource} >
                        <td className="p-3 font-medium capitalize text-zinc-800 dark:text-zinc-100">
                          {t(resource)}
                        </td>

                        {actions.map((action) => {
                          const perm = perms.find((p: Permission) => getActionFromPermission(p.name) === action);
                          return (
                            <td key={action} className="p-3">
                              {perm ? (
                                <Checkbox
                                  className="ml-1"
                                  isSelected={isChecked(perm.id)}
                                  onChange={(e) => handleChange(perm.id, e.target.checked)}
                                />
                              ) : (
                                <Chip color="danger" variant="flat" size="sm" radius="sm" className="ml-2.5">--</Chip>
                              )}
                            </td>
                          );
                        })}

                        <td className="p-3">
                          <Checkbox
                            isSelected={isAllChecked(resource)}
                            onChange={(e) => handleAllChange(resource, e.target.checked)}
                            className="pl-2"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Student Leave Permissions: don't show action permission without actions request, approve, reject */}
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10 bg-white dark:bg-[#18181b] shadow-sm">
                    <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-[#18181b]">
                      <th className="p-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {t("studentLeave")}
                      </th>
                      {studentLeaveActions.map((action) => (
                        <th key={action} className="p-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                          {t(action)}
                        </th>
                      ))}
                      <th className="p-3 text-left text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {t("all")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                  {Object.entries(groupedPermissions)
                    .filter(([resource]) => resource === "studentleave")
                    .map(([resource, perms]) => (
                      <tr key={resource}>
                        <td className="p-3 font-medium capitalize text-zinc-800 dark:text-zinc-100">
                          {t(resource)}
                        </td>

                        {studentLeaveActions.map((action) => {
                          const perm = perms.find((p: Permission) => getActionFromPermission(p.name) === action);
                          return (
                            <td key={action} className="p-3">
                              {perm ? (
                                <Checkbox
                                  className="ml-1"
                                  isSelected={isChecked(perm.id)}
                                  onChange={(e) => handleChange(perm.id, e.target.checked)}
                                />
                              ) : (
                                <Chip color="danger" variant="flat" size="sm" radius="sm" className="ml-2.5">--</Chip>
                              )}
                            </td>
                          );
                        })}

                        <td className="p-3">
                          <Checkbox
                            isSelected={isAllChecked(resource)}
                            onChange={(e) => handleAllChange(resource, e.target.checked)}
                            className="pl-2"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
                </table>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" color="danger" size="sm" onPress={onClose}>
                {t("cancel")}
              </Button>

              <Button
                disabled={selectedPermissions.length === 0 || isLoading}
                onPress={handleUnselectAll}
                variant="solid"
                color="danger"
                size="sm"
              >
                {t("deselectAll")}
              </Button>
              
              <Button
                disabled={
                  isLoading ||
                  (selectedPermissions.length !== 0 &&
                  selectedPermissions.length === Object.values(groupedPermissions).flat().length)
                }
                onPress={handleSelectAll}
                variant="solid"
                color="primary"
                size="sm"
              >
                {t("selectAll")}
              </Button>
              
              <Button
                disabled={isLoading || !roleId}
                variant="solid"
                color="primary"
                endContent={<LuCircleCheckBig size={16} />}
                onPress={onApply}
                size="sm"
              >
                {t("apply")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Permission;