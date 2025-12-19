---
---
# Question
From an AZ-104 exam perspective, what are the best practices for providing persistent storage to Docker containers running in Azure?

**Quick Answer:** For the AZ‑104 exam, the best practices for providing persistent storage to Docker containers in Azure are to use **Azure-managed storage services (Azure Files, Azure Disks, or Azure Blob Storage)** mounted into your containers, avoid storing data inside ephemeral container filesystems, and apply **RBAC, encryption, and lifecycle management** for security and durability.

---

## 🔑 Why Persistent Storage Matters
- **Containers are stateless by default**: When a container restarts, its local filesystem is lost.  
- **Persistent storage ensures durability**: Data survives container restarts, scaling events, and migrations.  
- **Exam focus**: AZ‑104 expects you to know which Azure storage service to use for different container scenarios.

---

## ⚙️ Best Practices for Persistent Storage in Azure Containers

| Storage Option | How It Works | Best Use Case | Exam Notes |
|----------------|--------------|---------------|------------|
| **Azure Files** | SMB/NFS file shares mounted into containers | Shared file access across multiple containers | Common exam answer for persistent storage in ACI/AKS |
| **Azure Disks** | Block-level storage attached to VMs or pods | Single-container or pod needing high IOPS | Used with AKS pods or VM-based Docker |
| **Azure Blob Storage** | Object storage accessed via SDK/REST | Large-scale unstructured data (logs, media) | Not directly mounted; accessed via APIs |
| **Azure Container Registry (ACR)** | Stores container images, not runtime data | Persistent storage for images | Exam may test difference between image storage vs. runtime data |

Sources: 

---

## 📘 Exam-Oriented Best Practices

1. **Never rely on container local storage**  
   - Containers are ephemeral; data is lost when restarted.  
   - Always mount Azure Files or Disks for persistence.

2. **Use Azure Files for shared access**  
   - Multiple containers can read/write simultaneously.  
   - Supports SMB and NFS protocols.  
   - Exam scenario: “Provide persistent storage for multiple Docker containers in Azure Container Instances” → Answer: **Azure Files**.

3. **Use Azure Disks for single-instance performance**  
   - Attach Premium SSDs for high IOPS workloads.  
   - Best for stateful apps needing dedicated storage.  
   - Exam scenario: “Provide persistent storage for a single container needing high performance” → Answer: **Azure Disks**.

4. **Secure storage with RBAC and encryption**  
   - Assign roles like **Storage Blob Data Contributor**.  
   - Enable encryption at rest (default in Azure).  
   - Use managed identities for container access.

5. **Automate lifecycle management**  
   - Configure blob lifecycle policies for cost optimization.  
   - Exam may ask about reducing storage costs for logs or backups.

6. **Networking & access control**  
   - Restrict storage account access with **VNET integration** and **private endpoints**.  
   - Exam scenario: “Ensure only containers in a VNET can access storage” → Answer: **Private endpoint**.

---

## ⚠️ Risks & Trade-offs
- **Local container storage**: Lost on restart; not exam best practice.  
- **Account keys for access**: Less secure than managed identities; exam expects you to prefer **Azure AD authentication**.  
- **Blob storage mounting**: Not natively supported; must use SDK/API.  

---

## ✅ Bottom Line for AZ‑104
- **Azure Files** → Best for shared persistent storage across containers.  
- **Azure Disks** → Best for single-container persistent storage with high performance.  
- **Blob Storage** → Best for object data, accessed via APIs, not mounts.  
- Always secure with **RBAC, managed identities, and encryption**.  

---

Perfect — let’s build a **hands-on lab** you can rehearse for the AZ‑104 exam. This will show you how to mount **Azure Files** into a container running in **Azure Container Instances (ACI)**.  

---

## 🧪 Lab Exercise: Mount Azure Files into a Container

### Prerequisites
- An Azure subscription with permissions to create resources.
- **Azure CLI** installed (or use Cloud Shell).
- A resource group created (e.g., `az group create -n myRG -l eastus`).
- A storage account created (e.g., `az storage account create -n mystorageacct -g myRG -l eastus --sku Standard_LRS`).

---

### Step 1: Create an Azure File Share
```bash
# Create a file share named 'myshare'
az storage share-rm create \
  --resource-group myRG \
  --storage-account mystorageacct \
  --name myshare
```

---

### Step 2: Retrieve Storage Account Key
```bash
# Get the storage account key
az storage account keys list \
  --resource-group myRG \
  --account-name mystorageacct \
  --query "[0].value" -o tsv
```
Save this key — you’ll need it to mount the file share.

---

### Step 3: Create a Container Instance with Azure Files Mount
```bash
az container create \
  --resource-group myRG \
  --name mycontainer \
  --image mcr.microsoft.com/azuredocs/aci-helloworld \
  --azure-file-volume-share-name myshare \
  --azure-file-volume-account-name mystorageacct \
  --azure-file-volume-account-key <storage-account-key> \
  --azure-file-volume-mount-path /mnt/azfiles \
  --dns-name-label mycontainerdemo \
  --ports 80
```

- `--azure-file-volume-share-name`: The file share you created.  
- `--azure-file-volume-mount-path`: Path inside the container where the share will be mounted.  
- `--dns-name-label`: Creates a public FQDN for testing.  

---

### Step 4: Verify the Mount
1. **Check container logs**:
   ```bash
   az container logs --resource-group myRG --name mycontainer
   ```
   Confirm the container started successfully.

2. **Exec into the container**:
   ```bash
   az container exec --resource-group myRG --name mycontainer --exec-command "/bin/sh"
   ```
   Inside the shell:
   ```bash
   ls /mnt/azfiles
   ```
   You should see the mounted Azure Files directory.

---

### Step 5: Test Persistence
- Upload a file directly to the Azure File Share:
  ```bash
  echo "Hello from Azure Files!" > hello.txt
  az storage file upload \
    --account-name mystorageacct \
    --account-key <storage-account-key> \
    --share-name myshare \
    --source hello.txt
  ```
- Inside the container, check:
  ```bash
  cat /mnt/azfiles/hello.txt
  ```
  You’ll see the message, proving persistence.

---

## 📘 AZ‑104 Exam Best Practices to Remember
- **Use Azure Files for shared persistent storage** across multiple containers.  
- **Use Azure Disks for single-container high-performance storage**.  
- **Never rely on container local storage** (ephemeral).  
- **Secure access** with RBAC and managed identities instead of account keys when possible.  
- **Always enforce HTTPS** and least privilege for storage access.  

---

✅ **Bottom Line:** Mounting Azure Files into containers is the recommended way to provide persistent, shared storage in Azure Container Instances.  

Excellent — let’s build a **parallel lab for AKS (Azure Kubernetes Service)** showing how to mount **Azure Files** into Kubernetes pods. This is a common AZ‑104 exam scenario because it tests your ability to provide persistent storage to containerized workloads.

---

## 🧪 Lab Exercise: Mount Azure Files into AKS Pods

### Prerequisites
- An AKS cluster deployed (`az aks create` or via Portal).
- `kubectl` configured to connect to your AKS cluster (`az aks get-credentials`).
- An Azure Storage Account with a file share created (similar to the ACI lab).

---

### Step 1: Create a Storage Account and File Share
```bash
# Create storage account
az storage account create \
  --resource-group myRG \
  --name mystorageacct \
  --location eastus \
  --sku Standard_LRS

# Create file share
az storage share-rm create \
  --resource-group myRG \
  --storage-account mystorageacct \
  --name myshare
```

---

### Step 2: Get Storage Account Key
```bash
az storage account keys list \
  --resource-group myRG \
  --account-name mystorageacct \
  --query "[0].value" -o tsv
```
Save this key — you’ll use it in a Kubernetes secret.

---

### Step 3: Create a Kubernetes Secret for Storage Credentials
```bash
kubectl create secret generic azure-secret \
  --from-literal=azurestorageaccountname=mystorageacct \
  --from-literal=azurestorageaccountkey=<storage-account-key>
```

This secret will be referenced by your pod definition.

---

### Step 4: Define a Pod with Azure Files Volume
Create a YAML file `azure-files-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: azure-files-pod
spec:
  containers:
  - name: mycontainer
    image: mcr.microsoft.com/azuredocs/aci-helloworld
    volumeMounts:
    - name: azurefiles
      mountPath: /mnt/azure
  volumes:
  - name: azurefiles
    azureFile:
      secretName: azure-secret
      shareName: myshare
      readOnly: false
```

---

### Step 5: Deploy the Pod
```bash
kubectl apply -f azure-files-pod.yaml
```

---

### Step 6: Verify the Mount
1. **Check pod status**:
   ```bash
   kubectl get pods
   ```
   Ensure `azure-files-pod` is running.

2. **Exec into the pod**:
   ```bash
   kubectl exec -it azure-files-pod -- /bin/sh
   ```
   Inside the container:
   ```bash
   ls /mnt/azure
   ```
   You should see the mounted Azure Files directory.

---

### Step 7: Test Persistence
- Upload a file directly to the Azure File Share:
  ```bash
  echo "Hello from AKS!" > hello.txt
  az storage file upload \
    --account-name mystorageacct \
    --account-key <storage-account-key> \
    --share-name myshare \
    --source hello.txt
  ```
- Inside the pod:
  ```bash
  cat /mnt/azure/hello.txt
  ```
  You’ll see the message, proving persistence.

---

## 📘 AZ‑104 Exam Best Practices
- **Use Azure Files for shared persistent storage** across multiple pods.  
- **Use Azure Disks for single-pod high-performance storage**.  
- **Never rely on pod ephemeral storage**.  
- **Secure access with Kubernetes secrets** (not hardcoding keys).  
- **Prefer managed identities** and CSI drivers for production (exam may test awareness).  
- **Always enforce least privilege** and short-lived credentials.

---

✅ **Bottom Line:** In AKS, you mount Azure Files into pods by creating a Kubernetes secret with storage credentials, referencing it in your pod spec, and mounting the share as a volume. This ensures persistent, shared storage across container restarts and scaling events.

---

Would you like me to also show you the **CSI driver approach** (the newer, recommended method for AKS) so you’re prepared if the exam asks about modern best practices?

Perfect — let’s walk through the **modern approach** for mounting Azure Files into AKS pods using the **CSI (Container Storage Interface) driver**. This is the recommended method today and is increasingly emphasized in AZ‑104 exam scenarios.

---

## 🧪 Lab Exercise: Mount Azure Files into AKS Pods with CSI Driver

### Why CSI Driver?
- **Modern standard**: CSI drivers decouple storage plugins from Kubernetes core, making them easier to update and maintain.
- **Flexibility**: Supports advanced features like snapshots, dynamic provisioning, and identity-based access.
- **Best practice**: Microsoft recommends using CSI drivers instead of the older in-tree `azureFile` volume type.

---

### Step 1: Ensure CSI Driver is Installed
- New AKS clusters (v1.21+) have the **Azure Files CSI driver** installed by default.
- Verify:
  ```bash
  kubectl get csidrivers
  ```
  Look for `file.csi.azure.com`.

---

### Step 2: Create a Storage Class for Azure Files
Create a file named `azurefile-sc.yaml`:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: azurefile-csi
provisioner: file.csi.azure.com
parameters:
  skuName: Standard_LRS   # or Premium_LRS for higher performance
reclaimPolicy: Delete
volumeBindingMode: Immediate
```

Apply it:
```bash
kubectl apply -f azurefile-sc.yaml
```

---

### Step 3: Create a PersistentVolumeClaim (PVC)
Create a file named `azurefile-pvc.yaml`:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: azurefile-pvc
spec:
  accessModes:
    - ReadWriteMany   # multiple pods can share
  resources:
    requests:
      storage: 5Gi
  storageClassName: azurefile-csi
```

Apply it:
```bash
kubectl apply -f azurefile-pvc.yaml
```

---

### Step 4: Create a Pod that Uses the PVC
Create a file named `azurefile-pod.yaml`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: azurefile-csi-pod
spec:
  containers:
  - name: mycontainer
    image: mcr.microsoft.com/azuredocs/aci-helloworld
    volumeMounts:
    - mountPath: "/mnt/azure"
      name: azurefile
  volumes:
  - name: azurefile
    persistentVolumeClaim:
      claimName: azurefile-pvc
```

Apply it:
```bash
kubectl apply -f azurefile-pod.yaml
```

---

### Step 5: Verify the Mount
1. Check pod status:
   ```bash
   kubectl get pods
   ```
   Ensure `azurefile-csi-pod` is running.

2. Exec into the pod:
   ```bash
   kubectl exec -it azurefile-csi-pod -- /bin/sh
   ```
   Inside the container:
   ```bash
   ls /mnt/azure
   ```
   You should see the mounted Azure Files directory.

---

## 📘 AZ‑104 Exam Best Practices with CSI
- **Use CSI drivers** for persistent storage in AKS (modern, supported approach).
- **StorageClass + PVC** pattern is the standard way to provision storage dynamically.
- **AccessModes**:  
  - `ReadWriteOnce` → single pod access.  
  - `ReadWriteMany` → multiple pods access (Azure Files supports this).  
- **Security**: Prefer **managed identities** and CSI driver secrets over embedding account keys.
- **Performance**: Use **Premium_LRS** for latency-sensitive workloads.
- **Lifecycle**: PVCs and StorageClasses allow Kubernetes to manage storage lifecycle automatically.

---

✅ **Bottom Line:** In AKS, the modern best practice is to use the **Azure Files CSI driver** with a **StorageClass + PVC + Pod** workflow. This ensures persistent, secure, and scalable storage for containerized workloads.

---

Would you like me to also contrast this with the **Azure Disks CSI driver** (used for single-pod, high-performance storage) so you can clearly distinguish when to use **Files vs. Disks** in exam scenarios?

