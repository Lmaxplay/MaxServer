if(globalThis.window != null) { 
    var worker: Worker;
    window.addEventListener('load', (event) => {
        worker = new Worker('./scripts/index.js');
        worker.onmessage = (event) => {
            if(event.data instanceof Array) {
                if (event.data.length >= 2) {
                    if (event.data[0] == "log") {
                        console.log(event.data[1]);
                    } else if (event.data[0] == "warn") {
                        console.warn(event.data[1]);
                    }
                }
            }
        }

});

} else {
    var a = "hi";
    postMessage(["log", "Hello world"]);
    postMessage(["log", "Hello world"]);
}