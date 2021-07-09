const zfill = (val) => `00${val}`.slice(-2);

const second2str = (sec) => {
    const sign = sec < 0 ? '-' : '';
    sec = Math.abs(sec);

    const h = Math.floor(sec / 60 / 60);
    const m = zfill(Math.floor(sec / 60 % 60));
    const s = zfill(Math.round(sec % 60));

    return `${sign}${h}:${m}:${s}`;
}

class TimeButton {
    constructor(labelSelector, radioSelector) {
        this.label = document.querySelector(labelSelector);
        this.radio = document.querySelector(radioSelector);
        this.clock = this.label.querySelector('.clock');
        this.count = this.label.querySelector('.count');

        this.remain = this.initial = 0;

        this.radio.addEventListener('change', () => this.onChange());
    }

    onChange() {
        this.count.innerText = Number(this.count.innerText) + 1;
    }

    update(delta) {
        if (this.radio.checked) {
            this.remain -= delta;
        }

        this.clock.innerText = second2str(Math.round(this.remain / 1000));

        if (this.remain < 0 && this.initial > 0) {
            this.label.classList.add('timeup');
        } else {
            this.label.classList.remove('timeup');
        }
    }
}


const white = new TimeButton('label.white', '.black.radio', localStorage.getItem('white-remain') || (60 * 60 * 1000));
const black = new TimeButton('label.black', '.white.radio', localStorage.getItem('black-remain') || (60 * 60 * 1000));
const totalClocks = document.querySelectorAll('.total.clock');
const favicon = document.querySelector('#favicon');

white.initial = localStorage.getItem('white-initial') ? Number(localStorage.getItem('white-initial')) : (60 * 60 * 1000);
black.initial = localStorage.getItem('black-initial') ? Number(localStorage.getItem('black-initial')) : (60 * 60 * 1000);
document.querySelector('.white.initial-time').value = white.initial / 60 / 1000;
document.querySelector('.black.initial-time').value = black.initial / 60 / 1000;
white.remain = localStorage.getItem('white-remain') ? Number(localStorage.getItem('white-remain')) : white.initial;
black.remain = localStorage.getItem('black-remain') ? Number(localStorage.getItem('black-remain')) : black.initial;

white.count.innerText = Number(localStorage.getItem('white-count')) || 0;
black.count.innerText = Number(localStorage.getItem('black-count')) || 0;

let totalTime = Number(localStorage.getItem('total-time')) || 0;

let beforeTime = new Date().getTime();
setInterval(() => {
    const now = new Date().getTime();
    const delta = now - beforeTime;

    white.update(delta);
    black.update(delta);

    if (white.radio.checked) {
        favicon.href = '/icon-white.svg';
        totalTime += delta;
    } else if (black.radio.checked) {
        favicon.href = '/icon-black.svg';
        totalTime += delta;
    } else {
        favicon.href = '/icon.svg';
    }

    const totalStr = second2str(totalTime / 1000);
    totalClocks.forEach((elm) => {
        elm.innerText = totalStr;
    });

    beforeTime = now;
}, 100);

document.querySelector('button').addEventListener('click', () => {
    white.remain = white.initial = Number(document.querySelector('.white.initial-time').value) * 60 * 1000;
    black.remain = black.initial = Number(document.querySelector('.black.initial-time').value) * 60 * 1000;

    white.count.innerText = black.count.innerText = '0';
    totalTime = 0;

    localStorage.setItem('white-initial', white.initial);
    localStorage.setItem('black-initial', black.initial);
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('white-remain', white.remain);
    localStorage.setItem('black-remain', black.remain);
    localStorage.setItem('white-count', white.count.innerText);
    localStorage.setItem('black-count', black.count.innerText);
    localStorage.setItem('total-time', totalTime);
});
