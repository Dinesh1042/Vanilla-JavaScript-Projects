const FAQQuestion = [
  {
    id: 1,
    question: `What is a pseudo-class?`,
    answer: `It is a CSS technique that sets the style when an element changes its state. E.g. style changes when mouse hover, different styles for visited or unvisited links, etc.`,
  },
  {
    id: 2,
    question: `What is CORS?`,
    answer: `Cross-Origin Resource Sharing (CORS) is a mechanism that enables different resources on a web page to be requested from another domain outside the domain from which the request originated.`,
  },
  {
    id: 3,
    question: `What is the default border size of a Canvas?`,
    answer: `Here is no default border size of a Canvas. You can adjust using CSS.`,
  },
  {
    id: 4,
    question: `What is the difference between null value and undefined value?`,
    answer: `Undefined means a variable has been declared but has not yet been assigned a value. On the other hand, null is an assignment value.`,
  },
  {
    id: 5,
    question: `What is the difference between ‘==’ and ‘===’ operators?`,
    answer: `Though both of them belong to the comparison operator category, the ‘==’ operator checks the value whereas, the ‘===’ operator checks both the value and the type.`,
  },
];

const faqContEl = document.getElementById("faqCont");

function createFAQEl(data) {
  const faqEl = document.createElement("div");
  faqEl.classList.add("faq");

  // Question Cont

  const questionCont = document.createElement("div");
  questionCont.classList.add("questionCont");

  faqEl.appendChild(questionCont);

  const questionEl = document.createElement("div");
  questionEl.classList.add("question");
  const questionPara = document.createElement("p");
  questionPara.innerHTML = data.question;
  questionEl.appendChild(questionPara);

  // icon

  const iconEl = document.createElement("div");
  iconEl.classList.add("icon");
  const iconBtn = document.createElement("button");
  iconBtn.innerHTML = `<ion-icon name="chevron-down"></ion-icon>`;
  iconEl.appendChild(iconBtn);

  questionCont.appendChild(questionEl);
  questionCont.appendChild(iconEl);

  //   Answer Cont

  const answerCont = document.createElement("div");
  answerCont.classList.add("answerCont");
  const answerEl = document.createElement("div");
  answerEl.classList.add("answer");
  const answerPara = document.createElement("p");
  answerPara.innerHTML = data.answer;

  answerEl.appendChild(answerPara);
  answerCont.appendChild(answerEl);
  faqEl.appendChild(answerCont);

  faqContEl.appendChild(faqEl);

  // Event listener

  questionCont.addEventListener("click", (e) => {
    const allFaq = document.querySelectorAll(".faqCont .faq");
    allFaq.forEach((item) =>
      item !== faqEl ? item.classList.remove("active") : false
    );

    faqEl.classList.toggle("active");

    createRipple(e);
  });

  // Ripple Effect

  function createRipple(pos) {
    let topPos = pos.clientY - faqEl.getBoundingClientRect().top;

    let leftPos = pos.clientX - faqEl.getBoundingClientRect().left;

    const spanEl = document.createElement("span");
    spanEl.classList.add("ripple");
    questionCont.appendChild(spanEl);
    spanEl.style.cssText = `height:1000px;
        width:1000px;background-color:#647dee33;
        position:absolute;transform:translate(-50%,-50%);border-radius:50%;opacity:1;
        animation:rippleEffect 1s ease-in-out;
        top:${topPos}px;
        left:${leftPos}px;
        opacity:0;
        `;

    spanEl.addEventListener("animationend", (e) => {
      spanEl.remove();
    });
  }
}

FAQQuestion.forEach((question) => {
  createFAQEl(question);
});
