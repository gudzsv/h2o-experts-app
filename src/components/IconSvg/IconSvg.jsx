import sprite from '../../assets/icons/sprite.svg';

const IconSvg = ({ width, height, iconName, styles, onClick }) => {
  return (
    <svg width={width} height={height} className={styles} onClick={onClick}>
      <use
        xlinkHref={`${new URL(sprite, import.meta.url).href}#${iconName}`}
      ></use>
    </svg>
  );
};

export default IconSvg;
