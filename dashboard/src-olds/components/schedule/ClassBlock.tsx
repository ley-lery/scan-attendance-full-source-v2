import React from "react";
import type { Course } from "@/types/schedule";
import { MoreVertical } from "lucide-react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

interface ClassBlockProps {
  course?: Course;
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  isConflict?: boolean;
  hasPrint?: boolean; 
}

const ClassBlock: React.FC<ClassBlockProps> = ({
  course,
  onEdit,
  onDelete,
  isConflict = false,
  hasPrint = false, 
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div
      className={`group relative cursor-pointer rounded-2xl p-3 transition-all duration-200 `}
    >
      <div className="absolute right-0 top-0 z-10">
        {
          !hasPrint &&
          <Popover placement="right" showArrow>
            <PopoverTrigger>
              <Button
                isIconOnly
                variant="light"
                radius="full"
                size="sm"
                color="primary"
              >
                <MoreVertical size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="border dark:border-white/20">
              <div className="flex min-w-44 flex-col space-y-1 py-1">
                <Button
                  size="sm"
                  onPress={() => onEdit(course)}
                  className="justify-start text-sm"
                  variant="light"
                  startContent={<IoPencilOutline size={20} />}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  onPress={onOpen}
                  className="justify-start text-sm"
                  variant="light"
                  color="danger"
                  startContent={<IoTrashOutline size={20} />}
                >
                  Delete
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        }
      </div>
    {hasPrint ? (
      <>
        <div className="mb-2 flex  h-full flex-col items-center justify-center gap-1 *:text-center *:font-semibold *:text-sm">
          <h3 className="text-sm leading-tight text-gray-800  ">
            {course.subject}
          </h3>
          <span className="text-xs font-medium text-zinc-600 ">
            {course.credits} credits
          </span>
          <span>Room: {course.room}</span>
          <span>{course.lecturer}</span>
          <span>Tel: {course.tel}</span>
        </div>
        {isConflict && (
          <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-red-500 dark:bg-red-700"></div>
        )}
      </>
    ) : (
      <>
        <div className="mb-2 flex  h-full flex-col items-center justify-center gap-1 *:text-center *:font-medium">
          <h3 className="text-sm leading-tight text-gray-800 dark:text-gray-100">
            {course.subject}
          </h3>
          <span className="text-xs font-medium text-zinc-600 dark:text-blue-400">
            {course.credits} credits
          </span>
          <span>Room: {course.room}</span>
          <span className="whitespace-nowrap">{course.lecturer}</span>
          <span>Tel: {course.tel}</span>
        </div>
        {isConflict && (
          <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-red-500 dark:bg-red-700"></div>
        )}
      </>
    )}

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xs"
        closeButton={false}
        classNames={{ closeButton: "hidden" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                <h2 className="text-base font-medium">{t("deleteCourse")}</h2>
              </ModalHeader>
              <ModalBody>
                <p className="text-center text-sm text-zinc-800 dark:text-zinc-300">
                  {t("deleteCourseMessage")}
                </p>
              </ModalBody>
              <ModalFooter className="mt-2 justify-start border-t border-black/10 p-0 dark:border-white/10">
                <div className="flex w-full items-center justify-center gap-2">
                  <button
                    onClick={onClose}
                    className="w-full p-3 text-blue-500 hover:text-blue-400"
                  >
                    {t("cancel")}
                  </button>
                  <i className="flex h-full w-px bg-black/10 dark:bg-white/10" />
                  <button
                    onClick={() => {
                      onClose();
                      onDelete(course.id);
                    }}
                    className="w-full p-3 text-red-500 hover:text-red-400"
                  >
                    {t("delete")}
                  </button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ClassBlock;
