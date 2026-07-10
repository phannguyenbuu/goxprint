import subprocess
import time

def run_agent():
    print("Running dist\\toolxagent.exe and capturing output...")
    proc = subprocess.Popen(
        [r"dist\toolxagent.exe"],
        cwd="dist",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait a few seconds
    time.sleep(5)
    
    # Check if process is still running
    poll = proc.poll()
    if poll is not None:
        print(f"Process terminated with exit code: {poll}")
    else:
        print("Process is still running.")
        proc.terminate()
        
    stdout, stderr = proc.communicate()
    print("STDOUT:")
    print(stdout)
    print("STDERR:")
    print(stderr)

if __name__ == "__main__":
    run_agent()
