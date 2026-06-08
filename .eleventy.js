module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("sitemap.xml");
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
    const base = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
    const normalizedPath = path && path.startsWith("/") ? path : `/${path || ""}`;
    return `${base}${normalizedPath}`;
  });

  eleventyConfig.addFilter("visibleReviewCount", function(items) {
    return Array.isArray(items) ? items.filter(item => !item.hidden).length : 0;
  });

  eleventyConfig.addCollection("blog", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md")
      .sort((a, b) => b.date - a.date);
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
