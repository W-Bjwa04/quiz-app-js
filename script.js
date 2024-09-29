document.addEventListener('DOMContentLoaded', async () => {
    const startBtn = document.querySelector('#start-button')
    const quizContainer = document.querySelector('.question-container')
    const resultContainer = document.querySelector('.result-container')
    const questionText = document.querySelector('.question')
    const questionOptions = document.querySelector('.options-list')
    const nextQuestionBtn = document.querySelector('#next-button') 
    const restartButton = document.querySelector('.restart-btn')
    const showResult = document.querySelector('.result-score')
    const loader = document.querySelector('.loader') 

    // API for questions
    const API = `https://opentdb.com/api.php?amount=10&type=multiple`;

    // Question array
    let quizQuestions = [];

    // correct answers array based on questions order 

    let correctAnswers = []



    //current question 

    let currentQuestion = 0


    // answers seleted by the user 

    let userAnswers = []

    // Fetch the questions from the API
    async function fetchQuestions() {
        try {
            const response = await fetch(API, {
                method: 'GET'
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();

            data.results.forEach(que => {
                const q = {
                    question: que.question,
                    correctAnswer: que.correct_answer,
                    options: [...que.incorrect_answers, que.correct_answer]
                };

                // Shuffle the options so the correct answer isn't always last
                q.options = q.options.sort(() => Math.random() - 0.5);

                quizQuestions.push(q);
            });

        } catch (err) {
            console.error("Error fetching questions:", err);
        }
    }

   

    // start the quiz on clicking the start quiz 
    // start the quiz on clicking the start quiz 
startBtn.addEventListener('click', async (event) => {
    // Call the fetchQuestions function to load the questions
    await fetchQuestions();
    // Check if questions were fetched successfully
    if (quizQuestions.length > 0) {
        // remove the loader hidden 
        loader.classList.remove('hidden');
        //runs after two second 

        setTimeout(() => {
            
                // Hide the loader and show the quiz
                loader.classList.add('hidden');
                  // Hide the loader after 2 seconds
                quizContainer.classList.remove('hidden');  // Show the quiz container

                // Add the hidden class to the result container to hide it
                resultContainer.classList.add('hidden');

                // Show the first question
                showQuestion();

                // Enable the next question button
                nextQuestionBtn.classList.remove('hidden');

                // Disable the restart button
                restartButton.classList.add('hidden')

                // Disable the start button after it's clicked
                disbaleStartBtn()
            }, 2000);



        
           
   


       
    } else {
        console.error("Questions were not fetched properly.");
    }
});



    

    //function responsible to show the question
    
    function showQuestion(){
        console.log(quizQuestions);
        
        const questionTitle = quizQuestions[currentQuestion].question
        const correctAnswer = quizQuestions[currentQuestion].correctAnswer
        const options = quizQuestions[currentQuestion].options

        questionText.textContent = questionTitle
        correctAnswers.push(correctAnswer)

        questionOptions.innerHTML=""

        questionOptions.innerHTML = options.map((op)=>{
            return `
                <li class="option">${op}</li>
            `
        }).join('')
    }

    // next question btn 

    nextQuestionBtn.addEventListener('click',nextQuestion)


    // function handling the next question 

    function nextQuestion() {
        let totalQuestion = quizQuestions.length;

        const optionSelected = questionOptions.querySelector('.active');

        if (!optionSelected) {
            return; // Ensure user selects an option
        }

        // Push selected answer
        userAnswers.push(optionSelected.textContent);

        // Increment currentQuestion
        currentQuestion++;

        // Check if there are more questions
        if (currentQuestion < totalQuestion) {
            showQuestion(); // Show next question
        } else {
            disableNextQuestion(); // Disable button if no more questions
            // call the show result 
            showUserScore()
            enableRestartButton(); // Enable restart option
        }
    }


    //disble the start Quiz Button 

    function disbaleStartBtn(){
        startBtn.classList.add('hidden')
    }

    //enalbe start quiz btn 

    function enalbeStartBtn(){
        startBtn.classList.remove('hidden')
    }

    //disble next question btn 

    function disableNextQuestion(){
        nextQuestionBtn.classList.add('hidden')
    }

    //enable next question btn 

    function enableNextQuestion(){
        nextQuestionBtn.classList.remove('hidden')
    }

    //enable restart btn 

    function enableRestartButton(){
        restartButton.classList.remove('hidden')
    }

    function disableRestartButton(){
        restartButton.classList.add('hidden')
    }
    

    // functionality of the restart button 

    restartButton.addEventListener('click', (event) => {
        // Reset the variables
        currentQuestion = 0; // Reset to the first question
        userAnswers = []; // Reset user answers
        correctAnswers = []; // Reset correct answers
    
        // Show the first question
        showQuestion();
        disableRestartButton();
        enalbeStartBtn(); // Ensure the start button is enabled again
        resultContainer.classList.add('hidden'); // Hide the result container
        quizContainer.classList.add('hidden'); // Show the quiz container
    });


    // check which option is seleted 

    questionOptions.addEventListener('click',(event)=>{
        // check which option is selected 
        if (event.target.classList.contains('option')) {
            // Remove 'active' class from all previously selected options
            const allActive = document.querySelectorAll('.option.active');
            allActive.forEach((act) => {
                act.classList.remove('active');
            });
    
            // Add 'active' class to the current option
            event.target.classList.add('active');
        }
        
    })


    //function foe calculating the score 

    function showUserScore() {
        showResult.textContent = '';
        let score = 0;
    
        for (let index = 0; index < userAnswers.length; index++) {
            if (userAnswers[index] === correctAnswers[index]) {
                score += 1;
            }
        }
        
        // Display results
        resultContainer.classList.remove('hidden');
        showResult.textContent = `${score}/${userAnswers.length}`;
    
        // Hide the quiz container after showing the results
        quizContainer.classList.add('hidden'); // Hide the quiz container
        disableNextQuestion(); // Disable next question button
    }
});
