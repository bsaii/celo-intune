import { Button } from 'baseui/button';
import React from 'react';
import { useStyletron } from 'baseui';

export const sum = (a: number, b: number) => a + b;

export default function Home() {
  const [css, theme] = useStyletron();
  return (
    <div>
      <Button onClick={() => console.log('hey')}>Hello</Button>
      <p className={css({ color: theme.colors.accent600 })}>Styled by hook</p>
    </div>
  );
}
