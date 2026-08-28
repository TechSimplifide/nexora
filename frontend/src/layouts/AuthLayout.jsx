import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
