
import { useCallback, useMemo, useRef } from 'react';
import { debounce } from 'lodash';

// Hook para optimizar búsquedas con debounce
export const useDebounce = (callback: (value: string) => void, delay: number = 300) => {
  const debouncedCallback = useMemo(
    () => debounce(callback, delay),
    [callback, delay]
  );

  return debouncedCallback;
};

// Hook para memoización inteligente de datos
export const useMemoizedData = <T>(
  data: T[],
  filterFn?: (item: T) => boolean,
  sortFn?: (a: T, b: T) => number
) => {
  return useMemo(() => {
    let result = data;
    
    if (filterFn) {
      result = result.filter(filterFn);
    }
    
    if (sortFn) {
      result = [...result].sort(sortFn);
    }
    
    return result;
  }, [data, filterFn, sortFn]);
};

// Hook para virtualización de listas largas
export const useVirtualization = (itemCount: number, itemHeight: number, containerHeight: number) => {
  const scrollTop = useRef(0);
  
  const visibleStart = Math.floor(scrollTop.current / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    itemCount
  );

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    scrollTop.current = e.currentTarget.scrollTop;
  }, []);

  return {
    visibleStart,
    visibleEnd,
    onScroll,
    totalHeight: itemCount * itemHeight,
    offsetY: visibleStart * itemHeight
  };
};

// Hook para lazy loading de imágenes
export const useLazyLoading = () => {
  const observer = useRef<IntersectionObserver>();
  
  const lazyRef = useCallback((node: HTMLImageElement | null) => {
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.current?.unobserve(img);
          }
        }
      });
    });
    
    if (node) observer.current.observe(node);
  }, []);

  return lazyRef;
};

// Hook para cache de datos con expiración
export const useDataCache = <T>(key: string, ttl: number = 5 * 60 * 1000) => {
  const setCache = useCallback((data: T) => {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
  }, [key, ttl]);

  const getCache = useCallback((): T | null => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const { data, timestamp, ttl: cacheTtl } = JSON.parse(cached);
      
      if (Date.now() - timestamp > cacheTtl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }, [key]);

  const clearCache = useCallback(() => {
    localStorage.removeItem(`cache_${key}`);
  }, [key]);

  return { setCache, getCache, clearCache };
};
