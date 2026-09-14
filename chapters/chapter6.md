# Chapter 6: Package Management

## What Are Packages?

A **package** is a compiled collection of files (binaries, libraries, configuration files, documentation) bundled together for easy installation. Package management is the process of installing, updating, removing, and configuring these collections.

Ubuntu provides multiple package management approaches, each with different strengths. This chapter covers the three main systems:

1. **APT (Advanced Package Tool)** — the traditional Debian/Ubuntu package manager using `.deb` files and repositories
2. **Snap** — Canonical's universal packaging format
3. **Flatpak** — A community-driven universal packaging format

## APT: The Debian Package System

APT is the foundation of Ubuntu's package management. It uses **repositories** — centralized servers hosting thousands of packages.

### How Repositories Work

Repositories are defined in `/etc/apt/sources.list` and `/etc/apt/sources.list.d/`. A typical entry looks like:

```
deb http://archive.ubuntu.com/ubuntu/ noble main restricted universe multiverse
deb http://archive.ubuntu.com/ubuntu/ noble-updates main restricted universe multiverse
deb http://security.ubuntu.com/ubuntu/ noble-security main restricted universe multiverse
```

| Field | Description |
|---|---|
| `deb` | Binary package feed |
| URL | Repository base URL |
| `noble` | Release codename |
| `main`, `universe` | Component areas |

### Repository Components

| Component | Description |
|---|---|
| **main** | Officially supported free software |
| **universe** | Community-maintained free software |
| **restricted** | Proprietary drivers with commercial support |
| **multiverse** | Non-free software (patent/copyright restrictions) |

### Core APT Commands

```bash
# Update the package index (list of available packages)
sudo apt update

# Install packages
sudo apt install <package>
sudo apt install package1 package2

# Remove packages
sudo apt remove <package>         # keep config files
sudo apt purge <package>          # remove config files too

# Upgrade packages
sudo apt upgrade                  # upgrade without removing anything
sudo apt full-upgrade             # upgrade (may remove conflicting packages)

# View package info
apt show <package>
apt policy <package>

# Search
apt search keyword
apt-cache search keyword          # older search interface
```

### Managing Package Sources

```bash
# Add a PPA (Personal Package Archive)
sudo add-apt-repository ppa:graphics-drivers/ppa
sudo apt update

# Add a repository manually
sudo add-apt-repository "deb http://archive.ubuntu.com/ubuntu/ noble main universe"

# List enabled repositories
grep -r "^deb" /etc/apt/sources.list /etc/apt/sources.list.d/
```

### Cleaning Up

```bash
# Remove downloaded package files no longer needed
sudo apt clean

# Remove automatically installed dependencies no longer needed
sudo apt autoremove

# Fix broken dependencies
sudo apt --fix-broken install

# Re-configure a package
sudo dpkg-reconfigure <package>
```

### apt and dpkg: The Lower Layer

`dpkg` is the lower-level package installer. APT builds on top of `dpkg`:

```bash
# Install a local .deb file
sudo dpkg -i package.deb

# If dependencies are missing, fix with apt
sudo apt --fix-broken install

# List installed packages
dpkg -l | grep <keyword>

# Remove a package
sudo dpkg -r <package>

# Completely remove (purge) a package
sudo dpkg -P <package>

# Show files installed by a package
dpkg -L <package>

# Find which package owns a file
dpkg -S /usr/bin/ls
```

## Snap: Universal Packages

Snap is a package management system developed by Canonical for creating, managing, and distributing packages across Linux distributions. Snaps are containerized and bundle their own dependencies.

### What Are Snaps?

- Bundled with all their dependencies (no missing library issues)
- Cross-distribution (work on Ubuntu, Debian, Fedora, etc.)
- Auto-update by default
- Isolated (security sandboxing)
- Run in read-only filesystem

### Snap Commands

```bash
# Search for snaps
snap find keyword

# Install a snap
sudo snap install <name>
sudo snap install code --classic           # --classic for developer tools

# List installed snaps
snap list

# Remove a snap
sudo snap remove <name>

# Update a snap
sudo snap refresh <name>

# Update all snaps
sudo snap refresh

# Check for updates manually
sudo snap refresh --list

# Switch channels (stable, candidate, edge, beta)
sudo snap switch <name>/<channel>
sudo snap install <name> --edge            # install from edge channel

# View info about a snap
snap info <name>
snap changes                          # see snap operations
```

### Classic Confinement

Snaps are confined by default for security. Development tools (compilers, editors) often need `--classic` to access the system normally:

```bash
sudo snap install code --classic
sudo snap install python38 --classic
sudo snap install postman --classic
```

### Snap Channels

Each snap has multiple channels:

| Channel | Description |
|---|---|
| `latest/stable` | Default — well-tested, recommended |
| `stable` | Latest stable (non-"latest") |
| `candidate` | Pre-release, ready for testing |
| `beta` | Unstable, for testing |
| `edge` | Bleeding-edge, unstable |

### Managing Snap Updates

Snaps auto-update by default. Configuration:

```bash
# Disable auto-refresh
sudo snap set system refresh.timer=00:00-01:00    # only update at night

# Set refresh schedule (4-hourly)
sudo snap set system refresh.hold="2025-01-01T00:00:00Z"

# Refresh specific snap
sudo snap refresh <snap-name>

# Revert to a previous revision
sudo snap revert <snap-name>
```

## Flatpak: The Universal Package Format

Flatpak is an alternative to Snap, developed by a community effort. It uses **runtimes** (shared libraries) and **bundles** (application-specific content) to build packages.

### Installing Flatpak

Flatpak is not installed by default on Ubuntu but is easy to add:

```bash
sudo apt install flatpak

# Optional: Graphical plugin for Software Center
sudo apt install gnome-software-plugin-flatpak
```

### Setting Up Flathub

**Flathub** is the primary Flatpak app repository:

```bash
# Add Flathub repository
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

### Flatpak Commands

```bash
# Search for apps
flatpak search keyword

# Install an app
flatpak install flathub <app-id>
flatpak install flathub org.gimp.GIMP

# List installed apps
flatpak list

# Run an app
flatpak run <app-id>

# Update all apps
flatpak update

# Remove an app
flatpak remove <app-id>

# Repair broken installations
flatpak repair
```

### Flatpak Permissions

Flatpak uses a portal-based permission system:

```bash
# List permissions for an app
flatpak info --show-permissions <app-id>

# Reset permissions
flatpak permission-reset <app-id>
```

### Comparing Package Managers

| Feature | APT (DEB) | Snap | Flatpak |
|---|---|---|---|
| **Dependencies** | System-wide (may cause conflicts) | Bundled (no conflicts) | Bundled (no conflicts) |
| **Updates** | Manual (`apt upgrade`) | Automatic (every 4 hours) | Manual (`flatpak update`) |
| **Disk usage** | Minimal | Larger (self-contained) | Moderate (shared runtimes) |
| **Startup time** | Fast | Slower (overhead) | Slower (overhead) |
| **Isolation** | None (traditional) | Yes (sandbox) | Yes (sandbox) |
| **Availability** | Ubuntu-specific repo | Cross-distro | Cross-distro |
| **Best for** | Core system packages | End-user apps | Desktop apps |

## Best Practices for Package Management

### Mixing Package Managers

- **APT**: Best for core system packages (`build-essential`, `curl`, `vim`)
- **Snap**: Canonical's recommended for third-party desktop apps
- **Flatpak**: Good alternative to Snap for desktop apps; preferred by many users due to smaller overhead

Avoid mixing Snap and Flatpak versions of the same app.

### Updating Regularly

Keep your system up to date:

```bash
sudo apt update
sudo apt upgrade
sudo apt autoremove
sudo snap refresh
flatpak update
```

### Checking for Orphaned Packages

```bash
# List automatically installed packages (potential candidates for autoremove)
apt-mark showauto

# Show why a package was installed
aptitude why <package>

# Mark a package as manually installed
sudo apt-mark manual <package>
```

## Installing Software from Source

Sometimes software is not available in any package repository. In that case, you may need to compile from source:

```bash
# Install build dependencies
sudo apt install build-essential autoconf automake libtool

# Download source, extract, build, install
./configure --prefix=/usr/local
make
sudo make install

# Or use checkinstall to create a DEB package
sudo checkinstall
```

## Package Management for Development

### Python

```bash
# Install pip and venv
sudo apt install python3-pip python3-venv

# Create a virtual environment
python3 -m venv myproject
source myproject/bin/activate
pip install requests

# Install a package manager for Python
pipx install poetry
```

### Node.js / npm

```bash
sudo apt install nodejs npm

# Or use a Node version manager (nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

### Java

```bash
sudo apt install openjdk-17-jdk

# Or use SDKMAN!
curl -s "https://get.sdkman.io" | bash
```

### Database Servers

```bash
sudo apt install mysql-server postgresql redis-server
sudo systemctl start mysql
sudo systemctl enable mysql  # start at boot
```

## Repository Management

### Adding Third-Party Repositories

```bash
# Import GPG key
wget -qO - https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg

# Add repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install docker-ce
```

### Pinning Packages

To prevent a package from being upgraded, "pin" it:

```bash
# Hold a package
sudo apt-mark hold docker-ce

# Unhold
sudo apt-mark unhold docker-ce

# Show held packages
apt-mark showhold
```

## Review Questions

1. What command updates the package index in APT?
2. How do you install a Snap package?
3. What is the difference between `apt remove` and `apt purge`?
4. What is Flathub?
5. How do you hold a package from being upgraded?

### Quick Reference

```bash
# APT
sudo apt update
sudo apt install <pkg>
sudo apt remove <pkg>
sudo apt upgrade
sudo apt autoremove

# Snap
snap find <name>
sudo snap install <name>
sudo snap remove <name>
sudo snap refresh
snap list

# Flatpak
flatpak search <name>
flatpak install flathub <name>
flatpak remove <name>
flatpak update

# Manual
dpkg -i file.deb
dpkg -l
dpkg -L <pkg>

# Holds
sudo apt-mark hold <pkg>
sudo apt-mark unhold <pkg>
apt-mark showhold
```
