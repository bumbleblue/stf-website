document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('#swap-words') ) {
      var swap = new Vue({
        el: document.querySelector('#swap-words'),
        data: {
          baseUrl: 'words.json',
          words: [],
          current_word: 'Foundational Tech',
          next_word: 'Foundational Tech',
          display_text: 'Foundational Tech',
          counter: 1,
          counter_stay: 20,
          scramble_counter: 0,
          scramble_stay: 30, // allow for more time for longer words
          stringset: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?@#$%&*{}<>[]',
        },
        methods: {
          scrambleText() {
            let strs = this.stringset.split('');
            return this.display_text.split('')
              .map(x => strs[Math.floor(Math.random()*strs.length)] )
              .join("");
          },
          newWord() {
            this.current_word = this.next_word;
            let idx = Math.floor(Math.random()*this.words.length);
            this.next_word = this.words[idx];
            this.display_text = this.current_word;
          },
          increaseDecreaseLetters() {
            if (this.display_text.length < this.next_word.length) {
              this.display_text = this.display_text + 'x';
            } else if (this.display_text.length > this.next_word.length) {
              this.display_text = this.display_text.substring(0, this.display_text.length -1);
            }
          },
          onCaroussel () {
            if (this.counter == 0) {
              this.newWord();
              this.counter += 1;
            } else if (this.counter > this.counter_stay) { // main wait time
              this.increaseDecreaseLetters();
  
              this.scramble_counter += 1;
              this.counter += 1;
              this.display_text = this.scrambleText();
  
              if (this.scramble_counter == this.scramble_stay // ensure there is at least a bit of scramble
                  && this.display_text.length == this.next_word.length) {
                this.counter = 0;
                this.scramble_counter = 0;
              }
            } else {
              this.counter += 1;
            }
          }
        },
        computed: {},
        template: `
                  <span class="container">
                    {{ this.display_text }}
                  </span>`,
        mounted: function () {
          fetch(this.baseUrl).then((response) => {
            return response.json();
          }).then((data) => {
            this.words = data.reverse();
            this.newWord();
            this.display_text = 'Foundational Tech';
            this.onCaroussel();
            setInterval(this.onCaroussel, 100);
          })
        }
      })
    }
  });
  