import { Component } from "react";

interface Course {
  id: number;
  subject: string;
  credit: number;
  room: string;
  instructor: string;
  tel: string;
}

interface ClassBlockProps {
  course: Course;
  onView?: (course: Course) => void; 
}

class ClassBlock extends Component<ClassBlockProps> {
  handleView = () => {
    const { onView, course } = this.props;
    if (onView) {
      onView(course);
    }
  };

  render() {
    const { course } = this.props;

    return (
      <div
        onClick={this.handleView}
        className={`px-1.5 min-h-40 flex flex-col items-center justify-center *:font-lora bg-transparent cursor-pointer`}
      >
        <h3 className="text-center text-base text-black dark:text-white">{course.subject}</h3>
        <p className="text-sm">Credit: {course.credit}</p>
        <p className="text-sm">Room: {course.room}</p>
        <p className="text-smtext-center">{course.instructor}</p>
        <p className="text-sm">Tel: {course.tel}</p>
      </div>
    );
  }
}

export default ClassBlock;
