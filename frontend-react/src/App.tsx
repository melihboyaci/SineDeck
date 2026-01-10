import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthLayout from "./components/layouts/AuthLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import SeriesPage from "./pages/Series";
import MovieList from "./pages/admin/MovieList";
import EditMovie from "./pages/admin/EditMovie";
import AddMovie from "./pages/admin/AddMovie";
import SeriesList from "./pages/admin/SeriesList";
import AddSeries from "./pages/admin/AddSeries";
import EditSeries from "./pages/admin/EditSeries";
import UserManagement from "./pages/admin/UserManagement";
import GenreManagement from "./pages/admin/GenreManagement";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/admin/movies" element={<MovieList />} />
        <Route path="/admin/add-movie" element={<AddMovie />} />
        <Route path="/admin/edit-movie/:id" element={<EditMovie />} />
        <Route path="/admin/series" element={<SeriesList />} />
        <Route path="/admin/add-series" element={<AddSeries />} />
        <Route path="/admin/edit-series/:id" element={<EditSeries />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/genres" element={<GenreManagement />} />
      </Route>
    </Routes>
  );
}
export default App;
