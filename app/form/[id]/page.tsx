import { notFound } from 'next/navigation';

import { getSharedForm } from '@/actions/forms/get-shared-form';
import { FormFiller } from '@/components/FormPreview/FormFiller';

export default async function FormPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getSharedForm(id);
  if (!form) {
    return notFound();
  }
  return <FormFiller form={form} />;
}
