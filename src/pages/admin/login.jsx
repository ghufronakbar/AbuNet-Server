import axiosInstance from "@/config/axiosInstance";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Input,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constant/keyStore";
import { useRouter } from "next/router";

const LoginPage = () => {
  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

  const redirect = router.query.redirect || "/admin/dashboard";

  const handleLogin = async () => {
    if (loading) return;
    if (formLogin.email === "" || formLogin.password === "") {
      setErrorMessage("Email dan Password harus diisi");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/account/login", formLogin);
      Cookie.set(ACCESS_TOKEN, data.data.accessToken);
      Cookie.set(REFRESH_TOKEN, data.data.refreshToken);
      router.push(redirect);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || "Terjadi kesalahan saat login"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }, [errorMessage]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-12">
      <Card className="w-full md:w-1/2 lg:w-1/3 p-4">
        <CardContent>
          <Typography
            gutterBottom
            style={{ fontWeight: "bold" }}
            className="text-black"
            variant="h4"
          >
            Login Admin
          </Typography>
          <Typography variant="h5" component="div"></Typography>
          <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
            Masuk ke AbuNet
          </Typography>
          <div className="h-4" />
          <div variant="body2" className="w-full flex flex-col gap-4">
            <TextField
              label="Email"
              className="w-full"
              type="email"
              autoFocus
              onChange={(e) =>
                setFormLogin({ ...formLogin, email: e.target.value })
              }
            />
            <TextField
              label="Password"
              className="w-full"
              type="password"
              onChange={(e) =>
                setFormLogin({ ...formLogin, password: e.target.value })
              }
            />
          </div>
        </CardContent>
        <div className="w-full px-4">
          {errorMessage && (
            <Typography className="text-red-500" fontSize={12}>
              {errorMessage}
            </Typography>
          )}
        </div>
        <CardActions>
          <div className="w-full px-2 my-4">
            <Button
              variant="contained"
              className="w-full h-12 flex items-center justify-center"
              onClick={handleLogin}
            >
              {loading ? <CircularProgress color="white" size={20} /> : "Login"}
            </Button>
          </div>
        </CardActions>
      </Card>
    </div>
  );
};

export default LoginPage;
