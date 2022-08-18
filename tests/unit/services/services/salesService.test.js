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

      before(() => {
        sinon.stub(productsModel, 'getById')
          .onFirstCall().resolves(productDub1)
          .onSecondCall().resolves(productDub2);
        sinon.stub(salesProductModel, 'create').resolves(3);
        sinon.stub(salesModel, 'create').resolves();
      });

      after(() => {
        salesProductModel.create.restore();
        salesModel.create.restore();
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
        sinon.stub(salesService, 'validateCreate').resolves(false);
      });

      after(() => {
        salesService.validateCreate.restore();
      });

      it('Deve retornar um erro.', () => {
        return expect(salesService.create(salesItems))
          .to.eventually.be.rejectedWith(error.message)
          .and.be.an.instanceOf(CustomError)
          .and.to.includes(error);
      })

    });

  });

});