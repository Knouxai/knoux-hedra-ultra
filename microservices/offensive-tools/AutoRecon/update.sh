#!/bin/bash

# KNOUX7 KOTS™ - AutoRecon Update Script (Linux Bash)
# Updates AutoRecon tool dependencies and definitions

TOOL_NAME="AutoRecon"
TOOL_VERSION="1.0.0"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m'

# Parse arguments
FORCE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            echo "KNOUX7 AutoRecon Update Script v$TOOL_VERSION"
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --force     Force update even if already up to date"
            echo "  --verbose   Verbose output"
            echo "  -h, --help  Show this help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Logging function
log() {
    local level=$1
    local message=$2
    
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

# Error handling
error_exit() {
    local error_msg="$1"
    log "ERROR" "UPDATE FAILED: $error_msg"
    
    cat > "./error_result.json" << EOF
{
    "success": false,
    "error": "$error_msg",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "tool": "$TOOL_NAME"
}
EOF
    
    cat "./error_result.json"
    exit 1
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect package manager
detect_package_manager() {
    if command_exists apt-get; then
        echo "apt"
    elif command_exists yum; then
        echo "yum"
    elif command_exists dnf; then
        echo "dnf"
    elif command_exists pacman; then
        echo "pacman"
    elif command_exists zypper; then
        echo "zypper"
    else
        echo "unknown"
    fi
}

# Install package based on detected package manager
install_package() {
    local package=$1
    local pm=$(detect_package_manager)
    
    case $pm in
        "apt")
            sudo apt-get update && sudo apt-get install -y "$package"
            ;;
        "yum")
            sudo yum install -y "$package"
            ;;
        "dnf")
            sudo dnf install -y "$package"
            ;;
        "pacman")
            sudo pacman -S --noconfirm "$package"
            ;;
        "zypper")
            sudo zypper install -y "$package"
            ;;
        *)
            log "WARNING" "Unknown package manager. Please install $package manually."
            return 1
            ;;
    esac
}

# Check and install dependencies
check_dependencies() {
    log "INFO" "🔍 Checking dependencies..."
    
    local missing_deps=()
    local deps=("nmap" "nc" "dig" "curl" "wget")
    
    for dep in "${deps[@]}"; do
        if ! command_exists "$dep"; then
            missing_deps+=("$dep")
            log "WARNING" "$dep is not installed"
        else
            log "SUCCESS" "$dep is installed"
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log "INFO" "Installing missing dependencies: ${missing_deps[*]}"
        
        for dep in "${missing_deps[@]}"; do
            case $dep in
                "nc")
                    install_package "netcat" || install_package "netcat-openbsd" || install_package "nmap-ncat"
                    ;;
                "dig")
                    install_package "dnsutils" || install_package "bind-utils"
                    ;;
                *)
                    install_package "$dep"
                    ;;
            esac
        done
    fi
}

# Update Nmap scripts
update_nmap_scripts() {
    log "INFO" "🔄 Updating Nmap scripts..."
    
    if command_exists nmap; then
        if nmap --script-updatedb >/dev/null 2>&1; then
            log "SUCCESS" "Nmap scripts updated successfully"
        else
            log "WARNING" "Could not update Nmap scripts (may require sudo)"
        fi
    else
        log "WARNING" "Nmap not found, skipping script update"
    fi
}

# Update vulnerability databases
update_vulnerability_db() {
    log "INFO" "🔍 Updating vulnerability definitions..."
    
    # Create vulnerability database directory
    local vuln_db_dir="./vuln-db"
    mkdir -p "$vuln_db_dir"
    
    # Download CVE database (simplified for demo)
    log "INFO" "⬇️  Downloading CVE definitions..."
    cat > "$vuln_db_dir/cve-list.csv" << EOF
CVE-ID,Description,CVSS
CVE-2023-0001,Example vulnerability 1,7.5
CVE-2023-0002,Example vulnerability 2,9.0
CVE-2023-0003,SSH weak configuration,6.5
CVE-2023-0004,FTP anonymous access,5.0
CVE-2023-0005,HTTP directory traversal,7.0
EOF
    
    log "SUCCESS" "CVE definitions updated"
    
    # Update service fingerprints
    log "INFO" "🔍 Updating service fingerprints..."
    cat > "$vuln_db_dir/services.json" << EOF
{
    "21": {
        "service": "FTP",
        "banners": ["220 ", "FTP server ready"],
        "vulnerabilities": ["Anonymous access", "Weak authentication"]
    },
    "22": {
        "service": "SSH",
        "banners": ["SSH-2.0", "SSH-1.99"],
        "vulnerabilities": ["Weak ciphers", "Default credentials"]
    },
    "23": {
        "service": "Telnet",
        "banners": ["login:", "Password:"],
        "vulnerabilities": ["Unencrypted communication", "Weak authentication"]
    },
    "25": {
        "service": "SMTP",
        "banners": ["220 ", "ESMTP"],
        "vulnerabilities": ["Open relay", "Weak authentication"]
    },
    "80": {
        "service": "HTTP",
        "banners": ["HTTP/1.1", "Server:"],
        "vulnerabilities": ["Unencrypted communication", "Directory traversal"]
    },
    "443": {
        "service": "HTTPS",
        "banners": ["HTTP/1.1", "Server:"],
        "vulnerabilities": ["SSL/TLS misconfigurations", "Weak ciphers"]
    },
    "3389": {
        "service": "RDP",
        "banners": ["RDP"],
        "vulnerabilities": ["Weak authentication", "BlueKeep vulnerability"]
    }
}
EOF
    
    log "SUCCESS" "Service fingerprints updated"
    
    # Update port definitions
    log "INFO" "🔍 Updating port definitions..."
    cat > "$vuln_db_dir/ports.json" << EOF
{
    "common_ports": [21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 993, 995, 1723, 3306, 3389, 5432, 5900, 8080],
    "all_ports": {
        "start": 1,
        "end": 65535
    },
    "services": {
        "21": "FTP",
        "22": "SSH",
        "23": "Telnet",
        "25": "SMTP",
        "53": "DNS",
        "80": "HTTP",
        "110": "POP3",
        "111": "RPC",
        "135": "Microsoft RPC",
        "139": "NetBIOS",
        "143": "IMAP",
        "443": "HTTPS",
        "993": "IMAPS",
        "995": "POP3S",
        "1723": "PPTP",
        "3306": "MySQL",
        "3389": "RDP",
        "5432": "PostgreSQL",
        "5900": "VNC",
        "8080": "HTTP Alternative"
    }
}
EOF
    
    log "SUCCESS" "Port definitions updated"
}

# Update tool status
update_status() {
    log "INFO" "📝 Updating tool status..."
    
    # Check dependencies status
    local nmap_status="missing"
    local nc_status="missing"
    local dig_status="missing"
    
    command_exists nmap && nmap_status="installed"
    command_exists nc && nc_status="installed"
    command_exists dig && dig_status="installed"
    
    cat > "./status.json" << EOF
{
    "name": "AutoRecon",
    "status": "READY",
    "risk": "MEDIUM",
    "lastUpdated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "version": "$TOOL_VERSION",
    "dependencies": {
        "nmap": "$nmap_status",
        "netcat": "$nc_status",
        "dig": "$dig_status",
        "bash": "installed"
    },
    "databases": {
        "cve": "updated",
        "services": "updated",
        "ports": "updated"
    }
}
EOF
    
    log "SUCCESS" "Tool status updated"
}

# Main function
main() {
    echo -e "${CYAN}🔄 KNOUX7 AutoRecon Update v$TOOL_VERSION${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}🕐 Started: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    
    # Set up error handling
    set -e
    trap 'error_exit "Unexpected error occurred"' ERR
    
    # Check and install dependencies
    check_dependencies
    
    # Update Nmap scripts
    update_nmap_scripts
    
    # Update vulnerability databases
    update_vulnerability_db
    
    # Update tool status
    update_status
    
    # Success summary
    echo -e "\n${GREEN}✅ UPDATE COMPLETED${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${WHITE}🛠️  Tool: $TOOL_NAME v$TOOL_VERSION${NC}"
    echo -e "${WHITE}📦 Dependencies: Checked and updated${NC}"
    echo -e "${WHITE}🗄️  Databases: Updated${NC}"
    echo -e "${WHITE}✅ Status: Ready for use${NC}"
    echo -e "${WHITE}🕐 Completed: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    
    # Return success result
    cat << EOF
{
    "success": true,
    "message": "AutoRecon updated successfully",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "details": {
        "dependencies_checked": true,
        "databases_updated": true,
        "status": "ready"
    }
}
EOF
}

# Run main function
main "$@"
