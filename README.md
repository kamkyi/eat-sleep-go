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

## Supabase configuration

Copy `.env.example` to `.env.local` and replace the placeholders with the project's Supabase URL and publishable key:

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

The reusable client is exported from `src/lib/supabase.js`. Both variables are required whenever that module is imported. Only use a Supabase publishable key in the React application. Never put a secret key, service-role key, database password, PostgreSQL connection string, or JWT signing secret in a `REACT_APP_*` variable because Create React App embeds those values in the public browser bundle.

## Production build

```bash
nvm use 22
npm run build
```

The optimized static site is written to `build/`.

## Deploy to GitHub Pages

GitHub Pages is deployed by `.github/workflows/deploy.yml` whenever `main` is updated. The workflow builds the application into `build/` and deploys that artifact with GitHub Actions.

1. Create a GitHub repository. The default configuration assumes its name is `eat-sleep-go`.
2. Set the correct GitHub Pages URL in the `homepage` field in `package.json`:

   ```json
   "homepage": "https://YOUR_GITHUB_USERNAME.github.io/eat-sleep-go"
   ```

   If your repository has a different name, replace the final `eat-sleep-go` segment too.

3. In **Settings → Secrets and variables → Actions → Variables**, create these repository variables using the Supabase project URL and publishable key:

   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_PUBLISHABLE_KEY`

4. In **Settings → Pages**, select **GitHub Actions** as the source.
5. Commit the project and connect it to the GitHub repository:

   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/eat-sleep-go.git
   git branch -M main
   git push -u origin main
   ```

6. Push `main`. The workflow builds and deploys the site automatically.

For the legacy branch-based Pages workflow, the project can instead generate a committed `docs/` directory:

```bash
npm run build:pages
```

Configure `.env.local` with the two Supabase variables before running this command locally. The optimized site is written to `docs/`; if using branch-based deployment, commit that directory and configure Pages to deploy from `main` and `/docs`.

The application uses `HashRouter`, so pages such as `#/cars` and `#/booking` continue to work when opened or refreshed on GitHub Pages. The logo uses Create React App’s `PUBLIC_URL`, and remote travel images use full HTTPS URLs, so asset paths remain valid below the repository subpath.

## Project structure

```text
public/
  eat-sleep-go-logo.jpg   Official brand logo
src/
  components/             Shared layout, cards, filters, and forms
  config/site.js          Contact details and primary navigation
  data/                   Vehicle and editorial mock data
  lib/supabase.js         Validated reusable Supabase browser client
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
- No Supabase tables or access policies are currently used by the application. Define the required tables and enable Row Level Security with operation-specific policies before connecting these forms.
- No information is sent, permanently stored, or connected to a payment provider.
- The booking total is an estimate based on the selected car’s daily rate and calendar dates; delivery, deposit, fuel, and optional extras are excluded.
- Before taking real bookings, connect the forms to a secure backend or trusted form provider and add an appropriate privacy policy.
- The included phone number, email, social profiles, and LINE account are sample business values and should be replaced before public launch.

## Useful commands

```bash
npm start          # Start development mode
npm test           # Run the test suite
npm run build      # Create the production build
npm run build:pages # Create a GitHub Pages build in docs/
npm run deploy      # Alias for npm run build:pages
```

Only the Supabase project URL and publishable key belong in the React environment. All `REACT_APP_*` values are visible to site visitors.
# eat-sleep-go
