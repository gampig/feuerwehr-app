import { rtdbOptions } from "vuexfire";
import serialize from "../utils/firebase/serialize";

rtdbOptions.serialize = serialize;
