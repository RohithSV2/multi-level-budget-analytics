// ==============================================================================
// MULTI-LEVEL BUDGET TRACKER ANALYTICS — BESPOKE FINTECH CHART ENGINE
// Powered by Chart.js with Cyber-Fintech Neon Dark Theme Palette
// Colors: Emerald (#10B981), Cyan (#06B6D4), Indigo (#6366F1), Amber (#F59E0B), Rose (#F43F5E)
// ==============================================================================

// Set Global Chart.js Defaults for Dark Obsidian Theme
if (typeof Chart !== "undefined") {
  Chart.defaults.color = "#94A3B8";
  Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.plugins.tooltip.backgroundColor = "rgba(13, 19, 31, 0.95)";
  Chart.defaults.plugins.tooltip.titleColor = "#FFFFFF";
  Chart.defaults.plugins.tooltip.bodyColor = "#CBD5E1";
  Chart.defaults.plugins.tooltip.borderColor = "rgba(255, 255, 255, 0.15)";
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.plugins.legend.labels.color = "#CBD5E1";
}

const ChartEngine = {
  instances: {},

  destroyChart(id) {
    if (this.instances[id]) {
      this.instances[id].destroy();
      delete this.instances[id];
    }
  },

  getCtx(canvasId) {
    const el = document.getElementById(canvasId);
    if (!el) return null;
    return el.getContext("2d");
  },

  // ----------------------------------------------------------------------------
  // PAGE 1: EXECUTIVE COMBO CHART
  // ----------------------------------------------------------------------------
  renderExecutiveCombo(canvasId, comboData) {
    this.destroyChart(canvasId);
    const ctx = this.getCtx(canvasId);
    if (!ctx || !comboData) return;

    // Enhance datasets with modern neon strokes
    const styledDatasets = (comboData.datasets || []).map((ds, i) => {
      const colors = ["#10B981", "#F43F5E", "#06B6D4", "#6366F1"];
      const bgColors = ["rgba(16, 185, 129, 0.2)", "rgba(244, 63, 94, 0.2)", "rgba(6, 182, 212, 0.2)", "rgba(99, 102, 241, 0.2)"];
      return {
        ...ds,
        borderColor: colors[i % colors.length],
        backgroundColor: ds.type === 'line' ? bgColors[i % bgColors.length] : colors[i % colors.length],
        borderWidth: 2.5,
        borderRadius: 6
      };
    });

    this.instances[canvasId] = new Chart(ctx, {
      data: {
        labels: comboData.labels,
        datasets: styledDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "top", labels: { boxWidth: 14, font: { weight: "600" } } },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ₹${Number(context.raw).toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: { 
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "#94A3B8" }
          },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94A3B8",
              callback: (val) => "₹" + (val >= 1e7 ? (val / 1e7).toFixed(1) + " Cr" : (val >= 1e5 ? (val / 1e5).toFixed(1) + " L" : val.toLocaleString('en-IN')))
            }
          }
        }
      }
    });
  },

  // ----------------------------------------------------------------------------
  // PAGE 2: INDIVIDUAL CHARTS
  // ----------------------------------------------------------------------------
  renderIndividualDonut(canvasId, donutData) {
    this.destroyChart(canvasId);
    const ctx = this.getCtx(canvasId);
    if (!ctx || !donutData) return;

    const neonPalette = [
      "#10B981", "#06B6D4", "#6366F1", "#F59E0B", "#F43F5E",
      "#8B5CF6", "#38BDF8", "#34D399", "#EC4899", "#F97316"
    ];

    this.instances[canvasId] = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: donutData.labels,
        datasets: [{
          data: donutData.data,
          backgroundColor: neonPalette.slice(0, donutData.labels.length),
          borderWidth: 3,
          borderColor: "#0D131F"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            position: "right", 
            labels: { 
              boxWidth: 12, 
              color: "#CBD5E1", 
              font: { size: 11, weight: "600" } 
            } 
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ₹${Number(ctx.raw).toLocaleString('en-IN')}`
            }
          }
        },
        cutout: "68%"
      }
    });
  },

  renderIndividualLine(canvasId, lineData) {
    this.destroyChart(canvasId);
    const ctx = this.getCtx(canvasId);
    if (!ctx || !lineData) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels: lineData.labels,
        datasets: [
          {
            label: "Actual Total Expense",
            data: lineData.actual_expense,
            borderColor: "#06B6D4",
            backgroundColor: "rgba(6, 182, 212, 0.12)",
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: "#06B6D4"
          },
          {
            label: "Monthly Budget Limit",
            data: lineData.budget_limit,
            borderColor: "#F59E0B",
            borderDash: [5, 5],
            fill: false,
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#CBD5E1" } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94A3B8" } },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94A3B8",
              callback: (val) => "₹" + Number(val).toLocaleString('en-IN')
            }
          }
        }
      }
    });
  },

  renderIndividualVarianceBar(canvasId, barData) {
    this.destroyChart(canvasId);
    const ctx = this.getCtx(canvasId);
    if (!ctx || !barData) return;

    // Use neon emerald for favorable (negative or positive variance depending on logic), rose for overspend
    const colors = barData.variance.map(v => v >= 0 ? "#10B981" : "#F43F5E");

    this.instances[canvasId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: barData.categories,
        datasets: [{
          label: "Budget Variance (₹)",
          data: barData.variance,
          backgroundColor: colors,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Variance: ₹${Number(ctx.raw).toLocaleString('en-IN')} (${barData.flags[ctx.dataIndex]})`
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94A3B8",
              callback: (val) => "₹" + Number(val).toLocaleString('en-IN')
            }
          },
          y: {
            grid: { display: false },
            ticks: { color: "#CBD5E1", font: { weight: "600" } }
          }
        }
      }
    });
  },

  // ----------------------------------------------------------------------------
  // PAGE 3: ORGANIZATION CHARTS
  // ----------------------------------------------------------------------------
  renderOrgClusteredBar(canvasId, clusteredData) {
    this.destroyChart(canvasId);
    const ctx = this.getCtx(canvasId);
    if (!ctx || !clusteredData) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: clusteredData.departments,
        datasets: [
          {
            label: "Department Revenue (Sales)",
            data: clusteredData.revenue,
            backgroundColor: "#06B6D4",
            borderRadius: 6
          },
          {
            label: "Operating Cost",
            data: clusteredData.cost,
            backgroundColor: "#6366F1",
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#CBD5E1" } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#CBD5E1", font: { weight: "600" } } },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94A3B8",
              callback: (val) => "₹" + (val >= 1e7 ? (val / 1e7).toFixed(1) + " Cr" : (val >= 1e5 ? (val / 1e5).toFixed(1) + " L" : val.toLocaleString('en-IN')))
            }
          }
        }
      }
    });
  },

  renderOrgGrowthLine(canvasId, growthData) {
    this.destroyChart(canvasId);
    const ctx = this.getCtx(canvasId);
    if (!ctx || !growthData) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels: growthData.labels,
        datasets: [
          {
            label: "Quarterly Revenue Growth %",
            data: growthData.growth_pct,
            borderColor: "#10B981",
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 5,
            pointBackgroundColor: "#10B981"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#CBD5E1" } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Growth: ${Number(ctx.raw).toFixed(2)}%`
            }
          }
        },
        scales: {
          x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94A3B8" } },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94A3B8",
              callback: (val) => `${val}%`
            }
          }
        }
      }
    });
  },

  // ----------------------------------------------------------------------------
  // PAGE 4: STATE / NATION CHARTS
  // ----------------------------------------------------------------------------
  renderStateLine(canvasId, stateLineData) {
    this.destroyChart(canvasId);
    const ctx = this.getCtx(canvasId);
    if (!ctx || !stateLineData) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels: stateLineData.years,
        datasets: [
          {
            label: "State Revenue Receipts",
            data: stateLineData.revenue,
            borderColor: "#06B6D4",
            backgroundColor: "rgba(6, 182, 212, 0.12)",
            fill: true,
            tension: 0.3,
            borderWidth: 2.5,
            pointRadius: 4
          },
          {
            label: "State Expenditures",
            data: stateLineData.expenditure,
            borderColor: "#F43F5E",
            backgroundColor: "rgba(244, 63, 94, 0.12)",
            fill: true,
            tension: 0.3,
            borderWidth: 2.5,
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#CBD5E1" } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94A3B8" } },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94A3B8",
              callback: (val) => "₹" + (val >= 1e7 ? (val / 1e7).toFixed(1) + " Cr" : (val >= 1e5 ? (val / 1e5).toFixed(1) + " L" : val.toLocaleString('en-IN')))
            }
          }
        }
      }
    });
  },

  renderNationalSectorBar(canvasId, nationalData) {
    this.destroyChart(canvasId);
    const ctx = this.getCtx(canvasId);
    if (!ctx || !nationalData) return;

    this.instances[canvasId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: nationalData.sectors,
        datasets: [{
          label: "National Sector Allocation (₹ Cr)",
          data: nationalData.allocation,
          backgroundColor: "#6366F1",
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Allocation: ₹${Number(ctx.raw).toLocaleString('en-IN')} Cr (${nationalData.share_pct[ctx.dataIndex]}% share)`
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94A3B8",
              callback: (val) => "₹" + Number(val).toLocaleString('en-IN') + " Cr"
            }
          },
          y: {
            grid: { display: false },
            ticks: { color: "#CBD5E1", font: { weight: "600" } }
          }
        }
      }
    });
  },

  // ----------------------------------------------------------------------------
  // PAGE 5: PREDICTIVE CHARTS WITH 95% CONFIDENCE BANDS
  // ----------------------------------------------------------------------------
  renderForecastChart(canvasId, forecastObj, titleLabel, colorTheme) {
    this.destroyChart(canvasId);
    const ctx = this.getCtx(canvasId);
    if (!ctx || !forecastObj) return;

    const allLabels = [...forecastObj.history_labels, ...forecastObj.forecast_labels];
    const histLen = forecastObj.history_labels.length;
    
    // Historical line: padded with nulls for future periods
    const histLine = [...forecastObj.history_values, ...Array(forecastObj.forecast_labels.length).fill(null)];
    
    // Forecast line: connects from the last historical point
    const forecastLine = Array(histLen - 1).fill(null);
    forecastLine.push(forecastObj.history_values[histLen - 1]);
    forecastLine.push(...forecastObj.forecast_values);

    // Upper and Lower confidence bounds
    const upperLine = Array(histLen - 1).fill(null);
    upperLine.push(forecastObj.history_values[histLen - 1]);
    upperLine.push(...forecastObj.upper_bound);

    const lowerLine = Array(histLen - 1).fill(null);
    lowerLine.push(forecastObj.history_values[histLen - 1]);
    lowerLine.push(...forecastObj.lower_bound);

    const themeColors = colorTheme || { main: "#06B6D4", forecast: "#10B981", band: "rgba(16, 185, 129, 0.15)" };

    this.instances[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels: allLabels,
        datasets: [
          {
            label: "Historical Actuals",
            data: histLine,
            borderColor: themeColors.main,
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: themeColors.main
          },
          {
            label: "Forecast Trajectory",
            data: forecastLine,
            borderColor: themeColors.forecast,
            borderDash: [5, 5],
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: themeColors.forecast
          },
          {
            label: "95% Upper Bound",
            data: upperLine,
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 1,
            pointRadius: 0,
            fill: "+1",
            backgroundColor: themeColors.band
          },
          {
            label: "95% Lower Bound",
            data: lowerLine,
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 1,
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#CBD5E1" } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString('en-IN')}`
            }
          }
        },
        scales: {
          x: { grid: { color: "rgba(255, 255, 255, 0.05)" }, ticks: { color: "#94A3B8" } },
          y: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: {
              color: "#94A3B8",
              callback: (val) => "₹" + (val >= 1e7 ? (val / 1e7).toFixed(1) + " Cr" : (val >= 1e5 ? (val / 1e5).toFixed(1) + " L" : val.toLocaleString('en-IN')))
            }
          }
        }
      }
    });
  }
};
