import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js";

function ExpenseChart() {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("your-api-url");
      const data = response.data;

      const chartData = {
        labels: data.map((item) => item.date),
        datasets: [
          {
            label: "Income",
            data: data.map((item) => item.income),
            borderColor: "green",
            fill: false,
          },
          {
            label: "Expenses",
            data: data.map((item) => item.expenses),
            borderColor: "red",
            fill: false,
          },
        ],
      };

      setChartData(chartData);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById("expense-chart");

    new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10,
              },
            },
          ],
        },
      },
    });
  }, [chartData]);

  return <canvas id="expense-chart"></canvas>;
}

export default ExpenseChart;
