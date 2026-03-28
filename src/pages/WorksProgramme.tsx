import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image } from 'antd';

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
/*  Work card component                                                */
/* ------------------------------------------------------------------ */

function WorkCard({
  title,
  urgency,
  children,
}: {
  title: string;
  urgency: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 12,
        padding: '24px 28px',
        marginBottom: 20,
        border: '1px solid #EDE9E3',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, color: '#1A2636', margin: 0, lineHeight: 1.3 }}>
          {title}
        </h3>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: urgency === 'urgent' ? '#DC2626' : urgency === 'in progress' ? TEAL : '#718096',
            whiteSpace: 'nowrap',
          }}
        >
          {'\u2014'} {urgency}
        </span>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Checklist item                                                     */
/* ------------------------------------------------------------------ */

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '5px 0', fontSize: 15, lineHeight: 1.6, color: '#2D3748' }}>
      <span style={{ flexShrink: 0 }}>{'\u23F3'}</span>
      <span>{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Survey photos data                                                 */
/* ------------------------------------------------------------------ */

const surveyPhotos = [
  { src: 'survey-1.jpeg', caption: 'Front of the building', alt: 'Yr Hen Dy front elevation' },
  { src: 'survey-4.jpeg', caption: 'Rear with chimneys', alt: 'Rear view showing chimneys' },
  { src: 'survey-5.jpeg', caption: 'Roof valley needing repair', alt: 'Roof valley in poor state' },
  { src: 'survey-7.jpeg', caption: 'Dormer window condition', alt: 'Front dormer window detail' },
  { src: 'survey-8.jpeg', caption: 'Old vs new slates', alt: 'Boundary between man-made and natural slates' },
  { src: 'survey-10.jpeg', caption: 'Chimney with vegetation', alt: 'Chimney with plants growing from brickwork' },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function WorksProgramme() {
  const navigate = useNavigate();
  const [photosExpanded, setPhotosExpanded] = useState(false);

  return (
    <div style={{ padding: '0 0 56px', maxWidth: 720 }}>
      {/* Page intro */}
      <h1 style={{ color: TEAL, fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>
        Building works
      </h1>
      <p style={{ ...bodyText, color: '#718096', marginBottom: 32 }}>
        What needs doing, what{'\u2019'}s in progress, and what{'\u2019'}s next.
      </p>

      {/* ============================================================ */}
      {/* Section 1: What's happening now                               */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>What{'\u2019'}s happening now</h2>

        <WorkCard title="Getting the roof sorted" urgency="the big one">
          <p style={bodyText}>
            The roof survey found that the covering has reached the end of its life. We{'\u2019'}re
            working through the steps to get it replaced properly {'\u2014'} that means getting
            quotes, consulting everyone, and making sure we have the right permissions. Here{'\u2019'}s
            where we are:
          </p>

          <div style={{ margin: '16px 0 16px 4px' }}>
            <CheckItem>Book the bat survey (has to happen April{'\u2013'}September)</CheckItem>
            <CheckItem>Get the asbestos reinspection done</CheckItem>
            <CheckItem>Check if we need Listed Building Consent from Cadw</CheckItem>
            <CheckItem>Get at least two quotes from roofers</CheckItem>
            <CheckItem>Start the formal consultation with all leaseholders</CheckItem>
            <div style={{ display: 'flex', gap: 10, padding: '5px 0', fontSize: 15, lineHeight: 1.6, color: '#718096' }}>
              <span style={{ flexShrink: 0 }}>{'  '}</span>
              <span style={{ fontStyle: 'italic' }}>Then: hire a contractor and get the work done</span>
            </div>
          </div>

          <p style={{ ...bodyText, color: '#718096', fontStyle: 'italic', marginBottom: 0 }}>
            This will take a few months because of the consultation process {'\u2014'} but we{'\u2019'}re on it.
          </p>
        </WorkCard>

        <WorkCard title="Fixing the water getting into Flat 4" urgency="urgent">
          <p style={{ ...bodyText, marginBottom: 0 }}>
            A surveyor has been appointed to work out exactly what{'\u2019'}s causing the leak. In the
            meantime, Nigel Barnes is doing some interim repairs to stop things getting worse.
          </p>
        </WorkCard>

        <WorkCard title="New fire doors for Flats 4 and 5" urgency="in progress">
          <p style={{ ...bodyText, marginBottom: 0 }}>
            Nigel is sourcing FD30 fire doors. Janet and Daniel are paying for their own doors
            directly {'\u2014'} it{'\u2019'}s about {'\u00A3'}500 each.
          </p>
        </WorkCard>
      </div>

      {/* ============================================================ */}
      {/* Section 2: Survey photos                                      */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Survey photos</h2>
        <p style={bodyText}>
          Here are some photos from the building survey in September 2024. They give you an idea
          of what the surveyors found.
        </p>

        <Image.PreviewGroup>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 16,
              marginTop: 8,
            }}
          >
            {surveyPhotos.slice(0, photosExpanded ? surveyPhotos.length : 4).map((photo) => (
              <div key={photo.src} style={{ textAlign: 'center' }}>
                <Image
                  src={`${import.meta.env.BASE_URL}images/${photo.src}`}
                  alt={photo.alt}
                  style={{ borderRadius: 8, objectFit: 'cover', width: '100%', maxHeight: 160 }}
                />
                <div style={{ marginTop: 6, fontSize: 13, color: '#718096' }}>{photo.caption}</div>
              </div>
            ))}
          </div>
        </Image.PreviewGroup>

        {surveyPhotos.length > 4 && !photosExpanded && (
          <div style={{ marginTop: 14, textAlign: 'center' }}>
            <span
              onClick={() => setPhotosExpanded(true)}
              style={{ fontSize: 14, color: TEAL, cursor: 'pointer', fontWeight: 500, textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              Show all {surveyPhotos.length} photos
            </span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* Section 3: What it might cost                                 */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>What it might cost</h2>
        <p style={bodyText}>
          The only formal quote we have so far is from Cardiff & Vale Roofing (August 2024, now expired):
        </p>

        <div style={{ margin: '8px 0 16px 4px' }}>
          {[
            { label: 'Roof replacement', cost: 'about \u00A323,600 plus VAT' },
            { label: 'Chimney repairs', cost: 'about \u00A31,850 plus VAT per chimney (optional)' },
            { label: 'New gutters and fascias', cost: 'about \u00A31,850 plus VAT (optional)' },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', gap: 10, padding: '4px 0', fontSize: 15, lineHeight: 1.6, color: '#2D3748' }}>
              <span style={{ flexShrink: 0, color: TEAL }}>{'\u2022'}</span>
              <span><strong>{item.label}:</strong> {item.cost}</span>
            </div>
          ))}
        </div>

        <p style={bodyText}>
          We{'\u2019'}ve also had a quote from Heritage Roofing Wales (about {'\u00A3'}27,400 plus VAT, valid until
          July 2026). We need at least one more quote before we can proceed.
        </p>

        <p style={bodyText}>
          For the full roof replacement, the board agreed each flat would pay about {'\u00A3'}10,600
          as a one-off. That{'\u2019'}s on top of the regular service charge.
        </p>

        <p style={subtleNote}>
          The original Cardiff & Vale quote has expired {'\u2014'} we need to get fresh quotes.
        </p>

        <div style={{ marginTop: 20 }}>
          <button
            style={ctaButton}
            onClick={() => navigate('/marketplace')}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F5A623';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = AMBER;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            See quotes and contractors {'\u2192'}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Section 4: Things for later                                   */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Things for later</h2>
        <p style={bodyText}>
          These aren{'\u2019'}t urgent. We{'\u2019'}ll get to them when the roof is sorted.
        </p>

        <div style={{ margin: '4px 0 0 4px' }}>
          {[
            'The windows need attention \u2014 most are in poor condition',
            'The exterior walls need repainting',
            'The lead pipes serving Flats 3\u20135 should be replaced eventually',
            'The roof insulation is thin \u2014 worth upgrading when the roof is replaced',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', gap: 10, padding: '5px 0', fontSize: 15, lineHeight: 1.6, color: '#2D3748' }}>
              <span style={{ flexShrink: 0, color: '#718096' }}>{'\u2022'}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <p style={{ ...subtleNote, marginTop: 16 }}>
          None of these are urgent. We{'\u2019'}ll get to them when the roof is sorted.
        </p>
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
        <h2 style={{ ...sectionHeading, fontSize: 18 }}>Got questions about the works?</h2>
        <p style={{ ...bodyText, color: '#718096' }}>
          Check our{' '}
          <span
            onClick={() => navigate('/workflows')}
            style={{ color: TEAL, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}
          >
            Help & guidance page
          </span>
          {' '}for step-by-step advice on the consultation process, or{' '}
          <span
            onClick={() => navigate('/assistant')}
            style={{ color: TEAL, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer' }}
          >
            ask the assistant
          </span>
          {' '}anything about your building.
        </p>
      </div>
    </div>
  );
}
