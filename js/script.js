window.Translator = window.Translator || {};

(function() {


  Translator.init = function () {
    var that = this;

    this.q = document.querySelector('.controls input.q');
    this.from = document.querySelector('.controls input.from');
    this.to = document.querySelector('.controls input.to');
    this.button = document.querySelector('.controls button');
    this.output = document.querySelector('.output');

    this.q.focus();

    this.q.addEventListener('change', function() { that.translate(); });
    this.from.addEventListener('change', function() { that.translate(); });
    this.to.addEventListener('change', function() { that.translate(); });
    this.button.addEventListener('click', function() { that.translate(); });
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
      var model = models[i][0];
      var label = models[i][1];

      this.output.appendChild(
        this.newOutputBox(
          label,
          this.q.value,
          this.from.value,
          this.to.value,
          model,
          function(translation, box) {
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

    result.innerHTML = '...';
    this.apiCall(q, from, to, model, function(response) {
      var translation = response.data.translations[0].translatedText;
      result.innerHTML = q + ' -> ' + translation;
      if (callback) callback(translation, box);
    });

    return box;
  }

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
