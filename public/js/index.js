import { 
  hideSpinner,
  appendOutput
} from './helpers/index.js'

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

// Handle the result of the compilation and execution
worker.onmessage = (event) => {
  
  hideSpinner();

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

export { sendToWorker }