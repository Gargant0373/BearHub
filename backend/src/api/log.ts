import { Log } from "../data_types";

const log: (log: Log) => void = (log) => {
    log.timestamp = Date.now();
    // TODO: Save logs.
    console.log(log);
};

export { log };