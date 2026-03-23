# GreenGrid

**Most Americans don't know where their electricity comes from. GreenGrid shows you.**

GreenGrid is an open source tool that connects government energy data into a single, location-specific energy report for any US address. Enter your address and electricity usage, and see the complete picture — where your power comes from, what it costs the environment, and what could be different.

No account. No sales pitch. No ads. Just data.

---

## What It Does

GreenGrid pulls real-time data from three US government sources and combines them into one report:

**NREL PVWatts API** — 20+ years of satellite solar irradiance data for your exact coordinates. How much energy a solar system at your address would actually generate, month by month.

**EIA Open Data API** — Current residential electricity rates for your state. What you're paying, and how it compares to the national average.

**EPA eGRID** — Your grid's fuel mix and carbon emission rate. What percentage of your electricity comes from coal, gas, nuclear, wind, solar, and hydro. How your grid compares to the rest of the country.

No other consumer-facing tool connects all three of these public data sources into a single view.

## The Gap This Fills

| Tool | What it does | What it doesn't do |
|------|-------------|-------------------|
| Google Project Sunroof | Roof-level solar potential via LIDAR | No grid carbon data, no fuel mix, no emission context. Hasn't updated since 2018. |
| EnergySage | Solar quotes marketplace | Sales funnel. No grid transparency. Proprietary. |
| PVWatts (NREL) | Technical solar output calculator | Not consumer-friendly. No financial analysis, no carbon context. |
| DSIRE | Incentive/policy database | Raw data, not personalized. No solar or carbon analysis. |
| **GreenGrid** | **Connects NREL + EIA + EPA into one report** | **Open source. No sales. Government data only.** |

## Features

- **Personalized energy story** — A plain-English summary of the most important thing about your energy situation, generated from your location's solar resource ranking and grid carbon profile
- **GreenScore** — Composite 0-100 score across solar potential (35%), energy efficiency (25%), grid cleanliness (25%), and economic feasibility (15%)
- **Grid fuel mix breakdown** — See exactly what powers your electricity: % coal, gas, nuclear, hydro, wind, solar for your EPA eGRID subregion
- **Solar resource ranking** — Where your state ranks nationally for solar radiation, with percentile context
- **Financial projections** — 25-year savings timeline with payback period, based on your actual state electricity rate
- **Carbon impact** — Tons of CO₂ offset, translated to trees planted and cars off the road
- **What-if scenarios** — Data-driven scenarios comparing your usage to state averages, your grid's carbon profile to the national average, and your rate context
- **Federal incentive calculator** — 30% ITC calculation with your specific system cost, plus DSIRE deep link for state incentives
- **Downloadable PDF report** — Complete energy analysis as a professional PDF with all data sources cited
- **Full data transparency** — Every number links to its government source. No black boxes.

## Data Sources

| Source | Type | What it provides |
|--------|------|------------------|
| [NREL PVWatts API v8](https://developer.nrel.gov/docs/solar/pvwatts/v8/) | Live API | Solar generation estimates from satellite data (NSRDB) |
| [EIA Open Data API v2](https://www.eia.gov/opendata/) | Live API | Residential electricity rates by state |
| [EPA eGRID2023](https://www.epa.gov/egrid) | Static dataset | CO₂ emission rates + fuel mix by subregion (27 US subregions) |
| [EIA RECS](https://www.eia.gov/consumption/residential/) | Static dataset | State average household consumption |
| [OpenStreetMap Nominatim](https://nominatim.org/) | Live API | Geocoding (address → coordinates) |

All data is fetched live at analysis time. Nothing is stored.

## Getting Started

### Prerequisites
- Node.js 18+
- NREL API key (free): [developer.nrel.gov/signup](https://developer.nrel.gov/signup/)
- EIA API key (free): [eia.gov/opendata/register](https://www.eia.gov/opendata/register.php)

### Installation

```bash
git clone https://github.com/Yalamanchili7/greengrid.git
cd greengrid
npm install
```

### Environment Variables

Create a `.env` file in the root:

```
VITE_NREL_API_KEY=your_nrel_api_key
VITE_EIA_API_KEY=your_eia_api_key
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Geocoding | OpenStreetMap Nominatim |
| PDF | jsPDF |
| Fonts | Space Grotesk, DM Sans, JetBrains Mono |

## GreenScore Algorithm

A composite score (0-100) from four weighted dimensions:

```
GreenScore = (Solar × 0.35) + (Efficiency × 0.25) + (GridClean × 0.25) + (Feasibility × 0.15)
```

| Dimension | Weight | What it measures |
|-----------|--------|-----------------|
| Solar potential | 35% | NREL output ÷ your consumption |
| Energy efficiency | 25% | Your kWh vs state average (EIA) |
| Grid cleanliness | 25% | EPA emission factor inverted against national range |
| Economic feasibility | 15% | Payback years from rates + solar output |

Score labels: 80+ Strong · 65+ Good · 50+ Moderate · 35+ Limited · Below 35 Low

## Project Structure

```
src/
├── App.jsx                  # State machine (idle → loading → results → error)
├── components/
│   ├── HeroInput.jsx        # Landing page with address input
│   ├── AddressSearch.jsx    # Autocomplete + GPS geolocation
│   ├── Dashboard.jsx        # Results layout
│   ├── StorySummary.jsx     # Personalized narrative (6 paths)
│   ├── GreenScoreGauge.jsx  # Animated SVG ring gauge
│   ├── StatCard.jsx         # Metric cards with context
│   ├── GridFuelMix.jsx      # Stacked fuel mix bar
│   ├── SolarRanking.jsx     # National ranking with visual bar
│   ├── SolarChart.jsx       # Monthly generation (Recharts)
│   ├── SavingsChart.jsx     # 25-year projection (Recharts)
│   ├── Recommendations.jsx  # What-if scenarios
│   ├── StateIncentives.jsx  # Federal ITC + DSIRE link
│   ├── DataSources.jsx      # Source attribution
│   ├── Header.jsx
│   └── Footer.jsx
├── utils/
│   ├── api.js               # NREL PVWatts integration
│   ├── eiaApi.js            # EIA rate fetching with caching
│   ├── epaData.js           # eGRID subregions, fuel mix, rankings
│   ├── greenScore.js        # Scoring algorithm + scenarios
│   ├── incentives.js        # State incentive data
│   └── reportGenerator.js   # PDF report generation
```

## Philosophy

GreenGrid is a mirror, not an advisor. It shows you what the data says about your energy situation. It doesn't tell you what to do. It doesn't sell you anything. It doesn't grade you.

"What the Data Shows" — not "What You Should Do."

## Contributing

GreenGrid is open source and welcomes contributions. Some areas where help is needed:

- **More states in the incentives database** — We currently have curated data for 8 states. Adding more helps users in those states.
- **International data sources** — Extending beyond the US (starting with Canada, EU) would make GreenGrid useful globally.
- **Utility-specific rates** — Currently we use state-level EIA data. Integrating the [OpenEI Utility Rate Database](https://openei.org/wiki/Utility_Rate_Database) would give utility-specific rates.
- **Accessibility** — Screen reader support, keyboard navigation, high contrast mode.
- **Translations** — Spanish first (large solar potential in Hispanic communities in the Southwest).

### How to contribute

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a PR

Please keep PRs focused on one change. Include a description of what you changed and why.

## Roadmap

See [Issues](https://github.com/Yalamanchili7/greengrid/issues) for the current roadmap. Key planned features:

- Real-time grid carbon intensity (EIA hourly data)
- Historical grid emission trends (eGRID year-over-year)
- Community/neighborhood aggregate view
- Battery storage modeling
- Green Button API integration (real utility consumption data)

## License

MIT — see [LICENSE](LICENSE).

## Acknowledgments

Built with data from [NREL](https://www.nrel.gov/), [EIA](https://www.eia.gov/), and [EPA](https://www.epa.gov/). These agencies make energy data publicly available — GreenGrid just connects the dots.

---

Built by [Sundeep Yalamanchili](https://www.linkedin.com/in/yalamanchilisundeep)