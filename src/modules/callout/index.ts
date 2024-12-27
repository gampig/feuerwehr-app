import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import store from "./store";
import { useCalloutStore } from "./stores/callout";

export default class CalloutModule extends AbstractModule {
  install() {
    this.installStore(store);
  }

  isAuthorized() {
    return this.hasAnyRole([...Acl.mannschaftsbuch, ...Acl.bereitschaftsliste]);
  }

  load() {
    return this.store.dispatch("callouts/bind");
  }

  unload() {
    const calloutStore = useCalloutStore();
    return Promise.all([
      this.store.dispatch("callouts/unbind"),
      calloutStore.selectCallout(),
      calloutStore.selectVehicle(),
    ]);
  }
}
