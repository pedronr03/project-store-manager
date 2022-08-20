const { expect } = require("chai");
const sinon = require('sinon');

const connection = require('../../../../models/connection');
const salesProductsModel = require('../../../../models/SalesProducts');

describe('Testa o comportamento da camada salesProductsModel.', () => {

  describe('Testa o comportamento do model "create"', () => {

    afterEach(() => {
      connection.execute.restore();
    });

    describe('Quando recebe um objeto com as informações do item', () => {

      const productDub = {
        productId: 1,
        quantity: 1,
        saleId: 3
      };

      const insertId = 5;

      before(() => {
        const dbReturn = [{ insertId }];
        sinon.stub(connection, 'execute').resolves(dbReturn);
      });

      it('Deve receber o id do produto adicionado.', async () => {
        const saleProductId = await salesProductsModel.create(productDub);
        expect(saleProductId).to.be.equal(insertId);
      })

    })

  });

  describe('Testa o comportamento do model "getAll"', () => {

    afterEach(() => {
      connection.execute.restore();
    });

    describe('Quando a tabela está populada', () => {

      const salesDub = [
        {
          "saleId": 1,
          "date": "2021-09-09T04:54:29.000Z",
          "productId": 1,
          "quantity": 2
        },
        {
          "saleId": 1,
          "date": "2021-09-09T04:54:54.000Z",
          "productId": 2,
          "quantity": 2
        }
      ];

      before(() => {
        const dbReturn = [salesDub];
        sinon.stub(connection, 'execute').resolves(dbReturn);
      });

      it('Deve retornar um array com todas as vendas.', async () => {
        const sales = await salesProductsModel.getAll();
        expect(sales).to.be.equal(salesDub);
      });

    });

    describe('Quando a tabela não está populada', () => {

      const salesDub = [];

      before(() => {
        const dbReturn = [salesDub];
        sinon.stub(connection, 'execute').resolves(dbReturn);
      });

      it('Deve retornar um array vázio.', async () => {
        const sales = await salesProductsModel.getAll();
        expect(sales).to.be.equal(salesDub);
      });

    });

  });

  describe('Testa o comportamento do model "getById"', () => {

    afterEach(() => {
      connection.execute.restore();
    });

    describe('Quando recebe um id válido', () => {

      const saleId = 1;

      const saleDub = [
        {
          "date": "2021-09-09T04:54:29.000Z",
          "productId": 1,
          "quantity": 2
        },
        {
          "date": "2021-09-09T04:54:54.000Z",
          "productId": 2,
          "quantity": 2
        }
      ];

      before(() => {
        sinon.stub(connection, 'execute').resolves([saleDub]);
      });

      it('deve retornar um array com produtos da venda do id recebido.', async () => {
        const sale = await salesProductsModel.getById(saleId);
        expect(sale).to.be.equal(saleDub);
      });

    });

  });

  describe('Testa o comportamento do model "update"', () => {

    afterEach(() => {
      connection.execute.restore();
    });

    describe('Quando recebe um objeto com as informações do item', () => {

      const productDub = {
        productId: 1,
        quantity: 1,
        saleId: 3
      };

      before(() => {
        sinon.stub(connection, 'execute').resolves();
      });

      it('Deve executar uma query para atualizar o item do banco de dados.', async () => {
        const { productId, saleId, quantity } = productDub;
        const query = `UPDATE StoreManager.sales
        SET product_id = ?,
        quantity = ?
        WHERE sale_id = ?;`;
        const params = [productId, saleId, quantity];
        await salesProductsModel.update(productDub);
        expect(connection.execute.calledWith(query, params));
      });

    });

  });

});