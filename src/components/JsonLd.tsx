/**
 * Emits a JSON-LD block. Server component only, so the schema is present in the
 * initial HTML rather than injected after hydration.
 */
export default function JsonLd({ schema }: { schema: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Schema objects are built from static site data, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
