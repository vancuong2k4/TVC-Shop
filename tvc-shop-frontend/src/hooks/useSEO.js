import { useEffect } from 'react';

/**
 * Hook cập nhật thẻ Meta HTML động cho SEO & Mạng xã hội
 */
export const useSEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  structuredData
}) => {
  useEffect(() => {
    // 1. Title
    if (title) {
      document.title = title.includes('TVC-Shop') ? title : `${title} | TVC-Shop`;
    }

    // Helper tạo hoặc cập nhật meta tag
    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      if (!content) return;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Standard Meta
    if (description) {
      setMetaTag('meta[name="description"]', 'name', 'description', description);
    }
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    }

    // 3. OpenGraph (Facebook, Zalo, LinkedIn)
    const currentUrl = canonicalUrl || window.location.href;
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title || document.title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'TVC-Shop');
    
    if (ogImage) {
      setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    }

    // 4. Twitter Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title || document.title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    if (ogImage) {
      setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);
    }

    // 5. Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentUrl);

    // 6. JSON-LD Schema.org Structured Data
    let schemaScript = document.querySelector('#seo-json-ld');
    if (structuredData) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.setAttribute('id', 'seo-json-ld');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(structuredData);
    } else if (schemaScript) {
      schemaScript.remove();
    }

  }, [title, description, keywords, ogImage, ogType, canonicalUrl, structuredData]);
};

export default useSEO;
