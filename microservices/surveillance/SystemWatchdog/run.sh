#!/bin/bash

# SystemWatchdog - Linux Bash Script
# مراقبة عمليات النظام والتطبيقات المشبوهة

LOG_PATH="${1:-results/surveillance/systemwatchdog.log}"
MONITOR_DURATION="${2:-300}"  # 5 minutes

echo "🔍 System Watchdog Started - Monitoring system processes..."
echo "Duration: $MONITOR_DURATION seconds"

# إنشاء مجلد النتائج إذا لم يكن موجوداً
LOG_DIR=$(dirname "$LOG_PATH")
mkdir -p "$LOG_DIR"

# بدء ملف اللوج
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$TIMESTAMP] SystemWatchdog monitoring started" >> "$LOG_PATH"

# متغيرات المراقبة
START_TIME=$(date +%s)
CPU_THRESHOLD=80
MEMORY_THRESHOLD=85
SUSPICIOUS_PROCESSES=("nc" "ncat" "netcat" "pwdump" "mimikatz" "msfconsole" "meterpreter")

# دالة للحصول على استخدام المعالج
get_cpu_usage() {
    # استخدام /proc/stat للحصول على استخدام المعالج
    if command -v top >/dev/null 2>&1; then
        top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1
    else
        # بديل باستخدام /proc/loadavg
        awk '{print ($1 * 100 / 4)}' /proc/loadavg 2>/dev/null || echo "0"
    fi
}

# دالة للحصول على استخدام الذاكرة
get_memory_usage() {
    if command -v free >/dev/null 2>&1; then
        free | awk 'NR==2{printf "%.1f", $3*100/$2}'
    else
        echo "0"
    fi
}

# دالة للحصول على العمليات الجارية
get_running_processes() {
    ps aux --no-headers | wc -l
}

# دالة للتحقق من العمليات المشبوهة
check_suspicious_processes() {
    local timestamp="$1"
    for process in "${SUSPICIOUS_PROCESSES[@]}"; do
        if pgrep -f "$process" >/dev/null 2>&1; then
            local pid=$(pgrep -f "$process" | head -1)
            local alert="[$timestamp] SUSPICIOUS PROCESS DETECTED: $process (PID: $pid)"
            echo "$alert" | tee -a "$LOG_PATH"
        fi
    done
}

# دالة للتحقق من الاتصالات الشبكية
check_network_connections() {
    local timestamp="$1"
    if command -v netstat >/dev/null 2>&1; then
        local external_connections=$(netstat -tn 2>/dev/null | grep ESTABLISHED | grep -v "127\|192.168\|10\." | wc -l)
        if [ "$external_connections" -gt 20 ]; then
            local alert="[$timestamp] HIGH EXTERNAL CONNECTIONS: $external_connections active connections"
            echo "$alert" | tee -a "$LOG_PATH"
        fi
    fi
}

# دالة للتحقق من تسجيل الدخول الحديث
check_recent_logins() {
    local timestamp="$1"
    if command -v last >/dev/null 2>&1; then
        local recent_logins=$(last -n 5 | grep -v "reboot\|wtmp" | head -2)
        if [ -n "$recent_logins" ]; then
            echo "[$timestamp] RECENT LOGIN ACTIVITY detected" >> "$LOG_PATH"
        fi
    fi
}

# بدء حلقة المراقبة الرئيسية
echo "Starting monitoring loop..."

while true; do
    CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')
    CURRENT_TIMESTAMP=$(date +%s)
    
    # التحقق من انتهاء وقت المراقبة
    if [ $((CURRENT_TIMESTAMP - START_TIME)) -ge $MONITOR_DURATION ]; then
        break
    fi
    
    # مراقبة استخدام المعالج
    CPU_USAGE=$(get_cpu_usage)
    CPU_USAGE_INT=$(echo "$CPU_USAGE" | cut -d'.' -f1)
    if [ "$CPU_USAGE_INT" -gt $CPU_THRESHOLD ] 2>/dev/null; then
        ALERT="[$CURRENT_TIME] HIGH CPU USAGE: ${CPU_USAGE}%"
        echo -e "\033[31m$ALERT\033[0m"
        echo "$ALERT" >> "$LOG_PATH"
    fi
    
    # مراقبة استخدام الذاكرة
    MEMORY_USAGE=$(get_memory_usage)
    MEMORY_USAGE_INT=$(echo "$MEMORY_USAGE" | cut -d'.' -f1)
    if [ "$MEMORY_USAGE_INT" -gt $MEMORY_THRESHOLD ] 2>/dev/null; then
        ALERT="[$CURRENT_TIME] HIGH MEMORY USAGE: ${MEMORY_USAGE}%"
        echo -e "\033[31m$ALERT\033[0m"
        echo "$ALERT" >> "$LOG_PATH"
    fi
    
    # التحقق من العمليات المشبوهة
    check_suspicious_processes "$CURRENT_TIME"
    
    # التحقق من الاتصالات الشبكية
    check_network_connections "$CURRENT_TIME"
    
    # التحقق من تسجيل الدخول الحديث
    check_recent_logins "$CURRENT_TIME"
    
    # إحصائيات دورية
    PROCESS_COUNT=$(get_running_processes)
    INFO="[$CURRENT_TIME] Status: CPU: ${CPU_USAGE}%, Memory: ${MEMORY_USAGE}%, Processes: $PROCESS_COUNT"
    echo "$INFO" >> "$LOG_PATH"
    
    echo -n "."
    sleep 10
done

echo -e "\n✅ System Watchdog monitoring completed successfully"
END_TIME=$(date '+%Y-%m-%d %H:%M:%S')
echo "[$END_TIME] SystemWatchdog monitoring completed" >> "$LOG_PATH"

# ملخص النتائج
LOG_ENTRIES=$(wc -l < "$LOG_PATH")
ALERTS=$(grep -c "ALERT\|HIGH\|SUSPICIOUS" "$LOG_PATH" 2>/dev/null || echo "0")

echo ""
echo "📊 Monitoring Summary:"
echo "- Duration: $MONITOR_DURATION seconds"
echo "- Total log entries: $LOG_ENTRIES"
echo "- Alerts generated: $ALERTS"
echo "- Log file: $LOG_PATH"

# إرجاع النتيجة بتنسيق JSON للـ API
cat << EOF
{
  "success": true,
  "status": "COMPLETED",
  "duration": $MONITOR_DURATION,
  "logEntries": $LOG_ENTRIES,
  "alertsGenerated": $ALERTS,
  "logFile": "$LOG_PATH",
  "timestamp": "$END_TIME"
}
EOF
