---
---
# Question
I don't understand how I can utilize Microsoft Active Directory for managing authorization and authentication to my company's Azure Storage containers. For example, I occasionally need to provide short term access to certain containers for use by end users who are sometimes inside my organization, and defined in Active Directory, as well as to end users outside my organization, who are not in Active Directory. Is this possible, and if so, what are the best practices from an AZ-104 exam perspective?

Great question — this is a classic AZ‑104 scenario. Let’s break it down clearly:

---

## 🔑 Authentication & Authorization for Azure Storage

Azure Storage supports **two main identity models**:

1. **Microsoft Entra ID (formerly Azure AD)**  
   - Used for **internal users** (employees, contractors) who are defined in your organization’s directory.  
   - Provides **role-based access control (RBAC)** at the storage account, container, or blob level.  
   - Tokens are issued by Entra ID, and access is enforced by Azure Storage.  
   - Example: Assign the **Storage Blob Data Contributor** role to a user or group so they can upload/download blobs.

2. **Shared Key / Shared Access Signature (SAS)**  
   - Used for **external users** or scenarios where you need **short-term, limited access** without requiring them to be in your directory.  
   - SAS tokens are signed with the storage account key or via a user delegation key (Entra ID-based).  
   - You can restrict by **time window, permissions, IP address, or protocol (HTTPS only)**.  
   - Example: Generate a SAS URL valid for 24 hours that allows read-only access to a specific container.

---

## ⚙️ Options for Your Scenario

| Audience | Best Practice Option | Notes |
|----------|----------------------|-------|
| **Internal users (in Entra ID)** | Assign RBAC roles (e.g., Storage Blob Data Reader/Contributor) | Strong security, integrates with corporate identity, supports conditional access. |
| **External users (not in Entra ID)** | Generate SAS tokens for containers/blobs | Short-term access, no directory account required, but must manage token distribution securely. |
| **Hybrid (both internal & external)** | Use **user delegation SAS** | Combines Entra ID authentication with SAS flexibility. Internal users authenticate via Entra ID, then generate SAS for external sharing. |

---

## 📘 AZ‑104 Exam Perspective

Expect questions around:

- **Authentication vs. Authorization**  
  - Authentication: verifying identity (Entra ID or SAS).  
  - Authorization: defining what they can do (RBAC roles or SAS permissions).

- **RBAC Roles for Storage**  
  - Storage Blob Data Reader → read-only access.  
  - Storage Blob Data Contributor → read/write access.  
  - Storage Blob Data Owner → full control.  
  - These are assigned at **subscription, resource group, storage account, or container level**.

- **SAS Tokens**  
  - Understand **account SAS vs. service SAS vs. user delegation SAS**.  
  - Know how to restrict scope (container vs. blob), permissions (read/write/delete), and expiry time.  
  - Best practice: always use **HTTPS only**, short expiry, and minimal permissions.

- **Best Practices**  
  - Use Entra ID for internal users (RBAC).  
  - Use SAS for external/temporary access.  
  - Rotate account keys regularly.  
  - Prefer **user delegation SAS** over account SAS for stronger security (ties SAS to Entra ID identity).  
  - Never expose account keys directly to end users.

---

## ✅ Bottom Line

- **Inside org (Entra ID users):** Use RBAC with Entra ID authentication.  
- **Outside org (non-Entra ID users):** Use SAS tokens for short-term access.  
- **Exam tip:** Always choose **Entra ID + RBAC** when possible (security best practice). Use SAS only when external sharing or temporary access is required.

---

Would you like me to create a **step-by-step practice lab** showing both methods — (1) assigning RBAC roles to an internal user, and (2) generating a SAS token for an external user — so you can rehearse exactly what the exam expects?

### Practice lab overview for securing Azure Storage with Entra ID RBAC and SAS

You’ll rehearse two common AZ-104 scenarios:
- **Internal users:** Grant access using Microsoft Entra ID (Azure AD) RBAC.
- **External users:** Provide short-term access using SAS (including user delegation SAS).

---

## Lab setup prerequisites

- **Roles:** You have Owner or User Access Administrator on the subscription and Storage Account Contributor on the storage account.
- **Resources:** An existing Storage Account with a Blob container (e.g., “files”) and at least one test blob.
- **Test identities:** One internal user in your Entra ID tenant; for external testing, you can use a personal email to simulate an end user.
- **Security baseline:** HTTPS enabled; know the storage account name and resource group.

---

## Internal users: Grant access with Microsoft Entra ID RBAC

#### Step 1: Identify the right data role
- **Role mapping:**  
  - **Storage Blob Data Reader:** Read-only blob/container access.  
  - **Storage Blob Data Contributor:** Read/write but not manage RBAC or account keys.  
  - **Storage Blob Data Owner:** Full data access, including setting ACLs at the data plane.

#### Step 2: Assign the role at the correct scope
- **Portal path:** Azure Portal > Storage accounts > Your storage account > Access control (IAM) > Add > Add role assignment.
- **Role:** Choose **Storage Blob Data Reader** (for practice).
- **Scope:**  
  - **Account-level:** Applies to all containers/blobs.  
  - **Container-level:** Azure Portal > Your storage account > Containers > files > Access control (IAM) > Add role assignment.
- **Assign:** Select your internal user or a security group. Click **Save**.

#### Step 3: Validate access with the Azure Portal
- **Test read:** Go to Storage account > Containers > files > Open a blob > Click **Download**. Confirm access succeeds.
- **Access error check:** If access fails, wait 5–10 minutes for RBAC propagation and retry.

#### Optional: Validate via Azure Storage Explorer or CLI
- **Storage Explorer:**  
  - **Sign-in:** Open Storage Explorer > Sign in with your Entra ID account.  
  - **Browse:** Navigate to your storage account > Blob containers > files and attempt to read.
- **CLI quick test:**  
  - **Sign-in:**  
    - az login  
  - **Set account context by name:**  
    - az storage account show -n <accountName> -g <resourceGroup>  
  - **List blobs with Entra ID auth:**  
    - az storage blob list --account-name <accountName> --container-name files --auth-mode login

---

## External users: Provide short-term access with SAS

You’ll practice two SAS methods:
- **Service/Account SAS signed with account key** (simpler, powerful—handle with care).
- **User delegation SAS** (recommended—ties to Entra ID identity and supports Conditional Access).

#### Step 1: Service SAS for a container or blob (account key)
- **Portal path:** Storage account > Data storage > Containers > files.
- **Generate SAS:**  
  - **Action:** Select the container (or a specific blob) > **Shared access signature**.  
  - **Permissions:** Choose **Read (r)** (and **List (l)** for container).  
  - **Expiry:** Keep short (e.g., 2 hours).  
  - **Network:** Restrict with **Allowed IP addresses** if possible.  
  - **Protocol:** Enforce **HTTPS only**.
- **Create SAS:** Click **Generate SAS token and URL**. Copy the SAS URL.
- **Share:** Provide the SAS URL to your external user. They can access directly via browser or client.

#### Step 2: User delegation SAS (preferred)
- **Precondition:** Your identity must have data-plane rights (e.g., Storage Blob Data Contributor) to request a user delegation key.
- **Portal alternative (conceptual):** The Portal’s SAS tool focuses on account SAS. To practice user delegation SAS, use CLI.
- **CLI flow:**  
  - **Login:**  
    - az login  
  - **Get user delegation key:**  
    - az storage account keys are not used; instead retrieve a user delegation key via:  
    - az storage container generate-sas --auth-mode login --account-name <accountName> --name files --permissions rl --expiry <YYYY-MM-DDTHH:MMZ>  
  - **Build SAS URL:**  
    - Combine the SAS token with the container or blob URL:  
    - https://<accountName>.blob.core.windows.net/files?<sasToken>
- **Share:** Send the SAS URL to the external user for time-bound access.

#### Step 3: Validate and lock down
- **Test:** Open the SAS URL in a private browser window; confirm it provides only the intended access.
- **Revocation strategy:**  
  - **Account SAS:** Regenerate account keys to invalidate all SAS signed with that key (broad impact).  
  - **User delegation SAS:** Expires automatically; you can reduce expiry or rotate your own access if needed.

---

## Best practices to memorize for AZ-104

- **Authorization choice:**  
  - **Internal users:** Prefer **Entra ID + RBAC** for least privilege and auditability.  
  - **External/temporary:** Use **SAS**, favor **user delegation SAS** over account SAS.
- **SAS hygiene:**  
  - **Minimal permissions:** Only the actions required (e.g., r, l).  
  - **Short expiry:** Hours, not days.  
  - **HTTPS only and optional IP restrictions.**
- **Key management:**  
  - **Avoid sharing account keys.** Rotate keys regularly.  
  - **Use managed identities** for apps/services that need ongoing access without secrets.
- **Scope selection:**  
  - **Grant at container** when only one container is needed.  
  - **Avoid subscription-level broad grants** unless necessary.
- **Troubleshooting:**  
  - **Propagation delays:** Wait a few minutes after role assignment.  
  - **Check the “aud/permissions” mismatch:** Ensure the client is using Entra ID auth when testing RBAC and the right SAS permissions when testing SAS.

---

## Quick practice checklist

- **RBAC:**  
  - **Assign:** Storage Blob Data Reader at container scope to an internal user.  
  - **Test:** Download a blob; confirm success.  
- **SAS (service SAS):**  
  - **Generate:** Read-only SAS for a single blob, 2-hour expiry, HTTPS only.  
  - **Test:** Access via private window.  
- **SAS (user delegation):**  
  - **Generate via CLI:** Permissions rl for container, short expiry.  
  - **Test:** Confirm access and expiration behavior.

If you want, I can tailor the commands and exact values to your storage account and container names for a copy-paste run-through.