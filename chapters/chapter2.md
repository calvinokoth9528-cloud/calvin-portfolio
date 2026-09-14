# Chapter 2: Installation and Setup

## Preparing for Installation

Before installing Ubuntu, gather the following:

- A USB flash drive (8GB or larger recommended)
- The Ubuntu ISO file downloaded from [ubuntu.com/download](https://ubuntu.com/download)
- Time for the installation process (30–60 minutes)

### Checking System Requirements

#### Desktop (Graphical)

| Component | Minimum | Recommended |
|---|---|---|
| CPU | 2 GHz dual-core | 4-core or better |
| RAM | 4 GB | 8 GB or more |
| Storage | 25 GB SSD | 50+ GB SSD |
| Graphics | 1024×768 display | 1920×1080 display |

#### Server

| Component | Minimum | Recommended |
|---|---|---|
| CPU | 1 GHz | 2+ GHz multi-core |
| RAM | 1 GB | 4 GB+ |
| Storage | 2.5 GB | 10+ GB (SSD preferred) |

### Creating a Bootable USB

#### On Ubuntu

Use the built-in **Startup Disk Creator**:

```bash
# Launch from terminal
usb-creator-gtk
```

Or use `dd` (command-line, precise but dangerous if wrong device):

```bash
# Replace /dev/sdX with your USB device and ubuntu.iso with path
sudo dd if=ubuntu.iso of=/dev/sdX bs=4M status=progress oflag=sync
```

#### On Windows

Use **Rufus**:

1. Download Rufus from [rufus.ie](https://rufus.ie)
2. Insert USB drive
3. Select the Ubuntu ISO
4. Choose "GPT" for UEFI systems or "MBR" for legacy BIOS
5. Click "Start"

#### On macOS

Use `dd` in Terminal:

```bash
# List disks to find your USB
diskutil list

# Unmount (not eject) the disk, e.g. /dev/disk2
diskutil unmountDisk /dev/disk2

# Write the image (this takes several minutes)
sudo dd if=ubuntu.iso of=/dev/rdisk2 bs=4m

# Eject when done
diskutil eject /dev/disk2
```

## The Installation Process

### Entering the Boot Menu

When you power on with the USB inserted, press the key to access the boot menu. Common keys:

- **F12, F10, F2, Esc** (varies by manufacturer)
- For Mac: Hold **Option** during startup

Select your USB drive from the boot menu.

### Trying Ubuntu (Optional but Recommended)

The installer offers "Try Ubuntu" — this boots into a fully functional live environment without modifying your hard drive. This is an excellent way to verify hardware compatibility (WiFi, graphics, sound) before committing to installation.

### Installation Steps

1. **Select language**: Choose your preferred language and click "Install Ubuntu".
2. **Keyboard layout**: Select your keyboard layout.
3. **Updates and third-party software**: 
   - Check "Normal installation" for a full set of apps
   - Optionally check "Download updates while installing" and "Install third-party software"
4. **Installation type**:
   - **Erase disk and install Ubuntu**: Wipes everything (use for single-boot)
   - **Install Ubuntu alongside [existing OS]**: Dual-boot (creates partition)
   - **Something else**: Manual partitioning (advanced, gives full control)
   - **Minimal installation**: Just the browser and basic utilities
5. **Location**: Confirm your time zone by clicking on the map or entering your city.
6. **Your information**: Enter your name, computer name, username, and password. The "Log in automatically" option skips the login screen (convenient but less secure).
7. **Installation**: Wait 20–40 minutes. The system will restart when finished.

### Manual Partitioning (Something Else)

Manual partitioning is useful for dual-boot setups or custom layouts. Key partitions:

| Mount Point | Size | Filesystem | Purpose |
|---|---|---|---|
| `/boot/efi` | 512 MB | FAT32 | UEFI boot (for UEFI systems) |
| `swap` | 4–8 GB | swap | Virtual memory/hibernation |
| `/` (root) | 20–50 GB | ext4 | System files |
| `/home` | Remaining | ext4 | User data (recommended separately) |

**Best practice**: Separate `/home` from `/` so you can reinstall Ubuntu without losing personal files.

## First Boot and Initial Setup

### Logging In

On first boot, you'll see the login screen (GDM). Enter the password you set during installation. If you selected automatic login, you'll go straight to the desktop.

### Completing First-Time Setup

Ubuntu may prompt you with:
- **Privacy settings**: Choose whether to send usage data to Canonical, enable location services, and share crash reports.
- **Drivers**: Ubuntu usually detects proprietary drivers (especially for NVIDIA/AMD graphics) automatically. Check **Software & Updates → Additional Drivers** if you have graphics issues.

### Updating the System

Always update after first install:

```bash
# Update package lists
sudo apt update

# Upgrade all installed packages
sudo apt upgrade

# Full distribution upgrade (may install/remove packages)
sudo apt full-upgrade

# Remove unused packages
sudo apt autoremove

# Clean download cache
sudo apt autoclean
```

### Setting Up Automatic Updates

```bash
# Enable automatic updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Setting Up a Hostname (Desktop)

```bash
# Set hostname
sudo hostnamectl set-hostname myhost

# Make sure /etc/hosts reflects it
sudo sed -i "s/ubuntu/myhost/g" /etc/hosts
```

## Installing Ubuntu Server

### Downloading the Server ISO

Download the **Ubuntu Server ISO** from [ubuntu.com/download/server](https://ubuntu.com/download/server). The server edition is designed for headless operation (no GUI), though you can install a GUI later.

### Server Installation Walkthrough

The Ubuntu Server installer (Subiquity) is a text-based wizard:

1. **Language & Keyboard**: Select your preferences.
2. **Network**: Configure networking. You can set up static IP or use DHCP.
3. **Storage**: Default uses LVM (Logical Volume Manager). For custom setups, choose manual.
4. **Filesystem**: Ext4 is the default; XFS is an alternative.
5. **User setup**: Create a regular user with sudo privileges (no root password by default — secure practice).
6. **SSH**: The installer can optionally install OpenSSH server.
7. **Featured Server Applications**: Select additional services (OpenSSH, Docker, LAMP, etc.) via the "Find..." menu.

After installation, you'll boot into a minimal system where you can log in with the user you created.

### Server Post-Installation

```bash
# Update
sudo apt update && sudo apt upgrade -y

# Check connectivity and services
ip addr show
systemctl status ssh
```

## Dual-Boot with Windows

### Preparing Windows

1. **Disable Fast Startup**: 
   - Control Panel → Power Options → "Choose what power buttons do" → "Change settings" → Uncheck "Turn on fast startup"
2. **Shrink the Windows partition**:
   - Disk Management → Right-click C: → "Shrink Volume" → Free up at least 25 GB

### Installing Alongside Windows

If you used the installer's "Install alongside" option, Ubuntu's GRUB bootloader will detect Windows and add it to the boot menu, allowing you to choose at startup.

If you used manual partitioning, you must manually add the Windows partition to GRUB after install:

```bash
sudo update-grub
```

## Ubuntu on Virtual Machines

### VirtualBox

```bash
# In your host terminal (not VM)
# Download Ubuntu ISO
# Create VM with 4GB+ RAM, 25GB+ disk, attach ISO
# Install normally inside the VM
```

### VMware

Similar to VirtualBox — create a VM, attach the ISO, and install.

### VMware/VirtualBox Guest Tools

After installation, improve performance by installing guest additions:

```bash
# For VirtualBox
sudo apt install build-essential dkms linux-headers-$(uname -r)
sudo mount /dev/cdrom /mnt
sudo /mnt/VBoxLinuxAdditions.run
```

## Ubuntu in the Cloud

### AWS EC2

```bash
# SSH into your instance
ssh -i mykey.pem ubuntu@<instance-public-ip>

# Update
sudo apt update && sudo apt upgrade -y
```

### Google Cloud Platform (GCP)

```bash
# Use the gcloud CLI to create an instance
gcloud compute instances create my-ubuntu-vm \
    --image=ubuntu-os-cloud/ubuntu-2204-lts \
    --zone=us-central1-a
```

### Azure

```bash
# Use the Azure CLI
az vm create \
    --resource-group myResourceGroup \
    --name myUbuntuVM \
    --image UbuntuLTS \
    --generate-ssh-keys
```

## Common First Boot Tasks

### Install Essential Utilities

```bash
# Build tools
sudo apt install build-essential

# GUI tools for system management
sudo apt install software-properties-gtk

# Text editors
sudo apt install git vim nano

# Archive tools
sudo apt install p7zip-full unrar

# System monitoring
sudo apt install htop iotop iftop

# Network tools
sudo apt install net-tools curl wget dnsutils traceroute
```

### Install Proprietary Codecs and Fonts

```bash
# Add and enable the multiverse repository
sudo add-apt-repository multiverse
sudo apt update

# Install Ubuntu restricted extras (codecs, fonts, etc.)
sudo apt install ubuntu-restricted-extras
```

### Configure Power Management (Laptop)

The **TLP** tool optimizes power consumption:

```bash
sudo apt install tlp tlp-rdw
sudo systemctl enable tlp
sudo systemctl start tlp
```

### Set Up Firewall

```bash
# UFW (Uncomplicated Firewall) is pre-installed
sudo ufw enable

# Allow specific services
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Check status
sudo ufw status verbose
```

## Recovery and Reinstallation

### Recovery Mode

If the system won't boot normally, hold **Shift** (BIOS) or press **Esc** (UEFI) during boot to access the GRUB menu. From there, select "Advanced options for Ubuntu" → "(recovery mode)". Recovery mode offers:

- **Resume normal boot**
- **Clean** (free disk space)
- **dpkg** (repair broken packages)
- **fsck** (check/repair filesystems)
- **grub** (update GRUB)
- **hostname** (change hostname)
- **network** (enable networking)
- **root** (drop to root shell)

### Reinstalling Ubuntu

The Ubuntu installer offers a "Reinstall Ubuntu" option that preserves your `/home` directory and installed packages if `/home` is on a separate partition. For full reinstalls:

1. Boot from USB and choose "Try Ubuntu" first
2. Open "GParted" or "Disks" to back up important data
3. Run the installer and select "Erase disk and install Ubuntu"

---

### Review Questions

1. What is the minimum recommended RAM for an Ubuntu desktop install?
2. What does the "Something else" installation option allow you to do?
3. Why should `/home` be on a separate partition?
4. What is the default approach to root account access on Ubuntu Server?
5. What command starts automatic updates on Ubuntu?

### Quick Reference

```bash
# Install build tools
sudo apt install build-essential

# Update everything
sudo apt update && sudo apt upgrade -y && sudo apt autoremove -y

# Reboot
sudo reboot

# Check system info
lsb_release -a; uname -r
```
