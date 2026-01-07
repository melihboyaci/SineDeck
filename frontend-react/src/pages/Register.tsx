import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../helper/api";
import { toast } from "react-toastify";
import { FormInput, Button } from "../components/ui";
import { HiCheck, HiX } from "react-icons/hi";

// Şifre validasyon kuralları
const passwordRules = [
  {
    key: "minLength",
    label: "En az 6 karakter",
    test: (pw: string) => pw.length >= 6,
  },
  {
    key: "hasUppercase",
    label: "En az 1 büyük harf",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    key: "hasLowercase",
    label: "En az 1 küçük harf",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    key: "hasNumber",
    label: "En az 1 rakam",
    test: (pw: string) => /[0-9]/.test(pw),
  },
];

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  // Şifre validasyonlarını hesapla
  const validations = useMemo(() => {
    return passwordRules.map((rule) => ({
      ...rule,
      passed: rule.test(password),
    }));
  }, [password]);

  const allRulesPassed = validations.every((v) => v.passed);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!allRulesPassed) {
      toast.error("Şifre gereksinimleri karşılanmıyor!");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Şifreler eşleşmiyor!");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", { username, password });
      toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate("/login");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Bu kullanıcı adı zaten kullanılıyor!");
      } else {
        toast.error("Kayıt işlemi başarısız!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        Kayıt Ol
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

        <div>
          <FormInput
            id="password"
            label="Şifre"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
          />

          {/* Şifre Kuralları Göstergesi */}
          {(touched.password || password.length > 0) && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-1.5">
              {validations.map((rule) => (
                <div
                  key={rule.key}
                  className={`flex items-center gap-2 text-xs ${
                    rule.passed
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {rule.passed ? (
                    <HiCheck className="text-sm" />
                  ) : (
                    <HiX className="text-sm text-red-400" />
                  )}
                  {rule.label}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <FormInput
            id="confirmPassword"
            label="Şifre Tekrar"
            type="password"
            placeholder="••••••••"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() =>
              setTouched((prev) => ({ ...prev, confirmPassword: true }))
            }
            error={
              touched.confirmPassword && confirmPassword && !passwordsMatch
                ? "Şifreler eşleşmiyor"
                : undefined
            }
          />
          {touched.confirmPassword && confirmPassword && passwordsMatch && (
            <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
              <HiCheck /> Şifreler eşleşiyor
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading || !allRulesPassed || !passwordsMatch}
        >
          {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
        Zaten hesabınız var mı?{" "}
        <Link
          to="/login"
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}

export default Register;
