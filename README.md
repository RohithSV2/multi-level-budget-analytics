# MULTI-LEVEL BUDGET TRACKER ANALYTICS
### Complete Fullstack Application & Power BI Enterprise Data Hub
**Data Visualization Lab Project — NIE Mysuru**

---

## 🌟 Executive Summary
The **Multi-Level Budget Tracker Analytics** is an end-to-end fullstack financial intelligence platform and Power BI project that analyzes budgets and cash flows across three distinct tiers of the economy:
1. **Tier 1 — Micro / Individual Level**: Personal household finance tracking income vs. expenses, category-wise spending, savings rate %, planned monthly budget limits, budget variance, and overspending detection.
2. **Tier 2 — Meso / Organization Level**: Enterprise financial performance using Superstore data, modeling departments (*Consumer*, *Corporate*, *Home Office*) as cost centers, computing departmental expenditure (`Cost = Sales - Profit`), gross revenue, profitability, and regional variances.
3. **Tier 3 — Macro / State & National Level**: Public finance tracking state-level revenues, expenditures, fiscal deficits, debt-to-revenue ratios, and national central ministry sector allocations.

The system includes **both**:
- **A Fullstack Web Application** (Flask REST API + SQLite + modern responsive frontend with live user input forms for Individual & Organization levels, real-time Chart.js visuals, and What-If scenario forecasting).
- **A Complete Power BI Production Hub** (Star Schema models, DAX Measures library, Power Query M-code, branded JSON theme, and clean datasets for 1-click Power BI builds).

---

## 📁 Project Directory Structure
```
d:\Multi level budget\
├── BudgetTrackerAnalytics/
│   ├── 01_RawData/                     # Authentic datasets matching Kaggle specs
│   │   ├── individual_transactions.csv # Daily personal transactions (~2,500 rows)
│   │   ├── org_superstore.csv          # Superstore enterprise orders (~3,200 rows)
│   │   ├── state_finance_india.csv     # State fiscal indicators (1980-2024 series)
│   │   └── national_union_budget.csv   # Central ministry allocations
│   ├── 02_CleanData/                   # Pre-cleaned, transformed CSVs
│   │   ├── individual_clean.csv        # Added MonthYear, MonthlyBudget
│   │   ├── org_clean.csv               # Segment -> Department, Cost, BudgetVariance
│   │   ├── state_clean.csv             # Unpivoted long format
│   │   ├── national_clean.csv          # Clean allocation & expenditure
│   │   └── DateTable.csv               # Shared central calendar (2014-2025)
│   ├── 03_PowerBI/                     # Complete Power BI Implementation Kit
│   │   ├── DAX_Measures_Library.dax    # All DAX measure formulas
│   │   ├── PowerQuery_M_Cleaning.pq    # Power Query Advanced Editor M-scripts
│   │   ├── navy_amber_teal_theme.json  # Branded Power BI theme (#1F3864, #C77F16, #2E7D74)
│   │   ├── PowerBI_StepByStep_Guide.md # Full guide for building the .pbix file
│   │   └── Presentation_Cheatsheet.md  # Viva questions & model answers for faculty
│   └── 04_Screenshots/                 # Folder for PPT/report screenshots
├── backend/
│   ├── app.py                          # Flask REST API + User input handlers + CSV sync
│   ├── database.py                     # SQLite schema & persistence
│   ├── analytics_engine.py             # DAX-equivalent Python engine + Holt-Winters forecasting
│   ├── generate_datasets.py            # Dataset synthesis and refresh script
│   ├── budget_tracker.db               # SQLite database
│   └── requirements.txt                # Python dependencies
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css               # Modern Power BI design system CSS
│   │   └── js/
│   │       ├── api.js                  # Frontend API client
│   │       ├── charts.js               # Chart.js visualization engine
│   │       └── app.js                  # UI controller, forms, what-if sliders, tabs
│   └── templates/
│       └── index.html                  # 5-page dashboard single page application
├── run_project.bat                     # Windows 1-click execution script
├── run_project.py                      # Python cross-platform runner
└── README.md                           # Master documentation
```

---

## 🚀 Quick Start Guide

### 1. Launch the Fullstack Web Dashboard
Double-click `run_project.bat` or run:
```bash
python run_project.py
```
This automatically launches your browser at `http://127.0.0.1:5000`.

### 2. Open & Build in Power BI Desktop
1. Open **Power BI Desktop**.
2. Go to **View → Themes → Browse for themes** → select `BudgetTrackerAnalytics/03_PowerBI/navy_amber_teal_theme.json`.
3. Click **Home → Get Data → Text/CSV** and import the 4 clean datasets from `BudgetTrackerAnalytics/02_CleanData/`:
   - `individual_clean.csv`
   - `org_clean.csv`
   - `state_clean.csv`
   - `national_clean.csv`
4. Create the shared **DateTable** via **Modeling → New Table**:
   ```dax
   DateTable = 
   ADDCOLUMNS(
       CALENDAR(DATE(2014, 1, 1), DATE(2025, 12, 31)),
       "Year", YEAR([Date]),
       "MonthName", FORMAT([Date], "MMM"),
       "MonthNum", MONTH([Date]),
       "Quarter", "Q" & FORMAT([Date], "Q"),
       "MonthYear", FORMAT([Date], "MMM yyyy")
   )
   ```
5. In **Model View**, establish the Star Schema relationships:
   - `DateTable[Date]` (1) ─── 1:M ───> `Individual[Date]` (*)
   - `DateTable[Date]` (1) ─── 1:M ───> `Organization[Order Date]` (*)
   - `DateTable[Year]` (1) ─── 1:M ───> `State[Year]` (*)
   - `DateTable[Year]` (1) ─── 1:M ───> `National[Year]` (*)
6. Create the `_Measures` table and paste the measures from `BudgetTrackerAnalytics/03_PowerBI/DAX_Measures_Library.dax`.

---

## 🖥️ Dashboard Pages Spec (Built in Web App & Power BI)

### Page 1 — Executive Overview
- **6 KPI Cards**: Total Income (Ind), Total Revenue (Org), Total State Revenue, Net Savings (with green/red conditional formatting), Total Profit (Org), Fiscal Deficit.
- **Top Slicers**: Year (2021-2024) and Level (Individual, Organization, State).
- **Normalized Combo Chart**: Inflows vs. Outflows across all three economic tiers over time.

### Page 2 — Individual Analytics (Micro-Budget)
- **User Inputs**:
  - **"+ Add Transaction"**: Enter personal income or expense with Date, Category, Subcategory, Amount (₹), Mode (Cash/Card/UPI), Note.
  - **"Set Category Budgets"**: Adjust planned monthly spending targets per category.
- **Visuals**:
  - **Donut Chart**: Total Expense by Category.
  - **Line Chart**: Monthly actual spending vs. Planned target budget threshold line.
  - **Bar Chart**: Budget Variance by Category (color-coded: Green = within budget, Red = overspent).
  - **Searchable Ledger Table**: Live transaction history with deletion support.

### Page 3 — Organization Analytics (Meso-Budget)
- **User Inputs**:
  - **"+ Add Enterprise Cost / Order"**: Enter new orders/expenses with Department (Consumer, Corporate, Home Office), Region, Category, Sub-Category, Sales, Discount, Profit.
  - Calculates `Cost = Sales - Profit` and `BudgetVariance = Sales - Cost`.
- **Visuals**:
  - **Clustered Bar Chart**: Total Revenue vs. Total Cost by Department.
  - **Treemap / Hierarchy Visual**: Profitability drilldown by Category and Sub-Category.
  - **Line Chart**: Quarterly Revenue Growth %.
  - **Matrix Table**: Region × Category Heatmap of Budget Variance values.

### Page 4 — State & National Analytics (Macro-Finance)
- **Visuals**:
  - **Interactive State Map / Cards**: State-wise revenue, expenditure, fiscal deficit, and debt-to-revenue ratio for Indian states.
  - **Line Chart**: Longitudinal state revenue vs. public expenditure (2014-2024).
  - **Horizontal Bar Chart**: National Union Budget Sector Allocation ranked descending with Sector Share % badges.

### Page 5 — Predictive Analytics & What-If Engine
- **What-If Sliders**:
  - *Individual Expense Cut Target* (-25% to +35%)
  - *Enterprise Revenue Growth Goal* (-10% to +25%)
  - *State Deficit Reduction Target* (0% to 20%)
- **3 Side-by-Side Forecast Charts with 95% Confidence Interval Bands**:
  1. Personal Monthly Expense Forecast (Next 6 months).
  2. Enterprise Quarterly Revenue Forecast (Next 4 quarters).
  3. State Public Expenditure Forecast (Next 3 years).
- **Faculty "So What?" Analytical Interpretation Box**: Translates statistical forecasts into concrete fiscal decisions.

### Page 6 — Power BI Integration Center
- Direct downloads for all 5 clean CSVs and raw datasets.
- 1-Click "Sync Live Database to CSVs" button so any transactions/orders added via the web app immediately refresh in Power BI Desktop!
- One-click copy for the entire DAX Measures Library and Power Query M-code.
- Embedded Viva Presentation Cheatsheet.

---

## 🎓 Faculty Viva & Lab Presentation Tips

1. **Why Star Schema?**
   - Keeps fact tables independent (no ambiguous bi-directional filters between Individual and Organization).
   - Allows a single `DateTable` slicer to filter all visuals across all 3 levels simultaneously.

2. **Why was Power BI selected?**
   - Unifies ETL (Power Query M), business logic (DAX context transition), relational modeling, and built-in Holt-Winters exponential smoothing into a single reproducible file.

3. **How does user input sync with Power BI?**
   - User inputs entered in the web app are saved into SQLite and automatically appended to the CSVs in `BudgetTrackerAnalytics/02_CleanData/`.
   - In Power BI Desktop, clicking **Refresh** immediately pulls in the newly added user inputs!
