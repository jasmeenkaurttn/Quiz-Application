// Three modules for the Quiz application --> controller will be used to build relationship b/w the QuizController & UIController 


// *********** QUIZ CONTROLLER **********************
var quizController = (function () {
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
        setQuestionCollection: function (newCollection) {
            localStorage.setItem('questionCollection', JSON.stringify(newCollection));
        },
        getQuestionCollection: function () {
            return JSON.parse(localStorage.getItem('questionCollection'));
        },
        removeQuestionCollection: function () {
            localStorage.removeItem('questionCollection');
        }
    };

    if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
    }

    var quizProgress = {
        questionIndex: 0
    };

    //******************* Person Constructor **********************/
    function Person(id, firstname, lastname, score) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.score = score;
    }

    var adminFullName = ['Jasmeen', 'Kaur'];

    var currPersonData = {
        fullname: [],
        score: 0
    };

    var personLocalStorage = {
        setPersonData: function (newPersonData) {
            localStorage.setItem('personData', JSON.stringify(newPersonData));
        },
        getPersonData: function () {
            return JSON.parse(localStorage.getItem('personData'));
        },
        removePersonData: function () {
            localStorage.removeItem('personData');
        }
    };

    if (personLocalStorage.getPersonData() === null) {
        personLocalStorage.setPersonData([]);
    }

    return {

        getQuizProgress: quizProgress,

        getQuestionLocalStorage: questionLocalStorage,

        addQuestionOnLocalStorage: function (newQuestText, opts) {
            var optionsArr, corrAns, questionId, newQuestion, getStoredQuests, isChecked;

            if (questionLocalStorage.getQuestionCollection() === null) {
                questionLocalStorage.setQuestionCollection([]);
            }
            optionsArr = [];

            // isChecked = false;
            for (var i = 0; i < opts.length; i++) {
                if (opts[i].value != "") {
                    optionsArr.push(opts[i].value);
                }


                // **.checked method**  --> if radio btn is checked, it returns true otherwise false 
                // && if option value is empty string
                if (opts[i].previousElementSibling.checked && opts[i].value != "") {
                    corrAns = opts[i].value;
                    isChecked = true;
                }
            }

            // [{id: 0} {id: 1}]
            if (questionLocalStorage.getQuestionCollection().length > 0) {
                questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length - 1].id + 1;
            } else {
                questionId = 0;
            }

            if (newQuestText.value !== "") {
                if (optionsArr.length > 1) {
                    if (isChecked) {
                        newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);

                        getStoredQuests = questionLocalStorage.getQuestionCollection();

                        getStoredQuests.push(newQuestion);

                        questionLocalStorage.setQuestionCollection(getStoredQuests);

                        newQuestText.value = "";

                        for (var x = 0; x < opts.length; x++) {
                            opts[x].value = "";
                            opts[x].previousElementSibling.checked = false;
                        }
                        console.log(questionLocalStorage.getQuestionCollection());
                        return true;

                    } else {
                        alert('You missed to check correct answer, or you checked answer without value');
                        return false;
                    }
                } else {
                    alert('You must insert at least two options');
                    return false;
                }
            } else {
                alert('Please, Insert Question!')
                return false;
            }
        },

        checkAnswer: function (ans) {
            if (questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {
                currPersonData.score++; // score is increased by 1 as answer is correct
                return true;
            } else {
                return false;
            }
        },

        isFinished: function () {
            return quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length;
        },

        addPerson: function () {
            var newPerson, personId, personData;

            if (personLocalStorage.getPersonData().length > 0) {
                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
            } else {
                personId = 0;
            }
            newPerson = new Person(personId, currPersonData.fullname[0], currPersonData.fullname[1], currPersonData.score);

            personData = personLocalStorage.getPersonData();

            personData.push(newPerson);

            personLocalStorage.setPersonData(personData);

            console.log(newPerson);
        },

        getCurrPersonData: currPersonData,

        getAdminFullName: adminFullName,

        getPersonLocalStorage: personLocalStorage
    }
})();



// *********** UI CONTROLLER **********************
var UIController = (function () {
    var domItems = {
        //************** Admin Panel elements 
        adminPanelSection: document.querySelector('.admin-panel-container'),
        questionInsertBtn: document.getElementById('question-insert-btn'),
        newQuestText: document.getElementById('new-question-text'),
        adminOptions: document.querySelectorAll('.admin-option'),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestionWrapper: document.querySelector(".inserted-questions-wrapper"),
        questionUpdateBtn: document.getElementById("question-update-btn"),
        questionDeleteBtn: document.getElementById("question-delete-btn"),
        questionClearBtn: document.getElementById("questions-clear-btn"),
        resultsListWrapper: document.querySelector('.results-list-wrapper'),

        // ***************************Quiz Section Elements********
        quizSection: document.querySelector('.quiz-container'),
        askedQuestText: document.getElementById("asked-question-text"),
        quizOptionsWrapper: document.querySelector('.quiz-options-wrapper'),
        progressBar: document.querySelector("progress"),
        progressPar: document.getElementById("progress"),
        instAnsContainer: document.querySelector(".instant-answer-container"),
        instAnsText: document.getElementById('instant-answer-text'),
        instAnsDiv: document.getElementById('instant-answer-wrapper'),
        emotionIcon: document.getElementById('emotion'),
        nextQuesBtn: document.getElementById('next-question-btn'),


        // ***************** Landing Page elements **********************
        landPageSection: document.querySelector('.landing-page-container'),
        startQuizBtn: document.getElementById('start-quiz-btn'),
        firstNameInput: document.getElementById('firstname'),
        lastNameInput: document.getElementById('lastname'),

        // *****************FINAL RESULT **********************
        finalResultSection: document.querySelector('.final-result-container'),
        finalScoreText: document.getElementById('final-score-text')
    };

    return {
        getDomItems: domItems,
        addInputsDynamically: function () {
            var addInput = function () {
                var inputHTML, z;

                z = document.querySelectorAll('.admin-option').length;
                inputHTML = '<div class="admin-options-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';

                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);

                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
            }
            domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
        },
        createQuestionList: function (getQuestions) {
            var questHTML, numberingArr;

            numberingArr = [];

            domItems.insertedQuestionWrapper.innerHTML = "";

            for (var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
                numberingArr.push(i + 1);

                questHTML = ' <p><span>' + numberingArr[i] + '. ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button id="question-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';

                domItems.insertedQuestionWrapper.insertAdjacentHTML('afterbegin', questHTML);
            }
        },
        editQuestionList: function (event, storageQuestList, addInpsDynFn, updateQuestionListFn) {

            var getId, getStorageQuestList, foundItem, placeInArr, optionHTML;

            if ('question-'.indexOf(event.target.id)) {
                getId = parseInt(event.target.id.split('-')[1]);

                getStorageQuestList = storageQuestList.getQuestionCollection();

                for (var i = 0; i < getStorageQuestList.length; i++) {
                    if (getStorageQuestList[i].id === getId) {
                        foundItem = getStorageQuestList[i];

                        placeInArr = i;
                    }
                }
                // console.log(foundItem, placeInArr);
                domItems.newQuestText.value = foundItem.questionText;
                domItems.adminOptionsContainer.innerHTML = '';

                optionHTML = '';
                for (var x = 0; x < foundItem.options.length; x++) {
                    optionHTML += '<div class="admin-options-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] + '"></div>';
                }
                // console.log(optionHTML);
                domItems.adminOptionsContainer.innerHTML = optionHTML;

                domItems.questionUpdateBtn.style.visibility = 'visible';
                domItems.questionDeleteBtn.style.visibility = 'visible';
                domItems.questionInsertBtn.style.visibility = 'hidden';
                domItems.questionClearBtn.style.pointerEvents = 'none';

                addInpsDynFn();

                // After updation & deletion of a ques, we need to get to the default view
                var backDefaultView = function () {
                    var updatedOptions;
                    domItems.newQuestText.value = '';

                    updatedOptions = document.querySelectorAll(".admin-option");
                    for (var i = 0; i < updatedOptions.length; i++) {
                        updatedOptions[i].value = '';
                        updatedOptions[i].previousElementSibling.checked = false;
                    }
                    domItems.questionUpdateBtn.style.visibility = 'hidden';
                    domItems.questionDeleteBtn.style.visibility = 'hidden';
                    domItems.questionInsertBtn.style.visibility = 'visible';
                    domItems.questionClearBtn.style.pointerEvents = '';

                    updateQuestionListFn(storageQuestList);
                }

                var updateQuestion = function () {
                    var newOptions, optionEls;
                    newOptions = [];

                    optionEls = document.querySelectorAll(".admin-option");

                    foundItem.questionText = domItems.newQuestText.value;

                    foundItem.correctAnswer = '';

                    for (var i = 0; i < optionEls.length; i++) {
                        if (optionEls[i].value != '') {
                            newOptions.push(optionEls[i].value);

                            if (optionEls[i].previousElementSibling.checked) {
                                foundItem.correctAnswer = optionEls[i].value;
                            }
                        }
                    }
                    foundItem.options = newOptions;

                    if (foundItem.questionText !== '') {
                        if (foundItem.options.length > 1) {
                            if (foundItem.correctAnswer !== '') {
                                getStorageQuestList.splice(placeInArr, 1, foundItem);

                                storageQuestList.setQuestionCollection(getStorageQuestList);

                                backDefaultView();

                            } else {
                                alert('You missed to check correct answer, or you checked answer without value');
                            }
                        } else {
                            alert('You must insert at least two options');
                        }
                    } else {
                        alert('Please, Insert Question');
                    }
                }
                domItems.questionUpdateBtn.onclick = updateQuestion;

                var deleteQuestion = function () {
                    // console.log('works')
                    getStorageQuestList.splice(placeInArr, 1);

                    storageQuestList.setQuestionCollection(getStorageQuestList);

                    backDefaultView();
                }
                domItems.questionDeleteBtn.onclick = deleteQuestion;
            }
        },

        clearQuestionList: function (storageQuestList) {
            if (storageQuestList.getQuestionCollection() !== null) {
                if (storageQuestList.getQuestionCollection().length > 0) {

                    let conf = confirm('Warning! You will lose entire question list');
                    // console.log(conf);
                    //popup message to confirm before deleting the entire question list.
                    // returns boolean value -> OK means true & CANCEL means false

                    if (conf) {
                        storageQuestList.removeQuestionCollection();

                        domItems.insertedQuestionWrapper.innerHTML = '';
                    }

                }
            }
        },

        displayQuestion: function (storageQuestList, progress) {

            var newOptionHTML, characterArr;

            characterArr = ['A', 'B', 'C', 'D', 'E', 'F'];
            if (storageQuestList.getQuestionCollection().length > 0) {

                domItems.askedQuestText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;

                domItems.quizOptionsWrapper.innerHTML = '';

                for (var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {

                    newOptionHTML = '<div class="choice-' + i + '"><span class="choice-' + i + '">' + characterArr[i] + '</span><p class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';

                    domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                }
            }
        },

        displayProgress: function (storageQuestList, progress) {

            domItems.progressBar.max = storageQuestList.getQuestionCollection().length;

            domItems.progressBar.value = progress.questionIndex + 1;

            domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestList.getQuestionCollection().length;
        },

        newDesign: function (ansResult, selectedAnswer) {

            var twoOptions, index;

            index = 0;

            if (ansResult) {
                index = 1;
            }

            twoOptions = {
                instAnswerText: ['This is a wrong answer', 'This is a correct answer'],
                instAnswerClass: ['red', 'green'],
                emotionType: ['images/sad.png', 'images/happy.png'],
                optionSpanBg: ['rgba(200,0,0,0.7)', 'rgba(0,250,0,0.2)']
            };
            // options transparency is changed & disabled after selecting an option
            domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none;"

            domItems.instAnsContainer.style.opacity = "1";

            domItems.instAnsText.textContent = twoOptions.instAnswerText[index];

            domItems.instAnsDiv.className = twoOptions.instAnswerClass[index];

            domItems.emotionIcon.setAttribute('src', twoOptions.emotionType[index]);


            selectedAnswer.previousElementSibling.style.backgroundColor = twoOptions.optionSpanBg[index];
        },

        resetDesign: function () {
            domItems.quizOptionsWrapper.style.cssText = ""

            domItems.instAnsContainer.style.opacity = "0";
        },

        getFullName: function (currPerson, storageQuestList, admin) {

            if (domItems.firstNameInput.value !== "" && domItems.lastNameInput.value !== "") {
                // if you entered some name, then you should be redirected to quizSection
                if (!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {

                    if (storageQuestList.getQuestionCollection().length > 0) {
                        currPerson.fullname.push(domItems.firstNameInput.value);
                        currPerson.fullname.push(domItems.lastNameInput.value);
                        domItems.landPageSection.style.display = 'none';
                        domItems.quizSection.style.display = 'block';
                        console.log(currPerson)
                    } else {
                        // When admin hasn't added questions for QUIZ
                        alert('Quiz is not ready, please contact to administrator')
                    }
                } else {
                    domItems.landPageSection.style.display = 'none';
                    domItems.adminPanelSection.style.display = 'block';
                }
            } else { // when user is not registered for quiz, then show alert 
                alert('Please enter your firstname and lastname');
            }
        },

        finalResult: function (currPerson) {
            domItems.finalScoreText.textContent = currPerson.fullname[0] + ' ' + currPerson.fullname[1] + ', your final score is ' + currPerson.score;

            domItems.quizSection.style.display = 'none';

            domItems.finalResultSection.style.display = 'block';
        },

        addResultOnPanel: function(userData) {
            var resultHTML;

            domItems.resultsListWrapper.innerHTML = '';

            for(var i = 0; i < userData.getPersonData().length; i++) {
                resultHTML = '<p class="person person-' + i + '"><span class="person-' + i + '">' + userData.getPersonData()[i].firstname  + ' ' + userData.getPersonData()[i].lastname + '- ' +  userData.getPersonData()[i].score + 'Points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn">Delete</button></p>';

                domItems.resultsListWrapper.insertAdjacentHTML('afterbegin', resultHTML);
            }

        }
    };
})();

// *********** CONTROLLER **********************
var controller = (function (quizCtrl, UICtrl) {
    var selectedDomItems = UICtrl.getDomItems;

    UICtrl.addInputsDynamically();
    UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);

    selectedDomItems.questionInsertBtn.addEventListener('click', function () {

        var adminOptions = document.querySelectorAll('.admin-option');

        var checkBoolean = quizCtrl.addQuestionOnLocalStorage(selectedDomItems.newQuestText, adminOptions);

        if (checkBoolean) {
            UICtrl.createQuestionList(quizCtrl.getQuestionLocalStorage);
        }
    });

    selectedDomItems.insertedQuestionWrapper.addEventListener('click', function (e) {
        UICtrl.editQuestionList(e, quizCtrl.getQuestionLocalStorage, UICtrl.addInputsDynamically, UICtrl.createQuestionList);
    });

    selectedDomItems.questionClearBtn.addEventListener('click', function () {
        UICtrl.clearQuestionList(quizCtrl.getQuestionLocalStorage);
    });

    UICtrl.displayQuestion(quizController.getQuestionLocalStorage, quizCtrl.getQuizProgress);

    UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizController.getQuizProgress);

    selectedDomItems.quizOptionsWrapper.addEventListener('click', function (e) {
        var updatedOptionsDiv = selectedDomItems.quizOptionsWrapper.querySelectorAll('div');

        for (var i = 0; i < updatedOptionsDiv.length; i++) {

            if (e.target.className === 'choice-' + i) {
                // console.log(e.target.className);
                var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);

                var answerResult = quizCtrl.checkAnswer(answer);

                UICtrl.newDesign(answerResult, answer);

                if (quizCtrl.isFinished()) {
                    selectedDomItems.nextQuesBtn.textContent = 'Finish';
                }

                var nextQuestion = function (questData, progress) {
                    if (quizCtrl.isFinished()) {
                        // Finish quiz
                        quizCtrl.addPerson();

                        UICtrl.finalResult(quizCtrl.getCurrPersonData);
                    } else {
                        UICtrl.resetDesign();

                        quizCtrl.getQuizProgress.questionIndex++;

                        UICtrl.displayQuestion(quizController.getQuestionLocalStorage, quizCtrl.getQuizProgress);

                        UICtrl.displayProgress(quizCtrl.getQuestionLocalStorage, quizController.getQuizProgress);
                    }
                }

                selectedDomItems.nextQuesBtn.onclick = function () {
                    nextQuestion(quizCtrl.getQuestionLocalStorage, quizCtrl.getQuizProgress);
                }
            }
        }
    });

    selectedDomItems.startQuizBtn.addEventListener('click', function () {
        UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
    });

    selectedDomItems.lastNameInput.addEventListener('focus', function () {
        selectedDomItems.lastNameInput.addEventListener('keypress', function (e) {
            if (e.keyCode === 13) {
                UICtrl.getFullName(quizCtrl.getCurrPersonData, quizCtrl.getQuestionLocalStorage, quizCtrl.getAdminFullName);
            }
        })
    });

    UICtrl.addResultOnPanel(quizCtrl.getPersonLocalStorage);

})(quizController, UIController);
