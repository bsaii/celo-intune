import {
  ALIGN,
  HeaderNavigation,
  StyledNavigationItem as NavigationItem,
  StyledNavigationList as NavigationList,
} from 'baseui/header-navigation';
import { Cell, Grid } from 'baseui/layout-grid';
import React, { ReactNode } from 'react';
import { AudioLayout } from './AudioLayout';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { StyledLink as Link } from 'baseui/link';
import { Navigation } from 'baseui/side-navigation';
import { useRouter } from 'next/router';

const nav = [
  {
    title: 'Home',
    itemId: '/',
  },
  {
    title: 'Listings',
    itemId: '/listings',
  },
  {
    title: 'Collections',
    itemId: '#level1.2',
    disabled: true,
    subNav: [
      {
        title: 'Songs',
        itemId: '/songs',
      },
      {
        title: 'Liked Songs',
        itemId: '/liked-songs',
      },
      {
        title: 'Mint',
        itemId: '/mint',
      },
    ],
  },
  {
    title: 'Earnings',
    itemId: '/earnings',
  },
];

const MainLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  return (
    <>
      <HeaderNavigation
        overrides={{
          Root: {
            style: {
              marginBottom: '1.5rem',
            },
          },
        }}
      >
        <NavigationList $align={ALIGN.left}>
          <NavigationItem>InTune</NavigationItem>
        </NavigationList>
        <NavigationList $align={ALIGN.center} />
        <NavigationList $align={ALIGN.right}>
          <NavigationItem>
            <Link href='#basic-link1'>Tab Link One</Link>
          </NavigationItem>
          <NavigationItem>
            <Link href='#basic-link2'>Tab Link Two</Link>
          </NavigationItem>
        </NavigationList>
        <NavigationList $align={ALIGN.right}>
          <NavigationItem>
            <ConnectButton />
          </NavigationItem>
        </NavigationList>
      </HeaderNavigation>
      <Grid
        overrides={{
          Grid: {
            style: {
              height: '70vh',
              overflowY: 'auto',
            },
          },
        }}
      >
        <Cell span={3}>
          <Navigation
            items={nav}
            activeItemId={router.pathname}
            onChange={({ event, item }) => {
              event.preventDefault();
              void router.push(item.itemId || '/');
            }}
          />
        </Cell>
        <Cell span={9}>{children}</Cell>
      </Grid>
      <AudioLayout />
    </>
  );
};

export default MainLayout;
