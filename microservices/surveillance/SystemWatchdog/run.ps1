# SystemWatchdog - Windows PowerShell Script
# مراقبة عمليات النظام والتطبيقات المشبوهة

param(
    [string]$LogPath = "results/surveillance/systemwatchdog.log",
    [int]$MonitorDuration = 300  # 5 minutes
)

Write-Host "🔍 System Watchdog Started - Monitoring system processes..." -ForegroundColor Green
Write-Host "Duration: $MonitorDuration seconds" -ForegroundColor Yellow

# إنشاء مجلد النتائج إذا لم يكن موجوداً
$logDir = Split-Path $LogPath -Parent
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

# بدء ملف اللوج
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $LogPath -Value "[$timestamp] SystemWatchdog monitoring started"

# متغيرات المراقبة
$startTime = Get-Date
$alertThresholds = @{
    CPUPercent = 80
    MemoryPercent = 85
    SuspiciousProcesses = @("nc.exe", "ncat.exe", "netcat.exe", "pwdump", "mimikatz")
}

try {
    # حلقة المراقبة الرئيسية
    while ((Get-Date) -lt $startTime.AddSeconds($MonitorDuration)) {
        $currentTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        
        # مراقبة استخدام المعالج
        $cpuUsage = (Get-Counter "\Processor(_Total)\% Processor Time").CounterSamples.CookedValue
        if ($cpuUsage -gt $alertThresholds.CPUPercent) {
            $alert = "[$currentTime] HIGH CPU USAGE: $($cpuUsage.ToString('F1'))%"
            Write-Host $alert -ForegroundColor Red
            Add-Content -Path $LogPath -Value $alert
        }
        
        # مراقبة استخدام الذاكرة
        $memory = Get-CimInstance -ClassName Win32_OperatingSystem
        $memoryUsage = [math]::Round((($memory.TotalVisibleMemorySize - $memory.FreePhysicalMemory) / $memory.TotalVisibleMemorySize) * 100, 2)
        if ($memoryUsage -gt $alertThresholds.MemoryPercent) {
            $alert = "[$currentTime] HIGH MEMORY USAGE: $memoryUsage%"
            Write-Host $alert -ForegroundColor Red
            Add-Content -Path $LogPath -Value $alert
        }
        
        # مراقبة العمليات المشبوهة
        $runningProcesses = Get-Process | Select-Object ProcessName, Id, CPU, WorkingSet64
        foreach ($suspiciousProcess in $alertThresholds.SuspiciousProcesses) {
            $foundProcess = $runningProcesses | Where-Object { $_.ProcessName -like "*$suspiciousProcess*" }
            if ($foundProcess) {
                $alert = "[$currentTime] SUSPICIOUS PROCESS DETECTED: $($foundProcess.ProcessName) (PID: $($foundProcess.Id))"
                Write-Host $alert -ForegroundColor Red
                Add-Content -Path $LogPath -Value $alert
            }
        }
        
        # مراقبة الاتصالات الشبكية النشطة
        $networkConnections = Get-NetTCPConnection | Where-Object { $_.State -eq "Established" }
        $externalConnections = $networkConnections | Where-Object { 
            $_.RemoteAddress -notlike "127.*" -and 
            $_.RemoteAddress -notlike "192.168.*" -and 
            $_.RemoteAddress -notlike "10.*" -and
            $_.RemoteAddress -ne "::1"
        }
        
        if ($externalConnections.Count -gt 20) {
            $alert = "[$currentTime] HIGH EXTERNAL CONNECTIONS: $($externalConnections.Count) active connections"
            Write-Host $alert -ForegroundColor Yellow
            Add-Content -Path $LogPath -Value $alert
        }
        
        # مراقبة تسجيل الدخول الجديد
        $recentLogons = Get-WinEvent -FilterHashtable @{LogName='Security'; ID=4624; StartTime=(Get-Date).AddMinutes(-1)} -ErrorAction SilentlyContinue
        if ($recentLogons) {
            foreach ($logon in $recentLogons) {
                $alert = "[$currentTime] NEW LOGON EVENT: User $($logon.Properties[5].Value) from $($logon.Properties[18].Value)"
                Write-Host $alert -ForegroundColor Cyan
                Add-Content -Path $LogPath -Value $alert
            }
        }
        
        # إحصائيات دورية
        $info = "[$currentTime] Status: CPU: $($cpuUsage.ToString('F1'))%, Memory: $memoryUsage%, Processes: $($runningProcesses.Count), Network: $($networkConnections.Count) connections"
        Add-Content -Path $LogPath -Value $info
        
        Write-Host "." -NoNewline -ForegroundColor Green
        Start-Sleep -Seconds 10
    }
    
    Write-Host "`n✅ System Watchdog monitoring completed successfully" -ForegroundColor Green
    $endTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Add-Content -Path $LogPath -Value "[$endTime] SystemWatchdog monitoring completed"
    
    # ملخص النتائج
    $logContent = Get-Content $LogPath
    $alerts = $logContent | Where-Object { $_ -like "*ALERT*" -or $_ -like "*HIGH*" -or $_ -like "*SUSPICIOUS*" }
    
    Write-Host "`n📊 Monitoring Summary:" -ForegroundColor Blue
    Write-Host "- Duration: $MonitorDuration seconds" -ForegroundColor White
    Write-Host "- Total log entries: $($logContent.Count)" -ForegroundColor White
    Write-Host "- Alerts generated: $($alerts.Count)" -ForegroundColor White
    Write-Host "- Log file: $LogPath" -ForegroundColor White
    
    # إرجاع النتيجة بتنسيق JSON للـ API
    $result = @{
        success = $true
        status = "COMPLETED"
        duration = $MonitorDuration
        logEntries = $logContent.Count
        alertsGenerated = $alerts.Count
        logFile = $LogPath
        timestamp = $endTime
    }
    
    Write-Output ($result | ConvertTo-Json -Compress)
    
} catch {
    $errorTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $errorMsg = "[$errorTime] ERROR: $($_.Exception.Message)"
    Write-Host $errorMsg -ForegroundColor Red
    Add-Content -Path $LogPath -Value $errorMsg
    
    $errorResult = @{
        success = $false
        status = "ERROR"
        error = $_.Exception.Message
        timestamp = $errorTime
    }
    
    Write-Output ($errorResult | ConvertTo-Json -Compress)
    exit 1
}
