1. __Describe Magento file structure__
   ```
   app
   |--code       Directory for customized code modules
   |--design     Directory for customized theme packages
   |--i18n       Directory for customized language packs
   |--etc        Directory for deployment configuration and module installation registry
   bin           Directory for Magento CLI commands
   dev           Directory for Magento Test Framework automated functional tests
   generated     Directory for Magento's generated code, mostly for non-existent Factory class
   lib           Directory for Magento and vendor library files. Non-moduled based files are stored within lib directory
   patches       Directory for Magento security patches
   phpserver     Directory for implementing PHP built-in server
   pub           Directory is accessible from client-side ONLY
   |--media      Directory for storing media assets (images|videos|files)
   |--static     Directory for storing generated and compiled minified css and js files
   setup         Directory for Magento installation setup files
   var           Directory is accessible from server-side ONLY
   |--cache      Directory for storing all Magento's cache. By running `php bin/magento c:c` will clean all cache.
   |--log        Directory for storing all Magento and custom log files
   vendor        Directory for all Magento core modules and third-party modules, can be managed through root level composer.json
   ```
2. __Describe Magento CLI commands__
   
   Run __`php bin/magento`__ to view all Magento and customized CLI commands.<br/>
   Below are some commonly used CLI commands:
   ```
    cache:clean              Cleans cache type(s)
    cache:flush              Flushes cache storage used by cache type(s)
    cron:run                 Runs jobs by schedule
    dev:profiler:disable     Disable the profiler.
    dev:profiler:enable      Enable the profiler.
    indexer:reindex          Reindexes Data
    module:disable           Disables specified modules
    module:enable            Enables specified modules
    queue:consumers:start    Start MessageQueue consumer
    setup:di:compile         Generates DI configuration and all missing classes that can be 
    setup:upgrade            Upgrades the Magento application, DB data, and schema

   ```

3. __Describe cron functionality__
   
    Cron are essentially scheduled jobs in Magento. Scheduled cron jobs are being pushed into __`cron_schedule`__ table, waiting to be executed. By running __`php bin/magento cron:run`__, scheduled jobs in __`cron_schedule`__ table will now start executing.

    File structure of cron-related files:
    ```
    etc
    |--crontab.xml
    |--cron_groups.xml
    ```

    Sample record in __`cron_schedule`__ table:
    <center>

    | schedule_id  | job_code | status | messages | created_at | scheduled_at | executed_at | finished_at |
    |--------|--------|--------|--------|--------|--------|--------|--------|
    | 281457 | settlement_withdrawal_create_withdrawal_request | success | <null> | 2022-10-05 05:02:08 | 2022-10-05 05:04:00 | 2022-10-05 05:04:09 | 2022-10-05 05:04:09|    
    
    </center>

    The content of __`crontab.xml`__:

    ```xml
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Cron:etc/crontab.xsd">
        <group id="born_settlement_withdrawal">
            <job name="settlement_withdrawal_create_withdrawal_request" instance="Born\SettlementWithdrawal\Cron\CreateWithdrawalRequest" method="execute">
                <config_path>settlementwithdrawal/settings/create_withdrawal_request_cron_frequency</config_path>
            </job>
            ...
        </group>
    </config>
    ```

    From the __`cron_schedule`__ table, `job_code` are actually the job name being registered in __`crontab.xml`__.<br/>
    Each cron job has their dedicated file (__job instance__) to perform the task, with the main method name (__job method__) to be executed. For declaring how often should the cron execute, within the `config_path`, we can either hardcoded a cron frequency,
    ```
    <config_path>* * * * *</config_path>
    ``` 
    or as best practice, exposed this config_path as a system configuration for the admin to manage from Magento Backoffice.
    ```
    <config_path>settlementwithdrawal/settings/create_withdrawal_request_cron_frequency</config_path>
    ``` 
    >![System Configuration](images/s2_cron_system_config.png)

    Within __`crontab.xml`__, there is a `group` tag, indicating all these jobs are categorized under this specific group. Groups are created within __`cron_groups.xml`__. __`cron_groups.xml`__ specifies the behavior of all children jobs within the group itself. The content of __`cron_groups.xml`__:

    ```xml
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:module:Magento_Cron:etc/cron_groups.xsd">
        <group id="born_settlement_withdrawal">
            <schedule_generate_every>1</schedule_generate_every>
            <schedule_ahead_for>4</schedule_ahead_for>
            <schedule_lifetime>2</schedule_lifetime>
            <history_cleanup_every>10</history_cleanup_every>
            <history_success_lifetime>60</history_success_lifetime>
            <history_failure_lifetime>600</history_failure_lifetime>
            <use_separate_process>1</use_separate_process>
        </group>
    </config>
    ``` 
    Registered __`cron_groups.xml`__ can be found in __Stores__→__Settings__→__Configuration__→__Advanced__→__System__->__Cron (Scheduled Tasks)__.

4. __Given a scenario, describe usage of the di.xml__
   
   - Scenario #1: New module requires a custom logger<br/>
     To register new logger for the module, we need to add new logger handler and specify the corresponding log path for the customized log in __`di.xml`__.
     ```xml
    <type name="Born\Reports\Logger\Logger">
        <arguments>
            <argument name="name" xsi:type="string">ReportsLogHandler</argument>
            <argument name="handlers" xsi:type="array">
                <item name="system" xsi:type="object">ReportsLoggerHandler</item>
            </argument>
        </arguments>
    </type>
    <virtualType name="ReportsLoggerHandler" type="Magento\Framework\Logger\Handler\Base">
        <arguments>
            <argument name="filesystem" xsi:type="object">Magento\Framework\Filesystem\Driver\File</argument>
            <argument name="fileName" xsi:type="string">/var/log/reports/reports.log</argument>
            <argument name="loggerType" xsi:type="string">Magento\Framework\Logger\Monolog::INFO</argument>
        </arguments>
    </virtualType>
    ```
   - Scenario #2: Place Order GraphQl API does not support in returning multiple order numbers<br/>
     To resolve this issue, we will need to create either `preference` or `plugin` in __`di.xml`__.
     ```xml
     <!-- Preference: Overriding entire file -->
    <preference for="Magento\QuoteGraphQl\Model\Resolver\PlaceOrder" type="Born\QuoteGraphQl\Model\Resolver\PlaceOrder"/>

    <!-- Plugin: Perform extra logic before/around/after the given method -->
    <type name="Magento\QuoteGraphQl\Model\Resolver\PlaceOrder">
        <plugin name="customized_place_order" type="Born\QuoteGraphQl\Plugin\Model\Resolver\PlaceOrder" sortOrder="0" disabled="false"/>
    </type>
     ```

5. __Given a scenario, create controllers__
   
   - Scenario #1: CRUD in Magento Backoffice<br/>
     To perform CRUD in backend, we need to create controller for each CRUD logic, with its corresponding block and layout file.
    ```
    Controller
    |--Adminhtml
        |--Reasons
            |--Add.php
            |--Delete.php
            |--Edit.php
            |--Save.php
            |--View.php
    Block
    |--Adminhtml
        |--ReasonsManager
            |--Edit
                |--DeleteButton.php
                |--GenericButton.php
                |--SaveButton.php
            |--View
                |--Tab
                    |--Reason
                        |--Info.php
    etc
    |--adminhtml
        |--routes.xml
    Ui
    |--DataProvider
        |--ReasonsManager
            |--Edit.php
    view
    |--adminhtml
        |--layout
            |--reasons_manager_reasons_add.xml
            |--reasons_manager_reasons_edit.xml
            |--reasons_manager_reasons_view.xml
        |--ui_component
            |--reasons_manager_reasons_form.xml
    ```

6. __Describe module structure__
   ```
   Api                         Interfaces of the module     
   Block                       Blocks, layouts, templates files directory which extends from \Magento\Framework\View\Element\Template,
                               a compilation of helper methods or data to be used in `view/*/templates/*.phtml`
   Consumer                    Message queue instance files directory
   Controller                  Controller files directory
   Cron                        Cron job instance files directory
   etc                         Miscellaneous files directory
   |--adminhtml
        |--menu.xml            Magento Backoffice menu item
        |--routes.xml          Routes declaration
        |--system.xml          System configuration
   |--acl.xml                  Access Control List
   |--communication.xml        List of message queue's topic and its corresponding handler
   |--config.xml               Default system value for adminhtml/system.xml
   |--cron_groups.xml          Behavior of the group of cron jobs
   |--crontab.xml              List of cron jobs and its corresponding handler
   |--db_schema.xml            Database schema declaration
   |--db_schema_whitelist.json History of database schema for backward compatibility
   |--di.xml                   Dependencies configuration 
   |--email_templates.xml      Email templates declaration
   |--events.xml               Global event observer declaration
   |--module.xml               Module declaration
   |--queue_consumer.xml       Relationship between an existing queue and its consumer
   |--queue_publisher.xml      Exchange where a topic is published
   |--queue_topology.xml       Message routing rules and declares queues and exchanges
   |--schema.graphqls          GraphQL Schema
   Helper                      Helper files directory which extends from \Magento\Framework\App\Helper\AbstractHelper
   i18n                        Internationalization files directory (*.csv)
   Logger                      Logger files directory which extends from \Monolog\Logger
   Model                       Performing CRUD with the database
   |--Resolver                 Resolver files directory for GraphQL
   Observer                    Event observer files directory
   Plugin                      Plugin files directory
   Setup                       Data patch installation/removal files directory
   Ui                          Data provider for `view/*/ui_component/*.xml` Ui components
   view                        Frontend files and media assets directory (*.css, *.js, , *.ts, *.html, *.phtml, images, videos, files)
   ViewModel                   Similar to Block's behavior, but easier to maintain, faster in retrieving data,
                               and can inject directly into `view/*/templates/*.phtml` since there is no inheritance in ViewModel
   composer.json               Module integration with Composer
   registration.php            Module registration
   ```

7. __Describe index functionality__

    Indexing functionality is to optimized reading and searching of the data and improve performance of storefront. Fulltext search is actually one of the functionalities within indexing. 

    Whenever EAV-related attributes are modified, reindexing is required, so that latest changes will be reflected.

    CLI commands for performing indexing:
    ```
    php bin/magento indexer:info        Show info of all index
    php bin/magento indexer:reindex     Reindex all index
    php bin/magento indexer:reset       Reset all index
    php bin/magento indexer:status      Show status of all index
    ```

    Indexing can also be performed from Magento Backoffice. Head on to __System__→__Tools__→__Index Management__.
    >![Index Management](images/s2_index_management.png)

8. __Describe localization__

    Localization, also known as Internationalization (__i18n__) is where Magento enables default language to be substitute out based on the targeted language. 

    The file structure of i18n:
    ```
    i18n
    |--en_US.csv
    |--de_DE.csv
    |--zh_Hans_CN.csv
    ```
    By default, Magento will use __`en_US.csv`__.

    Magento introduces `\Magento\Framework\Phrase` class to handle i18n conversion in *.php and *.phtml, by using
    ```
    <?php echo __('Hello World!'); ?>
    ```
    In email templates,
    ```
    {{trans 'Hello World!'}}
    ```
    In system.xml, we can declare which tag(s) should be targeted for translation,
    ```
    translate="label comment"
    ```

9.  __Describe plugin, preference, event observers, and interceptors__
    
    - Plugins (Interceptors)<br/>
      A plugin, or interceptor is to modify or extend existing behavior of the class method before, around or after the logic is executed. The downside of plugin is that it can only be used for public methods.
    - Preference<br/>
      A preference is to override entire class, ideally it will only be used when the targeted method is a protected method where plugin is unable to be implemented.
    - Event Observers<br/>
      An event observer is basically observing before or after a specific event has been triggered. During that observation period, event object is exposed and extra logic can be implemented based of it. Event Observers are registered under __`etc/events.xml`__ or more specific areas such as __`etc/adminhtml/events.xml`__.
      
      Example of observing template variables of an email template:
    ```
    <event name="email_order_set_template_vars_before">
        <observer name="customized_order_email" instance="Born\Reports\Observer\OrderEmailVarsBefore" />
    </event>
    ```
    Within the observer class, based on the event name provided in __`events.xml`__, corresponding event object is now exposed and ready to be used:
    ```
    public function execute(Observer $observer)
    {
        $transport = $observer->getTransport();
        ...
    }
    ```

10. __Describe custom module routes__
    
    Module routes can be found in:
    ```
    etc
    |--adminhtml
        |--routes.xml
    |--frontend
        |--routes.xml
    ```
    To declare new custom module routes in `adminhtml` or `frontend`, add new route(s) in __`routes.xml`__:
    ```xml
    <config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:noNamespaceSchemaLocation="urn:magento:framework:App/etc/routes.xsd">
        <router id="admin">
            <route id="tmreports" frontName="tmreports">
                <module name="Born_Reports"/>
            </route>
        </router>
    </config>
    ```

    - `router` in __`routes.xml`__ is unique for different area:
    - `adminhtml`: `<router id="admin">`
    - `frontend`: `<router id="standard">`

    The content of `route` tag:
    ```xml
    <route id="tmreports" frontName="tmreports">
        <module name="Born_Reports"/>
    </route>
    ```
    - `route id` is the unique identifier of the route and also the first segment of the layout.xml
    - `route frontName` is the first segment of the base URL of the request
    - `module name` is the name of the module

11. __Describe URL rewrites__
    
    URL rewrites are essential to make the website more SEO friendly. In Magento, Product, Category and CMS page are dynamically applying URL rewrites upon creation. To manage URL rewrites, head on to __Marketing__→__SEO & Search__→__URL Rewrites__. To proceed, click on __Add URL Rewrite__ or edit existing URL rewrites.

    >![URL Rewrite for Product](images/s2_url_rewrite.png)
    - `Request Path` will be the SEO friendly URL created by Magento.
    - `Target Path` will be the original url to be mapped with the `Request Path`.
    - `Redirect Type` will be either __No__, __Temporary(302)__ or __Permanent(301)__.

12. __Describe the Magento caching system__
    
    Magento by default caches everything which ranges from data to files. Cache Management is accessible in Magento Backoffice, head on to __System__→__Tools__→__Cache Management__.
    >![Cache Management](images/s2_cache_management.png)

    Cache can be clean up via CLI command `php bin/magento cache:flush`, which is partial cleanup, or `php bin/magento cache:clean`, which is fully cleanup.

13. __Describe stores, websites, and store views (basic understanding)__
    
    Here's the hierarchy in Magento:
    ```
    Global
    |--Website
        |--Store
            |--Store View
    ```
    
    Each hierarchy is a __ONE-TO-MANY__ relationship. For instance, one website can have multiple stores assigned to it.

    - Website<br/>
      Within one Magento codebase, we can have multiple websites. For instance, `clothes.com.my` and `pants.com.my`. Both websites can be easily managed with the same Magento Backoffice. Within website hierarchy, we can set different product pricing, payment methods, shipping methods, etc across different websites.

    - Store<br/>
      For each stores under the website, we can assign different products and categories. 
      ```
      clothes.com.my        Store
      |--Men's Fashion      Category
        |--Sweatshirt       Product
      pants.com.my          Store
      |--Women's Fashion    Category
        |--Jogger           Product
      ```
    However, product pricing, payment methods, shipping methods, etc will be the same across all stores since it's inherited from parent website.

    - Store View<br/>
      For each store, we can assign multiple store views. Store views are usually implemented for different localization, such as language, currency, etc.
      ```
      clothes.com.my            Store
      |--clothes.com.my/en      English Store View
        |--Men's Fashion        Category
            |--Sweatshirt       Product
      |--clothes.com.my/zh      Mandarin Store View
        |--男士时装              Category
            |--运动衫            Product
      |--clothes.com.my/my      Malay Store View
        |--Fesyen Lelaki        Category
            |--Baju Panas       Product
      ```