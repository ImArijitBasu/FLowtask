import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Home from "./Pages/Home";
import { useContext } from "react";
import { AuthContext } from "./Provider/AuthProvider";
import PrivateRoute from "./Routes/PrivateRoute";
import Task from "./Pages/Task";
// import Home from "./pages/Home";
// import About from "./pages/About";
// import NotFound from "./pages/NotFound";

const App = () => {
  const { user, googleSignIn, logout } = useContext(AuthContext);
  return (
    <Router>
      <nav className="border bg-transparent flex justify-center text-white font-bold">
        <div className="max-w-full mx-auto bg-blue-900 p-2 rounded-full space-x-5 fixed top-2 z-50 px-10">
          <NavLink to="/">Home</NavLink>
          {user ? (
            <>
              <NavLink to="/task">Task</NavLink>
              <NavLink to="/">
                <button onClick={logout}>Logout</button>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/">
                <button onClick={googleSignIn}>login</button>
              </NavLink>
            </>
          )}
        </div>
      </nav>
      <div className="pt-16">
        <p>{user?.displayName}</p>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/task"
            element={
              <PrivateRoute>
                <Task />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
