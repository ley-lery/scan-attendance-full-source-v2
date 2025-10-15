/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@heroui/react";
import DataTable from "@/components/hero-ui/table/DataTable";
import Form from "./Form";
import View from "./View";
import facultyService from "@/services/faculty.service";
import sheduleService from "@/services/shedule.service";

const mockData = [
  {
    id: 1,
    class_name: "Class A",
    room_name: "Room 101",
    faculty_name_kh: "Faculty Khmer",
    faculty_name_en: "Faculty English",
    field_name_kh: "បច្ចេកវិទ្យា ព័ត៌មានវិទ្យា​",
    field_name_en: "Informtion Technology",
    promotion_no: "SR2244",
    term_no: "1",
    stage: "1",
    start_date: "2023-10-01",
    end_date: "2024-05-01",
    final_exam_date: "2024-05-15",
    new_term_start_date: "2024-06-01",
    group: "Group A",
    year: "2023",
    mid_term_start_date: "2023-12-15",
    mid_term_end_date: "2024-01-15",
    deleted_date: null,
    status: "Active",
  },
  {
    id: 2,
    class_name: "Class B",
    room_name: "Room 102",
    faculty_name_kh: "Faculty Khmer B",
    faculty_name_en: "Faculty English B",
    field_name_kh: "Field Khmer B",
    field_name_en: "Field English B",
    promotion_no: "SR2245",
    term_no: "2",
    stage: "2",
    start_date: "2023-11-01",
    end_date: "2024-06-01",
    final_exam_date: "2024-06-15",
    new_term_start_date: "2024-07-01",
    group: "Group B",
    year: "2023",
    mid_term_start_date: "2024-01-15",
    mid_term_end_date: "2024-02-15",
    deleted_date: null,
    status: "Inactive",
  },
]

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
  // ==== Params ====
  const params = {
    lecturerId: 1, // Example lecturer ID
    status: 1, // Example status
  };
  // ==== Loading State ====
  const [loading, setLoading] = useState<boolean>(false);


  // ==== Initial Load ====
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await sheduleService.getAll(params);
        console.log("Schedule Data:", res.data);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    }
    loadData();
  }, []);

  // ==== Columns Definitions ====
  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id", sortable: true },
      { name: t("claseName"), uid: "class_name", sortable: true },
      { name: t("roomName"), uid: "room_name", sortable: true },
      { name: t("fucltyNameKh"), uid: "faculty_name_kh" },
      { name: t("fucltyNameEn"), uid: "faculty_name_en" },
      { name: t("fieldNamekh"), uid: "field_name_kh" },
      { name: t("fieldNameEn"), uid: "field_name_en" },
      { name: t("promotionNo"), uid: "promotion_no" },
      { name: t("termNo"), uid: "term_no" },
      { name: t("deletedDate"), uid: "deleted_date" },
      { name: t("status"), uid: "status" },
      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  // ==== Default Visible Columns ====
  const visibleCols = [
    "class_name",
    "room_name",
    "faculty_name_kh",
    "field_name_kh",
    "promotion_no",
    "term_no",
    "status",
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
      const res = await facultyService.getAll({
        page: pagination.page,
        limit: pagination.limit,
      });
      console.log("Faculty Data:", res.data);
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
      const res = await facultyService.search(
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

  const onCreateSchedule = (data: object) => {
    setEditRow(data);
    onOpen();
    setIsEdit(true);
  }

  const onView = (data: object) => {
    setViewRow(data);
    setIsEdit(false);
    onOpenView();
  };

  // const onDelete = async (id: number) => {
  //   try {
  //     await facultyService.delete(id);
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
        dataApi={mockData} // Data from API
        cols={cols} // Columns Definitions
        visibleCols={visibleCols} // Default Visible Columns
        // Table Options
        onCreate={onCreate}
        onEdit={onEdit}
        onView={onView}
        onCreateSchedule={onCreateSchedule}
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
