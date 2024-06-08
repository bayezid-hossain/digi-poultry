import type { ReactNode } from "react";
import { Header } from "../(landing)/_components/header";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid min-h-screen place-items-start p-4 sm:pt-0">
      <Header></Header>
      <div className="grid  w-full place-items-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
