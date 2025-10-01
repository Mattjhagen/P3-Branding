import { GasApiResponse, GaslessTransactionRequest, RequestUserInfoScope, UserInfo, WalletInfo, Wallets } from '@magic-sdk/types';
import { BaseModule } from './base-module';
export declare type ConnectWithUiEvents = {
    'id-token-created': (params: {
        idToken: string;
    }) => void;
    wallet_selected: (params: {
        wallet: Wallets;
    }) => any;
};
export declare class WalletModule extends BaseModule {
    connectWithUI(): import("../util").PromiEvent<string[], ConnectWithUiEvents & {
        done: (result: string[]) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    showUI(): import("../util").PromiEvent<boolean, {
        done: (result: boolean) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    showAddress(): import("../util").PromiEvent<boolean, {
        done: (result: boolean) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    showSendTokensUI(): import("../util").PromiEvent<boolean, {
        done: (result: boolean) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    showOnRamp(): import("../util").PromiEvent<boolean, {
        done: (result: boolean) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    showNFTs(): import("../util").PromiEvent<boolean, {
        done: (result: boolean) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    showBalances(): import("../util").PromiEvent<boolean, {
        done: (result: boolean) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    sendGaslessTransaction(address: string, transaction: GaslessTransactionRequest): import("../util").PromiEvent<GasApiResponse, {
        done: (result: GasApiResponse) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    getInfo(): Promise<WalletInfo>;
    disconnect(): import("../util").PromiEvent<boolean, {
        done: (result: boolean) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    requestUserInfoWithUI(scope?: RequestUserInfoScope): import("../util").PromiEvent<UserInfo, {
        done: (result: UserInfo) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    getProvider(): Promise<any>;
    private localForageKey;
    private isMetaMaskInstalled;
    private isMetaMaskBrowser;
    private getMetaMaskProvider;
    private connectToMetaMask;
    private isCoinbaseWalletInstalled;
    private isCoinbaseWalletBrowser;
    private getCoinbaseProvider;
    private connectToCoinbaseWallet;
    private isMobile;
    private getUserEnv;
    private connectToThirdPartyWallet;
    private isWalletEnabled;
    private handleWalletSelected;
    private autoConnectIfWalletBrowser;
}
