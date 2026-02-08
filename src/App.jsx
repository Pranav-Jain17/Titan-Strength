import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import Navbar from './Components/Navbar';
import ProtectedRoute from './Components/ProtectedRoute';
import LandingPage from './Components/LandingPage';
import Login from '../src/Pages/auth/Login.jsx';
import Signup from '../src/Pages/auth/SignUp.jsx';
import ForgotPassword from '../src/Pages/auth/ForgotPassword.jsx';
import ResetPassword from '../src/Pages/auth/ResetPassword.jsx';
import Unauthorized from '../src/Pages/auth/Unauthorized.jsx';
import ManagerDashboard from '../src/Pages/dashboards/Manager/ManagerDashboard.jsx';
import OwnerDashboard from './Pages/dashboards/Owner/OwnerDashboard.jsx';
import TrainerDashboard from '../src/Pages/dashboards/Trainer/TrainerDashboard.jsx';
import MemberDashboard from './Pages/dashboards/Member/MemberDashboard.jsx';
import UserDashboard from '../src/Pages/dashboards/User/UserDashboard.jsx';
import VerifyEmail from './Pages/auth/VerifyEmail.jsx';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/api/v1/auth/verify-email/:token" element={<VerifyEmail />} />

        <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['manager', 'owner']} />}>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['trainer', 'manager', 'owner']} />}>
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['member']} />}>
          <Route path="/member/dashboard" element={<MemberDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['user', 'member', 'trainer', 'manager', 'owner']} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
        </Route>

        <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Page Not Found</div>} />

      </Routes>
    </>
  );
}

export default App;