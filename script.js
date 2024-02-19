const settings = {
    sentence_length: 20,
    skip_mistakes: false,
    punctuation: 0,
    capitalization: 0,
}
const letter_occurence_variable = { // 0: the letter wont show in any word, 1: no effect on occurrence, 2: letter must occur in every word // anything in between is based on chance
    a: 1,
}
const word_end_punctuation = [`,`, `,`, `,`, `.`, `.`, `.`, `?`, `!`, `:`, `;`, `*`, `+`, `-`, `=`, `$`, `%`, `/`, `\\`]
const surrounding_punctuation = [`()`, `{}`, `[]`, `<>`, `""`, `''`, '``']

class sentence{
    constructor(target_text){
        this.target_text = String(target_text)
        this.writing_index = 0
        this.error_indexes = []
        this.start_time = Date.now()
        this.started = false
        this.update_container()
    }
    key_press(key){
        if(key === 'Shift') return 0
        if(key === 'Control') return 0
        if(key === 'Alt') return 0
        if(key === 'Backspace'){
            if(this.error_indexes.includes(this.writing_index)) this.error_indexes.pop()
            else if(this.writing_index > 0) this.writing_index--
            if(this.error_indexes.includes(this.writing_index)) this.error_indexes.pop()
            this.update_container()
            return 0
        }
        if(this.target_text[this.writing_index] === key && this.writing_index == 0){
            this.start_time = Date.now()
            this.started = true
        }
        if(this.target_text[this.writing_index] === key) this.writing_index++
        else if(!this.error_indexes.includes[this.writing_index]){
            this.error_indexes.push(this.writing_index)
            if(settings.skip_mistakes) this.writing_index++
        }
        this.update_container()
        if(this.writing_index === this.target_text.length) return 1
        return 0
    }
    update_container(){
        let div = document.getElementById('text-container')
        div.innerHTML = `<span class="active">`
        for(let i = 0 ; i < this.writing_index ; i++){ // stpid bad
            if(!this.error_indexes.includes(i)) div.innerHTML += this.target_text[i]
            else div.innerHTML += `<span class="error">${this.target_text[i]}</span>`
        }
        div.innerHTML += `</span><span class="cursor"></span><span class="inactive">${this.target_text.slice(this.writing_index, this.target_text.length)}</span>`
    }
}

function word_distribution(){
    return Math.floor(Math.exp(-(Math.random()**2)*10)*5000) 
}
function random_sentence(){
    let new_sentence = []
    let safety_counter = 0
    while(new_sentence.length < settings.sentence_length && safety_counter < 10000){
        let new_word = word_set[word_distribution() % word_set.length]
        let accepted = true
        if(Math.random() < settings.capitalization){
            new_word = new_word[0].toUpperCase() + new_word.slice(1)
        }
        for(let letter of Object.keys(letter_occurence_variable)){
            if(letter_occurence_variable[letter] < 1 && new_word.includes(letter)){
                if(Math.random() > letter_occurence_variable[letter]) accepted = false
            }
            if(letter_occurence_variable[letter] > 1 && !new_word.includes(letter)){
                if(Math.random() < letter_occurence_variable[letter]-1) accepted = false
            }
        }
        if(Math.random() < settings.punctuation){
            if(Math.random()<2/3){
                new_word += word_end_punctuation[Math.floor(Math.random()*word_end_punctuation.length)]
            } else {
                let i = Math.floor(Math.random()*surrounding_punctuation.length)
                new_word = surrounding_punctuation[i][0] + new_word + surrounding_punctuation[i][1]
            }
        }
        if(accepted) new_sentence.push(new_word)
        safety_counter++
    }
    return new_sentence.join(' ')
}

let current_sentence = new sentence(random_sentence());
function reset(){
    let text = current_sentence.target_text
    let time_ms = Date.now() - current_sentence.start_time
    let time_m = time_ms / 1000 / 60
    let letters_written = current_sentence.writing_index
    let words_written = letters_written / 5
    let wpm = words_written / time_m
    let acc = (letters_written - current_sentence.error_indexes.length) / letters_written * 100
    if(letters_written == 0) acc = 0
    console.table({text, time_ms, time_m, letters_written, words_written, wpm, acc})
    document.getElementById('wpm-val').innerText = Math.floor(wpm*10)/10+'wpm'
    document.getElementById('acc-val').innerText = Math.floor(acc)+'%'
    document.getElementById('time-val').innerText = Math.floor(time_ms/10)/100+'s'
    current_sentence = new sentence(random_sentence())
}

document.addEventListener('keydown', (event)=>{
    let response = current_sentence.key_press(event.key)
    if(response === 1) reset()
})

let format_time = time => { // time in ms
    let minutes = Math.floor(time/60000)
    let seconds = Math.floor(time/1000) % 60
    let milliseconds = Math.floor(time % 1000 / 10) 
    minutes = minutes < 10 ? '0'+minutes : minutes
    seconds = seconds < 10 ? '0'+seconds : seconds
    milliseconds = milliseconds < 10 ? '0'+milliseconds : milliseconds
    return `${minutes}:${seconds}.${milliseconds}`
}
setInterval(()=>{
    if(current_sentence.started) document.getElementById('timer').innerHTML = format_time(Date.now() - current_sentence.start_time)
    else document.getElementById('timer').innerHTML = format_time(0)
},60)

console.log('~~~~~~~~~~~~~~')
console.log('change the `settings` variable for more options')
console.table(settings)
console.log('Ctrl+R to reset (will also reset the settings)')
console.log('theres also a way to artifically boost the occurance of letters using letter_occurence_variable')
console.log(letter_occurence_variable)
console.log(`0: the letter wont show in any word, 1: no effect on occurrence, 2: letter must occur in every word // anything in between is based on chance`)
console.log('~~~~~~~~~~~~~~')