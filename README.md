# Relief & 1601-EQ Formatter

Browser-only tool: converts Relief Purchases, Relief Sales and 1601-EQ Excel templates into BIR DAT files.
Nothing is uploaded; all work happens in the browser.

## Publish on GitHub Pages
1. Create a new GitHub repository (e.g. `bir-dat`) and upload all files in this folder to the root of the `main` branch.
2. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`. Save.
3. After a minute the app is live at `https://<your-username>.github.io/bir-dat/`.

## Install on desktop
Open the live link in Chrome or Edge, then click the install icon in the address bar (or menu → *Install app* / *Apps → Install this site as an app*). It gets its own window, a desktop/Start-menu shortcut, and works offline after the first visit.

## Updating
Replace `index.html`, and change `VERSION` in `sw.js` (v1 → v2) so installed copies pick up the new version.

## Google login (Firebase)
Login saves each user's filer profiles to their own Firebase account, so they follow the user to any computer.
1. Firebase console > **Authentication > Sign-in method**: enable **Google**.
2. **Authentication > Settings > Authorized domains**: add `<your-username>.github.io`.
3. **Firestore Database**: create a database, then **Rules**: paste the contents of `firestore.rules` and publish.
4. **Project settings > Your apps > Web app (</>)**: copy the config and paste it into `firebase-config.js`.
5. Upload `firebase-config.js` to the repo. Without it, the app still works and keeps profiles in the browser only.
