import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { Schedule } from "../types/schedule";

export const downloadJSON = (data: Schedule, filename: string) => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const exportFileDefaultName = `${filename}.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

export const exportToPNG = async (elementId: string, filename: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Element not found");

    const canvas = await html2canvas(element);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = `${filename}.png`;
    link.click();
  } catch (error) {
    console.error("Error exporting to PNG:", error);
    alert("Error exporting to PNG");
  }
};

export const exportToPDF = async (
  elementId: string,
  filename: string,
  orientation: "portrait" | "landscape" = "landscape",
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Element not found");

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation,
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    alert("Error exporting to PDF");
  }
};
export const exportToImage = async (
  elementId: string,
  filename: string,
  format: "png" | "jpeg" = "png",
) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Element not found");

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff", // Set background if transparent
      scale: 2, // Higher scale for better resolution
    });

    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const imageData = canvas.toDataURL(mimeType);

    const link = document.createElement("a");
    link.href = imageData;
    link.download = `${filename}.${format}`;
    link.click();
  } catch (error) {
    console.error("Error exporting to image:", error);
    alert("Failed to export schedule as image.");
  }
};
export const parseJSONFile = (file: File): Promise<Schedule> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        resolve(data);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        reject(new Error("Invalid JSON file"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsText(file);
  });
};
