import React from "react";

const CircularProgressBar = ({ percentage , color }) => {
  const radius = 20; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      {/* Background Circle */}
      <svg className="w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="#E5E7EB" // Gray background color
          strokeWidth="10"
        />
      </svg>

      {/* Progress Circle */}
      <svg className="w-full h-full absolute top-0 left-0">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke={color} // Yellow progress color
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Inner Content */}
    
    </div>
  );
};

export default CircularProgressBar;
