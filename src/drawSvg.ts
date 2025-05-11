import { createCanvas } from 'canvas';
import { ScoreMap } from './types';

export function drawSvg(scores: ScoreMap, siteUrl: string): Buffer {
  const width = 500;
  const height = 120;
  const canvas = createCanvas(width, height, 'svg');
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height); // transparent background

  // Font and Text Style
  ctx.fillStyle = '#fff';
  ctx.font = '16px Sans';
  ctx.fillText('Website Performance Metrics : ' + siteUrl, 10, 20);

  // Metric Names and Values
  const metrics = [
    { name: 'Performance', value: scores.performance * 100, color: '#fbbc04' },
    { name: 'Accessibility', value: scores.accessibility * 100, color: '#fbbc04' },
    { name: 'Best Practices', value: scores['best-practices'] * 100, color: '#34a853' },
    { name: 'SEO', value: scores.seo * 100, color: '#34a853' },
  ];

  // Drawing circular indicators and text
  metrics.forEach((metric, index) => {
    const x = 80 + index * 120; // Position the circles horizontally
    const y = 60;

    // Draw circle
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fillStyle = metric.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw score centered
    const scoreText = Math.round(metric.value).toString();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Sans';
    const textWidth = ctx.measureText(scoreText).width;
    ctx.fillText(scoreText, x - textWidth / 2, y + 6); // vertically centered

    // Draw label centered under circle
    ctx.font = '14px Sans';
    const labelWidth = ctx.measureText(metric.name).width;
    ctx.fillText(metric.name, x - labelWidth / 2, y + 45);
  });

  return canvas.toBuffer();
}