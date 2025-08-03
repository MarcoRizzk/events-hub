"use client";

import { useAuth } from "@app/lib/auth-context";
import TopBar from "./top-bar";

export default function TopBarWrapper() {
  const { user, logout } = useAuth();
  return <TopBar user={user} onLogout={logout} />;
}
