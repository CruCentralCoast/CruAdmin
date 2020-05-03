import { db } from '../src/firebase/firebaseSetup.js';

export function getUsers (list) {
    var promise = new Promise(function(resolve, reject){
        var users = [];
        list.forEach((user) => {
            db.collection("users").doc(user.id).get().then((doc) => {
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
        });
        resolve(users);
    });
    return promise;
};

