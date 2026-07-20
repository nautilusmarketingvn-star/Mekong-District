# Mekong District — Static Website

Complete static export of the Mekong District / Long Xuyên Land landing page. The stylesheet and all production images are stored in this GitHub repository, so the live website no longer depends on the original source site.

## Run locally

Open `index.html` directly, or serve this folder with any static web server.

## Deploy

The project is compatible with GitHub Pages, Netlify, Cloudflare Pages, and any standard static host. There is no build step.

## Form behavior

The lead form validates inputs and submits through the Cloudflare Worker in `cloudflare-worker/`, which securely forwards valid leads to Google Sheets.
