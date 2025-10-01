export declare enum LogLevel {
    VERBOSE = 5,
    DEBUG = 4,
    INFO = 3,
    WARN = 2,
    ERROR = 1,
    NONE = 0
}
export declare class Logger {
    static logLevel: LogLevel;
    static logFilter?: string;
    static setLogLevel(logLevel: LogLevel): void;
    static setLogFilter(pattern: string): void;
    static error(msg: string, ...args: any[]): void;
    static warn(msg: string, ...args: any[]): void;
    static debug(msg: string, ...args: any[]): void;
    static info(msg: string, ...args: any[]): void;
    static verbose(msg: string, ...args: any[]): void;
    private static shouldLog;
}
//# sourceMappingURL=logger.d.ts.map