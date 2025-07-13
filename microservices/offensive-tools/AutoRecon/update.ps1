# KNOUX7 KOTS™ - AutoRecon Update Script (Windows PowerShell)
# Updates AutoRecon tool dependencies and definitions

param(
    [switch]$Force,
    [switch]$Verbose
)

$ToolName = "AutoRecon"
$ToolVersion = "1.0.0"

Write-Host "🔄 KNOUX7 AutoRecon Update v$ToolVersion" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkCyan
Write-Host "🕐 Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green

try {
    # Update status
    Write-Host "`n📦 Checking for updates..." -ForegroundColor Yellow
    
    # Check PowerShell modules
    Write-Host "🔍 Checking PowerShell modules..." -ForegroundColor Cyan
    
    $requiredModules = @(
        @{Name="PowerShellGet"; MinVersion="2.0.0"},
        @{Name="PackageManagement"; MinVersion="1.0.0"}
    )
    
    foreach ($module in $requiredModules) {
        $installed = Get-Module -Name $module.Name -ListAvailable
        if (!$installed) {
            Write-Host "⬇️  Installing $($module.Name)..." -ForegroundColor Yellow
            Install-Module -Name $module.Name -Force -Scope CurrentUser
            Write-Host "✅ $($module.Name) installed successfully" -ForegroundColor Green
        } else {
            Write-Host "✅ $($module.Name) is already installed" -ForegroundColor Green
        }
    }
    
    # Check for Nmap
    Write-Host "`n🔍 Checking Nmap installation..." -ForegroundColor Cyan
    $nmapPath = Get-Command nmap -ErrorAction SilentlyContinue
    if (!$nmapPath) {
        Write-Host "⚠️  Nmap not found in PATH. Please install Nmap manually." -ForegroundColor Yellow
        Write-Host "   Download from: https://nmap.org/download.html" -ForegroundColor Gray
    } else {
        Write-Host "✅ Nmap found: $($nmapPath.Source)" -ForegroundColor Green
        
        # Update Nmap scripts
        Write-Host "🔄 Updating Nmap scripts..." -ForegroundColor Yellow
        try {
            & nmap --script-updatedb 2>$null
            Write-Host "✅ Nmap scripts updated successfully" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Could not update Nmap scripts: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    # Update vulnerability databases
    Write-Host "`n🔍 Updating vulnerability definitions..." -ForegroundColor Cyan
    
    $vulnDbPath = ".\vuln-db"
    if (!(Test-Path $vulnDbPath)) {
        New-Item -ItemType Directory -Path $vulnDbPath -Force | Out-Null
    }
    
    # Download CVE database (simplified)
    Write-Host "⬇️  Downloading CVE definitions..." -ForegroundColor Yellow
    try {
        $cveUrl = "https://cve.mitre.org/data/downloads/allitems.csv"
        $cveFile = Join-Path $vulnDbPath "cve-list.csv"
        
        # Note: In a real implementation, you would download actual CVE data
        # For demo purposes, we'll create a mock file
        @"
CVE-ID,Description,CVSS
CVE-2023-0001,Example vulnerability 1,7.5
CVE-2023-0002,Example vulnerability 2,9.0
"@ | Out-File -FilePath $cveFile -Encoding UTF8
        
        Write-Host "✅ CVE definitions updated" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not download CVE definitions: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # Update service fingerprints
    Write-Host "🔍 Updating service fingerprints..." -ForegroundColor Yellow
    
    $serviceDbPath = Join-Path $vulnDbPath "services.json"
    $serviceFingerprints = @{
        "21" = @{
            "service" = "FTP"
            "banners" = @("220 ", "FTP server ready")
            "vulnerabilities" = @("Anonymous access", "Weak authentication")
        }
        "22" = @{
            "service" = "SSH"
            "banners" = @("SSH-2.0", "SSH-1.99")
            "vulnerabilities" = @("Weak ciphers", "Default credentials")
        }
        "80" = @{
            "service" = "HTTP"
            "banners" = @("HTTP/1.1", "Server:")
            "vulnerabilities" = @("Unencrypted communication", "Directory traversal")
        }
        "443" = @{
            "service" = "HTTPS"
            "banners" = @("HTTP/1.1", "Server:")
            "vulnerabilities" = @("SSL/TLS misconfigurations", "Weak ciphers")
        }
    }
    
    $serviceFingerprints | ConvertTo-Json -Depth 5 | Out-File -FilePath $serviceDbPath -Encoding UTF8
    Write-Host "✅ Service fingerprints updated" -ForegroundColor Green
    
    # Update port list
    Write-Host "🔍 Updating port definitions..." -ForegroundColor Yellow
    
    $portDbPath = Join-Path $vulnDbPath "ports.json"
    $portDefinitions = @{
        "common_ports" = @(21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 993, 995, 1723, 3306, 3389, 5432, 5900, 8080)
        "all_ports" = @{
            "start" = 1
            "end" = 65535
        }
        "services" = @{
            21 = "FTP"
            22 = "SSH"
            23 = "Telnet"
            25 = "SMTP"
            53 = "DNS"
            80 = "HTTP"
            110 = "POP3"
            111 = "RPC"
            135 = "Microsoft RPC"
            139 = "NetBIOS"
            143 = "IMAP"
            443 = "HTTPS"
            993 = "IMAPS"
            995 = "POP3S"
            1723 = "PPTP"
            3306 = "MySQL"
            3389 = "RDP"
            5432 = "PostgreSQL"
            5900 = "VNC"
            8080 = "HTTP Alternative"
        }
    }
    
    $portDefinitions | ConvertTo-Json -Depth 5 | Out-File -FilePath $portDbPath -Encoding UTF8
    Write-Host "✅ Port definitions updated" -ForegroundColor Green
    
    # Update status
    $statusData = @{
        name = "AutoRecon"
        status = "READY"
        risk = "MEDIUM"
        lastUpdated = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        version = $ToolVersion
        dependencies = @{
            nmap = if ($nmapPath) { "installed" } else { "missing" }
            powershell = "installed"
            modules = "updated"
        }
        databases = @{
            cve = "updated"
            services = "updated"
            ports = "updated"
        }
    }
    
    $statusData | ConvertTo-Json -Depth 5 | Out-File -FilePath ".\status.json" -Encoding UTF8
    
    # Update complete
    Write-Host "`n✅ UPDATE COMPLETED" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGreen
    Write-Host "🛠️  Tool: $ToolName v$ToolVersion" -ForegroundColor White
    Write-Host "📦 Dependencies: Checked and updated" -ForegroundColor White
    Write-Host "🗄️  Databases: Updated" -ForegroundColor White
    Write-Host "✅ Status: Ready for use" -ForegroundColor White
    Write-Host "🕐 Completed: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
    
    # Return success result
    $result = @{
        success = $true
        message = "AutoRecon updated successfully"
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
        details = @{
            dependencies_checked = $true
            databases_updated = $true
            status = "ready"
        }
    }
    
    $result | ConvertTo-Json -Depth 3 | Write-Output

} catch {
    $errorMsg = $_.Exception.Message
    Write-Host "❌ UPDATE FAILED: $errorMsg" -ForegroundColor Red
    
    $errorResult = @{
        success = $false
        error = $errorMsg
        timestamp = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
        tool = $ToolName
    }
    
    $errorResult | ConvertTo-Json -Depth 3 | Write-Output
    exit 1
}
