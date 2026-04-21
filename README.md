# Owl Watch

A cute little focus timer built with React, designed to work nicely inside Notion embeds.

## Features

- Countdown timer with `Start`, `Pause`, and `Reset`
- Custom session label (for example: `Deep Work` or `Reading`)
- Adjustable minutes and seconds
- One-click `Copy Notion link` button
- Clean embed mode for Notion (`embed=1`)
- Small completion sound when the timer reaches `00:00`
- Responsive layout for desktop and mobile

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
```

3. Open:

```text
http://localhost:3000
```

## Use With Notion

1. Run the app locally or deploy it.
2. Set the timer label/time in the app.
3. Click `Copy Notion link`.
4. Paste the copied link into a Notion `Embed` block.

## URL Parameters

You can preconfigure the timer through query parameters:

- `embed`: `1` to enable compact embed mode
- `m`: minutes
- `s`: seconds
- `label`: timer title

Example:

```text
https://your-domain.com/?embed=1&m=25&s=0&label=Deep%20Work
```

## Scripts

- `npm start` - Run app in development mode
- `npm test` - Run tests
- `npm run build` - Create production build

## Deployment Notes

Any static hosting provider works (Netlify, Vercel, GitHub Pages, etc.) as long as the app URL is accessible by Notion embeds.
