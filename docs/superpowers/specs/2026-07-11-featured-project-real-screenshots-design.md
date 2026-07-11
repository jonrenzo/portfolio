# Featured Project Real Screenshots Design

## Goal

Replace the current fallback/placeholder featured project images with real screenshots from the four featured project repositories:

- TelcoVantage ERP System
- Telcovantage Site Map Reader
- MediSync System
- QuestCommute

The portfolio should keep using the existing image naming pattern so the change stays small and does not alter the featured project layout.

## Current Context

The portfolio is a Vue app. Project metadata lives in `src/data/portfolio.js`, and featured project cards are rendered in `src/views/HomeView.vue`.

The current image resolver builds paths as `/img/portfolio-${project.imageUrl}.png`. The four featured projects reference these image slugs:

- `tvph-erp-system`
- `telcovantage`
- `medisync`
- `questcommute`

Those files are currently missing from `public/img`, so the app falls back to `portfolio-default.png`.

## Approved Approach

Use real project screenshots where possible:

1. Clone or inspect each featured project repository outside the portfolio workspace.
2. Prefer existing checked-in real screenshots when a repo already includes them.
3. For repos without screenshot assets, install and run the app locally where practical, then capture the best public or accessible screen.
4. If a repo needs private Supabase/API credentials or authenticated data, capture the best real available screen, such as a landing page, login page, dashboard shell, or other local UI state.
5. Do not generate fake mockups for these featured project images.

## Assets

The final images will be saved in `public/img`:

- `portfolio-tvph-erp-system.png`
- `portfolio-telcovantage.png`
- `portfolio-medisync.png`
- `portfolio-questcommute.png`

The existing `projectImage(project)` helper can continue resolving these files without code changes.

## Repo Findings

- TVPH ERP is a Next.js app and already includes real screenshots in its `public` folder.
- Telcovantage Site Map Reader is a Next.js frontend with a Flask backend. It may run enough frontend UI locally without backend interaction.
- MediSync is a Next.js app backed by Supabase and a forecasting API. It may show a login or public screen without private credentials.
- QuestCommute is an Expo React Native app with a web script. It may run through Expo web, but native-only dependencies can affect browser rendering.

## Error Handling

If a project cannot run locally or cannot reach a meaningful authenticated screen, use the closest real repo/app output available. The portfolio should still fall back to `portfolio-default.png` if an image file is missing or fails to load.

## Testing

After adding assets:

- Confirm the four expected files exist in `public/img`.
- Run the portfolio build.
- Start the portfolio locally and inspect the featured project cards in the browser.
- Verify the cards no longer show the fallback image for featured projects.

## Out of Scope

- Redesigning project cards.
- Changing featured project ordering.
- Adding new project metadata fields.
- Adding generated or AI-created screenshots.
