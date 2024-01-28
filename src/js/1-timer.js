import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import izitoast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import errorIcon from '../img/izitoast-icon.svg';
import closeIcon from '../img/izitoast-close.svg';

const userLinks = {
  startButton: document.querySelector('[data-start]'),
  input: document.querySelector('#datetime-picker'),
  daysElement: document.querySelector('[data-days]'),
  hoursElement: document.querySelector('[data-hours]'),
  minutesElement: document.querySelector('[data-minutes]'),
  secondsElement: document.querySelector('[data-seconds]'),
};

class UserTimer {
  static #second = 1000;
  static #minute = UserTimer.#second * 60;
  static #hour = UserTimer.#minute * 60;
  static #day = UserTimer.#hour * 24;
  #intervalID = null;

  constructor(ms, paramsObject) {
    this.hoursElement = paramsObject.hoursElement;
    this.minutesElement = paramsObject.minutesElement;
    this.secondsElement = paramsObject.secondsElement;
    this.startButton = paramsObject.startButton;
    this.input = paramsObject.input;
    this.daysElement = paramsObject.daysElement;
    this.days = ms.getDate() || 0;
    this.hours = ms.getHours() || 0;
    this.minutes = ms.getMinutes() || 0;
    this.seconds = ms.getSeconds() || 0;
  }

  #convertMs(ms) {
    const days = Math.floor(ms / UserTimer.#day);
    const hours = Math.floor((ms % UserTimer.#day) / UserTimer.#hour);
    const minutes = Math.floor(
      ((ms % UserTimer.#day) % UserTimer.#hour) / UserTimer.#minute
    );
    const seconds = Math.floor(
      (((ms % UserTimer.#day) % UserTimer.#hour) % UserTimer.#minute) /
        UserTimer.#second
    );
    return { days, hours, minutes, seconds };
  }

  static isDateValid(date) {
    return date - new Date() > 0 ? true : false;
  }

  startTimer(date) {
    if (UserTimer.isDateValid(date)) {
      this.startButton.classList.remove('js-enabled');
      this.input.classList.add('js-disabled');
      this.input.disabled = true;
      this.#intervalID = setInterval(() => {
        const timeDiff = date - new Date();
        const timeRemaining = this.#convertMs(timeDiff);
        console.log('tick');
        this.daysElement.textContent = String(timeRemaining.days).padStart(
          2,
          '0'
        );
        this.hoursElement.textContent = String(timeRemaining.hours).padStart(
          2,
          '0'
        );
        this.minutesElement.textContent = String(
          timeRemaining.minutes
        ).padStart(2, '0');
        this.secondsElement.textContent = String(
          timeRemaining.seconds
        ).padStart(2, '0');
        if (!UserTimer.isDateValid(date)) {
          this.input.disabled = false;
          document
            .querySelector('#datetime-picker')
            .classList.remove('js-disabled');
          this.#stopTimer();
        }
      }, 1000);
    }
  }

  #stopTimer() {
    clearInterval(this.#intervalID);
    this.daysElement.textContent = '00';
    this.hoursElement.textContent = '00';
    this.minutesElement.textContent = '00';
    this.secondsElement.textContent = '00';
  }
}

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: onClose,
});

function onClose(selectedDates) {
  console.log(selectedDates[0]);
  const closeTimestamp = Date.now();
  const timer = new UserTimer(selectedDates[0], userLinks);
  if (!UserTimer.isDateValid(selectedDates[0])) {
    showMessage('Please choose a date in the future');
    return;
  }
  const timeoutID = setTimeout(() => {
    timer.startButton.classList.remove('js-enabled');
    timer.startButton.disabled = true;
    showMessage('Selected date is not valid anymore');
  }, selectedDates[0] - closeTimestamp);

  if (UserTimer.isDateValid(selectedDates[0])) {
    timer.startButton.classList.add('js-enabled');
    timer.startButton.disabled = false;
    timer.startButton.addEventListener('click', () => {
      clearTimeout(timeoutID);
      timer.startTimer(selectedDates[0]);
    });
  }
}

function showMessage(messageText) {
  izitoast.show({
    class: 'js-izitoast-message',
    message: messageText,
    messageColor: '#FFFFFF',
    messageSize: '16px',
    position: 'topRight',
    backgroundColor: '#EF4040',
    progressBarColor: '#B51B1B',
    iconUrl: errorIcon,
    displayMode: 'replace',
    close: false,
    closeOnEscape: true,
    pauseOnHover: false,
    buttons: [
      [
        `<button type="button" style="background-color: transparent;"><img src=${closeIcon}></button>`,
        function (instance, toast) {
          instance.hide({ transitionOut: 'fadeOut' }, toast);
        },
      ],
    ],
  });
}
