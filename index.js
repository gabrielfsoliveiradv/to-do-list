const form = document.getElementById("form")
if (localStorage.getItem("tasks") == null) {
    localStorage.setItem("tasks", JSON.stringify([]))
}
let tasks = JSON.parse(localStorage.getItem("tasks"))

form.addEventListener("submit", (ev) => {
    ev.preventDefault()
    let input_text = ev.currentTarget.children["inp-new-list-item"]
    tasks.push(createNewTask(input_text.value))
    input_text.value = null
    updateList()
})

function updateList() {
    let ul = document.getElementById("ul-tasks")

    ul.innerText = ""
    tasks.forEach((task) => {
        let li = createCompleteLi(task)
        ul.append(li)
    })

    updateLocalStorage()

    if (ul.innerText == "") {
        ul.style.border = "none"
    } else {
        ul.style.border = "3px solid var(--purple)"
    }
}

function editParagraph(ev) {
    let key = ev.currentTarget.dataset.key
    let p = document.querySelector(`p[data-key="${key}"]`)
    p.contentEditable = true
    p.focus()
    let range = document.createRange()
    range.selectNodeContents(p)
    range.collapse(false)
    let selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    p.addEventListener("blur", editText)
}

function editText(ev) {
    tasks.forEach((task) => {
        if (task.key == ev.currentTarget.dataset.key) {
            task.text = ev.currentTarget.innerText
        }
    })

    updateList()
}

function concludeTask(ev) {
    let key = ev.currentTarget.dataset.key

    tasks = tasks.filter((task) => task.key != key)
    updateList()
}

function updateLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function createCompleteLi(task) {
    let paragraph = document.createElement("p")
    paragraph.innerText = task.text
    paragraph.dataset.key = task.key

    let div_buttons = document.createElement("div")
    div_buttons.classList.add("buttons")

    let btn_edit = document.createElement("button")
    btn_edit.classList.add("icon-pencil", "btn-edit")
    btn_edit.dataset.key = task.key
    btn_edit.addEventListener("click", editParagraph)

    let btn_conclude = document.createElement("button")
    btn_conclude.classList.add("icon-checkmark", "btn-conclude")
    btn_conclude.dataset.key = task.key
    btn_conclude.addEventListener("click", concludeTask)

    div_buttons.append(btn_edit, btn_conclude)

    let li = document.createElement("li")
    li.append(paragraph, div_buttons)

    return li
}

function createNewTask(text) {
    return {
        text,
        key: new Date().toGMTString(),
    }
}

updateList()
