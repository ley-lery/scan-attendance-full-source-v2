import CustomizeFormEdit from "./CustomizeFormEdit";

interface FieldRowProps {
  label: string;
  value: string;
  headerKey: string;
  updateHeader: (key: string, value: string) => void;
  tag?: "th" | "td" | "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "strong";
}

const FieldRow = ({ label, value, headerKey, updateHeader, tag = "span" }: FieldRowProps) => (
  <div className="flex items-center gap-2 flex-wrap">
    <CustomizeFormEdit 
      tag={tag}
      value={label} 
      onValueChange={(newLabel) => updateHeader(headerKey, newLabel)}
      className="font-medium min-w-fit"
      formatting={{ bold: true, fontSize: '13px' }}
    >
      {label}:
    </CustomizeFormEdit>
    <span className="text-gray-700">{value}</span>
  </div>
);

export default FieldRow;
