import Link from "next/link";
import { requireSession } from "@/lib/studio-auth";
import LogoutButton from "../../components/LogoutButton";
import RowEditor from "../../components/RowEditor";

export const dynamic = "force-dynamic";

export default function StudioRowPage({ params }) {
  const session = requireSession();
  const tab = decodeURIComponent(params.tab);
  const row = decodeURIComponent(params.row);
  const isNew = row === "new";

  return (
    <div className="studio_shell">
      <header className="studio_header">
        <div className="studio_brand">
          <Link href={`/studio/${encodeURIComponent(tab)}`} className="studio_back">
            ← {tab}
          </Link>
          <span className="studio_tab_title">{isNew ? "New row" : `Edit row #${row}`}</span>
        </div>
        <div className="studio_header_right">
          <span className="studio_muted">
            Signed in as <b>{session.id}</b>
          </span>
          <LogoutButton />
        </div>
      </header>
      <main className="studio_main">
        <RowEditor tab={tab} row={row} />
      </main>
    </div>
  );
}
