// Three modules for the Quiz application --> controller will be used to build relationship b/w the QuizController & UIController 


// *********** QUIZ CONTROLLER **********************
var quizController = (function() {
    localStorage.setItem('data', JSON.stringify([1, 2, 3, 4]));
    localStorage.setItem('data', JSON.stringify({name: 'John'}));
    localStorage.removeItem('data'); // null is printed, bcse no data is in localStorage
    console.log(JSON.parse(localStorage.getItem('data'))); // data is the key
})();



// *********** UI CONTROLLER **********************
var UIController = (function() {
    
})();

// *********** CONTROLLER **********************
var controller = (function(quizCtrl, UICtrl) {
    
})(quizController, UIController);