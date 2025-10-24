import { DataTable, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Button, ShowToast } from "@/components/hero-ui";
import { Chip, Spinner } from "@heroui/react";
import { MetricCard } from "@/components/ui";
import Filter from "./Filter";

import { useFetch } from "@/hooks/useFetch";
import { useMutation } from "@/hooks/useMutation";
import { useDisclosure } from "@/god-ui";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";

import { CiCreditCard2, CiFilter, CiSearch } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { LuUniversity } from "react-icons/lu";
import { HiOutlineTableCells } from "react-icons/hi2";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
import { RiFilter2Fill } from "react-icons/ri";
import type { DateValue } from "@internationalized/date";

type FilterData = {
  classId: number | null;
  course: number | null;
  programType: string | null;
  promotionNo: number | null;
  termNo: number | null;
  dayOfWeek: string | null;
  status: string | null;
  startDate: DateValue | null;
  endDate: DateValue | null;
};

interface CardProps {
  className: string;
  roomName: string;
  term: string | number;
  year: string | number;
  subject: string;
  timeSlot: string;
  day: string;
  credit: number;
  status: string;
  courseCode: string;
  termType: string;
}

// ==================== CARD COMPONENT ====================
const Card = ({
  className,
  roomName,
  term,
  year,
  subject,
  timeSlot,
  day,
  credit,
  status,
  courseCode,
  termType
}: CardProps) => {
  const getStatusColor = (status: string) =>
    status === "Active" ? "success" : "default";

  return (
    <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-800 space-y-2 shadow-lg shadow-zinc-200/50 dark:shadow-black/10">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-zinc-200/50 dark:bg-zinc-900">
          <LuUniversity size={20} className="text-zinc-500 dark:text-zinc-400" />
        </div>
        <div className="flex items-start justify-between w-full gap-2">
          <div className="flex-1">
            <h2 className="text-base font-medium">{className} - <span className="text-zinc-500 dark:text-zinc-400">{termType}</span></h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{subject}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              {courseCode} 
            </p>
          </div>
          <Chip size="md" variant="dot" color={getStatusColor(status)} radius="full">
            {status}
          </Chip>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        {[
          { label: "Room", value: roomName },
          { label: "Day", value: day },
          { label: "Time", value: timeSlot }
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between text-sm *:text-zinc-500 *:dark:text-zinc-400"
          >
            <span>{label}:</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-evenly p-2 rounded-xl bg-zinc-200/50 dark:bg-black/20">
        {[
          { label: "Year", value: year },
          { label: "Term", value: term },
          { label: "Credit", value: credit }
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col text-center gap-1">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">{label}</span>
            <p className="text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const Index = () => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [view, setView] = useState(new Set(["default"]));
  const [searchKeyword, setSearchKeyword] = useState("");
  const [viewRow, setViewRow] = useState<any>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [filteredData, setFilteredData] = useState<any>(null);

  const defaultFilter: FilterData = useMemo(
    () => ({
      classId: null,
      course: null,
      promotionNo: null,
      termNo: null,
      programType: null,
      dayOfWeek: null,
      status: null,
      startDate: null,
      endDate: null
    }),
    []
  );

  const [filter, setFilter] = useState<FilterData>(defaultFilter);

  // ==================== API Fetch ====================
  const { data, loading, refetch } = useFetch("/lecturer/schedule/list");
  const statistics = data?.data?.statistics;
  const rows = (isFiltered ? filteredData?.rows : data?.data?.rows) || [];

  useEffect(() => {
    console.log(rows, "data res");
  }, [rows]);

  // ==================== Mutation ====================
  const { mutate: filterData, loading: filterLoading } = useMutation({
    onSuccess: (response) => {
      setFilteredData(response?.data);
      setIsFiltered(true);
      onClose();
    },
    onError: (err) => {
      ShowToast({
        color: "error",
        title: "Error",
        description: err.message || "Failed to apply filter"
      });
    }
  });

  const applyFilter = useCallback(async () => {
    const payload: FilterData = {
      ...filter,
      classId: filter.classId ? Number(filter.classId) : null,
      course: filter.course ? Number(filter.course) : null,
      promotionNo: filter.promotionNo ? Number(filter.promotionNo) : null,
      termNo: filter.termNo ? Number(filter.termNo) : null
    };
    await filterData(`/lecturer/schedule/filter`, payload, "POST");
  }, [filter, filterData]);

  const resetFilter = useCallback(() => {
    setFilter(defaultFilter);
    setFilteredData(null);
    setIsFiltered(false);
    refetch();
    onClose();
  }, [defaultFilter, refetch, onClose]);

  // ==================== Computed Values ====================
  const filteredClasses = useMemo(() => {
    if (!searchKeyword) return rows;
    const searchLower = searchKeyword.toLowerCase();
    return rows.filter((item: any) =>
      [item.class_name, item.subject, item.room, item.course_code].some((v) =>
        v?.toLowerCase().includes(searchLower)
      )
    );
  }, [rows, searchKeyword]);

  const cols = useMemo(
    () => [
      { name: t("id"), uid: "schedule_id", sortable: true },
      { name: t("class"), uid: "class_name", sortable: true },
      { name: t("subject"), uid: "subject", sortable: true },
      { name: t("courseCode"), uid: "course_code", sortable: true },
      { name: t("room"), uid: "room_name" },
      { name: t("day"), uid: "day" },
      { name: t("timeSlot"), uid: "time_slot" },
      { name: t("year"), uid: "promotion_no", sortable: true },
      { name: t("term"), uid: "term_no", sortable: true },
      { name: t("credit"), uid: "credit", sortable: true },
      { name: t("status"), uid: "status", sortable: true },
      { name: t("action"), uid: "actions" }
    ],
    [t]
  );

  const visibleCols = [
    "schedule_id",
    "class_name",
    "subject",
    "course_code",
    "room_name",
    "day",
    "time_slot",
    "promotion_no",
    "term_no",
    "credit",
    "status",
    "actions"
  ];

  const cardStats = [
    {
      title: t("totalClass"),
      number: statistics?.total_classes || 0,
      subtitle: t(
        "Represents the total number of active classes assigned to this lecturer."
      ),
      icon: <IoIosCheckmarkCircleOutline size={25} />,
      color: "success",
      type: "class"
    },
    {
      title: t("totalCourse"),
      number: statistics?.total_courses || 0,
      subtitle: t(
        "Shows the total number of distinct courses taught by this lecturer."
      ),
      icon: <PiWarningCircle size={25} />,
      color: "warning",
      type: "course"
    },
    {
      title: t("totalSession"),
      number: statistics?.total_sessions || 0,
      subtitle: t(
        "Indicates the total number of scheduled teaching sessions within the selected period."
      ),
      icon: <SlClose size={22} />,
      color: "danger",
      type: "session"
    }
  ];

  // ==================== RENDER ====================
  return (
    <div className="space-y-4 p-4">
      <Filter
        isOpen={isOpen}
        onClose={onClose}
        filter={filter}
        setFilter={setFilter}
        onApplyFilter={applyFilter}
        onResetFilter={resetFilter}
        filterLoading={filterLoading}
      />

      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{t("myClasses")}</h2>
        <div className="flex items-center gap-2">
          <Button
            onPress={onOpen}
            size="sm"
            radius="md"
            color={isFiltered ? "danger" : "primary"}
            startContent={isFiltered ? <RiFilter2Fill size={18} /> : <CiFilter size={18} />}
          >
            {isFiltered ? t("filtered") : t("filters")}
          </Button>

          <Dropdown>
            <DropdownTrigger>
              <Button
                size="sm"
                color="default"
                isIconOnly
                startContent={<IoSettingsOutline size={20} />}
              />
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Select view mode"
              selectedKeys={view}
              selectionMode="single"
              variant="flat"
              onSelectionChange={(keys: any) => setView(new Set(keys))}
            >
              <DropdownItem startContent={<CiCreditCard2 size={20} />} key="default">
                Default
              </DropdownItem>
              <DropdownItem startContent={<HiOutlineTableCells size={20} />} key="table">
                Table
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* SEARCH BAR */}
      {view.has("default") && (
        <Input
          size="md"
          placeholder={t("search")}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onClear={() => setSearchKeyword("")}
          isClearable
          radius="md"
          startContent={<CiSearch size={20} className="text-default-500" />}
          classNames={{
            clearButton: "text-default-500 hover:text-default-600",
            inputWrapper: "bg-zinc-200 dark:bg-zinc-800 shadow-none focus:bg-zinc-200",
            input: "px-2 font-normal",
            base: "max-w-xs"
          }}
        />
      )}

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cardStats.map((card, index) => (
          <MetricCard
            key={index}
            title={card.title}
            description={card.subtitle}
            value={card.number}
            variant={card.color as "success" | "warning" | "danger" | "secondary"}
            icon={card.icon}
            showProgress={false}
            showChart={!loading}
            colorChart={card.color}
            type={t(card.type)}
            classNames={{ base: "bg-white dark:bg-zinc-800 min-h-32 max-h-32" }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="sm" color="primary" variant="gradient" label={t("loading")} />
        </div>
      ) : view.has("default") ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredClasses.length ? (
            filteredClasses.map((item: any, index: number) => (
              <Card
                key={index}
                className={item.class_name}
                roomName={item.room}
                term={item.term_no}
                year={item.promotion_no}
                subject={item.subject}
                timeSlot={item.time_slot}
                day={item.day}
                credit={item.credit}
                status={item.status}
                courseCode={item.course_code}
                termType={item.term_type}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-zinc-500 dark:text-zinc-400">{t("noClassesFound")}</p>
            </div>
          )}
        </div>
      ) : (
        <DataTable
          rowKey="schedule_id"
          loading={loading}
          dataApi={rows}
          cols={cols}
          visibleCols={visibleCols}
          onView={setViewRow}
          loadData={refetch}
          selectRow={false}
          permissionView="view:classstudent"
          searchKeyword={searchKeyword}
          onSearchInputChange={(e) => setSearchKeyword(e.target.value)}
          handleClearSearch={() => setSearchKeyword("")}
          handleSearch={refetch}
          status={[
            { name: "Active", uid: "Active" },
            { name: "Inactive", uid: "Inactive" }
          ]}
        />
      )}
    </div>
  );
};

export default Index;
