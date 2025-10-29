import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, DataTable, ShowToast } from "@/components/hero-ui";
import Form from "./Form";
import View from "./View";
import { useFetch } from "@/hooks/useFetch";
import { useDisclosure } from "@/god-ui";
import { useMutation } from "@/hooks/useMutation";
import { useDebounce } from "@/hooks/useDebounce";
import type { Selection } from "@heroui/react";
import { MdFilterTiltShift } from "react-icons/md";
import FilterData from "./FilterData";

type DataUpdateStatus = {
  classStudents: number[]
  status: string | null
}

type DataFilter = {
  faculty: number | null,
  field: number | null,
  classId: number | null,
  student: number | null,
  status: 'All' | 'Active' | 'Inactive' | 'Complete' | null,
  promotionNo: number | null,
  termNo: number | null,
  programType: string | null,
  searchKeyword: string | null,
  page: number,
  limit: number
}

// Custom hook modal
const useViewClosure = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return {
    isOpenView: isOpen,
    onOpenView: onOpen,
    onCloseView: onClose,
  };
};



const Index = () => {
  
  const { t } = useTranslation();

  // ==== State Modal Management ====
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpenView, onOpenView, onCloseView } = useViewClosure();

  // ==== State Management ====
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 500);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<any>(null);
  const [viewRow, setViewRow] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<Selection>(new Set([]));
  const [rows, setRows] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isChangingPageSize, setIsChangingPageSize] = useState(false);

  // ==== Pagination State ====
  const [pagination, setPagination] = useState({
    page: 1,
    limit: parseInt(import.meta.env.VITE_DEFAULT_PAGE_LIMIT) || 10,
  });

  // ==== Default Filter ====
  const defaultFilter: DataFilter = useMemo(
    () => ({
      faculty: null,
      field: null,
      classId: null,
      student: null,
      status: "All",
      promotionNo: null,
      termNo: null,
      programType: null,
      searchKeyword: null,
      page: 1,
      limit: 10,
    }),
    []
  );
  const [filter, setFilter] = useState<DataFilter>(defaultFilter);

  // ================= Start Data Fetching Block =================

  const { data: fetchList, loading: fetchListLoading } = useFetch<{ rows: any[]; total_count: number }>(
    "/studentclass/list", 
    {
      params: {
        page: pagination.page,
        limit: pagination.limit,
      },
      deps: [pagination.page, pagination.limit],
      enabled: !isFiltered && debouncedSearchKeyword.trim() === "",
    }
  );

  // Update rows when fetchList changes
  useEffect(() => {
    if (!isFiltered && fetchList?.data && debouncedSearchKeyword.trim() === "") {
      setRows(fetchList.data.rows || []);
      setTotalPage(Math.ceil((fetchList.data.total || 0) / pagination.limit) || 1);
    }
  }, [fetchList, isFiltered, pagination.limit, debouncedSearchKeyword]);
  
  // Auto-trigger search when debounced keyword changes
  useEffect(() => {
    if (debouncedSearchKeyword.trim() !== "" || isFiltered) {
      refetch();
    }
  }, [debouncedSearchKeyword]);

  // ================= End Data Fetching Block =================

  // ================= Start Mutation Block =================
  
  const { mutate: filterData, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      setRows(response?.data?.rows || []);
      setTotalPage(Math.ceil((response?.data?.total || 0) / pagination.limit) || 1);
      setIsFiltered(true);
      setSelectedIds(new Set([]));
    },
    onError: (err) => {
      console.log(err, "err");
      ShowToast({ 
        color: "error", 
        title: "Error", 
        description: err.response?.data?.message || "Failed to apply filter",
      });
    },
  });

  const { mutate: deleteStudentClass } = useMutation();

  const { mutate: updateStatus, loading: updateStatusLoading } = useMutation({
    onSuccess: async (res) => {
      setTimeout(() => {
        ShowToast({ 
          color: "success", 
          title: "Success", 
          description: res.response?.data?.message || "Status updated successfully" 
        });
      }, 500);      
      await refetch();
      setSelectedIds(new Set([]));
    },
    onError: (err) => {
      setTimeout(() => {
        ShowToast({ 
          color: "error", 
          title: "Error", 
          description: err.response?.data?.message || "Failed to update status" 
        });
      }, 500);
    },
  });

  // ================= End Mutation Block =================

  // ================= Start Table Configuration Block =================

  const cols = useMemo(
    () => [
      { name: t("id"), uid: "id" },
      { name: t("studentNameKh"), uid: "student_name_kh" },
      { name: t("studentNameEn"), uid: "student_name_en" },
      { name: t("className"), uid: "class_name" },
      { name: t("roomName"), uid: "room_name" },
      { name: t("programType"), uid: "program_type" },
      { name: t("termNo"), uid: "term_no" },
      { name: t("facultyCode"), uid: "faculty_code" },
      { name: t("facultyNameEn"), uid: "faculty_name_en" },
      { name: t("facultyNameKh"), uid: "faculty_name_kh" },
      { name: t("fieldCode"), uid: "field_code" },
      { name: t("fieldNameEn"), uid: "field_name_en" },
      { name: t("fieldNameKh"), uid: "field_name_kh" },
      { name: t("status"), uid: "status" },
      { name: t("action"), uid: "actions" },
    ],
    [t],
  );

  const visibleCols = [ 
    "student_name_kh",
    "student_name_en",
    "class_name",
    "room_name",
    "program_type",
    "faculty_name_kh", 
    "field_name_kh", 
    "status", 
    "actions"
  ];

  // ================= End Table Configuration Block =================

  // ================= Start Filter Block =================

  const applyFilterWithPagination = useCallback(
    async (page: number) => {
      const payload: DataFilter = {
        faculty: filter.faculty ? parseInt(String(filter.faculty)) : null,
        field: filter.field ? parseInt(String(filter.field)) : null,
        classId: filter.classId ? parseInt(String(filter.classId)) : null,
        student: filter.student ? parseInt(String(filter.student)) : null,
        status: filter.status === "All" ? null : filter.status,
        promotionNo: filter.promotionNo ? parseInt(String(filter.promotionNo)) : null,
        termNo: filter.termNo ? parseInt(String(filter.termNo)) : null,
        programType: filter.programType || null,
        searchKeyword: debouncedSearchKeyword?.trim() || null,
        page: page,
        limit: pagination.limit,
      };

      await filterData(`/studentclass/filter`, payload, "POST");
    },
    [filter, pagination.limit, filterData, debouncedSearchKeyword]
  );

  const refetch = async () => {
    const payload: DataFilter = {
      faculty: filter.faculty ? parseInt(String(filter.faculty)) : null,
      field: filter.field ? parseInt(String(filter.field)) : null,
      classId: filter.classId ? parseInt(String(filter.classId)) : null,
      student: filter.student ? parseInt(String(filter.student)) : null,
      status: filter.status === "All" ? null : filter.status,
      promotionNo: filter.promotionNo ? parseInt(String(filter.promotionNo)) : null,
      termNo: filter.termNo ? parseInt(String(filter.termNo)) : null,
      programType: filter.programType || null,
      searchKeyword: debouncedSearchKeyword?.trim() || null,
      page: pagination.page,
      limit: pagination.limit,
    };

    await filterData(`/studentclass/filter`, payload, "POST");
  };

  const onFilter = async () => {
    setSelectedIds(new Set());
    setPagination((prev) => ({ ...prev, page: 1 }));
    await applyFilterWithPagination(1);
  };

  const resetFilter = useCallback(() => {
    setSelectedIds(new Set());
    setFilter(defaultFilter);
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [defaultFilter]);

  const handlePageChange = useCallback(
    async (newPage: number) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      if (isFiltered || debouncedSearchKeyword.trim() !== "") {
        await applyFilterWithPagination(newPage);
      }
    },
    [isFiltered, debouncedSearchKeyword, applyFilterWithPagination]
  );
  const handlePageSizeChange = useCallback(
    async (newLimit: number) => {
      startTransition(async () => {
        setIsChangingPageSize(true);
        try {
          setPagination(prev => ({ ...prev, page: 1, limit: newLimit }));
          await new Promise(r => setTimeout(r, 100));

          if (isFiltered || debouncedSearchKeyword.trim() !== "") {
            await applyFilterWithPagination(1);
          }
        } catch (error) {
          ShowToast({
            color: "error",
            title: "Error",
            description: "Failed to change page size",
          });
        } finally {
          setIsChangingPageSize(false);
        }
      });
    },
    [isFiltered, debouncedSearchKeyword, applyFilterWithPagination]
  );

  // ================= End Filter Block =================

  // ================= Start Event Handlers Block =================

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
    setIsFiltered(false);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = async () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
 
  const onCreate = () => {
    setIsEdit(false);
    onOpen();
  };

  const onEdit = (row: object) => {
    setEditRow(row);
    onOpen();
    setIsEdit(true);
  };

  const onView = useCallback(
    (row: any) => {
      setViewRow(row);
      onOpenView();
    },
    [onOpenView]
  );

  const onDelete = async (id: number) => {
    try {
      await deleteStudentClass(`/studentclass/${id}`, id, "DELETE");
      await refetch();
      ShowToast({ 
        color: "success", 
        title: "Success", 
        description: "Student class deleted successfully" 
      });
    } catch (error) {
      console.error(error);
      ShowToast({ 
        color: "error", 
        title: "Error", 
        description: "Failed to delete student class" 
      });
    }
  };

  const handleSelectionChange = useCallback((keys: Selection) => {
    setSelectedIds(keys);
  }, []);

  // ================= End Event Handlers Block =================

  // ================= Start Status Update Block =================

  const onSetActiveStatus = () => onUpdateStatus("Active");
  const onSetInactiveStatus = () => onUpdateStatus("Inactive");
  const onSetCompleteStatus = () => onUpdateStatus("Complete");

  const onUpdateStatus = useCallback(
    async (status: string) => {
      let ids: number[];

      if (selectedIds === "all") {
        ids = rows.map((row: any) => Number(row.id));
      } else {
        ids = Array.from(selectedIds).map((id) => Number(id));
      }

      const payload: DataUpdateStatus = {
        classStudents: ids,
        status: status,
      };

      await updateStatus(`/studentclass/updatestatus`, payload, "POST");
    },
    [selectedIds, rows, updateStatus]
  );

  // ================= End Status Update Block =================

  // ================= Start Header Action Block =================

  const selectedLength = selectedIds === "all" ? rows.length : Array.from(selectedIds).length;

  const notSelected = () => {
    ShowToast({
      title: t("notSelected"),
      description: t("pleaseSelectAtLeastOne"),
      color: "warning",
      delay: 0,
    });
  };

  const headerAction = (
    <div className="flex items-center gap-2">
      {selectedLength > 0 ? (
        <>
          <Button
            onPress={onSetActiveStatus}
            color="success"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={updateStatusLoading}
          >
            {t("Active")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetInactiveStatus}
            color="danger"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={updateStatusLoading}
          >
            {t("Inactive")} ({selectedLength})
          </Button>
          <Button
            onPress={onSetCompleteStatus}
            color="secondary"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={updateStatusLoading}
          >
            {t("Complete")} ({selectedLength})
          </Button>
        </>
      ) : (
        <>
          <Button
            onPress={notSelected}
            color="success"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={updateStatusLoading}
            className="opacity-50"
          >
            {t("Active")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            color="danger"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={updateStatusLoading}
            className="opacity-50"
          >
            {t("Inactive")} ({selectedLength})
          </Button>
          <Button
            onPress={notSelected}
            color="secondary"
            startContent={<MdFilterTiltShift size={16} />}
            isDisabled={updateStatusLoading}
            className="opacity-50"
          >
            {t("Complete")} ({selectedLength})
          </Button>
        </>
      )}
    </div>
  );


  const filterSection =  <FilterData filter={filter} setFilter={setFilter} onApplyFilter={onFilter} onResetFilter={resetFilter} filterLoading={filterLoading} />


  // ================= End Header Action Block =================

  return (
    <div className="p-4">
      
      <Form 
        isOpen={isOpen} 
        onClose={onClose} 
        isEdit={isEdit} 
        row={editRow} 
        loadList={refetch} 
      />

      <View isOpen={isOpenView} onClose={onCloseView} row={viewRow} />

      <DataTable
        rowKey="id"
        loading={fetchListLoading || filterLoading || isChangingPageSize}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onCreate={onCreate}
        onEdit={onEdit}
        onView={onView}
        onDelete={(id: number) => onDelete(id)}
        loadData={refetch}
        selectRow={true}
        selectedKeys={selectedIds}
        onSelectionChange={handleSelectionChange}
        isFiltered={isFiltered}
        permissionCreate="create:classstudent"
        permissionDelete="delete:classstudent"
        permissionEdit="update:classstudent"
        permissionView="view:classstudent"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={handleSearch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={handlePageChange}
        limit={pagination.limit}
        handlePageSizeChange={handlePageSizeChange}
        customizes={{
          header: headerAction,
        }}
        filterSection={filterSection}
        showFilterSection={true}  
      />
    </div>
  );
};

export default Index;