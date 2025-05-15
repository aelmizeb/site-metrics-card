export interface ScoreMap {
  performance: number;
  accessibility: number;
  'best-practices': number;
  seo: number;
  tti: number; // Time to Interactive
  si: number;  // Speed Index
  tbt: number; // Total Blocking Time
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
}