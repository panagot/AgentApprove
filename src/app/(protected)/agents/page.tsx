import { AgentsList } from '@/components/AgentsList';
import { Page } from '@/components/PageLayout';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';

export default function AgentsPage() {
  return (
    <>
      <Page.Header className="p-0">
        <TopBar title="Linked agents" />
      </Page.Header>
      <Page.Main className="mb-16 flex flex-col items-stretch gap-4">
        <AgentsList />
      </Page.Main>
    </>
  );
}
