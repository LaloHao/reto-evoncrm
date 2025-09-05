'use server';

import { prisma } from '@/lib/db/prisma';

import { authActionClient } from '../safe-action';

export const getSharedForms = authActionClient
  .metadata({ actionName: 'getSharedForms' })
  .action(async ({ ctx }) => {
    const sharedForms = await prisma.publicFormShare.findMany({
      where: {
        organizationId: ctx.session.user.organizationId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        description: true,
        formId: true,
        expiresAt: true,
        createdAt: true
      }
    });
    return sharedForms;
  });
