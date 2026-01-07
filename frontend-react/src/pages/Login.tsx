import React, { useContext, useState } from "react";
import { AuthContext } from "../components/auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../helper/api";
import { toast } from "react-toastify";
import { FormInput, Button } from "../components/ui";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", { username, password });
      login(response.data.access_token, username, response.data.user.role);

      toast.success("Giriş Başarılı!");
      navigate("/");
    } catch (error) {
      toast.error("Giriş Başarısız");
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Giriş Yap
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormInput
          id="username"
          label="Kullanıcı Adı"
          type="text"
          placeholder="Kullanıcı adınızı girin"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <FormInput
          id="password"
          label="Şifre"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="primary" fullWidth>
          Giriş Yap
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Hesabınız yok mu?{" "}
        <Link
          to="/register"
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}

export default Login;
