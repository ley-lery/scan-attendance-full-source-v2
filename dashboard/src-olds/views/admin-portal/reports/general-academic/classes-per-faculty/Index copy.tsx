import { DataTable } from "@/components/hero-ui";
import { MetricCard } from "@/components/ui";
import { useMutation } from "@/hooks/useMutation";
import { useEffect, useState } from "react";

const mockData = [
  { title: "Total Faculties", value: 3, icon: "", variant: "primary", type: 'Faculties' },
  { title: "Total Fields", value: 3, icon: "", variant: "primary", type: 'Fields' },
  { title: "Active Faculties", value: 3, icon: "", variant: "success", type: 'Faculties' },
  { title: "Active Fields", value: 3, icon: "", variant: "success", type: 'Fields' },
  { title: "Inactive Faculties", value: 0, icon: "", variant: "danger", type: 'Faculties' },
  { title: "Inactive Fields", value: 1, icon: "", variant: "danger", type: 'Fields' },
];

const Index = () => {

  // ====== Fetch Data ======
  const { mutate: fetchData, loading } = useMutation({
    onSuccess(res) {
      console.log(res.data, "data");
      // Map API response to your MetricCard structure if needed
      // setData(transformedData);
    },
    onError(e) {
      console.error("Error fetching data", e);
    },
  });

  const loadData = () => {
    const payload = {
      faculty: null,
      status: '',
      programType: ''
    };
    fetchData('/reports/general-academic/class-per-faculty/list', payload, 'POST');
  };

  useEffect(() => {
    loadData();
  }, []);

  // ====== Render ======
  return (
    <div className="p-4">
      <DataTable
        loading={loading}
        dataApi={rows}
        cols={cols}
        visibleCols={visibleCols}
        onCreate={onCreate}
        onEdit={onEdit}
        onView={onView}
        onDelete={(id: number) => onDelete(id)}
        loadData={refetch}
        selectRow={false}
        permissionCreate="create:lecturer"
        permissionDelete="delete:lecturer"
        permissionEdit="update:lecturer"
        permissionView="view:lecturer"
        searchKeyword={searchKeyword}
        onSearchInputChange={onSearchInputChange}
        handleClearSearch={handleClearSearch}
        handleSearch={refetch}
        initialPage={pagination.page}
        totalPages={totalPage}
        page={pagination.page}
        onChangePage={(newPage: number) =>
          setPagination((prev) => ({ ...prev, page: newPage }))
        }
        status={status}
      />
    </div>
  );
};

export default Index;
