export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["VERBOSE"] = 5] = "VERBOSE";
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
    LogLevel[LogLevel["NONE"] = 0] = "NONE";
})(LogLevel || (LogLevel = {}));
export class Logger {
    static setLogLevel(logLevel) {
        this.logLevel = logLevel;
    }
    static setLogFilter(pattern) {
        this.logFilter = pattern;
    }
    static error(msg, ...args) {
        if (!this.shouldLog(msg, LogLevel.ERROR))
            return;
        console.error(msg, ...args);
    }
    static warn(msg, ...args) {
        if (!this.shouldLog(msg, LogLevel.WARN))
            return;
        console.warn(msg, ...args);
    }
    static debug(msg, ...args) {
        if (!this.shouldLog(msg, LogLevel.DEBUG))
            return;
        console.debug(msg, ...args);
    }
    static info(msg, ...args) {
        if (!this.shouldLog(msg, LogLevel.INFO))
            return;
        console.info(msg, ...args);
    }
    static verbose(msg, ...args) {
        if (!this.shouldLog(msg, LogLevel.VERBOSE))
            return;
        console.log(msg, ...args);
    }
    static shouldLog(msg, level) {
        if (this.logLevel < level)
            return false;
        if (this.logFilter && !msg.includes(this.logFilter))
            return false;
        return true;
    }
}
Object.defineProperty(Logger, "logLevel", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: LogLevel.INFO
});
//# sourceMappingURL=logger.js.map