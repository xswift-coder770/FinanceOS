// import { BrowserRouter } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { AuthProvider } from "./context/AuthContext";
// import AppRoutes from "./routes/AppRoutes";
// import "./styles/global.css";

// // import Login from "./pages/Login";
// // import Register from "./pages/Register";
// // import Dashboard from "./pages/Dashboard";
// // import ExpenseTracker from "./pages/ExpenseTracker";
// // import HabitTracker from "./pages/HabitTracker";
// // import SavingsGoals from "./pages/SavingsGoals";
// // import WealthAnalytics from "./pages/WealthAnalytics";
// // import AdminPanel from "./pages/AdminPanel";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <AppRoutes />
//         <Toaster
//           position="top-right"
//           toastOptions={{
//             duration: 3500,
//             style: {
//               background: "#0f1830",
//               color: "#eef1f8",
//               border: "1px solid rgba(201,168,76,0.2)",
//               borderRadius: "10px",
//               fontSize: "13px",
//               fontFamily: "'DM Sans', sans-serif",
//             },
//             success: {
//               iconTheme: { primary: "#52c97e", secondary: "#0f1830" },
//             },
//             error: {
//               iconTheme: { primary: "#ff6b6b", secondary: "#0f1830" },
//             },
//           }}
//         />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }





import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

import "./styles/global.css";

export default function App() {

  return (

     <BrowserRouter>

      <AuthProvider>

        <AppRoutes />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,

            style: {
              background: "#0f1830",
              color: "#eef1f8",
              border: "1px solid rgba(201,168,76,0.2)",
              borderRadius: "10px",
              fontSize: "13px",
              fontFamily: "'DM Sans', sans-serif",
            },

            success: {
              iconTheme: {
                primary: "#52c97e",
                secondary: "#0f1830",
              },
            },

            error: {
              iconTheme: {
                primary: "#ff6b6b",
                secondary: "#0f1830",
              },
            },
          }}
        />

      </AuthProvider>

    </BrowserRouter>
  );
}