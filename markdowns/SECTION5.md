1. __Describe cart components__
   
   Cart can be break down into multiple components, such as 
   - Mini Cart<br/>
     Enables the customer to view synopsis of the cart, such as number of different product, quantity and price.<br/>
   - Cross-sell Products Recommendation (__Market Basket Analysis__ in Data Science)<br/>
     In full cart page, products in the cart which are configured with cross-sell product(s) will be recommended to the customer.<br/> 
   - Quote Lifetime<br/>
     This component will retained the price of the item based on given X days, by default is 30 days.<br/>
     The seller can only modify the price of the product again after X days upon modifying.
   
   All these components can be configured via __Stores__→__Settings__→__Configuration__→__Sales__→__Checkout__→__Shopping Cart__.

2. __Describe a cart promo rule__
   
   Cart Promo Rule is a type of rule applied to cart level ONLY. To manage the rule, head on to __Marketing__→__Promotions__→__Cart Price Rules__. Cart Promo Rule can either be apply automatically, or via coupon.

   For each rule, we can apply unique __conditions__ and __actions__.

   For this demo, here's the sample cart with items:
   
   <center>

   | Product | Price | Quantity | Row Total |
   |------|------|------|------|
   |Item 1|RM 20.00|3|RM 60.00|
   |Item 2|RM 8.00|1|RM 8.00|
   |||Subtotal|RM 68.00|
   |||Shipping Amount|RM 14.50|
   |||__Grand Total__|__RM 82.50__|
   </center>

   Under the Conditions section, on the root level, we can select if the following conditions must be apply based on __ANY__ or __ALL__ upon __true__ OR __false__ conditions.
   >![Conditions](images/s5_cart_rule_conditions.png)

   We will set the Conditions for the demo as below, so that only item in cart which base price is greater or equals to RM 10 will be targeted. In this case, Item 1 will fulfill the condition.
   >![Conditions](images/s5_cart_rule_conditions_sample.png)

   Under the Actions section, we have 4 options to apply from, 
   >![Actions](images/s5_cart_rule_actions.png)
   - Percent of product price discount<br/>
     Using base price of the product and apply percentage discount on top of it.<br/>
     Item 1: RM 20.00 - (RM 20.00 * __10%__) = RM 18.00<br/>
     Item 2: Does not fulfill condition = RM 8.00
   - Fixed amount discount<br/>
     Using base price of the product and apply flat discount on top of it.<br/>
     Item 1: RM 20.00 - __RM 10.00__ = RM 10.00<br/>
     Item 2: Does not fulfill condition = RM 8.00
   - Fixed amount discount for whole cart<br/>
     Using subtotal of the cart and apply flat deduction on top of it.<br/>
     Subtotal: RM 68.00 - __RM 10.00__ = RM 58.00<br/>
     If __Apply To Shipping Amount__ is enabled, shipping amount will also be target based on this action.<br/>
     Shipping Amount: RM 14.50 - __RM 10.00__ = RM 4.50
   - Buy X Get Y Free (discount amount is Y)<br/>
     Using quantity of product in current cart to indicate if quantity is more than X, remaining amount of Y only will be free.<br/>
     Rule: __Buy 2 Get 1 Free__<br/>
     Quantity (Q) of Item 1 in Cart: 3<br/>
     Buy 2 is fulfilled, since 3 quantities is in the cart.<br/>
     Get 1 Free is also fulfilled, since 3 - X = 1.

    After setting up the option, we can select either to __Discard Subsequent Rules__, which means to ignore all Cart Promo Rule(s) except this new rule. Once done, click on Save.

3. __Given a scenario, describe basic checkout modifications__
   
   Frontend UI can be easily customized using UI components. The default behavior of checkout in Magento as of now included two steps, which are
   >Shipping Information (Select shipping method)<br/>
   >Review and Payment Information (Review cart and select payment method)

   - Add new zip code input masking<br/>
     To provide new input masking for zip code,
     ```
     etc
     |--zip_codes.xml
     ```
     Inside the __`zip_codes.xml`__, specify the new regex pattern for masking the zip code.
     ```xml
     <zip countryCode="MY">
        <codes>
          <code id="pattern_2" active="true" example="123456">^[0-9]{6}$</code>
        </codes>
     </zip>
     ```

4. __Given a scenario, describe basic usage of quote data__
   
   Quote data carries cart level information. Quote data can be used to perform all actions which are related to cart, such as
   >Add item to Cart<br/>
   >Remove item from Cart<br/>
   >Update item in Cart<br/>
   >Display Mini Cart<br/>
   >Checkout with the Cart<br/>
   >Manage Shipping and Billing Address

   To perform action with Quote from server-side, we can
   ```
   use Magento\Quote\Model\Quote; 

   protected $_quote;

   public function __construct(
      Quote $quote
   ) {
      $this->_quote = $quote;
   }//end __construct()

   $quote = $this->_quote->load($quoteId);
   $quote->getAllVisibleItems(); // Get list of items in the cart
   $quote->getShippingAddress(); // Get shipping address
   $quote->addItem();            // Add item to cart
   $quote->removeAllItems();     // Remove all items from the cart
   $quote->getPayment();         // Retrieve payment object  
   ```

   To perform action with Quote from client-side, which has very limited functionality only, we can
   ```js
    define([
        'jquery',
        'Magento_Checkout/js/model/quote'
    ], function ($, quote) {
        'use strict';

        quote.getItems();           // Get list of items in the cart
        quote.shippingAddress();    // Get shipping address
        quote.getQuoteId();         // Get quote ID
        quote.getTotals();          // Get grand total of the cart
        quote.getPaymentMethod();   // Get payment method of the cart
    });
   ```

5. __Given a scenario, configure the payment and shipping methods__
   
   - Scenario #1: Store now supports DHL as new shipping method and Cash On Delivery (COD) as new payment method
     - Payment Methods<br/>
       Head on to __Stores__→__Settings__→__Configuration__→__Sales__→__Payment Methods__→__Cash On Delivery Payment__ and set __Enabled__ as Yes it if required.
       >![Payment Method - Cash On Delivery](images/s5_payment_cod.png)

     - Shipping Methods<br/>
       Head on to __Stores__→__Settings__→__Configuration__→__Sales__→__Shipping Methods__→__DHL__ and set __Enabled for Checkout__ as Yes if required. __Enabled for RMA__ is used for return purposes.
       >![Shipping Method - DHL](images/s5_shipping_dhl.png)

6. __Given a scenario, configure tax rules, currencies, cart, and/or checkout__
   
   - Scenario #1: Malaysia now taxes E-commerce platform for additional 1%.<br/>
        - Tax Rules<br/>
          Tax Rules can be configured via __Stores__→__Taxes__→__Tax Rules__. 
          >![Tax Rule](images/s5_tax_rule.png)
          
          Tax Rate can be created on the fly, by clicking on __Add New Tax Rate__.
          >![Tax Rate](images/s5_tax_rate.png)

        - Currencies<br/>
          Head on to __Stores__→__Settings__→__Configuration__→__General__→__Currency Setup__→__Currency Options__. In this section, Base Currency and Default Display Currency should be set to __Malaysian Ringgit__. Once done, save it.

          Then head on to __Stores__→__Currency__→__Currency Symbol__ to specify the currency symbol, which is __RM__.

        - Cart/Checkout<br/>
          On cart level, tax is now visible after selecting shipping method.
          >![Order Summary](images/s5_order_summary.png)

          ```
          Tax = Cart Subtotal - Discount * Tax Rate
              = RM 1300.00 - RM 195.00 * 1%
              = RM 1105.00 * 1%
              = RM 11.05
          ```
