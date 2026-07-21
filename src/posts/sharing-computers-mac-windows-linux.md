---
title: "Sharing-computers-mac-windows-linux"
date: 2026-07-21
tags: []
status: draft
---

# Sharing Files Between Mac, Windows, and Linux on a Local Network

How to set up file sharing between different operating systems on the same network.

## Windows

1. Note your Windows IP (e.g., `192.168.255.179`)
2. Go to **Control Panel** → **Sharing** → **Advanced Sharing Settings**
3. Turn on file sharing for **Private** network
4. Share the folder you want to access

**Access from another machine:**
```
\\192.168.255.179
```
(Use `Win + R` and type the address)

## Mac

1. Note your Mac IP (e.g., `192.168.255.168`)
2. Go to **System Settings** → **Network** → **Sharing** → Turn on **File Sharing**

**Access from another machine:**
- Open **Finder** → **Go** → **Connect to Server**
- Type: `smb://192.168.255.168`

## Linux (Samba)

1. Install Samba:
   ```bash
   # Debian/Ubuntu
   sudo apt-get install samba

   # Fedora/CentOS
   sudo dnf install samba
   ```

2. Configure `/etc/samba/smb.conf` to define:
   - Shared folder name
   - Path
   - Permissions and access restrictions (guest or user access)

3. Restart Samba

**Access from Windows:**
```
\\<Linux_IP_Address>\<Share_Name>
```

**Access from Linux (mount a Windows share):**
```bash
mount //<Windows_IP_Address>/<Share_Name> /mnt/point
```

## Quick Reference

| From → To | Method |
|-----------|--------|
| Windows → Windows | `\\IP_ADDRESS` |
| Windows → Mac | `smb://MAC_IP` |
| Mac → Windows | Finder → Connect to Server → `smb://WINDOWS_IP` |
| Linux → Windows | Mount SMB share or `smbclient` |
| Windows → Linux | `\\LINUX_IP\Share_Name` |