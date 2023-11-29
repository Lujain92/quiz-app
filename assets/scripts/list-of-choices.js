import { questions } from "../data/data.js";
const categorySelect = document.getElementById("category-select");
let selectedQuestions = [];

/**
 * Populates the category select dropdown with unique category options based on the questions data.
 */
function populateCategorySelect() {
  const categories = [...new Set(questions.map((question) => question.type))];
  const options = categories.map((category) => {
    return `<option value="${category}">${category}</option>`;
  });
  categorySelect.innerHTML = options.join("");
}

/**
 * Saves the selected category's questions to the `selectedQuestions` variable.
 */
function saveQuestions() {
  const selectedCategory = categorySelect.value;
  const categoryQuestions = questions.find((cat) => cat.type === selectedCategory);
  if (categoryQuestions) {
    selectedQuestions = categoryQuestions.questions;
  }
}

populateCategorySelect();
saveQuestions();

const startButton = document.getElementById("start");
startButton.addEventListener("click", () => {
  const selectedQuestionsJSON = JSON.stringify(selectedQuestions);

  localStorage.setItem("selectedQuestions", selectedQuestionsJSON);
  window.location.href = "quiz.html";
});
categorySelect.addEventListener("change", saveQuestions);
