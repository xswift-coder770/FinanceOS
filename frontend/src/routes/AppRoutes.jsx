// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Dashboard from "../pages/Dashboard";

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
//   if (loading) return (
//     <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0e1a" }}>
//       <div className="spinner" />
//     </div>
//   );
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
//   if (loading) return null;
//   return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
// };

// const AppRoutes = () => (
//   <Routes>
//     <Route path="/" element={<Navigate to="/login" replace />} />
//     <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
//     <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
//     <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//     <Route path="*" element={<Navigate to="/login" replace />} />
//   </Routes>
// );

// export default AppRoutes;














// import { Routes, Route, Navigate } from "react-router-dom";

// import { useAuth } from "../context/AuthContext";

// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import Dashboard from "../pages/Dashboard";
// import ExpenseTracker from "../pages/ExpenseTracker";
// import HabitTracker from "../pages/HabitTracker";
// import SavingsGoals from "../pages/SavingsGoals";
// import WealthAnalytics from "../pages/WealthAnalytics";
// import AdminPanel from "../pages/AdminPanel";
// import Home from "../pages/home";



// const ProtectedRoute = ({ children }) => {

//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {

//     return (

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "100vh",
//           background: "#0a0e1a",
//           color: "white",
//           fontSize: "20px",
//           fontWeight: "600",
//         }}
//       >
//         Loading...
//       </div>
//     );
//   }

//   return isAuthenticated
//     ? children
//     : <Navigate to="/login" replace />;
// };



// const PublicRoute = ({ children }) => {

//   const { isAuthenticated, loading } = useAuth();

//   if (loading) return null;

//   return !isAuthenticated
//     ? children
//     : <Navigate to="/dashboard" replace />;
// };



// const AppRoutes = () => {

//   return (

//     <Routes>

//       {/* Default Route */}
//       <Route
//         path="/"
//         element={<Navigate to="/login" replace />}
//       />



//       {/* Public Routes */}
//       <Route
//         path="/login"
//         element={
//           <PublicRoute>
//             <Login />
//           </PublicRoute>
//         }
//       />

//       <Route
//         path="/register"
//         element={
//           <PublicRoute>
//             <Register />
//           </PublicRoute>
//         }
//       />



//       {/* Protected Routes */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/expenses"
//         element={
//           <ProtectedRoute>
//             <ExpenseTracker />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/habits"
//         element={
//           <ProtectedRoute>
//             <HabitTracker />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/goals"
//         element={
//           <ProtectedRoute>
//             <SavingsGoals />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/analytics"
//         element={
//           <ProtectedRoute>
//             <WealthAnalytics />
//           </ProtectedRoute>
//         }
//       />

//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute>
//             <AdminPanel />
//           </ProtectedRoute>
//         }
//       />



//       {/* Invalid Routes */}
//       <Route
//         path="*"
//         element={<Navigate to="/login" replace />}
//       />


//     </Routes>
//   );
// };

// export default AppRoutes;



//isme home page bhi ata hai upar wala me home page nhi include kiyahua tha 

import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Home from "../pages/home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import Dashboard from "../pages/Dashboard";
import ExpenseTracker from "../pages/ExpenseTracker";
import HabitTracker from "../pages/HabitTracker";
import SavingsGoals from "../pages/SavingsGoals";
import WealthAnalytics from "../pages/WealthAnalytics";
 



const ProtectedRoute = ({ children }) => {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {

    return (

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#0a0e1a",
          color: "white",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        Loading...
      </div>
    );
  }

  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
};



const PublicRoute = ({ children }) => {

  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return !isAuthenticated
    ? children
    : <Navigate to="/dashboard" replace />;
};



const AppRoutes = () => {

  return (

    <Routes>

      {/* HOME PAGE */}
      <Route
        path="/"
        element={<Home />}
      />



      {/* PUBLIC ROUTES */}

      <Route
        path="/home"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />



      {/* PROTECTED ROUTES */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />



      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <ExpenseTracker />
          </ProtectedRoute>
        }
      />



      <Route
        path="/habits"
        element={
          <ProtectedRoute>
            <HabitTracker />
          </ProtectedRoute>
        }
      />



      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <SavingsGoals />
          </ProtectedRoute>
        }
      />



      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <WealthAnalytics />
          </ProtectedRoute>
        }
      />



      {/* <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      /> */}



      {/* INVALID ROUTES */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
};

export default AppRoutes;