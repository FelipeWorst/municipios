require("dotenv").config();
const pool = require("./db");

const api_key = process.env.API_KEY_SECRET

async function autenticarAPIKey(req, res, next) {

    const api_key_front = req.header('minha-chave')

    const result = await pool.query( `SELECT id, api_key, plano, limite, consumo FROM api_keys WHERE api_key = $1`,[api_key_front]
    )
    console.log(api_key_front)
    if (result.rows.length > 0 ){//&& result.rows[0].consumo < result.rows[0].limite) {

        let consumo = result.rows[0].consumo + 1
        console.log(consumo)
        await pool.query(`UPDATE api_keys SET consumo = $1 WHERE api_key = $2`,[consumo, api_key_front])
        next()

    } 
    else {
        console.log("chave invalida")
        return res.status(401).json({ mensagem: "Chave inválida ou limite excedido" })
    }
}


module.exports = autenticarAPIKey