import { useState, useMemo } from 'react';
import {
  Card,
  List,
  Avatar,
  Input,
  Tag,
  Typography,
  Tabs,
  Badge,
  Space,
  Button,
  Alert,
  Modal,
  Form,
  Select,
  message as antMessage,
} from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { messages, type Message } from '../data/cathedralGreen';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const THEME_COLOR = '#2A5B6C';

const authorColors: Record<string, string> = {
  'Daniel Mohamed': THEME_COLOR,
  'Ann Davies': '#7B2D8E',
  'Gareth Barnes': '#2D7B3E',
  'Janet Hicks': '#C26A2F',
};

const threadTypeColors: Record<string, string> = {
  issue: 'red',
  action: 'blue',
  resolution: 'green',
  general: 'default',
};

interface Thread {
  title: string;
  type: Message['threadType'];
  messages: Message[];
  lastMessage: Message;
  participants: Set<string>;
}

export default function Messages() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [form] = Form.useForm();

  const threads = useMemo(() => {
    const threadMap: Record<string, Thread> = {};
    messages.forEach((msg) => {
      const key = msg.threadTitle;
      if (!threadMap[key]) {
        threadMap[key] = {
          title: key,
          type: msg.threadType,
          messages: [],
          lastMessage: msg,
          participants: new Set(),
        };
      }
      threadMap[key].messages.push(msg);
      threadMap[key].participants.add(msg.author);
      if (dayjs(msg.date).isAfter(dayjs(threadMap[key].lastMessage.date))) {
        threadMap[key].lastMessage = msg;
      }
    });
    // Sort threads by last message date descending
    return Object.values(threadMap).sort((a, b) =>
      dayjs(b.lastMessage.date).diff(dayjs(a.lastMessage.date)),
    );
  }, []);

  const filteredThreads = useMemo(() => {
    if (activeTab === 'all') return threads;
    return threads.filter((t) => t.type === activeTab);
  }, [threads, activeTab]);

  const currentThread = useMemo(
    () => threads.find((t) => t.title === selectedThread),
    [threads, selectedThread],
  );

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : parts[0][0];
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    antMessage.success('Message sent');
    setReplyText('');
  };

  const handleNewThread = () => {
    form.validateFields().then(() => {
      antMessage.success('Thread created');
      setNewThreadOpen(false);
      form.resetFields();
    });
  };

  // Thread list view
  const renderThreadList = () => (
    <List
      dataSource={filteredThreads}
      renderItem={(thread) => (
        <List.Item
          style={{
            cursor: 'pointer',
            padding: '16px 20px',
            borderLeft: selectedThread === thread.title ? `3px solid ${THEME_COLOR}` : '3px solid transparent',
            background: selectedThread === thread.title ? '#f0f7f9' : 'transparent',
            transition: 'all 0.2s',
          }}
          onClick={() => setSelectedThread(thread.title)}
        >
          <List.Item.Meta
            title={
              <Space>
                <Text strong>{thread.title}</Text>
                <Tag color={threadTypeColors[thread.type]} style={{ fontSize: 11 }}>
                  {thread.type}
                </Tag>
                <Badge
                  count={thread.messages.length}
                  style={{ backgroundColor: '#8c8c8c', fontSize: 11 }}
                  size="small"
                />
              </Space>
            }
            description={
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {thread.lastMessage.author}: {thread.lastMessage.content.substring(0, 80)}
                  {thread.lastMessage.content.length > 80 ? '...' : ''}
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Space size={4}>
                    {Array.from(thread.participants).map((p) => (
                      <Avatar
                        key={p}
                        size={22}
                        style={{
                          backgroundColor: authorColors[p] || '#999',
                          fontSize: 10,
                        }}
                      >
                        {getInitials(p)}
                      </Avatar>
                    ))}
                    <Text type="secondary" style={{ fontSize: 11, marginLeft: 8 }}>
                      {dayjs(thread.lastMessage.date).fromNow()}
                    </Text>
                  </Space>
                </div>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  // Message detail view
  const renderMessageView = () => {
    if (!currentThread) return null;
    return (
      <div>
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => setSelectedThread(null)}
            style={{ color: THEME_COLOR }}
          >
            Back
          </Button>
          <Title level={4} style={{ margin: 0, color: THEME_COLOR }}>
            {currentThread.title}
          </Title>
          <Tag color={threadTypeColors[currentThread.type]}>{currentThread.type}</Tag>
        </div>

        <div style={{ maxHeight: 500, overflowY: 'auto', marginBottom: 16 }}>
          {currentThread.messages
            .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))
            .map((msg) => (
              <Card
                key={msg.id}
                size="small"
                style={{
                  marginBottom: 12,
                  borderLeft: `3px solid ${authorColors[msg.author] || '#999'}`,
                  background: '#fafafa',
                }}
                styles={{ body: { padding: '12px 16px' } }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Space>
                    <Avatar
                      size={28}
                      style={{
                        backgroundColor: authorColors[msg.author] || '#999',
                        fontSize: 11,
                      }}
                    >
                      {getInitials(msg.author)}
                    </Avatar>
                    <div>
                      <Text strong style={{ color: authorColors[msg.author] || '#333' }}>
                        {msg.author}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
                        Flat {msg.authorFlat}
                      </Text>
                    </div>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(msg.date).format('D MMM YYYY')}
                  </Text>
                </div>
                <Paragraph style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                  {msg.content}
                </Paragraph>
              </Card>
            ))}
        </div>

        {/* Reply input */}
        <div style={{ display: 'flex', gap: 8 }}>
          <TextArea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Type your reply..."
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            style={{ alignSelf: 'flex-end', backgroundColor: THEME_COLOR }}
          >
            Send
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 4, color: THEME_COLOR }}>
          <MessageOutlined style={{ marginRight: 8 }} />
          Messages
        </Title>
        <Text type="secondary">
          Building-wide communications for Cathedral Green directors and stakeholders
        </Text>
      </div>

      <Card
        style={{ marginBottom: 24 }}
        styles={{ body: { padding: 0 } }}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setNewThreadOpen(true)}
            style={{ backgroundColor: THEME_COLOR }}
          >
            New Thread
          </Button>
        }
        title={
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ marginBottom: -16 }}
            items={[
              { key: 'all', label: `All Threads (${threads.length})` },
              {
                key: 'issue',
                label: (
                  <Space>
                    Issues
                    <Badge
                      count={threads.filter((t) => t.type === 'issue').length}
                      size="small"
                      style={{ backgroundColor: '#cf1322' }}
                    />
                  </Space>
                ),
              },
              {
                key: 'action',
                label: (
                  <Space>
                    Actions
                    <Badge
                      count={threads.filter((t) => t.type === 'action').length}
                      size="small"
                      style={{ backgroundColor: '#1677ff' }}
                    />
                  </Space>
                ),
              },
              {
                key: 'general',
                label: (
                  <Space>
                    General
                    <Badge
                      count={threads.filter((t) => t.type === 'general').length}
                      size="small"
                      style={{ backgroundColor: '#8c8c8c' }}
                    />
                  </Space>
                ),
              },
            ]}
          />
        }
      >
        <div style={{ padding: '0 0 16px' }}>
          {selectedThread && currentThread ? renderMessageView() : renderThreadList()}
        </div>
      </Card>

      {/* B2B Panel */}
      <Alert
        type="info"
        showIcon={false}
        style={{
          background: '#f0ebe4',
          border: '1px solid #d4c4b0',
          marginBottom: 24,
        }}
        message={
          <Text strong style={{ color: '#5a3e28' }}>
            Structured Communications
          </Text>
        }
        description={
          <Text style={{ color: '#5a3e28' }}>
            Structured communications replace email chains. Every message is linked to a building
            issue, action, or decision — creating a permanent, searchable record for directors,
            managing agents, and future leaseholders.
          </Text>
        }
      />

      {/* New Thread Modal */}
      <Modal
        title="Start a New Thread"
        open={newThreadOpen}
        onOk={handleNewThread}
        onCancel={() => {
          setNewThreadOpen(false);
          form.resetFields();
        }}
        okText="Create Thread"
        okButtonProps={{ style: { backgroundColor: THEME_COLOR } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Thread Title"
            rules={[{ required: true, message: 'Please enter a thread title' }]}
          >
            <Input placeholder="e.g. Guttering maintenance quote" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Linked To"
            rules={[{ required: true, message: 'Please select a thread type' }]}
          >
            <Select placeholder="Select thread type">
              <Select.Option value="issue">Issue</Select.Option>
              <Select.Option value="action">Action</Select.Option>
              <Select.Option value="resolution">Resolution</Select.Option>
              <Select.Option value="general">General</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="message"
            label="First Message"
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <TextArea rows={4} placeholder="Type your message..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
