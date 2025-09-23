import RouterApp from "./router/RouterApp";
import { AuthProvider } from "./context/AuthContext";

const App = () => {

  return (
    <AuthProvider>
        <RouterApp />
    </AuthProvider>
  );
};

export default App;
