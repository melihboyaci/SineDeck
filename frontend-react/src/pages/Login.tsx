import { Button, Card, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Girilenler: ", username, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6">
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
    </div>
  );
}

export default Login;
