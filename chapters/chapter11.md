# Chapter 11: Development and Programming on Ubuntu

## Setting Up a Development Environment

Ubuntu is a developer-friendly platform with excellent out-of-the-box support for programming languages, package managers, and development tools.

### Essential Build Tools

```bash
# Install the base development toolchain
sudo apt install build-essential

# This installs: gcc, g++, make, libc6-dev, dpkg-dev, and more

# Verify installation
gcc --version
g++ --version
make --version
```

`build-essential` is a meta-package that pulls in the GNU Compiler Collection (GCC), make, and the C/C++ standard libraries. It's the starting point for compiling software.

### Version Control with Git

Git is the standard version control system:

```bash
# Install Git
sudo apt install git

# Configure Git (set your identity)
git config --global user.name "Alice Anderson"
git config --global user.email "alice@example.com"
git config --global init.defaultBranch main

# Clone a repository
git clone https://github.com/user/repo.git

# Or clone with SSH (first set up SSH keys)
ssh-keygen -t ed25519 -C "alice@example.com"
ssh-copy-id git@github.com
git clone git@github.com:user/repo.git
```

Common Git workflow:

```bash
# Check status
git status

# Stage changes
git add file.txt
git add .

# Commit
git commit -m "Commit message"

# Push
git push origin main

# Pull
git pull origin main

# Create and switch to a branch
git checkout -b feature-branch

# Merge
git checkout main
git merge feature-branch

# View history
git log --oneline --graph --decorate
```

### Python Development

Python 3 is pre-installed on Ubuntu. For development:

```bash
# Install pip and venv
sudo apt install python3-pip python3-venv

# Create a virtual environment
python3 -m venv myproject
cd myproject
source bin/activate      # activate (you'll see "myproject" in prompt)
deactivate               # deactivate

# Install packages
pip install requests flask

# Install a specific version
pip install "requests==2.31.0"

# Freeze requirements
pip freeze > requirements.txt

# Install from requirements
pip install -r requirements.txt

# Install a package system-wide (not recommended — use venv instead)
pip install --break-system-packages <package>

# Check pip configuration
pip config list
```

Virtual environments are the standard practice to avoid dependency conflicts between projects.

#### Modern Python Workflow with uv

**uv** is a fast Python package and project manager (Rust-based):

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create a project
uv venv
source .venv/bin/activate

# Install packages
uv pip install requests

# Initialize a pyproject.toml project
uv init
```

### Node.js Development

```bash
# Option 1: Install from Ubuntu repositories (often older)
sudo apt install nodejs npm

# Option 2: Use Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts     # install latest LTS
nvm use --lts         # use LTS for this shell
nvm ls                # list installed versions

# Install a package globally
npm install -g typescript

# Initialize a project
mkdir myproject && cd myproject
npm init -y               # creates package.json
npm install express       # install dependency
npm install              # install all dependencies

# Use yarn or pnpm instead of npm
corepack enable yarn
corepack enable pnpm
```

### Java Development

```bash
# Install OpenJDK
sudo apt install openjdk-17-jdk

# Or use JDK management via SDKMAN!
curl -s "https://get.sdkman.io" | bash
source "~/.sdkman/bin/sdkman-init.sh"
sdk install java 17.0.8-tem

# Verify
java -version
javac -version

# Set JAVA_HOME
echo 'export JAVA_HOME=$HOME/.sdkman/candidates/java/current' >> ~/.bashrc
source ~/.bashrc
```

### Rust Development

```bash
# Install Rust (via rustup)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# Verify
rustc --version
cargo --version

# Create a new project
cargo new hello_world
cd hello_world
cargo build
cargo run
cargo test

# Add dependencies in Cargo.toml
# [dependencies]
# reqwest = "0.11"
```

### Go Development

```bash
# Option 1: Install from Ubuntu repositories
sudo apt install golang

# Option 2: Install from official site
wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin' >> ~/.bashrc
source ~/.bashrc

# Set up GOPATH
mkdir -p ~/go
echo 'export GOPATH=$HOME/go' >> ~/.bashrc

# Verify
go version

# Create a new project
mkdir -p ~/go/src/hello
cd ~/go/src/hello
go mod init hello
go build
go run hello.go
```

### C/C++ with Modern Tooling

```bash
# Install build tools
sudo apt install build-essential cmake ninja-build clang lld

# Install Conan (C/C++ package manager)
pip install conan

# Create a project with CMake
mkdir myproject && cd myproject
mkdir build && cd build
cmake ..
make
```

CMake is the standard build system for C/C++ projects. A `CMakeLists.txt` looks like:

```cmake
cmake_minimum_required(VERSION 3.16)
project MyApp)

set(CMAKE_CXX_STANDARD 20)

find_package(Threads REQUIRED)

add_executable(myapp main.cpp)
target_link_libraries(myapp PRIVATE Threads::Threads)
```

## IDEs and Code Editors

### Visual Studio Code

VS Code is the most popular editor for many developers:

```bash
# Install via Snap (auto-updating)
sudo snap install code --classic

# Or install via .deb package (from Microsoft)
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /usr/share/keyrings/
sudo sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" > /etc/apt/sources.list.d/vscode.list'
sudo apt update && sudo apt install code
```

Essential VS Code extensions:
- Python
- ESLint
- Prettier
- GitLens
- Docker
- Remote - SSH

### JetBrains Toolbox

```bash
# Download the Toolbox App
wget https://download.jetbrains.com/toolbox/jetbrains-toolbox-2.3.2.25360.tar.gz
tar -xzf jetbrains-toolbox-*.tar.gz
./jetbrains-toolbox
```

### Vim/Neovim Configuration

For a modern vim experience, install plugins via a plugin manager like vim-plug:

```bash
# Neovim (modern vim)
sudo apt install neovim

# Install nvm and Node.js for LSP support
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Create `~/.config/nvim/init.lua`:

```lua
-- Basic settings
vim.o.number = true
vim.o.relativenumber = true
vim.o.expandtab = true
vim.o.shiftwidth = 4

-- Key mappings
vim.g.mapleader = " "
vim.keymap.set("n", "<C-s>", ":w<CR>")

-- LSP setup (requires nodejs)
require('mason').setup()
require('lspconfig').pyright.setup{}
```

Install plugins via `vim-plug` or `lazy.nvim`:

```bash
git clone https://github.com/folke/lazy.nvim.git ~/.local/share/nvim/site/pack/packer/start/lazy.nvim
```

## Database Development

### PostgreSQL

```bash
# Install
sudo apt install postgresql postgresql-contrib

# Start and enable
sudo systemctl enable --now postgresql

# Check status
sudo systemctl status postgresql

# Switch to postgres user and open psql
sudo -u postgres psql

# Basic SQL commands
# \l     - list databases
# \c db  - connect to database
# \dt    - list tables
# \q     - quit

# Create a database and user
sudo -u postgres createdb mydb
sudo -u postgres psql -c "CREATE USER alice WITH ENCRYPTED PASSWORD 'secret';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mydb TO alice;"
```

### MySQL/MariaDB

```bash
sudo apt install mysql-server

# Secure installation (sets root password, removes test db)
sudo mysql_secure_installation

# Start
sudo systemctl enable --now mysql

# Login
sudo mysql -u root -p

# Create database and user
CREATE DATABASE mydb;
CREATE USER 'alice'@'localhost' IDENTIFIED BY 'secret';
GRANT ALL PRIVILEGES ON mydb.* TO 'alice'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Redis

```bash
sudo apt install redis-server
sudo systemctl enable --now redis

# Test
redis-cli ping
# Should reply: PONG

# Basic commands
redis-cli SET name "Alice"
redis-cli GET name
```

### MongoDB

Add the official MongoDB repository:

```bash
# Install the GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add the repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install
sudo apt update
sudo apt install mongodb-org

# Start MongoDB
sudo systemctl enable --now mongod
```

## Web Development

### Apache HTTP Server

```bash
sudo apt install apache2
sudo systemctl enable --now apache2

# Test
curl http://localhost
# Should show "It works!" or Apache2 Ubuntu Default Page

# Document root
/var/www/html

# Configuration files
/etc/apache2/apache2.conf
/etc/apache2/sites-available/000-default.conf

# Enable a site
sudo a2ensite mysite.conf
# Reload config
sudo systemctl reload apache2
```

Enable modules:
```bash
sudo a2enmod rewrite
sudo a2enmod ssl
sudo systemctl reload apache2
```

### Nginx

```bash
sudo apt install nginx
sudo systemctl enable --now nginx

# Default config
/etc/nginx/nginx.conf
/etc/nginx/sites-available/default

# Test config syntax
sudo nginx -t

# Reload
sudo systemctl reload nginx
```

### Reverse Proxy Setup

Typical setup: Nginx as reverse proxy → Node.js/Python app behind it.

Nginx config (`/etc/nginx/sites-available/myapp`):

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Container-Based Development

### Docker for Development

```bash
# Install Docker
sudo apt install docker.io
sudo usermod -aG docker $USER   # use docker without sudo (log out/in required)

# Run a database for development
docker run -d --name postgres -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres:15
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### Docker Compose for Local Dev

A `docker-compose.yml` for a full stack:

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      DATABASE_URL: postgres://postgres:secret@db:5432/myapp
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  mailhog:
    image: mailhog/mailhog
    ports:
      - "8025:8025"
      - "1025:1025"

volumes:
  pgdata:
```

Run the development environment:
```bash
docker compose up -d
docker compose down -v   # tear down
```

## Continuous Integration / Continuous Deployment (CI/CD)

### GitHub Actions

A basic workflow (`.github/workflows/ci.yml`):

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: "3.12"
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install pytest
      - name: Run tests
        run: pytest
```

### GitLab CI

A `.gitlab-ci.yml` example:

```yaml
stages:
  - test
  - build

test:
  stage: test
  image: python:3.12
  script:
    - pip install pytest
    - pytest

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t myapp .
    - docker push myapp
```

## Debugging and Profiling

### Profiling Python

```bash
# Install profiling tools
pip install py-spy

# Profile a running process
py-spy top --pid <PID>
py-spy record -o profile.svg --pid <PID>

# Built-in profiler
python -m cProfile -o profile.out myscript.py
python -m pstats profile.out
```

### Profiling Node.js

```bash
# Built-in profiler
node --prof myscript.js
node --prof-process isolate-*.log > processed.txt

# Heap snapshot
node --inspect-brk myscript.js
# Then connect Chrome DevTools to chrome://inspect
```

### Memory Debugging with Valgrind (C/C++)

```bash
# Install
sudo apt install valgrind

# Run with memory checking
valgrind --leak-check=full ./myprogram

# With address sanitizer
gcc -fsanitize=address -g -o myprogram myprogram.c
./myprogram
```

## Review Questions

1. What package installs the GNU build tools (gcc, make)?
2. How do you create a Python virtual environment?
3. What is NVM used for?
4. What tool manages containers on Ubuntu?
5. How do you view running Docker containers?

### Quick Reference

```bash
# Build tools
sudo apt install build-essential

# Git
git clone <url>
git add .
git commit -m "msg"
git push

# Python
python3 -m venv .venv
source .venv/bin/activate
pip install <package>
pip freeze > requirements.txt

# Node.js (via nvm)
nvm install --lts
npm init -y
npm install <package>

# Java (via SDKMAN)
sdk install java 17-tem

# Docker
docker run <image>
docker ps
docker compose up -d
docker compose down

# Databases
sudo systemctl enable --now postgresql
sudo -u postgres psql
```
