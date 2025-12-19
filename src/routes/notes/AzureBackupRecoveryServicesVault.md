# Copilot Prompt
> "I need help preparing for the Azure AZ-104 certification renewal exam. Among the topics I need to learn more about is how to calculate the number of recovery points and instant recovery points exist in a recovery point collection. I know the answer depends on the backup policy, but I need more examples so I can test my understanding of how to calculate the number of recovery points and instant recovery points that will exist between arbitrary points in time in the recovery point collection."

# Copilot response
The number of recovery points and instant recovery points in Azure Backup depends on the backup frequency (daily/weekly), retention period, and the instant recovery snapshot retention defined in the backup policy. You calculate them by multiplying the backup frequency by the retention duration, then separately accounting for instant recovery snapshots (which are short-lived, usually 2–5 days).

# 🔑 Key Concepts
Recovery Point Collection (RPC): Each VM protected by Azure Backup has a recovery point collection that stores restore points.

Recovery Points: Created at each scheduled backup. Retained according to the policy (e.g., 7 days, 30 days, yearly).

Instant Recovery Points (Snapshots): Stored in the storage account for fast restores. They exist only for the configured retention (commonly 2 days).

Sources:


**Quick Answer:**  
The number of recovery points and instant recovery points in Azure Backup depends on the **backup frequency** (daily/weekly), **retention period**, and the **instant recovery snapshot retention** defined in the backup policy. You calculate them by multiplying the backup frequency by the retention duration, then separately accounting for instant recovery snapshots (which are short-lived, usually 2–5 days).  

---

## 🔑 Key Concepts

- **Recovery Point Collection (RPC):** Each VM protected by Azure Backup has a recovery point collection that stores restore points.  
- **Recovery Points:** Created at each scheduled backup. Retained according to the policy (e.g., 7 days, 30 days, yearly).  
- **Instant Recovery Points (Snapshots):** Stored in the storage account for fast restores. They exist only for the configured retention (commonly 2 days).  

Sources: 

---

## 📊 Example Scenarios

| Backup Policy | Frequency | Instant Recovery Retention | Recovery Point Retention | Calculation | Result |
|---------------|-----------|----------------------------|--------------------------|-------------|--------|
| Daily backup at 23:00 | 1/day | 2 days | 7 days | 7 recovery points + 2 instant recovery points | **9 total** |
| Daily backup at 23:00 | 1/day | 2 days | 30 days | 30 recovery points + 2 instant recovery points | **32 total** |
| Weekly backup (Sunday 02:00) | 1/week | 5 days | 12 weeks | 12 recovery points + 1 instant recovery point (only latest week snapshot retained) | **13 total** |
| Twice daily backup (08:00, 20:00) | 2/day | 3 days | 14 days | 28 recovery points + 6 instant recovery points | **34 total** |

---

## 🧮 How to Calculate Step-by-Step

1. **Determine backup frequency**  
   - Daily = 1 per day  
   - Twice daily = 2 per day  
   - Weekly = 1 per week  

2. **Multiply by retention period**  
   - Example: Daily × 7 days = 7 recovery points  

3. **Add instant recovery points**  
   - Instant recovery = frequency × instant retention days  
   - Example: Daily × 2 days = 2 instant recovery points  

4. **Total = Recovery Points + Instant Recovery Points**

---

## ⚠️ Important Notes

- **Instant recovery points are temporary.** They expire after the configured retention (default 2 days).  
- **Long-term retention** (weekly/monthly/yearly) adds additional recovery points beyond daily ones.  
- **Deleting a VM without stopping protection** may orphan recovery points, but they remain until retention expires.  
- **Exam trick:** Always separate *instant recovery points* (short-lived snapshots) from *vault recovery points* (long-term backups).  

---

## 📝 Practice Question (AZ-104 Style)

**Scenario:**  
VM1 is backed up daily at 23:00 UTC. Policy retains instant recovery snapshots for 2 days and daily recovery points for 10 days. On January 15, how many recovery points exist in the RPC?

**Solution:**  
- Daily backups = 10 recovery points  
- Instant recovery = 2 snapshots  
- **Total = 12 recovery points**

---

Would you like me to **generate a set of practice quiz questions** (multiple-choice, AZ-104 style) specifically on recovery point calculations so you can test yourself interactively?