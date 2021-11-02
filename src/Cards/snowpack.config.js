// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/#configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: { url: "/", static: true, resolve: false },
    src: "/",
  },
  plugins: [
    [
      '@snowpack/plugin-sass', { 
        style: "compressed",
        sourceMap: true, 
      }
    ]
  ],
  // installOptions: {},
  devOptions: {
    "port": 3000,
    "open": "none",
    "bundle": false,
  },
  buildOptions: {
    "clean": true,
    "out": "../../build",
    "metaUrlPath": "/vendor"
  },
  exclude: [
    "**/node_modules/**/*"
  ]
};
