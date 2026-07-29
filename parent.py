import subprocess
import shlex
import sys
args = shlex.split('child.py --mode ""', posix=False)
args = [sys.executable] + args
print("Launching:", subprocess.list2cmdline(args))
subprocess.run(args)
