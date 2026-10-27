import clsx from 'clsx';
import {
  LuCitrus,
  LuCoffee,
  LuCupSoda,
  LuGlassWater,
  LuLeaf,
  LuMilk,
} from 'react-icons/lu';
import sprite from '../../assets/icons/sprite.svg';
import css from './DrinkIcon.module.css';

const LINE_ICONS = {
  water: LuGlassWater,
  tea: LuLeaf,
  milk: LuMilk,
  coffee: LuCoffee,
  juice: LuCitrus,
  soda: LuCupSoda,
};

// `filled` keeps the brand's filled glass for water on the entry cards; the
// other drinks and the pickers use line icons, green unless `inherit` takes
// the text color (on chips).
const DrinkIcon = ({
  type,
  size,
  filled = false,
  inherit = false,
  label,
  className,
}) => {
  const a11y = label
    ? { role: 'img', 'aria-label': label }
    : { 'aria-hidden': true };

  if (filled && type === 'water') {
    return (
      <svg width={size} height={size} className={className} {...a11y}>
        <use href={`${sprite}#icon-water-glass-fill`}></use>
      </svg>
    );
  }

  const Icon = LINE_ICONS[type] ?? LuGlassWater;
  return (
    <Icon
      className={clsx(css.icon, inherit && css.inherit, className)}
      size={size}
      {...a11y}
    />
  );
};

export default DrinkIcon;
