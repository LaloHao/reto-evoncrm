'use server';

import { authActionClient } from '@/actions/safe-action';
import { prisma } from '@/lib/db/prisma';
import { FormConfigSchema } from '@/schemas/forms/create-form';

export const createForm = authActionClient
  .metadata({ actionName: 'createForm' })
  .schema(FormConfigSchema)
  .action(async ({ parsedInput: form, ctx }) => {
    const createdForm = await prisma.form.create({
      data: {
        organizationId: ctx.session.user.organizationId,
        title: form.title,
        description: form.description,
        infoTop: form.infoTop,
        infoBottom: form.infoBottom,
        type: form.type === 'simple' ? 'SIMPLE' : 'MULTI_STEP',
        steps: JSON.stringify(form.steps),
        createdBy: ctx.session.user.id,
        updatedBy: ctx.session.user.id
      }
    });
    const sharedLink = await prisma.publicFormShare.create({
      data: {
        title: createdForm.title,
        formId: createdForm.id,
        organizationId: ctx.session.user.organizationId,
        form: JSON.stringify(createdForm),
        expiresAt: null,
        createdBy: ctx.session.user.id,
        updatedBy: ctx.session.user.id
      }
    });
    return { createdForm, sharedLink };
  });
