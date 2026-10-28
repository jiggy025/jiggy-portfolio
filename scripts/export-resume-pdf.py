#!/usr/bin/env python3
"""
Regenerates resume.pdf from resume.html using headless Microsoft Edge or Google Chrome.
Ensures an exact 1-page A4 PDF output without browser headers or footers.
"""

import os
import subprocess
import sys

PORTFOLIO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_PATH = os.path.join(PORTFOLIO_DIR, "resume.html")
PDF_PATH = os.path.join(PORTFOLIO_DIR, "resume.pdf")

# Candidate browser executable paths on Windows
BROWSER_CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"),
    os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
]

browser_path = None
for path in BROWSER_CANDIDATES:
    if os.path.exists(path):
        browser_path = path
        break

if not browser_path:
    print("Error: Could not locate Microsoft Edge or Google Chrome executable.", file=sys.stderr)
    sys.exit(1)

html_uri = "file:///" + HTML_PATH.replace("\\", "/")

cmd = [
    browser_path,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    f'--print-to-pdf={PDF_PATH}',
    html_uri,
]

print(f"Generating PDF using: {browser_path}")
print(f"Source: {html_uri}")
print(f"Target: {PDF_PATH}")

try:
    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if os.path.exists(PDF_PATH):
        size_kb = os.path.getsize(PDF_PATH) / 1024
        print(f"SUCCESS: Generated {PDF_PATH} ({size_kb:.1f} KB)")
    else:
        print("Error: PDF output file was not created.", file=sys.stderr)
        sys.exit(1)
except Exception as e:
    print(f"Error during PDF generation: {e}", file=sys.stderr)
    sys.exit(1)
