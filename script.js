let desired_string = "the quick brown fox jumps over the lazy dog";
let current_string = ""
let text_container = document.getElementById('text-container')

function add_key(desired_string, current_string, text_container, key){
    current_string = current_string + key
    current_string = current_string.replace(/\s+/g, ' ')
    text_container.innerText = current_string
    text_container.innerHTML += `<div class="cursor"></div>`
    return current_string
}
function sub_key(current_string, text_container){
    current_string = current_string.slice(0,-1)
    text_container.innerText = current_string
    text_container.innerHTML += `<div class="cursor"></div>`
    return current_string
}

document.addEventListener('keydown', (event)=>{
    if(event.key.length == 1) current_string = add_key(desired_string, current_string, text_container, event.key)
    if(event.key == 'Backspace') current_string = sub_key(current_string, text_container)
    console.log(current_string)
})