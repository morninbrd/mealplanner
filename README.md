# Meal Planner

A single page web app that lets people plan meals for the week and track adherence to each meal.

## Getting started

Open `index.html` in any modern browser. Everything (HTML, CSS, JS) is bundled directly in the repo so no build step is required.

### Embedding in an existing page

If you already have a site and just want to drop the planner onto one of its pages:

1. Copy `styles.css` and `planner.js` into the same folder as the page (or host them from whatever asset pipeline you use).
2. In the `<head>` of your page, add:

   ```html
   <link rel="stylesheet" href="/path/to/styles.css">
   ```

3. Paste the `<main id="jsa-weekly-planner">…</main>` block from `index.html` wherever you want the planner UI to appear.
4. Right before the closing `</body>` tag, load the script:

   ```html
   <script src="/path/to/planner.js" defer></script>
   ```

As long as the stylesheet, markup block, and script stay together, the planner will behave exactly the same as it does in `index.html`, including localStorage saving and print styles.

## Features
- configurable weekly focus (scripture, affirmation, etc.)
- dropdowns for each meal component across the week
- "Copy Monday" helper to quickly duplicate selections to other days
- adherence tracking circles for each meal
- localStorage persistence so plans remain after refreshes
- optimized print styles for landscape export
