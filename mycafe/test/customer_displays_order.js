'use strict';

var chai = require('chai'),
expect = chai.expect,
sinon = require('sinon'),
newStorage = require('./support/storageDouble'),
order = require('./support/examples/orders'),
orderSystemWith = require('../lib/orders');

chai.use(require("chai-as-promised"));
var Q = require('q');

   describe('Customer displays order', function () {
     /*
     beforeEach(function () {
       this.orderDAO = {
         byId: sinon.stub()
       };
       this.orderSystem = orderSystemWith(this.orderDAO);
     });
     */
      beforeEach(function () {
       this.orderStorage = newStorage();
       this.orderSystem = orderSystemWith(this.orderStorage.dao());
      });
     context('Given that the order is empty', function () {
       /*
       //ver.1 simple system
       beforeEach(function () {
         //
         //In Mocha, the this keyword will point to the same object throughout all the test
         this.orderId = 'some empty order id';
         //
         //orderDAOにorderを保存すると仮定
         //withArgsでsinon.stub()のargsを指定
         //returnsで指定したargsのreturnを指定
         this.orderDAO.byId.withArgs(this.orderId).returns([]);
         //
         //The important point here is that
         //the tests force us to model the shape of the object we return as a response.
         this.result = this.orderSystem.display(this.orderId);

       });
       */
       /*
       //ver.2 , apply async system
       beforeEach(function () {
         this.orderId = 'some empty order id';
         this.orderDAO.byId
         .withArgs(this.orderId)
         .returns(promiseFor([]));
         this.result = this.orderSystem.display(this.orderId);
       });
       */
       //ver.3 use tenative DAO in storageDouble.js
        beforeEach(function () {
            this.order = this.orderStorage.alreadyContains(order.empty());
            this.result = this.orderSystem.display(this.order.id);
         });
       //
       //define a response that will be a simple JSON object
       //with the items, totalPrice, and actions fields.
       it('will show no order items', function () {
         //
         //relation between promise-mocha and promise-chai
         //expect(this.result).to.have.property('items')
         //.that.is.empty;
         //===
         //add the eventually chain and RETURN the resulting assertion
         return expect(this.result).to.eventually.have.property('items')
         .that.is.empty;
       });
       it('will show 0 as total price', function(){
         //
         //expect(this.result).to.have.property('totalPrice')
         //.that.is.equal(0);
         //===
         return expect(this.result).to.eventually.have.property('totalPrice')
         .that.is.equal(0);
       });
       it('will only be possible to add a beverage', function(){
         return expect(this.result).to.eventually.have.property('actions')
        .that.is.deep.equal([
          {
          action: 'append-beverage',
               target: this.order.id,//target:'some empty order id'
               parameters: {
                 beverageRef: null,
                 quantity: 0 }
          }
        ]);
       });
      });
      context('Given that the order contains beverages', function() {
        //
        //We simply stored the setup data in the runtime context
        //so that we can reference it from both the tests and the setup.
        //
        /*
        beforeEach(function () {
          this.orderId = 'some non empty order id';
          this.expresso = {
            id: "expresso id",
            name: "Expresso",
            price: 1.50
          };
          this.mocaccino = {
            id: "mocaccino id",
            name: "Mocaccino",
            price: 2.30
          };
          this.orderItems = [
            { beverage: this.expresso, quantity: 1},
            { beverage: this.mocaccino, quantity: 2}
          ];
  //---------------------------------------------------------------------------
          //
          //store order information in the DAO.
          this.orderDAO.byId
           .withArgs(this.orderId)
           //
           //returns の Async ver.
           .callsArgWithAsync(1, null, this.orderItems);
  //---------------------------------------------------------------------------
       this.result = this.orderSystem.display(this.orderId);
       });
       */
    beforeEach(function () {
         this.expresso = {
           id: "expresso id",
           name: "Expresso",
           price: 1.50
         };
         this.mocaccino = {
           id: "mocaccino id",
           name: "Mocaccino",
           price: 2.30
         };
      this.order = this.orderStorage.alreadyContains(order.withItems([
               { beverage: 'expresso', quantity: 1},
               { beverage: 'mocaccino', quantity: 2} ]
             ));
      this.result = this.orderSystem.display(this.order.id);
    });

       //
       //its below are all pending
       //
       it('will show one item per beverage', function(){
         return expect(this.result).to.eventually.have.property('items')
          .that.is.deep.equal(this.order.data);
       });
       it('will show the sum of the unit prices as total price', function(){
         return expect(this.result).to.eventually.have.property('totalPrice')
          .that.is.equal(6.10);
       });
       it('will be possible to place the order');
       it('will be possible to add a beverage');
       it('will be possible to remove a beverage');
       it('will be possible to change the quantity of a beverage');
     });
     context('Given that the order has pending messages', function(){
       it('will show the pending messages');
       it('there will be no more pending messages');
     });
   });


//<ROLE>_<ACTION>_<ENTITY>
//where <ROLE> is the name of the kind of user that performs the actions,
//<ACTION> is the user operation represented by this feature,
//and <ENTITY> is the main information entity that is affected by the feature action
//


function promiseFor(value) {
     return Q.delay(1).then(function () {
       return value;
     });
}
   function failingPromiseWith(error) {
     return Q.delay(1).then(function () {
       throw error;
     });
}
