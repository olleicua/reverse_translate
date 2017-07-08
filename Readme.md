Reverse Translator
====

This is a tool I made for helping me learn new languages. I find duolingo etc
tend to feel a bit underwhelming to me given that the hardest part of language
acquisition without immersion for me seems to be building up my vocabulary while
becoming familiar with the syntactic differences between my native language and
the language I'm learning.

This tool uses the
[Google Translate API](https://cloud.google.com/translate/docs/reference/translate)
to translate sentences using both the Neural Machine Translation (NMT) model and
the Phrase-Based Machine Translation (PBMT) model and then translate all of the
words in the result back to the original language. This way I can quickly answer
a practical question like, how do I say this thing? at the same time as I learn
what each individual word means given that word order is likely to differ from
what I expect.

I may add more features like translating results back and forth until I have a
stable matching word.

Usage
----

Unfortunately the Google Translate API requires a key so to use this you will
need to generate your own key (theoretically this is free but they may charge
you if you use it enough) and put it in `js/key.js` like so:

```javascript
window.Translator = window.Translator || {};
window.Translator.ApiKey = 'API_KEY';
```
