module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder 
        files: ["**/*"],
        extraFiles: [
          {
            from: "VirtualHub",
            to: "VirtualHub",
            filter: ["**/*"]
          }
        ]
      }
    }
  }
};
