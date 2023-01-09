# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| > 2.1.0 | :white_check_mark: |

## Reporting Vulnerabilities

WSO2 takes security issues very seriously. If you have any concerns regarding our product security or have uncovered a security vulnerability, we strongly encourage you to report that to our private and highly confidential security mailing list: security@wso2.com first, without disclosing them in any forums, sites or other groups - public or private. To protect the end-user security, these issues could be disclosed in other places only after WSO2 completes its [Vulnerability Management Process](https://docs.wso2.com/display/Security/WSO2+Security+Vulnerability+Management+Process).

**Warning** : Please do not create GitHub issues for security vulnerabilities.

[WSO2 guidelines for reporting a security vulnerability](https://docs.wso2.com/display/Security/WSO2+Security+Vulnerability+Reporting+Guidelines) page describes how to report a Security Vulnerability and includes a public key if you wish to send secure messages to security@wso2.com
https://keys.openpgp.org/vks/v1/by-fingerprint/7EFB20752A3D65D00C1533F179FD52B81D17AE48https://keys.openpgp.org/vks/v1/by-fingerprint/E2447A59F1E093695CBA3195FF678AD284F96B9Ahttps://keys.openpgp.org/vks/v1/by-fingerprint/AC483C56C0A060204BBEF3E4182F3F21255FCCE9https://keys.openpgp.org/vks/v1/by-fingerprint/CB9B09143E92AE33DFEA5026E251CB08CB6138F2CB9B 0914 3E92 AE33 DFEA 5026 E251 CB08 CB61 38F2987D 5905 4458 6364 B901 B13D 0AB1 AB05 A68A 1BBF0168 DA26 2989 0DB9 4ACD 8367 E683 061E 2F85 C381

||

WSO2 Security Vulnerability Reporting Guidelines

 WSO2 Platform Security Security Processes and ProgramsSkip to end of banner

Go to start of banner

Skip to end of metadata

Go to start of metadata

Version: 1.6 | Date: 6th Dec 2021

We are truly grateful for our customers, security researchers, and community users for responsibly reporting security vulnerabilities to us. Your efforts help us make our products (e.g. WSO2 API Manager), services (e.g. WSO2 API Cloud), and open source projects (e.g. Siddhi) more secure, and thereby helps protect the entire WSO2 user community.

When reporting security vulnerabilities, you need to adhere to a few guidelines. This document highlights the points that need to be considered before reporting a vulnerability, the process of disclosing a vulnerability, and the content that needs to be included in a vulnerability report. 

Some of the vulnerabilities that you come across in the products that were downloaded from wso2.com might have already been fixed. For more information on the security advisories issued publicly by WSO2, see Security Advisories page.

Prerequisites for reporting Vulnerabilities

Responsible Disclosure of Vulnerabilities

What Constitutes a Proper Vulnerability Report

Vulnerability Handling Process

Prerequisites for reporting Vulnerabilities

For WSO2 products, please make sure to go through the prerequisites before you run an automated security scan or perform a penetration test against them.

Security aspects of the product are hardened

Make sure to follow the guidelines provided under Security Guidelines for Production Deployment. These guidelines might mitigate the security concerns you are experiencing.

If you are a WSO2 subscription holder, ensure that you have installed all the Security updates.

If you are a security researcher, we encourage you to download the latest product version available before testing.

Responsible Disclosure of Vulnerabilities

Based on the ethics of responsible disclosure, it is recommended to follow the process given below to report security vulnerabilities.

If you are an independent security researcher or a community user, you must only use the mailing lists mentioned in Table 1.

If you are a customer of WSO2, you can either use the mailing lists mentioned in Table 1 or open a ticket in the Support Portal.

Security issues relevant to Choreo	choreo-security@wso2.com	

E244 7A59 F1E0 9369 5CBA  3195 FF67 8AD2 84F9 6B9A

https://keys.openpgp.org/vks/v1/by-fingerprint/E2447A59F1E093695CBA3195FF678AD284F96B9A

Security issues relevant to Asgardeo	asgardeo-security@wso2.com	

7EFB 2075 2A3D 65D0 0C15  33F1 79FD 52B8 1D17 AE48

https://keys.openpgp.org/vks/v1/by-fingerprint/7EFB20752A3D65D00C1533F179FD52B81D17AE48

Security issues relevant to Ballerina	security@ballerina.io	

AC48 3C56 C0A0 6020 4BBE F3E4 182F 3F21 255F CCE9

https://keys.openpgp.org/vks/v1/by-fingerprint/AC483C56C0A060204BBEF3E4182F3F21255FCCE9

Any other security issues	security@wso2.com	

CB9B 0914 3E92 AE33 DFEA  5026 E251 CB08 CB61 38F2

https://keys.openpgp.org/vks/v1/by-fingerprint/CB9B09143E92AE33DFEA5026E251CB08CB6138F2

                                                                                         Table 1: Email addresses for security issue reporting

Above Security mailing lists are highly confidential internal mailing lists that are only visible to a selected group within WSO2. This includes the Security and Compliance Team members, Security Champions of product, service, and open source project teams, and people who hold leadership roles within WSO2. All the vulnerability reports are treated with the highest priority and confidentiality.

If you wish to send secure messages to security mailing lists, you may use the GPG keys mentioned in Table 1.

Please note!

Apart from the channels mentioned above, please do not use any other medium to report security vulnerabilities of WSO2. This includes, but is not limited to, repositories like GitHub, public forums, blogs and other websites, social media, and public and private chat groups.

Further, kindly refrain from sharing the vulnerability details you come across with other individuals. The vulnerability can only be publicized after we complete the mitigation actions. We will work closely with the reporter and will keep him/her updated on our progress.

What Constitutes a Proper Vulnerability Report

Please use the following template when reporting vulnerabilities so that it contains all the required information and helps expedite the analysis and mitigation process.

Name of the vulnerable WSO2 product, project, or service and its version (if applicable).

A high-level overview of the issue.

Steps to reproduce. Feel free to send us a screen cast. 

Self-assessed severity and impact.

Any proposed solution.

Vulnerability Handling Process

An overview of the vulnerability handling process:

The user reports the vulnerability privately to a security mailing list or through the Support Portal. The initial response time is less than 24 hours.

The relevant team at WSO2 fixes the vulnerability and QA verifies the solution.

The fix is distributed:

If the issue is of a product, distribute the patches to the subscription customers first. Then disclose it publicly after 4 weeks.

If the issue is of a service, apply the fix to the deployment.

If the issue is of an open source project, apply the fix to the master branch, and release a new version of the distribution if required.choreo-security@wso2.com
