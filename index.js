const zfill = (val) => `00${val}`.slice(-2);


const second2str = (sec) => {
  let sign = '';
  if (sec < 0) {
    sign = '-';
    sec = -sec;
  }

  const h = Math.floor(sec / 60 / 60);
  const m = zfill(Math.floor(sec / 60 % 60));
  const s = zfill(Math.round(sec % 60));

  return `${sign}${h}:${m}:${s}`;
}


class TimeButton {
    constructor(labelSelector, radioSelector, initial) {
        this.label = document.querySelector(labelSelector);
        this.radio = document.querySelector(radioSelector);
        this.remain = this.initial = Number(initial);
    }

    update(delta) {
        if (this.radio.checked) {
            this.remain -= delta;
        }

        this.label.innerText = second2str(Math.round(this.remain / 1000));

        if (this.remain < 0 && this.initial > 0) {
            this.label.classList.add('timeup');
        } else {
            this.label.classList.remove('timeup');
        }
    }
}


const whiteInitial = localStorage.getItem('white-initial') ? Number(localStorage.getItem('white-initial')) : (60 * 60 * 1000);
const blackInitial = localStorage.getItem('black-initial') ? Number(localStorage.getItem('black-initial')) : (60 * 60 * 1000);

const white = new TimeButton('label.white', '.black.radio', localStorage.getItem('white-remain') || whiteInitial);
const black = new TimeButton('label.black', '.white.radio', localStorage.getItem('black-remain') || blackInitial);
const favicon = document.querySelector('#favicon');

document.querySelector('.white.initial-time').value = whiteInitial / 60 / 1000;
document.querySelector('.black.initial-time').value = blackInitial / 60 / 1000;


let beforeTime = new Date().getTime();
setInterval(() => {
    const now = new Date().getTime();
    const delta = now - beforeTime;

    white.update(delta);
    black.update(delta);

    if (white.radio.checked) {
        favicon.href = '/icon-white.svg';
    } else if (black.radio.checked) {
        favicon.href = '/icon-black.svg';
    } else {
        favicon.href = '/icon.svg';
    }

    beforeTime = now;
}, 100);


document.querySelector('button').addEventListener('click', () => {
    white.remain = white.initial = Number(document.querySelector('.white.initial-time').value) * 60 * 1000;
    black.remain = black.initial = Number(document.querySelector('.black.initial-time').value) * 60 * 1000;

    localStorage.setItem('white-initial', white.initial);
    localStorage.setItem('black-initial', black.initial);
});


window.addEventListener('beforeunload', () => {
    localStorage.setItem('white-remain', white.remain);
    localStorage.setItem('black-remain', black.remain);
});
