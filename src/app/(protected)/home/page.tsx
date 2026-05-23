import { auth } from '@/auth';
import { InboxList } from '@/components/InboxList';
import { OnboardingBanner } from '@/components/OnboardingBanner';
import { Page } from '@/components/PageLayout';
import { StatsBar } from '@/components/StatsBar';
import { Marble, TopBar } from '@worldcoin/mini-apps-ui-kit-react';

export default async function InboxPage() {
  const session = await auth();

  return (
    <>
      <Page.Header className="p-0">
        <TopBar
          title="AgentApprove"
          endAdornment={
            session?.user ? (
              <Marble src={session.user.profilePictureUrl} className="w-10" />
            ) : undefined
          }
        />
      </Page.Header>
      <Page.Main className="mb-16 flex flex-col items-stretch gap-4 bg-zinc-50/50">
        <OnboardingBanner />
        <StatsBar />
        <div>
          <h1 className="text-lg font-bold text-zinc-900">Pending approvals</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Review agent actions and approve with World ID
          </p>
        </div>
        <InboxList />
      </Page.Main>
    </>
  );
}
