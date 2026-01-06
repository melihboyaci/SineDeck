import { Button, Card, Label, TextInput } from "flowbite-react";
import React, { useContext, useState } from "react";
import { AuthContext } from "../components/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../helper/api";
import { toast } from "react-toastify";

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
    <Card className="w-full">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        SineDeck Giriş
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          {/* Kullanıcı Adı Kutusu */}
          <div className="mb-2 block">
            <Label htmlFor="username">Kullanıcı Adı</Label>
          </div>
          <TextInput
            id="username"
            type="text"
            placeholder="Kullanıcı adınızı girin"
            required
            // Kullanıcı klavyeye bastıkça (onChange), hafızadaki değişkeni (setUsername) güncelliyoruz.
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Şifre Kutusu */}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password">Şifre</Label>
          </div>
          <TextInput
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Giriş Butonu */}
        <Button type="submit" color="purple" className="w-full">
          Giriş Yap
        </Button>
      </form>
    </Card>
  );
}

export default Login;
