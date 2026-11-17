# Cryptography and Information Security Foundations

**Course Guide & Structured Reference**
*Accessible companion text for `Cryptography.pdf` (GTU Diploma IT, Subject Code: 4361601)*
**Authors**: J. B. Patel, H. K. Patel, D. K. Thakar

---

## Table of Contents

1. [Foundations of Information Security](#1-foundations-of-information-security)
2. [Classical Cryptographic Ciphers](#2-classical-cryptographic-ciphers)
3. [Symmetric Key Cryptography](#3-symmetric-key-cryptography)
4. [Asymmetric Key Cryptography](#4-asymmetric-key-cryptography)
5. [Cryptographic Hash Functions and MACs](#5-cryptographic-hash-functions-and-macs)
6. [Digital Signatures and Public Key Infrastructure (PKI)](#6-digital-signatures-and-public-key-infrastructure-pki)

---

## 1. Foundations of Information Security

- **CIA Triad**:
  - **Confidentiality**: Ensuring sensitive information is inaccessible to unauthorized individuals through encryption and access controls.
  - **Integrity**: Protecting data from unauthorized modification, insertion, or deletion using hashing and cryptographic checksums.
  - **Availability**: Guaranteeing authorized parties have timely, reliable access to services and systems.
- **Security Services & Mechanisms**: Authentication, access control, non-repudiation, auditing, and availability assurance.
- **Threat Classifications**: Passive attacks (eavesdropping, traffic analysis) vs. Active attacks (masquerading, replay, modification, denial-of-service).

---

## 2. Classical Cryptographic Ciphers

- **Substitution Ciphers**:
  - Caesar Cipher: Monoalphabetic shifting with modular arithmetic ($C = (P + k) \pmod{26}$). Vulnerable to frequency analysis.
  - Polyalphabetic Ciphers (Vigenère): Repeated keyword shift reducing single-letter frequency leakage.
  - Playfair Cipher: $5 \times 5$ matrix digraph substitution with standard pairing rules.
- **Transposition Ciphers**: Rail Fence and Columnar transposition reordering plaintext positions without changing glyph identities.

---

## 3. Symmetric Key Cryptography

- **Stream Ciphers vs. Block Ciphers**:
  - Stream Ciphers (e.g., RC4, ChaCha20): Encrypt plaintext bit-by-bit or byte-by-byte with pseudorandom keystream.
  - Block Ciphers: Encrypt fixed-size blocks (64-bit or 128-bit) using substitution-permutation networks (SPN) or Feistel networks.
- **Data Encryption Standard (DES)**: 64-bit block size, 56-bit effective key length, 16-round Feistel network. Vulnerable to brute force. Triple-DES (3DES) mitigates with Encrypt-Decrypt-Encrypt ($EDE$) using 2 or 3 independent keys.
- **Advanced Encryption Standard (AES)**:
  - NIST standard (Rijndael cipher) supporting 128-bit block size with 128, 192, or 256-bit keys (10, 12, or 14 rounds).
  - Round transformations: `SubBytes` (non-linear S-Box substitution), `ShiftRows` (cyclic byte shifting), `MixColumns` (Galois Field matrix multiplication), and `AddRoundKey` (bitwise XOR with subkey).
- **Block Cipher Modes of Operation**:
  - Electronic Codebook (ECB): Deterministic blocks, leaks data patterns; never recommended for production.
  - Cipher Block Chaining (CBC): XORs each plaintext block with previous ciphertext block; requires random Initialization Vector (IV).
  - Counter (CTR) & Galois/Counter Mode (GCM): Turns block cipher into authenticated stream cipher supporting parallelization and integrity authentication.

---

## 4. Asymmetric Key Cryptography

- **Mathematical Foundations**: Prime factorization hardness, modular arithmetic, Euler's totient function $\phi(n)$, and discrete logarithm problem.
- **RSA Algorithm**:
  1. Key Generation: Select large primes $p, q$. Compute $n = p \times q$ and $\phi(n) = (p - 1)(q - 1)$.
  2. Public Exponent $e$ chosen such that $\gcd(e, \phi(n)) = 1$.
  3. Private Exponent $d$ computed as $d \equiv e^{-1} \pmod{\phi(n)}$.
  4. Encryption: $C \equiv M^e \pmod{n}$.
  5. Decryption: $M \equiv C^d \pmod{n}$.
- **Diffie-Hellman Key Exchange**: Allows two parties over an insecure channel to establish a shared symmetric secret without transmitting the secret itself ($g^{ab} \pmod{p}$). Vulnerable to Man-in-the-Middle if unauthenticated.
- **Elliptic Curve Cryptography (ECC)**: Provides equivalent cryptographic strength to RSA with significantly smaller key sizes (e.g., 256-bit ECC $\approx$ 3072-bit RSA), reducing CPU and bandwidth overhead.

---

## 5. Cryptographic Hash Functions and MACs

- **Hash Properties**: One-way (pre-image resistance), second pre-image resistance, and collision resistance.
- **Secure Hash Algorithm Family (SHA)**:
  - SHA-1: 160-bit digest; deprecated due to practical collision demonstrations.
  - SHA-2: SHA-256 and SHA-512 with Merkle-Damgård construction.
  - SHA-3: Keccak permutation-based sponge construction offering resistance against length extension attacks.
- **Message Authentication Codes (HMAC)**: Combines cryptographic hash with secret key ($H((K' \oplus opad) \parallel H((K' \oplus ipad) \parallel M))$) ensuring both message integrity and origin authenticity.

---

## 6. Digital Signatures and Public Key Infrastructure (PKI)

- **Digital Signature Workflow**: Sender hashes message $h = H(M)$, encrypts hash with sender's private key $S = \text{Sign}_{K_{priv}}(h)$. Receiver decrypts signature with sender's public key and verifies equality with computed hash.
- **PKI Architecture**: Certificate Authorities (CA), Registration Authorities (RA), and X.509 digital certificate standards binding identity to public keys.
- **Revocation Protocols**: Certificate Revocation Lists (CRL) and Online Certificate Status Protocol (OCSP) / OCSP Stapling.
