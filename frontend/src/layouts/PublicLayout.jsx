import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="h-full w-full overflow-y-auto bg-background text-foreground">
      <Outlet />
    </div>
  );
}

export default PublicLayout;
