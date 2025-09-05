'use server';

import { prisma } from '@/lib/db/prisma';

import { authActionClient } from '../safe-action';

export const getForms = authActionClient
  .metadata({ actionName: 'getForms' })
  .action(async ({ ctx }) => {
    const forms = await prisma.form.findMany({
      where: {
        organizationId: ctx.session.user.organizationId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        createdAt: true
      }
    });
    return forms;
  });
