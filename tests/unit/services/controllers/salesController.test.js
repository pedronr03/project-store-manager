const sinon = require('sinon');
const { expect } = require("chai");

const salesService = require('../../../../services/salesService');
const salesController = require('../../../../controllers/salesController');

describe('Testa o comportamento da camada salesController.', () => {

  describe('Testa o comportamento do controller "create"', () => {

    afterEach(() => {
      salesService.create.restore();
    });

    describe('Quando recebe um array de produtos no body da requisição', () => {

      const request = {};
      const response = {};

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

      const successReturn = {
        id: 3,
        itemsSold: salesItems,
      };

      before(() => {
        sinon.stub(salesService, 'create').resolves(successReturn);
        request.body = salesItems;
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
      });

      it('Deve retornar o status "201" com um json contendo um objeto com a chave id e itemsSold.', async () => {
        const STATUS_CODE = 201;
        await salesController.create(request, response);
        expect(response.status.calledWith(STATUS_CODE)).to.be.true;
        expect(response.json.calledWith(successReturn)).to.be.true;
      })

    });

  });

  describe('Testa o comportamento do controller "getAll"', () => {

    afterEach(() => {
      salesService.getAll.restore();
    });

    describe('Quando a tabela está populada', () => {

      const request = {};
      const response = {};

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
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        sinon.stub(salesService, 'getAll').resolves(salesDub);
      });

      it('Deve retornar o status "200" com um json contendo um array com todas as vendas.', async () => {
        const STATUS_CODE = 200;
        await salesController.getAll(request, response);
        expect(response.status.calledWith(STATUS_CODE)).to.be.true;
        expect(response.json.calledWith(salesDub)).to.be.true;
      });

    });

    describe('Quando a tabela não está populada', () => {

      const request = {};
      const response = {};

      const salesDub = [];

      before(() => {
        sinon.stub(salesService, 'getAll').resolves(salesDub);
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
      });

      it('Deve retornar o status "200" com um json contendo um array vázio.', async () => {
        const STATUS_CODE = 200;
        await salesController.getAll(request, response);
        expect(response.status.calledWith(STATUS_CODE)).to.be.true;
        expect(response.json.calledWith(salesDub)).to.be.true;
      });

    });

  });

  describe('Testa o comportamento do controller "getById"', () => {

    afterEach(() => {
      salesService.getById.restore();
    });

    describe('Quando recebe um id válido', () => {

      const request = {};
      const response = {};

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
        sinon.stub(salesService, 'getById').resolves(saleDub);
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = { id: 1 };
      });

      it('Deve retornar o status "200" com um json contendo um array com produtos da venda do id recebido.', async () => {
        const STATUS_CODE = 200;
        const test = await salesService.getById();
        await salesController.getById(request, response);
        expect(response.status.calledWith(STATUS_CODE)).to.be.true;
        expect(response.json.calledWith(saleDub)).to.be.true;
      });

    });

  });

});