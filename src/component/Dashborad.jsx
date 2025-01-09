import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { IoMdArrowUp } from "react-icons/io";
import user from "../assets/user.svg";
import dollar from "../assets/mdi_dollar.svg";
import { FaEuroSign } from "react-icons/fa6";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import CircularProgressBar from "./CircularProgressBar";
import GradientLineChart from "./GradientLineChart";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = ({ data, barChartData }) => {
  const currentYear = new Date().getFullYear();

  // Initialize with the most recent year's data
  const [selectYear, setSelectYear] = useState(currentYear);
  const [selectLineBarYear, setSelectLineBarYear] = useState(new Date().getFullYear())
  const [barAmountData, setBarAmountData] = useState([]);

  useEffect(() => {
    if (selectYear) {
      const filteredYearData = barChartData.find(
        (item) => item.year === parseInt(selectYear)
      );
      setBarAmountData(filteredYearData?.data || []);
    }
  }, [barChartData, selectYear]);

  // Data for Bar Chart
  const barData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Profit",
        data: barAmountData,
        backgroundColor: "#FFD700",
      },
    ],
  };

  // Options for Bar Chart
  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#FFDC58" },
      },
      y: {
        grid: { color: "#E5E7EB" },
        ticks: { color: "#FFDC58", callback: (value) => `${value}€` },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const year_revenue = useMemo(() => {
    return barAmountData.reduce((total, amount) => total + amount, 0);
  }, [barAmountData]);

  return (
    <div>
      {/* Top Stats Section */}
      <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 mb-8">
        <div className="p-4 rounded-lg shadow-md flex items-center justify-between bg-cover border border-[#FFDC58] bg-image-clip">
          <div>
            <h2 className="text-[16px] font-bold">Total Revenue</h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-medium">{data?.total_revenue}</p>
              <p className="text-green-500 text-sm mt-1">+11.01% ↑</p>
            </div>
          </div>
          <div>
           <FaEuroSign size={40}/>
          </div>
        </div>
        <div className="p-4 rounded-lg shadow-md flex items-center justify-between bg-cover border border-[#FFDC58] bg-image-clip">
          <div>
            <h2 className="text-[16px] font-bold">Total Free User</h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-medium">{data?.free_user}</p>
              <p className="text-green-500 text-sm mt-1">+11.01% ↑</p>
            </div>
          </div>
          <div>
            <img src={user} alt="" />
          </div>
        </div>
        <div className="p-4 rounded-lg shadow-md flex items-center justify-between bg-cover border border-[#FFDC58] bg-image-clip">
          <div>
            <h2 className="text-[16px] font-bold">Total Pro User</h2>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-2xl font-medium">{data?.pro_user}</p>
              <p className="text-green-500 text-sm mt-1">+11.01% ↑</p>
            </div>
          </div>
          <div>
            <img src={user} alt="" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-[#FFDC58]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold">Total Revenue</h2>
              <div className="flex gap-3 items-center">
                <h2 className="text-[24px] flex items-center ">{year_revenue} <FaEuroSign size={20}/></h2>
                <div className="flex items-center   ">
                  <IoMdArrowUp size={20} className="text-[#4CE13F]" />
                  <span className="text-[#4CE13F] lg:block hidden">
                    15% than last month
                  </span>
                </div>
              </div>
            </div>
            <select
              className="p-2 border rounded-md"
              onChange={(e) => setSelectYear(e.target.value)}
            >
              {barChartData?.reverse().map((item, index) => (
                <option key={index} value={item.year}>
                  {item.year}
                </option>
              ))}
            </select>
          </div>
          <div className="h-96">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-300 w-full ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Total User</h2>
            <select className="p-2 border rounded-md text-sm text-gray-600" value={selectLineBarYear} onChange={(e) => setSelectLineBarYear(e.target.value)}>
            {barChartData?.reverse().map((item, index) => (
                <option key={index} value={item.year}>
                  {item.year}
                </option>
              ))}
            </select>
          </div>
          <div className="h-96">
            <GradientLineChart currentYear={selectLineBarYear}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
