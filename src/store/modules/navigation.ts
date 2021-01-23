import { MutationTree } from "vuex";
import { NavLink } from "../../models/NavLink";

class State {
  links: NavLink[] = [];
}

const module = {
  namespaced: true,

  state: new State(),

  mutations: <MutationTree<State>>{
    addLinks(state, links: NavLink[]) {
      state.links = state.links.concat(links);
    },
  },
};

export default module;
