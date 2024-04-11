// @ts-nocheck
function hideLoadingSpinner() {
  var spinner = document.getElementById('loading-spinner');
  spinner.style = 'display: none';
}

// select output
const output = document.querySelector("#output")

function appendOutput(content, className) {
  if (!content) return;
  output.innerHTML = `<pre class="${className}">${content}</pre>`;
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Whether the worker is currently working or not, used to avoid sending
// multiple messages to the worker at once.
// This will be true when the worker is compiling and executing the code, but
// this first time it is as the worker is initialising.
let workerWorking = true;
let queuedWork = undefined;
const worker = new Worker("/js/worker.js", { type: "module" });

function sendToWorker(code) {
  if (workerWorking) {
    queuedWork = code;
    return;
  }
  workerWorking = true;
  worker.postMessage(code);
}

worker.onmessage = (event) => {
  // Handle the result of the compilation and execution
  hideLoadingSpinner();

  const result = event.data;
  if (result.log) appendOutput(result.log, "log");
  if (result.error) appendOutput(result.error, "error");
  for (const warning of result.warnings || []) {
    appendOutput(warning, "warning");
  }

  // Deal with any queued work
  workerWorking = false;
  if (queuedWork) sendToWorker(queuedWork);
  queuedWork = undefined;
};

export { debounce, sendToWorker }