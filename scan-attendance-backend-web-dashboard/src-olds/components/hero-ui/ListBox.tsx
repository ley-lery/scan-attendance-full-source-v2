import { exportToImage, exportToPDF } from "@/utils/exportUtils";
import { Listbox, ListboxItem, cn } from "@heroui/react";
import { ChevronLeft } from "lucide-react";
import { CgExport } from "react-icons/cg";

interface IconWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const IconWrapper = ({ children, className }: IconWrapperProps) => (
  <div
    className={cn(
      className,
      "flex h-7 w-7 items-center justify-center rounded-small",
    )}
  >
    {children}
  </div>
);

export const ItemCounter = ({ number }: { number: number }) => (
  <div className="flex items-center gap-1 text-default-400">
    <ChevronLeft className="text-xl" />
    {number > 0 && <span className="text-small">{number}</span>}
  </div>
);

const dataListBox = [
  {
    key: "exmport",
    label: "Export as Pdf",
    icon: <CgExport className="text-lg" />,
    color: "bg-success/10 text-success",
    action: () => exportToPDF("schedule-grid", "full_schedule"),
  },
  {
    key: "exmport",
    label: "Export as Jpeg",
    icon: <CgExport className="text-lg" />,
    color: "bg-success/10 text-success",
    action: () => exportToImage("schedule-grid", "weekly_schedule", "jpeg"),
  },
  {
    key: "print",
    label: "Print Schedule",
    icon: <CgExport className="text-lg" />,
    color: "bg-success/10 text-success",
    action: () => {},
  },
];

const ListboxUI = () => {
  return (
    <Listbox
      aria-label="User Menu"
      className="max-w-[300px] gap-0 divide-y divide-default-300/50 overflow-visible rounded-medium bg-content1 p-0 shadow-small dark:divide-default-100/80"
      itemClasses={{
        base: "px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80",
      }}
    >
      {dataListBox.map((item) => (
        <ListboxItem
          key={item.key}
          endContent={
            <IconWrapper className={item.color}>{item.icon}</IconWrapper>
          }
          className={item.key === "releases" ? "group h-auto py-3" : undefined}
          textValue={item.key === "releases" ? "Releases" : undefined}
        >
          <button onClick={item.action}>{item.label}</button>
        </ListboxItem>
      ))}
    </Listbox>
  );
};

export default ListboxUI;
