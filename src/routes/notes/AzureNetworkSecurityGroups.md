# Question
> Is it true that Azure Network Storage Groups control traffic at the subnet/NIC rather than at the storage account level itself?

# Answer
> Yes, it is true that Azure Network Security Groups (NSGs) control traffic at the subnet/NIC level rather than at the storage account level itself. NSGs are stateful, rule-based traffic filters that control inbound and outbound traffic to Azure resources within Virtual Networks (VNets). They can be associated with either a subnet or individual network interfaces (NICs), and when associated with a subnet, the rules apply to all resources within that subnet. When associated with a NIC, the rules apply only to the specific virtual machine (VM) connected to that NIC. This allows for fine-grained control and is especially useful for implementing zero-trust policies within a shared subnet. 

# References
[How network security groups filter network traffic](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-group-how-it-works)
