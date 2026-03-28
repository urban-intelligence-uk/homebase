import { useState, useMemo } from 'react';
import {
  workflows,
  helpLinks,
  type ComplianceWorkflow,
} from '../data/cathedralGreen';

/* ------------------------------------------------------------------ */
/*  Colours & shared styles                                            */
/* ------------------------------------------------------------------ */

const TEAL = '#2A5B6C';
const AMBER = '#E8913A';

const bodyText: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: '#2D3748',
  margin: '0 0 14px 0',
  fontWeight: 400,
};

const sectionHeading: React.CSSProperties = {
  color: TEAL,
  fontSize: 21,
  fontWeight: 600,
  margin: '0 0 6px 0',
  lineHeight: 1.3,
};

/* ------------------------------------------------------------------ */
/*  Friendly content for each workflow                                 */
/* ------------------------------------------------------------------ */

const guideIntro: Record<string, { title: string; subtitle: string; intro: string }> = {
  'WF-001': {
    title: 'How to consult leaseholders about major works (Section 20)',
    subtitle: 'For the roof replacement project',
    intro:
      'When you need to do building work that costs more than \u00A3250 per flat, you need to formally consult everyone first. It sounds complicated, but it\u2019s really just a two-stage letter-writing process. Here\u2019s how it works.',
  },
  'WF-002': {
    title: 'What to do after a fire safety check',
    subtitle: 'Following up on the December 2025 fire risk assessment',
    intro:
      'After a fire risk assessment, the management company needs to act on whatever the assessor found. For your building, the main things were fire doors and communal lighting. Here\u2019s where we are.',
  },
  'WF-003': {
    title: 'How service charge demands work',
    subtitle: 'Getting this right means your demands are actually enforceable',
    intro:
      'Service charges are how the building pays its bills. There\u2019s a legal process for demanding them \u2014 get it wrong and you can\u2019t recover the money. The good news is that HomeBase handles most of this for you.',
  },
  'WF-004': {
    title: 'Keeping Companies House up to date',
    subtitle: 'Your management company is a real company \u2014 it has filing obligations',
    intro:
      'Cathedral Green Management Company Limited is registered at Companies House. That means certain things need filing every year. It\u2019s not complicated, but it is important \u2014 late filing is technically a criminal offence for directors.',
  },
};

const friendlySteps: Record<string, Record<string, string>> = {
  'WF-001': {
    'WF-001-S1': 'Get the board to agree to proceed with the roof works and start the consultation process.',
    'WF-001-S2': 'Write up a clear description of what work is needed, based on the survey. This is what leaseholders and contractors will price against.',
    'WF-001-S3': 'Write to all leaseholders explaining what you want to do and asking for their thoughts. They get 30 days to respond and can suggest contractors.',
    'WF-001-S4': 'Wait 30 days for everyone to come back with their observations and contractor suggestions.',
    'WF-001-S5': 'Look at what everyone said and get at least two quotes \u2014 including one from a company that no director has a connection to.',
    'WF-001-S6': 'Share the quotes with everyone, along with a summary of what people said in round 1. Another 30 days for comments.',
    'WF-001-S7': 'Wait 30 days for everyone\u2019s feedback on the quotes.',
    'WF-001-S8': 'Consider everyone\u2019s feedback. If you don\u2019t pick the cheapest contractor, you need to explain why in writing.',
    'WF-001-S9': 'Hire the contractor and let everyone know. If the chosen contractor wasn\u2019t the cheapest, send written reasons within 21 days.',
  },
  'WF-002': {
    'WF-002-S1': 'Get a qualified fire risk assessor to inspect the communal areas.',
    'WF-002-S2': 'Go through the report, work out what needs doing, and decide who\u2019s responsible for each action.',
    'WF-002-S3': 'Get the urgent things done \u2014 fire doors for Flats 4 and 5, and check the communal lighting.',
    'WF-002-S4': 'Keep a written record of everything you\u2019ve done, with dates and evidence. This is your proof that you took it seriously.',
    'WF-002-S5': 'Book the next fire risk assessment \u2014 at least every 3 years, or sooner if you do major works like the roof.',
  },
  'WF-003': {
    'WF-003-S1': 'The board formally agrees how much the service charge should be, backed by a budget.',
    'WF-003-S2': 'Prepare the demand letter with the company\u2019s name, address, amount, and payment terms.',
    'WF-003-S3': 'Attach the bilingual Summary of Rights and Obligations \u2014 this is mandatory in Wales.',
    'WF-003-S4': 'Send the demand to every leaseholder, including absentee landlords (via their letting agents).',
    'WF-003-S5': 'Service charge money must be kept in a separate bank account \u2014 it legally belongs to all of you.',
    'WF-003-S6': 'Make sure you demand costs within 18 months of incurring them \u2014 after that, you lose the right to recover them.',
  },
  'WF-004': {
    'WF-004-S1': 'File the annual confirmation statement \u2014 this confirms your directors, registered office, and other details are correct.',
    'WF-004-S2': 'File the annual accounts \u2014 micro-entity accounts are fine for your management company.',
    'WF-004-S3': 'All directors need to verify their identity on Companies House.',
    'WF-004-S4': 'Keep your statutory registers up to date \u2014 members, directors, and people with significant control.',
    'WF-004-S5': 'If anything changes (new director, someone sells their flat), notify Companies House within 14 days.',
  },
};

const importantThings: Record<string, string[]> = {
  'WF-001': [
    'If you skip this process, you can only recover \u00A3250 per flat from the service charge \u2014 even if the work costs much more. So it\u2019s worth doing properly.',
  ],
  'WF-002': [
    'The management company is the "Responsible Person" under fire safety law. Directors carry personal liability for fire safety in communal areas.',
  ],
  'WF-003': [
    'Without the Summary of Rights attached, the demand isn\u2019t enforceable. This is the single most common mistake in service charge administration.',
    'If you don\u2019t demand costs within 18 months of incurring them, you lose the right to recover them permanently.',
  ],
  'WF-004': [
    'Late filing is a criminal offence \u2014 each director is personally liable. The company could also be struck off, which would cause real problems for everyone.',
  ],
};

const conciergeOffer: Record<string, string> = {
  'WF-001': 'HomeBase can generate the consultation letters for you, pre-filled with your building\u2019s details.',
  'WF-003': 'HomeBase handles the service charge demands automatically \u2014 including the bilingual summary required in Wales.',
  'WF-004': 'HomeBase will remind you when filings are due and can help you prepare the paperwork.',
};

/* ------------------------------------------------------------------ */
/*  Map workflow to LEASE help link                                    */
/* ------------------------------------------------------------------ */

function getLeaseLink(wf: ComplianceWorkflow): { title: string; url: string; source: string } | null {
  const titleLower = wf.title.toLowerCase();
  if (wf.category === 'consultation' || titleLower.includes('section 20')) {
    const link = helpLinks.find((h) => h.id === 'HELP_002');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  if (wf.category === 'safety' || titleLower.includes('fire')) {
    const link = helpLinks.find((h) => h.id === 'HELP_007');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  if (wf.category === 'company') {
    const link = helpLinks.find((h) => h.id === 'HELP_010');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  if (wf.category === 'financial' || titleLower.includes('service charge')) {
    const link = helpLinks.find((h) => h.id === 'HELP_001');
    if (link) return { title: link.title, url: link.url, source: link.source };
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Guide card component                                               */
/* ------------------------------------------------------------------ */

function GuideCard({ workflow }: { workflow: ComplianceWorkflow }) {
  const [expanded, setExpanded] = useState(false);
  const guide = guideIntro[workflow.id];
  const steps = friendlySteps[workflow.id] || {};
  const warnings = importantThings[workflow.id] || [];
  const offer = conciergeOffer[workflow.id];
  const leaseLink = getLeaseLink(workflow);

  const completeCount = workflow.steps.filter((s) => s.status === 'complete').length;
  const totalSteps = workflow.steps.length;
  const progressPct = Math.round((completeCount / totalSteps) * 100);

  const title = guide?.title || workflow.title;
  const subtitle = guide?.subtitle || workflow.description;

  return (
    <div
      style={{
        background: '#FAFAF8',
        border: '1px solid #E8E6E1',
        borderRadius: 14,
        marginBottom: 20,
        overflow: 'hidden',
      }}
    >
      {/* Header (always visible) */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '24px 28px',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F3F2EF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: TEAL, margin: '0 0 4px', lineHeight: 1.35 }}>
              {title}
            </h3>
            <div style={{ fontSize: 14, color: '#718096', lineHeight: 1.5 }}>
              {subtitle}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEAL }}>
              {completeCount} of {totalSteps} steps done
            </div>
            {/* Simple progress bar */}
            <div
              style={{
                width: 100,
                height: 6,
                background: '#E2E8F0',
                borderRadius: 3,
                overflow: 'hidden',
                marginTop: 6,
              }}
            >
              <div
                style={{
                  width: `${progressPct}%`,
                  height: '100%',
                  background: progressPct === 100 ? '#10B981' : TEAL,
                  borderRadius: 3,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 8 }}>
          {expanded ? 'Click to collapse \u25B4' : 'Click to read the guide \u25BE'}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '0 28px 28px' }}>
          {/* Intro */}
          {guide?.intro && (
            <p style={{ ...bodyText, marginBottom: 24 }}>{guide.intro}</p>
          )}

          {/* Steps as a friendly numbered list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
            {workflow.steps.map((step, idx) => {
              const isDone = step.status === 'complete';
              const isCurrent = step.status === 'current';
              const emoji = isDone ? '\u2705' : isCurrent ? '\uD83D\uDCDD' : `${idx + 1}.`;
              const friendlyDesc = steps[step.id] || step.description;

              return (
                <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span
                    style={{
                      fontSize: isDone || isCurrent ? 16 : 15,
                      fontWeight: isDone || isCurrent ? 400 : 600,
                      color: isDone ? '#10B981' : isCurrent ? AMBER : TEAL,
                      minWidth: 28,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {emoji}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: isDone ? '#94A3B8' : '#1A2636',
                        textDecoration: isDone ? 'line-through' : 'none',
                        lineHeight: 1.4,
                        marginBottom: 2,
                      }}
                    >
                      {step.title}
                      {step.completedDate && (
                        <span style={{ fontSize: 13, fontWeight: 400, color: '#94A3B8', marginLeft: 8 }}>
                          Done {step.completedDate}
                        </span>
                      )}
                      {isCurrent && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: AMBER,
                            marginLeft: 8,
                            textTransform: 'uppercase' as const,
                            letterSpacing: '0.03em',
                          }}
                        >
                          you are here
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: isDone ? '#94A3B8' : '#4A5568',
                        lineHeight: 1.6,
                        fontWeight: 400,
                      }}
                    >
                      {friendlyDesc}
                    </div>
                    {step.notes && !isDone && (
                      <div style={{ fontSize: 13, color: '#718096', marginTop: 4, fontStyle: 'italic' }}>
                        {step.notes}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Important things to know */}
          {warnings.length > 0 && (
            <div
              style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: 10,
                padding: '16px 20px',
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 600, color: '#92400E', marginBottom: 8 }}>
                {'\uD83D\uDCA1'} Important things to know
              </div>
              {warnings.map((w, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.65, color: '#78350F', margin: i < warnings.length - 1 ? '0 0 8px' : 0 }}>
                  {w}
                </p>
              ))}
            </div>
          )}

          {/* Concierge offer */}
          {offer && (
            <div
              style={{
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                borderRadius: 10,
                padding: '16px 20px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: '#1E40AF', lineHeight: 1.6, marginBottom: 10 }}>
                  {offer}
                </div>
                {workflow.id === 'WF-001' && (
                  <button
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: AMBER,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 20px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'opacity 0.15s ease',
                    }}
                  >
                    Generate Section 20 letters {'\u2192'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* LEASE link */}
          {leaseLink && (
            <div style={{ marginBottom: 4 }}>
              <a
                href={leaseLink.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 14,
                  color: TEAL,
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Free advice from {leaseLink.source}: {leaseLink.title} {'\u2192'}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Workflows() {
  const totalSteps = useMemo(
    () => workflows.reduce((acc, wf) => acc + wf.steps.length, 0),
    [],
  );
  const completedSteps = useMemo(
    () => workflows.reduce((acc, wf) => acc + wf.steps.filter((s) => s.status === 'complete').length, 0),
    [],
  );

  return (
    <div style={{ padding: '0 0 56px', maxWidth: 720 }}>
      {/* Page heading */}
      <h1 style={{ color: TEAL, fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>
        How-to guides
      </h1>
      <p style={{ ...bodyText, color: '#718096', marginBottom: 32 }}>
        Step-by-step help for the things that feel complicated. We'll walk you through it.
      </p>

      {/* Overall progress */}
      <div
        style={{
          background: '#F0F9FF',
          border: '1px solid #BAE6FD',
          borderRadius: 12,
          padding: '16px 20px',
          marginBottom: 28,
          fontSize: 15,
          color: '#1E40AF',
          lineHeight: 1.6,
        }}
      >
        Across all {workflows.length} guides, you've completed {completedSteps} of {totalSteps} steps.
        {completedSteps > totalSteps / 2
          ? ' You\u2019re more than halfway there.'
          : ' There\u2019s a bit to do, but we\u2019ll help you through it.'}
      </div>

      {/* Guide cards */}
      {workflows.map((wf) => (
        <GuideCard key={wf.id} workflow={wf} />
      ))}

      {/* Need help? */}
      <div
        style={{
          background: '#F7F7F5',
          borderRadius: 14,
          border: '1px solid #E8E6E1',
          textAlign: 'center' as const,
          padding: '28px 36px',
          marginTop: 8,
        }}
      >
        <h2 style={{ ...sectionHeading, fontSize: 18 }}>Need help?</h2>
        <p style={{ ...bodyText, color: '#718096' }}>
          Got questions about any of this?
          <br />
          LEASE provides free, expert advice for leaseholders &mdash;{' '}
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
