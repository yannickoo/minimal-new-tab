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

document.addEventListener('DOMContentLoaded', function() {
  var clockShow = document.querySelector('#clock-show');
  var clockShowSetting = getSetting('clockShow');

  var clockShowTimeWrapper = document.querySelector('#clock-show-time-wrapper');
  var clockShowTime = document.querySelector('#clock-show-time');
  var clockShowTimeSetting = getSetting('clockShowTime');

  var clockShowDateWrapper = document.querySelector('#clock-show-date-wrapper');
  var clockShowDate = document.querySelector('#clock-show-date');
  var clockShowDateSetting = getSetting('clockShowDate');

  var clockColorWrapper = document.querySelector('#clock-color-wrapper');
  var clockColor = document.querySelector('#clock-color');
  var clockColorSetting = getSetting('clockColor');

  var backgroundColor = document.querySelector('#background-color');
  var backgroundColorSetting = getSetting('backgroundColor');

  var backgroundImageSetting = getSetting('background');
  var backgroundImageWrapper = document.querySelector('#background-image-wrapper');
  var backgroundImage = document.querySelector('#background-image');

  clockShowTimeWrapper.style.display = 'none';
  clockShowDateWrapper.style.display = 'none';

  if (clockShowSetting == true) {
    clockShow.checked = 'checked';
    clockShowTimeWrapper.style.display = 'block';
    clockShowDateWrapper.style.display = 'block';
  }

  if (clockShowTimeSetting == true) {
    clockShowTime.checked = 'checked';
  }

  if (clockShowDateSetting == true) {
    clockShowDate.checked = 'checked';
  }

  clockShow.onchange = function() {
    if (this.checked) {
      localStorage.setItem('clockShow', 1);
      clockShowTimeWrapper.style.display = 'block';
      clockShowDateWrapper.style.display = 'block';
      clockColorWrapper.style.display = 'block';
    }
    else {
      localStorage.setItem('clockShow', 0);
      clockShowTimeWrapper.style.display = 'none';
      clockShowDateWrapper.style.display = 'none';
      clockColorWrapper.style.display = 'none';
    }
  };

  clockShowTime.onchange = function() {
    if (this.checked) {
      localStorage.setItem('clockShowTime', 1);
    }
    else {
      localStorage.setItem('clockShowTime', 0);
      if (!clockShowDate.checked) {
        localStorage.setItem('clockShow', 0);
        clockShow.checked = false;
        clockShow.onchange();
      }
    }
  };

  clockShowDate.onchange = function() {
    if (this.checked) {
      localStorage.setItem('clockShowDate', 1);
    }
    else {
      localStorage.setItem('clockShowDate', 0);
      if (!clockShowTime.checked) {
        localStorage.setItem('clockShow', 0);
        clockShow.checked = false;
        clockShow.onchange();
      }
    }
  };

  clockColor.value = clockColorSetting;
  backgroundColor.value = backgroundColorSetting;

  clockColor.onchange = function() {
    localStorage.setItem('clockColor', this.value);
  };

  backgroundColor.onchange = function() {
    localStorage.setItem('backgroundColor', this.value);
  };

  if (backgroundImageSetting) {
    document.querySelector('#background-color-wrapper').style.display = 'none';
    document.querySelector('#background-image').setAttribute('src', backgroundImageSetting);
  }
  else {
    backgroundImageWrapper.setAttribute('class', 'empty');
  }

  backgroundImageWrapper.ondragenter = function() {
    backgroundImageWrapper.setAttribute('class', 'enter');
  };

  backgroundImageWrapper.ondragleave = function() {
    backgroundImageWrapper.setAttribute('class', '');
  };

  backgroundImageWrapper.ondragover = function(e) {
    e.preventDefault();
  };

  backgroundImageWrapper.ondrop = function(e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var imageReader = new FileReader();
    imageReader.onload = (function(e) {
      var dataUri = e.target.result;
      localStorage.setItem('background', dataUri);
      backgroundImage.setAttribute('src', dataUri);
      backgroundImageWrapper.setAttribute('class', '');
      document.querySelector('#background-color-wrapper').style.display = 'none';
    });
    imageReader.readAsDataURL(file);
  };

  backgroundImageWrapper.onclick = function() {
    if (backgroundImage.src && confirm(chrome.i18n.getMessage('removeBackground'))) {
      localStorage.removeItem('background');
      backgroundImageWrapper.setAttribute('class', 'empty');
      backgroundImageWrapper.removeChild(backgroundImage);
      document.querySelector('#background-color-wrapper').style.display = 'block';
    }
  };
});
