// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// export const exportReport = (
//   analytics
// ) => {

//   const doc = new jsPDF();

//   doc.setFontSize(20);
//   doc.text(
//     "FinanceOS Financial Report",
//     14,
//     20
//   );

//   doc.setFontSize(11);

//   doc.text(
//     `Generated: ${new Date().toLocaleString()}`,
//     14,
//     30
//   );

//   autoTable(doc, {
//     startY: 40,
//     head: [["Metric", "Value"]],
//     body: [
//       [
//         "Total Income",
//         `₹${analytics.totalIncome}`
//       ],
//       [
//         "Total Expense",
//         `₹${analytics.totalExpense}`
//       ],
//       [
//         "Net Savings",
//         `₹${analytics.netSavings}`
//       ],
//       [
//         "Savings Rate",
//         `${analytics.savingsRate}%`
//       ],
//     ],
//   });

//   if (
//     analytics.goalsProgress?.length
//   ) {
//     autoTable(doc, {
//       startY:
//         doc.lastAutoTable.finalY +
//         10,
//       head: [["Goal", "Progress"]],
//       body:
//         analytics.goalsProgress.map(
//           (g) => [
//             g.name,
//             `${g.progress}%`,
//           ]
//         ),
//     });
//   }

//   if (
//     analytics.habitPerformance
//       ?.length
//   ) {
//     autoTable(doc, {
//       startY:
//         doc.lastAutoTable.finalY +
//         10,
//       head: [["Habit", "Streak"]],
//       body:
//         analytics.habitPerformance.map(
//           (h) => [
//             h.name,
//             h.streak,
//           ]
//         ),
//     });
//   }

//   if (
//     analytics.insights?.length
//   ) {
//     autoTable(doc, {
//       startY:
//         doc.lastAutoTable.finalY +
//         10,
//       head: [["Insights"]],
//       body:
//         analytics.insights.map(
//           (i) => [i]
//         ),
//     });
//   }

//   doc.save(
//     `FinanceOS_Report_${
//       new Date()
//         .toISOString()
//         .split("T")[0]
//     }.pdf`
//   );
// };


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  navy:       [13,  33,  70],   // #0d2146
  blue:       [37,  99,  235],  // #2563eb
  lightBlue:  [219, 234, 254],  // #dbeafe
  teal:       [6,   182, 212],  // #06b6d4
  green:      [16,  185, 129],  // #10b981
  greenLight: [209, 250, 229],  // #d1fae5
  red:        [239, 68,  68],   // #ef4444
  redLight:   [254, 226, 226],  // #fee2e2
  yellow:     [245, 158, 11],   // #f59e0b
  white:      [255, 255, 255],
  gray50:     [249, 250, 251],
  gray100:    [243, 244, 246],
  gray200:    [229, 231, 235],
  gray400:    [156, 163, 175],
  gray600:    [75,  85,  99],
  gray800:    [31,  41,  55],
};

const fmt = (n) =>
  `Rs.${Number(n).toLocaleString("en-IN")}`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const rgb = (arr) => ({ r: arr[0], g: arr[1], b: arr[2] });

const setFill   = (doc, arr) => doc.setFillColor(arr[0], arr[1], arr[2]);
const setDraw   = (doc, arr) => doc.setDrawColor(arr[0], arr[1], arr[2]);
const setTColor = (doc, arr) => doc.setTextColor(arr[0], arr[1], arr[2]);

// Rounded rect helper
const roundRect = (doc, x, y, w, h, r, fillArr, strokeArr) => {
  if (fillArr)   setFill(doc, fillArr);
  if (strokeArr) setDraw(doc, strokeArr);
  doc.roundedRect(x, y, w, h, r, r, fillArr ? (strokeArr ? "FD" : "F") : "D");
};

// Section heading block
const sectionHeading = (doc, text, y, pageW) => {
  setFill(doc, C.navy);
  doc.rect(14, y, pageW - 28, 8, "F");
  setTColor(doc, C.white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(text.toUpperCase(), 18, y + 5.5);
  setTColor(doc, C.gray800);
  return y + 8;
};

// Progress bar
const progressBar = (doc, x, y, w, h, pct, color) => {
  // track
  setFill(doc, C.gray100);
  setDraw(doc, C.gray200);
  doc.roundedRect(x, y, w, h, h / 2, h / 2, "FD");
  // fill
  const fillW = Math.max((pct / 100) * w, pct > 0 ? h : 0);
  setFill(doc, color);
  setDraw(doc, color);
  doc.roundedRect(x, y, fillW, h, h / 2, h / 2, "FD");
};

// KPI card
const kpiCard = (doc, x, y, w, h, label, value, accentArr) => {
  // shadow illusion
  setFill(doc, [220, 225, 235]);
  doc.roundedRect(x + 1.5, y + 1.5, w, h, 4, 4, "F");
  // card bg
  setFill(doc, C.white);
  setDraw(doc, C.gray200);
  doc.roundedRect(x, y, w, h, 4, 4, "FD");
  // accent bar top
  setFill(doc, accentArr);
  doc.rect(x, y, w, 3, "F");
  // round top corners of accent
  setFill(doc, accentArr);
  doc.roundedRect(x, y, w, 5, 4, 4, "F");
  // label
  setTColor(doc, C.gray400);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(label.toUpperCase(), x + w / 2, y + 14, { align: "center" });
  // value
  setTColor(doc, C.navy);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(value, x + w / 2, y + 24, { align: "center" });
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export const exportReport = (analytics) => {
  const doc  = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const date  = new Date();
  const dateStr = date.toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit",
  });

  // ── HEADER BANNER ──────────────────────────────────────────────────────────
  // gradient-ish band (two overlapping rects)
  setFill(doc, C.navy);
  doc.rect(0, 0, pageW, 42, "F");
  setFill(doc, C.blue);
  doc.rect(pageW - 60, 0, 60, 42, "F");

  // decorative circle
  setFill(doc, [26, 58, 107]);
  doc.circle(pageW - 10, 0, 30, "F");

  // logo dot
  setFill(doc, C.teal);
  doc.circle(20, 16, 4, "F");
  setFill(doc, C.white);
  doc.circle(20, 16, 2.5, "F");
  setFill(doc, C.teal);
  doc.circle(20, 16, 1.2, "F");

  // Brand name
  setTColor(doc, C.white);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("FinanceOS", 28, 20);

  // Tagline
  setTColor(doc, [147, 197, 253]);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Personal Finance Intelligence", 28, 27);

  // Report title right side
  setTColor(doc, C.white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("FINANCIAL REPORT", pageW - 14, 14, { align: "right" });
  setTColor(doc, [147, 197, 253]);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${dateStr}  ·  ${timeStr}`, pageW - 14, 20, { align: "right" });

  // Thin accent line
  setFill(doc, C.teal);
  doc.rect(0, 42, pageW, 1.5, "F");

  let y = 54;

  // ── KPI CARDS ROW ──────────────────────────────────────────────────────────
  const cardW = (pageW - 28 - 12) / 4; // 4 cards with 4px gaps
  const cardH = 32;
  const gap   = 4;

  const kpis = [
    { label: "Total Income",   value: fmt(analytics.totalIncome),   accent: C.blue  },
    { label: "Total Expenses", value: fmt(analytics.totalExpense),   accent: C.red   },
    { label: "Net Savings",    value: fmt(analytics.netSavings),     accent: C.green },
    { label: "Savings Rate",   value: `${analytics.savingsRate}%`,   accent: C.teal  },
  ];

  kpis.forEach((k, i) => {
    kpiCard(doc, 14 + i * (cardW + gap), y, cardW, cardH, k.label, k.value, k.accent);
  });

  y += cardH + 14;

  // ── CATEGORY BREAKDOWN ─────────────────────────────────────────────────────
  if (analytics.categorySpend?.length) {
    y = sectionHeading(doc, "Expense Breakdown by Category", y, pageW);
    y += 4;

    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [["Category", "Amount", "% of Total", "Visual"]],
      body: (() => {
        const total = analytics.categorySpend.reduce((s, c) => s + c.amount, 0);
        return analytics.categorySpend.map((c) => [
          c.name,
          fmt(c.amount),
          `${total > 0 ? ((c.amount / total) * 100).toFixed(1) : 0}%`,
          "",
        ]);
      })(),
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: { top: 4, bottom: 4, left: 6, right: 6 },
        textColor: rgb(C.gray800),
        lineColor: rgb(C.gray200),
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: rgb(C.lightBlue),
        textColor: rgb(C.navy),
        fontStyle: "bold",
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: rgb(C.gray50) },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 40, halign: "right", fontStyle: "bold" },
        2: { cellWidth: 28, halign: "center" },
        3: { cellWidth: "auto" },
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 3) {
          const total = analytics.categorySpend.reduce((s, c) => s + c.amount, 0);
          const row   = analytics.categorySpend[data.row.index];
          if (!row) return;
          const pct   = total > 0 ? (row.amount / total) * 100 : 0;
          const bx    = data.cell.x + 3;
          const by    = data.cell.y + data.cell.height / 2 - 2;
          const bw    = data.cell.width - 6;
          // parse hex color for bar
          const hex   = row.color || "#3b82f6";
          const r2 = parseInt(hex.slice(1, 3), 16);
          const g2 = parseInt(hex.slice(3, 5), 16);
          const b2 = parseInt(hex.slice(5, 7), 16);
          progressBar(doc, bx, by, bw, 4, pct, [r2, g2, b2]);
        }
      },
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  // ── GOALS ──────────────────────────────────────────────────────────────────
  if (analytics.goalsProgress?.length) {
    y = sectionHeading(doc, "Savings Goals Progress", y, pageW);
    y += 4;

    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [["Goal Name", "Progress", "Status", "Bar"]],
      body: analytics.goalsProgress.map((g) => [
        g.name,
        `${g.progress}%`,
        g.progress >= 100 ? "✓ Complete" : g.progress >= 50 ? "On Track" : "In Progress",
        "",
      ]),
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
        textColor: rgb(C.gray800),
        lineColor: rgb(C.gray200),
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: rgb(C.greenLight),
        textColor: rgb([6, 78, 59]),
        fontStyle: "bold",
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: rgb(C.gray50) },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 24, halign: "center", fontStyle: "bold" },
        2: { cellWidth: 30, halign: "center" },
        3: { cellWidth: "auto" },
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 2) {
          const row = analytics.goalsProgress[data.row.index];
          const statusColors = {
            "✓ Complete": C.green,
            "On Track":   C.blue,
            "In Progress": C.yellow,
          };
          const status = row.progress >= 100 ? "✓ Complete" : row.progress >= 50 ? "On Track" : "In Progress";
          const color  = statusColors[status] || C.gray400;
          const bx = data.cell.x + 3;
          const by = data.cell.y + 1.5;
          const bw = data.cell.width - 6;
          const bh = data.cell.height - 3;
          setFill(doc, color.map(v => Math.min(255, v + 180)));
          setDraw(doc, color);
          doc.roundedRect(bx, by, bw, bh, 2, 2, "FD");
          setTColor(doc, color);
          doc.setFontSize(7);
          doc.setFont("helvetica", "bold");
          doc.text(status, bx + bw / 2, by + bh / 2 + 2.5, { align: "center" });
          setTColor(doc, C.gray800);
          doc.setFontSize(8.5);
          doc.setFont("helvetica", "normal");
          // suppress default text
          data.cell.text = [];
        }
        if (data.section === "body" && data.column.index === 3) {
          const row = analytics.goalsProgress[data.row.index];
          if (!row) return;
          const bx = data.cell.x + 3;
          const by = data.cell.y + data.cell.height / 2 - 2;
          const bw = data.cell.width - 6;
          progressBar(doc, bx, by, bw, 4, row.progress, C.green);
        }
      },
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  // ── HABITS ─────────────────────────────────────────────────────────────────
  if (analytics.habitPerformance?.length) {
    // page break check
    if (y > pageH - 60) {
      doc.addPage();
      y = 20;
    }

    y = sectionHeading(doc, "Habit Streak Performance", y, pageW);
    y += 4;

    autoTable(doc, {
      startY: y,
      margin: { left: 14, right: 14 },
      head: [["Habit", "Current Streak", "Completion", "Bar"]],
      body: analytics.habitPerformance.map((h) => [
        `${h.icon || "🔥"} ${h.name}`,
        h.streak,
        `${h.progress}%`,
        "",
      ]),
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: { top: 5, bottom: 5, left: 6, right: 6 },
        textColor: rgb(C.gray800),
        lineColor: rgb(C.gray200),
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [254, 243, 199],
        textColor: [92, 45, 5],
        fontStyle: "bold",
        fontSize: 8,
      },
      alternateRowStyles: { fillColor: rgb(C.gray50) },
      columnStyles: {
        0: { cellWidth: 65 },
        1: { cellWidth: 35, halign: "center", fontStyle: "bold" },
        2: { cellWidth: 28, halign: "center" },
        3: { cellWidth: "auto" },
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 3) {
          const row = analytics.habitPerformance[data.row.index];
          if (!row) return;
          const bx = data.cell.x + 3;
          const by = data.cell.y + data.cell.height / 2 - 2;
          const bw = data.cell.width - 6;
          progressBar(doc, bx, by, bw, 4, row.progress, C.yellow);
        }
      },
    });

    y = doc.lastAutoTable.finalY + 12;
  }

  // ── INSIGHTS ───────────────────────────────────────────────────────────────
  if (analytics.insights?.length) {
    if (y > pageH - 70) {
      doc.addPage();
      y = 20;
    }

    y = sectionHeading(doc, "Smart Insights", y, pageW);
    y += 6;

    analytics.insights.forEach((insight, i) => {
      const isEven = i % 2 === 0;
      const bgColor = isEven ? C.lightBlue : C.gray50;
      const cardHeight = 10;

      setFill(doc, bgColor);
      setDraw(doc, C.gray200);
      doc.roundedRect(14, y, pageW - 28, cardHeight, 3, 3, "FD");

      // left accent dot
      setFill(doc, C.blue);
      doc.circle(20, y + cardHeight / 2, 1.5, "F");

      setTColor(doc, C.navy);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "normal");
      doc.text(insight, 25, y + cardHeight / 2 + 3);

      y += cardHeight + 4;
    });

    y += 4;
  }

  // ── FOOTER ─────────────────────────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let pg = 1; pg <= totalPages; pg++) {
    doc.setPage(pg);

    // footer bar
    setFill(doc, C.navy);
    doc.rect(0, pageH - 14, pageW, 14, "F");

    setTColor(doc, [147, 197, 253]);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.text("FinanceOS · Personal Finance Intelligence", 14, pageH - 5.5);
    doc.text(
      `Page ${pg} of ${totalPages}  ·  ${dateStr}`,
      pageW - 14,
      pageH - 5.5,
      { align: "right" }
    );
  }

  // ── SAVE ───────────────────────────────────────────────────────────────────
  const filename = `FinanceOS_Report_${date.toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
};