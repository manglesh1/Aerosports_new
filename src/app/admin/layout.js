
import Link from "next/link";
import AdminLayoutContent from "./AdminLayoutContent";

export const metadata = {
  title: "Admin | AeroSports",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>;
}


