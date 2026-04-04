const feedbackForm = document.querySelector('.feedback-form');
const notification = document.querySelector('.notification');

const formData = {
  email: '',
  message: '',
};

const storageService = {
  setLocalObject(data, { type }) {
    const isValid = checkData(data, type);
    if (isValid && type === 'submit') {
      Object.assign(formData, data);
      showError(false);
      console.log(formData);
      this.resetLocalStorage();
      this.resetLocalObject();
      return true;
    } else if (isValid && type === 'input') {
      Object.assign(formData, data);
      this.setLocalStorage(formData);
      return true;
    } else if (!isValid && type === 'input') {
      this.resetLocalStorage();
    }
  },
  setLocalStorage(data) {
    localStorage.setItem('feedback-form-state', JSON.stringify(data));
  },
  getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('feedback-form-state'));
    if (data === null) return null;
    if (checkData(data)) return data;
    this.resetLocalStorage();
    return null;
  },
  resetLocalObject() {
    Object.assign(formData, { email: '', message: '' });
  },
  resetLocalStorage() {
    localStorage.removeItem('feedback-form-state');
  },
};

const writeToInput = () => {
  const savedData = storageService.getLocalStorage();
  if (savedData) {
    Object.assign(formData, savedData);
    feedbackForm.elements.email.value = formData.email;
    feedbackForm.elements.message.value = formData.message;
  }
};

const checkData = (data, type) => {
  if (
    type === 'submit' &&
    (data.email.length === 0 || data.message.length === 0)
  ) {
    showError(true);
    return false;
  } else if (data.email.length === 0 && data.message.length === 0) {
    return false;
  }
  return true;
};

const showError = state => {
  state
    ? notification.classList.add('isActive')
    : notification.classList.remove('isActive');
};

const handelEvent = e => {
  e.preventDefault();
  const { email, message } = feedbackForm.elements;
  const result = storageService.setLocalObject(
    {
      email: email.value.trim(),
      message: message.value.trim(),
    },
    {
      type: e.type,
    }
  );
  if (e.type === 'submit' && result) {
    feedbackForm.reset();
  }
};
writeToInput();

feedbackForm.addEventListener('input', handelEvent);
feedbackForm.addEventListener('submit', handelEvent);
