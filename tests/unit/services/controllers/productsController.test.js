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

  describe('Testa o comportamento do controller "create"', () => {

    afterEach(() => {
      productsService.create.restore();
    });

    describe('Quando o corpo da requisição recebe um "name" válido', () => {

      const request = {};
      const response = {};

      const insertId = 1;

      const newProductDub = {
        id: insertId,
        name: 'Capa da invisibilidade'
      };

      before(() => {
        sinon.stub(productsService, 'create').resolves(newProductDub);
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.body = { name: 'Capa da invisibilidade' };
      });

      it('Deve retornar o status "201", e um json contendo a chave name e id do respectivo produto adicionado.', async () => {
        const STATUS_CODE = 201;
        await productsController.create(request, response);
        expect(response.status.calledWith(STATUS_CODE)).to.be.true;
        expect(response.json.calledWith(newProductDub)).to.be.true;
      });

    });

  });

  describe('Testa o comportamento do controller "update"', () => {

    afterEach(() => {
      productsService.update.restore();
    });

    describe('Quando o corpo da requisição recebe um "name" válido e um "id" no parâmetro', () => {

      const request = {};
      const response = {};

      const insertId = 1;

      const updatedProductDub = {
        id: insertId,
        name: 'Capa da invisibilidade'
      };

      before(() => {
        sinon.stub(productsService, 'update').resolves(updatedProductDub);
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.body = { name: 'Capa da invisibilidade' };
        request.params = { id: insertId };
      });

      it('Deve retornar o status "201", e um json contendo a chave name e id do respectivo produto adicionado.', async () => {
        const STATUS_CODE = 200;
        await productsController.update(request, response);
        expect(response.status.calledWith(STATUS_CODE)).to.be.true;
        expect(response.json.calledWith(updatedProductDub)).to.be.true;
      });

    });

  });

});