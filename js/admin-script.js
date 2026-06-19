/**
 * ========================================
 * Dis Ney Store - كود لوحة التحكم
 * ========================================
 */

// ===== كلمة المرور الصحيحة =====
const CORRECT_PASSWORD = '113114';

// ===== المتغيرات العامة =====
let isLoggedIn = false;
let attempts = 0;
const MAX_ATTEMPTS = 5;
let productsListener = null;

// ===== عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', () => {
    // التحقق من وجود جلسة نشطة
    const savedSession = localStorage.getItem('adminSession');
    if (savedSession === 'true') {
        isLoggedIn = true;
        showAdminPanel();
        loadProductsForAdmin();
    } else {
        showLoginForm();
        // تركيز المؤشر على حقل كلمة المرور
        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput) {
            setTimeout(() => passwordInput.focus(), 100);
        }
    }

    // إضافة حدث للضغط على Enter
    const passwordInput = document.getElementById('adminPassword');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loginAdmin();
            }
        });
    }

    console.log('🔐 Dis Ney Admin Panel - جاهز');
    console.log('🔑 كلمة المرور: 113114');
});

// ===== تسجيل الدخول =====
function loginAdmin() {
    const passwordInput = document.getElementById('adminPassword');
    const errorDiv = document.getElementById('loginError');
    const attemptsDisplay = document.getElementById('attemptsDisplay');
    
    if (!passwordInput || !errorDiv) return;
    
    const password = passwordInput.value.trim();
    
    errorDiv.textContent = '';
    errorDiv.className = 'login-error';
    
    // التحقق من عدد المحاولات
    if (attempts >= MAX_ATTEMPTS) {
        errorDiv.textContent = '🔒 تم تجاوز عدد المحاولات المسموح بها. الرجاء المحاولة لاحقاً.';
        errorDiv.style.color = '#c0392b';
        passwordInput.disabled = true;
        return;
    }

    // التحقق من كلمة المرور
    if (password === CORRECT_PASSWORD) {
        isLoggedIn = true;
        localStorage.setItem('adminSession', 'true');
        showAdminPanel();
        loadProductsForAdmin();
        errorDiv.textContent = '✅ تم تسجيل الدخول بنجاح!';
        errorDiv.style.color = '#27ae60';
        setTimeout(() => { errorDiv.textContent = ''; }, 2000);
        console.log('✅ تم تسجيل الدخول بنجاح!');
    } else {
        attempts++;
        const remaining = MAX_ATTEMPTS - attempts;
        errorDiv.textContent = `❌ كلمة المرور غير صحيحة. تبقى ${remaining} محاولة${remaining > 1 ? 'ات' : ''}`;
        errorDiv.style.color = '#c0392b';
        passwordInput.value = '';
        passwordInput.focus();
        
        if (attempts >= MAX_ATTEMPTS) {
            errorDiv.textContent = '🔒 تم تجاوز عدد المحاولات المسموح بها. الرجاء المحاولة لاحقاً.';
            passwordInput.disabled = true;
        }
        
        if (attemptsDisplay) {
            attemptsDisplay.textContent = `محاولات فاشلة: ${attempts}/${MAX_ATTEMPTS}`;
        }
        
        console.log(`❌ محاولة فاشلة رقم ${attempts}`);
    }
}

// ===== تسجيل الخروج =====
function logoutAdmin() {
    if (confirm('⚠️ هل أنت متأكد من تسجيل الخروج؟')) {
        isLoggedIn = false;
        localStorage.removeItem('adminSession');
        attempts = 0;
        showLoginForm();
        const passwordInput = document.getElementById('adminPassword');
        if (passwordInput) {
            passwordInput.disabled = false;
            passwordInput.value = '';
            passwordInput.focus();
        }
        const attemptsDisplay = document.getElementById('attemptsDisplay');
        if (attemptsDisplay) {
            attemptsDisplay.textContent = '';
        }
        console.log('✅ تم تسجيل الخروج');
    }
}

// ===== إظهار لوحة التحكم =====
function showAdminPanel() {
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    if (loginForm) loginForm.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
}

// ===== إظهار نموذج تسجيل الدخول =====
function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    const errorDiv = document.getElementById('loginError');
    if (loginForm) loginForm.style.display = 'block';
    if (adminPanel) adminPanel.style.display = 'none';
    if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.className = 'login-error';
    }
}

// ===== إضافة منتج جديد =====
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // التحقق من تسجيل الدخول
    if (!isLoggedIn) {
        alert('⚠️ الرجاء تسجيل الدخول أولاً');
        return;
    }
    
    const nameInput = document.getElementById('productName');
    const priceInput = document.getElementById('productPrice');
    const categoryInput = document.getElementById('productCategory');
    const stockInput = document.getElementById('productStock');
    const descInput = document.getElementById('productDescription');
    const fileInput = document.getElementById('productImage');
    const progressBar = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (!nameInput || !priceInput || !categoryInput || !stockInput || !descInput || !fileInput) {
        alert('⚠️ بعض الحقول مفقودة');
        return;
    }
    
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const category = categoryInput.value;
    const stock = parseInt(stockInput.value);
    const description = descInput.value.trim();
    const file = fileInput.files[0];
    
    // التحقق من المدخلات
    if (!name) {
        alert('⚠️ الرجاء إدخال اسم المنتج');
        nameInput.focus();
        return;
    }
    
    if (isNaN(price) || price <= 0) {
        alert('⚠️ الرجاء إدخال سعر صحيح');
        priceInput.focus();
        return;
    }
    
    if (isNaN(stock) || stock < 0) {
        alert('⚠️ الرجاء إدخال كمية صحيحة');
        stockInput.focus();
        return;
    }
    
    if (!description) {
        alert('⚠️ الرجاء إدخال شرح للمنتج');
        descInput.focus();
        return;
    }
    
    if (!file) {
        alert('⚠️ الرجاء اختيار صورة للمنتج');
        fileInput.focus();
        return;
    }
    
    // التحقق من حجم الصورة (حد أقصى 5 ميجابايت)
    if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
        fileInput.value = '';
        return;
    }
    
    // عرض شريط التقدم
    if (progressBar && progressFill && progressText) {
        progressBar.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
    }
    
    // تعطيل زر الإضافة
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ جاري الرفع...';
    }
    
    try {
        // رفع الصورة إلى Firebase Storage
        const fileName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const storageRef = storage.ref('products/' + fileName);
        const uploadTask = storageRef.put(file);
        
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                if (progressFill && progressText) {
                    progressFill.style.width = progress + '%';
                    progressText.textContent = progress + '%';
                }
            },
            (error) => {
                console.error('❌ خطأ في رفع الصورة:', error);
                alert('❌ حدث خطأ في رفع الصورة: ' + error.message);
                if (progressBar) progressBar.style.display = 'none';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '➕ إضافة المنتج';
                }
            },
            async () => {
                try {
                    // اكتمال الرفع - الحصول على رابط الصورة
                    const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
                    
                    // حفظ بيانات المنتج في Firestore
                    await db.collection('products').add({
                        name: name,
                        price: price,
                        category: category,
                        stock: stock,
                        description: description,
                        imageUrl: imageUrl,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    
                    if (progressBar) progressBar.style.display = 'none';
                    alert('✅ تم إضافة المنتج بنجاح!');
                    
                    // إعادة تعيين النموذج
                    document.getElementById('addProductForm').reset();
                    if (progressFill) progressFill.style.width = '0%';
                    if (progressText) progressText.textContent = '0%';
                    
                    // إعادة تحميل القائمة
                    loadProductsForAdmin();
                    
                } catch (error) {
                    console.error('❌ خطأ في حفظ البيانات:', error);
                    alert('❌ حدث خطأ في حفظ البيانات: ' + error.message);
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = '➕ إضافة المنتج';
                    }
                }
            }
        );
    } catch (error) {
        console.error('❌ خطأ:', error);
        alert('❌ حدث خطأ: ' + error.message);
        if (progressBar) progressBar.style.display = 'none';
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = '➕ إضافة المنتج';
        }
    }
});

// ===== تحميل المنتجات في لوحة التحكم =====
function loadProductsForAdmin() {
    const container = document.getElementById('productsList');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">⏳ جاري تحميل المنتجات...</div>';

    // إلغاء الاستماع السابق
    if (productsListener) {
        productsListener();
        productsListener = null;
    }

    productsListener = db.collection('products')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
            try {
                if (snapshot.empty) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: #888;">
                            <p style="font-size: 20px;">📦 لا توجد منتجات</p>
                            <p style="font-size: 14px;">قم بإضافة منتجك الأول من النموذج أعلاه</p>
                        </div>
                    `;
                    return;
                }
                
                let html = `
                    <div class="products-table-wrapper">
                        <table class="products-table">
                            <thead>
                                <tr>
                                    <th>الصورة</th>
                                    <th>الاسم</th>
                                    <th>السعر</th>
                                    <th>المخزون</th>
                                    <th>التصنيف</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                snapshot.forEach((doc) => {
                    const product = doc.data();
                    const id = doc.id;
                    const imageUrl = product.imageUrl || 'https://via.placeholder.com/60x60/2c1810/ffffff?text=DN';
                    
                    html += `
                        <tr id="row-${id}">
                            <td><img src="${imageUrl}" alt="${product.name}" class="product-thumb" 
                                     onerror="this.src='https://via.placeholder.com/60x60/2c1810/ffffff?text=DN'"></td>
                            <td><strong>${product.name || 'بدون اسم'}</strong></td>
                            <td>${product.price || 0} ج.م</td>
                            <td>${product.stock || 0}</td>
                            <td>${product.category || 'غير مصنف'}</td>
                            <td>
                                <button class="btn-edit" onclick="showEditForm('${id}')">✏️ تعديل</button>
                                <button class="btn-delete" onclick="deleteProduct('${id}')">🗑️ حذف</button>
                            </td>
                        </tr>
                        <tr id="edit-${id}" style="display: none;">
                            <td colspan="6">
                                <div class="edit-form">
                                    <h4>✏️ تعديل المنتج</h4>
                                    <input type="text" id="edit-name-${id}" value="${product.name || ''}" placeholder="الاسم" class="admin-input">
                                    <input type="number" id="edit-price-${id}" value="${product.price || 0}" placeholder="السعر" class="admin-input" step="0.01">
                                    <input type="number" id="edit-stock-${id}" value="${product.stock || 0}" placeholder="المخزون" class="admin-input" min="0">
                                    <select id="edit-category-${id}" class="admin-input">
                                        <option value="دمى أصلية" ${product.category === 'دمى أصلية' ? 'selected' : ''}>🧸 دمى أصلية</option>
                                        <option value="أعمال يدوية" ${product.category === 'أعمال يدوية' ? 'selected' : ''}>🎨 أعمال يدوية</option>
                                        <option value="ألعاب" ${product.category === 'ألعاب' ? 'selected' : ''}>🎮 ألعاب</option>
                                        <option value="هدايا" ${product.category === 'هدايا' ? 'selected' : ''}>🎁 هدايا</option>
                                    </select>
                                    <textarea id="edit-desc-${id}" rows="2" placeholder="الشرح" class="admin-input">${product.description || ''}</textarea>
                                    <input type="file" id="edit-image-${id}" accept="image/*" class="admin-input file-input">
                                    <small style="color: #888; display: block; margin: 5px 0;">اترك الحقل فارغاً للاحتفاظ بالصورة الحالية</small>
                                    <div class="form-actions">
                                        <button class="btn-update" onclick="updateProduct('${id}')">💾 حفظ</button>
                                        <button class="btn-cancel" onclick="cancelEdit('${id}')">❌ إلغاء</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    `;
                });
                
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
                
                container.innerHTML = html;
            } catch (error) {
                console.error('❌ خطأ في عرض المنتجات:', error);
                container.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #c0392b;">
                        <p>⚠️ حدث خطأ في تحميل المنتجات</p>
                        <p style="font-size: 14px; color: #888;">${error.message}</p>
                        <button onclick="loadProductsForAdmin()" class="btn-primary" style="margin-top: 15px;">🔄 إعادة المحاولة</button>
                    </div>
                `;
            }
        }, (error) => {
            console.error('❌ خطأ في الاستماع للمنتجات:', error);
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #c0392b;">
                    <p>⚠️ حدث خطأ في الاتصال بقاعدة البيانات</p>
                    <p style="font-size: 14px; color: #888;">${error.message}</p>
                    <button onclick="loadProductsForAdmin()" class="btn-primary" style="margin-top: 15px;">🔄 إعادة المحاولة</button>
                </div>
            `;
        });
}

// ===== عرض نموذج التعديل =====
function showEditForm(productId) {
    const row = document.getElementById(`row-${productId}`);
    const editRow = document.getElementById(`edit-${productId}`);
    
    if (!row || !editRow) return;
    
    if (row.style.display === 'none') {
        row.style.display = 'table-row';
        editRow.style.display = 'none';
    } else {
        row.style.display = 'none';
        editRow.style.display = 'table-row';
        // التركيز على أول حقل
        const firstInput = editRow.querySelector('input');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    }
}

// ===== إلغاء التعديل =====
function cancelEdit(productId) {
    const row = document.getElementById(`row-${productId}`);
    const editRow = document.getElementById(`edit-${productId}`);
    if (row) row.style.display = 'table-row';
    if (editRow) editRow.style.display = 'none';
}

// ===== تحديث المنتج =====
async function updateProduct(productId) {
    // التحقق من تسجيل الدخول
    if (!isLoggedIn) {
        alert('⚠️ الرجاء تسجيل الدخول أولاً');
        return;
    }
    
    const nameInput = document.getElementById(`edit-name-${productId}`);
    const priceInput = document.getElementById(`edit-price-${productId}`);
    const stockInput = document.getElementById(`edit-stock-${productId}`);
    const categoryInput = document.getElementById(`edit-category-${productId}`);
    const descInput = document.getElementById(`edit-desc-${productId}`);
    const fileInput = document.getElementById(`edit-image-${productId}`);
    
    if (!nameInput || !priceInput || !stockInput || !categoryInput || !descInput) {
        alert('⚠️ حدث خطأ في النموذج');
        return;
    }
    
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const stock = parseInt(stockInput.value);
    const category = categoryInput.value;
    const description = descInput.value.trim();
    const file = fileInput ? fileInput.files[0] : null;
    
    // التحقق من المدخلات
    if (!name) {
        alert('⚠️ الرجاء إدخال اسم المنتج');
        nameInput.focus();
        return;
    }
    
    if (isNaN(price) || price <= 0) {
        alert('⚠️ الرجاء إدخال سعر صحيح');
        priceInput.focus();
        return;
    }
    
    if (isNaN(stock) || stock < 0) {
        alert('⚠️ الرجاء إدخال كمية صحيحة');
        stockInput.focus();
        return;
    }
    
    if (!description) {
        alert('⚠️ الرجاء إدخال شرح للمنتج');
        descInput.focus();
        return;
    }
    
    try {
        // تحديث البيانات الأساسية
        const updateData = {
            name: name,
            price: price,
            stock: stock,
            category: category,
            description: description
        };
        
        // إذا تم اختيار صورة جديدة
        if (file) {
            // التحقق من حجم الصورة
            if (file.size > 5 * 1024 * 1024) {
                alert('⚠️ حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت');
                fileInput.value = '';
                return;
            }
            
            const fileName = Date.now() + '_' + file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const storageRef = storage.ref('products/' + fileName);
            const snapshot = await storageRef.put(file);
            const imageUrl = await snapshot.ref.getDownloadURL();
            updateData.imageUrl = imageUrl;
        }
        
        await db.collection('products').doc(productId).update(updateData);
        
        alert('✅ تم تحديث المنتج بنجاح!');
        cancelEdit(productId);
        loadProductsForAdmin();
    } catch (error) {
        console.error('❌ خطأ في التحديث:', error);
        alert('❌ حدث خطأ: ' + error.message);
    }
}

// ===== حذف المنتج =====
async function deleteProduct(productId) {
    // التحقق من تسجيل الدخول
    if (!isLoggedIn) {
        alert('⚠️ الرجاء تسجيل الدخول أولاً');
        return;
    }
    
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المنتج؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        return;
    }
    
    try {
        await db.collection('products').doc(productId).delete();
        alert('✅ تم حذف المنتج بنجاح!');
        loadProductsForAdmin();
    } catch (error) {
        console.error('❌ خطأ في الحذف:', error);
        alert('❌ حدث خطأ: ' + error.message);
    }
}
