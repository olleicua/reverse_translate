window.Translator = window.Translator || {};

(function() {


  Translator.init = function () {
    var that = this;

    this.q = document.querySelector('.controls input.q');
    this.from = document.querySelector('.controls input.from');
    this.to = document.querySelector('.controls input.to');
    this.swapButton = document.querySelector('.controls .swap');
    this.translateButton = document.querySelector('.controls .translate');
    this.output = document.querySelector('.output');

    this.q.focus();

    this.q.addEventListener('change', function() { that.translate(); });
    this.from.addEventListener('change', function() { that.translate(); });
    this.to.addEventListener('change', function() { that.translate(); });

    this.translateButton.addEventListener('click', function() {
      that.translate();
    });

    this.swapButton.addEventListener('click', function() {
      var tmp = that.to.value;
      that.to.value = that.from.value;
      that.from.value = tmp;
      that.q.value = that.mostRecentTranslation

      that.translate();
    });
  };

  Translator.translate = function() {
    var that = this;

    var requiredFields = [this.q, this.from, this.to];
    for (var i = 0; i < requiredFields.length; i++) {
      if (requiredFields[i].value.length === 0) {
        requiredFields[i].focus();
        return;
      }
    }

    this.output.innerHTML = '';

    var models = [
      ['nmt', 'Neural Machine Translation'],
      ['base', 'Phrase-Based Machine Translation']
    ];

    for (var i = 0; i < models.length; i++) {
      (function(model, label) {

        that.output.appendChild(
          that.newOutputBox(
            label,
            that.q.value,
            that.from.value,
            that.to.value,
            model,
            function(translation, box) {

              // store nmt for swapping purposes
              if (model === 'nmt') that.mostRecentTranslation = translation;

              var words = translation.split(' ');
              for (var i = 0; i < words.length; i++) {
                box.appendChild(
                  that.newOutputBox(
                    null,
                    words[i],
                    that.to.value,
                    that.from.value,
                    model
                  )
                );
              }
            }
          )
        );
      }).apply(that, models[i]);
    }

    this.q.focus();
  };

  Translator.newOutputBox = function(label, q, from, to, model, callback) {
    var box = document.createElement('div');
    box.className = 'output-box';

    if (label) {
      var labelBox = document.createElement('div');
      labelBox.className = 'label';
      labelBox.innerHTML = label
      box.appendChild(labelBox);
    }

    var result = document.createElement('div');
    result.className = 'result';
    box.appendChild(result);

    // TODO: swapping back and forth
    //var continueButton = document.createElement('button');
    //continueButton = 

    result.innerHTML = '...';
    this.apiCall(q, from, to, model, function(response) {
      result.innerHTML = '';
      for (var i = 0; i < response.data.translations.length; i++) {
        result.innerHTML += q + ' <span class="arrow"></span> ' +
          response.data.translations[i].translatedText + '<br />';
      }
      if (callback) callback(response.data.translations[0].translatedText, box);
    });

    return box;
  };

  Translator.apiCall = function(q, from, to, model, callback) {
    var params =
      'q=' + encodeURI(q) +
      '&target=' + encodeURI(to) +
      '&source=' + encodeURI(from) +
      '&model=' + encodeURI(model) +
      '&key=' + encodeURI(this.ApiKey);

    var request = new XMLHttpRequest();
    request.open(
      'POST',
      'https://translation.googleapis.com/language/translate/v2?' + params,
      true
    );
    request.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );
    request.send();

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        callback(JSON.parse(request.responseText))
      } else {
        console.error('API error:', request);
      }
    };
  };

  Translator.init();

})();
