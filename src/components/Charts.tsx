import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import type { ChartDatum, TrendDatum } from '../types'
import { formatCompactNumber, formatCurrency } from '../utils/format'

interface TrendLineChartProps {
  data: TrendDatum[]
  valueLabel?: 'currency' | 'number'
  primaryLabel?: string
  secondaryLabel?: string
}

interface CategoryBarChartProps {
  data: ChartDatum[]
  valueLabel?: 'currency' | 'number'
}

function formatValue(value: number, valueLabel: 'currency' | 'number') {
  return valueLabel === 'currency' ? formatCurrency(value) : formatCompactNumber(value)
}

export function TrendLineChart({
  data,
  valueLabel = 'number',
  primaryLabel = 'Primary',
  secondaryLabel = 'Secondary'
}: TrendLineChartProps) {
  const hasSecondarySeries = data.some((item) => typeof item.secondaryValue === 'number')

  return (
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart data={data}>
          <CartesianGrid vertical={false} stroke="#edf1f7" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#7b8ba7', fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#7b8ba7', fontSize: 12 }}
            tickFormatter={(value) => formatValue(Number(value), valueLabel)}
          />
          <Tooltip
            formatter={(value: number) => formatValue(value, valueLabel)}
            contentStyle={{ borderRadius: 16, borderColor: '#dbe4f0', boxShadow: '0 14px 30px rgba(16, 34, 69, 0.12)' }}
          />
          <Line type="monotone" dataKey="value" name={primaryLabel} stroke="#5d87ff" strokeWidth={3} dot={{ r: 4, fill: '#ffffff' }} />
          {hasSecondarySeries ? (
            <Line type="monotone" dataKey="secondaryValue" name={secondaryLabel} stroke="#49beff" strokeWidth={2} dot={false} />
          ) : null}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CategoryBarChart({ data, valueLabel = 'number' }: CategoryBarChartProps) {
  return (
    <div className="chart-frame">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="#edf1f7" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#7b8ba7', fontSize: 12 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#7b8ba7', fontSize: 12 }}
            tickFormatter={(value) => formatValue(Number(value), valueLabel)}
          />
          <Tooltip
            formatter={(value: number) => formatValue(value, valueLabel)}
            contentStyle={{ borderRadius: 16, borderColor: '#dbe4f0', boxShadow: '0 14px 30px rgba(16, 34, 69, 0.12)' }}
          />
          <Bar dataKey="value" radius={[12, 12, 0, 0]}>
            {data.map((item, index) => (
              <Cell key={`${item.label}-${index}`} fill={index % 2 === 0 ? '#5d87ff' : '#49beff'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
