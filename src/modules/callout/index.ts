import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import route from "./router";
import store from "./store";

export default class CalloutModule extends AbstractModule {
  navLinks = [
    {
      title: "Mannschaft",
      to: { name: "CrewCallouts" },
      icon: "mdi-alarm-light",
      auth: () => this.hasAnyRole(Acl.mannschaftsbuch),
    },
    {
      title: "Bereitschaft",
      to: { name: "SelectStandby" },
      icon: "mdi-alarm-light",
      auth: () => this.hasAnyRole(Acl.bereitschaftsliste),
    },
    {
      title: "Einsätze",
      to: { name: "CalloutList" },
      icon: "mdi-alarm-light",
      auth: () => this.hasAnyRole(Acl.mannschaftsbuch),
    },
  ];

  install() {
    this.router.addRoute(route);
    this.installStore(store);

    this.store.commit("navigation/addLinks", this.navLinks);
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
