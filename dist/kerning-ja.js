/*! kerning-ja.js - v0.1.0 - 2014-09-30
* https://github.com/kerning-ja.js
* Copyright (c) 2014 Karappo Inc; Licensed MIT */
'use strict';
(function(global, d) {

  var merge = function(left, right) {
    var obj = {};
    for (var attrName in left) {
      obj[attrName] = left[attrName];
    }
    for (var attrName in right) {
      obj[attrName] = right[attrName];
    }
    return obj;
  };

  var mergeRecursive = (function() {
    var isArray, isObject, isScalar, merge, mergeArray, mergeObject, _type,
      __slice = [].slice;

    _type = Object.prototype.toString;

    isScalar = function(variable) {
      var _ref;
      return ((_ref = _type.call(variable)) !== '[object Array]' && _ref !== '[object Object]') || variable === null;
    };

    isObject = function(variable) {
      return variable !== null && _type.call(variable) === '[object Object]';
    };

    isArray = function(variable) {
      return _type.call(variable) === '[object Array]';
    };

    merge = function(left, right) {
      var leftType, rightType;
      if (isScalar(left) || isScalar(right)) {
        throw new Error('Can not merge scalar objects.');
      }
      leftType = _type.call(left);
      rightType = _type.call(right);
      if (leftType !== rightType) {
        throw new Error('Can not merge ' + leftType + ' with ' + rightType + '.');
      }
      switch (leftType) {
        case '[object Array]':
          return mergeArray(left, right);
        case '[object Object]':
          return mergeObject(left, right);
        default:
          throw new Error('Can not merge ' + leftType + ' objects.');
      }
    };

    mergeArray = function(left, right) {
      var add, i, leftValue, rightValue, value, _i, _j, _len, _len1;
      add = [];
      for (i = _i = 0, _len = right.length; _i < _len; i = ++_i) {
        rightValue = right[i];
        leftValue = left[i];
        if ((isObject(leftValue) && isObject(rightValue)) || (isArray(leftValue) && isArray(rightValue))) {
          left[i] = merge(leftValue, rightValue);
        } else if (isObject(rightValue)) {
          add.push(merge({}, rightValue));
        } else if (isArray(rightValue)) {
          add.push(merge([], rightValue));
        } else {
          add.push(rightValue);
        }
      }
      for (_j = 0, _len1 = add.length; _j < _len1; _j++) {
        value = add[_j];
        left.push(value);
      }
      return left;
    };

    mergeObject = function(left, right) {
      var key, mergeWith, value;
      for (key in right) {
        value = right[key];
        if (right.hasOwnProperty(key) && (key !== '__proto__')) {
          if (isScalar(value)) {
            if (!left.hasOwnProperty(key)) {
              left[key] = value;
            }
          } else {
            if (left.hasOwnProperty(key)) {
              left[key] = merge(left[key], value);
            } else {
              mergeWith = isObject(value) ? {} : [];
              left[key] = merge(mergeWith, value);
            }
          }
        }
      }
      return left;
    };

    return function() {
      var left, r, right, _i, _len;
      left = arguments[0], right = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = right.length; _i < _len; _i++) {
        r = right[_i];
        left = merge(left, r);
      }
      return left;
    };
  })(this);

  function Kerning(target, config, _extend) {
    if (_extend == null) {
      _extend = false;
    }
    target = typeof target == 'object' ? target : document.querySelectorAll(target);
    if (target.hasOwnProperty('length')) {
      for(var i = 0, iz = target.length; i < iz; i++) {
        Kerning.kerning.call(target[i], config, _extend);
      }
    } else {
      Kerning.kerning.call(target, config, _extend);
    }
    return target;
  }

  Kerning.defaults = {
    removeTags: false,
    removeAnchorTags: false,
    data: {
      kerning: {
        "、": [0, -0.4],
        "。": [0, -0.4],
        "（": [-0.4, 0],
        "）": [0, -0.4],
        "〔": [-0.4, 0],
        "〕": [0, -0.4],
        "［": [-0.4, 0],
        "］": [0, -0.4],
        "｛": [-0.4, 0],
        "｝": [0, -0.4],
        "〈": [-0.4, 0],
        "〉": [0, -0.4],
        "《": [-0.4, 0],
        "》": [0, -0.4],
        "「": [-0.4, 0],
        "」": [0, -0.4],
        "『": [-0.4, 0],
        "』": [0, -0.4],
        "【": [-0.4, 0],
        "】": [0, -0.4],
        "・": [-0.22, -0.22],
        "：": [-0.22, -0.22],
        "；": [-0.22, -0.22],
        "｜": [-0.22, -0.22]
      }
    }
  };

  Kerning.cache = {};

  Kerning.storage = global.hasOwnProperty('sessionStorage') ? sessionStorage : false;
  Kerning.storageKey = 'kerning-ja-%s';

  Kerning.getJSON = function(url, callback, nocache) {
    !nocache && Kerning.loadSessionStorage(url);
    if (!nocache && Kerning.cache.hasOwnProperty(url) && typeof Kerning.cache[url] == 'object') {
      typeof callback == 'function' && callback(Kerning.cache[url]);
      return;
    }
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (req.readyState != 4) return;
      if (req.status == 200 || global.location.href.indexOf('http') == -1) {
        Kerning.cache[url] = Kerning.parseJSON(req.responseText);
        typeof callback == 'function' && callback(Kerning.cache[url]);
      } else {
        throw new Error('An error has occured making the request.');
      }
    };
    req.open('GET', url, true);
    req.send(null);
  };

  Kerning.parseJSON = function(text) {
    var O_o, o_O, obj;
    obj = null;
    try {
      obj = JSON.parse(text);
      return obj;
    } catch (_error) {
      O_o = _error;
      console.log('kerning-ja.js : [WARN] As a result of JSON.parse, a trivial problem has occurred');
    }
    try {
      obj = eval('(' + text + ')');
    } catch (_error) {
      o_O = _error;
      console.error('kerning-ja.js : [ERROR] JSON.parse failed');
      return null;
    }
    return obj;
  };

  Kerning.loadSessionStorage = function(url) {
    if (!Kerning.storage || (Kerning.cache.hasOwnProperty(url) && typeof Kerning.cache[url] == 'object')) {
      return;
    }

    var raw = Kerning.storage.getItem(Kerning.storageKey.replace('%s', encodeURIComponent(url)));
    if (raw && typeof raw == 'string') {
      Kerning.cache[url] = JSON.parse(raw);
    }
  };

  Kerning.saveSessionStorage = function(url, data) {
    if (!Kerning.storage) {
      return;
    }

    Kerning.storage.setItem(Kerning.storageKey.replace('%s', encodeURIComponent(url)), JSON.stringify(data));
  };

  Kerning.kerning = function(config, _extend) {
    var container, content, destroy, kdata, kern, me, options, strArray;
    me = this;
    container = me;
    strArray = me.innerHTML;
    me.kerningBefore = me.kerningBefore || strArray;
    content = '';
    options = kdata = null;

    destroy = function() {
      me.innerHTML = me.kerningBefore;
      return me;
    };

    kern = function(_config) {
      var i, iz;

      function findTextNodes(node) {
        var textNodes = [],
            children = node.childNodes;
        for (var i = 0, iz = children.length; i < iz; i++) {
          var child = children[i];
          if (child.nodeName === "#text") {
            textNodes.push(child);
          } else {
            textNodes = textNodes.concat(findTextNodes(child));
          }
        }
        return textNodes;
      }

      function replaceWithHTML(node, html) {
        var parent = node.parentNode,
            fragment = document.createElement('div');
        fragment.innerHTML = html;
        parent.insertBefore(fragment, node.nextSibling);
        parent.removeChild(node);
        fragment.outerHTML = fragment.innerHTML;
      }

      function kernString(strArray) {
        var i, iz, str, L, R, content = '';
        for (i = 0, iz = strArray.length; i < iz; i++) {
          str = strArray[i];
          L = 0;
          R = 0;
          if (kdata[str]) {
            L = kdata[str][0];
            R = kdata[str][1];

            if (L != 0 || R != 0) {
              content += '<span data-kerned style="display:inline-block;margin-left:' + L + 'em;margin-right:' + R + 'em;">' + str + '</span>';
            } else {
              content += str;
            }
          } else {
            content += str;
          }
        }
        return content;
      }

      function removeTagsExceptAnchor(strArray) {
        return strArray.replace(/<(".*?"|'.*?'|[^'"])*?>/g, function(str) {
          if (str.match(/^<\/?a[\s>]{1}/i)) {
            return str;
          } else {
            return '';
          }
        });
      }

      if (me.querySelectorAll('[data-kerned]').length) {
        destroy();
      }

      if (_extend) {
        options = mergeRecursive({}, Kerning.defaults, _config);
      } else {
        options = merge(Kerning.defaults, _config);
      }

      kdata = options.data.kerning;

      if (options.removeAnchorTags) {
        me.innerHTML = removeTagsExceptAnchor(me.innerHTML);
      } else if (options.removeTags) {
        me.innerHTML = me.textContent;
      }

      var textNodes = findTextNodes(me);
      for(var i = 0, iz = textNodes.length; i < iz; i++) {
        var node = textNodes[i];
        replaceWithHTML(node, kernString(node.nodeValue));
      }

      return me;

    };

    if (typeof config === 'string') {
      if (config === 'destroy') {
        destroy();
        return me;
      } else if (-1 != config.indexOf('.json')) {
        return Kerning.getJSON(config, function(_data) {
          return kern({
            data: _data
          });
        });
      } else {
        console.error('kerning-ja.js : [ERROR] Invalid configure');
        return me;
      }
    } else {
      return kern(config);
    }

  };

  Kerning.attach = function(selector, config) {
    selector = selector || '[data-kerning]';
    global.addEventListener('DOMContentLoaded', function() {
      var _items = typeof selector == 'object' ? selector : d.querySelectorAll(selector);
      for(var i = 0, iz = _items.length; i < iz; i++) {
        var target = _items[i],
            opts = null,
            txt = target.dataset.kerning;
        if (txt) {
          if (0 <= txt.indexOf('{')) {
            opts = Kerning.parseJSON(txt);
          } else {
            opts = txt;
          }
          Kerning(target, opts, target.dataset['kerning-extend']);
        } else if (config) {
          Kerning(target, config);
        } else {
          Kerning(target);
        }
      }
    }, false);
  };

  // Export to global scope
  global.Kerning = Kerning;

})(this, document);
