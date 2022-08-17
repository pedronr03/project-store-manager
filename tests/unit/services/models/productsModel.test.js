const { expect } = require("chai");
const sinon = require('sinon');

const connection = require('../../../../models/connection');
const productsModel = require('../../../../models/Products');

describe('Testa o comportamento da camada productsModel.', () => {

  describe('Testa o comportamento do model "getAll"', () => {

    afterEach(() => {
      connection.execute.restore();
    });

    describe('Quando a tabela está populada', () => {

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
        const dbReturn = [productsDub];
        sinon.stub(connection, 'execute').resolves(dbReturn);
      });

      it('Deve retornar um array contendo os itens da tabela.', async () => {
        const products = await productsModel.getAll();
        expect(products).to.be.equal(productsDub);
      });

    });

    describe('Quando a tabela está vazia', () => {
      const productsDub = [];

      before(() => {
        const dbReturn = [productsDub];
        sinon.stub(connection, 'execute').resolves(dbReturn);
      });

      it('Deve retornar um array vazio.', async () => {
        const products = await productsModel.getAll();
        expect(products).to.be.equal(productsDub);
      });

    });

  });

  describe('Testa o comportamento do model "getById"', () => {

    afterEach(() => {
      connection.execute.restore();
    });

    describe('Quando não existe um item com o Id recebido', () => {

      before(() => {
        const dbReturn = [[]];
        sinon.stub(connection, 'execute').resolves(dbReturn);
      });

      it('Deve retornar null.', async () => {
        const id = 100;
        const product = await productsModel.getById(id);
        expect(product).to.be.null;
      });

    });

    describe('Quando existe um item com o Id recebido', () => {

      const productDub = {
        id: 2,
        name: "Traje de encolhimento",
      };

      before(() => {
        const dbReturn = [[productDub]];
        sinon.stub(connection, 'execute').resolves(dbReturn);
      });

      it('Deve retornar o item.', async () => {
        const id = 2;
        const product = await productsModel.getById(id);
        expect(product).to.be.equal(productDub);
      });

    });

  });

});

