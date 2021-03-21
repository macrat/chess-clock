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
        this.remain = initial ? Number(initial) : (60 * 60 * 1000);
    }

    update(delta) {
        if (this.radio.checked) {
            this.remain -= delta;
        }

        this.label.innerText = second2str(Math.round(this.remain / 1000));

        if (this.remain < 0) {
            this.label.classList.add('timeup');
        } else {
            this.label.classList.remove('timeup');
        }
    }
}


const whiteInitial = localStorage.getItem('white-initial');
const blackInitial = localStorage.getItem('black-initial');

const white = new TimeButton('label.white', '.black.radio', localStorage.getItem('white-remain') || whiteInitial);
const black = new TimeButton('label.black', '.white.radio', localStorage.getItem('black-remain') || blackInitial);
const favicon = document.querySelector('#favicon');

if (whiteInitial) {
    document.querySelector('.white.initial-time').value = Number(whiteInitial) / 60 / 1000;
}
if (blackInitial) {
    document.querySelector('.black.initial-time').value = Number(blackInitial) / 60 / 1000;
}


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
    white.remain = Number(document.querySelector('.white.initial-time').value) * 60 * 1000;
    black.remain = Number(document.querySelector('.black.initial-time').value) * 60 * 1000;

    localStorage.setItem('white-initial', white.remain);
    localStorage.setItem('black-initial', black.remain);
});


window.addEventListener('beforeunload', () => {
    localStorage.setItem('white-remain', white.remain);
    localStorage.setItem('black-remain', black.remain);
});
