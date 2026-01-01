const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const randString = require("randomstring");
const app = express();
const PORT = 56201;

app.use(express.json());

const PJSIP_DIR = "/etc/asterisk/trunks/";

const getConfig = (file) => fs.readFileSync(file,'utf-8');

const changeVars = (template, variables) => {
    return template.replace(/\${(.*?)}/g, (match, p1) => {
        return variables[p1] !== undefined ? variables[p1] : '';
    });
}

const reloadAsteriskModules = (callback) => {
    const commands = [
        "asterisk -rx 'module reload res_pjsip.so'",
        "asterisk -rx 'module reload res_pjsip_registrar.so'",
        "asterisk -rx 'module reload res_pjsip_outbound_registration.so'",
        "asterisk -rx 'module reload res_pjsip_endpoint_identifier_ip.so'",
        "asterisk -rx 'pjsip reload'"
    ];
    
    const executeCommands = (index) => {
        if (index >= commands.length) {
            return callback(null);
        }

        exec(commands[index], (error, stdout, stderr) => {
            if (error) {
                return callback(`Error al ejecutar: ${commands[index]}`);
            }
            executeCommands(index + 1);
        });
    };

    executeCommands(0);
}

app.post('/add-trunk', (req, res) => {
    const { username, password, server, type } = req.body;

    const trunkName = `Trunk_${randString.generate(5)}`;
    if (!trunkName || !username || !password || !server || !type) {
        return res.status(200).json({ error: "Missing parameters." });
    }

    const filePath = `${PJSIP_DIR}${trunkName}.conf`;

    const trunkConfig = path.join(__dirname, "examples", `${type}.conf`);

    if(!fs.existsSync(trunkConfig)) {
        return res.status(200).json({ error: "configuration not found." });
    }

    const trunkSample = getConfig(trunkConfig);
    const trunkComplete = changeVars(trunkSample, {name:trunkName, username, password, server});

    fs.writeFile(filePath, trunkComplete, (err) => {
        if (err) {
            console.log(err);
            return res.status(200).json({ error: "Error al escribir el archivo." });
        }

        reloadAsteriskModules((error) => {
            if (error) {
                return res.status(200).json({ error: error });
            }
            res.json({ 
                message: `Trunk ${trunkName} agregado y recargado correctamente.`,
                trunk:`${type}_${trunkName}`
            });
        });
    });
});

app.delete('/delete-trunk/:trunkName', (req, res) => {
    const { trunkName } = req.params;
    const filePath = `${PJSIP_DIR}${trunkName}.conf`;

    if (!fs.existsSync(filePath)) {
        return res.status(200).json({ error: "El trunk no existe." });
    }

    fs.unlink(filePath, (err) => {
        if (err) return res.status(200).json({ error: "Error al eliminar el archivo." });

        reloadAsteriskModules((error) => {
            if (error) {
                return res.status(200).json({ error: "Error al recargar Asterisk." });
            }
            res.json({ message: `Trunk ${trunkName} eliminado y configuración recargada.` });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
