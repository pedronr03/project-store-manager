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
const connection = require("../../../../models/connection");

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

      const insertId = 3;

      before(() => {
        sinon.stub(productsModel, 'getById')
          .onFirstCall().resolves(productDub1)
          .onSecondCall().resolves(productDub2);
        sinon.stub(salesModel, 'create').resolves(insertId);
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
        sinon.stub(productsModel, 'getById')
          .onFirstCall().resolves(null)
          .onSecondCall().resolves(salesItems[1]);
      });

      after(() => {
        productsModel.getById.restore();
      });

      it('Deve retornar um erro.', () => {
        return expect(salesService.create(salesItems))
          .to.eventually.be.rejectedWith(error.message)
          .and.be.an.instanceOf(CustomError)
          .and.to.includes(error);
      });

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

  describe('Testa o comportamento do service "update"', () => {

    afterEach(() => {
      salesProductModel.getById.restore();
    });

    describe('Quando recebe o saleId e um saleItems válido', () => {

      const saleId = 1;

      const salesItems = [
        {
          "productId": 1,
          "quantity": 10
        },
        {
          "productId": 2,
          "quantity": 50
        }
      ];

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

      const successReturn = {
        saleId,
        itemsUpdated: salesItems,
      };

      before(() => {
        sinon.stub(salesProductModel, 'getById').resolves(saleDub);
        sinon.stub(productsModel, 'getById').resolves(true);
        sinon.stub(salesProductModel, 'deleteBySaleId').resolves();
        sinon.stub(salesProductModel, 'create').resolves();
      });

      after(() => {
        salesProductModel.create.restore();
        salesProductModel.deleteBySaleId.restore();
        productsModel.getById.restore();
      });

      it('Deve retornar um objeto contendo o id da venda e um array contendo os produtos atualizados.', async () => {
        const update = await salesService.update(saleId, salesItems);
        expect(update).to.be.eql(successReturn);
      });

    });

    describe('Quando recebe o saleId inválido', () => {

      const saleId = 500;

      const salesItems = [
        {
          "productId": 1,
          "quantity": 10
        },
        {
          "productId": 2,
          "quantity": 50
        }
      ];

      const error = {
        message: 'Sale not found',
        code: 'NOT_FOUND',
        status: 404
      };

      const saleDub = [];

      before(() => {
        sinon.stub(salesProductModel, 'getById').resolves(saleDub);
      });

      it('Deve retornar um erro.', async () => {
        return expect(salesService.update(saleId, salesItems))
          .to.eventually.be.rejectedWith(error.message)
          .and.be.an.instanceOf(CustomError)
          .and.to.includes(error);
      });

    });

    describe('Quando recebe o saleItems inválido', () => {

      const saleId = 1;

      const salesItems = [
        {
          "productId": 300,
          "quantity": 10
        },
        {
          "productId": 2,
          "quantity": 50
        }
      ];

      const error = {
        message: 'Product not found',
        code: 'NOT_FOUND',
        status: 404
      };

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
        sinon.stub(productsModel, 'getById').resolves(false);
      });

      after(() => {
        productsModel.getById.restore();
      });

      it('Deve retornar um erro.', async () => {
        return expect(salesService.update(saleId, salesItems))
          .to.eventually.be.rejectedWith(error.message)
          .and.be.an.instanceOf(CustomError)
          .and.to.includes(error);
      });

    });

  });

  describe('Testa o comportamento do service "deleteSale"', () => {

    afterEach(() => {
      salesProductModel.getById.restore();
    });

    describe('Quando recebe um saleId válido', () => {

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
        sinon.stub(salesModel, 'deleteSale').resolves();
        sinon.stub(salesProductModel, 'getById').resolves(saleDub);
      });

      after(() => {
        salesModel.deleteSale.restore();
      });

      it('Deve chamar o model "deleteSale".', async () => {
        await salesService.deleteSale(saleId);
        expect(salesModel.deleteSale.calledWith(saleId)).to.be.true;
      });

    });

    describe('Quando recebe um saleId inválido', () => {

      const saleId = 500;

      const saleDub = [];

      const error = {
        message: 'Sale not found',
        code: 'NOT_FOUND',
        status: 404
      };

      before(() => {
        sinon.stub(salesProductModel, 'getById').resolves(saleDub);
      });

      it('Deve chamar o model "deleteSale".', async () => {
        return expect(salesService.deleteSale(saleId))
          .to.eventually.be.rejectedWith(error.message)
          .and.be.an.instanceOf(CustomError)
          .and.to.includes(error);
      });

    });

  });

});