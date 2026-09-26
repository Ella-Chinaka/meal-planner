import React, { useRef, useState } from "react";
import { formatDateKey } from "../utils/dates";

const W = 640;
const H = 260;
const PAD = { top: 16, right: 20, bottom: 32, left: 44 };

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = Math.ceil(span / count);
  const start = Math.floor(min / step) * step;
  const ticks = [];
  for (let v = start; v <= max + step; v += step) {
    ticks.push(v);
    if (v >= max) break;
  }
  return ticks;
}

// Single-series line chart of weight entries [{ date: "YYYY-MM-DD", weight }], oldest first.
function WeightChart({ entries }) {
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  if (entries.length === 0) return null;

  const weights = entries.map((e) => e.weight);
  const ticks = niceTicks(Math.min(...weights) - 1, Math.max(...weights) + 1);
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];

  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (entries.length === 1 ? plotW / 2 : (i / (entries.length - 1)) * plotW);
  const y = (v) => PAD.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const path = entries.map((e, i) => `${i ? "L" : "M"}${x(i)},${y(e.weight)}`).join(" ");
  const labelIdx = [...new Set([0, Math.floor((entries.length - 1) / 2), entries.length - 1])];

  const onMove = (evt) => {
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((evt.clientX - rect.left) / rect.width) * W;
    let nearest = 0;
    entries.forEach((_, i) => {
      if (Math.abs(x(i) - px) < Math.abs(x(nearest) - px)) nearest = i;
    });
    setHover(nearest);
  };

  const active = hover !== null ? entries[hover] : null;

  return (
    <div className="weight-chart">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Weight over time"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line className="chart-grid" x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} />
            <text className="chart-axis" x={PAD.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle">
              {t}
            </text>
          </g>
        ))}
        {labelIdx.map((i) => (
          <text key={i} className="chart-axis" x={x(i)} y={H - 10} textAnchor="middle">
            {formatDateKey(entries[i].date)}
          </text>
        ))}

        <path className="chart-line" d={path} />
        {active && (
          <line className="chart-crosshair" x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} />
        )}
        {entries.map((e, i) => (
          <circle
            key={e.date}
            className="chart-dot"
            cx={x(i)}
            cy={y(e.weight)}
            r={hover === i ? 6 : 4}
          />
        ))}
        {/* Transparent layer so the whole plot area responds to hover, not just the dots */}
        <rect x={PAD.left} y={PAD.top} width={plotW} height={plotH} fill="transparent" />
      </svg>

      {active && (
        <div
          className="chart-tooltip"
          style={{
            left: `${(x(hover) / W) * 100}%`,
            top: `${(y(active.weight) / H) * 100}%`,
          }}
        >
          <strong>{active.weight} kg</strong>
          <span>{formatDateKey(active.date, { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
      )}
    </div>
  );
}

export default WeightChart;
