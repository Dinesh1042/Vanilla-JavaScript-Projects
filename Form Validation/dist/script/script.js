class FormControl {
  constructor(control) {
    this.control = control;
    this.initializeControls();

    this.control.addEventListener("input", () => {
      this.dirty = true;
      this.updateValue();
      this.errors = this.errorControl();
      this.checkvalidity();
      this.setValidClass();
      if (this.control.type === "checkbox") this.touched = true;
      this.setErrorFeedback();
    });

    this.control.addEventListener("blur", () => {
      this.touched = true;
      this.checkvalidity();
      this.setValidClass();
      this.setErrorFeedback();
    });
  }

  initializeControls() {
    this.value =
      this.control.type === "checkbox"
        ? this.control.checked
        : this.control.value;
    this.errors = this.errorControl();
    this.valid = true;
    this.invalid = !this.valid;
    this.touched = false;
    this.dirty = false;
    this.name = this.control.name;
    this.updateValue();
    this.errorControl();
    this.checkvalidity();

    if (this.control.type !== "checkbox")
      this.errorMsgEl = this.control.nextElementSibling;
  }

  errorControl() {
    const arr = {
      ...this.minLength(),
      ...this.requiredInput(),
      ...this.requiredCheckBox(),
      ...this.validateMail(),
    };
    return arr;
  }

  minLength() {
    const { minLength, value } = this.control;

    return minLength > 0 && value.length < minLength
      ? { minlength: { requiredLength: minLength, actualLength: value.length } }
      : {};
  }

  requiredInput() {
    const { required, type, value } = this.control;

    return required && value.length === 0 && type !== "checkbox"
      ? { ["required"]: true }
      : {};
  }

  requiredCheckBox() {
    const { type, checked, required } = this.control;

    if (type === "checkbox" && required && !checked) {
      return { ["required"]: true };
    } else return {};
  }

  validateMail() {
    const { type, required, value } = this.control;

    if (required && type === "email")
      if (!this.isValidMail(value)) return { invalidEmail: true };
      else return {};
  }

  isValidMail(email) {
    const EMAIL_REGEX =
      /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return EMAIL_REGEX.test(email);
  }

  updateValue() {
    const { value, checked } = this.control;
    this.value = this.control.type === "checkbox" ? checked : value;
  }

  checkvalidity() {
    const errorArr = Object.keys(this.errors);

    if (errorArr.length === 0) {
      this.valid = true;
      this.invalid = !this.valid;
    } else {
      this.valid = false;
      this.invalid = !this.valid;
    }
    this.updateClassList();
  }

  updateClassList() {
    const defaultErrorClassLists = ["required", "minlength", "error", "valid"];
    this.control.classList.remove(...defaultErrorClassLists);

    const errorClass = Object.keys(this.errors);

    if (this.touched && errorClass.includes("required"))
      this.control.classList.add("required", "error");
    else if (this.touched && errorClass.length)
      this.control.classList.add(...errorClass, "error");
  }

  setValidClass() {
    if (this.valid && this.dirty && this.value.length)
      this.control.classList.add("valid");
  }

  setErrorFeedback() {
    if (!this.touched || this.control.type === "checkbox") return;

    const { required, invalidEmail, minlength } = this.errors;

    let invalidMsg = null;

    const errorMsg = {
      required: `${this.captialize(this.name)} is required`,
      invalidMail: `Please make sure that is a valid Email`,
    };

    if (this.errors.minlength) {
      errorMsg.minlength = `${this.captialize(this.name)} must be minimum ${
        minlength.requiredLength
      } character length`;
    }

    if (required) invalidMsg = errorMsg.required;
    else if (invalidEmail) invalidMsg = errorMsg.invalidMail;
    else if (minlength) invalidMsg = errorMsg.minlength;
    this.errorMsgEl.innerHTML = invalidMsg;
  }

  captialize(word) {
    return word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  }
}

class Form {
  constructor(form) {
    this.form = form;

    this.submitBtn = this.form.querySelector("#submitBtn");
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmit();
      console.log(this);
      console.log(this.value);
    });
    this.initializeFields();
  }

  initializeFields() {
    this.formGroup = [...this.form.elements].filter(
      (i) => i.localName !== "button"
    );

    this.createFormControl();
    this.valid = false;
    this.invalid = !this.valid;
    this.formValue();
    this.checkValidity();

    this.formGroup.forEach((f) => {
      f.addEventListener("input", (e) => {
        this.formValue();
        this.checkValidity();
      });
    });
  }

  createFormControl() {
    this.formControlCollections = this.formGroup.map((i) => new FormControl(i));
  }

  onSubmit() {
    this.formValue();
  }

  formValue() {
    this.value = this.formControlCollections.reduce((acc, val) => {
      acc[val.name] = val.value;
      return acc;
    }, {});
  }

  disableBtn() {
    // Disabling submit button when form is not valid

    this.submitBtn.disabled = this.invalid;
  }

  checkValidity() {
    let invalidForms = this.formControlCollections.filter((i) => i.invalid);
    this.valid = invalidForms.length === 0;
    this.invalid = !this.valid;
    this.disableBtn();
  }
}

const form = document.getElementById("form");
const signUpForm = new Form(form);
console.log(signUpForm, "SignUpForm");
