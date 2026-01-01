# 📚 Documentación de la API

## URL Base
```
http://localhost:56201
```

---

## 🔌 Endpoints

### 1. Agregar Trunk

Crea un nuevo trunk de VoIP en Asterisk.

**URL:** `/add-trunk`  
**Método:** `POST`  
**Content-Type:** `application/json`

#### Parámetros del Body

| Parámetro | Tipo   | Requerido | Descripción                                    |
|-----------|--------|-----------|------------------------------------------------|
| type      | string | Sí        | Tipo de proveedor (telnyx, twilio, plivo, etc)|
| username  | string | Sí        | Usuario de autenticación SIP                   |
| password  | string | Sí        | Contraseña de autenticación SIP                |
| server    | string | Sí        | Servidor SIP del proveedor                     |

#### Tipos de Proveedores Soportados

- `telnyx`
- `twilio`
- `plivo`
- `signalwire`
- `vonage`
- `custom`

#### Ejemplo de Petición

```bash
curl -X POST http://localhost:56201/add-trunk \
  -H "Content-Type: application/json" \
  -d '{
    "type": "telnyx",
    "username": "myuser123",
    "password": "mypassword456",
    "server": "sip.telnyx.com"
  }'
```

#### Respuestas

**✅ Éxito (200)**
```json
{
  "message": "Trunk Trunk_Ab3Cd agregado y recargado correctamente.",
  "trunk": "telnyx_Trunk_Ab3Cd"
}
```

**❌ Error - Parámetros faltantes (200)**
```json
{
  "error": "Missing parameters."
}
```

**❌ Error - Plantilla no encontrada (200)**
```json
{
  "error": "configuration not found."
}
```

**❌ Error - Al escribir archivo (200)**
```json
{
  "error": "Error al escribir el archivo."
}
```

**❌ Error - Al recargar Asterisk (200)**
```json
{
  "error": "Error al ejecutar: asterisk -rx 'pjsip reload'"
}
```

---

### 2. Eliminar Trunk

Elimina un trunk existente de Asterisk.

**URL:** `/delete-trunk/:trunkName`  
**Método:** `DELETE`

#### Parámetros de URL

| Parámetro  | Tipo   | Requerido | Descripción                    |
|------------|--------|-----------|--------------------------------|
| trunkName  | string | Sí        | Nombre del trunk a eliminar    |

#### Ejemplo de Petición

```bash
curl -X DELETE http://localhost:56201/delete-trunk/Trunk_Ab3Cd
```

#### Respuestas

**✅ Éxito (200)**
```json
{
  "message": "Trunk Trunk_Ab3Cd eliminado y configuración recargada."
}
```

**❌ Error - Trunk no existe (200)**
```json
{
  "error": "El trunk no existe."
}
```

**❌ Error - Al eliminar archivo (200)**
```json
{
  "error": "Error al eliminar el archivo."
}
```

**❌ Error - Al recargar Asterisk (200)**
```json
{
  "error": "Error al recargar Asterisk."
}
```

---

## 🧪 Ejemplos de Uso por Proveedor

### Telnyx

```javascript
fetch('http://localhost:56201/add-trunk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'telnyx',
    username: 'telnyx_user',
    password: 'telnyx_pass',
    server: 'sip.telnyx.com'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Twilio

```python
import requests

response = requests.post('http://localhost:56201/add-trunk', json={
    'type': 'twilio',
    'username': 'twilio_user',
    'password': 'twilio_pass',
    'server': 'your-region.pstn.twilio.com'
})

print(response.json())
```

### Plivo

```bash
curl -X POST http://localhost:56201/add-trunk \
  -H "Content-Type: application/json" \
  -d '{
    "type": "plivo",
    "username": "plivo_user",
    "password": "plivo_pass",
    "server": "sip.plivo.com"
  }'
```

### SignalWire

```javascript
const axios = require('axios');

axios.post('http://localhost:56201/add-trunk', {
  type: 'signalwire',
  username: 'sw_user',
  password: 'sw_pass',
  server: 'your-space.signalwire.com'
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

### Vonage

```bash
curl -X POST http://localhost:56201/add-trunk \
  -H "Content-Type: application/json" \
  -d '{
    "type": "vonage",
    "username": "vonage_user",
    "password": "vonage_pass",
    "server": "sip.nexmo.com"
  }'
```

---

## 🔄 Proceso de Recarga de Asterisk

Cuando se agrega o elimina un trunk, se ejecutan automáticamente estos comandos:

```bash
asterisk -rx 'module reload res_pjsip.so'
asterisk -rx 'module reload res_pjsip_registrar.so'
asterisk -rx 'module reload res_pjsip_outbound_registration.so'
asterisk -rx 'module reload res_pjsip_endpoint_identifier_ip.so'
asterisk -rx 'pjsip reload'
```

---

## 📝 Notas Importantes

1. **Nombres de Trunk**: Se generan automáticamente con el formato `Trunk_XXXXX` donde XXXXX es una cadena aleatoria de 5 caracteres.

2. **Ubicación de Archivos**: Los archivos de configuración se guardan en `/etc/asterisk/trunks/`

3. **Códigos de Estado**: Todas las respuestas retornan código HTTP 200, incluso en caso de error. Verifica el campo `error` en la respuesta JSON.

4. **Plantillas**: Cada tipo de proveedor tiene su propia plantilla en el directorio `examples/`

5. **Variables Reemplazadas**: En las plantillas se reemplazan estas variables:
   - `${name}`: Nombre generado del trunk
   - `${username}`: Usuario proporcionado
   - `${password}`: Contraseña proporcionada
   - `${server}`: Servidor proporcionado

---

## 🔍 Validación de Trunk Creado

Para verificar que el trunk se creó correctamente:

```bash
# Ver archivo creado
cat /etc/asterisk/trunks/Trunk_XXXXX.conf

# Ver en Asterisk CLI
asterisk -rx 'pjsip show endpoints'
asterisk -rx 'pjsip show auths'
```

---

## 🛡️ Seguridad

⚠️ **IMPORTANTE**: Esta API no incluye autenticación. Para producción:

1. Implementa autenticación (JWT, API Key, etc.)
2. Usa HTTPS
3. Limita acceso por IP/firewall
4. Valida y sanitiza todas las entradas
5. No expongas directamente a internet

