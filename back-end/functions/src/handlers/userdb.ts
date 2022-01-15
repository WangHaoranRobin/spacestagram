const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

const axios = require("axios");

exports.login = async (req: any, res: any) => {
  try {
    const {usrName} = req.body;
    // Check for user name
    await db
        .collection("users")
        .doc(usrName)
        .get()
        .then((snapshot: any) => {
        // if user doesn't exist, create user
          if (!snapshot.exists) {
            db.collection("users").doc(usrName).set({
              usrName: usrName,
              likedAPODs: [],
            });
          }
        });
    res.json(true);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({error: `something went wrong: ${err}`});
  }
};

exports.like = async (req: any, res: any) => {
  try {
    const {usrName, APODDate} = req.body;
    // Update the likedAPODs array in the user document; Add the new APOD's date
    await db
        .collection("users")
        .doc(usrName)
        .update({
          likedAPODs: admin.firestore.FieldValue.arrayUnion(APODDate),
        });
    res.json(true);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({error: `something went wrong: ${err}`});
  }
};

exports.unlike = async (req: any, res: any) => {
  try {
    const {usrName, APODDate} = req.body;
    // Update the likedAPODs array in the user document; Remove the new APOD's date
    await db
        .collection("users")
        .doc(usrName)
        .update({
          likedAPODs: admin.firestore.FieldValue.arrayRemove(APODDate),
        });
    res.json(true);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({error: `something went wrong: ${err}`});
  }
};

exports.isLiked = async (req: any, res: any) => {
  try {
    const {usrName, APODDate} = req.query;
    // Check the likedAPODs array in the user document; see if the APOD's date is in the array
    const snapshot = await db.collection("users").doc(usrName).get();
    if (snapshot.exists) {
      const likedAPODs = snapshot.data().likedAPODs;
      if (likedAPODs.includes(APODDate)) {
        res.json(true);
      } else {
        res.json(false);
      }
    } else res.json(false);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({error: `something went wrong: ${err}`});
  }
};

exports.getLiked = async (req: any, res: any) => {
  try {
    const {usrName} = req.query;
    console.log(usrName);
    // Check the likedAPODs array in the user document; see if the APOD's date is in the array
    const snapshot = await db.collection("users").doc(usrName).get();
    if (snapshot.exists) {
      const likedAPODs = snapshot.data().likedAPODs;
      // For each liked APOD, get the APOD's data
      const APODs = await Promise.all(
          likedAPODs.map(async (APODDate: string) => {
            const APOD = await axios.get(
                `https://api.nasa.gov/planetary/apod?api_key=JeERhunvZLQ1Xmhv8ZT166RKxzzEbSjCuc4LaikG&date=${APODDate}`,
            );
            return APOD.data;
          }),
      );
      console.log(APODs);
      res.json(APODs);
    } else res.json(false);
  } catch (err) {
    console.log("Something went wrong");
    res.status(500).json({error: `something went wrong: ${err}`});
  }
};
