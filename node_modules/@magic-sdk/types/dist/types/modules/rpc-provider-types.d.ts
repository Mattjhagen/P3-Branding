export declare type EthNetworkName = 'mainnet' | 'goerli' | 'sepolia';
export declare enum EthChainType {
    Harmony = "HARMONY"
}
export interface CustomNodeConfiguration {
    rpcUrl: string;
    chainId?: number;
    chainType?: EthChainType;
}
export declare type EthNetworkConfiguration = EthNetworkName | CustomNodeConfiguration;
export declare type ProviderEnableEvents = {
    'id-token-created': (params: {
        idToken: string;
    }) => void;
};
