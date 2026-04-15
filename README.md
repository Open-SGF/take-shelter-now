# Take Shelter Now

[![codecov](https://codecov.io/gh/Open-SGF/take-shelter-now/branch/main/graph/badge.svg?token=1jtUoxpyd4)](https://app.codecov.io/gh/Open-SGF/take-shelter-now/tree/main)

A website for helping people in weather emergencies find shelter fast.

## Documentation

- [docs.opensgf.org](https://docs.opensgf.org/s/take-shelter-now)
  - Non technical documentation, including project overview, designs, and project management information
- [./docs](./docs)
  - Technical documentation, including architecture decisions

## Live Deployments

| Environment | Status                                                                                                                                                                           | Url                                                               |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Production  | [![Netlify Status](https://api.netlify.com/api/v1/badges/92aebb13-22ba-4b68-af11-a1dc893d705f/deploy-status)](https://app.netlify.com/projects/take-shelter-now/deploys)         | [takeshelternow.org](https://takeshelternow.org/)                 |
| Staging     | [![Netlify Status](https://api.netlify.com/api/v1/badges/e2e55cbc-e8e4-41d5-b596-2a8759f8460a/deploy-status)](https://app.netlify.com/projects/take-shelter-now-staging/deploys) | [staging.takeshelternow.org](https://staging.takeshelternow.org/) |

## Component Preview

- [Storybook](https://main--69a78a9d412eefeb045e4248.chromatic.com)
- [Chromatic Library](https://www.chromatic.com/library?appId=69a78a9d412eefeb045e4248&branch=main)

## First Time Setup

- Make sure you have [Node 24.x](https://nodejs.org) (Ideally using [nvm](https://github.com/nvm-sh/nvm))
- Install dependencies `npm i`
- Copy `.env.example` to `.env`

### Environment variables

- `PUBLIC_SHELTERS_JSON_URL`: URL to fetch shelter data from, for local development (overrides Google Sheet if set)
- `PUBLIC_SITE_ENV`: Set to `production` to allow indexing; any other value disables indexing
- `PUBLIC_SITE_URL`: Canonical site URL used for sitemap and other absolute URLs
- `GOOGLE_SHEET_ID`: Published Google Sheet ID from `/spreadsheets/d/e/<ID>/pub`
- `GOOGLE_SHEET_GID`: Specific worksheet/tab gid to export as CSV

## Running the project

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
