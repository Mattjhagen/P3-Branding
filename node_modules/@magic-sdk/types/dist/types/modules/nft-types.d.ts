export declare type NFTResponseStatus = 'cancelled' | 'processed' | 'declined' | 'expired';
export declare type NFTResponse = {
    status: NFTResponseStatus;
};
export interface NFTPurchaseRequest {
    nft: {
        name: string;
        imageUrl: string;
        blockchainNftId: string;
        contractAddress: string;
        network: string;
        platform: string;
        type: string;
    };
    identityPrefill: {
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        emailAddress: string;
        phone: string;
        address: {
            street1: string;
            street2: string;
            city: string;
            regionCode: string;
            postalCode: string;
            countryCode: string;
        };
    };
}
export declare type NFTPurchaseResponse = NFTResponse & {
    errorMessage?: string;
};
export interface NFTCheckoutRequest {
    contractId: string;
    tokenId: string;
    name: string;
    imageUrl: string;
    quantity?: number;
    walletAddress?: string;
}
export declare type NFTCheckoutResponse = NFTResponse;
export interface NFTTransferRequest {
    tokenId: string;
    contractAddress: string;
    quantity?: number;
    recipient?: string;
}
export declare type NFTTransferResponse = NFTResponse;
