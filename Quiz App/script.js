const datas = [
  {
    id: 1,
    question: `What is 2 + Undefined?`,
    choices: [
      `Null`,
      `NaN`,
      `When Javascript adds undefined is ignored result is 2`,
      `2undefined`,
    ],
    answer: `NaN`,
  },
  {
    id: 2,
    question: `How do you write "Hello World" in an alert box?`,
    choices: [
      `msgBox("Hello World")`,
      `msg("Hello World")`,
      `alertBox("Hello World")`,
      `alert("Hello World")`,
    ],
    answer: `alert("Hello World")`,
  },
  {
    id: 3,
    question: `How can you add a comment in a JavaScript?`,
    choices: [
      `'This is comment`,
      `// This is comment`,
      `<- This is comment ->`,
      `\\ This is comment`,
    ],
    answer: `// This is comment`,
  },
  {
    id: 4,
    question: `What is the correct way to write a JavaScript array?`,
    choices: [
      `let colors = (1:"red", 2:"green", 3:"blue")`,
      `let colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")`,
      `let colors = "red", "green", "blue"`,
      `let colors = ["red", "green", "blue"]`,
    ],
    answer: `let colors = ["red", "green", "blue"]`,
  },
  {
    id: 5,
    question: `How do you find the number with the highest value of x and y?`,
    choices: [`Math.max(x, y)`, `Math.ceil(x, y)`, `ceil(x, y)`, `top(x, y)`],
    answer: `Math.max(x, y)`,
  },
];
const shuffledQuizData = datas.sort(() => 0.5 - Math.random());

const progressEl = document.getElementById("progress");
const answerContEl = document.getElementById("answerCont");
const questionEl = document.getElementById("question");
const nextBtnEl = document.getElementById("nextBtn");
const quizContainerEl = document.getElementById("quizContainer");

let quizCount = 0;
let result = 0;
let isAnswerSelected = false;

// Counting El

let circleCount = 0;
let answerElCount = 0;

// Disabling button when no choice is selected

nextBtnEl.disabled = true;

// Create Progress

function createProgress() {
  const circleEl = document.createElement("div");
  circleEl.className = `circle circle${++circleCount}`;
  const circlePara = document.createElement("p");
  circlePara.innerHTML = circleCount;
  circleEl.appendChild(circlePara);
  progressEl.appendChild(circleEl);
}

datas.forEach((data) => {
  createProgress();
});

// Create Quiz

function createQuizChoices(data) {
  const answerEl = document.createElement("div");
  const attr = document.createAttribute("data-value");
  attr.value = data;
  answerEl.setAttributeNode(attr);
  answerEl.className = `answer answer${++answerElCount}`;
  const answerPara = document.createElement("p");
  answerPara.innerHTML = data;
  answerEl.appendChild(answerPara);
  answerContEl.appendChild(answerEl);

  // Event Listener
  answerEl.addEventListener("click", (e) => {
    if (!isAnswerSelected) {
      let allAnswerEl = answerContEl.querySelectorAll(`.answer`);
      checkAnswer(answerEl, allAnswerEl);
      isAnswerSelected = true;
      nextBtnEl.disabled = false;
      if (quizCount === shuffledQuizData.length - 1) {
        nextBtnEl.innerHTML = `Show Result`;
      }
    }
  });
}

function createQuiz() {
  let currentQuiz = shuffledQuizData[quizCount];
  questionEl.innerHTML = currentQuiz.question;

  answerContEl.innerHTML = ``;

  currentQuiz.choices
    .sort(() => 0.5 - Math.random())
    .forEach((choice) => {
      createQuizChoices(choice);
    });
}

createQuiz();

function checkAnswer(selectedAnswerEl, allAnswerEl) {
  let currentProgress = [...progressEl.querySelectorAll(".circle")];

  let currentQuizAnswer = shuffledQuizData[quizCount].answer;
  let selectedAnswer = selectedAnswerEl.dataset.value;
  if (selectedAnswer === currentQuizAnswer) {
    selectedAnswerEl.classList.add("correct");
    selectedAnswerEl.prepend(createCorrectIcon());
    currentProgress[quizCount].classList.add("correct");
    ++result;
  } else if (selectedAnswer !== currentQuizAnswer) {
    selectedAnswerEl.classList.add("wrong");
    selectedAnswerEl.prepend(createWrongIcon());
    currentProgress[quizCount].classList.add("wrong");
    allAnswerEl.forEach((ans) => {
      if (ans.dataset.value === currentQuizAnswer) {
        ans.classList.add("correct");
        ans.prepend(createCorrectIcon());
      }
    });
  }
}

function createCorrectIcon() {
  const iconEl = document.createElement("div");
  iconEl.classList.add("icon");
  iconEl.innerHTML = `<ion-icon name="checkmark-circle"></ion-icon>`;
  return iconEl;
}

function createWrongIcon() {
  const iconEl = document.createElement("div");
  iconEl.classList.add("icon");
  iconEl.innerHTML = `<ion-icon name="close-circle"></ion-icon>`;
  return iconEl;
}

nextBtnEl.addEventListener("click", (e) => {
  if (isAnswerSelected) {
    isAnswerSelected = false;
    nextBtnEl.disabled = true;

    if (quizCount < shuffledQuizData.length - 1) {
      ++quizCount;
      createQuiz();
    } else {
      createResultEl();
    }
  } else {
    alert("you must select a choice");
  }
});

function createResultEl() {
  quizContainerEl.innerHTML = ``;

  progressEl.style.opacity = `0`;

  const tableEl = document.createElement("table");
  tableEl.classList.add("resultTable");

  const resultData = [
    { text: `Total Question`, count: shuffledQuizData.length },
    { text: `Correct`, count: result },
    { text: `Wrong`, count: shuffledQuizData.length - result },
    {
      text: `Percentage`,
      count: `${(result / shuffledQuizData.length) * 100}%`,
    },
    { text: `Your Total`, count: `${result} / ${shuffledQuizData.length}` },
  ];

  // tr1
  function createTableRow(data) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.innerHTML = data.text;
    const td = document.createElement("td");
    td.innerHTML = data.count;
    tr.appendChild(th);
    tr.appendChild(td);
    tableEl.appendChild(tr);
  }

  resultData.forEach((data) => createTableRow(data));

  const restartCont = document.createElement("div");
  restartCont.classList.add("restartCont");
  const restartBtn = document.createElement("button");
  restartBtn.innerHTML = `Restart`;
  restartCont.appendChild(restartBtn);

  restartBtn.addEventListener("click", (e) => {
    window.location.reload();
  });

  // Append Table to continer
  quizContainerEl.appendChild(tableEl);
  quizContainerEl.appendChild(restartCont);
}
