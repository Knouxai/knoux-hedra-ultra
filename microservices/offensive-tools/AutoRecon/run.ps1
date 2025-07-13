# KNOUX7 KOTS™ - AutoRecon Tool (Windows PowerShell)
# Advanced Vulnerability Scanner and Reconnaissance Tool

param(
    [string]$Target = "127.0.0.1",
    [string]$OutputDir = ".\scans",
    [string]$ScanType = "quick",
    [switch]$Verbose,
    [switch]$NoPortScan,
    [switch]$ServiceDetection
)

# Tool Information
$ToolName = "AutoRecon"
$ToolVersion = "1.0.0"
$Author = "KNOUX7 Cyber Team"

Write-Host "🔍 KNOUX7 AutoRecon Tool v$ToolVersion" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkCyan
Write-Host "🎯 Target: $Target" -ForegroundColor Yellow
Write-Host "📁 Output Directory: $OutputDir" -ForegroundColor Yellow
Write-Host "⚡ Scan Type: $ScanType" -ForegroundColor Yellow
Write-Host "🕐 Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green

# Create output directory
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "📁 Created output directory: $OutputDir" -ForegroundColor Green
}

# Initialize scan results
$ScanResults = @{
    target = $Target
    scanType = $ScanType
    startTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    endTime = $null
    duration = $null
    results = @{
        hostDiscovery = @{}
        portScan = @{}
        serviceDetection = @{}
        vulnerabilities = @()
        summary = @{}
    }
    status = "running"
    toolVersion = $ToolVersion
}

try {
    # Phase 1: Host Discovery
    Write-Host "`n🔍 Phase 1: Host Discovery" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkCyan
    
    $pingResult = Test-Connection -ComputerName $Target -Count 4 -Quiet
    if ($pingResult) {
        Write-Host "✅ Host $Target is reachable" -ForegroundColor Green
        $ScanResults.results.hostDiscovery.status = "alive"
        $ScanResults.results.hostDiscovery.pingSuccessful = $true
    } else {
        Write-Host "❌ Host $Target is not reachable via ICMP" -ForegroundColor Red
        $ScanResults.results.hostDiscovery.status = "unreachable"
        $ScanResults.results.hostDiscovery.pingSuccessful = $false
    }

    # Get hostname
    try {
        $hostname = [System.Net.Dns]::GetHostByAddress($Target).HostName
        Write-Host "🏷️  Hostname: $hostname" -ForegroundColor Yellow
        $ScanResults.results.hostDiscovery.hostname = $hostname
    } catch {
        Write-Host "🏷️  Hostname: Unable to resolve" -ForegroundColor Yellow
        $ScanResults.results.hostDiscovery.hostname = "unknown"
    }

    # Phase 2: Port Scanning
    if (!$NoPortScan) {
        Write-Host "`n🚪 Phase 2: Port Scanning" -ForegroundColor Cyan
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkCyan
        
        # Define port ranges based on scan type
        $ports = switch ($ScanType) {
            "quick" { @(21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 993, 995, 1723, 3306, 3389, 5432, 5900, 8080) }
            "full" { 1..65535 }
            "common" { @(21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 993, 995, 1723, 3306, 3389, 5432, 5900, 8080, 8443, 9000, 9001, 9999, 10000) }
            default { @(21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 993, 995, 1723, 3306, 3389, 5432, 5900, 8080) }
        }

        $openPorts = @()
        $totalPorts = $ports.Count
        $scannedPorts = 0

        foreach ($port in $ports) {
            $scannedPorts++
            $progress = [math]::Round(($scannedPorts / $totalPorts) * 100, 1)
            
            if ($Verbose) {
                Write-Host "📡 Scanning port $port... ($progress%)" -ForegroundColor DarkGray
            }

            $tcpClient = New-Object System.Net.Sockets.TcpClient
            $connect = $tcpClient.BeginConnect($Target, $port, $null, $null)
            $wait = $connect.AsyncWaitHandle.WaitOne(1000, $false)
            
            if ($wait -and $tcpClient.Connected) {
                Write-Host "✅ Port $port/tcp - OPEN" -ForegroundColor Green
                $openPorts += @{
                    port = $port
                    protocol = "tcp"
                    state = "open"
                    service = Get-ServiceName -Port $port
                }
            } else {
                if ($Verbose) {
                    Write-Host "❌ Port $port/tcp - CLOSED" -ForegroundColor Red
                }
            }
            
            $tcpClient.Close()
        }

        $ScanResults.results.portScan.totalScanned = $totalPorts
        $ScanResults.results.portScan.openPorts = $openPorts
        $ScanResults.results.portScan.openPortCount = $openPorts.Count

        Write-Host "`n📊 Port Scan Summary:" -ForegroundColor Cyan
        Write-Host "   Total Ports Scanned: $totalPorts" -ForegroundColor White
        Write-Host "   Open Ports Found: $($openPorts.Count)" -ForegroundColor Green
    }

    # Phase 3: Service Detection
    if ($ServiceDetection -and $openPorts.Count -gt 0) {
        Write-Host "`n🔍 Phase 3: Service Detection" -ForegroundColor Cyan
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkCyan
        
        $serviceResults = @()
        
        foreach ($portInfo in $openPorts) {
            $port = $portInfo.port
            Write-Host "🔍 Detecting service on port $port..." -ForegroundColor Yellow
            
            $serviceInfo = @{
                port = $port
                service = $portInfo.service
                banner = ""
                version = ""
                details = @{}
            }

            # Try to grab banner
            try {
                $tcpClient = New-Object System.Net.Sockets.TcpClient
                $tcpClient.Connect($Target, $port)
                $stream = $tcpClient.GetStream()
                $buffer = New-Object byte[] 1024
                $bytesRead = $stream.Read($buffer, 0, 1024)
                if ($bytesRead -gt 0) {
                    $banner = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $bytesRead)
                    $serviceInfo.banner = $banner.Trim()
                    Write-Host "   📋 Banner: $($banner.Trim())" -ForegroundColor Gray
                }
                $tcpClient.Close()
            } catch {
                Write-Host "   ⚠️  Could not grab banner" -ForegroundColor Yellow
            }

            $serviceResults += $serviceInfo
        }

        $ScanResults.results.serviceDetection.services = $serviceResults
        $ScanResults.results.serviceDetection.detectedCount = $serviceResults.Count
    }

    # Phase 4: Basic Vulnerability Assessment
    Write-Host "`n🛡️  Phase 4: Basic Vulnerability Assessment" -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkCyan
    
    $vulnerabilities = @()

    # Check for common vulnerable services
    foreach ($portInfo in $openPorts) {
        $port = $portInfo.port
        $service = $portInfo.service

        switch ($port) {
            21 { 
                $vulnerabilities += @{
                    type = "Potentially Vulnerable Service"
                    service = "FTP"
                    port = $port
                    description = "FTP service detected - may be vulnerable to anonymous access or weak authentication"
                    severity = "Medium"
                }
            }
            23 { 
                $vulnerabilities += @{
                    type = "Insecure Protocol"
                    service = "Telnet"
                    port = $port
                    description = "Telnet service detected - uses unencrypted communication"
                    severity = "High"
                }
            }
            135 { 
                $vulnerabilities += @{
                    type = "Windows RPC"
                    service = "RPC"
                    port = $port
                    description = "Windows RPC service - potential target for privilege escalation"
                    severity = "Medium"
                }
            }
            3389 { 
                $vulnerabilities += @{
                    type = "Remote Access"
                    service = "RDP"
                    port = $port
                    description = "RDP service detected - ensure strong authentication and network restrictions"
                    severity = "Medium"
                }
            }
        }
    }

    $ScanResults.results.vulnerabilities = $vulnerabilities
    Write-Host "🔍 Found $($vulnerabilities.Count) potential security concerns" -ForegroundColor Yellow

    # Generate Summary
    $endTime = Get-Date
    $duration = $endTime - (Get-Date $ScanResults.startTime)
    
    $ScanResults.endTime = $endTime.ToString("yyyy-MM-dd HH:mm:ss")
    $ScanResults.duration = "$([math]::Round($duration.TotalSeconds, 2)) seconds"
    $ScanResults.status = "completed"
    $ScanResults.results.summary = @{
        hostReachable = $ScanResults.results.hostDiscovery.pingSuccessful
        openPortsFound = $ScanResults.results.portScan.openPortCount
        vulnerabilitiesFound = $vulnerabilities.Count
        scanDuration = $ScanResults.duration
        riskLevel = if ($vulnerabilities.Count -gt 5) { "High" } elseif ($vulnerabilities.Count -gt 2) { "Medium" } else { "Low" }
    }

    # Save detailed results to JSON
    $jsonOutput = $ScanResults | ConvertTo-Json -Depth 10
    $outputFile = Join-Path $OutputDir "autorecon_$($Target)_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"
    $jsonOutput | Out-File -FilePath $outputFile -Encoding UTF8

    # Generate human-readable report
    $reportFile = Join-Path $OutputDir "autorecon_$($Target)_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
    $report = @"
KNOUX7 AutoRecon Security Assessment Report
==========================================
Target: $Target
Scan Time: $($ScanResults.startTime) - $($ScanResults.endTime)
Duration: $($ScanResults.duration)
Scan Type: $ScanType

HOST DISCOVERY
--------------
Status: $($ScanResults.results.hostDiscovery.status)
Hostname: $($ScanResults.results.hostDiscovery.hostname)
Ping Successful: $($ScanResults.results.hostDiscovery.pingSuccessful)

PORT SCAN RESULTS
-----------------
Total Ports Scanned: $($ScanResults.results.portScan.totalScanned)
Open Ports Found: $($ScanResults.results.portScan.openPortCount)

Open Ports:
$($openPorts | ForEach-Object { "  Port $($_.port)/tcp - $($_.service)" } | Out-String)

SECURITY ASSESSMENT
-------------------
Vulnerabilities Found: $($vulnerabilities.Count)
Risk Level: $($ScanResults.results.summary.riskLevel)

$($vulnerabilities | ForEach-Object { "- [$($_.severity)] $($_.service) on port $($_.port): $($_.description)" } | Out-String)

RECOMMENDATIONS
---------------
1. Close unnecessary open ports
2. Implement network segmentation
3. Use strong authentication for all services
4. Keep all services updated with latest security patches
5. Monitor network traffic for suspicious activity

Generated by KNOUX7 AutoRecon v$ToolVersion
"@

    $report | Out-File -FilePath $reportFile -Encoding UTF8

    # Final Summary
    Write-Host "`n📊 SCAN COMPLETED" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGreen
    Write-Host "🎯 Target: $Target" -ForegroundColor White
    Write-Host "⏱️  Duration: $($ScanResults.duration)" -ForegroundColor White
    Write-Host "🚪 Open Ports: $($ScanResults.results.portScan.openPortCount)" -ForegroundColor White
    Write-Host "⚠️  Vulnerabilities: $($vulnerabilities.Count)" -ForegroundColor White
    Write-Host "🛡️  Risk Level: $($ScanResults.results.summary.riskLevel)" -ForegroundColor White
    Write-Host "📄 Reports saved to: $OutputDir" -ForegroundColor White
    Write-Host "   - JSON: $(Split-Path $outputFile -Leaf)" -ForegroundColor Gray
    Write-Host "   - TXT:  $(Split-Path $reportFile -Leaf)" -ForegroundColor Gray

    # Return results for API
    Write-Output $jsonOutput

} catch {
    $errorMsg = $_.Exception.Message
    Write-Host "❌ SCAN FAILED: $errorMsg" -ForegroundColor Red
    
    $ScanResults.status = "failed"
    $ScanResults.error = $errorMsg
    $ScanResults.endTime = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    
    $errorOutput = $ScanResults | ConvertTo-Json -Depth 10
    Write-Output $errorOutput
    exit 1
}

# Helper function to get service name by port
function Get-ServiceName {
    param([int]$Port)
    
    $services = @{
        21 = "FTP"
        22 = "SSH"
        23 = "Telnet"
        25 = "SMTP"
        53 = "DNS"
        80 = "HTTP"
        110 = "POP3"
        111 = "RPC"
        135 = "RPC"
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
        8080 = "HTTP-Alt"
        8443 = "HTTPS-Alt"
    }
    
    if ($services.ContainsKey($Port)) {
        return $services[$Port]
    } else {
        return "Unknown"
    }
}
