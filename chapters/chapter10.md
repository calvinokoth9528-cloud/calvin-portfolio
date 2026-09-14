# Chapter 10: Advanced Topics and Troubleshooting

## Process Management

### The Process Lifecycle

Processes in Linux have states:

| State | Symbol | Description |
|---|---|---|
| **Running** | R | Executing or in the run queue |
| **Interruptible sleep** | S | Waiting for an event (e.g., I/O) |
| **Uninterruptible sleep** | D | Waiting for I/O (can't be killed) |
| **Stopped** | T | Stopped by a signal |
| **Zombie** | Z | Terminated but not reaped by parent |
| **Dead** | X | Being destroyed |

### Viewing Processes

```bash
# Simple list
ps

# Detailed list of all processes
ps aux

# Tree view
ps auxf

# Tree with process hierarchy
pstree

# Real-time monitor
top
htop            # must install: sudo apt install htop
```

Filtering and searching:

```bash
ps aux | grep nginx
pgrep nginx
pidof nginx
```

### Process Priority (nice/renice)

```bash
# Start a process with low priority
nice -n 19 backup.sh

# Change priority of existing process
renice -n 10 -p 1234

# View priority
top
```

### Killing Processes

```bash
# Send TERM signal (graceful)
kill 1234

# Send KILL signal (force, cannot be caught)
kill -9 1234

# Kill by name (sends term signal to all matches)
pkill nginx

# Interactive process killer
killall  # (on some distros)
```

### Zombie Processes

A zombie is a process that has completed but whose parent hasn't called `wait()` on it. To clean up zombies:

```bash
# Find zombies
ps aux | awk '$8 ~ /Z/ {print}'

# Kill the parent (the parent should reap the zombie)
kill -1 $(ps -o ppid= -p <zombie_pid>)
```

## Performance Monitoring

### System Resources

```bash
# CPU and memory
top
htop

# Memory
free -h

# Disk I/O
iostat -x 1

# Network I/O
iftop
nethogs

# Process-specific resource usage
top -p <pid>

# Per-process I/O
iotop -o
```

### Understanding Load Average

Load average is displayed by the `uptime` command:

```
 06:45:21 up  1:23,  2 users,  load average: 0.31, 0.43, 0.39
```

The three numbers are the average load over 1, 5, and 15 minutes.

**Rule of thumb**: For a single-core system, load average of 1.0 = fully utilized. For an N-core system, a load average of N = fully utilized. A load average above the number of CPUs indicates contention.

### CPU Profiling

```bash
# Top 10 processes by CPU usage
ps -eo pid,ppid,cmd,pcpu,pmem --sort=-pcpu | head

# CPU info
lscpu
cat /proc/cpuinfo
```

## System Troubleshooting

### The Boot Process

The Linux boot process follows these stages:

1. BIOS/UEFI initializes hardware
2. Bootloader (GRUB) loads the kernel
3. Kernel initializes hardware and mounts the root filesystem
4. systemd (PID 1) starts, bringing up targets and services
5. Login prompt or desktop appears

If boot fails after GRUB:
1. Boot into recovery mode (from GRUB menu)
2. Use a live USB and chroot if recovery is unavailable

### Kernel Panic

A kernel panic is a fatal error the kernel cannot recover from. It often means:

- Hardware failure (RAM, disk)
- Corrupted kernel or initrd
- Driver conflicts

Recovery steps:

```bash
# Boot into recovery mode → run fsck
# Check logs
dmesg | tail
journalctl -b -1    # logs from the previous (failed) boot
```

### Fixing a Broken Package Installation

```bash
# Reconfigure all unpacked but not configured packages
sudo dpkg --configure -a

# Fix missing or broken dependencies
sudo apt --fix-broken install

# If the package database itself is broken
sudo rm /var/lib/dpkg/lock-frontend
sudo rm /var/lib/dpkg/lock
sudo rm /var/cache/apt/archives/lock
sudo dpkg --configure -a
```

### Disk Full Issues

```bash
# Check disk usage
df -h

# Check largest directories
sudo du -h --max-depth=1 / | sort -hr | head -n 20

# Clean package cache
sudo apt clean
sudo apt autoclean

# Remove old kernels
dpkg -l 'linux-image*'
sudo apt remove --purge linux-image-5.x.x-xx-generic

# Clean journal logs
sudo journalctl --vacuum-time=7d
sudo journalctl --vacuum-size=100M
```

### Memory Issues

```bash
# Check memory usage
free -h

# Check swap usage
swapon --show

# Identify memory hogs
ps -eo pid,ppid,cmd,pcpu,pmem,rss --sort=-rss | head -n 15

# Clear page cache (DANGEROUS — can affect performance)
sudo sync; echo 3 > /proc/sys/vm/drop_caches
```

### Network Troubleshooting

```bash
# Check if the network interface is up
ip link show

# Check for an IP address
ip addr show dev eth0

# Check routing
ip route show

# Check if the DNS is working
nslookup google.com
dig google.com

# Check if you can reach the gateway
ping 192.168.1.1

# Check if you can reach the internet
ping 8.8.8.8

# Check for packets being dropped
cat /proc/net/dev

# Check firewall
sudo ufw status
sudo iptables -L -n -v
```

### Service Troubleshooting

```bash
# Check if the service is running
systemctl is-active nginx

# Check if the service is enabled at boot
systemctl is-enabled nginx

# Check logs
journalctl -u nginx.service -n 100 --no-pager

# Check if it's listening on the right port
ss -tuln | grep :80

# Test the config syntax
nginx -t

# Restart after config changes
sudo systemctl restart nginx

# View dependencies
systemctl list-dependencies nginx
```

### File Permission Issues

```bash
# Check permissions
ls -l /path/to/file

# Fix ownership
sudo chown user:group /path/to/file

# Fix permissions
sudo chmod 755 /path/to/file

# Check for immutable files
lsattr /path/to/file

# Make or remove immutable flag
sudo chattr +i /path/to/file
sudo chattr -i /path/to/file
```

## Debugging Tools

### strace

`strace` traces system calls made by a program:

```bash
# Trace a running process
sudo strace -p 1234

# Trace a new process
strace ls

# Trace with timestamps and filtered calls
strace -tt -e trace=open,read ls
```

### lsof

List open files:

```bash
# Show files opened by a process
lsof -p 1234

# Show what's using a port
sudo lsof -i :80

# Show all TCP connections
lsof -i TCP
```

### gdb

The GNU Debugger:

```bash
# Run a program under gdb
gdb ./myprog

# Attach to a running process
gdb -p 1234

# In gdb:
# (gdb) run
# (gdb) backtrace
# (gdb) break main
# (gdb) continue
# (gdb) print variable
```

### SystemTap

SystemTap is a framework for tracing and profiling:

```bash
sudo apt install systemtap
sudo stap -e 'probe kernel.function("do_sys_open") { println("open called"); }'
```

## Advanced Shell Features

### Aliases vs Functions vs Scripts

**Aliases** are simple text substitutions:
```bash
alias ll='ls -alF'
```

**Functions** are more powerful:
```bash
extract() {
    if [ -z "$1" ]; then
        echo "Usage: extract <file>"
        return 1
    fi
    if [ -f "$1" ]; then
        case "$1" in
            *.tar.gz)   tar -xzf "$1"     ;;
            *.tar.bz2)  tar -xjf "$1"     ;;
            *.zip)      unzip "$1"        ;;
            *)          echo "Unknown format" ;;
        esac
    fi
}
```

### Process Substitution

```bash
# Compare the output of two commands without temp files
diff <(ls /etc) <(ls /usr/local/etc)

# Use a command's output as if it were a file
paste <(cut -f1 data.csv) <(cut -f2 data.csv)
```

### Here Documents

```bash
# Feed multiple lines to a command
cat << EOF
Line 1
Line 2
Variable: $HOME
EOF

# Without variable expansion
cat << 'EOF'
No expansion: $HOME stays literal
EOF
```

## Advanced File Operations

### rsync

A versatile file sync/copy tool:

```bash
# Basic sync
rsync -av /source/ /destination/

# Mirror (delete extra files in destination)
rsync -av --delete /source/ /destination/

# Exclude files
rsync -av --exclude "*.log" --exclude "/tmp/" /source/ /destination/

# Sync over network
rsync -avz /source/ user@host:/destination/

# Dry run (show what would change)
rsync -avn /source/ /destination/
```

### find with Advanced Actions

```bash
# Find and compress files older than 30 days
find /var/log -name "*.log" -mtime +30 -exec gzip {} \;

# Find and delete empty directories
find /path -type d -empty -delete

# Find duplicates using checksums
find /path -type f -exec md5sum {} + | sort | uniq -d -w32
```

## Cron and systemd Timers Advanced

### Cron Environment

Cron jobs run with a minimal environment. Define variables at the top of your crontab:

```cron
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
MAILTO=admin@example.com

# Now all jobs use this PATH
* * * * * backup.sh
```

### Anacron

Anacron handles tasks that might not run daily (e.g., if the system is off):

```bash
# /etc/anacrontab
1   5   cron.daily   run-parts /etc/cron.daily
7   10  cron.weekly  run-parts /etc/cron.weekly
```

## System Backups

### rsync for Backup

```bash
# Backup a directory
rsync -av --delete /home/alice/ /backup/alice/

# Backup over SSH
rsync -avz --delete /home/ user@backup-server:/backup/

# Exclude patterns
rsync -av --exclude "*.tmp" --exclude ".cache/" /home/ /backup/
```

### Timeshift

Timeshift creates snapshots of the system (like Windows System Restore):

```bash
sudo apt install timeshift

# Run interactively
sudo timeshift-launcher

# Create snapshot from CLI
sudo timeshift --create --name "pre-update"

# List snapshots
sudo timeshift --list

# Restore
sudo timeshift --restore --snapshot "..."
```

### tar Backup

```bash
# Backup /home
sudo tar -czpf /backup/home-backup-$(date +%F).tar.gz /home

# Restore
sudo tar -xzpf home-backup.tar.gz -C /
```

## Containerization: Docker Deep Dive

### Docker Architecture

Docker uses a client-server model:
- **dockerd**: The Docker daemon (manages containers, images, networks)
- **docker**: The CLI client (communicates with the daemon)
- **containerd**: Container runtime
- **runc**: Low-level container runtime

### Docker Commands

```bash
# Images
docker pull ubuntu:22.04
docker build -t myapp .
docker rmi myapp

# Containers
docker run -it --name webserver nginx
docker start webserver
docker stop webserver
docker ps -a
docker rm webserver

# Port mapping
docker run -d -p 8080:80 nginx

# Volume (persistent data)
docker volume create mydata
docker run -v mydata:/data myapp

# Inspect containers and images
docker inspect webserver
docker logs webserver
docker exec -it webserver bash

# Docker Compose (multi-container apps)
docker compose up -d
docker compose down
```

Dockerfile example:

```dockerfile
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    python3 \
    pip3 \
    && rm -rf /var/lib/apt/lists/*

COPY app.py /app/
WORKDIR /app
CMD ["python3", "app.py"]
```

### Docker Compose

`docker-compose.yml`:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - db
  db:
    image: postgres:15
    volumes:
      - dbdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: example

volumes:
  dbdata:
```

## Virtualization

### KVM/QEMU

```bash
# Check if KVM is supported
kvm-ok

# Install
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils virt-manager

# Manage VMs
sudo virsh list --all
sudo virsh start myvm
sudo virsh shutdown myvm
sudo virsh console myvm
```

### LXC/LXD

LXC (Linux Containers) + LXD (container manager + image server):

```bash
# Install LXD
sudo snap install lxd

# Initialize
lxd init

# Launch a container
lxc launch ubuntu:22.04

# List containers
lxc list

# Shell into a container
lxc exec mycontainer -- /bin/bash
```

## Review Questions

1. How do you trace system calls made by a process?
2. What command shows what files a process has open?
3. How do you find and kill a zombie process?
4. What does `rsync -a --delete` do?
5. How do you get shell access to a running Docker container?

### Quick Reference

```bash
# Process management
ps aux
top
htop
kill <pid>
pkill <name>

# Monitoring
free -h
iotop
df -h
du -sh /path

# Debugging
strace -p <pid>
lsof -p <pid>
dmesg | tail
journalctl -u <service>

# Troubleshooting
sudo fsck /dev/sda1
sudo dpkg --configure -a
sudo apt --fix-broken install

# Backups
rsync -av /source/ /dest/
tar -czf backup.tar.gz /path

# Docker
docker ps
docker exec -it <container> /bin/bash
docker logs <container>
```
