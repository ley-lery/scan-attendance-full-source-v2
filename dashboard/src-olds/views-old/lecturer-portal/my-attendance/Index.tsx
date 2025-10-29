import { Accordion, AccordionItem } from "@heroui/react";
import AttendanceLineChart from "@/components/ui/charts/AttendanceLineChart";
import { Card, Chip, ScrollShadow, Skeleton } from "@heroui/react";
import { useState, useEffect, type JSX } from "react";
import { BiBookOpen } from "react-icons/bi";
import { FaRegCircle } from "react-icons/fa";
import { IoIosCheckmarkCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";
import { PiWarningCircle } from "react-icons/pi";
import { SlClose } from "react-icons/sl";
import AttendanceSheet from "./AttendanceSheet";
import axios from "axios";
import { LiaUniversitySolid } from "react-icons/lia";
import { useTranslation } from "react-i18next";
import { CiCirclePlus } from "react-icons/ci";
import { useLocation } from "react-router-dom";
import CardUi from "@/components/hero-ui/card/CardUi";
import ActionCard from "@/components/hero-ui/card/ActionCard";

type StudentType = {
  attendance: string[];
};

type SubjectType = {
  subject_id: number | string;
  subject_name: string;
  year: number;
  semester: number;
  students: StudentType[];
  session_count: number;
  session_dates: Record<number, string>;
};

type YearDataType = {
  years: number;
  semesters_per_year: number;
  subjects_per_semester: number;
  sessions_per_subject: number;
  months: string[];
  subjects: SubjectType[];
};

type CardType = {
  number: number;
  table_name: string;
  title: string;
  icon: JSX.Element;
  color: string;
};


const calculateAttendanceSummary = (students: StudentType[], sessionCount: number) => {
  const present = Array(sessionCount).fill(0);
  const late = Array(sessionCount).fill(0);
  const absent = Array(sessionCount).fill(0);

  for (let i = 0; i < sessionCount; i++) {
    for (const student of students) {
      const status = student.attendance[i] || "";
      if (status === "P" || status === "1") {
        present[i]++;
      } else if (status === "L") {
        late[i]++;
      } else {
        absent[i]++;
      }
    }
  }

  return { present, late, absent };
};


const Index = () => {
  const {t} = useTranslation();
  const location = useLocation();
  const courseId = location.state?.id;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<YearDataType[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(courseId ? courseId.toString() : null);
  const [session, setSession] = useState<number | null>(null);
  const [charts, setCharts] = useState<{ present: number[]; late: number[]; absent: number[] }>({
    present: [],
    late: [],
    absent: [],
  });
  const [card, setCard] = useState<CardType[]>([]);
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get("/api/student-attendance.json");
        const resData: YearDataType[] = res.data;
        setData(resData);

        if (resData.length > 0) {
          // Try to find the subject by courseId
          let subjectFound: SubjectType | undefined;
          let yearFound: number | null = null;

          if (courseId) {
            for (const yearData of resData) {
              const match = yearData.subjects.find(
                (subj) => subj.subject_id.toString() === courseId.toString()
              );
              if (match) {
                subjectFound = match;
                yearFound = yearData.years;
                break;
              }
            }
          }

          if (subjectFound && yearFound !== null) {
            setSelectedSubjectId(subjectFound.subject_id.toString());
            setSelectedYear(yearFound);
            setSession(subjectFound.session_count);
            updateChartAndCard(subjectFound);
          } else {
            // Default to the first subject
            const defaultSubject = resData[0].subjects[0];
            setSelectedSubjectId(defaultSubject.subject_id.toString());
            setSelectedYear(resData[0].years);
            setSession(defaultSubject.session_count);
            updateChartAndCard(defaultSubject);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);


  const updateChartAndCard = (subject: SubjectType) => {
    const { students, session_count } = subject;
    const summary = calculateAttendanceSummary(students, session_count);
    setCharts(summary);

    const totalPresent = summary.present.reduce((a, b) => a + b, 0);
    const totalLate = summary.late.reduce((a, b) => a + b, 0);
    const totalAbsent = summary.absent.reduce((a, b) => a + b, 0);
    const total = totalPresent + totalLate + totalAbsent;

    setCard([
      {
        number: totalPresent,
        table_name: t("present"),
        title: t("times"),
        icon: <IoIosCheckmarkCircleOutline size={25} />,
        color: "text-green-500",
      },
      {
        number: totalLate,
        table_name: t("late"),
        title: t("times"),
        icon: <PiWarningCircle size={25} />,
        color: "text-yellow-500",
      },
      {
        number: totalAbsent,
        table_name: t("absent"),
        title: t("times"),
        icon: <SlClose size={22} />,
        color: "text-pink-500",
      },
      {
        number: total,
        table_name: t("total"),
        title: t("times"),
        icon: <FaRegCircle size={22} />,
        color: "text-blue-500",
      },
    ]);
  };

  // Get selected year data
  const currentYearData = data.find((y) => y.years === selectedYear);

  // Get selected subject
  const selectedSubject = currentYearData?.subjects.find(
    (subj) => subj.subject_id.toString() === selectedSubjectId
  );

  const handleSubjectChange = (subject: SubjectType) => {
    setSelectedSubjectId(subject.subject_id.toString());
    setSelectedYear(subject.year);
    updateChartAndCard(subject);
  };

  return (
    <div>
      <div className="flex items-start justify-between sticky top-0 z-10 p-4">
        <div>
          <h2 className="text-2xl font-medium">{t('attendance')}</h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Track your attendance across all subjects
          </p>
        </div>
      </div>

      <div className="p-4">
        <ScrollShadow className="h-[36.5rem] 3xl:h-[50rem] space-y-4 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 w-full rounded-lg p-4" />
                ))
              : card.map((data, index) => (
                  <CardUi
                    key={index}
                    title={data.table_name}
                    number={data.number}
                    subtitle={data.title}
                    icon={data.icon}
                    color={data.color}
                  />
                ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Accordion grouped by year */}
            <Card className="card-ui h-96">
              <h2 className="">{t('attendance')}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                Select a subject to view attendance details
              </p>
              <ScrollShadow className="w-full h-full mt-3 has-scrollbar">
                <Accordion defaultExpandedKeys={["1"]}   showDivider={true} >
                  {data.map((yearData) => (
                    <AccordionItem
                      indicator={({ isOpen }) =>
                        isOpen ? <IoIosRemoveCircleOutline size={24} className="rotate-90"/> : <CiCirclePlus size={24}/>
                      }
                      startContent={<div className="bg-zinc-200 dark:bg-zinc-600 p-2 rounded-xl"><LiaUniversitySolid size={22} className="text-green-500"/></div>}
                      key={yearData.years}
                      aria-label={`Year ${yearData.years}`}
                      title={`Year ${yearData.years}`}
                    >
                      <ScrollShadow className="w-full py-2 space-y-2 max-h-72 overflow-y-auto scrollbar-hide">
                        {yearData.subjects.map((subject) => (
                          <ActionCard
                            key={subject.subject_id}
                            description={`Year ${subject.year}, Semester ${subject.semester}`}
                            icon={<BiBookOpen size={24} />}
                            title={subject.subject_name}
                            className={
                              selectedSubjectId === subject.subject_id.toString()
                                ? "border-primary shadow-md"
                                : ""
                            }
                            onPress={() => handleSubjectChange(subject)}
                          />
                        ))}
                      </ScrollShadow>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollShadow>
            </Card>
            {/* Attendance Line Chart */}
            <Card className="card-ui  h-96">
              <AttendanceLineChart
                labels={currentYearData?.months ?? []}
                present={charts.present}
                late={charts.late}
                absent={charts.absent}
              />
            </Card>
          </div>
            {/* Details Section */}
            <Card className="card-ui h-auto space-y-4 min-w-6xl max-w-[75rem] 3xl:max-w-[100rem]">
              <div className="flex items-center justify-between">
                <div>
                  <h2>{t('details')}</h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Details about attendance {t('session')}, {t('date')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip color="primary" variant="dot">
                    Session: {session}
                  </Chip>
                  <Chip color="success" variant="dot">
                    {t('present')}: {card[0]?.number ?? 0}
                  </Chip>
                  <Chip color="warning" variant="dot">
                    {t('late')}: {card[1]?.number ?? 0}
                  </Chip>
                  <Chip color="danger" variant="dot">
                    {t('absent')}: {card[2]?.number ?? 0}
                  </Chip>
                </div>
              </div>

              <div className="overflow-x-auto">
                {selectedSubject && (
                  <AttendanceSheet
                    sessionDates={selectedSubject.session_dates}
                    status={selectedSubject.students.map((s) => s.attendance)}
                    sessionCount={selectedSubject.session_count}
                  />
                )}
              </div>
            </Card>
        </ScrollShadow>
      </div>
    </div>
  );
};

export default Index;
