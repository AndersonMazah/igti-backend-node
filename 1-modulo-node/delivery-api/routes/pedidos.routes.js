import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const router = express.Router();

// 1) Criar um pedido
router.post('/', async (req, res, next) => {
    try {
        let pedidoDto = req.body;

        if (!pedidoDto.cliente || !pedidoDto.produto || pedidoDto.valor == null) {
            throw new Error('Cliente, Produto e Valor são obrigatórios!');
        }

        const data = JSON.parse(await readFile(fileName));

        const pedido = {
            id: data.nextId++,
            cliente: pedidoDto.cliente,
            produto: pedidoDto.produto,
            valor: pedidoDto.valor,
            entregue: false,
            timestamp: new Date().toISOString()
        }

        data.pedidos.push(pedido);
        await writeFile(fileName, JSON.stringify(data, null, 2));

        logger.info(`POST /pedidos`);
        res.send(pedido);
    } catch (err) {
        next(err);
    }
});

// 2) Atualizar Pedido
router.put('/', async (req, res, next) => {
    try {
        let pedidoDto = req.body;

        if (pedidoDto.id == null || !pedidoDto.cliente || !pedidoDto.produto || pedidoDto.valor == null || pedidoDto.entregue == null) {
            throw new Error('Id, Cliente, Produto, Valor e Entregue são obrigatórios!');
        }

        const data = JSON.parse(await readFile(fileName));
        const index = data.pedidos.findIndex((x) => x.id === pedidoDto.id);
        if (index === -1) {
            throw new Error('Registro não encontrado.');
        }

        data.pedidos[index].cliente = pedidoDto.cliente;
        data.pedidos[index].produto = pedidoDto.produto;
        data.pedidos[index].valor = pedidoDto.valor;
        data.pedidos[index].entregue = pedidoDto.entregue;

        await writeFile(fileName, JSON.stringify(data, null, 2));

        logger.info(`PUT /pedidos`);
        res.end();
    } catch (err) {
        next(err);
    }
});

// 3) Atualizar Entrega do Pedido
router.patch('/atualiza-entregue/:id', async (req, res, next) => {
    try {
        let pedidoId = +req.params.id;
        let pedidoDto = req.body;

        if (pedidoDto.entregue == null) {
            throw new Error('Campo Entregue é obrigatório!');
        }

        const data = JSON.parse(await readFile(fileName));
        const index = data.pedidos.findIndex((x) => x.id === pedidoId);
        if (index === -1) {
            throw new Error('Registro não encontrado.');
        }

        data.pedidos[index].entregue = pedidoDto.entregue;

        await writeFile(fileName, JSON.stringify(data, null, 2));

        logger.info(`PATH /pedidos/atualiza-entregue/`);
        res.end();
    } catch (err) {
        next(err);
    }
});

// 4) Excluir um Pedido
router.delete('/:id', async (req, res, next) => {
    try {
        let pedidoId = +req.params.id;

        const data = JSON.parse(await readFile(fileName));
        const index = data.pedidos.findIndex((x) => x.id === pedidoId);
        if (index === -1) {
            throw new Error('Registro não encontrado.');
        };

        data.pedidos = data.pedidos.filter(
            (x) => x.id !== parseInt(pedidoId)
        );

        await writeFile(fileName, JSON.stringify(data, null, 2));

        logger.info(`DELETE /:id`);
        res.end();
    } catch (err) {
        next(err);
    }
});

// 5) Obter um Pedido específico
router.get('/todos/:id', async (req, res, next) => {
    try {
        let pedidoId = +req.params.id;
        if (pedidoId == null) {
            throw new Error('Campo Entregue é obrigatório!');
        }

        const data = JSON.parse(await readFile(fileName));
        const index = data.pedidos.findIndex((x) => x.id === pedidoId);
        if (index === -1) {
            throw new Error('Registro não encontrado.');
        };
        const pedido = data.pedidos[index];

        await writeFile(fileName, JSON.stringify(data, null, 2));

        logger.info(`GET /:id`);
        res.send(pedido);
    } catch (err) {
        next(err);
    }
});

// 6) Consultar o valor total de pedidos já entregues ao cliente.
router.get('/valor-total-dos-pedidos-do-cliente', async (req, res, next) => {
    try {
        let pedidoDto = req.body;
        if (pedidoDto.cliente == null) {
            throw new Error('Campo Cliente é obrigatório!');
        }

        const data = JSON.parse(await readFile(fileName));
        const pedidosDoCliente = data.pedidos.filter((x) => x.cliente === pedidoDto.cliente && x.entregue == true);

        let total = 0;
        pedidosDoCliente.forEach(item => {
            total += item.valor;
        });
        const retorno = {
            'valorTotalGastoPeloCliente': total
        }

        logger.info(`GET /valor-total-dos-pedidos-do-cliente`);
        res.send(retorno);
    } catch (err) {
        next(err);
    }
});

// 7) Consultar o valor total de pedidos já realizados de um produto.
router.get('/valor-total-dos-pedidos-de-um-produto', async (req, res, next) => {
    try {
        let pedidoDto = req.body;
        if (pedidoDto.produto == null) {
            throw new Error('Campo Produto é obrigatório!');
        }

        const data = JSON.parse(await readFile(fileName));
        const pedidosDoProduto = data.pedidos.filter((x) => x.produto === pedidoDto.produto && x.entregue == true);

        let total = 0;
        pedidosDoProduto.forEach(item => {
            total += item.valor;
        });
        const retorno = {
            'ValorTotalDePedidosDoProduto': total
        }

        logger.info(`GET /valor-total-dos-pedidos-de-um-produto`);
        res.send(retorno);
    } catch (err) {
        next(err);
    }
});

// 8) Retorna os produtos mais vendidos em ordem decrescente, com a quantidade de vêzes em que foram vendidos
router.get('/ranking-dos-produtos-mais-vendidos', async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile(fileName));
        const pedidosEntregues = data.pedidos.filter((x) => x.entregue == true);

        const rankingProdutos = [];

        pedidosEntregues.forEach(pedido => {
            const index = rankingProdutos.findIndex((x) => x.nome === pedido.produto);
            if (index === -1) {
                const produto = {
                    nome: pedido.produto,
                    quantidade: 1
                }
                rankingProdutos.push(produto);
            } else {
                rankingProdutos[index].quantidade++;
            }
        });
        rankingProdutos.sort(function (a, b) {
            return b.quantidade - a.quantidade
        });

        console.log(rankingProdutos);

        logger.info(`GET /ranking-dos-produtos-mais-vendidos`);
        res.send(rankingProdutos);
    } catch (err) {
        next(err);
    }
});

router.use((err, req, res, next) => {
    logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    res.status(400).send({ error: err.message });
});

export default router;
