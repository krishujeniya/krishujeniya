# Network Security and Cyber Crime Defense

**Course Guide & Structured Reference**
*Accessible companion text for `Network_Crime_Security.pdf` (GTU Diploma IT, Subject Code: 4361601)*
**Authors**: J. B. Patel, H. K. Patel, D. K. Thakar

---

## Table of Contents

1. [Network Threat Landscape & Attack Vectors](#1-network-threat-landscape--attack-vectors)
2. [Cybercrime Classifications & Modus Operandi](#2-cybercrime-classifications--modus-operandi)
3. [Network Defense Architecture: Firewalls and Perimeter Controls](#3-network-defense-architecture-firewalls-and-perimeter-controls)
4. [Intrusion Detection and Prevention Systems (IDS/IPS)](#4-intrusion-detection-and-prevention-systems-idsips)
5. [Secure Communication Protocols (IPSec, SSL/TLS, SSH)](#5-secure-communication-protocols-ipsec-ssltls-ssh)
6. [Legal Frameworks and Cyber Law (Information Technology Act)](#6-legal-frameworks-and-cyber-law-information-technology-act)

---

## 1. Network Threat Landscape & Attack Vectors

- **Eavesdropping & Packet Sniffing**: Unencrypted traffic interception on broadcast domains or unswitched LANs using promiscuous mode interfaces (Wireshark, tcpdump).
- **Man-in-the-Middle (MITM) & Spoofing**:
  - ARP Poisoning: Forging ARP reply packets to associate attacker MAC with gateway IP address.
  - DNS Spoofing / Cache Poisoning: Injecting false resolution records to redirect users to malicious clones.
  - IP Spoofing: Fabricating source IP headers to bypass ingress filters or amplify reflective denial-of-service.
- **Denial of Service (DoS) & Distributed DoS (DDoS)**:
  - Network Layer Floods: SYN flood, UDP flood, ICMP smurf attack.
  - Application Layer Exhaustion: HTTP Slowloris, recursive XML/JSON parsing, API endpoint exhaustion.
  - Reflection and Amplification: NTP, DNS, and SNMP reflection leveraging open resolvers and asymmetric response sizes.

---

## 2. Cybercrime Classifications & Modus Operandi

- **Identity Theft & Financial Fraud**: Phishing, spear-phishing, credential harvesting, vishing, SIM swapping, and online banking account takeover.
- **Malware Taxonomies**:
  - Viruses & Worms: Self-replicating file infectors vs. standalone self-propagating network code.
  - Trojans & Remote Access Trojans (RATs): Disguised benign software providing covert command-and-control access.
  - Ransomware: Asymmetric cryptographic extortion locking local storage and demanding cryptocurrency ransoms.
  - Spyware, Keyloggers & Botnets: Covert surveillance and coordinated command-and-control infrastructures.

---

## 3. Network Defense Architecture: Firewalls and Perimeter Controls

- **Firewall Generations**:
  - Packet-Filtering Firewalls (Layer 3/4): Inspects source/destination IP, port numbers, and protocol headers against stateless ACL rules.
  - Stateful Inspection Firewalls: Tracks active TCP connection states (SYN, ESTABLISHED, FIN) in dynamic state tables.
  - Application-Level Gateways (Proxy Firewalls): Terminates connections and reconstructs application payloads (HTTP, FTP, SMTP) for deep inspection.
  - Next-Generation Firewalls (NGFW): Integrates application awareness, deep packet inspection (DPI), user identity mapping, and integrated IPS feeds.
- **Network Segmentation & DMZ**: Demilitarized Zones separating public-facing web servers from internal databases and sensitive corporate subnets.

---

## 4. Intrusion Detection and Prevention Systems (IDS/IPS)

- **Detection Paradigms**:
  - Signature-Based Detection: Compares network traffic against databases of known attack patterns and CVE signatures (low false-positive rate, blind to zero-days).
  - Anomaly-Based Detection: Establishes statistical baselines of normal network behavior and flags deviations (detects zero-days, higher false-positive rate).
- **Deployment Topologies**:
  - Network-Based (NIDS/NIPS): Placed at network taps or in-line with switches (e.g., Snort, Suricata).
  - Host-Based (HIDS/HIPS): Installed on target endpoints monitoring local syscalls, file integrity, and auth logs (e.g., OSSEC, Wazuh).

---

## 5. Secure Communication Protocols

- **IPSec (IP Security)**: Operates at Network Layer (Layer 3) to secure all IP traffic.
  - Protocols: Authentication Header (AH) for integrity/authentication; Encapsulating Security Payload (ESP) for confidentiality, integrity, and authentication.
  - Modes: Transport Mode (payload encrypted, original IP header retained) vs. Tunnel Mode (entire original IP packet encrypted, new IP header prepended; standard for site-to-site VPNs).
  - Key Management: Internet Key Exchange (IKEv2) negotiating Security Associations (SA).
- **SSL / TLS (Transport Layer Security)**:
  - TLS Handshake: Negotiates cipher suite, verifies server certificate, and generates session keys using ephemeral Diffie-Hellman (ECDHE).
  - Provides end-to-end cryptographic transport for HTTPS, FTPS, and SMTPS.
- **SSH (Secure Shell)**: Encrypted replacement for unencrypted Telnet and rlogin; provides terminal access, port forwarding, and SFTP.

---

## 6. Legal Frameworks and Cyber Law (Information Technology Act)

- **Overview of IT Act, 2000 (and 2008 Amendments in India)**:
  - Section 43: Penalty for unauthorized access, data theft, and virus introduction.
  - Section 65: Tampering with computer source documents.
  - Section 66: Hacking and computer-related offenses.
  - Section 66C & 66D: Punishment for identity theft and cheating by personation using computer resources.
  - Section 66E: Privacy violation and unauthorized capture/transmission of images.
  - Section 66F: Cyber terrorism offenses punishable with imprisonment for life.
- **Compliance & Due Diligence**: Data retention, intermediary liability rules, incident reporting to CERT-In (within mandatory notification windows), and GDPR/DPDP alignment.
