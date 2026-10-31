import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, image, url, jsonLd }) => {
  const siteUrl = "https://superfineboy.co.za";
  const fullTitle = title ? `${title} | Superfineboy` : "Superfineboy | South African Online Clothing Store";
  const desc = description || "Shop quality fashion for everyone at Superfineboy. Clothing delivered across South Africa.";
  const img = image || `${siteUrl}/og-image.jpg`;
  const pageUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={pageUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={img} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default SEO;