const chai = require("chai");
const chaisAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const { expect } = chai;
chai.use(chaisAsPromised);

const salesModel = require('../../../../models/Sales');
const salesProductModel = require('../../../../models/SalesProducts');
const productsModel = require('../../../../models/Products');
const salesService = require('../../../../services/salesService');
const CustomError = require('../../../../errors/CustomError');

describe('Testa o comportamento da camada salesService.', () => {

  describe('Testa o comportamento do service "create"', () => {

    describe('Quando recebe uma lista de produtos válida', () => {

      const salesItems = [
        {
          "productId": 1,
          "quantity": 1
        },
        {
          "productId": 2,
          "quantity": 5
        }
      ];

      const productDub1 = {
        "id": 1,
        "name": "Martelo de Thor",
      };

      const productDub2 = {
        "id": 2,
        "name": "Traje de encolhimento",
      };

      const successReturn = {
        id: 3,
        itemsSold: salesItems,
      };

      before(() => {
        sinon.stub(productsModel, 'getById')
          .onFirstCall().resolves(productDub1)
          .onSecondCall().resolves(productDub2);
        sinon.stub(salesModel, 'create').resolves(3);
        sinon.stub(salesProductModel, 'create').resolves();
      });

      after(() => {
        salesModel.create.restore();
        salesProductModel.create.restore();
        productsModel.getById.restore();
      });

      it('Deve retornar um objeto contendo o id da venda e um array contendo os produtos vendidos.', async () => {
        const create = await salesService.create(salesItems);
        expect(create).to.be.eql(successReturn);
      });

    });

    describe('Quando recebe uma lista de produtos inválida', () => {

      const error = {
        message: 'Product not found',
        code: 'NOT_FOUND',
        status: 404
      };

      const salesItems = [
        {
          "productId": -211,
          "quantity": 1
        },
        {
          "productId": 2,
          "quantity": 5
        }
      ];

      before(() => {
        sinon.stub(salesService, 'validateCreate').resolves(false);
      });

      after(() => {
        salesService.validateCreate.restore();
      });

      it('Deve retornar um erro.', () => {
        return expect(salesService.create(salesItems))
          .to.eventually.be.rejectedWith(error.message)
          .and.be.an.instanceOf(CustomError)
          .and.to.includes(error);
      })

    });

  });

  describe('Testa o comportamento do service "getAll"', () => {

    afterEach(() => {
      salesProductModel.getAll.restore();
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
        sinon.stub(salesProductModel, 'getAll').resolves(salesDub);
      });

      it('Deve retornar um array contendo todas as vendas.', async () => {
        const sales = await salesService.getAll();
        expect(sales).to.be.equal(salesDub);
      });

    });

    describe('Quando a tabela não está populada', () => {

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
        sinon.stub(salesProductModel, 'getAll').resolves(salesDub);
      });

      it('Deve retornar um array vázio.', async () => {
        const sales = await salesService.getAll();
        expect(sales).to.be.equal(salesDub);
      });

    });

  });

  describe('Testa o comportamento do service "getById"', () => {

    afterEach(() => {
      salesProductModel.getById.restore();
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
        sinon.stub(salesProductModel, 'getById').resolves(saleDub);
      });

      it('Deve retornar um array com produtos da venda do id recebido. ', async () => {
        const sale = await salesService.getById(saleId);
        expect(sale).to.be.equal(saleDub);
      });

    });

    describe('Quando recebe um id inválido', () => {

      const saleId = 5;

      const saleDub = [];

      const error = {
        message: 'Sale not found',
        code: 'NOT_FOUND',
        status: 404
      };

      before(() => {
        sinon.stub(salesProductModel, 'getById').resolves(saleDub);
      });

      it('Deve retornar um erro. ', async () => {
        return expect(salesService.getById(saleId))
          .to.eventually.be.rejectedWith(error.message)
          .and.be.an.instanceOf(CustomError)
          .and.to.includes(error);
      });

    });

  });

});