This web project is currently meant to be run out of the "tmp" directory while the "stage-two-server" directory is also running.
It requires Node.js be installed on the local machine as well.

First, clone or download the repo.
Next, within the "stage-two-server" directory type the cmd "node app.js" to launch the server that the tmp directory depends on.
Then, within the "tmp" directory enter the cmd "python -m SimpleHTTPServer" (python 2.7) or "python http.server" (python 3).
Then, in your browser navigate to "http://localhost:8000" in order to see the Restaurant Reviews application.
It should pull data from the stage-two-server server on its first launch and then cache that data for offline functionality.

If things are working and set up properly you should be able to kill the stage-two-server server after the websites initial load and still be able to navigate the site as if it were offline--this website uses a combinateino of the Caches API and the IndexedDB API for offline functionality.