"use client";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

/* =========================
   HELPERS
========================= */

function formatEuro(
  value: number
) {
  return (
    value.toFixed(0) + " €"
  );
}

/* =========================
   COMPONENT
========================= */

export default function RevenueChart({
  labels,
  revenue,
  orders,
}: {
  labels: string[];
  revenue: number[];
  orders: number[];
}) {
  const data = {
    labels,

    datasets: [
      {
        label:
          "Chiffre d’affaires",

        data: revenue,

        borderColor:
          "#b7791f",

        backgroundColor:
          "rgba(183,121,31,0.12)",

        fill: true,

        tension: 0.42,

        pointRadius: 0,

        pointHoverRadius: 7,

        pointHoverBackgroundColor:
          "#b7791f",

        pointHoverBorderWidth: 3,

        pointHoverBorderColor:
          "#fff",

        borderWidth: 3,
      },

      {
        label: "Commandes",

        data: orders,

        borderColor:
          "#2563eb",

        backgroundColor:
          "rgba(37,99,235,0.08)",

        fill: true,

        tension: 0.42,

        pointRadius: 0,

        pointHoverRadius: 6,

        pointHoverBackgroundColor:
          "#2563eb",

        pointHoverBorderColor:
          "#fff",

        pointHoverBorderWidth: 3,

        borderWidth: 2,

        yAxisID: "y1",
      },
    ],
  };

  const options: any = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        position: "top",

        align: "start",

        labels: {
          usePointStyle: true,

          pointStyle: "circle",

          padding: 22,

          color: "#444",

          font: {
            size: 13,
            weight: 700,
          },
        },
      },

      tooltip: {
        backgroundColor:
          "#111",

        titleColor: "#fff",

        bodyColor: "#fff",

        borderColor:
          "rgba(255,255,255,0.08)",

        borderWidth: 1,

        padding: 14,

        displayColors: true,

        callbacks: {
          label: (
            context: any
          ) => {
            if (
              context.dataset.label.includes(
                "Chiffre"
              )
            ) {
              return `CA : ${formatEuro(
                context.raw
              )}`;
            }

            return `Commandes : ${context.raw}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#777",

          font: {
            size: 11,
            weight: 600,
          },
        },
      },

      y: {
        beginAtZero: true,

        border: {
          display: false,
        },

        grid: {
          color:
            "rgba(0,0,0,0.05)",
        },

        ticks: {
          color: "#777",

          callback: (
            value: any
          ) =>
            formatEuro(
              Number(value)
            ),

          font: {
            size: 11,
          },
        },
      },

      y1: {
        beginAtZero: true,

        position: "right",

        border: {
          display: false,
        },

        grid: {
          drawOnChartArea: false,
        },

        ticks: {
          color: "#2563eb",

          font: {
            size: 11,
            weight: 700,
          },
        },
      },
    },

    animation: {
      duration: 1200,

      easing:
        "easeOutQuart",
    },
  };

  return (
    <div style={container}>
      <div style={header}>
        <div>
          <p style={eyebrow}>
            ANALYTICS
          </p>

          <h3 style={title}>
            Performance business
          </h3>
        </div>

        <div style={liveBadge}>
          ● Live data
        </div>
      </div>

      <div style={chartWrapper}>
        <Line
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const container: React.CSSProperties =
  {
    background:
      "linear-gradient(180deg,#ffffff,#fcfaf7)",

    border:
      "1px solid rgba(0,0,0,0.05)",

    borderRadius: 28,

    padding: 24,

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.05)",
  };

const header: React.CSSProperties =
  {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 26,

    gap: 20,

    flexWrap: "wrap",
  };

const eyebrow: React.CSSProperties =
  {
    margin: 0,

    color: "#b7791f",

    fontSize: 11,

    fontWeight: 800,

    letterSpacing: "0.12em",
  };

const title: React.CSSProperties =
  {
    marginTop: 8,

    marginBottom: 0,

    fontSize: 24,

    fontWeight: 800,

    color: "#111",
  };

const liveBadge: React.CSSProperties =
  {
    background:
      "rgba(34,197,94,0.08)",

    color: "#16a34a",

    padding:
      "10px 16px",

    borderRadius: 999,

    fontSize: 12,

    fontWeight: 800,
  };

const chartWrapper: React.CSSProperties =
  {
    height: 380,
  };