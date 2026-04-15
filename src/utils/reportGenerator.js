/**
 * PDF Report Generator
 * 
 * Generates a professional PDF energy report from the dashboard data.
 * Uses jsPDF installed via npm.
 */

import { jsPDF } from 'jspdf';

/**
 * Sanitize text for jsPDF — replace special unicode characters
 * that helvetica font doesn't support
 */
function sanitize(text) {
  if (!text) return '';
  return text
    .replace(/CO₂/g, 'CO2')
    .replace(/₂/g, '2')
    .replace(/™/g, '(TM)')
    .replace(/¢/g, ' cents')
    .replace(/·/g, '|')
    .replace(/—/g, '-')
    .replace(/–/g, '-')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/"/g, '"')
    .replace(/°/g, ' deg');
}

/**
 * Generate and download a PDF report
 */
export async function generateReport({ results, location, storyHeadline, storyDetail }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const { greenScore, breakdown, solar, financial, carbon, gridFuelMix, solarRanking, recommendations, dataSources } = results;

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const green = [16, 185, 129];
  const darkBg = [5, 20, 14];
  const white = [255, 255, 255];
  const gray = [160, 160, 160];
  const lightGray = [200, 200, 200];

  // Helper: check if we need a new page
  function checkPage(needed) {
    if (y + needed > pageHeight - 20) {
      doc.addPage();
      doc.setFillColor(...darkBg);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');
      y = 20;
    }
  }

  // Background
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // === HEADER ===
  doc.setTextColor(...green);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('GreenGrid', margin, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text('Data-Powered Energy Intelligence', margin + 52, y);
  y += 4;

  doc.setDrawColor(...green);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // === TITLE ===
  doc.setTextColor(...white);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Energy Report', margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  const address = location?.displayName || 'Address';
  const shortAddress = address.length > 90 ? address.substring(0, 90) + '...' : address;
  doc.text(sanitize(shortAddress), margin, y);
  y += 5;
  doc.text(`${location?.latitude?.toFixed(4)} N, ${Math.abs(location?.longitude)?.toFixed(4)} W`, margin, y);
  y += 5;
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y);
  y += 10;

  // === STORY SUMMARY ===
  const cleanHeadline = sanitize(storyHeadline || 'Your energy report');
  const cleanDetail = sanitize(storyDetail || '');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const headlineLines = doc.splitTextToSize(cleanHeadline, contentWidth - 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const detailLines = doc.splitTextToSize(cleanDetail, contentWidth - 12);

  // Calculate exact box height needed
  const headlineHeight = headlineLines.length * 5;
  const detailHeight = detailLines.length * 3.8;
  const storyHeight = headlineHeight + detailHeight + 18;

  checkPage(storyHeight + 5);
  doc.setFillColor(10, 40, 28);
  doc.roundedRect(margin, y, contentWidth, storyHeight, 3, 3, 'F');

  y += 7;
  doc.setTextColor(...white);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(headlineLines, margin + 6, y);
  y += headlineHeight + 3;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text(detailLines, margin + 6, y);
  y += detailHeight + 8;

  // === GREENSCORE ===
  checkPage(28);
  doc.setFillColor(10, 40, 28);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F');
  doc.setTextColor(...green);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text(`${greenScore}`, margin + 8, y + 16);
  doc.setFontSize(10);
  doc.setTextColor(...white);
  doc.text('GreenScore', margin + 30, y + 10);
  doc.setTextColor(...gray);
  doc.setFontSize(8);
  doc.text('  out of 100  |  How well-positioned your home is for clean energy', margin + 30, y + 16);

  const bx = margin + 120;
  doc.setFontSize(7);
  doc.setTextColor(...gray);
  doc.text(`Solar: ${breakdown.solar}`, bx, y + 8);
  doc.text(`Efficiency: ${breakdown.efficiency}`, bx, y + 12);
  doc.text(`Grid: ${breakdown.gridClean}`, bx + 30, y + 8);
  doc.text(`Feasibility: ${breakdown.feasibility}`, bx + 30, y + 12);
  y += 28;

  // === KEY METRICS ===
  checkPage(46);
  const metricW = contentWidth / 2 - 2;
  const metricH = 18;
  const taxCredit = Math.round((solar.systemCost / 0.7 * 0.3) / 100) * 100;
  const metrics = [
    { label: 'Solar Output', value: `${solar.annualOutputKwh.toLocaleString()} kWh/yr`, sub: `${solar.systemSizeKw}kW system | Covers ${solar.coveragePercent}% of your usage` },
    { label: 'Annual Savings', value: `$${financial.annualSavings.toLocaleString()}/yr`, sub: `Pays for itself in ${financial.paybackYears} years | $${Math.round(financial.savings25yr / 1000)}k over 25 years` },
    { label: 'CO2 Offset', value: `${carbon.annualOffsetTons} tons/yr`, sub: `= ${carbon.treesEquivalent} trees | ${carbon.carsEquivalent} cars off the road` },
    { label: 'System Cost', value: `$${(solar.systemCost / 1000).toFixed(1)}k`, sub: `After 30% ITC ($${taxCredit.toLocaleString()} tax credit)` },
  ];

  metrics.forEach((m, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const mx = margin + col * (metricW + 4);
    const my = y + row * (metricH + 4);

    doc.setFillColor(8, 30, 20);
    doc.roundedRect(mx, my, metricW, metricH, 2, 2, 'F');
    doc.setTextColor(...white);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(m.value, mx + 5, my + 8);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(m.label, mx + 5, my + 13);
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(6);
    doc.text(m.sub, mx + 5, my + 16.5);
  });

  y += (metricH + 4) * 2 + 6;

  // === GRID FUEL MIX ===
  if (gridFuelMix) {
    checkPage(30);
    doc.setTextColor(...white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text("Your Grid's Fuel Mix", margin, y);
    y += 3;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(`${gridFuelMix.subregionName || 'Your subregion'} | ${carbon.gridEmissionFactor} lb CO2/MWh`, margin, y);
    y += 5;

    const barH = 6;
    const fuelColors = {
      coal: [107, 114, 128], gas: [245, 158, 11], nuclear: [139, 92, 246],
      hydro: [59, 130, 246], wind: [6, 182, 212], solar: [249, 115, 22], other: [16, 185, 129],
    };
    const fuels = ['coal', 'gas', 'nuclear', 'hydro', 'wind', 'solar', 'other']
      .filter(f => (gridFuelMix[f] || 0) > 0.5)
      .map(f => ({ key: f, pct: gridFuelMix[f] || 0, color: fuelColors[f] || gray }));

    let barX = margin;
    fuels.forEach(f => {
      const w = (f.pct / 100) * contentWidth;
      doc.setFillColor(...f.color);
      doc.rect(barX, y, Math.max(w, 0.5), barH, 'F');
      barX += w;
    });
    y += barH + 3;

    doc.setFontSize(6);
    let labelX = margin;
    fuels.forEach(f => {
      doc.setFillColor(...f.color);
      doc.rect(labelX, y, 3, 3, 'F');
      doc.setTextColor(...lightGray);
      const label = `${f.key.charAt(0).toUpperCase() + f.key.slice(1)} ${f.pct}%`;
      doc.text(label, labelX + 4, y + 2.5);
      labelX += doc.getTextWidth(label) + 8;
      // Wrap to next line if too wide
      if (labelX > pageWidth - margin - 30) {
        labelX = margin;
        y += 4;
      }
    });
    y += 6;

    doc.setTextColor(...gray);
    doc.setFontSize(7);
    doc.text(`Fossil: ${gridFuelMix.fossilTotal}%  |  Nuclear: ${gridFuelMix.nuclearTotal}%  |  Renewable: ${gridFuelMix.renewableTotal}%`, margin, y);
    y += 8;
  }

  // === SOLAR RANKING ===
  if (solarRanking) {
    checkPage(15);
    doc.setTextColor(...white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Solar Resource Ranking', margin, y);
    doc.setFontSize(8);
    doc.setTextColor(...green);
    doc.text(`#${solarRanking.rank} of ${solarRanking.totalStates} states  |  ${solarRanking.dailySolarRadiation} kWh/m2/day`, margin + 55, y);
    y += 5;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(sanitize(solarRanking.description), margin, y);
    y += 8;
  }

  // === WHAT THE DATA SHOWS (Scenarios) ===
  if (recommendations?.length) {
    checkPage(20);
    doc.setTextColor(...white);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('What the Data Shows', margin, y);
    y += 3;
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Scenarios based on your location and usage - not advice, just the numbers.', margin, y);
    y += 5;

    const impactColors = {
      high: [16, 185, 129],
      medium: [245, 158, 11],
      low: [59, 130, 246],
    };

    recommendations.forEach(rec => {
      const descLines = doc.splitTextToSize(sanitize(rec.description), contentWidth - 16);
      const cardH = 10 + descLines.length * 3.2;
      checkPage(cardH + 4);

      const color = impactColors[rec.impact] || impactColors.medium;
      doc.setDrawColor(...color);
      doc.setLineWidth(0.3);
      doc.setFillColor(8, 30, 20);
      doc.roundedRect(margin, y, contentWidth, cardH, 2, 2, 'FD');

      doc.setTextColor(...white);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(sanitize(rec.title), margin + 4, y + 5);

      if (rec.delta) {
        doc.setFontSize(6);
        doc.setTextColor(...color);
        doc.text(sanitize(rec.delta), pageWidth - margin - 4, y + 5, { align: 'right' });
      }

      doc.setTextColor(...gray);
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.text(descLines, margin + 4, y + 9);

      y += cardH + 3;
    });

    y += 3;
  }

  // === FINANCIAL SUMMARY ===
  checkPage(55);
  doc.setTextColor(...white);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Projection', margin, y);
  y += 6;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const finRows = [
    ['System size', `${solar.systemSizeKw} kW`],
    ['System cost (after 30% ITC)', `$${solar.systemCost.toLocaleString()}`],
    ['Annual savings', `$${financial.annualSavings.toLocaleString()}`],
    ['Payback period', `${financial.paybackYears} years`],
    ['5-year savings', `$${financial.savings5yr.toLocaleString()}`],
    ['10-year savings', `$${financial.savings10yr.toLocaleString()}`],
    ['25-year savings', `$${financial.savings25yr.toLocaleString()}`],
    ['Electricity rate', `${financial.electricityRate} cents/kWh`],
  ];

  finRows.forEach((row, i) => {
    const rowY = y + i * 5;
    if (i % 2 === 0) {
      doc.setFillColor(8, 30, 20);
      doc.rect(margin, rowY - 1.5, contentWidth, 5, 'F');
    }
    doc.setTextColor(...lightGray);
    doc.text(row[0], margin + 3, rowY + 1.5);
    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.text(row[1], pageWidth - margin - 3, rowY + 1.5, { align: 'right' });
    doc.setFont('helvetica', 'normal');
  });

  y += finRows.length * 5 + 6;

  // === DATA SOURCES ===
  checkPage(25);
  doc.setTextColor(...white);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Data Sources', margin, y);
  y += 5;

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  const sources = [
    `Solar: ${sanitize(dataSources?.solar || 'NREL PVWatts API v8')}`,
    `Rates: ${sanitize(dataSources?.rates || 'EIA API')}`,
    `Emissions: ${sanitize(dataSources?.emissions || 'EPA eGRID2023')}`,
    `Consumption: ${sanitize(dataSources?.consumption || 'EIA RECS')}`,
  ];
  sources.forEach(s => {
    doc.text(s, margin, y);
    y += 3.5;
  });
  y += 4;

  // === FOOTER ===
  checkPage(15);
  doc.setDrawColor(...green);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 5;
  doc.setFontSize(7);
  doc.setTextColor(...gray);
  doc.text('GreenGrid  |  Data-Powered Energy Intelligence', margin, y);
  doc.text('github.com/Yalamanchili7/greengrid', pageWidth - margin, y, { align: 'right' });
  y += 4;
  doc.setFontSize(6);
  doc.setTextColor(100, 100, 100);
  doc.text('This report is for informational purposes only. GreenGrid does not sell solar products or provide financial advice.', margin, y);
  y += 3;
  doc.text('All data sourced from US government agencies (NREL, EIA, EPA). Verify incentives at dsireusa.org.', margin, y);

  // Download
  const stateCode = location?.state || 'US';
  const fileName = `GreenGrid_Report_${stateCode}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(fileName);
}