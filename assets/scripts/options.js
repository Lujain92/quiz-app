/**
 * Shuffles the elements in an array using the Fisher-Yates shuffle algorithm.
 *
 * @param {Array} array - The array of elements to be shuffled.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Generates an HTML option element for a multiple-choice quiz question.
 *
 * @param {string} title - The text of the option.
 * @param {string|null} userAnswer - The user's answer, or null if not answered.
 * @returns {string} - A string representing an HTML option element.
 */
function getOption(title, userAnswer) {
  const isSelected = userAnswer !== null && userAnswer === title;
  const customClass = isSelected ? "selected" : "";
  const option = `
    <button type="button" class="option ${customClass}" onclick="selectOption(this)">
      ${title}
    </button>
  `;
  return option;
}

window.selectOption = function(button) {
  const options = document.querySelectorAll('.option');

  options.forEach((opt) => {
    opt.classList.remove('selected');
  });

  button.classList.add('selected');
};

  

export { shuffleArray, getOption };
