let firebaseConfig = {
    apiKey: "AIzaSyDCWLEW7MlEFUnDfQRcGi4pUlJFtSEwF7k",
    authDomain: "project-extension-c16a3.firebaseapp.com",
    databaseURL: "https://project-extension-c16a3.firebaseio.com",
    projectId: "project-extension-c16a3",
    storageBucket: "project-extension-c16a3.appspot.com",
    messagingSenderId: "271674943192",
    appId: "1:271674943192:web:0c840b7f8c7e71b77dd9ad"
  };
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let activeView;

function switchView(newView) {
    activeView.hide();
    activeView = $("." + newView);
    activeView.show();
}

$(document).ready(function () {
    activeView = $(".js-login");
    $("a").click(function (e) {
        e.preventDefault();
        if($(this).attr("switch")) {
            switchView($(this).attr("switch"));
        }
    });

    $(".js-register-form").submit(function (e) {
        e.preventDefault();
        let email = $("#r-email").val();
        let password = $("#r-password").val();

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (response) {
                if(response.operationType == "signIn"){
                    switchView("js-painel");
                }    
            }).catch(function (error) {
                console.log("Ocorreou um erro: " + error);
            })
    });

    $(".js-login-form").submit(function (e) {
        e.preventDefault();
        let email = $("#l-email").val();
        let password = $("#l-password").val();

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function (response) {
                if(response.operationType == "signIn"){
                    switchView("js-painel");
                }    
            }).catch(function (error) {
                console.log("Ocorreou um erro: " + error);
                })
    });
});
