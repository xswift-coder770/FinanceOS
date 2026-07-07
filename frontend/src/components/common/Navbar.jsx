// import { Link, useNavigate } from "react-router-dom";
 

// const Navbar = () => {

//   const navigate = useNavigate();

//   const handleLogout = () => {

//     localStorage.removeItem("token");

//     navigate("/login");
//   };

//   return (

//     <nav className="navbar">

//       <div className="navbar-logo">
//         <h2>Finance Tracker</h2>
//       </div>

//       <ul className="navbar-links">

//         <li>
//           <Link to="/dashboard">Dashboard</Link>
//         </li>

//         <li>
//           <Link to="/expenses">Expenses</Link>
//         </li>

//         <li>
//           <Link to="/habits">Habits</Link>
//         </li>

//         <li>
//           <Link to="/goals">Goals</Link>
//         </li>

//         <li>
//           <Link to="/analytics">Analytics</Link>
//         </li>

//         <li>
//           <Link to="/admin">Admin</Link>
//         </li>

//       </ul>

//       <button className="logout-btn" onClick={handleLogout}>
//         Logout
//       </button>

//     </nav>
//   );
// };

// export default Navbar;






import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {

    const navigate = useNavigate();

    const {
        userName,
        setUserName,
        logout,
    } = useAuth();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [inputName, setInputName] = useState(userName);

    const dropdownRef = useRef(null);

    

    const getInitials = (name) => {

        if (!name) {
            return "U";
        }

        const parts = name.trim().split(/\s+/);

        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();
    };

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
                setEditMode(false);
                setInputName(userName);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, [userName]);

    const handleSaveName = () => {

        const trimmed = inputName.trim();

        if (trimmed) {
            setUserName(trimmed);
        }

        setEditMode(false);
        setDropdownOpen(false);
    };

    const handleLogout = () => {

        setDropdownOpen(false);
        logout();
    };

    return (

        <nav className="navbar">

            <div
                className="nav-brand"
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }}
            >

                <div className="nav-logo">

                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                    >
                        <rect x="1" y="1" width="8" height="8" rx="2" fill="white" fillOpacity="0.9" />
                        <rect x="13" y="1" width="8" height="8" rx="2" fill="white" fillOpacity="0.55" />
                        <rect x="1" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.55" />
                        <rect x="13" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.9" />
                    </svg>

                </div>

                <span className="nav-title">
                    FinanceOS
                </span>

            </div>

            <div className="nav-links">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/expenses"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    Expenses
                </NavLink>

                <NavLink
                    to="/habits"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    Habits
                </NavLink>

                <NavLink
                    to="/goals"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    Goals
                </NavLink>

                <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                >
                    Analytics
                </NavLink>

            </div>

            <div className="nav-right">

                <div className="nav-notif">

                    <span>🔔</span>

                    <div className="notif-dot"></div>

                </div>

                <div
                    className="avatar-wrapper"
                    ref={dropdownRef}
                >

                    <div
                        className="nav-avatar"
                        onClick={() => {

                            setDropdownOpen(!dropdownOpen);
                            setEditMode(false);
                            setInputName(userName);

                        }}
                    >
                        {getInitials(userName)}
                    </div>

                    {dropdownOpen && (

                        <div className="avatar-dropdown">

                            <div className="dropdown-user-info">

                                <div className="dropdown-avatar-large">
                                    {getInitials(userName)}
                                </div>

                                <div className="dropdown-username">
                                    {userName}
                                </div>

                            </div>

                            <div className="dropdown-divider"></div>

                            {!editMode ? (

                                <button
                                    className="dropdown-item"
                                    onClick={() => {

                                        setEditMode(true);
                                        setInputName(userName);

                                    }}
                                >
                                    <span className="dropdown-item-icon">
                                        ✏️
                                    </span>

                                    Edit Name

                                </button>

                            ) : (

                                <div className="dropdown-edit-area">

                                    <input
                                        className="dropdown-name-input"
                                        value={inputName}
                                        onChange={(e) =>
                                            setInputName(e.target.value)
                                        }
                                        autoFocus
                                    />

                                    <div className="dropdown-edit-actions">

                                        <button
                                            className="dropdown-save-btn"
                                            onClick={handleSaveName}
                                        >
                                            Save
                                        </button>

                                        <button
                                            className="dropdown-cancel-btn"
                                            onClick={() => {

                                                setEditMode(false);
                                                setInputName(userName);

                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>

                            )}

                            <div className="dropdown-divider"></div>

                            <button
                                className="dropdown-item dropdown-item-danger"
                                onClick={handleLogout}
                            >

                                <span className="dropdown-item-icon">
                                    🚪
                                </span>

                                Logout

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </nav>

    );
};

export default Navbar;