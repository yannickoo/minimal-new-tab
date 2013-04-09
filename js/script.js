function getElement(x) {
  return document.getElementById(x);
}

function getElements(x) {
  return document.getElementsByTagName(x);
}

function getSetting(name) {
  // Return default value if it does not exist in localStorage.
  switch (name) {
    case 'clockShow':
    case 'clockShowTime':
    case 'clockShowDate':
      if (localStorage.getItem(name) === null) {
        return true;
      }
      else {
        return localStorage.getItem(name);
      }
      break;
    default:
      return localStorage.getItem(name);
  }
}

function updateClock() {
  var clockShowTime = getSetting('clockShowTime');
  var clockShowDate = getSetting('clockShowDate');

  var date = moment();

  if (clockShowTime == true) {
    var t = getElement('clock-time');
    t.innerHTML = date.format('HH : mm : ss');
  }

  if (clockShowDate == true) {
    var d = getElement('clock-date');
    d.innerHTML = date.format(chrome.i18n.getMessage('datePattern'));
  }
}

document.addEventListener('DOMContentLoaded', function() {
  var title = getElements('title')[0];
  var body = getElements('body')[0];

  title.innerHTML = chrome.i18n.getMessage('title');

  body.ondragenter = function() {
    document.querySelector('body').setAttribute('class', 'enter');
  };

  body.ondragleave = function() {
    document.querySelector('body').setAttribute('class', '');
  };

  body.ondragover = function(e) {
    e.preventDefault();
  };

  body.ondrop = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var imageReader = new FileReader();
    imageReader.onload = (function(e) {
      var dataUri = e.target.result;
      localStorage.setItem('background', e.target.result);
      document.querySelector('body').style.backgroundImage = 'url(' + e.target.result + ')';
    });
    imageReader.readAsDataURL(file);
    body.setAttribute('class', '');
  };

  var background = localStorage.getItem('background');
  var backgroundColor = localStorage.getItem('backgroundColor');
  if (background) {
    body.style.backgroundImage = 'url(' + background + ')';
  }
  else if (backgroundColor) {
    body.style.backgroundColor = backgroundColor;
  }

  var clockShow = getSetting('clockShow');
  var clockShowTime = getSetting('clockShowTime');
  var clockShowDate = getSetting('clockShowDate');

  if (clockShow == true) {
    var clockX = getSetting('clockX');
    var clockY = getSetting('clockY');
    var clockColor = getSetting('clockColor');

    clock = document.createElement('div');
    clock.setAttribute('id', 'clock');

    if (clockShowTime == true) {
      var clockTime = document.createElement('h2');
      clockTime.setAttribute('id', 'clock-time');
      clock.appendChild(clockTime);
    }

    if (clockShowDate == true) {
      var clockDate = document.createElement('h3');
      clockDate.setAttribute('id', 'clock-date');
      clock.appendChild(clockDate);
    }

    body.appendChild(clock);

    if (clockX && clockY) {
      clock.style.marginLeft = 0;
      clock.style.marginTop = 0;
      clock.style.left = clockX + 'px';
      clock.style.top = clockY + 'px';
    }

    if (clockColor) {
      clock.style.color = clockColor;
    }

    clock.ondragstart = function(e) { e.preventDefault(); };

    clock.onmousedown = function(e) {
      var dx = e.pageX - clock.offsetLeft;
      var dy = e.pageY - clock.offsetTop;

      document.onmousemove = function(e) {
        var x = e.pageX - dx;
        var y = e.pageY - dy ;

        clock.style.left = x + 'px';
        clock.style.top = y + 'px';
        localStorage.setItem('clockX', x);
        localStorage.setItem('clockY', y);
      };

      this.onmouseup = function() {
        document.onmousemove = null;
      };
    };

    updateClock();
    setInterval(updateClock, 1000);
  }
});
