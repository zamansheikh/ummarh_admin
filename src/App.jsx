import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./authentication/Login";
import Home from "./page/Home";
import "./App.css";
import TermsAndConditions from "./page/TermsConditions";
import PrivacyPolicy from "./page/PrivacyPolicy";
import { useAuth } from "./component/AuthContext";
import NotFound from "./page/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<ProtectedRoute component={<Home />} />} />
        <Route
          path="/terms-conditions"
          element={<ProtectedRoute component={<TermsAndConditions />} />}
        />
        <Route
          path="/privacy-policy"
          element={<ProtectedRoute component={<PrivacyPolicy />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

const ProtectedRoute = ({ component }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? component : <Navigate to="/" replace />;
};

export default App;
