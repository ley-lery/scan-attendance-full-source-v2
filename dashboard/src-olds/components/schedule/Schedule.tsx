/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import ScheduleGrid from "@/components/schedule/ScheduleGrid";
import {  useSchedule } from "@/hooks/useSchedule";
import { downloadJSON } from "@/utils/exportUtils";
import type { Course } from "@/types/schedule";
import axios from "axios";
import ShowToast from "../hero-ui/toast/ShowToast";
import AddClassForm from "./AddClassForm";
import { useDisclosure } from "@/god-ui";

const ScheduleUI = ({ row }: any) => {
  const {
    courses,
    currentSession,
    currentGroup,
    setCurrentSession,
    setCurrentGroup,
    groups,
    deleteCourse,
    importSchedule,
    exportSchedule,
  } = useSchedule();
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    console.log("get class", row);
    const loadAllSchedules = async () => {
      try {
        const res = await axios.get("/api/schedule.json");
        console.log("All group schedules loaded:", res.data.rows);

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


 

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
  };


  
  const group = groups.find(g => g.key === currentGroup);
  const groupLabel = group?.label ?? currentGroup;
  const handleExportJSON = () => {
    const scheduleData = exportSchedule();
    const filename = `${groupLabel}_${currentSession}_Schedule`;
    downloadJSON(scheduleData, filename);
  };

  const handleAddCourse = (day?: any, time?: string) => {
    setEditingCourse(undefined);
    onOpen();
  };



  return (
    <div className="mx-auto space-y-4">
      <ScheduleGrid
        row={row}
        courses={courses}
        session={currentSession}
        onEditCourse={handleEditCourse}
        onDeleteCourse={deleteCourse}
        onAddCourseAtSlot={handleAddCourse}
        turn={currentSession === "Morning" ? "morning" : currentSession === "Afternoon" ? "afternoon" : "evening"}
        onExportJSON={handleExportJSON}
        
      />
      <AddClassForm
        isOpen={isOpen}
        onClose={onClose}
        onSave={() => {}}
        session={currentSession}
      />
    </div>
  );
};

export default ScheduleUI;
