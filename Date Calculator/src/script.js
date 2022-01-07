const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const errorContainerEl = document.getElementById('errorContainer');
const resultContainerEl = document.getElementById('resultContainer');

Array.from([startDate, endDate]).forEach((el) =>
  el.addEventListener('input', handleInputEvent)
);

function handleInputEvent() {
  const startDateValue = startDate.value;
  const endDateValue = endDate.value;

  if (startDateValue && endDateValue)
    try {
      const dateDiff = calculateDate([startDateValue, endDateValue]);

      showResultOnDOM(dateDiff);
    } catch (error) {
      showErrorOnDOM(error);
    }
  else showPlaceHolderTextOnDOM();
}

function calculateDate(dateArr) {
  const [startDate, endDate] = dateArr.map((date) => new Date(date));

  removeValidationError();
  validateDate(startDate, endDate);

  const dateDifferences = {
    years: calculateYears(startDate, endDate),
    months: calculateMonths(startDate, endDate),
    days: calculateDays(startDate, endDate),
    weeks: calculateWeeks(startDate, endDate),
    hours: calculateHours(startDate, endDate),
    minutes: calculateMinutes(startDate, endDate),
    seconds: calculateSeconds(startDate, endDate),
    dateDiffStr: getDateDiffStr(startDate, endDate),
  };

  return dateDifferences;
}

function validateDate(startDate, endDate) {
  if (startDate > endDate)
    throw new Error('End date cannot be higher than start date.');
}

function calculateYears(startDate, endDate) {
  return Math.floor(calculateMonths(startDate, endDate) / 12);
}

function calculateMonths(startDate, endDate) {
  const ONE_MONTH_MILLISECOND = 2629800000;
  return Math.round((endDate - startDate) / ONE_MONTH_MILLISECOND);
}

function calculateWeeks(startDate, endDate) {
  return Math.floor(calculateDays(startDate, endDate) / 7);
}

function calculateDays(startDate, endDate) {
  const ONE_DAY_MILLISECOND = 1000 * 3600 * 24;
  return Math.floor((endDate - startDate) / ONE_DAY_MILLISECOND);
}

function calculateHours(startDate, endDate) {
  return calculateDays(startDate, endDate) * 24;
}

function calculateMinutes(startDate, endDate) {
  return calculateHours(startDate, endDate) * 60;
}

function calculateSeconds(startDate, endDate) {
  return calculateMinutes(startDate, endDate) * 60;
}

function getDateDiffStr(startDate, endDate) {
  const ONE_MONTH_MILLISECOND = 2629800000;
  const monthsLeft = (endDate - startDate) / ONE_MONTH_MILLISECOND;
  const daysLeft = Math.round((monthsLeft - Math.floor(monthsLeft)) * 31);

  const monthsLeftStr = `${Math.floor(monthsLeft)} month${
    Math.floor(monthsLeft) > 1 ? 's' : ''
  }`;
  const daysLeftStr = `${daysLeft} day${daysLeft > 1 ? 's' : ''}`;

  if (monthsLeft >= 1 && daysLeft >= 1)
    return `${monthsLeftStr} and ${daysLeftStr}`;
  else if (monthsLeft >= 1 && daysLeft < 1) return monthsLeftStr;
  else return daysLeftStr;
}

function showResultOnDOM(dateDiff) {
  removeChildElements(resultContainerEl);
  const resultElement = createResultElement(dateDiff);
  resultContainerEl.appendChild(resultElement);
}

function createResultElement({ dateDiffStr, ...dateDiff }) {
  const dateResultEl = document.createElement('div');
  dateResultEl.classList.add('date-result');

  const col1El = document.createElement('div');
  col1El.classList.add('col-1');

  const resultEl = document.createElement('h3');
  resultEl.textContent = `Result: ${formatNumber(dateDiff.days)} Day${
    dateDiff.days > 1 ? 's' : ''
  }`;
  col1El.appendChild(resultEl);

  const resultParaEl = document.createElement('p');
  resultParaEl.textContent = `It is  ${formatNumber(dateDiff.days)} day${
    dateDiff.days > 1 ? 's' : ''
  } from start date to the end date, but no including end date`;

  col1El.appendChild(resultParaEl);

  const resultParaMonthsEl = document.createElement('p');
  resultParaMonthsEl.classList.add('mt-2');
  resultParaMonthsEl.textContent = `(OR) ${dateDiffStr}`;

  dateDiff.days && col1El.appendChild(resultParaMonthsEl);

  dateResultEl.appendChild(col1El);

  if (Object.values(dateDiff).every((unit) => unit === 0)) return dateResultEl;

  const col2El = document.createElement('div');
  col2El.classList.add('col-2');

  const alternativeHeadingEl = document.createElement('h3');
  alternativeHeadingEl.textContent = `Alternative time units`;
  col2El.appendChild(alternativeHeadingEl);

  const alternativeParaEl = document.createElement('p');
  alternativeParaEl.textContent = `${formatNumber(dateDiff.days)} day${
    dateDiff.days > 1 ? 's' : ''
  } can be converted to one of these units`;
  col2El.appendChild(alternativeParaEl);

  const unitsList = document.createElement('ul');
  unitsList.classList.add('unit-list');

  Object.entries(dateDiff)
    .filter(([, unit]) => unit) // filtering non Zero Units
    .forEach(([key, unit]) => {
      const unitsListItem = document.createElement('li');
      unitsListItem.textContent = `${formatNumber(unit)} ${
        unit > 1 ? key : key.slice(0, -1)
      }`;
      unitsList.appendChild(unitsListItem);
    });

  col2El.appendChild(unitsList);
  dateResultEl.appendChild(col2El);

  return dateResultEl;
}

function showErrorOnDOM(error) {
  const errorEl = createErrorElement(error.message);
  errorContainerEl.appendChild(errorEl);
}

function createErrorElement(message) {
  const errorEl = document.createElement('div');
  errorEl.classList.add('alert', 'alert-danger');
  errorEl.textContent = message;
  return errorEl;
}

function removeValidationError() {
  removeChildElements(errorContainerEl);
}

function removeChildElements(parentEl) {
  while (parentEl.firstChild) parentEl.firstChild.remove();
}

function showPlaceHolderTextOnDOM() {
  removeChildElements(resultContainerEl);
  const placeholderEl = document.createElement('p');
  placeholderEl.classList.add('text-center', 'text-muted');
  placeholderEl.textContent = `Please enter the dates to calculate.`;

  resultContainerEl.appendChild(placeholderEl);
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
