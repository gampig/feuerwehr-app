import { App } from "vue";

const components = import.meta.glob(["./Base*.*", "./*/Base*.*"], {
  eager: true,
});

export function registerGlobalComponents(app: App) {
  Object.entries(components).forEach(([path, component]) => {
    const baseComponentName = path
      .replace(/^.+\//, "")
      // Remove the file extension
      .replace(/\.\w+$/, "");

    app.component(baseComponentName, (component as any).default);
  });
}
