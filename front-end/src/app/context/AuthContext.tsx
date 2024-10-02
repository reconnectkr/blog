"use client";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { IUser } from "../interfaces";

interface AuthContextType {
  accessToken: string | null;
  refreshToken: string | null;
  user: IUser | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  fetchUserInfo: () => Promise<void>;
  executeAuthenticatedAction: <T>(action: () => Promise<T>) => Promise<T>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedAccessToken && storedRefreshToken) {
      setAccessToken(storedAccessToken);
      setRefreshToken(storedRefreshToken);
      fetchUserInfo();
    }
  }, []);

  const login = (newAccessToken: string, newRefreshToken: string) => {
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    fetchUserInfo();
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshToken) return null;
    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/auth/refresh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      } else {
        logout();
        return null;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
      return null;
    }
  };

  const fetchUserInfo = async () => {
    if (!accessToken) return;
    try {
      const response = await fetch("http://localhost:4000/api/v1/user/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const userData: IUser = await response.json();
        setUser(userData);
      } else {
        const newToken = await refreshAccessToken();
        if (newToken) {
          await fetchUserInfo();
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const executeAuthenticatedAction = async <T,>(
    action: () => Promise<T>
  ): Promise<T> => {
    try {
      return await action();
    } catch (error) {
      if (error instanceof Error && error.message === "API error: 401") {
        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            return await action();
          } else {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            router.push("/login");
            throw new Error("Authentication failed");
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          alert("세션 갱신에 실패했습니다. 다시 로그인해주세요.");
          router.push("/login");
          throw new Error("Authentication failed");
        }
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        login,
        logout,
        refreshAccessToken,
        fetchUserInfo,
        executeAuthenticatedAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
