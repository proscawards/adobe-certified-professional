1. __Given a scenario, change/add/remove attribute sets and/or attributes__
   
   - Scenario #1: Merchant decided to introduce new category, with a dedicated attribute set and some custom attributes<br/>
     To create new custom attribute(s), head on to __Stores__→__Attributes__→__Attribute Set__→__Add New Attribute__. 
     >![Attribute Set](images/s3_attribute.png)
     
     > __Note:__<br/>
     > To enable the attribute as configurable product attribute, please ensure that __Catalog Input Type for Store Owner__ is configured as below ONLY. Else, configurable product attribute will not display the newly created attribute, despite the scope is set to _Global_.
     >- Visual Swatch
     >- Text Swatch
     >- Dropdown  
     
     To create new attribute set, head on to __Stores__→__Attributes__→__Attribute Set__→__Add Attribute Set__. Once attribute set is created, open the newly created attribute set.
     >![Attribute Set](images/s3_attribute_set.png)
     Inside this page, we can remove existing attribute assigned under the group of nodes, or introduce __Unassigned Attributes__ into the attribute set.
     Under __Unassigned Attributes__, search for the newly created custom attribute, which is _Fashion Color_ in this case.
     >![Drag & Drop Attribute](images/s3_dnd_attribute.png)
     Drag and Drop the custom attribute into desired group. Once completed, save the attribute set.

2. __Describe different types of attributes__
   
   In Magento, there are two types of attributes, which are
   - EAV(Entity-Attribute-Value) attribute
   - Extension attribute
   
   EAV attribute is implemented for Catalog level and Customer level. We can also create custom attributes on top of EAV attribute.<br/>
   Extension attribute is mostly implemented for Service Contract (API) usage.

3. __Given a scenario, use a DB schema to alter a database table__
   
   - Scenario #1: Business required to validate if customer is a valid Malaysian citizen<br/>
     To capture NRIC of the customer, we are required to alter `customer_entity` table, since NRIC is unique to ONLY ONE customer.<br/>

     File structure of DB schema:
     ```
     etc
     |--db_schema.xml
     |--db_schema_whitelist.json
     ```
     In __`db_schema.xml`__:

     ```xml
    <schema>
        <table name="customer_entity" resource="default" engine="innodb" comment="Customer Entity">
            <column xsi:type="text" name="nric" nullable="true" comment="NRIC"/>
        </table>
    </schema>
     ```
     In __`db_schema_whitelist.json`__:

     ```json
    {
        "customer_entity": {
            "column": {
                "nric": true
            }
    }
     ```

    Once both DB schema files are in place, run `php bin/magento s:up` to upgrade the database.
    
4. __Describe models, resource models, and collections__
   
   Sample hierarchy of model, resource model and collection in a module
   ```
   Model
   |--ResourceModel
        |--OrderReport
            |--Collection.php    OrderReport Collection
        |--OrderReport.php       OrderReport Resource Model
   OrderReport.php               OrderReport Model
   ```
   - __Model__<br/>
    In Magento, each entity (table) we created will have its corresponding Model. Main logics such as data fetching, data manipulation occurs within the Model itself. Models are essentially a DataObject in Magento. All DataObject in Magento have access to PHP getter and setter magic methods.<br/>
    Let's say a column in the table is `seller_name`, we can get and set the column using:
    ```
    $orderReport->getSellerName();
    $orderReport->setSellerName('proscawards');
    ```

    To use our Model, simply call the class and load/create it,
    ```
    use Born\Reports\Model\OrderReport;            // Normal Model Class
    use Born\Reports\Model\OrderReportFactory;     // Factory Design Pattern Model Class

    protected $_orderReport;
    protected $_orderReportFactory;

    public function __construct(
        OrderReport        $orderReport,
        OrderReportFactory $orderReportFactory
    ) {
        $this->_orderReport        = $orderReport;
        $this->_orderReportFactory = $orderReportFactory;
    }//end __construct()

    $orderReport        = $this->_orderReport->load('entity_id');
    $orderReportFactory = $this->_orderReportFactory->create();
    ```
    `entity_id` is the primary key of the table. `load()` methods expects a value of the primary key. If the value of primary key is not provided, consider using factory instead, or load with specified column name instead `load('value', 'column_name')`.

   - __Resource Model__<br/>
     In Magento, Resource Model handles the actual CRUD logic in database. During creation of Model object, we pass in `entity_id` as the value in the `load()` method. 
     ```
    public function load($modelId, $field = null)
    {
        $this->_getResource()->load($this, $modelId, $field);
        return $this;
    }//end load()
     ```
     The `load()` method of the Model is internally calling another `load()` method in Resource Model. Within Resource Model, it will validate if the row existed in the table. If exist, the `load()` method will return the DataObject. Else, nothing will be return.

   - __Collection__<br/>
    In Magento, Collection is basically a collection of Model DataObjects. We have more controls over the returned data when it comes to collection. Since Model can only load by either primary key or a specified column name, and only one at a time.

    In Collection, we can apply all types of MySQL sorting and filtering logic, but in Magento ORM way,
    <center>

    | MySQL | Magento ORM |
    |------|------|
    | WHERE | addFieldToFilter()<br/>addAttributeToFilter() |
    | ORDER BY | setOrder() |

    </center>

    Initializing a collection,
    ```
    use Born\Reports\Model\ResourceModel\OrderReport\Collection;        // Not recommended
    use Born\Reports\Model\ResourceModel\OrderReport\CollectionFactory; // Recommended

    protected $_collectionFactory;

    public function __construct(
        CollectionFactory $collectionFactory
    ) {
        $this->_collectionFactory = $collectionFactory;
    }//end __construct()

    $collection = $this->_collectionFactory->create();
    ```
    Once the collection is created, we can go a step further by applying logic,
    ```
    $collection->addFieldToFilter('order_status', ['eq' => 'complete'])
        ->addFieldToFilter('seller_id', ['eq' => 1])
        ->setOrder('created_at', 'DESC')
        ->load();
    ```
    Upon loaded of the collection, we can perform several actions below:
    - To retrieve the SQL query string
    ```
    $collection->getSelect();
    ```
    - To retrieve size of collection
    ```
    $collection->getSize();
    ```
    - To retrieve all data of collection as array objects
    ```
    $collection->getData();
    ```
    - To retrieve all data of collection as Model DataObjects
    ```
    $collection->getItems();
    ```
    - To retrieve only the first item of collection of Model DataObjects
    ```
    $collection->getFirstItem();
    ```

5. __Describe basics of Entity Attribute Value (EAV)__
   
   - __Entity__<br/>
     There are 4 default entities and their corresponding entity table in Magento, namely 
     - Customer `customer_entity`
     - Customer Address `customer_address_entity`
     - Category `catalog_category_entity`
     - Product `catalog_product_entity`
     
     Information of these entities can be found in `eav_entity_type` table.

   - __Attribute__<br/>
     Attributes represent the fields which are being assigned to the entity. For instance, customer entity will have email, name, mobile number, etc.
   - __Value__<br/>
     Value is simply the value of those attributes. For instance, the value of the customer's email, name, mobile number, etc.
    
   In EAV high level overview, each data type is stored in different table. There are 5 dedicated table to save each data types, which are created as suffix of the above entity tables:
   >datetime<br/>
   >decimal<br/>
   >int<br/>
   >text<br/>
   >varchar

   The advantage of EAV is very scalable, the downside however, expensive querying since multiple joins are required.
