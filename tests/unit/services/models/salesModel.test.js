const { expect } = require("chai");
const sinon = require('sinon');

const connection = require('../../../../models/connection');
const salesModel = require('../../../../models/Sales');

describe('Testa o comportamento da camada salesModel.', () => {

  describe('Testa o comportamento do model "create"', () => {

    afterEach(() => {
      connection.execute.restore();
    });

    describe('Quando o método é chamado', () => {

      const insertId = 3;

      before(() => {
        const dbReturn = [{ insertId }];
        sinon.stub(connection, 'execute').resolves(dbReturn);
      });

      it('Deve retornar o id da venda criada.', async () => {
        const saleId = await salesModel.create();
        expect(saleId).to.be.equal(insertId);
      })

    })

  });

});