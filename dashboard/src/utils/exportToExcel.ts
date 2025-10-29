import ExcelJS from "exceljs";

export interface ExcelCellData {
  value: any;
  align?: "left" | "center" | "right";
}

export type ExcelRowData = Record<string, ExcelCellData>;

export const exportToExcel = async (
  data: ExcelRowData[],
  filename: string
) => {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Extract headers
  const headers = Object.keys(data[0]);

  // Add header row with styling
  const headerRow = worksheet.addRow(headers);
  
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, size: 12, color: { argb: "FF374151" } };
    cell.alignment = { 
      horizontal: "center", 
      vertical: "middle",
      wrapText: false 
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF3F4F6" },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FFD1D5DB" } },
      left: { style: "thin", color: { argb: "FFD1D5DB" } },
      bottom: { style: "medium", color: { argb: "FF9CA3AF" } },
      right: { style: "thin", color: { argb: "FFD1D5DB" } },
    };
  });

  headerRow.height = 25;

  // Add data rows with alignment
  data.forEach((rowData) => {
    const row = worksheet.addRow(
      headers.map((header) => {
        const cellData = rowData[header];
        return cellData?.value ?? "";
      })
    );

    // Apply alignment and styling to each cell
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1];
      const cellData = rowData[header];
      const alignment = cellData?.align || "left";

      cell.alignment = {
        horizontal: alignment,
        vertical: "middle",
        wrapText: alignment === "left",
      };

      cell.font = { size: 11 };

      // Add borders
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });

    row.height = 20;
  });

  // Auto-fit columns with min/max width constraints
  worksheet.columns.forEach((column, index) => {
    const header = headers[index];
    const headerLength = header.length;
    
    const maxDataLength = Math.max(
      ...data.map((row) => {
        const value = row[header]?.value;
        return String(value || "").length;
      })
    );

    // Calculate width with constraints
    const calculatedWidth = Math.max(headerLength, maxDataLength) + 2;
    column.width = Math.min(Math.max(calculatedWidth, 12), 50);
  });

  // Freeze the header row
  worksheet.views = [
    {
      state: "frozen",
      xSplit: 0,
      ySplit: 1,
      topLeftCell: "A2",
      activeCell: "A2",
    },
  ];

  // Generate and download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};