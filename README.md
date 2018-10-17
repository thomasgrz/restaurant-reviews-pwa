<strong>TLDR: PLEASE RUN THE APPLICATION FROM THE DIST DIRECTORY! </strong>

Restaurant Reviews is PWA (Progressive Web App) which is a part of the Google Developer Scholarship Program and may contain assets contributed from various third party sources therein.
Requirements: Node.js, Python2.7 or Python3, and Chrome or similar web browser.

You will need to fork and clone the <a href="https://github.com/udacity/mws-restaurant-stage-3">server repository here</a>
If you have node installed <strong>begin by navigating to the "stage-three-server" directory</strong> in your command line or terminal and enter the command "node app.js" which should launch the relevant server.
Next, <strong>once the "stage-two-server" server is running</strong>, simultaneously navigate in another command line or terminal tab to the "dist" directory and enter the command "python -m SimpleHTTPServer 8000" if you have Python2.7 or enter "python -m http.server" if you have Python3.
Then, navigate in your web browser to "http://localhost:8000" to preview the Restaurant Reviews application.

Note that it is pulling data from the "stage-three-server" server launched in the first step, but even if you to go offline after the initial launch (navigator to the network in dev tools and select "offline"), the web application should have all the relevant information stored via the Caches API and the IndexedDB API built into most modern browsers to continue functioning as if it were still online!
