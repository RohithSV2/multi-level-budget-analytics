// ==============================================================================
// MULTI-LEVEL BUDGET TRACKER ANALYTICS — CHARTS & VISUALIZATIONS ENGINE
// Powered by Chart.js with Power BI Theme Palette
// Primary: #1F3864, Accent: #C77F16, Teal: #2E7D74, Red: #DC2626
// ==============================================================================

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

    this.instances[canvasId] = new Chart(ctx, {
      data: {
        labels: comboData.labels,
        datasets: comboData.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { position: "top", labels: { boxWidth: 14, font: { family: "Segoe UI", weight: "600" } } },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ₹${Number(context.raw).toLocaleString()}`
            }
          }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            ticks: {
              callback: (val) => "₹" + (val >= 1e7 ? (val / 1e7).toFixed(1) + " Cr" : (val >= 1e5 ? (val / 1e5).toFixed(1) + " L" : val.toLocaleString()))
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

    const colors = [
      "#1F3864", "#C77F16", "#2E7D74", "#2563EB", "#D97706",
      "#0D9488", "#4F46E5", "#DC2626", "#8B5CF6", "#059669"
    ];

    this.instances[canvasId] = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: donutData.labels,
        datasets: [{
          data: donutData.data,
          backgroundColor: colors.slice(0, donutData.labels.length),
          borderWidth: 2,
          borderColor: "#FFFFFF"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { boxWidth: 12, font: { family: "Segoe UI", size: 11 } } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: ₹${Number(ctx.raw).toLocaleString()}`
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
            borderColor: "#1F3864",
            backgroundColor: "rgba(31, 56, 100, 0.08)",
            fill: true,
            tension: 0.25,
            borderWidth: 2.5,
            pointRadius: 3
          },
          {
            label: "Total Planned Budget Threshold",
            data: lineData.planned_budget,
            borderColor: "#C77F16",
            borderDash: [6, 6],
            borderWidth: 2,
            fill: false,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { boxWidth: 14 } },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (val) => "₹" + (val >= 1e5 ? (val / 1e5).toFixed(1) + " L" : val.toLocaleString())
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

    this.instances[canvasId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: barData.categories,
        datasets: [{
          label: "Budget Variance (₹)",
          data: barData.variance,
          backgroundColor: barData.colors,
          borderRadius: 4
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
              label: (ctx) => ` Variance: ₹${Number(ctx.raw).toLocaleString()} (${barData.flags[ctx.dataIndex]})`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              callback: (val) => "₹" + Number(val).toLocaleString()
            }
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
            label: "Total Revenue (Org)",
            data: clusteredData.revenue,
            backgroundColor: "#1F3864",
            borderRadius: 4
          },
          {
            label: "Total Cost (Org)",
            data: clusteredData.cost,
            backgroundColor: "#C77F16",
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (val) => "₹" + (val >= 1e7 ? (val / 1e7).toFixed(1) + " Cr" : (val / 1e5).toFixed(1) + " L")
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
            borderColor: "#2E7D74",
            backgroundColor: "rgba(46, 125, 116, 0.15)",
            borderWidth: 2.5,
            fill: true,
            tension: 0.3,
            pointRadius: 4,
            pointBackgroundColor: "#2E7D74"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: (ctx) => ` Growth: ${Number(ctx.raw).toFixed(2)}%`
            }
          }
        },
        scales: {
          y: {
            ticks: {
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
            label: "Total State Revenue",
            data: stateLineData.revenue,
            borderColor: "#2E7D74",
            backgroundColor: "rgba(46, 125, 116, 0.1)",
            fill: true,
            tension: 0.25,
            borderWidth: 2.5
          },
          {
            label: "Total State Expenditure",
            data: stateLineData.expenditure,
            borderColor: "#DC2626",
            backgroundColor: "rgba(220, 38, 38, 0.1)",
            fill: true,
            tension: 0.25,
            borderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (val) => "₹" + (val >= 1e7 ? (val / 1e7).toFixed(1) + " Cr" : (val / 1e5).toFixed(1) + " L")
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
          backgroundColor: "#1F3864",
          borderRadius: 4
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
              label: (ctx) => ` Allocation: ₹${Number(ctx.raw).toLocaleString()} Cr (${nationalData.share_pct[ctx.dataIndex]}% share)`
            }
          }
        },
        scales: {
          x: {
            ticks: {
              callback: (val) => "₹" + Number(val).toLocaleString() + " Cr"
            }
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

    this.instances[canvasId] = new Chart(ctx, {
      type: "line",
      data: {
        labels: allLabels,
        datasets: [
          {
            label: "Historical",
            data: histLine,
            borderColor: colorTheme.main,
            borderWidth: 2.5,
            fill: false,
            tension: 0.2
          },
          {
            label: "Forecast Projection",
            data: forecastLine,
            borderColor: colorTheme.forecast,
            borderDash: [5, 5],
            borderWidth: 2.5,
            fill: false,
            tension: 0.2
          },
          {
            label: "95% Upper Bound",
            data: upperLine,
            borderColor: "transparent",
            backgroundColor: colorTheme.band,
            fill: "+1",
            pointRadius: 0
          },
          {
            label: "95% Lower Bound",
            data: lowerLine,
            borderColor: "transparent",
            backgroundColor: "transparent",
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              filter: (item) => item.text === "Historical" || item.text === "Forecast Projection" || item.text === "95% Upper Bound"
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ctx.raw ? ` ${ctx.dataset.label}: ₹${Number(ctx.raw).toLocaleString()}` : ""
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: (val) => "₹" + (val >= 1e7 ? (val / 1e7).toFixed(1) + " Cr" : (val >= 1e5 ? (val / 1e5).toFixed(1) + " L" : val.toLocaleString()))
            }
          }
        }
      }
    });
  }
};
