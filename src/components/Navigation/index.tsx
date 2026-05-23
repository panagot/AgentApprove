'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { ClockRotateRight, Code, Flask, HomeSimple, User } from 'iconoir-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { value: 'home', href: '/home', icon: <HomeSimple />, label: 'Inbox' },
  { value: 'agents', href: '/agents', icon: <User />, label: 'Agents' },
  { value: 'history', href: '/history', icon: <ClockRotateRight />, label: 'Log' },
  { value: 'demo', href: '/demo', icon: <Flask />, label: 'Demo' },
  { value: 'integrate', href: '/integrate', icon: <Code />, label: 'Docs' },
];

export const Navigation = () => {
  const pathname = usePathname();
  const value =
    tabs.find(t => pathname.startsWith(t.href))?.value ?? 'home';

  return (
    <Tabs value={value}>
      {tabs.map(tab => (
        <Link key={tab.value} href={tab.href} className="min-w-0 flex-1">
          <TabItem value={tab.value} icon={tab.icon} label={tab.label} />
        </Link>
      ))}
    </Tabs>
  );
};
