import { App } from "vue";

const requireComponent = require.context(
  ".",
  true,
  /Base[A-Z]\w+\.(vue|js|ts)$/
);

export function registerGlobalComponents(app: App) {
  requireComponent.keys().forEach((fileName) => {
    const baseComponentConfig = requireComponent(fileName);

    const baseComponentName =
      baseComponentConfig.name ||
      fileName
        .replace(/^.+\//, "")
        // Remove the file extension
        .replace(/\.\w+$/, "");

    app.component(
      baseComponentName,
      baseComponentConfig.default || baseComponentConfig
    );
  });
}
