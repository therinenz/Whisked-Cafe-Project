import { BarChart4, Flower } from "lucide-react";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    date: "Nov. 1",
    lastMonth: 4500,
    currentMonth: 8500,
  },
  {
    date: "Nov. 7",
    lastMonth: 4000,
    currentMonth: 7000,
  },
  {
    date: "Nov. 14",
    lastMonth: 8000,
    currentMonth: 5000,
  },
  {
    date: "Nov. 21",
    lastMonth: 9500,
    currentMonth: 7500,
  },
  {
    date: "Nov. 28",
    lastMonth: 4000,
    currentMonth: 10000,
  },
  {
    date: "Nov. 30",
    lastMonth: 2000,
    currentMonth: 9000,
  },
];

const SalesAnalytics = () => {
  return (
    <div className="bg-white pr-6 pb-0 pt-4 rounded-lg shadow">
      <h2 className="text-base font-bold mb-4 flex items-center">
        <span className="w-5 h-5 mr-12"><BarChart4 className="h-5 w-5 ml-10"/> </span> Sales Analytics
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
            formatter={(value) => `₱${value}`}
          />
          <Legend
            wrapperStyle={{
              fontSize: "14px", // Adjust font size here
              fontWeight: "lighter", // Make it lighter
              color: "#704214", // Adjust text color
            }}
          />
          <Bar
            dataKey="lastMonth"
            name="Last Month"
            fill="rgb(198, 155, 123)"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
          <Bar
            dataKey="currentMonth"
            name="Current Month"
            fill="rgb(139, 69, 19)"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesAnalytics;
