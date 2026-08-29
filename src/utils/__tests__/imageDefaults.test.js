/**
 * 圖片預設值與錯誤處理。
 *
 * 這支模組負責「圖片載不出來時該顯示什麼」。它有一個很容易寫錯、而且錯了會
 * 直接拖垮瀏覽器的地方：預設圖本身也載不出來時，`onError` 會再次觸發，
 * 若沒有防護就是無限迴圈。這裡把那道防護釘死。
 */
import { DEFAULT_IMAGES, handleImageError, getImageSrc, createSafeImage } from '../imageDefaults';

/** 模擬一個 <img> 的 error 事件。 */
const errorEventFor = (currentSrc) => ({
  target: {
    src: currentSrc,
    classList: { add: jest.fn() },
  },
});

describe('DEFAULT_IMAGES', () => {
  it('每一種圖片類型都有預設值', () => {
    for (const type of ['default', 'avatar', 'company', 'product', 'activity', 'notFound']) {
      expect(DEFAULT_IMAGES[type]).toBeTruthy();
    }
  });
});

describe('getImageSrc', () => {
  it('有值時原樣回傳', () => {
    expect(getImageSrc('https://cdn.test/photo.jpg')).toBe('https://cdn.test/photo.jpg');
  });

  it.each([
    ['空字串', ''],
    ['null', null],
    ['undefined', undefined],
    ['字串 "null"', 'null'],
    ['字串 "undefined"', 'undefined'],
  ])('%s 時回傳預設圖', (_label, value) => {
    // 字串型的 "null"/"undefined" 是真的會發生的：後端回 null，
    // 前端在某處做了模板字串串接就會變成這兩個字。
    expect(getImageSrc(value)).toBe(DEFAULT_IMAGES.default);
  });

  it('依類型回傳對應的預設圖', () => {
    expect(getImageSrc(null, 'avatar')).toBe(DEFAULT_IMAGES.avatar);
    expect(getImageSrc(null, 'company')).toBe(DEFAULT_IMAGES.company);
  });

  it('未知類型退回一般預設圖而不是 undefined', () => {
    expect(getImageSrc(null, 'not-a-real-type')).toBe(DEFAULT_IMAGES.default);
  });
});

describe('handleImageError', () => {
  it('把來源換成預設圖', () => {
    const event = errorEventFor('https://cdn.test/broken.jpg');
    handleImageError(event);
    expect(event.target.src).toBe(DEFAULT_IMAGES.default);
  });

  it('依類型換成對應的預設圖', () => {
    const event = errorEventFor('https://cdn.test/broken.jpg');
    handleImageError(event, 'avatar');
    expect(event.target.src).toBe(DEFAULT_IMAGES.avatar);
  });

  it('預設圖本身也失敗時改用內嵌 SVG，不再重試（避免無限迴圈）', () => {
    // 沒有這道防護，onError → 設定同一個壞掉的 src → 再次 onError …
    // 會把整個分頁的 CPU 吃滿。
    const event = errorEventFor(DEFAULT_IMAGES.default);
    handleImageError(event);
    expect(event.target.src).toMatch(/^data:image\/svg\+xml;base64,/);
    expect(event.target.src).not.toBe(DEFAULT_IMAGES.default);
  });

  it('加上 image-error class 方便樣式處理', () => {
    const event = errorEventFor('https://cdn.test/broken.jpg');
    handleImageError(event);
    expect(event.target.classList.add).toHaveBeenCalledWith('image-error');
  });
});

describe('createSafeImage', () => {
  it('產生的 props 帶有 onError 處理器', () => {
    const props = createSafeImage({ src: 'https://cdn.test/a.jpg', alt: '照片' });
    expect(typeof props.onError).toBe('function');
    expect(props.src).toBe('https://cdn.test/a.jpg');
    expect(props.alt).toBe('照片');
  });

  it('沒有 alt 時補上預設值（無障礙要求 img 必須有 alt）', () => {
    expect(createSafeImage({ src: 'x.jpg' }).alt).toBe('圖片');
  });

  it('保留呼叫端傳入的其他屬性', () => {
    const props = createSafeImage({ src: 'x.jpg', loading: 'lazy', 'data-testid': 'photo' });
    expect(props.loading).toBe('lazy');
    expect(props['data-testid']).toBe('photo');
  });

  it('產生的 onError 真的會把來源換成預設圖', () => {
    // 只檢查 onError 是不是函式還不夠——它可能綁錯了 type 或漏傳 event。
    const props = createSafeImage({ src: 'https://cdn.test/broken.jpg', type: 'avatar' });
    const event = errorEventFor('https://cdn.test/broken.jpg');

    props.onError(event);

    expect(event.target.src).toBe(DEFAULT_IMAGES.avatar);
  });

  it('className 會併入 safe-image', () => {
    expect(createSafeImage({ src: 'x.jpg', className: 'rounded' }).className).toContain('safe-image');
    expect(createSafeImage({ src: 'x.jpg', className: 'rounded' }).className).toContain('rounded');
  });
});
