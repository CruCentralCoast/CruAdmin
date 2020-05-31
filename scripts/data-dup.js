 /*5/25/2020
 These scripts aren't currently being called by code. 
 They are meant to ease data duplication for 
 collections where we may need it. These are ran on the spot.
 */
import { getAllFromFirestore } from '../components/Helpers';
import { db } from '../src/firebase/firebaseSetup.js';

 // get 2 collections, update data in one collection
 export function dataDup() {
  var mts = getAllFromFirestore('ministryteams');
  var users = getAllFromFirestore('users');
  var mvts = getAllFromFirestore('ministryteams');

  // get all mts, users
  Promise.all([mts, users]).then((data) => {
      let mts = data[0];
      let users = data[1];
      console.log("mts are: ", mts);
      console.log("users are: ", users);
      let userMap = {};
      // iterate through all users and map id to name
      users.forEach((user) => {
          console.log(user);
          let id = user.id;
          console.log("id ", id);
          let name = user.name.first + " " + user.name.last;
          userMap[id] = name;
          console.log("name ", name);
      });
      var mtsRef = db.collection("ministryteams");
      mts.forEach((cg) => {
          console.log("cg is ", cg);
          let leaders = cg.leaders;
          var leadersNames = [];
          leaders.forEach((leader) => {
              console.log("leader id ", leader.id);
              console.log("Name of leader ", userMap[leader.id]);
              leadersNames.push(userMap[leader.id]);
          });
          // add leadersNames
          mtsRef.doc(cg.id).set({
          leadersNames
          }, {merge: true});
      }); 
  });
  }