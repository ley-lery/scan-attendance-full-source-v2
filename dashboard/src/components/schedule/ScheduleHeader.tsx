import React from "react";
import type { SessionType } from "@/types/schedule";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
} from "@heroui/react";
import {  CiImport } from "react-icons/ci";
import { BsPlus } from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoPrintOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import { useSchedule } from "@/hooks/useSchedule";

interface HeaderProps {
  currentSession: SessionType;
  currentGroup: string;
  totalCredits: number;
  totalCourses?: number;
  onSessionChange: (session: SessionType) => void;
  onGroupChange: (group: string) => void;
  onAddClass: () => void;
  onImport: () => void;
  onOpenPrintModal?: () => void;
}

const ScheduleHeader: React.FC<HeaderProps> = ({
  currentSession,
  currentGroup,
  totalCredits,
  totalCourses = 0,
  onSessionChange,
  onGroupChange,
  onAddClass,
  onImport,
  onOpenPrintModal,
}) => {
  const { t } = useTranslation();
  const { groups }= useSchedule();
  const group = groups.find(g => g.key === currentGroup);
  const groupLabel = group?.label ?? currentGroup;
  const groupKey = group?.key ?? "1";
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-semibold text-default-900 dark:text-default-100">
              Schedule
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {groupLabel} - {t(currentSession.toLocaleLowerCase())}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
            <Select 
              value={currentGroup}
              defaultSelectedKeys={[groupKey]}
              onSelectionChange={(key) => onGroupChange(key as string)} 
              className="min-w-32"
            >
              {groups.map((group) => (
                <SelectItem className={`${group.key === groupKey ? 'pointer-events-none': 'pointer-events-auto'}`} key={group.key}>{group.label}</SelectItem>
              ))}
            </Select>

              <div className="flex rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-800">
                <Button
                  onPress={() => onSessionChange("Morning")}
                  color={currentSession === "Morning" ? "primary" : "default"}
                  variant={currentSession === "Morning" ? "solid" : "light"}
                  className="py-[1.1rem] px-[1.2rem] text-[.8rem]"
                >
                  {t("morning")}
                </Button>
                <Button
                  onPress={() => onSessionChange("Afternoon")}
                  color={currentSession === "Afternoon" ? "primary" : "default"}
                  variant={currentSession === "Afternoon" ? "solid" : "light"}
                  className="py-[1.1rem] px-[1.2rem] text-[.8rem]"
                >
                  {t("afternoon")}
                </Button>
                <Button
                  onPress={() => onSessionChange("Evening")}
                  color={currentSession === "Evening" ? "primary" : "default"}
                  variant={currentSession === "Evening" ? "solid" : "light"}
                  className="py-[1.1rem] px-[1.2rem] text-[.8rem]"
                >
                  {t("evening")}
                </Button>
              </div>
            </div>

            {/* Group Selection */}
            {/* <Input
              value={currentGroup}
              onChange={(e) => onGroupChange(e.target.value)}
              placeholder="e.g., A1IT"
              className="min-w-72"
            /> */}
          </div>

          <div className="flex items-center gap-2">
            <Button
              onPress={onAddClass}
              color="primary"
              startContent={<BsPlus size={24} />}
              className="py-[1.1rem] px-[1.2rem] text-[.8rem]"
            >
              {t("addClass")}
            </Button>

            
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <Button
                  isIconOnly
                  variant="solid"
                >
                  <HiOutlineDotsVertical size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 border border-zinc-200 dark:border-default-200">
                <div className="py-2 w-full">
                  <Button
                    onPress={onImport}
                    color="default"
                    endContent={<CiImport size={20} className="text-green-500"/>}
                    variant="light"
                    className="w-full justify-between"
                  >
                    Import Json file
                  </Button> 
                  <Button
                    onPress={onOpenPrintModal}
                    color="default"
                    endContent={<IoPrintOutline size={20} className="text-purple-500"/>}
                    variant="light"
                    className="w-full justify-between"
                  >
                    Print as Json/jpeg/Pdf
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="w-full border border-zinc-200 shadow-none dark:border-default-100 dark:bg-zinc-800">
          <div className="flex p-4">
            <div className="flex flex-col gap-y-2">
              <div className="text-small font-medium text-default-500">
                Courses
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-cyan-500">
                  {totalCourses}
                </h2>
                <p className="text-sm text-zinc-500">Couse</p>
              </div>
            </div>
          </div>
          <Chip
            variant="light"
            className="absolute right-2 top-2 flex items-center gap-2 text-zinc-500"
          >
            <IoBookOutline size={24} />
          </Chip>
        </Card>
        <Card className="w-full border border-zinc-200 shadow-none dark:border-default-100 dark:bg-zinc-800">
          <div className="flex p-4">
            <div className="flex flex-col gap-y-2">
              <div className="text-small font-medium text-default-500">
                Credits
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-semibold text-cyan-500">
                  {totalCredits}
                </h2>
                <p className="text-sm text-zinc-500">Credit</p>
              </div>
            </div>
          </div>
          <Chip
            variant="light"
            className="absolute right-2 top-2 flex items-center gap-2 text-zinc-500"
          >
            <CiCalendar size={24} />
          </Chip>
        </Card>
      </div> */}
    </div>
  );
};

export default ScheduleHeader;
