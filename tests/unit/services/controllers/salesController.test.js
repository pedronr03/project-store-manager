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

    })

  });

});