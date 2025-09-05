import * as React from 'react';
import { type Metadata } from 'next';

import {
  Page,
  PageBody,
  PageHeader,
  PagePrimaryBar,
  PageTitle
} from '@/components/ui/page';
import { createTitle } from '@/lib/utils';

export const metadata: Metadata = {
  title: createTitle('Form List')
};

export default function HomeLayout(
  props: React.PropsWithChildren
): React.JSX.Element {
  return (
    <Page>
      <PageHeader>
        <PagePrimaryBar>
          <PageTitle>Form List</PageTitle>
        </PagePrimaryBar>
      </PageHeader>
      <PageBody>
        <div className="mx-auto max-w-6xl p-2 sm:p-6">{props.children}</div>
      </PageBody>
    </Page>
  );
}
