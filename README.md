# Take Shelter Now

[![codecov](https://codecov.io/gh/Open-SGF/take-shelter-now/branch/develop/graph/badge.svg?token=1jtUoxpyd4)](https://codecov.io/gh/Open-SGF/take-shelter-now)

A website for helping people in weather emergencies find shelter fast.

## Documentation

- [docs.opensgf.org](https://docs.opensgf.org/s/take-shelter-now)
  - Non technical documentation, including project overview, designs, and project management information
- [./docs](./docs)
  - Technical documentation, including architecture decisions

## Live Deployments

| Environment         | Status                                                                                                                                                                                  | Url                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Production (`main`) | [![Netlify Status](https://api.netlify.com/api/v1/badges/92aebb13-22ba-4b68-af11-a1dc893d705f/deploy-status?branch=main)](https://app.netlify.com/projects/take-shelter-now/deploys)    | [takeshelternow.org](https://takeshelternow.org/)                                       |
| Staging (`develop`) | [![Netlify Status](https://api.netlify.com/api/v1/badges/92aebb13-22ba-4b68-af11-a1dc893d705f/deploy-status?branch=develop)](https://app.netlify.com/projects/take-shelter-now/deploys) | [develop--take-shelter-now.netlify.app](https://develop--take-shelter-now.netlify.app/) |

## Component Preview

- [Storybook](https://develop--69a78a9d412eefeb045e4248.chromatic.com)
- [Chromatic Library](https://www.chromatic.com/library?appId=69a78a9d412eefeb045e4248&branch=develop)

## First Time Setup

- Make sure you have [Node 22.x](https://nodejs.org) (Ideally using [nvm](https://github.com/nvm-sh/nvm))
- Install dependencies `npm i`

## Running the project

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
