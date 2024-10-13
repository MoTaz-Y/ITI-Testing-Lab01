
const User = require("../user");

// user test cases
describe("user", () => {
  let user;
  beforeEach(() => {
    user = new User("ameer", "123456", "tanta");
  });
  describe("user value", () => {
    it("name", () => {
      expect(user.name).toBe("ameer");
    });
    it("password", () => {
      expect(user.password).toBe("123456");
    });
    it("address", () => {
      expect(user.address).toBe("tanta");
    });
  });

  // add to cart test cases
  describe("add to cart", () => {
    it("add a product to cart", () => {
      let product = {
        name: "prod1",
        price: 2000,
      };
      user.addToCart(product);
      expect(user.cart[0]).toEqual(product);
    });
    it("add products to cart", () => {
      let product1 = {
        name: "prod1",
        price: 2000,
      };
      let product2 = {
        name: "prod2",
        price: 1000,
      };
      user.addToCart(product1);
      user.addToCart(product2);
      expect(user.cart).toEqual([product1, product2]);
      expect(user.cart).toHaveSize(2);
    });
  });

  // calculate total cart price test cases
  describe("calculate total cart price", () => {
    it("calculate total cart price", () => {
      let product1 = {
        name: "prod1",
        price: 2000,
      };
      let product2 = {
        name: "prod2",
        price: 1000,
      };
      user.addToCart(product1);
      user.addToCart(product2);
      expect(user.calculateTotalCartPrice()).toEqual(3000);
    });
    it("calculate total price of empty cart", () => {
      expect(user.calculateTotalCartPrice()).toEqual(0);
    });
  });

  // checkout test cases
  describe("checkout", () => {
    it("checkout", () => {
      let product1 = {
        name: "prod1",
        price: 2000,
      };
      let product2 = {
        name: "prod2",
        price: 1000,
      };
      user.addToCart(product1);
      user.addToCart(product2);
      let paymentService = jasmine.createSpyObj([
        "setPaymentInfo",
        "returnBack",
        "isVerified",
      ]);
      let deliveryService = jasmine.createSpyObj(["shipping"]);
      user.checkout(paymentService, deliveryService);
      expect(paymentService.setPaymentInfo).toHaveBeenCalled();
      expect(paymentService.returnBack).toHaveBeenCalled();
      expect(paymentService.isVerified).toHaveBeenCalled();
    
    });

    // when is verified
    it("when is verified", () => {
      let product1 = {
        name: "prod1",
        price: 2000,
      };
      let product2 = {
        name: "prod2",
        price: 1000,
      };
      user.addToCart(product1);
      user.addToCart(product2);
      let paymentService = jasmine.createSpyObj([
        "setPaymentInfo",
        "returnBack",
        "isVerified",
      ]);
      paymentService.isVerified.and.returnValue(true);
      let deliveryService = jasmine.createSpyObj(["shipping"]);
      user.checkout(paymentService, deliveryService);
      expect(deliveryService.shipping).toHaveBeenCalledWith(
        user.address,
        user.cart
      );
    });

    // when is not verified
    it("when is not verified", () => {
      let product1 = {
        name: "prod1",
        price: 2000,
      };
      let product2 = {
        name: "prod2",
        price: 1000,
      };
      user.addToCart(product1);
      user.addToCart(product2);
      let paymentService = jasmine.createSpyObj([
        "setPaymentInfo",
        "returnBack",
        "isVerified",
      ]);
      paymentService.isVerified.and.returnValue(false);
      let deliveryService = jasmine.createSpyObj(["shipping"]);
      user.checkout(paymentService, deliveryService);
      expect(deliveryService.shipping).not.toHaveBeenCalled();
    });
  });
});
