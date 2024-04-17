import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    } else {
      logout();
    }
  }, [logout]);


  return { isLoggedIn, logout };
}