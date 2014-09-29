(function($) {
  
  NodeList.prototype.forEach = Array.prototype.forEach;
  NodeList.prototype.querySelectorAll = function(selector) {
    var _nodes = document.createDocumentFragment();
    this.forEach(function(node) {
      node.querySelectorAll(selector).forEach(function(el) {
        _nodes.appendChild(el);
      });
    });
    return _nodes.childNodes;
  };

  Kerning.attach('[data-kerning]');

  module('No option', {
    setup: function() {
      this.h1 = document.querySelectorAll('h1');
      this.h1_text = this.h1.textContent;
      this.h2 = document.querySelectorAll('h2');
      return this.h2_text = this.h2.textContent;
    }
  });
  test('is chainable', 2, function() {
    strictEqual(Kerning(this.h1), this.h1);
    return strictEqual(Kerning(this.h2), this.h2);
  });
  test('元のテキストと同じように読める', 2, function() {
    strictEqual(Kerning(this.h1).textContent, this.h1_text);
    return strictEqual(Kerning(this.h2).textContent, this.h2_text);
  });
  test('オプションなしの場合、約物のみカーニングされる', 2, function() {
    strictEqual(Kerning(this.h1).querySelectorAll('[data-kerned]').length, 2);
    return strictEqual(Kerning(this.h2).querySelectorAll('[data-kerned]').length, 0);
  });
  module('With option', {
    setup: function() {
      this.h1 = document.querySelectorAll('h1');
      this.h2 = document.querySelectorAll('h2');
      this.h3 = document.querySelectorAll('h3');
      return this.kerningdata = {
        kerning: {
          "あ": [-0.1, -0.1],
          "い": [-0.1, -0.08],
          "う": [-0.13, -0.16],
          "え": [-0.1, -0.07],
          "お": [-0.09, -0.04]
        }
      };
    }
  });
  test('オプションでカーニングデータを指定できる', 3, function() {
    strictEqual(Kerning(this.h1, {
      data: this.kerningdata
    }).querySelectorAll('[data-kerned]').length, 0);
    strictEqual(Kerning(this.h2, {
      data: this.kerningdata
    }).querySelectorAll('[data-kerned]').length, 1);
    return strictEqual(Kerning(this.h3, {
      data: this.kerningdata
    }).querySelectorAll('[data-kerned]').length, 5);
  });
  module('With option async', {
    setup: function() {
      return this.el = document.getElementById('paragraph');
    }
  });
  asyncTest('jsonファイルを読み込んで使える', 1, function() {
    var target;
    target = this.el;
    return Kerning.getJSON('../data/mplus-2m-regular.json', function(_data) {
      start();
      return strictEqual(Kerning(target, {
        data: _data
      }).querySelectorAll('[data-kerned]').length, 14);
    });
  });
  module('Destroy', {
    setup: function() {
      this.el = document.getElementById('paragraph');
      this.el_clone = this.el.cloneNode(true);
      this.el.parentNode.insertBefore(this.el_clone, this.el.nextSibling);
    },
    teardown: function() {
      return this.el_clone.parentNode.removeChild(this.el_clone);
    }
  });
  test('kening後は、元のhtmlと一致しない', 1, function() {
    return notStrictEqual(this.el.innerHTML, Kerning(this.el_clone).innerHTML);
  });
  test('destroy後は、元のhtmlと一致する', 1, function() {
    return strictEqual(this.el.innerHTML, Kerning(this.el_clone, 'destroy').innerHTML);
  });
  module('Repeat kerning', {
    setup: function() {
      this.el = document.getElementById('paragraph');
      this.el_clone = this.el.cloneNode(true);
      this.el.parentNode.insertBefore(this.el_clone, this.el.nextSibling);
    },
    teardown: function() {
      return this.el_clone.parentNode.removeChild(this.el_clone);
    }
  });
  test('1回と2回を比較', 1, function() {
    return strictEqual(Kerning(this.el).innerHTML, Kerning(Kerning(this.el_clone)).innerHTML);
  });
  test('1回と3回を比較', 1, function() {
    return strictEqual(Kerning(this.el).innerHTML, Kerning(Kerning(Kerning(this.el_clone))).innerHTML);
  });
  test('1回と4回を比較', 1, function() {
    return strictEqual(Kerning(this.el).innerHTML, Kerning(Kerning(Kerning(Kerning(this.el_clone)))).innerHTML);
  });
  module('Deep Extending', {
    setup: function() {
      this.el = document.getElementById('deep_extend');
      Kerning(this.el, 'destroy');
      return this.dataset = {
        kerning: {
          "あ": [-0.1, -0.1]
        }
      };
    },
    teardown: function() {
      return Kerning(this.el, 'destroy');
    }
  });
  test('デフォルトでは、約物のみカーニングされる', 2, function() {
    strictEqual(Kerning(this.el).querySelectorAll('[data-kerned]').length, 1);
    return strictEqual(this.el.querySelector('[data-kerned]').textContent, '。');
  });
  test('deep_extendingをセットせずにカーニングデータを指定した場合は、約物がカーニングされない', 2, function() {
    strictEqual(Kerning(this.el, {
      data: this.dataset
    }).querySelectorAll('[data-kerned]').length, 1);
    return strictEqual(this.el.querySelector('[data-kerned]').innerHTML, 'あ');
  });
  test('deep_extendingをtrueにセットしてカーニングデータを指定した場合も、約物がカーニングされる', 3, function() {
    strictEqual(Kerning(this.el, {
      data: this.dataset
    }, true).querySelectorAll('[data-kerned]').length, 2);
    strictEqual(this.el.querySelector('[data-kerned]').innerHTML, 'あ');
    return strictEqual(this.el.querySelectorAll('[data-kerned]')[1].innerHTML, '。');
  });
  module('Involve getJSON', {
    setup: function() {
      return this.el = document.getElementById('paragraph');
    }
  });
  asyncTest('第２引数にjsonファイルへのパスを指定できる', 1, function() {
    var target;
    target = this.el;
    Kerning(target, '../data/mplus-2m-regular.json');
    return setTimeout(function() {
      start();
      return strictEqual(target.querySelectorAll('[data-kerned]').length, 14);
    }, 2000);
  });
  module('data属性でも同じ設定ができる');
  asyncTest('[data-kerning]', 2, function() {
    var el, el_clone, timeoutID;
    el = document.getElementById('data_attr');
    el_clone = el.cloneNode(true);
    el_clone.removeAttribute('data-kerning');
    el_clone.innerHTML = el.textContent;
    el.parentNode.insertBefore(el_clone, el.nextSibling);
    
    Kerning(el_clone);
    return timeoutID = window.setInterval(function() {
      if (el.childNodes.length && el_clone.childNodes.length) {
        ok(true, 'DOM has appended.');
        window.clearTimeout(timeoutID);
        start();
        return strictEqual(el.innerHTML, el_clone.innerHTML);
      }
    }, 100);
  });

  return asyncTest('[data-kerning="{data:_data}"]', 2, function() {
    var el, el_clone, json, timeoutID;
    el = document.getElementById('data_attr_json');
    json = Kerning.parseJSON(el.dataset.kerning);
    el_clone = el.cloneNode(true);
    el_clone.removeAttribute('data-kerning');
    el_clone.innerHTML = el.textContent;
    el.parentNode.insertBefore(el_clone, el.nextSibling);
    Kerning(el_clone, {
      data: json.data
    });
    return timeoutID = window.setInterval(function() {
      if (el.childNodes.length && el_clone.childNodes.length) {
        ok(true, 'DOM has appended.');
        window.clearTimeout(timeoutID);
        start();
        return strictEqual(el.innerHTML, el_clone.innerHTML);
      }
    }, 1000);
  });
})(jQuery);

