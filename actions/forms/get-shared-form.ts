'use server';

import { FormConfig } from '@/common/form/types';

import { prisma } from '@/lib/db/prisma';

export async function getSharedForm(
  id: string
): Promise<FormConfig | undefined> {
  const dbForm = await prisma.publicFormShare.findFirst({
    where: { id }
  });
  if (!dbForm || (dbForm.expiresAt && dbForm.expiresAt < new Date())) {
    return undefined;
  }

  try {
    if (typeof dbForm.form === 'string') {
      const parsed = JSON.parse(dbForm.form);
      const steps = JSON.parse(parsed.steps);
      parsed.steps = steps;
      if (
        typeof parsed !== 'object' ||
        !parsed ||
        !Array.isArray(parsed.steps) ||
        typeof parsed.type !== 'string' ||
        typeof parsed.title !== 'string' ||
        typeof parsed.description !== 'string'
      ) {
        console.error('Parsed form is not a valid FormConfig:', parsed);
        throw new Error('Parsed object is not a valid FormConfig');
      }
      console.log('Parsed form:', parsed);
      return parsed;
    }
  } catch (error) {
    console.error('Failed to parse form JSON:', error);
  }

  // const form: FormConfig = {
  //   title: dbForm.title,
  //   description: dbForm.description || undefined,
  //   infoTop: dbForm.infoTop || undefined,
  //   infoBottom: dbForm.infoBottom || undefined,
  //   type: dbForm.type === 'SIMPLE' ? 'simple' : 'multi-step',
  //   steps: typeof dbForm?.steps === 'string' ? JSON.parse(dbForm.steps) : []
  // };
  return undefined;
}
