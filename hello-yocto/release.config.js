module.exports = {
    "plugins": [
      "@semantic-release/commit-analyzer",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
    //   ["@semantic-release/npm", { 
    //     "tarballDir": "release"
    //   }],
    "@semantic-release/npm",
    //   ["@semantic-release/npm", { "pkgRoot": "hello-yocto" }],
    //   ["@semantic-release/github", {
    //     "assets": "release/*.tgz"
    //   }],
      "@semantic-release/github",
      "@semantic-release/git"
    ],
    "preset": "angular"
  }