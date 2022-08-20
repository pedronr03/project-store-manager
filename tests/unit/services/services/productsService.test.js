const chai = require("chai");
const chaisAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const { expect } = chai;
chai.use(chaisAsPromised);

const productsModel = require('../../../../models/Products');
const productsService = require('../../../../services/productsService');
const CustomError = require('../../../../errors/CustomError');

describe('Testa o comportamento da camada productsService.', () => {

  describe('Testa o comportamento do service "getAll"', () => {

    afterEach(() => {
      productsModel.getAll.restore();
    });

    describe('Quando a tabela está populada', () => {

      const productsDub = [
        {
          id: 1,
          name: 'Martelo de Thor',
        },
        {
          id: 2,
          name: 'Traje de encolhimento',
        }
      ];

      before(() => {
        sinon.stub(productsModel, 'getAll').resolves(productsDub);
      });

      it('Deve retornar um array contendo os itens da tabela.', async () => {
        const products = await productsService.getAll();
        expect(products).to.be.equal(productsDub);
      });

    });

    describe('Quando a tabela está vazia', () => {
      const productsDub = [];

      before(() => {
        sinon.stub(productsModel, 'getAll').resolves(productsDub);
      });

      it('Deve retornar um array vazio.', async () => {
        const products = await productsService.getAll();
        expect(products).to.be.equal(productsDub);
      });

    });

  });

  describe('Testa o comportamento do service "getAll"', () => {

    afterEach(() => {
      productsModel.getById.restore();
    });

    describe('Quando não existe um item com o Id recebido', () => {

      const error = {
        message: 'Product not found',
        code: 'NOT_FOUND',
        status: 404
      };

      before(() => {
        sinon.stub(productsModel, 'getById').resolves(null);
      });

      it('Deve retornar um error.', () => {
        return expect(productsService.getById(100))
          .to.eventually.be.rejectedWith(error.message)
          .and.be.an.instanceOf(CustomError)
          .and.to.includes(error);
      });

    });

    describe('Quando existe um item com o Id recebido', () => {

      const productDub = {
        id: 2,
        name: 'Traje de encolhimento',
      };

      before(() => {
        sinon.stub(productsModel, 'getById').resolves(productDub);
      });

      it('Deve retornar o item.', async () => {
        const product = await productsService.getById(2);
        expect(product).to.be.equal(productDub);
      });

    });

  });

  describe('Testa o comportamento do service "create"', () => {

    afterEach(() => {
      productsModel.create.restore();
    });

    describe('Quando recebe um "name" válido', () => {

      const insertId = 1;

      const newProductDub = {
        id: insertId,
        name: 'Capa da invisibilidade'
      };

      before(() => {
        sinon.stub(productsModel, 'create').resolves(insertId);
      });

      it('Deve retornar um objeto contendo a chave name e id do respectivo produto adicionado.', async () => {
        const newProduct = await productsService.create(newProductDub.name);
        expect(newProduct).to.be.eqls(newProductDub);
      });

    });

  });

  describe('Testa o comportamento do service "update"', () => {

    describe('Quando recebe name e id válido.', () => {

      const updateDub = {
        id: 1,
        name: 'Capa da invisibilidade'
      };

      const productDub = {
        "id": 1,
        "name": "Martelo de Thor",
      };

      before(() => {
        sinon.stub(productsModel, 'update').resolves();
        sinon.stub(productsModel, 'getById').resolves(productDub);
      });

      after(() => {
        productsModel.update.restore();
        productsModel.getById.restore();
      });

      it('Deve retornar um objeto contendo a chave name e id.', async () => {
        const update = await productsService.update(updateDub.name, updateDub.id);
        expect(update).to.be.eql(updateDub);
      });

    });

    describe('Quando recebe um id inválido.', () => {

      const updatedProductDub = {
        id: 10,
        name: 'Capa da invisibilidade'
      };

      const error = {
        message: 'Product not found',
        code: 'NOT_FOUND',
        status: 404
      };

      before(() => {
        sinon.stub(productsModel, 'getById').resolves(null);
      });

      after(() => {
        productsModel.getById.restore();
      });

      it('Deve retornar um erro.', async () => {
        return expect(productsService.update(updatedProductDub.name, updatedProductDub.id))
          .to.eventually.be.rejectedWith(error.message)
          .and.be.an.instanceOf(CustomError)
          .and.to.includes(error);
      });

    });

  });

  describe('Testa o comportamento do service "deleteProduct"', () => {

    describe('Quando recebe um id válido.', () => {

      const productDub = {
        "id": 1,
        "name": "Martelo de Thor",
      };

      const deleteId = 1;

      before(() => {
        sinon.stub(productsModel, 'deleteProduct').resolves();
        sinon.stub(productsModel, 'getById').resolves(productDub);
      });

      after(() => {
        productsModel.getById.restore();
        productsModel.deleteProduct.restore();
      });

      it('Deve retornar um objeto contendo a chave name e id.', async () => {
        await productsService.deleteProduct(deleteId);
        expect(productsModel.deleteProduct.calledWith(deleteId)).to.be.true;
      });

    });

    describe('Quando recebe um id inválido.', () => {

      const deleteId = 500;

      const error = {
        message: 'Product not found',
        code: 'NOT_FOUND',
        status: 404
      };

      before(() => {
        sinon.stub(productsModel, 'getById').resolves(null);
      });

      after(() => {
        productsModel.getById.restore();
      });

      it('Deve retornar um erro.', async () => {
        return expect(productsService.deleteProduct(deleteId))
          .to.eventually.be.rejectedWith(error.message)
          .and.be.an.instanceOf(CustomError)
          .and.to.includes(error);
      });

    });

  });

  describe('Testa o comportamento do service "search"', () => {

    afterEach(() => {
      productsModel.search.restore();
    });

    describe('Quando recebe uma query válida', () => {

      const query = 'Thor';

      const productsDub = [
        {
          id: 1,
          name: 'Martelo de Thor',
        }
      ];

      before(() => {
        sinon.stub(productsModel, 'search').resolves(productsDub);
      });

      it('Deve retornar um array contendo os produtos baseados na query.', async () => {
        const search = await productsService.search(query);
        expect(search).to.be.equal(productsDub);
      });

    });

    describe('Quando recebe uma query inválida', () => {

      const query = undefined;

      const productsDub = [
        {
          id: 1,
          name: 'Martelo de Thor',
        },
        {
          id: 2,
          name: 'Traje de encolhimento',
        }
      ];

      before(() => {
        sinon.stub(productsModel, 'search').resolves(productsDub);
      });

      it('Deve retornar um array contendo todos os produtos.', async () => {
        const search = await productsService.search(query);
        expect(search).to.be.equal(productsDub);
      });

    });

  });

});