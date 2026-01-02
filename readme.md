# 🚀 Asterisk Trunk Manager API

API REST para gestionar trunks de Asterisk de manera dinámica mediante PJSIP. Permite agregar y eliminar trunks de diferentes proveedores VoIP sin editar manualmente los archivos de configuración.

## 📋 Características

- ✅ Agregar trunks dinámicamente vía API REST
- ✅ Eliminar trunks existentes
- ✅ Soporte para múltiples proveedores VoIP
- ✅ Recarga automática de módulos Asterisk
- ✅ Plantillas predefinidas para proveedores populares

## 🔧 Proveedores Soportados

- **Telnyx**
- **Twilio**
- **Plivo**
- **SignalWire**
- **Vonage**
- **Custom** (configuración personalizada)

## 📦 Requisitos Previos

- **Node.js** (v14 o superior)
- **Asterisk** con PJSIP configurado
- **Sistema Linux** con systemd
- **Acceso root** para la instalación

## 🚀 Instalación Automática

### Opción 1: Instalación con un comando

```bash
git clone https://github.com/lafuga0112/asterisk-trunk-manager.git
cd asterisk-trunk-manager
sudo chmod +x install.sh
sudo ./install.sh
```

### Opción 2: Instalación Manual

1. **Clonar el repositorio:**
```bash
git clone https://github.com/lafuga0112/asterisk-trunk-manager.git
cd asterisk-trunk-manager
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Crear directorio para trunks:**
```bash
sudo mkdir -p /etc/asterisk/trunks/
sudo chmod 755 /etc/asterisk/trunks/
```

4. **Configurar servicio systemd:**
```bash
sudo nano /etc/systemd/system/trunk-manager.service
```

Pegar este contenido (ajustar la ruta si es necesario):
```ini
[Unit]
Description=Asterisk Trunk Manager API
After=network.target

[Service]
ExecStart=/usr/bin/node /ruta/completa/al/proyecto/app.js
WorkingDirectory=/ruta/completa/al/proyecto
Restart=always
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

5. **Configurar Asterisk:**
```bash
sudo nano /etc/asterisk/pjsip_custom.conf
```

Agregar esta línea:
```
#include trunks/*.conf
```

6. **Iniciar el servicio:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable trunk-manager
sudo systemctl start trunk-manager
sudo systemctl status trunk-manager
```

## 📖 Uso de la API

### 1️⃣ Agregar un Trunk

**Endpoint:** `POST /add-trunk`

**Body (JSON):**
```json
{
  "type": "telnyx",
  "username": "tu_usuario",
  "password": "tu_password",
  "server": "sip.telnyx.com"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:56201/add-trunk \
  -H "Content-Type: application/json" \
  -d '{
    "type": "telnyx",
    "username": "miusuario",
    "password": "mipassword",
    "server": "sip.telnyx.com"
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "Trunk Trunk_Ab3Cd agregado y recargado correctamente.",
  "trunk": "telnyx_Trunk_Ab3Cd"
}
```

### 2️⃣ Eliminar un Trunk

**Endpoint:** `DELETE /delete-trunk/:trunkName`

**Ejemplo:**
```bash
curl -X DELETE http://localhost:56201/delete-trunk/Trunk_Ab3Cd
```

**Respuesta exitosa:**
```json
{
  "message": "Trunk Trunk_Ab3Cd eliminado y configuración recargada."
}
```

## 🎯 Ejemplos por Proveedor

### Telnyx
```bash
curl -X POST http://localhost:56201/add-trunk \
  -H "Content-Type: application/json" \
  -d '{"type":"telnyx","username":"user123","password":"pass123","server":"sip.telnyx.com"}'
```

### Twilio
```bash
curl -X POST http://localhost:56201/add-trunk \
  -H "Content-Type: application/json" \
  -d '{"type":"twilio","username":"user123","password":"pass123","server":"your-region.pstn.twilio.com"}'
```

### Plivo
```bash
curl -X POST http://localhost:56201/add-trunk \
  -H "Content-Type: application/json" \
  -d '{"type":"plivo","username":"user123","password":"pass123","server":"sip.plivo.com"}'
```

## 🛠️ Comandos Útiles

```bash
# Ver logs en tiempo real
sudo journalctl -u trunk-manager -f

# Reiniciar el servicio
sudo systemctl restart trunk-manager

# Detener el servicio
sudo systemctl stop trunk-manager

# Ver estado del servicio
sudo systemctl status trunk-manager

# Verificar trunks creados
ls -la /etc/asterisk/trunks/
```

## 📁 Estructura del Proyecto

```
asterisk-trunk-manager/
├── app.js                    # Aplicación principal
├── package.json              # Dependencias del proyecto
├── install.sh               # Script de instalación automática
├── README.md                # Este archivo
└── examples/                # Plantillas de configuración
    ├── telnyx.conf
    ├── twilio.conf
    ├── plivo.conf
    ├── signalwire.conf
    ├── vonage.conf
    └── custom.conf
```

## ⚙️ Configuración

El servidor corre por defecto en el puerto **56201**. Para cambiar el puerto, edita la variable `PORT` en `app.js`.

Los archivos de configuración de trunks se guardan en `/etc/asterisk/trunks/` con el formato `Trunk_XXXXX.conf`.

## 🔍 Solución de Problemas

### El servicio no inicia
```bash
# Ver logs detallados
sudo journalctl -u trunk-manager -n 50 --no-pager
```

### Asterisk no recarga los módulos
```bash
# Recargar manualmente
asterisk -rx 'pjsip reload'
```

### Permisos insuficientes
```bash
# Verificar permisos del directorio
ls -la /etc/asterisk/trunks/
sudo chmod 755 /etc/asterisk/trunks/
```

## 📝 Licencia

ISC

## 👨‍💻 Autor

Tu Nombre

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request



6489da209222154764666a21cca1f4b7