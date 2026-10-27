import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toDisplayDecimal } from '../../helpers/units.js';
import { useVolume } from '../../hooks/useVolume.js';
import css from './StatsView.module.css';

const StatsTooltip = ({ active, payload, unitLabel }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const { date, amount } = payload[0].payload;

  return (
    <div className={css.tooltip}>
      <p className={css.tooltipDate}>{date.slice(5).replace('-', '.')}</p>
      <p>{`${amount} ${unitLabel}`}</p>
    </div>
  );
};

// The last 30 days as bars: days that reached the goal are green, others are
// muted, and a dashed line marks the daily norm.
const StatsChart = ({ days, dailyRequirement }) => {
  const { t } = useTranslation();
  const { units, unitLabel } = useVolume();

  const data = useMemo(
    () =>
      days.map(({ date, total, goalMet }) => ({
        date,
        day: Number(date.slice(8)),
        amount: toDisplayDecimal(total, units),
        goalMet,
      })),
    [days, units]
  );

  return (
    <div
      className={css.chart}
      role="img"
      aria-label={t('stats.chartLabel', { unit: unitLabel })}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 0, left: -16 }}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={12}
          />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip
            cursor={false}
            content={<StatsTooltip unitLabel={unitLabel} />}
          />
          <ReferenceLine
            y={toDisplayDecimal(dailyRequirement, units)}
            stroke="var(--dark-blue)"
            strokeDasharray="4 4"
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]} animationDuration={0}>
            {data.map(item => (
              <Cell
                key={item.date}
                fill={item.goalMet ? 'var(--light-green)' : 'var(--dark-blue-a20)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
