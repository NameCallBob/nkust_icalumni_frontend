import defaultImage from '../assets/logo.png';
import defaultAvatar from '../assets/ICbaby.png';

/**
 * 預設圖片配置
 */
export const DEFAULT_IMAGES = {
  // 一般預設圖片
  default: defaultImage,
  // 人物頭像預設圖片
  avatar: defaultAvatar,
  // 公司預設圖片
  company: defaultImage,
  // 產品預設圖片
  product: defaultImage,
  // 活動預設圖片
  activity: defaultImage,
  // 404錯誤圖片
  notFound: '/assets/系有資料404.png'
};

/**
 * 處理圖片載入錯誤，返回適當的預設圖片
 * @param {Event} event - 圖片載入錯誤事件
 * @param {string} type - 圖片類型 ('avatar', 'company', 'product', 'activity', 'default')
 */
export const handleImageError = (event, type = 'default') => {
  const target = event.target;
  const defaultSrc = DEFAULT_IMAGES[type] || DEFAULT_IMAGES.default;

  // 避免無限迴圈：如果預設圖片也載入失敗，使用白色背景的 base64 placeholder
  if (target.src === defaultSrc) {
    // 純白色背景的 SVG
    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==';
  } else {
    target.src = defaultSrc;
  }

  // 添加錯誤類別以便樣式控制
  target.classList.add('image-error');
};

/**
 * 獲取圖片來源，如果為空則返回預設圖片
 * @param {string} src - 原始圖片來源
 * @param {string} type - 圖片類型
 * @returns {string} - 圖片來源
 */
export const getImageSrc = (src, type = 'default') => {
  if (!src || src === '' || src === 'null' || src === 'undefined') {
    return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.default;
  }
  return src;
};

/**
 * 建立具有錯誤處理的圖片元素
 * @param {Object} props - 圖片屬性
 * @returns {JSX.Element} - React 圖片元素
 */
export const createSafeImage = (props) => {
  const { src, alt, type = 'default', className = '', style = {}, ...otherProps } = props;

  return {
    src: getImageSrc(src, type),
    alt: alt || '圖片',
    className: `safe-image ${className}`,
    style: style,
    onError: (e) => handleImageError(e, type),
    ...otherProps
  };
};