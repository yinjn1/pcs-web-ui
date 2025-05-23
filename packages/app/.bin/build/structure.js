export const structure = {
  app: {
    index: "src/index.tsx",
    tsConfig: "tsconfig.json",
    tsConfigPathsContext: ".",
    marks: "src/app/view/dataTest/json",
  },
  template: {
    dir: "public",
    index: "index.html",
    adapter: "static/adapter.js",
    adapterCockpit: "static/adapterCockpit.js",
    manifest: "manifest.json",
    manifestCockpit: "manifestCockpit.json",
    ico: "static/media/favicon.png",
  },
  output: {
    static: "static",
    media: "static/media",
    main: "main",
    marks: "manifest_test_marks.json",
  },
};
