import jsPDF from "jspdf";
import type { SkinAnalysisResult } from "@/types/analysis";

const getSkinTypeLabel = (type: string): string => {
  switch (type) {
    case "dry": return "Сухая";
    case "oily": return "Жирная";
    case "combination": return "Комбинированная";
    case "normal": return "Нормальная";
    case "sensitive": return "Чувствительная";
    default: return type;
  }
};

const getSeverityLabel = (severity: string): string => {
  switch (severity) {
    case "mild": return "Лёгкая";
    case "moderate": return "Средняя";
    case "severe": return "Тяжёлая";
    default: return severity;
  }
};

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "skincare": return "Уход за кожей";
    case "lifestyle": return "Образ жизни";
    case "products": return "Косметика";
    case "professional": return "Профессиональная помощь";
    default: return category;
  }
};

export const generatePdfReport = async (
  result: SkinAnalysisResult,
  imageUrl: string
): Promise<void> => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Цвета
  const primaryColor: [number, number, number] = [13, 148, 136]; // Teal
  const accentColor: [number, number, number] = [249, 115, 22]; // Orange/Coral
  const textColor: [number, number, number] = [30, 41, 59];
  const mutedColor: [number, number, number] = [100, 116, 139];
  const successColor: [number, number, number] = [34, 197, 94];
  const warningColor: [number, number, number] = [234, 179, 8];
  const dangerColor: [number, number, number] = [239, 68, 68];

  // Функция для добавления новой страницы при необходимости
  const checkNewPage = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Хедер с градиентом
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 45, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Отчёт анализа кожи", margin, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const date = new Date().toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  doc.text(`Дата: ${date}`, margin, 35);

  yPos = 55;

  // Общий балл здоровья кожи
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(margin, yPos, contentWidth, 30, 3, 3, "F");
  
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Общий показатель здоровья кожи", margin + 10, yPos + 12);
  
  // Полоса прогресса
  const progressWidth = 80;
  const progressHeight = 8;
  const progressX = margin + 10;
  const progressY = yPos + 17;
  
  doc.setFillColor(220, 220, 220);
  doc.roundedRect(progressX, progressY, progressWidth, progressHeight, 2, 2, "F");
  
  const healthPercent = result.overallHealth / 100;
  const healthColor: [number, number, number] = result.overallHealth >= 70 ? successColor : result.overallHealth >= 40 ? warningColor : dangerColor;
  doc.setFillColor(...healthColor);
  doc.roundedRect(progressX, progressY, progressWidth * healthPercent, progressHeight, 2, 2, "F");
  
  doc.setFontSize(16);
  doc.setTextColor(...healthColor);
  doc.text(`${result.overallHealth}%`, progressX + progressWidth + 10, progressY + 7);

  yPos += 40;

  // Тип кожи
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, "FD");
  
  doc.setTextColor(...primaryColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("ТИП КОЖИ", margin + 10, yPos + 10);
  
  doc.setTextColor(...textColor);
  doc.setFontSize(14);
  doc.text(getSkinTypeLabel(result.skinType), margin + 10, yPos + 20);
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedColor);
  const descLines = doc.splitTextToSize(result.skinTypeDescription, contentWidth - 80);
  doc.text(descLines.slice(0, 2), margin + 60, yPos + 12);

  yPos += 35;

  // Резюме
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Резюме", margin, yPos);
  yPos += 7;
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...mutedColor);
  const summaryLines = doc.splitTextToSize(result.summary, contentWidth);
  doc.text(summaryLines, margin, yPos);
  yPos += summaryLines.length * 5 + 10;

  // Состояние кожи
  checkNewPage(50);
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Выявленные состояния", margin, yPos);
  yPos += 8;

  result.conditions.forEach((condition) => {
    checkNewPage(20);
    
    // Индикатор серьёзности
    const severityColorMap: Record<string, [number, number, number]> = {
      mild: successColor,
      moderate: warningColor,
      severe: dangerColor
    };
    const dotColor = severityColorMap[condition.severity] || mutedColor;
    
    doc.setFillColor(...dotColor);
    doc.circle(margin + 3, yPos + 2, 2, "F");
    
    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(condition.name, margin + 10, yPos + 4);
    
    // Бейдж серьёзности
    const severityText = getSeverityLabel(condition.severity);
    doc.setFontSize(8);
    doc.setTextColor(...dotColor);
    doc.text(`[${severityText}]`, margin + 10 + doc.getTextWidth(condition.name) + 5, yPos + 4);
    
    yPos += 7;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...mutedColor);
    const condLines = doc.splitTextToSize(condition.description, contentWidth - 10);
    doc.text(condLines, margin + 10, yPos);
    yPos += condLines.length * 4 + 6;
  });

  yPos += 5;

  // Проблемные зоны
  if (result.problemZones.length > 0) {
    checkNewPage(40);
    doc.setTextColor(...accentColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Проблемные зоны", margin, yPos);
    yPos += 8;

    result.problemZones.forEach((zone, index) => {
      checkNewPage(15);
      
      doc.setFillColor(...accentColor);
      doc.circle(margin + 5, yPos + 2, 4, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(String(index + 1), margin + 3.5, yPos + 3.5);
      
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(zone.problem, margin + 15, yPos + 3);
      
      const severityText = getSeverityLabel(zone.severity);
      doc.setTextColor(...mutedColor);
      doc.setFontSize(8);
      doc.text(`(${severityText})`, margin + 15 + doc.getTextWidth(zone.problem) + 3, yPos + 3);
      
      yPos += 10;
    });

    yPos += 5;
  }

  // Возможные причины
  checkNewPage(30);
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Возможные причины", margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textColor);
  const causesText = result.possibleCauses.map(c => `• ${c}`).join("\n");
  const causesLines = doc.splitTextToSize(causesText, contentWidth);
  doc.text(causesLines, margin, yPos);
  yPos += causesLines.length * 5 + 10;

  // Рекомендации
  checkNewPage(50);
  doc.setTextColor(...successColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Рекомендации по уходу", margin, yPos);
  yPos += 10;

  result.recommendations.forEach((rec) => {
    checkNewPage(25);
    
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(margin, yPos - 3, contentWidth, 20, 2, 2, "F");
    
    doc.setTextColor(...successColor);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`✓ ${rec.title}`, margin + 5, yPos + 3);
    
    doc.setTextColor(...mutedColor);
    doc.setFontSize(8);
    doc.text(`[${getCategoryLabel(rec.category)}]`, margin + 5 + doc.getTextWidth(`✓ ${rec.title}`) + 3, yPos + 3);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    const recLines = doc.splitTextToSize(rec.description, contentWidth - 15);
    doc.text(recLines.slice(0, 2), margin + 5, yPos + 10);
    
    yPos += 23;
  });

  // Рекомендация дерматолога
  if (result.shouldSeeDermatologist) {
    checkNewPage(35);
    yPos += 5;
    
    doc.setFillColor(254, 243, 199);
    doc.setDrawColor(...warningColor);
    doc.setLineWidth(1);
    doc.roundedRect(margin, yPos, contentWidth, 25, 3, 3, "FD");
    
    doc.setTextColor(...warningColor);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("⚠ Рекомендуем консультацию дерматолога", margin + 5, yPos + 10);
    
    if (result.dermatologistReason) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...textColor);
      const reasonLines = doc.splitTextToSize(result.dermatologistReason, contentWidth - 15);
      doc.text(reasonLines.slice(0, 2), margin + 5, yPos + 18);
    }
    
    yPos += 35;
  }

  // Футер
  const footerY = pageHeight - 15;
  doc.setFillColor(...primaryColor);
  doc.rect(0, footerY - 5, pageWidth, 20, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Этот отчёт носит информационный характер и не заменяет консультацию квалифицированного дерматолога.",
    pageWidth / 2,
    footerY + 3,
    { align: "center" }
  );
  doc.text(
    "SkinAnalyzer AI © " + new Date().getFullYear(),
    pageWidth / 2,
    footerY + 8,
    { align: "center" }
  );

  // Сохранение
  const fileName = `skin-analysis-report-${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};
