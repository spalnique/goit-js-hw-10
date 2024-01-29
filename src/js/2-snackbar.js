import izitoast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import fulfilledIcon from '../img/fulfilledIcon.svg';
import rejectedIcon from '../img/rejectedIcon.svg';

function makePromise() {
  const delay = refs.delay;
  const isSuccess = refs.isSuccess;
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isSuccess) {
        resolve(`Fulfilled promise in ${delay}ms`);
      } else {
        reject(`Rejected promise in ${delay}ms`);
      }
    }, delay);
  });

  promise
    .then(fulfilled => showMessage(fulfilled, delay))
    .catch(rejected => showMessage(rejected, delay));
}

function showMessage(messageText, delay) {
  messageText.includes('Fulfilled')
    ? console.log(`✅ Fulfilled promise in ${delay}ms`)
    : console.log(`❌ Rejected promise in ${delay}ms`);

  izitoast.show({
    class: 'js-izitoast-message',
    title: messageText.includes('Fulfilled') ? 'OK' : 'Error',
    titleColor: '#FFFFFF',
    message: messageText,
    messageColor: '#FFFFFF',
    messageSize: '16px',
    position: 'topRight',
    backgroundColor: messageText.includes('Fulfilled') ? '#59A10D' : '#EF4040',
    progressBarColor: messageText.includes('Fulfilled') ? '#326101' : '#B51B1B',
    iconUrl: messageText.includes('Fulfilled') ? fulfilledIcon : rejectedIcon,
    close: false,
  });
}

//////////////////////////////////////////////////////////////////////////////////

const refs = {
  form: document.querySelector('.form'),
  delayInput: document.querySelector('.form').elements.delay,
  fieldset: document.querySelector('.form > fieldset'),
  isSuccess: null,
  delay: null,
};

refs.fieldset.addEventListener('click', e => {
  if (e.target.nodeName === 'INPUT') {
    refs.isSuccess = e.target.value === 'fulfilled' ? true : false;
  }
});

refs.form.addEventListener('submit', e => {
  e.preventDefault();
  refs.delay = refs.delayInput.value;
  makePromise();
  refs.form.reset();
  refs.delayInput.focus();
});
