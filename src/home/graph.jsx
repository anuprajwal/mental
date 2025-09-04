import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

const emotionScale = {
  angry: 1,
  sad: 2,
  low: 3,
  "not specific": 4,
  happy: 5,
  hyped: 6,
};

const emotionColors = {
  angry: "#FF4C4C",
  sad: "#4A90E2",
  low: "#9B59B6",
  "not specific": "#95A5A6",
  happy: "#FFD93D",
  hyped: "#2ECC71",
};

const emotionEmojis = {
  angry: "😡",
  sad: "😢",
  low: "😞",
  "not specific": "😐",
  happy: "😊",
  hyped: "⚡",
};



const MoodGraph = ({ moods }) => {
    // Transform moods into chart-friendly data
    const chartData = moods.map((m) => {
      const emotionKey = m.emotion.toLowerCase(); // normalize to lowercase
      return {
        date: m.date,
        emotionValue: emotionScale[emotionKey],
        emotion: emotionKey,
      };
    });
  
    return (
      <div className="p-4 bg-white shadow rounded-2xl">
        <h2 className="text-lg font-bold mb-2">Mood Tracker (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis
              domain={[1, 6]}
              ticks={[1, 2, 3, 4, 5, 6]}
              tickFormatter={(value) =>
                Object.keys(emotionScale).find(
                  (key) => emotionScale[key] === value
                )
              }
            />
            <Tooltip
              formatter={(value, name, props) =>
                `${emotionEmojis[props.payload.emotion]} ${props.payload.emotion}`
              }
            />
            <Line
                type="monotone"
                dataKey="emotionValue"
                stroke="#8884d8"
                strokeWidth={2}
                dot={({ cx, cy, payload }) => (
                    <text
                    x={cx}
                    y={cy}
                    dy={5}s
                    textAnchor="middle"
                    fontSize={20}
                    fill={emotionColors[payload.emotion]} // 👈 use your color mapping here
                    >
                    {emotionEmojis[payload.emotion]} {/* 👈 emoji instead of a dot */}
                    </text>
                )}
            />


<Line
  type="monotone"
  dataKey="emotionValue"
  stroke="#8884d8"
  strokeWidth={2}
  dot={({ cx, cy, payload }) => (
    <text
      x={cx}
      y={cy}
      dy={5}
      textAnchor="middle"
      fontSize={20}
      fill={emotionColors[payload.emotion]} // color emoji
    >
      {emotionEmojis[payload.emotion]}
    </text>
  )}
/>

          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  

  export default MoodGraph;
