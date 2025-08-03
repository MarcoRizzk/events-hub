"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Spinner from "@app/components/spinner";
import { authService } from "@app/services/auth";
import type { CreateUserDto, UserDto } from "@app/types";
import toastr from "react-hot-toast";

type AuthUser = UserDto;

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggingOut: boolean;
  register: (user: CreateUserDto) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = ["/", "/login", "/register"];
  const isEventDetail = pathname?.startsWith("/events/");

  const isProtected = !publicPaths.includes(pathname || "") && !isEventDetail;
  useEffect(() => {
    const checkUser = async () => {
      try {
        const loggedInUser = await authService.me();
        setUser(loggedInUser);
      } catch {
        setUser(null);
        if (isProtected) {
          router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`);
          toastr.error("Please log in to continue");
        }
      } finally {
        setIsInitialized(true);
      }
    };

    checkUser();
  }, [pathname, isProtected, router]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        const user = await authService.login(email, password);
        setUser(user);
        const redirect =
          new URLSearchParams(window.location.search).get("redirect") || "/";
        router.push(redirect);
        toastr.success(`${user.name}, Welcome back to Events Management`);
      } catch (err) {
        toastr.error((err as Error)?.message || "Login failed");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const register = useCallback(
    async (user: CreateUserDto) => {
      try {
        setIsLoading(true);
        const createdUser = await authService.register(user);
        setUser(createdUser);
        const redirect =
          new URLSearchParams(window.location.search).get("redirect") || "/";
        router.push(redirect);
        toastr.success(`${user.name}, Welcome to Events Management`);
      } catch (err) {
        toastr.error((err as Error)?.message || "Registration failed");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      setUser(null);
      toastr.success("Logged out successfully. See you soon!");
    } catch (err) {
      toastr.error((err as Error)?.message || "Logout failed");
      console.error("Logout failed:", err);
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      isInitialized,
      isLoggingOut,
      login,
      register,
      logout,
    }),
    [user, isLoading, isInitialized, isLoggingOut, login, register, logout]
  );

  if (!isInitialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
