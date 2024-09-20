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
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoading, selectMonthWater } from '../../redux/water/selectors';
import { useEffect } from 'react';
import { getMonthWater } from '../../redux/water/operations';

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
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const monthWaterData = useSelector(selectMonthWater);
  useEffect(() => {
    const yearMonth = '2025-10';
    dispatch(getMonthWater(yearMonth));
  }, [dispatch]);

  if (isLoading) {
    return <p> Loading...</p>;
  }

  const data = monthWaterData.map(entry => ({
    day: entry.drinkingTime,
    amount: entry.usedWater,
  }));

  return (
    <div className={css.wrapperStatistics}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
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
            tick={{ dx: -13 }}
            tickLine={false}
            tickFormatter={value => `${value} L`}
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
  );
};

export default Chart;
