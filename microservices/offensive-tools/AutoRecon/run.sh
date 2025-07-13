#!/bin/bash

# KNOUX7 KOTS™ - AutoRecon Tool (Linux Bash)
# Advanced Vulnerability Scanner and Reconnaissance Tool

# Tool Information
TOOL_NAME="AutoRecon"
TOOL_VERSION="1.0.0"
AUTHOR="KNOUX7 Cyber Team"

# Default parameters
TARGET="127.0.0.1"
OUTPUT_DIR="./scans"
SCAN_TYPE="quick"
VERBOSE=false
NO_PORT_SCAN=false
SERVICE_DETECTION=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--target)
            TARGET="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_DIR="$2"
            shift 2
            ;;
        -s|--scan-type)
            SCAN_TYPE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        --no-port-scan)
            NO_PORT_SCAN=true
            shift
            ;;
        --service-detection)
            SERVICE_DETECTION=true
            shift
            ;;
        -h|--help)
            echo "KNOUX7 AutoRecon Tool v$TOOL_VERSION"
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  -t, --target TARGET       Target IP or hostname (default: 127.0.0.1)"
            echo "  -o, --output DIR          Output directory (default: ./scans)"
            echo "  -s, --scan-type TYPE      Scan type: quick, full, common (default: quick)"
            echo "  -v, --verbose             Verbose output"
            echo "  --no-port-scan            Skip port scanning"
            echo "  --service-detection       Enable service detection"
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
    
    command -v nmap >/dev/null 2>&1 || missing_tools+=("nmap")
    command -v nc >/dev/null 2>&1 || missing_tools+=("netcat")
    command -v dig >/dev/null 2>&1 || missing_tools+=("dig")
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing required tools: ${missing_tools[*]}${NC}"
        echo -e "${YELLOW}Please install missing tools and try again${NC}"
        exit 1
    fi
}

# Create output directory
create_output_dir() {
    if [ ! -d "$OUTPUT_DIR" ]; then
        mkdir -p "$OUTPUT_DIR"
        echo -e "${GREEN}📁 Created output directory: $OUTPUT_DIR${NC}"
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
    echo -e "${CYAN}🔍 KNOUX7 AutoRecon Tool v$TOOL_VERSION${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🎯 Target: $TARGET${NC}"
    echo -e "${YELLOW}📁 Output Directory: $OUTPUT_DIR${NC}"
    echo -e "${YELLOW}⚡ Scan Type: $SCAN_TYPE${NC}"
    echo -e "${GREEN}🕐 Started: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
}

# Initialize scan results
init_scan_results() {
    START_TIME=$(date '+%Y-%m-%d %H:%M:%S')
    SCAN_START_EPOCH=$(date +%s)
    
    cat > "$OUTPUT_DIR/scan_status.json" << EOF
{
    "target": "$TARGET",
    "scanType": "$SCAN_TYPE",
    "startTime": "$START_TIME",
    "endTime": null,
    "duration": null,
    "results": {
        "hostDiscovery": {},
        "portScan": {},
        "serviceDetection": {},
        "vulnerabilities": [],
        "summary": {}
    },
    "status": "running",
    "toolVersion": "$TOOL_VERSION"
}
EOF
}

# Host Discovery
host_discovery() {
    log "INFO" "🔍 Phase 1: Host Discovery"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━��━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Ping test
    if ping -c 4 -W 3 "$TARGET" >/dev/null 2>&1; then
        log "SUCCESS" "Host $TARGET is reachable"
        HOST_STATUS="alive"
        PING_SUCCESSFUL=true
    else
        log "WARNING" "Host $TARGET is not reachable via ICMP"
        HOST_STATUS="unreachable"
        PING_SUCCESSFUL=false
    fi
    
    # DNS resolution
    if command -v dig >/dev/null 2>&1; then
        HOSTNAME=$(dig +short -x "$TARGET" 2>/dev/null | head -1)
        if [ -z "$HOSTNAME" ]; then
            HOSTNAME="unknown"
            log "INFO" "🏷️  Hostname: Unable to resolve"
        else
            log "INFO" "🏷️  Hostname: $HOSTNAME"
        fi
    else
        HOSTNAME="unknown"
        log "DEBUG" "dig not available, skipping hostname resolution"
    fi
    
    # Update results
    cat > "$OUTPUT_DIR/host_discovery.json" << EOF
{
    "status": "$HOST_STATUS",
    "pingSuccessful": $PING_SUCCESSFUL,
    "hostname": "$HOSTNAME",
    "target": "$TARGET"
}
EOF
}

# Port Scanning
port_scanning() {
    if [ "$NO_PORT_SCAN" = true ]; then
        log "INFO" "🚪 Skipping port scan as requested"
        return
    fi
    
    log "INFO" "�� Phase 2: Port Scanning"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Define ports based on scan type
    case $SCAN_TYPE in
        "quick")
            PORTS="21,22,23,25,53,80,110,111,135,139,143,443,993,995,1723,3306,3389,5432,5900,8080"
            ;;
        "full")
            PORTS="1-65535"
            ;;
        "common")
            PORTS="21,22,23,25,53,80,110,111,135,139,143,443,993,995,1723,3306,3389,5432,5900,8080,8443,9000,9001,9999,10000"
            ;;
        *)
            PORTS="21,22,23,25,53,80,110,111,135,139,143,443,993,995,1723,3306,3389,5432,5900,8080"
            ;;
    esac
    
    log "INFO" "🔍 Scanning ports: $PORTS"
    
    # Use nmap for port scanning
    local nmap_output="$OUTPUT_DIR/nmap_scan.txt"
    local nmap_xml="$OUTPUT_DIR/nmap_scan.xml"
    
    if [ "$VERBOSE" = true ]; then
        nmap -sS -O -sV -T4 -p "$PORTS" --open -oN "$nmap_output" -oX "$nmap_xml" "$TARGET"
    else
        nmap -sS -T4 -p "$PORTS" --open -oN "$nmap_output" -oX "$nmap_xml" "$TARGET" 2>/dev/null
    fi
    
    # Parse nmap results
    OPEN_PORTS=$(grep "^[0-9]" "$nmap_output" | grep "open" | wc -l)
    
    # Create JSON output for open ports
    echo '{"openPorts": [' > "$OUTPUT_DIR/port_scan.json"
    local first=true
    while IFS= read -r line; do
        if [[ $line =~ ^([0-9]+)/tcp.*open.*([a-zA-Z0-9-]+) ]]; then
            local port="${BASH_REMATCH[1]}"
            local service="${BASH_REMATCH[2]}"
            
            if [ "$first" = true ]; then
                first=false
            else
                echo ',' >> "$OUTPUT_DIR/port_scan.json"
            fi
            
            echo "    {\"port\": $port, \"protocol\": \"tcp\", \"state\": \"open\", \"service\": \"$service\"}" >> "$OUTPUT_DIR/port_scan.json"
            log "SUCCESS" "Port $port/tcp - OPEN ($service)"
        fi
    done < <(grep "^[0-9]" "$nmap_output" | grep "open")
    
    echo ']}' >> "$OUTPUT_DIR/port_scan.json"
    
    log "INFO" "📊 Port Scan Summary: $OPEN_PORTS open ports found"
}

# Service Detection
service_detection() {
    if [ "$SERVICE_DETECTION" != true ] || [ "$OPEN_PORTS" -eq 0 ]; then
        log "INFO" "🔍 Skipping service detection"
        return
    fi
    
    log "INFO" "🔍 Phase 3: Service Detection"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━���━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Enhanced nmap service detection
    local service_output="$OUTPUT_DIR/service_detection.txt"
    nmap -sV -sC -T4 --script=banner,vuln --open "$TARGET" -oN "$service_output" 2>/dev/null
    
    log "SUCCESS" "Service detection completed"
}

# Vulnerability Assessment
vulnerability_assessment() {
    log "INFO" "🛡️  Phase 4: Basic Vulnerability Assessment"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    local vuln_count=0
    echo '{"vulnerabilities": [' > "$OUTPUT_DIR/vulnerabilities.json"
    
    # Check for common vulnerable services based on open ports
    if [ -f "$OUTPUT_DIR/port_scan.json" ]; then
        local first=true
        while IFS= read -r line; do
            if [[ $line =~ \"port\":[[:space:]]*([0-9]+) ]]; then
                local port="${BASH_REMATCH[1]}"
                local vuln_info=""
                local severity="Medium"
                
                case $port in
                    21)
                        vuln_info="FTP service detected - may be vulnerable to anonymous access or weak authentication"
                        severity="Medium"
                        ;;
                    23)
                        vuln_info="Telnet service detected - uses unencrypted communication"
                        severity="High"
                        ;;
                    135)
                        vuln_info="Windows RPC service - potential target for privilege escalation"
                        severity="Medium"
                        ;;
                    3389)
                        vuln_info="RDP service detected - ensure strong authentication and network restrictions"
                        severity="Medium"
                        ;;
                    *)
                        continue
                        ;;
                esac
                
                if [ -n "$vuln_info" ]; then
                    if [ "$first" = true ]; then
                        first=false
                    else
                        echo ',' >> "$OUTPUT_DIR/vulnerabilities.json"
                    fi
                    
                    cat >> "$OUTPUT_DIR/vulnerabilities.json" << EOF
    {
        "type": "Potentially Vulnerable Service",
        "port": $port,
        "description": "$vuln_info",
                        "severity": "$severity"
    }
EOF
                    ((vuln_count++))
                    log "WARNING" "[$severity] Port $port: $vuln_info"
                fi
            fi
        done < "$OUTPUT_DIR/port_scan.json"
    fi
    
    echo ']}' >> "$OUTPUT_DIR/vulnerabilities.json"
    
    log "INFO" "🔍 Found $vuln_count potential security concerns"
}

# Generate Reports
generate_reports() {
    local end_time=$(date '+%Y-%m-%d %H:%M:%S')
    local end_epoch=$(date +%s)
    local duration=$((end_epoch - SCAN_START_EPOCH))
    
    # Risk level calculation
    local risk_level="Low"
    if [ "$vuln_count" -gt 5 ]; then
        risk_level="High"
    elif [ "$vuln_count" -gt 2 ]; then
        risk_level="Medium"
    fi
    
    # Generate JSON report
    local json_report="$OUTPUT_DIR/autorecon_${TARGET}_$(date +%Y%m%d_%H%M%S).json"
    cat > "$json_report" << EOF
{
    "target": "$TARGET",
    "scanType": "$SCAN_TYPE",
    "startTime": "$START_TIME",
    "endTime": "$end_time",
    "duration": "${duration} seconds",
    "results": {
        "hostDiscovery": $(cat "$OUTPUT_DIR/host_discovery.json" 2>/dev/null || echo '{}'),
        "portScan": $(cat "$OUTPUT_DIR/port_scan.json" 2>/dev/null || echo '{"openPorts": []}'),
        "vulnerabilities": $(cat "$OUTPUT_DIR/vulnerabilities.json" 2>/dev/null || echo '{"vulnerabilities": []}'),
        "summary": {
            "hostReachable": $PING_SUCCESSFUL,
            "openPortsFound": ${OPEN_PORTS:-0},
            "vulnerabilitiesFound": ${vuln_count:-0},
            "scanDuration": "${duration} seconds",
            "riskLevel": "$risk_level"
        }
    },
    "status": "completed",
    "toolVersion": "$TOOL_VERSION"
}
EOF
    
    # Generate human-readable report
    local txt_report="$OUTPUT_DIR/autorecon_${TARGET}_$(date +%Y%m%d_%H%M%S).txt"
    cat > "$txt_report" << EOF
KNOUX7 AutoRecon Security Assessment Report
==========================================
Target: $TARGET
Scan Time: $START_TIME - $end_time
Duration: ${duration} seconds
Scan Type: $SCAN_TYPE

HOST DISCOVERY
--------------
Status: $HOST_STATUS
Hostname: $HOSTNAME
Ping Successful: $PING_SUCCESSFUL

PORT SCAN RESULTS
-----------------
Open Ports Found: ${OPEN_PORTS:-0}

SECURITY ASSESSMENT
-------------------
Vulnerabilities Found: ${vuln_count:-0}
Risk Level: $risk_level

RECOMMENDATIONS
---------------
1. Close unnecessary open ports
2. Implement network segmentation
3. Use strong authentication for all services
4. Keep all services updated with latest security patches
5. Monitor network traffic for suspicious activity

Generated by KNOUX7 AutoRecon v$TOOL_VERSION
EOF
    
    # Final Summary
    echo -e "\n${GREEN}📊 SCAN COMPLETED${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${WHITE}🎯 Target: $TARGET${NC}"
    echo -e "${WHITE}⏱️  Duration: ${duration} seconds${NC}"
    echo -e "${WHITE}🚪 Open Ports: ${OPEN_PORTS:-0}${NC}"
    echo -e "${WHITE}⚠️  Vulnerabilities: ${vuln_count:-0}${NC}"
    echo -e "${WHITE}🛡️  Risk Level: $risk_level${NC}"
    echo -e "${WHITE}📄 Reports saved to: $OUTPUT_DIR${NC}"
    echo -e "${GRAY}   - JSON: $(basename "$json_report")${NC}"
    echo -e "${GRAY}   - TXT:  $(basename "$txt_report")${NC}"
    
    # Output JSON for API consumption
    cat "$json_report"
}

# Error handling
error_exit() {
    local error_msg="$1"
    log "ERROR" "SCAN FAILED: $error_msg"
    
    local end_time=$(date '+%Y-%m-%d %H:%M:%S')
    cat > "$OUTPUT_DIR/error_result.json" << EOF
{
    "target": "$TARGET",
    "scanType": "$SCAN_TYPE",
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
    
    # Check dependencies
    check_dependencies
    
    # Print banner
    print_banner
    
    # Create output directory
    create_output_dir
    
    # Initialize scan results
    init_scan_results
    
    # Execute scan phases
    host_discovery
    port_scanning
    service_detection
    vulnerability_assessment
    
    # Generate final reports
    generate_reports
}

# Run main function
main "$@"
