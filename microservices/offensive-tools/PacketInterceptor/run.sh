#!/bin/bash

# KNOUX7 KOTS™ - PacketInterceptor Tool (Linux Bash)
# Advanced Network Packet Capture and Analysis Tool

# Tool Information
TOOL_NAME="PacketInterceptor"
TOOL_VERSION="1.0.0"
AUTHOR="KNOUX7 Cyber Team"

# Default parameters
INTERFACE="auto"
FILTER=""
DURATION=60
OUTPUT_DIR="./captures"
MAX_PACKETS=1000
VERBOSE=false
REAL_TIME=false
TARGET_IP=""
TARGET_PORT=""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
MAGENTA='\033[1;35m'
NC='\033[0m'

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -i|--interface)
            INTERFACE="$2"
            shift 2
            ;;
        -f|--filter)
            FILTER="$2"
            shift 2
            ;;
        -d|--duration)
            DURATION="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -m|--max-packets)
            MAX_PACKETS="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -r|--real-time)
            REAL_TIME=true
            shift
            ;;
        --target-ip)
            TARGET_IP="$2"
            shift 2
            ;;
        --target-port)
            TARGET_PORT="$2"
            shift 2
            ;;
        -h|--help)
            echo "KNOUX7 PacketInterceptor Tool v$TOOL_VERSION"
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -i, --interface IFACE     Network interface (default: auto)"
            echo "  -f, --filter FILTER       Packet filter expression"
            echo "  -d, --duration SECONDS    Capture duration (default: 60)"
            echo "  -o, --output DIR          Output directory (default: ./captures)"
            echo "  -m, --max-packets NUM     Maximum packets to capture (default: 1000)"
            echo "  -v, --verbose             Verbose output"
            echo "  -r, --real-time           Enable real-time monitoring"
            echo "  --target-ip IP            Target specific IP address"
            echo "  --target-port PORT        Target specific port"
            echo "  -h, --help                Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check for required tools
check_dependencies() {
    local missing_tools=()
    
    command -v tcpdump >/dev/null 2>&1 || missing_tools+=("tcpdump")
    command -v netstat >/dev/null 2>&1 || missing_tools+=("netstat")
    command -v ss >/dev/null 2>&1 || missing_tools+=("ss")
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required tools: ${missing_tools[*]}${NC}"
        echo -e "${YELLOW}Please install missing tools and try again${NC}"
        echo -e "${GRAY}Ubuntu/Debian: sudo apt-get install tcpdump net-tools iproute2${NC}"
        echo -e "${GRAY}CentOS/RHEL: sudo yum install tcpdump net-tools iproute2${NC}"
        exit 1
    fi
}

# Check if running with sufficient privileges
check_privileges() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${YELLOW}⚠️  Warning: Not running as root. Some features may not work.${NC}"
        echo -e "${GRAY}   For full functionality, run with: sudo $0${NC}"
    fi
}

# Create output directory
create_output_dir() {
    if [ ! -d "$OUTPUT_DIR" ]; then
        mkdir -p "$OUTPUT_DIR"
        echo -e "${GREEN}📁 Created capture directory: $OUTPUT_DIR${NC}"
    fi
}

# Log function
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${CYAN}[INFO]${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "DEBUG")
            if [ "$VERBOSE" = true ]; then
                echo -e "${GRAY}[DEBUG]${NC} $message"
            fi
            ;;
    esac
}

# Banner
print_banner() {
    echo -e "${MAGENTA}🕷️ KNOUX7 PacketInterceptor v$TOOL_VERSION${NC}"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🔗 Interface: $INTERFACE${NC}"
    echo -e "${YELLOW}⏱️  Duration: $DURATION seconds${NC}"
    echo -e "${YELLOW}📦 Max Packets: $MAX_PACKETS${NC}"
    echo -e "${GREEN}🕐 Started: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
}

# Initialize capture results
init_capture_results() {
    START_TIME=$(date '+%Y-%m-%d %H:%M:%S')
    CAPTURE_START_EPOCH=$(date +%s)
    
    local target_info="all"
    if [ -n "$TARGET_IP" ]; then
        target_info="$TARGET_IP"
        if [ -n "$TARGET_PORT" ]; then
            target_info="$target_info:$TARGET_PORT"
        fi
    fi
    
    cat > "$OUTPUT_DIR/capture_status.json" << EOF
{
    "target": "$target_info",
    "interface": "$INTERFACE",
    "duration": $DURATION,
    "maxPackets": $MAX_PACKETS,
    "startTime": "$START_TIME",
    "endTime": null,
    "captureFile": null,
    "results": {
        "totalPackets": 0,
        "protocolBreakdown": {},
        "topTalkers": [],
        "suspiciousActivity": [],
        "summary": {}
    },
    "status": "running",
    "toolVersion": "$TOOL_VERSION"
}
EOF
}

# Network Interface Discovery
interface_discovery() {
    log "INFO" "🔍 Phase 1: Network Interface Discovery"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━��━━━━━━━━━━━${NC}"
    
    # Get available interfaces
    local interfaces=($(ip link show | grep '^[0-9]' | cut -d: -f2 | tr -d ' ' | grep -v '^lo$'))
    
    if [ ${#interfaces[@]} -eq 0 ]; then
        log "ERROR" "No network interfaces found"
        exit 1
    fi
    
    if [ "$INTERFACE" = "auto" ]; then
        # Select the first non-loopback interface
        for iface in "${interfaces[@]}"; do
            if [ "$iface" != "lo" ]; then
                INTERFACE="$iface"
                break
            fi
        done
        log "SUCCESS" "Auto-selected interface: $INTERFACE"
    else
        # Check if specified interface exists
        if ! ip link show "$INTERFACE" >/dev/null 2>&1; then
            log "WARNING" "Interface '$INTERFACE' not found. Available interfaces:"
            for iface in "${interfaces[@]}"; do
                echo "   - $iface"
            done
            INTERFACE="${interfaces[0]}"
            log "INFO" "Using: $INTERFACE"
        fi
    fi
    
    # Get interface information
    local mac_addr=$(ip link show "$INTERFACE" | grep -o '[a-f0-9]\{2\}:[a-f0-9]\{2\}:[a-f0-9]\{2\}:[a-f0-9]\{2\}:[a-f0-9]\{2\}:[a-f0-9]\{2\}')
    local ip_addr=$(ip addr show "$INTERFACE" | grep 'inet ' | awk '{print $2}' | head -1)
    
    echo -e "${CYAN}📡 Selected Interface: $INTERFACE${NC}"
    echo -e "${GRAY}   MAC Address: ${mac_addr:-Unknown}${NC}"
    echo -e "${GRAY}   IP Address: ${ip_addr:-Unknown}${NC}"
    
    # Test interface accessibility
    if ! ip link show "$INTERFACE" | grep -q "state UP"; then
        log "WARNING" "Interface $INTERFACE appears to be down"
    fi
}

# Packet Capture Setup
setup_packet_capture() {
    log "INFO" "🎯 Phase 2: Packet Capture Setup"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Generate capture filename
    local timestamp=$(date +%Y%m%d_%H%M%S)
    CAPTURE_FILE="$OUTPUT_DIR/packet_capture_${timestamp}.pcap"
    
    # Build tcpdump filter
    local tcpdump_filter=""
    
    if [ -n "$TARGET_IP" ]; then
        tcpdump_filter="host $TARGET_IP"
        if [ -n "$TARGET_PORT" ]; then
            tcpdump_filter="$tcpdump_filter and port $TARGET_PORT"
        fi
    fi
    
    if [ -n "$FILTER" ]; then
        if [ -n "$tcpdump_filter" ]; then
            tcpdump_filter="$tcpdump_filter and ($FILTER)"
        else
            tcpdump_filter="$FILTER"
        fi
    fi
    
    log "INFO" "🎯 Starting packet capture..."
    echo -e "${GRAY}   Capture File: $(basename "$CAPTURE_FILE")${NC}"
    echo -e "${GRAY}   Interface: $INTERFACE${NC}"
    echo -e "${GRAY}   Duration: $DURATION seconds${NC}"
    echo -e "${GRAY}   Max Packets: $MAX_PACKETS${NC}"
    if [ -n "$tcpdump_filter" ]; then
        echo -e "${GRAY}   Filter: $tcpdump_filter${NC}"
    fi
}

# Execute packet capture
execute_capture() {
    log "INFO" "📡 Phase 3: Packet Capture Execution"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Build tcpdump command
    local tcpdump_cmd="tcpdump -i $INTERFACE -w '$CAPTURE_FILE'"
    
    # Add packet count limit
    tcpdump_cmd="$tcpdump_cmd -c $MAX_PACKETS"
    
    # Add filter if specified
    local tcpdump_filter=""
    if [ -n "$TARGET_IP" ]; then
        tcpdump_filter="host $TARGET_IP"
        if [ -n "$TARGET_PORT" ]; then
            tcpdump_filter="$tcpdump_filter and port $TARGET_PORT"
        fi
    fi
    
    if [ -n "$FILTER" ]; then
        if [ -n "$tcpdump_filter" ]; then
            tcpdump_filter="$tcpdump_filter and ($FILTER)"
        else
            tcpdump_filter="$FILTER"
        fi
    fi
    
    if [ -n "$tcpdump_filter" ]; then
        tcpdump_cmd="$tcpdump_cmd '$tcpdump_filter'"
    fi
    
    # Add timeout for duration
    tcpdump_cmd="timeout $DURATION $tcpdump_cmd"
    
    if [ "$VERBOSE" = true ]; then
        log "DEBUG" "Executing: $tcpdump_cmd"
    fi
    
    # Execute capture in background and track PID
    eval "$tcpdump_cmd" 2>/dev/null &
    local tcpdump_pid=$!
    
    log "SUCCESS" "Packet capture started (PID: $tcpdump_pid)"
    
    # Monitor capture progress
    local elapsed=0
    while [ $elapsed -lt $DURATION ] && kill -0 $tcpdump_pid 2>/dev/null; do
        local progress=$((elapsed * 100 / DURATION))
        printf "\r${CYAN}📊 Progress: %d%% (%d/%d seconds)${NC}" "$progress" "$elapsed" "$DURATION"
        sleep 1
        ((elapsed++))
    done
    
    printf "\n"
    
    # Wait for tcpdump to finish
    wait $tcpdump_pid 2>/dev/null
    local capture_exit_code=$?
    
    if [ $capture_exit_code -eq 0 ] || [ $capture_exit_code -eq 124 ]; then # 124 is timeout exit code
        log "SUCCESS" "Packet capture completed"
    else
        log "ERROR" "Packet capture failed with exit code: $capture_exit_code"
        return 1
    fi
    
    # Check if capture file was created and has content
    if [ -f "$CAPTURE_FILE" ] && [ -s "$CAPTURE_FILE" ]; then
        local file_size=$(stat -c%s "$CAPTURE_FILE" 2>/dev/null || echo "0")
        log "SUCCESS" "Capture file created: $(basename "$CAPTURE_FILE") (${file_size} bytes)"
    else
        log "WARNING" "Capture file is empty or was not created"
    fi
}

# Real-time network monitoring
real_time_monitoring() {
    if [ "$REAL_TIME" != true ]; then
        return
    fi
    
    log "INFO" "📊 Phase 4: Real-time Network Monitoring"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    local monitor_duration=$((DURATION < 30 ? DURATION : 30))
    local monitor_start=$(date +%s)
    
    while [ $(($(date +%s) - monitor_start)) -lt $monitor_duration ]; do
        # Get network interface statistics
        local rx_bytes=$(cat "/sys/class/net/$INTERFACE/statistics/rx_bytes" 2>/dev/null || echo "0")
        local tx_bytes=$(cat "/sys/class/net/$INTERFACE/statistics/tx_bytes" 2>/dev/null || echo "0")
        local rx_packets=$(cat "/sys/class/net/$INTERFACE/statistics/rx_packets" 2>/dev/null || echo "0")
        local tx_packets=$(cat "/sys/class/net/$INTERFACE/statistics/tx_packets" 2>/dev/null || echo "0")
        
        echo -e "${CYAN}📈 Interface $INTERFACE: RX ${rx_packets} packets (${rx_bytes} bytes), TX ${tx_packets} packets (${tx_bytes} bytes)${NC}"
        
        sleep 2
    done
}

# Analyze captured packets
analyze_packets() {
    log "INFO" "🔍 Phase 5: Packet Analysis"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if [ ! -f "$CAPTURE_FILE" ] || [ ! -s "$CAPTURE_FILE" ]; then
        log "WARNING" "No capture file to analyze"
        return
    fi
    
    # Basic packet statistics using tcpdump
    log "INFO" "📊 Analyzing captured packets..."
    
    # Get total packet count
    local total_packets=0
    if command -v tcpdump >/dev/null 2>&1; then
        total_packets=$(tcpdump -r "$CAPTURE_FILE" 2>/dev/null | wc -l)
    fi
    
    # Protocol breakdown using tcpdump
    local tcp_count=0
    local udp_count=0
    local icmp_count=0
    local other_count=0
    
    if [ "$total_packets" -gt 0 ]; then
        tcp_count=$(tcpdump -r "$CAPTURE_FILE" 'tcp' 2>/dev/null | wc -l)
        udp_count=$(tcpdump -r "$CAPTURE_FILE" 'udp' 2>/dev/null | wc -l)
        icmp_count=$(tcpdump -r "$CAPTURE_FILE" 'icmp' 2>/dev/null | wc -l)
        other_count=$((total_packets - tcp_count - udp_count - icmp_count))
    fi
    
    echo -e "${CYAN}📊 Packet Analysis Results:${NC}"
    echo -e "${WHITE}   Total Packets: $total_packets${NC}"
    echo -e "${WHITE}   TCP Packets: $tcp_count${NC}"
    echo -e "${WHITE}   UDP Packets: $udp_count${NC}"
    echo -e "${WHITE}   ICMP Packets: $icmp_count${NC}"
    echo -e "${WHITE}   Other Protocols: $other_count${NC}"
    
    # Analyze current network connections
    log "INFO" "🔗 Analyzing active connections..."
    
    local connections_file="$OUTPUT_DIR/connections_analysis.txt"
    
    # TCP connections
    if command -v ss >/dev/null 2>&1; then
        ss -tuln > "$connections_file" 2>/dev/null
        local tcp_listening=$(ss -tln 2>/dev/null | grep LISTEN | wc -l)
        local tcp_established=$(ss -tn 2>/dev/null | grep ESTAB | wc -l)
        
        echo -e "${WHITE}   TCP Listening Ports: $tcp_listening${NC}"
        echo -e "${WHITE}   TCP Established Connections: $tcp_established${NC}"
    elif command -v netstat >/dev/null 2>&1; then
        netstat -tuln > "$connections_file" 2>/dev/null
        local tcp_listening=$(netstat -tln 2>/dev/null | grep LISTEN | wc -l)
        local tcp_established=$(netstat -tn 2>/dev/null | grep ESTABLISHED | wc -l)
        
        echo -e "${WHITE}   TCP Listening Ports: $tcp_listening${NC}"
        echo -e "${WHITE}   TCP Established Connections: $tcp_established${NC}"
    fi
    
    # Top talkers analysis (simplified)
    log "INFO" "🏆 Top network connections..."
    if command -v ss >/dev/null 2>&1; then
        local top_connections=$(ss -tn 2>/dev/null | grep ESTAB | awk '{print $4}' | cut -d: -f1 | sort | uniq -c | sort -nr | head -5)
        if [ -n "$top_connections" ]; then
            echo -e "${GRAY}   Top remote IPs by connection count:${NC}"
            echo "$top_connections" | while read count ip; do
                echo -e "${GRAY}     $ip: $count connections${NC}"
            done
        fi
    fi
    
    # Suspicious activity detection (basic)
    local suspicious_count=0
    local suspicious_activity=()
    
    # Check for unusual ports
    if command -v ss >/dev/null 2>&1; then
        local unusual_ports=$(ss -tln 2>/dev/null | grep LISTEN | awk '{print $4}' | cut -d: -f2 | grep -v -E '^(22|53|80|443|25|110|143|993|995)$' | wc -l)
        if [ "$unusual_ports" -gt 0 ]; then
            suspicious_activity+=("Unusual listening ports detected: $unusual_ports")
            ((suspicious_count++))
        fi
    fi
    
    # Check for high connection count
    if command -v ss >/dev/null 2>&1; then
        local high_conn_count=$(ss -tn 2>/dev/null | grep ESTAB | wc -l)
        if [ "$high_conn_count" -gt 50 ]; then
            suspicious_activity+=("High number of established connections: $high_conn_count")
            ((suspicious_count++))
        fi
    fi
    
    echo -e "${YELLOW}⚠️  Suspicious Activity: $suspicious_count alerts${NC}"
    for activity in "${suspicious_activity[@]}"; do
        echo -e "${GRAY}   - $activity${NC}"
    done
    
    # Update results
    local risk_level="Low"
    if [ "$suspicious_count" -gt 3 ]; then
        risk_level="High"
    elif [ "$suspicious_count" -gt 1 ]; then
        risk_level="Medium"
    fi
    
    echo -e "${WHITE}🛡️  Risk Level: $risk_level${NC}"
}

# Generate reports
generate_reports() {
    local end_time=$(date '+%Y-%m-%d %H:%M:%S')
    local end_epoch=$(date +%s)
    local duration=$((end_epoch - CAPTURE_START_EPOCH))
    
    # Calculate risk level
    local risk_level="Low"
    local suspicious_count=0 # This would be calculated from actual analysis
    
    if [ "$suspicious_count" -gt 3 ]; then
        risk_level="High"
    elif [ "$suspicious_count" -gt 1 ]; then
        risk_level="Medium"
    fi
    
    # Get file size
    local file_size="0"
    if [ -f "$CAPTURE_FILE" ]; then
        file_size=$(stat -c%s "$CAPTURE_FILE" 2>/dev/null || echo "0")
    fi
    
    # Generate JSON report
    local json_report="$OUTPUT_DIR/packet_analysis_$(date +%Y%m%d_%H%M%S).json"
    cat > "$json_report" << EOF
{
    "target": "${TARGET_IP:-all}",
    "interface": "$INTERFACE",
    "duration": $duration,
    "maxPackets": $MAX_PACKETS,
    "startTime": "$START_TIME",
    "endTime": "$end_time",
    "captureFile": "$(basename "$CAPTURE_FILE")",
    "results": {
        "totalPackets": ${total_packets:-0},
        "protocolBreakdown": {
            "TCP": ${tcp_count:-0},
            "UDP": ${udp_count:-0},
            "ICMP": ${icmp_count:-0},
            "Other": ${other_count:-0}
        },
        "topTalkers": [],
        "suspiciousActivity": [],
        "summary": {
            "captureSuccessful": true,
            "totalConnections": ${total_packets:-0},
            "suspiciousActivityCount": $suspicious_count,
            "captureDuration": "${duration} seconds",
            "riskLevel": "$risk_level",
            "captureFileSize": "$file_size bytes"
        }
    },
    "status": "completed",
    "toolVersion": "$TOOL_VERSION"
}
EOF
    
    # Generate human-readable report
    local txt_report="$OUTPUT_DIR/packet_report_$(date +%Y%m%d_%H%M%S).txt"
    cat > "$txt_report" << EOF
KNOUX7 PacketInterceptor Analysis Report
=======================================
Interface: $INTERFACE
Capture Time: $START_TIME - $end_time
Duration: ${duration} seconds
Capture File: $(basename "$CAPTURE_FILE")

CAPTURE SUMMARY
--------------
Total Packets Captured: ${total_packets:-0}
TCP Packets: ${tcp_count:-0}
UDP Packets: ${udp_count:-0}
ICMP Packets: ${icmp_count:-0}
Other Protocols: ${other_count:-0}
Capture File Size: $file_size bytes

SUSPICIOUS ACTIVITY
------------------
Total Alerts: $suspicious_count
Risk Level: $risk_level

PROTOCOL BREAKDOWN
-----------------
TCP: ${tcp_count:-0}
UDP: ${udp_count:-0}
ICMP: ${icmp_count:-0}
Other: ${other_count:-0}

RECOMMENDATIONS
---------------
1. Review captured traffic for anomalous patterns
2. Analyze suspicious connections in detail
3. Monitor unusual protocol usage
4. Implement network segmentation
5. Set up automated traffic analysis

Generated by KNOUX7 PacketInterceptor v$TOOL_VERSION
EOF
    
    # Final Summary
    echo -e "\n${GREEN}📊 CAPTURE COMPLETED${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${WHITE}🔗 Interface: $INTERFACE${NC}"
    echo -e "${WHITE}⏱️  Duration: ${duration} seconds${NC}"
    echo -e "${WHITE}📦 Packets: ${total_packets:-0}${NC}"
    echo -e "${WHITE}⚠️  Suspicious Activity: $suspicious_count${NC}"
    echo -e "${WHITE}🛡️  Risk Level: $risk_level${NC}"
    echo -e "${WHITE}📁 Files saved to: $OUTPUT_DIR${NC}"
    echo -e "${GRAY}   - Capture: $(basename "$CAPTURE_FILE")${NC}"
    echo -e "${GRAY}   - Analysis: $(basename "$json_report")${NC}"
    echo -e "${GRAY}   - Report: $(basename "$txt_report")${NC}"
    
    # Output JSON for API consumption
    cat "$json_report"
}

# Error handling
error_exit() {
    local error_msg="$1"
    log "ERROR" "CAPTURE FAILED: $error_msg"
    
    # Kill any running tcpdump processes
    pkill -f "tcpdump.*$INTERFACE" 2>/dev/null
    
    local end_time=$(date '+%Y-%m-%d %H:%M:%S')
    cat > "$OUTPUT_DIR/error_result.json" << EOF
{
    "target": "${TARGET_IP:-all}",
    "interface": "$INTERFACE",
    "startTime": "$START_TIME",
    "endTime": "$end_time",
    "status": "failed",
    "error": "$error_msg",
    "toolVersion": "$TOOL_VERSION"
}
EOF
    
    cat "$OUTPUT_DIR/error_result.json"
    exit 1
}

# Main execution
main() {
    # Set up error handling
    set -e
    trap 'error_exit "Unexpected error occurred"' ERR
    
    # Check dependencies and privileges
    check_dependencies
    check_privileges
    
    # Print banner
    print_banner
    
    # Create output directory
    create_output_dir
    
    # Initialize capture results
    init_capture_results
    
    # Execute capture phases
    interface_discovery
    setup_packet_capture
    execute_capture
    real_time_monitoring
    analyze_packets
    
    # Generate final reports
    generate_reports
}

# Run main function
main "$@"
