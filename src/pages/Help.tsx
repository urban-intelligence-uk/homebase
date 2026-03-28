import { useMemo } from 'react';
import { Typography, Tag, Row, Col } from 'antd';
import { PhoneOutlined, MessageOutlined, LinkOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { helpLinks, type HelpLink } from '../data/cathedralGreen';

const { Title, Text, Paragraph } = Typography;

const ACCENT = '#2A5B6C';

// Source badge colours
const sourceBadge: Record<HelpLink['source'], { color: string; bg: string; border: string }> = {
  LEASE: { color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
  'Gov.uk': { color: '#15803D', bg: '#F0FDF4', border: '#BBF7D0' },
  Cadw: { color: '#9333EA', bg: '#FAF5FF', border: '#E9D5FF' },
  'Companies House': { color: '#B45309', bg: '#FFFBEB', border: '#FDE68A' },
  other: { color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' },
};

// Group links by topic
interface TopicGroup {
  title: string;
  tags: string[];
}

const topicGroups: TopicGroup[] = [
  { title: 'Service charges & money', tags: ['service charges', 'money', 'demands', 'section 20', 'consultation', 'major works'] },
  { title: 'Building safety', tags: ['fire safety', 'fire risk assessment', 'safety', 'asbestos', 'surveys', 'building safety', 'cladding'] },
  { title: 'Your rights', tags: ['disputes', 'tribunal', 'complaints', 'reform', 'law changes', 'your rights', 'insurance', 'renting', 'tenants', 'wales', 'letting'] },
  { title: 'Running a management company', tags: ['management company', 'directors', 'right to manage', 'companies house', 'filing', 'annual return', 'accounts', 'duties', 'company law'] },
  { title: 'Selling & buying', tags: ['freehold', 'enfranchisement', 'buying'] },
  { title: 'Heritage & planning', tags: ['listed building', 'consent', 'heritage', 'planning'] },
];

function groupLinks(links: HelpLink[]): { title: string; links: HelpLink[] }[] {
  const used = new Set<string>();
  const groups: { title: string; links: HelpLink[] }[] = [];

  for (const group of topicGroups) {
    const matching = links.filter(
      (link) => !used.has(link.id) && link.relevantTo.some((tag) => group.tags.includes(tag)),
    );
    if (matching.length > 0) {
      matching.forEach((l) => used.add(l.id));
      groups.push({ title: group.title, links: matching });
    }
  }

  // Catch any ungrouped
  const remaining = links.filter((l) => !used.has(l.id));
  if (remaining.length > 0) {
    groups.push({ title: 'Other guidance', links: remaining });
  }

  return groups;
}

function GuidanceCard({ link }: { link: HelpLink }) {
  const badge = sourceBadge[link.source];
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #EDE9E3',
          borderRadius: 12,
          padding: '20px 24px',
          height: '100%',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.borderColor = ACCENT;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = '#EDE9E3';
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <Text strong style={{ fontSize: 15, color: ACCENT, lineHeight: 1.3, flex: 1 }}>
            {link.title}
          </Text>
          <LinkOutlined style={{ fontSize: 12, color: '#94A3B8', marginLeft: 8, marginTop: 4, flexShrink: 0 }} />
        </div>
        <Text style={{ fontSize: 13, color: '#555', lineHeight: 1.5, display: 'block', marginBottom: 12 }}>
          {link.description}
        </Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Tag
            style={{
              fontSize: 11,
              borderRadius: 10,
              padding: '0 8px',
              color: badge.color,
              background: badge.bg,
              borderColor: badge.border,
              fontWeight: 500,
            }}
          >
            {link.source}
          </Tag>
          {link.relevantTo.slice(0, 2).map((tag) => (
            <Tag
              key={tag}
              style={{
                fontSize: 11,
                borderRadius: 10,
                padding: '0 8px',
                color: '#6B7280',
                background: '#F9FAFB',
                borderColor: '#E5E7EB',
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </a>
  );
}

export default function Help() {
  const navigate = useNavigate();
  const grouped = useMemo(() => groupLinks(helpLinks), []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 0 48px' }}>
      {/* Page header */}
      <Title level={2} style={{ color: ACCENT, marginBottom: 4 }}>Help & guidance</Title>
      <Paragraph style={{ fontSize: 16, color: '#555', lineHeight: 1.6, maxWidth: 680, marginBottom: 32 }}>
        Free advice and support for leaseholders. You don't have to figure everything out on your own.
      </Paragraph>

      {/* LEASE banner */}
      <div style={{
        background: 'linear-gradient(135deg, #F0F7FF 0%, #E8F4FD 100%)',
        border: '1px solid #BFDBFE',
        borderRadius: 16,
        padding: '32px 36px',
        marginBottom: 40,
      }}>
        <div style={{ marginBottom: 8 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 600,
            color: '#1D4ED8',
            letterSpacing: '-0.01em',
          }}>
            Leasehold Advisory Service
          </Text>
          <Tag
            style={{
              marginLeft: 10,
              fontSize: 11,
              borderRadius: 10,
              padding: '0 8px',
              color: '#1D4ED8',
              background: '#DBEAFE',
              borderColor: '#93C5FD',
              fontWeight: 500,
            }}
          >
            Free service
          </Tag>
        </div>
        <Paragraph style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 16, maxWidth: 700 }}>
          LEASE is a free, government-funded service that provides expert advice on leasehold property.
          If you're unsure about anything — service charges, your rights, disputes — they're the best
          place to start.
        </Paragraph>
        <a
          href="https://www.lease-advice.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 15,
            color: '#1D4ED8',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          Visit lease-advice.org &rarr;
        </a>
      </div>

      {/* Guidance cards grouped by topic */}
      {grouped.map((group) => (
        <div key={group.title} style={{ marginBottom: 36 }}>
          <Title level={4} style={{ color: '#1A2636', marginBottom: 16, fontWeight: 500 }}>
            {group.title}
          </Title>
          <Row gutter={[16, 16]}>
            {group.links.map((link) => (
              <Col xs={24} sm={12} key={link.id}>
                <GuidanceCard link={link} />
              </Col>
            ))}
          </Row>
        </div>
      ))}

      {/* Still stuck? */}
      <div style={{
        background: '#FAFAF8',
        border: '1px solid #EDE9E3',
        borderRadius: 16,
        padding: '28px 32px',
        marginTop: 16,
      }}>
        <Title level={4} style={{ color: '#1A2636', marginBottom: 12 }}>Still stuck?</Title>
        <Paragraph style={{ fontSize: 15, color: '#555', lineHeight: 1.7, marginBottom: 16 }}>
          Call LEASE on <strong>020 7832 2500</strong> (Mon-Fri 9am-5pm) — it's free.
          Or ask the HomeBase assistant for building-specific answers.
        </Paragraph>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href="tel:02078322500"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              fontSize: 14,
              color: ACCENT,
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <PhoneOutlined />
            Call LEASE (free)
          </a>
          <div
            onClick={() => navigate('/assistant')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              fontSize: 14,
              color: ACCENT,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <MessageOutlined />
            Ask the assistant
          </div>
        </div>
      </div>
    </div>
  );
}
