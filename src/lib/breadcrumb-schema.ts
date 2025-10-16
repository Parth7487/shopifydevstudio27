export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const addBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  let script = document.querySelector('script[data-breadcrumb-schema]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb-schema', 'true');
    script.textContent = JSON.stringify(schemaMarkup);
    document.head.appendChild(script);
  }
};
