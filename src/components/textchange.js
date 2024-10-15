const words = ["Web ", "Graphic  ", "Java ",];
let index = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const word = words[index];
  const spanElement = document.getElementById("word");

  if (isDeleting) {
    spanElement.textContent = word.substring(0, charIndex - 1);
    charIndex--;
  } else {
    spanElement.textContent = word.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === word.length) {
    isDeleting = true;
    setTimeout(type, 1500); // Wait before starting to delete
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    index = (index + 1) % words.length; // Move to the next word in the array
    setTimeout(type, 500); // Wait before starting to type the next word
  } else {
    setTimeout(type, 100); // Typing speed (adjust as desired)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  type();
});
