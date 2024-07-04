
# XAMPP Installation Guide for Ubuntu

Welcome to the XAMPP installation guide for Ubuntu. Follow this tutorial to learn how to install, verify, and uninstall the XAMPP package on your Ubuntu machine.

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [What is XAMPP?](#what-is-xampp)
4. [Installation Steps](#installation-steps)
   - [Step 1: Download Installation Package](#step-1-download-installation-package)
   - [Step 2: Make Installation Package Executable](#step-2-make-installation-package-executable)
   - [Step 3: Install XAMPP](#step-3-install-xampp)
   - [Step 4: Launch XAMPP](#step-4-launch-xampp)
   - [Step 5: Verify XAMPP is Running](#step-5-verify-xampp-is-running)
5. [Uninstalling XAMPP](#uninstalling-xampp)

## Introduction

The XAMPP stack is an open-source Apache distribution of a PHP development environment consisting of cross-platform software (X): Apache (A), MariaDB (M), PHP (P), and Perl (P). Developers use the platform as a local host for testing software and web pages before transferring the data to a remote online server.

In this tutorial, you will learn how to install XAMPP on Ubuntu, verify the installation, and uninstall the XAMPP package.

## Prerequisites

- A machine running Ubuntu.
- A user account with root privileges.
- Access to the terminal.

## What is XAMPP?

XAMPP is a free, open-source, cross-platform web server stack package developed by Apache Friends. It is an easy-to-install package that provides a local server environment for web development and testing purposes.

Developers commonly use XAMPP to create and test dynamic web applications on a local machine before deploying them to a live server. It is available for Windows, Linux, and macOS, making it versatile for developers using different operating systems.

## Installation Steps

### Step 1: Download Installation Package

Open an internet browser and navigate to the [official Apache Friends webpage](https://www.apachefriends.org/index.html). Scroll down and click the XAMPP for Linux link to download the binary installation package.

### Step 2: Make Installation Package Executable

To start the installation, change the file permissions to make the installer executable. Follow the steps below:

1. Open the terminal and change the directory to where your installation package is located. By default, the system stores it in the Downloads directory. Use the `cd` command with the following syntax:
   ```sh
   cd /home/[username]/Downloads
   ```
2. Make the file executable using the following syntax:
   ```sh
   sudo chmod 755 [package_name]
   ```
   Replace `[package_name]` with the complete name of the downloaded package. You can use the `ls` command to list the contents of the directory and copy the full file name:
   ```sh
   ls –l [package_name]
   ```

### Step 3: Install XAMPP

After setting the right permissions, you can use the installer to install and configure XAMPP. Follow the steps below:

1. Run the installer using the syntax below:
   ```sh
   sudo ./[package_name]
   ```
   For example:
   ```sh
   sudo ./xampp-linux-x64-8.2.12.0-installer.run
   ```
2. The welcome screen opens in a new window. Click Forward, and in the Select Components dialogue, choose the components you want to install. We recommend keeping the default settings. Continue the installation by clicking Forward.
3. In the next step, the setup wizard shows the location for installing the software. To proceed, click Forward.
4. The wizard is now ready to install XAMPP on your system. Click Forward to start the installation.
5. When the setup finishes, complete the process and launch XAMPP by clicking Finish. If you don't want to launch XAMPP now, uncheck the Launch XAMPP box.

### Step 4: Launch XAMPP

If you chose to launch XAMPP in the setup wizard, the XAMPP control panel launches, and you can start managing your servers.

Alternatively, run the command below to open XAMPP:
```sh
sudo /opt/lampp/./manager-linux-x64.run
```

Click the **Manage Servers** tab to see all the available services and their status. You can change the status by selecting **Start** or **Stop**. You can also start all services simultaneously by clicking the **Start All** button.

> **Note:** If the services fail to start, make sure that the `net-tools` utility is installed on your system. To install `net-tools`, run the command below:
```sh
sudo apt install net-tools
```

### Step 5: Verify XAMPP is Running

Make sure you have successfully installed the XAMPP stack by checking a few services. Follow the steps below:

1. Verify localhost is working by entering the following URL in a browser:
   ```sh
   http://localhost/dashboard
   ```
   If the XAMPP dashboard page displays, you have successfully installed the stack.

2. Next, verify that the MariaDB service is working. Paste the following URL in a browser:
   ```sh
   http://localhost/phpmyadmin
   ```
   The output screen for a properly working database service should appear.

## Uninstalling XAMPP

Uninstalling XAMPP from your system is done via an uninstallation script provided by the program. Follow the steps below:

1. Invoke the script by running the following command:
   ```sh
   sudo /opt/lampp/./uninstall
   ```
   A dialogue box opens and asks whether you want to uninstall XAMPP and all of its modules. Confirm by clicking the **Yes** button.

2. After the process is complete, remove the XAMPP directory using the `rm` command below:
   ```sh
   sudo rm -r /opt/lampp
   ```
