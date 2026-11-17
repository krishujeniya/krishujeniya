# Flutter Development Setup Guide

Welcome to the Flutter development setup guide! This guide will walk you through setting up your development environment for Flutter and integrating Firebase for your projects.

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

Download official Android command-line tools directly from Google's Android developer repository:
- Download the official Linux command-line tools from [developer.android.com](https://developer.android.com/studio#command-line-tools-only).
- Verify the publisher's SHA-256 checksum against the value published on the official Android Developers download page before extracting:
  ```bash
  echo "<official_sha256>  commandlinetools-linux_latest.zip" | sha256sum --check
  ```
- Extract and set up the Android SDK directory structure:
  ```bash
  mkdir -p ~/Android/Sdk/cmdline-tools/latest
  unzip commandlinetools-linux_latest.zip -d ~/Android/Sdk/cmdline-tools/latest
  ```

Organize the SDK directories using the official Android SDK Manager:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

## Step 5: Environment Setup

Configure environment variables in `~/.bashrc`:
```bash
cat << 'EOF' >> ~/.bashrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
export CHROME_EXECUTABLE=/snap/bin/chromium
EOF
source ~/.bashrc
```

Accept Android licenses and run Flutter doctor:
```bash
flutter doctor --android-licenses
flutter doctor -v
```

## Step 6: Integrate Firebase

Install Firebase CLI using npm (or verify the standalone binary checksum before execution):
```bash
npm install -g firebase-tools
firebase login
dart pub global activate flutterfire_cli
flutterfire configure
```

