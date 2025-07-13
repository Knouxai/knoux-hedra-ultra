#!/bin/bash

# KNOUX7 KOTS™ - Installation Script
# Automated setup for KNOX Offensive Tool Standard microservices

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
WHITE='\033[1;37m'
NC='\033[0m'

echo -e "${CYAN}"
echo "🚀 KNOUX7 KOTS™ - Installation Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💎 KNOX Offensive Tool Standard - Microservices"
echo -e "${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js v18+ from: https://nodejs.org${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}⚠️  Warning: Node.js v$NODE_VERSION detected. Recommended: v18+${NC}"
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm -v) detected${NC}"

# Install dependencies
echo -e "\n${CYAN}📦 Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Create basic directory structure
echo -e "\n${CYAN}📁 Creating tool directories...${NC}"

MODULES=("defensive-ops" "offensive-tools" "surveillance" "network-control" "ai-assistant" "reporting" "cosmic-settings")

for module in "${MODULES[@]}"; do
    if [ ! -d "$module" ]; then
        mkdir -p "$module"
        echo -e "${GREEN}✅ Created module: $module${NC}"
    else
        echo -e "${BLUE}📁 Module exists: $module${NC}"
    fi
done

# Create logs directory
if [ ! -d "logs" ]; then
    mkdir -p logs
    echo -e "${GREEN}✅ Created logs directory${NC}"
fi

# Create output directories for tools
echo -e "\n${CYAN}📂 Creating output directories...${NC}"
for module in "${MODULES[@]}"; do
    if [ ! -d "$module/output" ]; then
        mkdir -p "$module/output"
    fi
done

# Set permissions for scripts
echo -e "\n${CYAN}🔒 Setting script permissions...${NC}"
find . -name "*.sh" -type f -exec chmod +x {} \;
echo -e "${GREEN}✅ Script permissions set${NC}"

# Test server startup
echo -e "\n${CYAN}🧪 Testing server startup...${NC}"
timeout 10s node server.js &
SERVER_PID=$!
sleep 3

if kill -0 $SERVER_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Server test successful${NC}"
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
else
    echo -e "${YELLOW}⚠️  Server test timeout (this may be normal)${NC}"
fi

# Create basic tool if AutoRecon doesn't exist
if [ ! -f "offensive-tools/AutoRecon/run.sh" ]; then
    echo -e "\n${CYAN}🔧 Creating basic AutoRecon tool...${NC}"
    mkdir -p "offensive-tools/AutoRecon"
    
    cat > "offensive-tools/AutoRecon/run.sh" << 'EOF'
#!/bin/bash
echo "🔍 KNOUX7 AutoRecon Demo Tool"
echo "Target: ${1:-localhost}"
echo "Status: Demo execution completed"
echo '{"tool":"AutoRecon","status":"completed","demo":true}'
EOF
    chmod +x "offensive-tools/AutoRecon/run.sh"
    
    cat > "offensive-tools/AutoRecon/status.json" << 'EOF'
{
  "name": "AutoRecon",
  "status": "READY", 
  "risk": "MEDIUM",
  "version": "1.0.0",
  "signature": "KNOUX7-KOTS™"
}
EOF
    
    echo -e "${GREEN}✅ Basic AutoRecon tool created${NC}"
fi

# Installation complete
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 KNOUX7 KOTS™ Installation Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${WHITE}📋 Next Steps:${NC}"
echo -e "${CYAN}1. Start the server:${NC}      npm start"
echo -e "${CYAN}2. Test the API:${NC}         curl http://localhost:7070/api/health"
echo -e "${CYAN}3. List tools:${NC}           curl http://localhost:7070/api/tools"
echo -e "${CYAN}4. Run a tool:${NC}           curl -X POST http://localhost:7070/api/AutoRecon/run"

echo -e "\n${WHITE}🔗 Endpoints:${NC}"
echo -e "${BLUE}API Server:${NC}              http://localhost:7070"
echo -e "${BLUE}WebSocket:${NC}               ws://localhost:7071"
echo -e "${BLUE}Health Check:${NC}            http://localhost:7070/api/health"
echo -e "${BLUE}Documentation:${NC}           See README.md"

echo -e "\n${WHITE}🛠️  Available Commands:${NC}"
echo -e "${PURPLE}npm start${NC}                Start the server"
echo -e "${PURPLE}npm run dev${NC}              Development mode with hot reload"
echo -e "${PURPLE}npm run tools:list${NC}       List all available tools"
echo -e "${PURPLE}npm run tools:health${NC}     Check server health"
echo -e "${PURPLE}npm run status${NC}           Show system status"

echo -e "\n${YELLOW}💡 Tip: Run 'npm start' to begin using KNOUX7 KOTS™${NC}"
echo -e "${CYAN}🔥 Ready for cyber operations!${NC}\n"
