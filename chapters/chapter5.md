# Chapter 5: Command Line Fundamentals

## What Is a Shell?

The **shell** is the program that interprets commands typed at the terminal. Ubuntu's default shell is **Bash** (Bourne-Again SHell). Other popular shells include **Zsh**, **Fish**, and **sh** (the original Bourne shell).

### Getting to the Shell

| Method | Shortcut |
|---|---|
| Graphical terminal emulator | `Ctrl` + `Alt` + `T` (Ubuntu default) |
| GNOME Terminal | Launch from Applications grid |
| TTY (virtual console) | `Ctrl` + `Alt` + `F1`-`F7` (F7 returns to GUI) |

### Shell Prompts

When you open a terminal, you see a prompt like:

```
alice@ubuntu:~$
```

Breaking it down:
- `alice` — your username
- `ubuntu` — hostname of your computer
- `~` — current working directory (`~` = home directory)
- `$` — end of prompt (indicates a regular user; `#` means root)

### The Command Structure

Most commands follow this pattern:

```bash
command [options] [arguments]
```

Example:
```bash
ls -l /home
```
- `ls` — the command
- `-l` — an option (long listing format)
- `/home` — an argument (target directory)

Options can be combined (e.g., `ls -la`) and are usually preceded by `-` (short for `--long`).

## Essential Commands

### Navigation Commands

```bash
pwd          # Print Working Directory — show current location
cd [dir]     # Change Directory
cd           # Go to home (~)
cd ..        # Go up one level
cd -         # Go to previous directory
ls [dir]     # List directory contents
```

### File and Directory Commands

```bash
cp [src] [dst]          # Copy
mv [src] [dst]          # Move/Rename
rm [file]               # Remove/Delete
rmdir [dir]             # Remove empty directory
mkdir [dir]             # Make directory
touch [file]            # Create empty file or update timestamp
```

### File Content Commands

```bash
cat [file]              # Print entire file
less [file]             # View file with scrolling (q to quit)
head [file]             # Print first 10 lines
tail [file]             # Print last 10 lines
tail -f [file]          # Follow file in real time
grep [pattern] [file]   # Search for pattern
wc [file]               # Word/line/byte count
```

### File Permission Commands

```bash
chmod [perms] [file]    # Change permissions (e.g., chmod 755 script.sh)
chown [user] [file]     # Change owner (e.g., chown alice file.txt)
chgrp [group] [file]    # Change group
```

## Getting Help

### man — Manual Pages

Every command has a manual page:

```bash
man ls          # Read the manual for ls
man -k keyword  # Search for commands related to keyword
man 5 passwd    # Read the passwd file format (section 5)
```

Navigate within `man`:
- **Space** — page down
- **b** — page up
- **/pattern** — search forward
- **q** — quit

### --help

Most commands print a brief usage summary:

```bash
ls --help
```

### info

Some GNU packages provide more detailed info pages:

```bash
info ls
```

## Path and Environment

### Environment Variables

Environment variables store system and user configuration:

```bash
# View a variable
echo $HOME        # usually /home/alice

# List all variables
env
printenv

# Set a variable (current session only)
export MYVAR="hello"

# Permanent: add to ~/.bashrc for user, /etc/environment for system
```

Common variables:

| Variable | Description | Example |
|---|---|---|
| `$HOME` | User home directory | `/home/alice` |
| `$USER` | Current username | `alice` |
| `$PWD` | Current directory | `/home/alice/Documents` |
| `$PATH` | Directories to search for commands | `/usr/local/bin:/usr/bin:...` |
| `$SHELL` | Current shell | `/bin/bash` |
| `$LANG` | Locale settings | `en_US.UTF-8` |

### The PATH Variable

`PATH` is a colon-separated list of directories that the shell searches when you type a command:

```
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

Example: When you type `ls`, the shell searches each directory in PATH for an `ls` executable and runs the first one found.

### Modifying PATH

```bash
# Add ~/bin to PATH (in ~/.bashrc)
export PATH="$HOME/bin:$PATH"
```

## Input/Output Redirection

### Redirecting Output

```bash
ls -l > listing.txt        # Write output to file (overwrite)
ls -l >> listing.txt       # Append output to file
```

### Redirecting Input

```bash
grep "pattern" < file.txt  # Use file as input
sort < words.txt           # Sort lines from file
```

### Pipes

The pipe (`|`) connects the output of one command to the input of another:

```bash
ls -la | grep ".txt"       # List and filter for .txt files
cat file.txt | wc -l       # Count lines in file
dmesg | grep "error"       # Filter kernel messages
```

### Standard Streams

Every command has three standard streams:

| Stream | File Descriptor | Description | Default Destination |
|---|---|---|---|
| **stdin** | 0 | Standard input | Keyboard |
| **stdout** | 1 | Standard output | Terminal |
| **stderr** | 2 | Standard error | Terminal |

```bash
# Redirect stderr
ls /nonexistent 2> errors.log

# Redirect both
ls -la > output.log 2>&1

# Discard output
command > /dev/null 2>&1
```

## Globbing — Pattern Matching

The shell expands patterns before passing them to commands:

```bash
ls *.txt           # All files ending in .txt
ls file?.log       # file1.log, fileA.log (but not file10.log)
ls [abc]*          # All entries starting with a, b, or c
echo {1..5}        # Expand to: 1 2 3 4 5
ls ~/*.md          # All Markdown files in home directory
```

Special characters:
- `*` — matches any string (including empty)
- `?` — matches exactly one character
- `[abc]` — matches one character from the set {a, b, c}
- `[!abc]` — matches any character **except** a, b, c
- `{...}` — brace expansion

## Quoting and Escaping

### Single Quotes (`'`)

Everything inside single quotes is taken literally — no variable expansion, no special characters:

```bash
echo '$HOME'       # Prints literally $HOME
echo 'My $avings'  # Prints literally My $avings
```

### Double Quotes (`"`)

Double quotes allow variable expansion and command substitution but prevent most other special meanings:

```bash
echo "Hello $USER"    # Expands $USER
echo "My $avings"     # $avings is empty (My  with a space)
```

### Escaping with Backslash (`\`)

```bash
echo The \$avings     # Prints: The $avings
echo "Hello, world"\!  # Prints: Hello, world!
```

## History

The shell keeps a history of commands you type:

```bash
history                  # Show history
history -c               # Clear history
!!                       # Repeat last command
!n                       # Repeat command number n
!string                 # Repeat last command starting with "string"
```

Navigate history with:
- **Up/Down arrow** keys
- **Ctrl** + **R** — reverse search (type to search, Enter to execute)
- **Ctrl** + **G** — cancel search

History is saved in `~/.bash_history`.

## Tab Completion

Pressing **Tab** auto-completes file names, command names, variable names, etc.:

- Tab once — completes as much as possible
- Tab twice — shows possible completions
- **Ctrl** + **Alt** + **/ (Slash)** — complete using words from your history

## Aliases

Aliases are shortcuts for longer commands:

```bash
# Define an alias
alias ll='ls -alF'

# View aliases
alias

# Make alias permanent by adding to ~/.bashrc
echo "alias ll='ls -alF'" >> ~/.bashrc
source ~/.bashrc
```

Common default aliases on Ubuntu:
```bash
alias ls='ls --color=auto'
alias grep='grep --color=auto'
```

## Command Substitution

Replace a command with its output using `$(...)` or backticks:

```bash
# Both are equivalent
files=$(ls)
files=`ls`

echo "There are $(ls | wc -l) files in this directory"
```

## Text Processing Tools

### grep — Global Regular Expression Print

Search for patterns in files:

```bash
grep "error" log.txt              # find lines containing "error"
grep -i "warning" log.txt         # case-insensitive
grep -n "pattern" file.txt        # show line numbers
grep -v "pattern" file.txt        # invert (lines NOT matching)
grep -r "pattern" /path/          # recursive
grep -E "ext(4|3)" /proc/mounts   # extended regex
grep -c "pattern" file.txt        # count matches
```

### sed — Stream Editor

Perform text transformations:

```bash
sed 's/old/new/' file.txt         # replace first occurrence per line
sed 's/old/new/g' file.txt        # replace all
sed 's/old/new/gi' file.txt       # global + case-insensitive
echo "$var" | sed 's/^ *//; s/ *$//'  # trim whitespace
```

### awk — Text Processing Language

Process fields and columns:

```bash
awk '{print $1, $5}' /etc/passwd  # print first and fifth fields
awk -F: '{print $1}' /etc/passwd  # use : as delimiter
ls -l | awk '$5 > 1000 {print $9}'  # files larger than 1000 bytes
```

## File Viewing and Editing

### Viewing Files

```bash
cat file                    # entire file
less file                   # paged view
head file                   # first 10 lines
tail file                   # last 10 lines
tail -f file                # follow (watch changes)
tail -n 5 file              # last 5 lines
```

### Text Editors

#### nano

A beginner-friendly WYSIWYG editor (default in the terminal):

```bash
nano file.txt
```
Common operations:
- `Ctrl` + **O** — write out (save)
- `Ctrl` + **X** — exit
- `Ctrl** + **K** — cut line
- `Ctrl` + **U** — paste

#### vim

A powerful modal editor (vi improved):

```bash
vim file.txt
```
Basics:
- `i` — insert mode (make changes)
- `Esc` — command mode (navigate, execute commands)
- `:w` — write/save
- `:q` — quit
- `:wq` — write and quit
- `:x` — same as `:wq`
- `dd` — delete line
- `yy` — copy line
- `p` — paste

### Viewing Logs

```bash
journalctl                    # systemd journal
journalctl -u ssh             # logs for ssh service
journalctl -f                 # follow
tail -f /var/log/syslog       # traditional syslog
```

## Process Management

### Viewing Processes

```bash
ps                    # processes for current shell
ps aux                # all processes, full output
top                   # dynamic, real-time view (press q to quit)
htop                  # enhanced top (sudo apt install htop)
```

### Managing Processes

```bash
kill [pid]            # send signal to process (default: TERM)
kill -9 [pid]         # force kill (KILL signal)
killall name          # kill all processes by name
pkill -f "pattern"    # kill processes matching pattern
```

### Backgrounding

```bash
command &            # run in background
command              # run in foreground
Ctrl + Z             # suspend (stop) a foreground process
bg %1                # resume stopped job in background
fg %1                # bring job to foreground
jobs                 # list jobs
```

## Archiving and Compression

### tar

```bash
tar -czvf archive.tar.gz files...    # create gzip archive
tar -xzvf archive.tar.gz            # extract gzip archive
tar -cjvf archive.tar.bz2 files...   # create bzip2 archive
tar -xjvf archive.tar.bz2            # extract bzip2 archive
```

Common `tar` flags:
- `-c` — create
- `-x` — extract
- `-v` — verbose (show files)
- `-f` — file (use next argument as filename)
- `-t` — list contents
- `-z` — gzip
- `-j` — bzip2
- `-J` — xz

### Other tools

```bash
zip -r archive.zip files...          # create zip
unzip archive.zip                      # extract zip
rar a archive.rar files...           # create rar (need unrar)
unrar x archive.rar                  # extract rar
```

## Review Questions

1. What command shows you your current working directory?
2. How do you get help for a command?
3. What redirect operator overwrites a file? Which appends?
4. How do you search for a pattern in a file?
5. How do you send a process to the background?

### Quick Reference

```bash
# Navigation
pwd
ls -la
cd ~
cd ..
cd -

# File ops
cp src dst
mv src dst
rm file
mkdir dir

# Help
man ls
ls --help
info ls

# Pipes and redirects
ls | grep ".txt"
echo "text" > file.txt
cat file.txt | wc -l

# Globbing
ls *.txt
ls file?.log

# History
history
Ctrl + R
!!

# Completion
Tab
Ctrl + Alt + /
```
