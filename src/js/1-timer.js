import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import izitoast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import errorIcon from '../img/izitoast-icon.svg';

class UserTimer {
  static #second = 1000;
  static #minute = UserTimer.#second * 60;
  static #hour = UserTimer.#minute * 60;
  static #day = UserTimer.#hour * 24;
  #intervalID = null;

  constructor(ms) {
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

  static validateDate(date) {
    return date - new Date() > 0 ? true : false;
  }

  startTimer(date, clearIntervalId) {
    if (UserTimer.validateDate(date)) {
      clearInterval(clearIntervalId);
      document.querySelector('[data-start]').classList.remove('js-enabled');
      document.querySelector('#datetime-picker').classList.add('js-disabled');
      document.querySelector('#datetime-picker').disabled = true;
      this.#intervalID = setInterval(
        () => {
          const timeDiff = date - new Date();
          const timeRemaining = this.#convertMs(timeDiff);

          document.querySelector('[data-days]').textContent = String(
            timeRemaining.days
          ).padStart(2, '0');
          document.querySelector('[data-hours]').textContent = String(
            timeRemaining.hours
          ).padStart(2, '0');
          document.querySelector('[data-minutes]').textContent = String(
            timeRemaining.minutes
          ).padStart(2, '0');
          document.querySelector('[data-seconds]').textContent = String(
            timeRemaining.seconds
          ).padStart(2, '0');
          if (!UserTimer.validateDate(date)) {
            document.querySelector('#datetime-picker').disabled = false;
            document
              .querySelector('#datetime-picker')
              .classList.remove('js-disabled');
            this.#stopTimer(this.#intervalID);
          }
        },
        1000,
        date
      );
    }
  }

  #stopTimer(clearIntervalId) {
    clearInterval(clearIntervalId);
    document.querySelector('[data-days]').textContent = '00';
    document.querySelector('[data-hours]').textContent = '00';
    document.querySelector('[data-minutes]').textContent = '00';
    document.querySelector('[data-seconds]').textContent = '00';
  }
}

flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    const timer = new UserTimer(selectedDates[0]);
    if (!UserTimer.validateDate(selectedDates[0])) {
      izitoast.show({
        class: 'js-izitoast-message',
        message: 'Please choose a date in the future',
        messageColor: '#FFFFFF',
        messageSize: '16px',
        position: 'topRight',
        backgroundColor: '#EF4040',
        progressBarColor: '#B51B1B',
        iconUrl: errorIcon,
        displayMode: 'replace',
        closeOnEscape: true,
        pauseOnHover: false,
      });
      return;
    }
    const isValidDate = setInterval(() => {
      if (!UserTimer.validateDate(selectedDates[0])) {
        document.querySelector('[data-start]').classList.remove('js-enabled');
        document
          .querySelector('[data-start]')
          .addEventListener(
            'click',
            () => izitoast.error({ displayMode: 'once' }),
            {
              once: true,
            }
          );
      } else {
        document.querySelector('[data-start]').classList.add('js-enabled');
        document.querySelector('[data-start]').addEventListener('click', () => {
          timer.startTimer(selectedDates[0], isValidDate);
        });
      }
    }, 1000);
  },
});
