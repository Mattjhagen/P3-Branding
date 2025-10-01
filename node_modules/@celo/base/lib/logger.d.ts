export declare type Logger = (...args: any[]) => void;
/** @internal */
export declare const noopLogger: Logger;
/** @internal */
export declare const prefixLogger: (prefix: string, logger: Logger) => Logger;
/** @internal */
export declare const consoleLogger: Logger;
