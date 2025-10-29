/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@heroui/react";
import { DataTable } from "@/components/hero-ui";
import Form from "./Form";
import View from "./View";
import lecturerCourseService from "@/services/lecturer-course.service";

// Custom hook for separate view dialog
const useViewClosure = () => {
  const { isOpen, onOpen, onOpenChange, ...rest } = useDisclosure();
  return {
    isOpenView: isOpen,
    onOpenView: onOpen,
    onOpenChangeView: onOpenChange,
    ...rest,
  };
};

const Index = () => {
  const { t } = useTranslation();
  // ==== State Modal Management ====
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpenView, onOpenView, onOpenChangeView } = useViewClosure();
  // ==== State Management ====
  const [data, setData] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [editRow, setEditRow] = useState<any>(null);
  const [viewRow, setViewRow] = useState<any>(null);
  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
    totalPage: 1,
  });
  // ==== Loading State ====
  const [loading, setLoading] = useState<boolean>(false);

  // ==== Columns Definitions ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("lecturerCode"), uid: "lecturer_code", sortable: true },
      { name: t("lecturerNameEn"), uid: "lecturer_name_en", sortable: true },
      { name: t("lecturerNameKh"), uid: "lecturer_name_kh" },
      { name: t("courseCode"), uid: "course_code", sortable: true },
      { name: t("courseNameEn"), uid: "course_name_en", sortable: true },
      { name: t("courseNameKh"), uid: "course_name_kh" },
      { name: t("deleltedDate"), uid: "deleted_date" },

      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  // ==== Default Visible Columns ====
  const visibleCols = [
    "id",
    "lecturer_code",
    "lecturer_name_en",
    "lecturer_name_kh",
    "course_code",
    "course_name_en",
    "course_name_kh",
    "actions",
  ];

  // ==== Status Options ====
  const status = [
    { name: "Active", uid: "Active" },
    { name: "Inactive", uid: "Inactive" },
  ];

  // ==== Load data on mount or when pagination/search changes ====
  useEffect(() => {
    if (searchKeyword.trim() !== "") {
      handleSearch();
    } else {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  // ==== Load All Data ====
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await lecturerCourseService.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      const rows = res.data && res.data.rows ? res.data.rows : [];
      const totalCount = res.data?.total_count || 0;
      const totalPage = Math.ceil(totalCount / pagination.limit) || 1;

      setData(rows);
      setPagination((prev) => ({ ...prev, totalPage }));
      setLoading(false);
    } catch (error) {
      console.error("Error loading faculty data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==== Search with Keyword ====
  const handleSearch = async () => {
    try {
      const res = await lecturerCourseService.search(
        searchKeyword,
        pagination.page,
        pagination.limit,
      );
      const rows = res.data && res.data.rows ? res.data.rows : [];
      const totalCount = rows[0]?.total_count || 0;
      const totalPage = Math.ceil(totalCount / pagination.limit) || 1;

      setData(rows);
      setPagination((prev) => ({ ...prev, totalPage }));
    } catch (error) {
      console.error("Error searching faculties:", error);
    }
  };

  // ==== Reset Page to 1 When Searching ====
  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
    // handleSearch();
  };

  // ==== Clear search when input is empty
  const handleClearSearch = () => {
    setSearchKeyword("");
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadData();
  };

  // ==== Handle Create/Edit/View/Delete ====
  const onCreate = () => {
    setIsEdit(false);
    onOpen();
  };

  const onEdit = (data: object) => {
    setEditRow(data);
    onOpen();
    setIsEdit(true);
  };

  const onView = (data: object) => {
    setViewRow(data);
    setIsEdit(false);
    onOpenView();
  };

  // const onDelete = async (id: number) => {
  //   try {
  //     await lecturerCourseService.delete(id);
  //     ShowToast({ color: "success", description: t("deletedSuccess") });
  //     loadData();
  //   } catch (error) {
  //     console.error("Error deleting faculty:", error);
  //   }
  // }

  const formProps = {
    isOpen,
    onOpenChange,
    isEdit,
    row: editRow,
    loadList: loadData,
  };
  const viewProps = {
    isOpen: isOpenView,
    onOpenChange: onOpenChangeView,
    row: viewRow,
  };

  return (
    <div className="p-4">
      <Form {...formProps} />
      <View {...viewProps} />

      <DataTable
        loading={loading} // Loading state
        dataApi={data} // Data from API
        cols={cols} // Columns Definitions
        visibleCols={visibleCols} // Default Visible Columns
        // Table Options
        onCreate={onCreate}
        onEdit={onEdit}
        onView={onView}
        // onDelete={onDelete}
        loadData={loadData}
        selectRow={false}
        // Permissions
        permissionCreate="studentCreate"
        permissionDelete="studentDelete"
        permissionEdit="studentModify"
        permissionView="studentView"
        // Search
        searchKeyword={searchKeyword}
        onSearchInputChange={(e: any) => onSearchInputChange(e)}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
        // Pagination
        initialPage={pagination.page}
        totalPages={pagination.totalPage}
        page={pagination.page}
        onChangePage={(newPage: any) =>
          setPagination((prev) => ({ ...prev, page: newPage }))
        }
        // Status Options
        status={status}
      />
    </div>
  );
};

export default Index;
