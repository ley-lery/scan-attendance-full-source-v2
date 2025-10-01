import ShowToast from "@/components/hero-ui/toast/ShowToast";
import RouteFallback from "@/components/RouteFallback";
import { Avatar, Button,Checkbox, ModalBody,ModalContent,ModalFooter,ModalHeader,ScrollShadow,Table,TableBody,TableCell,TableColumn,TableHeader,TableRow,Tooltip,} from "@heroui/react";
import { Suspense, lazy } from "react";
const Modal = lazy(() =>
  import("@heroui/react").then((mod) => ({ default: mod.Modal })),
);
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { LuCircleCheckBig } from "react-icons/lu";
import { RiFullscreenExitFill } from "react-icons/ri";
import { SlSizeFullscreen } from "react-icons/sl";

let permissionFromApi = [
  "facultyCreate",
  "studentCreate",
  "studentEdit",
  "studentView",
  "courseCreate",
  "courseEdit",
];

interface PermissionProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const permissions = [
  "faculty",
  "student",
  "field",
  "course",
  "program",
  "lecturer",
  "lecturerCourse",
  "class",
  "classSchedule",
  "classAttendance",
  "classStudent",
  "lecturerLeave",
  "studentLeave",
];
const actions = ["Create", "Edit", "Delete", "View"];

const Permission = ({ isOpen = false, onOpenChange }: PermissionProps) => {
  const targetRef = useRef(null);
  const [formData, setFormData] = useState<string[]>(permissionFromApi);
  const [screenSize, setScreenSize] = useState<
    | "5xl"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "full"
    | undefined
  >("5xl");
  const { t } = useTranslation();

  // ===== Load permissions =====
  useEffect(() => {
    setFormData(permissionFromApi);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionFromApi]);

  // ===== Actions =====

  // Handle checkbox changes for individual permissions
  const handleChange = (value: string, checked: boolean) => {
    setFormData((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };
  const isChecked = (value: string) => formData.includes(value);

  // Handle "All" checkbox changes
  const handleAllChange = (perm: string, checked: boolean) => {
    const related = actions.map((act) => `${perm}${act}`);
    setFormData((prev) => {
      const filtered = prev.filter((v) => !related.includes(v));
      return checked ? [...filtered, ...related] : filtered;
    });
  };
  const isAllChecked = (perm: string) =>
    actions.every((act) => formData.includes(`${perm}${act}`));

  // Handle "Unselect All"
  const handleUnselectAll = () => {
    setFormData([]);
    ShowToast({ color: "warning", description: t("allPermissionsDeselected") });
  };
  // Handle "Select All"
  const handleSelectAll = () => {
    const allPermissions = permissions.flatMap((perm) =>
      actions.map((act) => `${perm}${act}`),
    );
    setFormData(allPermissions);
    ShowToast({ color: "success", description: t("allPermissionsSelected") });
  };

  // Handle "Apply"
  const onApply = async () => {
    try {
      permissionFromApi = formData;
      console.log("Applied Permissions:", permissionFromApi);
      ShowToast({ color: "success", description: t("permissionApplied") });
      onOpenChange?.(false);
    } catch (error) {
      ShowToast({ color: "danger", description: t("permissionError") });
      console.error("Error applying permissions:", error);
    }
  };
  const toggleScreen = () => {
    setScreenSize((prev) => (prev === "5xl" ? "full" : "5xl"));
  };

  return (
    <Suspense fallback={<RouteFallback />}>
      <Modal
        ref={targetRef}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size={screenSize}
        radius="lg"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2>{t("permission")}</h2>
                <Tooltip
                  content={
                    screenSize === "5xl" ? t("fullScreen") : t("exitFullScreen")
                  }
                  closeDelay={0}
                >
                  <Button
                    onPress={toggleScreen}
                    className="absolute right-10 top-1"
                    variant="light"
                    isIconOnly
                    size="sm"
                    radius="full"
                  >
                    {screenSize === "5xl" ? (
                      <SlSizeFullscreen size={12} className="rotate-180" />
                    ) : (
                      <RiFullscreenExitFill size={14} />
                    )}
                  </Button>
                </Tooltip>
              </ModalHeader>
              <ModalBody>
                {/* user  */}
                <div className="mb-2 flex items-center gap-2">
                  <Avatar size="lg" />
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-gray-800 dark:text-gray-100">
                      Vey Sophanno
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-200">
                      Lecturer
                    </span>
                  </div>
                </div>
                <ScrollShadow className="has-scrollbar h-full">
                  <Table
                    removeWrapper
                    isHeaderSticky
                    classNames={{
                      th: [
                        "bg-white dark:bg-[#18181b] text-default-500 border-b border-divider shadow-none",
                      ],
                    }}
                  >
                    <TableHeader>
                      <TableColumn>{t("table")}</TableColumn>
                      <>
                        {actions.map((action) => (
                          <TableColumn key={action}>
                            {t(action.toLowerCase())}
                          </TableColumn>
                        ))}
                      </>
                      <TableColumn>{t("all")}</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((perm) => (
                        <TableRow key={perm}>
                          <TableCell>
                            {t(perm.charAt(0) + perm.slice(1))}
                          </TableCell>
                          {actions.map((action) => {
                            const value = `${perm}${action}`;
                            return (
                              <TableCell key={value}>
                                <Checkbox
                                  isSelected={isChecked(value)}
                                  onChange={(e) =>
                                    handleChange(value, e.target.checked)
                                  }
                                  className="ml-0.5"
                                />
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            <Checkbox
                              isSelected={isAllChecked(perm)}
                              onChange={(e) =>
                                handleAllChange(perm, e.target.checked)
                              }
                              className="ml-0.5"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" color="danger" onPress={onClose}>
                  {t("cancel")}
                </Button>

                <Button
                  isDisabled={formData.length === 0}
                  onPress={handleUnselectAll}
                  variant="solid"
                  color="danger"
                >
                  {t("deselectAll")}
                </Button>
                <Button
                  isDisabled={
                    formData.length !== 0 &&
                    formData.length === permissions.length * actions.length
                  }
                  onPress={handleSelectAll}
                  variant="solid"
                  color="primary"
                >
                  {t("selectAll")}
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  endContent={<LuCircleCheckBig size={16} />}
                  onPress={onApply}
                >
                  {t("apply")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Suspense>
  );
};

export default Permission;
