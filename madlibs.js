/**
 * Complete the implementation of parseStory.
 *
 * parseStory retrieves the story as a single string from story.txt
 * (I have written this part for you).
 *
 * In your code, you are required (please read this carefully):
 * - to return a list of objects
 * - each object should definitely have a field, `word`
 * - each object should maybe have a field, `pos` (part of speech)
 *
 * So for example, the return value of this for the example story.txt
 * will be an object that looks like so (note the comma! periods should
 * be handled in the same way).
 *
 * Input: "Louis[n] went[v] to the store[n], and it was fun[a]."
 * Output: [
 *  { word: "Louis", pos: "noun" },
 *  { word: "went", pos: "verb", },
 *  { word: "to", },
 *  { word: "the", },
 *  { word: "store", pos: "noun" }
 *  { word: "," }
 *  ....
 *
 * There are multiple ways to do this, but you may want to use regular expressions.
 * Please go through this lesson: https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/regular-expressions/
 */

function parseStory(rawStory) {
  const regex = /[a-zA-Z]+\[(v|a|n)\]|\b[a-zA-Z]+\b/g;
  // console.log(rawStory.match(regex));
  return rawStory.match(regex).map((match) => {
    const word = match.replace(/\[.*?\]/, "");
    let pos;
    const posMatch = match.match(/\[(v|a|n)\]/);
    if (posMatch) {
      [, pos] = posMatch;
      switch (pos) {
        case "v":
          pos = "verb";
          break;
        case "a":
          pos = "adjective";
          break;
        case "n":
          pos = "noun";
          break;
        default:
          pos = undefined;
      }
    }

    // console.log({ word, pos });
    return { word, pos };
  });
}

/**
 * All your other JavaScript code goes here, inside the function. Don't worry about
 * the `then` and `async` syntax for now.
 *
 * NOTE: You should not be writing any code in the global namespace EXCEPT
 * declaring functions. All code should either:
 * 1. Be in a function.
 * 2. Be in .then() below.
 *
 * You'll want to use the results of parseStory() to display the story on the page.
 */
getRawStory()
  .then(parseStory)
  .then((processedStory) => {
    const madLibsEdit = document.querySelector(".madLibsEdit");
    const madLibsPreview = document.querySelector(".madLibsPreview");
    let wordCount = 0;
    for (const word of processedStory) {
      if (word.pos) {
        word.word = "";
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.classList.add(`input-${wordCount++}`);
        setEventOfInput(input);
        setEnterKeypress(input, wordCount);
        input.setAttribute("placeholder", word.pos);
        madLibsEdit.appendChild(input);
        const result = document.createElement("span");
        result.innerText = " _____";
        result.classList.add(`result-${wordCount - 1}`, "result");
        madLibsPreview.appendChild(result);
        continue;
      }
      const el = document.createElement("span");
      el.innerText = word.word.match(/[a-zA-Z]/) ? ` ${word.word}` : word.word;
      madLibsEdit.appendChild(el.cloneNode(true));
      madLibsPreview.appendChild(el);
    }
  });

function setEventOfInput(input) {
  // onInput
  input.addEventListener("input", () => {
    const inputClassNumber = parseInt(
      input.classList[input.classList.length - 1].split("-")[1]
    );
    const madLibsEdit = document.querySelector(".madLibsEdit");
    const madLibsPreview = document.querySelector(".madLibsPreview");
    const inputEdit = madLibsEdit.querySelector(`.input-${inputClassNumber}`);
    const inputPreview = madLibsPreview.querySelector(
      `.result-${inputClassNumber}`
    );
    inputEdit.value = input.value;
    if (inputEdit.value.length < 20) {
      inputPreview.innerText = inputEdit.value ? ` ${input.value}` : " ______";
    } else {
      input.value = input.value.substring(0, 20);
      alert("you can type max 20 characters");
    }
  });
}

function setEnterKeypress(input, count) {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      let nextInput = document.querySelector(`.input-${count}`);
      nextInput?.focus();
    }
  });
}
