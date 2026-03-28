import { useState } from 'react';
import {
  units,
  actions,
} from '../data/cathedralGreen';

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

/* ------------------------------------------------------------------ */
/*  People data (human-written, warm descriptions)                     */
/* ------------------------------------------------------------------ */

interface PersonInfo {
  name: string;
  flatNumber: number;
  note: string;
  role: string;
  lastMeeting: string;
}

const people: PersonInfo[] = [
  {
    name: units[0].leaseholder.name.split(' (')[0],
    flatNumber: 1,
    note: 'Flat 1 is currently listed for sale',
    role: 'Not been involved recently',
    lastMeeting: 'Didn\u2019t attend, no apologies sent',
  },
  {
    name: 'Ann Davies',
    flatNumber: 2,
    note: 'Has been looking after the building\u2019s admin for years',
    role: 'Handles the paperwork (company secretary and chair)',
    lastMeeting: '\u2713 Was there',
  },
  {
    name: units[2].leaseholder.name,
    flatNumber: 3,
    note: 'Lives here with Abbie',
    role: 'Helps out where needed',
    lastMeeting: '\u2713 Was there',
  },
  {
    name: units[3].leaseholder.name,
    flatNumber: 4,
    note: 'Lives in West Wales \u2014 rents out Flat 4 through Northwood',
    role: 'Keeps an eye on things from afar',
    lastMeeting: 'Sent apologies (and a proxy vote for the roof decision)',
  },
  {
    name: units[4].leaseholder.name,
    flatNumber: 5,
    note: 'Lives here with Katharine',
    role: 'Pulling the admin together, writing things up',
    lastMeeting: '\u2713 Was there',
  },
];

/* ------------------------------------------------------------------ */
/*  What we agreed — friendly resolution list                          */
/* ------------------------------------------------------------------ */

interface AgreementItem {
  text: string;
  status: 'done' | 'in_progress' | 'waiting';
}

const agreements: AgreementItem[] = [
  {
    text: 'We adopted the long-term repair plan as our guide for the next 5 years',
    status: 'done',
  },
  {
    text: 'We agreed to increase the service charge to \u00A3125/month from April to build up a repair fund',
    status: 'done',
  },
  {
    text: 'We agreed that the roof needs replacing properly (Option A) \u2014 and to start the formal consultation process',
    status: 'in_progress',
  },
  {
    text: 'Daniel will appoint a surveyor to investigate the water getting into Flat 4',
    status: 'in_progress',
  },
  {
    text: 'Interim repairs to Flat 4 should go ahead straight away',
    status: 'in_progress',
  },
  {
    text: 'Fire doors at Flats 4 and 5 \u2014 Nigel Barnes will install, paid for privately by Janet and Daniel',
    status: 'in_progress',
  },
  {
    text: 'The asbestos check needs rebooking urgently \u2014 Daniel is on it',
    status: 'waiting',
  },
  {
    text: 'We\u2019ll commission a bat survey, get roofing quotes, and check about Listed Building Consent',
    status: 'waiting',
  },
  {
    text: 'We noted the Coach House next door has planning permission \u2014 we\u2019ll plan our works around it',
    status: 'done',
  },
  {
    text: 'When someone sells their flat, we\u2019ll be upfront about everything in the paperwork',
    status: 'done',
  },
];

const statusIcon: Record<string, string> = {
  done: '\u2705',
  in_progress: '\uD83D\uDD04',
  waiting: '\u23F3',
};

/* ------------------------------------------------------------------ */
/*  Things people are doing — grouped by person                        */
/* ------------------------------------------------------------------ */

interface PersonTasks {
  name: string;
  tasks: string[];
}

const tasksByPerson: PersonTasks[] = (() => {
  const danielActions = actions.filter(
    (a) => a.owner === 'DM' && a.status !== 'complete',
  );
  const danielNBActions = actions.filter(
    (a) => (a.owner === 'DM / NB' || a.owner === 'DM / Huw Aled') && a.status !== 'complete',
  );

  const danielTasks = [
    ...danielActions.map((a) => {
      const map: Record<string, string> = {
        ACT_006: 'Booking the asbestos inspection',
        ACT_008: 'Commissioning the bat survey',
        ACT_002: 'Getting roofing quotes',
        ACT_001: 'Drafting the Section 20 notice for the roof consultation',
        ACT_003: 'Appointing the Flat 4 surveyor',
        ACT_007: 'Checking with Cadw about Listed Building Consent',
        ACT_009: 'Looking into the communal lighting',
        ACT_010: 'Booking an electrical safety inspection',
        ACT_011: 'Talking to Welsh Water about the lead pipe',
        ACT_012: 'Enquiring about the satellite dishes near Flat 3',
      };
      return map[a.id] || a.description;
    }),
    ...danielNBActions.map((a) => {
      if (a.id === 'ACT_004') return 'Coordinating interim repairs for Flat 4 (with Nigel Barnes)';
      if (a.id === 'ACT_013') return 'Filing the annual return at Companies House (with Huw Aled)';
      return a.description;
    }),
  ];

  return [
    {
      name: 'Daniel',
      tasks: danielTasks,
    },
    {
      name: 'Ann',
      tasks: [
        'Sending out the service charge letters',
        'Preparing for the Flat 1 sale (LPE1 paperwork)',
      ],
    },
    {
      name: 'Gareth',
      tasks: [
        'Coordinating the fire door installation with his dad Nigel',
      ],
    },
  ];
})();

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Governance() {
  const [showRecord, setShowRecord] = useState(false);

  return (
    <div style={{ padding: '0 0 56px', maxWidth: 720 }}>
      {/* Page intro */}
      <h1 style={{ color: TEAL, fontSize: 26, fontWeight: 700, margin: '0 0 6px' }}>
        Your neighbours
      </h1>
      <p style={{ ...bodyText, color: '#718096', marginBottom: 32 }}>
        The people who look after the building — and what you've agreed together.
      </p>

      {/* ============================================================ */}
      {/* Section 1: Who's who                                          */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Who's who</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {people.map((person, idx) => (
            <div
              key={person.flatNumber}
              style={{
                padding: '16px 0',
                borderBottom: idx < people.length - 1 ? '1px solid #E8E6E1' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#1A2636' }}>
                  {person.name}
                </span>
                <span style={{ fontSize: 13, color: '#94A3B8' }}>
                  Flat {person.flatNumber}
                </span>
              </div>
              <div style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.6, marginBottom: 3 }}>
                {person.note}
              </div>
              <div style={{ fontSize: 13, color: '#718096', lineHeight: 1.5 }}>
                {person.role}
              </div>
              <div style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
                Last meeting: {person.lastMeeting}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: '#F0F6F8',
            borderRadius: 10,
            padding: '16px 20px',
            marginTop: 20,
            fontSize: 14,
            lineHeight: 1.65,
            color: '#2D3748',
          }}
        >
          All 5 leaseholders are directors of the management company. That means you all share
          responsibility for looking after the building — but you can divide up the work however
          suits you.
        </div>
      </div>

      {/* ============================================================ */}
      {/* Section 2: What we agreed on 19 March                         */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>What we agreed on 19 March</h2>

        <p style={bodyText}>
          We met at Ann's flat on 19 March. Here's what was agreed:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0 0' }}>
          {agreements.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                fontSize: 15,
                lineHeight: 1.65,
                color: '#2D3748',
              }}
            >
              <span style={{ flexShrink: 0, fontSize: 14, marginTop: 1 }}>
                {statusIcon[item.status]}
              </span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 20,
            fontSize: 12,
            color: '#94A3B8',
          }}
        >
          <span>{'\u2705'} done</span>
          <span>{'\uD83D\uDD04'} in progress</span>
          <span>{'\u23F3'} waiting</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* Section 3: Things people are doing                            */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <h2 style={sectionHeading}>Things people are doing</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {tasksByPerson.map((person) => (
            <div key={person.name}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#1A2636', marginBottom: 8 }}>
                {person.name}
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {person.tasks.map((task, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: '#4A5568',
                    }}
                  >
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* Section 4: For the record (collapsible)                       */}
      {/* ============================================================ */}
      <div style={sectionCard}>
        <div
          onClick={() => setShowRecord(!showRecord)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          <h2 style={{ ...sectionHeading, marginBottom: 0 }}>For the record</h2>
          <span style={{ fontSize: 14, color: TEAL, fontWeight: 500 }}>
            {showRecord ? 'Hide' : 'Show'} details
          </span>
        </div>

        {!showRecord && (
          <p style={{ ...subtleNote, marginTop: 10 }}>
            The legal bits are all properly recorded. Tap to see the details.
          </p>
        )}

        {showRecord && (
          <div
            style={{
              marginTop: 16,
              padding: '20px 24px',
              background: '#F0F6F8',
              borderRadius: 10,
              fontSize: 14,
              lineHeight: 1.7,
              color: '#4A5568',
            }}
          >
            <p style={{ margin: '0 0 12px 0' }}>
              The meeting was quorate (3 of 5 directors present). All 10 resolutions were formally
              passed. The minutes are on file.
            </p>
            <p style={{ margin: '0 0 12px 0' }}>
              Daniel declared a conflict of interest regarding the Flat 4/5 drainage connection —
              water from Flat 5's rear roof drains into Flat 4's guttering.
            </p>
            <p style={{ margin: 0 }}>
              Janet sent a written proxy for the roof decision (Resolution R3) and voted in favour.
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
        <h2 style={{ ...sectionHeading, fontSize: 18 }}>Need help?</h2>
        <p style={{ ...bodyText, color: '#718096' }}>
          Want to know more about running a management company?
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
    </div>
  );
}
