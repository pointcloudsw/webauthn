---
---
**Question:** One more question, if I may.... I am still not clear on how many different apps I can run in my Azure App Service instance. It seems there's some sort of limitation that prevents mixing Windows and Linux in the same instance, but I need help understanding how that limitation relates to how many different apps I can run in a given Azure App Service instance. 
**Quick Answer:** You can run *multiple apps* in a single Azure App Service Plan, but all apps in that plan must share the same **OS type** (Windows or Linux). You cannot mix Windows and Linux apps in the same plan. The number of apps you can host depends on the **pricing tier**: Free = 1 app, Shared = 10 apps, Basic/Standard/Premium/Isolated = up to 100 apps per plan (effectively “unlimited” in higher tiers, subject to resource limits).

---

## 🔑 How App Service Plans Work
- **App Service Plan = compute resources** (VMs) that host your apps.  
- **Apps = web apps, APIs, functions** that run inside the plan.  
- **Scaling**: When you scale out the plan (e.g., 3 instances), *all apps in the plan* are replicated across those instances.  
- **OS Restriction**: A plan is either **Windows** or **Linux**. You cannot mix them. If you need both, create separate plans.  

---

## ⚙️ Limits by Pricing Tier

| Tier         | Max Apps per Plan | OS Options | Notes |
|--------------|------------------|------------|-------|
| Free         | 1                | Windows only | For dev/test only. |
| Shared       | 10               | Windows only | Shared compute. |
| Basic        | 100              | Windows or Linux | Dedicated compute. |
| Standard     | 100              | Windows or Linux | Production workloads. |
| Premium v1–v4| 100+ (effectively unlimited) | Windows or Linux | High performance, scaling. |
| Isolated     | Unlimited        | Windows or Linux | Dedicated environment (ASE). |

Sources: 

---

## 📘 Exam-Oriented Best Practices
- **Multiple apps per plan**: Cost‑effective, but apps share CPU/memory. Heavy apps can starve others.  
- **Per‑app scaling**: You can configure scaling per app so one app uses more instances than another.  
- **OS separation**: If you need both Windows and Linux apps, create separate App Service Plans.  
- **Storage limits**: Each plan has a storage quota (e.g., 50 GB). Apps share this quota.  
- **Exam tip**: If asked “Can you run Windows and Linux apps in the same App Service Plan?” → Answer: **No, separate plans are required.**  

---

## ⚠️ Risks & Trade-offs
- **Resource contention**: Multiple apps in one plan share resources; performance can degrade.  
- **Scaling impact**: Scaling out the plan scales *all apps* unless per‑app scaling is configured.  
- **Cost vs isolation**: Cheaper to host many apps in one plan, but isolating apps in separate plans improves reliability.  

---

✅ **Bottom Line:** You can host up to 100 apps per App Service Plan (depending on tier), but all apps in that plan must run on the same OS (Windows or Linux). To run both OS types, you need separate plans. For AZ‑104, remember: **App Service Plan = shared compute for multiple apps, but OS type cannot be mixed.**

---

+---------------------------------------------------+
|           Azure App Service Plan (Compute Pool)   |
|                                                   |
|   CPU / Memory / Storage resources                |
|                                                   |
|   +----------------+   +----------------+         |
|   |   App 1        |   |   App 2        |         |
|   | (Web/API)      |   | (Web/API)      |         |
|   +----------------+   +----------------+         |
|                                                   |
|   +----------------+                              |
|   |   App 3        |                              |
|   | (Web/API)      |                              |
|   +----------------+                              |
|                                                   |
+---------------------------------------------------+

Scale Out → Each instance replicates ALL apps

I wasn’t able to generate a visual diagram card for you just now because you’ve reached the image generation limit.  

Let me paint the picture in words instead so you can visualize it clearly:

---

## 🖼 Conceptual Diagram (Textual)

```
+---------------------------------------------------+
|           Azure App Service Plan (Compute Pool)   |
|                                                   |
|   CPU / Memory / Storage resources                |
|                                                   |
|   +----------------+   +----------------+         |
|   |   App 1        |   |   App 2        |         |
|   | (Web/API)      |   | (Web/API)      |         |
|   +----------------+   +----------------+         |
|                                                   |
|   +----------------+                              |
|   |   App 3        |                              |
|   | (Web/API)      |                              |
|   +----------------+                              |
|                                                   |
+---------------------------------------------------+

Scale Out → Each instance replicates ALL apps
```

---

## 🔑 Key Points
- **App Service Plan = shared compute pool** (VMs with CPU, memory, storage).  
- **Multiple apps** (App1, App2, App3) run inside the same plan, sharing resources.  
- **Scaling out**: If you scale the plan to 3 instances, *all apps* are replicated across those 3 instances.  
- **OS restriction**: All apps in a plan must be **Windows OR Linux** — you cannot mix.  
- **Resource contention**: Heavy apps can consume more CPU/memory, affecting others in the same plan.  

---

✅ **Bottom Line:** Think of the App Service Plan as a “box of compute.” You can put multiple apps inside that box, but they all share the same pool of resources and must run on the same OS type. Scaling out replicates the entire box (and all apps inside it) across multiple instances.

---

Here’s a **comparison table** to help you clearly see when it makes sense to host multiple apps in a single **Azure App Service Plan** versus when you should split them into **separate plans**.  

---

## 📊 One Plan vs Separate Plans

| Scenario | One App Service Plan (Multiple Apps) | Separate App Service Plans (One App per Plan) |
|----------|--------------------------------------|-----------------------------------------------|
| **OS Type** | All apps must share the same OS (Windows **or** Linux). | Allows mixing OS types (Windows in one plan, Linux in another). |
| **Cost Efficiency** | More cost‑effective: multiple apps share the same compute resources. | Higher cost: each plan has its own dedicated compute resources. |
| **Resource Sharing** | Apps share CPU, memory, and storage quota (e.g., 50 GB). Heavy apps can impact others. | Each app has isolated resources, no contention. |
| **Scaling** | Scaling out the plan replicates **all apps** across instances. Per‑app scaling is possible but still tied to the plan. | Each app scales independently, without affecting others. |
| **Performance Isolation** | Not ideal for mission‑critical apps; noisy neighbors can degrade performance. | Best for critical apps needing guaranteed performance. |
| **Management Simplicity** | Easier to manage fewer plans; good for dev/test or lightweight apps. | More granular control; better for production workloads with different requirements. |
| **Limits** | Free = 1 app, Shared = 10 apps, Basic/Standard/Premium = up to 100 apps per plan. | Each plan has the same limits, but apps are isolated. |
| **Exam Tip** | Use one plan for cost savings when apps have similar performance needs and same OS. | Use separate plans when apps need different OS types, scaling, or performance isolation. |

---

## ✅ Bottom Line
- **One Plan (Multiple Apps):** Best for cost savings, dev/test, or lightweight apps with similar requirements.  
- **Separate Plans:** Best for production workloads needing isolation, different OS types, or independent scaling.  

---

Would you like me to also create a **set of exam‑style scenario questions** (multiple choice) specifically around App Service Plans, so you can practice applying this knowledge under test conditions?


### Azure App Service Limits
| Resource | Free | Shared | Basic | Standard | Premium (v1-v4) | Isolated </th> |
| --- | --- | --- | --- | --- | --- | --- |
| [Apps](https://azure.microsoft.com/services/app-service/) per [Azure App Service plan](../articles/app-service/overview-hosting-plans.md)<sup>1</sup> |10 |100 |Unlimited<sup>2</sup> |Unlimited<sup>2</sup> |Unlimited<sup>2</sup> |Unlimited<sup>2</sup>|
| App Service environments | | | | | | X |
| Windows code-only |X | X | X | X | X | X |
| Windows containers | | | | | X | X |
| Linux code-only and containers |X | | X | X | X | X |
| Compute instance type |Shared |Shared |Dedicated<sup>3</sup> |Dedicated<sup>3</sup> |Dedicated<sup>3</sup></p> |Dedicated<sup>3</sup>|
| [App Service plan](../articles/app-service/overview-hosting-plans.md) |10 per region |10 per resource group |100 per resource group |100 per resource group |100 per resource group |100 per resource group|
| Compute instance type |Shared |Shared |Dedicated<sup>3</sup> |Dedicated<sup>3</sup> |Dedicated<sup>3</sup></p> |Dedicated<sup>3</sup>|
| [Scale out](../articles/app-service/manage-scale-up.md) (maximum instances) |1 shared |1 shared |3 dedicated<sup>3</sup> |10 dedicated<sup>3</sup> | 20 dedicated for v1; 30 dedicated for v2, v3, and v4.<sup>3</sup>|100 dedicated<sup>4</sup>|
| Storage<sup>5</sup> |1 GB<sup>5</sup> |1 GB<sup>5</sup> |10 GB<sup>5</sup> |50 GB<sup>5</sup> |250 GB<sup>5</sup> |1 TB<sup>12</sup> <br/><br/> The available storage quota is 999 GB. |
| CPU time (5 minutes)<sup>6</sup> |3 minutes |3 minutes |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a>|
| CPU time (day)<sup>6</sup> |60 minutes |240 minutes |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |Unlimited, pay at standard [rates](https://azure.microsoft.com/pricing/details/app-service/)</a> |
| Memory (1 hour) |1,024 MB per App Service plan |1,024 MB per app |N/A |N/A |N/A |N/A |
| Bandwidth |165 MB |Unlimited, [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/) apply |Unlimited, [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/) apply |Unlimited, [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/) apply |Unlimited, [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/) apply |Unlimited, [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/) apply |
| Application architecture |32-bit |32-bit |32-bit/64-bit |32-bit/64-bit |32-bit/64-bit |32-bit/64-bit |
| WebSockets per instance (Windows)<sup>7</sup> |5 |35 |350 |Unlimited |Unlimited |Unlimited |
| WebSockets per instance (Linux)<sup>7</sup> |5 |N/A |~50K  |~50K  |~50K  |~50K  |
| Outbound IP connections per instance | 600 | 600 | Depends on instance size<sup>8</sup> | Depends on instance size<sup>8</sup> | Depends on instance size<sup>8</sup> | 16,000 |
| Concurrent [debugger connections](../articles/app-service/troubleshoot-dotnet-visual-studio.md) per application |1 |1 |1 |5 |5 |5 |
| App Service Certificates per subscription | Not supported | Not supported |10 |10 |10 |10 |
| Custom domains per app</a> |0 (azurewebsites.net subdomain only)|500 |500 |500 |500 |500 |
| Custom domain [SSL support](../articles/app-service/configure-ssl-certificate.md) |Not supported, wildcard certificate for \*.azurewebsites.net available by default|Not supported, wildcard certificate for \*.azurewebsites.net available by default|Unlimited SNI SSL connections |Unlimited SNI SSL and 1 IP SSL connections included |Unlimited SNI SSL and 1 IP SSL connections included | Unlimited SNI SSL and 1 IP SSL connections included|
| [Hybrid connections](../articles/app-service/app-service-hybrid-connections.md) | | | 5 per plan | 25 per plan | 220 per app | 220 per app |
| [Virtual Network Integration](../articles/app-service/overview-vnet-integration.md) | | | X  |  X |  X  |  X  |
| [Private Endpoints](../articles/app-service/networking/private-endpoint.md) | | | 100 per app | 100 per app | 100 per app |    |
| Integrated load balancer | |X |X |X |X |X<sup>9</sup> |
| [Access restrictions](../articles/app-service/networking-features.md#access-restrictions) | 512 rules per app | 512 rules per app | 512 rules per app | 512 rules per app | 512 rules per app | 512 rules per app |
| [Always On](../articles/app-service/configure-common.md) | | |X |X |X |X |
| [Custom scheduled backups](../articles/app-service/manage-backup.md) | | | Scheduled backups every 2 hours, a maximum of 12 backups per day (manual + scheduled | Scheduled backups every 2 hours, a maximum of 12 backups per day (manual + scheduled) | Scheduled backups every hour, a maximum of 50 backups per day (manual + scheduled) | Scheduled backups every hour, a maximum of 50 backups per day (manual + scheduled) |
| [Autoscale](../articles/app-service/manage-scale-up.md) | | | |X |X |X |
| [WebJobs](../articles/app-service/webjobs-create.md)<sup>10</sup> |X |X |X |X |X |X |
| [Endpoint monitoring](../articles/app-service/web-sites-monitor.md) | | |X |X |X |X |
| [Staging slots](../articles/app-service/deploy-staging-slots.md) per app| | | |5 |20 |20 |
| [Testing in Production](../articles/app-service/deploy-staging-slots.md#route-production-traffic-automatically)| | | |X |X |X |
| [Diagnostic Logs](../articles/app-service/troubleshoot-diagnostic-logs.md) | X | X | X | X | X | X |
| Kudu | X | X | X | X | X | X |
| [Authentication and Authorization](../articles/app-service/overview-authentication-authorization.md) | X | X | X | X | X | X |
| [App Service Managed Certificates](https://azure.microsoft.com/updates/secure-your-custom-domains-at-no-cost-with-app-service-managed-certificates-preview/)<sup>11</sup> | |  | X | X | X | X |
| SLA | |  |99.95%|99.95%|99.95%|99.95%|

<sup>1</sup> Apps and storage quotas are per App Service plan unless noted otherwise.

<sup>2</sup> The actual number of apps that you can host on these machines depends on the activity of the apps, the size of the machine instances, and the corresponding resource utilization.

<sup>3</sup> Dedicated instances can be of different sizes. For more information, see [App Service pricing](https://azure.microsoft.com/pricing/details/app-service/).

<sup>4</sup> More are allowed upon request.

<sup>5</sup> The storage limit is the total content size across all apps in the same App service plan. The total content size of all apps across all App service plans in a single resource group and region cannot exceed 500 GB. The file system quota for App Service hosted apps is determined by the aggregate of App Service plans created in a region and resource group.

<sup>6</sup> These resources are constrained by physical resources on the dedicated instances (the instance size and the number of instances).

<sup>7</sup>If you scale a Windows app in the Basic tier to two instances, you have 350 concurrent connections for each of the two instances. For Windows apps on Standard tier and above, there are no theoretical limits to WebSockets, but other factors can limit the number of WebSockets. For example, maximum concurrent requests allowed (defined by `maxConcurrentRequestsPerCpu`) are: 7,500 per small VM, 15,000 per medium VM (7,500 x 2 cores), and 75,000 per large VM (18,750 x 4 cores). Linux apps are limited 5 concurrent WebSocket connections on Free SKU and ~50k concurrent WebSocket connections per instance on all other SKUs.

<sup>8</sup> The maximum IP connections are per instance and depend on the instance size: 1,920 per B1/S1/P0V3/P1V3/P0V4/P1V4 instance, 3,968 per B2/S2/P2V3/P2V4 instance, 8,064 per B3/S3/P3V3/P4V4 instance.

<sup>9</sup> App Service Isolated SKUs can be internally load balanced (ILB) with Azure Load Balancer, so there's no public connectivity from the internet. As a result, some features of an ILB Isolated App Service must be used from machines that have direct access to the ILB network endpoint.

<sup>10</sup> Run custom executables and/or scripts on demand, on a schedule, or continuously as a background task within your App Service instance. Always On is required for continuous WebJobs execution. There's no predefined limit on the number of WebJobs that can run in an App Service instance. There are practical limits that depend on what the application code is trying to do.

<sup>11</sup> Only issuing standard certificates (wildcard certificates aren't available). Limited to only one free certificate per custom domain.

<sup>12</sup> Total storage usage across all apps deployed in a single App Service environment (regardless of how they're allocated across different resource groups).

Here’s an **expert‑level quiz** on **Azure App Service Plans**. I’ve built it to go deeper than the earlier quiz, and I’ve ensured none of the questions are reused.  

---

## 🧠 Expert-Level Quiz: Azure App Service Plans

**Q1.** You have 50 apps running in a single Standard App Service Plan. One app consistently consumes high CPU, degrading performance for others. What’s the best solution?  
- A. Scale out the plan to more instances  
- B. Move the heavy app to its own App Service Plan  
- C. Enable per‑app scaling for the heavy app  
- D. Upgrade the plan to Premium tier  
**Answer:** B  
**Explanation:** Isolation is required. Scaling out or upgrading still shares resources; separate plan ensures performance.

---

**Q2.** You need to host 20 apps, half on Windows and half on Linux. Cost efficiency is important, but OS requirements must be met. What’s the best approach?  
- A. One App Service Plan for all apps  
- B. Two App Service Plans: one Windows, one Linux  
- C. Use Premium tier to mix OS types  
- D. Deploy Linux apps in containers inside the Windows plan  
**Answer:** B  
**Explanation:** OS types cannot be mixed. Separate plans are required.

---

**Q3.** You scale out an App Service Plan to 5 instances. One app requires 10 instances for load, while others only need 2. How do you achieve this?  
- A. Create separate App Service Plans for each app  
- B. Use per‑app scaling to assign different instance counts  
- C. Upgrade to Isolated tier  
- D. Increase the plan’s instance count to 10  
**Answer:** B  
**Explanation:** Per‑app scaling allows different apps in the same plan to scale independently.

---

**Q4.** Which of the following is a limitation of App Service Plans that often impacts architecture decisions?  
- A. Apps cannot share storage quotas  
- B. Apps cannot share networking configuration  
- C. Apps must share the same OS type  
- D. Apps cannot scale independently  
**Answer:** C  
**Explanation:** OS type is fixed per plan. Storage and networking are shared, but scaling can be per‑app.

---

**Q5.** You want to minimize cost by hosting multiple apps in one plan, but also need to ensure compliance with different departments’ billing. What’s the best solution?  
- A. Use separate App Service Plans for each department  
- B. Use tags and Azure Cost Management to track usage  
- C. Enable per‑app scaling for billing separation  
- D. Use separate subscriptions for each department  
**Answer:** B  
**Explanation:** Tags + Cost Management allow tracking costs even when apps share a plan.

---

**Q6.** An app requires 200 GB of storage. Which App Service Plan tier supports this requirement?  
- A. Free  
- B. Shared  
- C. Premium v2/v3  
- D. Basic  
**Answer:** C  
**Explanation:** Premium tiers support larger storage quotas (up to 250 GB). Free/Shared/Basic are limited to 50 GB.

---

**Q7.** You deploy multiple apps in one App Service Plan. Which of the following is true about scaling?  
- A. Scaling out applies only to the largest app  
- B. Scaling out replicates all apps across all instances  
- C. Scaling out requires redeployment of each app  
- D. Scaling out is not supported when multiple apps share a plan  
**Answer:** B  
**Explanation:** Scaling out replicates all apps across the new instances.

---

## ✅ Bottom Line
This expert‑level quiz emphasizes **isolation vs cost trade‑offs**, **per‑app scaling**, **OS restrictions**, and **storage quotas** — exactly the kinds of nuanced details AZ‑104 exam questions test.  


---

# 🧪 Scenario Exercise: App Service Plan Architectures

### Scenario 1: Mixed OS Requirements
Your company needs to host 12 apps.  
- 8 apps are lightweight internal tools (Windows).  
- 4 apps are customer‑facing APIs (Linux).  
Cost efficiency is important, but OS requirements must be respected.  

**Options:**  
A. Host all apps in one Premium App Service Plan.  
B. Create one Windows App Service Plan for the 8 apps, and one Linux App Service Plan for the 4 apps.  
C. Use VM Scale Sets to host all apps.  
D. Deploy Linux apps in containers inside the Windows plan.  

**Best Answer:** **B**  
👉 App Service Plans cannot mix OS types. Separate plans per OS is required.

---

### Scenario 2: Performance Isolation
You have 25 apps in one Standard App Service Plan. One app is mission‑critical and frequently spikes CPU usage, impacting others.  

**Options:**  
A. Scale out the plan to 5 instances.  
B. Upgrade the plan to Premium tier.  
C. Move the mission‑critical app to its own App Service Plan.  
D. Enable per‑app scaling for the mission‑critical app.  

**Best Answer:** **C**  
👉 Isolation is the only way to guarantee performance. Scaling or upgrading still shares resources.

---

### Scenario 3: Departmental Cost Tracking
You host 40 apps across HR, Finance, and Marketing in one App Service Plan. Each department wants to see its own cost breakdown.  

**Options:**  
A. Create separate App Service Plans per department.  
B. Use tags on each app and track costs in Azure Cost Management.  
C. Enable per‑app scaling for billing separation.  
D. Move apps into separate subscriptions.  

**Best Answer:** **B**  
👉 Tags + Cost Management allow cost tracking without duplicating plans.

---

### Scenario 4: Scaling Requirements
You scale out an App Service Plan to 6 instances. One app needs 10 instances, while others only need 2.  

**Options:**  
A. Increase the plan to 10 instances (all apps scale to 10).  
B. Use per‑app scaling to assign different instance counts.  
C. Create separate App Service Plans for each app.  
D. Upgrade to Isolated tier.  

**Best Answer:** **B**  
👉 Per‑app scaling allows different apps in the same plan to scale independently.

---

### Scenario 5: Storage Quota
One app requires 200 GB of storage.  

**Options:**  
A. Host it in a Free plan.  
B. Host it in a Shared plan.  
C. Host it in a Premium v2/v3 plan.  
D. Host it in a Basic plan.  

**Best Answer:** **C**  
👉 Premium tiers support larger storage quotas (up to 250 GB). Free/Shared/Basic are limited to 50 GB.

---

## ✅ Exam Cram Takeaway
- **One plan, multiple apps** = cost savings, but shared resources.  
- **Separate plans** = isolation, different OS types, independent scaling.  
- **Per‑app scaling** = flexibility within one plan.  
- **Premium tiers** = larger storage quotas, higher performance.  
- **Tags + Cost Management** = track costs without duplicating plans.  

---

Would you like me to also create a **rapid‑fire “true or false” drill** on App Service Plans so you can practice recalling facts even faster?