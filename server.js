const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// conexion de base de datos//
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456', 
    database: 'secayax_db',
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('¡Conectado exitosamente a la base de datos secayax_db!');
});

// registro de usuarios//
app.post('/api/registro', (req, res) => {
    const { nombre, finca, correo, contrasena } = req.body;
    
    console.log("-> Intento de registro recibido:", req.body);

    const query = 'INSERT INTO usuarios (nombre, finca, correo, contrasena) VALUES (?, ?, ?, ?)';
    
    db.query(query, [nombre, finca, correo, contrasena], (err, result) => {
        if (err) {
            console.error("❌ Error al insertar en la base de datos:", err); // Muestra la causa real en tu terminal
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Este correo ya está registrado.' });
            }
            return res.status(500).json({ error: 'Error interno en el servidor al registrar.' });
        }
        console.log("✅ Usuario registrado con éxito en la BD.");
        res.json({ mensaje: 'Usuario registrado con éxito.' });
    });
});

app.post('/api/ingreso', (req, res) => {
    const { correo, contrasena } = req.body;
    
    console.log(`-> Intento de login para el correo: ${correo}`);

    const query = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?';

    db.query(query, [correo, contrasena], (err, result) => {
        if (err) {
            console.error("❌ Error en consulta de login:", err);
            return res.status(500).json({ error: 'Error interno en el servidor al ingresar.' });
        }

        if (result.length > 0) {
            console.log("✅ Login exitoso.");
            // Retornamos el primer usuario encontrado
            res.json({ mensaje: 'Ingreso exitoso.', usuario: result[0] });
        } else {
            console.log("⚠️ Credenciales incorrectas.");
            res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }
    });
});

// ingreso por pin//
app.post('/api/ingreso-pin', (req, res) => {
    const { pin } = req.body;
    
    console.log(`-> Intento de login por PIN`);

    const query = 'SELECT * FROM usuarios WHERE pin = ?';

    db.query(query, [pin], (err, result) => {
        if (err) {
            console.error("❌ Error en consulta de PIN:", err);
            return res.status(500).json({ error: 'Error al verificar el PIN.' });
        }

        if (result.length > 0) {
            console.log("✅ Login por PIN exitoso.");
            res.json({ mensaje: 'Ingreso por PIN exitoso.', usuario: result[0] });
        } else {
            console.log("⚠️ PIN inválido.");
            res.status(401).json({ error: 'El PIN ingresado no es válido.' });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor de SECAYAX corriendo en http://localhost:${PORT}`);
});