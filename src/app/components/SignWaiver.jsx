"use client";
import "../styles/sign-waiver.css";

const SignWaiver = ({ waiverUrl }) => {
  if (!waiverUrl) return null;

  return (
    <>
      {/* Mobile: Fixed bottom bar */}
      <a
        href={waiverUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="v11_waiver_mobile"
      >
        <span className="v11_waiver_pulse" />
        <svg className="v11_waiver_doc_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="v11_waiver_mobile_text">Sign Your Waiver</span>
        <svg className="v11_waiver_arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
        </svg>
      </a>

      {/* Desktop: Fixed right-side tab with hover expand */}
      <a
        href={waiverUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="v11_waiver_desktop"
      >
        {/* Expandable panel (shows on hover) */}
        <div className="v11_waiver_expand_panel">
          <div className="v11_waiver_expand_content">
            <div className="v11_waiver_expand_status">
              <span className="v11_waiver_pulse" />
              <span className="v11_waiver_status_text">Live — Sign Now</span>
            </div>
            <p className="v11_waiver_expand_title">Sign Your Waiver</p>
            <p className="v11_waiver_expand_sub">Required before every jump</p>
            <div className="v11_waiver_expand_btn">
              <span>Tap to Sign</span>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tab strip (always visible) */}
        <div className="v11_waiver_tab">
          <span className="v11_waiver_pulse" />
          <svg className="v11_waiver_doc_icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="v11_waiver_tab_text">Sign Waiver</span>
        </div>
      </a>
    </>
  );
};

export default SignWaiver;
