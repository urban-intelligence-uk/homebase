import { useNavigate } from 'react-router-dom';

const TEAL = '#2A5B6C';
const AMBER = '#E8913A';

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

/* ------------------------------------------------------------------ */
/*  Contact card component                                             */
/* ------------------------------------------------------------------ */

function ContactCard({
  name,
  description,
  contact,
}: {
  name: string;
  description: string;
  contact?: string;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 12,
        padding: '20px 24px',
        border: '1px solid #EDE9E3',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1A2636', margin: '0 0 6px', lineHeight: 1.3 }}>
        {name}
      </h3>
      <p style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.6, margin: 0 }}>
        {description}
      </p>
      {contact && (
        <p style={{ fontSize: 13, color: '#718096', lineHeight: 1.5, margin: '8px 0 0' }}>
          {contact}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  External service card                                              */
/* ------------------------------------------------------------------ */

function ServiceCard({
  emoji,
  name,
  description,
  url,
}: {
  emoji: string;
  name: string;
  description: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          padding: '20px 24px',
          border: '1px solid #EDE9E3',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}>{emoji}</span>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: TEAL, margin: 0 }}>{name}</h3>
          <span style={{ fontSize: 13, color: '#94A3B8', marginLeft: 'auto' }}>{'\u2192'}</span>
        </div>
        <p style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.6, margin: 0 }}>
          {description}
        </p>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Marketplace() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '0 0 56px', maxWidth: 720 }}>
      {/* Page intro */}
      <h1 style={{ color: TEAL, fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>
        Finding the right people
      </h1>
      <p style={{ ...bodyText, color: '#718096', marginBottom: 32 }}>
        When your building needs work done, we can help you find trusted, qualified contractors.
      </p>

      {/* ============================================================ */}
      {/* Section 1: How HomeBase helps                                 */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>How HomeBase helps</h2>
        <p style={bodyText}>
          Your building is special {'\u2014'} it{'\u2019'}s Grade II listed, in a conservation area, and
          the roof slates probably contain asbestos. That means you need contractors who understand
          heritage buildings and have the right qualifications.
        </p>
        <p style={{ ...bodyText, marginBottom: 0 }}>
          HomeBase knows all of this, so we can help you find the right people.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Section 2: People we've worked with                           */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>People we{'\u2019'}ve worked with</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ContactCard
            name="Cardiff & Vale Roofing"
            description="Roofing specialists. Quoted for the roof replacement in 2024."
            contact="Andy \u2014 02922 522032"
          />
          <ContactCard
            name="Nigel Barnes"
            description="Local builder. Doing the fire door installation and interim repairs."
            contact="Via Gareth (Flat 3)"
          />
          <ContactCard
            name="Heritage Roofing Wales"
            description="Heritage roofing contractor. Provided a quote for the roof replacement in 2026. Asbestos licensed."
            contact="quotes@heritageroofingwales.co.uk"
          />
          <ContactCard
            name="Capital Fire Protection"
            description="Did the fire safety check in December 2025."
            contact="Nick Jones"
          />
          <ContactCard
            name="Lapider Chartered Surveyors"
            description="Did the building survey in September 2024."
            contact="Adrian Gardner MRICS \u2014 029 2070 6242"
          />
          <ContactCard
            name="Thomas Carroll Brokers"
            description="Handle our buildings insurance and D&O cover."
            contact="Sam / Lucy Davies \u2014 02920 858608"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* Section 3: Need to find someone new?                          */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Need to find someone new?</h2>
        <p style={bodyText}>
          These services can help you find qualified tradespeople:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <ServiceCard
            emoji={'\uD83D\uDD0D'}
            name="Checkatrade"
            description="Find rated tradespeople near you"
            url="https://www.checkatrade.com"
          />
          <ServiceCard
            emoji={'\uD83C\uDFD7\uFE0F'}
            name="TrustMark"
            description="Government-endorsed quality scheme for tradespeople"
            url="https://www.trustmark.org.uk"
          />
          <ServiceCard
            emoji={'\uD83C\uDFE0'}
            name="RICS Find a Surveyor"
            description="Find a qualified surveyor"
            url="https://www.ricsfirms.com"
          />
        </div>

        <p style={{ ...subtleNote, marginTop: 18 }}>
          When getting quotes for major work, remember you need at least two quotes {'\u2014'} and
          one should be from a contractor that none of the directors has a personal connection to.
          HomeBase keeps track of this for you.
        </p>
      </div>

      {/* ============================================================ */}
      {/* Section 4: Current quotes                                     */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Current quotes</h2>
        <p style={bodyText}>
          For the roof replacement, we{'\u2019'}ve had quotes from:
        </p>

        <div style={{ margin: '4px 0 16px 4px' }}>
          <div style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: 15, lineHeight: 1.6, color: '#2D3748' }}>
            <span style={{ flexShrink: 0, color: TEAL }}>{'\u2022'}</span>
            <span>
              <strong>Cardiff & Vale Roofing:</strong> about {'\u00A3'}23,600 + VAT{' '}
              <span style={{ color: '#DC2626', fontSize: 13 }}>(quote expired {'\u2014'} needs renewing)</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10, padding: '6px 0', fontSize: 15, lineHeight: 1.6, color: '#2D3748' }}>
            <span style={{ flexShrink: 0, color: TEAL }}>{'\u2022'}</span>
            <span>
              <strong>Heritage Roofing Wales:</strong> about {'\u00A3'}27,400 + VAT{' '}
              <span style={{ color: '#059669', fontSize: 13 }}>(valid until July 2026)</span>
            </span>
          </div>
        </div>

        <p style={bodyText}>
          We need at least one more quote before we can proceed with the consultation.
        </p>

        <button
          style={ctaButton}
          onClick={() => navigate('/workflows')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F5A623';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = AMBER;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Learn about the consultation process {'\u2192'}
        </button>
      </div>

      {/* ============================================================ */}
      {/* Section 5: Need help?                                         */}
      {/* ============================================================ */}
      <div
        style={{
          ...sectionCard,
          background: '#F7F7F5',
          textAlign: 'center' as const,
          padding: '28px 36px',
        }}
      >
        <h2 style={{ ...sectionHeading, fontSize: 18 }}>Not sure what you need?</h2>
        <p style={{ ...bodyText, color: '#718096' }}>
          <span
            onClick={() => navigate('/assistant')}
            style={{ color: TEAL, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}
          >
            Ask the assistant
          </span>
          {' '}about your building, or check our{' '}
          <span
            onClick={() => navigate('/workflows')}
            style={{ color: TEAL, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}
          >
            Help & guidance page
          </span>
          {' '}for expert advice from LEASE.
        </p>
      </div>
    </div>
  );
}
