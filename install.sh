#!/bin/bash

echo "🚀 Instalación automática de Asterisk Trunk Manager"
echo "=================================================="

# Verificar si se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Este script debe ejecutarse como root (sudo)"
    exit 1
fi

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Paso 1: Instalando dependencias de Node.js...${NC}"
npm install

echo -e "${YELLOW}📁 Paso 2: Creando directorio para trunks...${NC}"
mkdir -p /etc/asterisk/trunks/
chmod 755 /etc/asterisk/trunks/

# Obtener el directorio actual
CURRENT_DIR=$(pwd)

echo -e "${YELLOW}⚙️  Paso 3: Configurando servicio systemd...${NC}"
# Crear archivo de servicio
cat > /etc/systemd/system/trunk-manager.service << EOF
[Unit]
Description=Asterisk Trunk Manager API
After=network.target

[Service]
ExecStart=/usr/bin/node ${CURRENT_DIR}/app.js
WorkingDirectory=${CURRENT_DIR}
Restart=always
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

echo -e "${YELLOW}🔧 Paso 4: Configurando Asterisk...${NC}"
# Verificar si el archivo pjsip_custom.conf existe
if [ ! -f /etc/asterisk/pjsip_custom.conf ]; then
    echo "#include trunks/*.conf" > /etc/asterisk/pjsip_custom.conf
    echo -e "${GREEN}✅ Archivo pjsip_custom.conf creado${NC}"
else
    # Verificar si ya contiene la línea include
    if ! grep -q "#include trunks/\*\.conf" /etc/asterisk/pjsip_custom.conf; then
        echo "#include trunks/*.conf" >> /etc/asterisk/pjsip_custom.conf
        echo -e "${GREEN}✅ Include agregado a pjsip_custom.conf${NC}"
    else
        echo -e "${GREEN}✅ pjsip_custom.conf ya está configurado${NC}"
    fi
fi

echo -e "${YELLOW}🔄 Paso 5: Iniciando servicios...${NC}"
systemctl daemon-reload
systemctl enable trunk-manager
systemctl restart trunk-manager

echo ""
echo -e "${GREEN}✅ ¡Instalación completada!${NC}"
echo ""
echo "=================================================="
echo "📊 Estado del servicio:"
echo "=================================================="
systemctl status trunk-manager --no-pager

echo ""
echo "=================================================="
echo "📝 Comandos útiles:"
echo "=================================================="
echo "  Ver logs:        sudo journalctl -u trunk-manager -f"
echo "  Reiniciar:       sudo systemctl restart trunk-manager"
echo "  Detener:         sudo systemctl stop trunk-manager"
echo "  Estado:          sudo systemctl status trunk-manager"
echo ""
echo "🌐 API disponible en: http://localhost:56201"
echo ""

