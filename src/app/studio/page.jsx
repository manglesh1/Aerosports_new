import Link from "next/link";
import { requireSession } from "@/lib/studio-auth";
import { listTabs } from "@/lib/google-sheets";
import LogoutButton from "./components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function StudioDashboard() {
  const session = requireSession();

  let tabs = [];
  let error = null;
  try {
    tabs = await listTabs();
  } catch (e) {
    error = e.message;
  }

  return (
    <div className="studio_shell">
      <header className="studio_header">
        <div className="studio_brand">AeroSports Studio</div>
        <div className="studio_header_right">
          <span className="studio_muted">
            Signed in as <b>{session.id}</b>
          </span>
          <LogoutButton />
        </div>
      </header>

      <main className="studio_main">
        <h1>Sheets</h1>
        <p className="studio_muted">Pick a tab to view and edit its rows. Edits write to the live spreadsheet.</p>

        {error ? (
          <div className="studio_error studio_block">
            <b>Couldn’t load the spreadsheet:</b> {error}
            <div className="studio_muted" style={{ marginTop: 8 }}>
              Share the spreadsheet (Editor access) with the service account email, and set{" "}
              <code>GOOGLE_SERVICE_ACCOUNT_JSON</code> / <code>STUDIO_SHEET_ID</code> if needed.
            </div>
          </div>
        ) : (
          <div className="studio_tabs">
            {tabs.map((t) => (
              <Link key={t.title} href={`/studio/${encodeURIComponent(t.title)}`} className="studio_tab_card">
                <span className="studio_tab_name">{t.title}</span>
                <span className="studio_muted">View &amp; edit →</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
