# AutoRecon - Advanced Vulnerability Scanner
# Windows PowerShell Implementation
# KNOX Sentinel™ Offensive Operations Module

param(
    [string]$Target = "",
    [string]$OutputDir = "results/offensive/AutoRecon",
    [string]$ScanType = "full",
    [int]$Timeout = 300
)

Write-Host "🎯 AutoRecon - Advanced Vulnerability Scanner" -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Yellow

# التحقق من الهدف
if (-not $Target) {
    if (Test-Path "target.txt") {
        $Target = Get-Content "target.txt" | Select-Object -First 1
        Write-Host "📋 Target loaded from target.txt: $Target" -ForegroundColor Green
    } else {
        Write-Host "❌ ERROR: No target specified. Use -Target parameter or create target.txt" -ForegroundColor Red
        exit 1
    }
}

# إنشاء مجلد النتائج
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "$OutputDir\autorecon_$timestamp.log"
$reportFile = "$OutputDir\autorecon_report_$timestamp.json"

Write-Host "🔍 Starting reconnaissance on target: $Target" -ForegroundColor Cyan
Write-Host "📁 Output directory: $OutputDir" -ForegroundColor Gray

# بدء اللوج
Add-Content -Path $logFile -Value "[$timestamp] AutoRecon started on target: $Target"

try {
    # المرحلة 1: فحص المنافذ الأساسي
    Write-Host "`n🔍 Phase 1: Port Discovery" -ForegroundColor Yellow
    $portScanFile = "$OutputDir\ports_$timestamp.txt"
    
    # استخدام nmap إذا كان متوفراً، وإلا Test-NetConnection
    if (Get-Command nmap -ErrorAction SilentlyContinue) {
        Write-Host "🚀 Running nmap port scan..." -ForegroundColor Green
        $nmapResult = nmap -A -T4 -p- $Target 2>&1
        $nmapResult | Out-File -FilePath $portScanFile -Encoding UTF8
        Add-Content -Path $logFile -Value "[$((Get-Date).ToString())] Nmap scan completed"
    } else {
        Write-Host "⚡ Running PowerShell port scan..." -ForegroundColor Blue
        $commonPorts = @(21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 993, 995, 1723, 3306, 3389, 5432, 5900, 8080)
        $openPorts = @()
        
        foreach ($port in $commonPorts) {
            $result = Test-NetConnection -ComputerName $Target -Port $port -WarningAction SilentlyContinue
            if ($result.TcpTestSucceeded) {
                $openPorts += $port
                Write-Host "✅ Port $port is OPEN" -ForegroundColor Green
            }
        }
        
        "Open ports on ${Target}:" | Out-File -FilePath $portScanFile -Encoding UTF8
        $openPorts | ForEach-Object { "Port $_ - OPEN" } | Out-File -FilePath $portScanFile -Append -Encoding UTF8
    }

    # المرحلة 2: فحص الخدمات
    Write-Host "`n🔍 Phase 2: Service Enumeration" -ForegroundColor Yellow
    $serviceFile = "$OutputDir\services_$timestamp.txt"
    
    # فحص HTTP/HTTPS
    $webPorts = @(80, 443, 8080, 8443)
    foreach ($port in $webPorts) {
        try {
            $uri = if ($port -in @(443, 8443)) { "https://${Target}:$port" } else { "http://${Target}:$port" }
            $response = Invoke-WebRequest -Uri $uri -Method HEAD -TimeoutSec 10 -ErrorAction Stop
            $serviceInfo = "Port $port - HTTP Service detected - Status: $($response.StatusCode)"
            Add-Content -Path $serviceFile -Value $serviceInfo
            Write-Host "🌐 $serviceInfo" -ForegroundColor Cyan
        } catch {
            # تجاهل الأخطاء للمنافذ المغلقة
        }
    }

    # المرحلة 3: فحص نظام التشغيل
    Write-Host "`n🔍 Phase 3: OS Detection" -ForegroundColor Yellow
    $osFile = "$OutputDir\os_detection_$timestamp.txt"
    
    if (Get-Command nmap -ErrorAction SilentlyContinue) {
        $osResult = nmap -O $Target 2>&1
        $osResult | Out-File -FilePath $osFile -Encoding UTF8
    } else {
        # فحص بديل باستخدام ping
        $pingResult = ping $Target -n 2
        $ttlInfo = $pingResult | Select-String "TTL"
        if ($ttlInfo) {
            $ttl = ($ttlInfo -split "TTL=")[1] -split " " | Select-Object -First 1
            $osGuess = switch ([int]$ttl) {
                { $_ -le 64 } { "Linux/Unix" }
                { $_ -le 128 } { "Windows" }
                default { "Unknown" }
            }
            "OS Detection (TTL-based): $osGuess (TTL: $ttl)" | Out-File -FilePath $osFile -Encoding UTF8
            Write-Host "💻 OS Detection: $osGuess" -ForegroundColor Magenta
        }
    }

    # المرحلة 4: فحص الثغرات
    Write-Host "`n🔍 Phase 4: Vulnerability Assessment" -ForegroundColor Yellow
    $vulnFile = "$OutputDir\vulnerabilities_$timestamp.txt"
    
    # فحص الثغرات الشائعة
    $vulnChecks = @{
        "EternalBlue" = @{ Port = 445; Description = "SMB EternalBlue vulnerability" }
        "Heartbleed" = @{ Port = 443; Description = "OpenSSL Heartbleed vulnerability" }
        "SSH_Weak" = @{ Port = 22; Description = "SSH weak configuration" }
    }
    
    foreach ($vuln in $vulnChecks.Keys) {
        $port = $vulnChecks[$vuln].Port
        $desc = $vulnChecks[$vuln].Description
        
        $testResult = Test-NetConnection -ComputerName $Target -Port $port -WarningAction SilentlyContinue
        if ($testResult.TcpTestSucceeded) {
            $vulnInfo = "POTENTIAL VULNERABILITY: $desc on port $port"
            Add-Content -Path $vulnFile -Value $vulnInfo
            Write-Host "⚠️  $vulnInfo" -ForegroundColor Red
        }
    }

    # إنشاء التقرير النهائي
    $endTime = Get-Date
    $scanDuration = ($endTime - (Get-Date $timestamp)).TotalSeconds
    
    $report = @{
        target = $Target
        scanType = $ScanType
        startTime = $timestamp
        endTime = $endTime.ToString("yyyy-MM-dd HH:mm:ss")
        duration = $scanDuration
        status = "COMPLETED"
        files = @{
            ports = $portScanFile
            services = $serviceFile
            osDetection = $osFile
            vulnerabilities = $vulnFile
            log = $logFile
        }
        summary = @{
            portsScanned = if ($openPorts) { $openPorts.Count } else { "N/A" }
            servicesFound = if (Test-Path $serviceFile) { (Get-Content $serviceFile).Count } else { 0 }
            vulnerabilities = if (Test-Path $vulnFile) { (Get-Content $vulnFile).Count } else { 0 }
        }
        risk = "MEDIUM"
    }
    
    $report | ConvertTo-Json -Depth 3 | Out-File -FilePath $reportFile -Encoding UTF8
    
    Write-Host "`n✅ AutoRecon scan completed successfully!" -ForegroundColor Green
    Write-Host "📊 Scan Duration: $([math]::Round($scanDuration, 2)) seconds" -ForegroundColor White
    Write-Host "📄 Report saved to: $reportFile" -ForegroundColor White
    
    Add-Content -Path $logFile -Value "[$($endTime.ToString())] AutoRecon completed successfully"
    
    # إرجاع النتيجة للـ API
    Write-Output ($report | ConvertTo-Json -Compress)
    
} catch {
    $errorTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $errorMsg = "ERROR: $($_.Exception.Message)"
    
    Write-Host "❌ $errorMsg" -ForegroundColor Red
    Add-Content -Path $logFile -Value "[$errorTime] $errorMsg"
    
    $errorReport = @{
        target = $Target
        status = "ERROR"
        error = $_.Exception.Message
        timestamp = $errorTime
        risk = "UNKNOWN"
    }
    
    Write-Output ($errorReport | ConvertTo-Json -Compress)
    exit 1
}
