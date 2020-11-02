---
title: "HIPAA-Compliant Hosting: A 5 Steps Beginner’s Guide"
date: "2020-11-01T12:00:00.000Z"
template: "post"
guestAuthor: "Ilai Bavati"
guestAuthorLink: https://www.linkedin.com/in/ilai-bavati-0b1a1418a/
slug: "/posts/hipaa-compliant-hosting/"
img: "https://victorzhou.com/media/hipaa-guest-post/hipaa-img.webp"
category: "HIPAA"
tags:
  - "HIPAA"
description: How to host your HIPAA-compliant website and sleep well at night.
prev: "/posts/democratizing-coding/"
next: "/blog/creating-and-selling-io-games/"
---

![](./media-link/hipaa-guest-post/hipaa-img.webp)

HIPAA-compliant hosting services provide technologies and features for compliance with the **Health Insurance Portability and Accountability Act** (HIPAA). HIPAA regulations were created to ensure proper security is applied to protected health information (PHI), whether it is stored on-premise or in the cloud. Non-compliance with HIPAA regulations may result in fines ranging between \$100 and \$50,000 or time in jail, depending on the type of violation.

This article explains five key parameters of evaluating hosting services for HIPAA compliance and examines methods for creating DevOps-based automated compliance pipelines.


## What Is HIPAA Compliant Hosting?

HIPAA compliant hosting refers to cloud services that have implemented the appropriate standards and technologies neededin place to protect your healthcare data,. These vendors have taken measures and implemented technologies to ensure that you can abide by the Health Insurance Portability and Accountability Act (HIPAA).

[HIPAA was made law in 1996](https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html), a time when many organizations were still using paper records. The regulations inside were defined in technology-neutral ways to ensure that HIPAA could remain functional in the years to come. Because of this, HIPAA regulations can and are applied to protected health information (PHI) hosted in the cloud.

To understand how PHI is affected and what standards hosts need to uphold, you need to note the following factors:



*   Cloud computing is covered by the regulations set out in the HIPAA Privacy and Security Rules. These rules place restrictions on which cloud services can be used and how.
*   Healthcare organizations can move data from on-premises to both public and private [HIPAA compliant cloud](https://cloudian.com/guides/health-data-management/hipaa-compliant-cloud-storage/) environments. These migrations require a business associate agreement between organization and host and an agreement to implement privacy and security measures.

Issues you may face when storing PHI in the cloud include:



*   **Lack of an official HIPAA certification program**—this means there is no universal guarantee that a host is compliant. Hosts can show SOC 2 type 1 or 2 certifications to prove security measures but these aren’t required and don’t fully fulfill HIPAA compliance requirements.
*   **Limitations of assessments**—you can use HIPAA specialists to perform third-party assessments and audits but these only prove a point in time compliance. You can periodically perform assessments but this can get costly and leaves gaps in assurance.

Although HIPAA certifications are not legally recognized, choosing hosts that claim and support compliance can help make it easier to ensure compliance. Additionally, these hosts may have greater experience and expertise towards meeting compliance, meaning they may be able to provide better support for your operations.


## 5-Step HIPAA Compliance Checklist for Hosting

When evaluating vendors for hosting, you need to evaluate their claims carefully and verify that standards are supported.

### 1. Firewalls and user identification

HIPAA compliance requires system-wide firewalls to limit access to PHI. These firewalls should use a combination of white and blacklisting to limit traffic to authorized users. Firewalls should also enforce authentication and authorization policies to ensure that users are who they claim. Typically, compliant hosts automatically apply firewalls at the hardware, software, and application level.

### 2. Encrypted virtual private network (VPN)

When storing and handling PHI, all communications need to be secured through an encrypted VPN tunnel. This helps ensure that user sessions are not compromised and prevents data from breach during transfer. Hosts must support VPN connections and use established encryption standards, such as [AES 256](https://www.tutorialspoint.com/cryptography/advanced_encryption_standard.htm).

### 3. Private hosting and physical safeguarding

Your cloud resources must be on dedicated servers to meet HIPAA compliance. These servers should only be accessible to you, your host, and any users you authorize. Likewise, the servers you are using need to be stored in a protected and HIPAA compliant data center. This is in contrast to standard public cloud resources which are based on multi-tenant or shared servers.

### 4. Proper data disposal

When getting rid of data or hardware, you need to ensure that your host destroys any retired resources in a way that is not recoverable. This process should be documented and peer-reviewed to prove the taken steps and chain of custody. This process may be referred to as integrity control.

### 5. Offsite backups

You need to have a backup of your PHI that can be used for recovery in the event of data loss to meet compliance. This typically requires continuous syncing between your production and failover data to ensure zero data loss. You must be able to store your backups offsite and storage resources should be held to the same security standards as your original data.


## How to Automate HIPAA Compliant Hosting Using DevOps

While ensuring cloud host compliance is critical, you also need to ensure compliance from your own end. When hosting workloads data in the cloud, vendors are only partly responsible for [cloud security](https://www.exabeam.com/information-security/cloud-security/). Where the vendor’s responsibility ends, your responsibility as a website owner begins.

This is especially important for organizations using DevOps to develop healthcare applications or provide digital healthcare services. While DevOps can enable you to streamline your security and compliance tasks it can also enable issues to quickly compound if you aren’t careful. Below are a few practices to ensure your operations remain compliant.

### Design your workflows for compliance

You need to bake compliance standards and tests into your pipelines from the start. Automating these processes and building in audit points can help ensure that issues are caught early and corrected ASAP. This helps ensure that your operations remain consistently compliant and can prevent accidental exposure of data.

Building compliance into workflows includes training team members on HIPAA and making sure teams understand how their specific tasks are affected. For example, developers should understand why not to [use live PHI in test or dev environments](https://www.darkreading.com/risk/live-data-in-test-environments-is-alive-and-well----and-dangerous/d/d-id/1133220) and be provided test datasets with fabricated data. Meanwhile, operations members should make sure that configuration scripts apply restricted permissions and encryption to newly created resources by default.

### Continuously monitor for compliance

Continuous monitoring is standard practice for DevOps operations and is just as important for healthcare-related operations. Monitoring should provide full visibility of your operations and result in auditable records. This means logging all events, access, and audit operations and generally storing those logs for at least six years.

When setting up your monitoring workflows, make sure to deploy monitoring solutions to redundant operations so that you don’t lose visibility. Additionally, take care that your solutions alert on possible compliance issues with high priority. Without accurate and timely alerts, you cannot take effective [incident response](https://www.cynet.com/incident-response/) actions to mitigate or prevent a breach.

### Make security and audits dynamic

Many cloud operations involve dynamic environments with connections and resources frequently being created and destroyed. For example, many cloud-native applications rely on microservices and containers. These applications scale dynamically and use ephemeral and often short-lived resources to ensure availability.

When resources may only exist for a few minutes at a time, it can be difficult to apply security measures or to prove compliance if audited. To account for this, you need to implement security measures that are as dynamic as your resources. For example, solutions that include service discovery or can automatically identify new data sources for logging.


## Conclusion

HIPAA-compliant hosting services should, ideally, offer capabilities to ensure you can maintain HIPAA compliance in several key aspects. The most basic features you should look for are firewalls and user identification, encrypted VPNs, physical safeguards, proper data disposal, and offsite backups. These key features can help cover basic HIPAA compliance needs. You can also look for automation capabilities, which can help you maintain continuous compliance.

> Author Bio: Ilai Bavati is a technology writer and editor based in Tel Aviv. He covers topics ranging from machine learning and cybersecurity to cloud computing and the Internet of Things.
