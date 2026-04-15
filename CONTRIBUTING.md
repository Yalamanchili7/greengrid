# Contributing to GreenGrid

Thanks for your interest in GreenGrid! This project exists to make energy data transparent and accessible for homeowners. Every contribution helps more people understand where their electricity comes from.

## How to Contribute

### 1. Fork & Clone

```bash
git clone https://github.com/Yalamanchili7/greengrid.git
cd greengrid
npm install
```

### 2. Set Up Environment

You'll need free API keys from two government sources:

- **NREL API key**: [developer.nrel.gov/signup](https://developer.nrel.gov/signup/)
- **EIA API key**: [eia.gov/opendata/register](https://www.eia.gov/opendata/register.php)

Create a `.env` file in the project root:

```
VITE_NREL_API_KEY=your_nrel_api_key
VITE_EIA_API_KEY=your_eia_api_key
```

### 3. Run Locally

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### 4. Make Your Changes

- Create a feature branch: `git checkout -b feature/your-feature`
- Keep changes focused — one PR per feature or fix
- Test with a few different US addresses to make sure things work

### 5. Submit a Pull Request

- Push your branch and open a PR against `main`
- Describe what you changed and why
- Include screenshots if you changed the UI

## Where Help Is Needed

### Add State Incentive Data (Great First Contribution)

We currently have curated incentive data for 8 states. Adding your state helps homeowners there. See `src/utils/incentives.js` for the format — each state entry includes:

- State-level incentive programs
- Tax credits or rebates
- Net metering policies
- Link to DSIRE for full details

### Accessibility

- Screen reader support
- Keyboard navigation
- High contrast mode
- WCAG 2.1 AA compliance

### Translations

- Spanish is the first priority (large solar potential in Hispanic communities in the Southwest)
- Other languages welcome

### International Data Sources

- Extending beyond the US, starting with Canada and EU
- Requires finding equivalent government data sources for grid mix and solar potential

### Utility-Specific Rates

- Currently we use state-level EIA data
- Integrating the [OpenEI Utility Rate Database](https://openei.org/wiki/Utility_Rate_Database) would give more accurate, utility-specific rates

## Code Guidelines

- **React functional components** with hooks (no class components)
- **Tailwind CSS** for styling — follow existing patterns
- **No external analytics or tracking** — this is a privacy-respecting project
- **Government data sources only** — no proprietary data
- **Keep it accessible** — use semantic HTML, ARIA labels where needed

## Project Structure

```
src/
├── components/    # React components (UI)
├── utils/         # Data fetching, calculations, algorithms
├── App.jsx        # Main app state machine
└── index.css      # Tailwind + custom styles
```

- **components/** — Each file is one visual section of the app
- **utils/api.js** — NREL PVWatts integration
- **utils/eiaApi.js** — EIA electricity rate fetching
- **utils/epaData.js** — EPA eGRID subregion data (static)
- **utils/greenScore.js** — GreenScore algorithm
- **utils/incentives.js** — State incentive database
- **utils/reportGenerator.js** — PDF export

## Reporting Bugs

Open an issue with:
- What you expected to happen
- What actually happened
- The address you tested with (or general area, no need for exact address)
- Browser and device info

## Questions?

Open a discussion or issue on GitHub. No question is too basic — this project is for the community.
