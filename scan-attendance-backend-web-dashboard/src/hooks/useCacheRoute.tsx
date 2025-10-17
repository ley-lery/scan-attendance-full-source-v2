import { createContext, useContext, useRef, useCallback, type ReactNode } from 'react';

interface RouteCacheContextType {
  isRouteVisited: (path: string) => boolean;
  markRouteVisited: (path: string) => void;
  clearCache: (path?: string) => void;
}

const RouteCacheContext = createContext<RouteCacheContextType | null>(null);

export const RouteCacheProvider = ({ children }: { children: ReactNode }) => {
  const visitedRoutes = useRef<Set<string>>(new Set());

  const isRouteVisited = useCallback((path: string) => {
    return visitedRoutes.current.has(path);
  }, []);

  const markRouteVisited = useCallback((path: string) => {
    visitedRoutes.current.add(path);
  }, []);

  const clearCache = useCallback((path?: string) => {
    if (path) {
      visitedRoutes.current.delete(path);
    } else {
      visitedRoutes.current.clear();
    }
  }, []);

  return (
    <RouteCacheContext.Provider value={{ isRouteVisited, markRouteVisited, clearCache }}>
      {children}
    </RouteCacheContext.Provider>
  );
};

export const useRouteCache = () => {
  const context = useContext(RouteCacheContext);
  if (!context) {
    throw new Error('useRouteCache must be used within RouteCacheProvider');
  }
  return context;
};