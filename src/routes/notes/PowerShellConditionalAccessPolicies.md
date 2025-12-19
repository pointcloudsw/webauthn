---
---
# Question
Switching gears to PowerShell... from an AZ-104 perspective, how can I use PowerShell to restrict access to end users who are either in the Marketing department and working inside the United States OR to those who are in Sales and may work inside or outside the United States?

Great scenario — this blends **Azure AD (Microsoft Entra ID) conditional access** with **PowerShell automation**, which is exactly the kind of thing AZ‑104 wants you to understand. Let’s break it down:

---

## 🔑 Core Concepts
- **Authentication & Authorization**: Controlled via Microsoft Entra ID (Azure AD).
- **Conditional Access Policies**: Allow you to enforce rules based on **user attributes** (like department) and **conditions** (like location).
- **PowerShell Module**: You use the **AzureAD** or **Microsoft Graph PowerShell SDK** to script these policies.

---

## ⚙️ Step-by-Step with PowerShell

### Step 1: Connect to Microsoft Graph
```powershell
Connect-MgGraph -Scopes "Policy.ReadWrite.ConditionalAccess"
```

### Step 2: Define User Conditions
- Marketing department users inside the United States.
- Sales department users regardless of location.

You can target **Azure AD groups** instead of raw attributes, because Conditional Access policies are applied to groups/users.  
👉 Best practice: Create dynamic groups based on department attributes.

```powershell
# Marketing group (dynamic membership based on department)
New-AzureADMSGroup -DisplayName "Marketing-US" -Description "Marketing users in US" `
  -GroupTypes "DynamicMembership" -MailEnabled $false -SecurityEnabled $true `
  -MembershipRule "(user.department -eq \"Marketing\") -and (user.country -eq \"United States\")" `
  -MembershipRuleProcessingState "On"

# Sales group (dynamic membership based on department)
New-AzureADMSGroup -DisplayName "Sales-All" -Description "Sales users globally" `
  -GroupTypes "DynamicMembership" -MailEnabled $false -SecurityEnabled $true `
  -MembershipRule "(user.department -eq \"Sales\")" `
  -MembershipRuleProcessingState "On"
```

### Step 3: Create Conditional Access Policy
Now you can restrict access to specific apps (e.g., Azure Storage, App Service, Office 365) for those groups.

```powershell
# Example: Restrict access to a cloud app
New-MgConditionalAccessPolicy -DisplayName "Restrict Marketing-US and Sales-All" `
  -State "enabled" `
  -Conditions @{
      Users = @{
        IncludeGroups = @("<Marketing-US-GroupId>", "<Sales-All-GroupId>")
      }
      Locations = @{
        IncludeLocations = @("All") # Sales group can be global
        ExcludeLocations = @()      # Marketing group restricted by dynamic membership rule
      }
    } `
  -GrantControls @{
      BuiltInControls = @("mfa") # Example: require MFA
    }
```

---

## 📘 AZ‑104 Exam Best Practices
- **Use dynamic groups** for department/location targeting — don’t hardcode users.
- **Conditional Access** is the right tool for restricting access by department and geography.
- **Always prefer managed identities and RBAC** for app/service access; Conditional Access is for sign-in conditions.
- **Security best practice**: Require MFA for external or high‑risk access.
- **Exam tip**: If asked “How do you restrict access by department and location?” → Answer: **Conditional Access with dynamic groups**.

---

## ✅ Bottom Line
In PowerShell, you:
1. Create **dynamic groups** based on department and location attributes.  
2. Apply **Conditional Access policies** to those groups.  
3. Enforce restrictions (e.g., require MFA, block access, allow only from US).  

---

Here’s a **full PowerShell practice script** you can rehearse for the AZ‑104 exam scenario: restricting access to users based on **department** and **location** using **dynamic groups** and **Conditional Access policies**.  

This script uses the **Microsoft Graph PowerShell SDK**, which is the modern and exam‑relevant approach.

---

## 🧪 Practice Script: Conditional Access with Department + Location

```powershell
# Step 1: Connect to Microsoft Graph with appropriate permissions
Connect-MgGraph -Scopes "Policy.ReadWrite.ConditionalAccess Group.ReadWrite.All Directory.ReadWrite.All"

# Step 2: Create dynamic groups for Marketing (US only) and Sales (global)

# Marketing-US group: only Marketing department users in United States
$marketingGroup = New-MgGroup -DisplayName "Marketing-US" `
  -Description "Marketing users located in the United States" `
  -MailEnabled:$false -SecurityEnabled:$true `
  -GroupTypes @("DynamicMembership") `
  -MembershipRule '(user.department -eq "Marketing") -and (user.country -eq "United States")' `
  -MembershipRuleProcessingState "On"

# Sales-All group: all Sales department users regardless of location
$salesGroup = New-MgGroup -DisplayName "Sales-All" `
  -Description "Sales users globally" `
  -MailEnabled:$false -SecurityEnabled:$true `
  -GroupTypes @("DynamicMembership") `
  -MembershipRule '(user.department -eq "Sales")' `
  -MembershipRuleProcessingState "On"

# Step 3: Create a Conditional Access policy targeting these groups
# Example: Require MFA when accessing a cloud app (e.g., Office 365)

New-MgConditionalAccessPolicy -DisplayName "Restrict Marketing-US and Sales-All" `
  -State "enabled" `
  -Conditions @{
      Users = @{
        IncludeGroups = @($marketingGroup.Id, $salesGroup.Id)
      }
      Applications = @{
        IncludeApplications = @("Office365") # Example cloud app
      }
      Locations = @{
        IncludeLocations = @("All") # Sales group can be global
        ExcludeLocations = @()      # Marketing group restriction handled by dynamic membership rule
      }
    } `
  -GrantControls @{
      BuiltInControls = @("mfa") # Require MFA
    }

# Step 4: Verify policy creation
Get-MgConditionalAccessPolicy | Format-Table DisplayName, State
```

---

## 📘 How This Script Works
- **Dynamic groups**: Automatically include users based on their **department** and **country** attributes in Entra ID.  
- **Conditional Access policy**: Applies to those groups, requiring MFA when accessing a cloud app.  
- **Marketing-US group**: Restricts to Marketing users in the US.  
- **Sales-All group**: Includes all Sales users globally.  
- **Policy enforcement**: Ensures only those groups can access the app, with MFA required.  

---

## ✅ Exam Best Practices to Remember
- **Use dynamic groups** for attribute-based targeting (department, country).  
- **Conditional Access** is the right tool for restricting access by department and geography.  
- **Always require MFA** for external or high‑risk access.  
- **RBAC vs. Conditional Access**: RBAC controls resource permissions; Conditional Access controls sign‑in conditions.  
- **Managed identities** are preferred for apps/services; Conditional Access is for end‑user sign‑ins.  

---

⚡ **Tip for practice:** Run this script in a test tenant, then check group membership and sign‑in behavior. For the exam, focus on knowing **which tool to use (dynamic groups + Conditional Access)** and **how to enforce MFA/location restrictions**.

---

Got it — here’s the **legacy PowerShell practice script** using the **AzureAD module** (older approach, still exam‑relevant because AZ‑104 sometimes tests awareness of both).  

---

## 🧪 Practice Script: Conditional Access with AzureAD PowerShell (Legacy)

> ⚠️ Note: The **AzureAD** module is being replaced by the Microsoft Graph SDK, but you may still see references in exam questions. This script shows the older way.

```powershell
# Step 1: Connect to Azure AD
Connect-AzureAD

# Step 2: Create dynamic groups for Marketing (US only) and Sales (global)

# Marketing-US group: only Marketing department users in United States
$marketingGroup = New-AzureADMSGroup -DisplayName "Marketing-US" `
  -Description "Marketing users located in the United States" `
  -MailEnabled $false -SecurityEnabled $true `
  -GroupTypes @("DynamicMembership") `
  -MembershipRule '(user.department -eq "Marketing") -and (user.country -eq "United States")' `
  -MembershipRuleProcessingState "On"

# Sales-All group: all Sales department users regardless of location
$salesGroup = New-AzureADMSGroup -DisplayName "Sales-All" `
  -Description "Sales users globally" `
  -MailEnabled $false -SecurityEnabled $true `
  -GroupTypes @("DynamicMembership") `
  -MembershipRule '(user.department -eq "Sales")' `
  -MembershipRuleProcessingState "On"

# Step 3: Create a Conditional Access policy
# Note: In the legacy AzureAD module, Conditional Access policies are managed via AzureADMSConditionalAccessPolicy cmdlets

New-AzureADMSConditionalAccessPolicy -DisplayName "Restrict Marketing-US and Sales-All" `
  -State "enabled" `
  -Conditions @{
      Users = @{
        IncludeGroups = @($marketingGroup.Id, $salesGroup.Id)
      }
      Applications = @{
        IncludeApplications = @("Office365") # Example cloud app
      }
      Locations = @{
        IncludeLocations = @("All") # Sales group can be global
        ExcludeLocations = @()      # Marketing group restriction handled by dynamic membership rule
      }
    } `
  -GrantControls @{
      BuiltInControls = @("mfa") # Require MFA
    }

# Step 4: Verify policy creation
Get-AzureADMSConditionalAccessPolicy | Format-Table DisplayName, State
```

---

## 📘 Key Differences vs. Modern Graph SDK
- **Cmdlets**: Uses `AzureAD` and `AzureADMS*` cmdlets instead of `Mg*` cmdlets.  
- **Deprecation**: AzureAD module is legacy; Microsoft Graph SDK is the future.  
- **Exam awareness**: You may need to recognize both approaches, but **best practice answers** should lean toward Microsoft Graph.  

---

## ✅ Bottom Line
- **Legacy approach**: `AzureAD` module with `New-AzureADMSGroup` and `New-AzureADMSConditionalAccessPolicy`.  
- **Modern approach**: Microsoft Graph SDK with `New-MgGroup` and `New-MgConditionalAccessPolicy`.  
- **Exam tip**: If asked “Which PowerShell module should you use today?” → Answer: **Microsoft Graph SDK**.  

---

Would you like me to also create a **side‑by‑side comparison table** of the legacy vs. modern cmdlets so you can memorize them quickly for the exam?