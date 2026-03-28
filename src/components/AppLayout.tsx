import { type ReactNode, useMemo, useState } from 'react';
import { Layout, Menu, Badge, ConfigProvider, theme, Popover, List, Space, Typography } from 'antd';
import {
  HomeOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  WalletOutlined,
  ToolOutlined,
  ShopOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  BellOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { notifications, obligations } from '../data/cathedralGreen';

dayjs.extend(relativeTime);

const { Sider, Content } = Layout;
const { Text } = Typography;

const SIDEBAR_BG = '#1A2F38';
const ACCENT = '#E8913A';

const menuItems = [
  { key: '/', icon: <HomeOutlined style={{ fontSize: 16 }} />, label: 'Home' },
  { key: '/compliance', icon: <HeartOutlined style={{ fontSize: 16 }} />, label: 'Building health' },
  { key: '/workflows', icon: <BookOutlined style={{ fontSize: 16 }} />, label: 'How-to guides' },
  { key: '/documents', icon: <FileTextOutlined style={{ fontSize: 16 }} />, label: 'Documents' },
  { key: '/governance', icon: <TeamOutlined style={{ fontSize: 16 }} />, label: 'Directors & meetings' },
  { key: '/finances', icon: <WalletOutlined style={{ fontSize: 16 }} />, label: 'Money' },
  { key: '/works', icon: <ToolOutlined style={{ fontSize: 16 }} />, label: 'Building works' },
  { key: '/marketplace', icon: <ShopOutlined style={{ fontSize: 16 }} />, label: 'Find contractors' },
  { key: '/issues', icon: <ExclamationCircleOutlined style={{ fontSize: 16 }} />, label: 'Building log' },
  { key: '/messages', icon: <MessageOutlined style={{ fontSize: 16 }} />, label: 'Messages' },
  { key: '/assistant', icon: <QuestionCircleOutlined style={{ fontSize: 16 }} />, label: 'Ask a question' },
  { key: '/help', icon: <InfoCircleOutlined style={{ fontSize: 16 }} />, label: 'Help & guidance' },
];

interface AppLayoutProps {
  children: ReactNode;
}

const notifTypeConfig: Record<string, { icon: typeof ClockCircleOutlined; color: string }> = {
  compliance_deadline: { icon: ExclamationCircleOutlined, color: '#EF4444' },
  action_assigned: { icon: ClockCircleOutlined, color: '#F59E0B' },
  message: { icon: CommentOutlined, color: '#3B82F6' },
  payment: { icon: DollarOutlined, color: '#10B981' },
  resolution: { icon: CheckCircleOutlined, color: '#2A5B6C' },
};

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [bellOpen, setBellOpen] = useState(false);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [],
  );

  const sortedNotifications = useMemo(
    () => [...notifications].sort((a, b) => dayjs(b.date).diff(dayjs(a.date))),
    [],
  );

  /* Compliance status dots */
  const complianceStatus = useMemo(() => {
    const overdue = obligations.filter((o) => o.status === 'overdue').length;
    const dueSoon = obligations.filter((o) => o.status === 'due_soon').length;
    if (overdue > 0) return { color: '#EF4444', label: `${overdue} things need attention` };
    if (dueSoon > 0) return { color: '#F59E0B', label: `${dueSoon} coming up soon` };
    return { color: '#10B981', label: 'Everything looks good' };
  }, []);

  const notificationContent = (
    <div style={{ width: 380, maxHeight: 440, overflowY: 'auto' }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--hb-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text strong style={{ fontSize: 14 }}>Notifications</Text>
        <Badge
          count={unreadCount}
          size="small"
          style={{ backgroundColor: '#EF4444' }}
        />
      </div>
      <List
        dataSource={sortedNotifications}
        renderItem={(notif) => {
          const cfg = notifTypeConfig[notif.type] || notifTypeConfig.message;
          const Icon = cfg.icon;
          return (
            <List.Item
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                background: notif.read ? 'transparent' : '#F0F9FF',
                borderLeft: notif.read ? '3px solid transparent' : `3px solid var(--hb-primary)`,
                transition: 'background 0.15s ease',
              }}
              onClick={() => {
                setBellOpen(false);
                navigate(notif.linkTo);
              }}
            >
              <List.Item.Meta
                avatar={<Icon style={{ fontSize: 18, color: cfg.color, marginTop: 4 }} />}
                title={
                  <Text strong={!notif.read} style={{ fontSize: 13 }}>
                    {notif.title}
                  </Text>
                }
                description={
                  <Space direction="vertical" size={2}>
                    <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.4 }}>
                      {notif.description.length > 80
                        ? notif.description.substring(0, 80) + '...'
                        : notif.description}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {dayjs(notif.date).fromNow()}
                    </Text>
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#2A5B6C',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        {/* --- Dark Sidebar --- */}
        <Sider
          width={240}
          collapsible
          breakpoint="lg"
          style={{
            background: SIDEBAR_BG,
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 10,
          }}
          theme="dark"
        >
          {/* Logo */}
          <div style={{
            padding: '24px 20px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              HomeBase
            </div>
            <div style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.45)',
              marginTop: 6,
              fontWeight: 400,
              lineHeight: 1.3,
            }}>
              Your building, understood
            </div>
          </div>

          {/* Menu */}
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{
              background: 'transparent',
              borderRight: 0,
              padding: '8px 0',
            }}
          />

          {/* Building Info Card at bottom */}
          <div style={{
            position: 'absolute',
            bottom: 56,
            left: 0,
            right: 0,
            padding: '0 12px',
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 10,
              padding: '14px 14px 12px',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#FFFFFF',
                marginBottom: 2,
              }}>
                Yr Hen Dy
              </div>
              <div style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.5)',
                marginBottom: 10,
              }}>
                5 Cathedral Green
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: complianceStatus.color,
                  display: 'inline-block',
                  boxShadow: complianceStatus.color === '#EF4444'
                    ? '0 0 0 3px rgba(239,68,68,0.2)'
                    : 'none',
                }} />
                <span style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.55)',
                  fontWeight: 400,
                }}>
                  {complianceStatus.label}
                </span>
              </div>
            </div>
          </div>
        </Sider>

        {/* --- Main content area --- */}
        <Layout style={{ marginLeft: 240 }}>
          {/* Minimal header */}
          <div style={{
            height: 56,
            background: '#FFFFFF',
            borderBottom: '1px solid var(--hb-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 9,
          }}>
            <Space size={16} align="center">
              <Popover
                content={notificationContent}
                trigger="click"
                open={bellOpen}
                onOpenChange={setBellOpen}
                placement="bottomRight"
                arrow={false}
              >
                <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                  <BellOutlined
                    style={{
                      fontSize: 18,
                      color: 'var(--hb-text-secondary)',
                      cursor: 'pointer',
                      transition: 'color 0.15s ease',
                    }}
                  />
                </Badge>
              </Popover>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${ACCENT}, #D4791F)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
              }}>
                DM
              </div>
            </Space>
          </div>

          {/* Content */}
          <Content style={{
            padding: 32,
            background: '#F8F7F5',
            minHeight: 'calc(100vh - 56px)',
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>

      {/* Sidebar menu custom styling */}
      <style>{`
        .ant-layout-sider .ant-menu-dark .ant-menu-item {
          margin: 2px 8px !important;
          padding-left: 16px !important;
          border-radius: 8px !important;
          height: 40px !important;
          line-height: 40px !important;
          color: rgba(255,255,255,0.55) !important;
          transition: all 0.15s ease !important;
          font-size: 13px !important;
          font-weight: 400 !important;
        }
        .ant-layout-sider .ant-menu-dark .ant-menu-item:hover {
          background: rgba(255,255,255,0.06) !important;
          color: rgba(255,255,255,0.85) !important;
        }
        .ant-layout-sider .ant-menu-dark .ant-menu-item-selected {
          background: rgba(255,255,255,0.08) !important;
          color: #FFFFFF !important;
          border-left: 3px solid ${ACCENT} !important;
          padding-left: 13px !important;
          font-weight: 500 !important;
        }
        .ant-layout-sider .ant-menu-dark .ant-menu-item-selected .anticon {
          color: ${ACCENT} !important;
        }
        .ant-layout-sider-trigger {
          background: ${SIDEBAR_BG} !important;
          border-top: 1px solid rgba(255,255,255,0.06) !important;
        }
      `}</style>
    </ConfigProvider>
  );
}
