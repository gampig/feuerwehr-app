import Vue from "vue";

const requireComponent = require.context(
  ".",
  true,
  /Base[A-Z]\w+\.(vue|js|ts)$/
);

requireComponent.keys().forEach((fileName) => {
  const baseComponentConfig = requireComponent(fileName);

  const baseComponentName =
    baseComponentConfig.name ||
    fileName
      .replace(/^.+\//, "")
      // Remove the file extension
      .replace(/\.\w+$/, "");

  Vue.component(
    baseComponentName,
    baseComponentConfig.default || baseComponentConfig
  );
});
