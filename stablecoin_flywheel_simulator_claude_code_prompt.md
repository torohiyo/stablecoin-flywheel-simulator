# Claude Code Prompt: Stablecoin Flywheel Simulator for Japan and Global Diffusion

## 0. What I want you to build

Build a **high-quality interactive web app** that simulates how a stablecoin economy could gradually emerge in Japan from **2027 to 2037**, and then spread internationally through **trade, payroll, consumer wallets, AI-agent payments, and incentive programs**.

This is not a precise econometric forecast. It is a **strategy / scenario simulator** that helps users understand:

1. **Where stablecoin balances first emerge**
2. **How those balances circulate instead of immediately cashing out to fiat**
3. **How B2B adoption can spill into payroll, consumer holding, and consumer spending**
4. **How AI-agent wallets can create an independent reason for individuals to hold stablecoins**
5. **How issuers, exchanges, card networks, wallets, and merchants can accelerate adoption through incentives**
6. **How Japan’s stablecoin economy can diffuse internationally via import/export relationships**
7. **How adoption differs by country, using country-level signals derived from BVNK’s Stablecoin Utility Report 2026**

The app should be visually impressive enough for a consulting / strategy deck demo, but still clean and credible enough for financial institutions, payment companies, and policymakers.

---

# 1. Core concept

## Product title

**Stablecoin Flywheel Simulator**

Alternative Japanese title:

**SC経済圏形成シミュレーター**

## Subtitle

**B2B決済から、給与・AIエージェント・消費へ。  
ステーブルコイン残高が日本社会に滲み出し、貿易を通じて国際的に広がる条件を可視化する。**

---

# 2. The fundamental story the app must express

The app should communicate the following narrative:

> Stablecoins do not become mainstream in Japan because consumers suddenly start paying at convenience stores with crypto.  
> They first enter the economy through **high-friction payment corridors** such as international B2B payments, cross-border settlement, marketplace payouts, and treasury flows.  
> Once companies begin to hold stablecoin balances, they naturally start reusing those balances for other suppliers, contractors, and overseas partners.  
> Some of those balances eventually flow into wages, bonuses, freelance compensation, and creator payouts.  
> Meanwhile, AI-agent commerce creates a separate reason for individuals to fund non-custodial wallets with stablecoins, because agents need programmable, low-friction money to autonomously purchase APIs, data, MCP tools, and digital services.  
> Exchanges, card companies, wallet apps, issuers, and merchants then amplify adoption by providing holding rewards, lending campaigns, cashback, merchant discounts, and onboarding subsidies.  
> When stablecoin balances become large enough and useful enough, they evolve from a hidden settlement layer into a visible consumer balance.  
> At that stage, ordinary users may not call it a “stablecoin” at all. It may feel more natural as a **trusted branded JPY balance** offered by a major service provider.

---

# 3. Simulation methodology

## 3.1 Required modeling style

Use:

- **System dynamics simulation**
- **Annual time steps from 2027 to 2037**
- **Threshold events** that trigger new adoption phases
- **Country-level diffusion** via trade linkages
- **Scenario presets** plus manual sliders

Do **not** use a full agent-based model for Phase 1. The simulator should remain explainable, fast, and easy to tune.

---

# 4. Time range

The simulation period must be:

- Start year: **2027**
- End year: **2037**
- Annual step simulation
- Controls:
  - Play / pause
  - Reset
  - Step one year forward
  - Timeline scrubber from 2027–2037

---

# 5. Three adoption engines

The simulator must model **three distinct but interacting engines**.

---

## Engine A: Corporate / B2B stablecoin adoption

### Story

```text
International B2B payment pain
        ↓
Japanese companies adopt stablecoin settlement
        ↓
Corporate stablecoin balances accumulate
        ↓
Companies reuse stablecoins for suppliers and counterparties
        ↓
B2B stablecoin circulation rises
        ↓
Some payments to contractors, creators, and employees move to stablecoins
        ↓
Consumer stablecoin balances rise
```

### Examples of use cases to reflect in narrative labels

- Cross-border supplier settlement
- Marketplace payout
- Overseas contractor payment
- Intercompany treasury transfer
- Merchant settlement
- Platform-to-seller payout

### Core intuition

The key is not just “stablecoins as a rail.”  
The key is that **companies start to hold balances**, and those balances create a natural incentive to pay others in the same medium rather than repeatedly converting back and forth to fiat.

---

## Engine B: AI-agent payment adoption

### Story

```text
AI agents become capable of autonomous purchasing
        ↓
Paid APIs, data tools, MCP servers, and digital services become agent-purchasable
        ↓
Users open agent wallets / non-custodial wallets
        ↓
Users preload USDC or similar stablecoins
        ↓
A new pool of consumer stablecoin balances is created
        ↓
Unused balances spill over into other use cases such as P2P, EC, travel, or merchant payments
```

### Why this matters

This engine creates a **direct consumer reason to hold stablecoins** that is not dependent on crypto speculation or international payroll.

The UI should clearly show:

- AI Agent Users
- Agent Wallet Users
- Agent Wallet Stablecoin Balance
- Annual AI-Agent Payment Volume
- Spillover from agent wallet balances into general consumer balances

---

## Engine C: Adoption incentives from companies that want stablecoins to spread

### Story

```text
Issuers, exchanges, wallets, card companies, and payment companies want stablecoin adoption
        ↓
They deploy incentives
        ↓
Users and merchants find it economically attractive to hold, receive, or spend stablecoins
        ↓
Cash-out rates decline
        ↓
Retention and recirculation increase
        ↓
The flywheel accelerates
```

### Incentive examples that must appear in the app

| Actor | Incentive type |
|---|---|
| Card company | Stablecoin spending cashback, high-reward card campaigns |
| Exchange | Stablecoin holding rewards, lending campaigns, deposit bonuses |
| Wallet app | Wallet top-up rewards, agent-wallet campaigns, payment points |
| Stablecoin issuer | Liquidity mining-like distribution, merchant adoption support, B2B transfer incentives |
| Merchant | Stablecoin payment discount, additional loyalty points, cashback |
| Employer / payroll platform | Bonus for accepting stablecoin salary or contractor payout |

### Core intuition

Adoption is not purely organic.  
A strong part of the model should be:

> **How much adoption can be accelerated by deliberate incentive spend?**

---

# 6. Final merged flywheel

The three engines should merge into a single consumer and merchant stablecoin economy:

```text
[Corporate B2B Stablecoin Route]
                ↓
        [Corporate SC Balance]
                ↓
        [SC Payroll / Contractor Payout]
                ↓
        [Consumer SC Balance]

[AI Agent Payment Route]
                ↓
        [Agent Wallet SC Balance]
                ↓
        [Consumer SC Balance]

[Incentive Route]
                ↓
        [Higher retention, lower cash-out, higher merchant acceptance]
                ↓
        [Consumer SC Balance] → [Consumer spending] → [Merchant SC Balance] → [Merchant reuse]
```

---

# 7. Screen layout

Build a polished, responsive web app.  
Desktop-first is okay, but mobile should not break.

## Recommended macro layout

### Top
- Header / title / subtitle
- Scenario selector
- Current year badge
- Play / pause / reset / step controls

### Main area
Use a **two-row composition**:

#### Row 1: Strategy dashboard
1. Left: Control panel / sliders
2. Center: Flywheel flow diagram
3. Right: KPI panel

#### Row 2: Global diffusion dashboard
1. Large world map with country progress
2. Country detail panel on click
3. Trade diffusion legend and toggles

### Bottom section
- Time-series charts
- Threshold event timeline
- Auto-generated narrative analysis panel

---

# 8. Required UI modules

Create modular components, preferably like this:

```text
src/
  components/
    Header.tsx
    ScenarioSelector.tsx
    SimulationControls.tsx
    ControlPanel.tsx
    FlowDiagram.tsx
    KpiPanel.tsx
    WorldProgressMap.tsx
    CountryDetailDrawer.tsx
    TradeDiffusionLayer.tsx
    TimelineEvents.tsx
    ChartsSection.tsx
    NarrativePanel.tsx
    Legend.tsx
  simulation/
    model.ts
    formulas.ts
    scenarios.ts
    thresholds.ts
    countryData.ts
    tradeNetwork.ts
    diffusion.ts
    types.ts
  data/
    defaults.ts
  App.tsx
  main.tsx
```

---

# 9. Main control panel: sliders

All sliders should update the simulation.

## 9.1 Corporate / B2B adoption sliders

| Parameter | Description | Suggested initial value |
|---|---|---:|
| Cross-border SC Adoption | Share of Japanese cross-border-oriented companies adopting stablecoin settlement | 5% |
| Corporate SC Balance Ratio | Share of selected payment treasury held in SC form | 8% |
| B2B Reuse Rate | Share of received SC that companies reuse for later supplier / counterpart payments | 15% |
| SC Payroll Adoption | Share of relevant companies using SC for at least some payroll / contractor payout | 1% |
| Payroll SC Share | Share of eligible wage / payout volume paid in SC | 5% |
| Treasury Retention Bias | Tendency of companies to keep SC balances rather than cashing out | Medium |

---

## 9.2 AI-agent payment sliders

| Parameter | Description | Suggested initial value |
|---|---|---:|
| AI Agent User Growth | Annual growth in users using payment-capable AI agents | 20% |
| Agent Wallet Open Rate | Share of AI-agent users who open a wallet | 5% |
| Stablecoin Top-up Rate | Share of agent-wallet funding done in SC | 20% |
| Annual Agent Spend per User | Annual spending by one active user’s AI agent | ¥18,000 |
| Unspent Agent Balance Retention | Share of agent-wallet funds that remain as balance | 25% |
| Agent Balance Spillover Rate | Share of unused balance later used outside AI-agent context | 10% |

---

## 9.3 Incentive sliders

| Parameter | Description | Suggested initial value |
|---|---|---:|
| Exchange Holding Reward | Annual reward rate for keeping SC on exchange / wallet | 1.5% |
| Lending Campaign APY | Temporary lending / yield campaign impact | 3.0% |
| Card Cashback Rate | Cashback for spending via SC-linked card | 1.0% |
| Merchant Discount Rate | Merchant discount for direct SC payment | 0.5% |
| Salary Acceptance Bonus | Bonus value for accepting payroll / contractor payout in SC | 0.5% |
| Merchant Adoption Subsidy | Strength of merchant-side onboarding support | Medium |
| Issuer Incentive Intensity | Overall “subsidy war” / ecosystem push from SC-promoting players | Medium |

---

## 9.4 Frictions / blockers sliders

| Parameter | Description | Suggested initial value |
|---|---|---:|
| Regulatory Friction | Regulatory, tax, and accounting complexity | Medium |
| UX Friction | Wallet complexity, keys, network choice, irreversible payments | High |
| Cash-out Convenience | How easy it is to convert back into yen / fiat | High |
| Brand Trust | Trust in the service provider offering the branded JPY / SC wallet | Medium |
| Consumer Protection Quality | Refunds, dispute handling, perceived safety | Low–Medium |
| Volatility / Reserve Concern | Perceived concern about stability and reserve quality | Medium |

---

# 10. Main flywheel flow diagram

Create an animated flow diagram with visually distinct lanes.

## Required nodes

### Corporate lane
- Japanese Cross-border Companies
- Corporate SC Balance
- Overseas Suppliers
- Domestic Counterparties
- SC Payroll / Contractor Payout

### AI agent lane
- AI Users
- Agent Wallet
- Paid APIs / Data / MCP Tools
- General Consumer SC Balance

### Consumer / merchant lane
- Consumer SC Balance
- Exchange / Lending / Reward Programs
- EC / Tourism / Retail Payments
- Merchant SC Balance
- Merchant Reuse for Procurement / Settlement
- Branded JPY Economy

## Animation requirements

- Arrows grow thicker as annual flows rise
- Particle / pulse animation is desirable
- Node size can scale with balance or volume
- Stablecoin balances should visually “accumulate” in nodes
- When threshold events occur, highlight impacted nodes briefly

---

# 11. KPI panel

Display all of the following for the currently selected year:

| KPI | Description |
|---|---|
| Corporate SC Balance | Japanese corporate SC holdings |
| Annual B2B SC Payment Volume | Annual B2B volume from the simulation |
| B2B Reuse Ratio | Share of corporate SC balances reused for other payments |
| SC Payroll / Payout Users | Number of individuals receiving SC through payroll or contractor payout |
| Annual SC Payroll Volume | Total SC wage / payout amount |
| AI Agent Users | Users of payment-capable AI agents |
| Agent Wallet Users | Users who hold balances in agent wallets |
| Agent Wallet SC Balance | Total SC balance in agent wallets |
| Annual AI Agent Payment Volume | Annual programmable payment volume |
| Consumer SC Balance | Stablecoin balance held by individuals |
| Consumer Retention Rate | Share not immediately cashed out |
| Merchant Acceptance Count | Number of SC-accepting merchants |
| Consumer SC Payment Volume | EC, tourism, and retail SC payments |
| Merchant SC Balance | Stablecoin balances retained by merchants |
| Merchant Reuse Ratio | Share reused in procurement / settlement |
| Branded JPY Penetration | Progress toward consumer-facing branded JPY balance adoption |

---

# 12. Time-series charts

Create a charts section with tabs or toggles.

## Required charts

1. Corporate SC Balance over time
2. Annual B2B SC Payment Volume
3. B2B Reuse Ratio
4. SC Payroll / Payout Users
5. Annual SC Payroll Volume
6. AI Agent Users
7. Agent Wallet SC Balance
8. Consumer SC Balance
9. Consumer Retention Rate vs Cash-out Rate
10. Merchant Acceptance Count
11. Consumer SC Payment Volume
12. Merchant SC Balance and Merchant Reuse
13. Branded JPY Penetration
14. Number of countries entering each adoption stage

Use Recharts or a comparable library.

---

# 13. Threshold event system

The simulation must include an event timeline.  
Events trigger once when conditions are met.

## Required threshold events

| Condition | Event | Suggested simulation effect |
|---|---|---|
| Corporate SC Balance > ¥500bn | Corporate treasury management SaaS appears | B2B reuse + |
| B2B Reuse Ratio > 20% | ERP / accounting SaaS adds SC settlement modules | Corporate adoption + |
| Annual B2B SC Payment Volume > ¥3tn | Major Japanese payment player enters at scale | Adoption +, merchant support + |
| SC Payroll / Payout Users > 500k | Payroll acceptance campaigns expand | Payroll adoption + |
| Consumer SC Balance > ¥300bn | Major exchange strengthens holding reward campaign | Retention + |
| Consumer SC Balance > ¥500bn | Card company launches high-reward SC-linked card | Consumer spending + |
| Merchant Acceptance Count > 50k | EC and tourism operators adopt in clusters | Consumer payment utility + |
| Agent Wallet SC Balance > ¥100bn | Agent wallet becomes standard feature in fintech apps | Wallet open rate + |
| AI Agent Payment Users > 1m | USDC / SC becomes a common agent payment standard | SC top-up rate + |
| Consumer SC Payment Volume > ¥1tn | Public messaging shifts from “stablecoin” to “branded JPY balance” | Brand trust + |
| Branded JPY Penetration > 60 | “Stablecoin” label recedes from consumer UX | UI label changes |

---

# 14. Scenario presets

Include at least three scenarios.

## 14.1 Conservative case: “Back-end infrastructure only”

- B2B adoption progresses modestly
- Payroll remains niche
- AI-agent payments grow, but mainly in specialist workflows
- Incentive spend is weak
- Stablecoins remain mostly invisible financial infrastructure
- Consumer payment adoption remains limited by UX and lack of merchant acceptance

## 14.2 Base case: “Gradual spillover”

- B2B adoption grows steadily
- Some cross-border payout and contractor payments become SC-based
- AI-agent wallets gradually introduce individuals to stablecoin balances
- Exchanges and card networks provide meaningful but not overwhelming incentives
- Merchant adoption begins in EC, tourism, digital services, and cross-border commerce
- By the mid-2030s, SC becomes a visible consumer-facing balance in selected ecosystems

## 14.3 Bull case: “Branded JPY flywheel”

- International B2B settlement scales rapidly
- Corporate stablecoin balances become strategically important
- Major issuers, exchanges, cards, and wallets launch aggressive incentive programs
- Payroll and contractor payouts scale fast
- Agent wallets create another large inflow of retail stablecoin balances
- Merchants offer SC payment discounts and cashback
- Consumer SC balances become meaningful
- By 2037, a branded JPY-like balance emerges as a mainstream payment form in certain service ecosystems

---

# 15. World map module: country-by-country progress

This is a major new requirement.

## 15.1 Purpose

Display a **world map** that shows how stablecoin adoption progresses by country over time.

The world map should support three conceptual layers:

1. **Observed / survey-derived readiness** based on BVNK’s Stablecoin Utility Report 2026
2. **Simulated adoption progress** from 2027 to 2037
3. **Trade diffusion pressure** spreading from Japan and then through trade-connected countries

## 15.2 Required map behavior

- Render a world map
- Countries are color-shaded by selected metric
- Hover tooltip shows current metric
- Click a country opens detail panel / drawer
- Countries with BVNK-derived inputs should be distinguishable from countries with no data
- Japan must be included as the simulation’s focal country, even though the BVNK survey does not directly provide Japan-specific consumer baseline data
- For Japan, use **model-generated assumptions** and make that clear in the UI / metadata
- Countries without BVNK data can be muted / neutral gray, but the model should be extensible to add them later

## 15.3 Map display modes

Add toggles such as:

1. **Baseline Readiness**
2. **Consumer Stablecoin Readiness**
3. **Simulated Adoption Progress**
4. **Trade Diffusion Pressure**
5. **Current Spend vs Desired Spend Gap**
6. **SC Ownership vs Intent to Acquire**

---

# 16. BVNK-derived country data to embed in the app

Use the following data extracted from **BVNK Stablecoin Utility Report 2026**, especially Appendix figures and spending charts.

Important caveat:

> The BVNK / YouGov survey is **not a general-population survey**. Respondents either currently held / previously held crypto including stablecoins in the past 12 months, or intended to acquire crypto including stablecoins in the next 12 months. Treat these as **relative signals of readiness and demand inside a crypto-curious / crypto-engaged population**, not national adoption rates for the whole population.

---

## 16.1 Country stablecoin ownership and intent to acquire

Source: BVNK Stablecoin Utility Report 2026, Appendix Figure 6.2.

| Country | Current / recent stablecoin ownership in sample | Intent to acquire stablecoins |
|---|---:|---:|
| United Kingdom | 32% | 40% |
| France | 40% | 39% |
| Germany | 38% | 40% |
| United States | 52% | 55% |
| Australia | 62% | 61% |
| Brazil | 47% | 50% |
| Argentina | 56% | 56% |
| Colombia | 67% | 55% |
| Mexico | 47% | 49% |
| Philippines | 54% | 57% |
| Singapore | 44% | 49% |
| Thailand | 46% | 47% |
| India | 65% | 65% |
| Nigeria | 87% | 80% |
| South Africa | 70% | 72% |

---

## 16.2 Country-level stablecoin spending and desire to spend

Source: BVNK Stablecoin Utility Report 2026, Figure 3.4.

| Country | Current / previous spend in crypto incl. stablecoins | Interested in spending crypto incl. stablecoins |
|---|---:|---:|
| Nigeria | 92% | 96% |
| Argentina | 69% | 77% |
| Australia | 77% | 86% |
| Brazil | 72% | 77% |
| Colombia | 76% | 79% |
| France | 65% | 75% |
| Germany | 51% | 65% |
| India | 84% | 88% |
| Mexico | 75% | 87% |
| Philippines | 71% | 80% |
| Singapore | 66% | 79% |
| South Africa | 80% | 88% |
| Thailand | 68% | 77% |
| United Kingdom | 43% | 57% |
| United States | 58% | 69% |

### Derived metric to compute in code

For each country:

```ts
spendingGap = desiredSpend - currentSpend
```

The UI should highlight that:

- A large `spendingGap` can mean **latent demand if acceptance improves**
- A high `currentSpend` indicates **existing behavioral traction**

---

## 16.3 Region-level willingness to get paid in stablecoins

Source: BVNK Stablecoin Utility Report 2026, Figure 4.2.

| Region | Net interested in accepting crypto incl. stablecoins from international clients |
|---|---:|
| Africa | 95% |
| APAC | 87% |
| South Asia | 83% |
| Southeast Asia | 81% |
| Latin America | 70% |
| North America | 63% |
| Europe | 60% |
| All markets | 77% |

Use this as a **region-level multiplier** for:

- Payroll / contractor payout receptivity
- Cross-border work / seller adoption
- Trade-linked expansion readiness

---

## 16.4 Region-level fee savings from using stablecoins

Source: BVNK Stablecoin Utility Report 2026, Figures 5.1 and 5.2.

| Region / Segment | Mean fee savings reported vs traditional methods |
|---|---:|
| All markets | 40% |
| South Asia | 45% |
| Africa | 41% |
| Southeast Asia | 41% |
| Latin America | 38% |
| APAC | 37% |
| Europe | 35% |
| North America | 35% |
| Low and middle income economies | 41% |
| High income economies | 35% |
| Freelancers | 44% |
| Marketplace sellers | 44% |

Use this as a **regional economic incentive multiplier** for cross-border adoption and payout use cases.

---

## 16.5 Other BVNK findings that should influence narrative / model design

Use these as UI copy, tooltips, and potentially parameter justification.

### Holdings and ownership
- 54% of surveyed respondents held stablecoins in the last 12 months.
- 56% intend to acquire more stablecoins in the next 12 months.
- 13% do not currently hold stablecoins but intend to start.
- Half of stablecoin holders increased their holdings in the last 12 months.
- Average global holdings were under $200, while high-income economies held around $1,000 on average.

### Wallet distribution
- Centralized exchanges remain the most preferred place to manage stablecoins: 46%.
- 77% would open a crypto / stablecoin wallet inside their personal bank or fintech app if offered.
- The likelihood rises to 83% in low- and middle-income economies and 91% in Africa.

### Spending behavior
- 45% of holders convert to local currency.
- 27% spend directly on goods and services.
- 28% convert or spend immediately or within days.
- 71% say they would likely use a linked debit card to spend stablecoins.
- 52% have bought something from a business specifically because it accepted stablecoins.

### Getting paid in stablecoins
- Among respondents who receive stablecoin payments or wages, the stablecoin portion of annual earnings averages 35%.
- Freelancers, gig workers, and creators: 73% say crypto / stablecoins improved their ability to work with international clients.
- Marketplace sellers / hosts: 76% say accepting crypto / stablecoins improved sales volume or customer base.

### Payment motivations and frictions
- Top motivations to pay with stablecoins:
  - Lower transaction fees: 30%
  - Better security: 28%
  - Ability to use internationally: 27%
  - Merchant / site acceptance: 26%
  - Faster settlement: 25%
  - Easier currency conversion: 25%
  - Better incentives / rewards: 24%
- Top frustrations:
  - Irreversible payments / risk of loss: 30%
  - Too many steps: 22%
  - Need to choose specific blockchain or stablecoin: 20%
  - Unfavorable or unclear exchange rate: 20%
  - Confusing language: 19%

These findings should be reflected in the UX friction sliders, incentive logic, and explanatory text.

---

# 17. Country readiness index

Create a **consumer stablecoin readiness score** for BVNK-covered countries.

Use a weighted score that can be tuned later. Suggested default:

```ts
readinessScore =
  0.30 * normalizedOwnership +
  0.20 * normalizedIntentToAcquire +
  0.20 * normalizedCurrentSpend +
  0.15 * normalizedDesiredSpend +
  0.15 * normalizedRegionalPayoutInterest
```

Possible additional modifier:

```ts
readinessScore *= 1 + normalizedRegionalFeeSavings * 0.10
```

## Display categories

- 0–20: Nascent
- 20–40: Emerging
- 40–60: Developing
- 60–80: Advanced
- 80–100: Frontier

The categories are **illustrative**, not empirical labels.

---

# 18. Trade-linked diffusion model

This is essential.

## 18.1 Narrative logic

Japan’s stablecoin economy should not evolve in isolation.

As Japanese importers, exporters, payment companies, and marketplaces adopt stablecoin settlement:

- Trade partners gain exposure to SC settlement practices
- Overseas suppliers and sellers become more willing to receive SC
- Some counterparties begin to hold SC balances
- Those countries’ local fintechs / wallets / exchanges find an opportunity to support SC payments
- Adoption diffuses outward through trade corridors

This should be visible on the world map.

---

## 18.2 How to model diffusion

Create a `tradeNetwork.ts` file that defines a directed weighted graph.

Each edge should represent a **trade influence intensity** from one country to another.

Example shape:

```ts
export type TradeEdge = {
  from: string; // ISO3
  to: string;   // ISO3
  weight: number; // 0 to 1
  label?: string;
};
```

For the MVP, use **illustrative / placeholder weights** that are easy to edit later.  
The code should be designed so that actual trade data can replace them later.

Important: label these in the UI and code comments as **illustrative trade diffusion weights**, not hard empirical trade values.

---

## 18.3 Diffusion formula

Each year, country-level adoption progress should be influenced by:

1. Its own domestic readiness
2. Its region-level payout / fee-savings environment
3. Incoming trade diffusion from countries already progressing
4. Japan-specific export/import diffusion if Japan is the focal node
5. Global fintech / payment infrastructure effects once threshold events occur

Suggested formula:

```ts
countryProgress[t+1] =
  countryProgress[t]
  + domesticGrowth(country)
  + inboundTradeDiffusion(country)
  + regionalNetworkEffect(country)
  + globalInfrastructureEffect(t)
  - frictionPenalty(country)
```

Where:

```ts
inboundTradeDiffusion(country) =
  Σ over inbound edges (
    edge.weight * senderCountryProgress * tradeSettlementDigitizationMultiplier
  )
```

---

## 18.4 Visual representation

On the world map:

- Draw animated arcs / lines between countries
- Start with Japan as a key origin node
- As other countries cross higher adoption stages, they can also become diffusion sources
- Arc thickness = diffusion intensity
- Arc animation can pulse outward over time
- Countries should gradually change color as adoption progresses

---

## 18.5 Recommended trade corridor archetypes

You may define initial illustrative corridors such as:

- Japan → Singapore
- Japan → Thailand
- Japan → Philippines
- Japan → India
- Japan → United States
- Japan → Australia
- Japan → Mexico / Latin American routes if useful for scenario storytelling
- Japan → Europe via enterprise payment infrastructure

Then allow **multi-hop diffusion**:

- Singapore → Southeast Asia
- India → South Asia / Middle East-facing flows if later expanded
- United States → broader card / fintech ecosystem influence
- Europe → bank / regulated fintech influence

Again, use **illustrative assumptions**, not claims of actual trade causality.

---

# 19. Country detail drawer

Clicking a country should open a side drawer / panel showing:

## 19.1 Static data

- Country name
- Region
- Whether BVNK data is available
- Current / recent SC ownership in BVNK sample
- Intent to acquire
- Current spend
- Desired spend
- Spend gap
- Region-level payout interest
- Region-level fee savings

## 19.2 Dynamic simulation data

- Current simulated adoption progress score
- Current adoption stage label
- Trade diffusion received this year
- Stablecoin payout receptivity index
- Consumer spending receptivity index
- Relationship to Japan diffusion path, if any

## 19.3 Mini chart

- Country adoption score from 2027 to 2037

---

# 20. Adoption stages by country

The country map should visually categorize each country into a stage.

Suggested stages:

| Stage | Meaning |
|---|---|
| 0. No visible adoption | No meaningful stablecoin settlement effect |
| 1. Latent consumer demand | Survey indicators or local demand exist |
| 2. Cross-border payout adoption | Freelancers, sellers, or cross-border workers use SC |
| 3. B2B trade corridor adoption | Businesses begin SC settlement in trade flows |
| 4. Local wallet / card integration | Fintechs and cards make SC spending easier |
| 5. Consumer ecosystem formation | SC balances are reused in commerce |
| 6. Branded money layer | Users perceive it as a familiar branded balance rather than “stablecoin” |

The stage should be computed from simulation progress, but these labels should be visible in tooltips and country detail drawers.

---

# 21. Japan’s special role

Japan is the focal country of the simulator.

## 21.1 Japan-specific logic

Japan’s progression should be driven mostly by:

- Cross-border enterprise adoption
- Regulatory clarity / integration difficulty slider
- Payment company involvement
- JPY stablecoin issuance and branding
- Merchant incentives
- Card-linked spending incentives
- AI-agent wallet adoption

## 21.2 Japan data caveat

The BVNK report does **not** provide Japan-specific country survey data.  
So Japan’s baseline should be:

- Explicitly marked as **model assumption**
- Configurable in `defaults.ts`
- Adjustable through scenario presets

---

# 22. Core simulation variables

Define state roughly like this:

```ts
export type SimulationState = {
  year: number;

  // Japan corporate and B2B
  activeCorporateAdopters: number;
  corporateScBalance: number;
  annualB2BScPayments: number;
  b2bReuseRate: number;

  // Payroll / payouts
  scPayrollUsers: number;
  annualScPayrollVolume: number;

  // AI agent route
  aiAgentUsers: number;
  agentWalletUsers: number;
  agentWalletScBalance: number;
  annualAgentPaymentVolume: number;

  // Consumers
  consumerScBalance: number;
  consumerRetentionRate: number;
  cashOutRate: number;
  consumerScPaymentVolume: number;

  // Merchants
  merchantAcceptanceCount: number;
  merchantScBalance: number;
  merchantReuseRate: number;

  // Consumer positioning
  brandedJpyPenetration: number;

  // Global diffusion
  countryProgress: Record<string, CountryProgressState>;
  triggeredEvents: string[];
};
```

---

# 23. Suggested update logic

The exact constants can be tuned, but the causality should be obvious.

---

## 23.1 Corporate adoption

```text
newCorporateAdopters
= nonAdopters
× baseCorporateAdoptionRate
× crossBorderPaymentPainFactor
× brandTrustFactor
× networkEffectFromExistingAdopters
× regulatoryFrictionAdjustment
× incentiveIntensityAdjustment
```

---

## 23.2 Corporate SC balance

```text
corporateScBalance[t+1]
= corporateScBalance[t]
+ newSCProcurementByCompanies
+ scReceivedFromTradeCounterparties
- cashOutToFiat
- scUsedForPayroll
- scUsedForB2BPayments
```

---

## 23.3 B2B reuse and recirculation

```text
annualB2BScPayments
= corporateScBalance
× b2bReuseRate
× counterpartyAcceptanceFactor
```

`b2bReuseRate` should rise with:

- Corporate balance size
- Trade partner adoption
- ERP / SaaS threshold event
- Merchant / platform ecosystem maturity

---

## 23.4 SC payroll / contractor payout

```text
annualScPayrollVolume
= corporateScBalance
× payrollAllocationRate
× scPayrollAdoptionFactor
× salaryAcceptanceIncentiveFactor
```

```text
scPayrollUsers
= annualScPayrollVolume / avgAnnualSCReceiptPerUser
```

---

## 23.5 AI agent wallet route

```text
agentWalletUsers
= aiAgentUsers × agentWalletOpenRate
```

```text
annualAgentPaymentVolume
= agentWalletUsers × annualAgentSpendPerUser
```

```text
agentWalletScBalance[t+1]
= agentWalletScBalance[t]
+ scTopUps
- annualAgentPaymentVolume
+ unspentBalanceRetained
```

---

## 23.6 Consumer SC balance

Flow sources:

- SC payroll / contractor payouts
- Spillover from unused AI-agent wallet balances
- Possibly direct acquisition due to incentives or branded JPY adoption

```text
consumerScBalance[t+1]
= consumerScBalance[t]
+ scPayrollInflows
+ agentWalletSpillover
+ incentiveDrivenDirectAcquisition
- cashOut
- consumerSpending
```

---

## 23.7 Consumer retention rate

```text
consumerRetentionRate
= baseRetention
+ exchangeHoldingRewardEffect
+ lendingCampaignEffect
+ cardCashbackEffect
+ merchantAcceptanceEffect
+ brandTrustEffect
+ agentWalletFamiliarityEffect
- uxFrictionEffect
- regulatoryFrictionEffect
- cashOutConvenienceEffect
```

---

## 23.8 Consumer payment volume

```text
consumerScPaymentVolume
= consumerScBalance
× spendingPropensity
× merchantAcceptanceRate
× cashbackAndDiscountAttractiveness
```

---

## 23.9 Merchant adoption

```text
merchantAcceptanceGrowth
= untappedMerchants
× consumerBalanceDepth
× consumerPaymentGrowth
× merchantSubsidyFactor
× paymentFeeAdvantageFactor
× tradeAndTourismDemandFactor
```

---

## 23.10 Merchant SC balance and reuse

```text
merchantScBalance[t+1]
= merchantScBalance[t]
+ consumerScPaymentVolume
- merchantCashOut
- merchantReuseForProcurement
```

```text
merchantReuseForProcurement
= merchantScBalance × merchantReuseRate
```

---

## 23.11 Branded JPY penetration

```text
brandedJpyPenetration
= function(
  consumerScBalance,
  consumerScPaymentVolume,
  brandTrust,
  paymentAppDistribution,
  majorServiceProviderEntry,
  policyClarity
)
```

Once it crosses a threshold, the UI should gradually shift language:

- “Stablecoin Wallet” → “Branded JPY Balance”
- “SC payment” → “Service-branded JPY payment” where appropriate

This should be subtle and tasteful, not gimmicky.

---

# 24. Global country progress simulation

Each country should have dynamic progress variables.

```ts
export type CountryProgressState = {
  iso3: string;
  progressScore: number; // 0-100
  adoptionStage: number; // 0-6
  domesticReadinessScore: number;
  tradeDiffusionReceived: number;
  payoutReceptivity: number;
  spendingReceptivity: number;
  timeline: number[];
};
```

## Suggested country progress update

```text
progressScore[t+1]
= progressScore[t]
+ domesticReadinessGrowth
+ tradeDiffusionReceived
+ payoutUtilityGrowth
+ fintechDistributionGrowth
+ globalStandardizationGrowth
- frictionPenalty
```

---

# 25. Trade diffusion events

Add international threshold events such as:

| Condition | Event | Effect |
|---|---|---|
| Japan B2B SC Payment Volume > ¥3tn | “Japan–Asia stablecoin settlement corridors emerge” | Increase diffusion to Asian trade nodes |
| 3 BVNK countries reach Stage 3 | “Regional trade corridor standardization” | Network diffusion + |
| 5 countries reach Stage 4 | “Wallet and card providers launch multi-country stablecoin spending programs” | Consumer usability + |
| Nigeria / India / South Africa maintain high readiness while Japan adoption rises | “High-demand markets connect to Japanese payout / merchant flows” | Faster cross-border consumer and payout linkages |
| Consumer SC Payment Volume in Japan > ¥1tn | “Japanese merchants market stablecoin acceptance to inbound consumers” | Tourism / EC diffusion + |

---

# 26. Auto-generated analysis panel

The app should generate a concise explanation of the current simulation state.

Examples:

### Example 1
> 2031年時点では、企業SC残高が1.8兆円に達し、B2B再利用率が22%を超えた。これにより、ステーブルコインは単なる越境送金レールではなく、企業財務の中で再利用される決済性残高になり始めている。ERP連携イベントが発火し、今後はB2B採用の加速が見込まれる。

### Example 2
> AIエージェント向けウォレット残高が1,000億円を超えたことで、一般ユーザーが“AIに使わせるためのお金”としてステーブルコインを持つ動機が生まれている。給与経由の流入と異なる消費者保有ルートが形成されつつある。

### Example 3
> 個人SC残高は増加しているが、円転率が高く、消費決済への波及は限定的である。カード還元や加盟店割引が弱い場合、SCは受け取り資産にはなっても、支払い手段としては定着しにくい。

### Example 4
> 日本のB2B導入が進むにつれ、シンガポール、タイ、フィリピン、インドなどの貿易接続先で進捗スコアが上昇している。これは、企業間精算の標準化が国際的な採用圧力を生むという本シミュレーションの仮説を示している。

Use conditional text logic, not an LLM call.

---

# 27. Design style

## Desired tone

- Premium, modern, strategic
- More “payments strategy dashboard” than “crypto casino”
- Suitable for enterprise / banking / government audiences

## Visual style

- Clean white or light neutral background
- Soft cards and subtle shadows
- Accent blues / indigos may be used if needed
- Avoid overly playful neon crypto styling
- The world map should look sophisticated and data-driven
- Use callouts and badges for threshold events

---

# 28. Recommended tech stack

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- Zustand or useReducer
- lucide-react
- `react-simple-maps` or another suitable React map solution

---

# 29. Data architecture

Please keep all assumptions easy to edit.

## Files to use

- `defaults.ts`
- `scenarios.ts`
- `countryData.ts`
- `tradeNetwork.ts`
- `thresholds.ts`
- `formulas.ts`

Avoid scattering magic numbers across components.

---

# 30. Explicit implementation priorities

## Phase 1: Must-have

1. 2027–2037 simulation timeline
2. Scenario presets
3. Parameter sliders
4. Annual system dynamics update logic
5. KPI panel
6. Main flywheel diagram
7. Threshold event timeline
8. Time-series charts
9. World map with 15 BVNK countries + Japan
10. Country detail drawer
11. Trade diffusion arcs and simulated country progress
12. Auto-generated narrative analysis panel

## Phase 2: Nice-to-have

- Better particle animations on flows
- Animated world map arcs
- CSV export
- Snapshot / presentation mode
- Custom country-trade editor
- Toggle between global map modes
- Tooltip explaining which data is BVNK-derived vs model-assumed

---

# 31. Important caveats to show in the app

Add a small but clear methodological note:

> This simulator is a strategic scenario tool, not a precise forecast.  
> Country-level readiness indicators are derived from BVNK / YouGov’s Stablecoin Utility Report 2026 and reflect a crypto-engaged survey population, not whole-country adoption rates.  
> Japan-specific values and trade-diffusion weights are model assumptions designed for scenario analysis and can be edited.

---

# 32. What I want the final app to make people realize

The app should leave the viewer with this understanding:

> Stablecoins may become mainstream in Japan not because consumers spontaneously choose crypto at checkout, but because:
> 
> 1. Companies first use them where payments are currently expensive or slow
> 2. Those companies accumulate reusable balances
> 3. Balances flow into payroll, payouts, and contractors
> 4. AI agents create a new consumer-wallet funding use case
> 5. Exchanges, cards, merchants, and issuers subsidize holding and usage
> 6. Merchants gain a reason to accept them
> 7. International trade links export the model to connected markets
> 8. In the end, the consumer may experience it not as “stablecoin,” but as a trusted branded JPY balance embedded in a familiar service

---

# 33. Output expectation

Please implement this as a production-quality front-end web app with clean structure and maintainable code.

When you finish:

1. Run the app locally
2. Check that all controls work
3. Verify no chart or map breaks at different screen widths
4. Confirm simulation state updates consistently when sliders or scenarios change
5. Ensure threshold events fire only once and remain visible in the timeline
6. Ensure country details and map shading update by year
7. Ensure the app can be extended later with real trade datasets and refined assumptions
