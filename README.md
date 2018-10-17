#restaurant-reviews-pws
Restaurant Reviews is PWA (Progressive Web App) which is a project designed as apart of the Google Developer Scholarship Program and may contain assets contributed from various third party sources therein.
Requirements: Node.js, Python2.7 or Python3, and Chrome or similar web browser.

This allows you to toggle between neighborhoods in New York, filtering by various restaurant categories, or neighborhoods.
You are able to review and favorite restaurants even when offline, and the Service Worker will ensure that the browser caching APIs/IndexedDB stay in sync with the stage-three-server at all times.

Step 1:
You will need to fork and clone the <a href="https://github.com/udacity/mws-restaurant-stage-3">server repository here</a> as it is a dependency.

Step 2:
If you have node installed <strong>navigate to the "stage-three-server" directory</strong> in your command line or terminal and enter the command "node app.js" which should launch the relevant server.

Step 3:
Next, <strong>once the "stage-three-server" server is running</strong>, navigate in another command line or terminal tab to the "dist" of the restaurant-reviews-pwa directory and enter the command "python -m SimpleHTTPServer 8000" if you have Python2.7 or enter "python -m http.server" if you have Python3 to launch a server for the restaurant-reviews-pwa

Step 4:
Then, navigate in your web browser to "http://localhost:8000" to preview the Restaurant Reviews application.

PRO TIP:
Note that it is pulling data from the "stage-three-server" server launched in the first step, but even if you to go offline after the initial launch (navigate to the Network tab in devtools and select "offline" mode), the web application should have all the relevant information stored via the Caches API and the IndexedDB API built into most modern browsers to continue functioning as if it were still online! 
