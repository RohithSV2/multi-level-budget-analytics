// ==============================================================================
// MULTI-LEVEL BUDGET TRACKER ANALYTICS — MAIN APPLICATION CONTROLLER
// ==============================================================================

const App = {
  activeTab: "landing",
  
  // State caches
  overviewState: { year: "All", level: "All" },
  indState: { category: "All", year: "All" },
  orgState: { department: "All", year: "All" },
  stateNationState: { year: "All" },
  predictiveState: { indCut: 0, orgGrowth: 0, stateDeficitTarget: 0 },

  async init() {
    this.bindTabNavigation();
    this.bindModals();
    this.bindFilters();
    this.bindWhatIfSliders();
    this.bindPowerBIHub();
    this.initIndStudio();
    this.initOrgStudio();

    // Background pre-fetch so mode clicks load instantly
    this.loadOverview().catch(() => {});
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
    const btnAddTx = document.getElementById("btn-add-tx");
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
    const btnAddOrder = document.getElementById("btn-add-order");
    const modalAddOrder = document.getElementById("modal-add-order");
    if (btnAddOrder && modalAddOrder) {
      btnAddOrder.addEventListener("click", () => modalAddOrder.classList.add("open"));
    }

    // Close buttons
    document.querySelectorAll(".modal-close-btn, .btn-modal-cancel").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal-backdrop");
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
        const payload = {
          date: document.getElementById("tx-date").value,
          income_expense: document.getElementById("tx-type").value,
          category: document.getElementById("tx-category").value,
          subcategory: document.getElementById("tx-subcategory").value,
          amount: parseFloat(document.getElementById("tx-amount").value),
          mode: document.getElementById("tx-mode").value,
          note: document.getElementById("tx-note").value,
          currency: "INR"
        };

        try {
          const res = await api.addTransaction(payload);
          this.showToast(res.message, "success");
          document.getElementById("modal-add-tx").classList.remove("open");
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
        const cat = document.getElementById("budget-category-select").value;
        const amount = parseFloat(document.getElementById("budget-amount-input").value);

        try {
          const res = await api.updateBudget(cat, amount);
          this.showToast(res.message, "success");
          document.getElementById("modal-budgets").classList.remove("open");
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
        const payload = {
          order_date: document.getElementById("order-date").value,
          department: document.getElementById("order-dept").value,
          region: document.getElementById("order-region").value,
          city: document.getElementById("order-city").value || "Bengaluru",
          category: document.getElementById("order-category").value,
          subcategory: document.getElementById("order-subcategory").value,
          product_name: document.getElementById("order-product").value,
          sales: parseFloat(document.getElementById("order-sales").value),
          discount: parseFloat(document.getElementById("order-discount").value || 0),
          profit: parseFloat(document.getElementById("order-profit").value),
          quantity: parseInt(document.getElementById("order-qty").value || 1)
        };

        try {
          const res = await api.addOrder(payload);
          this.showToast(res.message, "success");
          document.getElementById("modal-add-order").classList.remove("open");
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
  initOrgStudio() {
    document.getElementById("btn-compute-org")?.addEventListener("click", () => this.computeOrgStudio());
    document.getElementById("btn-reset-org")?.addEventListener("click", () => this.applyOrgPreset("superstore"));
  },

  applyOrgPreset(preset) {
    const corpRev = document.getElementById("input-dept-corp-rev");
    const corpCost = document.getElementById("input-dept-corp-cost");
    const consRev = document.getElementById("input-dept-cons-rev");
    const consCost = document.getElementById("input-dept-cons-cost");
    const homeRev = document.getElementById("input-dept-home-rev");
    const homeCost = document.getElementById("input-dept-home-cost");
    const nameInput = document.getElementById("input-org-name");

    if (preset === "superstore") {
      if (nameInput) nameInput.value = "Superstore Retail Division";
      if (corpRev) corpRev.value = 145000000; if (corpCost) corpCost.value = 108000000;
      if (consRev) consRev.value = 82000000; if (consCost) consCost.value = 61000000;
      if (homeRev) homeRev.value = 46000000; if (homeCost) homeCost.value = 36000000;
    } else if (preset === "saas") {
      if (nameInput) nameInput.value = "Cloud & SaaS Global Corp";
      if (corpRev) corpRev.value = 260000000; if (corpCost) corpCost.value = 135000000;
      if (consRev) consRev.value = 110000000; if (consCost) consCost.value = 68000000;
      if (homeRev) homeRev.value = 60000000; if (homeCost) homeCost.value = 42000000;
    } else if (preset === "manufacturing") {
      if (nameInput) nameInput.value = "Precision Manufacturing Ltd";
      if (corpRev) corpRev.value = 180000000; if (corpCost) corpCost.value = 152000000;
      if (consRev) consRev.value = 95000000; if (consCost) consCost.value = 81000000;
      if (homeRev) homeRev.value = 45000000; if (homeCost) homeCost.value = 39000000;
    } else if (preset === "custom") {
      if (nameInput) nameInput.value = "Custom Enterprise";
      if (corpRev) corpRev.value = 0; if (corpCost) corpCost.value = 0;
      if (consRev) consRev.value = 0; if (consCost) consCost.value = 0;
      if (homeRev) homeRev.value = 0; if (homeCost) homeCost.value = 0;
    }

    this.computeOrgStudio();
  },

  async computeOrgStudio() {
    const name = document.getElementById("input-org-name")?.value || "Enterprise Corp";
    const year = parseInt(document.getElementById("input-org-year")?.value || 2024);

    const corpRev = parseFloat(document.getElementById("input-dept-corp-rev")?.value || 0);
    const corpCost = parseFloat(document.getElementById("input-dept-corp-cost")?.value || 0);
    const consRev = parseFloat(document.getElementById("input-dept-cons-rev")?.value || 0);
    const consCost = parseFloat(document.getElementById("input-dept-cons-cost")?.value || 0);
    const homeRev = parseFloat(document.getElementById("input-dept-home-rev")?.value || 0);
    const homeCost = parseFloat(document.getElementById("input-dept-home-cost")?.value || 0);

    const payload = {
      company_name: name,
      fiscal_year: year,
      departments: {
        "Corporate": { revenue: corpRev, cost: corpCost },
        "Consumer": { revenue: consRev, cost: consCost },
        "Home Office": { revenue: homeRev, cost: homeCost }
      }
    };

    try {
      const data = await api.calculateOrganization(payload);

      // Update Org KPIs
      document.getElementById("org-kpi-revenue").textContent = `₹${data.kpis.total_revenue.toLocaleString('en-IN')}`;
      document.getElementById("org-kpi-cost").textContent = `₹${data.kpis.total_cost.toLocaleString('en-IN')}`;
      
      const profitEl = document.getElementById("org-kpi-profit");
      profitEl.textContent = `₹${data.kpis.total_profit.toLocaleString('en-IN')}`;
      profitEl.closest(".kpi-card").className = `kpi-card ${data.kpis.total_profit >= 0 ? 'kpi-positive' : 'kpi-negative'}`;

      document.getElementById("org-kpi-variance").textContent = `₹${data.kpis.budget_variance.toLocaleString('en-IN')}`;
      document.getElementById("org-kpi-utilization").textContent = `${data.kpis.budget_utilization_pct}%`;
      document.getElementById("org-kpi-growth").textContent = `${data.kpis.profit_margin_pct}% Margin`;
      document.getElementById("org-kpi-top-dept").textContent = `${data.kpis.top_department} (₹${(data.kpis.top_department_cost/1e7).toFixed(1)} Cr)`;

      // Render Visuals
      ChartEngine.renderOrgClusteredBar("chart-org-clustered", data.clustered_bar);
      ChartEngine.renderOrgGrowthLine("chart-org-growth", data.quarterly_growth);

      // Treemap
      const treemapContainer = document.getElementById("org-treemap-container");
      if (treemapContainer) {
        treemapContainer.innerHTML = data.treemap.map(t => `
          <div style="background: #F8FAFC; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.85rem; margin-block-end: 0.75rem;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--primary-navy); margin-block-end: 0.5rem;">
              <span>📁 ${t.name}</span>
              <span style="color: var(--accent-teal);">₹${t.value.toLocaleString('en-IN')} Profit (Sales: ₹${t.sales.toLocaleString('en-IN')})</span>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${t.children.map(c => `
                <span class="tag-badge" style="background: rgba(31, 56, 100, 0.08); color: var(--primary-navy); font-weight: 600;">
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
      if (matrixHead && matrixBody) {
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

      this.showToast(`Organization dashboard updated for "${data.company_name}"!`, "success");
    } catch (err) {
      console.error(err);
      this.showToast("Failed to compute organization analytics.", "error");
    }
  },

  // ----------------------------------------------------------------------------
  // 1. LOAD EXECUTIVE OVERVIEW (PAGE 1)
  // ----------------------------------------------------------------------------
  async loadOverview() {
    try {
      const data = await api.getOverview(this.overviewState.year, this.overviewState.level);

      // Render 6 KPI Cards
      const container = document.getElementById("overview-kpi-container");
      if (container) {
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

      // Render Combo Chart
      ChartEngine.renderExecutiveCombo("chart-overview-combo", data.combo_chart);
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
      document.getElementById("ind-kpi-income").textContent = `₹${data.kpis.total_income.toLocaleString('en-IN')}`;
      document.getElementById("ind-kpi-expense").textContent = `₹${data.kpis.total_expense.toLocaleString('en-IN')}`;
      
      const netSavingsEl = document.getElementById("ind-kpi-savings");
      netSavingsEl.textContent = `₹${data.kpis.net_savings.toLocaleString('en-IN')}`;
      netSavingsEl.closest(".kpi-card").className = `kpi-card ${data.kpis.net_savings >= 0 ? 'kpi-positive' : 'kpi-negative'}`;

      document.getElementById("ind-kpi-savings-rate").textContent = `${data.kpis.savings_rate_pct}%`;
      document.getElementById("ind-kpi-budget").textContent = `₹${data.kpis.total_planned_budget.toLocaleString('en-IN')}`;
      document.getElementById("ind-kpi-utilization").textContent = `${data.kpis.budget_utilization_pct}%`;

      const flagBadge = document.getElementById("ind-overspend-flag");
      if (flagBadge) {
        flagBadge.textContent = data.kpis.overspend_flag;
        flagBadge.className = `tag-badge ${data.kpis.overspend_flag === 'Within Budget' ? 'tag-income' : 'tag-expense'}`;
      }

      // Render Visuals
      ChartEngine.renderIndividualDonut("chart-ind-donut", data.donut_chart);
      ChartEngine.renderIndividualLine("chart-ind-line", data.line_chart);
      ChartEngine.renderIndividualVarianceBar("chart-ind-variance", data.bar_chart);

      // Render Transactions Table
      const tbody = document.getElementById("tx-table-body");
      if (tbody) {
        tbody.innerHTML = data.transactions.map(tx => `
          <tr>
            <td><strong>${tx.date}</strong></td>
            <td><span class="tag-badge ${tx.income_expense === 'Income' ? 'tag-income' : 'tag-expense'}">${tx.income_expense}</span></td>
            <td>${tx.category}</td>
            <td>${tx.subcategory || '-'}</td>
            <td><span class="tag-badge tag-mode">${tx.mode}</span></td>
            <td><strong>₹${tx.amount.toLocaleString('en-IN')}</strong></td>
            <td>${tx.note || '-'}</td>
            <td>
              <button class="btn btn-outline btn-sm" onclick="App.deleteTransaction(${tx.id})">🗑️</button>
            </td>
          </tr>
        `).join("");
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
      if (catFilter && catFilter.children.length <= 1) {
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
      document.getElementById("org-kpi-revenue").textContent = `₹${data.kpis.total_revenue.toLocaleString('en-IN')}`;
      document.getElementById("org-kpi-cost").textContent = `₹${data.kpis.total_cost.toLocaleString('en-IN')}`;
      
      const profitEl = document.getElementById("org-kpi-profit");
      profitEl.textContent = `₹${data.kpis.total_profit.toLocaleString('en-IN')}`;
      profitEl.closest(".kpi-card").className = `kpi-card ${data.kpis.total_profit >= 0 ? 'kpi-positive' : 'kpi-negative'}`;

      document.getElementById("org-kpi-variance").textContent = `₹${data.kpis.budget_variance.toLocaleString('en-IN')}`;
      document.getElementById("org-kpi-utilization").textContent = `${data.kpis.budget_utilization_pct}%`;
      document.getElementById("org-kpi-growth").textContent = `${data.kpis.revenue_growth_pct}% YoY`;
      document.getElementById("org-kpi-top-dept").textContent = `${data.kpis.top_department} (₹${(data.kpis.top_department_cost/1e5).toFixed(1)}L)`;

      // Visuals
      ChartEngine.renderOrgClusteredBar("chart-org-clustered", data.clustered_bar);
      ChartEngine.renderOrgGrowthLine("chart-org-growth", data.quarterly_growth);

      // Render Treemap-style Categories
      const treemapContainer = document.getElementById("org-treemap-container");
      if (treemapContainer) {
        treemapContainer.innerHTML = data.treemap.map(t => `
          <div style="background: #F8FAFC; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.85rem; margin-block-end: 0.75rem;">
            <div style="display: flex; justify-content: space-between; font-weight: 700; color: var(--primary-navy); margin-block-end: 0.5rem;">
              <span>📁 ${t.name}</span>
              <span style="color: var(--accent-teal);">₹${t.value.toLocaleString('en-IN')} Profit</span>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              ${t.children.map(c => `
                <span class="tag-badge" style="background: rgba(31, 56, 100, 0.08); color: var(--primary-navy); font-weight: 600;">
                  ${c.name}: ₹${c.value.toLocaleString('en-IN')}
                </span>
              `).join("")}
            </div>
          </div>
        `).join("");
      }

      // Render Matrix Table: Region (rows) x Category (columns), values = Budget Variance
      const matrixHead = document.getElementById("org-matrix-head");
      const matrixBody = document.getElementById("org-matrix-body");
      if (matrixHead && matrixBody) {
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

      // Orders sample table
      const orderBody = document.getElementById("order-table-body");
      if (orderBody) {
        orderBody.innerHTML = data.orders.map(o => `
          <tr>
            <td><strong>${o.order_id}</strong></td>
            <td>${o.order_date}</td>
            <td><span class="tag-badge tag-mode">${o.department}</span></td>
            <td>${o.region}</td>
            <td>${o.category}</td>
            <td>₹${o.sales.toLocaleString('en-IN')}</td>
            <td>₹${o.cost.toLocaleString('en-IN')}</td>
            <td style="color: ${o.profit >= 0 ? 'var(--accent-teal)' : 'var(--danger-crimson)'}; font-weight: 600;">₹${o.profit.toLocaleString('en-IN')}</td>
            <td>
              <button class="btn btn-outline btn-sm" onclick="App.deleteOrder(${o.id})">🗑️</button>
            </td>
          </tr>
        `).join("");
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

      // Populate KPIs
      document.getElementById("state-kpi-revenue").textContent = `₹${(data.kpis.total_state_revenue/1e5).toFixed(1)} Lakh Cr`;
      document.getElementById("state-kpi-expenditure").textContent = `₹${(data.kpis.total_state_expenditure/1e5).toFixed(1)} Lakh Cr`;
      
      const defEl = document.getElementById("state-kpi-deficit");
      defEl.textContent = `₹${(data.kpis.fiscal_deficit/1e5).toFixed(1)} Lakh Cr`;
      defEl.closest(".kpi-card").className = `kpi-card ${data.kpis.fiscal_deficit >= 0 ? 'kpi-positive' : 'kpi-negative'}`;

      document.getElementById("state-kpi-debt-ratio").textContent = `${data.kpis.debt_to_revenue_pct}%`;
      document.getElementById("state-kpi-union-alloc").textContent = `₹${Number(data.kpis.total_national_allocation).toLocaleString('en-IN')} Cr`;

      // Render State Interactive Map / Chips
      const mapContainer = document.getElementById("state-map-chips");
      if (mapContainer) {
        mapContainer.innerHTML = data.state_map_data.map(s => `
          <div class="state-chip" onclick="alert('${s.state}\\nRevenue: ₹${s.revenue.toLocaleString()} Cr\\nExpenditure: ₹${s.expenditure.toLocaleString()} Cr\\nFiscal Deficit: ₹${s.fiscal_deficit.toLocaleString()} Cr\\nDebt Ratio: ${s.debt_ratio}%')">
            <div class="state-chip-header">📍 ${s.state}</div>
            <div class="state-chip-row">
              <span>Revenue:</span>
              <span class="state-chip-val">₹${(s.revenue/1000).toFixed(1)}K Cr</span>
            </div>
            <div class="state-chip-row">
              <span>Deficit:</span>
              <span class="state-chip-val" style="color: ${s.fiscal_deficit < 0 ? 'var(--danger-crimson)' : 'var(--accent-teal)'};">
                ₹${(s.fiscal_deficit/1000).toFixed(1)}K Cr
              </span>
            </div>
            <div class="state-chip-row">
              <span>Debt Ratio:</span>
              <span class="state-chip-val">${s.debt_ratio}%</span>
            </div>
          </div>
        `).join("");
      }

      // Visuals
      ChartEngine.renderStateLine("chart-state-line", data.state_line_chart);
      ChartEngine.renderNationalSectorBar("chart-national-sector", data.national_bar_chart);
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
    // 3 Side-by-Side Forecasts with 95% Confidence Bounds
    // 1. Individual Monthly Expense Forecast
    ChartEngine.renderForecastChart(
      "chart-forecast-ind",
      data.individual_forecast,
      "Personal Monthly Outlay (₹)",
      { main: "#1F3864", forecast: "#C77F16", band: "rgba(199, 127, 22, 0.15)" }
    );

    // 2. Organization Quarterly Revenue Forecast
    ChartEngine.renderForecastChart(
      "chart-forecast-org",
      data.organization_forecast,
      "Enterprise Quarterly Revenue (₹)",
      { main: "#1F3864", forecast: "#2E7D74", band: "rgba(46, 125, 116, 0.15)" }
    );

    // 3. State Longitudinal Expenditure Forecast
    ChartEngine.renderForecastChart(
      "chart-forecast-state",
      data.state_forecast,
      "State Public Expenditure (₹)",
      { main: "#1F3864", forecast: "#DC2626", band: "rgba(220, 38, 38, 0.15)" }
    );

    // Update Next-Period Projected KPI cards
    document.getElementById("proj-kpi-ind").textContent = `₹${Number(data.individual_forecast.projected_next_month).toLocaleString('en-IN')}`;
    document.getElementById("proj-kpi-org").textContent = `₹${Number(data.organization_forecast.projected_next_quarter).toLocaleString('en-IN')}`;
    document.getElementById("proj-kpi-state").textContent = `₹${Number(data.state_forecast.projected_next_year).toLocaleString('en-IN')}`;

    // Faculty Decision Takeaway Box
    const takeawayEl = document.getElementById("forecast-takeaway-text");
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
