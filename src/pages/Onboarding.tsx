import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/*  Design tokens (matching Dashboard & Finances)                      */
/* ------------------------------------------------------------------ */

const TEAL = '#2A5B6C';
const AMBER = '#E8913A';
const AMBER_LIGHT = '#F5A623';
const WARM_BG = '#F8F7F5';
const SIDEBAR_BG = '#1A2F38';

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const pageWrap: React.CSSProperties = {
  minHeight: '100vh',
  background: WARM_BG,
  display: 'flex',
  justifyContent: 'center',
  padding: '48px 24px 80px',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
};

const inner: React.CSSProperties = {
  maxWidth: 640,
  width: '100%',
};

const heading: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 700,
  color: TEAL,
  margin: '0 0 12px',
  lineHeight: 1.15,
  letterSpacing: '-0.02em',
};

const subtitle: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.65,
  color: '#4A5568',
  margin: '0 0 36px',
  fontWeight: 400,
};

const bodyText: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.65,
  color: '#2D3748',
  margin: '0 0 14px',
  fontWeight: 400,
};

const card: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: 16,
  padding: '28px 32px',
  border: '1px solid #EDE9E3',
  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  marginBottom: 20,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 18px',
  fontSize: 16,
  border: '1px solid #D1CBC2',
  borderRadius: 10,
  background: '#FFFFFF',
  color: '#1A2636',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const primaryBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: AMBER,
  color: '#FFFFFF',
  border: 'none',
  borderRadius: 10,
  padding: '14px 28px',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: 'inherit',
};

const subtleLink: React.CSSProperties = {
  fontSize: 14,
  color: '#718096',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  textDecoration: 'underline',
  textUnderlineOffset: 3,
  fontFamily: 'inherit',
};

const sourceBadge: React.CSSProperties = {
  display: 'inline-block',
  fontSize: 11,
  fontWeight: 500,
  color: '#718096',
  background: '#F0EEEB',
  borderRadius: 4,
  padding: '2px 7px',
  marginLeft: 8,
  verticalAlign: 'middle',
};

const pillBtn = (active: boolean): React.CSSProperties => ({
  padding: '8px 18px',
  fontSize: 14,
  fontWeight: 500,
  border: active ? `2px solid ${TEAL}` : '2px solid #D1CBC2',
  borderRadius: 20,
  background: active ? TEAL : '#FFFFFF',
  color: active ? '#FFFFFF' : '#4A5568',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  fontFamily: 'inherit',
});

const questionCard: React.CSSProperties = {
  ...card,
  padding: '24px 28px',
};

const noteBox: React.CSSProperties = {
  background: '#FEF3E2',
  border: '1px solid #F5D9A8',
  borderRadius: 10,
  padding: '14px 18px',
  fontSize: 14,
  lineHeight: 1.55,
  color: '#92400E',
  marginTop: 12,
};

const checkItem: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  fontSize: 15,
  color: '#1A2636',
  lineHeight: 1.55,
  padding: '6px 0',
};

/* ------------------------------------------------------------------ */
/*  Director data (simulating Companies House lookup)                   */
/* ------------------------------------------------------------------ */

interface FlatData {
  flatNumber: number;
  directorName: string;
  liveThere: 'yes' | 'rented' | '';
  managedBy: string;
  email: string;
}

const initialFlats: FlatData[] = [
  { flatNumber: 1, directorName: 'Ian Clark', liveThere: '', managedBy: '', email: '' },
  { flatNumber: 2, directorName: 'Jennifer Ann Davies', liveThere: '', managedBy: '', email: '' },
  { flatNumber: 3, directorName: 'Gareth Barnes', liveThere: '', managedBy: '', email: '' },
  { flatNumber: 4, directorName: 'Janet Hicks', liveThere: '', managedBy: '', email: '' },
  { flatNumber: 5, directorName: 'Daniel Mohamed', liveThere: '', managedBy: '', email: '' },
];

/* ------------------------------------------------------------------ */
/*  Document upload types                                              */
/* ------------------------------------------------------------------ */

interface DocType {
  label: string;
  description: string;
  uploaded: boolean;
  reading?: boolean;
  aiSummary?: string;
}

const aiSummaries: Record<string, string> = {
  'Your lease': 'Found: Lease for Flat 5, dated 5 May 1989, 999-year term',
  'Buildings insurance certificate': 'Found: Allianz policy BB28285956, renewed May 2025, \u00A33,177/year',
  'Fire risk assessment': 'Found: Capital Fire Protection, December 2025 \u2014 3 remedial actions identified',
  'Any surveys': 'Found: RICS Level 3 survey by Lapider, October 2024 \u2014 roof at end of life',
  'Service charge accounts': 'Found: 2025/26 accounts, \u00A37,200 per flat, reserve fund at \u00A312,450',
  'Meeting minutes': 'Found: Board meeting 19 March 2026 \u2014 roof works approved, 4 actions noted',
};

const initialDocTypes: DocType[] = [
  { label: 'Your lease', description: 'The legal agreement for your flat. Usually a thick document from when you bought it.', uploaded: false },
  { label: 'Buildings insurance certificate', description: 'Should be renewed every year.', uploaded: false },
  { label: 'Fire risk assessment', description: "If one's been done, it's usually a PDF report.", uploaded: false },
  { label: 'Any surveys', description: 'Building survey, damp survey, roof survey \u2014 anything like that.', uploaded: false },
  { label: 'Service charge accounts', description: 'The annual financial summary, if you have one.', uploaded: false },
  { label: 'Meeting minutes', description: "Notes from any directors' meetings.", uploaded: false },
];

/* ------------------------------------------------------------------ */
/*  Important stuff step data                                          */
/* ------------------------------------------------------------------ */

interface ImportantData {
  serviceCharge: string;
  serviceChargeUnsure: boolean;
  hasInsurance: 'yes' | 'no' | '';
  insurer: string;
  fireSafety: '' | 'recent' | 'old' | 'no' | 'unsure';
  hasIssues: 'yes' | 'no' | 'unsure' | '';
  issueDescription: string;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [flats, setFlats] = useState<FlatData[]>(initialFlats);
  const [docs, setDocs] = useState<DocType[]>(initialDocTypes);
  const [important, setImportant] = useState<ImportantData>({
    serviceCharge: '',
    serviceChargeUnsure: false,
    hasInsurance: '',
    insurer: '',
    fireSafety: '',
    hasIssues: '',
    issueDescription: '',
  });

  /* Fade-in transition state */
  const [visible, setVisible] = useState(true);

  const goToStep = useCallback((next: number) => {
    setVisible(false);
    setTimeout(() => {
      setStep(next);
      setVisible(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);
  }, []);

  /* Handle "Find my building" */
  const handleSearch = () => {
    if (!address.trim()) return;
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      goToStep(2);
    }, 2000);
  };

  /* Flat data updater */
  const updateFlat = (idx: number, field: keyof FlatData, value: string) => {
    setFlats((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  /* Doc toggle — with AI reading animation */
  const toggleDoc = (idx: number) => {
    setDocs((prev) => {
      // If already uploaded, just toggle off
      if (prev[idx].uploaded) {
        const next = [...prev];
        next[idx] = { ...next[idx], uploaded: false, reading: false, aiSummary: undefined };
        return next;
      }
      // If already reading, do nothing
      if (prev[idx].reading) return prev;
      // Start reading animation
      const next = [...prev];
      next[idx] = { ...next[idx], reading: true };
      return next;
    });

    // After 1s delay, show the AI summary
    if (!docs[idx].uploaded && !docs[idx].reading) {
      setTimeout(() => {
        setDocs((prev) => {
          const next = [...prev];
          const summary = aiSummaries[next[idx].label] || 'Found: Document processed successfully';
          next[idx] = { ...next[idx], reading: false, uploaded: true, aiSummary: summary };
          return next;
        });
      }, 1000);
    }
  };

  /* Summary counts for step 6 */
  const docsUploaded = docs.filter((d) => d.uploaded).length;
  const issuesReported = important.hasIssues === 'yes' ? 1 : 0;

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div style={pageWrap}>
      <div
        style={{
          ...inner,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {/* Branding */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: SIDEBAR_BG, letterSpacing: '-0.02em' }}>
            HomeBase
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Your building, understood</div>
        </div>

        {/* ========================================================== */}
        {/*  Step 1: Welcome                                            */}
        {/* ========================================================== */}
        {step === 1 && !searching && (
          <>
            <h1 style={heading}>Let&rsquo;s get to know your building</h1>
            <p style={subtitle}>
              Tell us where you live and we&rsquo;ll pull together everything we can find.
              It takes about 5 minutes &mdash; and you&rsquo;ll be surprised how much is already out there.
            </p>

            <label style={{ fontSize: 14, fontWeight: 500, color: '#4A5568', display: 'block', marginBottom: 8 }}>
              What&rsquo;s your address or postcode?
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. 5 Cathedral Green, Llandaff"
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = TEAL;
                e.currentTarget.style.boxShadow = `0 0 0 3px rgba(42,91,108,0.1)`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#D1CBC2';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />

            <div style={{ marginTop: 24 }}>
              <button
                style={{
                  ...primaryBtn,
                  opacity: address.trim() ? 1 : 0.5,
                }}
                onClick={handleSearch}
                disabled={!address.trim()}
                onMouseEnter={(e) => { if (address.trim()) e.currentTarget.style.background = AMBER_LIGHT; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = AMBER; }}
              >
                Find my building <span style={{ fontSize: 18 }}>{'\u2192'}</span>
              </button>
            </div>
          </>
        )}

        {/* Searching animation */}
        {step === 1 && searching && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ marginBottom: 24 }}>
              <SearchingDots />
            </div>
            <p style={{ fontSize: 18, color: TEAL, fontWeight: 500 }}>
              Searching public records...
            </p>
            <p style={{ fontSize: 14, color: '#94A3B8', marginTop: 8 }}>
              Land Registry, Companies House, EPC Register, Cadw, planning.data.gov.uk
            </p>
          </div>
        )}

        {/* ========================================================== */}
        {/*  Step 2: Here's what we found                               */}
        {/* ========================================================== */}
        {step === 2 && (
          <>
            <h1 style={heading}>We found your building!</h1>

            <div style={{ ...card, marginBottom: 28 }}>
              <DataRow icon="\uD83D\uDCCD" text="Yr Hen Dy, 5 Cathedral Green, Llandaff, Cardiff, CF5 2EB" source="Land Registry" />
              <DataRow icon="\uD83C\uDFDB\uFE0F" text="Grade II listed building" source="Cadw" />
              <DataRow icon="\uD83C\uDFD8\uFE0F" text="Conservation area: Llandaff" source="Cadw" />
              <DataRow icon="\uD83D\uDCD0" text="3 storeys, built c.1790" source="Land Registry" />
              <DataRow
                icon="\uD83C\uDFE2"
                text="Management company: Cathedral Green Management Company Limited (Co. 04827361)"
                source="Companies House"
              />
              <DataRow icon="\uD83D\uDC65" text="5 directors registered at Companies House" source="Companies House" />
              <DataRow icon="\u26A1" text="EPC ratings: various per flat (D\u2013E range)" source="EPC Register" />
              <DataRow icon="\uD83D\uDDFA\uFE0F" text="Planning history: 2 recent applications in the area" source="planning.data.gov.uk" last />
            </div>

            <p style={{ ...bodyText, color: '#718096', fontStyle: 'italic', marginBottom: 28 }}>
              All of this came from public records &mdash; you didn&rsquo;t have to type any of it.
            </p>

            <p style={{ ...bodyText, fontWeight: 500, marginBottom: 16 }}>Does this look right?</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                style={primaryBtn}
                onClick={() => goToStep(3)}
                onMouseEnter={(e) => { e.currentTarget.style.background = AMBER_LIGHT; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = AMBER; }}
              >
                Yes, that&rsquo;s my building
              </button>
              <button style={subtleLink} onClick={() => goToStep(1)}>
                Something&rsquo;s not right
              </button>
            </div>
          </>
        )}

        {/* ========================================================== */}
        {/*  Step 3: Who lives where?                                   */}
        {/* ========================================================== */}
        {step === 3 && (
          <>
            <h1 style={heading}>Who lives where?</h1>
            <p style={subtitle}>
              Companies House tells us the directors &mdash; can you fill in the rest?
            </p>

            {flats.map((flat, idx) => (
              <div key={flat.flatNumber} style={{ ...card, marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 14 }}>
                  Flat {flat.flatNumber}
                </div>

                {/* Director name */}
                <label style={{ fontSize: 13, color: '#718096', display: 'block', marginBottom: 4 }}>
                  Director name
                </label>
                <input
                  type="text"
                  value={flat.directorName}
                  onChange={(e) => updateFlat(idx, 'directorName', e.target.value)}
                  style={{
                    ...inputStyle,
                    color: flat.directorName === initialFlats[idx].directorName ? TEAL : '#1A2636',
                    padding: '10px 14px',
                    fontSize: 15,
                    marginBottom: 14,
                  }}
                />
                {flat.directorName === initialFlats[idx].directorName && (
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: -10, marginBottom: 14 }}>
                    From Companies House &mdash; check it&rsquo;s right
                  </div>
                )}

                {/* Do they live there? */}
                <label style={{ fontSize: 13, color: '#718096', display: 'block', marginBottom: 8 }}>
                  Do they live there?
                </label>
                <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                  <button
                    style={pillBtn(flat.liveThere === 'yes')}
                    onClick={() => updateFlat(idx, 'liveThere', 'yes')}
                  >
                    Yes
                  </button>
                  <button
                    style={pillBtn(flat.liveThere === 'rented')}
                    onClick={() => updateFlat(idx, 'liveThere', 'rented')}
                  >
                    No, it&rsquo;s rented out
                  </button>
                </div>

                {/* If rented */}
                {flat.liveThere === 'rented' && (
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 13, color: '#718096', display: 'block', marginBottom: 4 }}>
                      Who manages the tenancy?
                    </label>
                    <input
                      type="text"
                      value={flat.managedBy}
                      onChange={(e) => updateFlat(idx, 'managedBy', e.target.value)}
                      placeholder="e.g. Northwood, or self-managed"
                      style={{ ...inputStyle, padding: '10px 14px', fontSize: 14 }}
                    />
                  </div>
                )}

                {/* Email */}
                <label style={{ fontSize: 13, color: '#718096', display: 'block', marginBottom: 4 }}>
                  Their email (optional)
                </label>
                <input
                  type="email"
                  value={flat.email}
                  onChange={(e) => updateFlat(idx, 'email', e.target.value)}
                  placeholder="So we can keep everyone in the loop"
                  style={{ ...inputStyle, padding: '10px 14px', fontSize: 14 }}
                />
              </div>
            ))}

            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.55, marginBottom: 28 }}>
              Don&rsquo;t worry if you don&rsquo;t know everyone&rsquo;s details yet. You can always add people later.
            </p>

            <button
              style={primaryBtn}
              onClick={() => goToStep(4)}
              onMouseEnter={(e) => { e.currentTarget.style.background = AMBER_LIGHT; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = AMBER; }}
            >
              Continue <span style={{ fontSize: 18 }}>{'\u2192'}</span>
            </button>
          </>
        )}

        {/* ========================================================== */}
        {/*  Step 4: The important stuff                                */}
        {/* ========================================================== */}
        {step === 4 && (
          <>
            <h1 style={heading}>The important stuff</h1>
            <p style={subtitle}>
              A few quick questions to help us look after your building properly.
            </p>

            {/* Q1: Service charge */}
            <div style={questionCard}>
              <p style={{ fontSize: 16, fontWeight: 500, color: '#1A2636', margin: '0 0 14px' }}>
                What&rsquo;s the current service charge?
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 16, color: '#4A5568', fontWeight: 500 }}>{'\u00A3'}</span>
                <input
                  type="number"
                  value={important.serviceCharge}
                  onChange={(e) => setImportant((p) => ({ ...p, serviceCharge: e.target.value, serviceChargeUnsure: false }))}
                  placeholder="0"
                  style={{ ...inputStyle, width: 120, padding: '10px 14px', fontSize: 16, textAlign: 'right' }}
                  disabled={important.serviceChargeUnsure}
                />
                <span style={{ fontSize: 14, color: '#718096' }}>per flat per month</span>
              </div>
              <button
                style={{
                  ...subtleLink,
                  fontSize: 13,
                  color: important.serviceChargeUnsure ? TEAL : '#94A3B8',
                  fontWeight: important.serviceChargeUnsure ? 500 : 400,
                }}
                onClick={() => setImportant((p) => ({ ...p, serviceChargeUnsure: !p.serviceChargeUnsure, serviceCharge: '' }))}
              >
                {important.serviceChargeUnsure ? '\u2713 Not sure' : 'Not sure'}
              </button>
            </div>

            {/* Q2: Insurance */}
            <div style={questionCard}>
              <p style={{ fontSize: 16, fontWeight: 500, color: '#1A2636', margin: '0 0 14px' }}>
                Do you have buildings insurance?
              </p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <button
                  style={pillBtn(important.hasInsurance === 'yes')}
                  onClick={() => setImportant((p) => ({ ...p, hasInsurance: 'yes' }))}
                >
                  Yes
                </button>
                <button
                  style={pillBtn(important.hasInsurance === 'no')}
                  onClick={() => setImportant((p) => ({ ...p, hasInsurance: 'no', insurer: '' }))}
                >
                  No / Not sure
                </button>
              </div>
              {important.hasInsurance === 'yes' && (
                <div>
                  <label style={{ fontSize: 13, color: '#718096', display: 'block', marginBottom: 4 }}>
                    Who with?
                  </label>
                  <input
                    type="text"
                    value={important.insurer}
                    onChange={(e) => setImportant((p) => ({ ...p, insurer: e.target.value }))}
                    placeholder="e.g. Allianz, Aviva, Direct Line"
                    style={{ ...inputStyle, padding: '10px 14px', fontSize: 14 }}
                  />
                </div>
              )}
              {important.hasInsurance === 'no' && (
                <div style={noteBox}>
                  This is really important &mdash; your building needs to be insured. We can help you sort this out.
                </div>
              )}
            </div>

            {/* Q3: Fire safety */}
            <div style={questionCard}>
              <p style={{ fontSize: 16, fontWeight: 500, color: '#1A2636', margin: '0 0 14px' }}>
                Has the building had a fire safety check?
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {([
                  ['recent', 'Yes, in the last 3 years'],
                  ['old', 'Yes, but it was a while ago'],
                  ['no', 'No'],
                  ['unsure', 'Not sure'],
                ] as const).map(([val, label]) => (
                  <button
                    key={val}
                    style={pillBtn(important.fireSafety === val)}
                    onClick={() => setImportant((p) => ({ ...p, fireSafety: val }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {(important.fireSafety === 'no' || important.fireSafety === 'unsure') && (
                <div style={noteBox}>
                  We&rsquo;ll add this to your to-do list. It&rsquo;s a legal requirement for buildings with communal areas.
                </div>
              )}
            </div>

            {/* Q4: Current issues */}
            <div style={questionCard}>
              <p style={{ fontSize: 16, fontWeight: 500, color: '#1A2636', margin: '0 0 14px' }}>
                Are there any problems with the building right now?
              </p>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                {([
                  ['yes', 'Yes'],
                  ['no', "No, everything's fine"],
                  ['unsure', "I'm not sure"],
                ] as const).map(([val, label]) => (
                  <button
                    key={val}
                    style={pillBtn(important.hasIssues === val)}
                    onClick={() => setImportant((p) => ({ ...p, hasIssues: val }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {important.hasIssues === 'yes' && (
                <textarea
                  value={important.issueDescription}
                  onChange={(e) => setImportant((p) => ({ ...p, issueDescription: e.target.value }))}
                  placeholder="Tell us briefly &mdash; a leak, damp, broken something..."
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    fontSize: 14,
                    padding: '12px 14px',
                    lineHeight: 1.5,
                  }}
                />
              )}
            </div>

            <div style={{ marginTop: 8 }}>
              <button
                style={primaryBtn}
                onClick={() => goToStep(5)}
                onMouseEnter={(e) => { e.currentTarget.style.background = AMBER_LIGHT; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = AMBER; }}
              >
                Continue <span style={{ fontSize: 18 }}>{'\u2192'}</span>
              </button>
            </div>
          </>
        )}

        {/* ========================================================== */}
        {/*  Step 5: Upload documents                                   */}
        {/* ========================================================== */}
        {step === 5 && (
          <>
            <h1 style={heading}>Upload any documents you have</h1>
            <p style={subtitle}>
              If you have any of these, they&rsquo;ll really help us build up a complete picture.
              But don&rsquo;t worry if you don&rsquo;t &mdash; we can work with what we&rsquo;ve got.
            </p>

            {docs.map((doc, idx) => (
              <div key={doc.label} style={{ ...card, marginBottom: 14, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: '#1A2636', marginBottom: 4 }}>
                      {doc.label}
                    </div>
                    <div style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.45 }}>
                      {doc.description}
                    </div>
                  </div>
                  {doc.uploaded && !doc.reading && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#059669', whiteSpace: 'nowrap', marginLeft: 12 }}>
                      {'\u2713'} Added
                    </span>
                  )}
                  {doc.reading && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: TEAL, whiteSpace: 'nowrap', marginLeft: 12 }}>
                      Reading...
                    </span>
                  )}
                </div>

                {/* Drop zone (mock) */}
                <div
                  onClick={() => toggleDoc(idx)}
                  style={{
                    marginTop: 12,
                    border: doc.reading
                      ? `2px solid ${TEAL}`
                      : doc.uploaded
                        ? `2px solid #059669`
                        : '2px dashed #D1CBC2',
                    borderRadius: 10,
                    padding: '20px 16px',
                    textAlign: 'center',
                    cursor: doc.reading ? 'default' : 'pointer',
                    background: doc.reading ? '#F0F6F8' : doc.uploaded ? '#F0FDF4' : '#FAFAF8',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!doc.uploaded && !doc.reading) e.currentTarget.style.borderColor = TEAL;
                  }}
                  onMouseLeave={(e) => {
                    if (!doc.uploaded && !doc.reading) e.currentTarget.style.borderColor = '#D1CBC2';
                  }}
                >
                  {doc.reading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20, animation: 'pulse 1s ease-in-out infinite' }}>{'\uD83D\uDCC4'}</span>
                      <span style={{ fontSize: 14, color: TEAL, fontWeight: 500 }}>
                        Reading your document...
                      </span>
                    </div>
                  ) : doc.uploaded ? (
                    <div>
                      <span style={{ fontSize: 14, color: '#059669', fontWeight: 500 }}>
                        {'\u2705'} {doc.aiSummary || `document-${doc.label.toLowerCase().replace(/\s+/g, '-')}.pdf`}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 24, marginBottom: 6, color: '#CBD5E0' }}>{'\uD83D\uDCC4'}</div>
                      <div style={{ fontSize: 13, color: '#94A3B8' }}>
                        Drop a file here or click to browse
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}

            <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.55, marginTop: 8, marginBottom: 28 }}>
              You can add documents at any time &mdash; this doesn&rsquo;t have to be done now. The more you add, the better we can help.
            </p>

            <button
              style={primaryBtn}
              onClick={() => goToStep(6)}
              onMouseEnter={(e) => { e.currentTarget.style.background = AMBER_LIGHT; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = AMBER; }}
            >
              Continue <span style={{ fontSize: 18 }}>{'\u2192'}</span>
            </button>
          </>
        )}

        {/* ========================================================== */}
        {/*  Step 6: You're all set                                     */}
        {/* ========================================================== */}
        {step === 6 && (
          <>
            <h1 style={{ ...heading, fontSize: 36, marginBottom: 16 }}>Welcome to HomeBase</h1>
            <p style={{ ...subtitle, marginBottom: 32 }}>
              Here&rsquo;s what we&rsquo;ve set up for your building:
            </p>

            <div style={{ ...card, padding: '24px 28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={checkItem}>
                  <span style={{ color: '#059669', fontSize: 18, flexShrink: 0 }}>{'\u2705'}</span>
                  <span>Building profile created from 6 public data sources</span>
                </div>
                <div style={checkItem}>
                  <span style={{ color: '#059669', fontSize: 18, flexShrink: 0 }}>{'\u2705'}</span>
                  <span>5 directors linked to the management company</span>
                </div>
                <div style={checkItem}>
                  <span style={{ color: '#059669', fontSize: 18, flexShrink: 0 }}>{'\u2705'}</span>
                  <span>
                    {docsUploaded > 0
                      ? `${docsUploaded} document${docsUploaded > 1 ? 's' : ''} uploaded`
                      : 'No documents yet \u2014 you can add them anytime'}
                  </span>
                </div>
                {issuesReported > 0 && (
                  <div style={checkItem}>
                    <span style={{ color: '#059669', fontSize: 18, flexShrink: 0 }}>{'\u2705'}</span>
                    <span>{issuesReported} issue flagged for follow-up</span>
                  </div>
                )}
                <div style={checkItem}>
                  <span style={{ color: '#059669', fontSize: 18, flexShrink: 0 }}>{'\u2705'}</span>
                  <span>Building health check started &mdash; we&rsquo;ll let you know if anything needs attention</span>
                </div>
              </div>
            </div>

            <div style={{ ...card, padding: '24px 28px', background: '#F0F6F8', border: '1px solid #D0DEE3' }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: TEAL, margin: '0 0 14px' }}>
                What happens next:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <p style={{ ...bodyText, margin: 0, paddingLeft: 14, borderLeft: `2px solid ${TEAL}` }}>
                  We&rsquo;ll check your building against the legal requirements and let you know if anything&rsquo;s missing.
                </p>
                <p style={{ ...bodyText, margin: 0, paddingLeft: 14, borderLeft: `2px solid ${TEAL}` }}>
                  We&rsquo;ll set up reminders for the important things &mdash; insurance renewals, safety checks, company filings.
                </p>
                {issuesReported > 0 && (
                  <p style={{ ...bodyText, margin: 0, paddingLeft: 14, borderLeft: `2px solid ${TEAL}` }}>
                    We&rsquo;ve logged the issue you reported and will help you work out next steps.
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginTop: 28 }}>
              <button
                style={{ ...primaryBtn, padding: '16px 36px', fontSize: 17 }}
                onClick={() => navigate('/')}
                onMouseEnter={(e) => { e.currentTarget.style.background = AMBER_LIGHT; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = AMBER; }}
              >
                Go to your building <span style={{ fontSize: 20 }}>{'\u2192'}</span>
              </button>
            </div>

            <div style={{ marginTop: 20 }}>
              <button style={{ ...subtleLink, fontSize: 15 }}>
                Invite your fellow directors &mdash; the more people on board, the easier it is to look after the building together.
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function DataRow({
  icon,
  text,
  source,
  last = false,
}: {
  icon: string;
  text: string;
  source: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '10px 0',
        borderBottom: last ? 'none' : '1px solid #F0EEEB',
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <span style={{ fontSize: 15, color: '#1A2636', lineHeight: 1.55, flex: 1 }}>
        {text}
        <span style={sourceBadge}>{source}</span>
      </span>
    </div>
  );
}

function SearchingDots() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setFrame((f) => (f + 1) % 3), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: TEAL,
            opacity: frame === i ? 1 : 0.25,
            transition: 'opacity 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}
