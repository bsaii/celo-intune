import { Cell, Grid } from 'baseui/layout-grid';
import { Card } from 'baseui/card';
import React from 'react';

export const AudioLayout = () => {
  return (
    <>
      <Grid
        overrides={{
          Grid: {
            style: {
              postition: 'relative',
            },
          },
        }}
      >
        <Cell
          span={12}
          overrides={{
            Cell: {
              style: {
                postition: 'absolute',
                bottom: '0px',
                left: '0px',
                right: '0px',
              },
            },
          }}
        >
          <Card>I will play your songs</Card>
        </Cell>
      </Grid>
    </>
  );
};
