import { NFTCheckoutRequest, NFTPurchaseRequest, NFTPurchaseResponse, NFTTransferRequest } from '@magic-sdk/types';
import { BaseModule } from './base-module';
export declare class NFTModule extends BaseModule {
    purchase(options: NFTPurchaseRequest): import("..").PromiEvent<NFTPurchaseResponse, {
        done: (result: NFTPurchaseResponse) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    checkout(options: NFTCheckoutRequest): import("..").PromiEvent<import("@magic-sdk/types").NFTResponse, {
        done: (result: import("@magic-sdk/types").NFTResponse) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    transfer(options: NFTTransferRequest): import("..").PromiEvent<import("@magic-sdk/types").NFTResponse, {
        done: (result: import("@magic-sdk/types").NFTResponse) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
}
