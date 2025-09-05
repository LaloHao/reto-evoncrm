// app/form-builder/actions.ts
'use server';

import { dedupedAuth } from '@/lib/auth';

export async function getSessionServer() {
  return await dedupedAuth();
}
