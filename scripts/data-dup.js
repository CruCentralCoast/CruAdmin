 /*5/25/2020
 These scripts aren't currently being called by code. 
 They are meant to ease data duplication for 
 collections where we may need it. These are ran on the spot.
 */
 // get 2 collections, update data in one collection
 function dataDup() {
    var cgs = db.collection('communitygroups').get().then(
      (querySnapshot) => {
        var promises = [];
        querySnapshot.forEach((doc) => {
          let cg = doc.data();
          promises.push([doc.id, cg]);
        });
        return promises;
      }
    );
    var users = db.collection('users').get().then(
      (querySnapshot) => {
        var promises = [];
        querySnapshot.forEach((doc) => {
          // console.log("id ", doc.id);
          let cg = doc.data();
          promises.push([doc.id, cg]);
        });
        return promises;
      }
    );

    Promise.all([cgs, users]).then((data) => {
      let cgs = data[0];
      let users = data[1];
      // console.log("cgs are: ", cgs);
      // console.log("users are: ", users);
      let userMap = {};
      // iterate through all users and map id to name
      users.forEach((user) => {
        let id = user[0];
        console.log("id ", id);
        let name = user[1].name.first + " " + user[1].name.last;
        userMap[id] = name;
        console.log("name ", name);
      });
      var cgRef = db.collection("communitygroups");
      cgs.forEach((cg) => {
        let leaders = cg[1].leaders;
        var leadersNames = [];
        leaders.forEach((leader) => {
          console.log("leader id ", leader.id);
          console.log("Name of leader ", userMap[leader.id]);
          leadersNames.push(userMap[leader.id]);
        });
        cgRef.doc(cg[0]).set({
          leadersNames
        }, {merge: true});
      }); 
    });
  }