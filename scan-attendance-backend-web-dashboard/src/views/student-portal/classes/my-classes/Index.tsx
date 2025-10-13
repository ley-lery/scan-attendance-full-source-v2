import { useFetch } from "@/hooks/useFetch"
import { Button } from "@heroui/react";
import { useEffect } from "react"
import { LuUniversity } from "react-icons/lu";

interface CardProps {
  className: string;
  roomName: string;
  term: string;
  year: string;
}

const Card = ({ className, roomName, term, year }: CardProps) => {
  return (
    <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900  inset-shadow-sm inset-shadow-zinc-100/50 dark:inset-shadow-zinc-500/50 shadow-lg shadow-zinc-100/50 dark:shadow-black/50 space-y-2 ">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 inset-shadow-sm inset-shadow-zinc-300/50 dark:inset-shadow-zinc-500/50">
          <LuUniversity size={20} className="text-zinc-500 dark:text-zinc-400"/>
        </div>
        <div className="flex items-start justify-between w-full gap-2">
          <div>
            <h2 className="text-base font-medium">{className}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{roomName}</p>
          </div>
          <Button size="sm" variant="flat" color="success" radius="lg">View</Button>
        </div>
      </div>
      <div className="flex justify-evenly  p-2 rounded-xl">
        <div className="flex flex-col text-center gap-1">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Year</span>
          <p className="text-xl font-semibold">{year}</p>
        </div>
        <div className="flex flex-col text-center gap-1">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Term</span>
          <p className="text-xl font-semibold">{term}</p>
        </div>
      </div>
    </div>
  )
}

const Index = () => {

  const {data, loading} = useFetch("/student/classstudent/list")

  useEffect(() => {
    console.log(data, "class student")
  }, [data])


  return (
    <div className="space-y-4 grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
      {data?.data?.rows?.map((item: any) => (
        <Card key={item.id} className={item.class_name} roomName={item.room_name} term={item.term_no} year={item.promotion_no} />
      ))}
    </div>
  )
}

export default Index