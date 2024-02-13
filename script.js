
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
        if(this.target_text[this.writing_index] === key && this.writing_index == 0){
            this.start_time = Date.now()
            this.started = true
        }
        if(this.target_text[this.writing_index] === key) this.writing_index++
        else if(!this.error_indexes.includes[this.writing_index]) this.error_indexes.push(this.writing_index)
        this.update_container()
        if(this.writing_index === this.target_text.length) return 1
        return 0
    }
    update_container(){
        let div = document.getElementById('text-container')
        div.innerHTML = `<span class="active">`
        for(let i = 0 ; i < this.writing_index ; i++){
            if(!this.error_indexes.includes(i)) div.innerHTML += this.target_text[i]
            else div.innerHTML += `<span class="error">${this.target_text[i]}</span>`
        }
        div.innerHTML += `</span><span class="cursor"></span><span class="inactive">${this.target_text.slice(this.writing_index, this.target_text.length)}</span>`
    }
}

function random_sentence(){ // temp
    return "the quick brown fox jumps over the lazy dog".slice(0, Math.floor(Math.random()*20+5))
}

let current_sentence = new sentence(random_sentence());

document.addEventListener('keydown', (event)=>{
    let response = current_sentence.key_press(event.key)
    if(response === 1){
        let time_ms = Date.now() - current_sentence.start_time
        let time_m = time_ms / 1000 / 60
        let n_words = current_sentence.target_text.length / 5
        let wpm = n_words / time_m
        let acc = (current_sentence.target_text.length - current_sentence.error_indexes.length) / current_sentence.target_text.length * 100
        console.table({time_ms, time_m, n_words, wpm, acc})
        document.getElementById('wpm-val').innerText = Math.floor(wpm*10)/10+'wpm'
        document.getElementById('acc-val').innerText = Math.floor(acc)+'%'
        document.getElementById('time-val').innerText = Math.floor(time_ms/10)/100+'s'
        current_sentence = new sentence(random_sentence())
    }
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