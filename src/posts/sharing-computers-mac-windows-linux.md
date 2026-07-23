---
title: "Sharing Files Between Mac, Windows, and Linux"
date: 2026-07-26
description: "Set up file sharing between Mac, Windows, and Linux on a local network: SMB configuration, access methods, and quick reference."
tags: ["networking"]
status: published
---

Sharing files across operating systems on the same network uses SMB (Server Message Block). Each OS sets it up differently, but the access pattern is the same.

## Windows

1. Note your Windows IP (e.g., `192.168.255.179`)
2. Go to **Control Panel** → **Sharing** → **Advanced Sharing Settings**
3. Turn on file sharing for **Private** network
4. Share the folder you want to access

Access from another machine:

```
\\192.168.255.179
```

Use `Win + R` and type the address.

## Mac

1. Note your Mac IP (e.g., `192.168.255.168`)
2. Go to **System Settings** → **Network** → **Sharing** → Turn on **File Sharing**

Access from another machine:

- Open **Finder** → **Go** → **Connect to Server**
- Type: `smb://192.168.255.168`

## Linux (Samba)

Install Samba:

```bash
# Debian/Ubuntu
sudo apt-get install samba

# Fedora/CentOS
sudo dnf install samba
```

Configure `/etc/samba/smb.conf` to define the shared folder name, path, and permissions. Then restart Samba.

Access from Windows:

```
\\<Linux_IP_Address>\<Share_Name>
```

Mount a Windows share from Linux:

```bash
mount //<Windows_IP_Address>/<Share_Name> /mnt/point
```

## Quick Reference

| From → To         | Method                                          |
| ----------------- | ----------------------------------------------- |
| Windows → Windows | `\\IP_ADDRESS`                                  |
| Windows → Mac     | `smb://MAC_IP`                                  |
| Mac → Windows     | Finder → Connect to Server → `smb://WINDOWS_IP` |
| Linux → Windows   | Mount SMB share or `smbclient`                  |
| Windows → Linux   | `\\LINUX_IP\Share_Name`                         |

> **Rule:** all three OSes speak SMB natively. Install Samba on Linux, turn on sharing on Mac/Windows, and use the IP address to connect.

---

_Next steps: for faster local transfers, consider **rsync** over SSH — it compresses data and only sends differences._
