# Eat, Sleep, Go

A responsive car-rental and travel-lifestyle website for **Eat, Sleep, Go**. The site presents the fleet, lets visitors filter and review vehicles, estimates rental costs, and records demo booking and contact form submissions in the browser.

## Technology

- Create React App / React 19
- React Router 6 with `HashRouter`
- Lucide React icons
- CSS custom properties and mobile-first responsive layouts
- GitHub Pages deployment from the `main` branch
- Node.js 22 and npm

## Requirements

- [NVM](https://github.com/nvm-sh/nvm) (recommended)
- Node.js 22
- npm

The included `.nvmrc` selects the correct Node.js major version.

## Install and run locally

```bash
nvm install 22
nvm use 22
npm install
npm start
```

Create React App opens the development site at `http://localhost:3000`. Changes reload automatically.

## Production build

```bash
nvm use 22
npm run build
```

The optimized static site is written to `build/`.

## Deploy to GitHub Pages

1. Create a GitHub repository. The default configuration assumes its name is `eat-sleep-go`.
2. In `package.json`, replace `YOUR_GITHUB_USERNAME` in the `homepage` value:

   ```json
   "homepage": "https://YOUR_GITHUB_USERNAME.github.io/eat-sleep-go"
   ```

   If your repository has a different name, replace the final `eat-sleep-go` segment too.

3. Commit the project and connect it to the GitHub repository:

   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/eat-sleep-go.git
   git branch -M main
   git push -u origin main
   ```

4. Create the GitHub Pages build:

   ```bash
   npm run deploy
   ```

   The optimized site is written to `docs/`. Commit that directory and push it to `main`.

5. In the repository’s **Settings → Pages**, select **Deploy from a branch**, then choose the `main` branch and `/docs`.

The application uses `HashRouter`, so pages such as `#/cars` and `#/booking` continue to work when opened or refreshed on GitHub Pages. The logo uses Create React App’s `PUBLIC_URL`, and remote travel images use full HTTPS URLs, so asset paths remain valid below the repository subpath.

## Project structure

```text
public/
  eat-sleep-go-logo.jpg   Official brand logo
src/
  components/             Shared layout, cards, filters, and forms
  config/site.js          Contact details and primary navigation
  data/                   Vehicle and editorial mock data
  pages/                  Route-level pages
  App.js                  Lazy routes and application shell
  App.css                 Component and responsive styles
  index.css               Design tokens and global styles
```

## Updating content

### Replace the logo

Replace `public/eat-sleep-go-logo.jpg` with the new logo using the **same filename**. Keep a square canvas and preserve the artwork’s aspect ratio. The header, footer, manifest, and browser icon will update together.

### Update vehicles

Edit `src/data/cars.js`. Every vehicle needs a unique, stable `id`; that ID becomes part of its details-page URL. Pricing is stored in Thai baht as `pricePerDay` and `pricePerMonth`. Set `featured: true` to show a car on the home page and `available: false` to prevent new booking requests for it.

### Update contact information

Edit `src/config/site.js`. Phone, email, social links, service area, business hours, and navigation are kept there to avoid repeating information across pages.

### Update destinations and testimonials

Edit `src/data/content.js`.

## Forms and current limitations

- The booking and contact forms are front-end demos only.
- No information is sent, permanently stored, or connected to a payment provider.
- The booking total is an estimate based on the selected car’s daily rate and calendar dates; delivery, deposit, fuel, and optional extras are excluded.
- Before taking real bookings, connect the forms to a secure backend or trusted form provider and add an appropriate privacy policy.
- The included phone number, email, social profiles, and LINE account are sample business values and should be replaced before public launch.

## Useful commands

```bash
npm start          # Start development mode
npm test           # Run the test suite
npm run build      # Create the production build
npm run deploy     # Create the GitHub Pages build in docs/
```

Do not place API keys or other secrets in React source files or `REACT_APP_*` environment variables; frontend values are visible to site visitors.
# eat-sleep-go
