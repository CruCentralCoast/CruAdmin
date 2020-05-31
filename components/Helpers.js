import { db } from '../src/firebase/firebaseSetup.js';

/*
    File to contain reusable functions
*/

// generates options used for dropdown
export function generateOptions(options) {
    let l = [];
    for (let i = 0; i < options.length; i++) {
      l.push(<option value={options[i]}>{options[i]}</option>);
    }
    return l;
}

// get all of this collection from Firestore
export function getAllFromFirestore(collectionName) {
  var col = db.collection(collectionName).get().then(
    (querySnapshot) => {
      var promises = [];
      querySnapshot.forEach((doc) => {
        let data = doc.data();
        data.id = doc.id;
        promises.push(data);
      });
      return promises;
    }
  );
  return col;
}

// build string for array strings with comma delimited
export function stringifyLeaderNames(group) {
  var str = "";
  str += group[0];
  for (var i = 1; i < group.length; i++) {
    str += ", " + group[i];
  }
  return str;
}
