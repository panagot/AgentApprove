import { SimulateAgentForm } from '@/components/SimulateAgentForm';
import { Page } from '@/components/PageLayout';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';

export default function DemoPage() {
  return (
    <>
      <Page.Header className="p-0">
        <TopBar title="Simulate agent" />
      </Page.Header>
      <Page.Main className="flex flex-col items-stretch gap-4 mb-16">
        <SimulateAgentForm />
      </Page.Main>
    </>
  );
}
