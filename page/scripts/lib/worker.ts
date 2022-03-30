const handlers = {};

/**
 * Handler for messages from the worker
 * Use RegisterMessageHandler to register this as the handler for a message
*/
function WorkerMessageHandler (message: MessageEvent) {
    const messagecontent = message.data;
    // console.log(messagecontent);
    if(typeof messagecontent === "string") {
        if(handlers[messagecontent] != null) {
            if(handlers[`${messagecontent}`] != null && typeof handlers[`${messagecontent}`] === "function") {
                handlers[messagecontent]();
            } else {
                console.log(`No handler for ${messagecontent}`);
            }
        }
        return;
    } else if(messagecontent instanceof Array) {
        if(handlers[`${messagecontent[0]}`] != null && typeof handlers[`${messagecontent[0]}`] === "function") {
            if(messagecontent.length >= 2) {
                handlers[messagecontent[0]](messagecontent[1]);
            } else {
                handlers[messagecontent[0]]();
            }
        } else {
            console.warn(`No handler for "${messagecontent}"`);
        }
    } else {
        console.log(`No handler for "${messagecontent}" of type "${typeof messagecontent}"`);
    }
}

function RegisterMessageHandler (message: string, handler: Function) {
    handlers[message] = handler;
}

/**
 * Uses a Worker as input and registers messagehandler as the onmessage handler
 * @param worker The worker to use
 */
function RegisterWorker (worker: Worker) {
    worker.onmessage = WorkerMessageHandler;
}

RegisterMessageHandler("info", (message: any = "") => {
    console.info(message);
});

RegisterMessageHandler("log", (message: any = "") => {
    console.log(message);
});

RegisterMessageHandler("warn", (message: any = "") => {
    console.warn(message);
});

RegisterMessageHandler("error", (message: any = "") => {
    console.error(message);
});
