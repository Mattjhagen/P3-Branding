/**
 * This file is based on noble-curves (https://github.com/paulmillr/noble-curves).
 *
 * noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com)
 *
 * The original file is located at:
 * https://github.com/paulmillr/noble-curves/blob/b9d49d2b41d550571a0c5be443ecb62109fa3373/src/ed448.ts
 */
/**
 * Edwards448 (not Ed448-Goldilocks) curve with following addons:
 * - X448 ECDH
 * - Decaf cofactor elimination
 * - Elligator hash-to-group / point indistinguishability
 * Conforms to RFC 8032 https://www.rfc-editor.org/rfc/rfc8032.html#section-5.2
 * @module
 */
/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
import { type MontgomeryECDH } from "@hpke/common";
export declare const x448: MontgomeryECDH;
//# sourceMappingURL=x448.d.ts.map