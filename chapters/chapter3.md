# Chapter 3: Desktop Environment

## What Is a Desktop Environment?

A **desktop environment (DE)** is a complete graphical user interface (GUI) built on top of the X Window System (X11) or Wayland display server. It provides:

- Window manager (decorations, placement, compositing)
- File manager
- Panel / taskbar
- Application launcher / menu
- System tray and notifications
- Settings panels
- Default applications (text editor, terminal, browser)

The desktop environment is what makes the graphical interface feel cohesive and consistent across applications.

## GNOME: The Default Desktop

Ubuntu has used **GNOME** as its default desktop since Ubuntu 17.10 (replacing Unity). GNOME 3 features a minimalist "Activities Overview" design.

### Key GNOME Components in Ubuntu

| Component | Description |
|---|---|
| **GNOME Shell** | The top panel, activities overview, and dash |
| **Nautilus** | File manager ("Files") |
| **GNOME Terminal** | Default terminal emulator |
| **Gedit** | Simple text editor |
| **GNOME Control Center** | System settings |
| **GNOME Extensions** | Add-ons to customize behavior |

### Navigating the GNOME Shell

- **Activities Overview**: Move the mouse to the top-left corner or press **Super** (Windows key) to enter the Activities overview, where you can see open windows, search for apps, and access workspaces.
- **Dash**: The left sidebar in Activities shows favorite and running applications.
- **Workspaces**: Virtual desktops (default 1, dynamically created — Ubuntu typically uses 2).
- **System Menu**: Top-right corner: power, network, sound, user menu.
- **Notification Center**: Top-right corner: clock, notifications, calendar.

### GNOME Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Super` | Open Activities Overview |
| `Super` + `A` | Show applications grid |
| `Super` + Number (1-9) | Launch/focus favorite apps on the dash |
| `Super` + `Tab` | Switch between apps |
| `Alt` + `Tab` | Switch between windows |
| `Super` + `Page Up/Down` | Switch workspaces |
| `Super` + `Home` | Restore window size |
| `Super` + `Up` | Maximize window |
| `Super` + `Down` | Unmaximize / tile window |
| `Super` + `Left/Right` | Tile window left/right |
| `Super` + `L` | Lock screen |
| `Ctrl` + `Alt` + `T` | Open terminal |
| `Ctrl` + `Alt` + `D` | Show desktop |
| `PrtSc` | Screenshot of screen |
| `Shift` + `PrtSc` | Screenshot of selected area |

### Customizing GNOME

#### GNOME Extensions

Extensions add features to GNOME Shell. Install and manage them via:

1. Install the browser extension from [extensions.gnome.org](https://extensions.gnome.org)
2. Install the local integration package:

```bash
sudo apt install chrome-gnome-shell
```

Popular extensions:
- **Dash to Panel**: Traditional Windows-style taskbar
- **Dash to Dock**: Enhanced dock
- **User Themes**: Custom shell themes
- **GSConnect**: Android phone integration (KDE Connect for GNOME)
- **Clipboard Indicator**: Clipboard history
- **System Monitor**: Resource usage in panel

#### Appearance Settings

Open **Settings → Appearance** to change:
- Light/Dark mode
- Accent color
- Wallpaper
- Dock position and behavior
- Panel visibility

#### Tweaks Tool

For deeper customization:

```bash
sudo apt install gnome-tweaks
gnome-tweaks
```

The Tweaks tool lets you change themes, fonts, window titlebar actions, startup applications, and more.

## Alternative Desktop Environments

### KDE Plasma (Kubuntu)

**KDE Plasma** is highly customizable with a Windows-like feel. The default file manager is **Dolphin**, and the terminal is **Konsole**.

To install on Ubuntu:

```bash
sudo apt install kubuntu-desktop
```

This installs the full Kubuntu desktop. To get just Plasma without extra apps:

```bash
sudo apt install kde-plasma-desktop
```

### XFCE (Xubuntu)

**XFCE** is a lightweight, stable desktop environment — ideal for older hardware. The default file manager is **Thunar**.

To install on Ubuntu:

```bash
sudo apt install xubuntu-desktop
```

### MATE (Ubuntu MATE)

**MATE** is a fork of GNOME 2, offering a traditional desktop layout. To install:

```bash
sudo apt install ubuntu-mate-desktop
```

### LXQt (Lubuntu)

**LXQt** is an ultra-lightweight Qt-based desktop. To install:

```bash
sudo apt install lubuntu-desktop
```

## Switching Between Desktop Environments

### At Login Screen

At the GDM login screen, click the gear icon (⚙) to select the session type (GNOME, Plasma, XFCE, etc.) before logging in.

### Changing the Default

To change the default desktop environment:

```bash
# List installed sessions
ls /usr/share/xsessions/
ls /usr/share/wayland-sessions/

# Set default session (replace <session> with desired value)
sudo dpkg-reconfigure
```

## Display Servers: X11 vs. Wayland

### X11 (X Window System)

The traditional display server. It works with all hardware but has limitations in security and modern display features (HiDPI, fractional scaling, touch).

### Wayland

The modern display server (default since Ubuntu 21.04). Benefits:
- Better HiDPI support
- Proper fractional scaling
- Improved security (no screen recording by default)
- Better multi-touch support

Limitations:
- Some legacy/proprietary apps may not work (e.g., some screencasting tools)
- Remote desktop support is still maturing

### Checking Which Display Server You Use

```bash
# Check if running under Wayland
echo $XDG_SESSION_TYPE

# Check Wayland socket
echo $WAYLAND_DISPLAY
```

### Forcing X11 on Login

At the GDM login screen, click the gear icon and select "Ubuntu on Xorg".

## File Management

### Nautilus (Files)

Nautilus is Ubuntu's default file manager. Key features:

- **Sidebar**: Quick access to home, devices, network, bookmarks
- **Tabs**: Multiple folders in one window (Ctrl + T)
- **Search**: Instant search by name or content (Ctrl + F)
- **Bookmarks**: Add frequently-used folders to the sidebar (Ctrl + D)
- **List and Icon views**: Switch via toolbar or Ctrl + 1/2
- **Trash**: Deleted files go to Trash (not permanently deleted)

#### Nautilus Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl` + `N` | New window |
| `Ctrl` + `T` | New tab |
| `Ctrl` + `W` | Close tab |
| `Ctrl` + `Tab` | Next tab |
| `Ctrl` + `L` | Focus location bar |
| `Ctrl` + `D` | Bookmark |
| `Ctrl` + `+` | Zoom in |
| `Ctrl` + `0` | Reset zoom |

### Hidden Files

Files starting with `.` are hidden. Show them with:

- Nautilus: Press `Ctrl` + `H`
- Terminal: `ls -a`

### File Permissions in GUI

Right-click a file → **Properties** → **Permissions** tab. Here you can set read/write/execute permissions for the owner, group, and others, and change ownership (requires the admin password).

## The Terminal

The terminal (GNOME Terminal by default) is your gateway to the command line.

### Terminal Features

- **Tabs**: Multiple terminal sessions (Ctrl + Shift + T for new tab)
- **Profiles**: Custom colors, fonts, and shortcuts
- **Copy/Paste**: Ctrl + Shift + C / Ctrl + Shift + V (or right-click)
- **Scrollback**: Unlimited scrollback history (configurable)

### Terminal Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl` + `Shift` + `T` | New tab |
| `Ctrl` + `Shift` + `W` | Close tab |
| `Ctrl` + `Shift` + `Page Up/Down` | Switch tab |
| `Ctrl` + `Shift` + `+`/`-` | Increase/decrease font |
| `Ctrl` + `Shift` + `N` | New window |

### Alternative Terminals

- **Tilix**: Tiling terminal emulator
- **Terminator**: Split panes
- **Konsole**: KDE's terminal (feature-rich)

```bash
sudo apt install tilix terminator
```

## Managing Applications

### Ubuntu Software Center

The **Snap Store** (formerly Ubuntu Software) lets you browse, install, and remove applications. It supports both traditional DEB packages and Snap packages.

### Installing Applications via GUI

1. Open the Snap Store
2. Search for the application
3. Click "Install"

### Finding Applications

- **Activities Overview**: Type the app name (Super key, then type)
- **Applications Grid**: Super + A, then click the grid icon at the bottom
- **Command line**: `which <appname>` to find the binary

## System Settings

Ubuntu's **Settings** app (GNOME Control Center) centralizes system configuration:

- **Wi-Fi / Network**: Network connections
- **Power**: Battery and power button behavior
- **Sound**: Audio devices and volume
- **Mouse & Touchpad**: Pointer speed, tapping, scrolling
- **Keyboard**: Shortcuts, repeat rate, input sources
- **Displays**: Resolution, orientation, Night Light
- **Users**: Account settings, password, photo
- **Privacy**: Usage data, search, history
- **Region & Language**: Timezone, locale, keyboard layouts
- **Date & Time**: Automatic time, time zone
- **About**: System information (hardware, OS version)

## Accessibility

GNOME has strong accessibility features under **Settings → Accessibility**:

- **Zoom**: Screen magnifier
- **Large Text**: Enlarge interface text
- **High Contrast**: High-contrast color theme
- **Screen Keyboard**: On-screen keyboard
- **Sticky Keys**: One-key modifier activation
- **Slow Keys**: Ignore quick keystrokes
- **Blinking Keys**: Visual feedback for Caps/Num Lock
- **Reading**: Screen reader (Orca)

## Review Questions

1. What is the difference between a display server and a desktop environment?
2. What keyboard shortcut opens the Activities Overview in GNOME?
3. How do you install the KDE Plasma desktop on standard Ubuntu?
4. What are two advantages of Wayland over X11?
5. What file manager does XFCE use by default?

### Quick Reference

```bash
# Install GNOME Tweaks for customization
sudo apt install gnome-tweaks

# Install kde-plasma-desktop
sudo apt install kde-plasma-desktop

# Install xubuntu-desktop
sudo apt install xubuntu-desktop

# Check current desktop session
echo $XDG_CURRENT_DESKTOP

# Check display server
echo $XDG_SESSION_TYPE
```
