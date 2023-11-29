import { shuffleArray, getOption } from "./options.js";

const submitButton = document.getElementById("submit");
const retryButton = document.getElementById("retry");
const showAnswerButton = document.getElementById("showAnswer");
const returnButton = document.getElementById("return");
const previousButton = document.getElementById("previous");
const quizContainer = document.getElementById("quiz");
const resultContainer = document.getElementById("result");
const unsolvedQuestionsContainer =
  document.getElementById("unsolved-questions");

const selectedQuestionsJSON = localStorage.getItem("selectedQuestions");
const quizData = JSON.parse(selectedQuestionsJSON);

const unansweredQuestions = [];
let currentQuestion = 0;
let score = 0;
let incorrectAnswers = [];
let arrOfAnswer = new Array(quizData.length);

/**
 * Navigates to the previous question in the quiz.
 * If the current question is not the first question, it decrements the current question index and displays the previous question.
 */
function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    displayQuestion();
  }
}

/**
 * Displays a quiz question and its options to the user.
 * It dynamically creates and populates HTML elements to show the question and its options.
 */
function displayQuestion() {
  previousButton.style.display = currentQuestion > 0 ? "inline-block" : "none";
  const questionData = quizData[currentQuestion];
  const questionElement = document.createElement("div");
  questionElement.className = "question";
  questionElement.innerHTML = questionData.question;

  const optionsElement = document.createElement("div");
  optionsElement.className = "options";

  const shuffledOptions = [...questionData.options];
  shuffleArray(shuffledOptions);

  shuffledOptions
    .map((op) => getOption(op, arrOfAnswer[currentQuestion]))
    .forEach((op) => {
      optionsElement.innerHTML = `${optionsElement.innerHTML}${op}`;
    });

  quizContainer.innerHTML = "";
  quizContainer.appendChild(questionElement);
  quizContainer.appendChild(optionsElement);
}
/**
 * Displays the final result of the quiz to the user.
 * It hides the quiz content and shows the user's score along with buttons for retrying and showing answers.
 */
function displayResult() {
  quizContainer.style.display = "none";
  submitButton.style.display = "none";
  previousButton.style.display="none";
  retryButton.style.display = "inline-block";
  showAnswerButton.style.display = "inline-block";
  resultContainer.innerHTML = `You scored ${score} out of ${quizData.length}!`;
}
/**
 * Calculates the final quiz result, including the score, unanswered questions, and incorrect answers.
 * It displays the appropriate result, either showing unanswered questions or the final score.
 */
function checkTheFinalResult() {
  quizData.forEach((question, index) => {
    const userAnswer = arrOfAnswer[index];
    const correctAnswer = question["answer"];

    if (userAnswer === null) {
      unansweredQuestions.push(index);
    } else if (userAnswer === correctAnswer) {
      score++;
    } else {
      const incorrectQuestion = {
        question: question.question,
        incorrectAnswer: userAnswer,
        correctAnswer: correctAnswer,
      };
      incorrectAnswers.push(incorrectQuestion);
    }
  });

  if (unansweredQuestions.length > 0) {
    showUnansweredQuestions(unansweredQuestions);
    return;
  } 
  displayResult()
}

/**
 * Displays a message to the user about unanswered questions and provides an option to return to them.
 *
 * @param {Array} unansweredQuestions - An array containing indices of unanswered questions.
 */
function showUnansweredQuestions(unansweredQuestions) {
  quizContainer.style.display = "none";
  submitButton.style.display = "none";
  retryButton.style.display = "none";
  returnButton.style.display = "inline-block";
  previousButton.style.display = "none";
  showAnswerButton.style.display = "none";
  unsolvedQuestionsContainer.innerHTML = `You have ${unansweredQuestions.length} unanswered question(s). Click "Return" to answer them.`;

  returnButton.addEventListener("click", () => {
    returnToUnansweredQuestions(unansweredQuestions);
  });
}

/**
 * Allows the user to return to unanswered questions and continue the quiz.
 *
 * @param {Array} unansweredQuestions - An array containing indices of unanswered questions.
 */
function returnToUnansweredQuestions(unansweredQuestions) {
  currentQuestion = unansweredQuestions[0];
  unansweredQuestions.shift();

  unsolvedQuestionsContainer.innerHTML = "";
  quizContainer.style.display = "block";
  submitButton.style.display = "inline-block";
  returnButton.style.display = "none";

  displayQuestion();
}

/**
 * Checks and records the user's answer for the current question in the quiz.
 * It updates the user's answer in the `arrOfAnswer` array and manages navigation between questions.
 */
function checkAnswer() {
  const selectedOption = document.querySelector('.option.selected');
  let answer = selectedOption ? selectedOption.textContent.trim() : null;
  arrOfAnswer[currentQuestion] = answer;

  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    displayQuestion();
  } else {
    const unansweredQuestions = arrOfAnswer.reduce(
      (unanswered, answer, index) =>
        answer === null ? [...unanswered, index] : unanswered,
      []
    );
    
    unansweredQuestions.length > 0 ? showUnansweredQuestions(unansweredQuestions) : checkTheFinalResult();
  }
}
 

/**
 * Resets the quiz to allow the user to retry from the beginning.
 * It clears the user's progress, score, and incorrect answers.
 */
function retryTheQuiz() {
  currentQuestion = 0;
  score = 0;
  incorrectAnswers = [];
  arrOfAnswer = [];
  unsolvedQuestionsContainer.display = "none"; //
  quizContainer.style.display = "block";
  submitButton.style.display = "inline-block";
  retryButton.style.display = "none";
  showAnswerButton.style.display = "none";
  resultContainer.innerHTML = "";
  displayQuestion();
}

/**
 * Displays the final quiz result, including the user's score and incorrect answers.
 * It provides an option to retry the quiz.
 */
function showAnswer() {
  quizContainer.style.display = "none";
  submitButton.style.display = "none";
  showAnswerButton.style.display = "none";
  previousButton.style.display = "none";
  retryButton.style.display = "inline-block";
  previousButton.style.display = "none";

  let answersHtml = "";

  quizData.forEach((question, i) => {
    const userAnswer = arrOfAnswer[i];
    const correctAnswer = question["answer"];

    answersHtml += `
      <div style="border-bottom: 1px solid black; margin-bottom: 2px;">
        <p style="font-size: 18px;">${i + 1}.${question.question}</p>
        <ul style="list-style-type: none; padding: 0;">
          ${question.options.map(option => `
            <li style="color: ${option === correctAnswer ? 'green' : (option === userAnswer ? 'red' : 'black')}">${option}</li>
          `).join('')}
        </ul>
      </div>
    `;
  });

  resultContainer.innerHTML = answersHtml;
}


submitButton.addEventListener("click", checkAnswer);
retryButton.addEventListener("click", retryTheQuiz);
showAnswerButton.addEventListener("click", showAnswer);
previousButton.addEventListener("click", previousQuestion);

displayQuestion();
