import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from 'antd';
import {
  ArrowRightOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  building,
  obligations,
  actions,
  financials,
  units,
} from '../data/cathedralGreen';

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

const card: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: 16,
  padding: '28px 32px',
  border: '1px solid #EDE9E3',
  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
  marginBottom: 24,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 500,
  color: '#1A2636',
  marginBottom: 20,
  lineHeight: 1.3,
};

const warmBg = '#F8F7F5';

/* ------------------------------------------------------------------ */
/*  Timeline data (human-readable)                                     */
/* ------------------------------------------------------------------ */

const timelineItems = [
  { date: '2026-03-20', text: 'Service charge letters sent to everyone', link: '/finances' },
  { date: '2026-03-19', text: "Board meeting at Ann\u2019s flat \u2014 we agreed on the roof plan", link: '/governance' },
  { date: '2026-03-06', text: 'The Coach House next door got planning permission', link: '/documents' },
  { date: '2025-12-01', text: 'Fire safety check completed', link: '/compliance' },
  { date: '2024-10-02', text: 'Building survey done by Lapider', link: '/documents' },
];

/* ------------------------------------------------------------------ */
/*  Dashboard Component                                                */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const navigate = useNavigate();

  /* Compute obligation summaries */
  const { overdueItems, dueSoonItems, completeHighlights, overdueCount } = useMemo(() => {
    const overdue = obligations.filter((o) => o.status === 'overdue');
    const dueSoon = obligations.filter((o) => o.status === 'due_soon');
    const complete = obligations.filter((o) => o.status === 'complete');
    return {
      overdueItems: overdue,
      dueSoonItems: dueSoon,
      completeHighlights: complete,
      overdueCount: overdue.length,
    };
  }, []);

  /* Compute pending actions as friendly task list */
  const pendingActions = useMemo(() => {
    return actions.filter((a) => a.status === 'pending' || a.status === 'in_progress');
  }, []);

  /* Financial summary */
  const currentCharge = financials.serviceChargeHistory[financials.serviceChargeHistory.length - 1];
  const previousCharge = financials.serviceChargeHistory[financials.serviceChargeHistory.length - 2];
  const directorCount = units.filter((u) => u.isDirector).length;
  const occupierCount = units.filter((u) => u.isOccupier).length;

  /* Overall health message */
  const healthMessage = overdueCount > 0
    ? `Your building is mostly in good shape, but there are ${overdueCount === 1 ? 'one thing' : 'a couple of things'} that need your attention.`
    : 'Your building is in good shape. Nothing urgent right now.';

  const healthColor = overdueCount > 0 ? '#E8913A' : '#10B981';

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* ============================================================ */}
      {/*  Section 1: Welcome & Building Hero                          */}
      {/* ============================================================ */}
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 28,
          position: 'relative',
          minHeight: 320,
        }}
      >
        {/* Background photo */}
        <img
          src={`${import.meta.env.BASE_URL}images/survey-1.jpeg`}
          alt="Yr Hen Dy, The Old House"
          style={{
            width: '100%',
            height: 320,
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(26,47,56,0.92) 0%, rgba(26,47,56,0.6) 50%, rgba(26,47,56,0.2) 100%)',
          }}
        />
        {/* Text overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '32px 36px',
          }}
        >
          <h1 style={{
            fontSize: 32,
            fontWeight: 400,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.1,
            fontFamily: 'Georgia, "Times New Roman", serif',
            letterSpacing: '-0.01em',
          }}>
            Yr Hen Dy
          </h1>
          <div style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 6,
            fontWeight: 400,
          }}>
            The Old House, Cathedral Green, Llandaff
          </div>
          <div style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.5)',
            marginTop: 4,
            fontWeight: 400,
          }}>
            Grade {building.listedGrade} listed &middot; Built c.{building.yearBuilt} &middot; {building.numberOfFlats} homes
          </div>
          <div style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.4)',
            marginTop: 8,
            fontWeight: 400,
          }}>
            Managed by you and {directorCount - 1} fellow directors since 2003
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Section 2: How's your building doing?                       */}
      {/* ============================================================ */}
      <div style={card}>
        <h2 style={sectionTitle}>How&rsquo;s your building doing?</h2>

        {/* Overall health indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
          marginBottom: 24,
          padding: '16px 20px',
          background: warmBg,
          borderRadius: 12,
        }}>
          <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: healthColor,
            marginTop: 5,
            flexShrink: 0,
          }} />
          <div style={{
            fontSize: 15,
            color: '#1A2636',
            lineHeight: 1.5,
            fontWeight: 400,
          }}>
            {healthMessage}
          </div>
        </div>

        {/* Nudge items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {overdueItems.map((item) => (
            <NudgeRow
              key={item.id}
              color="#EF4444"
              onClick={() => navigate('/compliance')}
            >
              {item.id === 'OBL_001'
                ? `The asbestos check is overdue \u2014 it was last done in 2017 and should be done every 2 years. Daniel is on it.`
                : item.id === 'OBL_011'
                ? `The electrical wiring hasn\u2019t been inspected recently. Worth getting this booked in.`
                : `${item.title} needs attention \u2014 ${item.description.substring(0, 100)}`
              }
            </NudgeRow>
          ))}
          {dueSoonItems.slice(0, 1).map((item) => (
            <NudgeRow
              key={item.id}
              color="#F59E0B"
              onClick={() => navigate('/compliance')}
            >
              {item.id === 'OBL_010'
                ? `Companies House filings are coming up soon \u2014 your annual confirmation statement and accounts are due.`
                : `${item.title} is due soon.`
              }
            </NudgeRow>
          ))}
          {completeHighlights.slice(0, 2).map((item) => (
            <NudgeRow
              key={item.id}
              color="#10B981"
              onClick={() => navigate('/compliance')}
            >
              {item.id === 'OBL_008'
                ? `Insurance is up to date \u2014 Allianz, renewed May 2025`
                : item.id === 'OBL_007'
                ? `Service charges are coming in \u2014 \u00A3${currentCharge.amountPerFlat}/month from each flat from April`
                : `${item.title} \u2014 done`
              }
            </NudgeRow>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Section 3: What's happening                                 */}
      {/* ============================================================ */}
      <div style={card}>
        <h2 style={sectionTitle}>What&rsquo;s been happening</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {timelineItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.link)}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 16,
                padding: '12px 0',
                borderBottom: idx < timelineItems.length - 1 ? '1px solid #EDE9E3' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = warmBg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{
                fontSize: 13,
                color: '#94A3B8',
                whiteSpace: 'nowrap',
                minWidth: 70,
                fontWeight: 400,
              }}>
                {dayjs(item.date).format('D MMM')}
              </span>
              <span style={{
                fontSize: 14,
                color: '#1A2636',
                lineHeight: 1.5,
                fontWeight: 400,
              }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Section 4: Things to do this month                          */}
      {/* ============================================================ */}
      <div style={card}>
        <h2 style={sectionTitle}>Things to do this month</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Report prompt */}
          <div
            onClick={() => navigate('/issues')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 16px',
              background: '#EFF6FF',
              borderRadius: 10,
              cursor: 'pointer',
              border: '1px solid #DBEAFE',
              marginBottom: 4,
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
          >
            <span style={{ fontSize: 14, color: '#1E40AF', fontWeight: 400, lineHeight: 1.5 }}>
              Noticed something wrong with your flat or the building?
            </span>
            <span style={{ fontSize: 13, color: '#3B82F6', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 12 }}>
              Report it →
            </span>
          </div>
          {pendingActions.slice(0, 8).map((action) => (
            <TaskRow key={action.id} action={action} />
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Section 5: Your building at a glance                        */}
      {/* ============================================================ */}
      <div style={card}>
        <h2 style={sectionTitle}>Your building at a glance</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <GlanceLine>{building.numberOfFlats} flats, {directorCount} directors, {occupierCount} owner-occupiers</GlanceLine>
          <GlanceLine>
            Service charge: {'\u00A3'}{currentCharge.amountPerFlat}/month
            {previousCharge && ` (increased from \u00A3${previousCharge.amountPerFlat} in April 2026)`}
          </GlanceLine>
          <GlanceLine>Cash in hand: {'\u00A3'}{financials.openingCash.toLocaleString()}</GlanceLine>
          <GlanceLine>Building insured via Allianz (policy BB28285956)</GlanceLine>
          <GlanceLine>Next big project: roof replacement {'\u2014'} we{'\u2019'}re getting quotes</GlanceLine>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Section 6: Learn more about your building                   */}
      {/* ============================================================ */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ ...sectionTitle, marginBottom: 16 }}>Learn more about your building</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <ExploreCard
            emoji="📖"
            label="Read the management plan"
            onClick={() => navigate('/documents')}
          />
          <ExploreCard
            emoji="💬"
            label="Catch up on messages"
            onClick={() => navigate('/messages')}
          />
          <ExploreCard
            emoji="🤔"
            label="Got a question? Ask the assistant"
            onClick={() => navigate('/assistant')}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function NudgeRow({
  color,
  children,
  onClick,
}: {
  color: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 10,
        cursor: 'pointer',
        transition: 'background 0.15s ease',
        background: 'transparent',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = warmBg; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        marginTop: 6,
        flexShrink: 0,
      }} />
      <span style={{
        fontSize: 14,
        color: '#1A2636',
        lineHeight: 1.55,
        fontWeight: 400,
      }}>
        {children}
      </span>
    </div>
  );
}

function TaskRow({ action }: { action: { id: string; code: string; description: string; owner: string; status: string } }) {
  /* Translate action descriptions into friendly language */
  const friendlyMap: Record<string, string> = {
    ACT_006: 'Get the asbestos reinspection booked',
    ACT_008: "Commission the bat survey before April \u2014 we can\u2019t start roof works without it",
    ACT_002: 'Get quotes from at least two roofers',
    ACT_007: 'Check with Cadw about whether we need Listed Building Consent',
    ACT_001: 'Draft the Section 20 notice for the roof works consultation',
    ACT_003: 'Appoint an independent surveyor to look at Flat 4',
    ACT_004: 'Coordinate interim repairs for the water getting into Flat 4',
    ACT_010: 'Book an electrical safety inspection for the communal areas',
    ACT_009: 'Look into the communal lighting \u2014 is it bright enough?',
    ACT_011: 'Talk to Welsh Water about the lead pipe serving Flats 3\u20135',
    ACT_013: 'File the annual return at Companies House',
  };

  const friendlyText = friendlyMap[action.id] || action.description;
  const isComplete = action.status === 'complete';
  const ownerShort = action.owner.replace(/ \/ /g, ' & ');

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '6px 0',
    }}>
      <Checkbox
        checked={isComplete}
        disabled
        style={{ marginTop: 2 }}
      />
      <div style={{ flex: 1 }}>
        <span style={{
          fontSize: 14,
          color: isComplete ? '#94A3B8' : '#1A2636',
          textDecoration: isComplete ? 'line-through' : 'none',
          fontWeight: 400,
          lineHeight: 1.5,
        }}>
          {friendlyText}
        </span>
        <span style={{
          fontSize: 12,
          color: '#94A3B8',
          marginLeft: 8,
          fontWeight: 400,
        }}>
          ({ownerShort})
        </span>
      </div>
    </div>
  );
}

function GlanceLine({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 14,
      color: '#1A2636',
      lineHeight: 1.6,
      fontWeight: 400,
      paddingLeft: 14,
      borderLeft: '2px solid #E2DDD6',
    }}>
      {children}
    </div>
  );
}

function ExploreCard({
  emoji,
  label,
  onClick,
}: {
  emoji: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: '1 1 200px',
        background: '#FFFFFF',
        border: '1px solid #EDE9E3',
        borderRadius: 16,
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span style={{ fontSize: 20 }}>{emoji}</span>
      <span style={{
        fontSize: 14,
        color: '#1A2636',
        fontWeight: 400,
        flex: 1,
      }}>
        {label}
      </span>
      <ArrowRightOutlined style={{ fontSize: 12, color: '#94A3B8' }} />
    </div>
  );
}
