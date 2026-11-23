/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: "no-circular",
      severity: "error",
      comment: "No circular dependencies.",
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: "no-orphans",
      severity: "error",
      comment: "No orphan modules.",
      from: {
        orphan: true,
        pathNot: [
          "(^|/)\\.[^/]+\\.(js|cjs|mjs|ts|cts|mts)$",
          "[.]d[.]ts$",
          "(^|/)tsconfig[.]json$",
          "(^|/)src/main[.]tsx$",
          "(^|/)src/test/setup[.]ts$",
          "[.]test[.](ts|tsx)$",
        ],
      },
      to: {},
    },
    {
      name: "no-feature-to-feature",
      severity: "error",
      comment: "Features must not import other features.",
      from: {
        path: "(^|/)src/features/([^/]+)/",
      },
      to: {
        path: "(^|/)src/features/([^/]+)/",
        pathNot: "(^|/)src/features/$1/",
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: "tsconfig.app.json",
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/(@[^/]+/[^/]+|[^/]+)",
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
