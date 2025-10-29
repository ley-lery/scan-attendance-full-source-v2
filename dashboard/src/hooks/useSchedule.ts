/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import type { Course, SessionType, Schedule } from "../types/schedule";
import axios from "axios";

export const useSchedule = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentSession, setCurrentSession] = useState<SessionType>("Morning");
  const [currentGroup, setCurrentGroup] = useState<string>("");
  const [groups, setGroups] = useState<{ key: string, label: string }[]>([]);
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const res = await axios.get("/api/group.json"); 
        console.log("Loaded groups:", res.data.rows);
        const formattedGroups = res.data.rows.map((g: any) => ({
          key: g.id,
          label: g.label
        }));
        setGroups(formattedGroups);

        // optionally set default
        if (formattedGroups.length > 0) {
          setCurrentGroup(formattedGroups[0].key);
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    loadGroups();
  }, []);

  const addCourse = useCallback((courseData: Omit<Course, "id">) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
    };
    setCourses((prev) => [...prev, newCourse]);
  }, []);

  const updateCourse = useCallback(
    (courseId: string, courseData: Omit<Course, "id">) => {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === courseId ? { ...courseData, id: courseId } : course,
        ),
      );
    },
    [],
  );

  const deleteCourse = useCallback((courseId: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== courseId));
  }, []);

  // // Import and export functions for schedule data or Fetch schedule from API
  // const importSchedule = useCallback((scheduleData: Schedule) => {
  //   const coursesWithIds = scheduleData.schedule.map((course) => ({
  //     ...course,
  //     id:
  //       course.id ||
  //       Date.now().toString() + Math.random().toString(36).substr(2, 9),
  //   }));

  //   setCourses(coursesWithIds);
  //   setCurrentSession(scheduleData.turn);
  //   setCurrentGroup(scheduleData.group);
  // }, []);

  const importSchedule = ({ turn, group, schedule }: any) => {
    setCurrentSession(turn);
    setCurrentGroup(group);
    setCourses(schedule);
  };
  const exportSchedule = useCallback((): Schedule => {
    console.log("Exported schedule:", groups.find(g => g.key === currentGroup)?.label)
    return {
      turn: currentSession,
      group: currentGroup,
      groupLabel: groups.find(g => g.key === currentGroup)?.label,
      schedule: courses,
    };
  }, [courses, currentSession, currentGroup]);

  const getTotalCredits = useCallback(() => {
    return courses.reduce((total, course) => total + course.credits, 0);
  }, [courses]);

  return {
    courses,
    currentSession,
    currentGroup,
    setCurrentSession,
    setCurrentGroup,
    groups,
    setGroups,
    addCourse,
    updateCourse,
    deleteCourse,
    importSchedule,
    exportSchedule,
    getTotalCredits,
  };
};
