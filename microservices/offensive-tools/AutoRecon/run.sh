#!/bin/bash

# AutoRecon - Advanced Vulnerability Scanner
# Linux Bash Implementation  
# KNOX Sentinel™ Offensive Operations Module

TARGET="${1:-}"
OUTPUT_DIR="${2:-results/offensive/AutoRecon}"
SCAN_TYPE="${3:-full}"
TIMEOUT="${4:-300}"

echo "🎯 AutoRecon - Advanced Vulnerability Scanner"
echo "================================================"

# التحقق من الهدف
if [ -z "$TARGET" ]; then
    if [ -f "target.txt" ]; then
        TARGET=$(head -n1 target.txt)
        echo "📋 Target loaded from target.txt: $TARGET"
    else
        echo "❌ ERROR: No target specified. Use: ./run.sh <target> or create target.txt"
        exit 1
    fi
fi

# إنشاء مجلد النتائج
mkdir -p "$OUTPUT_DIR"

TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
LOG_FILE="$OUTPUT_DIR/autorecon_$TIMESTAMP.log"
REPORT_FILE="$OUTPUT_DIR/autorecon_report_$TIMESTAMP.json"

echo "🔍 Starting reconnaissance on target: $TARGET"
echo "📁 Output directory: $OUTPUT_DIR"

# بدء اللوج
echo "[$TIMESTAMP] AutoRecon started on target: $TARGET" >> "$LOG_FILE"

START_TIME=$(date +%s)

# دالة لإضافة اللوج
log_message() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" >> "$LOG_FILE"
}

# المرحلة 1: فحص المنافذ الأساسي
echo ""
echo "🔍 Phase 1: Port Discovery"
PORT_SCAN_FILE="$OUTPUT_DIR/ports_$TIMESTAMP.txt"

if command -v nmap >/dev/null 2>&1; then
    echo "🚀 Running nmap port scan..."
    nmap -A -T4 -p- "$TARGET" > "$PORT_SCAN_FILE" 2>&1
    log_message "Nmap scan completed"
elif command -v nc >/dev/null 2>&1; then
    echo "⚡ Running netcat port scan..."
    COMMON_PORTS=(21 22 23 25 53 80 110 111 135 139 143 443 993 995 1723 3306 3389 5432 5900 8080)
    echo "Port scan results for $TARGET:" > "$PORT_SCAN_FILE"
    
    for port in "${COMMON_PORTS[@]}"; do
        if timeout 2 nc -z "$TARGET" "$port" 2>/dev/null; then
            echo "✅ Port $port is OPEN"
            echo "Port $port - OPEN" >> "$PORT_SCAN_FILE"
        fi
    done
else
    echo "⚠️  No port scanning tools available (nmap/nc)"
    echo "Port scanning skipped - no tools available" > "$PORT_SCAN_FILE"
fi

# المرحلة 2: فحص الخدمات
echo ""
echo "🔍 Phase 2: Service Enumeration"
SERVICE_FILE="$OUTPUT_DIR/services_$TIMESTAMP.txt"

# فحص HTTP/HTTPS
WEB_PORTS=(80 443 8080 8443)
for port in "${WEB_PORTS[@]}"; do
    if timeout 5 nc -z "$TARGET" "$port" 2>/dev/null; then
        if [ "$port" -eq 443 ] || [ "$port" -eq 8443 ]; then
            PROTOCOL="https"
        else
            PROTOCOL="http"
        fi
        
        if command -v curl >/dev/null 2>&1; then
            RESPONSE=$(timeout 10 curl -s -I "$PROTOCOL://$TARGET:$port" 2>/dev/null | head -n1)
            if [ -n "$RESPONSE" ]; then
                echo "🌐 Port $port - HTTP Service detected: $RESPONSE"
                echo "Port $port - HTTP Service: $RESPONSE" >> "$SERVICE_FILE"
            fi
        else
            echo "🌐 Port $port - HTTP Service detected (curl not available)"
            echo "Port $port - HTTP Service detected" >> "$SERVICE_FILE"
        fi
    fi
done

# فحص SSH
if timeout 5 nc -z "$TARGET" 22 2>/dev/null; then
    if command -v ssh >/dev/null 2>&1; then
        SSH_BANNER=$(timeout 5 ssh -o ConnectTimeout=5 -o BatchMode=yes "$TARGET" 2>&1 | head -n1)
        echo "🔒 SSH Service detected: $SSH_BANNER"
        echo "Port 22 - SSH Service: $SSH_BANNER" >> "$SERVICE_FILE"
    fi
fi

# المرحلة 3: فحص نظام التشغيل
echo ""
echo "🔍 Phase 3: OS Detection"
OS_FILE="$OUTPUT_DIR/os_detection_$TIMESTAMP.txt"

if command -v nmap >/dev/null 2>&1; then
    nmap -O "$TARGET" > "$OS_FILE" 2>&1
else
    # فحص بديل باستخدام ping وTTL
    if command -v ping >/dev/null 2>&1; then
        PING_RESULT=$(ping -c 2 "$TARGET" 2>/dev/null | grep "ttl")
        if [ -n "$PING_RESULT" ]; then
            TTL=$(echo "$PING_RESULT" | grep -oE 'ttl=[0-9]+' | head -n1 | cut -d'=' -f2)
            if [ -n "$TTL" ]; then
                if [ "$TTL" -le 64 ]; then
                    OS_GUESS="Linux/Unix"
                elif [ "$TTL" -le 128 ]; then
                    OS_GUESS="Windows"
                else
                    OS_GUESS="Unknown"
                fi
                echo "💻 OS Detection: $OS_GUESS (TTL: $TTL)"
                echo "OS Detection (TTL-based): $OS_GUESS (TTL: $TTL)" > "$OS_FILE"
            fi
        fi
    fi
fi

# المرحلة 4: فحص الثغرات
echo ""
echo "🔍 Phase 4: Vulnerability Assessment"
VULN_FILE="$OUTPUT_DIR/vulnerabilities_$TIMESTAMP.txt"

# فحص الثغرات الشائعة
echo "Vulnerability Assessment for $TARGET:" > "$VULN_FILE"

# فحص EternalBlue (SMB)
if timeout 5 nc -z "$TARGET" 445 2>/dev/null; then
    echo "⚠️  POTENTIAL VULNERABILITY: SMB service detected (EternalBlue risk) on port 445"
    echo "POTENTIAL VULNERABILITY: SMB EternalBlue vulnerability on port 445" >> "$VULN_FILE"
fi

# فحص SSH ضعيف
if timeout 5 nc -z "$TARGET" 22 2>/dev/null; then
    echo "⚠️  POTENTIAL VULNERABILITY: SSH service detected on port 22"
    echo "POTENTIAL VULNERABILITY: SSH weak configuration on port 22" >> "$VULN_FILE"
fi

# فحص HTTP عادي
if timeout 5 nc -z "$TARGET" 80 2>/dev/null; then
    echo "⚠️  POTENTIAL VULNERABILITY: Unencrypted HTTP service on port 80"
    echo "POTENTIAL VULNERABILITY: Unencrypted HTTP service on port 80" >> "$VULN_FILE"
fi

# فحص خدمات قديمة
OLD_SERVICES=(21 23 25 53 110 135 139 143)
for port in "${OLD_SERVICES[@]}"; do
    if timeout 5 nc -z "$TARGET" "$port" 2>/dev/null; then
        echo "⚠️  POTENTIAL VULNERABILITY: Legacy service detected on port $port"
        echo "POTENTIAL VULNERABILITY: Legacy service on port $port" >> "$VULN_FILE"
    fi
done

# إنشاء التقرير النهائي
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# حساب الإحصائيات
PORTS_FOUND=0
SERVICES_FOUND=0
VULNERABILITIES=0

if [ -f "$PORT_SCAN_FILE" ]; then
    PORTS_FOUND=$(grep -c "OPEN" "$PORT_SCAN_FILE" 2>/dev/null || echo "0")
fi

if [ -f "$SERVICE_FILE" ]; then
    SERVICES_FOUND=$(wc -l < "$SERVICE_FILE" 2>/dev/null || echo "0")
fi

if [ -f "$VULN_FILE" ]; then
    VULNERABILITIES=$(grep -c "VULNERABILITY" "$VULN_FILE" 2>/dev/null || echo "0")
fi

# إنشاء التقرير JSON
cat << EOF > "$REPORT_FILE"
{
  "target": "$TARGET",
  "scanType": "$SCAN_TYPE",
  "startTime": "$TIMESTAMP",
  "endTime": "$(date '+%Y-%m-%d %H:%M:%S')",
  "duration": $DURATION,
  "status": "COMPLETED",
  "files": {
    "ports": "$PORT_SCAN_FILE",
    "services": "$SERVICE_FILE",
    "osDetection": "$OS_FILE",
    "vulnerabilities": "$VULN_FILE",
    "log": "$LOG_FILE"
  },
  "summary": {
    "portsScanned": $PORTS_FOUND,
    "servicesFound": $SERVICES_FOUND,
    "vulnerabilities": $VULNERABILITIES
  },
  "risk": "MEDIUM"
}
EOF

echo ""
echo "✅ AutoRecon scan completed successfully!"
echo "📊 Scan Duration: $DURATION seconds"
echo "📄 Report saved to: $REPORT_FILE"

log_message "AutoRecon completed successfully"

# إرجاع النتيجة للـ API
cat "$REPORT_FILE"
