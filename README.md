# restaurant-reviews-pws

Restaurant Reviews is a PWA (Progressive Web App) and a project designed as part of the Google Developer Scholarship Program and may contain assets contributed from various third party sources therein.
Requirements: Node.js, Python2.7 or Python3, and Chrome or similar web browser.

This allows you view a small selection of restaurants in New York, filtering by various restaurant categories and neighborhoods.
You are able to review and favorite restaurants even when offline. The Service Worker will ensure that the browser caching APIs along with IndexedDB stay in sync with the server backend at all times.

Step 1:
You will need to fork and clone the <a href="https://github.com/udacity/mws-restaurant-stage-3">server repository here</a> as it is a dependency.

Step 2:
If you have node installed <strong>navigate to the server directory</strong> in your command line or terminal and enter the command "node app.js" which should launch the relevant server.

Step 3:
Next, <strong>once the server is running</strong>, navigate in another command line or terminal tab to the "dist" directory of the restaurant-reviews-pwa and enter the command "python -m SimpleHTTPServer 8000" if you have Python2.7 or enter "python -m http.server 8000" if you have Python3 to launch another server for the restaurant-reviews-pwa itself.

Step 4:
Then, navigate in your web browser to "http://localhost:8000" to preview the Restaurant Reviews application.

PRO TIP:
Note that it is pulling data from the server which runs on port 1337 launched in the first step, but even if you to go offline after the initial launch (navigate to the Network tab in devtools and select "offline" mode), the web application should have all the relevant information stored via the Caches API and the IndexedDB API to continue functioning as if it were still online! 
