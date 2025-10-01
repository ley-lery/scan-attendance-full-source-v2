/* eslint-disable @typescript-eslint/no-explicit-any */
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import  {
  getProtectedRoutes,
  redirectRoute,
} from "./Index";
import ProtectedRoute from "@/router/ProtectedRoute";
import Index from "@/views/Index";
import NotFoundPage from "@/+not-found";
import { Suspense } from "react";
import RouteFallback from "@/components/ui/RouteFallback";
import { decodeToken } from "@/utils/jwt";

// Recursive function to render nested routes
const renderRoutes = (routes: any[]) =>
  routes.map((route, index) => {
    if (route.children?.length) {
      return (
        <Route
          path={route.path}
          key={route.name || index}
          element={route.component ? <route.component /> : <Outlet />}
        >
          {renderRoutes(route.children)}
        </Route>
      );
    }
    return (
      <Route
        key={route.name || index}
        path={route.path}
        element={route.component ? <route.component /> : null}
      />
    );
  }
);

const RouterApp = () => {

  // const dynamicRoutes = useDynamicRoutes();
  const role = decodeToken()?.assign_type;
 
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public / redirect routes */}
        {redirectRoute.map((route, index) => (
          <Route
            key={route.name || index}
            path={route.path}
            element={route.component ? <route.component /> : null}
          />
        ))}

        {/* Protected authenticated routes */}
        <Route path="/" element={<ProtectedRoute component={Index} />}>
          <Route index element={<Navigate to="system/dashboard" replace />} />
          {renderRoutes(getProtectedRoutes(role))}
        </Route>

        {/* Not found page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default RouterApp;