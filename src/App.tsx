import { useMemo } from 'react';
import { useEveAgent, type EveMessage } from 'eve/react';
import './App.css';
import ChatBot, {
  type ChatMessage,
  type ChatStatus,
} from './components/Chatbot/Chatbot';
import MessageContent from './components/Chatbot/MessageContent';

const textOf = (m: EveMessage) =>
  m.parts
    .flatMap((p) => (p.type === 'text' ? [p.text] : []))
    .join('\n\n')
    .trim();

function App() {
  const agent = useEveAgent();
  const resuming = agent.status === 'resuming';

  const messages = useMemo<ChatMessage[]>(
    () =>
      agent.messages.flatMap((m): ChatMessage[] => {
        const text = textOf(m);
        if (m.role === 'user') {
          return text ? [{ id: m.id, role: 'user', content: text }] : [];
        }
        if (m.parts.length === 0) return [];
        return [
          {
            id: m.id,
            role: 'assistant',
            copyText: text || undefined,
            content: (
              <MessageContent
                message={m}
                respond={agent.respond}
                disabled={resuming}
              />
            ),
          },
        ];
      }),
    [agent.messages, agent.respond, resuming],
  );

  const status: ChatStatus = agent.error
    ? 'error'
    : agent.status === 'busy'
      ? agent.messages.at(-1)?.role === 'assistant' &&
        agent.messages.at(-1)?.parts.length
        ? 'streaming'
        : 'submitted'
      : 'ready';

  const retry = () => {
    const lastUser = agent.messages.findLast((m) => m.role === 'user');
    const text = lastUser && textOf(lastUser);
    if (text) void agent.send(text);
  };

  return (
    <ChatBot
      title="ShelfMate"
      subtitle="UrbanThread · GlowLab"
      greeting="Hi, I'm ShelfMate. What are you shopping for today?"
      suggestions={[
        'I want a formal shirt for office',
        'Which sunscreen is good for dry skin?',
        'Show me my cart',
      ]}
      messages={messages}
      status={status}
      error={agent.error ? 'Something went wrong. Please try again.' : null}
      onSend={(text) => void agent.send(text)}
      onStop={() => void agent.cancel()}
      onRetry={retry}
    />
  );
}

export default App;
