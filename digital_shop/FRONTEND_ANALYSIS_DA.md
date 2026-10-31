# تحلیل کامل Frontend پروژه Digital Shop

## ۱. معرفی کلی پروژه

### پروژه دقیقاً چیست؟
**Digital Shop** یک پلتفرم بازار آنلاین برای فروش محصولات دیجیتال است. این برنامه به کاربران اجازه می‌دهد تا محصولات دیجیتالی مانند کتاب‌های الکترونیکی، قالب‌ها، دوره‌های آموزشی، عکس‌ها و سایر دارایی‌های دیجیتال قابل دانلود را خریداری و فروش کنند.

### هدف آن چیست؟
- فراهم کردن یک بازار مرکزی برای خریداران و فروشندگان محصولات دیجیتال
- تسهیل فرآیند خرید، پرداخت و دانلود محصولات دیجیتال
- ارائه داشبوردهای مدیریت برای فروشندگان و ادمین‌ها
- ایجاد تجربه کاربری مدرن و ریسپانسیو

### کاربران چه نقش‌هایی دارند؟
پروژه از ۴ نقش کاربری پشتیبانی می‌کند:
1. **Buyer (خریدار)**: می‌تواند محصولات را مشاهده، خریداری و دانلود کند
2. **Seller (فروشنده)**: می‌تواند محصولات آپلود، مدیریت و فروش خود را ردیابی کند
3. **Admin (ادمین)**: می‌تواند کاربران، محصولات و سفارش‌ها را مدیریت کند
4. **Superadmin (سوپر ادمین)**: دسترسی کامل به تمام بخش‌ها از جمله لاگ‌ها

### جریان کلی استفاده کاربر

**جریان خریدار:**
```
ورود/ثبت نام → مشاهده محصولات → افزودن به سبد خرید → بررسی سفارش → پرداخت PayPal → موفقیت پرداخت → دانلود محصولات
```

**جریان فروشنده:**
```
ورود/ثبت نام → داشبورد فروشنده → آپلود محصول → مدیریت محصولات → مشاهده آمار فروش → دریافت درآمد
```

**جریان ادمین:**
```
ورود → داشبورد ادمین → مدیریت کاربران → تایید/رد محصولات → مشاهده سفارش‌ها → مشاهده گزارشات
```

### معماری کلی Frontend
- **SPA (Single Page Application)** با React 19
- **مسیریابی سمت کلاینت** با React Router DOM
- **معماری لایه سرویس** برای جدا کردن منطق API از UI
- **Context API** برای مدیریت وضعیت جهانی
- **React Query** برای مدیریت داده سمت سرور و کشینگ
- **Axios** با اینترسپتورها برای مدیریت توکن JWT
- **Tailwind CSS** برای استایل‌دهی
- **Framer Motion** برای انیمیشن‌ها

---

## ۲. تکنولوژی‌ها و کتابخانه‌ها

### React 19.2.6
**چیست؟** کتابخانه UI برای ساخت رابط کاربری تعاملی  
**چه کاری انجام می‌دهد؟** رندر کردن کامپوننت‌ها، مدیریت وضعیت، مدیریت چرخه حیات  
**چرا استفاده شده؟** استاندارد صنعت برای ساخت SPA، اکوسیستم بزرگ، عملکرد بهینه  
**در کجا استفاده شده؟** تمام فایل‌های `.jsx` و `.js` در پروژه  
**ارتباط با سایر بخش‌ها:** پایه و اساس کل برنامه، با تمام کتابخانه‌ها سازگار است

### Vite 8.0.12
**چیست؟** ابزار بیلد و توسعه برای پروژه‌های مدرن  
**چه کاری انجام می‌دهد؟** سرور توسعه سریع، بیلد بهینه شده، HMR (Hot Module Replacement)  
**چرا استفاده شده؟** سرعت بالا در توسعه، بیلد بهینه، پشتیبانی از ES Modules  
**در کجا استفاده شده؟** `vite.config.js`، اسکریپت‌های `package.json`  
**ارتباط با سایر بخش‌ها:** محیط اجرای React را فراهم می‌کند

### React Router DOM 7.17.0
**چیست؟** کتابخانه مسیریابی برای React  
**چه کاری انجام می‌دهد؟** مسیریابی سمت کلاینت، مدیریت URL، محافظت از مسیرها  
**چرا استفاده شده؟** SPA بدون رفرش صفحه، محافظت از مسیرها بر اساس نقش  
**در کجا استفاده شده؟** `src/routes/index.jsx`، کامپوننت‌های Route  
**ارتباط با سایر بخش‌ها:** با Layoutها و ProtectedRouteها کار می‌کند

### Tailwind CSS 3.4.19
**چیست؟** فریمورک CSS مبتنی بر کلاس‌های کاربردی  
**چه کاری انجام می‌دهد؟** استایل‌دهی سریع بدون نوشتن CSS سفارشی  
**چرا استفاده شده؟** توسعه سریع، ریسپانسیو بودن، تم تاریک/روشن  
**در کجا استفاده شده؟** تمام کامپوننت‌ها با کلاس‌های Tailwind  
**ارتباط با سایر بخش‌ها:** با ThemeContext برای تم تاریک کار می‌کند

### Axios 1.17.0
**چیست؟** کلاینت HTTP مبتنی بر Promise  
**چه کاری انجام می‌دهد؟** ارسال درخواست‌های HTTP، مدیریت خطا، اینترسپتورها  
**چرا استفاده شده؟** اینترسپتور برای توکن JWT، مدیریت خطای 401، timeout  
**در کجا استفاده شده؟** `src/services/api/axiosConfig.js`، تمام سرویس‌ها  
**ارتباط با سایر بخش‌ها:** با AuthContext برای تازه‌سازی توکن کار می‌کند

### @tanstack/react-query 5.101.2
**چیست؟** کتابخانه مدیریت داده سمت سرور  
**چه کاری انجام می‌دهد؟** کشینگ، مدیریت درخواست‌های تکراری، وضعیت بارگذاری  
**چرا استفاده شده؟** جلوگیری از درخواست‌های تکراری، کش خودکار، مدیریت خطا  
**در کجا استفاده شده؟** `src/hooks/useOrderQueries.js`، `src/hooks/admin/`  
**ارتباط با سایر بخش‌ها:** با سرویس‌های API کار می‌کند

### React Hook Form 7.77.0
**چیست؟** کتابخانه فرم با رندر کم  
**چه کاری انجام می‌دهد؟** مدیریت فرم، اعتبارسنجی، ثبت فرم  
**چرا استفاده شده؟** رندر کم، اعتبارسنجی با Zod، کد کمتر  
**در کجا استفاده شده؟** `LoginForm.jsx`، `RegisterForm.jsx`، فرم‌های محصول  
**ارتباط با سایر بخش‌ها:** با Zod برای اعتبارسنجی کار می‌کند

### Zod 4.4.3
**چیست؟** کتابخانه اعتبارسنجی اسکیما در زمان اجرا  
**چه کاری انجام می‌دهد؟** اعتبارسنجی داده‌ها، تعریف اسکیما  
**چرا استفاده شده؟** اعتبارسنجی نوع‌ایمن، یکپارچگی با TypeScript  
**در کجا استفاده شده؟** فرم‌های ورود و ثبت نام  
**ارتباط با سایر بخش‌ها:** با React Hook Form کار می‌کند

### Framer Motion 12.40.0
**چیست؟** کتابخانه انیمیشن برای React  
**چه کاری انجام می‌دهد؟** انیمیشن‌های روان، transition، gesture  
**چرا استفاده شده؟** انیمیشن‌های حرفه‌ای، API ساده  
**در کجا استفاده شده؟** `SellerLayout.jsx`، `AdminLayout.jsx`، Toast  
**ارتباط با سایر بخش‌ها:** برای انیمیشن UI استفاده می‌شود

### Recharts 3.8.1
**چیست؟** کتابخانه نمودار برای React  
**چه کاری انجام می‌دهد؟** رسم نمودارهای Line، Bar، Pie  
**چرا استفاده شده؟** نمودارهای داشبورد، بصری‌سازی داده  
**در کجا استفاده شده؟** `AdminDashboardHome.jsx`، کامپوننت‌های فروشنده  
**ارتباط با سایر بخش‌ها:** داده‌های داشبورد را نمایش می‌دهد

### lucide-react 1.17.0
**چیست؟** کتابخانه آیکون  
**چه کاری انجام می‌دهد؟** آیکون‌های SVG قابل سفارشی‌سازی  
**چرا استفاده شده؟** آیکون‌های مدرن، سبک، قابل استایل‌دهی  
**در کجا استفاده شده؟** تمام کامپوننت‌ها برای آیکون‌ها  
**ارتباط با سایر بخش‌ها:** با Tailwind برای استایل کار می‌کند

### @react-oauth/google 0.13.5
**چیست؟** ادغام Google OAuth  
**چه کاری انجام می‌دهد؟** ورود با حساب Google  
**چرا استفاده شده؟** ورود آسان، بدون نیاز به رمز عبور  
**در کجا استفاده شده؟** `SocialAuthButtons.jsx`، `main.jsx`  
**ارتباط با سایر بخش‌ها:** با AuthContext برای مدیریت کاربر کار می‌کند

### jspdf 4.2.1 و jspdf-autotable 5.0.8
**چیست؟** تولید PDF در سمت کلاینت  
**چه کاری انجام می‌دهد؟** ایجاد فایل PDF از داده‌ها  
**چرا استفاده شده؟** گزارشات قابل دانلود، فاکتورها  
**در کجا استفاده شده؟** `exportReport.js`  
**ارتباط با سایر بخش‌ها:** برای گزارشات ادمین استفاده می‌شود

### clsx 2.1.1 و tailwind-merge 3.6.0
**چیست؟** توابع کاربردی برای ادغام کلاس‌ها  
**چه کاری انجام می‌دهد؟** ادغام کلاس‌های شرطی، حذف تکراری  
**چرا استفاده شده؟** کد تمیزتر، مدیریت کلاس‌های شرطی  
**در کجا استفاده شده؟** `src/lib/utils.js`، کامپوننت‌ها  
**ارتباط با سایر بخش‌ها:** با Tailwind کار می‌کند

---

## ۳. ساختار کامل فایل‌ها

### src/main.jsx
**وظیفه:** نقطه ورود برنامه، پیکربندی Providerها  
**Export:** هیچ (فایل اجرایی)  
**Import از:** React، GoogleOAuth، QueryClient، Contextها، App  
**استفاده توسط:** index.html  
**State/Logic:** پیکربندی QueryClient با staleTime و retry  
**API:** هیچ  
**چرا وجود دارد:** نقطه شروع برنامه، wrapping با Providerها  
**اگر حذف شود:** برنامه اجرا نمی‌شود

### src/App.jsx
**وظیفه:** کامپوننت ریشه، ارائه Router  
**Export:** App component  
**Import از:** react-router-dom، routes  
**استفاده توسط:** main.jsx  
**State/Logic:** هیچ  
**API:** هیچ  
**چرا وجود دارد:** ساده‌سازی نقطه ورود  
**اگر حذف شود:** برنامه بدون router اجرا نمی‌شود

### src/routes/index.jsx
**وظیفه:** تعریف تمام مسیرهای برنامه  
**Export:** router (createBrowserRouter)  
**Import از:** تمام صفحات، Layoutها، Route guards  
**استفاده توسط:** App.jsx  
**State/Logic:** تعریف ساختار مسیریابی  
**API:** هیچ  
**چرا وجود دارد:** مدیریت متمرکز مسیرها  
**اگر حذف شود:** هیچ مسیری کار نمی‌کند

### src/contexts/AuthContext.jsx
**وظیفه:** مدیریت وضعیت احراز هویت جهانی  
**Export:** AuthProvider، useAuth  
**Import از:** React، authService، api، ToastContext  
**استفاده توسط:** main.jsx، تمام کامپوننت‌های محافظت شده  
**State:** user، loading، isLoggingInRef، isRefreshingRef  
**Logic:** login، logout، updateUser، setUserFromGoogle، fetchAndMergeProfile، decodeJWT  
**API:** authService.login، api.get('/profile/')  
**چرا وجود دارد:** مدیریت متمرکز احراز هویت، جلوگیری از prop drilling  
**اگر حذف شود:** هیچ کاربر نمی‌تواند وارد شود

### src/contexts/CartContext.jsx
**وظیفه:** مدیریت وضعیت سبد خرید جهانی  
**Export:** CartProvider، useCart  
**Import از:** React، cartService، ToastContext  
**استفاده توسط:** main.jsx، CartPage، ProductCard، Header  
**State:** cartItems، loading، operationLoading، error  
**Logic:** fetchCart، addToCart، removeFromCart، clearCart  
**API:** cartService.getCart، cartService.addToCart، cartService.removeFromCart  
**چرا وجود دارد:** سبد خرید در سراسر برنامه قابل دسترسی  
**اگر حذف شود:** سبد خرید کار نمی‌کند

### src/contexts/ThemeContext.jsx
**وظیفه:** مدیریت تم تاریک/روشن  
**Export:** ThemeProvider، useTheme  
**Import از:** React  
**استفاده توسط:** main.jsx، Layoutها، دکمه‌های toggle  
**State:** theme  
**Logic:** toggleTheme، تشخیص ترجیح سیستم  
**API:** هیچ  
**چرا وجود دارد:** تم در سراسر برنامه قابل دسترسی  
**اگر حذف شود:** تم تاریک/روشن کار نمی‌کند

### src/contexts/ToastContext.jsx
**وظیفه:** سیستم اعلان Toast  
**Export:** ToastProvider، useToast  
**Import از:** React، lucide-react  
**استفاده توسط:** main.jsx، تمام کامپوننت‌ها  
**State:** toasts، timeoutRef  
**Logic:** addToast، removeToast، success، error، info، warning  
**API:** هیچ  
**چرا وجود دارد:** بازخورد کاربر در سراسر برنامه  
**اگر حذف شود:** هیچ اعلانی نمایش داده نمی‌شود

### src/services/api/axiosConfig.js
**وظیفه:** پیکربندی Axios با اینترسپتورها  
**Export:** axiosInstance (default)  
**Import از:** axios، API_ENDPOINTS  
**استفاده توسط:** تمام سرویس‌ها  
**State:** pendingRequests، refreshPromise  
**Logic:** اینترسپتور درخواست (توکن)، اینترسپتور پاسخ (تازه‌سازی، 429)  
**API:** تمام APIها از طریق این نمونه  
**چرا وجود دارد:** مدیریت متمرکز HTTP، تازه‌سازی خودکار توکن  
**اگر حذف شود:** هیچ درخواست API کار نمی‌کند

### src/services/auth/authService.js
**وظیفه:** سرویس‌های احراز هویت  
**Export:** authService، default  
**Import از:** API_ENDPOINTS، api  
**استفاده توسط:** AuthContext، LoginForm، RegisterForm  
**State:** هیچ  
**Logic:** login، register، logout، refreshToken، forgotPassword، resetPassword  
**API:** /login/، /register/، /token/refresh/، /password-reset-request/، /password-reset-confirm/  
**چرا وجود دارد:** انتزاع منطق احراز هویت  
**اگر حذف شود:** ورود/ثبت نام کار نمی‌کند

### src/services/cart/cartService.js
**وظیفه:** سرویس‌های سبد خرید  
**Export:** cartService، default  
**Import از:** api  
**استفاده توسط:** CartContext  
**State:** هیچ  
**Logic:** getCart، addToCart، removeFromCart  
**API:** /cart/، /cart/add/، /cart/remove/  
**چرا وجود دارد:** انتزاع منطق سبد خرید  
**اگر حذف شود:** سبد خرید کار نمی‌کند

### src/services/order/orderService.js
**وظیفه:** سرویس‌های سفارش و دانلود  
**Export:** orderService، default  
**Import از:** axiosInstance  
**استفاده توسط:** useOrderQueries، صفحات خریدار  
**State:** هیچ  
**Logic:** createOrder، createPaypalOrder، capturePaypalOrder، getOrderHistory، getMyPurchased، downloadProduct، getMyDownloads  
**API:** /orders/create/، /orders/paypal/create/، /orders/paypal/capture/، /orders/orderhistory/، /products/my-purchased/، /products/download/، /products/my-downloads/  
**چرا وجود دارد:** انتزاع منطق سفارش  
**اگر حذف شود:** سفارش و دانلود کار نمی‌کند

### src/services/seller/sellerService.js
**وظیفه:** سرویس‌های فروشنده  
**Export:** sellerService، default  
**Import از:** API_ENDPOINTS، api  
**استفاده توسط:** صفحات فروشنده، useOrderQueries  
**State:** هیچ  
**Logic:** getDashboardStats، getMyProducts، getAllProducts، getSalesHistory، getSalesReport، getRevenueReport، getProductReport، getCustomerReport، createProduct، updateProduct، deleteProduct  
**API:** /products/seller-dashboard/، /products/my-products/، /products/create/، /products/edit/، /products/delete/  
**چرا وجود دارد:** انتزاع منطق فروشنده  
**اگر حذف شود:** داشبورد فروشنده کار نمی‌کند

### src/services/admin/adminService.js
**وظیفه:** سرویس‌های ادمین  
**Export:** adminService، default  
**Import از:** axios  
**استفاده توسط:** صفحات ادمین، hooks ادمین  
**State:** هیچ  
**Logic:** getDashboardStats، getUsers، activateUser، suspendUser، setSuperAdmin، removeSuperAdmin، getProducts، getPendingProducts، approveProduct، rejectProduct، getOrders، getOrderDetail، getReports، getTopProducts، getRevenueReport، getDownloadReport، getLogs، getContactMessages، replyToContactMessage، getPlatformRevenue  
**API:** /admin-api/dashboard/، /admin-api/users/، /admin-api/products/، /admin-api/orders/، /admin-api/reports/، /admin-api/logs/، /contact-message/، /orders/platform-revenue/  
**چرا وجود دارد:** انتزاع منطق ادمین، نمونه Axios جداگانه  
**اگر حذف شود:** داشبورد ادمین کار نمی‌کند

### src/constants/endpoints.js
**وظیفه:** تعاریف متمرکز API endpoint  
**Export:** API_ENDPOINTS  
**Import از:** هیچ  
**استفاده توسط:** تمام سرویس‌ها  
**State:** هیچ  
**Logic:** هیچ  
**API:** هیچ  
**چرا وجود دارد:** جلوگیری از hardcoding URLها، ثبات  
**اگر حذف شود:** تمام سرویس‌ها خراب می‌شوند

### src/constants/roles.js
**وظیفه:** تعاریف نقش‌ها و مجوزها  
**Export:** ROLES، ROLE_PERMISSIONS  
**Import از:** هیچ  
**استفاده توسط:** Route guards، کامپوننت‌های ادمین  
**State:** هیچ  
**Logic:** هیچ  
**API:** هیچ  
**چرا وجود دارد:** مدیریت متمرکز نقش‌ها  
**اگر حذف شود:** کنترل دسترسی خراب می‌شود

### src/hooks/useOrderQueries.js
**وظیفه:** React Query hooks برای سفارش‌ها  
**Export:** orderKeys، productKeys، sellerKeys، useCreateOrder، useOrderHistory، useMyPurchased، useMyDownloads، useSellerDashboard، useCreatePaypalOrder، useCapturePaypalOrder  
**Import از:** @tanstack/react-query، orderService، productService، sellerService  
**استفاده توسط:** صفحات خریدار، صفحات فروشنده  
**State:** هیچ (React Query state)  
**Logic:** query keys، mutations، invalidation  
**API:** از طریق سرویس‌ها  
**چرا وجود دارد:** مدیریت داده سمت سرور، کشینگ  
**اگر حذف شود:** داده‌های سفارش بارگذاری نمی‌شوند

### src/hooks/admin/useAdminDashboard.js
**وظیفه:** React Query hook برای داشبورد ادمین  
**Export:** useAdminDashboard  
**Import از:** @tanstack/react-query، adminService  
**استفاده توسط:** AdminDashboardHome  
**State:** هیچ (React Query state)  
**Logic:** Promise.all برای dashboard stats و platform revenue  
**API:** /admin-api/dashboard/، /orders/platform-revenue/  
**چرا وجود دارد:** مدیریت داده داشبورد ادمین  
**اگر حضف شود:** داشبورد ادمین خالی می‌ماند

### src/hooks/admin/useAdminReports.js
**وظیفه:** React Query hooks برای گزارشات ادمین  
**Export:** useAdminReports، useTopProducts، useRevenueReport، useDownloadReport  
**Import از:** @tanstack/react-query، adminService  
**استفاده توسط:** Reports page  
**State:** هیچ (React Query state)  
**Logic:** query hooks جداگانه برای هر گزارش  
**API:** /admin-api/reports/، /admin-api/reports/top-products/، /admin-api/reports/revenue/، /admin-api/reports/download/  
**چرا وجود دارد:** مدیریت داده گزارشات  
**اگر حذف شود:** گزارشات بارگذاری نمی‌شوند

### src/hooks/useDebounce.js
**وظیفه:** هوک debounce برای ورودی‌های جستجو  
**Export:** useDebounce  
**Import از:** React  
**استفاده توسط:** ProductsPage، MyDownloadsPage  
**State:** debouncedValue  
**Logic:** setTimeout برای تاخیر  
**API:** هیچ  
**چرا وجود دارد:** کاهش درخواست‌های API در جستجو  
**اگر حذف شود:** جستجو به ازای هر کاراکتر درخواست می‌فرستد

### src/hooks/useLocalStorage.js
**وظیفه:** هوک کاربردی localStorage  
**Export:** useLocalStorage  
**Import از:** React  
**استفاده توسط:** ThemeContext (indirect)  
**State:** storedValue  
**Logic:** خواندن/نوشتن در localStorage  
**API:** هیچ  
**چرا وجود دارد:** ساده‌سازی localStorage  
**اگر حذف شود:** localStorage باید مستقیماً استفاده شود

### src/components/auth/ProtectedRoute.jsx
**وظیفه:** محافظت از مسیرهای احراز هویت شده  
**Export:** ProtectedRoute  
**Import از:** react-router-dom، AuthContext، lucide-react  
**استفاده توسط:** routes/index.jsx  
**State:** هیچ  
**Logic:** بررسی isAuthenticated، loading، redirect  
**API:** هیچ  
**چرا وجود دارد:** جلوگیری از دسترسی بدون احراز هویت  
**اگر حذف شود:** مسیرهای محافظت شده باز می‌شوند

### src/components/auth/SellerRoute.jsx
**وظیفه:** محافظت از مسیرهای فروشنده  
**Export:** SellerRoute  
**Import از:** react-router-dom، AuthContext، lucide-react  
**استفاده توسط:** routes/index.jsx  
**State:** هیچ  
**Logic:** بررسی userRole === 'seller'  
**API:** هیچ  
**چرا وجود دارد:** جلوگیری از دسترسی غیر فروشنده  
**اگر حذف شود:** هر کسی می‌تواند به داشبورد فروشنده دسترسی داشته باشد

### src/components/auth/BuyerRoute.jsx
**وظیفه:** محافظت از مسیرهای خریدار  
**Export:** BuyerRoute  
**Import از:** react-router-dom، AuthContext، ROLES  
**استفاده توسط:** routes/index.jsx  
**State:** هیچ  
**Logic:** بررسی role (buyer، admin، superadmin)  
**API:** هیچ  
**چرا وجود دارد:** جلوگیری از دسترسی غیر خریدار  
**اگر حذف شود:** هر کسی می‌تواند به داشبورد خریدار دسترسی داشته باشد

### src/components/auth/AdminRoute.jsx
**وظیفه:** محافظت از مسیرهای ادمین  
**Export:** AdminRoute  
**Import از:** react-router-dom، AuthContext، ROLES، lucide-react  
**استفاده توسط:** routes/index.jsx  
**State:** هیچ  
**Logic:** بررسی role === 'admin' یا is_super_admin  
**API:** هیچ  
**چرا وجود دارد:** جلوگیری از دسترسی غیر ادمین  
**اگر حذف شود:** هر کسی می‌تواند به داشبورد ادمین دسترسی داشته باشد

### src/components/auth/LoginForm.jsx
**وظیفه:** فرم ورود  
**Export:** LoginForm  
**Import از:** React، react-router-dom، react-hook-form، zod، AuthContext، کامپوننت‌های auth  
**استفاده توسط:** LoginPage  
**State:** isLoading، error  
**Logic:** اعتبارسنجی Zod، submit به AuthContext.login، redirect بر اساس نقش  
**API:** از طریق AuthContext  
**چرا وجود دارد:** UI فرم ورود  
**اگر حذف شود:** کاربر نمی‌تواند وارد شود

### src/components/auth/RegisterForm.jsx
**وظیفه:** فرم ثبت نام  
**Export:** RegisterForm  
**Import از:** React، react-router-dom، react-hook-form، zod، AuthContext، authService، کامپوننت‌های auth  
**استفاده توسط:** RegisterPage  
**State:** isLoading، error  
**Logic:** اعتبارسنجی Zod، ثبت نام با authService، auto-login، redirect بر اساس نقش  
**API:** /register/، /login/  
**چرا وجود دارد:** UI فرم ثبت نام  
**اگر حذف شود:** کاربر جدید نمی‌تواند ثبت نام کند

### src/layouts/MainLayout.jsx
**وظیفه:** لی‌اوت اصلی برای صفحات عمومی  
**Export:** MainLayout  
**Import از:** react-router-dom، Header، Footer  
**استفاده توسط:** routes/index.jsx  
**State:** هیچ  
**Logic:** رندر Header، Outlet، Footer  
**API:** هیچ  
**چرا وجود دارد:** ساختار ثابت صفحات عمومی  
**اگر حذف شود:** صفحات عمومی بدون Header و Footer

### src/layouts/SellerLayout.jsx
**وظیفه:** لی‌اوت داشبورد فروشنده  
**Export:** SellerLayout  
**Import از:** React، react-router-dom، SellerSidebar، lucide-react، framer-motion، AuthContext، ThemeContext، utils، assets  
**استفاده توسط:** routes/index.jsx  
**State:** sidebarOpen، profileDropdownOpen، searchQuery  
**Logic:** toggle sidebar، dropdown profile، search navigation، logout  
**API:** هیچ  
**چرا وجود دارد:** ساختار داشبورد فروشنده با sidebar  
**اگر حذف شود:** صفحات فروشنده بدون sidebar

### src/layouts/AdminLayout.jsx
**وظیفه:** لی‌اوت داشبورد ادمین  
**Export:** AdminLayout  
**Import از:** React، react-router-dom، AdminSidebar، lucide-react، framer-motion، AuthContext، ThemeContext، utils، assets  
**استفاده توسط:** routes/index.jsx  
**State:** sidebarOpen، profileDropdownOpen  
**Logic:** toggle sidebar، dropdown profile، logout  
**API:** هیچ  
**چرا وجود دارد:** ساختار داشبورد ادمین با sidebar  
**اگر حذف شود:** صفحات ادمین بدون sidebar

### src/pages/home/HomePage.jsx
**وظیفه:** صفحه اصلی  
**Export:** HomePage  
**Import از:** کامپوننت‌های home  
**استفاده توسط:** routes/index.jsx  
**State:** هیچ  
**Logic:** ترکیب کامپوننت‌های home  
**API:** هیچ  
**چرا وجود دارد:** صفحه اصلی برنامه  
**اگر حذف شود:** صفحه اصلی خالی

### src/pages/public/ProductsPage.jsx
**وظیفه:** صفحه لیست محصولات  
**Export:** ProductsPage (default)  
**Import از:** React، react-router-dom، lucide-react، productService، کامپوننت‌های products، useDebounce  
**استفاده توسط:** routes/index.jsx  
**State:** products، filteredProducts، loading، error، searchQuery، selectedCategory، currentPage، initialParamsLoaded، isFetchingRef  
**Logic:** fetchProducts با debounce، فیلتر سمت کلاینت، pagination، URL params  
**API:** /products/ با params (search، category)  
**چرا وجود دارد:** نمایش و جستجوی محصولات  
**اگر حذف شود:** کاربر نمی‌تواند محصولات را ببیند

### src/pages/buyer/CartPage.jsx
**وظیفه:** صفحه سبد خرید  
**Export:** CartPage (default)  
**Import از:** React، CartContext، lucide-react، react-router-dom، api  
**استفاده توسط:** routes/index.jsx  
**State:** productsMap، loadingProducts، currentPage  
**Logic:** fetchCart، enrich با product details، pagination، remove from cart  
**API:** /cart/، /products/  
**چرا وجود دارد:** نمایش و مدیریت سبد خرید  
**اگر حذف شود:** کاربر نمی‌تواند سبد خرید را ببیند

### src/pages/buyer/OrderReviewPage.jsx
**وظیفه:** صفحه بررسی سفارش  
**Export:** OrderReviewPage (default)  
**Import از:** React، react-router-dom، CartContext، ToastContext، useOrderQueries، lucide-react، assets  
**استفاده توسط:** routes/index.jsx  
**State:** paypalOpened، paypalLink  
**Logic:** create order on mount، create PayPal order، display order details، clear cart on success  
**API:** /orders/create/، /orders/paypal/create/  
**چرا وجود دارد:** بررسی سفارش قبل از پرداخت  
**اگر حذف شود:** کاربر نمی‌تواند سفارش را بررسی کند

### src/pages/buyer/PaymentSuccessPage.jsx
**وظیفه:** صفحه موفقیت پرداخت  
**Export:** PaymentSuccessPage (default)  
**Import از:** React، react-router-dom، ToastContext، useOrderQueries، lucide-react، framer-motion  
**استفاده توسط:** routes/index.jsx  
**State:** countdown، isNavigating، hasCapturedRef، countdownTimerRef  
**Logic:** capture PayPal payment، auto-redirect countdown، prevent duplicate capture  
**API:** /orders/paypal/capture/  
**چرا وجود دارد:** تایید پرداخت و redirect  
**اگر حذف شود:** پرداخت تایید نمی‌شود

### src/pages/buyer/MyPurchasedPage.jsx
**وظیفه:** صفحه خریدهای من  
**Export:** MyPurchasedPage (default)  
**Import از:** React، react-router-dom، ToastContext، useOrderQueries، orderService، lucide-react  
**استفاده توسط:** routes/index.jsx  
**State:** downloading، currentPage  
**Logic:** fetch purchased products، download با blob، pagination، image URL handling  
**API:** /products/my-purchased/، /products/download/  
**چرا وجود دارد:** نمایش و دانلود محصولات خریداری شده  
**اگر حذف شود:** کاربر نمی‌تواند خریدهای خود را ببیند یا دانلود کند

### src/pages/buyer/MyDownloadsPage.jsx
**وظیفه:** صفحه تاریخچه دانلود  
**Export:** MyDownloadsPage (default)  
**Import از:** React، react-router-dom، ToastContext، orderService، useDebounce، lucide-react  
**استفاده توسط:** routes/index.jsx  
**State:** downloads، loading، error، searchQuery، currentPage، isFetchingRef  
**Logic:** fetch download history، filter با search، pagination  
**API:** /products/my-downloads/  
**چرا وجود دارد:** نمایش تاریخچه دانلود  
**اگر حذف شود:** کاربر نمی‌تواند تاریخچه دانلود را ببیند

### src/pages/seller/SellerDashboard.jsx
**وظیفه:** داشبورد فروشنده  
**Export:** SellerDashboard (default)  
**Import از:** React، react-router-dom، کامپوننت‌های seller، lucide-react، useOrderQueries، assets  
**استفاده توسط:** routes/index.jsx  
**State:** هیچ  
**Logic:** fetch dashboard stats، navigate به صفحات فروشنده  
**API:** /products/seller-dashboard/  
**چرا وجود دارد:** نمایش آمار فروشنده  
**اگر حذف شود:** فروشنده نمی‌تواند داشبورد را ببیند

### src/pages/admin/AdminDashboardHome.jsx
**وظیفه:** داشبورد ادمین  
**Export:** AdminDashboardHome  
**Import از:** useAdminDashboard، کامپوننت‌های admin، lucide-react، recharts  
**استفاده توسط:** routes/index.jsx  
**State:** هیچ  
**Logic:** fetch dashboard stats و platform revenue، prepare chart data  
**API:** /admin-api/dashboard/، /orders/platform-revenue/  
**چرا وجود دارد:** نمایش آمار پلتفرم  
**اگر حذف شود:** ادمین نمی‌تواند داشبورد را ببیند

### src/utils/formatCurrency.js
**وظیفه:** فرمت ارز  
**Export:** formatCurrency  
**Import از:** هیچ  
**استفاده توسط:** کامپوننت‌های مختلف  
**State:** هیچ  
**Logic:** Intl.NumberFormat  
**API:** هیچ  
**چرا وجود دارد:** فرمت ثابت ارز  
**اگر حذف شود:** ارز فرمت نمی‌شود

### src/utils/formatDate.js
**وظیفه:** فرمت تاریخ  
**Export:** formatDate  
**Import از:** هیچ  
**استفاده توسط:** کامپوننت‌های مختلف  
**State:** هیچ  
**Logic:** Intl.DateTimeFormat  
**API:** هیچ  
**چرا وجود دارد:** فرمت ثابت تاریخ  
**اگر حذف شود:** تاریخ فرمت نمی‌شود

### src/utils/getUserInitials.js
**وظیفه:** استخراج حروف اول نام کاربر  
**Export:** getUserInitials  
**Import از:** هیچ  
**استفاده توسط:** Layoutها، UserMenu  
**State:** هیچ  
**Logic:** split و extract  
**API:** هیچ  
**چرا وجود دارد:** آواتار با حروف اول  
**اگر حذف شود:** آواتار کار نمی‌کند

### فایل‌های غیرمهم
- `src/lib/utils.js` - تابع cn برای ادغام کلاس‌ها
- `src/types/index.js` - تعاریف نوع (در حال حاضر کم استفاده)
- `src/data/homeData.js` - داده‌های mock برای صفحه اصلی

---

## ۴. Components

### ProtectedRoute
**وظیفه:** محافظت از مسیرهای احراز هویت شده  
**Props:** children  
**State:** هیچ (از AuthContext استفاده می‌کند)  
**Hooks:** useAuth  
**Eventها:** هیچ  
**APIها:** هیچ  
**Componentهای فرزند:** Loader2  
**ارتباط با Context:** useAuth برای isAuthenticated و loading  
**ارتباط با React Query:** هیچ  
**نحوه Render:** اگر loading → spinner، اگر !isAuthenticated → Navigate، در غیر این صورت children  
**دلیل استفاده:** جلوگیری از دسترسی بدون احراز هویت

### SellerRoute
**وظیفه:** محافظت از مسیرهای فروشنده  
**Props:** children  
**State:** هیچ (از AuthContext استفاده می‌کند)  
**Hooks:** useAuth  
**Eventها:** هیچ  
**APIها:** هیچ  
**Componentهای فرزند:** Loader2  
**ارتباط با Context:** useAuth برای userRole  
**ارتباط با React Query:** هیچ  
**نحوه Render:** اگر loading → spinner، اگر userRole !== 'seller' → Navigate به /، در غیر این صورت children  
**دلیل استفاده:** محدود کردن دسترسی به فروشندگان

### BuyerRoute
**وظیفه:** محافظت از مسیرهای خریدار  
**Props:** children  
**State:** هیچ (از AuthContext استفاده می‌کند)  
**Hooks:** useAuth  
**Eventها:** هیچ  
**APIها:** هیچ  
**Componentهای فرزند:** هیچ  
**ارتباط با Context:** useAuth برای user و isAuthenticated  
**ارتباط با React Query:** هیچ  
**نحوه Render:** اگر loading → spinner، اگر !isAuthenticated → Navigate، اگر role === seller → Navigate به /seller، در غیر این صورت children  
**دلیل استفاده:** محدود کردن دسترسی به خریداران (و ادمین‌ها)

### AdminRoute
**وظیفه:** محافظت از مسیرهای ادمین  
**Props:** children  
**State:** هیچ (از AuthContext استفاده می‌کند)  
**Hooks:** useAuth  
**Eventها:** هیچ  
**APIها:** هیچ  
**Componentهای فرزند:** Loader2  
**ارتباط با Context:** useAuth برای user و is_super_admin  
**ارتباط با React Query:** هیچ  
**نحوه Render:** اگر loading → spinner، اگر role !== 'admin' و !is_super_admin → Navigate به /، در غیر این صورت children  
**دلیل استفاده:** محدود کردن دسترسی به ادمین‌ها

### LoginForm
**وظیفه:** فرم ورود کاربر  
**Props:** هیچ  
**State:** isLoading، error  
**Hooks:** useForm، useAuth، useNavigate  
**Eventها:** onSubmit  
**APIها:** از طریق AuthContext.login  
**Componentهای فرزند:** PasswordInput، SocialAuthButtons، AuthDivider  
**ارتباط با Context:** useAuth برای login  
**ارتباط با React Query:** هیچ  
**نحوه Render:** فرم با اعتبارسنجی Zod، loading state، error display  
**دلیل استفاده:** UI فرم ورود با اعتبارسنجی

### RegisterForm
**وظیفه:** فرم ثبت نام کاربر  
**Props:** هیچ  
**State:** isLoading، error  
**Hooks:** useForm، useAuth، useNavigate  
**Eventها:** onSubmit  
**APIها:** authService.register، AuthContext.login  
**Componentهای فرزند:** PasswordInput، SocialAuthButtons، AuthDivider  
**ارتباط با Context:** useAuth برای login  
**ارتباط با React Query:** هیچ  
**نحوه Render:** فرم با انتخاب نقش، اعتبارسنجی Zod، auto-login  
**دلیل استفاده:** UI فرم ثبت نام با انتخاب نقش

### StatsCards
**وظیفه:** نمایش کارت‌های آمار فروشنده  
**Props:** stats، loading  
**State:** هیچ  
**Hooks:** هیچ  
**Eventها:** هیچ  
**APIها:** هیچ  
**Componentهای فرزند:** lucide-react icons  
**ارتباط با Context:** هیچ  
**ارتباط با React Query:** هیچ  
**نحوه Render:** گرید کارت با icon، label، value  
**دلیل استفاده:** نمایش آمار داشبورد

---

## ۵. Pages و Routing

### مسیرهای عمومی (Public Routes)
- `/` - HomePage (صفحه اصلی)
- `/about` - AboutPage (درباره ما)
- `/contact` - ContactPage (تماس با ما)
- `/products` - ProductsPage (لیست محصولات)
- `/products/:id` - ProductDetailPage (جزئیات محصول)

### مسیرهای احراز هویت (Auth Routes)
- `/auth/login` - LoginPage (ورود)
- `/auth/register` - RegisterPage (ثبت نام)
- `/forgot-password` - ForgotPasswordPage (فراموشی رمز)
- `/forgot-password/verify` - PasswordResetVerifyPage (تایید بازنشانی)

### مسیرهای محافظت شده (Protected Routes)
- `/profile` - ProfilePage (پروفایل)
- `/profile/edit` - EditProfilePage (ویرایش پروفایل)
- `/buyer/cart` - CartPage (سبد خرید)
- `/buyer/order-review` - OrderReviewPage (بررسی سفارش)
- `/payment-success` - PaymentSuccessPage (موفقیت پرداخت)

### مسیرهای خریدار (Buyer Routes)
- `/buyer` - BuyerDashboard (داشبورد خریدار)
- `/buyer/dashboard` - BuyerDashboard
- `/buyer/my-purchased` - MyPurchasedPage (خریدهای من)
- `/buyer/my-downloads` - MyDownloadsPage (دانلودهای من)
- `/buyer/order-history` - OrderHistoryPage (تاریخچه سفارش)

### مسیرهای فروشنده (Seller Routes)
- `/seller` - SellerDashboard (داشبورد فروشنده)
- `/seller/dashboard` - SellerDashboard
- `/seller/dashboard/products` - TotalProducts (محصولات کل)
- `/seller/dashboard/sales` - TotalSales (فروش کل)
- `/seller/dashboard/revenue` - Revenue (درآمد)
- `/seller/reports` - Reports (گزارشات)
- `/seller/distribution` - ProductDistribution (توزیع محصولات)
- `/seller/products` - MyProducts (محصولات من)
- `/seller/upload` - AddProduct (افزودن محصول)
- `/seller/products/:id/edit` - EditProduct (ویرایش محصول)

### مسیرهای ادمین (Admin Routes)
- `/admin` - AdminDashboardHome (داشبورد ادمین)
- `/admin/users` - UsersManagement (مدیریت کاربران)
- `/admin/products` - ProductsManagement (مدیریت محصولات)
- `/admin/orders` - OrdersManagement (مدیریت سفارش‌ها)
- `/admin/orders/:orderId` - OrderDetails (جزئیات سفارش)
- `/admin/reports` - AdminReports (گزارشات ادمین)
- `/admin/logs` - Logs (لاگ‌ها)
- `/admin/contact-messages` - ContactMessages (پیام‌های تماس)

---

## ۶. Authentication

### جریان کامل Authentication

```
1. Login
   ↓
2. API Call: POST /login/ with {email, password}
   ↓
3. Backend Response: {access: "...", refresh: "..."}
   ↓
4. Storage: localStorage.setItem('access_token', access)
   ↓
5. Storage: localStorage.setItem('refresh_token', refresh)
   ↓
6. JWT Decode: Extract email, username, role, full_name, is_super_admin
   ↓
7. AuthContext: setUser(userData)
   ↓
8. Storage: localStorage.setItem('user_data', JSON.stringify(userData))
   ↓
9. Profile Fetch: GET /profile/ (async، non-blocking)
   ↓
10. AuthContext: updateUser with profile data
   ↓
11. Protected Route: Check isAuthenticated
   ↓
12. Role-based Redirect:
    - admin/superadmin → /admin
    - seller → /seller/dashboard
    - buyer → /products
```

### Token Refresh
```
1. API Request with 401
   ↓
2. Response Interceptor: Check 401 && !originalRequest._retry
   ↓
3. Set originalRequest._retry = true
   ↓
4. Check if refreshPromise exists (prevent duplicate)
   ↓
5. If exists: await existing refreshPromise
   ↓
6. If not exists: Create new refreshPromise
   ↓
7. POST /token/refresh/ with {refresh: refreshToken}
   ↓
8. Response: {access: "..."}
   ↓
9. Storage: localStorage.setItem('access_token', access)
   ↓
10. Retry original request with new token
   ↓
11. If refresh fails: Clear tokens، redirect to login
```

### Logout
```
1. AuthContext.logout()
   ↓
2. localStorage.removeItem('access_token')
   ↓
3. localStorage.removeItem('refresh_token')
   ↓
4. localStorage.removeItem('user_data')
   ↓
5. setUser(null)
   ↓
6. Navigate to home or login
```

### Google OAuth
```
1. User clicks "Continue with Google"
   ↓
2. Google OAuth Popup opens
   ↓
3. User grants permission
   ↓
4. Google returns token
   ↓
5. POST /google/ with {token: googleToken}
   ↓
6. Backend Response: {access: "...", refresh: "...", user: {...}}
   ↓
7. Storage: Save tokens
   ↓
8. AuthContext.setUserFromGoogle(userData)
   ↓
9. Redirect based on role
```

---

## ۷. API و Axios

### Axios Configuration

**Base URL:** `http://localhost:8000/api` (قابل تنظیم با VITE_API_BASE_URL)  
**Timeout:** 60000ms  
**Headers پیش‌فرض:** Content-Type: application/json

### Request Interceptor
```javascript
// به هر درخواست توکن دسترسی اضافه می‌شود
config.headers.Authorization = `Bearer ${token}`
```

### Response Interceptor

**مدیریت 429 (Rate Limit):**
- انتظار 5000ms
- تلاش مجدد درخواست اصلی

**مدیریت 401 (Unauthorized):**
- بررسی `_retry` flag برای جلوگیری از loop
- بررسی `_skipAuthRedirect` flag برای مسیرهای عمومی
- استفاده از `refreshPromise` برای جلوگیری از درخواست‌های تکراری تازه‌سازی
- POST به `/token/refresh/` با refresh token
- ذخیره access token جدید
- تلاش مجدد درخواست اصلی
- در صورت شکست: پاک کردن توکن‌ها، redirect به login (اگر مسیر عمومی نباشد)

### API Endpoints

**Auth:**
- POST `/login/` - ورود
- POST `/register/` - ثبت نام
- POST `/token/refresh/` - تازه‌سازی توکن
- POST `/password-reset-request/` - درخواست بازنشانی رمز
- POST `/password-reset-confirm/` - تایید بازنشانی رمز
- POST `/google/` - Google OAuth

**Products:**
- GET `/products/` - لیست محصولات (با params: search، category)
- GET `/products/:id/` - جزئیات محصول
- POST `/products/` - ایجاد محصول
- PUT `/products/:id/` - ویرایش محصول
- DELETE `/products/:id/` - حذف محصول
- GET `/products/download/:id/` - دانلود محصول (blob)
- GET `/products/my-purchased/` - خریدهای من
- GET `/products/my-downloads/` - دانلودهای من

**Cart:**
- GET `/cart/` - دریافت سبد خرید
- POST `/cart/add/` - افزودن به سبد
- POST `/cart/remove/` - حذف از سبد

**Orders:**
- POST `/orders/create/` - ایجاد سفارش
- POST `/orders/paypal/create/:id/` - ایجاد سفارش PayPal
- POST `/orders/paypal/capture/:id/` - تایید پرداخت PayPal
- GET `/orders/orderhistory/` - تاریخچه سفارش
- GET `/orders/platform-revenue/` - درآمد پلتفرم

**Seller:**
- GET `/products/seller-dashboard/` - آمار داشبورد فروشنده
- GET `/products/my-products/` - محصولات فروشنده
- POST `/products/create/` - ایجاد محصول فروشنده
- PUT `/products/edit/:id/` - ویرایش محصول فروشنده
- DELETE `/products/delete/:id/` - حذف محصول فروشنده

**Admin:**
- GET `/admin-api/dashboard/` - آمار داشبورد ادمین
- GET `/admin-api/users/` - لیست کاربران
- POST `/admin-api/users/:id/activate/` - فعال‌سازی کاربر
- POST `/admin-api/users/:id/suspend/` - تعلیق کاربر
- GET `/admin-api/products/` - لیست محصولات
- GET `/admin-api/orders/` - لیست سفارش‌ها
- GET `/admin-api/reports/` - گزارشات
- GET `/admin-api/logs/` - لاگ‌ها

**Contact:**
- POST `/contact/` - ارسال پیام تماس
- GET `/contact-message/` - دریافت پیام‌های تماس
- PATCH `/contact-message/:id/reply/` - پاسخ به پیام

---

## ۸. React Query

### استفاده در پروژه

**Query Keys:**
```javascript
orderKeys: {
  all: ['orders'],
  history: () => [...orderKeys.all, 'history'],
  detail: (id) => [...orderKeys.all, id],
}

productKeys: {
  all: ['products'],
  purchased: () => [...productKeys.all, 'purchased'],
  downloads: () => [...productKeys.all, 'downloads'],
}

sellerKeys: {
  all: ['seller'],
  dashboard: () => [...sellerKeys.all, 'dashboard'],
}
```

**Queries:**
- `useOrderHistory()` - تاریخچه سفارش (staleTime: 5 دقیقه)
- `useMyPurchased()` - خریدهای من (staleTime: 5 دقیقه، با parallel fetch product details)
- `useMyDownloads()` - دانلودهای من (staleTime: 5 دقیقه)
- `useSellerDashboard()` - آمار داشبورد فروشنده (staleTime: 5 دقیقه)
- `useAdminDashboard()` - آمار داشبورد ادمین
- `useAdminReports()` - گزارشات ادمین
- `useTopProducts()` - محصولات برتر
- `useRevenueReport()` - گزارش درآمد
- `useDownloadReport()` - گزارش دانلود

**Mutations:**
- `useCreateOrder()` - ایجاد سفارش (invalidates order history)
- `useCreatePaypalOrder()` - ایجاد سفارش PayPal
- `useCapturePaypalOrder()` - تایید پرداخت PayPal (invalidates order history، purchased، downloads)

### پیکربندی جهانی
```javascript
// main.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})
```

### جلوگیری از درخواست‌های تکراری
- React Query به طور خودکار درخواست‌های تکراری را deduplicate می‌کند
- استفاده از `isFetchingRef` در کامپوننت‌ها برای جلوگیری از duplicate fetch
- استفاده از `refreshPromise` در axios interceptor برای جلوگیری از duplicate token refresh

---

## ۹. State Management

### Local State
**استفاده:** useState در کامپوننت‌های فردی  
**مثال‌ها:**
- `loading`، `error` در صفحات
- `searchQuery`، `selectedCategory` در ProductsPage
- `sidebarOpen`، `profileDropdownOpen` در Layoutها
- `downloading` در MyPurchasedPage

**چرا اینجا:** State محلی به کامپوننت، نیازی به اشتراک‌گذاری

### Context State
**استفاده:** Context API برای state جهانی  
**مثال‌ها:**
- `user`، `loading` در AuthContext
- `cartItems`، `cartTotal` در CartContext
- `theme` در ThemeContext
- `toasts` در ToastContext

**چرا اینجا:** State در سراسر برنامه نیاز به دسترسی

### Server State
**استفاده:** React Query برای داده سمت سرور  
**مثال‌ها:**
- `useOrderHistory()` - تاریخچه سفارش
- `useMyPurchased()` - خریدهای من
- `useSellerDashboard()` - آمار فروشنده
- `useAdminDashboard()` - آمار ادمین

**چرا اینجا:** داده از API، نیاز به کشینگ و مدیریت درخواست

### URL State
**استفاده:** useSearchParams برای state در URL  
**مثال‌ها:**
- `search`، `category` در ProductsPage
- `orderId` در PaymentSuccessPage

**چرا اینجا:** state قابل share از طریق URL، bookmarkable

### Form State
**استفاده:** React Hook Form برای فرم‌ها  
**مثال‌ها:**
- LoginForm با Zod validation
- RegisterForm با Zod validation
- ProductForm با validation

**چرا اینجا:** مدیریت فرم با رندر کم، اعتبارسنجی

---

## ۱۰. Cart و Order Flow

### جریان کامل خرید

```
1. Product Page
   ↓
2. User clicks "Add to Cart"
   ↓
3. CartContext.addToCart(productId)
   ↓
4. API: POST /cart/add/ {product_id}
   ↓
5. CartContext.fetchCart()
   ↓
6. API: GET /cart/
   ↓
7. CartPage displays items
   ↓
8. User clicks "Proceed to Checkout"
   ↓
9. Navigate to /buyer/order-review
   ↓
10. OrderReviewPage: useCreateOrder().mutate()
    ↓
11. API: POST /orders/create/
    ↓
12. Order created with status: 'pending'
    ↓
13. User clicks "Generate PayPal Link"
    ↓
14. useCreatePaypalOrder().mutateAsync(orderId)
    ↓
15. API: POST /orders/paypal/create/:id/
    ↓
16. PayPal returns approval link
    ↓
17. User opens PayPal link
    ↓
18. User completes payment on PayPal
    ↓
19. User clicks "I Completed Payment"
    ↓
20. Navigate to /payment-success?orderId=...
    ↓
21. PaymentSuccessPage: useCapturePaypalOrder().mutateAsync(orderId)
    ↓
22. API: POST /orders/paypal/capture/:id/
    ↓
23. PayPal returns status: 'COMPLETED'
    ↓
24. CartContext.clearCart()
    ↓
25. Auto-redirect to /buyer/my-purchased
    ↓
26. MyPurchasedPage: useMyPurchased()
    ↓
27. API: GET /products/my-purchased/
    ↓
28. User can download products
    ↓
29. User clicks "Download"
    ↓
30. API: GET /products/download/:id/ (blob)
    ↓
31. Browser downloads file
```

---

## ۱۱. Seller Dashboard

### امکانات فروشنده

**Total Products:**
- API: GET `/products/seller-dashboard/`
- Hook: `useSellerDashboard()`
- Display: StatsCards component

**Total Sales:**
- API: GET `/products/seller-dashboard/`
- Hook: `useSellerDashboard()`
- Display: StatsCards component

**Revenue:**
- API: GET `/products/seller-dashboard/`
- Hook: `useSellerDashboard()`
- Display: StatsCards component

**Sales History:**
- API: GET `/products/seller/sales`
- Service: `sellerService.getSalesHistory()`
- Display: SalesReport component

**Products Management:**
- API: GET `/products/my-products/`
- Service: `sellerService.getMyProducts()`
- Display: MyProducts page، ProductTable component
- Operations: Add، Edit، Delete

**Add Product:**
- API: POST `/products/create/`
- Service: `sellerService.createProduct(data)` (FormData)
- Display: AddProduct page، ProductForm component

**Edit Product:**
- API: PUT `/products/edit/:id/`
- Service: `sellerService.updateProduct(id, data)` (FormData)
- Display: EditProduct page، ProductForm component

**Delete Product:**
- API: DELETE `/products/delete/:id/`
- Service: `sellerService.deleteProduct(id)`
- Display: DeleteModal component

**Downloads:**
- API: GET `/products/my-downloads/`
- Service: `orderService.getMyDownloads()`
- Display: MyDownloadsPage

**Reports:**
- Sales Report: GET `/products/seller/reports/sales/`
- Revenue Report: GET `/products/seller/reports/revenue/`
- Product Report: GET `/products/seller/reports/products/`
- Customer Report: GET `/products/seller/reports/customers/`

---

## ۱۲. Admin Dashboard

### بخش‌های ادمین

**Dashboard:**
- API: GET `/admin-api/dashboard/`
- Hook: `useAdminDashboard()`
- Display: AdminDashboardHome
- Stats: Platform Revenue، Products، Orders، Users
- Charts: Product Status (Pie)، User Distribution (Pie)، Orders Overview (Bar)

**Users Management:**
- API: GET `/admin-api/users/`
- Service: `adminService.getUsers(params)`
- Operations: Activate، Suspend، Set Super Admin، Remove Super Admin
- Display: UsersManagement page

**Products Management:**
- API: GET `/admin-api/products/`
- Service: `adminService.getProducts(params)`
- API: GET `/api/products/pending/`
- Operations: Approve، Reject
- Display: ProductsManagement page

**Orders Management:**
- API: GET `/admin-api/orders/`
- Service: `adminService.getOrders(params)`
- API: GET `/admin-api/orders/:orderId/`
- Display: OrdersManagement page، OrderDetails page

**Reports:**
- API: GET `/admin-api/reports/`
- API: GET `/admin-api/reports/top-products/`
- API: GET `/admin-api/reports/revenue/`
- API: GET `/admin-api/reports/download/`
- Display: Reports page
- Export: PDF with jsPDF

**Logs:**
- API: GET `/admin-api/logs/`
- Service: `adminService.getLogs(params)`
- Display: Logs page
- Filter by admin

**Contact Messages:**
- API: GET `/api/contact-message/`
- Service: `adminService.getContactMessages(params)`
- API: PATCH `/api/contact-message/:id/reply/`
- Display: ContactMessages page

### تفاوت Admin و Superadmin (از دید Frontend)
- **Admin:** دسترسی به dashboard، users، products، orders، reports، own logs
- **Superadmin:** دسترسی کامل به تمام موارد + activate/suspend users، all logs، filter logs by admin
- **Frontend Check:** `user?.role === 'admin' || user?.is_super_admin === true`

---

## ۱۳. Chat

**نکته:** سیستم Chat در حال حاضر در Frontend پیاده‌سازی نشده است.  
**پیام‌های تماس فقط برای ادمین** برای مدیریت پیام‌های دریافتی از فرم تماس وجود دارد.

---

## ۱۴. Internationalization

**نکته:** سیستم i18n در حال حاضر در Frontend پیاده‌سازی نشده است.  
تمام متن‌ها به زبان انگلیسی هستند.  
پروژه از RTL/LTR پشتیبانی نمی‌کند (تمام LTR).

---

## ۱۵. UI و Styling

### Tailwind CSS
**استفاده:** کلاس‌های کاربردی در تمام کامپوننت‌ها  
**پیکربندی:** `tailwind.config.js` با رنگ‌های سفارشی  
**پشتیبانی:** Dark mode با `dark:` prefix

### Responsive Design
**Breakpoints:** sm (640px)، md (768px)، lg (1024px)، xl (1280px)  
**استفاده:** تمام کامپوننت‌ها ریسپانسیو هستند

### Dark/Light Theme
**مدیریت:** ThemeContext  
**Storage:** localStorage  
**Toggle:** دکمه در Layoutها  
**Implementation:** کلاس `dark` روی `html` element

### رنگ‌های اصلی
- Primary: Indigo (indigo-600)
- Success: Emerald (emerald-600)
- Warning: Amber (amber-500)
- Error: Red (red-600)
- Background: Gray (gray-50، gray-900)

### Typography
- Font: سیستم پیش‌فرض
- Sizes: text-xs تا text-3xl
- Weights: font-normal تا font-bold

### Components
- **Buttons:** با gradient، hover effects، loading states
- **Cards:** با backdrop-blur، border، shadow
- **Forms:** با validation states، error messages
- **Tables:** با responsive، pagination
- **Modals:** با overlay، animations
- **Toasts:** با auto-dismiss، animations
- **Loading:** Skeletons، spinners
- **Empty State:** با icon، message، action button
- **Error State:** با icon، message، retry button

### Framer Motion
**استفاده:**
- Sidebar animations (slide in/out)
- Toast animations (slide in)
- Dropdown animations (scale، fade)
- Page transitions (در آینده قابل استفاده)

---

## ۱۶. Hooks

### useDebounce
**چه کاری انجام می‌دهد:** تاخیر در اجرای تابع برای جلوگیری از اجراهای مکرر  
**چه زمانی اجرا می‌شود:** روی value تغییر کند  
**Hookهای داخلی:** useState، useEffect  
**Componentهای استفاده کننده:** ProductsPage، MyDownloadsPage

### useLocalStorage
**چه کاری انجام می‌دهد:** sync state با localStorage  
**چه زمانی اجرا می‌شود:** mount و هر بار value تغییر کند  
**Hookهای داخلی:** useState، useEffect  
**Componentهای استفاده کننده:** ThemeContext (indirect)

### useTokenRefresh
**چه کاری انجام می‌دهد:** مدیریت تازه‌سازی توکن  
**چه زمانی اجرا می‌شود:** در axios interceptor  
**Hookهای داخلی:** useRef  
**Componentهای استفاده کننده:** استفاده نمی‌شود (در axios interceptor)

### React Hooks در محل استفاده

**useState:**
- Local state در تمام کامپوننت‌ها
- Form state در فرم‌ها
- UI state (loading، error، modals)

**useEffect:**
- Side effects (fetch data، event listeners)
- Lifecycle hooks (mount، unmount)
- Dependency-based updates

**useMemo:**
- محاسبات گران (در حال حاضر کم استفاده)

**useCallback:**
- Function stability (در حال حاضر کم استفاده)

**useContext:**
- AuthContext، CartContext، ThemeContext، ToastContext

**useRef:**
- DOM references
- Persistent values across renders
- Prevent duplicate requests

**useNavigate:**
- Programmatic navigation

**useSearchParams:**
- URL query parameters

---

## ۱۷. Contextها

### AuthContext
**Provider:** AuthProvider  
**State:** user، loading  
**Functions:** login، logout، updateUser، setUserFromGoogle  
**Componentهای استفاده کننده:** تمام Route guards، LoginForm، RegisterForm، Layoutها  
**Re-render زمانی:** user یا loading تغییر کند

### CartContext
**Provider:** CartProvider  
**State:** cartItems، cartTotal، loading، error  
**Functions:** fetchCart، addToCart، removeFromCart، clearCart  
**Componentهای استفاده کننده:** CartPage، ProductCard، Header  
**Re-render زمانی:** cartItems یا loading تغییر کند

### ThemeContext
**Provider:** ThemeProvider  
**State:** theme  
**Functions:** toggleTheme  
**Componentهای استفاده کننده:** Layoutها، دکمه‌های toggle  
**Re-render زمانی:** theme تغییر کند

### ToastContext
**Provider:** ToastProvider  
**State:** toasts  
**Functions:** addToast، removeToast، success، error، info، warning  
**Componentهای استفاده کننده:** تمام کامپوننت‌ها برای اعلان  
**Re-render زمانی:** toasts تغییر کند

---

## ۱۸. Performance

### React Query Cache
- staleTime: 5 دقیقه برای اکثر queries
- retry: 1 برای تلاش مجدد
- Automatic refetch on window focus (پیش‌فرض)
- Automatic garbage collection

### Request Deduplication
- React Query به طور خودکار درخواست‌های تکراری را deduplicate می‌کند
- استفاده از `isFetchingRef` در کامپوننت‌ها
- استفاده از `refreshPromise` در axios interceptor

### جلوگیری از Re-render
- React.memo در کامپوننت‌ها (در حال حاضر کم استفاده)
- useCallback برای function stability (در حال حاضر کم استفاده)
- Context splitting برای جلوگیری از re-renderهای غیر ضروری

### Lazy Loading
- در حال حاضر پیاده‌سازی نشده
- می‌تواند با React.lazy و Suspense پیاده‌سازی شود

### Code Splitting
- در حال حاضر پیاده‌سازی نشده
- می‌تواند با dynamic import پیاده‌سازی شود

### Image Optimization
- در حال حاضر پیاده‌سازی نشده
- می‌تواند با next/image یا کتابخانه‌های مشابه پیاده‌سازی شود

### جلوگیری از درخواست‌های تکراری
- Debounce در جستجو (useDebounce)
- React Query caching
- Request deduplication با ref

---

## ۱۹. Error Handling

### API Error
**مدیریت:** try-catch در سرویس‌ها و کامپوننت‌ها  
**Display:** Error state component با retry button  
**Example:** ProductsPage با ErrorState

### 400 (Bad Request)
**مدیریت:** نمایش error message از response  
**Example:** فرم‌ها با اعتبارسنجی Zod

### 401 (Unauthorized)
**مدیریت:** Token refresh در axios interceptor  
**Fallback:** Redirect به login اگر refresh fails

### 403 (Forbidden)
**مدیریت:** Route guards (SellerRoute، AdminRoute)  
**Display:** Redirect به home یا dashboard مناسب

### 404 (Not Found)
**مدیریت:** Graceful handling در seller dashboard  
**Display:** Empty state به جای error

### 429 (Too Many Requests)
**مدیریت:** Retry بعد از 5000ms در axios interceptor  
**Display:** Loading state

### 500 (Server Error)
**مدیریت:** try-catch با error message  
**Display:** Error state component با retry button

### Network Error
**مدیریت:** try-catch با error message  
**Display:** Error state component با retry button

### Form Validation
**مدیریت:** Zod schema validation  
**Display:** Field-level error messages

### Authentication Error
**مدیریت:** AuthContext error handling  
**Display:** Toast notification

### Payment Error
**مدیریت:** try-catch در PaymentSuccessPage  
**Display:** Error state با redirect به order history

---

## ۲۰. Security

### JWT
**Storage:** localStorage  
**Access Token:** در هر درخواست API  
**Refresh Token:** برای تازه‌سازی  
**Decode:** سمت کلاینت برای استخراج user data

### Protected Routes
**مدیریت:** Route guards (ProtectedRoute، SellerRoute، BuyerRoute، AdminRoute)  
**Check:** isAuthenticated و user role

### Role Checking
**مدیریت:** در Route guards و کامپوننت‌ها  
**Roles:** buyer، seller، admin، superadmin

### Token Handling
**Storage:** localStorage  
**Clear:** در logout و failed refresh  
**Refresh:** Automatic در 401

### API Authorization
**مدیریت:** Authorization header در axios interceptor  
**Format:** `Bearer ${token}`

### XSS
**مدیریت:** React به طور خودکار escape می‌کند  
**Risk:** کم با React

### فایل‌های قابل دانلود
**مدیریت:** blob download با content-type validation  
**Risk:** User باید فایل را اعتماد کند

### اطلاعات حساس
**Storage:** localStorage (risk در XSS)  
**Recommendation:** استفاده از httpOnly cookies (backend)

### محدودیت‌های Frontend Security
- Frontend validation قابل دور زدن است
- Authorization باید در backend چک شود
- Token storage در localStorage risk دارد
- File upload validation باید در backend هم انجام شود

---

## ۲۱. جریان کامل داده

### Login Flow
```
User Action: Submit LoginForm
  ↓
Component: LoginForm
  ↓
Hook/Context: AuthContext.login()
  ↓
React Query: هیچ
  ↓
Axios: POST /login/
  ↓
API: Django DRF
  ↓
Response: {access, refresh}
  ↓
Cache/State: localStorage + AuthContext state
  ↓
Component Re-render: Redirect based on role
  ↓
UI: Dashboard page
```

### Product List Flow
```
User Action: Navigate to /products
  ↓
Component: ProductsPage
  ↓
Hook/Context: هیچ
  ↓
React Query: هیچ (direct API call)
  ↓
Axios: GET /products/ with params
  ↓
API: Django DRF
  ↓
Response: [{id, title, price, ...}, ...]
  ↓
Cache/State: products state
  ↓
Component Re-render: ProductCard grid
  ↓
UI: Product cards
```

### Add to Cart Flow
```
User Action: Click "Add" on ProductCard
  ↓
Component: ProductCard
  ↓
Hook/Context: CartContext.addToCart()
  ↓
React Query: هیچ
  ↓
Axios: POST /cart/add/
  ↓
API: Django DRF
  ↓
Response: Success
  ↓
Cache/State: CartContext.fetchCart()
  ↓
Component Re-render: Header cart count
  ↓
UI: Toast success
```

### Create Order Flow
```
User Action: Navigate to /buyer/order-review
  ↓
Component: OrderReviewPage
  ↓
Hook/Context: useCreateOrder()
  ↓
React Query: useCreateOrder mutation
  ↓
Axios: POST /orders/create/
  ↓
API: Django DRF
  ↓
Response: {id, status, items, total_price}
  ↓
Cache/State: React Query cache
  ↓
Component Re-render: Order details display
  ↓
UI: Order review page
```

### PayPal Payment Flow
```
User Action: Click "Generate PayPal Link"
  ↓
Component: OrderReviewPage
  ↓
Hook/Context: useCreatePaypalOrder()
  ↓
React Query: useCreatePaypalOrder mutation
  ↓
Axios: POST /orders/paypal/create/:id/
  ↓
API: Django DRF → PayPal
  ↓
Response: {links: [{rel: 'approve', href: ...}]}
  ↓
Cache/State: paypalLink state
  ↓
Component Re-render: PayPal link display
  ↓
UI: Link to PayPal
```

### Download Flow
```
User Action: Click "Download" on MyPurchasedPage
  ↓
Component: MyPurchasedPage
  ↓
Hook/Context: هیچ
  ↓
React Query: هیچ
  ↓
Axios: GET /products/download/:id/ (blob)
  ↓
API: Django DRF
  ↓
Response: Blob (file)
  ↓
Cache/State: هیچ
  ↓
Component Re-render: Download starts
  ↓
UI: File download
```

### Seller Dashboard Flow
```
User Action: Navigate to /seller/dashboard
  ↓
Component: SellerDashboard
  ↓
Hook/Context: useSellerDashboard()
  ↓
React Query: useSellerDashboard query
  ↓
Axios: GET /products/seller-dashboard/
  ↓
API: Django DRF
  ↓
Response: {total_products, total_sales, revenue}
  ↓
Cache/State: React Query cache (5 min staleTime)
  ↓
Component Re-render: StatsCards display
  ↓
UI: Dashboard stats
```

### Admin Dashboard Flow
```
User Action: Navigate to /admin
  ↓
Component: AdminDashboardHome
  ↓
Hook/Context: useAdminDashboard()
  ↓
React Query: useAdminDashboard query
  ↓
Axios: Promise.all [GET /admin-api/dashboard/, GET /orders/platform-revenue/]
  ↓
API: Django DRF
  ↓
Response: {users, products, orders, platform_revenue}
  ↓
Cache/State: React Query cache
  ↓
Component Re-render: Stats and charts display
  ↓
UI: Admin dashboard
```

---

## ۲۲. وابستگی فایل‌ها

### Dependency Graph
```
main.jsx
 ↓
App.jsx
 ↓
Router (routes/index.jsx)
 ↓
Layouts (MainLayout، SellerLayout، AdminLayout)
 ↓
Pages
 ↓
Components
 ↓
Hooks / Context
 ↓
React Query
 ↓
Axios (axiosConfig.js)
 ↓
API (Django DRF)
```

### وابستگی‌های کلیدی

**AuthContext:**
- استفاده توسط: تمام Route guards، فرم‌های auth، Layoutها
- وابسته به: authService، api، ToastContext

**CartContext:**
- استفاده توسط: CartPage، ProductCard، Header
- وابسته به: cartService، ToastContext

**axiosConfig:**
- استفاده توسط: تمام سرویس‌ها
- وابسته به: API_ENDPOINTS

**endpoints.js:**
- استفاده توسط: تمام سرویس‌ها
- وابسته به: هیچ

**useOrderQueries:**
- استفاده توسط: صفحات خریدار، صفحات فروشنده
- وابسته به: orderService، productService، sellerService

---

## ۲۳. مشکلات و نکات مهم

### چیزهایی که درست طراحی شده
- معماری لایه سرویس برای جدا کردن منطق API
- Context API برای state جهانی
- React Query برای مدیریت داده سمت سرور
- Token refresh خودکار با axios interceptor
- Route guards برای کنترل دسترسی
- Debounce در جستجو برای کاهش درخواست‌ها
- Graceful error handling با retry

### چیزهایی که ممکن است مشکل‌ساز شوند
- **Token storage در localStorage:** Risk در XSS، باید httpOnly cookies استفاده شود
- **Duplicate request prevention:** با ref پیاده‌سازی شده اما ممکن است edge cases وجود داشته باشد
- **No i18n:** تمام متن‌ها انگلیسی، برای زبان‌های دیگر باید پیاده‌سازی شود
- **No code splitting:** bundle size ممکن است بزرگ شود
- **No image optimization:** تصاویر بدون optimization لود می‌شوند

### احتمال Duplicate Request
- در ProductsPage با `isFetchingRef` جلوگیری شده
- در MyDownloadsPage با `isFetchingRef` جلوگیری شده
- در AuthContext login با `isLoggingInRef` جلوگیری شده
- در axios interceptor با `refreshPromise` جلوگیری شده

### احتمال Re-render زیاد
- Context changes باعث re-render تمام consumers می‌شود
- می‌تواند با React.memo و splitting context بهبود یابد

### احتمال Memory Leak
- useEffect cleanup در برخی جاها پیاده‌سازی شده
- باید در تمام useEffect با event listeners بررسی شود

### Error Handling ضعیف
- در برخی جاها فقط console.error بدون user feedback
- باید در تمام API calls error handling بهبود یابد

### Security بهتر می‌تواند شود
- Token storage در localStorage باید به httpOnly cookies تغییر کند
- Frontend validation باید backend validation باشد
- File upload validation باید در backend هم انجام شود

### Code Duplication
- adminService axios instance جداگانه (می‌تواند با axiosConfig یکپارچه شود)
- برخی error handling patterns تکراری

### قسمت‌های قابل Refactor
- adminService می‌تواند با axiosConfig یکپارچه شود
- Error handling می‌تواند به یک hook سفارشی منتقل شود
- Form validation می‌تواند به یک hook سفارشی منتقل شود

---

## ۲۴. تعریف اصطلاحات

### React
کتابخانه JavaScript برای ساخت رابط کاربری تعاملی با component-based architecture.

### Component
تابع یا کلاس که UI را return می‌کند و می‌تواند state و props داشته باشد.

### Props
داده‌هایی که از parent component به child component پاس داده می‌شوند.

### State
داده‌های داخلی component که می‌توانند تغییر کنند و باعث re-render می‌شوند.

### Hook
تابع خاص React که به component‌های function قابلیت‌های اضافی می‌دهد (useState، useEffect و غیره).

### Context
راهی برای pass کردن داده‌ها از طریق component tree بدون prop drilling.

### Provider
Component که context value را به child components ارائه می‌دهد.

### API
Interface برای ارتباط بین Frontend و Backend.

### REST API
API که از HTTP methods (GET، POST، PUT، DELETE) استفاده می‌کند.

### Axios
کتابخانه JavaScript برای ارسال درخواست‌های HTTP.

### JWT (JSON Web Token)
Token امن برای احراز هویت که اطلاعات کاربر را به صورت encoded carry می‌کند.

### Access Token
Token کوتاه‌مدت برای دسترسی به API.

### Refresh Token
Token طولانی‌مدت برای دریافت access token جدید.

### Query
درخواست داده از server در React Query.

### Mutation
درخواست برای تغییر داده در server در React Query.

### Cache
ذخیره موقت داده برای جلوگیری از درخواست‌های تکراری.

### Query Key
شناسه منحصر به فرد برای یک query در React Query.

### Route
مسیر URL در برنامه.

### Protected Route
مسیر که نیاز به احراز هویت دارد.

### Middleware
تابع که بین درخواست و response اجرا می‌شود (interceptor در Axios).

### Interceptor
تابع که قبل یا بعد از درخواست/پاسخ Axios اجرا می‌شود.

### CRUD
عملیات Create، Read، Update، Delete.

### Pagination
تقسیم داده‌ها به صفحات برای نمایش بهتر.

### Throttle
محدود کردن تعداد اجراهای یک تابع در زمان مشخص.

### Rate Limit
محدودیت تعداد درخواست‌های API در زمان مشخص.

### Debounce
تاخیر در اجرای تابع تا زمانی که user تایپ کردن را متوقف کند.

### SSR (Server-Side Rendering)
رندر کردن HTML در server قبل از ارسال به client.

### SPA (Single Page Application)
برنامه web که در یک صفحه load می‌شود و بدون رفرش صفحه کار می‌کند.

### CORS
سیستم امنیتی برای کنترل درخواست‌های cross-origin.

### RTL
راست‌چین (برای زبان‌های مثل عربی و فارسی).

### LTR
چپ‌چین (برای زبان‌های مثل انگلیسی).

### Responsive Design
طراحی که در سایزهای مختلف screen به خوبی نمایش داده می‌شود.

### Lazy Loading
بارگذاری محتا فقط وقتی نیاز است.

### Re-render
رندر مجدد component به دلیل تغییر state یا props.

---

## ۲۵. خلاصه نهایی

### پروژه چیست؟
Digital Shop یک پلتفرم بازار آنلاین برای فروش محصولات دیجیتال است که به کاربران اجازه می‌دهد محصولات دیجیتالی را خریداری، فروش و دانلود کنند.

### با چه تکنولوژی‌هایی ساخته شده؟
- React 19.2.6 برای UI
- Vite 8.0.12 برای build tool
- React Router DOM 7.17.0 برای routing
- Tailwind CSS 3.4.19 برای styling
- Axios 1.17.0 برای HTTP requests
- @tanstack/react-query 5.101.2 برای data management
- React Hook Form 7.77.0 و Zod 4.4.3 برای forms
- Framer Motion 12.40.0 برای animations
- Recharts 3.8.1 برای charts
- lucide-react 1.17.0 برای icons

### معماری آن چیست؟
- SPA با client-side routing
- Layered architecture (Components → Pages → Layouts → Services → API)
- Context API برای global state
- React Query برای server state
- Service layer برای API abstraction

### Frontend چگونه با Backend ارتباط دارد؟
- Axios instance با base URL `http://localhost:8000/api`
- JWT tokens در localStorage
- Request interceptor برای adding Authorization header
- Response interceptor برای token refresh و error handling
- REST API endpoints در `endpoints.js`

### Authentication چگونه کار می‌کند؟
- Login با email/password یا Google OAuth
- Backend returns access and refresh tokens
- Tokens stored in localStorage
- Access token در هر درخواست API استفاده می‌شود
- Refresh token برای getting new access token
- Auto-redirect on 401 after failed refresh

### خرید و Payment چگونه انجام می‌شود؟
- Add to cart → Cart page → Order review → Create order → PayPal link → Payment → Capture → Download

### Seller چه امکاناتی دارد؟
- Dashboard با stats
- Product management (CRUD)
- Sales history
- Revenue tracking
- Reports (sales، revenue، products، customers)

### Admin چه امکاناتی دارد؟
- Dashboard با platform stats
- User management (activate، suspend، super admin)
- Product management (approve، reject)
- Order management
- Reports (top products، revenue، downloads)
- Logs viewing
- Contact messages management

### Chat چگونه کار می‌کند؟
Chat در حال حاضر پیاده‌سازی نشده است. فقط contact messages برای ادمین وجود دارد.

### State Management چگونه انجام شده؟
- Local state با useState
- Global state با Context API (Auth، Cart، Theme، Toast)
- Server state با React Query
- URL state with useSearchParams
- Form state with React Hook Form

### React Query چه نقشی دارد؟
- مدیریت داده سمت سرور
- Caching برای جلوگیری از درخواست‌های تکراری
- Automatic refetch و stale time
- Mutations برای تغییر داده
- Query keys برای invalidation

### Axios چه نقشی دارد؟
- HTTP client برای API requests
- Interceptors برای token management
- Error handling و retry logic
- Request/response transformation

### مهم‌ترین فایل‌ها کدام‌اند؟
- `src/main.jsx` - Entry point
- `src/App.jsx` - Root component
- `src/routes/index.jsx` - Routing configuration
- `src/contexts/AuthContext.jsx` - Authentication
- `src/contexts/CartContext.jsx` - Cart management
- `src/services/api/axiosConfig.js` - Axios configuration
- `src/constants/endpoints.js` - API endpoints
- `src/hooks/useOrderQueries.js` - React Query hooks

### جریان کلی پروژه از ابتدا تا انتها چیست؟
1. User registers/logs in
2. Based on role، redirected to appropriate dashboard
3. Buyer browses products، adds to cart
4. Buyer creates order، pays with PayPal
5. Buyer downloads purchased products
6. Seller uploads products، manages sales
7. Admin manages users، products، orders
8. All data fetched via React Query and Axios
9. State managed via Context API
10. UI styled with Tailwind CSS

---

## جدول خلاصه مهم‌ترین فایل‌ها

| File | وظیفه | ارتباط با | اهمیت |
| ---- | ----- | --------- | ----- |
| src/main.jsx | Entry point، Provider wrapping | App.jsx | بالا |
| src/App.jsx | Root component with Router | routes/index.jsx | بالا |
| src/routes/index.jsx | Routing configuration | تمام صفحات | بالا |
| src/contexts/AuthContext.jsx | Authentication state | Route guards، فرم‌های auth | بالا |
| src/contexts/CartContext.jsx | Cart state | CartPage، ProductCard | بالا |
| src/services/api/axiosConfig.js | Axios configuration | تمام سرویس‌ها | بالا |
| src/constants/endpoints.js | API endpoints | تمام سرویس‌ها | بالا |
| src/hooks/useOrderQueries.js | React Query hooks | صفحات خریدار/فروشنده | بالا |
| src/services/auth/authService.js | Auth API calls | AuthContext | متوسط |
| src/services/order/orderService.js | Order API calls | صفحات خریدار | متوسط |
| src/services/seller/sellerService.js | Seller API calls | صفحات فروشنده | متوسط |
| src/services/admin/adminService.js | Admin API calls | صفحات ادمین | متوسط |
| src/components/auth/ProtectedRoute.jsx | Route guard | routes/index.jsx | متوسط |
| src/components/auth/SellerRoute.jsx | Seller route guard | routes/index.jsx | متوسط |
| src/components/auth/AdminRoute.jsx | Admin route guard | routes/index.jsx | متوسط |
| src/layouts/MainLayout.jsx | Public layout | routes/index.jsx | متوسط |
| src/layouts/SellerLayout.jsx | Seller layout | routes/index.jsx | متوسط |
| src/layouts/AdminLayout.jsx | Admin layout | routes/index.jsx | متوسط |
