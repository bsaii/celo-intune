import { Cell, Grid } from 'baseui/layout-grid';
import { DisplayLarge, ParagraphMedium } from 'baseui/typography';
import { Button } from 'baseui/button';
import React from 'react';

export default function Earnings() {
  return (
    <Grid>
      <Cell
        span={12}
        align='center'
        overrides={{
          Cell: {
            style: {
              textAlign: 'center',
            },
          },
        }}
      >
        <DisplayLarge marginBottom='scale600'>CUSD 2.43</DisplayLarge>
        <ParagraphMedium marginBottom='scale600'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
          quibusdam perspiciatis eum! Amet numquam voluptate placeat magni
          quibusdam iusto sunt cumque, corrupti, soluta unde earum, commodi in
          neque consequatur quae?
        </ParagraphMedium>
        <Button>Withraw</Button>
      </Cell>
    </Grid>
  );
}
