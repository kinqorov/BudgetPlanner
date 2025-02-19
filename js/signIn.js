import { auth } from "./firebaseConfig.js";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();

document.getElementById("signin-button").addEventListener("click", function () {
  signInWithPopup(auth, provider)
    .then((result) => {
      const authData = GoogleAuthProvider.credentialFromResult(result);
      localStorage.setItem("authData", JSON.stringify(authData));
      window.location = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error(
        `Error during authorization.
          Error code: ${errorCode}
          Error message: ${errorMessage}
          Credential: ${credential}
          `,
      );
    });
});
