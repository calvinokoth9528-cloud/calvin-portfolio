# Chapter 8: System Administration and Services

## Systemd: The Service Manager

Since Ubuntu 15.04 (and the 16.04 LTS), **systemd** is the default init system — the first process started (PID 1) that manages everything else. Systemd replaced the older SysVinit system.

### systemd Core Concepts

| Concept | Description |
|---|---|
| **Unit** | A systemd-managed entity (service, mount, socket, timer, etc.) |
| **Service (.service)** | A background process |
| **Target (.target)** | A system state (like a runlevel) |
| **Socket (.socket)** | Inter-process communication endpoint |
| **Timer (.timer)** | Scheduled task |
| **Journal** | Structured log system |

### Viewing the Boot Process

```bash
# Show boot time analysis
systemd-analyze

# Show slowest services during boot
systemd-analyze blame

# Show the critical path (slowest-to-fastest boot chain)
systemd-analyze critical-chain

# View boot history
journalctl --boot
```

### Targets (Runlevels in systemd)

Targets are similar to the old runlevels. Key targets:

| Target | Old Runlevel | Description |
|---|---|---|
| `graphical.target` | 5 | Multi-user with GUI |
| `multi-user.target` | 3 | Multi-user, no GUI (server mode) |
| `rescue.target` | 1 | Single-user mode |
| `emergency.target` | S | Minimal recovery |
| `poweroff.target` | 0 | Power off |
| `reboot.target` | 6 | Reboot |
| `halt.target` | — | Halt (no power off) |

```bash
# Show current target
systemctl get-default

# Set the default target
sudo systemctl set-default multi-user.target  # text mode
sudo systemctl set-default graphical.target   # GUI mode

# Change to a target now (no reboot)
sudo systemctl isolate multi-user.target      # enter single-user-like mode
```

### Managing Services with systemctl

The `systemctl` command is the primary interface for managing systemd units.

```bash
# List all loaded services
systemctl list-units --type=service

# List all installed services (enabled + disabled)
systemctl list-unit-files --type=service

# Check status of a service
systemctl status ssh

# Start a service
sudo systemctl start ssh

# Stop a service
sudo systemctl stop ssh

# Restart a service
sudo systemctl restart nginx

# Reload configuration (without restart)
sudo systemctl reload nginx

# Enable a service to start at boot
sudo systemctl enable ssh

# Disable a service
sudo systemctl disable ssh

# Enable and start simultaneously
sudo systemctl enable --now ssh

# Disable and stop simultaneously
sudo systemctl disable --now ssh

# Check if a service is enabled
systemctl is-enabled ssh

# Check if a service is active
systemctl is-active ssh

# View service logs (journald)
journalctl -u ssh.service

# Follow logs in real-time
journalctl -fu ssh.service
```

### Creating a Custom Service

Create a file at `/etc/systemd/system/myapp.service`:

```ini
[Unit]
Description=My Custom Application
After=network.target

[Service]
Type=simple
User=myapp
ExecStart=/usr/local/bin/myapp --config /etc/myapp.conf
Restart=on-failure
RestartSec=5
Environment=PORT=8080
Environment=DEBUG=false

[Install]
WantedBy=multi-user.target
```

Then register and start it:

```bash
sudo systemctl daemon-reload            # load the new unit file
sudo systemctl enable --now myapp      # enable + start
sudo systemctl status myapp            # check it's running
```

### Viewing Logs

```bash
# View all logs (may be very long)
journalctl

# View logs from this boot
journalctl -b

# View logs for a service
journalctl -u ssh

# Follow logs (like tail -f)
journalctl -f

# Show last N lines
journalctl -n 50

# Filter by date
journalctl --since="2024-01-01" --until="2024-01-02"

# Show only errors
journalctl -p err

# Vacuum old logs (free up space)
sudo journalctl --vacuum-time=7d
```

## System Configuration Files

### Key System Configuration Files

| File | Purpose |
|---|---|
| `/etc/hostname` | System hostname |
| `/etc/hosts` | Hostname-to-IP mappings |
| `/etc/fstab` | Filesystem mount table |
| `/etc/crontab` | System-wide cron jobs |
| `/etc/sudoers` | Sudo permissions |
| `/etc/environment` | System-wide environment variables |
| `/etc/resolv.conf` | DNS resolver config (linked file) |
| `/etc/ssh/sshd_config` | SSH daemon config |

### Setting the Hostname

```bash
# Set hostname
sudo hostnamectl set-hostname myserver

# View current hostname
hostnamectl

# Verify /etc/hosts
cat /etc/hosts
```

The `/etc/hostname` file contains just the hostname. The `hostnamectl` command updates this automatically.

### Time and Date Management

```bash
# Show time and date settings
timedatectl status

# Set the timezone
sudo timedatectl set-timezone America/New_York

# List available timezones
timedatectl list-timezones

# Set the date/time manually
sudo timedatectl set-time "2024-01-15 14:30:00"

# Enable automatic time sync (NTP)
sudo timedatectl set-ntp true
```

### Network Time Protocol (NTP)

NTP keeps the system clock accurate by syncing with remote time servers:

```bash
# Check NTP sync status
timedatectl timesync-status

# View NTP peers
systemd-timesyncd

# NTP is controlled via timedatectl as shown above
```

## Disk Management

### Viewing Disk Layout

```bash
# View disk usage
df -h

# View connected drives
lsblk

# Detailed partition info
lsblk -f

# Detailed info for a specific disk
sudo fdisk -l /dev/sda

# Show block device IDs
blkid

# View mounted filesystems
mount

# View the partition table (interactive, requires root)
sudo fdisk /dev/sda
```

### File System Labels

```bash
# Set a label on an ext4 partition
sudo e2label /dev/sda1 rootfs

# View labels
blkid

# Label other filesystem types
sudo fatlabel /dev/sdb1 USB
sudo ntfslabel /dev/sdc1 DATA
```

### Mounting and Unmounting

```bash
# Manual mount (temporary)
sudo mount /dev/sdb1 /mnt/usb

# Unmount
sudo umount /mnt/usb

# Mount with options
sudo mount -o ro,noexec /dev/sdb1 /mnt/usb  # read-only, no exec

# List all mounts
mount | column -t

# Permanently mount via /etc/fstab
# (Edit carefully — a typo can break boot)
sudo nano /etc/fstab
sudo mount -a  # test after editing
```

### LVM (Logical Volume Manager)

LVM provides flexible disk management:

```bash
# View LVM configuration
sudo vgdisplay
sudo lvdisplay

# Create a volume group from a physical disk
sudo pvcreate /dev/sdb
sudo vgcreate vg_storage /dev/sdb

# Create a logical volume
sudo lvcreate -L 10G -n lv_data vg_storage
sudo mkfs.ext4 /dev/vg_storage/lv_data
sudo mkdir /data
echo "/dev/vg_storage/lv_data /data ext4 defaults 0 0" | sudo tee -a /etc/fstab
sudo mount /data
```

### RAID (Software RAID with mdadm)

```bash
sudo apt install mdadm

# Create a RAID 1 array from two disks
sudo mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc

# Monitor status
cat /proc/mdstat

# Save config
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
sudo update-initramfs -u
```

## Memory Management

### Swapping

Swap is space used as virtual memory when RAM is full.

```bash
# Check swap usage
free -h
swapon --show

# Create a swap file (modern approach, replaces swap partitions)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Tune swappiness (default 60)
cat /proc/sys/vm/swappiness
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

### zram (Compressed RAM Swap)

zram provides compressed swap space in RAM (fast for low-memory systems):

```bash
sudo apt install zram-tools

# Configure in /etc/default/zramswap
sudo nano /etc/default/zramswap

# Restart service
sudo systemctl restart zramswap
```

## Cron and Scheduled Tasks

### crontab

`cron` schedules tasks to run periodically.

```bash
# Edit your own crontab
crontab -e

# List your crontab
crontab -l

# List another user's crontab (as root)
sudo crontab -u alice -l

# Edit root's crontab
sudo crontab -e
```

A crontab line format:
```
* * * * * command
│ │ │ │ │
│ │ │ │ └─── day of week (0-6, 0=Sunday)
│ │ │ └───── month (1-12)
│ │ └─────── day of month (1-31)
│ └───────── hour (0-23)
└─────────── minute (0-59)
```

Example crontabs:

```bash
# Run a backup every day at 2 AM
0 2 * * * /home/alice/scripts/backup.sh >> /var/log/backup.log 2>&1

# Run every Monday at 3:30 AM
30 3 * * 1 /usr/local/bin/update.sh

# Run every 15 minutes
*/15 * * * * /usr/bin/check_health.sh

# Run at reboot
@reboot /home/alice/scripts/startup.sh
```

### System-wide cron jobs

Scripts in `/etc/cron.d/`, `/etc/cron.daily/`, `/etc/cron.hourly/`, `/etc/cron.weekly/`, `/etc/cron.monthly/` run automatically.

### systemd Timers (Modern Replacement for Cron)

systemd timers are more powerful and integrate better with systemd services. Create a `.timer` and `.service` pair.

Example: `/etc/systemd/system/backup.timer`
```ini
[Unit]
Description=Daily Backup Timer

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

Example: `/etc/systemd/system/backup.service`
```ini
[Unit]
Description=Backup Service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/backup.sh
```

Enable and start the timer:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now backup.timer
sudo systemctl list-timers
```

## Kernel and Boot

### Viewing Kernel Information

```bash
# Show kernel version
uname -r

# Show all kernel info
uname -a

# Show boot messages
dmesg | tail

# Show loaded kernel modules
lsmod

# Show module info
modinfo loop
```

### Kernel Parameters (sysctl)

```bash
# View all kernel parameters
sysctl -a

# View a specific parameter
sysctl net.ipv4.ip_forward

# Set at runtime
sudo sysctl net.ipv4.ip_forward=1

# Make permanent in /etc/sysctl.conf or /etc/sysctl.d/*.conf
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-forwarding.conf
sudo sysctl -p /etc/sysctl.d/99-forwarding.conf
```

### Boot Parameters

Kernel boot parameters can be set in GRUB:

1. Edit `/etc/default/grub`
2. Modify `GRUB_CMDLINE_LINUX_DEFAULT`
3. Run `sudo update-grub`

Common parameters:
- `quiet splash` — reduce boot verbosity, show graphical splash
- `nomodeset` — fix video driver issues
- `net.ifnames=0 biosdevname=0` — use traditional naming (eth0, wlan0)

## GRUB (Grand Unified Bootloader)

GRUB is the bootloader. Configuration is in `/etc/default/grub`. Changes require `sudo update-grub`:

```bash
# Default OS to boot (count from 0)
GRUB_DEFAULT=0

# Countdown timer
GRUB_TIMEOUT=10

# Kernel parameters
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
```

### Recovery Mode

If the system fails to boot:
1. Hold **Shift** (BIOS) or press **Esc** (UEFI) during boot to access the GRUB menu
2. Choose "Advanced options for Ubuntu"
3. Select a kernel in recovery mode

## System Monitoring and Health

### Resource Monitoring

```bash
# Real-time system monitor
htop

# View I/O stats
iostat -x 1

# View network connections
ss -tuln

# View disk I/O
iotop

# View network traffic
iftop

# View system uptime
uptime

# Check load average
cat /proc/loadavg

# Memory usage detail
free -h
```

### Log Files

| Log File | Purpose |
|---|---|
| `/var/log/syslog` | General system log (replaced by journald in recent versions) |
| `/var/log/auth.log` | Authentication (login, sudo) logs |
| `/var/log/kern.log` | Kernel messages |
| `/var/log/dpkg.log` | Package installation history |
| `/var/log/boot.log` | Boot process messages |
| `/var/log/Xorg.0.log` | X server (display) logs |

```bash
# Use journalctl instead of tailing raw logs
journalctl -f                   # follow all logs
journalctl -u nginx.service -n 100   # last 100 lines from nginx
```

### Health Checks

```bash
# Check SMART status of drives
sudo apt install smartmontools
sudo smartctl -a /dev/sda

# Check file system errors
sudo fsck -f /dev/sda1

# Memory test (run memtest86+ from GRUB menu)
```

## Review Questions

1. What command starts a service at boot?
2. How do you list all active services?
3. Where are systemd service files stored?
4. What does `systemctl isolate rescue.target` do?
5. What file controls kernel parameters at boot time?

### Quick Reference

```bash
# Services (systemctl)
sudo systemctl start <service>
sudo systemctl stop <service>
sudo systemctl enable <service>
sudo systemctl disable <service>
systemctl status <service>
systemctl is-enabled <service>

# Targets (runlevels)
sudo systemctl set-default multi-user.target
sudo systemctl isolate graphical.target

# Logs (journalctl)
journalctl -b                       # this boot
journalctl -u <service>             # service logs
journalctl -f                       # follow

# Scheduled Tasks (cron)
crontab -e
crontab -l

# Scheduled Tasks (systemd timers)
sudo systemctl list-timers

# Disks
df -h
lsblk
sudo fdisk -l /dev/sda
sudo mount /dev/sdb1 /mnt/usb

# Time
timedatectl status
sudo timedatectl set-timezone UTC
```
