export default function (content, className) {
    const output = document.querySelector("#output")

    if (!content) return;

    // Use DOM manipulation instead of innerHTML to prevent XSS
    const pre = document.createElement('pre');
    if (className) {
        pre.className = className;
    }
    pre.textContent = content;
    output.innerHTML = ''; // Clear existing content
    output.appendChild(pre);
}