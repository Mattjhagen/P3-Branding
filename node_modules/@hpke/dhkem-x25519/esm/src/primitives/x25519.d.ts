/**
 * This file is based on noble-curves (https://github.com/paulmillr/noble-curves).
 *
 * noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com)
 *
 * The original file is located at:
 * https://github.com/paulmillr/noble-curves/blob/b9d49d2b41d550571a0c5be443ecb62109fa3373/src/ed25519.ts
 */
/**
 * ed25519 Twisted Edwards curve with following addons:
 * - X25519 ECDH
 * - Ristretto cofactor elimination
 * - Elligator hash-to-group / point indistinguishability
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
import { type MontgomeryECDH } from "@hpke/common";
export declare const x25519: MontgomeryECDH;
//# sourceMappingURL=x25519.d.ts.map