if(globalThis.window != null) { 
    var worker: Worker;
    window.addEventListener('load', (event) => {
        worker = new Worker('./scripts/index.js');
        RegisterWorker(worker);
    });
    RegisterMessageHandler("hello", () => {
        console.log("Hello from the worker");
    });
} else {
    postMessage(["log", "This is a worker"]);
    postMessage(["warn", "Warning from the worker"]);
    postMessage(["error", "Error from the worker"]);
    postMessage(["info", "Info from the worker"]);
    postMessage("hello");
}
