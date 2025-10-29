/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { getProtectedRoutes, redirectRoute, type RouteConfig } from "./Index";
import ProtectedRoute from "@/router/ProtectedRoute";
import Index from "@/views/Index";
import NotFoundPage from "@/+not-found";
import { Suspense, useMemo, memo, type JSX } from "react";
import RouteFallback from "@/components/ui/RouteFallback";
import { useAuth } from "@/context/AuthContext";

// Memoized route renderer for nested routes with Suspense wrapper
const RouteElement = memo(({ route }: { route: RouteConfig }) => {
  const Component = route.component;
  return Component ? (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  ) : (
    <Outlet />
  );
});

RouteElement.displayName = "RouteElement";

// Optimized recursive route renderer
const renderRoutes = (routes: RouteConfig[]): JSX.Element[] =>
  routes.map((route) => {
    const key = `${route.path}-${route.name}`;
    
    if (route.children?.length) {
      return (
        <Route
          path={route.path}
          key={key}
          element={<RouteElement route={route} />}
        >
          {renderRoutes(route.children)}
        </Route>
      );
    }
    
    return (
      <Route
        key={key}
        path={route.path}
        element={route.component ? <route.component /> : null}
      />
    );
  });

const RouterApp = () => {
  const { activeAccount } = useAuth();
  const role = activeAccount?.user?.assign_type;

  // Memoize protected routes - only recalculates when role changes
  const protectedRoutes = useMemo(() => getProtectedRoutes(role), [role]);

  // Memoize rendered routes to prevent unnecessary re-renders
  const renderedProtectedRoutes = useMemo(
    () => renderRoutes(protectedRoutes),
    [protectedRoutes]
  );

  // Memoize redirect routes
  const renderedRedirectRoutes = useMemo(
    () =>
      redirectRoute.map((route) => (
        <Route
          key={`redirect-${route.path}`}
          path={route.path}
          element={route.component ? <route.component /> : null}
        />
      )),
    []
  );

  return (
    <Routes>
      {/* Public / redirect routes */}
      {renderedRedirectRoutes}

      {/* Protected authenticated routes */}
      <Route path="/" element={<ProtectedRoute component={Index} />}>
        <Route index element={<Navigate to="system/dashboard" replace />} />
        {renderedProtectedRoutes}
      </Route>

      {/* Not found page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default memo(RouterApp);