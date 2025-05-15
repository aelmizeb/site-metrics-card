import { createCanvas } from 'canvas';
import { ScoreMap } from './types';

export function drawSvg(scores: ScoreMap, siteUrl: string): Buffer {
  const width = 600;
  const height = 260;
  const canvas = createCanvas(width, height, 'svg');
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height); // transparent background

  // Font and Text Style
  ctx.fillStyle = '#fff';
  ctx.font = '16px Sans';
  const headerText = 'Website Performance Metrics: ' + siteUrl;
  const headerWidth = ctx.measureText(headerText).width;
  ctx.fillText(headerText, (width - headerWidth) / 2, 20);

  const getColor = (value: number): string => {
    if (value >= 90) return '#34a853'; // green
    if (value >= 50) return '#fbbc04'; // orange
    return '#ea4335'; // red
  };

  const metrics = [
    { name: 'Performance', value: scores.performance * 100 },
    { name: 'Accessibility', value: scores.accessibility * 100 },
    { name: 'Best Practices', value: scores['best-practices'] * 100 },
    { name: 'SEO', value: scores.seo * 100 },
  ];

  metrics.forEach((metric, index) => {
    const x = 80 + index * 120;
    const y = 70;
    const color = getColor(metric.value);

    // Circle
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Score text
    const scoreText = Math.round(metric.value).toString();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Sans';
    const textWidth = ctx.measureText(scoreText).width;
    ctx.fillText(scoreText, x - textWidth / 2, y + 6);

    // Label
    ctx.font = '14px Sans';
    const labelWidth = ctx.measureText(metric.name).width;
    ctx.fillText(metric.name, x - labelWidth / 2, y + 45);
  });

  // Detailed metrics with emojis
  const detailedMetrics = [
    { icon: '⏱️', label: 'Time to Interactive', value: `${scores.tti.toFixed(2)} s` },
    { icon: '🚀', label: 'Speed Index', value: `${scores.si.toFixed(2)} s` },
    { icon: '⛔', label: 'Total Blocking Time', value: `${scores.tbt.toFixed(2)} s` },
    { icon: '🖼️', label: 'First Contentful Paint', value: `${scores.fcp.toFixed(2)} s` },
    { icon: '🖼️', label: 'Largest Contentful Paint', value: `${scores.lcp.toFixed(2)} s` },
    { icon: '📐', label: 'Cumulative Layout Shift', value: `${scores.cls.toFixed(2)}` },
  ];

  ctx.font = '14px Sans';
  let startY = 150;
  detailedMetrics.forEach((metric, i) => {
    ctx.fillStyle = '#fff';
    ctx.fillText(`${metric.icon} ${metric.label}:`, 30, startY + i * 20);
    ctx.fillText(metric.value, 300, startY + i * 20);
  });

  return canvas.toBuffer();
}