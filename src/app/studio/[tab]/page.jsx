import Link from "next/link";
import { requireSession } from "@/lib/studio-auth";
import LogoutButton from "../components/LogoutButton";
import SheetGrid from "../components/SheetGrid";

export const dynamic = "force-dynamic";

export default function StudioTab({ params }) {
  const session = requireSession();
  const tab = decodeURIComponent(params.tab);

  return (
    <div className="studio_shell">
      <header className="studio_header">
        <div className="studio_brand">
          <Link href="/studio" className="studio_back">
            ← Studio
          </Link>
          <span className="studio_tab_title">{tab}</span>
        </div>
        <div className="studio_header_right">
          <span className="studio_muted">
            Signed in as <b>{session.id}</b>
          </span>
          <LogoutButton />
        </div>
      </header>
      <main className="studio_main">
        <SheetGrid tab={tab} />
      </main>
    </div>
  );
}
