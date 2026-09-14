# Chapter 7: User and Group Management

## The Linux User Model

Linux follows a strict permission model where every process runs as a specific user, and every file is owned by a user. Understanding users and groups is critical for system security.

### User IDs (UIDs)

Each user has a unique **User ID (UID)**. The most important UIDs are:

| UID | Username | Purpose |
|---|---|---|
| 0 | `root` | Superuser — all permissions |
| 1–999 | System users | Service accounts (nobody, daemon, www-data, etc.) |
| 1000+ | Regular users | Interactive user accounts |
| 65534 | nobody | Default unprivileged user |

### User Database Files

User account information is stored in several files:

| File | Stored Information |
|---|---|
| `/etc/passwd` | Usernames, UIDs, home dirs, login shells |
| `/etc/shadow` | Password hashes and aging info |
| `/etc/gshadow` | Group password information |
| `/etc/group` | Group names and members |
| `/etc/login.defs` | Default login settings |

### Viewing `/etc/passwd`

```bash
# View user accounts
cat /etc/passwd

# View only your account info
getent passwd $USER

# View a specific user
getent passwd root
```

A typical line:
```
alice:x:1000:1000:Alice:/home/alice:/bin/bash
```

Fields (colon-separated):
1. **Username**
2. **Password placeholder** (`x` means the hash is in `/etc/shadow`)
3. **UID**
4. **GID** (primary group)
5. **GECOS** (full name, optional contact info)
6. **Home directory**
7. **Login shell**

## User Management Commands

### useradd — Create a New User

```bash
# Create a user with default options
sudo useradd alice

# Create with home directory, GECOS field, and default shell
sudo useradd -m -c "Alice Anderson" -s /bin/bash alice

# Create with specific UID and GID
sudo useradd -u 1005 -g developers -m -s /bin/bash bob
```

Common `useradd` flags:

| Flag | Description |
|---|---|
| `-m` | Create home directory |
| `-d /path` | Set home directory path |
| `-s /shell` | Set login shell |
| `-c "comment"` | Set GECOS field (full name/comment) |
| `-u UID` | Set specific UID |
| `-g GID` | Set primary group (must exist) |
| `-G group1,group2` | Add supplementary groups |
| `-e YYYY-MM-DD` | Set account expiration date |

### adduser — The Friendly Alternative

`adduser` is a high-level frontend to `useradd` that's interactive and sets the password:

```bash
sudo adduser alice
```

This prompts for the password, GECOS info, and creates a home directory in one step. It's the **recommended way** for interactive user creation.

### Modifying Users (usermod)

```bash
# Append to supplementary groups
sudo usermod -aG developers,wheel alice

# Change login shell
sudo usermod -s /bin/zsh alice

# Change home directory
sudo usermod -d /new/home/dir alice

# Lock/unlock account
sudo usermod -L alice       # lock
sudo usermod -U alice       # unlock

# Add a grace period before password expires
sudo usermod -l alice       # expire immediately (force password change at next login)
```

⚠️ **Important**: `usermod` and `usermod -G` **replace** the supplementary group list. To **add** a group without removing existing ones, always use `-aG` (append to groups).

### Deleting Users

```bash
# Remove user (keep home directory)
sudo userdel alice

# Remove user and home directory
sudo userdel -r alice

# Remove user and mail spool
sudo deluser alice        # Debian/Ubuntu alternative to userdel
```

### Setting Passwords

```bash
# Set/change your own password
passwd

# Set another user's password
sudo passwd alice

# View password aging (shadow/nologin accounts won't show)
chage -l alice

# Force password change at next login
sudo chage -d 0 alice
```

### Password Aging

```bash
# Display current settings
chage -l alice

# Set password to expire after 90 days
sudo chage -M 90 alice

# Set minimum days between changes
sudo chage -m 7 alice

# Set warning period (days before expiration)
sudo chage -W 7 alice

# Lock password (disable login)
sudo passwd -l alice
```

## The Root Account

### Becoming Root

Ubuntu does not set a root password by default. The `root` account exists but is locked. You become root through the `sudo` mechanism.

```bash
# Run a single command as root
sudo ls /root

# Open a root shell
sudo -i          # switch to root environment
sudo su          # switch to root (without loading full env)
exit             # return to your user
```

### Configuring sudo

The `/etc/sudoers` file controls who can do what with sudo. **Never edit it directly** — always use `visudo`:

```bash
sudo visudo
```

Basic rules:

```
# User privilege specification
root    ALL=(ALL:ALL) ALL
%sudo   ALL=(ALL:ALL) ALL      # users in the "sudo" group can sudo
%admin  ALL=(ALL) ALL          # users in the "admin" group can sudo
alice   ALL=(ALL) NOPASSWD: ALL # alice can sudo without a password
```

The `sudo` group is the primary way regular users gain administrative privileges. By default, the first user created during installation is added to the `sudo` and `adm` groups.

### Common sudo Patterns

```bash
sudo -i              # Become root (load root's environment)
sudo -s              # Become root (load current environment)
sudo -u user command # Run a command as another user
sudo !!              # Re-run the last command with sudo
sudo !!              # Re-run with corrected permissions
```

## Groups

### Viewing Groups

```bash
# Show groups you belong to
groups

# Show groups of another user
groups alice

# List all groups
getent group

# Find groups containing a user
getent group | grep alice
```

### Managing Groups

```bash
# Create a group
sudo groupadd developers

# Create a group with specific GID
sudo groupadd -g 1500 developers

# Delete a group
sudo groupdel developers

# Rename a group
sudo groupmod -n newname oldname

# Change GID
sudo groupmod -g 1501 developers

# Add user to a group
sudo usermod -aG docker alice
```

### Group Files

- `/etc/group` — group accounts
- `/etc/gshadow` — group passwords (usually empty)

A typical `/etc/group` line:
```
developers:x:1500:alice,bob,charlie
```

Fields:
1. **Group name**
2. **Group password placeholder** (`x` means in `/etc/gshadow`)
3. **GID**
4. **Member users**

## Switching Users

### switch user (su)

```bash
# Switch to another user (prompts for password)
su - alice          # switch to alice with a login shell
su alice            # switch without loading new env
su -                 # switch to root

# Run a single command as another user
su - alice -c "whoami"
```

### runuser

`runuser` is a `su` alternative that doesn't require a password — it must be run as root:

```bash
sudo runuser -u alice -- whoami
```

### Practical Example: Running a Service as a Different User

```bash
# Create a dedicated service user
sudo useradd -r -s /usr/sbin/nologin myapp

# Run an app as that user
sudo -u myapp /usr/local/bin/myapp --daemon
```

## User Configuration Files

### The Login Shell's Dotfiles

When a user logs in, the shell reads configuration files in order:

For **login shells** (SSH, TTY login):
```
/etc/profile → ~/.profile → ~/.bash_profile (if exists, overrides ~/.profile)
```

For **interactive non-login shells** (new terminal windows in GUI):
```
/etc/bash.bashrc → ~/.bashrc
```

### Common User Configuration Files

| File | Purpose |
|---|---|
| `~/.bashrc` | Settings for interactive bash shells (aliases, env vars) |
| `~/.profile` | Settings for login shells |
| `~/.bash_aliases` | Separate file for aliases (sourced by .bashrc) |
| `~/.bash_logout` | Commands to run on logout |
| `~/.bash_history` | Command history |
| `~/.bash_profile` | Overrides ~/.profile if present |
| `~/.inputrc` | Readline (line-editing) configuration |

### System-Wide Configuration

| File/Directory | Purpose |
|---|---|
| `/etc/profile` | System-wide login shell settings |
| `/etc/bash.bashrc` | System-wide interactive bash settings |
| `/etc/shells` | List of valid login shells |
| `/etc/skel/` | Template copied to new users' home directories |
| `/etc/login.defs` | Password and login policies |

### Example: Setting Up a New User's Environment

```bash
# Add the user
sudo adduser alice

# Add to sudo group
sudo usermod -aG sudo alice

# Create a custom .bashrc
sudo cp /home/alice/.bashrc /home/alice/.bashrc.bak
cat >> /home/alice/.bashrc << 'EOF'

# Custom aliases
alias ll='ls -alF'
alias gs='git status'

# Custom PATH for local scripts
export PATH="$HOME/bin:$PATH"
EOF

# Fix ownership
sudo chown -R alice:alice /home/alice
```

## Managing User Sessions

### Watching Logged-In Users

```bash
# Show who is logged in
who

# Show detailed login info (tty, IP, login time)
w

# Show recent logins
last

# Show current user only
whoami    # or: id -un

# Show user and group IDs
id        # full info
id -u     # UID only
id -g     # primary GID
id -G     # all GIDs
```

### Terminating Sessions

```bash
# Kill all processes run by a user
sudo userkill alice        # may not exist on all systems

# Kill specific session
sudo ttykill tty2

# Kill a specific user's login session
sudo pkill -u alice
```

### Limiting Concurrent Logins

```bash
# Edit /etc/security/limits.conf
sudo nano /etc/security/limits.conf

# Example entry: limit alice to 2 concurrent sessions
alice  soft  maxsyslogins  2
```

## PAM (Pluggable Authentication Modules)

PAM is a flexible authentication framework. Configuration files live in `/etc/pam.d/`. You rarely need to modify these, but they power:

- Login authentication
- Sudo access
- Session limits
- Password policies

Example PAM config for SSH login (`/etc/pam.d/sshd`):
```
@include common-auth
@include common-account
@include common-session
```

## Review Questions

1. What is the UID of the root user, and how do you access root?
2. What does `usermod -aG` do differently from `usermod -G`?
3. What command shows which groups a user belongs to?
4. Where are password hashes stored?
5. What is the difference between `su` and `sudo`?

### Quick Reference

```bash
# Users
sudo adduser <username>
sudo userdel -r <username>
sudo usermod -aG <group> <username>
sudo passwd <username>
passwd

# Root/sudo
sudo <command>
sudo -i
sudo visudo

# Groups
sudo groupadd <groupname>
sudo groupdel <groupname>
groups <username>
getent group <groupname>

# Info
who
w
id
getent passwd <username>
```
