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

      it('Deve retornar um error.', async () => {
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

});