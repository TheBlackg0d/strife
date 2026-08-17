# Prompts Google Stitch — UI Strife

Quatre prompts séparés, un par page, à copier-coller directement dans Google Stitch. Chacun est autonome (répète le contexte de style) pour rester cohérent même si tu les lances dans des sessions Stitch différentes.

Direction visuelle : proche de Discord — thème sombre, sidebar de guildes à gauche, palette accent "blurple" (violet-bleu).

---

## 1. Login Page

```
Design a dark-themed login page for "Strife", a Discord-like chat app for communities and friend groups.

Layout: centered modal-style card (max-width ~480px) on a solid dark background (#313338), vertically and horizontally centered on the viewport. No sidebar on this page.

Card content, top to bottom:
- App wordmark "Strife" at the top, bold, white text
- Heading "Welcome back!" (large, bold, white)
- Subheading "We're so excited to see you again!" (smaller, muted gray text, #B5BAC1)
- Label "EMAIL OR USERNAME" (small, uppercase, gray, bold) above a text input
- Text input, dark gray background (#1E1F22), rounded corners (~4px), white text, no visible border, subtle focus glow in accent purple when focused
- Label "PASSWORD" above a second text input, same style, obscured characters
- A "Forgot your password?" link, small, accent purple (#5865F2), right-aligned or just below the password label
- Primary "Log In" button, full width, accent purple background (#5865F2), white bold text, rounded corners (~4px), slightly lighter purple on hover
- Below the button, a divider or spacing, then a row of secondary buttons for social login: "Continue with Google" and "Continue with Facebook", each full width, dark gray background (#2B2D31), white text, provider logo icon on the left, subtle border
- At the very bottom, small centered text: "Need an account?" followed by a "Register" link in accent purple

Card background: slightly lighter than the page background (#2B2D31), rounded corners (~8px), subtle drop shadow.

Typography: clean rounded sans-serif (similar to gg sans / Whitney), white primary text, muted gray secondary text.

Overall mood: modern, friendly, gamer/community-focused chat app — not corporate or enterprise-looking.
```

---

## 2. Register Page

```
Design a dark-themed registration (sign up) page for "Strife", a Discord-like chat app for communities and friend groups. Visually consistent with the login page of the same app (same dark theme and accent color).

Layout: centered modal-style card (max-width ~480px) on a solid dark background (#313338), vertically and horizontally centered on the viewport. No sidebar on this page.

Card content, top to bottom:
- App wordmark "Strife" at the top, bold, white text
- Heading "Create an account" (large, bold, white)
- Label "EMAIL" (small, uppercase, gray, bold) above a text input
- Label "USERNAME" above a text input, with small helper text below it: "This is how others will see you. You'll get a unique 4-digit tag automatically."
- Label "PASSWORD" above a password input (obscured characters), with a small password-strength hint below
- Label "CONFIRM PASSWORD" above a second password input
- All inputs styled the same as the login page: dark gray background (#1E1F22), rounded corners (~4px), white text, subtle purple focus glow
- Small checkbox with text "I agree to Strife's Terms of Service and Privacy Policy", muted gray text with the terms/privacy words as accent-purple links
- Primary "Continue" / "Sign Up" button, full width, accent purple background (#5865F2), white bold text, rounded corners, slightly lighter purple on hover
- Divider, then secondary buttons "Continue with Google" and "Continue with Facebook", same style as login page (dark gray background, provider icon, white text)
- At the bottom, small centered text: "Already have an account?" followed by a "Log In" link in accent purple

Card background: slightly lighter than the page background (#2B2D31), rounded corners (~8px), subtle drop shadow.

Typography: clean rounded sans-serif (similar to gg sans / Whitney), white primary text, muted gray secondary/helper text.

Overall mood: modern, friendly, gamer/community-focused chat app — not corporate or enterprise-looking. Should feel like a natural next step from the login page.
```

---

## 3. Page d'accueil (Home — friends list + DMs)

```
Design the home screen for "Strife", a Discord-like chat app, in dark theme. This is the first screen a logged-in user lands on: their friends list and direct messages — NOT a server/guild view.

Overall layout, three vertical columns left to right, full viewport height:

1. Guild rail (far left, ~72px wide, darkest background #1E1F22): a vertical scrollable strip of circular guild icons (colored circle avatars, 48px each). At the very top, a distinct "Strife" home icon in a rounded-square shape, currently active/highlighted (white pill indicator on its left edge), since we're on the home screen rather than inside a guild. Below a divider, the rest of the user's guild icons. At the bottom, a green "+" circular button to add a guild.

2. DM sidebar (~240px wide, background #2B2D31): at the top, a search bar/button labeled "Rechercher ou lancer une conversation". Below it, a stacked nav list: "Amis" (friends icon), "Demandes de message" (message-request icon, with a small unread badge), "Nitro" (icon), "Boutique" (icon, with a "NOUVEAU" pill badge), "Quêtes" (icon) — muted gray text and icons, one of them (here "Amis") shown as currently selected with a lighter background and white text. Below a "MESSAGES PRIVÉS" section label and a "+" icon to start a new DM, a scrollable list of direct-message conversations: each row shows a circular avatar (with a small colored status dot in the corner — green online, gray offline, red for a "do not disturb"/blocked-style icon overlay on a couple of avatars), the contact's display name in white or light gray, and for group DMs a small "X membres" subtext instead of status. The very first conversation in the list is highlighted as selected. At the bottom of this sidebar, a fixed user panel: the current user's avatar (circular, with online status dot), username, "En ligne" status text below it, and small mic/headphone/settings icons on the right.

3. Main content area (flexible width, background #313338): since "Amis" is selected in the sidebar, show a header bar at the top with a friends icon, the word "Amis" in bold white, and a horizontal row of filter tabs — "En ligne", "Tous", "En attente", "Bloqués" — plus a filled purple "Ajouter un ami" button on the right, and a small icon-only toggle for switching to a threads/message-requests view. Below the header, the friends list: a "EN LIGNE — N" section label in small uppercase muted gray, then rows for each online friend — circular avatar with green status dot, display name in white, a small muted-gray secondary line (e.g. "En ligne" or a custom status), and on hover/row-end a row of small circular icon buttons (message bubble to open a DM, video call, more-options "..."). Include at least 4-5 example friend rows with varied avatar colors and names.

Color palette: dark backgrounds (#1E1F22 darkest, #2B2D31 sidebars, #313338 main content), accent purple #5865F2 for the "Ajouter un ami" button and active/selected states, white primary text, muted gray (#949BA4 / #B5BAC1) secondary text, status colors green (online), yellow (idle), red (dnd), gray (offline).

Typography: clean rounded sans-serif (similar to gg sans / Whitney).

Overall mood: calm, organized, this is the "front door" of the app before entering any community — should read clearly as a friends/DM hub, distinct from the busier in-guild channel view.
```

---

## 3b. Page d'accueil — variante avec un DM ouvert

```
Design a variant of the "Strife" home screen (same app as above, same dark theme and same guild rail + DM sidebar structure) where instead of the "Amis" list, the user has clicked the first conversation in their DM sidebar and it is now open in the main content area.

Layout: identical guild rail (far left, ~72px, background #1E1F22) and DM sidebar (~240px, background #2B2D31, same "Amis"/"Demandes de message"/"Nitro"/"Boutique"/"Quêtes" nav, "MESSAGES PRIVÉS" list with the first conversation now highlighted as active) as described in the friends-list version.

Main content area (flexible width, background #313338), now showing the open direct message conversation:
- Header bar: the contact's circular avatar (small), their display name in bold white, small call/video-call/pin/add-friend/profile icons on the right, and a search input on the far right labeled "Rechercher [name]"
- Below the header, a system message block at the top of the conversation: a large circular avatar of the contact, their display name in bold, their username in muted gray below it, a short line "Ceci est le début de l'historique de tes messages privés avec [name].", a small "X serveurs en commun" note, and small "Ajouter", "Bloquer" (dark gray), and "Signaler un spam" (red) buttons in a row
- Below that, the actual message history: a centered muted-gray date divider (e.g. "9 août 2026"), then message rows — each with a small circular avatar on the left, the sender's name in bold white plus a muted-gray timestamp on the same line, and the message text below; alternate a couple of messages between the current user and the contact, with the current user's messages sometimes spanning two consecutive lines (only one avatar/name header, per Discord-style grouping)
- At the very bottom, a rounded message input bar (background #383A40) spanning the width, "+" attachment icon on the left, placeholder text "Envoyer un message à @[name]", and gift/GIF/sticker/emoji/apps icons on the right

Optionally, a right-hand user profile sidebar (~280px, background #2B2D31): large contact banner/avatar at top, display name, username, "En ligne" or offline indicator, a small flag/badge row, "Membre depuis [date]" section, and shared-server info — collapsible/toggleable, shown here as open.

Color palette and typography: identical to the friends-list version (dark backgrounds #1E1F22/#2B2D31/#313338, accent purple #5865F2, white primary text, muted gray #949BA4/#B5BAC1 secondary text).

Overall mood: same calm DM hub, now focused on a single active conversation — should look like a natural continuation of clicking a conversation from the sidebar in the previous screen.
```

---

## 4. Landing Page

```
Design a marketing landing page for "Strife", a Discord-like chat app for communities and friend groups, meant to convince first-time visitors to sign up. Dark theme, consistent with the in-app product's visual identity (dark backgrounds, accent purple #5865F2).

Sections, top to bottom:

1. Navigation bar: "Strife" wordmark/logo on the left, white bold text. On the right, nav links ("Download", "Nitro-like features", "Safety") in muted gray, and a prominent "Login" text link plus a filled "Sign Up" button in accent purple with rounded corners.

2. Hero section: large, bold, white headline (e.g. "Where communities come to life"), a smaller muted-gray subheadline below it explaining the product in one sentence, and two call-to-action buttons side by side: a primary "Sign Up" button (accent purple, filled, rounded) and a secondary "Open in browser" or "Download for [platform]" button (dark gray outline). Below or beside the text, a large illustrative mockup of the app's main interface (server sidebar, channel list, chat) at an angle or in a floating card with soft shadow, plus a few playful floating decorative shapes (blobs, small icons) in purple and complementary accent colors typical of a fun community-app landing page. Background has a subtle dark gradient or soft blurred color blobs for visual interest.

3. Feature highlight section: a 3-column grid, each column with a small icon or illustration, a bold white feature title (e.g. "Text, voice, and video", "Organize with servers and channels", "Always-on communities"), and one or two lines of muted-gray descriptive text.

4. Social proof / community section: a bold centered headline (e.g. "Millions of communities. Never boring."), with a grid or scattered collage of colorful rounded-square community icons/avatars behind or around the text, dark background.

5. Final call-to-action band: centered, full-width section with a bold white headline (e.g. "Ready to jump in?"), a muted-gray subline, and a large accent-purple "Sign Up" button, on a slightly different dark background shade to separate it from the section above.

6. Footer: dark background, multiple columns of small muted-gray links grouped under headers (Product, Company, Resources, Policies), with the Strife logo and small social icons at the bottom, and a copyright line.

Color palette: dark backgrounds (#1E1F22 / #313338), accent purple #5865F2, white headlines, muted gray (#949BA4) body text, occasional playful secondary accent colors (pink, yellow, cyan) used sparingly in decorative illustrations only.

Typography: large bold rounded sans-serif for headlines (similar to gg sans / Whitney), regular weight for body text.

Overall mood: energetic, friendly, and inviting — a marketing page selling the feeling of belonging to a community, not a corporate SaaS product.
```
