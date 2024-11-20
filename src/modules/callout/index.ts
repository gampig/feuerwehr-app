import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import store from "./store";

export default class CalloutModule extends AbstractModule {
  install() {
    this.installStore(store);
  }

  isAuthorized() {
    return this.hasAnyRole([...Acl.mannschaftsbuch, ...Acl.bereitschaftsliste]);
  }

  load() {
    const loadAllCallouts = this.store.state.callouts.allCalloutsLoaded;
    return this.store.dispatch("callouts/bind", { loadAllCallouts });
  }

  unload() {
    return Promise.all([
      this.store.dispatch("callouts/unbind"),
      this.store.dispatch("callout/unbind"),
    ]);
  }
}
