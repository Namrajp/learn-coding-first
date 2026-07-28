---
title: "Sharing Files Between Mac, Windows, and Linux"
slug: "sharing-computers-mac-windows-linux"
date: 2026-07-16
description: "Set up file sharing between Mac, Windows, and Linux on a local network: SMB configuration, access methods, and quick reference."
category: "tutorial"
tags: ["networking", "smb", "windows", "macos", "linux"]
status: published
---

Sharing files across operating systems on the same network uses SMB (Server Message Block). Each OS sets it up differently, but the access pattern is the same.

## Find Your IP First

Every method below needs the machine's local IP address, and each OS reports it differently:

```bash
ipconfig                   # Windows — look for IPv4 Address
ipconfig getifaddr en0     # macOS — en0 is usually Wi-Fi, try en1 if empty
hostname -I                # Linux
```

These are private addresses handed out by your router, so they can change when the lease expires. If a share stops resolving after a reboot, check the IP before assuming the config broke.

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
2. Go to **System Settings** → **General** → **Sharing** → turn on **File Sharing**

On older macOS releases this lived under **System Preferences** → **Sharing** instead.

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

Installing the package is not enough. The connecting user also needs an SMB password, stored separately from the Linux login password:

```bash
sudo smbpasswd -a yourusername   # set the SMB password
sudo systemctl restart smbd      # apply smb.conf changes
```

To go the other way, install `smbclient` for browsing shares and `cifs-utils` for mounting them:

```bash
smbclient -L //192.168.255.179 -U yourusername
```

Access from Windows:

```
\\<Linux_IP_Address>\<Share_Name>
```

Mount a Windows share from Linux. This needs `cifs-utils` installed, an explicit `-t cifs` filesystem type, and an account to authenticate as:

```bash
sudo apt-get install cifs-utils
sudo mkdir -p /mnt/point
sudo mount -t cifs //192.168.255.179/Share /mnt/point -o username=yourusername
```

You are prompted for the password. All three parts matter. Drop `-t cifs` and `mount` has nothing telling it this is an SMB share, so it cannot work out how to handle the path. Pass the flag without `cifs-utils` installed and you get `mount: /mnt/point: unknown filesystem type 'cifs'`. Leave off `username=` and it connects as a guest, which most Windows shares refuse.

## When It Does Not Work

Most failures come down to one of three things.

**Firewall.** Every OS blocks SMB until sharing is turned on, and turning sharing on normally opens the ports for you. On Ubuntu with `ufw` active you may still need `sudo ufw allow samba`.

**Network profile.** Windows only shares on networks marked **Private**. On a **Public** profile, discovery stays off and nothing will appear no matter what you shared.

**Permissions.** Sharing a folder and granting a user access to it are separate steps. If you can see the share listed but cannot open it, the share itself is fine and the filesystem permissions underneath it are not.

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
