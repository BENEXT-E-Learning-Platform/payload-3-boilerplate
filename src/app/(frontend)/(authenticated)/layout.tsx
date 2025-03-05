import { redirect } from "next/navigation";
import { getClient } from "./action/getClient";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const client = await getClient();
  console.log("client in layout:", client); // Add this log
  
  if (!client) {
    redirect("/login");
  }
  return <div>{children}</div>;
};

export default Layout;