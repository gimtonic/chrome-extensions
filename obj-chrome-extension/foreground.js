// console.log('from foreground')
// document.querySelector('#hplogo').classList.add('spin')

const first = document.createElement('button');
first.innerText = "SET DATA";
first.id = "first";

const second = document.createElement('button');
second.innerText = "SHOUTOUT TO BACKEND";
second.id = "second";

document.querySelector('body').appendChild(first)
document.querySelector('body').appendChild(second)

first.addEventListener('click', () => {
    // chrome.storage.sync
    chrome.storage.local.set({"password": "123"})
    console.log("I SET DATA")
})

second.addEventListener('click', () => {
    chrome.runtime.sendMessage({message: "yo check the storage"})
    console.log("I SEND MESSAGE")
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   console.log(request.message) 

})