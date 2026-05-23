import { HistoryList } from '@/components/HistoryList';
import { Page } from '@/components/PageLayout';
import { TopBar } from '@worldcoin/mini-apps-ui-kit-react';

export default function HistoryPage() {
  return (
    <>
      <Page.Header className="p-0">
        <TopBar title="Audit log" />
      </Page.Header>
      <Page.Main className="flex flex-col items-stretch gap-4 mb-16">
        <p className="text-sm text-zinc-500">
          Cryptographically verified approvals bound to each agent action.
        </p>
        <HistoryList />
      </Page.Main>
    </>
  );
}
