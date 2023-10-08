import { MutationTree } from "vuex";
import { Notification } from "../../models/Notification";

class State implements Notification {
  id = 0;
  show = false;
  color = "error";
  text = "An error occurred";
  subText = "";
  timeout = 6000;
}

export default {
  namespaced: true,

  state: new State(),

  mutations: <MutationTree<State>>{
    setShow(state, show: boolean) {
      state.show = show;
    },
    pushNotification(state, notification: Notification) {
      state.id = Math.random();
      state.show = true;
      state.color = notification.color || "";
      state.text = notification.text;
      state.subText = notification.subText || "";
      state.timeout = notification.timeout || 6000;
    },
  },
};
