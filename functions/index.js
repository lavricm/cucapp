const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require("algoliasearch");


admin.initializeApp();
const env = functions.config();
const client = algoliasearch(functions.config().algolia.appid, functions.config().algolia.apikey);
const index = client.initIndex('intrebari_search');

exports.indexPachet = functions.firestore.document('pachete/{pachet_id}').onCreate((snap, context) => {
    const data = snap.data();
    const objectId = snap.id;
    let newarr = [];
    console.log(data.arr);
    data.arr.forEach((element, idx) => {
        newarr.push({
            objectId: `${snap.id}_${idx + 1}`,
            nr_intrebare: index + 1,
            ...element
        })
    });
    return index.saveObjects({ ...newarr }, { autoGenerateObjectIDIfNotExist: true }).then(({ objectIDs }) => console.log(objectIDs));
})

// exports.unindexPachet = functions.firestore.document('pachete/{pachet_id}').onDelete((snap, context) => {
//     const data = snap.data();
//     const objectId = snap.id;
//     const f = async (data) => {
//         data.arr.forEach((element, idx) => {
//             index.deleteObject(`${snap.id}_${idx + 1}`);
//         });
//     }
//     return f(data);
// })
