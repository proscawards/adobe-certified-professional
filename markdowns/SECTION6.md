1. __Identify the basics of category management and products management__
   
   Catalog management can be easily managed via __Catalog__→__Products__ for products and __Catalog__→__Catagories__ for categories.

   Category and product are closely linked to each other, but not depending on each other. Which means each work independently, without the need of the other. 
   
   Both are __Many-to-Many__ relationship. One product can attached to multiple categories, while one category can have multiple products assigned to it.

2. __Describe product types__
   
   In Magento, there are 6 different types of product.
   The default product type will be `Simple Product`.
   
   <center>

   | Product Type | Description | Has Weight? | Can Ship Seperately? |
   |------|------|------|------|
   |Simple Product|Product with Weight|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✓||
   |Configurable Product|Variations of Simple Products|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✓||
   |Grouped Product|Group of Simple Products|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✓||
   |Bundle Product|Selection of Simple Products|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✓|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✓|
   |Virtual Product|Product without Weight|||
   |Downloadable Product|Virtual Product with Downloadable link|||

   </center>

3. __Describe price rules__
   
    Catalog Price Rule is a type of rule applied to product level ONLY. To manage the rule, head on to __Marketing__→__Promotions__→__Catalog Price Rule__.

   For each rule, we can apply unique __conditions__ and __actions__.

   Under the Conditions section, on the root level, we can select if the following conditions must be apply based on __ANY__ or __ALL__ upon __true__ OR __false__ conditions.
   >![Conditions](images/s6_catalog_rule_conditions.png)

   Under the Actions section, we have 4 options to apply from, 
   >![Conditions](images/s6_catalog_rule_actions.png)
   - Apply as percentage of original<br/>
     Using base price of the product and apply percentage discount on top of it.<br/>
     (RM 100 - (RM 100 * __5%__) = RM 95)
   - Apply as fixed amount<br/>
     Using base price of the product and apply flat discount on top of it.<br/>
     (RM 100 - __RM 5__ = RM 95)
   - Adjust final price to this percentage<br/>
     Using base price of the product and calculate final price based on percentage discount.<br/>
     (RM 100 * __5%__ = RM 5)
   - Adjust final price to discount value<br/> 
     Using discount amount as the final price of the product, regardless of original base price of the product.<br/>
     >![Adjust final price to discount value ](images/s6_catalog_rule_discount_amount.png)
    
   After setting up the option, we can select either to __Discard Subsequent Rules__, which means to ignore all Catalog Price Rule(s) except this new rule. Once done, click on Save.

4. __Describe price types__
   
   A product can have multiple price types. From product level, we have access directly to product price, or via Magento's Price DataObject (getPriceModel()),
   ```php
    $product->getPrice();                                   Base price of the Product in default store currency
    $product->getPriceModel()->getBasePrice();              Base price of the Product in selected store currency      
    $product->getFinalPrice();                              Final price of the Product with Tax and Discount
    $product->getMinimalPrice();                            Minimal price of the Product
    $product->getSpecialPrice();                            Special price of the Product within a given timeframe
    $product->getTierPrice();                               Tier price of the Product                             
    $product->getTierPrices();                              List of tier prices of the Product
    $product->getPriceModel()->getChildFinalPrice();        Final price of configurable variant Product
   ```
