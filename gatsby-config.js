'use strict';

const siteConfig = require('./config.js');
const postCssPlugins = require('./postcss-config.js');

module.exports = {
  siteMetadata: {
    url: siteConfig.url,
    siteUrl: siteConfig.url,
    title: siteConfig.title,
    subtitle: siteConfig.subtitle,
    copyright: siteConfig.copyright,
    menu: siteConfig.menu,
    author: siteConfig.author,
    previewImage: siteConfig.previewImage,
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/media`,
        name: 'media',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'assets',
        path: `${__dirname}/static`,
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                site_url: url
                title
                description: subtitle
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map(edge => ({
                ...edge.node.frontmatter,
                description: edge.node.frontmatter.description,
                date: edge.node.frontmatter.date,
                url: site.siteMetadata.site_url + edge.node.fields.slug,
                guid: site.siteMetadata.site_url + edge.node.fields.slug,
                custom_elements: [{ 'content:encoded': edge.node.html }],
              })),
            query: `
            {
              allMarkdownRemark(
                limit: 1000,
                sort: { frontmatter: { date: DESC } },
                filter: {
                  frontmatter: {
                    template: { eq: "post" },
                    draft: { ne: true },
                    guestAuthor: { in: [null, ""] },
                  }
                }
              ) {
                edges {
                  node {
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                      template
                      draft
                      description
                    }
                  }
                }
              }
            }
          `,
            output: '/rss.xml',
            title: siteConfig.title,
          },
        ],
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 700,
              showCaptions: true,
              linkImagesToOriginal: false,
              withWebp: true,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: { wrapperStyle: 'margin-bottom: 1.0725rem' },
          },
          'gatsby-remark-autolink-headers',
          {
            // should be placed after gatsby-remark-autolink-headers
            resolve: 'gatsby-remark-prismjs',
            options: {
              inlineCodeMarker: '›',
            },
          },
          'gatsby-remark-katex',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
          'gatsby-remark-reading-time',
        ],
      },
    },
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-sharp',
      options: {
        defaultQuality: 90,
      },
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [siteConfig.googleAnalyticsId],
        pluginConfig: {
          head: true,
        },
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage(
              filter: {
                path: { regex: "/^(?!/404/|/404.html|/dev-404-page/|/subscriber-thank-you/|/subscription-updated/)/" }
              }
            ) {
              nodes {
                path
              }
            }
          }
        `,
        output: '/sitemap.xml',
        resolveSiteUrl: ({ site }) => site.siteMetadata.siteUrl,
        resolvePages: ({ allSitePage: { nodes } }) => nodes,
        serialize: ({ path }) => ({
          url: path,
          changefreq: 'daily',
          priority: path === '/' ? 1.0 : 0.7,
        }),
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: siteConfig.title,
        short_name: siteConfig.title,
        start_url: '/',
        background_color: '#FFF',
        theme_color: '#164BC5',
        display: 'standalone',
        icons: [
          {
            src: '/favicon2_192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon2_512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        workboxConfig: {
          runtimeCaching: [
            {
              // Use cacheFirst since these don't need to be revalidated (same RegExp
              // and same reason as above)
              urlPattern: /(\.js$|\.css$|static\/)/,
              handler: 'CacheFirst',
            },
            {
              // page-data.json files are not content hashed
              urlPattern: /^https?:.*\page-data\/.*\/page-data\.json/,
              handler: 'NetworkFirst',
            },
            {
              // Add runtime caching of various other page resources
              urlPattern: /^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/,
              handler: 'StaleWhileRevalidate',
            },
            {
              // Google Fonts CSS (doesn't end in .css so we need to specify it)
              urlPattern: /^https?:\/\/fonts\.googleapis\.com\/css/,
              handler: 'StaleWhileRevalidate',
            },
            // Everything above is from the default config.
            {
              // Match any path ending in /
              urlPattern: /\/$/,
              handler: 'NetworkFirst',
            },
          ],
        },
      },
    },
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        postCssPlugins: [...postCssPlugins],
        sassOptions: {
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
        },
        cssLoaderOptions: {
          esModule: false,
          modules: {
            namedExport: false,
          },
        },
      },
    },
  ],
};
