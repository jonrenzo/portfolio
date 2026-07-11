# Featured Project Real Screenshots Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real screenshot images for the four featured portfolio projects so the featured cards no longer render the default fallback image.

**Architecture:** Keep the current portfolio image resolver unchanged. Produce four PNG assets with the existing slug-based filenames and place them in `public/img`, where `HomeView.vue` already expects them.

**Tech Stack:** Vue CLI portfolio, static PNG assets, cloned GitHub repos, Microsoft Edge headless screenshots, npm/Next.js/Expo where project repos can run locally.

---

## File Structure

- Modify: `public/img/portfolio-tvph-erp-system.png`  
  Real screenshot for TelcoVantage ERP System.
- Modify: `public/img/portfolio-telcovantage.png`  
  Real screenshot for Telcovantage Site Map Reader.
- Modify: `public/img/portfolio-medisync.png`  
  Real screenshot for MediSync System.
- Modify: `public/img/portfolio-questcommute.png`  
  Real screenshot for QuestCommute.
- Read only: `src/data/portfolio.js`  
  Confirms the image slugs used by featured projects.
- Read only: `src/views/HomeView.vue`  
  Confirms image resolution and fallback behavior.

No portfolio component redesign is planned.

---

### Task 1: Prepare Capture Workspace And Confirm Portfolio Expectations

**Files:**
- Read: `src/data/portfolio.js`
- Read: `src/views/HomeView.vue`
- Create temporary workspace outside repo: `$env:TEMP\portfolio-project-screenshots-*`

- [ ] **Step 1: Confirm featured project image slugs**

Run:

```powershell
$i=1; Get-Content .\src\data\portfolio.js | ForEach-Object { if ($i -ge 52 -and $i -le 102) { '{0,4}: {1}' -f $i, $_ }; $i++ }
```

Expected: the featured projects use `questcommute`, `medisync`, `telcovantage`, and `tvph-erp-system`.

- [ ] **Step 2: Confirm the image path resolver**

Run:

```powershell
$i=1; Get-Content .\src\views\HomeView.vue | ForEach-Object { if ($i -ge 284 -and $i -le 293) { '{0,4}: {1}' -f $i, $_ }; $i++ }
```

Expected: `projectImage(project)` returns `/img/portfolio-${project.imageUrl}.png`, and `setFallbackImage` points to `/img/portfolio-default.png`.

- [ ] **Step 3: Create an external capture workspace**

Run:

```powershell
$captureRoot = Join-Path $env:TEMP ('portfolio-project-screenshots-' + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds())
New-Item -ItemType Directory -Force -Path $captureRoot | Out-Null
Set-Content -Path (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt') -Value $captureRoot
$captureRoot
```

Expected: PowerShell prints a path under `C:\Users\vero\AppData\Local\Temp\portfolio-project-screenshots-*`, and `%TEMP%\portfolio-project-screenshots-root.txt` contains the same path.

- [ ] **Step 4: Commit checkpoint if the plan file is the only new project change**

Run:

```powershell
git status --short
```

Expected: existing unrelated modifications may remain in `public/index.html`, `src/App.vue`, and `src/views/HomeView.vue`; do not stage those files.

---

### Task 2: Capture TelcoVantage ERP Screenshot From Repo Asset

**Files:**
- Source: `$captureRoot\tvph-erp-system\public\screenshot.png`
- Create: `public/img/portfolio-tvph-erp-system.png`

- [ ] **Step 1: Clone the repo into the capture workspace**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Push-Location $captureRoot
git clone --depth 1 https://github.com/jonrenzo/tvph-erp-system.git tvph-erp-system
Pop-Location
```

Expected: repo exists at `$captureRoot\tvph-erp-system`.

- [ ] **Step 2: Confirm checked-in screenshot exists**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Get-Item "$captureRoot\tvph-erp-system\public\screenshot.png" | Select-Object FullName,Length
```

Expected: `screenshot.png` exists and has non-zero length.

- [ ] **Step 3: Copy the screenshot into the portfolio asset name**

Run from the portfolio root:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Copy-Item -LiteralPath "$captureRoot\tvph-erp-system\public\screenshot.png" -Destination ".\public\img\portfolio-tvph-erp-system.png" -Force
```

Expected: `public/img/portfolio-tvph-erp-system.png` exists and has non-zero length.

---

### Task 3: Capture Telcovantage Site Map Reader Screenshot

**Files:**
- Source repo: `$captureRoot\Telcovantage-Site-Map-Reader`
- Create: `public/img/portfolio-telcovantage.png`

- [ ] **Step 1: Clone the repo into the capture workspace**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Push-Location $captureRoot
git clone --depth 1 https://github.com/jonrenzo/Telcovantage-Site-Map-Reader.git Telcovantage-Site-Map-Reader
Pop-Location
```

Expected: repo exists at `$captureRoot\Telcovantage-Site-Map-Reader`.

- [ ] **Step 2: Install dependencies**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Push-Location "$captureRoot\Telcovantage-Site-Map-Reader"
npm install
Pop-Location
```

Expected: dependencies install successfully.

- [ ] **Step 3: Start the frontend on port 3101**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Start-Process -FilePath npm -ArgumentList @('run','dev','--','--port','3101') -WorkingDirectory "$captureRoot\Telcovantage-Site-Map-Reader" -WindowStyle Hidden
```

Expected: a Next.js dev server starts.

- [ ] **Step 4: Wait for the app to respond**

Run:

```powershell
for ($i = 0; $i -lt 60; $i++) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing http://localhost:3101 -TimeoutSec 2
    if ($response.StatusCode -eq 200) { "ready"; break }
  } catch {
    Start-Sleep -Seconds 1
  }
}
```

Expected: prints `ready`.

- [ ] **Step 5: Capture with Edge headless**

Run from the portfolio root:

```powershell
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless --disable-gpu --window-size=1440,960 --screenshot="$((Resolve-Path .\public\img).Path)\portfolio-telcovantage.png" http://localhost:3101
```

Expected: `public/img/portfolio-telcovantage.png` exists and has non-zero length.

- [ ] **Step 6: If the root screen is blank or erroring, capture the landing route**

Run from the portfolio root:

```powershell
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless --disable-gpu --window-size=1440,960 --screenshot="$((Resolve-Path .\public\img).Path)\portfolio-telcovantage.png" http://localhost:3101/landing
```

Expected: overwrites `portfolio-telcovantage.png` with a real app screen.

---

### Task 4: Capture MediSync Screenshot

**Files:**
- Source repo: `$captureRoot\medisync-system`
- Create: `public/img/portfolio-medisync.png`

- [ ] **Step 1: Clone the repo into the capture workspace**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Push-Location $captureRoot
git clone --depth 1 https://github.com/jonrenzo/medisync-system.git medisync-system
Pop-Location
```

Expected: repo exists at `$captureRoot\medisync-system`.

- [ ] **Step 2: Install dependencies**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Push-Location "$captureRoot\medisync-system"
npm install
Pop-Location
```

Expected: dependencies install successfully.

- [ ] **Step 3: Start the frontend on port 3102**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Start-Process -FilePath npm -ArgumentList @('run','dev','--','--port','3102') -WorkingDirectory "$captureRoot\medisync-system" -WindowStyle Hidden
```

Expected: a Next.js dev server starts.

- [ ] **Step 4: Wait for the app to respond**

Run:

```powershell
for ($i = 0; $i -lt 60; $i++) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing http://localhost:3102 -TimeoutSec 2
    if ($response.StatusCode -eq 200) { "ready"; break }
  } catch {
    Start-Sleep -Seconds 1
  }
}
```

Expected: prints `ready`.

- [ ] **Step 5: Capture the login/public screen with Edge headless**

Run from the portfolio root:

```powershell
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless --disable-gpu --window-size=1440,960 --screenshot="$((Resolve-Path .\public\img).Path)\portfolio-medisync.png" http://localhost:3102
```

Expected: `public/img/portfolio-medisync.png` exists and has non-zero length.

---

### Task 5: Capture QuestCommute Screenshot

**Files:**
- Source repo: `$captureRoot\QuestCommute`
- Create: `public/img/portfolio-questcommute.png`

- [ ] **Step 1: Clone the repo into the capture workspace**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Push-Location $captureRoot
git clone --depth 1 https://github.com/jonrenzo/QuestCommute.git QuestCommute
Pop-Location
```

Expected: repo exists at `$captureRoot\QuestCommute`.

- [ ] **Step 2: Install dependencies**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Push-Location "$captureRoot\QuestCommute"
npm install
Pop-Location
```

Expected: dependencies install successfully.

- [ ] **Step 3: Start Expo web on port 3103**

Run:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Start-Process -FilePath npx -ArgumentList @('expo','start','--web','--port','3103') -WorkingDirectory "$captureRoot\QuestCommute" -WindowStyle Hidden
```

Expected: Expo web server starts.

- [ ] **Step 4: Wait for the app to respond**

Run:

```powershell
for ($i = 0; $i -lt 90; $i++) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing http://localhost:3103 -TimeoutSec 2
    if ($response.StatusCode -eq 200) { "ready"; break }
  } catch {
    Start-Sleep -Seconds 1
  }
}
```

Expected: prints `ready`.

- [ ] **Step 5: Capture the Expo web screen with Edge headless**

Run from the portfolio root:

```powershell
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' --headless --disable-gpu --window-size=390,844 --screenshot="$((Resolve-Path .\public\img).Path)\portfolio-questcommute.png" http://localhost:3103
```

Expected: `public/img/portfolio-questcommute.png` exists and has non-zero length.

- [ ] **Step 6: If Expo web cannot render native dependencies, create a real asset composite from repo images**

Run from the portfolio root:

```powershell
$captureRoot = Get-Content (Join-Path $env:TEMP 'portfolio-project-screenshots-root.txt')
Copy-Item -LiteralPath "$captureRoot\QuestCommute\assets\splash.png" -Destination ".\public\img\portfolio-questcommute.png" -Force
```

Expected: `portfolio-questcommute.png` exists and uses the app's real checked-in splash asset rather than a generated mockup.

---

### Task 6: Verify Portfolio Assets And Build

**Files:**
- Verify: `public/img/portfolio-tvph-erp-system.png`
- Verify: `public/img/portfolio-telcovantage.png`
- Verify: `public/img/portfolio-medisync.png`
- Verify: `public/img/portfolio-questcommute.png`

- [ ] **Step 1: Confirm all four image files exist**

Run:

```powershell
Get-Item .\public\img\portfolio-tvph-erp-system.png, .\public\img\portfolio-telcovantage.png, .\public\img\portfolio-medisync.png, .\public\img\portfolio-questcommute.png | Select-Object Name,Length
```

Expected: all four files exist and have non-zero length.

- [ ] **Step 2: Build the portfolio**

Run:

```powershell
npm run build
```

Expected: Vue CLI build completes successfully.

- [ ] **Step 3: Start the portfolio dev server**

Run:

```powershell
Start-Process -FilePath npm -ArgumentList @('run','serve','--','--port','8081') -WorkingDirectory (Resolve-Path .).Path -WindowStyle Hidden
```

Expected: Vue dev server starts on port 8081.

- [ ] **Step 4: Inspect featured project cards in browser**

Run:

```powershell
& 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe' http://localhost:8081/#projects
```

Expected: the four featured cards show the new project-specific screenshots, not `portfolio-default.png`.

- [ ] **Step 5: Check git status before final response**

Run:

```powershell
git status --short
```

Expected: only the four new/updated `public/img/portfolio-*.png` assets are from this implementation, plus any pre-existing unrelated working tree modifications remain unstaged.
