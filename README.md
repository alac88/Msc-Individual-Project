# Msc-Individual-Project

Clone the repository and run `npm install` from the `frontend` and `node-postgres` directories to install additional packages.

* In the `frontend` folder, run:
```bash
$ npm start
```

* In the `backend/node-postgres`, run:
```bash
$ node index.js
```

* In the `backend/scripts/download`, run:
```bash
$ java -jar ${SELENIUM_FILE}
```

Accordingly to https://github.com/alexMyG/AndroPyTool, pull the AndroPyTool container from Docker hub:
```bash
$ docker pull alexmyg/andropytool
```

### Notes
1. You might have to download your own `chromedriver` and add it in the `backend/scripts/download` folder, depending on which OS you are currently using.
2. Because some of our scripts use `sudo` rights, you need to grant sudo rights to your current user.

