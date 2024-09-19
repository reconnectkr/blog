-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT,
    "photo" TEXT,
    "departmentId" INTEGER,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "issuedAt" TIMESTAMPTZ(4) NOT NULL,
    "expiredAt" TIMESTAMPTZ(4) NOT NULL,
    "price" DECIMAL(12,2),
    "rate" DECIMAL(12,2),
    "retrievedAt" TIMESTAMPTZ(4),
    "retrievedBy" TEXT,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "unit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_places" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "inventory_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_category_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "inventory_item_category_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_item_categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "inventory_item_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "specification" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "inventoryUnitId" INTEGER NOT NULL,
    "description" TEXT,
    "barcode" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_inventory_items" (
    "productId" INTEGER NOT NULL,
    "inventoryItemId" INTEGER NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "product_inventory_items_pkey" PRIMARY KEY ("productId","inventoryItemId")
);

-- CreateTable
CREATE TABLE "point_of_sales" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "point_of_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point_of_sales_products" (
    "pointOfSaleId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "point_of_sales_products_pkey" PRIMARY KEY ("pointOfSaleId","productId")
);

-- CreateTable
CREATE TABLE "order_sessions" (
    "id" SERIAL NOT NULL,
    "startTime" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMPTZ(4),
    "pointOfSaleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4),
    "updatedBy" TEXT,

    CONSTRAINT "order_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_timings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_timings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_vouchers" (
    "id" SERIAL NOT NULL,
    "orderSessionId" INTEGER NOT NULL,
    "totalAmount" DECIMAL(12,2),
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "payment_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "typeId" INTEGER NOT NULL,
    "timingId" INTEGER NOT NULL,
    "methodId" INTEGER NOT NULL,
    "occuredAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pointOfSaleId" INTEGER NOT NULL,
    "voucherId" INTEGER NOT NULL,
    "amountUnitId" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "remarks" TEXT,
    "couponCode" TEXT,
    "couponId" INTEGER,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "orderSessionId" INTEGER NOT NULL,
    "orderedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderNumber" TEXT,
    "subTotal" DECIMAL(12,2),
    "discountTotal" DECIMAL(12,2),
    "taxTotal" DECIMAL(12,2),
    "totalAmount" DECIMAL(12,2),
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "discountTotal" DECIMAL(12,2) NOT NULL,
    "taxTotal" DECIMAL(12,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "orderSessionId" INTEGER NOT NULL,
    "issuedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "invoiceNumber" TEXT,
    "subTotal" DECIMAL(12,2),
    "discountTotal" DECIMAL(12,2),
    "taxTotal" DECIMAL(12,2),
    "totalAmount" DECIMAL(12,2),
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4),
    "updatedBy" TEXT,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "productName" TEXT NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL DEFAULT 1,
    "discountTotal" DECIMAL(12,2) NOT NULL,
    "taxTotal" DECIMAL(12,2) NOT NULL,
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4),
    "updatedBy" TEXT,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_adjustment_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "price_adjustment_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_adjustment_policies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "typeId" INTEGER NOT NULL,
    "adjustmentAmount" DECIMAL(12,2),
    "adjustmentRate" DECIMAL(12,2),
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "price_adjustment_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_adjustables" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "price_adjustables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_adjustments" (
    "id" SERIAL NOT NULL,
    "priceAdjustmentPolicyId" INTEGER NOT NULL,
    "policyName" TEXT NOT NULL,
    "policyTypeId" INTEGER NOT NULL,
    "policyAdjustmentAmount" DECIMAL(12,2),
    "policyAdjustmentRate" DECIMAL(12,2),
    "priceAdjustableId" INTEGER NOT NULL,
    "orderItemId" INTEGER,
    "orderId" INTEGER,
    "invoiceItemId" INTEGER,
    "invoiceId" INTEGER,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "price_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_event_types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "inventory_event_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_events" (
    "id" SERIAL NOT NULL,
    "typeId" INTEGER NOT NULL,
    "occuredAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inventoryPlaceId" INTEGER NOT NULL,
    "inventoryItemId" INTEGER NOT NULL,
    "inventoryUnitId" INTEGER NOT NULL,
    "quantityUnitId" INTEGER,
    "conversionFactor" DECIMAL(12,6),
    "quantity" DECIMAL(20,8),
    "valueUnitId" INTEGER,
    "value" DECIMAL(12,6),
    "remarks" TEXT,
    "vendorId" INTEGER,
    "amountUnitId" INTEGER,
    "subAmount" DECIMAL(12,6),
    "discountAmount" DECIMAL(12,6),
    "valueAddedTaxAmount" DECIMAL(12,6),
    "otherTaxAmount" DECIMAL(12,6),
    "otherAmount" DECIMAL(12,6),
    "totalAmount" DECIMAL(12,6),
    "fromInventoryPlaceId" INTEGER,
    "toInventoryPlaceId" INTEGER,
    "reason" TEXT,
    "createdAt" TIMESTAMPTZ(4) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ(4) NOT NULL,
    "updatedBy" TEXT NOT NULL,

    CONSTRAINT "inventory_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "departments_name_idx" ON "departments"("name");

-- CreateIndex
CREATE INDEX "departments_description_idx" ON "departments"("description");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "users_updatedAt_idx" ON "users"("updatedAt");

-- CreateIndex
CREATE INDEX "users_active_idx" ON "users"("active");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "profiles_name_idx" ON "profiles"("name");

-- CreateIndex
CREATE INDEX "profiles_mobile_idx" ON "profiles"("mobile");

-- CreateIndex
CREATE INDEX "profiles_createdAt_idx" ON "profiles"("createdAt");

-- CreateIndex
CREATE INDEX "profiles_updatedAt_idx" ON "profiles"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_mobile_key" ON "profiles"("mobile");

-- CreateIndex
CREATE INDEX "coupons_code_idx" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "coupons_issuedBy_idx" ON "coupons"("issuedBy");

-- CreateIndex
CREATE INDEX "coupons_issuedAt_idx" ON "coupons"("issuedAt");

-- CreateIndex
CREATE INDEX "coupons_expiredAt_idx" ON "coupons"("expiredAt");

-- CreateIndex
CREATE INDEX "coupons_price_idx" ON "coupons"("price");

-- CreateIndex
CREATE INDEX "coupons_rate_idx" ON "coupons"("rate");

-- CreateIndex
CREATE INDEX "coupons_retrievedAt_idx" ON "coupons"("retrievedAt");

-- CreateIndex
CREATE INDEX "coupons_retrievedBy_idx" ON "coupons"("retrievedBy");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "unit_types_name_idx" ON "unit_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "unit_types_name_key" ON "unit_types"("name");

-- CreateIndex
CREATE INDEX "units_name_idx" ON "units"("name");

-- CreateIndex
CREATE INDEX "units_typeId_idx" ON "units"("typeId");

-- CreateIndex
CREATE UNIQUE INDEX "units_name_key" ON "units"("name");

-- CreateIndex
CREATE INDEX "inventory_places_name_idx" ON "inventory_places"("name");

-- CreateIndex
CREATE INDEX "inventory_places_departmentId_idx" ON "inventory_places"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_places_name_key" ON "inventory_places"("name");

-- CreateIndex
CREATE INDEX "inventory_item_category_types_name_idx" ON "inventory_item_category_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_item_category_types_name_key" ON "inventory_item_category_types"("name");

-- CreateIndex
CREATE INDEX "inventory_item_categories_typeId_idx" ON "inventory_item_categories"("typeId");

-- CreateIndex
CREATE INDEX "inventory_item_categories_parentId_idx" ON "inventory_item_categories"("parentId");

-- CreateIndex
CREATE INDEX "inventory_item_categories_code_idx" ON "inventory_item_categories"("code");

-- CreateIndex
CREATE INDEX "inventory_item_categories_name_idx" ON "inventory_item_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_item_categories_parentId_name_key" ON "inventory_item_categories"("parentId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_item_categories_code_key" ON "inventory_item_categories"("code");

-- CreateIndex
CREATE INDEX "inventory_items_code_idx" ON "inventory_items"("code");

-- CreateIndex
CREATE INDEX "inventory_items_name_idx" ON "inventory_items"("name");

-- CreateIndex
CREATE INDEX "inventory_items_specification_idx" ON "inventory_items"("specification");

-- CreateIndex
CREATE INDEX "inventory_items_manufacturer_idx" ON "inventory_items"("manufacturer");

-- CreateIndex
CREATE INDEX "inventory_items_inventoryUnitId_idx" ON "inventory_items"("inventoryUnitId");

-- CreateIndex
CREATE INDEX "inventory_items_description_idx" ON "inventory_items"("description");

-- CreateIndex
CREATE INDEX "inventory_items_barcode_idx" ON "inventory_items"("barcode");

-- CreateIndex
CREATE INDEX "inventory_items_active_idx" ON "inventory_items"("active");

-- CreateIndex
CREATE INDEX "inventory_items_categoryId_idx" ON "inventory_items"("categoryId");

-- CreateIndex
CREATE INDEX "inventory_items_createdAt_idx" ON "inventory_items"("createdAt");

-- CreateIndex
CREATE INDEX "inventory_items_createdBy_idx" ON "inventory_items"("createdBy");

-- CreateIndex
CREATE INDEX "inventory_items_updatedAt_idx" ON "inventory_items"("updatedAt");

-- CreateIndex
CREATE INDEX "inventory_items_updatedBy_idx" ON "inventory_items"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_name_specification_key" ON "inventory_items"("name", "specification");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_code_key" ON "inventory_items"("code");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_price_idx" ON "products"("price");

-- CreateIndex
CREATE INDEX "products_description_idx" ON "products"("description");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "products"("createdAt");

-- CreateIndex
CREATE INDEX "products_createdBy_idx" ON "products"("createdBy");

-- CreateIndex
CREATE INDEX "products_updatedAt_idx" ON "products"("updatedAt");

-- CreateIndex
CREATE INDEX "products_updatedBy_idx" ON "products"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE INDEX "product_inventory_items_productId_idx" ON "product_inventory_items"("productId");

-- CreateIndex
CREATE INDEX "product_inventory_items_inventoryItemId_idx" ON "product_inventory_items"("inventoryItemId");

-- CreateIndex
CREATE INDEX "product_inventory_items_quantity_idx" ON "product_inventory_items"("quantity");

-- CreateIndex
CREATE INDEX "product_inventory_items_createdAt_idx" ON "product_inventory_items"("createdAt");

-- CreateIndex
CREATE INDEX "product_inventory_items_createdBy_idx" ON "product_inventory_items"("createdBy");

-- CreateIndex
CREATE INDEX "product_inventory_items_updatedAt_idx" ON "product_inventory_items"("updatedAt");

-- CreateIndex
CREATE INDEX "product_inventory_items_updatedBy_idx" ON "product_inventory_items"("updatedBy");

-- CreateIndex
CREATE INDEX "point_of_sales_name_idx" ON "point_of_sales"("name");

-- CreateIndex
CREATE INDEX "point_of_sales_departmentId_idx" ON "point_of_sales"("departmentId");

-- CreateIndex
CREATE INDEX "point_of_sales_description_idx" ON "point_of_sales"("description");

-- CreateIndex
CREATE INDEX "point_of_sales_createdAt_idx" ON "point_of_sales"("createdAt");

-- CreateIndex
CREATE INDEX "point_of_sales_createdBy_idx" ON "point_of_sales"("createdBy");

-- CreateIndex
CREATE INDEX "point_of_sales_updatedAt_idx" ON "point_of_sales"("updatedAt");

-- CreateIndex
CREATE INDEX "point_of_sales_updatedBy_idx" ON "point_of_sales"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "point_of_sales_name_key" ON "point_of_sales"("name");

-- CreateIndex
CREATE INDEX "point_of_sales_products_pointOfSaleId_idx" ON "point_of_sales_products"("pointOfSaleId");

-- CreateIndex
CREATE INDEX "point_of_sales_products_productId_idx" ON "point_of_sales_products"("productId");

-- CreateIndex
CREATE INDEX "point_of_sales_products_createdAt_idx" ON "point_of_sales_products"("createdAt");

-- CreateIndex
CREATE INDEX "point_of_sales_products_createdBy_idx" ON "point_of_sales_products"("createdBy");

-- CreateIndex
CREATE INDEX "order_sessions_startTime_idx" ON "order_sessions"("startTime");

-- CreateIndex
CREATE INDEX "order_sessions_endTime_idx" ON "order_sessions"("endTime");

-- CreateIndex
CREATE INDEX "order_sessions_createdAt_idx" ON "order_sessions"("createdAt");

-- CreateIndex
CREATE INDEX "order_sessions_createdBy_idx" ON "order_sessions"("createdBy");

-- CreateIndex
CREATE INDEX "order_sessions_updatedAt_idx" ON "order_sessions"("updatedAt");

-- CreateIndex
CREATE INDEX "order_sessions_updatedBy_idx" ON "order_sessions"("updatedBy");

-- CreateIndex
CREATE INDEX "payment_types_name_idx" ON "payment_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payment_types_name_key" ON "payment_types"("name");

-- CreateIndex
CREATE INDEX "payment_methods_name_idx" ON "payment_methods"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payment_methods_name_key" ON "payment_methods"("name");

-- CreateIndex
CREATE INDEX "payment_timings_name_idx" ON "payment_timings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payment_timings_name_key" ON "payment_timings"("name");

-- CreateIndex
CREATE INDEX "payment_vouchers_orderSessionId_idx" ON "payment_vouchers"("orderSessionId");

-- CreateIndex
CREATE INDEX "payment_vouchers_totalAmount_idx" ON "payment_vouchers"("totalAmount");

-- CreateIndex
CREATE INDEX "payment_vouchers_createdAt_idx" ON "payment_vouchers"("createdAt");

-- CreateIndex
CREATE INDEX "payment_vouchers_createdBy_idx" ON "payment_vouchers"("createdBy");

-- CreateIndex
CREATE INDEX "payment_vouchers_updatedAt_idx" ON "payment_vouchers"("updatedAt");

-- CreateIndex
CREATE INDEX "payment_vouchers_updatedBy_idx" ON "payment_vouchers"("updatedBy");

-- CreateIndex
CREATE INDEX "payments_typeId_idx" ON "payments"("typeId");

-- CreateIndex
CREATE INDEX "payments_timingId_idx" ON "payments"("timingId");

-- CreateIndex
CREATE INDEX "payments_methodId_idx" ON "payments"("methodId");

-- CreateIndex
CREATE INDEX "payments_occuredAt_idx" ON "payments"("occuredAt");

-- CreateIndex
CREATE INDEX "payments_pointOfSaleId_idx" ON "payments"("pointOfSaleId");

-- CreateIndex
CREATE INDEX "payments_voucherId_idx" ON "payments"("voucherId");

-- CreateIndex
CREATE INDEX "payments_amount_idx" ON "payments"("amount");

-- CreateIndex
CREATE INDEX "payments_remarks_idx" ON "payments"("remarks");

-- CreateIndex
CREATE INDEX "payments_couponCode_idx" ON "payments"("couponCode");

-- CreateIndex
CREATE INDEX "payments_couponId_idx" ON "payments"("couponId");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- CreateIndex
CREATE INDEX "payments_createdBy_idx" ON "payments"("createdBy");

-- CreateIndex
CREATE INDEX "orders_orderSessionId_idx" ON "orders"("orderSessionId");

-- CreateIndex
CREATE INDEX "orders_orderedAt_idx" ON "orders"("orderedAt");

-- CreateIndex
CREATE INDEX "orders_orderNumber_idx" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "orders_subTotal_idx" ON "orders"("subTotal");

-- CreateIndex
CREATE INDEX "orders_discountTotal_idx" ON "orders"("discountTotal");

-- CreateIndex
CREATE INDEX "orders_taxTotal_idx" ON "orders"("taxTotal");

-- CreateIndex
CREATE INDEX "orders_totalAmount_idx" ON "orders"("totalAmount");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- CreateIndex
CREATE INDEX "orders_createdBy_idx" ON "orders"("createdBy");

-- CreateIndex
CREATE INDEX "orders_updatedAt_idx" ON "orders"("updatedAt");

-- CreateIndex
CREATE INDEX "orders_updatedBy_idx" ON "orders"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "order_items_productName_idx" ON "order_items"("productName");

-- CreateIndex
CREATE INDEX "order_items_unitPrice_idx" ON "order_items"("unitPrice");

-- CreateIndex
CREATE INDEX "order_items_quantity_idx" ON "order_items"("quantity");

-- CreateIndex
CREATE INDEX "order_items_discountTotal_idx" ON "order_items"("discountTotal");

-- CreateIndex
CREATE INDEX "order_items_taxTotal_idx" ON "order_items"("taxTotal");

-- CreateIndex
CREATE INDEX "order_items_totalAmount_idx" ON "order_items"("totalAmount");

-- CreateIndex
CREATE INDEX "order_items_remarks_idx" ON "order_items"("remarks");

-- CreateIndex
CREATE INDEX "order_items_createdAt_idx" ON "order_items"("createdAt");

-- CreateIndex
CREATE INDEX "order_items_createdBy_idx" ON "order_items"("createdBy");

-- CreateIndex
CREATE INDEX "order_items_updatedAt_idx" ON "order_items"("updatedAt");

-- CreateIndex
CREATE INDEX "order_items_updatedBy_idx" ON "order_items"("updatedBy");

-- CreateIndex
CREATE INDEX "invoices_orderSessionId_idx" ON "invoices"("orderSessionId");

-- CreateIndex
CREATE INDEX "invoices_issuedAt_idx" ON "invoices"("issuedAt");

-- CreateIndex
CREATE INDEX "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_subTotal_idx" ON "invoices"("subTotal");

-- CreateIndex
CREATE INDEX "invoices_discountTotal_idx" ON "invoices"("discountTotal");

-- CreateIndex
CREATE INDEX "invoices_taxTotal_idx" ON "invoices"("taxTotal");

-- CreateIndex
CREATE INDEX "invoices_totalAmount_idx" ON "invoices"("totalAmount");

-- CreateIndex
CREATE INDEX "invoices_createdAt_idx" ON "invoices"("createdAt");

-- CreateIndex
CREATE INDEX "invoices_createdBy_idx" ON "invoices"("createdBy");

-- CreateIndex
CREATE INDEX "invoices_updatedAt_idx" ON "invoices"("updatedAt");

-- CreateIndex
CREATE INDEX "invoices_updatedBy_idx" ON "invoices"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoice_items_invoiceId_idx" ON "invoice_items"("invoiceId");

-- CreateIndex
CREATE INDEX "invoice_items_productId_idx" ON "invoice_items"("productId");

-- CreateIndex
CREATE INDEX "invoice_items_productName_idx" ON "invoice_items"("productName");

-- CreateIndex
CREATE INDEX "invoice_items_unitPrice_idx" ON "invoice_items"("unitPrice");

-- CreateIndex
CREATE INDEX "invoice_items_quantity_idx" ON "invoice_items"("quantity");

-- CreateIndex
CREATE INDEX "invoice_items_discountTotal_idx" ON "invoice_items"("discountTotal");

-- CreateIndex
CREATE INDEX "invoice_items_taxTotal_idx" ON "invoice_items"("taxTotal");

-- CreateIndex
CREATE INDEX "invoice_items_totalAmount_idx" ON "invoice_items"("totalAmount");

-- CreateIndex
CREATE INDEX "invoice_items_remarks_idx" ON "invoice_items"("remarks");

-- CreateIndex
CREATE INDEX "invoice_items_createdAt_idx" ON "invoice_items"("createdAt");

-- CreateIndex
CREATE INDEX "invoice_items_createdBy_idx" ON "invoice_items"("createdBy");

-- CreateIndex
CREATE INDEX "invoice_items_updatedAt_idx" ON "invoice_items"("updatedAt");

-- CreateIndex
CREATE INDEX "invoice_items_updatedBy_idx" ON "invoice_items"("updatedBy");

-- CreateIndex
CREATE INDEX "price_adjustment_types_name_idx" ON "price_adjustment_types"("name");

-- CreateIndex
CREATE UNIQUE INDEX "price_adjustment_types_name_key" ON "price_adjustment_types"("name");

-- CreateIndex
CREATE INDEX "price_adjustment_policies_typeId_idx" ON "price_adjustment_policies"("typeId");

-- CreateIndex
CREATE INDEX "price_adjustment_policies_createdAt_idx" ON "price_adjustment_policies"("createdAt");

-- CreateIndex
CREATE INDEX "price_adjustment_policies_createdBy_idx" ON "price_adjustment_policies"("createdBy");

-- CreateIndex
CREATE INDEX "price_adjustment_policies_updatedAt_idx" ON "price_adjustment_policies"("updatedAt");

-- CreateIndex
CREATE INDEX "price_adjustment_policies_updatedBy_idx" ON "price_adjustment_policies"("updatedBy");

-- CreateIndex
CREATE INDEX "price_adjustables_name_idx" ON "price_adjustables"("name");

-- CreateIndex
CREATE UNIQUE INDEX "price_adjustables_name_key" ON "price_adjustables"("name");

-- CreateIndex
CREATE INDEX "price_adjustments_priceAdjustmentPolicyId_idx" ON "price_adjustments"("priceAdjustmentPolicyId");

-- CreateIndex
CREATE INDEX "price_adjustments_policyName_idx" ON "price_adjustments"("policyName");

-- CreateIndex
CREATE INDEX "price_adjustments_priceAdjustableId_idx" ON "price_adjustments"("priceAdjustableId");

-- CreateIndex
CREATE INDEX "price_adjustments_orderItemId_idx" ON "price_adjustments"("orderItemId");

-- CreateIndex
CREATE INDEX "price_adjustments_orderId_idx" ON "price_adjustments"("orderId");

-- CreateIndex
CREATE INDEX "price_adjustments_invoiceItemId_idx" ON "price_adjustments"("invoiceItemId");

-- CreateIndex
CREATE INDEX "price_adjustments_invoiceId_idx" ON "price_adjustments"("invoiceId");

-- CreateIndex
CREATE INDEX "price_adjustments_createdAt_idx" ON "price_adjustments"("createdAt");

-- CreateIndex
CREATE INDEX "price_adjustments_createdBy_idx" ON "price_adjustments"("createdBy");

-- CreateIndex
CREATE INDEX "price_adjustments_updatedAt_idx" ON "price_adjustments"("updatedAt");

-- CreateIndex
CREATE INDEX "price_adjustments_updatedBy_idx" ON "price_adjustments"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_event_types_name_key" ON "inventory_event_types"("name");

-- CreateIndex
CREATE INDEX "inventory_events_typeId_idx" ON "inventory_events"("typeId");

-- CreateIndex
CREATE INDEX "inventory_events_occuredAt_idx" ON "inventory_events"("occuredAt");

-- CreateIndex
CREATE INDEX "inventory_events_inventoryPlaceId_idx" ON "inventory_events"("inventoryPlaceId");

-- CreateIndex
CREATE INDEX "inventory_events_inventoryItemId_idx" ON "inventory_events"("inventoryItemId");

-- CreateIndex
CREATE INDEX "inventory_events_quantity_idx" ON "inventory_events"("quantity");

-- CreateIndex
CREATE INDEX "inventory_events_remarks_idx" ON "inventory_events"("remarks");

-- CreateIndex
CREATE INDEX "inventory_events_vendorId_idx" ON "inventory_events"("vendorId");

-- CreateIndex
CREATE INDEX "inventory_events_fromInventoryPlaceId_idx" ON "inventory_events"("fromInventoryPlaceId");

-- CreateIndex
CREATE INDEX "inventory_events_toInventoryPlaceId_idx" ON "inventory_events"("toInventoryPlaceId");

-- CreateIndex
CREATE INDEX "inventory_events_reason_idx" ON "inventory_events"("reason");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "unit_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_places" ADD CONSTRAINT "inventory_places_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_categories" ADD CONSTRAINT "inventory_item_categories_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "inventory_item_category_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item_categories" ADD CONSTRAINT "inventory_item_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "inventory_item_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_inventoryUnitId_fkey" FOREIGN KEY ("inventoryUnitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "inventory_item_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_inventory_items" ADD CONSTRAINT "product_inventory_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_inventory_items" ADD CONSTRAINT "product_inventory_items_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_of_sales" ADD CONSTRAINT "point_of_sales_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_of_sales_products" ADD CONSTRAINT "point_of_sales_products_pointOfSaleId_fkey" FOREIGN KEY ("pointOfSaleId") REFERENCES "point_of_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_of_sales_products" ADD CONSTRAINT "point_of_sales_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_sessions" ADD CONSTRAINT "order_sessions_pointOfSaleId_fkey" FOREIGN KEY ("pointOfSaleId") REFERENCES "point_of_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_vouchers" ADD CONSTRAINT "payment_vouchers_orderSessionId_fkey" FOREIGN KEY ("orderSessionId") REFERENCES "order_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "payment_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_timingId_fkey" FOREIGN KEY ("timingId") REFERENCES "payment_timings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "payment_methods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_pointOfSaleId_fkey" FOREIGN KEY ("pointOfSaleId") REFERENCES "point_of_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "payment_vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_amountUnitId_fkey" FOREIGN KEY ("amountUnitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_orderSessionId_fkey" FOREIGN KEY ("orderSessionId") REFERENCES "order_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_orderSessionId_fkey" FOREIGN KEY ("orderSessionId") REFERENCES "order_sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_adjustment_policies" ADD CONSTRAINT "price_adjustment_policies_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "price_adjustment_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_adjustments" ADD CONSTRAINT "price_adjustments_priceAdjustmentPolicyId_fkey" FOREIGN KEY ("priceAdjustmentPolicyId") REFERENCES "price_adjustment_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_adjustments" ADD CONSTRAINT "price_adjustments_priceAdjustableId_fkey" FOREIGN KEY ("priceAdjustableId") REFERENCES "price_adjustables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_adjustments" ADD CONSTRAINT "price_adjustments_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_adjustments" ADD CONSTRAINT "price_adjustments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_adjustments" ADD CONSTRAINT "price_adjustments_invoiceItemId_fkey" FOREIGN KEY ("invoiceItemId") REFERENCES "invoice_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_adjustments" ADD CONSTRAINT "price_adjustments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_events" ADD CONSTRAINT "inventory_events_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "inventory_event_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_events" ADD CONSTRAINT "inventory_events_inventoryPlaceId_fkey" FOREIGN KEY ("inventoryPlaceId") REFERENCES "inventory_places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_events" ADD CONSTRAINT "inventory_events_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
