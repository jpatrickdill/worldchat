import * as dotenv from "dotenv";
dotenv.config();

import admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp();

import app from "./api";

export const api = functions.https.onRequest(app);
