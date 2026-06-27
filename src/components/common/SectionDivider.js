import React from 'react';
import styles from './SectionDivider.module.css';

const SectionDivider = ({
  title,
  subtitle,
  icon,
  variant = 'default',
  size = 'medium',
  className = ''
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'outstanding':
        return styles.outstanding;
      case 'elegant':
        return styles.elegant;
      case 'modern':
        return styles.modern;
      default:
        return styles.default;
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <div className={`${styles.sectionDivider} ${getVariantClass()} ${getSizeClass()} ${className}`}>
      <div className={styles.dividerLine}></div>
      <div className={styles.content}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.decorativeElements}>
        <span className={styles.element1}>✦</span>
        <span className={styles.element2}>◆</span>
        <span className={styles.element3}>✦</span>
      </div>
    </div>
  );
};

export default SectionDivider;