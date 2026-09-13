import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="h-full w-full overflow-y-auto bg-background text-foreground">
      <div className="flex min-h-full w-full items-center justify-center">
        <div className="my-auto flex w-full justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
