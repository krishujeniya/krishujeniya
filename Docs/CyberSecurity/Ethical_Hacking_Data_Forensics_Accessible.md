# Ethical Hacking and Digital Forensics

**Course Guide & Structured Reference**
*Accessible companion text for `Ethical_Hacking_Data_Forensics.pdf` (GTU Diploma IT, Subject Code: 4361601)*
**Authors**: J. B. Patel, H. K. Patel, D. K. Thakar

---

## Table of Contents

1. [Ethical Hacking Methodologies & Phases](#1-ethical-hacking-methodologies--phases)
2. [Reconnaissance and Scanning Techniques](#2-reconnaissance-and-scanning-techniques)
3. [Vulnerability Assessment and Exploitation](#3-vulnerability-assessment-and-exploitation)
4. [Digital Forensics Process and Principles](#4-digital-forensics-process-and-principles)
5. [Evidence Acquisition and Chain of Custody](#5-evidence-acquisition-and-chain-of-custody)
6. [Disk, Memory, and Network Forensic Analysis](#6-disk-memory-and-network-forensic-analysis)

---

## 1. Ethical Hacking Methodologies & Phases

- **Hacker Classifications**: White hat (authorized defensive security professionals), Black hat (unauthorized malicious actors), and Grey hat (unauthorized research with responsible disclosure intentions).
- **Core 5-Phase Penetration Testing Methodology**:
  1. **Reconnaissance**: Information gathering (passive OSINT and active foot-printing).
  2. **Scanning**: Probing targets for active hosts, open ports, service versions, and known vulnerabilities.
  3. **Gaining Access**: Exploiting identified flaws to penetrate systems, applications, or network boundaries.
  4. **Maintaining Access**: Establishing persistent control via backdoors, rootkits, or secondary administrative accounts.
  5. **Covering Tracks**: Clearing logs, resetting timestamps, and removing tool artifacts.

---

## 2. Reconnaissance and Scanning Techniques

- **Passive Footprinting**: DNS records querying (`whois`, `dig`, `nslookup`), search engine dorking, certificate transparency logs, and social engineering surface mapping.
- **Active Scanning & Port Enumeration**:
  - TCP Connect Scan (`-sT`): Full three-way handshake, highly visible in target logs.
  - SYN Stealth Scan (`-sS`): Half-open scanning sending SYN and tearing down connection with RST upon SYN-ACK receipt.
  - UDP Scanning (`-sU`): ICMP port unreachable response detection for stateless services (DNS, SNMP, NTP).
  - OS Detection & Banner Grabbing: TCP window size, TTL inspection, and service banner queries.

---

## 3. Vulnerability Assessment and Exploitation

- **Common Vulnerability Scoring System (CVSS)**: Metric framework evaluating vulnerability severity based on Base, Temporal, and Environmental metrics (score 0.0–10.0).
- **Application Security Flaws (OWASP Top 10)**:
  - Injection: SQL Injection, Command Injection, LDAP Injection.
  - Broken Authentication and Session Management: Weak session tokens, credential stuffing, lack of MFA.
  - Security Misconfiguration: Default credentials, exposed debugging endpoints, unnecessary open ports.
- **Exploitation Frameworks**: Using Kali Linux toolsets (Metasploit Framework, Burp Suite, Hydra, John the Ripper) within strict scopes of authorization.

---

## 4. Digital Forensics Process and Principles

- **Locard's Exchange Principle**: Anyone entering a crime scene brings something into it and leaves with something taken away; every digital interaction leaves microscopic forensic artifacts.
- **Order of Volatility**:
  1. CPU registers, on-chip cache.
  2. Routing table, ARP cache, process table, kernel memory.
  3. Temporary file systems, RAM.
  4. Disk storage, non-volatile solid-state drives.
  5. Remote logging data, backup tapes, physical printouts.

---

## 5. Evidence Acquisition and Chain of Custody

- **Live vs. Dead Acquisition**:
  - Live forensics: Capturing volatile RAM and running process memory prior to machine shutdown.
  - Dead forensics: Bit-stream disk imaging of powered-off systems using hardware write-blockers.
- **Cryptographic Hashing for Evidence Integrity**: Computing MD5 and SHA-256 hashes of original media immediately upon seizure and verifying matches against working forensic copies.
- **Chain of Custody Documentation**: Chronological, unbroken log tracking who collected, transferred, analyzed, and stored evidence items to satisfy legal admissibility standards.

---

## 6. Disk, Memory, and Network Forensic Analysis

- **File System Forensics**:
  - MBR / GPT partition table analysis.
  - NTFS artifacts: Master File Table (`$MFT`), `$LogFile`, Volume Shadow Copies, and Alternate Data Streams (ADS).
  - FAT/ext4 inode structures, allocated vs. unallocated clusters, file slack space, and deleted file carving.
- **Memory Forensics**:
  - Extracting active network sockets, injected DLLs, unpacked malware executables, and unencrypted passwords from memory dumps using frameworks like Volatility.
- **Log and Timeline Reconstruction**:
  - Event log analysis (Windows Event Viewer `Security.evtx`, `/var/log/auth.log`, syslog).
  - Super-timeline creation consolidating file system metadata changes (MACB timestamps: Modified, Accessed, Changed, Born).
