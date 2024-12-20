// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/compat/app";
import config from "./config";

import "firebase/compat/auth";
import "firebase/compat/database";

firebase.initializeApp(config);

import "./vuexfire";
