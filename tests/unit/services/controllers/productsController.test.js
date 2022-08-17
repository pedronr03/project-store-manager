const sinon = require('sinon');
const { expect } = require("chai");

const productsService = require('../../../../services/productsService');
const productsController = require('../../../../controllers/productsController');

describe('Testa o comportamento da camada productsController.', () => {

  describe('Testa o comportamento do controller "getAll"', () => {

    afterEach(() => {
      productsService.getAll.restore();
    });

    describe('Quando a tabela está populada', () => {

      const request = {};
      const response = {};

      const productsDub = [
        {
          id: 1,
          name: "Martelo de Thor",
        },
        {
          id: 2,
          name: "Traje de encolhimento",
        }
      ];

      before(() => {
        sinon.stub(productsService, 'getAll').resolves(productsDub);
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
      });

      it('Deve retornar o status "200" e um json com um array de produtos.', async () => {
        console.log(JSON.stringify(productsService.getAll));
        const STATUS_CODE = 200;
        await productsController.getAll(request, response);
        expect(response.status.calledWith(STATUS_CODE)).to.be.true;
        expect(response.json.calledWith(productsDub)).to.be.true;
      })

    });

    describe('Quando a tabela está vazia', () => {

      const request = {};
      const response = {};

      const productsDub = [];

      before(() => {
        sinon.stub(productsService, 'getAll').resolves(productsDub);
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
      });

      it('Deve retornar o status "200" e um json com um array vázio.', async () => {
        const STATUS_CODE = 200;
        await productsController.getAll(request, response);
        expect(response.status.calledWith(STATUS_CODE)).to.be.true;
        expect(response.json.calledWith(productsDub)).to.be.true;
      })

    });

  });

  describe('Testa o comportamento do controller "getById"', () => {

    afterEach(() => {
      productsService.getById.restore();
    });

    describe('Quando existe um item com o Id recebido', () => {

      const request = {};
      const response = {};

      const productDub = {
        id: 2,
        name: "Traje de encolhimento",
      };

      before(() => {
        sinon.stub(productsService, 'getById').resolves(productDub);
        request.params = { id: 2 };
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
      });

      it('Deve retornar o status "200" e um json contendo o produto com o id recebido.', async () => {
        const STATUS_CODE = 200;
        await productsController.getById(request, response);
        expect(response.status.calledWith(STATUS_CODE)).to.be.true;
        expect(response.json.calledWith(productDub)).to.be.true;
      });
    });

  });

});