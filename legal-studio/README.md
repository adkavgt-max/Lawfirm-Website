# Legal Studio

A bilingual, responsive, one-page website for a Nepal-based solo law practice. It uses plain HTML, CSS and JavaScript. There is no package manager, build step, tracking code or server requirement. Open `index.html` directly in a browser, or publish this folder on a static host.

## Edit the site

- **Page content and language:** edit the `en` and `ne` dictionaries in `js/i18n.js`. Each page string is connected to an element with a matching `data-i18n` key in `index.html`. Keep the keys in both dictionaries aligned.
- **Colors, type and layout:** update the CSS custom properties at the top of `css/style.css`. The light/dark theme colors are grouped there.
- **Services, FAQ and page structure:** edit the corresponding semantic sections in `index.html`; add the matching translation key to both dictionaries for any new visible copy.
- **Contact handoff:** in `js/main.js`, replace `whatsappNumber` with the WhatsApp number in international format using digits only, and replace `contactEmail`. Update the contact links and visible contact text in `index.html` too.
- **Structured data:** replace the address and phone placeholders in the JSON-LD block in `index.html`.
- **Articles and social profiles:** replace the article placeholders and set the LinkedIn and Instagram profile URLs in `index.html`.
- **Map:** replace the map placeholder in `index.html` with directions or an embed supplied by the lawyer. An embedded map may contact its provider when loaded.

The website has no backend. Submitting the contact form opens a prefilled WhatsApp message; a mailto link is shown as a fallback. The website itself does not store submitted details.

## Before publishing

Replace every square-bracket placeholder, check the contact details and social profile URLs, and confirm the translated text with a fluent Nepali speaker. Review legal content and the disclaimer with the responsible lawyer.

## Deploy for free

### Netlify

1. Sign in at [Netlify](https://www.netlify.com/) and choose **Add new site** then **Deploy manually**.
2. Drag the `legal-studio` folder into the deploy area, or connect the repository containing it and set the publish directory to `legal-studio`.
3. Open the generated site URL and test the form, theme and language controls on a phone and desktop.

### GitHub Pages

1. Push the `legal-studio` folder to a GitHub repository. It can also be the repository root if you move its contents there.
2. In the repository, open **Settings → Pages** and select the branch and folder containing `index.html` (usually `/ (root)` or `/docs`).
3. Save, wait for GitHub Pages to publish, then test the provided URL.

Because this is a static site, no build command is needed. Google Fonts load from Google when a visitor is online; the site's layout and system-font fallbacks still work if that request is unavailable.
