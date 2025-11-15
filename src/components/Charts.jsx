import React from "react";


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const COLORS = ["#8e44ad", "#f39c12", "#f1c40f", "#2ecc71", "#3498db"];

function computeByCategory(expenses) {
  const map = {};
  for (const e of expenses) {
    const cat = e.category || "Other";
    map[cat] = (map[cat] || 0) + Number(e.price);
  }
  
  const order = ["Entertainment", "Food", "Travel", "Other"];
  const keys = Object.keys(map).sort(
    (a, b) => order.indexOf(a) - order.indexOf(b)
  );
  return keys.map((k, i) => ({
    name: k,
    value: map[k],
    color: COLORS[i % COLORS.length],
  }));
}


const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const value = Math.round(percent * 100);
  if (value === 0) return null;
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontWeight: 800, fontSize: 12 }}
    >
      {`${value}%`}
    </text>
  );
};

export default function Charts({ expenses, small }) {
  const data = computeByCategory(expenses);

  if (small) {
    return (
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            barCategoryGap="40%"
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 14, fill: "#111" }}
            />
            <Bar dataKey="value" barSize={18} radius={[18, 18, 18, 18]}>
              {data.map((entry, idx) => (
                <Cell key={`bar-${idx}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={(v) => `₹${v}`}
              />
            </Bar>
            <Tooltip formatter={(val) => `₹${val}`} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={90}
              innerRadius={34}
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => `₹${val}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="legend-row" style={{ marginTop: 8 }}>
        {data.map((d) => (
          <div key={d.name} className="legend-item">
            <span
              className="legend-swatch"
              style={{ background: d.color }}
            ></span>
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}
