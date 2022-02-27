// Three modules for the Quiz application --> controller will be used to build relationship b/w the QuizController & UIController 


// *********** QUIZ CONTROLLER **********************
var quizController = (function() {
    // localStorage.setItem('data', JSON.stringify([1, 2, 3, 4]));
    // localStorage.setItem('data', JSON.stringify({name: 'John'}));
    // localStorage.removeItem('data'); // null is printed, bcse no data is in localStorage
    // console.log(JSON.parse(localStorage.getItem('data'))); // data is the key


    // ************************* Question Controller*************
    function Question(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    // for setting and getting questions from local storage
    var questionLocalStorage = {
        setQuestionCollection: function(newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function() {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCOllection: function() {
            localStorage.removeItem('questionCollection');
        }
    };

    if(questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    return {

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function(newQuestText, opts) {
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

            if(questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }
            optionsArr = [];

            isChecked = false;
            for(var i = 0; i < opts.length; i++) {
                if(opts[i].value != "") {
                    optionsArr.push(opts[i].value);
                }


                // **.checked method**  --> if radio btn is checked, it returns true otherwise false 
                // && if option value is empty string
                if(opts[i].previousElementSibling.checked && opts[i].value != "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }

            // [{id: 0} {id: 1}]
            if(questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else{
                questionId = 0;
            }

            if(newQuestText.value !== ""){
                if(optionsArr.length > 1){
                    if(isChecked){
                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);

                        getStoredQuests = questionLocalStorage.getQuestionCollection();

                        getStoredQuests.push(newQuestion);

                        questionLocalStorage.setQuestionCollection(getStoredQuests);
                        
                        newQuestText.value = "";

                        for(var x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }
                        console.log(questionLocalStorage.getQuestionCollection());
                    } else {
                        alert('You missed to check correct answer, or you checked answer without value');
                        return false;
                    }    
                }else {
                    alert('You must insert at least two options');
                    return false;
                }    
            } else{
                alert('Please, Insert Question!')
                return false;
            }
        }
    }
})();



// *********** UI CONTROLLER **********************
var UIController = (function() {
    var domItems = {
        //************** Admin Panel elements 
        questionInsertBtn: document.getElementById('question-insert-btn'),
        newQuestText: document.getElementById('new-question-text'),
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestionWrapper: document.querySelector(".inserted-questions-wrapper")
    };

    return  {
        getDomItems: domItems,
        addInputsDynamically: function() {
            var addInput = function() {
                var inputHTML, z;

                z = document.querySelectorAll('.admin-option').length;
                inputHTML = '<div class="admin-options-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';

                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                
                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            }
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
        createQuestionList: function(getQuestions) {
            var questHTML, numberingArr;

            numberingArr = [];

            domItems.insertedQuestionWrapper.innerHTML = "";

            for(var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                numberingArr.push(i + 1);
               
                questHTML = ' <p><span>'+ numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-'+ getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';

                domItems.insertedQuestionWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        }
    };
})();

// *********** CONTROLLER **********************
var controller = (function(quizCtrl, UICtrl) {
    var selectedDomItems = UIController.getDomItems;

    UICtrl.addInputsDynamically();
    UICtrl.createQuestionList(quizController.getQuestionLocalStorage);

    selectedDomItems.questionInsertBtn.addEventListener('click', function() {

        var adminOptions = document.querySelectorAll('.admin-option');

        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestText, adminOptions);

        if(checkBoolean) {
            UICtrl.createQuestinList(quizController.getQuestionLocalStorage);
        }
    });
})(quizController, UIController);