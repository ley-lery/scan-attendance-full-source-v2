import CardUi from "@/components/hero-ui/card/CardUi";
import { Button, Card, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, ScrollShadow } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { PiWarningCircle } from "react-icons/pi";
import { IoIosArrowDown, IoIosCheckmarkCircleOutline } from "react-icons/io";
import { SlClose } from "react-icons/sl";
import { FaRegCircle } from "react-icons/fa";
import ActionCard from "@/components/hero-ui/card/ActionCard";
import TableUi from "@/components/hero-ui/table/Table";
import SkeletonUi from "@/components/hero-ui/loading/Skeleton";
import { Popup } from "@/components/ui";
import { DatePicker } from "@/components/hero-ui";

const yourClass = [
  {
    id: 1,
    class_name: "Database System",
    class_code: "DBS101",
    class_room: "Room 101",
    student_count: 100,
  },
  {
    id: 2,
    class_name: "Frontend Development",
    class_code: "FES101",
    class_room: "Room 102",
    student_count: 100,
  },
  {
    id: 3,
    class_name: "Backend Development",
    class_code: "BES101",
    class_room: "Room 103",
    student_count: 100,
  },
  {
    id: 4,
    class_name: "Mobile Development",
    class_code: "MES101",
    class_room: "Room 104",
    student_count: 100,
  },
]

const studentClasses = [
 {
  id: 1,
  class_name: "Database System",
  class_code: "DBS101",
  class_room: "Room 101",
  student_count: 100,
  lecturer_id: 1,
  lecturer: "Lor Soth",
  students: [
    {
      id: 1,
      name: "ឡី​​​ ឡឺយ - Ley Lery",
      email: "leylery@gmail.com",
      status: "Active",
    },
    {
      id: 2,
      name: "ដាន ដានី - Dan Dan",
      email: "dandan@gmail.com",
      status: "Active",
    },
    {
      id: 3,
      name: "សូរិ​ យា - Soury",
      email: "soury@gmail.com",
      status: "Active",
    },
    {
      id: 4,
      name: "សូរិ​ យា - Soury",
      email: "soury@gmail.com",
      status: "Active",
    },
    {
      id: 5,
      name: "សូរិ​ យា - Soury",
      email: "soury@gmail.com",
      status: "Active",
    },
    {
      id: 6,
      name: "សូរិ​ យា - Soury",
      email: "soury@gmail.com",
      status: "Active",
    },
    {
      id: 7,
      name: "សូរិ​ យា - Soury",
      email: "soury@gmail.com",
      status: "Active",
    },
  ],
 }
]

interface Cards {
  title: string;
  number: number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

const dataApi = [
  {
    id: 1,
    session: "Session 1",
    student: "John Doe",
    class: "Class 1",
    date: "2021-01-01",
    clock_in: "08:00",
    status: "Present",
  },
  {
    id: 2,
    session: "Session 2",
    student: "Jane Doe",
    class: "Class 2",
    date: "2021-01-02",
    clock_in: "08:00",
    status: "Absent",
  },
  {
    id: 3,
    session: "Session 3",
    student: "John Doe",
    class: "Class 3",
    date: "2021-01-03",
    clock_in: "08:00",
    status: "Late",
  }
]



const Index = () => {
  const { t } = useTranslation()
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [loading, setLoading] = useState<boolean>(true)
  const [card] = useState<Cards[]>([
    {
      number: 100,
      title: t("present"),
      subtitle: t("times"),
      icon: <IoIosCheckmarkCircleOutline size={25} />,
      color: "text-green-500",
    },
    {
      number: 100,
      title: t("absent"),
      subtitle: t("times"),
      icon: <PiWarningCircle size={25} />,
      color: "text-yellow-500",
    },
    {
      number: 100,
      title: t("late"),
      subtitle: t("times"),
      icon: <SlClose size={22} />,
      color: "text-pink-500",
    },
    {
      number: 100,
      title: t("leave"),
      subtitle: t("times"),
      icon: <FaRegCircle size={22} />,
      color: "text-blue-500",
    },
  ]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const cols = [
    {
      key: "session",
      label: t("session"),
    },
    {
      key: "student",
      label: t("student"),
    },
    {
      key: "class",
      label: t("class"),
    },
    {
      key: "date",
      label: t("date"),
    },
    {
      key: "clock_in",
      label: t("clockIn"),
    },
    {
      key: "status",
      label: t("status"),
    },
  ]

  
  const handleClearFilter = () => {
  };

  return (
    <div>
      <Popup
        isOpen={isOpenPopup}
        onClose={() => setIsOpenPopup(false)}
        size="sm"
        header={t("filter")}
        position="center"
        animation="clip"
      >
        <div className="space-y-4">
          <DatePicker
            labelPlacement="outside"
            label={t("date")}
            name="date"
            isRequired
          />
        </div>
      </Popup>
      <div className="p-4 space-y-4 h-full"> 
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium">{t("studentAttendance")}</h1>
            <p className="text-zinc-500 dark:text-zinc-400">{t("hereYouCanViewAndManageStudentAttendance")}</p>
          </div>
        </div>
        <ScrollShadow className="h-[79vh] 3xl:h-[84vh] space-y-4 scrollbar-hide">
          <div className="grid grid-cols-4 gap-4">
            { !loading &&
              card.map((item, index) => (
                <CardUi key={index} {...item} />
              ))
            }
          </div>
          {
            loading ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 gap-4 col-span-2">
                  <SkeletonUi className="h-24 w-full" />
                  <SkeletonUi className="h-24 w-full" />
                  <SkeletonUi className="h-24 w-full" />
                  <SkeletonUi className="h-24 w-full" />
                </div>
                <SkeletonUi className="h-96 w-full" />
                <SkeletonUi className="h-96 w-full" />
                <SkeletonUi className="h-96 w-full col-span-2" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
            <Card className="card-ui h-96">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-base font-medium">{t("yourClass")}</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">{t("hereYouCanViewAndManageYourClass")}</p>
                </div>
                <div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button className="btn-small-ui" variant="solid" endContent={<IoIosArrowDown size={18} />} size="sm" radius="full">
                        Field
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu>
                      <DropdownItem key="1">
                        Field 1
                      </DropdownItem>
                      <DropdownItem key="2">
                        Field 2
                      </DropdownItem>
                      
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              <ScrollShadow className="h-72 space-y-2 mt-4 scrollbar-hide">
                {yourClass.map((item) => (
                  <ActionCard
                    key={item.id}
                    title={item.class_name}
                    icon={<IoIosCheckmarkCircleOutline size={24} />}
                    description={item.class_room}
                    onPress={() => {
                      console.log(item)
                    }}
                  />
                ))}
              </ScrollShadow>
            </Card>
            <Card className="card-ui h-96">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-base font-medium">{t("markAttendance")}</h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">{t("markAttendanceDescription")}</p>
                </div>
                <div>
                  <Dropdown >
                    <DropdownTrigger>
                      <Button className="btn-small-ui" variant="solid" endContent={<IoIosArrowDown size={18}/> } size="sm" radius="full" >
                        Select Session 
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu defaultSelectedKeys={["1"]}>
                      <DropdownItem key="1">
                        Session 1
                      </DropdownItem>
                      <DropdownItem key="2">
                        Session 2
                      </DropdownItem>
                    
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              <div className="mt-4">
                <ScrollShadow className="h-72 space-y-2 scrollbar-hide">
                  {studentClasses.map((student) => (
                    student.students.map((student, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between ">
                          <h2 className="text-base font-medium">{student.name}</h2>
                          <div className="flex items-center gap-2">
                            <Button size="sm" radius="full" variant="flat" color="success">
                              Present
                            </Button>
                            <Button size="sm" radius="full" variant="flat" color="danger">
                              Absent
                            </Button>
                            <Button size="sm" radius="full" variant="flat" color="warning">
                              Late
                            </Button>
                          </div>
                        </div>
                        <Divider/>
                      </div>
                    ))
                  ))}
              </ScrollShadow>
            </div>
          </Card>
          </div>
          <div>
            <TableUi
              data={dataApi}
              loading={loading}
              cols={cols}
              background={true}
              status={["Present", "Absent", "Late"]}
              openFilter={() => setIsOpenPopup(true)}
              handleClearFilter={handleClearFilter}
            />
          </div>
        </>
        )}
        </ScrollShadow>
      </div>
    </div>
  )
}

export default Index