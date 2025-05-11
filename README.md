# site-metrics-card

**Display your website's performance metrics in your GitHub README.**  
A lightweight tool focused solely on analyzing and visualizing website performance.

![Website Metrics Card](./dist/website-metrics.svg)

## 🚀 Features

- Analyze any public website
- Measure Core Web Vitals using Lighthouse
- Generate an SVG card with performance scores
- Deployable via GitHub Actions
- Easy to embed in your README

## 📦 Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run locally:
   ```bash
   URL=https://www.wikipedia.org npm start
   ```

3. Or let GitHub Actions generate it daily.

## 💡 Example

```md
![My Website](https://yourusername.github.io/site-metrics-card/dist/website-metrics.svg)
```

## 🛠️ Tech Stack

- Node.js
- Puppeteer + Lighthouse
- node-canvas
- TypeScript
- GitHub Actions

## 📄 License
MIT