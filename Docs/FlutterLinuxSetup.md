# Flutter Development Setup Guide

Welcome to the Flutter development setup guide! This guide will walk you through setting up your development environment for Flutter and integrating Firebase for your projects.

## Prerequisites

Before you begin, ensure you have the following installed:
- Ubuntu Linux (or your preferred Linux distribution)
- Git
- Curl
- Snapd

## Step 1: Update and Install Dependencies

First, update and install necessary packages:
```bash
sudo apt-get update -y && sudo apt-get upgrade -y;
sudo apt-get install -y curl git unzip xz-utils zip libglu1-mesa
```

## Step 2: Install Flutter

Install Flutter using Snapcraft:
```bash
sudo apt install snapd
sudo snap install core
sudo snap install flutter --classic
```

## Step 3: Setup VS Code and Flutter Extension

Install Visual Studio Code and Flutter extension:
```bash
sudo snap install --classic code
# Install Flutter Extension in VS Code from Extensions Marketplace
```

## Step 4: Configure Android SDK

Download Android SDK and set up directory structure:
- Download Android SDK from [link](https://t.me/krishujeniya/10)
- Extract and organize SDK files as follows:
  ```
  Android 
    ├── Sdk
          ├── build-tools
          ├── emulator
          ├── platforms
          ├── skins
          ├── system-images
          ├── cmdline-tools
          ├── licenses
          ├── platform-tools
          ├── sources
          ├── tools
  ```

## Step 5: Environment Setup

Edit `.bashrc` and set Chrome executable path:
```bash
nano ~/.bashrc
# Add the following line at the end:
export CHROME_EXECUTABLE=/snap/bin/chromium
# Save and exit (Ctrl + X, Y, Enter)
source ~/.bashrc
```

Accept Android licenses and run Flutter doctor:
```bash
flutter doctor --android-licenses
flutter doctor -v
```

## Step 6: Integrate Firebase

Install Firebase tools and configure Firebase for Flutter:
```bash
curl -sL https://firebase.tools | bash
firebase login
dart pub global activate flutterfire_cli
firebase init
flutterfire configure
```


---

**Keywords**: Flutter development, Firebase integration, Android SDK setup, Visual Studio Code, Linux development environment, Flutterfire, Firebase CLI

**Contact**: For support and queries, contact [your contact details]

**License**: This project is licensed under the [license name]. See the LICENSE file for details
