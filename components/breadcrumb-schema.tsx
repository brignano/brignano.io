interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb structured data for search results. A plain <script> (not
 * next/script) so the JSON-LD is in the server-rendered HTML that crawlers
 * read first, instead of being injected after hydration.
 *
 * @see https://nextjs.org/docs/app/guides/json-ld
 */
export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape "<" so the JSON can never close the script tag early.
        __html: JSON.stringify(breadcrumbList).replace(/</g, "\\u003c"),
      }}
    />
  );
}
