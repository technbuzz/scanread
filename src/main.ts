import './style.css'
import { createWorker } from 'tesseract.js'

const fileEl = document.querySelectorAll<HTMLInputElement>('input[type=file]')
const outputEl = document.querySelector<HTMLOutputElement>('output')
let fileToScan: File

fileEl.forEach(el => {
  el.addEventListener('change', processFile)
})

function processFile(event: Event) {
  const eventTarget = (event.target as HTMLInputElement).files!
  for (const file of eventTarget) {
    console.log(file)

    const img = document.createElement('img')
    // @ts-ignore
    img.file = file
    fileToScan = file
    outputEl?.appendChild(img)

    const reader = new FileReader()
    reader.onload = (e) => {
    // @ts-ignore
      img.src = e.target.result
      
    }
    reader.readAsDataURL(file)
  }
}

let textToRead !: string
const scanEl = document.querySelector<HTMLButtonElement>('.scan')
scanEl?.addEventListener('click', async () => {
  const worker = await createWorker('eng', 1, {
    logger: m => console.log(m),
  })

  const { data } = await worker.recognize(fileToScan)
  
  document.querySelector<HTMLDivElement>('.text')!.innerHTML = data.text
  textToRead = data.text
  console.log(data.text)
})


const speakEl = document.querySelector<HTMLButtonElement>('.speak')
speakEl?.addEventListener('click', () => {
  const synth = window.speechSynthesis
  const utterThis = new SpeechSynthesisUtterance(textToRead)
  synth.speak(utterThis)
})

//document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//  <div>
//    <a href="https://vite.dev" target="_blank">
//      <img src="${viteLogo}" class="logo" alt="Vite logo" />
//    </a>
//    <a href="https://www.typescriptlang.org/" target="_blank">
//      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//    </a>
//    <h1>Vite + TypeScript</h1>
//    <div class="card">
//      <button id="counter" type="button"></button>
//    </div>
//    <p class="read-the-docs">
//      Click on the Vite and TypeScript logos to learn more
//    </p>
//  </div>
//`
//
//setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
