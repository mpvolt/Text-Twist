function genericGetRequest(URL, callback){
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (this.status == 200) {
            callback(JSON.parse(this.response));
        }
    };
    xhr.open("GET", URL);
    xhr.send();
};

var TextTwist = function() {
    var self = this;
    var words;
    var rack;
    var rackButtons;
    var guess;
    var wordsRemaining;
    
    this.showGuess = function() {
        document.getElementById('guess').textContent = this.guess;
    };
    
    this.finish = function() {
        document.getElementById('rack').innerHTML = '<h2>You won!</h2>';
        document.getElementById('div-guess').innerHTML = '';
    }
    
    this.reset = function() {
        this.guess = '';
        for (var i = 0; i < this.rackButtons.length; i++) {
            this.rackButtons[i].disabled = false;
        }
        this.showGuess();
        setTimeout(function(){
            var divRes = document.getElementById('guess-result');
            divRes.textContent = '';
            divRes.classList.remove('bg-success');
            divRes.classList.remove('bg-danger');
        }, 2000);
    };
    
    this.check = function() {
        var length = this.words.length,
            found = false,
            msg,
            msgClass;
        for (var i = 0; i < length; i++) {
            if (this.words[i] != null && this.guess == this.words[i]) {
                this.words[i] = null;
                found = true;
                break;
            }
        }
        if (found) {
            if (this.wordsRemaining == 1) {
                this.finish();
                return;
            }
            msg = 'Correct!';
            msgClass = 'bg-success';
            this.wordsRemaining--;
            document.getElementById('words-remaining').textContent = this.wordsRemaining;
        } else {
            msg = 'This word is not in the list.';
            msgClass = 'bg-danger';
        }
        var divRes = document.getElementById('guess-result');
        divRes.textContent = msg;
        divRes.classList.toggle(msgClass);
        this.reset();
    }
    
    this.play = function() {
        document.getElementById('div-guess').style.display = 'block';
        this.guess = '';
        for (var i = 0; i < this.rackButtons.length; i++) {
            this.rackButtons[i].addEventListener('click', function(){
                self.guess += this.getAttribute('data-letter');
                this.disabled = true;
                self.showGuess();
            });
        }
        document.getElementById('btn-guess').addEventListener('click', function(){
            self.check();
        });
    };
    
    this.processResult = function(res) {
        document.getElementById("div-btn-start").style.display = 'none';
        self.words = res.words;
        self.wordsRemaining = res.words.length;
        document.getElementById('words-remaining').textContent = self.wordsRemaining;
        self.rack = res.letters;
        var letters = self.rack.split('');
        var html = 'YOUR RACK:<br>';
        for (var i = 0; i < letters.length; i++) {
            html += '<button class="btn btn-primary rack-button" data-letter="' + letters[i] + '">' + letters[i] + '</button>';
        }
        document.getElementById("rack").innerHTML = html;
        self.rackButtons = document.querySelectorAll('.rack-button');
        self.play();
    };
    
    this.init = function() {
        document.getElementById("start").addEventListener('click', function(){
            this.disabled = true;
            this.textContent = 'Loading...';
            genericGetRequest("word.php", self.processResult);
        });
    };
    
    this.init();
}

new TextTwist();