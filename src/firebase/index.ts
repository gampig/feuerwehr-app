// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import config from "./config";

import "firebase/auth";
import "firebase/database";

firebase.initializeApp(config);

import "./vuexfire";
