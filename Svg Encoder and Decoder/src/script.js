import {
  dataURIToCssBackGroundImage,
  decodeSvg,
  encodeSvg,
  svgToCssBackGroundImage,
  validateDataURI,
  validateSvg,
} from './convertSvg.js';

const svgFormControlEl = document.getElementById('svgFormControl');
const dataURIFormControlEl = document.getElementById('dataURIFormControl');
const cssBackgroundFormControlEl = document.getElementById(
  'cssBackgroundFormControl'
);
const svgPreviewContainerEl = document.getElementById('svgPreviewContainer');
const svgPreviewEl = document.getElementById('svgPreview');
const colorPickerEl = document.getElementById('colorPicker');
const copyBtnEls = document.querySelectorAll('.btn-copy');
const errorEl = document.getElementById('error');

svgFormControlEl.addEventListener('input', svgFormControlHandler);
dataURIFormControlEl.addEventListener('input', dataURIFormControlHandler);

function svgFormControlHandler({ target }) {
  const svgControlValue = target.value.trim();

  if (!svgControlValue) return;

  try {
    validateSvg(svgControlValue);
  } catch (error) {
    showError(error);
    return;
  }

  hideError();

  const svgDataURI = encodeSvg(svgControlValue);
  const svgBackgroundCss = svgToCssBackGroundImage(svgControlValue);

  updateFormControlValue(svgControlValue, svgDataURI, svgBackgroundCss);
}

function dataURIFormControlHandler({ target }) {
  const dataURIControlValue = target.value.trim();

  if (!dataURIControlValue) return;

  try {
    validateDataURI(dataURIControlValue);
  } catch (error) {
    showError(error);
    return;
  }

  hideError();

  const decodedSvg = decodeSvg(dataURIControlValue);
  const dataURIBackgroundCss = dataURIToCssBackGroundImage(dataURIControlValue);

  updateFormControlValue(decodedSvg, dataURIControlValue, dataURIBackgroundCss);
}

function updateFormControlValue(
  svgControlValue,
  dataURIControlValue,
  cssBackgroundControlValue
) {
  svgFormControlEl.value = svgControlValue;
  dataURIFormControlEl.value = dataURIControlValue;
  cssBackgroundFormControlEl.value = cssBackgroundControlValue;

  previewSvg(dataURIControlValue);
}

function previewSvg(dataURIFormControlEl) {
  svgPreviewEl.style.backgroundImage = `url("${dataURIFormControlEl}")`;
  svgPreviewEl.classList.add('active');
}

function showError(error) {
  if (error.name !== 'Error') throw new Error(error.message);

  errorEl.textContent = error.message;
  errorEl.style.display = 'block';
}

function hideError() {
  errorEl.style.display = 'none';
  errorEl.textContent = '';
}

copyBtnEls.forEach((btn) => btn.addEventListener('click', copyBtnHandler));

function copyBtnHandler({ target }) {
  const formControlValue = target.parentElement
    .querySelector('.form-control')
    .value.trim();

  if (target.getAttribute('is-copied') === 'true' || !formControlValue) return;

  target.setAttribute('is-copied', true);
  target.textContent = 'Copied';

  window.navigator.clipboard.writeText(formControlValue);

  setTimeout(() => {
    target.textContent = 'Copy';
    target.setAttribute('is-copied', false);
  }, 2000);
}

// Enabling and disabling btn based on all-textarea
[svgFormControlEl, dataURIFormControlEl, cssBackgroundFormControlEl].forEach(
  (control, _, controls) =>
    control.addEventListener('input', () => {
      (controls.some((formControl) => !!formControl.value.trim()) &&
        enableCopyBtn()) ||
        disableCopyBtn();
    })
);

function enableCopyBtn() {
  copyBtnEls.forEach((btn) => btn.removeAttribute('disabled'));
  return true;
}

function disableCopyBtn() {
  copyBtnEls.forEach((btn) => btn.setAttribute('disabled', true));
  return false;
}

colorPickerEl.addEventListener(
  'input',
  ({ target: { value } }) =>
    (svgPreviewContainerEl.style.backgroundColor = value)
);

disableCopyBtn(); // Initially disabling the copy-buttons
