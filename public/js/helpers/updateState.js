import { default as updateUrl } from './updateUrl.js'
import { default as encodeForUrl } from './encodeForUrl.js' 

export default function (code) {
    const codeHash = encodeForUrl(code)
    updateUrl(codeHash)
    console.log(code) // debug
    console.log(codeHash) // debug
}