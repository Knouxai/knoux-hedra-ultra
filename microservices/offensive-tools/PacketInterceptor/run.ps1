# KNOUX7 KOTS™ - PacketInterceptor Tool (Windows PowerShell)
# Advanced Network Packet Capture and Analysis Tool

param(
    [string]$Interface = "auto",
    [string]$Filter = "",
    [int]$Duration = 60,
    [string]$OutputDir = ".\captures",
    [int]$MaxPackets = 1000,
    [switch]$Verbose,
    [switch]$RealTime,
    [string]$TargetIP = "",
    [string]$TargetPort = ""
)

# Tool Information
$ToolName = "PacketInterceptor"
$ToolVersion = "1.0.0"
$Author = "KNOUX7 Cyber Team"

Write-Host "🕷️ KNOUX7 PacketInterceptor v$ToolVersion" -ForegroundColor Magenta
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkMagenta
Write-Host "🔗 Interface: $Interface" -ForegroundColor Yellow
Write-Host "⏱️  Duration: $Duration seconds" -ForegroundColor Yellow
Write-Host "📦 Max Packets: $MaxPackets" -ForegroundColor Yellow
Write-Host "🕐 Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Green

# Create output directory
if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "📁 Created capture directory: $OutputDir" -ForegroundColor Green
}

# Initialize capture results
$CaptureResults = @{
    target = if ($TargetIP) { $TargetIP } else { "all" }
    interface = $Interface
    duration = $Duration
    maxPackets = $MaxPackets
    startTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    endTime = $null
    captureFile = $null
    results = @{
        totalPackets = 0
        protocolBreakdown = @{}
        topTalkers = @()
        suspiciousActivity = @()
        summary = @{}
    }
    status = "running"
    toolVersion = $ToolVersion
}

try {
    # Phase 1: Network Interface Discovery
    Write-Host "`n🔍 Phase 1: Network Interface Discovery" -ForegroundColor Magenta
    Write-Host "━━━━━━━━━━━━���━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkMagenta
    
    # Get network adapters
    $adapters = Get-NetAdapter | Where-Object {$_.Status -eq "Up"}
    
    if ($adapters.Count -eq 0) {
        throw "No active network adapters found"
    }
    
    if ($Interface -eq "auto") {
        # Select the first active adapter
        $selectedAdapter = $adapters[0]
        $Interface = $selectedAdapter.Name
        Write-Host "🔄 Auto-selected interface: $Interface" -ForegroundColor Green
    } else {
        $selectedAdapter = $adapters | Where-Object {$_.Name -eq $Interface}
        if (!$selectedAdapter) {
            Write-Host "⚠️  Interface '$Interface' not found. Available interfaces:" -ForegroundColor Yellow
            $adapters | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Gray }
            $selectedAdapter = $adapters[0]
            $Interface = $selectedAdapter.Name
            Write-Host "🔄 Using: $Interface" -ForegroundColor Green
        }
    }
    
    Write-Host "📡 Selected Interface: $Interface" -ForegroundColor Cyan
    Write-Host "   MAC Address: $($selectedAdapter.MacAddress)" -ForegroundColor Gray
    Write-Host "   Link Speed: $($selectedAdapter.LinkSpeed)" -ForegroundColor Gray
    
    # Phase 2: Packet Capture Setup
    Write-Host "`n🎯 Phase 2: Packet Capture Setup" -ForegroundColor Magenta
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkMagenta
    
    # Generate capture filename
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $captureFile = Join-Path $OutputDir "packet_capture_$timestamp.pcap"
    $CaptureResults.captureFile = $captureFile
    
    # Build netsh trace command
    $traceFile = Join-Path $OutputDir "network_trace_$timestamp.etl"
    $netshCmd = "netsh trace start capture=yes tracefile='$traceFile' maxsize=100"
    
    if ($TargetIP) {
        $netshCmd += " provider=Microsoft-Windows-TCPIP"
    }
    
    Write-Host "🎯 Starting packet capture..." -ForegroundColor Cyan
    Write-Host "   Capture File: $(Split-Path $captureFile -Leaf)" -ForegroundColor Gray
    Write-Host "   Duration: $Duration seconds" -ForegroundColor Gray
    Write-Host "   Max Packets: $MaxPackets" -ForegroundColor Gray
    
    # Start capture using netsh (Windows native)
    $startResult = Invoke-Expression $netshCmd
    
    if ($startResult -match "started") {
        Write-Host "✅ Packet capture started successfully" -ForegroundColor Green
    } else {
        throw "Failed to start packet capture"
    }
    
    # Phase 3: Real-time Monitoring (if enabled)
    if ($RealTime) {
        Write-Host "`n📊 Phase 3: Real-time Monitoring" -ForegroundColor Magenta
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkMagenta
        
        $monitoringDuration = [Math]::Min($Duration, 30) # Monitor for max 30 seconds
        $startTime = Get-Date
        
        while (((Get-Date) - $startTime).TotalSeconds -lt $monitoringDuration) {
            # Get network statistics
            $networkStats = Get-Counter -Counter "\Network Interface(*)\Bytes Total/sec" -SampleInterval 1 -MaxSamples 1
            
            foreach ($sample in $networkStats.CounterSamples) {
                if ($sample.InstanceName -like "*$Interface*" -and $sample.CookedValue -gt 0) {
                    $bytesPerSec = [Math]::Round($sample.CookedValue, 2)
                    Write-Host "📈 Network Activity: $bytesPerSec bytes/sec on $($sample.InstanceName)" -ForegroundColor Cyan
                }
            }
            
            Start-Sleep -Seconds 2
        }
    }
    
    # Phase 4: Wait for capture duration
    Write-Host "`n⏳ Phase 4: Capturing packets..." -ForegroundColor Magenta
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkMagenta
    
    $remainingTime = $Duration
    if ($RealTime) {
        $remainingTime = $Duration - 30
    }
    
    for ($i = 0; $i -lt $remainingTime; $i++) {
        $progress = [Math]::Round(($i / $remainingTime) * 100, 1)
        Write-Progress -Activity "Capturing packets" -Status "$progress% Complete" -PercentComplete $progress
        Start-Sleep -Seconds 1
    }
    
    Write-Progress -Activity "Capturing packets" -Completed
    
    # Stop capture
    Write-Host "🛑 Stopping packet capture..." -ForegroundColor Yellow
    $stopResult = netsh trace stop
    
    if ($stopResult -match "stopped") {
        Write-Host "✅ Packet capture stopped successfully" -ForegroundColor Green
    }
    
    # Phase 5: Basic Analysis
    Write-Host "`n🔍 Phase 5: Packet Analysis" -ForegroundColor Magenta
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━���━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkMagenta
    
    # Analyze network connections during capture period
    $connections = Get-NetTCPConnection | Where-Object {$_.State -eq "Established"}
    $udpEndpoints = Get-NetUDPEndpoint
    
    Write-Host "📊 Network Analysis Results:" -ForegroundColor Cyan
    Write-Host "   Active TCP Connections: $($connections.Count)" -ForegroundColor White
    Write-Host "   UDP Endpoints: $($udpEndpoints.Count)" -ForegroundColor White
    
    # Protocol breakdown
    $protocolStats = @{}
    $protocolStats["TCP"] = $connections.Count
    $protocolStats["UDP"] = $udpEndpoints.Count
    
    # Top talkers analysis
    $topTalkers = @()
    $connectionGroups = $connections | Group-Object RemoteAddress | Sort-Object Count -Descending | Select-Object -First 10
    
    foreach ($group in $connectionGroups) {
        $remoteIP = $group.Name
        $connectionCount = $group.Count
        
        # Try to resolve hostname
        try {
            $hostname = [System.Net.Dns]::GetHostByAddress($remoteIP).HostName
        } catch {
            $hostname = "Unknown"
        }
        
        $topTalkers += @{
            ip = $remoteIP
            hostname = $hostname
            connections = $connectionCount
            type = "TCP"
        }
        
        Write-Host "   🔗 $remoteIP ($hostname): $connectionCount connections" -ForegroundColor Gray
    }
    
    # Suspicious activity detection
    $suspiciousActivity = @()
    
    # Check for unusual port activity
    $uncommonPorts = $connections | Where-Object {
        $_.RemotePort -notin @(80, 443, 53, 22, 21, 25, 110, 143, 993, 995)
    }
    
    if ($uncommonPorts.Count -gt 0) {
        $suspiciousActivity += @{
            type = "Uncommon Port Activity"
            description = "Connections to unusual ports detected"
            count = $uncommonPorts.Count
            severity = "Medium"
            ports = ($uncommonPorts | Select-Object -First 5 | ForEach-Object { $_.RemotePort }) -join ", "
        }
    }
    
    # Check for high connection count to single IP
    $highConnectionIPs = $connectionGroups | Where-Object {$_.Count -gt 10}
    if ($highConnectionIPs.Count -gt 0) {
        foreach ($ip in $highConnectionIPs) {
            $suspiciousActivity += @{
                type = "High Connection Count"
                description = "Multiple connections to single IP: $($ip.Name)"
                count = $ip.Count
                severity = "Medium"
                target = $ip.Name
            }
        }
    }
    
    $CaptureResults.results.totalPackets = $connections.Count + $udpEndpoints.Count
    $CaptureResults.results.protocolBreakdown = $protocolStats
    $CaptureResults.results.topTalkers = $topTalkers
    $CaptureResults.results.suspiciousActivity = $suspiciousActivity
    
    # Generate Summary
    $endTime = Get-Date
    $actualDuration = ($endTime - (Get-Date $CaptureResults.startTime)).TotalSeconds
    
    $CaptureResults.endTime = $endTime.ToString("yyyy-MM-dd HH:mm:ss")
    $CaptureResults.duration = [Math]::Round($actualDuration, 2)
    $CaptureResults.status = "completed"
    $CaptureResults.results.summary = @{
        captureSuccessful = $true
        totalConnections = $CaptureResults.results.totalPackets
        suspiciousActivityCount = $suspiciousActivity.Count
        captureDuration = "$([Math]::Round($actualDuration, 2)) seconds"
        riskLevel = if ($suspiciousActivity.Count -gt 5) { "High" } elseif ($suspiciousActivity.Count -gt 2) { "Medium" } else { "Low" }
        captureFileSize = if (Test-Path $traceFile) { "$([Math]::Round((Get-Item $traceFile).Length / 1MB, 2)) MB" } else { "Unknown" }
    }
    
    # Save results to JSON
    $jsonOutput = $CaptureResults | ConvertTo-Json -Depth 10
    $outputFile = Join-Path $OutputDir "packet_analysis_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"
    $jsonOutput | Out-File -FilePath $outputFile -Encoding UTF8
    
    # Generate human-readable report
    $reportFile = Join-Path $OutputDir "packet_report_$(Get-Date -Format 'yyyyMMdd_HHmmss').txt"
    $report = @"
KNOUX7 PacketInterceptor Analysis Report
=======================================
Interface: $Interface
Capture Time: $($CaptureResults.startTime) - $($CaptureResults.endTime)
Duration: $($CaptureResults.duration) seconds
Capture File: $(Split-Path $traceFile -Leaf)

CAPTURE SUMMARY
--------------
Total Connections Analyzed: $($CaptureResults.results.totalPackets)
TCP Connections: $($protocolStats.TCP)
UDP Endpoints: $($protocolStats.UDP)
Capture File Size: $($CaptureResults.results.summary.captureFileSize)

TOP TALKERS
-----------
$($topTalkers | ForEach-Object { "$($_.ip) ($($_.hostname)) - $($_.connections) connections" } | Out-String)

SUSPICIOUS ACTIVITY
------------------
Total Alerts: $($suspiciousActivity.Count)
Risk Level: $($CaptureResults.results.summary.riskLevel)

$($suspiciousActivity | ForEach-Object { "- [$($_.severity)] $($_.type): $($_.description)" } | Out-String)

PROTOCOL BREAKDOWN
-----------------
$($protocolStats.GetEnumerator() | ForEach-Object { "$($_.Key): $($_.Value)" } | Out-String)

RECOMMENDATIONS
---------------
1. Review suspicious connections and verify legitimacy
2. Monitor unusual port activity
3. Implement network segmentation for sensitive services
4. Regular network traffic analysis
5. Set up automated alerting for anomalous patterns

Generated by KNOUX7 PacketInterceptor v$ToolVersion
"@

    $report | Out-File -FilePath $reportFile -Encoding UTF8
    
    # Final Summary
    Write-Host "`n📊 CAPTURE COMPLETED" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGreen
    Write-Host "🔗 Interface: $Interface" -ForegroundColor White
    Write-Host "⏱️  Duration: $($CaptureResults.duration) seconds" -ForegroundColor White
    Write-Host "📦 Connections: $($CaptureResults.results.totalPackets)" -ForegroundColor White
    Write-Host "⚠️  Suspicious Activity: $($suspiciousActivity.Count)" -ForegroundColor White
    Write-Host "🛡️  Risk Level: $($CaptureResults.results.summary.riskLevel)" -ForegroundColor White
    Write-Host "📁 Files saved to: $OutputDir" -ForegroundColor White
    Write-Host "   - Trace: $(Split-Path $traceFile -Leaf)" -ForegroundColor Gray
    Write-Host "   - Analysis: $(Split-Path $outputFile -Leaf)" -ForegroundColor Gray
    Write-Host "   - Report: $(Split-Path $reportFile -Leaf)" -ForegroundColor Gray
    
    # Return results for API
    Write-Output $jsonOutput

} catch {
    $errorMsg = $_.Exception.Message
    Write-Host "❌ CAPTURE FAILED: $errorMsg" -ForegroundColor Red
    
    # Try to stop any running traces
    try {
        netsh trace stop 2>$null
    } catch {}
    
    $CaptureResults.status = "failed"
    $CaptureResults.error = $errorMsg
    $CaptureResults.endTime = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    
    $errorOutput = $CaptureResults | ConvertTo-Json -Depth 10
    Write-Output $errorOutput
    exit 1
}
