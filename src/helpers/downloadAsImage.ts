import html2canvas from "html2canvas";

export const downloadAsImage = async (id: string, fileName: string) => {
  const element = document.getElementById("print");

  if (!element) return;

  const canvas = await html2canvas(element);
  const data = canvas.toDataURL("image/jpg");
  const link = document.createElement("a");

  link.href = data;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
