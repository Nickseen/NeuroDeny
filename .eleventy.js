module.exports = function(eleventyConfig) {
  const assetVersion = process.env.GITHUB_SHA
    ? process.env.GITHUB_SHA.slice(0, 7)
    : Date.now().toString();

  eleventyConfig.addGlobalData("assetVersion", assetVersion);

  // Copy static assets
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("google356c63625b25c074.html");
  eleventyConfig.addPassthroughCopy("src/admin/config.yml");
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });
  eleventyConfig.addPassthroughCopy("css");

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("css/");

  // BrowserSync config
  eleventyConfig.setBrowserSyncConfig({
    files: ['_site/**/*'],
    open: true
  });

  // Date filter for blog posts
  eleventyConfig.addFilter("dateFormat", function(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('ru-RU', options);
  });

  // Excerpt filter
  eleventyConfig.addFilter("excerpt", function(content) {
    const excerpt = content.substring(0, 200);
    return excerpt + (content.length > 200 ? '...' : '');
  });

  eleventyConfig.addFilter("absoluteUrl", function(path, siteUrl) {
    if (!path) return siteUrl;
    if (/^https?:\/\//i.test(path)) return path;
    const base = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalizedPath}`;
  });

  eleventyConfig.addFilter("json", function(value) {
    return JSON.stringify(value);
  });

  eleventyConfig.addFilter("htmlDateString", function(date) {
    return new Date(date).toISOString().split("T")[0];
  });

  eleventyConfig.addFilter("visibleReviewCount", function(items) {
    return Array.isArray(items) ? items.filter(item => !item.hidden).length : 0;
  });

  eleventyConfig.addFilter("serviceSchema", function(categories) {
    const services = [];
    if (!Array.isArray(categories)) return "[]";

    categories.forEach(category => {
      if (!Array.isArray(category.items)) return;
      category.items.forEach(item => {
        if (item.hidden) return;
        services.push({
          "@type": "Service",
          "name": item.name,
          "serviceType": category.category,
          "areaServed": "Комрат, Гагаузия, Молдова",
          "provider": { "@id": "https://nickseen.github.io/NeuroDeny/#clinic" }
        });
      });
    });

    return JSON.stringify(services);
  });

  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("sitemapPages", function(collectionApi) {
    return collectionApi.getAll()
      .filter(item => item.url && !item.inputPath.includes("/admin/") && !item.data.eleventyExcludeFromCollections)
      .sort((a, b) => a.url.localeCompare(b.url));
  });

  return {
    pathPrefix: "/NeuroDeny/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    templateFormats: ["md", "njk", "html", "liquid"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
