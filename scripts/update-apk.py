#!/usr/bin/env python3
"""
SoundGram APK Auto-Discovery Script
Scans the repository for .apk files, detects the highest version from the filename,
and updates latest-apk.json automatically.
"""

import os
import glob
import re
import json

def extract_version(path):
    name = os.path.basename(path)
    # Extracts semantic versions like 12.10.5, 12.5.1, 13.0, etc.
    m = re.search(r'(?:v|version|_|-|\b)(\d+\.\d+(?:\.\d+)?)', name, re.IGNORECASE)
    if m:
        parts = [int(p) for p in m.group(1).split('.')]
        return parts, m.group(1)
    return [0], '0.0.0'

def main():
    repo_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    os.chdir(repo_dir)

    apk_files = glob.glob('**/*.apk', recursive=True)
    if not apk_files:
        print("[update-apk] No APK files found in repository.")
        return

    # Filter out hidden or build cache directories if any
    apk_files = [f for f in apk_files if not f.startswith('.git')]

    # Sort by version tuple descending, then by file modification time
    apk_files.sort(key=lambda p: (extract_version(p)[0], os.path.getmtime(p)), reverse=True)
    latest_apk = apk_files[0]
    ver_parts, ver_str = extract_version(latest_apk)

    size_bytes = os.path.getsize(latest_apk)
    size_mb = f"~{round(size_bytes / (1024 * 1024))} МБ"
    url_path = latest_apk.replace('\\', '/')

    apk_data = {
        "name": os.path.basename(latest_apk),
        "url": url_path,
        "size": size_mb,
        "version": ver_str
    }

    target_json = os.path.join(repo_dir, 'latest-apk.json')
    with open(target_json, 'w', encoding='utf-8') as f:
        json.dump(apk_data, f, indent=2, ensure_ascii=False)
        f.write('\n')

    print(f"[update-apk] Successfully updated latest-apk.json -> Version: {ver_str}, File: {apk_data['name']}, Size: {size_mb}")

if __name__ == '__main__':
    main()
