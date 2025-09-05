import { notFound } from 'next/navigation';

import { getForm } from '@/actions/forms/get-form';
import { FormFiller } from '@/components/FormPreview/FormFiller';

export default async function FormPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const form = await getForm(id);
  if (!form) {
    return notFound();
  }
  return <FormFiller form={form} />;
}
