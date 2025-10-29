import RouterApp from "./router/RouterApp";
import { AuthProvider } from "./context/AuthContext";
import { RouteCacheProvider } from "./hooks/useCacheRoute";

const App = () => {

  return (
    <AuthProvider>
      <RouteCacheProvider>
        <RouterApp />
      </RouteCacheProvider>
    </AuthProvider>
  );
};

export default App;
