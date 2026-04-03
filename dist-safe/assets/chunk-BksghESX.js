import { j as jsxRuntimeExports } from "./chunk-dJI1vi8Z.js";
import { f as formatCurrency, m as formatCompactNumber } from "./app-C4Pvg4H3.js";
import { R as ResponsiveContainer, L as LineChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Line, B as BarChart, b as Bar, c as Cell } from "./chunk-CsYwSQuG.js";
function formatValue(value, valueLabel) {
  return valueLabel === "currency" ? formatCurrency(value) : formatCompactNumber(value);
}
function TrendLineChart({
  data,
  valueLabel = "number",
  primaryLabel = "Primary",
  secondaryLabel = "Secondary"
}) {
  const hasSecondarySeries = data.some((item) => typeof item.secondaryValue === "number");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chart-frame", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { vertical: false, stroke: "#edf1f7" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", axisLine: false, tickLine: false, tick: { fill: "#7b8ba7", fontSize: 12 } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      YAxis,
      {
        axisLine: false,
        tickLine: false,
        tick: { fill: "#7b8ba7", fontSize: 12 },
        tickFormatter: (value) => formatValue(Number(value), valueLabel)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tooltip,
      {
        formatter: (value) => formatValue(value, valueLabel),
        contentStyle: { borderRadius: 16, borderColor: "#dbe4f0", boxShadow: "0 14px 30px rgba(16, 34, 69, 0.12)" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "value", name: primaryLabel, stroke: "#5d87ff", strokeWidth: 3, dot: { r: 4, fill: "#ffffff" } }),
    hasSecondarySeries ? /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "secondaryValue", name: secondaryLabel, stroke: "#49beff", strokeWidth: 2, dot: false }) : null
  ] }) }) });
}
function CategoryBarChart({ data, valueLabel = "number" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chart-frame", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 280, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { vertical: false, stroke: "#edf1f7" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "label", axisLine: false, tickLine: false, tick: { fill: "#7b8ba7", fontSize: 12 } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      YAxis,
      {
        axisLine: false,
        tickLine: false,
        tick: { fill: "#7b8ba7", fontSize: 12 },
        tickFormatter: (value) => formatValue(Number(value), valueLabel)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Tooltip,
      {
        formatter: (value) => formatValue(value, valueLabel),
        contentStyle: { borderRadius: 16, borderColor: "#dbe4f0", boxShadow: "0 14px 30px rgba(16, 34, 69, 0.12)" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "value", radius: [12, 12, 0, 0], children: data.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: index % 2 === 0 ? "#5d87ff" : "#49beff" }, `${item.label}-${index}`)) })
  ] }) }) });
}
export {
  CategoryBarChart as C,
  TrendLineChart as T
};
