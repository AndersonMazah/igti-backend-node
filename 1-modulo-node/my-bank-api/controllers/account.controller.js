import AccountService from '../services/account.service.js';

async function createAccount(req, res, next) {
    try {
        let account = req.body;
        if (!account.name || account.balance == null) {
            throw new Error("Name e Balance são obrigatórios");
        }
        account = await AccountService.createAccount(account);
        logger.info(`POST /account - ${JSON.stringify(account)}`);
        res.send(account);
    } catch (err) {
        next(err);
    }
};

async function getAccounts(req, res, next) {
    try {
        logger.info(`GET /account`);
        res.send(await AccountService.getAccounts());
    } catch (err) {
        next(err);
    }
};

async function getAccount(req, res, next) {
    try {
        const id = req.params.id;
        const account = await AccountService.getAccount(id);
        logger.info(`GET /account/${id}`);
        res.send(account);
    } catch (err) {
        next(err);
    }
};

async function deleteAccount(req, res, next) {
    try {
        const id = req.params.id;
        await AccountService.deleteAccount(id);
        logger.info(`DELETE /account/${id}`);
        res.end();
    } catch (err) {
        next(err);
    }
};

async function updateAccount(req, res, next) {
    try {
        let account = req.body;

        if (!account.id || !account.name || account.balance === null) {
            throw new Error("Id, Name e Balance são obrigatórios");
        }

        account = await AccountService.updateAccount(account);

        logger.info(`PUT /account - ${JSON.stringify(account)}`);
        res.send(account);
    } catch (err) {
        next(err);
    }
}

async function updateBalance(req, res, next) {
    try {
        let account = req.body;

        if (!account.id || account.balance == null) {
            throw new Error("Id e Balance são obrigatórios");
        }
        account = await AccountService.updateBalance(account);

        logger.info(`PATCH /account/updateBalance - ${JSON.stringify(account)}`);
        res.send(account);
    } catch (err) {
        next(err);
    }
};

export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    updateAccount,
    updateBalance
};
