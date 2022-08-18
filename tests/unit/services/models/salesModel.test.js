const { expect } = require("chai");
const sinon = require('sinon');

const connection = require('../../../../models/connection');
const salesModel = require('../../../../models/Sales');

describe('Testa o comportamento da camada salesModel.', () => {

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
        const saleProductId = await salesModel.create(productDub);
        expect(saleProductId).to.be.equal(insertId);
      })

    })

  });

});