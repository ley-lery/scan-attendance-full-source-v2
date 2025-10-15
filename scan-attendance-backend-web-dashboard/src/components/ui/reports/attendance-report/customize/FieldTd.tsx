import CustomizeFormEdit from "./CustomizeFormEdit";

interface FieldTdProps {
  label: string;
  value: string;
  key: string;
  updateHeader: (key: string, value: string) => void;
}

const FieldTd = ({ label, value, key, updateHeader, ...props }: FieldTdProps) => (
  <div className="flex items-center gap-2 flex-wrap">
    <CustomizeFormEdit
      tag="td"
      value={label} 
      onValueChange={(newLabel) => updateHeader(key, newLabel)}
      className="font-medium min-w-fit"
      formatting={{ bold: true, fontSize: '13px' }}
      {...props}
    >
      {label}:
    </CustomizeFormEdit>
    <span className="text-gray-700">{value}</span>
  </div>
);

export default FieldTd;
