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
