type DataItem = Record<string, any>;

export interface ColumnConfigExcel {
  field: string;
  header: string;
  align?: "left" | "center" | "right";
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  whiteSpace?: "normal" | "nowrap" | "pre" | "pre-wrap" | "pre-line";
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  textOverflow?: "clip" | "ellipsis";
}

export interface ExcelCellData {
  value: any;
  align?: "left" | "center" | "right";
}

export type ExcelRowData = Record<string, ExcelCellData>;

export const prepareExcelData = (
  data: DataItem[],
  columns: ColumnConfigExcel[]
): ExcelRowData[] => {
  return data.map((item) => {
    const row: ExcelRowData = {};
    for (const col of columns) {
      row[col.header] = {
        value: item[col.field] ?? "",
        align: col.align ?? "left",
      };
    }
    return row;
  });
};