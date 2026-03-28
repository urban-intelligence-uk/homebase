import { useNavigate } from 'react-router-dom';
import data from '../data/cathedralGreen';

const TEAL = '#2A5B6C';
const AMBER = '#E8913A';
const AMBER_LIGHT = '#F5A623';

const fin = data.financials;
const numFlats = data.building.numberOfFlats;
const ops = fin.operatingExpenses;
const currentCharge = fin.serviceChargeHistory[fin.serviceChargeHistory.length - 1].amountPerFlat;
const annualIncome = currentCharge * numFlats * 12;
const annualSurplus = annualIncome - ops.total;
const inflationPct = Math.round(ops.inflationRate * 100);
const nextYearExpenses = Math.round(ops.total * (1 + ops.inflationRate));

// Scenario helpers
const fullReplacement = fin.scenarios.find((s) => s.id === 3)!;
const interimFix = fin.scenarios.find((s) => s.id === 4)!;
const potBuilder = fin.scenarios.find((s) => s.id === 2)!;

// 5-year projection from Pot Builder scenario (adopted)
const projections = Array.from({ length: 5 }, (_, i) => {
  const year = i + 1;
  const cumulativeSurplus = annualSurplus * year;
  return Math.round(fin.openingCash + cumulativeSurplus);
});

const fmt = (n: number) =>
  n.toLocaleString('en-GB', { maximumFractionDigits: 0 });

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
/* ------------------------------------------------------------------ */

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
  lineHeight: 1.65,
  color: '#2D3748',
  margin: '0 0 14px 0',
};

const subtleNote: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.55,
  color: '#718096',
  margin: '12px 0 0 0',
};

const receiptRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  padding: '5px 0',
  fontSize: 15,
  lineHeight: 1.6,
  color: '#2D3748',
};

const receiptAmount: React.CSSProperties = {
  fontFamily: "'SF Mono', 'Menlo', 'Consolas', monospace",
  fontWeight: 500,
  textAlign: 'right' as const,
  minWidth: 80,
};

const totalRow: React.CSSProperties = {
  ...receiptRow,
  borderTop: '1px solid #CBD5E0',
  paddingTop: 10,
  marginTop: 6,
  fontWeight: 600,
  fontSize: 16,
};

const timelineDot: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  background: TEAL,
  flexShrink: 0,
  marginTop: 5,
};

const currentDot: React.CSSProperties = {
  ...timelineDot,
  background: AMBER,
  boxShadow: `0 0 0 4px rgba(232, 145, 58, 0.2)`,
};

const ctaButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: AMBER,
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '12px 24px',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const linkStyle: React.CSSProperties = {
  color: TEAL,
  textDecoration: 'underline',
  textUnderlineOffset: 3,
  cursor: 'pointer',
  fontWeight: 500,
};

/* Simple bar for savings visualisation */
function SavingsBar({ year, amount, max }: { year: number; amount: number; max: number }) {
  const pct = Math.round((amount / max) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
      <span style={{ fontSize: 13, color: '#718096', width: 48, flexShrink: 0 }}>
        Year {year}
      </span>
      <div style={{ flex: 1, height: 22, background: '#E2E8F0', borderRadius: 6, overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${TEAL}, #3A7D8E)`,
            borderRadius: 6,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <span style={{ ...receiptAmount, fontSize: 14, color: '#2D3748', minWidth: 70 }}>
        ~{'\u00A0'}{'\u00A3'}{fmt(amount)}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Finances() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '0 0 56px', maxWidth: 720 }}>
      {/* Page intro */}
      <h1 style={{ color: TEAL, fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>
        Money
      </h1>
      <p style={{ ...bodyText, color: '#718096', marginBottom: 32 }}>
        How your building's finances work — in plain English.
      </p>

      {/* ============================================================ */}
      {/* Section 1: What your building costs to run                    */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>What your building costs to run</h2>
        <p style={bodyText}>
          Like any home, the building has regular bills. Here's what it costs each year to keep
          things ticking over:
        </p>

        <div style={{ maxWidth: 420, margin: '16px 0 4px' }}>
          <div style={receiptRow}>
            <span>Buildings insurance (Allianz)</span>
            <span style={receiptAmount}>{'\u00A3'}{fmt(Math.round(ops.buildingsInsurance))}</span>
          </div>
          <div style={receiptRow}>
            <span>Directors' insurance (AXA)</span>
            <span style={receiptAmount}>{'\u00A3'}{fmt(Math.round(ops.doInsurance))}</span>
          </div>
          <div style={receiptRow}>
            <span>Accountant (Huw Aled)</span>
            <span style={receiptAmount}>{'\u00A3'}{fmt(Math.round(ops.accountancy))}</span>
          </div>
          <div style={receiptRow}>
            <span>Gardening</span>
            <span style={receiptAmount}>{'\u00A3'}{fmt(Math.round(ops.gardening))}</span>
          </div>
          <div style={receiptRow}>
            <span>Admin and filing</span>
            <span style={receiptAmount}>{'\u00A3'}{fmt(Math.round(ops.adminFiling))}</span>
          </div>
          <div style={receiptRow}>
            <span>A bit extra for emergencies</span>
            <span style={receiptAmount}>{'\u00A3'}{fmt(Math.round(ops.contingency))}</span>
          </div>
          <div style={totalRow}>
            <span>Total</span>
            <span style={receiptAmount}>{'\u00A3'}{fmt(Math.round(ops.total))}/year</span>
          </div>
        </div>

        <p style={{ ...bodyText, marginTop: 20 }}>
          That's about <strong>{'\u00A3'}{fmt(Math.round(ops.total / numFlats / 12))}</strong> per
          flat per month just to keep things ticking over.
        </p>

        <p style={subtleNote}>
          These costs go up a little each year (about {inflationPct}% for inflation). So next year
          it'll be closer to {'\u00A3'}{fmt(nextYearExpenses)}.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Section 2: What's coming in                                   */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>What everyone's paying</h2>

        <p style={bodyText}>
          <strong>{numFlats} flats {'\u00D7'} {'\u00A3'}{fmt(currentCharge)}/month = {'\u00A3'}{fmt(annualIncome)}/year</strong>
        </p>
        <p style={bodyText}>
          That covers the running costs ({'\u00A3'}{fmt(Math.round(ops.total))}) with{' '}
          <strong>{'\u00A3'}{fmt(Math.round(annualSurplus))}</strong> left over — which goes into
          savings for future repairs.
        </p>

        {/* Timeline */}
        <div style={{ margin: '24px 0 0' }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 14 }}>
            How the service charge has changed
          </p>
          {fin.serviceChargeHistory.map((entry, i) => {
            const isCurrent = i === fin.serviceChargeHistory.length - 1;
            return (
              <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 10 }}>
                  <div style={isCurrent ? currentDot : timelineDot} />
                  {i < fin.serviceChargeHistory.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: '#CBD5E0', marginTop: 4 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: isCurrent ? 600 : 400, color: '#2D3748' }}>
                    {entry.period}: {'\u00A3'}{fmt(entry.amountPerFlat)}/month
                    {isCurrent && (
                      <span style={{ fontSize: 12, color: AMBER, fontWeight: 600, marginLeft: 8 }}>
                        current
                      </span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p style={subtleNote}>
          The service charge was increased at the board meeting on 19 March to make sure the
          building has enough for repairs. Everyone was consulted.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Section 3: Your savings                                       */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Your savings</h2>

        <p style={bodyText}>
          <strong>Cash in hand right now: {'\u00A3'}{fmt(Math.round(fin.openingCash))}</strong>
        </p>
        <p style={bodyText}>
          If nothing changes, in 5 years you'll have about{' '}
          <strong>{'\u00A3'}{fmt(potBuilder.fiveYearClosing)}</strong> saved up. That's a good
          foundation for maintenance and emergencies.
        </p>

        <div style={{ margin: '20px 0 8px' }}>
          {projections.map((amount, i) => (
            <SavingsBar
              key={i}
              year={i + 1}
              amount={amount}
              max={projections[projections.length - 1] * 1.1}
            />
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* Section 4: The big decision — the roof                       */}
      {/* ============================================================ */}
      <div style={blueCard}>
        <h2 style={sectionHeading}>The big decision — the roof</h2>

        <p style={bodyText}>
          The roof survey found that the roof covering has reached the end of its life. You've got
          two main options:
        </p>

        {/* Option A */}
        <div
          style={{
            background: '#fff',
            borderRadius: 10,
            padding: '20px 24px',
            margin: '18px 0 14px',
            border: '1px solid #D0DEE3',
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 600, color: TEAL, margin: '0 0 10px' }}>
            Option A: Fix it properly now
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: '#fff',
                background: TEAL,
                padding: '2px 8px',
                borderRadius: 4,
                marginLeft: 10,
                verticalAlign: 'middle',
              }}
            >
              recommended
            </span>
          </p>
          <p style={bodyText}>
            Replace the whole roof. This would cost about{' '}
            <strong>{'\u00A3'}{fmt(fullReplacement.capitalLevy)}</strong> per flat as a one-off
            payment, on top of the regular service charge. It's a lot of money, but it sorts the
            problem for good — and a sound roof protects the value of everyone's flat.
          </p>
          <p style={subtleNote}>
            Total cost: about {'\u00A3'}{fmt(fullReplacement.totalWorksEstimate!)} for the whole
            building. We'll need to get at least two quotes and go through a formal consultation
            process with all leaseholders — HomeBase will guide you through that step by step.
          </p>
        </div>

        {/* Option B */}
        <div
          style={{
            background: '#fff',
            borderRadius: 10,
            padding: '20px 24px',
            marginBottom: 20,
            border: '1px solid #D0DEE3',
          }}
        >
          <p style={{ fontSize: 16, fontWeight: 600, color: '#4A5568', margin: '0 0 10px' }}>
            Option B: Patch it up for now
          </p>
          <p style={bodyText}>
            Do essential repairs only — about{' '}
            <strong>{'\u00A3'}{fmt(interimFix.capitalLevy)}</strong> per flat. This buys time, but
            the full replacement will still be needed in 8-10 years, and it'll probably cost more by
            then.
          </p>
        </div>

        <p style={{ ...subtleNote, marginBottom: 20 }}>
          The board voted for Option A on 19 March. The next step is getting updated quotes — the
          original one from Cardiff & Vale Roofing has expired.
        </p>

        <button
          style={ctaButton}
          onClick={() => navigate('/works')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = AMBER_LIGHT;
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = AMBER;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Start the roof works process
          <span style={{ fontSize: 18 }}>{'\u2192'}</span>
        </button>

        <p style={{ ...subtleNote, marginTop: 12 }}>
          This involves a legal consultation process. Don't worry —{' '}
          <span style={linkStyle} onClick={() => navigate('/workflows')}>
            our how-to guide
          </span>{' '}
          walks you through it step by step.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Section 5: Is everyone paying?                                */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Is everyone paying?</h2>

        <p style={{ ...bodyText, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: '#D1FAE5',
              color: '#059669',
              fontSize: 15,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {'\u2713'}
          </span>
          Everyone's up to date with their service charge payments.
        </p>

        <p style={subtleNote}>
          Service charge money is held in a separate Lloyds account — it's legally required to be
          kept separate from anyone's personal money, and it belongs to all of you.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Section 6: Who can spend what                                 */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Who can spend what</h2>

        <p style={bodyText}>
          As directors, you've agreed some sensible rules about spending:
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '14px 0 18px',
          }}
        >
          {fin.expenditureThresholds.map((t, i) => {
            const descriptions = [
              `Small things up to ${'\u00A3'}250 — any one of you can just get it done`,
              `Up to ${'\u00A3'}1,000 — any one director, as long as it's in the budget`,
              `Up to ${'\u00A3'}5,000 — needs two directors to agree (in writing)`,
              `Anything bigger — the whole board needs to agree, and if it's being paid from service charges, you'll need to formally consult all leaseholders first`,
            ];
            return (
              <li
                key={i}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '8px 0',
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: '#2D3748',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: TEAL,
                    marginTop: 8,
                    flexShrink: 0,
                  }}
                />
                <span>{descriptions[i] ?? t.approval}</span>
              </li>
            );
          })}
        </ul>

        <p style={bodyText}>
          These rules protect everyone — they make sure no one person is making big spending
          decisions alone.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Section 7: Need help?                                        */}
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
          Got questions about service charges or building finances?
          <br />
          LEASE provides free, expert advice —{' '}
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
