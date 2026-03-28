import { useState } from 'react';
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

/* ------------------------------------------------------------------ */
/*  Q&A data — rewritten in plain English                              */
/* ------------------------------------------------------------------ */

interface QAItem {
  question: string;
  answer: string;
  sources: string[];
}

const qaItems: QAItem[] = [
  {
    question: 'Do we need Listed Building Consent for the roof?',
    answer:
      'Probably yes \u2014 your building is Grade II listed and in a conservation area, so any work that changes the character of the building usually needs consent from Cadw and Cardiff Council. Daniel is checking with them. The good news is that using composite slates (which is what\u2019s been quoted) might qualify as like-for-like, which sometimes means consent isn\u2019t needed \u2014 but it\u2019s best to check.',
    sources: [
      'Building survey (Lapider, Oct 2024)',
      'Planning (Listed Buildings) Act 1990 s.7\u20138',
      'Board meeting minutes, 19 Mar 2026',
    ],
  },
  {
    question: 'When was the asbestos check last done?',
    answer:
      'August 2017 \u2014 nearly 9 years ago. The company policy says it should be done every 2 years, so it\u2019s significantly overdue. The existing survey found that the roof slates probably contain asbestos (chrysotile), though they\u2019re not dangerous as long as they\u2019re left undisturbed. But if you\u2019re replacing the roof, the slates need to be removed by a licensed asbestos contractor. Daniel has been asked to book the reinspection urgently.',
    sources: [
      'Asbestos Management Survey (Aug 2017)',
      'Maintenance & Repairs Policy',
      'Board resolution R7, 19 Mar 2026',
    ],
  },
  {
    question: 'Can we start roof works before the bat survey?',
    answer:
      'No \u2014 and this is really important. It\u2019s actually a criminal offence to disturb bat roosts, and given the building\u2019s age (built around 1790) and construction, there\u2019s a real chance bats could be using the roof. The building survey specifically recommended a bat survey before any roof work. The survey can only happen between April and September when bats are active, so we need to get this booked soon.',
    sources: [
      'Building survey (Lapider, Oct 2024)',
      'Wildlife & Countryside Act 1981 s.9',
      'Conservation of Habitats and Species Regulations 2017',
    ],
  },
  {
    question: 'What\u2019s happening with the Flat 4 leak?',
    answer:
      'Flat 4 has had water coming in from two places \u2014 the valley gutter (which drains five different roof areas through a tiny outlet) and a hole behind the fascia at the south-west corner. The board has appointed an independent surveyor to investigate properly, and Nigel Barnes is doing some interim repairs in the meantime. The insurance claim was turned down (they said it was wear and tear, not storm damage), but the surveyor\u2019s report might help us challenge that.',
    sources: [
      'Building survey (Lapider, Oct 2024)',
      'Sedgwick loss adjuster report (ref 10920933)',
      'Board resolutions R4 & R5, 19 Mar 2026',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Chat bubble components                                             */
/* ------------------------------------------------------------------ */

function UserBubble({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
      <div
        style={{
          background: '#F0EDE8',
          borderRadius: '16px 4px 16px 16px',
          padding: '14px 18px',
          maxWidth: 520,
          fontSize: 15,
          lineHeight: 1.6,
          color: '#1A2636',
          fontWeight: 500,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function AssistantBubble({
  text,
  sources,
  showSources,
  onToggleSources,
}: {
  text: string;
  sources: string[];
  showSources: boolean;
  onToggleSources: () => void;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 6 }}>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '4px 16px 16px 16px',
          padding: '14px 18px',
          maxWidth: 600,
          border: '1px solid #EDE9E3',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}
      >
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#2D3748', margin: 0, whiteSpace: 'pre-wrap' }}>
          {text}
        </p>
        <div style={{ marginTop: 12 }}>
          <span
            onClick={onToggleSources}
            style={{
              fontSize: 13,
              color: TEAL,
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
              fontWeight: 500,
            }}
          >
            {showSources ? 'Hide sources' : 'Show sources'}
          </span>
        </div>

        {showSources && (
          <div
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTop: '1px solid #EDE9E3',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, color: '#718096', marginBottom: 6 }}>
              Sources
            </div>
            {sources.map((source, i) => (
              <div
                key={i}
                style={{
                  fontSize: 13,
                  color: '#4A5568',
                  lineHeight: 1.5,
                  padding: '2px 0',
                  paddingLeft: 12,
                  borderLeft: `2px solid ${TEAL}40`,
                }}
              >
                {source}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Assistant() {
  const navigate = useNavigate();
  const [expandedQA, setExpandedQA] = useState<Record<number, boolean>>({});
  const [chatInput, setChatInput] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const toggleSources = (idx: number) => {
    setExpandedQA((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSend = () => {
    if (chatInput.trim()) {
      setShowComingSoon(true);
      setChatInput('');
    }
  };

  return (
    <div style={{ padding: '0 0 56px', maxWidth: 720 }}>
      {/* Page intro */}
      <h1 style={{ color: TEAL, fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>
        Ask about your building
      </h1>
      <p style={{ ...bodyText, color: '#718096', marginBottom: 32 }}>
        Got a question? I know your building inside out {'\u2014'} just ask.
      </p>

      {/* ============================================================ */}
      {/* Chat conversation                                             */}
      {/* ============================================================ */}
      <div style={{ marginBottom: 32 }}>
        {qaItems.map((qa, idx) => (
          <div key={idx} style={{ marginBottom: 28 }}>
            <UserBubble text={qa.question} />
            <AssistantBubble
              text={qa.answer}
              sources={qa.sources}
              showSources={!!expandedQA[idx]}
              onToggleSources={() => toggleSources(idx)}
            />
          </div>
        ))}
      </div>

      {/* ============================================================ */}
      {/* Chat input                                                    */}
      {/* ============================================================ */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          padding: '20px 24px',
          marginBottom: 28,
          border: '1px solid #EDE9E3',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          position: 'sticky',
          bottom: 16,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Ask anything about your building..."
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: 15,
              border: '1px solid #E2DDD6',
              borderRadius: 10,
              outline: 'none',
              background: '#FAFAF8',
              color: '#1A2636',
              lineHeight: 1.4,
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: AMBER,
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '12px 20px',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F5A623';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = AMBER;
            }}
          >
            Send
          </button>
        </div>

        {showComingSoon && (
          <div
            style={{
              marginTop: 14,
              padding: '14px 18px',
              background: '#F0F6F8',
              borderRadius: 10,
              border: '1px solid #D0DEE3',
            }}
          >
            <p style={{ fontSize: 14, color: '#2D3748', lineHeight: 1.6, margin: 0 }}>
              The live assistant is coming soon. In the meantime, here are the most common
              questions above {'\u2014'} or check our{' '}
              <span
                onClick={() => navigate('/workflows')}
                style={{
                  color: TEAL,
                  fontWeight: 600,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  cursor: 'pointer',
                }}
              >
                Help & guidance page
              </span>
              {' '}for expert advice from LEASE.
            </p>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* How does this work?                                           */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <div
          onClick={() => setHowItWorksOpen(!howItWorksOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
        >
          <h2 style={{ ...sectionHeading, margin: 0 }}>How does this work?</h2>
          <span style={{ fontSize: 18, color: '#718096', transition: 'transform 0.2s ease', transform: howItWorksOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            {'\u25BC'}
          </span>
        </div>

        {howItWorksOpen && (
          <div style={{ marginTop: 16 }}>
            <p style={bodyText}>
              HomeBase doesn{'\u2019'}t guess or make things up. Every answer traces back to your
              building{'\u2019'}s actual documents {'\u2014'} the survey, the lease, the meeting minutes,
              the insurance policy.
            </p>
            <p style={{ ...bodyText, marginBottom: 0 }}>
              If you want to see exactly where an answer comes from, click {'\u201C'}Show sources{'\u201D'} on
              any response.
            </p>
          </div>
        )}
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
        <h2 style={{ ...sectionHeading, fontSize: 18 }}>Need expert advice?</h2>
        <p style={{ ...bodyText, color: '#718096' }}>
          LEASE provides free, independent advice for leaseholders {'\u2014'}{' '}
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
