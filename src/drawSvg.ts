import { createCanvas } from 'canvas';
import { ScoreMap } from './types';

export function drawSvg(scores: ScoreMap): Buffer {
  const canvas = createCanvas(400, 120, 'svg');
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 400, 120);

  ctx.fillStyle = '#000';
  ctx.font = '16px Sans';
  ctx.fillText('Website Performance Metrics', 10, 25);

  const metrics = [
    { name: 'Performance', value: scores.performance * 100 },
    { name: 'Accessibility', value: scores.accessibility * 100 },
    { name: 'Best Practices', value: scores['best-practices'] * 100 },
    { name: 'SEO', value: scores.seo * 100 },
  ];

  metrics.forEach((metric, index) => {
    ctx.fillText(`${metric.name}: ${Math.round(metric.value)}`, 10, 50 + index * 20);
  });

  return canvas.toBuffer();
}