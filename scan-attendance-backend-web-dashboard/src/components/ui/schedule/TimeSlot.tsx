
interface Props {
    time: string;
    day: string;
    course: any;
}

export const TimeSlot: React.FC<Props> = ({time, day, course}) => {
  return (
    <td key={`${time}-${day}`} className="border border-blue-950 h-32 min-h-32 min-w-40 w-40">
        {course ? (
        <div className="flex flex-col justify-center items-center  p-4">
            <div className="flex items-start *:text-base *:text-black">
                <p className="font-bold">
                    {course.name}
                </p>
                </div>
                <p>
                    {course.credits} Credits
                </p>
                <p>
                    Room: {course.room}
                </p>
                <p>
                    {course.instructor}
                </p>
                <p>
                    Tel: {course.phone}
                </p>
            </div>
        ) : (
            <div className="min-h-full min-w-full bg-zinc-200"></div>
        )}
    </td>
  )
}
