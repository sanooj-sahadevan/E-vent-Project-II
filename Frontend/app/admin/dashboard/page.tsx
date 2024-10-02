
"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/Admin/layout";
import Topbar from "@/components/Admin/topBar";
import { fetchingAllData } from  "@/services/adminAPI";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState({
    totalEvents: 0,
    totalRevenue: 0,
    totalVendors: 0,
    totalUsers: 0,
    revenueLastTwoWeeks: [],
    reportStats: {
      pending: 0,
      resolved: 0,
      dismissed: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("No token found");
        const response = await fetchingAllData(token);
        console.log(response);

        setDashboardData(response);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: ["Total Events", "Total vendors", "Total Users"],
    datasets: [
      {
        label: "Metrics",
        data: [
          dashboardData.totalEvents,
          dashboardData.totalVendors,
          dashboardData.totalUsers,
        ],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107", "#F44336"],
        borderColor: ["#388E3C", "#1976D2", "#FFA000", "#D32F2F"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Dashboard Metrics Overview",
      },
    },
  };

  const revenueData = {
    labels: [
      "Day 1", "Day 2", "Day 3", "Day 4", "Day 5",
      "Day 6", "Day 7", "Day 8", "Day 9", "Day 10",
      "Day 11", "Day 12", "Day 13", "Day 14",
    ],
    datasets: [
      {
        label: "Revenue",
        data: dashboardData.revenueLastTwoWeeks,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Total Revenue Over the Last Two Weeks",
      },
    },
  };

  // const reportData = {
  //   labels: ["Pending", "Resolved", "Dismissed"],
  //   datasets: [
  //     {
  //       label: "Report Status",
  //       data: [
  //         dashboardData.reportStats.pending,
  //         dashboardData.reportStats.resolved,
  //         dashboardData.reportStats.dismissed,
  //       ],
  //       backgroundColor: ["#FFC107", "#4CAF50", "#F44336"],
  //       borderColor: ["#FFA000", "#388E3C", "#D32F2F"],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const reportOptions = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: "top" as const,
  //     },
  //     title: {
  //       display: true,
  //       text: "Report Management",
  //     },
  //   },
  // };

  return (
    <Layout>
      <Topbar />
      <h1 className="text-3xl font-semibold mt-5 mb-8">Dashboard</h1>
      {/* Dashboard content */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold">Total Trips</h3>
          <p className="text-2xl font-bold">{dashboardData.totalEvents}</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold">${dashboardData.totalRevenue}</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold">Total Companies</h3>
          <p className="text-2xl font-bold">{dashboardData.totalVendors}</p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">{dashboardData.totalUsers}</p>
        </div>
      </div>
      <div className="mb-8 flex flex-row justify-between">
        <div className="w-1/2 pr-2">
          <Line data={revenueData} options={revenueOptions}  />
        </div>
        <div className="w-1/2 pl-2">
          <Bar data={data} options={options} />
        </div>
      </div>
      {/* <div className="mb-4">
        <Bar data={reportData} options={reportOptions}  />
      </div> */}
    </Layout>
  );
};

export default Dashboard;
