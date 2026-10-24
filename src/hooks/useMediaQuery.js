import { useEffect, useState } from 'react';

const getMatch = (query) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false;

/** 訂閱 CSS media query，回傳目前是否符合。 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => getMatch(query));

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    if (mql.addEventListener) {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    mql.addListener(onChange); // 舊版 Safari
    return () => mql.removeListener(onChange);
  }, [query]);

  return matches;
}

/** 視窗寬度 < 768px（Tailwind `md` 以下）視為行動裝置。 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

export default useMediaQuery;
