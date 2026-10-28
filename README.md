# Relief & 1601-EQ Formatter

Browser-based tool: converts Relief Purchases, Relief Sales and 1601-EQ Excel templates into BIR DAT files. Workbook and DAT files are processed locally in your browser and are not uploaded. If you configure Firebase and sign in, saved filer profiles (including the personal and tax details you save in them) are synced to your Firebase account; otherwise profiles stay in this browser.

## Publish on GitHub Pages
1. Create a new GitHub repository (e.g. `bir-dat`) and upload all files in this folder to the root of the `main` branch.
2. Repo **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`. Save.
3. After a minute the app is live at `https://<your-username>.github.io/bir-dat/`.

## Install on desktop
Open the live link in Chrome or Edge, then click the install icon in the address bar (or menu → *Install app* / *Apps → Install this site as an app*). It gets its own window, a desktop/Start-menu shortcut, and works offline after the first visit.

## Updating
Replace `index.html`, and change `VERSION` in `sw.js` (v1 → v2) so installed copies pick up the new version.

## Google login (Firebase)
When Firebase is configured and you sign in, the app syncs the filer profiles you save—including the tax, business, and address details in each profile—to that user's Firestore document, so they can be used on another computer. Uploaded workbooks and generated DAT/Excel files remain local to your browser and are not sent to Firebase.
1. Firebase console > **Authentication > Sign-in method**: enable **Google**.
2. **Authentication > Settings > Authorized domains**: add `<your-username>.github.io`.
3. **Firestore Database**: create a database, then **Rules**: paste the contents of `firestore.rules` and publish.
4. **Project settings > Your apps > Web app (</>)**: copy the config and paste it into `firebase-config.js`.
5. Upload `firebase-config.js` to the repo. Without a valid Firebase config, the app still works and stores profiles in the browser only; with Firebase configured, saved profiles are synced after sign-in. The web app's Firestore collection is `birdat_users` (document ID is the user's Firebase UID); the supplied `firestore.rules` grants a signed-in user access only to their own document.
