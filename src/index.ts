import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import fs from 'fs';
import { drawSvg } from './drawSvg';
import { URL_TO_ANALYZE, OUTPUT_PATH } from '../config';
import { ScoreMap } from './types';

async function runLighthouse(url: string): Promise<any> {
  const browser = await puppeteer.launch({ headless: true, args: ['--remote-debugging-port=9222'] });
  const result = await lighthouse(url, { port: 9222, output: 'json' });
  await browser.close();
  return result.lhr;
}

async function main() {
  if (!URL_TO_ANALYZE) {
    throw new Error('No URL provided. Set the URL environment variable.');
  }

  const report = await runLighthouse(URL_TO_ANALYZE);
  const scores: ScoreMap = {
    performance: report.categories.performance.score,
    accessibility: report.categories.accessibility.score,
    'best-practices': report.categories['best-practices'].score,
    seo: report.categories.seo.score,
  };

  const svgBuffer = drawSvg(scores);
  fs.mkdirSync('./dist', { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, svgBuffer);
  console.log(`SVG card generated at ${OUTPUT_PATH}`);
}

main();