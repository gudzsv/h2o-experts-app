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
import { selectIsLoading, selectWeekWater } from '../../redux/water/selectors';
import { useMemo } from 'react';
import { getEntryDateKey, getWeekDays, toDateKey } from '../../helpers/date.js';

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
      amount: amountByDate.get(toDateKey(date)) ?? 0,
    }));
  }, [weekWaterData]);

  if (isLoading) {
    return <p className={css.loadingMessage}>Loading...</p>;
  }

  return (
    <div>
      {/* <h2 className={css.title}>Statistics</h2> */}
      <div className={css.wrapperStatistics}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={groupedData}>
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
