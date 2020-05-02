import { db } from '../src/firebase/firebaseSetup.js';

export function getUsers (list) {
    let users = [];
    for (let i = 0; i < list.length; i++) {
      console.log("id: ", list[i].id);
      db.collection("users").doc(list[i].id).get().then(function(doc) {
        if (doc.exists) {
            // console.log("got data ", doc.data());
            var data = doc.data();
            var name = data.name.first + " " + data.name.last;
            users.push(name);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
    }
    return users;
};

