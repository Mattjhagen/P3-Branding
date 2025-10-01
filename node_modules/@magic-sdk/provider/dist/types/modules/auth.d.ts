import { LoginWithMagicLinkConfiguration, LoginWithSmsConfiguration, LoginWithEmailOTPConfiguration, UpdateEmailConfiguration } from '@magic-sdk/types';
import { BaseModule } from './base-module';
import { UpdateEmailEvents } from './user';
export declare const ProductConsolidationMethodRemovalVersions: {
    'magic-sdk': string;
    '@magic-sdk/react-native': string;
    '@magic-sdk/react-native-bare': string;
    '@magic-sdk/react-native-expo': string;
};
export declare class AuthModule extends BaseModule {
    /**
     * Initiate the "magic link" login flow for a user. If the flow is successful,
     * this method will return a Decentralized ID token (with a default lifespan
     * of 15 minutes).
     */
    loginWithMagicLink(configuration: LoginWithMagicLinkConfiguration): import("..").PromiEvent<string | null, {
        "email-sent": () => void;
        "email-not-deliverable": () => void;
        retry: () => void;
    } & {
        "device-needs-approval": () => void;
        "device-verification-email-sent": () => void;
        "device-verification-link-expired": () => void;
        "device-approved": () => void;
        "device-retry": () => void;
    } & {
        done: (result: string | null) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    /**
     * Initiate an SMS login flow for a user. If successful,
     * this method will return a Decenteralized ID token (with a default lifespan
     * of 15 minutes)
     */
    loginWithSMS(configuration: LoginWithSmsConfiguration): import("..").PromiEvent<string | null, {
        done: (result: string | null) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    /**
     * Initiate an Email with OTP login flow for a user. If successful,
     * this method will return a Decenteralized ID token (with a default lifespan
     * of 15 minutes)
     */
    loginWithEmailOTP(configuration: LoginWithEmailOTPConfiguration): import("..").PromiEvent<string | null, {
        "email-otp-sent": () => void;
        "invalid-email-otp": () => void;
        "expired-email-otp": () => void;
        "verify-email-otp": (otp: string) => void;
        cancel: () => void;
    } & {
        "device-needs-approval": () => void;
        "device-verification-email-sent": () => void;
        "device-verification-link-expired": () => void;
        "device-approved": () => void;
        "device-retry": () => void;
    } & {
        done: (result: string | null) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    /**
     * Log a user in with a special one-time-use credential token. This is
     * currently used during magic link flows with a configured redirect to
     * hydrate the user session at the end of the flow. If the flow is successful,
     * this method will return a Decentralized ID token (with a default lifespan
     * of 15 minutes).
     *
     * If no argument is provided, a credential is automatically parsed from
     * `window.location.search`.
     */
    loginWithCredential(credentialOrQueryString?: string): import("..").PromiEvent<string | null, {
        done: (result: string | null) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    setAuthorizationToken(jwt: string): import("..").PromiEvent<boolean, {
        done: (result: boolean) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
    updateEmailWithUI(configuration: UpdateEmailConfiguration): import("..").PromiEvent<string | null, UpdateEmailEvents & {
        done: (result: string | null) => void;
        error: (reason: any) => void;
        settled: () => void;
    }>;
}
