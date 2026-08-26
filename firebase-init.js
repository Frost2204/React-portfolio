const firebaseConfig = {
        apiKey: "AIzaSyC9VVJiuR_eZ8e5857n5r0KZ4iLUYkKU18",
        authDomain: "dailyspend-9b0cf.firebaseapp.com",
        projectId: "dailyspend-9b0cf",
        storageBucket: "dailyspend-9b0cf.firebasestorage.app",
        messagingSenderId: "859977788243",
        appId: "1:859977788243:web:e510067ede2db8f2d58fa6",
        measurementId: "G-KB0F839L85",
      };
      firebase.initializeApp(firebaseConfig);
      const fbAuth = firebase.auth();
      const fbDb = firebase.firestore();
