import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import MovieList from "./pages/admin/MovieList";
import EditMovie from "./pages/admin/EditMovie";
import AddMovie from "./pages/admin/AddMovie";
import UserManagement from "./pages/admin/UserManagement";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin/movies" element={<MovieList />} />
        <Route path="/admin/add-movie" element={<AddMovie />} />
        <Route path="/admin/edit-movie/:id" element={<EditMovie />} />
        <Route path="/admin/users/" element={<UserManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
