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

import css from './Statistics.module.css';
import { useSelector } from 'react-redux';
import { selectDayWater } from '../../redux/water/selectors';

// const data = [
//   { day: 16, amount: 2.3 },
//   { day: 17, amount: 1.5 },
//   { day: 18, amount: 1.8 },
//   { day: 19, amount: 2.0 },
//   { day: 20, amount: 1.7 },
//   { day: 21, amount: 2.4 },
//   { day: 22, amount: 2.5 },
// ];
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
const Statistics = () => {
  const dayWaterData = useSelector(selectDayWater);
  const data = dayWaterData.map((item, index) => ({
    day: item.day,
    amount: item.amount,
  }));

  return (
    <div className={css.wrapperStatistics}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid horizontal="" vertical="" />
          <Tooltip cursor={false} />
          <XAxis
            dataKey="day"
            tick={{ dy: 15 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ dx: -15 }} tickLine={false} />
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

export default Statistics;
