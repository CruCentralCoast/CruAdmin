import { db } from '../src/firebase/firebaseSetup.js';

// helper functions needed to get Users
export function getUserNameById(id) {
    db.collection("users").doc(id).get().then((doc) => {
      if (doc.exists) {
          var data = doc.data();
          var name = data.name.first + " " + data.name.last;
          console.log("user: ", name);
          return name;
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

export function getUsers(list) {
    var promises = []
    list.forEach((user) => {
        promises.push(this.getUserNameById(user.id));
    })
    return Promise.all(promises);
}

