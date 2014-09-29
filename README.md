# kerning-ja.js

A kerning library specific with Japanese webfont.
kerning-ja.js rewrites <a href="http://karappoinc.github.io/jquery.kerning.js/" target="_blank">jQuery.Kerning.js</a> without jQuery.


## Getting Started

Download [the compressed version](https://raw.github.com/yuukichi/kerning-ja.js/master/dist/kerning-ja.min.js) or [the normal version](https://raw.github.com/yuukichi/kerning-ja.js/master/dist/kerning-ja.js).

In your web page:

```html
<h1>美しい文字</h1>

<script src="kerning-ja.js"></script>
<script>
  Kerning.attach('h1', 'kerning-data.json');
</script>
```

## Browser Support

| InternetExplorer | Chrome | Firefox | Safari | Opera |
|------------------|--------|---------|--------|-------|
| 9+               | ○      | ○       | ○      | ○     |
