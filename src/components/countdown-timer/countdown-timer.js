/**
 * mcwc-countdown-timer
 *
 * A countdown timer used to count down to a particular deadline.
 * The 'deadline' attribute must be set as following
 * <mcwc-countdown-timer deadline="date"></mcwc-countdown-timer>
 * where 'date' is a valid JavaScript Date String format
 */

(() => {
  const template = document.createElement('template');

  template.innerHTML = `
  <style>
    :host {
      --bg-color: #FFFFFF;
      --text-color: #212121;
      --label-color: #838383;
    }

    .countdown {
      align-content: center;
      align-items: center;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }

    .countdown-card {
      align-content: center;
      align-items: center;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
      border-radius: 10%;
      background: var(--bg-color);
      display: flex;
      flex-direction: column;
      height: 90px;
      justify-content: center;
      margin: 10px;
      padding: 25px;
      text-align: center;
      width: 90px;
    }

    .countdown-card .countdown-value {
      color: var(--text-color);
      display: block;
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 3.5rem;
      margin-bottom: 8px;
    }

    .countdown-card .countdown-label {
      color: var(--label-color);
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      text-transform: uppercase;
    }
  </style>

  <div class="countdown">
    <div class="countdown-card">
      <span id="countdown-days" class="countdown-value">0</span>
      <span class="countdown-label">Days</span>
    </div>
    <div class="countdown-card">
      <span id="countdown-hours" class="countdown-value">00</span>
      <span class="countdown-label">Hours</span>
    </div>
    <div class="countdown-card">
      <span id="countdown-minutes" class="countdown-value">00</span>
      <span class="countdown-label">Minutes</span>
    </div>
    <div class="countdown-card">
      <span id="countdown-seconds" class="countdown-value">00</span>
      <span class="countdown-label">Seconds</span
    </div>
  </div>
`;

  class CountdownTimerComponent extends HTMLElement {
    constructor() {
      // Fires when an instance of the element is created or updated
      super();

      if (!this.hasAttribute('deadline')) {
        throw new Error('deadline attribute must be passed to countdown-timer');
      }

      const parsedDeadline = this._parseDeadline(this.attributes.deadline.value);

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.deadlineTime = parsedDeadline;
      this.daysElement = this.shadowRoot.getElementById('countdown-days');
      this.hoursElement = this.shadowRoot.getElementById('countdown-hours');
      this.minutesElement = this.shadowRoot.getElementById('countdown-minutes');
      this.secondsElement = this.shadowRoot.getElementById('countdown-seconds');
    }

    // Fires when an instance was inserted into the document
    connectedCallback() {
      this._update();

      this.countdown = setInterval(() => {
        this._update();
      }, 1000);
    }

    // Fires when an instance was removed from the document
    disconnectedCallback() {
      clearInterval(this.countdown);
    }

    // Calculates the remaining time and updates the countdown
    _update() {
      const distance = this.deadlineTime - Date.now();

      if (distance <= 0) {
        return clearInterval(this.countdown);
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.daysElement.innerHTML = days;
      this.hoursElement.innerHTML = hours;
      this.minutesElement.innerHTML = minutes;
      this.secondsElement.innerHTML = seconds;
    }

    // Validate and parse the deadline
    _parseDeadline(date) {
      const timestamp = new Date(date).getTime();

      if (isNaN(timestamp)) {
        throw new Error('deadline attribute must use a valid JavaScript Date String format');
      }

      return timestamp;
    }
  }

  // Register the custom element
  customElements.define('mcwc-countdown-timer', CountdownTimerComponent);
})();
