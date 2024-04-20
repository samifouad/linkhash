export default function (content, className) {
    const output = document.querySelector("#output")
  
    if (!content) return;
  
    output.innerHTML = `<pre class="${className}">${content}</pre>`;
}