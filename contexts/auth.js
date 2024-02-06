import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import "./helperClass";
import md5 from "md5";
const AuthContext = createContext({});

const ISSERVER = typeof window === "undefined";

const closeAfter15 = (msg, toastType) =>
  toast(msg, {
    type: toastType,
    autoClose: 1000,
    pauseOnFocusLoss: false,
  });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    !ISSERVER ? Cookies.get("user") || false : ""
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get("token");
      const user = Cookies.get("user");
      if (token) {
        setUser(user);
        if (router.asPath == "/" || router.asPath == "/login") {
          router.Next;
        }
      } else {
        setUser(null);
        logout();
      }
      setLoading(false);
    }
    loadUserFromCookies();
  }, []);
  const login = async (userName, passWord) => {
    await axios
      .post(`${global.apiURL}/login`, {
        username: userName,
        password: passWord,
        loginType: "workflow",
        imei: "",
      })
      .then(({ data }) => {
        console.log(data);
        if (data) {
          closeAfter15("Амжилттай нэвтэрлээ", "success");
          userName = "";
          passWord = "";
          Cookies.set("token", data.token, {
            expires: 60,
            sameSite: "strict",
            secure: true,
          });
          Cookies.set("role", md5(data.userType), {
            expires: 60,
            sameSite: "strict",
            secure: true,
          });
          Cookies.set("employeeId", data.employeeId, {
            expires: 60,
            sameSite: "strict",
            secure: true,
          });
          setUser(data.employeeDisplayName);
          Cookies.set("user", data.employeeDisplayName, {
            expires: 60,
            sameSite: "strict",
            secure: true,
          });
          router.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
        closeAfter15("Нэвтрэх мэдээлэл буруу байна !", "error");
      });
  };

  const logout = async () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("role");
    Cookies.remove("employeeId");
    Cookies.remove("isToday");
    setUser(null);
    router.push("/login");
  };
  const context = { user, loading, login, logout };
  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const ProtectRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  if (!ISSERVER && (isLoading || (!user && router.asPath !== "/login"))) {
    return <div></div>;
  }
  return children;
};
