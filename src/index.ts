import puppeteer from 'puppeteer';
import fs from 'fs';
import { drawSvg } from './drawSvg';
import { URL_TO_ANALYZE, OUTPUT_PATH } from '../config';
import { ScoreMap } from './types';

const THEME = process.env.THEME === 'transparent' ? 'transparent' : 'dark';

async function runLighthouse(url: string): Promise<any> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--remote-debugging-port=9222'],
  });

  const { default: lighthouse } = await import('lighthouse');

  const result = await lighthouse(url, {
    port: 9222,
    output: 'json',
  });

  await browser.close();
  return result?.lhr;
}

async function main() {
  if (!URL_TO_ANALYZE) {
    throw new Error('No URL provided. Set the URL environment variable.');
  }

  const report = await runLighthouse(URL_TO_ANALYZE);

  if (!report) {
    throw new Error('Lighthouse report is undefined. Something went wrong.');
  }

  const scores: ScoreMap = {
    performance: report.categories.performance.score,
    accessibility: report.categories.accessibility.score,
    'best-practices': report.categories['best-practices'].score,
    seo: report.categories.seo.score,
    tti: report.audits['interactive'].numericValue / 1000,
    si: report.audits['speed-index'].numericValue / 1000,
    tbt: report.audits['total-blocking-time'].numericValue / 1000,
    fcp: report.audits['first-contentful-paint'].numericValue / 1000,
    lcp: report.audits['largest-contentful-paint'].numericValue / 1000,
    cls: report.audits['cumulative-layout-shift'].numericValue,
  };

  const svgBuffer = drawSvg(scores, URL_TO_ANALYZE, THEME);
  fs.mkdirSync('./dist', { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, svgBuffer);
  console.log(`SVG card generated at ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Error running site-metrics-card:', err);
  process.exit(1);
});
