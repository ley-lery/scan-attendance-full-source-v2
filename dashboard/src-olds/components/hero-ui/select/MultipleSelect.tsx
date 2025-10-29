/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, SelectItem, Chip } from "@heroui/react";

interface Branch {
  branch_id: number;
  branch_name_en: string;
  branch_name_kh: string;
  shortName: string;
}

interface SelectMultipleUiProps {
  items: Branch[]; // already includes "All"
  selectedItems: Branch[];
  onChange: (selectedBranches: Branch[]) => void;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  onBlur?: () => void; 
}

const SelectMultipleUi: React.FC<SelectMultipleUiProps> = ({
  items,
  selectedItems,
  onChange,
  label = "Select",
  placeholder = "Select items",
  isRequired = false,
  onBlur, 
}) => {
  const allKey = "All";

  const handleSelectionChange = (keys: any) => {
    const selectedShortNames: string[] = Array.from(keys || []);

    const isAllSelected = selectedShortNames.includes(allKey);

    if (isAllSelected) {
      // Select all real branches (excluding All itself)
      const nonAllBranches = items.filter((branch) => branch.shortName !== allKey);
      onChange(nonAllBranches);
    } else {
      const selectedBranches = items.filter((branch) =>
        selectedShortNames.includes(branch.shortName)
      );
      onChange(selectedBranches);
    }
  };

  const handleRemove = (key: string) => {
    if (key === allKey) {
      onChange([]);
      return;
    }
    const updated = selectedItems.filter((branch) => branch.shortName !== key);
    onChange(updated);
  };

  // Check if all real branches (excluding "All") are selected
  const selectedKeys = (() => {
    const realBranchKeys = items.filter((b) => b.shortName !== allKey).map((b) => b.shortName);
    const selectedKeys = selectedItems.map((b) => b.shortName);

    const isAll =
      realBranchKeys.length > 0 &&
      realBranchKeys.every((key) => selectedKeys.includes(key));

    return isAll ? [allKey, ...realBranchKeys] : selectedKeys;
  })();

  return (
    <Select
      isMultiline
      items={items}
      label={label}
      labelPlacement="inside"
      placeholder={placeholder}
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
      color="primary"
      onBlur={onBlur}
      renderValue={(items) => (
        <div className="flex flex-wrap gap-2">
          {items.map((item: any) => (
            <Chip
              size="sm"
              color="primary"
              variant="shadow"
              key={item.key}
              onClose={() => handleRemove(item.key)}
            >
              {item.data.branch_name_en}
            </Chip>
          ))}
        </div>
      )}
      selectionMode="multiple"
      variant="bordered"
      isRequired={isRequired}
      classNames={{
        label: "dark:text-zinc-300 text-zinc-600",
        trigger: "dark:border-zinc-600 border-zinc-300",
      }}
    >
      {(branch) => (
        <SelectItem key={branch.shortName} textValue={branch.shortName}>
          {branch.branch_name_en} - {branch.branch_name_kh}
        </SelectItem>
      )}
    </Select>
  );
};

export default SelectMultipleUi;
