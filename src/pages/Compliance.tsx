import { useState, useMemo } from 'react';
import {
  obligations,
  helpLinks,
  type ComplianceObligation,
} from '../data/cathedralGreen';

/* ------------------------------------------------------------------ */
/*  Colours & shared styles                                            */
/* ------------------------------------------------------------------ */

const TEAL = '#2A5B6C';
const AMBER = '#E8913A';
const warmBg = '#F8F7F5';

const sectionCard: React.CSSProperties = {
  background: '#FAFAF8',
  borderRadius: 14,
  padding: '32px 36px',
  marginBottom: 28,
  border: '1px solid #E8E6E1',
};

const sectionHeading: React.CSSProperties = {
  color: TEAL,
  fontSize: 21,
  fontWeight: 600,
  margin: '0 0 8px 0',
  lineHeight: 1.3,
};

const bodyText: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: '#2D3748',
  margin: '0 0 14px 0',
  fontWeight: 400,
};

const subtleNote: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.55,
  color: '#718096',
  margin: '6px 0 0 0',
};

/* ------------------------------------------------------------------ */
/*  Map obligation IDs to friendly, human-readable descriptions        */
/* ------------------------------------------------------------------ */

const friendlyTitle: Record<string, string> = {
  OBL_001: 'The asbestos check is overdue',
  OBL_002: 'Fire doors are being installed at Flats 4 and 5',
  OBL_003: 'The communal lighting needs checking',
  OBL_004: 'A bat survey is needed before any roof works',
  OBL_005: 'We need to check with Cadw about Listed Building Consent',
  OBL_006: 'The Section 20 consultation needs to happen before roof works',
  OBL_007: 'Service charge demands sent to everyone',
  OBL_008: 'Insurance is up to date',
  OBL_009: "Directors' insurance is in place",
  OBL_010: 'Companies House filings are coming up',
  OBL_011: "The electrical wiring hasn\u2019t been inspected recently",
  OBL_012: 'Energy Performance Certificates may need renewing',
  OBL_013: 'Gas safety is each flat owner\u2019s responsibility',
  OBL_014: 'Lead pipes serving Flats 3\u20135 should be replaced at some point',
  OBL_015: 'An independent surveyor is looking at Flat 4',
  OBL_016: 'Interim repairs are underway for the water getting into Flat 4',
  OBL_017: 'We need at least two quotes for the roof works',
  OBL_018: 'LPE1 disclosure policy agreed',
  OBL_019: 'The fire safety policy is being drafted',
};

const friendlyExplanation: Record<string, string> = {
  OBL_001:
    'The roof slates may contain asbestos. The law says this must be checked every two years, and it was last done in 2017. It needs rebooking before any roof work can start.',
  OBL_002:
    'The fire safety check in December found that Flats 4 and 5 need proper fire doors. Nigel Barnes is doing the work \u2014 it\u2019s being paid for privately by the leaseholders, not from the service charge.',
  OBL_003:
    'The fire safety check flagged that the communal lighting might not be bright enough, especially for emergencies. Worth getting an electrician to take a look.',
  OBL_004:
    'Because the building is old and has roof voids, there could be bats roosting up there. It\u2019s illegal to disturb them without a survey first. Surveys can only happen between April and September.',
  OBL_005:
    'The building is Grade II listed, so any changes to the roof may need formal consent from Cadw and Cardiff Council. We\u2019re checking whether composite slates count as like-for-like.',
  OBL_006:
    'When building work costs more than \u00A3250 per flat, you have to formally consult all leaseholders first. This is a two-stage letter-writing process with 30-day waiting periods.',
  OBL_007:
    'Service charge demands were sent on 20 March 2026 \u2014 \u00A3125/month from April. The bilingual Summary of Rights was included as required.',
  OBL_008:
    'Allianz policy BB28285956, \u00A33,177/year via Thomas Carroll Brokers. Covers buildings reinstatement, liability, and terrorism. Renewed May 2025.',
  OBL_009:
    'AXA policy AC DIR 4685729, \u00A3202/year, \u00A3500,000 cover. Protects all five directors personally.',
  OBL_010:
    'The annual confirmation statement and micro-entity accounts need filing. Huw Aled (your accountant) is helping with this.',
  OBL_011:
    'There\u2019s no record of an electrical inspection in the communal areas. The building survey and insurance schedule both flagged this. It should be done every five years.',
  OBL_012:
    'EPCs are valid for 10 years and are needed whenever a flat is sold or let. Each leaseholder is responsible for their own, but the company should keep a register.',
  OBL_013:
    'Each flat has its own gas boiler, so safety checks are the individual owner\u2019s responsibility. If a flat is rented out (like Flat 4), the landlord must get an annual gas safety certificate.',
  OBL_014:
    'The building survey found lead pipes supplying Flats 3\u20135. Welsh regulations set a strict limit on lead in drinking water. Worth talking to Welsh Water about replacement.',
  OBL_015:
    'The board voted to get an independent surveyor to look at the water damage in Flat 4. Daniel declared a conflict of interest because Flat 5\u2019s roof drains into Flat 4\u2019s guttering.',
  OBL_016:
    'Quick repairs for the water getting into Flat 4 were authorised at the board meeting. These don\u2019t depend on the bigger roof project. Nigel Barnes inspected on 18 March.',
  OBL_017:
    'Welsh law says you need at least two quotes for major works, including one from a contractor with no connection to any director. The old quote from Cardiff & Vale Roofing has expired.',
  OBL_018:
    'The board agreed a standing policy for handling LPE1 disclosure requests \u2014 these come up when flats are sold. Relevant now that Flat 1 is on the market.',
  OBL_019:
    'A formal fire safety policy is being prepared based on the December fire risk assessment. It needs formal board adoption.',
};

const friendlyCta: Record<string, { label: string; href?: string }> = {
  OBL_001: { label: 'Book an inspection \u2192' },
  OBL_004: { label: 'Find an ecologist \u2192' },
  OBL_005: { label: 'Learn about Listed Building Consent \u2192', href: 'https://cadw.gov.wales/advice-support/historic-assets/listed-buildings' },
  OBL_010: { label: 'File at Companies House \u2192', href: 'https://www.gov.uk/file-your-company-annual-accounts' },
  OBL_011: { label: 'Book an electrical inspection \u2192' },
};

const friendlyComplete: Record<string, string> = {
  OBL_007: 'Service charge demands sent to everyone \u2014 \u00A3125/month from April 2026',
  OBL_008: 'Insurance is up to date \u2014 Allianz, renewed May 2025',
  OBL_009: "Directors' insurance in place \u2014 AXA, \u00A3500k cover",
  OBL_018: 'LPE1 disclosure policy agreed \u2014 for when flats are sold',
};

/* ------------------------------------------------------------------ */
/*  Map obligations to relevant help links                             */
/* ------------------------------------------------------------------ */

function getHelpLink(obl: ComplianceObligation): { title: string; url: string; source: string } | null {
  const combined = (obl.title + ' ' + obl.description).toLowerCase();

  if (combined.includes('section 20') || combined.includes('consultation')) {
    const link = helpLinks.find((h) => h.id === 'HELP_002');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  if (combined.includes('service charge')) {
    const link = helpLinks.find((h) => h.id === 'HELP_001');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  if (combined.includes('fire') || combined.includes('fire safety')) {
    const link = helpLinks.find((h) => h.id === 'HELP_007');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  if (combined.includes('asbestos')) {
    const link = helpLinks.find((h) => h.id === 'HELP_008');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  if (combined.includes('listed building') || combined.includes('cadw')) {
    const link = helpLinks.find((h) => h.id === 'HELP_009');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  if (combined.includes('companies house') || combined.includes('confirmation statement')) {
    const link = helpLinks.find((h) => h.id === 'HELP_010');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  if (combined.includes('insurance')) {
    const link = helpLinks.find((h) => h.id === 'HELP_012');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Derivation chain — friendly readable version                       */
/* ------------------------------------------------------------------ */

function friendlyChain(chain: string[]): string {
  return chain
    .map((step) => {
      // Turn "SURVEY[asbestos_management_2017] → FINDING[presumed_ACMs_roof_slates]"
      // into something like "The asbestos survey (2017) found presumed asbestos in roof slates"
      return step
        .replace(/SURVEY\[(.+?)\]/g, 'The $1 survey')
        .replace(/REGULATION\[(.+?)\]/g, 'The law ($1)')
        .replace(/LEGISLATION\[(.+?)\]/g, 'The law ($1)')
        .replace(/POLICY\[(.+?)\]/g, 'Our policy ($1)')
        .replace(/WORKS\[(.+?)\]/g, 'The proposed works ($1)')
        .replace(/FINDING\[(.+?)\]/g, 'found $1')
        .replace(/DUTY\[(.+?)\]/g, 'requires $1')
        .replace(/REQUIREMENT\[(.+?)\]/g, 'requires $1')
        .replace(/STATUS\[(.+?)\]/g, 'Status: $1')
        .replace(/PREREQUISITE\[(.+?)\]/g, 'prerequisite: $1')
        .replace(/RESOLUTION\[(.+?)\]/g, 'Board resolution $1')
        .replace(/AUTHORISATION\[(.+?)\]/g, 'authorised $1')
        .replace(/BUILDING\[(.+?)\]/g, 'The building ($1)')
        .replace(/RISK\[(.+?)\]/g, 'risk: $1')
        .replace(/OFFENCE\[(.+?)\]/g, 'offence: $1')
        .replace(/CONSTRAINT\[(.+?)\]/g, 'Constraint: $1')
        .replace(/SCHEDULING\[(.+?)\]/g, '$1')
        .replace(/COMPANY\[(.+?)\]/g, 'Company ($1)')
        .replace(/OBLIGATION\[(.+?)\]/g, 'requires $1')
        .replace(/BEST_PRACTICE\[(.+?)\]/g, 'Best practice: $1')
        .replace(/COVER\[(.+?)\]/g, 'cover: $1')
        .replace(/BROKER\[(.+?)\]/g, 'Broker: $1')
        .replace(/RENEWAL\[(.+?)\]/g, 'renewed $1')
        .replace(/FILING\[(.+?)\]/g, 'filing: $1')
        .replace(/DOCUMENT\[(.+?)\]/g, 'Document: $1')
        .replace(/FORMAT\[(.+?)\]/g, 'format: $1')
        .replace(/LEGAL_INSTRUMENT\[(.+?)\]/g, 'The law ($1)')
        .replace(/QUESTION\[(.+?)\]/g, 'question: $1')
        .replace(/AUTHORITY\[(.+?)\]/g, 'Authority: $1')
        .replace(/DECISION\[(.+?)\]/g, '$1')
        .replace(/TRIGGER\[(.+?)\]/g, 'triggers $1')
        .replace(/PROCESS\[(.+?)\]/g, 'process: $1')
        .replace(/ACTION\[(.+?)\]/g, 'Action: $1')
        .replace(/OWNER\[(.+?)\]/g, 'owner: $1')
        .replace(/FRA\[(.+?)\]/g, 'Fire risk assessment ($1)')
        .replace(/QUOTE\[(.+?)\]/g, 'Quote: $1')
        .replace(/ARRANGEMENT\[(.+?)\]/g, '$1')
        .replace(/CONDITION\[(.+?)\]/g, 'Condition: $1')
        .replace(/CONTRACTOR\[(.+?)\]/g, 'Contractor: $1')
        .replace(/INSPECTION\[(.+?)\]/g, 'inspected $1')
        .replace(/EXISTING_QUOTE\[(.+?)\]/g, 'Existing quote: $1')
        .replace(/INSURANCE\[(.+?)\]/g, 'Insurance ($1)')
        .replace(/NOTE\[(.+?)\]/g, 'notes $1')
        .replace(/STANDARD\[(.+?)\]/g, 'Standard ($1)')
        .replace(/RECOMMENDATION\[(.+?)\]/g, 'recommends $1')
        .replace(/VALIDITY\[(.+?)\]/g, 'Valid for $1')
        .replace(/CHECK\[(.+?)\]/g, 'check $1')
        .replace(/RESPONSIBILITY\[(.+?)\]/g, 'Responsibility: $1')
        .replace(/COMPANY_ROLE\[(.+?)\]/g, 'company role: $1')
        .replace(/HEALTH_RISK\[(.+?)\]/g, 'Health risk: $1')
        .replace(/PARTIES\[(.+?)\]/g, 'parties: $1')
        .replace(/UNIT\[(.+?)\]/g, 'Unit: $1')
        .replace(/LANDLORD_OBLIGATION\[(.+?)\]/g, 'landlord must: $1')
        .replace(/ISSUE\[(.+?)\]/g, 'Issue: $1')
        .replace(/CAUSE\[(.+?)\]/g, 'cause: $1')
        .replace(/CONFLICT\[(.+?)\]/g, 'Conflict: $1')
        .replace(/DECLARED\[(.+?)\]/g, 'declared $1')
        .replace(/SCOPE\[(.+?)\]/g, 'Scope: $1')
        .replace(/APPLICABLE\[(.+?)\]/g, 'applies to $1')
        .replace(/_/g, ' ')
        .replace(/ → /g, ' \u2192 ');
    })
    .join(' \u2192 ');
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function AttentionCard({ obl }: { obl: ComplianceObligation }) {
  const [showChain, setShowChain] = useState(false);
  const isOverdue = obl.status === 'overdue';
  const dotColor = isOverdue ? '#EF4444' : '#F59E0B';
  const bgColor = isOverdue ? '#FEF2F2' : '#FFFBEB';
  const borderColor = isOverdue ? '#FECACA' : '#FDE68A';
  const title = friendlyTitle[obl.id] || obl.title;
  const explanation = friendlyExplanation[obl.id] || obl.description;
  const cta = friendlyCta[obl.id];
  const helpLink = getHelpLink(obl);

  return (
    <div
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 12,
        padding: '20px 24px',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: dotColor,
            marginTop: 6,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1A2636', lineHeight: 1.4, marginBottom: 6 }}>
            {title}
          </div>
          <div style={{ ...bodyText, margin: 0, marginBottom: 8 }}>{explanation}</div>
          <div style={{ fontSize: 13, color: '#718096', marginBottom: 10 }}>
            Who's on it: {obl.responsibleParty}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {cta && (
              <a
                href={cta.href || '#'}
                onClick={cta.href ? undefined : (e) => e.preventDefault()}
                style={{
                  display: 'inline-block',
                  background: AMBER,
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease',
                }}
              >
                {cta.label}
              </a>
            )}
            {helpLink && (
              <a
                href={helpLink.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: TEAL, textDecoration: 'none', fontWeight: 500 }}
              >
                Free advice from {helpLink.source} {'\u2192'}
              </a>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <span
              onClick={() => setShowChain(!showChain)}
              style={{
                fontSize: 13,
                color: '#94A3B8',
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              {showChain ? 'Hide details \u25B4' : 'Why is this needed? \u25BE'}
            </span>
            {showChain && (
              <div
                style={{
                  marginTop: 10,
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: 8,
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: '#4A5568',
                }}
              >
                {friendlyChain(obl.derivationChain)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InProgressCard({ obl }: { obl: ComplianceObligation }) {
  const [showChain, setShowChain] = useState(false);
  const title = friendlyTitle[obl.id] || obl.title;
  const explanation = friendlyExplanation[obl.id] || obl.description;
  const helpLink = getHelpLink(obl);

  return (
    <div
      style={{
        background: '#F0F9FF',
        border: '1px solid #BAE6FD',
        borderRadius: 12,
        padding: '20px 24px',
        marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#3B82F6',
            marginTop: 6,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#1A2636', lineHeight: 1.4, marginBottom: 6 }}>
            {title}
          </div>
          <div style={{ ...bodyText, margin: 0, marginBottom: 8 }}>{explanation}</div>
          <div style={{ fontSize: 13, color: '#718096', marginBottom: 6 }}>
            Who's on it: {obl.responsibleParty}
          </div>
          {helpLink && (
            <a
              href={helpLink.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, color: TEAL, textDecoration: 'none', fontWeight: 500 }}
            >
              Free advice from {helpLink.source} {'\u2192'}
            </a>
          )}
          <div style={{ marginTop: 10 }}>
            <span
              onClick={() => setShowChain(!showChain)}
              style={{ fontSize: 13, color: '#94A3B8', cursor: 'pointer' }}
            >
              {showChain ? 'Hide details \u25B4' : 'Why is this needed? \u25BE'}
            </span>
            {showChain && (
              <div
                style={{
                  marginTop: 10,
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.6)',
                  borderRadius: 8,
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: '#4A5568',
                }}
              >
                {friendlyChain(obl.derivationChain)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Compliance() {
  const { overdueItems, dueSoonItems, inProgressItems, completeItems, notStartedItems } = useMemo(() => {
    return {
      overdueItems: obligations.filter((o) => o.status === 'overdue'),
      dueSoonItems: obligations.filter((o) => o.status === 'due_soon'),
      inProgressItems: obligations.filter((o) => o.status === 'in_progress'),
      completeItems: obligations.filter((o) => o.status === 'complete'),
      notStartedItems: obligations.filter((o) => o.status === 'not_started'),
    };
  }, []);

  const attentionItems = [...overdueItems, ...dueSoonItems];

  return (
    <div style={{ padding: '0 0 56px', maxWidth: 720 }}>
      {/* Page heading */}
      <h1 style={{ color: TEAL, fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>
        Building health
      </h1>
      <p style={{ ...bodyText, color: '#718096', marginBottom: 32 }}>
        Here's how your building is doing &mdash; and what needs attention.
      </p>

      {/* ============================================================ */}
      {/* Section 1: Things that need attention                         */}
      {/* ============================================================ */}
      {attentionItems.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={sectionHeading}>Things that need attention</h2>
          <p style={{ ...subtleNote, marginBottom: 18 }}>
            {attentionItems.length === 1
              ? 'There\u2019s one thing that needs looking at.'
              : `There are ${attentionItems.length} things that need looking at.`}
          </p>
          {attentionItems.map((obl) => (
            <AttentionCard key={obl.id} obl={obl} />
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* Section 2: Things being sorted                                */}
      {/* ============================================================ */}
      {inProgressItems.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={sectionHeading}>Things being sorted</h2>
          <p style={{ ...subtleNote, marginBottom: 18 }}>
            Work is happening on these &mdash; nothing more you need to do right now.
          </p>
          {inProgressItems.map((obl) => (
            <InProgressCard key={obl.id} obl={obl} />
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* Section 3: All taken care of                                  */}
      {/* ============================================================ */}
      {completeItems.length > 0 && (
        <div style={sectionCard}>
          <h2 style={sectionHeading}>All taken care of</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
            {completeItems.map((obl) => (
              <div key={obl.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ color: '#10B981', fontSize: 16, marginTop: 1, flexShrink: 0 }}>
                  {'\u2713'}
                </span>
                <span style={{ fontSize: 15, color: '#2D3748', lineHeight: 1.6, fontWeight: 400 }}>
                  {friendlyComplete[obl.id] || `${friendlyTitle[obl.id] || obl.title}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* Section 4: On the list for later                              */}
      {/* ============================================================ */}
      {notStartedItems.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ ...sectionHeading, color: '#718096', fontSize: 18 }}>On the list for later</h2>
          <p style={{ ...subtleNote, marginBottom: 16 }}>
            These aren't urgent, but they'll need doing at some point.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notStartedItems.map((obl) => {
              const helpLink = getHelpLink(obl);
              return (
                <div
                  key={obl.id}
                  style={{
                    padding: '14px 18px',
                    background: warmBg,
                    borderRadius: 10,
                    border: '1px solid #EDE9E3',
                  }}
                >
                  <div style={{ fontSize: 15, color: '#4A5568', lineHeight: 1.6, fontWeight: 400 }}>
                    {friendlyExplanation[obl.id]
                      ? friendlyTitle[obl.id]
                      : obl.title}
                  </div>
                  <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
                    {friendlyExplanation[obl.id] && (
                      <span>{friendlyExplanation[obl.id]}</span>
                    )}
                  </div>
                  {helpLink && (
                    <a
                      href={helpLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 13,
                        color: TEAL,
                        textDecoration: 'none',
                        fontWeight: 500,
                        display: 'inline-block',
                        marginTop: 6,
                      }}
                    >
                      Free advice from {helpLink.source} {'\u2192'}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
        <h2 style={{ ...sectionHeading, fontSize: 18 }}>Not sure about something?</h2>
        <p style={{ ...bodyText, color: '#718096' }}>
          LEASE provides free, independent advice for leaseholders &mdash;{' '}
          <a
            href="https://www.lease-advice.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: TEAL, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}
          >
            visit lease-advice.org {'\u2192'}
          </a>
        </p>
      </div>
    </div>
  );
}
