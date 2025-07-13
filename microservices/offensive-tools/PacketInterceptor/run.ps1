# PacketInterceptor - Advanced Network Packet Sniffer
# Windows PowerShell Implementation
# KNOX Sentinel™ Offensive Operations Module

param(
    [string]$Interface = "WiFi",
    [string]$OutputDir = "results/offensive/PacketInterceptor",
    [int]$Duration = 60,
    [string]$Filter = "",
    [string]$Protocol = "all"
)

Write-Host "🕷️ PacketInterceptor - Advanced Network Sniffer" -ForegroundColor Red
Write-Host "=================================================" -ForegroundColor Yellow

# إنشاء مجلد النتائج
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "$OutputDir\packetinterceptor_$timestamp.log"
$captureFile = "$OutputDir\capture_$timestamp.etl"
$reportFile = "$OutputDir\packet_report_$timestamp.json"

Write-Host "🔍 Starting packet capture on interface: $Interface" -ForegroundColor Cyan
Write-Host "⏱️  Capture duration: $Duration seconds" -ForegroundColor Gray
Write-Host "📁 Output directory: $OutputDir" -ForegroundColor Gray

# بدء اللوج
Add-Content -Path $logFile -Value "[$timestamp] PacketInterceptor started"

try {
    # الحصول على معلومات الشبكة
    Write-Host "`n🔍 Network Interface Analysis" -ForegroundColor Yellow
    $networkAdapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" }
    
    Write-Host "Available Network Interfaces:" -ForegroundColor Green
    $networkAdapters | ForEach-Object {
        Write-Host "  - $($_.Name) ($($_.InterfaceDescription))" -ForegroundColor White
    }
    
    # العثور على الواجهة المحددة
    $targetAdapter = $networkAdapters | Where-Object { $_.Name -like "*$Interface*" } | Select-Object -First 1
    if (-not $targetAdapter) {
        $targetAdapter = $networkAdapters | Select-Object -First 1
        Write-Host "⚠️  Interface '$Interface' not found, using: $($targetAdapter.Name)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Using interface: $($targetAdapter.Name)" -ForegroundColor Green
    }
    
    # بدء التقاط الحزم باستخدام netsh trace
    Write-Host "`n🎯 Starting Packet Capture" -ForegroundColor Yellow
    $traceCommand = "netsh trace start capture=yes overwrite=yes maxsize=100 tracefile=`"$captureFile`""
    
    if ($Filter) {
        $traceCommand += " provider=Microsoft-Windows-TCPIP"
    }
    
    Write-Host "📡 Executing: $traceCommand" -ForegroundColor Cyan
    $startResult = Invoke-Expression $traceCommand 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Packet capture started successfully" -ForegroundColor Green
        Add-Content -Path $logFile -Value "[$((Get-Date).ToString())] Packet capture started on $($targetAdapter.Name)"
        
        # عرض المعلومات الحية
        Write-Host "`n📊 Live Capture Statistics" -ForegroundColor Yellow
        $startTime = Get-Date
        $packetsCount = 0
        
        # مراقبة الالتقاط لفترة محددة
        for ($i = 1; $i -le $Duration; $i++) {
            Start-Sleep -Seconds 1
            
            # عرض التقدم كل 10 ثوان
            if ($i % 10 -eq 0) {
                $elapsed = $i
                $remaining = $Duration - $i
                Write-Host "⏱️  Elapsed: ${elapsed}s | Remaining: ${remaining}s" -ForegroundColor Cyan
                
                # محاولة الحصول على إحصائيات الشبكة
                try {
                    $networkStats = Get-NetAdapterStatistics -Name $targetAdapter.Name -ErrorAction SilentlyContinue
                    if ($networkStats) {
                        $packetsCount = $networkStats.PacketsReceived + $networkStats.PacketsSent
                        Write-Host "📈 Packets processed: $packetsCount" -ForegroundColor Green
                    }
                } catch {
                    # تجاهل الأخطاء في إحصائيات الشبكة
                }
            }
            
            Write-Host "." -NoNewline -ForegroundColor Green
        }
        
        Write-Host "`n`n🛑 Stopping packet capture..." -ForegroundColor Yellow
        $stopResult = netsh trace stop 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Packet capture stopped successfully" -ForegroundColor Green
            Add-Content -Path $logFile -Value "[$((Get-Date).ToString())] Packet capture stopped"
        } else {
            Write-Host "⚠️  Warning during capture stop: $stopResult" -ForegroundColor Yellow
        }
        
    } else {
        throw "Failed to start packet capture: $startResult"
    }
    
    # تحليل النتائج
    Write-Host "`n🔍 Analyzing captured data..." -ForegroundColor Yellow
    $captureSize = 0
    if (Test-Path $captureFile) {
        $captureSize = (Get-Item $captureFile).Length
        Write-Host "📄 Capture file size: $([math]::Round($captureSize / 1MB, 2)) MB" -ForegroundColor Green
    }
    
    # إحصائيات الشبكة النهائية
    $finalStats = @{
        packetsProcessed = $packetsCount
        captureSize = $captureSize
        networkInterface = $targetAdapter.Name
        interfaceDescription = $targetAdapter.InterfaceDescription
    }
    
    # فحص نشاط الشبكة
    Write-Host "`n🔍 Network Activity Analysis" -ForegroundColor Yellow
    $networkConnections = Get-NetTCPConnection | Where-Object { $_.State -eq "Established" }
    $externalConnections = $networkConnections | Where-Object { 
        $_.RemoteAddress -notlike "127.*" -and 
        $_.RemoteAddress -notlike "192.168.*" -and 
        $_.RemoteAddress -notlike "10.*" -and
        $_.RemoteAddress -ne "::1"
    }
    
    Write-Host "📊 Active TCP Connections: $($networkConnections.Count)" -ForegroundColor Cyan
    Write-Host "🌐 External Connections: $($externalConnections.Count)" -ForegroundColor Cyan
    
    # كشف الأنشطة المشبوهة
    $suspiciousActivity = @()
    if ($externalConnections.Count -gt 20) {
        $suspiciousActivity += "High number of external connections detected"
    }
    
    # فحص المنافذ عالية المخاطر
    $highRiskPorts = @(4444, 4445, 1337, 31337, 12345, 54321)
    foreach ($conn in $networkConnections) {
        if ($conn.LocalPort -in $highRiskPorts -or $conn.RemotePort -in $highRiskPorts) {
            $suspiciousActivity += "High-risk port detected: $($conn.LocalPort) -> $($conn.RemoteAddress):$($conn.RemotePort)"
        }
    }
    
    if ($suspiciousActivity.Count -gt 0) {
        Write-Host "`n⚠️  Suspicious Activity Detected:" -ForegroundColor Red
        $suspiciousActivity | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    }
    
    # إنشاء التقرير النهائي
    $endTime = Get-Date
    $captureDuration = ($endTime - $startTime).TotalSeconds
    
    $report = @{
        interface = $targetAdapter.Name
        interfaceDescription = $targetAdapter.InterfaceDescription
        startTime = $startTime.ToString("yyyy-MM-dd HH:mm:ss")
        endTime = $endTime.ToString("yyyy-MM-dd HH:mm:ss")
        duration = $captureDuration
        status = "COMPLETED"
        files = @{
            capture = $captureFile
            log = $logFile
        }
        statistics = @{
            packetsProcessed = $packetsCount
            captureSize = $captureSize
            activeTCPConnections = $networkConnections.Count
            externalConnections = $externalConnections.Count
        }
        suspiciousActivity = $suspiciousActivity
        risk = if ($suspiciousActivity.Count -gt 0) { "HIGH" } else { "LOW" }
    }
    
    $report | ConvertTo-Json -Depth 3 | Out-File -FilePath $reportFile -Encoding UTF8
    
    Write-Host "`n✅ PacketInterceptor completed successfully!" -ForegroundColor Green
    Write-Host "📊 Capture Duration: $([math]::Round($captureDuration, 2)) seconds" -ForegroundColor White
    Write-Host "📄 Report saved to: $reportFile" -ForegroundColor White
    Write-Host "📡 Capture file: $captureFile" -ForegroundColor White
    
    Add-Content -Path $logFile -Value "[$($endTime.ToString())] PacketInterceptor completed successfully"
    
    # إرجاع النتيجة للـ API
    Write-Output ($report | ConvertTo-Json -Compress)
    
} catch {
    $errorTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $errorMsg = "ERROR: $($_.Exception.Message)"
    
    Write-Host "❌ $errorMsg" -ForegroundColor Red
    Add-Content -Path $logFile -Value "[$errorTime] $errorMsg"
    
    # محاولة إيقاف التتبع في حالة الخطأ
    try {
        netsh trace stop | Out-Null
    } catch {
        # تجاهل أخطاء إيقاف التتبع
    }
    
    $errorReport = @{
        interface = $Interface
        status = "ERROR"
        error = $_.Exception.Message
        timestamp = $errorTime
        risk = "UNKNOWN"
    }
    
    Write-Output ($errorReport | ConvertTo-Json -Compress)
    exit 1
}
