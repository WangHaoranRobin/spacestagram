import * as functions from "firebase-functions";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const {login, like, unlike, isLiked, getLiked} = require("./handlers/userdb");

const app = require("express")();

const cors = require("cors")({origin: true});
app.use(cors);

app.post("/login", login);
app.post("/like", like);
app.post("/unlike", unlike);
app.get("/isLiked", isLiked);
app.get("/getLiked", getLiked);

exports.api = functions.https.onRequest(app);
