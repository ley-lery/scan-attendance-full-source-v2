/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import Header from "@/components/schedule/ScheduleHeader";
import ScheduleGrid from "@/components/schedule/ScheduleGrid";
import AddClassForm from "@/components/schedule/AddClassForm";
import {  useSchedule } from "@/hooks/useSchedule";
import { downloadJSON, exportToPDF, exportToPNG, parseJSONFile } from "@/utils/exportUtils";
import type { Course } from "@/types/schedule";
import { useDisclosure } from "@heroui/react";
import axios from "axios";
import ShowToast from "../hero-ui/toast/ShowToast";

const usePrintClosure = () => {
  const { isOpen, onOpen, onOpenChange, ...rest } = useDisclosure();
  return {
    isOpenPrint: isOpen,
    onOpenPrint: onOpen,
    onOpenChangePrint: onOpenChange,
    ...rest,
  };
};


const ScheduleUI = ({ row }: any) => {
  const {
    courses,
    currentSession,
    currentGroup,
    setCurrentSession,
    setCurrentGroup,
    groups,
    addCourse,
    updateCourse,
    deleteCourse,
    importSchedule,
    exportSchedule,
    getTotalCredits,
  } = useSchedule();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpenPrint, onOpenPrint, onOpenChangePrint } = usePrintClosure();
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [selectedDay, setSelectedDay] = useState<undefined>();
  const [allSchedules, setAllSchedules] = useState<any[]>([]);

  useEffect(() => {
    console.log("get class", row);
    const loadAllSchedules = async () => {
      try {
        const res = await axios.get("/api/schedule.json");
        console.log("All group schedules loaded:", res.data.rows);
        setAllSchedules(res.data.rows);

        // Auto-load first schedule by default
        const firstSchedule = res.data.rows[0];
        if (firstSchedule) {
          importSchedule(firstSchedule);
          setCurrentGroup(firstSchedule.group);
          setCurrentSession(firstSchedule.turn);
        }

      } catch (error) {
        console.error("Error loading all schedules:", error);
        ShowToast({
          color: "error",
          description: "Failed to load schedule data."
        });
      }
    };
    loadAllSchedules();
  }, []);


  const handleAddClass = () => {
    setEditingCourse(undefined);
    onOpen();
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    onOpen();
  };

  const handleSaveCourse = (courseData: Omit<Course, "id">) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
    } else {
      addCourse(courseData);
    }
    onOpenChange();
    setEditingCourse(undefined);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {

    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const scheduleData = await parseJSONFile(file);
      importSchedule(scheduleData);
      ShowToast({
        color: "success",
        description: "Schedule imported successfully!",
      });
    } catch (error) {
      console.error("Error importing file:", error);
      ShowToast({
        color: "error",
        description: "Failed to import schedule. Please check the file format.",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const group = groups.find(g => g.key === currentGroup);
  const groupLabel = group?.label ?? currentGroup;
  const handleExportJSON = () => {
    const scheduleData = exportSchedule();
    const filename = `${groupLabel}_${currentSession}_Schedule`;
    downloadJSON(scheduleData, filename);
  };

  const handleExportPNG = () => {
    const filename = `${groupLabel}_${currentSession}_Schedule`;
    exportToPNG("schedule-grid", filename);
  };
  const handleExportPdf = () => {
    const filename = `${currentGroup}_${currentSession}_Schedule`;
    exportToPDF("schedule-grid", filename, "landscape");
    ShowToast({
      color: "info",
      description: "PDF export is not implemented yet.",
    });
  }

  const handleAddCourse = (day?: any, time?: string) => {
    setEditingCourse(undefined);
    setSelectedDay(day);
    setSelectedTime(time);
    onOpen();
  };

  const handleGroupChange = (group: {currentKey: number}) => {
    setCurrentGroup(Number(group.currentKey).toString());
    const scheduleForGroup = allSchedules.find(row => row.group ===  group.currentKey);
    if (scheduleForGroup) {
      importSchedule(scheduleForGroup);
      setCurrentSession(scheduleForGroup.turn); 
      ShowToast({
        color: "success",
        description: `Loaded schedule for group ${groupLabel}`
      });
    } else {
      ShowToast({
        color: "warning",
        description: `No schedule found for group`
      });
    }
  };


  return (
    <div>
      <div className="mx-auto space-y-4">
        <Header
          currentSession={currentSession}
          currentGroup={currentGroup}
          totalCredits={getTotalCredits()}
          onSessionChange={setCurrentSession}
          onGroupChange={handleGroupChange}
          onAddClass={handleAddClass}
          onImport={handleImport}
          onOpenPrintModal={onOpenPrint}
        />

        <ScheduleGrid
          row={row}
          courses={courses}
          session={currentSession}
          onEditCourse={handleEditCourse}
          onDeleteCourse={deleteCourse}
          onAddCourseAtSlot={handleAddCourse}
          turn={currentSession === "Morning" ? "morning" : currentSession === "Afternoon" ? "afternoon" : "evening"}
          isOpenPrintModal={isOpenPrint}
          onOpenChangePrintModal={onOpenChangePrint}
          onExportJSON={handleExportJSON}
          onExportPNG={handleExportPNG}
        />

        <AddClassForm
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onSave={handleSaveCourse}
          editingCourse={editingCourse}
          session={currentSession}
          initialDay={selectedDay}
          initialTimeSlot={selectedTime}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ScheduleUI;
