import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import axiosInstance from "./axiosInstance";


const GradientLineChart = ({currentYear}) => {
  const [lineChartData, setLineChartData] = useState([]);

  const [currentYearData, setCurrentYearData] = useState([]);

  useEffect(() => {
    // Get the current year
   

    // Check if data for the current year exists
    if (lineChartData[currentYear]) {
      setCurrentYearData(lineChartData[currentYear]);
    } else {
      setCurrentYearData([]); // Fallback if no data for the current year
    }
  }, [currentYear, lineChartData]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const response = await axiosInstance.get("/yearly_user_data_view/");
        setLineChartData(response.data);
        console.log("line chart", response.data);
      } catch (error) {
        console.error("Error fetching subscriptions data:", error);
      }
    };
    fetchBarChartData();
  }, []);

  // 

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={currentYearData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFD700" stopOpacity={1} />
              <stop offset="100%" stopColor="#FFDC58" stopOpacity={1} />
            </linearGradient>
          </defs>

          {/* XAxis with custom font size and color */}
          <XAxis
            dataKey="name"
            tick={{
              fill: "#FFDC58", // Text color for X-axis
              fontSize: 12, // Smaller font size
            }}
          />

          {/* YAxis with custom font size and color */}
          <YAxis
            tickFormatter={(value) => `${value}k`}
            tick={{
              fill: "#FFDC58", // Text color for Y-axis
              fontSize: 12, // Smaller font size
            }}
          />

          {/* Tooltip with custom font size and color */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF", // Tooltip background
              borderColor: "#FFD700", // Tooltip border color
            }}
            itemStyle={{
              color: "#FFDC58", // Tooltip text color
              fontSize: 12, // Smaller font size
            }}
            labelStyle={{
              color: "#FFDC58", // Tooltip label color
              fontSize: 12, // Smaller font size
            }}
          />

          {/* Area Chart with gradient */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#FFD700"
            fill="url(#colorValue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GradientLineChart;
