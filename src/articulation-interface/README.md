# Articulation Interface

## Introduction
### Development mode

In development mode, there are two running servers. The front end code is be served by the [webpack dev server](https://webpack.js.org/configuration/dev-server/) which helps with hot and live reloading. The server side Express code is served by a node server using [nodemon](https://nodemon.io/), which automatically restarts the server whenever server-side code changes.

### Production mode

In production mode, there is one running server. All the client side code is bundled into static files using webpack and served by the Node.js/Express application.

## Quick Start

```bash
# Install dependencies
yarn (or npm install)

# Start development server
yarn dev (or npm run dev)

# Build for production
yarn build (or npm run build)

# Start production server
yarn start (or npm start)
```

## Running this on AWS

To run this on AWS, you will have to set two environment variables:

* `BASE_PATH`: If the interface is running on `url/articulations/articulation-interface/`, then `BASE_PATH` should be `/articulations/articulation-interface/`. Otherwise, webpack will not find `bundle.js`.
* `PORT`: This specifies which port the interface runs on.
* `API_URL`: This is the base URL used for all API calls.

Currently, inside `index.jsx`, the routes are hard-coded for the above base URL. It should be possible to give `BroswerRouter` a basename with `BASE_PATH`. If you plan on running this outside of the original AWS setup, you will probably want to fix that.

## Acknowledgements
This is based on Sandeep Raveesh's React boilerplate project.
