import paramiko
import os
import sys

VPS_IP = "180.93.59.22"
SSH_USER = "root"
PREFERRED_PASSWORD = "Sqbw5qJAZEQcDn99"
LOCAL_BINARY = "/home/oem/Desktop/new-api/new-api"
REMOTE_DIR = "/root/new-api"
REMOTE_BINARY = "/root/new-api/new-api"
REMOTE_TEMP = "/root/new-api/new-api.new"

def main():
    if not os.path.exists(LOCAL_BINARY):
        print(f"Error: Local binary not found at {LOCAL_BINARY}. Please build it first.")
        sys.exit(1)
        
    file_size = os.path.getsize(LOCAL_BINARY)
    print(f"Local binary found. Size: {file_size / (1024*1024):.2f} MB")

    print(f"Connecting to VPS {VPS_IP} via SSH...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(VPS_IP, username=SSH_USER, password=PREFERRED_PASSWORD, timeout=30)
    print("SSH Connected!")

    print(f"Opening SFTP connection...")
    sftp = ssh.open_sftp()
    
    print(f"Uploading {LOCAL_BINARY} to remote {REMOTE_TEMP}...")
    
    def progress_callback(transferred, total):
        sys.stdout.write(f"\rUpload progress: {transferred / (1024*1024):.2f}MB / {total / (1024*1024):.2f}MB ({transferred/total*100:.1f}%)")
        sys.stdout.flush()
        
    sftp.put(LOCAL_BINARY, REMOTE_TEMP, callback=progress_callback)
    print("\nUpload completed!")
    sftp.close()

    print("\nExecuting remote deployment commands via SSH...")
    
    commands = [
        "pm2 stop new-api",
        f"mv {REMOTE_TEMP} {REMOTE_BINARY}",
        f"chmod +x {REMOTE_BINARY}",
        "pm2 start new-api",
        "pm2 list"
    ]
    
    for cmd in commands:
        print(f"\n$ {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        out = stdout.read().decode()
        err = stderr.read().decode()
        if out.strip():
            print(out.rstrip())
        if err.strip():
            print("[stderr]", err.rstrip())

    ssh.close()
    print("\nDeployment completed successfully!")

if __name__ == "__main__":
    main()
