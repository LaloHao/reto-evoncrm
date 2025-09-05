import Link from 'next/link';

import { getSharedForms } from '@/actions/forms/get-shared-forms';

export default async function SharedFormList() {
  const forms = await getSharedForms();
  return (
    <div className="space-y-4 flex flex-col">
      {forms?.data?.map((form) => (
        <Link
          key={form.id}
          href={`/form/${form.id}`}
          className="p-4 border rounded hover:shadow transition w-full text-left"
        >
          <h3 className="text-lg font-medium">{form.title}</h3>
          <p className="text-sm text-gray-700">{form.description}</p>
          <p className="text-sm text-gray-500">
            Created at: {new Date(form.createdAt).toLocaleDateString()}
          </p>
        </Link>
      ))}
    </div>
  );
}
