// ==============================================================================
// VISUAL MANAGER: DYNAMIC GRAPH SELECTOR & LAYOUT CONTROLLER
// ==============================================================================
const VisualManager = {
  catalogs: {
    state_nation: [
      {
        id: "card-state-deficit-bar",
        canvasId: "chart-state-deficit-bar",
        title: "Indian States Fiscal Deficit as % of GSDP",
        subtitle: "Fiscal prudence benchmark (FRBM Act 3.0% statutory threshold line highlighted)",
        desc: "Color-coded state deficits against statutory FRBM 3.0% limit with Emerald (Compliant) and Coral (Caution).",
        tag: "FRBM Prudence",
        category: "state",
        default: true,
        render: (d) => d && d.state_deficit_chart && ChartEngine.renderStateDeficitBar("chart-state-deficit-bar", d.state_deficit_chart)
      },
      {
        id: "card-union-budget-donut",
        canvasId: "chart-union-budget-donut",
        title: "National Union Budget Allocation",
        subtitle: "Proportional breakdown by major Central Ministries (₹ Lakh Cr)",
        desc: "Interactive doughnut breakdown of India's central ministry outlays across Defence, Infrastructure, Health, and Education.",
        tag: "Union Outlay",
        category: "national",
        default: true,
        render: (d) => d && d.national_bar_chart && ChartEngine.renderUnionBudgetDonut("chart-union-budget-donut", d.national_bar_chart)
      },
      {
        id: "card-state-rev-exp-bar",
        canvasId: "chart-state-rev-exp-bar",
        title: "State Revenue Receipts vs. Expenditures",
        subtitle: "Comparative fiscal capacity across major Indian states (₹ Crores)",
        desc: "Direct grouped comparison of total revenue receipts against actual spending commitments across 15 states.",
        tag: "Receipts vs Outlay",
        category: "state",
        default: true,
        render: (d) => d && d.state_rev_exp_bar && ChartEngine.renderStateRevExpBar("chart-state-rev-exp-bar", d.state_rev_exp_bar)
      },
      {
        id: "card-state-debt-trajectory",
        canvasId: "chart-state-debt-trajectory",
        title: "10-Year Historical Debt & Revenue Expansion",
        subtitle: "Decadal macro expansion of sovereign liabilities vs revenue receipts (2014-2024)",
        desc: "Multi-line decadal trajectory showing aggregate Indian state debt and revenue growth from 2014 to 2024.",
        tag: "10-Year Trajectory",
        category: "state",
        default: false,
        render: (d) => d && d.state_debt_trajectory && ChartEngine.renderStateDebtTrajectory("chart-state-debt-trajectory", d.state_debt_trajectory)
      },
      {
        id: "card-state-rev-rank",
        canvasId: "chart-state-rev-rank",
        title: "Top Indian States Fiscal Capacity Leaderboard",
        subtitle: "Top 10 highest revenue generating states in India (₹ Lakh Cr)",
        desc: "Horizontal ranked comparison of India's top 10 economic powerhouse states by gross revenue receipts.",
        tag: "Revenue Ranking",
        category: "state",
        default: false,
        render: (d) => d && d.state_rev_rank && ChartEngine.renderStateRevRank("chart-state-rev-rank", d.state_rev_rank)
      },
      {
        id: "card-national-alloc-vs-exp",
        canvasId: "chart-national-alloc-vs-exp",
        title: "Union Budget: Outlay vs. Actual Expenditure",
        subtitle: "Ministry-by-ministry capital execution rate & budget utilization",
        desc: "Grouped bar analysis evaluating implementation efficiency and capital outturn across central ministries.",
        tag: "Budget Execution",
        category: "national",
        default: false,
        render: (d) => d && d.national_alloc_vs_exp && ChartEngine.renderNationalAllocVsExp("chart-national-alloc-vs-exp", d.national_alloc_vs_exp)
      },
      {
        id: "card-state-debt-burden",
        canvasId: "chart-state-debt-burden",
        title: "State Debt-to-Revenue Leverage Ratio",
        subtitle: "Outstanding debt as a percentage of annual state revenues (300% prudential guideline)",
        desc: "Evaluates sovereign debt sustainability by calculating total liabilities relative to annual tax collections.",
        tag: "Debt Sustainability",
        category: "state",
        default: false,
        render: (d) => d && d.state_debt_burden && ChartEngine.renderStateDebtBurden("chart-state-debt-burden", d.state_debt_burden)
      }
    ],

    organization: [
      {
        id: "card-org-dept-bar",
        canvasId: "chart-org-dept-bar",
        title: "Cost vs. Revenue by Department",
        subtitle: "Operational cost allocations vs generated revenue",
        desc: "Clustered bar chart comparing operating expenses against gross revenue across Corporate, Consumer, and Home Office divisions.",
        tag: "Department Split",
        category: "dept",
        default: true,
        render: (d) => d && d.clustered_bar && ChartEngine.renderOrgClusteredBar("chart-org-dept-bar", d.clustered_bar)
      },
      {
        id: "card-org-region-pie",
        canvasId: "chart-org-region-pie",
        title: "Regional Operational Burn",
        subtitle: "Expense distribution across geographic operating regions",
        desc: "Doughnut chart plotting enterprise expense distribution across East, North, South, and West territories.",
        tag: "Regional Geography",
        category: "dept",
        default: true,
        render: (d) => d && d.regional_distribution && ChartEngine.renderOrgRegionPie("chart-org-region-pie", d.regional_distribution)
      },
      {
        id: "card-org-margin-bar",
        canvasId: "chart-org-margin-bar",
        title: "Operating Profit Margin by Category",
        subtitle: "Profit contribution margin (%) per superstore category",
        desc: "Evaluates realized profitability margins for Technology, Office Supplies, and Furniture.",
        tag: "Category Margin",
        category: "profit",
        default: true,
        render: (d) => d && d.category_margins && ChartEngine.renderOrgMarginBar("chart-org-margin-bar", d.category_margins)
      },
      {
        id: "card-org-quarterly-trend",
        canvasId: "chart-org-quarterly-trend",
        title: "Quarterly Revenue, Cost & Profit Trajectory",
        subtitle: "Multi-quarter financial performance trajectory across 2021-2024",
        desc: "Comprehensive quarterly trend tracking commercial sales, operational costs, and bottom-line profit.",
        tag: "Quarterly Trajectory",
        category: "profit",
        default: false,
        render: (d) => d && d.quarterly_trend && ChartEngine.renderOrgQuarterlyTrend("chart-org-quarterly-trend", d.quarterly_trend)
      },
      {
        id: "card-org-subcat-profit",
        canvasId: "chart-org-subcat-profit",
        title: "Product Subcategory Profitability Leaderboard",
        subtitle: "Top 8 product lines delivering highest enterprise net returns",
        desc: "Horizontal ranked leaderboard identifying top product margin drivers (Copiers, Machines, Accessories, Phones).",
        tag: "Product Leaderboard",
        category: "profit",
        default: false,
        render: (d) => d && d.subcat_profit && ChartEngine.renderOrgSubcatProfit("chart-org-subcat-profit", d.subcat_profit)
      },
      {
        id: "card-org-dept-expense-pie",
        canvasId: "chart-org-dept-expense-pie",
        title: "Department Operational Cost Share",
        subtitle: "Relative operational expenditure allocation between divisions",
        desc: "Proportional cost center expenditure distribution across the enterprise.",
        tag: "Cost Allocation",
        category: "dept",
        default: false,
        render: (d) => d && d.dept_expense_pie && ChartEngine.renderOrgDeptExpensePie("chart-org-dept-expense-pie", d.dept_expense_pie)
      },
      {
        id: "card-org-discount-impact",
        canvasId: "chart-org-discount-impact",
        title: "Discount Impact on Operating Margins",
        subtitle: "Analysis of margin erosion across tiered discount bands",
        desc: "Price elasticity analysis showing how increasing discounts impact realized profit contribution margins.",
        tag: "Pricing Elasticity",
        category: "profit",
        default: false,
        render: (d) => d && d.discount_impact && ChartEngine.renderOrgDiscountImpact("chart-org-discount-impact", d.discount_impact)
      }
    ],

    individual: [
      {
        id: "card-ind-donut",
        canvasId: "chart-ind-donut",
        title: "Monthly Expense Breakdown",
        subtitle: "Proportion of monthly spend across 10 categories",
        desc: "Personal spend distribution across household categories: Housing, Groceries, Dining, Utilities, and Shopping.",
        tag: "Category Breakdown",
        category: "budget",
        default: true,
        render: (d) => d && d.donut_chart && ChartEngine.renderIndividualDonut("chart-ind-donut", d.donut_chart)
      },
      {
        id: "card-ind-variance",
        canvasId: "chart-ind-variance",
        title: "Target Budget vs. Actual Spend Variance",
        subtitle: "Green: Under target (Favorable) • Crimson: Over target (Unfavorable)",
        desc: "Category-by-category variance measuring actual monthly outflow against planned budget allocations.",
        tag: "Budget Variance",
        category: "budget",
        default: true,
        render: (d) => d && d.bar_chart && ChartEngine.renderIndividualVarianceBar("chart-ind-variance", d.bar_chart)
      },
      {
        id: "card-ind-line",
        canvasId: "chart-ind-line",
        title: "12-Month Projected Savings Trajectory",
        subtitle: "Simulated cashflow trend vs. minimum target safety threshold",
        desc: "Forecasting timeline tracking monthly expenditures against planned baseline thresholds.",
        tag: "Savings Trend",
        category: "savings",
        default: true,
        render: (d) => d && d.line_chart && ChartEngine.renderIndividualLine("chart-ind-line", d.line_chart)
      },
      {
        id: "card-ind-mode-donut",
        canvasId: "chart-ind-mode-donut",
        title: "Payment Channel Distribution",
        subtitle: "Breakdown of expenses via UPI, Credit Card, Net Banking, and Cash",
        desc: "Payment channel analytics measuring digital UPI usage vs card and cash payments.",
        tag: "Payment Modes",
        category: "savings",
        default: false,
        render: (d) => d && d.mode_donut && ChartEngine.renderIndModeDonut("chart-ind-mode-donut", d.mode_donut)
      },
      {
        id: "card-ind-monthly-flow",
        canvasId: "chart-ind-monthly-flow",
        title: "Monthly Inflows vs. Outflows (Cashflow)",
        subtitle: "Comparison of monthly income vs expenses across active months",
        desc: "Dual bar tracking monthly income vs expenses showing cashflow surplus across 12 months.",
        tag: "Cashflow Flow",
        category: "savings",
        default: false,
        render: (d) => d && d.monthly_flow && ChartEngine.renderIndMonthlyFlow("chart-ind-monthly-flow", d.monthly_flow)
      },
      {
        id: "card-ind-top-subcats",
        canvasId: "chart-ind-top-subcats",
        title: "Top Discretionary Expense Drivers",
        subtitle: "Leading expense subcategories ranked by cumulative outflow",
        desc: "Granular subcategory ranking identifying specific lifestyle spend drivers.",
        tag: "Top Subcategories",
        category: "budget",
        default: false,
        render: (d) => d && d.top_subcategories && ChartEngine.renderIndTopSubcats("chart-ind-top-subcats", d.top_subcategories)
      },
      {
        id: "card-ind-cumulative-savings",
        canvasId: "chart-ind-cumulative-savings",
        title: "Cumulative Net Wealth Accumulation",
        subtitle: "Cumulative savings trajectory progression over active months",
        desc: "Stepped growth trajectory of cumulative net retained savings across all recorded transactions.",
        tag: "Wealth Accumulation",
        category: "savings",
        default: false,
        render: (d) => d && d.cumulative_savings && ChartEngine.renderIndCumulativeSavings("chart-ind-cumulative-savings", d.cumulative_savings)
      }
    ]
  },

  activeCards: {
    state_nation: new Set(),
    organization: new Set(),
    individual: new Set()
  },

  latestData: {
    state_nation: null,
    organization: null,
    individual: null
  },

  init(pageType, data) {
    if (!this.catalogs[pageType]) return;
    this.latestData[pageType] = data;

    const saved = localStorage.getItem("bx_visible_" + pageType);
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        this.activeCards[pageType] = new Set(arr);
      } catch (e) {
        this.resetToDefaults(pageType);
      }
    } else {
      this.resetToDefaults(pageType);
    }

    this.bindUI(pageType);
    this.applyVisibility(pageType);
  },

  resetToDefaults(pageType) {
    const catalog = this.catalogs[pageType] || [];
    this.activeCards[pageType] = new Set(catalog.filter(c => c.default).map(c => c.id));
  },

  bindUI(pageType) {
    document.querySelectorAll(".bx-pill-btn").forEach(btn => {
      btn.onclick = () => {
        const preset = btn.dataset.preset;
        document.querySelectorAll(".bx-pill-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.applyPreset(pageType, preset);
      };
    });

    const openBtn = document.getElementById("btn-open-visuals-modal");
    if (openBtn) {
      openBtn.onclick = () => this.openCustomizerModal(pageType);
    }

    const closeBtn = document.getElementById("btn-close-visuals-modal");
    if (closeBtn) {
      closeBtn.onclick = () => this.closeCustomizerModal();
    }
    const cancelBtn = document.getElementById("btn-cancel-visuals-modal");
    if (cancelBtn) {
      cancelBtn.onclick = () => this.closeCustomizerModal();
    }

    const selAll = document.getElementById("btn-modal-select-all");
    if (selAll) {
      selAll.onclick = () => {
        const catalog = this.catalogs[pageType] || [];
        catalog.forEach(c => {
          const el = document.getElementById(`picker-choice-${c.id}`);
          if (el) el.classList.add("selected");
        });
      };
    }

    const deselAll = document.getElementById("btn-modal-deselect-all");
    if (deselAll) {
      deselAll.onclick = () => {
        const catalog = this.catalogs[pageType] || [];
        catalog.forEach(c => {
          const el = document.getElementById(`picker-choice-${c.id}`);
          if (el) el.classList.remove("selected");
        });
      };
    }

    const resetDef = document.getElementById("btn-modal-reset-default");
    if (resetDef) {
      resetDef.onclick = () => {
        const catalog = this.catalogs[pageType] || [];
        catalog.forEach(c => {
          const el = document.getElementById(`picker-choice-${c.id}`);
          if (el) {
            if (c.default) el.classList.add("selected");
            else el.classList.remove("selected");
          }
        });
      };
    }

    const applyBtn = document.getElementById("btn-apply-visuals");
    if (applyBtn) {
      applyBtn.onclick = () => {
        const catalog = this.catalogs[pageType] || [];
        const newSet = new Set();
        catalog.forEach(c => {
          const el = document.getElementById(`picker-choice-${c.id}`);
          if (el && el.classList.contains("selected")) {
            newSet.add(c.id);
          }
        });
        this.activeCards[pageType] = newSet;
        this.save(pageType);
        this.applyVisibility(pageType);
        this.closeCustomizerModal();
        if (typeof App !== "undefined" && App.showToast) {
          App.showToast(`Updated visuals: ${newSet.size} graphs active!`, "success");
        }
      };
    }
  },

  applyPreset(pageType, preset) {
    const catalog = this.catalogs[pageType] || [];
    if (preset === "all") {
      this.activeCards[pageType] = new Set(catalog.map(c => c.id));
    } else if (preset === "recommended") {
      this.activeCards[pageType] = new Set(catalog.filter(c => c.default).map(c => c.id));
    } else {
      this.activeCards[pageType] = new Set(catalog.filter(c => c.category === preset || c.default).map(c => c.id));
    }
    this.save(pageType);
    this.applyVisibility(pageType);
    if (typeof App !== "undefined" && App.showToast) {
      App.showToast(`Applied preset: ${this.activeCards[pageType].size} visuals displayed`, "info");
    }
  },

  hideCard(pageType, cardId) {
    if (this.activeCards[pageType]) {
      this.activeCards[pageType].delete(cardId);
      this.save(pageType);
      this.applyVisibility(pageType);
      if (typeof App !== "undefined" && App.showToast) {
        App.showToast("Graph hidden from dashboard.", "info");
      }
    }
  },

  applyVisibility(pageType) {
    const catalog = this.catalogs[pageType] || [];
    const active = this.activeCards[pageType] || new Set();

    let visibleCount = 0;
    catalog.forEach(c => {
      const cardEl = document.getElementById(c.id);
      if (cardEl) {
        if (active.has(c.id)) {
          cardEl.style.display = "";
          visibleCount++;
        } else {
          cardEl.style.display = "none";
        }
      }
    });

    const countEl = document.getElementById("visuals-active-count");
    if (countEl) countEl.textContent = `${visibleCount} of ${catalog.length}`;

    const badgeEl = document.getElementById("visuals-badge-count");
    if (badgeEl) badgeEl.textContent = `${visibleCount}`;

    const emptyCard = document.getElementById("visuals-empty-card");
    if (emptyCard) {
      emptyCard.style.display = visibleCount === 0 ? "flex" : "none";
    }

    if (this.latestData[pageType]) {
      this.renderActiveCharts(pageType, this.latestData[pageType]);
    }
  },

  renderActiveCharts(pageType, data) {
    this.latestData[pageType] = data;
    const catalog = this.catalogs[pageType] || [];
    const active = this.activeCards[pageType] || new Set();

    catalog.forEach(c => {
      if (active.has(c.id) && document.getElementById(c.canvasId)) {
        try {
          c.render(data);
        } catch (err) {
          console.error("Error rendering chart " + c.canvasId, err);
        }
      }
    });
  },

  openCustomizerModal(pageType) {
    const catalog = this.catalogs[pageType] || [];
    const active = this.activeCards[pageType] || new Set();
    const grid = document.getElementById("visuals-picker-container");
    if (!grid) return;

    grid.innerHTML = catalog.map(c => `
      <div class="visual-choice-card ${active.has(c.id) ? 'selected' : ''}" id="picker-choice-${c.id}" onclick="VisualManager.togglePickerChoice('${c.id}')">
        <div class="visual-choice-header">
          <div class="visual-choice-title">${c.title}</div>
          <div class="custom-toggle-switch"></div>
        </div>
        <div class="visual-choice-desc">${c.desc}</div>
        <div class="visual-choice-meta">
          <span class="visual-tag-badge">${c.tag}</span>
          <span style="font-size: 0.72rem; color: var(--bx-text-muted); font-family: var(--bx-font-tech);">#${c.id.replace('card-', '')}</span>
        </div>
      </div>
    `).join("");

    const modal = document.getElementById("modal-custom-visuals");
    if (modal) modal.classList.add("open");
  },

  togglePickerChoice(cardId) {
    const el = document.getElementById(`picker-choice-${cardId}`);
    if (el) el.classList.toggle("selected");
  },

  closeCustomizerModal() {
    const modal = document.getElementById("modal-custom-visuals");
    if (modal) modal.classList.remove("open");
  },

  save(pageType) {
    if (this.activeCards[pageType]) {
      localStorage.setItem("bx_visible_" + pageType, JSON.stringify(Array.from(this.activeCards[pageType])));
    }
  }
};
window.VisualManager = VisualManager;

const App = {
  activeTab: "landing",
  
  // State caches
  overviewState: { year: "All", level: "All" },
  indState: { category: "All", year: "All" },
  orgState: { department: "All", year: "All" },
  stateNationState: { year: "All" },
  predictiveState: { indCut: 0, orgGrowth: 0, stateDeficitTarget: 0 },

  formatCompactIndian(val, prefix = "₹") {
    if (val === null || val === undefined || isNaN(val)) return `${prefix}0`;
    const num = Number(val);
    const abs = Math.abs(num);
    const sign = num < 0 ? "-" : "";
    if (abs >= 1e7) {
      const cr = (abs / 1e7).toFixed(2).replace(/\.?0+$/, "");
      return `${sign}${prefix}${cr} Cr`;
    }
    if (abs >= 1e5) {
      const lk = (abs / 1e5).toFixed(2).replace(/\.?0+$/, "");
      return `${sign}${prefix}${lk} Lakh`;
    }
    if (abs >= 1e3) {
      const k = (abs / 1e3).toFixed(1).replace(/\.0$/, "");
      return `${sign}${prefix}${k}K`;
    }
    return `${sign}${prefix}${abs.toLocaleString("en-IN")}`;
  },

  async init() {
    this.bindTabNavigation();
    this.bindModals();
    this.bindFilters();
    this.bindWhatIfSliders();
    this.bindPowerBIHub();
    this.initIndStudio();
    this.initOrgStudio();
  },

  // ----------------------------------------------------------------------------
  // TAB & MODE NAVIGATION
  // ----------------------------------------------------------------------------
  bindTabNavigation() {
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.tab;
        this.switchTab(target);
      });
    });
  },

  async switchTab(target) {
    this.activeTab = target;

    // Update Tab Buttons
    document.querySelectorAll(".tab-btn").forEach(t => {
      if (t.dataset.tab === target) {
        t.classList.add("active");
      } else {
        t.classList.remove("active");
      }
    });

    // Update Content Views
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
    const targetContent = document.getElementById(`tab-${target}`);
    if (targetContent) {
      targetContent.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Lazy load tab data
    if (target === "overview") await this.loadOverview();
    else if (target === "individual") {
      await this.loadIndividual();
      this.computeIndStudio();
    }
    else if (target === "organization") {
      await this.loadOrganization();
      this.computeOrgStudio();
    }
    else if (target === "state-nation") await this.loadStateNation();
    else if (target === "predictive") await this.loadPredictive();
    else if (target === "powerbi-hub") await this.loadPowerBIHub();
  },

  // ----------------------------------------------------------------------------
  // TOAST NOTIFICATIONS
  // ----------------------------------------------------------------------------
  showToast(message, type = "info") {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type === "success" ? "toast-success" : ""}`;
    toast.innerHTML = `<span>${type === "success" ? "✔" : "ℹ"}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // ----------------------------------------------------------------------------
  // MODAL BINDINGS
  // ----------------------------------------------------------------------------
  bindModals() {
    // Open Individual Tx Modal
    const btnAddTx = document.getElementById("btn-add-tx") || document.getElementById("btn-open-tx-modal");
    const modalAddTx = document.getElementById("modal-add-tx");
    if (btnAddTx && modalAddTx) {
      btnAddTx.addEventListener("click", () => modalAddTx.classList.add("open"));
    }

    // Open Category Budgets Modal
    const btnEditBudgets = document.getElementById("btn-edit-budgets");
    const modalBudgets = document.getElementById("modal-budgets");
    if (btnEditBudgets && modalBudgets) {
      btnEditBudgets.addEventListener("click", () => modalBudgets.classList.add("open"));
    }

    // Open Org Order Modal
    const btnAddOrder = document.getElementById("btn-add-order") || document.getElementById("btn-open-order-modal");
    const modalAddOrder = document.getElementById("modal-add-order");
    if (btnAddOrder && modalAddOrder) {
      btnAddOrder.addEventListener("click", () => modalAddOrder.classList.add("open"));
    }

    // Close buttons
    document.querySelectorAll(".modal-close, .modal-close-btn, .btn-modal-cancel, #btn-close-tx-modal, #btn-cancel-tx-modal, #btn-close-order-modal, #btn-cancel-order-modal").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal-backdrop") || document.querySelector(".modal-backdrop.open");
        if (modal) modal.classList.remove("open");
      });
    });

    // Close when clicking backdrop
    document.querySelectorAll(".modal-backdrop").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
      });
    });

    // Handle Form Submissions
    this.bindFormSubmissions();
  },

  bindFormSubmissions() {
    // 1. Submit Individual Transaction
    const formTx = document.getElementById("form-add-tx");
    if (formTx) {
      formTx.addEventListener("submit", async (e) => {
        e.preventDefault();
        const subcat = document.getElementById("tx-subcategory")?.value || document.getElementById("tx-subcat")?.value || "";
        const payload = {
          date: document.getElementById("tx-date")?.value,
          income_expense: document.getElementById("tx-type")?.value || "Expense",
          category: document.getElementById("tx-category")?.value,
          subcategory: subcat,
          amount: parseFloat(document.getElementById("tx-amount")?.value || 0),
          mode: document.getElementById("tx-mode")?.value || "UPI",
          note: document.getElementById("tx-note")?.value || "",
          currency: "INR"
        };

        try {
          const res = await api.addTransaction(payload);
          this.showToast(res.message, "success");
          document.getElementById("modal-add-tx")?.classList.remove("open");
          formTx.reset();
          await this.loadIndividual();
        } catch (err) {
          this.showToast(err.message, "error");
        }
      });
    }

    // 2. Submit Category Budget Update
    const formBudgets = document.getElementById("form-category-budgets");
    if (formBudgets) {
      formBudgets.addEventListener("submit", async (e) => {
        e.preventDefault();
        const cat = document.getElementById("budget-category-select")?.value;
        const amount = parseFloat(document.getElementById("budget-amount-input")?.value || 0);

        try {
          const res = await api.updateBudget(cat, amount);
          this.showToast(res.message, "success");
          document.getElementById("modal-budgets")?.classList.remove("open");
          await this.loadIndividual();
        } catch (err) {
          this.showToast(err.message, "error");
        }
      });
    }

    // 3. Submit Organization Order
    const formOrder = document.getElementById("form-add-order");
    if (formOrder) {
      formOrder.addEventListener("submit", async (e) => {
        e.preventDefault();
        const cat = document.getElementById("order-category")?.value || document.getElementById("order-cat")?.value || "Technology";
        const subcat = document.getElementById("order-subcategory")?.value || "General";
        const payload = {
          order_date: document.getElementById("order-date")?.value,
          department: document.getElementById("order-dept")?.value,
          region: document.getElementById("order-region")?.value,
          city: document.getElementById("order-city")?.value || "Bengaluru",
          category: cat,
          subcategory: subcat,
          product_name: document.getElementById("order-product")?.value || "Procurement Item",
          sales: parseFloat(document.getElementById("order-sales")?.value || 0),
          discount: parseFloat(document.getElementById("order-discount")?.value || 0),
          profit: parseFloat(document.getElementById("order-profit")?.value || 0),
          quantity: parseInt(document.getElementById("order-qty")?.value || 1)
        };

        try {
          const res = await api.addOrder(payload);
          this.showToast(res.message, "success");
          document.getElementById("modal-add-order")?.classList.remove("open");
          formOrder.reset();
          await this.loadOrganization();
        } catch (err) {
          this.showToast(err.message, "error");
        }
      });
    }
  },

  // ----------------------------------------------------------------------------
  // FILTERS BINDING
  // ----------------------------------------------------------------------------
  bindFilters() {
    // Global Header Actions
    document.getElementById("btn-global-refresh")?.addEventListener("click", async () => {
      this.showToast("Refreshing all metrics...", "info");
      if (this.activeTab === "overview") await this.loadOverview();
      else if (this.activeTab === "individual") await this.loadIndividual();
      else if (this.activeTab === "organization") await this.loadOrganization();
      else if (this.activeTab === "state-nation") await this.loadStateNation();
      else if (this.activeTab === "predictive") await this.loadPredictive();
    });

    document.getElementById("btn-global-export-pbi")?.addEventListener("click", async () => {
      try {
        const res = await api.exportAllPowerBICSVs();
        this.showToast(res.message, "success");
      } catch (err) {
        this.showToast(err.message, "error");
      }
    });

    // Overview Slicers
    const overviewYear = document.getElementById("overview-year-slicer");
    const overviewLevel = document.getElementById("overview-level-slicer");
    overviewYear?.addEventListener("change", (e) => {
      this.overviewState.year = e.target.value;
      this.loadOverview();
    });
    overviewLevel?.addEventListener("change", (e) => {
      this.overviewState.level = e.target.value;
      this.loadOverview();
    });

    // Individual Filters
    const indCatFilter = document.getElementById("ind-category-filter");
    const indYearFilter = document.getElementById("ind-year-filter");
    indCatFilter?.addEventListener("change", (e) => {
      this.indState.category = e.target.value;
      this.loadIndividual();
    });
    indYearFilter?.addEventListener("change", (e) => {
      this.indState.year = e.target.value;
      this.loadIndividual();
    });

    // Individual Search Input
    const txSearch = document.getElementById("tx-search-input");
    txSearch?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll("#tx-table-body tr").forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(q) ? "" : "none";
      });
    });

    // Organization Filters
    const orgDeptFilter = document.getElementById("org-dept-filter");
    const orgYearFilter = document.getElementById("org-year-filter");
    orgDeptFilter?.addEventListener("change", (e) => {
      this.orgState.department = e.target.value;
      this.loadOrganization();
    });
    orgYearFilter?.addEventListener("change", (e) => {
      this.orgState.year = e.target.value;
      this.loadOrganization();
    });

    // Organization Search Input
    const orderSearch = document.getElementById("order-search-input");
    orderSearch?.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll("#order-table-body tr").forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(q) ? "" : "none";
      });
    });

    // State / Nation Year Filter
    const stateYearFilter = document.getElementById("state-year-filter");
    stateYearFilter?.addEventListener("change", (e) => {
      this.stateNationState.year = e.target.value;
      this.loadStateNation();
    });
  },

  // ----------------------------------------------------------------------------
  // WHAT-IF SLIDERS (PAGE 5)
  // ----------------------------------------------------------------------------
  bindWhatIfSliders() {
    const sliderInd = document.getElementById("slider-ind-cut");
    const sliderOrg = document.getElementById("slider-org-growth");
    const sliderState = document.getElementById("slider-state-deficit");

    const badgeInd = document.getElementById("badge-ind-cut");
    const badgeOrg = document.getElementById("badge-org-growth");
    const badgeState = document.getElementById("badge-state-deficit");

    const handleSimulation = async () => {
      const indVal = parseFloat(sliderInd.value);
      const orgVal = parseFloat(sliderOrg.value);
      const stateVal = parseFloat(sliderState.value);

      if (badgeInd) badgeInd.textContent = `${indVal}%`;
      if (badgeOrg) badgeOrg.textContent = `${orgVal}%`;
      if (badgeState) badgeState.textContent = `${stateVal}%`;

      try {
        const data = await api.simulatePredictive({
          whatif_ind_cut_pct: indVal,
          whatif_org_growth_pct: orgVal,
          whatif_state_deficit_target_pct: stateVal
        });
        this.renderPredictiveCharts(data);
      } catch (err) {
        console.error("Simulation error:", err);
      }
    };

    sliderInd?.addEventListener("input", handleSimulation);
    sliderOrg?.addEventListener("input", handleSimulation);
    sliderState?.addEventListener("input", handleSimulation);
  },

  // ----------------------------------------------------------------------------
  // POWER BI HUB BINDINGS
  // ----------------------------------------------------------------------------
  bindPowerBIHub() {
    document.getElementById("btn-copy-dax")?.addEventListener("click", () => {
      const code = document.getElementById("dax-code-block").innerText;
      navigator.clipboard.writeText(code);
      this.showToast("DAX Measures Library copied to clipboard!", "success");
    });

    document.getElementById("btn-copy-pq")?.addEventListener("click", () => {
      const code = document.getElementById("pq-code-block").innerText;
      navigator.clipboard.writeText(code);
      this.showToast("Power Query M-Code copied to clipboard!", "success");
    });
  },

  // ----------------------------------------------------------------------------
  // INTERACTIVE INPUT STUDIO: INDIVIDUAL MODE
  // ----------------------------------------------------------------------------
  indCategories: [
    { name: "Housing & Rent", actual: 25000, budget: 25000, icon: "🏠" },
    { name: "Food & Dining", actual: 16000, budget: 16000, icon: "🍔" },
    { name: "Groceries", actual: 18000, budget: 18000, icon: "🛒" },
    { name: "Utilities", actual: 6500, budget: 6500, icon: "💡" },
    { name: "Transportation", actual: 8500, budget: 9000, icon: "🚗" },
    { name: "Entertainment", actual: 6500, budget: 7000, icon: "🎬" },
    { name: "Healthcare", actual: 4500, budget: 6000, icon: "💊" },
    { name: "Education", actual: 3500, budget: 5000, icon: "📚" },
    { name: "Shopping", actual: 11000, budget: 11000, icon: "🛍️" },
    { name: "Personal Care", actual: 4000, budget: 4500, icon: "✨" }
  ],

  initIndStudio() {
    const container = document.getElementById("ind-studio-categories");
    if (!container) return;
    container.innerHTML = this.indCategories.map((c, i) => `
      <div class="studio-category-box">
        <div class="studio-category-header">
          <span>${c.icon} ${c.name}</span>
        </div>
        <div class="studio-dual-inputs">
          <div>
            <label for="ind-cat-actual-${i}">Actual (₹)</label>
            <input type="number" id="ind-cat-actual-${i}" value="${c.actual}" step="100">
          </div>
          <div>
            <label for="ind-cat-budget-${i}">Budget (₹)</label>
            <input type="number" id="ind-cat-budget-${i}" value="${c.budget}" step="100">
          </div>
        </div>
      </div>
    `).join("");

    document.getElementById("btn-compute-ind")?.addEventListener("click", () => this.computeIndStudio());
    document.getElementById("btn-reset-ind")?.addEventListener("click", () => this.applyIndPreset("tech"));
  },

  applyIndPreset(preset) {
    const salInput = document.getElementById("input-ind-salary");
    const otherInput = document.getElementById("input-ind-other-income");

    let sal = 135000, other = 25000;
    let actualMulti = 1.0, budgetMulti = 1.0;

    if (preset === "tech") {
      sal = 160000; other = 30000;
      actualMulti = 1.1; budgetMulti = 1.15;
    } else if (preset === "family") {
      sal = 220000; other = 45000;
      actualMulti = 1.45; budgetMulti = 1.5;
    } else if (preset === "fresher") {
      sal = 45000; other = 5000;
      actualMulti = 0.38; budgetMulti = 0.4;
    } else if (preset === "custom") {
      sal = 0; other = 0;
      actualMulti = 0; budgetMulti = 0;
    }

    if (salInput) salInput.value = sal;
    if (otherInput) otherInput.value = other;

    this.indCategories.forEach((c, i) => {
      const actEl = document.getElementById(`ind-cat-actual-${i}`);
      const budEl = document.getElementById(`ind-cat-budget-${i}`);
      if (actEl) actEl.value = Math.round(c.actual * actualMulti);
      if (budEl) budEl.value = Math.round(c.budget * budgetMulti);
    });

    this.computeIndStudio();
  },

  async computeIndStudio() {
    const sal = parseFloat(document.getElementById("input-ind-salary")?.value || 0);
    const other = parseFloat(document.getElementById("input-ind-other-income")?.value || 0);

    const categoriesPayload = {};
    this.indCategories.forEach((c, i) => {
      const actual = parseFloat(document.getElementById(`ind-cat-actual-${i}`)?.value || 0);
      const budget = parseFloat(document.getElementById(`ind-cat-budget-${i}`)?.value || 0);
      categoriesPayload[c.name] = { actual, budget };
    });

    try {
      const data = await api.calculateIndividual({
        monthly_income: sal,
        other_income: other,
        categories: categoriesPayload
      });

      // Update KPIs
      document.getElementById("ind-kpi-income").textContent = `₹${data.kpis.total_income.toLocaleString('en-IN')}`;
      document.getElementById("ind-kpi-expense").textContent = `₹${data.kpis.total_expense.toLocaleString('en-IN')}`;
      
      const netSavingsEl = document.getElementById("ind-kpi-savings");
      netSavingsEl.textContent = `₹${data.kpis.net_savings.toLocaleString('en-IN')}`;
      netSavingsEl.closest(".kpi-card").className = `kpi-card ${data.kpis.net_savings >= 0 ? 'kpi-positive' : 'kpi-negative'}`;

      document.getElementById("ind-kpi-savings-rate").textContent = `${data.kpis.savings_rate_pct}% Savings Rate`;
      document.getElementById("ind-kpi-budget").textContent = `₹${data.kpis.total_planned_budget.toLocaleString('en-IN')}`;
      document.getElementById("ind-kpi-utilization").textContent = `${data.kpis.budget_utilization_pct}%`;

      const flagBadge = document.getElementById("ind-overspend-flag");
      if (flagBadge) {
        flagBadge.textContent = data.kpis.overspend_flag;
        flagBadge.className = `tag-badge ${data.kpis.overspend_flag === 'Within Budget' ? 'tag-income' : 'tag-expense'}`;
      }

      // Update Health Score Badge
      const healthBadge = document.getElementById("ind-health-score-badge");
      if (healthBadge) {
        healthBadge.textContent = `${data.kpis.health_score} / 100 • ${data.kpis.health_rating}`;
        healthBadge.style.background = data.kpis.health_score >= 70 ? 'var(--success-light)' : (data.kpis.health_score >= 50 ? '#FEF3C7' : 'var(--danger-light)');
        healthBadge.style.color = data.kpis.health_score >= 70 ? 'var(--success-green)' : (data.kpis.health_score >= 50 ? 'var(--accent-amber)' : 'var(--danger-crimson)');
      }

      // Update BUDGETRIX 3 Summary Insights Columns
      const spendInsightEl = document.getElementById("bx-insight-spend");
      const varianceInsightEl = document.getElementById("bx-insight-variance");
      const savingsInsightEl = document.getElementById("bx-insight-savings");

      if (spendInsightEl) {
        let maxCat = "", maxVal = 0;
        Object.entries(categoriesPayload).forEach(([k, v]) => {
          if (v.actual > maxVal) { maxVal = v.actual; maxCat = k; }
        });
        const maxFmt = this.formatCompactIndian(maxVal);
        spendInsightEl.textContent = maxCat
          ? `Your biggest spend this year is ${maxCat} at ${maxFmt}. Trim that first if you want savings to rise.`
          : `Add category allocations above to analyze your highest spending drivers.`;
      }

      if (varianceInsightEl) {
        const diff = Math.abs(data.kpis.total_planned_budget - data.kpis.total_expense);
        const diffFmt = this.formatCompactIndian(diff);
        const util = data.kpis.budget_utilization_pct;
        if (data.kpis.total_expense <= data.kpis.total_planned_budget) {
          varianceInsightEl.textContent = `You stayed inside the plan by ${diffFmt} — spending is ${util}% of what you set aside.`;
        } else {
          varianceInsightEl.textContent = `Spending exceeded your planned budget by ${diffFmt} — utilization is ${util}% of budget limit.`;
        }
      }

      if (savingsInsightEl) {
        const incFmt = this.formatCompactIndian(data.kpis.total_income);
        const savFmt = this.formatCompactIndian(data.kpis.net_savings);
        savingsInsightEl.textContent = `Out of ${incFmt} earned, ${savFmt} stayed with you — a savings rate of ${data.kpis.savings_rate_pct}%.`;
      }

      // Render Visuals from User Input
      ChartEngine.renderIndividualDonut("chart-ind-donut", data.donut_chart);
      ChartEngine.renderIndividualLine("chart-ind-line", data.trend_line);
      ChartEngine.renderIndividualVarianceBar("chart-ind-variance", data.bar_chart);

      this.showToast("Individual graphs generated from your inputs!", "success");
    } catch (err) {
      console.error(err);
      this.showToast("Failed to compute individual analytics.", "error");
    }
  },

  // ----------------------------------------------------------------------------
  // INTERACTIVE INPUT STUDIO: ORGANIZATION MODE
  // ----------------------------------------------------------------------------
  // ORGANIZATION DYNAMIC GRAPH CONTROL STUDIO & LIVE TWEAKERS
  // ----------------------------------------------------------------------------
  initOrgStudio() {
    document.getElementById("btn-compute-org")?.addEventListener("click", () => this.computeOrgStudio(true));
    document.getElementById("btn-reset-org")?.addEventListener("click", () => this.applyOrgPreset("superstore"));
    this.updateStudioDisplayLabels();
    this.syncStudioToCardTweakers();
  },

  switchOrgSubtab(tabName, btn) {
    document.querySelectorAll(".org-subtab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".org-subtab-pane").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    const pane = document.getElementById("pane-org-" + tabName);
    if (pane) pane.classList.add("active");
  },

  toggleCardTweaker(tweakId) {
    const el = document.getElementById(tweakId);
    if (!el) return;
    const isHidden = el.style.display === "none";
    el.style.display = isHidden ? "flex" : "none";
    const card = el.closest(".card");
    const btn = card?.querySelector(".btn-card-tweak");
    if (btn) btn.classList.toggle("active", isHidden);
  },

  onLiveInputChange() {
    this.updateStudioDisplayLabels();
    this.syncStudioToCardTweakers();
    this.debounceComputeOrg();
  },

  onCardTweak(tweakType, value) {
    const num = parseFloat(value);
    if (tweakType === 'corp-rev') {
      const el = document.getElementById("input-dept-corp-rev");
      if (el) el.value = Math.round(num * 10000000);
      const v = document.getElementById("tweak-val-corp-rev");
      if (v) v.textContent = `₹${num.toFixed(1)} Cr`;
    } else if (tweakType === 'corp-cost') {
      const el = document.getElementById("input-dept-corp-cost");
      if (el) el.value = Math.round(num * 10000000);
      const v1 = document.getElementById("tweak-val-corp-cost");
      if (v1) v1.textContent = `₹${num.toFixed(1)} Cr`;
      const v2 = document.getElementById("tweak-val-pie-corp");
      if (v2) v2.textContent = `₹${num.toFixed(1)} Cr`;
      const s = document.getElementById("tweak-pie-corp");
      if (s) s.value = num;
    } else if (tweakType === 'cons-rev') {
      const el = document.getElementById("input-dept-cons-rev");
      if (el) el.value = Math.round(num * 10000000);
      const v = document.getElementById("tweak-val-cons-rev");
      if (v) v.textContent = `₹${num.toFixed(1)} Cr`;
    } else if (tweakType === 'cons-cost') {
      const el = document.getElementById("input-dept-cons-cost");
      if (el) el.value = Math.round(num * 10000000);
      const v1 = document.getElementById("tweak-val-cons-cost");
      if (v1) v1.textContent = `₹${num.toFixed(1)} Cr`;
      const v2 = document.getElementById("tweak-val-pie-cons");
      if (v2) v2.textContent = `₹${num.toFixed(1)} Cr`;
      const s = document.getElementById("tweak-pie-cons");
      if (s) s.value = num;
    } else if (tweakType === 'home-rev') {
      const el = document.getElementById("input-dept-home-rev");
      if (el) el.value = Math.round(num * 10000000);
      const v = document.getElementById("tweak-val-home-rev");
      if (v) v.textContent = `₹${num.toFixed(1)} Cr`;
    } else if (tweakType === 'home-cost') {
      const el = document.getElementById("input-dept-home-cost");
      if (el) el.value = Math.round(num * 10000000);
      const v1 = document.getElementById("tweak-val-home-cost");
      if (v1) v1.textContent = `₹${num.toFixed(1)} Cr`;
      const v2 = document.getElementById("tweak-val-pie-home");
      if (v2) v2.textContent = `₹${num.toFixed(1)} Cr`;
      const s = document.getElementById("tweak-pie-home");
      if (s) s.value = num;
    } else if (tweakType === 'reg-west') {
      const s = document.getElementById("input-reg-west");
      if (s) s.value = num;
      const v = document.getElementById("tweak-val-reg-west");
      if (v) v.textContent = `${num}%`;
    } else if (tweakType === 'reg-east') {
      const s = document.getElementById("input-reg-east");
      if (s) s.value = num;
      const v = document.getElementById("tweak-val-reg-east");
      if (v) v.textContent = `${num}%`;
    } else if (tweakType === 'reg-central') {
      const s = document.getElementById("input-reg-central");
      if (s) s.value = num;
      const v = document.getElementById("tweak-val-reg-central");
      if (v) v.textContent = `${num}%`;
    } else if (tweakType === 'reg-south') {
      const s = document.getElementById("input-reg-south");
      if (s) s.value = num;
      const v = document.getElementById("tweak-val-reg-south");
      if (v) v.textContent = `${num}%`;
    } else if (tweakType === 'cat-tech') {
      const s = document.getElementById("input-cat-tech");
      if (s) s.value = num;
      const v = document.getElementById("tweak-val-cat-tech");
      if (v) v.textContent = `${num}%`;
    } else if (tweakType === 'cat-furn') {
      const s = document.getElementById("input-cat-furn");
      if (s) s.value = num;
      const v = document.getElementById("tweak-val-cat-furn");
      if (v) v.textContent = `${num}%`;
    } else if (tweakType === 'cat-off') {
      const s = document.getElementById("input-cat-off");
      if (s) s.value = num;
      const v = document.getElementById("tweak-val-cat-off");
      if (v) v.textContent = `${num}%`;
    } else if (tweakType === 'q-growth') {
      const s = document.getElementById("input-q-growth");
      if (s) s.value = num;
      const v = document.getElementById("tweak-val-q-growth");
      if (v) v.textContent = `${num.toFixed(1)}x`;
    } else if (tweakType === 'subcat-boost') {
      const s = document.getElementById("input-subcat-boost");
      if (s) s.value = num;
      const v = document.getElementById("tweak-val-subcat-boost");
      if (v) v.textContent = `${num.toFixed(2)}x`;
    } else if (tweakType === 'discount-penalty') {
      const s = document.getElementById("input-discount-penalty");
      if (s) s.value = num;
      const v = document.getElementById("tweak-val-discount-penalty");
      if (v) v.textContent = `${num.toFixed(1)}x`;
    }

    this.updateStudioDisplayLabels();
    this.debounceComputeOrg();
  },

  updateStudioDisplayLabels() {
    const corpRev = parseFloat(document.getElementById("input-dept-corp-rev")?.value || 0);
    const corpCost = parseFloat(document.getElementById("input-dept-corp-cost")?.value || 0);
    const corpM = corpRev > 0 ? (((corpRev - corpCost) / corpRev) * 100).toFixed(1) : 0;
    const bCorp = document.getElementById("badge-dept-corp-margin");
    if (bCorp) bCorp.textContent = `${corpM}% Margin`;

    const consRev = parseFloat(document.getElementById("input-dept-cons-rev")?.value || 0);
    const consCost = parseFloat(document.getElementById("input-dept-cons-cost")?.value || 0);
    const consM = consRev > 0 ? (((consRev - consCost) / consRev) * 100).toFixed(1) : 0;
    const bCons = document.getElementById("badge-dept-cons-margin");
    if (bCons) bCons.textContent = `${consM}% Margin`;

    const homeRev = parseFloat(document.getElementById("input-dept-home-rev")?.value || 0);
    const homeCost = parseFloat(document.getElementById("input-dept-home-cost")?.value || 0);
    const homeM = homeRev > 0 ? (((homeRev - homeCost) / homeRev) * 100).toFixed(1) : 0;
    const bHome = document.getElementById("badge-dept-home-margin");
    if (bHome) bHome.textContent = `${homeM}% Margin`;

    const rWest = document.getElementById("input-reg-west")?.value || 34;
    const rEast = document.getElementById("input-reg-east")?.value || 28;
    const rCent = document.getElementById("input-reg-central")?.value || 21;
    const rSouth = document.getElementById("input-reg-south")?.value || 17;

    const dWest = document.getElementById("disp-reg-west"); if (dWest) dWest.textContent = `${rWest}%`;
    const dEast = document.getElementById("disp-reg-east"); if (dEast) dEast.textContent = `${rEast}%`;
    const dCent = document.getElementById("disp-reg-central"); if (dCent) dCent.textContent = `${rCent}%`;
    const dSouth = document.getElementById("disp-reg-south"); if (dSouth) dSouth.textContent = `${rSouth}%`;

    const totalCost = corpCost + consCost + homeCost;
    const totW = parseFloat(rWest) + parseFloat(rEast) + parseFloat(rCent) + parseFloat(rSouth) || 1;
    const formatSpend = (s) => (s >= 1e7 ? `~ ₹${(s / 1e7).toFixed(2)} Cr Spend` : (s >= 1e5 ? `~ ₹${(s / 1e5).toFixed(1)} Lakh Spend` : `~ ₹${(s / 1e3).toFixed(0)}K Spend`));
    const cWest = document.getElementById("calc-reg-west");
    if (cWest) cWest.textContent = formatSpend(totalCost * (rWest / totW));
    const cEast = document.getElementById("calc-reg-east");
    if (cEast) cEast.textContent = formatSpend(totalCost * (rEast / totW));
    const cCent = document.getElementById("calc-reg-central");
    if (cCent) cCent.textContent = formatSpend(totalCost * (rCent / totW));
    const cSouth = document.getElementById("calc-reg-south");
    if (cSouth) cSouth.textContent = formatSpend(totalCost * (rSouth / totW));

    const cTech = document.getElementById("input-cat-tech")?.value || 24.5;
    const cFurn = document.getElementById("input-cat-furn")?.value || 8.2;
    const cOff = document.getElementById("input-cat-off")?.value || 18.4;
    const cBoost = document.getElementById("input-subcat-boost")?.value || 1.0;

    const dTech = document.getElementById("disp-cat-tech"); if (dTech) dTech.textContent = `${cTech}%`;
    const dFurn = document.getElementById("disp-cat-furn"); if (dFurn) dFurn.textContent = `${cFurn}%`;
    const dOff = document.getElementById("disp-cat-off"); if (dOff) dOff.textContent = `${cOff}%`;
    const dBoost = document.getElementById("disp-subcat-boost"); if (dBoost) dBoost.textContent = `${parseFloat(cBoost).toFixed(2)}x`;

    const qGrowth = document.getElementById("input-q-growth")?.value || 1.0;
    const discPen = document.getElementById("input-discount-penalty")?.value || 1.0;
    const dGrowth = document.getElementById("disp-q-growth");
    if (dGrowth) dGrowth.textContent = `${parseFloat(qGrowth).toFixed(1)}x (${qGrowth > 1 ? '+' + ((qGrowth-1)*20).toFixed(0) + '%' : qGrowth < 1 ? ((qGrowth-1)*20).toFixed(0) + '%' : 'Normal'})`;
    const dDisc = document.getElementById("disp-discount-penalty");
    if (dDisc) dDisc.textContent = `${parseFloat(discPen).toFixed(1)}x (${discPen > 1.2 ? 'Steep Erosion' : discPen < 0.8 ? 'Resilient' : 'Baseline'})`;
  },

  syncStudioToCardTweakers() {
    const corpRev = parseFloat(document.getElementById("input-dept-corp-rev")?.value || 0) / 1e7;
    const corpCost = parseFloat(document.getElementById("input-dept-corp-cost")?.value || 0) / 1e7;
    const consRev = parseFloat(document.getElementById("input-dept-cons-rev")?.value || 0) / 1e7;
    const consCost = parseFloat(document.getElementById("input-dept-cons-cost")?.value || 0) / 1e7;
    const homeRev = parseFloat(document.getElementById("input-dept-home-rev")?.value || 0) / 1e7;
    const homeCost = parseFloat(document.getElementById("input-dept-home-cost")?.value || 0) / 1e7;

    const s1 = document.getElementById("tweak-corp-rev"); if (s1) s1.value = corpRev;
    const v1 = document.getElementById("tweak-val-corp-rev"); if (v1) v1.textContent = `₹${corpRev.toFixed(1)} Cr`;
    const s2 = document.getElementById("tweak-corp-cost"); if (s2) s2.value = corpCost;
    const v2 = document.getElementById("tweak-val-corp-cost"); if (v2) v2.textContent = `₹${corpCost.toFixed(1)} Cr`;
    const s3 = document.getElementById("tweak-cons-rev"); if (s3) s3.value = consRev;
    const v3 = document.getElementById("tweak-val-cons-rev"); if (v3) v3.textContent = `₹${consRev.toFixed(1)} Cr`;
    const s4 = document.getElementById("tweak-home-rev"); if (s4) s4.value = homeRev;
    const v4 = document.getElementById("tweak-val-home-rev"); if (v4) v4.textContent = `₹${homeRev.toFixed(1)} Cr`;

    const sp1 = document.getElementById("tweak-pie-corp"); if (sp1) sp1.value = corpCost;
    const vp1 = document.getElementById("tweak-val-pie-corp"); if (vp1) vp1.textContent = `₹${corpCost.toFixed(1)} Cr`;
    const sp2 = document.getElementById("tweak-pie-cons"); if (sp2) sp2.value = consCost;
    const vp2 = document.getElementById("tweak-val-pie-cons"); if (vp2) vp2.textContent = `₹${consCost.toFixed(1)} Cr`;
    const sp3 = document.getElementById("tweak-pie-home"); if (sp3) sp3.value = homeCost;
    const vp3 = document.getElementById("tweak-val-pie-home"); if (vp3) vp3.textContent = `₹${homeCost.toFixed(1)} Cr`;

    const rWest = document.getElementById("input-reg-west")?.value;
    const rEast = document.getElementById("input-reg-east")?.value;
    const rCent = document.getElementById("input-reg-central")?.value;
    const rSouth = document.getElementById("input-reg-south")?.value;

    if (rWest) { const s = document.getElementById("tweak-reg-west"); if (s) s.value = rWest; const v = document.getElementById("tweak-val-reg-west"); if (v) v.textContent = `${rWest}%`; }
    if (rEast) { const s = document.getElementById("tweak-reg-east"); if (s) s.value = rEast; const v = document.getElementById("tweak-val-reg-east"); if (v) v.textContent = `${rEast}%`; }
    if (rCent) { const s = document.getElementById("tweak-reg-central"); if (s) s.value = rCent; const v = document.getElementById("tweak-val-reg-central"); if (v) v.textContent = `${rCent}%`; }
    if (rSouth) { const s = document.getElementById("tweak-reg-south"); if (s) s.value = rSouth; const v = document.getElementById("tweak-val-reg-south"); if (v) v.textContent = `${rSouth}%`; }

    const cTech = document.getElementById("input-cat-tech")?.value;
    const cFurn = document.getElementById("input-cat-furn")?.value;
    const cOff = document.getElementById("input-cat-off")?.value;
    const cBoost = document.getElementById("input-subcat-boost")?.value;

    if (cTech) { const s = document.getElementById("tweak-cat-tech"); if (s) s.value = cTech; const v = document.getElementById("tweak-val-cat-tech"); if (v) v.textContent = `${cTech}%`; }
    if (cFurn) { const s = document.getElementById("tweak-cat-furn"); if (s) s.value = cFurn; const v = document.getElementById("tweak-val-cat-furn"); if (v) v.textContent = `${cFurn}%`; }
    if (cOff) { const s = document.getElementById("tweak-cat-off"); if (s) s.value = cOff; const v = document.getElementById("tweak-val-cat-off"); if (v) v.textContent = `${cOff}%`; }
    if (cBoost) { const s = document.getElementById("tweak-subcat-boost"); if (s) s.value = cBoost; const v = document.getElementById("tweak-val-subcat-boost"); if (v) v.textContent = `${parseFloat(cBoost).toFixed(2)}x`; }

    const qGrowth = document.getElementById("input-q-growth")?.value;
    const discPen = document.getElementById("input-discount-penalty")?.value;
    if (qGrowth) { const s = document.getElementById("tweak-q-growth"); if (s) s.value = qGrowth; const v = document.getElementById("tweak-val-q-growth"); if (v) v.textContent = `${parseFloat(qGrowth).toFixed(1)}x`; }
    if (discPen) { const s = document.getElementById("tweak-discount-penalty"); if (s) s.value = discPen; const v = document.getElementById("tweak-val-discount-penalty"); if (v) v.textContent = `${parseFloat(discPen).toFixed(1)}x`; }
  },

  debounceComputeOrg() {
    clearTimeout(this._orgDebounceTimer);
    this._orgDebounceTimer = setTimeout(() => {
      this.computeOrgStudio(false);
    }, 100);
  },

  applyOrgPreset(preset) {
    const corpRev = document.getElementById("input-dept-corp-rev");
    const corpCost = document.getElementById("input-dept-corp-cost");
    const consRev = document.getElementById("input-dept-cons-rev");
    const consCost = document.getElementById("input-dept-cons-cost");
    const homeRev = document.getElementById("input-dept-home-rev");
    const homeCost = document.getElementById("input-dept-home-cost");
    const nameInput = document.getElementById("input-org-name");

    const rWest = document.getElementById("input-reg-west");
    const rEast = document.getElementById("input-reg-east");
    const rCent = document.getElementById("input-reg-central");
    const rSouth = document.getElementById("input-reg-south");

    const cTech = document.getElementById("input-cat-tech");
    const cFurn = document.getElementById("input-cat-furn");
    const cOff = document.getElementById("input-cat-off");
    const cBoost = document.getElementById("input-subcat-boost");

    const qGrowth = document.getElementById("input-q-growth");
    const discPen = document.getElementById("input-discount-penalty");

    if (preset === "superstore") {
      if (nameInput) nameInput.value = "Superstore Retail Division";
      if (corpRev) corpRev.value = 145000000; if (corpCost) corpCost.value = 108000000;
      if (consRev) consRev.value = 82000000; if (consCost) consCost.value = 61000000;
      if (homeRev) homeRev.value = 46000000; if (homeCost) homeCost.value = 36000000;
      if (rWest) rWest.value = 34; if (rEast) rEast.value = 28; if (rCent) rCent.value = 21; if (rSouth) rSouth.value = 17;
      if (cTech) cTech.value = 24.5; if (cFurn) cFurn.value = 8.2; if (cOff) cOff.value = 18.4; if (cBoost) cBoost.value = 1.0;
      if (qGrowth) qGrowth.value = 1.0; if (discPen) discPen.value = 1.0;
    } else if (preset === "saas") {
      if (nameInput) nameInput.value = "Cloud & SaaS Global Corp";
      if (corpRev) corpRev.value = 260000000; if (corpCost) corpCost.value = 135000000;
      if (consRev) consRev.value = 110000000; if (consCost) consCost.value = 68000000;
      if (homeRev) homeRev.value = 60000000; if (homeCost) homeCost.value = 42000000;
      if (rWest) rWest.value = 42; if (rEast) rEast.value = 30; if (rCent) rCent.value = 16; if (rSouth) rSouth.value = 12;
      if (cTech) cTech.value = 38.0; if (cFurn) cFurn.value = 4.0; if (cOff) cOff.value = 14.0; if (cBoost) cBoost.value = 1.4;
      if (qGrowth) qGrowth.value = 1.5; if (discPen) discPen.value = 0.7;
    } else if (preset === "manufacturing") {
      if (nameInput) nameInput.value = "Precision Manufacturing Ltd";
      if (corpRev) corpRev.value = 180000000; if (corpCost) corpCost.value = 152000000;
      if (consRev) consRev.value = 95000000; if (consCost) consCost.value = 81000000;
      if (homeRev) homeRev.value = 45000000; if (homeCost) homeCost.value = 39000000;
      if (rWest) rWest.value = 25; if (rEast) rEast.value = 25; if (rCent) rCent.value = 30; if (rSouth) rSouth.value = 20;
      if (cTech) cTech.value = 18.0; if (cFurn) cFurn.value = 14.5; if (cOff) cOff.value = 15.0; if (cBoost) cBoost.value = 0.85;
      if (qGrowth) qGrowth.value = 0.8; if (discPen) discPen.value = 1.6;
    }

    this.updateStudioDisplayLabels();
    this.syncStudioToCardTweakers();
    this.computeOrgStudio(true);
  },

  async computeOrgStudio(showToast = true) {
    const name = document.getElementById("input-org-name")?.value || "Enterprise Corp";
    const year = parseInt(document.getElementById("input-org-year")?.value || 2024);

    const corpRev = parseFloat(document.getElementById("input-dept-corp-rev")?.value || 0);
    const corpCost = parseFloat(document.getElementById("input-dept-corp-cost")?.value || 0);
    const consRev = parseFloat(document.getElementById("input-dept-cons-rev")?.value || 0);
    const consCost = parseFloat(document.getElementById("input-dept-cons-cost")?.value || 0);
    const homeRev = parseFloat(document.getElementById("input-dept-home-rev")?.value || 0);
    const homeCost = parseFloat(document.getElementById("input-dept-home-cost")?.value || 0);

    const rWest = parseFloat(document.getElementById("input-reg-west")?.value || 34);
    const rEast = parseFloat(document.getElementById("input-reg-east")?.value || 28);
    const rCentral = parseFloat(document.getElementById("input-reg-central")?.value || 21);
    const rSouth = parseFloat(document.getElementById("input-reg-south")?.value || 17);

    const cTech = parseFloat(document.getElementById("input-cat-tech")?.value || 24.5);
    const cFurn = parseFloat(document.getElementById("input-cat-furn")?.value || 8.2);
    const cOff = parseFloat(document.getElementById("input-cat-off")?.value || 18.4);
    const subcatBoost = parseFloat(document.getElementById("input-subcat-boost")?.value || 1.0);

    const qGrowth = parseFloat(document.getElementById("input-q-growth")?.value || 1.0);
    const discPenalty = parseFloat(document.getElementById("input-discount-penalty")?.value || 1.0);

    const payload = {
      company_name: name,
      fiscal_year: year,
      departments: {
        "Corporate": { revenue: corpRev, cost: corpCost },
        "Consumer": { revenue: consRev, cost: consCost },
        "Home Office": { revenue: homeRev, cost: homeCost }
      },
      regions: {
        "West": rWest,
        "East": rEast,
        "Central": rCentral,
        "South": rSouth
      },
      category_margins: {
        "Technology": cTech,
        "Furniture": cFurn,
        "Office Supplies": cOff
      },
      subcat_multiplier: subcatBoost,
      quarterly_growth_multiplier: qGrowth,
      discount_penalty: discPenalty
    };

    try {
      const data = await api.calculateOrganization(payload);

      // Update Org KPIs safely (both legacy and BUDGETRIX IDs supported)
      const salesEl = document.getElementById("org-kpi-sales") || document.getElementById("org-kpi-revenue");
      if (salesEl) salesEl.textContent = `₹${data.kpis.total_revenue.toLocaleString('en-IN')}`;

      const costEl = document.getElementById("org-kpi-cost");
      if (costEl) costEl.textContent = `₹${data.kpis.total_cost.toLocaleString('en-IN')}`;
      
      const profitEl = document.getElementById("org-kpi-profit");
      if (profitEl) {
        profitEl.textContent = `₹${data.kpis.total_profit.toLocaleString('en-IN')}`;
        if (profitEl.closest(".kpi-card")) {
          profitEl.closest(".kpi-card").className = `kpi-card ${data.kpis.total_profit >= 0 ? 'kpi-positive' : 'kpi-negative'}`;
        }
      }

      const marginEl = document.getElementById("org-kpi-margin") || document.getElementById("org-kpi-growth");
      if (marginEl) marginEl.textContent = `${data.kpis.profit_margin_pct}%`;

      const varianceEl = document.getElementById("org-kpi-variance");
      if (varianceEl) varianceEl.textContent = `₹${data.kpis.budget_variance.toLocaleString('en-IN')}`;

      const utilEl = document.getElementById("org-kpi-utilization");
      if (utilEl) utilEl.textContent = `${data.kpis.budget_utilization_pct}%`;

      // Update BUDGETRIX 3 Summary Insights for Org
      const orgCostInsight = document.getElementById("org-insight-cost");
      const orgMarginInsight = document.getElementById("org-insight-margin");
      const orgProfitInsight = document.getElementById("org-insight-profit");

      if (orgCostInsight) {
        const topDept = data.kpis.top_department || "Corporate";
        const topCr = (data.kpis.top_department_cost / 1e7).toFixed(1);
        const topPct = data.kpis.total_cost > 0 ? ((data.kpis.top_department_cost / data.kpis.total_cost) * 100).toFixed(1) : 0;
        orgCostInsight.textContent = `${topDept} division is the largest operational cost driver at ₹${topCr} Cr (${topPct}% of total spend).`;
      }

      if (orgMarginInsight) {
        const costBurn = data.kpis.total_revenue > 0 ? ((data.kpis.total_cost / data.kpis.total_revenue) * 100).toFixed(1) : 0;
        orgMarginInsight.textContent = `Operating cost is ${costBurn}% of total sales — staying inside the operational envelope.`;
      }

      if (orgProfitInsight) {
        const profitCr = (data.kpis.total_profit / 1e7).toFixed(1);
        orgProfitInsight.textContent = `Enterprise revenue yields ₹${profitCr} Cr net operating margin (${data.kpis.profit_margin_pct}% return).`;
      }

      // Re-render ALL currently displayed visuals via VisualManager!
      if (typeof VisualManager !== "undefined") {
        VisualManager.latestData["organization"] = data;
        VisualManager.renderActiveCharts("organization", data);
      }

      if (document.getElementById("chart-org-clustered")) {
        ChartEngine.renderOrgClusteredBar("chart-org-clustered", data.clustered_bar);
      }
      if (document.getElementById("chart-org-growth")) {
        ChartEngine.renderOrgGrowthLine("chart-org-growth", data.quarterly_growth);
      }

      // Treemap
      const treemapContainer = document.getElementById("org-treemap-container");
      if (treemapContainer && data.treemap) {
        treemapContainer.innerHTML = data.treemap.map(t => `
          <div style="background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.85rem; margin-block-end: 0.75rem;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--text-main); margin-block-end: 0.5rem;">
              <span>📁 ${t.name}</span>
              <span style="color: var(--accent-cyan); font-family: var(--font-mono);">₹${t.value.toLocaleString('en-IN')} Profit (Sales: ₹${t.sales.toLocaleString('en-IN')})</span>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${t.children.map(c => `
                <span class="tag-badge" style="background: rgba(6, 182, 212, 0.12); border: 1px solid rgba(6, 182, 212, 0.25); color: var(--text-main); font-weight: 600;">
                  ${c.name}: ₹${c.value.toLocaleString('en-IN')}
                </span>
              `).join("")}
            </div>
          </div>
        `).join("");
      }

      // Matrix Table
      const matrixHead = document.getElementById("org-matrix-head");
      const matrixBody = document.getElementById("org-matrix-body");
      if (matrixHead && matrixBody && data.matrix) {
        matrixHead.innerHTML = `<tr><th>Region \\ Category</th>${data.matrix.categories.map(c => `<th>${c}</th>`).join("")}</tr>`;
        matrixBody.innerHTML = data.matrix.regions.map((reg, rIdx) => `
          <tr>
            <td><strong>${reg}</strong></td>
            ${data.matrix.values[rIdx].map(val => `
              <td class="${val >= 0 ? 'matrix-cell-positive' : 'matrix-cell-negative'}">
                ₹${val.toLocaleString('en-IN')}
              </td>
            `).join("")}
          </tr>
        `).join("");
      }

      this.updateStudioDisplayLabels();
      this.syncStudioToCardTweakers();

      if (showToast) {
        this.showToast(`Enterprise visuals updated! All active graphs recalculated.`, "success");
      }
    } catch (err) {
      console.error(err);
      if (showToast) {
        this.showToast("Failed to compute organization analytics.", "error");
      }
    }
  },

  // ----------------------------------------------------------------------------
  // 1. LOAD EXECUTIVE OVERVIEW (PAGE 1)
  // ----------------------------------------------------------------------------
  async loadOverview() {
    try {
      const data = await api.getOverview(this.overviewState.year, this.overviewState.level);

      // Render 6 KPI Cards (if container exists)
      const container = document.getElementById("overview-kpi-container");
      if (container && data.kpi_cards) {
        container.innerHTML = data.kpi_cards.map(c => `
          <div class="kpi-card ${c.status === 'positive' ? 'kpi-positive' : c.status === 'negative' ? 'kpi-negative' : ''}">
            <div class="kpi-title">${c.title}</div>
            <div class="kpi-value">${c.formatted}</div>
            <div class="kpi-subtext ${c.status === 'positive' ? 'subtext-positive' : c.status === 'negative' ? 'subtext-negative' : 'subtext-neutral'}">
              ${c.subtext || c.level}
            </div>
          </div>
        `).join("");
      }

      // Populate dedicated overview KPI elements
      const indSpendEl = document.getElementById("kpi-overview-ind-spend");
      if (indSpendEl && data.summary) {
        indSpendEl.textContent = this.formatCompactIndian(data.summary.ind_expense);
      }
      const orgRevEl = document.getElementById("kpi-overview-org-rev");
      if (orgRevEl && data.summary) {
        orgRevEl.textContent = `₹${(data.summary.org_revenue / 1e7).toFixed(1)} Cr`;
      }
      const stateDefEl = document.getElementById("kpi-overview-state-deficit");
      if (stateDefEl && data.summary) {
        stateDefEl.textContent = `${data.summary.avg_deficit_pct}%`;
      }

      // Render Visuals
      if (document.getElementById("chart-overview-combo") && data.combo_chart) {
        ChartEngine.renderExecutiveCombo("chart-overview-combo", data.combo_chart);
      }
      if (document.getElementById("chart-overview-comparison") && data.combo_chart) {
        ChartEngine.renderOverviewComparison("chart-overview-comparison", data.combo_chart);
      }
      if (document.getElementById("chart-overview-pie") && data.summary) {
        ChartEngine.renderOverviewPie("chart-overview-pie", data.summary);
      }
    } catch (err) {
      console.error(err);
      this.showToast("Failed to load overview data.", "error");
    }
  },

  // ----------------------------------------------------------------------------
  // 2. LOAD INDIVIDUAL ANALYTICS (PAGE 2)
  // ----------------------------------------------------------------------------
  async loadIndividual() {
    try {
      const data = await api.getIndividual(this.indState.category, this.indState.year);

      // Populate KPI values
      const incEl = document.getElementById("ind-kpi-income");
      if (incEl && data.kpis) incEl.textContent = `₹${data.kpis.total_income.toLocaleString('en-IN')}`;

      const expEl = document.getElementById("ind-kpi-expense");
      if (expEl && data.kpis) expEl.textContent = `₹${data.kpis.total_expense.toLocaleString('en-IN')}`;
      
      const netSavingsEl = document.getElementById("ind-kpi-savings");
      if (netSavingsEl && data.kpis) {
        netSavingsEl.textContent = `₹${data.kpis.net_savings.toLocaleString('en-IN')}`;
        if (netSavingsEl.closest(".kpi-card")) {
          netSavingsEl.closest(".kpi-card").className = `kpi-card ${data.kpis.net_savings >= 0 ? 'kpi-positive' : 'kpi-negative'}`;
        }
      }

      const rateEl = document.getElementById("ind-kpi-savings-rate");
      if (rateEl && data.kpis) rateEl.textContent = `${data.kpis.savings_rate_pct}% Savings Rate`;

      const budEl = document.getElementById("ind-kpi-budget");
      if (budEl && data.kpis) budEl.textContent = `₹${data.kpis.total_planned_budget.toLocaleString('en-IN')}`;

      const utilEl = document.getElementById("ind-kpi-utilization");
      if (utilEl && data.kpis) utilEl.textContent = `${data.kpis.budget_utilization_pct}%`;

      const flagBadge = document.getElementById("ind-overspend-flag");
      if (flagBadge && data.kpis) {
        flagBadge.textContent = data.kpis.overspend_flag;
        flagBadge.className = `tag-badge ${data.kpis.overspend_flag === 'Within Budget' ? 'tag-income' : 'tag-expense'}`;
      }

      // Update BUDGETRIX 3 Summary Insights
      const spendInsightEl = document.getElementById("bx-insight-spend");
      const varianceInsightEl = document.getElementById("bx-insight-variance");
      const savingsInsightEl = document.getElementById("bx-insight-savings");

      if (spendInsightEl && data.donut_chart && data.donut_chart.labels && data.donut_chart.labels.length > 0) {
        let maxCat = data.donut_chart.labels[0], maxVal = data.donut_chart.data[0];
        for (let i = 1; i < data.donut_chart.labels.length; i++) {
          if (data.donut_chart.data[i] > maxVal) {
            maxVal = data.donut_chart.data[i];
            maxCat = data.donut_chart.labels[i];
          }
        }
        const maxFmt = this.formatCompactIndian(maxVal);
        spendInsightEl.textContent = `Your biggest spend this year is ${maxCat} at ${maxFmt}. Trim that first if you want savings to rise.`;
      }

      if (varianceInsightEl && data.kpis) {
        const diff = Math.abs(data.kpis.total_planned_budget - data.kpis.total_expense);
        const diffFmt = this.formatCompactIndian(diff);
        const util = data.kpis.budget_utilization_pct;
        if (data.kpis.total_expense <= data.kpis.total_planned_budget) {
          varianceInsightEl.textContent = `You stayed inside the plan by ${diffFmt} — spending is ${util}% of what you set aside.`;
        } else {
          varianceInsightEl.textContent = `Spending exceeded your planned budget by ${diffFmt} — utilization is ${util}% of budget limit.`;
        }
      }

      if (savingsInsightEl && data.kpis) {
        const incFmt = this.formatCompactIndian(data.kpis.total_income);
        const savFmt = this.formatCompactIndian(data.kpis.net_savings);
        savingsInsightEl.textContent = `Out of ${incFmt} earned, ${savFmt} stayed with you — a savings rate of ${data.kpis.savings_rate_pct}%.`;
      }

      // Render Visuals with Customizer
      VisualManager.init("individual", data);

      // Render Transactions Table (support both tx-table-body and ind-table-body)
      const tbody = document.getElementById("tx-table-body") || document.getElementById("ind-table-body");
      if (tbody) {
        if (data.transactions && data.transactions.length > 0) {
          tbody.innerHTML = data.transactions.map(tx => `
            <tr>
              <td><strong>#${tx.id}</strong></td>
              <td>${tx.date}</td>
              <td><span class="tag-badge tag-mode">${tx.mode}</span></td>
              <td>${tx.category}</td>
              <td>${tx.subcategory || '-'}</td>
              <td>${tx.note || '-'}</td>
              <td><strong>₹${tx.amount.toLocaleString('en-IN')}</strong></td>
              <td><span class="tag-badge ${tx.income_expense === 'Income' ? 'tag-income' : 'tag-expense'}">${tx.income_expense}</span></td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="App.deleteTransaction(${tx.id})">🗑️</button>
              </td>
            </tr>
          `).join("");
        } else {
          tbody.innerHTML = `
            <tr>
              <td colspan="9" style="text-align: center; color: var(--bx-text-muted); padding: 2rem;">
                No transactions recorded yet. Use the Studio above to simulate your budget or record a new transaction.
              </td>
            </tr>
          `;
        }
      }

      // Populate category dropdown in budget editor modal
      const budgetCatSelect = document.getElementById("budget-category-select");
      if (budgetCatSelect && data.categories) {
        budgetCatSelect.innerHTML = data.categories.map(c => `
          <option value="${c}">${c} (Current: ₹${(data.budgets[c] || 0).toLocaleString('en-IN')}/mo)</option>
        `).join("");
      }

      // Populate category dropdown in filter
      const catFilter = document.getElementById("ind-category-filter");
      if (catFilter && catFilter.children.length <= 1 && data.categories) {
        data.categories.forEach(c => {
          const opt = document.createElement("option");
          opt.value = c;
          opt.textContent = c;
          catFilter.appendChild(opt);
        });
      }
    } catch (err) {
      console.error(err);
      this.showToast("Failed to load individual analytics.", "error");
    }
  },

  async deleteTransaction(id) {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      const res = await api.deleteTransaction(id);
      this.showToast(res.message, "success");
      await this.loadIndividual();
    } catch (err) {
      this.showToast(err.message, "error");
    }
  },

  // ----------------------------------------------------------------------------
  // 3. LOAD ORGANIZATION ANALYTICS (PAGE 3)
  // ----------------------------------------------------------------------------
  async loadOrganization() {
    try {
      const data = await api.getOrganization(this.orgState.department, this.orgState.year);

      // Populate KPIs
      const revEl = document.getElementById("org-kpi-sales") || document.getElementById("org-kpi-revenue");
      if (revEl && data.kpis) revEl.textContent = `₹${data.kpis.total_revenue.toLocaleString('en-IN')}`;

      const costEl = document.getElementById("org-kpi-cost");
      if (costEl && data.kpis) costEl.textContent = `₹${data.kpis.total_cost.toLocaleString('en-IN')}`;
      
      const profitEl = document.getElementById("org-kpi-profit");
      if (profitEl && data.kpis) {
        profitEl.textContent = `₹${data.kpis.total_profit.toLocaleString('en-IN')}`;
        if (profitEl.closest(".kpi-card")) {
          profitEl.closest(".kpi-card").className = `kpi-card ${data.kpis.total_profit >= 0 ? 'kpi-positive' : 'kpi-negative'}`;
        }
      }

      const marginEl = document.getElementById("org-kpi-margin") || document.getElementById("org-kpi-utilization");
      if (marginEl && data.kpis) {
        const marginVal = data.kpis.total_revenue > 0 ? ((data.kpis.total_profit / data.kpis.total_revenue) * 100).toFixed(1) : "0.0";
        marginEl.textContent = `${marginVal}% Margin`;
      }

      const varEl = document.getElementById("org-kpi-variance");
      if (varEl && data.kpis) varEl.textContent = `₹${data.kpis.budget_variance.toLocaleString('en-IN')}`;

      const growthEl = document.getElementById("org-kpi-growth");
      if (growthEl && data.kpis) growthEl.textContent = `${data.kpis.revenue_growth_pct}% YoY`;

      const topDeptEl = document.getElementById("org-kpi-top-dept");
      if (topDeptEl && data.kpis) topDeptEl.textContent = `${data.kpis.top_department} (${this.formatCompactIndian(data.kpis.top_department_cost)})`;

      // Update BUDGETRIX 3 Summary Insights for Org
      const orgCostInsight = document.getElementById("org-insight-cost");
      const orgMarginInsight = document.getElementById("org-insight-margin");
      const orgProfitInsight = document.getElementById("org-insight-profit");

      if (orgCostInsight && data.kpis) {
        const topDept = data.kpis.top_department || "Corporate";
        const topCr = (data.kpis.top_department_cost / 1e7).toFixed(1);
        const topPct = data.kpis.total_cost > 0 ? ((data.kpis.top_department_cost / data.kpis.total_cost) * 100).toFixed(1) : 0;
        orgCostInsight.textContent = `${topDept} division is the largest operational cost driver at ₹${topCr} Cr (${topPct}% of total spend).`;
      }

      if (orgMarginInsight && data.kpis) {
        const costBurn = data.kpis.total_revenue > 0 ? ((data.kpis.total_cost / data.kpis.total_revenue) * 100).toFixed(1) : 0;
        orgMarginInsight.textContent = `Operating cost is ${costBurn}% of total revenue — staying inside the operational envelope.`;
      }

      if (orgProfitInsight && data.kpis) {
        const profitCr = (data.kpis.total_profit / 1e7).toFixed(1);
        const marginPct = data.kpis.total_revenue > 0 ? ((data.kpis.total_profit / data.kpis.total_revenue) * 100).toFixed(1) : 0;
        orgProfitInsight.textContent = `Enterprise revenue yields ₹${profitCr} Cr net operating margin (${marginPct}% return).`;
      }

      // Render Visuals with Customizer
      VisualManager.init("organization", data);
      this.updateStudioDisplayLabels();
      this.syncStudioToCardTweakers();

      // Orders sample table (support both order-table-body and org-table-body)
      const orderBody = document.getElementById("order-table-body") || document.getElementById("org-table-body");
      if (orderBody) {
        if (data.orders && data.orders.length > 0) {
          orderBody.innerHTML = data.orders.map(o => `
            <tr>
              <td><strong>${o.order_id}</strong></td>
              <td>${o.order_date}</td>
              <td><span class="tag-badge tag-mode">${o.department}</span></td>
              <td>${o.region}</td>
              <td>${o.category}</td>
              <td>${o.product_name || o.subcategory || '-'}</td>
              <td>₹${o.sales.toLocaleString('en-IN')}</td>
              <td>₹${o.cost.toLocaleString('en-IN')}</td>
              <td style="color: ${o.profit >= 0 ? 'var(--accent-teal)' : 'var(--danger-crimson)'}; font-weight: 600;">₹${o.profit.toLocaleString('en-IN')}</td>
              <td>
                <button class="btn btn-outline btn-sm" onclick="App.deleteOrder(${o.id})">🗑️</button>
              </td>
            </tr>
          `).join("");
        } else {
          orderBody.innerHTML = `
            <tr>
              <td colspan="10" style="text-align: center; color: var(--bx-text-muted); padding: 2rem;">
                No enterprise orders recorded yet. Use the Department Simulator above or log an order entry.
              </td>
            </tr>
          `;
        }
      }
    } catch (err) {
      console.error(err);
      this.showToast("Failed to load organization analytics.", "error");
    }
  },

  async deleteOrder(id) {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await api.deleteOrder(id);
      this.showToast(res.message, "success");
      await this.loadOrganization();
    } catch (err) {
      this.showToast(err.message, "error");
    }
  },

  // ----------------------------------------------------------------------------
  // 4. LOAD STATE & NATION ANALYTICS (PAGE 4)
  // ----------------------------------------------------------------------------
  async loadStateNation() {
    try {
      const data = await api.getStateNation(this.stateNationState.year);

      // Support dedicated page IDs and legacy IDs
      const revEl = document.getElementById("state-kpi-revenue") || document.getElementById("state-kpi-total-rev");
      if (revEl && data.kpis) revEl.textContent = `₹${(data.kpis.total_state_revenue/1e5).toFixed(2)} Lakh Cr`;

      const expEl = document.getElementById("state-kpi-expenditure") || document.getElementById("state-kpi-total-exp");
      if (expEl && data.kpis) expEl.textContent = `₹${(data.kpis.total_state_expenditure/1e5).toFixed(2)} Lakh Cr`;

      const defEl = document.getElementById("state-kpi-deficit") || document.getElementById("state-kpi-avg-deficit");
      if (defEl && data.kpis) {
        defEl.textContent = `${data.kpis.avg_fiscal_deficit_pct.toFixed(2)}% of GSDP`;
        if (defEl.closest(".kpi-card")) defEl.closest(".kpi-card").className = `kpi-card ${data.kpis.fiscal_deficit >= 0 ? 'kpi-positive' : 'kpi-negative'}`;
      }

      const debtEl = document.getElementById("state-kpi-debt-ratio");
      if (debtEl && data.kpis) debtEl.textContent = `${data.kpis.debt_to_revenue_pct}%`;

      const unionEl = document.getElementById("state-kpi-union-alloc") || document.getElementById("state-kpi-union-total");
      if (unionEl && data.kpis) unionEl.textContent = `₹${(data.kpis.total_national_allocation/1e5).toFixed(2)} Lakh Cr`;

      // Update the 3 BUDGETRIX Insight Columns
      const stateSpendInsight = document.getElementById("state-insight-spend");
      const stateDeficitInsight = document.getElementById("state-insight-deficit");
      const stateReceiptsInsight = document.getElementById("state-insight-receipts");

      if (stateSpendInsight && data.national_bar_chart && data.national_bar_chart.sectors && data.national_bar_chart.sectors.length > 0) {
        const topSec = data.national_bar_chart.sectors[0];
        const topAlloc = (data.national_bar_chart.allocation[0] / 100000).toFixed(2);
        stateSpendInsight.textContent = `National Union Budget allocates highest capital outlays to ${topSec} (₹${topAlloc} Lakh Cr) and Infrastructure.`;
      }

      if (stateDeficitInsight && data.kpis) {
        stateDeficitInsight.textContent = `Average Indian state fiscal deficit sits at ${data.kpis.avg_fiscal_deficit_pct}% of GSDP (${data.kpis.frbm_compliance_rate_pct}% compliance with FRBM 3.0% limit).`;
      }

      if (stateReceiptsInsight && data.kpis) {
        const revL = (data.kpis.total_state_revenue / 100000).toFixed(2);
        stateReceiptsInsight.textContent = `Aggregated State Revenue Receipts (₹${revL} Lakh Cr) cover 93.9% of all state expenditure obligations across 15 states.`;
      }

      // Render Visuals with Customizer
      VisualManager.init("state_nation", data);

      // State Scorecard Data Table
      const stateTbody = document.getElementById("state-table-body");
      if (stateTbody) {
        if (data.state_map_data && data.state_map_data.length > 0) {
          stateTbody.innerHTML = data.state_map_data.map(s => {
            return `
              <tr>
                <td><strong>📍 ${s.state}</strong></td>
                <td>${s.year || '2024'}</td>
                <td>₹${Number(s.gsdp).toLocaleString('en-IN')} Cr</td>
                <td>₹${Number(s.revenue).toLocaleString('en-IN')} Cr</td>
                <td>₹${Number(s.expenditure).toLocaleString('en-IN')} Cr</td>
                <td style="color: ${s.fiscal_deficit < 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'}; font-weight: 600;">
                  ₹${Number(s.fiscal_deficit).toLocaleString('en-IN')} Cr
                </td>
                <td><strong style="color: ${s.frbm_compliant ? '#10B981' : '#FF5738'};">${s.deficit_pct_gsdp}%</strong></td>
                <td>
                  <span class="${s.frbm_compliant ? 'bx-badge-green' : 'bx-badge-amber'}" style="font-size: 0.72rem; padding: 0.2rem 0.6rem;">
                    ${s.frbm_compliant ? '✔ FRBM Compliant' : '⚠ Caution Target'}
                  </span>
                </td>
              </tr>
            `;
          }).join("");
        } else {
          stateTbody.innerHTML = `
            <tr>
              <td colspan="8" style="text-align: center; color: var(--bx-text-muted); padding: 2rem;">
                No state finance data loaded. Place RBI state finance CSVs into 01_RawData to view live sovereign metrics.
              </td>
            </tr>
          `;
        }
      }
    } catch (err) {
      console.error(err);
      this.showToast("Failed to load state & national analytics.", "error");
    }
  },

  // ----------------------------------------------------------------------------
  // 5. LOAD PREDICTIVE ANALYTICS & WHAT-IF (PAGE 5)
  // ----------------------------------------------------------------------------
  async loadPredictive() {
    try {
      const data = await api.getPredictive();
      this.renderPredictiveCharts(data);
    } catch (err) {
      console.error(err);
      this.showToast("Failed to load predictive analytics.", "error");
    }
  },

  renderPredictiveCharts(data) {
    if (!data) return;

    // Support all ID naming conventions (predictive.html, index.html, legacy)
    const resolveCanvas = (ids) => {
      for (const id of ids) {
        if (document.getElementById(id)) return id;
      }
      return ids[0];
    };

    const canvasInd = resolveCanvas(["chart-predict-ind", "chart-predictive-ind", "chart-forecast-ind"]);
    const canvasOrg = resolveCanvas(["chart-predict-org", "chart-predictive-org", "chart-forecast-org"]);
    const canvasState = resolveCanvas(["chart-predict-state", "chart-predictive-state", "chart-forecast-state"]);

    if (data.individual_forecast) {
      ChartEngine.renderForecastChart(
        canvasInd,
        data.individual_forecast,
        "Personal Monthly Outlay (₹)",
        { main: "#06B6D4", forecast: "#F59E0B", band: "rgba(245, 158, 11, 0.18)" }
      );
    }

    if (data.organization_forecast) {
      ChartEngine.renderForecastChart(
        canvasOrg,
        data.organization_forecast,
        "Enterprise Quarterly Revenue (₹)",
        { main: "#6366F1", forecast: "#10B981", band: "rgba(16, 185, 129, 0.18)" }
      );
    }

    if (data.state_forecast) {
      ChartEngine.renderForecastChart(
        canvasState,
        data.state_forecast,
        "State Public Expenditure (₹)",
        { main: "#38BDF8", forecast: "#F43F5E", band: "rgba(244, 63, 94, 0.18)" }
      );
    }

    // Update Next-Period Projected KPI cards
    const pInd = document.getElementById("proj-kpi-ind");
    if (pInd && data.individual_forecast) pInd.textContent = `₹${Number(data.individual_forecast.projected_next_month).toLocaleString('en-IN')}`;
    
    const pOrg = document.getElementById("proj-kpi-org");
    if (pOrg && data.organization_forecast) pOrg.textContent = `₹${Number(data.organization_forecast.projected_next_quarter).toLocaleString('en-IN')}`;
    
    const pState = document.getElementById("proj-kpi-state");
    if (pState && data.state_forecast) pState.textContent = `₹${Number(data.state_forecast.projected_next_year).toLocaleString('en-IN')}`;

    // Decision Takeaway Box
    const takeawayEl = document.getElementById("forecast-takeaway-text") || document.getElementById("predictive-takeaway-text");
    if (takeawayEl) takeawayEl.textContent = data.decision_insights;
  },

  // ----------------------------------------------------------------------------
  // 6. LOAD POWER BI HUB (PAGE 6)
  // ----------------------------------------------------------------------------
  async loadPowerBIHub() {
    try {
      const daxCode = await api.getPbiDax();
      const daxBox = document.getElementById("dax-code-block");
      if (daxBox) daxBox.textContent = daxCode;
    } catch (err) {
      console.error("Could not fetch DAX code preview:", err);
    }

    try {
      const pqCode = await api.getPbiPq();
      const pqBox = document.getElementById("pq-code-block");
      if (pqBox) pqBox.textContent = pqCode;
    } catch (err) {
      console.error("Could not fetch Power Query code preview:", err);
    }
  }
};

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
