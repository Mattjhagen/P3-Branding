/** @deprecated use StableToken and Token */
export declare enum CURRENCY_ENUM {
    GOLD = "Celo Gold",
    DOLLAR = "Celo Dollar",
    EURO = "Celo Euro"
}
export declare enum StableToken {
    cUSD = "cUSD",
    cEUR = "cEUR",
    cREAL = "cREAL"
}
export declare enum Token {
    CELO = "CELO"
}
export declare type CeloTokenType = StableToken | Token;
interface Currency {
    symbol: string;
    code: string;
    displayDecimals: number;
}
declare type CurrencyObject = {
    [key in CURRENCY_ENUM]: Currency;
};
/** @deprecated */
export declare const CURRENCIES: CurrencyObject;
export declare const resolveCurrency: (label: string) => CURRENCY_ENUM;
/** @deprecated use StableToken and Token */
export declare enum SHORT_CURRENCIES {
    DOLLAR = "dollar",
    GOLD = "gold",
    EURO = "euro"
}
/** @deprecated use StableToken and Token */
export declare const currencyToShortMap: {
    "Celo Dollar": SHORT_CURRENCIES;
    "Celo Gold": SHORT_CURRENCIES;
    "Celo Euro": SHORT_CURRENCIES;
};
export {};
