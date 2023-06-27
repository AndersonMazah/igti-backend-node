import express from "express";
import { promises as fs } from "fs";

const { readFile } = fs;

const router = express.Router();

// Atividade 1
router.get("/maisModelos", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(fileName));

        // obtem a lista de Marcas com a quantidade de Modelos de cada marca
        const marcasQtdeModelos = data.map(item => {
            return { marca: item.brand, qtdModelos: item.models.length }
        });

        // ordena as Marcas pela quantidade de Modelos
        marcasQtdeModelos.sort(function (a, b) { return b.qtdModelos - a.qtdModelos });

        // identifica a(as) Marcas que mais tem Modelos
        const marcasComMaisQtdeModelos = marcasQtdeModelos.filter(item => {
            return item.qtdModelos === marcasQtdeModelos[0].qtdModelos
        });

        logger.info(`GET /marcas/maisModelos`);
        res.send(marcasComMaisQtdeModelos);
    } catch (err) {
        next(err);
    }
});

// Atividade 2
router.get("/menosModelos", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(fileName));

        // obtem a lista de Marcas com a quantidade de Modelos de cada marca
        const marcasQtdeModelos = data.map(item => {
            return { marca: item.brand, qtdModelos: item.models.length }
        });

        // ordena as Marcas pela quantidade de Modelos
        marcasQtdeModelos.sort(function (a, b) { return a.qtdModelos - b.qtdModelos });

        // identifica a(as) Marcas que mais tem Modelos
        const marcasComMaisQtdeModelos = marcasQtdeModelos.filter(item => {
            return item.qtdModelos === marcasQtdeModelos[0].qtdModelos
        });

        logger.info(`GET /marcas/menosModelos`);
        res.send(marcasComMaisQtdeModelos);
    } catch (err) {
        next(err);
    }
});

// Atividade 3
router.get("/listaMaisModelos/:quantidade", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(fileName));

        // obtem a lista de Marcas com a quantidade de Modelos de cada marca
        const marcasQtdeModelos = data.map(item => {
            return { marca: item.brand, qtdModelos: item.models.length }
        });

        // ordena as Marcas pela quantidade de Modelos
        marcasQtdeModelos.sort(function (a, b) { return b.qtdModelos - a.qtdModelos });

        // identifica a(as) Marcas que mais tem Modelos
        const marcasComMaisQtdeModelosQue = marcasQtdeModelos.splice(0, req.params.quantidade);

        logger.info(`GET /marcas/listaMaisModelos`);
        res.send(marcasComMaisQtdeModelosQue);
    } catch (err) {
        next(err);
    }
});

// Atividade 4
router.get("/listaMenosModelos/:quantidade", async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(fileName));

        // obtem a lista de Marcas com a quantidade de Modelos de cada marca
        const marcasQtdeModelos = data.map(item => {
            return { marca: item.brand, qtdModelos: item.models.length }
        });

        // ordena as Marcas pela quantidade de Modelos
        marcasQtdeModelos.sort(function (a, b) { return a.qtdModelos - b.qtdModelos });

        // identifica a(as) Marcas que mais tem Modelos
        const marcasComMaisQtdeModelosQue = marcasQtdeModelos.splice(0, req.params.quantidade);

        logger.info(`GET /marcas/listaMenosModelos`);
        res.send(marcasComMaisQtdeModelosQue);
    } catch (err) {
        next(err);
    }
});

// Atividade 5
router.post("/listaModelos", async (req, res, next) => {
    try {
        let nomePesquisado = req.body;
        //nomeMarca

        const data = JSON.parse(await readFile(fileName));

        const marcaPesquisa = data.find((x) => x.brand.toUpperCase() === nomePesquisado.nomeMarca.toUpperCase());

        logger.info(`GET /marcas/listaModelos`);
        res.send(marcaPesquisa);
    } catch (err) {
        next(err);
    }
});

router.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({ error: err.message });
});

export default router;
