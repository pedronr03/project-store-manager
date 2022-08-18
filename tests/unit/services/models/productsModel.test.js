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
          name: 'Martelo de Thor',
        },
        {
          id: 2,
          name: 'Traje de encolhimento',
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
        name: 'Traje de encolhimento',
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

  describe('Testa comportamento do model "create"', () => {

    afterEach(() => {
      connection.execute.restore();
    });

    describe('Quando recebe um "name" válido', () => {

      const insertId = 1;

      before(() => {
        const dbReturn = [{ insertId }];
        sinon.stub(connection, 'execute').resolves(dbReturn);
      });

      it('Deve retornar o id do item adicionado.', async () => {
        const productName = 'Capa da invisibilidade';
        const newProductId = await productsModel.create(productName);
        expect(newProductId).to.be.equals(insertId);
      })

    });

  });

  describe('Testa o comportamento do model "update"', () => {

    afterEach(() => {
      connection.execute.restore();
    });

    describe('Quando recebe um name e um id válido', () => {

      const updateDub = {
        name: 'Manto da invisibilidade',
        id: 1,
      }

      before(() => {
        sinon.stub(connection, 'execute').resolves();
      });

      it('Deve executar a query de update.', async () => {
        const query = `UPDATE StoreManager.products
        SET name = ?
        WHERE id = ?;`;
        const params = [updateDub.name, updateDub.id];
        await productsModel.update(updateDub.name, updateDub.id);
        expect(connection.execute.calledWith(query, params));
      });

    });

  });

});

