1. __Describe usage of CMS pages and blocks__
   
   - CMS Page<br/>
   Content Management System (__CMS__) pages are used to manage contents of a page throughout the website. For each respective route, we can have one CMS page to be mapped onto it. For instance, the website URL is
   ```
   https://clothes.com.my/faq
   ```
   The identifier of this CMS page will be `faq`.   
   
   - CMS Block<br/>
   CMS blocks are reusable components, and can be embedded into CMS pages.

2. __Given a scenario, modify layout__
   
   There are five types of layout, which are
   ```
   empty                   Raw layout for custom design
   1column                 1 column
   2columns-left           2 column with left bar
   2columns-right          2 column with right bar
   3columns                3 column layout (1 column with left and right bar)
   cms-full-width          [PageBuilder Module ONLY] Inherited from 1column, recommended for Page usage
   category-full-width     [PageBuilder Module ONLY] Inherited from 1column, recommended for Category usage
   product-full-width      [PageBuilder Module ONLY] Inherited from 1column, recommended for Product usage
   ```

   Layout can be modified in __`view/*/layout/*.xml`__, via `layout` element
   ```
   <page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" layout="2columns-left" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
   ```
   OR
   head on to Magento Backoffice's __Content__→__Elements__→__Pages__→__Add/Edit Page__→__Design__→__Layout__ to update to desired layout.

3. __Given a scenario, modify page style__
   
   To modify style of a page, we will need to override existing layout handle file under our custom module. Layout handle file are usually located under __`view/*/layout/*.xml`__. 

   In the layout handle file's `<head>` tag, we can include `<css>` tag as such,
   ```
    <head>
        <css src="Born_Reports::css/menu.css"/>
    </head>
   ```
   Inside this css file, we can modify the style based on our needs. 

   Other than css, if we want to reposition/remove the existing containers and/or blocks, we can also do the same in layout handle file.

   Under `<body>` tag, 
   ```
   <body>
        <referenceBlock name="footer" remove="true"/>
        <referenceContainer name="container" remove="true"/>
        <move element="navigation.sections" destination="header.container">
   </body>
   ```

4. __Describe theme structure__
   
   Magento Theme modules should be created under `app/design`.

   ```
   {area}                        adminhtml | frontend | custom area
    |--{vendor}                  Vendor name
        |--{theme_name}          Theme name
            |--etc               Miscellaneous files directory
                |--view.xml      Theme properties configuration
            |--i18n              Internationalization files directory (*.csv)
            |--web               Frontend files and media assets directory (*.css, *.js, , *.ts, *.html, *.phtml, images, videos, files)
            |--composer.json     Module integration with Composer
            |--registration.php  Module registration
            |--theme.xml         Theme declaration (Similar to module.xml for module declaration)
   ```

5. __Given a scenario, work with JavaScript files (basic)__
   
   JavaScript files in Magento are modular based. JavaScript files are usually located under __`view/*/web/js`__.

   Sample file structure of JavaScript files,
   ```
   view
   |--adminhtml
        |--web
            |--js                 JavaScript files
        |--requirejs-config.js    Dependencies configuration (Similar to di.xml for module)
   ```

   To override an existing JavaScript file (preference in Magento),
   ```js
    var config = {
        'paths': {
            "Magento_ProductVideo/js/new-video-dialog":"Born_CustomFixes/js/new-video-dialog"
        }
    };
   ```

6. __Describe front-end usage of customer data__
   
   Customer data is a private content used to store data and information of the logged in user. It was created as an object named `customerData` under `Magento_Customer/js/customer-data`. `customerData` is stored under `mage-cache-storage` and it carries data, such as,
   ```json
   {
        "customer":{
            "fullname":"SC Ong",
            "firstname":"SC",
            "avatar":"",
            "tracking":{
                "age":0,
                "gender":null,
                "zipcode":"",
                "state":"",
                "country":""
            },
            "data_id":1665477576
        },
        "last-ordered-items":{
            "items":[],
            "data_id":1665477576
        },
        "cart":{
            "summary_count":0,
            "subtotalAmount":"0.0000",
            "subtotal":"<span class=\"price\">RM0.00</span>",
            "possible_onepage_checkout":true,
            "items":[],
            "extra_actions":"",
            "isGuestCheckoutAllowed":true,
            "website_id":"1",
            "storeId":"1",
            "cart_empty_message":"",
            "subtotal_incl_tax":"<span class=\"price\">RM0.00</span>",
            "subtotal_excl_tax":"<span class=\"price\">RM0.00</span>",
            "data_id":1665477576
        },
        "recently_viewed_product":{
            "count":0,
            "items":[],
            "data_id":1665477576
        },
        "recently_compared_product":{
            "count":0,
            "items": [],
            "data_id":1665477576
        },
   }
   ```

   From this json object, we can simply access it in our JavaScript file. First, we need to initialize the object.
   ```js
    define([
        'uiComponent',
        'Magento_Customer/js/customer-data'
    ], function (Component, customerData) {
        'use strict';
        
        return Component.extend({
            initialize: function () {
                this._super();
                this.customer = customerData.get('customer');     // Retrieving customer data from mage-cache-storage
            }
        });
    });
   ```

   There are four types of method available in `customerData`, which are
   ```
   customerData.get('section');                Read data of provided section
   customerData.set('section', 'data');        Insert/update data to the provided section   
   customerData.reload('sections');            Reload an array of section
   customerData.invalidate('section');         Notify that the section has invalid data and requires a reload
   ```
