# Migration Plan: Gatsby v2 → v5 with Node 20 LTS

## Overview
Upgrade this old Gatsby v2 blog (Node 12) to Gatsby v5 with Node 20 LTS, React 18, and TypeScript (replacing Flow).

## Critical Files to Modify
- `package.json` - All dependency updates
- `gatsby-config.js` - Plugin configs + GraphQL syntax
- `gatsby-node.js` - Node APIs
- `gatsby-ssr.js` - React 18 compatibility
- `src/assets/scss/_variables.scss` - SCSS math.div fix
- `src/templates/*.js` - GraphQL query syntax
- `gatsby/pagination/*.js` - GraphQL query syntax
- `.eslintrc` - ESLint config update
- `tests/jest-config.js` - Jest 29 config
- 77 source files - Flow → TypeScript conversion

---

## Phase 1: Core Dependency Updates

### 1.1 Update `package.json` engines
```json
"engines": {
  "node": ">=20.0.0",
  "npm": ">=10.0.0"
}
```

### 1.2 Delete lockfile and node_modules
```bash
rm -rf node_modules package-lock.json
```

### 1.3 Update core dependencies in package.json

**Gatsby ecosystem:**
- `gatsby`: ^5.13.0
- `gatsby-link`: ^5.13.0
- All `gatsby-plugin-*`: v5/v6 compatible versions
- All `gatsby-remark-*`: v6/v7 compatible versions
- All `gatsby-transformer-*` and `gatsby-source-*`: v5/v6 versions

**React:**
- `react`: ^18.2.0
- `react-dom`: ^18.2.0
- `react-test-renderer`: ^18.2.0

**SCSS (replace node-sass):**
- Remove: `node-sass`
- Add: `sass`: ^1.69.0

**Testing:**
- `jest`: ^29.7.0
- `babel-jest`: ^29.7.0
- `jest-cli`: remove (included in jest)

**Babel:**
- `@babel/core`: ^7.23.0
- `@babel/preset-env`: ^7.23.0
- `@babel/preset-react`: ^7.23.0
- Remove deprecated proposal plugins (now in preset-env)

**ESLint:**
- `eslint`: ^8.56.0
- `@babel/eslint-parser`: ^7.23.0 (replaces babel-eslint)
- Remove: `babel-eslint`

**TypeScript (new):**
- Add: `typescript`: ^5.3.0
- Add: `@types/react`: ^18.2.0
- Add: `@types/node`: ^20.0.0
- Add: `gatsby-plugin-typescript`: ^5.13.0

**Remove Flow:**
- Remove: `flow-bin`
- Remove: `eslint-plugin-flowtype`
- Remove: `@babel/plugin-transform-flow-strip-types`
- Remove: `gatsby-plugin-flow`

---

## Phase 2: SCSS Migration (node-sass → sass)

### 2.1 Fix division syntax in `src/assets/scss/_variables.scss` (line 89)

**Before:**
```scss
$typographic-leading: round(16 * ($typographic-root-font-size / 100) * $typographic-base-line-height);
```

**After:**
```scss
@use "sass:math";
$typographic-leading: math.round(16 * math.div($typographic-root-font-size, 100) * $typographic-base-line-height);
```

### 2.2 Update `gatsby-config.js` sass plugin config

Update `cssLoaderOptions.camelCase` (deprecated) to new format:
```js
{
  resolve: 'gatsby-plugin-sass',
  options: {
    postCssPlugins: [...postCssPlugins],
    cssLoaderOptions: {
      modules: {
        exportLocalsConvention: 'asIs',
      },
    },
  },
}
```

---

## Phase 3: GraphQL Query Syntax Updates (Gatsby 5 breaking change)

### 3.1 Update sort syntax (multiple files)

**Before:**
```graphql
sort: { order: DESC, fields: [frontmatter___date] }
```

**After:**
```graphql
sort: { frontmatter: { date: DESC } }
```

**Files:**
- `gatsby-config.js` (line 68) - RSS feed query
- `src/templates/tag-template.js`
- `src/templates/guest-posts-template.js`
- `src/templates/archive-template.js`

### 3.2 Update group syntax

**Before:**
```graphql
group(field: frontmatter___tags)
```

**After:**
```graphql
group(field: { frontmatter: { tags: SELECT } })
```

**Files:**
- `gatsby/pagination/create-tags-pages.js`
- `src/templates/tags-list-template.js`

---

## Phase 4: React 18 Compatibility

### 4.1 Update `gatsby-ssr.js`
- Add key prop to JSX elements in `setHeadComponents`
- Replace deprecated `darkQuery.addListener` with `addEventListener('change', ...)`

---

## Phase 5: Flow → TypeScript Migration

### 5.1 Create `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "ES2020"],
    "jsx": "react",
    "strict": false,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src/**/*", "gatsby-*.ts"],
  "exclude": ["node_modules", "public", ".cache"]
}
```

### 5.2 Convert 77 Flow files to TypeScript
- Remove `// @flow` annotations
- Rename `.js` → `.tsx` for React components
- Convert Flow type syntax to TypeScript syntax
- Start with `strict: false` to allow gradual typing

### 5.3 Delete `.flowconfig`

---

## Phase 6: ESLint Configuration Update

### 6.1 Update `.eslintrc`
- Change parser: `babel-eslint` → `@babel/eslint-parser`
- Add TypeScript support
- Update deprecated rules:
  - `simple-import-sort/sort` → `simple-import-sort/imports`

---

## Phase 7: Jest Configuration Update

### 7.1 Update `tests/jest-config.js`
- Replace deprecated `testURL` with `testEnvironmentOptions.url`
- Update transform config for Jest 29

### 7.2 Update `tests/jest-preprocess.js`
- Update for Babel 7.23 changes
- Remove deprecated proposal plugins

### 7.3 Update `tests/__mocks__/gatsby.js`
- Add React 18 compatible mocks

---

## Phase 8: Plugin Compatibility Check

These plugins may not have Gatsby 5 versions - need alternatives:
- `gatsby-plugin-optimize-svgs` - Check/remove if incompatible
- `gatsby-remark-code-headers` - May need custom solution
- `gatsby-remark-external-links` - Replace or update
- `gatsby-remark-figure-caption` - Check compatibility
- `gatsby-remark-reading-time` - Check compatibility
- `gatsby-remark-relative-images` - Used in `gatsby/on-create-node.js`

---

## Phase 9: Install & Test

```bash
npm install
npm run clean
npm run build
npm run develop
npm test
npm run lint
```

---

## Execution Order

1. Create git branch: `git checkout -b upgrade-gatsby-5`
2. Update package.json with all new versions
3. Delete node_modules and package-lock.json
4. Run `npm install` (expect some peer dep warnings)
5. Fix SCSS division syntax
6. Fix GraphQL query syntax (all files)
7. Update gatsby-ssr.js for React 18
8. Update gatsby-config.js plugin configs
9. Update Jest and ESLint configs
10. Run `npm run build` - fix errors iteratively
11. Create tsconfig.json and install TypeScript deps
12. Convert Flow files to TypeScript (batch by directory)
13. Run tests, update snapshots as needed
14. Manual testing in development mode
15. Production build verification

---

## Risk Notes

**High risk:**
- GraphQL syntax changes across multiple files
- `gatsby-remark-relative-images` may break image processing
- TypeScript conversion of 77 files

**Medium risk:**
- Some remark plugins may lack v5 support
- Jest 29 may require snapshot updates

**Low risk:**
- node-sass → sass is well-documented
- React 18 - Gatsby handles most breaking changes
