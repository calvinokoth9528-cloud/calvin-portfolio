# Chapter 4: File System Hierarchy and Management

## The Linux Filesystem Hierarchy

Unlike Windows, which assigns a drive letter (C:\, D:\, etc.) to each partition, Linux uses a unified **directory tree** rooted at `/`. Every file, folder, and device appears somewhere under this single root.

### The Filesystem Hierarchy Standard (FHS)

The **FHS** defines the directory structure and directory contents in Unix-like operating systems. Understanding it is essential for navigating and managing a Linux system.

| Directory | Purpose |
|---|---|
| `/` | Root — the top of the filesystem hierarchy |
| `/bin` | Essential user binaries (ls, cp, cat, bash) — needed for all users |
| `/boot` | Boot files — kernel images, initramfs, bootloader config |
| `/dev` | Device files — represents hardware (e.g., /dev/sda, /dev/tty1) |
| `/etc` | System-wide configuration files — host-specific |
| `/home` | User home directories — /home/username |
| `/lib` | Essential shared libraries and kernel modules |
| `/lib64` | 64-bit shared libraries (on some systems) |
| `/media` | Mount point for removable media (CDs, USB drives) |
| `/mnt` | Temporary mount point for filesystems |
| `/opt` | Optional add-on software — third-party applications |
| `/proc` | Virtual filesystem — runtime system information (kernel, processes) |
| `/root` | Home directory of the root user |
| `/run` | Runtime data — temporary data since last boot (PID files, sockets) |
| `/sbin` | System binaries — admin tools (fdisk, fsck, reboot) |
| `/srv` | Service data — data for specific services |
| `/sys` | Virtual filesystem — device and driver information (sysfs) |
| `/tmp` | Temporary files — world-writable, cleared at boot |
| `/usr` | User programs — read-only shared data, not essential for boot |
| `/var` | Variable data — logs, databases, mail, spool files |

### `/bin` — Essential Binaries

Contains programs needed for all users even in single-user mode. Includes:
- `bash`, `ls`, `cp`, `mv`, `rm`, `cat`, `grep`, `find`, `tar`, etc.

### `/sbin` — System Binaries

Contains programs typically run by the root user for system administration:
- `fdisk`, `fsck`, `iptables`, `lsof`, `mount`, `reboot`, `shutdown`, `useradd`, etc.

### `/usr` — Shareable, Read-Only Data

The secondary hierarchy for read-only user data. Contains:
- `/usr/bin` — Most user programs (`vim`, `python3`, `gcc`, etc.)
- `/usr/sbin` — Non-essential system binaries
- `/usr/lib` — Shared libraries
- `/usr/share` — Architecture-independent data (icons, docs, translations)
- `/usr/local` — Locally installed software (compiled by the admin)

### `/var` — Variable Data

Contains data that changes in size/growth:
- `/var/log` — System and application logs (e.g., `/var/log/apt/history.log`, `/var/log/syslog`)
- `/var/cache` — Application cache (e.g., APT package cache)
- `/var/lib` — State information (databases, package info)
- `/var/spool` — Spool files (mail, print jobs, cron queues)
- `/var/tmp` — Temporary files that persist across reboots

## File Types and Naming

### Types of Files

Linux treats everything as a file. The main types are:

| Type | Symbol | Description | Example |
|---|---|---|---|
| Regular file | `-` | Normal file containing data | `/etc/hostname` |
| Directory | `d` | A folder | `/home/user` |
| Symbolic link | `l` | Points to another file | `/usr/bin/python3` → `/usr/bin/python3.12` |
| Block device | `b` | Represents a block device | `/dev/sda` |
| Character device | `c` | Represents a character device | `/dev/tty1` |
| Named pipe (FIFO) | `p` | Inter-process communication pipe | /var/run/... |
| Socket | `s` | Network/IPC socket | `/run/systemd/journal/socket` |

### Case Sensitivity

Linux is **case-sensitive**. `file.txt`, `File.txt`, and `FILE.TXT` are three different files. Use consistent naming conventions (e.g., snake_case: `my_document.txt`).

### Hidden Files

Files starting with a dot (`.`) are hidden from the default `ls` output. Examples include:
- `.bashrc` — Bash configuration (loaded at login)
- `.profile` — Shell profile (loaded at login)
- `.ssh/` — SSH configuration directory
- `.git/` — Git repository metadata

Use `ls -a` to show hidden files.

## File Permissions

### The Permission Model

Every file and directory has three types of permissions for three classes of users:

```
-rwx rwx rwx
   ^  ^  ^
   |  |  |
Owner |  |
      Group |
              Others
```

| Symbol | Name | Description |
|---|---|---|
| `r` (4) | Read | Permission to read the file / list directory |
| `w` (2) | Write | Permission to write/modify the file / create files in directory |
| `x` (1) | Execute | Permission to execute the file / enter (cd) the directory |

Permissions are combined into three octal digits. For example:

- `rwxr-xr-x` = `755` (owner: full; group/others: read + execute)
- `rw-r--r--` = `644` (owner: read + write; group/others: read)
- `rwxrwxrwx` = `777` (everyone: full access)

### Viewing Permissions

```bash
# List with permissions (the "l" flag)
ls -l
ls -la          # includes hidden files
```

Example output:
```
drwxr-xr-x  2 alice alice 4096 Feb  3 12:00 Documents
-rw-r--r--  1 alice alice 1357 Feb  3 11:55 .bashrc
lrwxrwxrwx  1 alice alice    9 Feb  3 10:00 python3 -> python3.12
```

### Changing Permissions

```bash
# Symbolic mode
chmod u+x script.sh    # add execute for owner
chmod g-w file.txt     # remove write for group
chmod o=r document.txt # set others to read-only
chmod a+rw folder/     # add read+write for all

# Octal mode
chmod 755 script.sh    # rwxr-xr-x
chmod 644 config.cfg   # rw-r--r--
chmod 600 secret.key   # rw------- (owner only)
```

### Changing Ownership

```bash
# Change owner
sudo chown alice file.txt

# Change owner and group
sudo chown alice:developers file.txt

# Change directory and contents recursively
sudo chown -R alice:developers /opt/myapp/

# Change group only
sudo chgrp developers file.txt
```

### Special Permissions

| Permission | Symbol | Octal | Description |
|---|---|---|---|
| **SetUID** | `s` in owner execute position | 4xxx | File executes as the **file owner** |
| **SetGID** | `s` in group execute position | 2xxx | File executes as the **group** or new files in dir inherit the dir's group |
| **Sticky bit** | `t` in others execute position | 1xxx | Only file owner, dir owner, or root can delete files in dir |

Example:
```bash
# Set the sticky bit on /tmp (default)
sudo chmod 1777 /tmp

# Set SetGID on a shared directory
sudo chmod 2775 /srv/shared
```

## File Operations

### Working with Files in the Command Line

```bash
# Navigation
pwd          # print working directory
cd /path     # change directory
cd ..        # go up one level
cd ~         # go to home directory
cd -         # go to previous directory

# Listing
ls           # list files
ls -l        # detailed list
ls -a        # show hidden files
ls -la       # both
ls -lh       # human-readable sizes (KB, MB, GB)
ls -R        # recursive list

# Manipulating files
cp source.txt dest.txt             # copy
cp -r sourcedir/ destdir/           # copy directory recursively
mv old.txt new.txt                 # rename/move
rm file.txt                        # remove file
rm -rf directory/                  # force recursive remove (dangerous!)

# Creating files and directories
touch file.txt                     # create empty file or update timestamp
mkdir newdir                       # create directory
mkdir -p a/b/c                     # create nested dirs
```

### File Content Operations

```bash
# Displaying content
cat file.txt                       # print entire file
less file.txt                      # pager (press q to quit)
head file.txt                      # first 10 lines
tail file.txt                      # last 10 lines
tail -f log.txt                    # follow log in real time

# Searching within files
grep "pattern" file.txt            # search for lines matching pattern
grep -i "pattern" file.txt         # case-insensitive
grep -r "pattern" /dir/            # recursive
grep -n "pattern" file.txt         # show line numbers

# Redirect output
cat file.txt > copy.txt            # redirect (overwrite)
echo "text" >> file.txt            # redirect (append)
ls -l > listing.txt                # save ls output to file

# Pipes
cat file.txt | grep "pattern"      # pipe output of one command to another
cat file.txt | wc -l               # count lines
```

### File Compression and Archiving

#### tar — Tape Archive

```bash
# Create a tar.gz archive
tar -czvf archive.tar.gz /path/to/dir

# Create a tar.bz2 archive (better compression)
tar -cjvf archive.tar.bz2 /path/to/dir

# Extract an archive
tar -xzvf archive.tar.gz
tar -xjvf archive.tar.bz2

# Common flags
-c     create
-x     extract
-v     verbose (show progress)
-f     file (specify filename)
-t     list contents
-z     gzip compression
-j     bzip2 compression
-C     change to directory before operating
```

#### zip/unzip

```bash
# Create a zip archive
zip -r archive.zip folder/

# Extract
unzip archive.zip
```

## Finding Files

### locate

`locate` searches a cached database (updated daily by cron):

```bash
locate filename.txt        # find by name (substring match)
locate -i FILENAME.TXT     # case-insensitive
```

Update the database manually:
```bash
sudo updatedb
```

### find

`find` searches the live filesystem and is extremely powerful:

```bash
# Find by name
find /home -name "*.txt"

# Find by type
find /home -type d -name "Documents"

# Find by modification time
find /home -name "*.log" -mtime -7    # modified in last 7 days

# Find and delete
find /tmp -name "*.tmp" -delete

# Find and execute a command
find /home -name "*.jpg" -exec chmod 644 {} \;
```

### which, type, whereis

```bash
which python3        # show full path to executable
type python3         # show how python3 would be interpreted
whereis python3      # locate binary, source, and man page
```

## File System Types

Linux supports many filesystems. The default for Ubuntu is **ext4**.

### ext4 (Fourth Extended Filesystem)

- Default since Ubuntu 9.10
- Journaling (prevents corruption after a crash)
- Supports files up to 16 TB and filesystems up to 1 EB
- Backward-compatible with ext2/ext3

### Other Filesystems

| Filesystem | Use Case |
|---|---|
| **NTFS** | Windows-compatible (used for shared USB drives) |
| **FAT32/exFAT** | USB drives shared with Windows (FAT32 has 4GB file limit) |
| **Btrfs** | Advanced features (snapshots, copy-on-write) — experimental on Ubuntu |
| **XFS** | Large files and parallel I/O — common on servers |
| **ZFS** | Enterprise filesystem with snapshots, compression, RAID-Z |

### Checking Disk Usage

```bash
# Show disk space
df -h                          # human-readable

# Show directory size
du -sh /path/to/dir            # summary, human-readable
du -sh /path/to/dir/*          # size of each item inside

# Largest directories
du -h / 2>/dev/null | sort -rh | head -n 20
```

## Mounting Filesystems

### Mount Command

```bash
# Mount a partition
sudo mount /dev/sdb1 /mnt/usb

# Mount with options
sudo mount -t ntfs-3g -o rw,uid=1000 /dev/sdc1 /mnt/windows

# Unmount
umount /mnt/usb                # or: sudo umount /dev/sdb1
```

### /etc/fstab — Automatic Mounts

The file `/etc/fstab` (file systems table) lists filesystems to be mounted at boot:

```
# file system        mount point      type    options          dump  pass
/dev/sda1            /                ext4    defaults         0     1
/dev/sda2            none             swap    sw               0     0
/dev/sdb1            /mnt/windows     ntfs    defaults         0     0
```

To add a new mount point:
1. Edit `/etc/fstab` (`sudo nano /etc/fstab`)
2. Add a line with the device, mount point, type, and options
3. Create the mount directory (`sudo mkdir /mnt/windows`)
4. Test with `sudo mount -a`

### UUIDs vs Device Names

Device names (`/dev/sda1`) can change. Use **UUID** (Universally Unique Identifier) instead for reliability:

```bash
# Find UUIDs
sudo blkid

# Use UUID in fstab
UUID=1234-5678  /mnt/data  ext4  defaults  0  2
```

## Hard Links and Symbolic Links

### Hard Links

A hard link is another name for the same file (same inode):

```bash
ln original.txt link.txt      # create hard link

# Hard links cannot cross filesystems and cannot be made for directories
```

### Symbolic Links (Symlinks)

A soft link (symlink) is a special file that points to another file:

```bash
ln -s target.txt link.txt     # create symbolic link

# Can point across filesystems and to directories
ls -l link.txt                # shows the target
```

Useful for:
- Sharing configs across users
- Pointing to versioned binaries (e.g., `python3 -> python3.12`)
- Organizing dotfiles

## File System Checks and Maintenance

### fsck — File System Check

```bash
# Run on next boot (safest)
sudo touch /forcefsck
sudo reboot

# Or check unmounted filesystem directly (DANGEROUS for mounted filesystems)
sudo fsck /dev/sdb1
sudo fsck -f /dev/sdb1         # force even if marked clean
sudo fsck -y /dev/sdb1         # auto-repair
```

### Checking for Bad Blocks

```bash
sudo badblocks -v /dev/sda1 > bad_blocks.txt
```

## Review Questions

1. What is the root directory in the Linux filesystem?
2. What is the difference between `/bin` and `/usr/bin`?
3. What permission string corresponds to octal `750`?
4. What does a symbolic link point to?
5. What is the purpose of `/etc/fstab`?

### Quick Reference

```bash
# Navigation
pwd
cd /path

# File operations
ls -la
cp -r src dest
mv old new
rm -rf dir
mkdir -p a/b/c

# Find files
find / -name "file.txt"
locate file.txt
which command

# Check disk
df -h
du -sh /path

# Permissions
chmod 755 file
chmod u+x file
chown user:group file
```
