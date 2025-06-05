import { createCanvas, registerFont, CanvasRenderingContext2D } from 'canvas';
import { ScoreMap } from './types';

registerFont('./src/fonts/MaterialIcons-Regular.ttf', { family: 'Material Icons' });

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 280;

type Theme = 'dark' | 'transparent';

function getColors(theme: Theme) {
  if (theme === 'dark') {
    return {
      MAIN_COLOR: '#ffffff',
      SECONDARY_COLOR: '#777777',
      BACKGROUND_COLOR: '#1a1a1a',
    };
  }
  // default to transparent
  return {
    MAIN_COLOR: '#ffffff',
    SECONDARY_COLOR: '#777777',
    BACKGROUND_COLOR: 'transparent',
  };
}

function getColor(value: number): string {
  if (value >= 90) return '#34a853'; // green
  if (value >= 50) return '#fbbc04'; // orange
  return '#ea4335'; // red
}

export function drawSvg(scores: ScoreMap, siteUrl: string, theme: Theme = 'dark'): Buffer {
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, 'svg');
  const ctx = canvas.getContext('2d');
  const { MAIN_COLOR, SECONDARY_COLOR, BACKGROUND_COLOR } = getColors(theme);

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (BACKGROUND_COLOR !== 'transparent') {
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  drawHeader(ctx, siteUrl, MAIN_COLOR);
  drawScoreCircles(ctx, scores, MAIN_COLOR);
  drawDetailedMetrics(ctx, scores, MAIN_COLOR, SECONDARY_COLOR);

  return canvas.toBuffer();
}

function drawHeader(ctx: CanvasRenderingContext2D, siteUrl: string, mainColor: string) {
  const text = `Website Performance Metrics: ${siteUrl}`;
  ctx.fillStyle = mainColor;
  ctx.font = '16px Sans';
  const width = ctx.measureText(text).width;
  ctx.fillText(text, (CANVAS_WIDTH - width) / 2, 20);
}

function drawScoreCircles(ctx: CanvasRenderingContext2D, scores: ScoreMap, mainColor: string) {
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
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Score text
    const scoreText = Math.round(metric.value).toString();
    ctx.fillStyle = mainColor;
    ctx.font = 'bold 16px Sans';
    const textWidth = ctx.measureText(scoreText).width;
    ctx.fillText(scoreText, x - textWidth / 2, y + 6);

    // Label
    ctx.font = '14px Sans';
    const labelWidth = ctx.measureText(metric.name).width;
    ctx.fillText(metric.name, x - labelWidth / 2, y + 50);
  });
}

function drawDetailedMetrics(
  ctx: CanvasRenderingContext2D,
  scores: ScoreMap,
  mainColor: string,
  secondaryColor: string
) {
  const metrics = [
    { icon: '\ue8b5', label: 'Time to Interactive', value: `${scores.tti.toFixed(2)} s` },      // schedule
    { icon: '\ue9e4', label: 'Speed Index', value: `${scores.si.toFixed(2)} s` },               // speed
    { icon: '\ue14b', label: 'Total Blocking Time', value: `${scores.tbt.toFixed(2)} s` },      // block
    { icon: '\ue3ae', label: 'First Contentful Paint', value: `${scores.fcp.toFixed(2)} s` },   // paint
    { icon: '\ue3f4', label: 'Largest Contentful Paint', value: `${scores.lcp.toFixed(2)} s` }, // image
    { icon: '\ue41c', label: 'Cumulative Layout Shift', value: `${scores.cls.toFixed(2)}` },    // straighten
  ];

  const startY = 150;

  metrics.forEach((metric, i) => {
    const y = startY + i * 24;

    // Icon
    ctx.font = '20px "Material Icons"';
    ctx.fillStyle = secondaryColor;
    ctx.fillText(metric.icon, 30, y + 5);

    // Text
    ctx.font = '14px Sans';
    ctx.fillStyle = mainColor;
    ctx.fillText(`${metric.label}:`, 60, y);
    ctx.fillText(metric.value, 300, y);
  });
}
