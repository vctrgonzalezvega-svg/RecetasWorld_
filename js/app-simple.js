// Aplicación de Recetas - Versión Simplificada que FUNCIONA
class RecipesAppSimple {
    constructor() {
        this.recipes = [];
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        
        console.log('🚀 Iniciando RecipesAppSimple...');
        this.loadRecipes();
    }

    // Cargar recetas de forma simple y directa
    async loadRecipes() {
        try {
            console.log('📡 Cargando recetas...');
            const response = await fetch('data/recipes.json');
            const data = await response.json();
            
            if (data && data.recetas) {
                this.recipes = data.recetas;
                console.log(`✅ ${this.recipes.length} recetas cargadas`);
                this.init();
            } else {
                console.error('❌ Formato de datos inválido');
            }
        } catch (error) {
            console.error('❌ Error cargando recetas:', error);
        }
    }

    // Inicializar la aplicación
    init() {
        console.log('🎯 Inicializando aplicación...');
        this.setupEventListeners();
        this.showRecipes();
        this.updateUI();
    }

    // Mostrar todas las recetas
    showRecipes() {
        console.log('🖼️ Mostrando recetas...');
        const grid = document.getElementById('recipesGrid');
        const title = document.getElementById('sectionTitle');
        
        if (!grid) {
            console.error('❌ No se encontró recipesGrid');
            return;
        }

        if (title) {
            title.textContent = `Recetas del Mundo (${this.recipes.length})`;
        }

        if (this.recipes.length === 0) {
            grid.innerHTML = '<div style="text-align: center; padding: 40px;">No hay recetas disponibles</div>';
            return;
        }

        // Crear HTML de las recetas
        const recipesHTML = this.recipes.map(recipe => this.createRecipeCard(recipe)).join('');
        grid.innerHTML = recipesHTML;
        
        console.log(`✅ ${this.recipes.length} recetas mostradas`);
    }

    // Crear tarjeta de receta simple
    createRecipeCard(recipe) {
        const isFavorite = this.favorites.includes(recipe.id);
        const favoriteClass = isFavorite ? 'active' : '';
        
        return `
            <div class="recipe-card" data-recipe-id="${recipe.id}">
                <div class="recipe-image-container">
                    <img src="${recipe.imagen}" 
                         alt="${recipe.nombre}" 
                         class="recipe-image"
                         onerror="this.src='img/default-recipe.svg'">
                    <div class="recipe-overlay">
                        <span class="recipe-badge">
                            <i class="fas fa-clock"></i> ${recipe.tiempo} min
                        </span>
                    </div>
                </div>
                <div class="recipe-info">
                    <h3 class="recipe-name">${recipe.nombre}</h3>
                    <div class="recipe-country">
                        <i class="fas fa-map-marker-alt"></i> ${recipe.pais}
                    </div>
                    <div class="recipe-rating">
                        <div class="stars">
                            ${this.createStars(recipe.calificacion || 0)}
                        </div>
                        <span class="rating-number">${(recipe.calificacion || 0).toFixed(1)}</span>
                    </div>
                    <div class="recipe-categories">
                        ${recipe.categorias.slice(0, 2).map(cat => 
                            `<span class="category-badge">${this.getCategoryIcon(cat)} ${this.getCategoryName(cat)}</span>`
                        ).join('')}
                    </div>
                    <div class="recipe-footer">
                        <span class="reviews">
                            <i class="fas fa-users"></i> ${recipe.resenas || 0} reseñas
                        </span>
                        <div class="recipe-actions">
                            <button class="reviews-btn" data-recipe-id="${recipe.id}" title="Ver reseñas">
                                <i class="fas fa-comments"></i>
                            </button>
                            <button class="favorite-btn ${favoriteClass}" data-recipe-id="${recipe.id}" title="Favorito">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Crear estrellas de calificación
    createStars(rating) {
        const stars = Math.round(rating);
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += `<i class="fas fa-star ${i <= stars ? 'active' : ''}"></i>`;
        }
        return html;
    }

    // Obtener icono de categoría
    getCategoryIcon(category) {
        const icons = {
            'desayunos': '🌅',
            'comidas': '🍽️',
            'cenas': '🌙',
            'postres': '🍰',
            'bebidas': '🥤',
            'botanas': '🍿',
            'entradas': '🥗',
            'rapidas': '⚡',
            'baratas': '💰'
        };
        return icons[category] || '🍴';
    }

    // Obtener nombre de categoría
    getCategoryName(category) {
        const names = {
            'desayunos': 'Desayunos',
            'comidas': 'Comidas',
            'cenas': 'Cenas',
            'postres': 'Postres',
            'bebidas': 'Bebidas',
            'botanas': 'Botanas',
            'entradas': 'Entradas',
            'rapidas': 'Rápidas',
            'baratas': 'Económicas'
        };
        return names[category] || category;
    }

    // Configurar event listeners básicos
    setupEventListeners() {
        console.log('🔧 Configurando event listeners...');

        // Event delegation para botones de recetas
        document.addEventListener('click', (e) => {
            // Botón de favoritos
            if (e.target.closest('.favorite-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.favorite-btn');
                const recipeId = parseInt(btn.getAttribute('data-recipe-id'));
                this.toggleFavorite(recipeId);
                btn.classList.toggle('active');
            }

            // Botón de reseñas
            if (e.target.closest('.reviews-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.reviews-btn');
                const recipeId = parseInt(btn.getAttribute('data-recipe-id'));
                this.showRecipeModal(recipeId);
            }

            // Click en tarjeta (pero no en botones)
            if (e.target.closest('.recipe-card') && !e.target.closest('button')) {
                const card = e.target.closest('.recipe-card');
                const recipeId = parseInt(card.getAttribute('data-recipe-id'));
                this.showRecipeModal(recipeId);
            }
        });

        // Menú hamburguesa
        const hamburger = document.getElementById('hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', () => this.toggleMenu());
        }

        // Búsqueda
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.search(searchInput.value);
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.search(searchInput ? searchInput.value : '');
            });
        }

        // Botones del header
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.showLoginModal());
        }

        const adminPanelBtn = document.getElementById('adminPanelBtn');
        if (adminPanelBtn) {
            adminPanelBtn.addEventListener('click', () => this.showAdminPanel());
        }

        const userConfigBtn = document.getElementById('userConfigBtn');
        if (userConfigBtn) {
            userConfigBtn.addEventListener('click', () => this.showUserConfig());
        }

        const achievementsBtn = document.getElementById('achievementsBtn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => this.showAchievements());
        }

        // Botones del menú
        const recommendationsLink = document.getElementById('recommendations-link');
        if (recommendationsLink) {
            recommendationsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRecipes();
                this.toggleMenu(); // Cerrar menú
            });
        }

        const productsLink = document.getElementById('products-link');
        if (productsLink) {
            productsLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showProducts();
                this.toggleMenu(); // Cerrar menú
            });
        }

        const favoritesLink = document.getElementById('favorites-link');
        if (favoritesLink) {
            favoritesLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showFavorites();
                this.toggleMenu(); // Cerrar menú
            });
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        // Toggle admin key field
        const roleRadios = document.querySelectorAll('input[name="loginRole"]');
        roleRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const adminKeyWrapper = document.getElementById('adminKeyWrapper');
                if (adminKeyWrapper) {
                    if (e.target.value === 'admin') {
                        adminKeyWrapper.style.display = 'block';
                    } else {
                        adminKeyWrapper.style.display = 'none';
                    }
                }
            });
        });

        // Logout button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
                this.logout();
            }
        });

        // Cerrar modales
        const closeLoginModal = document.getElementById('closeLoginModal');
        if (closeLoginModal) {
            closeLoginModal.addEventListener('click', () => {
                document.getElementById('loginModal').classList.remove('active');
            });
        }

        // Cerrar admin panel
        const closeAdminPanel = document.getElementById('closeAdminPanel');
        if (closeAdminPanel) {
            closeAdminPanel.addEventListener('click', () => {
                document.getElementById('adminPanel').classList.remove('active');
            });
        }

        // Cerrar recipe modal
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                document.getElementById('recipeModal').classList.remove('active');
            });
        }

        // Cerrar modales al hacer click fuera
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });

        // Logo - volver al inicio
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => this.showRecipes());
        }
    }

    // Toggle favorito
    toggleFavorite(recipeId) {
        const index = this.favorites.indexOf(recipeId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(recipeId);
        }
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        console.log('❤️ Favorito actualizado:', recipeId);
    }

    // Mostrar modal de receta
    showRecipeModal(recipeId) {
        const recipe = this.recipes.find(r => r.id === recipeId);
        if (!recipe) {
            console.error('❌ Receta no encontrada:', recipeId);
            return;
        }

        console.log('📖 Mostrando receta:', recipe.nombre);
        
        const modal = document.getElementById('recipeModal');
        const modalBody = document.getElementById('modalBody');
        
        if (!modal || !modalBody) {
            console.error('❌ Modal no encontrado');
            return;
        }

        modalBody.innerHTML = `
            <div class="recipe-detail">
                <div class="recipe-header">
                    <img src="${recipe.imagen}" alt="${recipe.nombre}" class="recipe-detail-image" onerror="this.src='img/default-recipe.svg'">
                    <div class="recipe-detail-info">
                        <h2>${recipe.nombre}</h2>
                        <p><i class="fas fa-map-marker-alt"></i> ${recipe.pais}</p>
                        <p><i class="fas fa-clock"></i> ${recipe.tiempo} minutos</p>
                        <div class="recipe-rating">
                            ${this.createStars(recipe.calificacion || 0)}
                            <span>${(recipe.calificacion || 0).toFixed(1)} (${recipe.resenas || 0} reseñas)</span>
                        </div>
                    </div>
                </div>
                
                <div class="recipe-content">
                    <div class="ingredients">
                        <h3><i class="fas fa-list"></i> Ingredientes</h3>
                        <ul>
                            ${recipe.ingredientes.map(ing => {
                                if (typeof ing === 'string') {
                                    return `<li>${ing}</li>`;
                                } else {
                                    return `<li>${ing.icono || '🥄'} ${ing.cantidad || ''} ${ing.nombre}</li>`;
                                }
                            }).join('')}
                        </ul>
                    </div>
                    
                    <div class="instructions">
                        <h3><i class="fas fa-clipboard-list"></i> Instrucciones</h3>
                        <ol>
                            ${recipe.instrucciones.map(inst => `<li>${inst}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }

    // Búsqueda simple
    search(query) {
        if (!query.trim()) {
            this.showRecipes();
            return;
        }

        const filtered = this.recipes.filter(recipe => 
            recipe.nombre.toLowerCase().includes(query.toLowerCase()) ||
            recipe.pais.toLowerCase().includes(query.toLowerCase()) ||
            recipe.categorias.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
        );

        const grid = document.getElementById('recipesGrid');
        const title = document.getElementById('sectionTitle');
        
        if (title) {
            title.textContent = `Resultados para: "${query}" (${filtered.length})`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = '<div style="text-align: center; padding: 40px;">No se encontraron recetas</div>';
        } else {
            const recipesHTML = filtered.map(recipe => this.createRecipeCard(recipe)).join('');
            grid.innerHTML = recipesHTML;
        }

        console.log(`🔍 Búsqueda "${query}": ${filtered.length} resultados`);
    }

    // Toggle menú
    toggleMenu() {
        const menu = document.getElementById('menu');
        const hamburger = document.getElementById('hamburger');
        
        if (menu) {
            menu.classList.toggle('active');
        }
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
    }

    // Mostrar modal de login completo
    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Mostrar panel de admin completo
    showAdminPanel() {
        if (!this.currentUser || this.currentUser.role !== 'admin') {
            alert('Acceso denegado. Solo administradores pueden acceder.');
            return;
        }
        
        const modal = document.getElementById('adminPanel');
        if (modal) {
            modal.classList.add('active');
            this.loadAdminContent();
        }
    }

    // Cargar contenido del panel de admin
    loadAdminContent() {
        const adminContent = document.getElementById('adminContent');
        if (!adminContent) return;

        adminContent.innerHTML = `
            <div class="admin-panel-header">
                <h2><i class="fas fa-crown"></i> Panel de Administrador</h2>
                <p>Gestiona recetas, usuarios y productos</p>
            </div>
            
            <div class="admin-tabs">
                <button class="admin-tab-btn active" data-tab="recetas">
                    <i class="fas fa-list"></i> Recetas
                </button>
                <button class="admin-tab-btn" data-tab="usuarios">
                    <i class="fas fa-users"></i> Usuarios
                </button>
                <button class="admin-tab-btn" data-tab="productos">
                    <i class="fas fa-box"></i> Productos
                </button>
            </div>

            <div class="admin-tab-content" id="admin-recetas">
                <h3>Gestión de Recetas</h3>
                <div class="admin-recipes-list">
                    ${this.recipes.map(recipe => `
                        <div class="admin-recipe-item">
                            <img src="${recipe.imagen}" alt="${recipe.nombre}" style="width: 60px; height: 40px; object-fit: cover;">
                            <div class="admin-recipe-info">
                                <strong>${recipe.nombre}</strong>
                                <small>${recipe.pais} - ${recipe.tiempo} min</small>
                            </div>
                            <div class="admin-recipe-actions">
                                <button class="btn-edit" onclick="app.editRecipe(${recipe.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-delete" onclick="app.deleteRecipe(${recipe.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="admin-tab-content" id="admin-usuarios" style="display: none;">
                <h3>Gestión de Usuarios</h3>
                <p>Funcionalidad de usuarios en desarrollo...</p>
            </div>

            <div class="admin-tab-content" id="admin-productos" style="display: none;">
                <h3>Gestión de Productos</h3>
                <p>Funcionalidad de productos en desarrollo...</p>
            </div>
        `;

        // Event listeners para tabs
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchAdminTab(tab);
            });
        });

        // Event listeners para formularios del admin
        const submitAddRecipe = document.getElementById('submitAddRecipe');
        if (submitAddRecipe) {
            submitAddRecipe.addEventListener('click', () => this.handleAddRecipe());
        }

        const clearRecipeForm = document.getElementById('clearRecipeForm');
        if (clearRecipeForm) {
            clearRecipeForm.addEventListener('click', () => this.clearAddRecipeForm());
        }
    }

    // Cambiar tab del admin
    switchAdminTab(tab) {
        // Actualizar botones
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Mostrar contenido
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(`tab-${tab}`).style.display = 'block';

        // Cargar contenido específico según el tab
        if (tab === 'recetas') {
            this.loadAdminRecipesList();
        } else if (tab === 'usuarios') {
            this.loadAdminUsersList();
        } else if (tab === 'productos') {
            this.loadAdminProductsList();
        }
    }

    // Manejar agregar receta
    handleAddRecipe() {
        const nombre = document.getElementById('r_nombre')?.value;
        const pais = document.getElementById('r_pais')?.value;
        const tiempo = document.getElementById('r_tiempo')?.value;
        const ingredientes = document.getElementById('r_ingredientes')?.value;
        const instrucciones = document.getElementById('r_instrucciones')?.value;

        if (!nombre || !ingredientes || !instrucciones) {
            alert('Por favor completa los campos obligatorios: nombre, ingredientes e instrucciones');
            return;
        }

        // Obtener categorías seleccionadas
        const categorias = [];
        document.querySelectorAll('#categoriesWrapper input[type="checkbox"]:checked').forEach(checkbox => {
            categorias.push(checkbox.value);
        });

        // Crear nueva receta
        const newRecipe = {
            id: Date.now(), // ID temporal
            nombre: nombre,
            pais: pais || 'Internacional',
            tiempo: parseInt(tiempo) || 30,
            categorias: categorias.length > 0 ? categorias : ['comidas'],
            ingredientes: ingredientes.split('\n').filter(ing => ing.trim()),
            instrucciones: instrucciones.split('\n').filter(inst => inst.trim()),
            imagen: 'img/default-recipe.svg',
            calificacion: 0,
            resenas: 0
        };

        // Agregar a la lista local
        this.recipes.push(newRecipe);
        
        // Actualizar vista
        this.showRecipes();
        this.loadAdminRecipesList();
        
        // Limpiar formulario
        this.clearAddRecipeForm();
        
        alert(`Receta "${nombre}" agregada exitosamente!`);
        console.log('✅ Nueva receta agregada:', newRecipe);
    }

    // Limpiar formulario de agregar receta
    clearAddRecipeForm() {
        document.getElementById('r_nombre').value = '';
        document.getElementById('r_pais').value = '';
        document.getElementById('r_tiempo').value = '';
        document.getElementById('r_ingredientes').value = '';
        document.getElementById('r_instrucciones').value = '';
        
        // Desmarcar categorías
        document.querySelectorAll('#categoriesWrapper input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        console.log('🧹 Formulario de receta limpiado');
    }

    // Cargar lista de recetas en admin
    loadAdminRecipesList() {
        const container = document.getElementById('adminRecipes');
        if (!container) return;

        if (this.recipes.length === 0) {
            container.innerHTML = '<div class="admin-empty">No hay recetas disponibles</div>';
            return;
        }

        container.innerHTML = this.recipes.map(recipe => `
            <div class="admin-recipe-card">
                <div class="admin-recipe-image">
                    <img src="${recipe.imagen}" alt="${recipe.nombre}" onerror="this.src='img/default-recipe.svg'">
                </div>
                <div class="admin-recipe-info">
                    <h4>${recipe.nombre}</h4>
                    <p><i class="fas fa-map-marker-alt"></i> ${recipe.pais}</p>
                    <p><i class="fas fa-clock"></i> ${recipe.tiempo} min</p>
                    <div class="admin-recipe-categories">
                        ${recipe.categorias.slice(0, 2).map(cat => 
                            `<span class="category-tag">${this.getCategoryName(cat)}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="admin-recipe-actions">
                    <button class="btn-edit" onclick="app.editRecipe(${recipe.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="app.deleteRecipe(${recipe.id})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Cargar lista de usuarios en admin
    loadAdminUsersList() {
        const container = document.getElementById('adminUsers');
        if (!container) return;

        container.innerHTML = `
            <div class="admin-users-grid">
                <div class="admin-user-card">
                    <div class="admin-user-info">
                        <div class="admin-user-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="admin-user-details">
                            <h4>${this.currentUser?.username || 'Usuario Actual'}</h4>
                            <p>Rol: ${this.currentUser?.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
                            <p>Favoritos: ${this.favorites.length}</p>
                        </div>
                    </div>
                    <div class="admin-user-actions">
                        <button class="btn-info" title="Ver detalles">
                            <i class="fas fa-info-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="admin-section-note">
                <p><i class="fas fa-info-circle"></i> Sistema de usuarios en desarrollo. Actualmente solo se muestra el usuario actual.</p>
            </div>
        `;
    }

    // Cargar lista de productos en admin
    loadAdminProductsList() {
        const container = document.getElementById('adminProductsList');
        if (!container) return;

        // Productos de ejemplo
        const sampleProducts = [
            {
                id: 1,
                name: 'Delantal Premium RecetasWorld',
                points: 50,
                stock: 10,
                image: 'img/placeholder.svg'
            },
            {
                id: 2,
                name: 'Set de Cucharas Medidoras',
                points: 30,
                stock: 25,
                image: 'img/placeholder.svg'
            },
            {
                id: 3,
                name: 'Libro de Recetas Digital',
                points: 100,
                stock: 5,
                image: 'img/placeholder.svg'
            }
        ];

        container.innerHTML = sampleProducts.map(product => `
            <div class="admin-product-card">
                <div class="admin-product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="admin-product-info">
                    <h4>${product.name}</h4>
                    <p><i class="fas fa-coins"></i> ${product.points} puntos</p>
                    <p><i class="fas fa-boxes"></i> Stock: ${product.stock}</p>
                </div>
                <div class="admin-product-actions">
                    <button class="btn-edit" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Mostrar productos
    showProducts() {
        const grid = document.getElementById('recipesGrid');
        const title = document.getElementById('sectionTitle');
        
        if (title) {
            title.textContent = 'Productos Disponibles';
        }

        const sampleProducts = [
            {
                id: 1,
                name: 'Delantal Premium RecetasWorld',
                points: 50,
                stock: 10,
                image: 'img/placeholder.svg',
                description: 'Delantal de cocina premium con el logo de RecetasWorld'
            },
            {
                id: 2,
                name: 'Set de Cucharas Medidoras',
                points: 30,
                stock: 25,
                image: 'img/placeholder.svg',
                description: 'Set completo de cucharas medidoras para cocina'
            },
            {
                id: 3,
                name: 'Libro de Recetas Digital',
                points: 100,
                stock: 5,
                image: 'img/placeholder.svg',
                description: 'Colección digital de las mejores recetas del mundo'
            }
        ];

        if (grid) {
            grid.innerHTML = sampleProducts.map(product => `
                <div class="product-card">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='img/placeholder.svg'">
                        <div class="product-overlay">
                            <span class="product-badge">
                                <i class="fas fa-coins"></i> ${product.points} puntos
                            </span>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-stock">
                            <i class="fas fa-boxes"></i> Stock: ${product.stock}
                        </div>
                        <div class="product-footer">
                            <button class="btn-primary product-redeem-btn" data-product-id="${product.id}">
                                <i class="fas fa-gift"></i> Canjear
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Event listeners para botones de canje
            document.querySelectorAll('.product-redeem-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.getAttribute('data-product-id');
                    this.redeemProduct(productId);
                });
            });
        }
    }

    // Canjear producto
    redeemProduct(productId) {
        if (!this.currentUser) {
            alert('Debes iniciar sesión para canjear productos');
            return;
        }

        // Simulación de canje
        alert('¡Producto canjeado exitosamente!\n\nSe enviará a tu dirección registrada en 3-5 días hábiles.');
        console.log(`🎁 Producto ${productId} canjeado por ${this.currentUser.username}`);
    }

    // Mostrar favoritos
    showFavorites() {
        const grid = document.getElementById('recipesGrid');
        const title = document.getElementById('sectionTitle');
        
        if (title) {
            title.textContent = `Mis Recetas Favoritas (${this.favorites.length})`;
        }

        if (this.favorites.length === 0) {
            if (grid) {
                grid.innerHTML = `
                    <div class="favorites-empty">
                        <div class="empty-icon">
                            <i class="fas fa-heart-broken"></i>
                        </div>
                        <h3>No tienes favoritos aún</h3>
                        <p>Explora nuestras recetas y marca las que más te gusten</p>
                        <button class="btn-primary" onclick="app.showRecipes()">
                            <i class="fas fa-search"></i> Explorar Recetas
                        </button>
                    </div>
                `;
            }
            return;
        }

        // Filtrar recetas favoritas
        const favoriteRecipes = this.recipes.filter(recipe => 
            this.favorites.includes(recipe.id)
        );

        if (grid) {
            const recipesHTML = favoriteRecipes.map(recipe => this.createRecipeCard(recipe)).join('');
            grid.innerHTML = recipesHTML;
        }

        console.log(`❤️ Mostrando ${favoriteRecipes.length} recetas favoritas`);
    }

    // Funciones de admin (placeholders)
    editRecipe(id) {
        const recipe = this.recipes.find(r => r.id === id);
        if (recipe) {
            alert(`Editar receta: ${recipe.nombre}\n(Funcionalidad en desarrollo)`);
        }
    }

    deleteRecipe(id) {
        const recipe = this.recipes.find(r => r.id === id);
        if (recipe && confirm(`¿Eliminar la receta "${recipe.nombre}"?`)) {
            this.recipes = this.recipes.filter(r => r.id !== id);
            this.showRecipes();
            this.loadAdminContent();
            alert('Receta eliminada (solo de la sesión actual)');
        }
    }

    // Sistema de login
    login() {
        const username = document.getElementById('loginUsername')?.value;
        const password = document.getElementById('loginPassword')?.value;
        const role = document.querySelector('input[name="loginRole"]:checked')?.value;
        const adminKey = document.getElementById('loginAdminKey')?.value;

        if (!username || !password) {
            alert('Por favor completa todos los campos');
            return;
        }

        // Validación simple
        if (role === 'admin') {
            if (adminKey !== 'adminkey123') {
                alert('Clave maestra incorrecta');
                return;
            }
        }

        // Crear usuario
        this.currentUser = {
            username: username,
            role: role || 'user'
        };

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        // Cerrar modal y actualizar UI
        document.getElementById('loginModal').classList.remove('active');
        this.updateUI();
        
        alert(`Bienvenido ${username}!`);
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
        alert('Sesión cerrada');
    }

    // Actualizar UI según el usuario
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        const userConfigBtn = document.getElementById('userConfigBtn');
        const achievementsBtn = document.getElementById('achievementsBtn');
        const userArea = document.getElementById('userArea');
        
        if (this.currentUser) {
            // Usuario logueado
            if (loginBtn) loginBtn.style.display = 'none';
            
            // Mostrar botones según el rol
            if (this.currentUser.role === 'admin') {
                if (adminPanelBtn) adminPanelBtn.style.display = 'block';
            }
            
            if (userConfigBtn) userConfigBtn.style.display = 'block';
            if (achievementsBtn) achievementsBtn.style.display = 'block';
            
            // Mostrar área de usuario
            if (userArea) {
                userArea.innerHTML = `
                    <span style="color: white; margin-right: 10px;">
                        <i class="fas fa-user"></i> ${this.currentUser.username}
                        ${this.currentUser.role === 'admin' ? '<i class="fas fa-crown" style="color: gold;"></i>' : ''}
                    </span>
                    <button id="logoutBtn" class="btn-secondary" style="padding: 4px 8px; font-size: 12px;">
                        <i class="fas fa-sign-out-alt"></i> Salir
                    </button>
                `;
            }
        } else {
            // Usuario no logueado
            if (loginBtn) loginBtn.style.display = 'block';
            if (adminPanelBtn) adminPanelBtn.style.display = 'none';
            if (userConfigBtn) userConfigBtn.style.display = 'none';
            if (achievementsBtn) achievementsBtn.style.display = 'none';
            if (userArea) userArea.innerHTML = '';
        }
    }

    // Funciones adicionales - IMPLEMENTACIONES COMPLETAS
    showUserConfig() {
        const modal = document.getElementById('userConfigModal');
        if (!modal) {
            // Crear modal dinámicamente si no existe
            this.createUserConfigModal();
        } else {
            modal.classList.add('active');
            this.loadUserConfigContent();
        }
    }

    createUserConfigModal() {
        const modalHTML = `
            <div class="modal" id="userConfigModal">
                <div class="modal-content modal-medium">
                    <button class="modal-close" id="closeUserConfigModal">&times;</button>
                    <div class="modal-body" id="userConfigContent">
                        <div class="config-header">
                            <div class="config-icon">
                                <i class="fas fa-user-cog"></i>
                            </div>
                            <h2>Configuración de Usuario</h2>
                            <p class="config-subtitle">Personaliza tu experiencia en RecetasWorld</p>
                        </div>
                        
                        <div class="config-tabs">
                            <button class="config-tab-btn active" data-tab="profile">
                                <i class="fas fa-user"></i> Perfil
                            </button>
                            <button class="config-tab-btn" data-tab="preferences">
                                <i class="fas fa-heart"></i> Preferencias
                            </button>
                            <button class="config-tab-btn" data-tab="address">
                                <i class="fas fa-map-marker-alt"></i> Mi Dirección
                            </button>
                        </div>

                        <div class="config-tab-content" id="config-profile">
                            <h3>Información del Perfil</h3>
                            <div class="profile-info">
                                <div class="profile-avatar">
                                    <i class="fas fa-user-circle"></i>
                                </div>
                                <div class="profile-details">
                                    <p><strong>Usuario:</strong> ${this.currentUser?.username || 'Invitado'}</p>
                                    <p><strong>Rol:</strong> ${this.currentUser?.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
                                    <p><strong>Recetas favoritas:</strong> ${this.favorites.length}</p>
                                    <p><strong>Puntos acumulados:</strong> 0</p>
                                </div>
                            </div>
                        </div>

                        <div class="config-tab-content" id="config-preferences" style="display: none;">
                            <h3>Preferencias Culinarias</h3>
                            <div class="preferences-grid">
                                <div class="preference-item">
                                    <label>
                                        <input type="checkbox" id="pref-desayunos"> Desayunos
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <label>
                                        <input type="checkbox" id="pref-comidas"> Comidas
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <label>
                                        <input type="checkbox" id="pref-cenas"> Cenas
                                    </label>
                                </div>
                                <div class="preference-item">
                                    <label>
                                        <input type="checkbox" id="pref-postres"> Postres
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="config-tab-content" id="config-address" style="display: none;">
                            <h3>Dirección de Entrega</h3>
                            <form id="addressForm" class="address-form">
                                <div class="form-group">
                                    <label for="address-street">Calle y número</label>
                                    <input type="text" id="address-street" placeholder="Ej: Av. Reforma 123">
                                </div>
                                <div class="form-group">
                                    <label for="address-city">Ciudad</label>
                                    <input type="text" id="address-city" placeholder="Ej: Ciudad de México">
                                </div>
                                <div class="form-group">
                                    <label for="address-postal">Código postal</label>
                                    <input type="text" id="address-postal" placeholder="Ej: 06600">
                                </div>
                                <button type="button" id="saveAddress" class="btn-primary">
                                    <i class="fas fa-save"></i> Guardar Dirección
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Event listeners para el modal
        document.getElementById('closeUserConfigModal').addEventListener('click', () => {
            document.getElementById('userConfigModal').classList.remove('active');
        });

        // Event listeners para tabs
        document.querySelectorAll('.config-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchConfigTab(tab);
            });
        });

        // Mostrar modal
        document.getElementById('userConfigModal').classList.add('active');
    }

    switchConfigTab(tab) {
        // Actualizar botones
        document.querySelectorAll('.config-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Mostrar contenido
        document.querySelectorAll('.config-tab-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(`config-${tab}`).style.display = 'block';
    }

    showAchievements() {
        const modal = document.getElementById('achievementsModal');
        if (!modal) {
            this.createAchievementsModal();
        } else {
            modal.classList.add('active');
            this.loadAchievementsContent();
        }
    }

    createAchievementsModal() {
        const modalHTML = `
            <div class="modal" id="achievementsModal">
                <div class="modal-content modal-large">
                    <button class="modal-close" id="closeAchievementsModal">&times;</button>
                    <div class="modal-body" id="achievementsContent">
                        <div class="achievements-header">
                            <div class="achievements-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <h2>Logros y Recompensas</h2>
                            <p class="achievements-subtitle">Descubre recetas y gana puntos</p>
                        </div>
                        
                        <div class="achievements-stats">
                            <div class="stat-card">
                                <i class="fas fa-heart"></i>
                                <div class="stat-info">
                                    <span class="stat-number">${this.favorites.length}</span>
                                    <span class="stat-label">Favoritos</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-eye"></i>
                                <div class="stat-info">
                                    <span class="stat-number">0</span>
                                    <span class="stat-label">Vistas</span>
                                </div>
                            </div>
                            <div class="stat-card">
                                <i class="fas fa-coins"></i>
                                <div class="stat-info">
                                    <span class="stat-number">0</span>
                                    <span class="stat-label">Puntos</span>
                                </div>
                            </div>
                        </div>

                        <div class="achievements-grid">
                            <div class="achievement-item locked">
                                <div class="achievement-icon">
                                    <i class="fas fa-utensils"></i>
                                </div>
                                <div class="achievement-info">
                                    <h4>Primer Paso</h4>
                                    <p>Ver tu primera receta</p>
                                    <div class="achievement-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 0%"></div>
                                        </div>
                                        <span>0/1</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="achievement-item locked">
                                <div class="achievement-icon">
                                    <i class="fas fa-heart"></i>
                                </div>
                                <div class="achievement-info">
                                    <h4>Coleccionista</h4>
                                    <p>Agregar 5 recetas a favoritos</p>
                                    <div class="achievement-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: ${Math.min(this.favorites.length / 5 * 100, 100)}%"></div>
                                        </div>
                                        <span>${this.favorites.length}/5</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="achievement-item locked">
                                <div class="achievement-icon">
                                    <i class="fas fa-globe"></i>
                                </div>
                                <div class="achievement-info">
                                    <h4>Explorador Mundial</h4>
                                    <p>Ver recetas de 10 países diferentes</p>
                                    <div class="achievement-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" style="width: 0%"></div>
                                        </div>
                                        <span>0/10</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Event listener para cerrar
        document.getElementById('closeAchievementsModal').addEventListener('click', () => {
            document.getElementById('achievementsModal').classList.remove('active');
        });

        // Mostrar modal
        document.getElementById('achievementsModal').classList.add('active');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 Iniciando RecetasWorld Simple...');
    window.app = new RecipesAppSimple();
});

// Fallback si el DOM ya está cargado
if (document.readyState !== 'loading') {
    console.log('🌟 DOM ya cargado, iniciando inmediatamente...');
    window.app = new RecipesAppSimple();
}