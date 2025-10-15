import CardUi from "@/components/hero-ui/card/CardUi";
import TableUi from "@/components/hero-ui/table/Table";
import { Button,  Skeleton, useDisclosure } from "@heroui/react"
import { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5"
import Form from "./Form";
import { CirclePlus } from "lucide-react";

const dataCard = [
  {
    number: 3,
    title: "Approved",
    subtitle: "times",
    icon: <IoAddCircleOutline size={25} />,
    color: "text-green-500",
  },
  {
    number: 2,
    title: "Pending",
    subtitle: "times",
    icon: <IoAddCircleOutline size={25} />,
    color: "text-yellow-500",
  },
  {
    number: 1,
    title: "Rejected",
    subtitle: "times",
    icon: <IoAddCircleOutline size={25} />,
    color: "text-pink-500",
  },
  {
    number: 6,
    title: "Total",
    subtitle: "times",
    icon: <IoAddCircleOutline size={25} />,
    color: "text-blue-500",
  },
];

const dataTable = [
  {
    id: 1,
    class: "CSC 101",
    course: "Introduction to Computer Science",
    original_schedule: "2025-01-01 10:00:00",
    requested_time: "2025-01-01 10:00:00",
    submitted_on: "2025-01-01 10:00:00",
    status: "Approved",
  },
  {
    id: 2,
    class: "CSC 102",
    course: "Introduction to Computer Science",
    original_schedule: "2025-01-01 10:00:00",
    requested_time: "2025-01-01 10:00:00",
    submitted_on: "2025-01-01 10:00:00",
    status: "Pending",
  },
  {
    id: 3,
    class: "CSC 103",
    course: "Introduction to Computer Science",
    original_schedule: "2025-01-01 10:00:00",
    requested_time: "2025-01-01 10:00:00",
    submitted_on: "2025-01-01 10:00:00",
    status: "Rejected",
  },
];


const Index = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [card, setCard] = useState<any[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    setCard(dataCard);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const cols = [
    { key: "class", label: "Class" },
    { key: "course", label: "Course" },
    { key: "original_schedule", label: "Original Schedule" },
    { key: "requested_time", label: "Requested Time" },
    { key: "submitted_on", label: "Submitted On" },
    { key: "status", label: "Status" },
  ]

 

  return (
    <div className='p-4'>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-medium">Extra Time Request</h2>
          <p className="text-base text-gray-500">
            Review, approve, or reject student requests for extra time on assignments or exams.
          </p>
        </div>
        <div>
          <Button color="primary" className="btn-small-ui" startContent={<CirclePlus size={18} />} onPress={onOpen}>
            <span>Request Extra Time</span>
          </Button>
        </div>
      </div>
      <div className="mt-2">
        <div className="grid grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-28 w-full rounded-lg p-4" />
              ))
            : card.map((item, index) => (
                <CardUi key={index} {...item} />
              ))}
        </div>
      </div>
      {/* // ======== Table UI ======== */}
      <div className="mt-4">
        <TableUi
          data={dataTable}
          loading={loading}
          cols={cols}
          background={true}
          status={["Approved", "Pending", "Rejected"]}
        />
      </div>
      <Form isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  )
}

export default Index