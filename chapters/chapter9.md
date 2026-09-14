# Chapter 9: Networking and Security

## Network Configuration

### Network Interfaces

Ubuntu uses **Netplan** as its default network configuration tool (since 17.10), backed by either NetworkManager (desktop) or systemd-networkd (server).

### Viewing Network Interfaces

```bash
# Show all network interfaces
ip addr show

# Show a specific interface
ip addr show enp0s3

# Show routing table
ip route show

# Show listening ports
ss -tuln

# Show all network connections
ss -tulnp

# Show MAC addresses
ip neigh show
```

Modern interface names follow the **Predictable Network Interface Name** scheme (e.g., `enp0s3`, `wlp2s0`) rather than the old `eth0`, `wlan0`.

### Netplan Configuration

Netplan config files are in `/etc/netplan/`. A typical configuration:

```yaml
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  renderer: NetworkManager
  ethernets:
    enp0s3:
      dhcp4: true
  wifis:
    wlp2s0:
      dhcp4: true
      access-points:
        "MyNetwork":
          password: "mypassword"
```

For server (using systemd-networkd):

```yaml
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: no
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 8.8.4.4]
```

Apply changes:

```bash
sudo netplan apply
sudo netplan generate  # validate config
sudo netplan try       # apply with a timeout (reverts on failure)
```

### NetworkManager

NetworkManager handles networking on desktop Ubuntu. You can also manage it via command line:

```bash
# List connections
nmcli connection show

# List devices
nmcli device status

# Up/down a connection
nmcli connection up id "Wired connection 1"
nmcli connection down id "Wired connection 1"

# Add a static IP connection
nmcli con add type ethernet ifname enp0s3 con-name static ip4 192.168.1.50/24 gw4 192.168.1.1 ip4-dns 8.8.8.8 con-autoconnect yes
```

## Network Diagnostics

### ping

```bash
ping google.com
ping -c 4 192.168.1.1    # send 4 packets
ping6 ipv6.google.com    # IPv6 ping
```

### nslookup / dig / host

DNS lookup tools:

```bash
# Query DNS
nslookup google.com

# Advanced DNS query
dig google.com

# Show specific record types
dig MX google.com
dig AXFR example.com    # zone transfer (requires permission)

# Simple DNS lookup
host google.com
```

### traceroute

Shows the network hops to a destination:

```bash
# Install if not present
sudo apt install traceroute

# Run traceroute
traceroute google.com
tcptraceroute google.com 80     # TCP-based (useful if ICMP is blocked)
```

### mtr (My TraceRoute)

Combines `ping` and `traceroute` for continuous monitoring:

```bash
sudo apt install mtr
mtr google.com
```

### Network Scanning

```bash
# Install nmap
sudo apt install nmap

# Scan a single host
nmap 192.168.1.1

# Scan a range
nmap 192.168.1.0/24

# Scan with service detection
nmap -sV 192.168.1.1

# Scan with OS detection
nmap -O 192.168.1.1
```

### SSH (Secure Shell)

SSH is the primary tool for secure remote access.

Starting and managing the SSH daemon:

```bash
# Install OpenSSH server
sudo apt install openssh-server

# Check status
sudo systemctl status ssh

# Start/enable at boot
sudo systemctl enable --now ssh
```

Connecting to an SSH server:

```bash
# Basic connection
ssh username@192.168.1.100

# Specify key and port
ssh -i ~/.ssh/mykey.pem -p 2222 user@host

# Forward a local port to remote
ssh -L 8080:localhost:80 user@host

# Forward a remote port to local
ssh -R 8080:localhost:3000 user@host

# Agent forwarding (use with caution)
ssh -A user@host

# Run a remote command
ssh user@host "uptime"
```

### SSH Configuration

SSH client config (`~/.ssh/config`):

```
Host myserver
    HostName 192.168.1.100
    User alice
    Port 2222
    IdentityFile ~/.ssh/mykey

Host github
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_key

Host *
    ServerAliveInterval 60
```

SSH server config (`/etc/ssh/sshd_config`):

Common settings:
```
Port 22                         # change default port
PermitRootLogin no             # disable root login
PasswordAuthentication no     # disable password auth (require keys)
PubkeyAuthentication yes      # enable key auth
AllowUsers alice bob          # restrict logins
MaxAuthTries 3                # limit attempts
```

Apply changes:
```bash
sudo systemctl reload ssh
```

### SSH Keys

Generate and manage SSH keys:

```bash
# Generate a key pair
ssh-keygen -t ed25519 -C "alice@example.com"

# Generate a larger RSA key
ssh-keygen -t rsa -b 4096

# Copy public key to a remote host
ssh-copy-id user@host

# Copy key to clipboard (Ubuntu 20.04+)
cat ~/.ssh/id_ed25519.pub | xclip -selection clipboard
```

SSH key types:
- **ed25519** — modern, secure, efficient (recommended)
- **RSA** — classic, widely supported (4096-bit recommended)
- **ecdsa** — elliptic curve, NIST-backed

## Firewall (UFW)

**UFW (Uncomplicated Firewall)** simplifies netfilter firewall configuration.

```bash
# Enable UFW
sudo ufw enable

# Allow connections
sudo ufw allow 22/tcp           # SSH
sudo ufw allow 80/tcp           # HTTP
sudo ufw allow 443/tcp          # HTTPS
sudo ufw allow from 192.168.1.0/24 to any port 22  # restrict source IP

# Allow named services
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'

# Deny connections
sudo ufw deny 23/tcp            # Telnet

# Remove a rule
sudo ufw delete allow 23/tcp

# Check status
sudo ufw status verbose

# Reset UFW
sudo ufw reset
```

Default UFW behavior:
- **Default policy**: Deny incoming, allow outgoing (set during `enable`)

## VPN and Remote Access

### OpenVPN

```bash
# Install OpenVPN
sudo apt install openvpn

# Connect to a config
sudo openvpn --config client.ovpn
```

### WireGuard

WireGuard is a modern, fast, secure VPN:

```bash
# Install
sudo apt install wireguard resolvconf

# Generate keys
wg genkey | tee privatekey | wg pubkey > publickey

# /etc/wireguard/wg0.conf
[Interface]
Address = 10.0.0.1/24
PrivateKey = <your-private-key>
ListenPort = 51820

[Peer]
PublicKey = <peer-public-key>
AllowedIPs = 10.0.0.2/32
```

```bash
# Start WireGuard interface
sudo wg-quick up wg0

# Stop
sudo wg-quick down wg0
```

## DNS Configuration

### systemd-resolved

Ubuntu's default DNS resolver. Configuration is in `/etc/systemd/resolved.conf`:

```ini
[Resolve]
DNS=8.8.8.8 8.8.4.4
FallbackDNS=1.1.1.1 1.0.0.1
#DNSStubListener=yes
```

Apply changes:
```bash
sudo systemctl restart systemd-resolved
```

View status:
```bash
resolvectl status
```

### Using resolv.conf

`/etc/resolv.conf` is a symlink to `/run/systemd/resolved/stub-resolv.conf` on Ubuntu 20.04+.

Do not edit `/etc/resolv.conf` directly — edit `/etc/systemd/resolved.conf` instead and restart `systemd-resolved`.

## Security Best Practices

### Keeping the System Updated

```bash
# Update and upgrade
sudo apt update && sudo apt upgrade -y

# Full upgrade
sudo apt full-upgrade

# Install security updates only
sudo unattended-upgrade

# View available updates
apt list --upgradable

# Configure automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

### AppArmor

AppArmor is a Mandatory Access Control (MAC) system that restricts programs to a defined profile.

```bash
# Check status
sudo aa-status

# Enable a profile
sudo aa-enforce /usr/sbin/nginx

# Disable a profile
sudo aa-disable /usr/sbin/nginx

# Put in complain mode (logs but doesn't block)
sudo aa-complain /usr/bin/ping
```

AppArmor profiles are in `/etc/apparmor.d/`.

### Fail2ban

Fail2ban scans log files for malicious behavior (e.g., repeated failed logins) and bans the offending IP.

```bash
sudo apt install fail2ban

# Main config file
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Restart
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

Default jails:
- **sshd**: Blocks IPs with failed SSH login attempts
- **nginx-http-auth**: Blocks IPs with HTTP auth failures

### Security Updates

```bash
# Install the unattended-upgrades package
sudo apt install unattended-upgrades

# Enable automatic updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Configure in /etc/apt/apt.conf.d/50unattended-upgrades
# (uncomment "origin=Ubuntu,archive=jammy-security")
```

### Basic Hardening

#### Disable unused services

```bash
# List services
systemctl list-unit-files --type=service | grep enabled

# Disable a service
sudo systemctl disable <service>
sudo systemctl stop <service>
```

#### Secure shared memory

Add to `/etc/fstab`:
```
tmpfs /dev/shm tmpfs defaults,ro,noexec,nosuid,size=2G 0 0
```

#### Disable IPv6 (if not needed)

```bash
# Temporary
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1

# Permanent
echo 'net.ipv6.conf.all.disable_ipv6=1' | sudo tee /etc/sysctl.d/99-disable-ipv6.conf
sudo sysctl -p /etc/sysctl.d/99-disable-ipv6.conf
```

## Certificates and SSL/TLS

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Get a certificate
sudo certbot --apache -d example.com -d www.example.com

# Auto-renew (add to crontab or use systemd timer)
sudo certbot renew --dry-run

# View certificates
sudo certbot certificates
```

### Manual Certificate Management

```bash
# Check a certificate
openssl x509 -in cert.pem -text -noout

# Generate a self-signed cert
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Convert certificate formats
openssl x509 -inform der -in cert.crt -out cert.pem
openssl pkcs12 -export -out cert.pfx -inkey key.pem -in cert.pem
```

## Network File Systems

### NFS (Network File System)

Server:
```bash
sudo apt install nfs-kernel-server

# /etc/exports
/home/nfs 192.168.1.0/24(rw,sync,no_subtree_check)

# Set up shares
sudo exportfs -a
sudo exportfs -ra
sudo exportfs -v

# Start services
sudo systemctl restart nfs-kernel-server
```

Client:
```bash
sudo apt install nfs-common

# Mount
sudo mount -t nfs server:/home/nfs /mnt/nfs

# /etc/fstab entry
server:/home/nfs /mnt/nfs nfs defaults 0 0
```

### Samba (SMB/CIFS)

```bash
# Install
sudo apt install samba

# /etc/samba/smb.conf
[shared]
    path = /srv/shared
    browsable = yes
    writable = yes
    guest ok = no
    read only = no
    force user = nobody

# Add a user
sudo smbpasswd -a alice

# Restart
sudo systemctl restart smbd nmbd
sudo systemctl enable smbd nmbd
```

Connect from Windows: `\\server\shared`

## Containerization Overview

Ubuntu has strong container support (brief overview — more in Chapter 10).

### Docker

```bash
# Install
sudo apt install docker.io
sudo systemctl enable --now docker

# Use without sudo (add to docker group)
sudo usermod -aG docker $USER

# Run a container
sudo docker run hello-world
sudo docker run -d -p 80:80 nginx
```

## Review Questions

1. What tool manages networking configuration on Ubuntu desktop?
2. What command shows listening network ports?
3. What is the default SSH port?
4. How do you enable the firewall in UFW?
5. What is Fail2ban used for?

### Quick Reference

```bash
# Network
ip addr show
ss -tuln
nmcli device status
sudo netplan apply

# SSH
ssh user@host
ssh-copy-id user@host
sudo systemctl enable --now ssh

# Firewall
sudo ufw enable
sudo ufw allow 22
sudo ufw status

# DNS
resolvectl status
dig google.com

# Security
sudo apt update && sudo apt upgrade
sudo aa-status
sudo ufw enable
```
