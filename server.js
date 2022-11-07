// --------------------------------------------------------------
// ------------------    Firebase Config    ---------------------

const firebaseApp = require('firebase/app');
const firestore = require('firebase/firestore');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDTJ3WzvUhjceJggS-BhRNMH10JkSholI",
  authDomain: "color-time-a282c.firebaseapp.com",
  projectId: "color-time-a282c",
  storageBucket: "color-time-a282c.appspot.com",
  messagingSenderId: "716890210004",
  appId: "1:716890210004:web:84cd4a3df64f67c6b10541",
  measurementId: "G-8WE0G3R6B1"
};

// Initialize Firebase
const fb =  firebaseApp.initializeApp(firebaseConfig);
const db = firestore.getFirestore(fb);

// --------------------------------------------------------------


const express = require('express')
const app = express()
const port = 3000


app.use(express.static('public'))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/data', async function(req, res) {
  await saveColor({ color: "Test Color Code", date: "now"});
  res.send('get data');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


async function saveColor(colorCode) {
  try {
    console.log(colorCode);
    const docRef = await firestore.addDoc(firestore.collection(db, "colorSubmissions"), colorCode);
  } catch (e){
    console.log(e)
  }
}
