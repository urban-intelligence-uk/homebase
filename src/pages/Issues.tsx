import { useState } from 'react';
import {
  Card,
  Tag,
  Typography,
  Timeline,
  Collapse,
  Badge,
  Alert,
  Row,
  Col,
  Descriptions,
  Steps,
  Image,
  Drawer,
  Select,
  Input,
  Upload,
  Radio,
  Button,
  message,
} from 'antd';
import {
  UploadOutlined,
  CheckCircleFilled,

  TeamOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  CalendarOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import data, { buildingLog, helpLinks, type BuildingLogEntry } from '../data/cathedralGreen';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ACCENT = '#2A5B6C';

const issues = data.issues;
const flatFourIssue = issues.find((i) => i.id === 'ISS_001')!;

const getResolution = (id: string) => data.resolutions.find((r) => r.id === id);
const getObligation = (id: string) => data.obligations.find((o) => o.id === id);

// Issue category definitions (kept from original)
const issueCategories = [
  {
    key: 'water',
    emoji: '\uD83D\uDEB0',
    title: 'Water or damp',
    description: 'A leak, damp patch, condensation, or water coming in somewhere',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    hoverBg: '#DBEAFE',
  },
  {
    key: 'broken',
    emoji: '\uD83D\uDD27',
    title: "Something's broken",
    description: 'A light, a door, a window, a lock, something in the communal area',
    bg: '#FFFBEB',
    border: '#FDE68A',
    hoverBg: '#FEF3C7',
  },
  {
    key: 'other',
    emoji: '\uD83D\uDCAC',
    title: 'Something else',
    description: 'Noise, a neighbour concern, something about the building you\'ve noticed, or anything else',
    bg: '#F9FAFB',
    border: '#E5E7EB',
    hoverBg: '#F3F4F6',
  },
];

const locationOptions = [
  { value: 'flat_1', label: 'My flat (Flat 1)' },
  { value: 'flat_2', label: 'My flat (Flat 2)' },
  { value: 'flat_3', label: 'My flat (Flat 3)' },
  { value: 'flat_4', label: 'My flat (Flat 4)' },
  { value: 'flat_5', label: 'My flat (Flat 5)' },
  { value: 'communal', label: 'The communal areas' },
  { value: 'outside', label: 'Outside the building' },
  { value: 'unsure', label: "I'm not sure" },
];

// Log entry type config
const logTypeConfig: Record<BuildingLogEntry['type'], { color: string; icon: React.ReactNode; label: string }> = {
  issue_reported: { color: '#EF4444', icon: <ExclamationCircleOutlined />, label: 'Issue' },
  issue_updated: { color: '#EF4444', icon: <ExclamationCircleOutlined />, label: 'Issue update' },
  work_completed: { color: '#10B981', icon: <CheckCircleOutlined />, label: 'Work done' },
  inspection: { color: '#3B82F6', icon: <EyeOutlined />, label: 'Inspection' },
  meeting: { color: '#2A5B6C', icon: <TeamOutlined />, label: 'Meeting' },
  financial: { color: '#F59E0B', icon: <DollarOutlined />, label: 'Money' },
  correspondence: { color: '#6B7280', icon: <FileTextOutlined />, label: 'Correspondence' },
  decision: { color: '#8B5CF6', icon: <CalendarOutlined />, label: 'Decision' },
};

// Filter tabs
type FilterKey = 'all' | 'issues' | 'works' | 'inspections' | 'meetings' | 'money';
const filterTabs: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Everything' },
  { key: 'issues', label: 'Issues' },
  { key: 'works', label: 'Works' },
  { key: 'inspections', label: 'Inspections' },
  { key: 'meetings', label: 'Meetings' },
  { key: 'money', label: 'Money' },
];

const filterTypeMap: Record<FilterKey, BuildingLogEntry['type'][]> = {
  all: [],
  issues: ['issue_reported', 'issue_updated'],
  works: ['work_completed'],
  inspections: ['inspection'],
  meetings: ['meeting'],
  money: ['financial'],
};

// Contextual LEASE advice for specific log entries
function getLeaseAdvice(entry: BuildingLogEntry): { text: string; url: string } | null {
  // Insurance denial entries
  if (entry.id === 'LOG_008' || entry.id === 'LOG_011') {
    const link = helpLinks.find((h) => h.id === 'HELP_012');
    if (link) return { text: 'Need help with an insurance dispute? Get free advice from LEASE', url: link.url };
  }
  // Water damage
  if (entry.id === 'LOG_005') {
    const link = helpLinks.find((h) => h.id === 'HELP_003');
    if (link) return { text: 'Advice on water leaks in leasehold flats from LEASE', url: link.url };
  }
  // Service charge entries
  if (entry.id === 'LOG_017' || entry.id === 'LOG_009') {
    const link = helpLinks.find((h) => h.id === 'HELP_001');
    if (link) return { text: 'Learn about your service charge rights from LEASE', url: link.url };
  }
  // Flat sale / conveyancing
  if (entry.id === 'LOG_012') {
    const link = helpLinks.find((h) => h.id === 'HELP_005');
    if (link) return { text: 'Thinking about buying the freehold? LEASE can advise', url: link.url };
  }
  // Board meeting
  if (entry.id === 'LOG_016') {
    const link = helpLinks.find((h) => h.id === 'HELP_004');
    if (link) return { text: 'Free guidance on running a management company from LEASE', url: link.url };
  }
  return null;
}

// Format date nicely
function formatLogDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function Issues() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const openReport = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setSubmitted(false);
    setDrawerOpen(true);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    message.success('Report sent \u2014 thank you!');
  };

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedCategory(null);
    setSubmitted(false);
  };

  const cat = issueCategories.find((c) => c.key === selectedCategory);

  // Sort log entries most recent first, then filter
  const sortedLog = [...buildingLog].sort((a, b) => b.date.localeCompare(a.date));
  const filteredLog = activeFilter === 'all'
    ? sortedLog
    : sortedLog.filter((entry) => filterTypeMap[activeFilter].includes(entry.type));

  return (
    <div style={{ padding: '0 0 48px', maxWidth: 900, margin: '0 auto' }}>
      <Title level={2} style={{ color: ACCENT, marginBottom: 4 }}>Building log</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24, maxWidth: 700 }}>
        Everything that's happened to your building, in one place. Report a new issue below, or scroll down to see the full history.
      </Paragraph>

      {/* ============================================================ */}
      {/*  Report Something — big friendly card                        */}
      {/* ============================================================ */}
      <Card
        style={{
          marginBottom: 32,
          borderRadius: 16,
          border: '1px solid #E0E7FF',
          background: 'linear-gradient(135deg, #FAFBFF 0%, #F0F4FF 100%)',
        }}
        styles={{ body: { padding: '28px 28px 24px' } }}
      >
        <Title level={4} style={{ marginBottom: 4, color: '#1A2636' }}>
          Noticed something wrong?
        </Title>
        <Paragraph style={{ color: '#555', marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
          If there's a problem with your flat or the building — a leak, a broken light, something
          that doesn't look right — let us know here. We'll make sure the right person sees it.
        </Paragraph>

        <Row gutter={[16, 16]}>
          {issueCategories.map((cat) => (
            <Col xs={24} sm={8} key={cat.key}>
              <div
                onClick={() => openReport(cat.key)}
                style={{
                  background: cat.bg,
                  border: `1px solid ${cat.border}`,
                  borderRadius: 14,
                  padding: '24px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = cat.hoverBg;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = cat.bg;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: 28 }}>{cat.emoji}</span>
                <Text strong style={{ fontSize: 15, color: '#1A2636' }}>{cat.title}</Text>
                <Text type="secondary" style={{ fontSize: 13, lineHeight: 1.5 }}>{cat.description}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Report Drawer */}
      <Drawer
        title={null}
        placement="right"
        width={420}
        open={drawerOpen}
        onClose={handleClose}
        styles={{ body: { padding: '28px 24px' } }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <CheckCircleFilled style={{ fontSize: 56, color: '#10B981', marginBottom: 20 }} />
            <Title level={4} style={{ color: '#1A2636', marginBottom: 8 }}>Thanks!</Title>
            <Paragraph style={{ color: '#555', fontSize: 15, lineHeight: 1.6 }}>
              We've logged this and the right person will be in touch. You'll get updates here as things progress.
            </Paragraph>
            <Button
              type="primary"
              onClick={handleClose}
              style={{ marginTop: 20, borderRadius: 8, height: 40 }}
            >
              Done
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <Title level={4} style={{ marginBottom: 8, color: '#1A2636' }}>Report something</Title>
              {cat && (
                <Tag
                  style={{
                    background: cat.bg,
                    border: `1px solid ${cat.border}`,
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 13,
                  }}
                >
                  {cat.emoji} {cat.title}
                </Tag>
              )}
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Where's the problem?
              </Text>
              <Select
                placeholder="Choose a location"
                options={locationOptions}
                style={{ width: '100%' }}
                size="large"
              />
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Tell us what's happening
              </Text>
              <TextArea
                rows={4}
                placeholder="Describe what you've noticed \u2014 no need to be technical, just tell us in your own words"
                style={{ borderRadius: 8, fontSize: 14 }}
              />
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8, fontSize: 14 }}>
                Add a photo (optional)
              </Text>
              <Upload.Dragger
                beforeUpload={() => false}
                style={{ borderRadius: 10, border: '1px dashed #d9d9d9', background: '#FAFAF8' }}
                showUploadList={false}
              >
                <p style={{ margin: 0 }}>
                  <UploadOutlined style={{ fontSize: 20, color: '#94A3B8' }} />
                </p>
                <p style={{ fontSize: 13, color: '#666', margin: '8px 0 0' }}>
                  A photo often helps — just snap what you can see
                </p>
              </Upload.Dragger>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 10, fontSize: 14 }}>
                How urgent is this?
              </Text>
              <Radio.Group defaultValue="can_wait" style={{ display: 'flex', gap: 8 }}>
                {[
                  { value: 'can_wait', label: 'It can wait' },
                  { value: 'fairly_soon', label: 'Fairly soon please' },
                  { value: 'urgent', label: 'Urgent' },
                ].map((opt) => (
                  <Radio.Button
                    key={opt.value}
                    value={opt.value}
                    style={{
                      borderRadius: 20,
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 13,
                      height: 36,
                      lineHeight: '34px',
                    }}
                  >
                    {opt.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>

            <Button
              type="primary"
              size="large"
              block
              onClick={handleSubmit}
              style={{
                borderRadius: 10,
                height: 48,
                fontSize: 16,
                fontWeight: 500,
                marginTop: 8,
              }}
            >
              Send report
            </Button>
          </div>
        )}
      </Drawer>

      {/* ============================================================ */}
      {/*  Building Log                                                 */}
      {/* ============================================================ */}
      <div style={{ marginBottom: 16 }}>
        <Title level={3} style={{ color: ACCENT, marginBottom: 16 }}>Building log</Title>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {filterTabs.map((tab) => (
            <Button
              key={tab.key}
              type={activeFilter === tab.key ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveFilter(tab.key)}
              style={{
                borderRadius: 20,
                fontSize: 13,
                fontWeight: activeFilter === tab.key ? 500 : 400,
                ...(activeFilter === tab.key ? {} : { color: '#555', borderColor: '#E2E8F0' }),
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Log entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filteredLog.map((entry) => {
            const cfg = logTypeConfig[entry.type];
            const leaseAdvice = getLeaseAdvice(entry);
            const isExpanded = expandedEntry === entry.id;
            const isFlatFourWaterEntry = entry.linkedIssueId === 'ISS_001';

            return (
              <div key={entry.id}>
                <div
                  onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '16px 16px',
                    borderLeft: `3px solid ${cfg.color}`,
                    borderBottom: '1px solid #F0EDE9',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    background: isExpanded ? '#FAFAF8' : 'transparent',
                  }}
                  onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = '#FAFAF8'; }}
                  onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = 'transparent'; }}
                >
                  {/* Date */}
                  <div style={{
                    minWidth: 90,
                    fontSize: 13,
                    color: ACCENT,
                    fontWeight: 500,
                    paddingTop: 1,
                    whiteSpace: 'nowrap',
                  }}>
                    {formatLogDate(entry.date)}
                  </div>

                  {/* Icon */}
                  <div style={{ fontSize: 14, color: cfg.color, paddingTop: 2, flexShrink: 0 }}>
                    {cfg.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 4 }}>
                      <Text strong style={{ fontSize: 14, color: '#1A2636' }}>{entry.title}</Text>
                      <Tag
                        style={{
                          marginLeft: 8,
                          fontSize: 11,
                          borderRadius: 10,
                          padding: '0 8px',
                          color: cfg.color,
                          borderColor: cfg.color,
                          background: 'transparent',
                        }}
                      >
                        {cfg.label}
                      </Tag>
                    </div>
                    <Text style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                      {entry.description.length > 140 && !isExpanded
                        ? entry.description.substring(0, 140) + '...'
                        : entry.description}
                    </Text>
                    {entry.reportedBy && (
                      <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
                        Reported by {entry.reportedBy}
                      </div>
                    )}

                    {/* LEASE advice link */}
                    {leaseAdvice && (
                      <div style={{ marginTop: 8 }}>
                        <a
                          href={leaseAdvice.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: 12,
                            color: ACCENT,
                            textDecoration: 'none',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <LinkOutlined style={{ fontSize: 11 }} />
                          {leaseAdvice.text} &rarr;
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded detail for Flat 4 water ingress */}
                {isExpanded && isFlatFourWaterEntry && (
                  <div style={{
                    padding: '20px 24px 20px 32px',
                    background: '#FAFAF8',
                    borderLeft: `3px solid ${cfg.color}`,
                    borderBottom: '1px solid #F0EDE9',
                  }}>
                    <Card
                      size="small"
                      style={{ marginBottom: 16 }}
                      title={
                        <span>
                          <Badge status="error" />
                          <Text strong style={{ marginLeft: 8 }}>{flatFourIssue.title}</Text>
                          <Tag color="red" style={{ marginLeft: 12 }}>HIGH</Tag>
                          <Tag color="red">ACTIVE</Tag>
                        </span>
                      }
                    >
                      <Paragraph>{flatFourIssue.description}</Paragraph>

                      <Descriptions size="small" column={{ xs: 1, sm: 2 }} bordered style={{ marginBottom: 16 }}>
                        <Descriptions.Item label="Flat Affected">Flat {flatFourIssue.flatAffected}</Descriptions.Item>
                        <Descriptions.Item label="Severity"><Tag color="red">HIGH</Tag></Descriptions.Item>
                        <Descriptions.Item label="Entry Point 1">Valley gutter overflow — constricted outlet to hopper head (drains 5 roof areas)</Descriptions.Item>
                        <Descriptions.Item label="Entry Point 2">Hole behind fascia at SW corner — wind-driven rain penetration</Descriptions.Item>
                      </Descriptions>

                      <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>What's happened so far</Title>
                      <Timeline
                        items={flatFourIssue.timeline.map((ev) => ({
                          color: ev.date >= '2026-03-18' ? 'green' : ev.date >= '2026-02-01' ? 'red' : 'gray',
                          children: (
                            <div>
                              <Text strong style={{ fontSize: 12, color: '#666' }}>{ev.date}</Text>
                              <br />
                              <Text>{ev.event}</Text>
                            </div>
                          ),
                        }))}
                      />

                      <Collapse
                        style={{ marginBottom: 16 }}
                        items={[
                          {
                            key: 'insurance',
                            label: (
                              <span>
                                Insurance claim — Sedgwick ref 10920933 <Tag color="red" style={{ marginLeft: 8 }}>Denied</Tag>
                              </span>
                            ),
                            children: (
                              <div>
                                <Descriptions size="small" column={1} bordered>
                                  <Descriptions.Item label="Claim Reference">10920933</Descriptions.Item>
                                  <Descriptions.Item label="Insurer Reference">BH/2/UN/090091</Descriptions.Item>
                                  <Descriptions.Item label="Loss Adjuster">Sedgwick International UK (Matt Bloomfield ACII)</Descriptions.Item>
                                  <Descriptions.Item label="Outcome"><Tag color="red">Denied</Tag></Descriptions.Item>
                                  <Descriptions.Item label="Reason">Assessed as maintenance/wear and tear — not storm damage</Descriptions.Item>
                                  <Descriptions.Item label="Challenge">Gareth challenged denial on 17 Feb 2026</Descriptions.Item>
                                  <Descriptions.Item label="Final Response">Sedgwick upheld denial on 18 Feb 2026</Descriptions.Item>
                                </Descriptions>
                                <Steps
                                  size="small"
                                  direction="vertical"
                                  current={3}
                                  status="error"
                                  style={{ marginTop: 16 }}
                                  items={[
                                    { title: 'Claim Lodged', description: 'Dec 2025' },
                                    { title: 'Claim Denied', description: 'Jan 2026 — maintenance/wear, not storm' },
                                    { title: 'Denial Challenged', description: '17 Feb 2026 — by Gareth' },
                                    { title: 'Denial Upheld', description: '18 Feb 2026 — Sedgwick final response' },
                                  ]}
                                />
                              </div>
                            ),
                          },
                        ]}
                      />

                      <div style={{ marginBottom: 12 }}>
                        <Text strong>What the directors have agreed: </Text>
                        {flatFourIssue.linkedResolutionIds.map((rid) => {
                          const res = getResolution(rid);
                          return res ? (
                            <Tag key={rid} color="blue" style={{ marginBottom: 4 }}>
                              {res.code}: {res.title}
                            </Tag>
                          ) : null;
                        })}
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <Text strong>Related building checks: </Text>
                        {flatFourIssue.linkedObligationIds.map((oid) => {
                          const obl = getObligation(oid);
                          return obl ? (
                            <Tag key={oid} color="orange" style={{ marginBottom: 4 }}>
                              {obl.title}
                            </Tag>
                          ) : null;
                        })}
                      </div>

                      <Card
                        title="What we think is causing it — NB Inspection 18 March 2026"
                        size="small"
                        type="inner"
                        style={{ marginTop: 16, background: '#fffbe6', borderColor: '#ffe58f' }}
                      >
                        <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
                          <li><Text strong>Valley gutter:</Text> Constricted outlet to hopper head. This valley drains 5 roof areas — volume overwhelms the restricted outlet during heavy rain.</li>
                          <li><Text strong>Fascia hole (SW corner):</Text> Hole behind fascia at the south-west corner of Flat 4, allowing wind-driven rain penetration.</li>
                          <li><Text strong>Boundary drainage:</Text> Flat 5 rear roof drainage connects into Flat 4 guttering, contributing additional water volume to the already overwhelmed system.</li>
                        </ul>
                      </Card>

                      <Card
                        title="Photos"
                        size="small"
                        type="inner"
                        style={{ marginTop: 16, marginBottom: 16 }}
                      >
                        <Image.PreviewGroup>
                          <Row gutter={[16, 16]}>
                            {([
                              { src: 'survey-5.jpeg', caption: 'Roof valley from rear — poor repairs visible', alt: 'Roof valley from rear showing poor repairs' },
                              { src: 'survey-6.jpeg', caption: 'Box gutter debris and slipped slates (arrowed)', alt: 'Box gutter with debris and slipped slates marked with yellow arrows' },
                              { src: 'survey-9.jpeg', caption: 'Flat roof over kitchen — drainage area above Flat 4', alt: 'Flat roof over kitchen showing drainage area above Flat 4' },
                              { src: 'survey-10.jpeg', caption: 'Right-hand chimney — vegetation growth and loose brickwork', alt: 'Right-hand chimney with vegetation growing from brickwork' },
                            ] as const).map((photo) => (
                              <Col xs={12} sm={6} key={photo.src} style={{ textAlign: 'center' }}>
                                <Image
                                  src={`${import.meta.env.BASE_URL}images/${photo.src}`}
                                  alt={photo.alt}
                                  width={200}
                                  style={{ borderRadius: 6, objectFit: 'cover' }}
                                />
                                <div style={{ marginTop: 6 }}>
                                  <Text type="secondary" style={{ fontSize: 11 }}>{photo.caption}</Text>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </Image.PreviewGroup>
                      </Card>

                      <Alert
                        type="warning"
                        showIcon
                        style={{ marginTop: 16 }}
                        message="Conflict of Interest Declared"
                        description="DM (Flat 5 leaseholder/director) declared interest at the 19 March 2026 Board meeting. Flat 5 rear roof drains into Flat 4 guttering, creating a boundary issue. DM is recused from decisions directly affecting this boundary."
                      />
                    </Card>
                  </div>
                )}

                {/* Generic expanded detail for non-Flat-4 entries */}
                {isExpanded && !isFlatFourWaterEntry && (
                  <div style={{
                    padding: '16px 24px 16px 32px',
                    background: '#FAFAF8',
                    borderLeft: `3px solid ${cfg.color}`,
                    borderBottom: '1px solid #F0EDE9',
                  }}>
                    <Text style={{ fontSize: 14, color: '#1A2636', lineHeight: 1.6 }}>
                      {entry.description}
                    </Text>
                    {entry.reportedBy && (
                      <div style={{ marginTop: 8, fontSize: 13, color: '#94A3B8' }}>
                        Reported by: {entry.reportedBy}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Footer note                                                  */}
      {/* ============================================================ */}
      <div style={{
        marginTop: 32,
        padding: '20px 24px',
        background: '#FAFAF8',
        borderRadius: 12,
        border: '1px solid #EDE9E3',
        fontSize: 14,
        color: '#555',
        lineHeight: 1.6,
      }}>
        This log is your building's memory. It creates an auditable record that protects you as
        directors — showing that you've acted responsibly and kept proper records.
      </div>
    </div>
  );
}
