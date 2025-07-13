#!/bin/bash

# PacketInterceptor - Advanced Network Packet Sniffer
# Linux Bash Implementation  
# KNOX Sentinel™ Offensive Operations Module

INTERFACE="${1:-wlan0}"
OUTPUT_DIR="${2:-results/offensive/PacketInterceptor}"
DURATION="${3:-60}"
FILTER="${4:-}"
PROTOCOL="${5:-all}"

echo "🕷️ PacketInterceptor - Advanced Network Sniffer"
echo "================================================="

# التحقق من الصلاحيات
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  This tool requires root privileges. Use with sudo."
    echo "Running in limited mode..."
    LIMITED_MODE=true
else
    LIMITED_MODE=false
fi

# إنشاء مجلد النتائج
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
LOG_FILE="$OUTPUT_DIR/packetinterceptor_$TIMESTAMP.log"
CAPTURE_FILE="$OUTPUT_DIR/capture_$TIMESTAMP.pcap"
REPORT_FILE="$OUTPUT_DIR/packet_report_$TIMESTAMP.json"

echo "🔍 Starting packet capture on interface: $INTERFACE"
echo "⏱️  Capture duration: $DURATION seconds"
echo "📁 Output directory: $OUTPUT_DIR"

# بدء اللوج
echo "[$TIMESTAMP] PacketInterceptor started" >> "$LOG_FILE"

START_TIME=$(date +%s)

# دالة لإضافة اللوج
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" >> "$LOG_FILE"
}

# دالة للتنظيف عند الخروج
cleanup() {
    echo ""
    echo "🧹 Cleaning up..."
    
    # إيقاف tcpdump إذا كان يعمل
    if [ -n "$TCPDUMP_PID" ]; then
        kill "$TCPDUMP_PID" 2>/dev/null
        wait "$TCPDUMP_PID" 2>/dev/null
    fi
    
    log_message "PacketInterceptor cleanup completed"
}

trap cleanup EXIT INT TERM

try_capture() {
    echo ""
    echo "🔍 Network Interface Analysis"
    
    # عرض الواجهات المتاحة
    if command -v ip >/dev/null 2>&1; then
        echo "Available Network Interfaces:"
        ip link show | grep -E "^[0-9]+:" | while read line; do
            IFACE=$(echo "$line" | cut -d':' -f2 | tr -d ' ')
            STATE=$(echo "$line" | grep -o "state [A-Z]*" | cut -d' ' -f2)
            echo "  - $IFACE ($STATE)"
        done
    elif command -v ifconfig >/dev/null 2>&1; then
        echo "Available Network Interfaces:"
        ifconfig | grep -E "^[a-zA-Z0-9]+" | while read line; do
            IFACE=$(echo "$line" | cut -d':' -f1)
            echo "  - $IFACE"
        done
    fi
    
    # التحقق من وجود الواجهة
    if command -v ip >/dev/null 2>&1; then
        if ! ip link show "$INTERFACE" >/dev/null 2>&1; then
            echo "⚠️  Interface '$INTERFACE' not found, trying to detect active interface..."
            INTERFACE=$(ip route | grep default | head -n1 | sed 's/.*dev \([^ ]*\).*/\1/')
            if [ -z "$INTERFACE" ]; then
                INTERFACE="eth0"
            fi
            echo "✅ Using interface: $INTERFACE"
        else
            echo "✅ Using interface: $INTERFACE"
        fi
    fi
    
    # بدء التقاط الحزم
    echo ""
    echo "🎯 Starting Packet Capture"
    
    if [ "$LIMITED_MODE" = true ]; then
        echo "🔒 Running in limited mode (no root access)"
        
        # محاولة استخدام tcpdump بدون صلاحيات خاصة
        if command -v tcpdump >/dev/null 2>&1; then
            echo "📡 Attempting limited packet capture..."
            timeout "$DURATION" tcpdump -i any -c 1000 -nn > "$CAPTURE_FILE.txt" 2>&1 &
            TCPDUMP_PID=$!
        else
            echo "❌ tcpdump not available and no root access"
            return 1
        fi
        
    else
        # وضع كامل الصلاحيات
        if command -v tcpdump >/dev/null 2>&1; then
            echo "📡 Starting full packet capture with tcpdump..."
            
            # بناء أمر tcpdump
            TCPDUMP_CMD="tcpdump -i $INTERFACE -w $CAPTURE_FILE"
            
            if [ -n "$FILTER" ]; then
                TCPDUMP_CMD="$TCPDUMP_CMD $FILTER"
            fi
            
            echo "🔍 Command: $TCPDUMP_CMD"
            
            # تشغيل tcpdump في الخلفية
            timeout "$DURATION" $TCPDUMP_CMD 2>"$CAPTURE_FILE.log" &
            TCPDUMP_PID=$!
            
        elif command -v tshark >/dev/null 2>&1; then
            echo "📡 Starting packet capture with tshark..."
            timeout "$DURATION" tshark -i "$INTERFACE" -w "$CAPTURE_FILE" &
            TCPDUMP_PID=$!
            
        else
            echo "❌ No packet capture tools available (tcpdump/tshark)"
            return 1
        fi
    fi
    
    if [ -n "$TCPDUMP_PID" ]; then
        echo "✅ Packet capture started (PID: $TCPDUMP_PID)"
        log_message "Packet capture started on $INTERFACE with PID $TCPDUMP_PID"
        
        # مراقبة التقدم
        echo ""
        echo "📊 Live Capture Progress"
        
        for ((i=1; i<=DURATION; i++)); do
            sleep 1
            
            if ((i % 10 == 0)); then
                ELAPSED=$i
                REMAINING=$((DURATION - i))
                echo "⏱️  Elapsed: ${ELAPSED}s | Remaining: ${REMAINING}s"
                
                # التحقق من حجم الملف
                if [ -f "$CAPTURE_FILE" ]; then
                    FILE_SIZE=$(stat -f%z "$CAPTURE_FILE" 2>/dev/null || stat -c%s "$CAPTURE_FILE" 2>/dev/null || echo "0")
                    FILE_SIZE_MB=$((FILE_SIZE / 1024 / 1024))
                    echo "📈 Capture file size: ${FILE_SIZE_MB} MB"
                fi
            fi
            
            echo -n "."
        done
        
        echo ""
        echo ""
        echo "🛑 Stopping packet capture..."
        
        # انتظار انتهاء العملية
        wait "$TCPDUMP_PID" 2>/dev/null
        TCPDUMP_PID=""
        
        echo "✅ Packet capture completed"
        log_message "Packet capture completed"
        
    else
        echo "❌ Failed to start packet capture"
        return 1
    fi
}

# تشغيل عملية الالتقاط
if try_capture; then
    CAPTURE_SUCCESS=true
else
    CAPTURE_SUCCESS=false
fi

# تحليل النتائج
echo ""
echo "🔍 Analyzing captured data..."

CAPTURE_SIZE=0
PACKETS_COUNT=0

if [ -f "$CAPTURE_FILE" ]; then
    CAPTURE_SIZE=$(stat -f%z "$CAPTURE_FILE" 2>/dev/null || stat -c%s "$CAPTURE_FILE" 2>/dev/null || echo "0")
    CAPTURE_SIZE_MB=$((CAPTURE_SIZE / 1024 / 1024))
    echo "📄 Capture file size: ${CAPTURE_SIZE_MB} MB"
    
    # محاولة عد الحزم إذا كان tcpdump متوفراً
    if [ "$LIMITED_MODE" = false ] && command -v tcpdump >/dev/null 2>&1 && [ "$CAPTURE_SIZE" -gt 0 ]; then
        PACKETS_COUNT=$(tcpdump -r "$CAPTURE_FILE" 2>/dev/null | wc -l || echo "0")
        echo "📊 Packets captured: $PACKETS_COUNT"
    fi
fi

# تحليل نشاط الشبكة
echo ""
echo "🔍 Network Activity Analysis"

# فحص الاتصالات النشطة
if command -v netstat >/dev/null 2>&1; then
    ACTIVE_CONNECTIONS=$(netstat -tn 2>/dev/null | grep ESTABLISHED | wc -l)
    EXTERNAL_CONNECTIONS=$(netstat -tn 2>/dev/null | grep ESTABLISHED | grep -v "127\|192.168\|10\." | wc -l)
    echo "📊 Active TCP Connections: $ACTIVE_CONNECTIONS"
    echo "🌐 External Connections: $EXTERNAL_CONNECTIONS"
elif command -v ss >/dev/null 2>&1; then
    ACTIVE_CONNECTIONS=$(ss -tn state established 2>/dev/null | wc -l)
    EXTERNAL_CONNECTIONS=$(ss -tn state established 2>/dev/null | grep -v "127\|192.168\|10\." | wc -l)
    echo "📊 Active TCP Connections: $ACTIVE_CONNECTIONS"
    echo "🌐 External Connections: $EXTERNAL_CONNECTIONS"
else
    ACTIVE_CONNECTIONS=0
    EXTERNAL_CONNECTIONS=0
    echo "⚠️  Network analysis tools not available"
fi

# كشف الأنشطة المشبوهة
SUSPICIOUS_ACTIVITY=()

if [ "$EXTERNAL_CONNECTIONS" -gt 20 ]; then
    SUSPICIOUS_ACTIVITY+=("High number of external connections detected")
fi

# فحص المنافذ عالية المخاطر
HIGH_RISK_PORTS=(4444 4445 1337 31337 12345 54321)
if command -v netstat >/dev/null 2>&1; then
    for port in "${HIGH_RISK_PORTS[@]}"; do
        if netstat -ln 2>/dev/null | grep ":$port " >/dev/null; then
            SUSPICIOUS_ACTIVITY+=("High-risk port $port is listening")
        fi
    done
fi

if [ ${#SUSPICIOUS_ACTIVITY[@]} -gt 0 ]; then
    echo ""
    echo "⚠️  Suspicious Activity Detected:"
    for activity in "${SUSPICIOUS_ACTIVITY[@]}"; do
        echo "  - $activity"
    done
fi

# إنشاء التقرير النهائي
END_TIME=$(date +%s)
DURATION_ACTUAL=$((END_TIME - START_TIME))

# إنشاء التقرير JSON
cat << EOF > "$REPORT_FILE"
{
  "interface": "$INTERFACE",
  "startTime": "$TIMESTAMP",
  "endTime": "$(date '+%Y-%m-%d %H:%M:%S')",
  "duration": $DURATION_ACTUAL,
  "status": "$([ "$CAPTURE_SUCCESS" = true ] && echo "COMPLETED" || echo "FAILED")",
  "limitedMode": $LIMITED_MODE,
  "files": {
    "capture": "$CAPTURE_FILE",
    "log": "$LOG_FILE"
  },
  "statistics": {
    "packetsProcessed": $PACKETS_COUNT,
    "captureSize": $CAPTURE_SIZE,
    "activeTCPConnections": $ACTIVE_CONNECTIONS,
    "externalConnections": $EXTERNAL_CONNECTIONS
  },
  "suspiciousActivity": [$(printf '"%s",' "${SUSPICIOUS_ACTIVITY[@]}" | sed 's/,$//')],"
  "risk": "$([ ${#SUSPICIOUS_ACTIVITY[@]} -gt 0 ] && echo "HIGH" || echo "LOW")"
}
EOF

echo ""
echo "✅ PacketInterceptor completed!"
echo "📊 Capture Duration: $DURATION_ACTUAL seconds"
echo "📄 Report saved to: $REPORT_FILE"
if [ -f "$CAPTURE_FILE" ]; then
    echo "📡 Capture file: $CAPTURE_FILE"
fi

log_message "PacketInterceptor completed successfully"

# إرجاع النتيجة للـ API
cat "$REPORT_FILE"
