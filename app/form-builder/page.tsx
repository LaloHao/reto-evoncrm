'use client';

import { useState } from 'react';
import { useFormBuilder } from '@/common/form/form';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { FieldList } from '@/components/FormEditor/FieldList';
import { FormConfigEditor } from '@/components/FormEditor/FormConfigEditor';
import { SourceCode } from '@/components/FormEditor/SourceCode';
import { FormRenderer } from '@/components/FormPreview/FormRenderer';

export default function Page() {
  const formBuilder = useFormBuilder();

  const [isShowingSource, showSource] = useState(false);

  return (
    <>
      <div className="flex flex-col my-10 flex-1">
        <DndProvider backend={HTML5Backend}>
          <div className="flex flex-1 flex-row">
            <div className="space-y-5 m-[10px]">
              <FormConfigEditor formBuilder={formBuilder} />
              <FieldList
                formBuilder={formBuilder}
                showSource={() => showSource(true)}
              />
            </div>
            <div className="flex flex-col flex-1 m-[10px] mr-[15px]">
              <FormRenderer formBuilder={formBuilder} />
            </div>
          </div>
        </DndProvider>
      </div>
      {isShowingSource && (
        <SourceCode
          formBuilder={formBuilder}
          onClose={() => showSource(false)}
        />
      )}
    </>
  );
}
