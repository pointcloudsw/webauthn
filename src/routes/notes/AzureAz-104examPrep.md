---
---
**Quick Answer:** Focus your remaining study time on *hands‑on labs*, *practice exams*, and *core exam domains* (identity, governance, storage, compute, networking, monitoring). Don’t spread yourself thin — instead, drill into weak areas revealed by your past attempts, rehearse real Azure portal tasks, and use Microsoft Learn’s official study guide to align with the current exam objectives.  

---

## 🎯 Step 1: Diagnose Your Weak Spots
- **Review past score reports**: Identify domains where you consistently scored lowest (e.g., networking, storage, governance).  
- **Prioritize weak areas**: Spend 70% of your time on these, 30% reinforcing strong areas.  
- **AZ‑104 domains to master**:  
  - Manage Azure identities and governance  
  - Implement and manage storage  
  - Deploy and manage compute resources  
  - Configure and manage virtual networking  
  - Monitor and back up Azure resources  

---

## 🧪 Step 2: Shift to Hands‑On Practice
- **Azure Portal drills**: Rehearse tasks like creating VNets, assigning RBAC roles, configuring storage accounts, and enabling monitoring.  
- **Labs**: Use Microsoft Learn sandbox labs or spin up a free Azure subscription to practice.  
- **Muscle memory matters**: The exam often tests whether you know *where to click* and *how to configure*.  

---

## 📘 Step 3: Use Official & Targeted Study Resources
- **Microsoft Learn Study Guide**: Aligns with the latest exam objectives.  
- **Practice exams**: Take timed practice tests to simulate exam pressure.  
- **Refactored & ExamSnap guides**: Offer structured study plans and highlight updated topics like Entra ID, Bicep, and monitoring.  

---

## 🗂 Step 4: Build a Focused Study Plan
| Time Remaining | Focus Area | Action |
|----------------|------------|--------|
| Week 1 | Weakest domain (e.g., networking) | Daily portal labs + review docs |
| Week 2 | Second weakest domain (e.g., storage) | Practice RBAC, SAS, replication |
| Week 3 | Practice exams | Take 2–3 full practice tests, review mistakes |
| Final Days | Quick review | Flashcards on RBAC roles, storage types, networking terms |

---

## ⚠️ Risks & Trade‑offs
- **Over‑reliance on dumps**: Tempting, but risky and often outdated. Stick to official sources.  
- **Ignoring hands‑on practice**: Reading alone won’t prepare you; the exam is scenario‑based.  
- **Burnout**: Four attempts is tough — pace yourself, focus on quality study, not quantity.  

---

## ✅ Bottom Line
To maximize your chances:
1. **Target weak domains** with focused labs.  
2. **Rehearse portal tasks** until they feel second nature.  
3. **Use official study guides and practice exams** to align with current objectives.  
4. **Simulate exam conditions** to build confidence.  

---

Here’s a **3‑week crash study schedule** tailored for the AZ‑104 exam. It’s structured day‑by‑day so you can rehearse tasks in the Azure Portal, reinforce concepts with PowerShell/CLI, and test yourself with practice exams. The focus is on **hands‑on labs** and **exam‑style scenarios**, not just reading.

---

# 📅 Week 1: Identities & Governance (Your Foundation)
**Goal:** Master Entra ID (Azure AD), RBAC, and governance tools.

- **Day 1:**  
  - Review Microsoft Entra ID basics (users, groups, roles).  
  - Lab: Create users and groups; assign RBAC roles at subscription/resource group level.  
  - PowerShell: Practice `New-AzRoleAssignment`.

- **Day 2:**  
  - Study Conditional Access policies.  
  - Lab: Create a policy requiring MFA for Marketing users in US.  
  - PowerShell: Practice dynamic groups with `New-AzureADMSGroup`.

- **Day 3:**  
  - Governance: Azure Policy, Blueprints, and Resource Locks.  
  - Lab: Apply a policy to enforce tagging.  
  - CLI: `az policy assignment create`.

- **Day 4:**  
  - Practice exam questions on identity & governance.  
  - Flashcards: RBAC roles (Owner, Contributor, Reader, Storage Blob Data roles).

- **Day 5:**  
  - Lab: Create a management group hierarchy.  
  - Review cost management basics.  
  - Practice: Set a budget alert in Cost Management.

- **Day 6:**  
  - Consolidation: Rehearse portal navigation for IAM, Policy, and Cost Management.  
  - Practice exam (identity/governance section only).

- **Day 7:**  
  - Rest + light review.  
  - Flashcards on RBAC vs. Conditional Access vs. Azure Policy.

---

# 📅 Week 2: Storage & Compute (Core Services)
**Goal:** Be fluent in persistent storage, VMs, App Services, and containers.

- **Day 8:**  
  - Storage accounts: redundancy (LRS, GRS, ZRS).  
  - Lab: Create a storage account, enable soft delete.  
  - Practice SAS tokens (account SAS vs. user delegation SAS).

- **Day 9:**  
  - Lab: Assign RBAC roles for storage (Blob Data Reader/Contributor).  
  - CLI: `az storage blob list --auth-mode login`.

- **Day 10:**  
  - Compute: Deploy VMs with CLI and Portal.  
  - Lab: Attach disks, configure availability sets.  
  - Practice: Resize VM SKU.

- **Day 11:**  
  - App Services: Enable Easy Auth with Entra ID.  
  - Lab: Deploy a sample web app, configure authentication.  
  - Practice: Scale up/down App Service plan.

- **Day 12:**  
  - Containers: Azure Container Instances + AKS basics.  
  - Lab: Mount Azure Files into ACI and AKS pods (both legacy and CSI driver).  
  - Practice: Create a PVC in AKS.

- **Day 13:**  
  - Practice exam questions on storage & compute.  
  - Flashcards: Storage redundancy types, SAS vs. RBAC, VM availability options.

- **Day 14:**  
  - Rest + light review.  
  - Rehearse portal tasks for storage and compute.

---

# 📅 Week 3: Networking & Monitoring (High‑Value Exam Domains)
**Goal:** Be confident with VNets, NSGs, VPNs, and monitoring tools.

- **Day 15:**  
  - Networking fundamentals: VNets, subnets, peering.  
  - Lab: Create a VNet with 2 subnets; configure peering.  
  - CLI: `az network vnet peering create`.

- **Day 16:**  
  - Security: NSGs, ASGs, firewalls.  
  - Lab: Create NSG rules to allow/deny traffic.  
  - Practice: Apply NSG to subnet vs. NIC.

- **Day 17:**  
  - Hybrid networking: VPN Gateway, ExpressRoute basics.  
  - Lab: Configure a site‑to‑site VPN (conceptual if no hardware).  
  - Practice exam questions on hybrid networking.

- **Day 18:**  
  - Monitoring: Azure Monitor, Log Analytics, Alerts.  
  - Lab: Enable diagnostics on a VM; create an alert rule.  
  - CLI: `az monitor metrics list`.

- **Day 19:**  
  - Backup & Recovery: Azure Backup, Recovery Services vault.  
  - Lab: Configure VM backup; test restore.  
  - Practice: Enable soft delete for backups.

- **Day 20:**  
  - Full practice exam (all domains).  
  - Review mistakes carefully; revisit weak areas.

- **Day 21 (Final Day):**  
  - Light review only — don’t cram.  
  - Flashcards: RBAC roles, storage redundancy, networking terms.  
  - Portal drill: IAM, Storage, VNet, Monitor.  
  - Rest and prepare mentally for exam day.

---

## ✅ Exam Strategy
- **Hands‑on focus**: The exam is scenario‑based; knowing *where to click* matters more than memorization.  
- **Time management**: Practice exams should be timed (150 minutes).  
- **Weak area reinforcement**: After each practice exam, spend 1–2 hours reviewing only the questions you missed.  
- **Confidence building**: By Week 3, you should feel fluent in portal navigation and CLI basics.  

---

⚡ **Bottom Line:** This 3‑week crash plan balances **hands‑on labs**, **practice exams**, and **targeted review**. Stick to the schedule, rehearse tasks daily, and you’ll walk into your next AZ‑104 attempt with confidence.  
Perfect — here’s a **set of daily flashcards** aligned with the 3‑week crash study schedule I gave you. Each day’s cards are short Q&A style, so you can drill them quickly during downtime.  

---

# 📅 Week 1: Identities & Governance

**Day 1 – Entra ID Basics**
- Q: What’s the difference between Azure AD (Entra ID) and RBAC?  
  A: Entra ID authenticates identities; RBAC authorizes access to Azure resources.  
- Q: Which role grants full management rights to all resources?  
  A: Owner.  
- Q: Which role allows managing resources but not access?  
  A: Contributor.

**Day 2 – Conditional Access**
- Q: What’s Conditional Access used for?  
  A: Enforcing sign‑in conditions like MFA, location, or device compliance.  
- Q: How do you target users by department automatically?  
  A: Dynamic groups with membership rules.  
- Q: Best practice for external users?  
  A: Require MFA.

**Day 3 – Governance**
- Q: What does Azure Policy enforce?  
  A: Compliance rules (e.g., require tags, restrict VM sizes).  
- Q: What prevents accidental deletion of resources?  
  A: Resource Locks.  
- Q: What organizes subscriptions hierarchically?  
  A: Management Groups.

**Day 4 – RBAC Roles**
- Q: Storage Blob Data Reader vs Contributor?  
  A: Reader = read only; Contributor = read/write.  
- Q: What role is needed to assign RBAC?  
  A: User Access Administrator.  
- Q: What’s the least privilege principle?  
  A: Grant only the minimum rights needed.

**Day 5 – Cost Management**
- Q: How do you enforce spending limits?  
  A: Budgets in Cost Management.  
- Q: What tool forecasts future spend?  
  A: Cost Analysis.  
- Q: What’s the difference between tags and policies?  
  A: Tags label resources; policies enforce rules.

**Day 6 – Consolidation**
- Q: IAM vs Conditional Access vs Policy?  
  A: IAM = resource permissions; Conditional Access = sign‑in rules; Policy = compliance.  
- Q: What’s the default role for new users?  
  A: No role until assigned.  
- Q: What’s the exam tip for governance?  
  A: Always choose Policy for compliance enforcement.

---

# 📅 Week 2: Storage & Compute

**Day 8 – Storage Accounts**
- Q: LRS vs GRS vs ZRS?  
  A: LRS = local, GRS = geo‑redundant, ZRS = zone‑redundant.  
- Q: What’s soft delete?  
  A: Protects blobs from accidental deletion.  
- Q: SAS vs RBAC?  
  A: SAS = temporary access; RBAC = identity‑based access.

**Day 9 – Storage RBAC**
- Q: Which role allows uploading blobs?  
  A: Storage Blob Data Contributor.  
- Q: Which role allows full control?  
  A: Storage Blob Data Owner.  
- Q: How do you authenticate internal users?  
  A: Entra ID with RBAC.

**Day 10 – Virtual Machines**
- Q: What’s an availability set?  
  A: Ensures VMs are spread across fault/update domains.  
- Q: What’s a scale set?  
  A: Auto‑scaling group of identical VMs.  
- Q: What’s the difference between Standard HDD and Premium SSD?  
  A: Premium SSD = higher performance, lower latency.

**Day 11 – App Services**
- Q: What’s Easy Auth?  
  A: Built‑in authentication with Entra ID.  
- Q: How do you scale App Service?  
  A: Change App Service plan tier.  
- Q: What’s the difference between App Service plan and App Service?  
  A: Plan = compute resources; App Service = your app.

**Day 12 – Containers**
- Q: Which storage option supports ReadWriteMany?  
  A: Azure Files.  
- Q: Which storage option supports ReadWriteOnce?  
  A: Azure Disks.  
- Q: CSI driver vs legacy volume?  
  A: CSI driver = modern, recommended.

**Day 13 – Storage & Compute Review**
- Q: SAS token best practice?  
  A: Short expiry, HTTPS only, least privilege.  
- Q: VM backup tool?  
  A: Recovery Services vault.  
- Q: Exam tip: Persistent storage for multiple containers?  
  A: Azure Files.

---

# 📅 Week 3: Networking & Monitoring

**Day 15 – VNets**
- Q: What’s VNet peering?  
  A: Connects VNets for private communication.  
- Q: What’s a subnet?  
  A: Segment of a VNet for resource isolation.  
- Q: What’s the default DNS for VNets?  
  A: Azure‑provided DNS.

**Day 16 – Security**
- Q: NSG vs ASG?  
  A: NSG = rules at subnet/NIC; ASG = group of VMs for rules.  
- Q: What’s Azure Firewall?  
  A: Managed firewall service with logging.  
- Q: What’s DDoS Protection Standard?  
  A: Enhanced protection against distributed denial‑of‑service attacks.

**Day 17 – Hybrid Networking**
- Q: What’s a VPN Gateway?  
  A: Connects on‑premises to Azure via IPsec tunnel.  
- Q: ExpressRoute vs VPN?  
  A: ExpressRoute = private dedicated circuit; VPN = encrypted over internet.  
- Q: What’s a point‑to‑site VPN?  
  A: Connects individual devices to Azure.

**Day 18 – Monitoring**
- Q: What’s Azure Monitor?  
  A: Centralized metrics and logs.  
- Q: What’s Log Analytics?  
  A: Query logs with KQL.  
- Q: What’s Application Insights?  
  A: Monitor app performance and usage.

**Day 19 – Backup & Recovery**
- Q: What’s Recovery Services vault?  
  A: Stores backups for VMs and workloads.  
- Q: What’s soft delete for backups?  
  A: Prevents accidental deletion of backup data.  
- Q: What’s geo‑redundant backup storage?  
  A: Replicates backup data across regions.

**Day 20 – Full Practice Exam Prep**
- Q: IAM vs RBAC vs Conditional Access?  
  A: IAM = resource access; RBAC = role assignment; Conditional Access = sign‑in rules.  
- Q: Storage redundancy exam tip?  
  A: Always choose GRS for disaster recovery.  
- Q: Networking exam tip?  
  A: NSGs secure traffic; VPN/ExpressRoute connect hybrid.

**Day 21 – Final Review**
- Q: What’s the most secure way to grant app access?  
  A: Managed identities.  
- Q: What’s the difference between SAS and RBAC?  
  A: SAS = temporary link; RBAC = identity‑based.  
- Q: Exam strategy tip?  
  A: Read scenario carefully; choose least privilege, most secure option.

---

✅ **Bottom Line:** These flashcards mirror your crash schedule. Drill them daily — they’ll reinforce key facts, terminology, and best practices that AZ‑104 loves to test.  

Would you like me to also generate a **condensed “cheat sheet” PDF‑style summary** of all flashcards so you can skim them quickly before exam day?

Here’s your **AZ‑104 Exam Cram Scenario List** — a one‑page style summary of the most common case studies and the “best practice” answers. This is designed for last‑minute rehearsal so you can quickly recall the right solution under exam pressure.  

---

# 🔑 Identities & Governance
- **Scenario:** Restrict access to Marketing users in the US only.  
  **Answer:** Create dynamic Entra ID group (department + country) + Conditional Access policy.  
- **Scenario:** Prevent accidental deletion of critical resources.  
  **Answer:** Apply **Resource Locks** (Read‑only or Delete).  
- **Scenario:** Ensure all resources are tagged with “Department.”  
  **Answer:** Use **Azure Policy** to enforce tagging.  
- **Scenario:** Delegate resource access without giving full control.  
  **Answer:** Assign **RBAC roles** (Contributor, Reader, etc.) at the appropriate scope.  

---

# 📦 Storage
- **Scenario:** Internal users need persistent access to blobs.  
  **Answer:** Use **RBAC roles** (Storage Blob Data Reader/Contributor) with Entra ID authentication.  
- **Scenario:** External users need short‑term access to a container.  
  **Answer:** Generate **SAS token** (prefer user delegation SAS, short expiry, HTTPS only).  
- **Scenario:** Provide persistent storage to multiple containers.  
  **Answer:** Mount **Azure Files** share.  
- **Scenario:** Provide high‑performance storage to a single container/pod.  
  **Answer:** Use **Azure Disks**.  
- **Scenario:** Ensure disaster recovery for storage.  
  **Answer:** Choose **GRS (Geo‑Redundant Storage)**.  

---

# 💻 Compute
- **Scenario:** Ensure VM availability during maintenance.  
  **Answer:** Place VMs in an **Availability Set**.  
- **Scenario:** Scale out web servers automatically.  
  **Answer:** Deploy **VM Scale Sets**.  
- **Scenario:** Secure App Service with corporate identities.  
  **Answer:** Enable **Easy Auth** with Entra ID.  
- **Scenario:** Deploy containers with persistent shared storage.  
  **Answer:** Use **Azure Files CSI driver** in AKS.  

---

# 🌐 Networking
- **Scenario:** Connect two VNets privately.  
  **Answer:** Configure **VNet Peering**.  
- **Scenario:** Restrict inbound traffic to a subnet.  
  **Answer:** Apply **NSG rules** at subnet level.  
- **Scenario:** Connect on‑premises network to Azure securely.  
  **Answer:** Use **VPN Gateway** (IPsec tunnel).  
- **Scenario:** Provide dedicated private connectivity to Azure.  
  **Answer:** Use **ExpressRoute**.  
- **Scenario:** Protect against DDoS attacks.  
  **Answer:** Enable **DDoS Protection Standard**.  

---

# 📊 Monitoring & Backup
- **Scenario:** Collect logs and metrics across resources.  
  **Answer:** Use **Azure Monitor + Log Analytics**.  
- **Scenario:** Monitor app performance and usage.  
  **Answer:** Use **Application Insights**.  
- **Scenario:** Back up VMs and restore if needed.  
  **Answer:** Configure **Recovery Services Vault**.  
- **Scenario:** Prevent accidental deletion of backups.  
  **Answer:** Enable **Soft Delete** for backups.  
- **Scenario:** Alert when CPU > 80% for 5 minutes.  
  **Answer:** Create **Metric Alert** in Azure Monitor.  

---

# ⚡ Exam Strategy Quick Hits
- **Always choose least privilege** (RBAC over account keys, SAS with minimal permissions).  
- **Use managed identities** for apps/services instead of secrets.  
- **Enforce MFA** for external/high‑risk access.  
- **Know redundancy types** (LRS, ZRS, GRS).  
- **Portal fluency matters**: Be able to navigate IAM, Storage, Networking, Monitor quickly.  

---

✅ **Bottom Line:** If you can recall these scenario → best practice pairs, you’ll cover the majority of AZ‑104 exam questions.  

Would you like me to also create a **mock “scenario quiz”** (multiple choice style) using these cases so you can test yourself under exam‑like conditions?