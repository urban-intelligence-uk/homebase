import { useState, useMemo } from 'react';
import { documents } from '../data/cathedralGreen';
import dayjs from 'dayjs';

/* ------------------------------------------------------------------ */
/*  Constants & shared styles                                          */
/* ------------------------------------------------------------------ */

const TEAL = '#2A5B6C';

const sectionCard: React.CSSProperties = {
  background: '#FAFAF8',
  borderRadius: 14,
  padding: '32px 36px',
  marginBottom: 28,
  border: '1px solid #E8E6E1',
};

const blueCard: React.CSSProperties = {
  ...sectionCard,
  background: '#F0F6F8',
  border: '1px solid #D0DEE3',
};

const sectionHeading: React.CSSProperties = {
  color: TEAL,
  fontSize: 21,
  fontWeight: 600,
  margin: '0 0 16px 0',
  lineHeight: 1.3,
};

const bodyText: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: '#2D3748',
  margin: '0 0 14px 0',
};

const subtleNote: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.55,
  color: '#718096',
  margin: '12px 0 0 0',
};

const docCard: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: 10,
  padding: '16px 20px',
  border: '1px solid #E8E6E1',
  marginBottom: 10,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
};

/* ------------------------------------------------------------------ */
/*  Document groupings (hand-curated for warmth)                       */
/* ------------------------------------------------------------------ */

interface DocEntry {
  id: string;
  emoji: string;
  title: string;
  date: string;
  description: string;
  source: string;
}

const aboutBuilding: DocEntry[] = [
  {
    id: 'DOC_006',
    emoji: '\uD83C\uDFE0',
    title: 'Building survey',
    date: 'October 2024',
    description: 'The most detailed assessment of the building\u2019s condition',
    source: 'Lapider Chartered Surveyors',
  },
  {
    id: 'DOC_009',
    emoji: '\uD83D\uDCCB',
    title: 'Management plan',
    date: 'March 2026 (v2.3)',
    description: 'Our plan for looking after the building over the next 5 years',
    source: 'Daniel',
  },
  {
    id: 'DOC_007',
    emoji: '\uD83D\uDD25',
    title: 'Fire safety check',
    date: 'December 2025',
    description: 'Checked the communal areas, fire doors, and escape routes',
    source: 'Capital Fire Protection',
  },
  {
    id: 'DOC_023',
    emoji: '\uD83C\uDFDA\uFE0F',
    title: 'Roof survey',
    date: 'August 2024',
    description: 'Detailed condition assessment of the roof',
    source: 'Cardiff & Vale Roofing',
  },
];

const insuranceAndMoney: DocEntry[] = [
  {
    id: 'DOC_015',
    emoji: '\uD83D\uDEE1\uFE0F',
    title: 'Buildings insurance',
    date: 'Renewed May 2025',
    description: 'Covers the building\u2019s structure (Allianz)',
    source: 'Thomas Carroll Brokers',
  },
  {
    id: 'DOC_016',
    emoji: '\uD83D\uDEE1\uFE0F',
    title: 'Directors\u2019 insurance',
    date: 'May 2025',
    description: 'Protects us as volunteer directors (AXA)',
    source: 'Thomas Carroll Brokers',
  },
  {
    id: 'DOC_013',
    emoji: '\uD83D\uDCB7',
    title: 'Service charge letters',
    date: 'March 2026',
    description: 'The latest demands sent to everyone',
    source: 'Daniel',
  },
  {
    id: 'DOC_010',
    emoji: '\uD83D\uDCC8',
    title: '5-year financial scenarios',
    date: 'March 2026',
    description: 'Four scenarios for how the finances could play out',
    source: 'Daniel',
  },
];

const meetingsAndDecisions: DocEntry[] = [
  {
    id: 'DOC_012',
    emoji: '\uD83D\uDCDD',
    title: 'Board meeting minutes',
    date: '19 March 2026',
    description: 'What we discussed and agreed',
    source: 'Daniel (minute taker)',
  },
  {
    id: 'DOC_011',
    emoji: '\uD83D\uDCE8',
    title: 'Meeting notice',
    date: '11 March 2026',
    description: 'The agenda and background for the meeting',
    source: 'Daniel',
  },
];

const legalStuff: DocEntry[] = [
  {
    id: 'DOC_001',
    emoji: '\uD83D\uDCC4',
    title: 'Leases (Flats 1\u20135)',
    date: '',
    description: 'The agreements between each leaseholder and the management company',
    source: 'Land Registry',
  },
  {
    id: 'DOC_022',
    emoji: '\uD83D\uDCC4',
    title: 'Articles of Association',
    date: 'July 2003',
    description: 'The rules the company operates under',
    source: 'Cathedral Green Management Company Limited',
  },
  {
    id: 'DOC_008',
    emoji: '\u26A0\uFE0F',
    title: 'Asbestos survey',
    date: 'August 2017',
    description: 'Last check for asbestos in the building',
    source: 'Asbestos surveyor',
  },
];

/* ------------------------------------------------------------------ */
/*  Policies                                                           */
/* ------------------------------------------------------------------ */

interface PolicyEntry {
  id: string;
  title: string;
  isDraft: boolean;
}

const policies: PolicyEntry[] = [
  { id: 'DOC_018', title: 'Fire safety policy', isDraft: true },
  { id: 'DOC_019', title: 'Asbestos and water hygiene policy', isDraft: true },
  { id: 'DOC_020', title: 'Budget and financial management policy', isDraft: false },
  { id: 'DOC_021', title: 'Maintenance and repairs policy', isDraft: false },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function DocCardRow({ doc }: { doc: DocEntry }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...docCard,
        background: hovered ? '#F8F7F5' : '#FFFFFF',
        transform: hovered ? 'translateY(-1px)' : 'none',
        boxShadow: hovered ? '0 2px 8px rgba(0,0,0,0.04)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{doc.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#1A2636' }}>
              {doc.title}
            </span>
            {doc.date && (
              <span style={{ fontSize: 12, color: '#94A3B8' }}>
                {doc.date}
              </span>
            )}
          </div>
          <div style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.55, marginTop: 3 }}>
            {doc.description}
          </div>
          <div style={{ fontSize: 12, color: '#A0AEC0', marginTop: 4 }}>
            {doc.source}
          </div>
        </div>
      </div>
    </div>
  );
}

function DocGroup({
  heading,
  docs,
}: {
  heading: string;
  docs: DocEntry[];
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: TEAL,
          margin: '0 0 10px 0',
          textTransform: 'uppercase' as const,
          letterSpacing: '0.04em',
        }}
      >
        {heading}
      </h3>
      {docs.map((doc) => (
        <DocCardRow key={doc.id} doc={doc} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Documents() {
  const [searchText, setSearchText] = useState('');

  /* Search across the raw documents data */
  const searchResults = useMemo(() => {
    if (!searchText.trim()) return null;
    const lower = searchText.toLowerCase();
    return documents
      .filter(
        (d) =>
          d.title.toLowerCase().includes(lower) ||
          d.summary.toLowerCase().includes(lower) ||
          d.authorOrSource.toLowerCase().includes(lower),
      )
      .sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return dayjs(b.date).unix() - dayjs(a.date).unix();
      });
  }, [searchText]);

  return (
    <div style={{ padding: '0 0 56px', maxWidth: 720 }}>
      {/* Page intro */}
      <h1 style={{ color: TEAL, fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>
        Your building's paperwork
      </h1>
      <p style={{ ...bodyText, color: '#718096', marginBottom: 28 }}>
        Everything in one place — surveys, insurance, meeting notes, policies, and more.
      </p>

      {/* ============================================================ */}
      {/* Search                                                        */}
      {/* ============================================================ */}
      <div style={{ marginBottom: 28 }}>
        <input
          type="text"
          placeholder="Looking for something specific? Search your documents..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: 15,
            border: '1px solid #E8E6E1',
            borderRadius: 10,
            background: '#FFFFFF',
            outline: 'none',
            color: '#1A2636',
            boxSizing: 'border-box' as const,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = TEAL;
            e.currentTarget.style.boxShadow = `0 0 0 2px rgba(42,91,108,0.12)`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#E8E6E1';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* Search results (if searching)                                 */}
      {/* ============================================================ */}
      {searchResults !== null && (
        <div style={sectionCard}>
          <h2 style={sectionHeading}>
            {searchResults.length === 0
              ? 'No documents found'
              : `Found ${searchResults.length} document${searchResults.length === 1 ? '' : 's'}`}
          </h2>
          {searchResults.map((doc) => (
            <DocCardRow
              key={doc.id}
              doc={{
                id: doc.id,
                emoji: '\uD83D\uDCC4',
                title: doc.title,
                date: doc.date ? dayjs(doc.date).format('MMMM YYYY') : '',
                description: doc.summary.length > 120
                  ? doc.summary.substring(0, 120) + '...'
                  : doc.summary,
                source: doc.authorOrSource.length > 60
                  ? doc.authorOrSource.substring(0, 60) + '...'
                  : doc.authorOrSource,
              }}
            />
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* Section 1: Important documents (only show when not searching) */}
      {/* ============================================================ */}
      {searchResults === null && (
        <>
          <div style={sectionCard}>
            <h2 style={sectionHeading}>Important documents</h2>

            <DocGroup heading="About the building" docs={aboutBuilding} />
            <DocGroup heading="Insurance and money" docs={insuranceAndMoney} />
            <DocGroup heading="Meetings and decisions" docs={meetingsAndDecisions} />
            <DocGroup heading="The legal stuff" docs={legalStuff} />
          </div>

          {/* ============================================================ */}
          {/* Section 2: Policies                                          */}
          {/* ============================================================ */}
          <div style={sectionCard}>
            <h2 style={sectionHeading}>Policies</h2>

            <p style={bodyText}>
              We've put together some policies to make sure we're doing things properly:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0 0' }}>
              {policies.map((policy) => (
                <div
                  key={policy.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 16px',
                    background: '#FFFFFF',
                    borderRadius: 8,
                    border: '1px solid #E8E6E1',
                    fontSize: 15,
                    color: '#2D3748',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{'\uD83D\uDCC4'}</span>
                  <span style={{ flex: 1 }}>{policy.title}</span>
                  {policy.isDraft && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#D69E2E',
                        background: '#FFFFF0',
                        padding: '2px 8px',
                        borderRadius: 4,
                        border: '1px solid #FEFCBF',
                      }}
                    >
                      draft
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p style={subtleNote}>
              These are working documents — they'll be reviewed and updated as we go.
            </p>
          </div>

          {/* ============================================================ */}
          {/* Section 3: Property passport                                  */}
          {/* ============================================================ */}
          <div style={blueCard}>
            <h2 style={sectionHeading}>Property passport</h2>

            <p style={bodyText}>
              When someone sells their flat, the buyer's solicitor asks for a lot of information
              about the building. HomeBase can pull together everything they need automatically —
              management plan, service charges, planned works, insurance, known issues — so nobody
              has to scramble for paperwork at the last minute.
            </p>

            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: TEAL,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3A7D8E';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = TEAL;
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Preview what we'd send {'\u2192'}
            </button>

            <div
              style={{
                marginTop: 16,
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.6)',
                borderRadius: 8,
                fontSize: 13,
                lineHeight: 1.6,
                color: '#4A5568',
              }}
            >
              Flat 1 is currently listed for sale. We've agreed to be completely transparent in any
              paperwork — that protects everyone.
            </div>
          </div>

          {/* ============================================================ */}
          {/* Need help?                                                    */}
          {/* ============================================================ */}
          <div
            style={{
              ...sectionCard,
              background: '#F7F7F5',
              textAlign: 'center' as const,
              padding: '28px 36px',
            }}
          >
            <h2 style={{ ...sectionHeading, fontSize: 18 }}>Need help?</h2>
            <p style={{ ...bodyText, color: '#718096' }}>
              Got questions about your building's documents or obligations?
              <br />
              LEASE provides free, expert advice —{' '}
              <a
                href="https://www.lease-advice.org"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: TEAL,
                  fontWeight: 600,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                visit lease-advice.org {'\u2192'}
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
