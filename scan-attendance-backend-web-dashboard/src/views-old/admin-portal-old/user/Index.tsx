import DataTable from "@/components/hero-ui/table/DataTable";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@heroui/react";
import Permission from "./Permission";

const usersData = [
  {
    id: 1,
    name: "Vey Sophanno",
    email: "sophanno@gmail.com",
    phone: "123-456-7890",
    role: "Lecturer",
    status: "Active",
  },
];

const Index = () => {
  const { t } = useTranslation();
  const { isOpen = false, onOpen, onOpenChange } = useDisclosure();

  // ===== All columns defintions =====
  const cols = [
    { name: t("id"), uid: "id", sortable: true },
    { name: t("name"), uid: "name", sortable: true },
    { name: t("email"), uid: "email", sortable: true },
    { name: t("phone"), uid: "phone", sortable: true },
    { name: t("role"), uid: "role", sortable: true },
    { name: t("status"), uid: "status", sortable: true },
    { name: t("action"), uid: "actions" },
  ];

  // ===== default visible columns =====
  const visibleCols = ["name", "email", "phone", "role", "status", "actions"];

  // ==== Load student data ====
  const loadData = async () => {};

  // ===== Actions =====

  // Function to create a new student
  const onCreate = async () => {
    onOpen();
  };

  // Permission users
  const handlePermission = (permission: string) => {
    onOpen();
    console.log("Permission clicked:", permission);
  };

  // Function to delete a student
  const onDelete = async (id: number) => {
    console.log("Delete id", id);
  };

  return (
    <div className="p-4">
      <Permission isOpen={isOpen} onOpenChange={onOpenChange} />
      <DataTable
        dataApi={usersData}
        cols={cols}
        visibleCols={visibleCols}
        onCreate={onCreate}
        onDelete={onDelete}
        loadData={loadData}
        onPermission={handlePermission}
        selectRow={true}
        permissionCreate="studentCreate"
        permissionDelete="studentDelete"
        permissionEdit="studentModify"
        permissionView="studentView"
      />
    </div>
  );
};

export default Index;
