import { Acl } from "@/acl";
import AbstractModule from "../AbstractModule";
import { useCalloutStore } from "./stores/callout";
import { useCalloutsStore } from "./stores/callouts";

export default class CalloutModule extends AbstractModule {
  install() {}

  isAuthorized() {
    return this.hasAnyRole([...Acl.mannschaftsbuch, ...Acl.bereitschaftsliste]);
  }

  load() {
    return useCalloutsStore().bind();
  }

  unload() {
    const calloutStore = useCalloutStore();
    calloutStore.selectCallout();
    calloutStore.selectVehicle();
    useCalloutsStore().unbind();
  }
}
