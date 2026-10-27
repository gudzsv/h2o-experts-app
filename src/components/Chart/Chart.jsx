import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Dot,
  ResponsiveContainer,
} from 'recharts';

import css from './Chart.module.css';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectIsLoading, selectWeekWater } from '../../redux/water/selectors';
import { useMemo } from 'react';
import { getEntryDateKey, getWeekDays, toDateKey } from '../../helpers/date.js';
import { toDisplayDecimal } from '../../helpers/units.js';
import { useVolume } from '../../hooks/useVolume.js';

const CustomDot = props => {
  const { cx, cy } = props;
  return (
    <g>
      <Dot
        cx={cx}
        cy={cy}
        r={6}
        fill="white"
        stroke="#9BE1A0"
        strokeWidth={2}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={css.customTooltip}>
        <p>{` ${payload[0].value} `}</p>
      </div>
    );
  }
  return null;
};

const Chart = () => {
  const { t } = useTranslation();
  const { units } = useVolume();
  const isLoading = useSelector(selectIsLoading);
  const weekWaterData = useSelector(selectWeekWater);

  const groupedData = useMemo(() => {
    const amountByDate = new Map();
    weekWaterData.forEach(entry => {
      const dateKey = getEntryDateKey(entry);
      amountByDate.set(
        dateKey,
        (amountByDate.get(dateKey) ?? 0) + (entry.usedWater || 0)
      );
    });

    return getWeekDays().map(date => ({
      day: date.getDate(),
      amount: toDisplayDecimal(amountByDate.get(toDateKey(date)) ?? 0, units),
    }));
  }, [weekWaterData, units]);

  if (isLoading) {
    return <p className={css.loadingMessage}>{t('a11y.loading')}</p>;
  }

  return (
    <div>
      <div className={css.wrapperStatistics}>
        <ResponsiveContainer width="100%" height="100%">
          {/* Room for the dots of the last day and of the highest value. */}
          <AreaChart
            data={groupedData}
            margin={{ top: 10, right: 10, bottom: 5, left: 5 }}
          >
            <CartesianGrid horizontal="" vertical="" />
            <Tooltip cursor={false} content={<CustomTooltip />} />
            <XAxis
              dataKey="day"
              tick={{ dy: 15 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ dx: -10 }}
              tickLine={false}
              tickFormatter={value => `${value}`}
            />
            <Area
              animationDuration={0}
              dataKey="amount"
              fillOpacity={1}
              fill="url(#colorAmount)"
              dot={<CustomDot />}
              stroke="#9BE1A0"
            />
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9BE1A0" stopOpacity={1} />
                <stop offset="95%" stopColor="#9BE1A0" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
