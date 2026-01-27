import Script from "next/script";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export default function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      "@id": item.url,
    })),
  };

  return (
    <Script
      id={`breadcrumb-schema-${items.length > 0 ? items[items.length - 1].name.toLowerCase().replace(/\s+/g, "-") : "home"}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbList),
      }}
    />
  );
}
