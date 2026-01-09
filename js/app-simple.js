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

    // Mostrar modal de login (placeholder)
    showLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Mostrar panel de admin (placeholder)
    showAdminPanel() {
        const modal = document.getElementById('adminPanel');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Actualizar UI
    updateUI() {
        // Mostrar/ocultar botones según el usuario
        const loginBtn = document.getElementById('loginBtn');
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        
        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (adminPanelBtn && this.currentUser.role === 'admin') {
                adminPanelBtn.style.display = 'block';
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (adminPanelBtn) adminPanelBtn.style.display = 'none';
        }
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