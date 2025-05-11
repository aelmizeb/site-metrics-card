import { createCanvas } from 'canvas';
import { ScoreMap } from './types';

export function drawSvg(scores: ScoreMap): Buffer {
  const canvas = createCanvas(500, 120, 'svg'); // Increased width for better spacing
  const ctx = canvas.getContext('2d');

  // Set transparent background
  ctx.clearRect(0, 0, 500, 120);

  // Font and Text Style
  ctx.fillStyle = '#fff';
  ctx.font = '16px Sans';
  ctx.fillText('Website Performance Metrics', 10, 25);

  // Metric Names and Values
  const metrics = [
    { name: 'Performance', value: scores.performance * 100, color: '#FFB600' },
    { name: 'Accessibility', value: scores.accessibility * 100, color: '#FFAA00' },
    { name: 'Best Practices', value: scores['best-practices'] * 100, color: '#4CAF50' },
    { name: 'SEO', value: scores.seo * 100, color: '#4CAF50' },
  ];

  // Drawing circular indicators and text
  metrics.forEach((metric, index) => {
    const x = 80 + index * 120; // Position the circles horizontally
    const y = 60;

    // Draw circle for the metric score
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2, false);
    ctx.fillStyle = metric.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw score inside the circle
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Sans';
    ctx.fillText(`${Math.round(metric.value)}`, x - 10, y + 5);

    // Draw the metric name
    ctx.fillStyle = '#fff';
    ctx.font = '14px Sans';
    ctx.fillText(metric.name, x - 35, y + 40);
  });

  return canvas.toBuffer();
}