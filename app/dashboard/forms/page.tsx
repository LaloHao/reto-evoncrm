import { getForms } from '@/actions/forms/get-forms';

export default async function FormList() {
  const forms = await getForms();
  return (
    <div className="space-y-4">
      {forms?.data?.map((form) => (
        <div
          key={form.id}
          className="p-4 border rounded hover:shadow transition"
        >
          <h3 className="text-lg font-medium">{form.title}</h3>
          <p className="text-sm text-gray-500">
            Created at: {new Date(form.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
