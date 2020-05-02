import { db } from '../src/firebase/firebaseSetup.js';

export function getUserNameById (id) {
    var docRef = db.collection("users").doc(id);
    console.log("Doc ref: ", docRef);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            return doc.data();
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    return "Invalid User";
};