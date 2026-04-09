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

function formatEuro(value: number) {
  return value.toFixed(0) + " €";
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
        label: "Chiffre d’affaires (€)",
        data: revenue,
        borderColor: "#a16207",
        backgroundColor: "rgba(161,98,7,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: "Commandes",
        data: orders,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index" as const,
      intersect: false,
    },

    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12,
          },
        },
      },

      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (context.dataset.label.includes("Chiffre")) {
              return `CA: ${formatEuro(context.raw)}`;
            }
            return `Commandes: ${context.raw}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,
        position: "left" as const,
        ticks: {
          callback: (value: any) => formatEuro(value),
        },
      },

      y1: {
        beginAtZero: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div style={container}>
      <Line data={data} options={options} />
    </div>
  );
}

/* =========================
   STYLES
========================= */

const container = {
  height: "320px",
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
};