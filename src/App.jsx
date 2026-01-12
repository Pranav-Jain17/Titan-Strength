import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/SignUp';
import ResetPassword from './Components/ResetPassword';
import Home from './Components/Home';
import ForgotPassword from './Components/ForgotPassword';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={1000} />
    </Router>

  );
}

export default App;