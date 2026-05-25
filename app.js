const translations = {
  pt: {
    eyebrow: "Receitas da Semana",
    h1: "Receitas da Semana",
    brandNote: "Um caderno de receitas moderno para planejar, favoritar e comprar melhor.",
    stats: { recipes: "receitas", favorites: "favoritas", items: "itens" },
    shoppingTitle: "Lista de compras",
    shoppingEmpty: "Adicione ingredientes de uma receita ou item avulso.",
    shoppingDashboardEmpty: "Sua lista de compras está vazia.",
    shoppingPlaceholder: "Adicionar item avulso",
    shoppingDashboardPlaceholder: "Adicionar ingrediente ou item",
    searchPlaceholder: "Buscar receita, ingrediente ou tipo",
    tabs: { recipes: "Receitas", favorites: "Favoritas", shopping: "Lista de compras" },
    filterLabel: "Refeição",
    typeFilterLabel: "Tipo",
    categoryFilters: {
      all: "Todas",
      breakfast: "Café da manhã",
      lunch: "Almoço",
      dinner: "Jantar",
      dessert: "Sobremesas",
      snack: "Snacks",
    },
    typeFilters: {
      all: "Todos os tipos",
      seafood: "Frutos do mar",
      meat: "Carne",
      chicken: "Frango",
      pasta: "Pasta",
      soup: "Sopa",
      other: "Outro",
    },
    formLabels: {
      photo: "Foto da receita",
      addPhoto: "Adicionar foto",
      removePhoto: "Remover foto",
      name: "Nome da receita",
      category: "Refeição",
      type: "Tipo",
      time: "Tempo",
      difficulty: "Dificuldade",
      ingredients: "Ingredientes",
      steps: "Preparo",
      reset: "Novo",
      save: "Salvar receita",
    },
    categories: {
      breakfast: "Café da manhã",
      lunch: "Almoço",
      dinner: "Jantar",
      dessert: "Sobremesas",
      snack: "Snacks",
    },
    types: {
      seafood: "Frutos do mar",
      meat: "Carne",
      chicken: "Frango",
      pasta: "Pasta",
      soup: "Sopa",
      other: "Outro",
    },
    difficulties: { Easy: "Fácil", Medium: "Médio", Hard: "Difícil" },
    sectionKicker: "Caderno",
    sectionTitle: "Receitas",
    shoppingKicker: "Mercado",
    resultCount: (n) => `${n} receita${n === 1 ? "" : "s"} encontrada${n === 1 ? "" : "s"}`,
    shoppingCount: (n) => `${n} ite${n === 1 ? "m" : "ns"} pendente${n === 1 ? "" : "s"}`,
    emptyState: "Nenhuma receita por aqui ainda.",
    noSteps: "Sem preparo anotado.",
    addShopping: "Adicionar compras",
    addButton: "Adicionar",
    langButton: "EN",
  },
  en: {
    eyebrow: "Weekly Recipes",
    h1: "Weekly Recipes",
    brandNote: "A modern recipe notebook for planning, saving favorites, and shopping better.",
    stats: { recipes: "recipes", favorites: "favorites", items: "items" },
    shoppingTitle: "Shopping list",
    shoppingEmpty: "Add ingredients from a recipe or a custom item.",
    shoppingDashboardEmpty: "Your shopping list is empty.",
    shoppingPlaceholder: "Add a custom item",
    shoppingDashboardPlaceholder: "Add ingredient or item",
    searchPlaceholder: "Search recipe, ingredient, or type",
    tabs: { recipes: "Recipes", favorites: "Favorites", shopping: "Shopping list" },
    filterLabel: "Meal",
    typeFilterLabel: "Type",
    categoryFilters: {
      all: "All",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      dessert: "Desserts",
      snack: "Snacks",
    },
    typeFilters: {
      all: "All types",
      seafood: "Seafood",
      meat: "Meat",
      chicken: "Chicken",
      pasta: "Pasta",
      soup: "Soup",
      other: "Other",
    },
    formLabels: {
      photo: "Recipe photo",
      addPhoto: "Add photo",
      removePhoto: "Remove photo",
      name: "Recipe name",
      category: "Meal",
      type: "Type",
      time: "Time",
      difficulty: "Difficulty",
      ingredients: "Ingredients",
      steps: "Instructions",
      reset: "New",
      save: "Save recipe",
    },
    categories: {
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      dessert: "Desserts",
      snack: "Snacks",
    },
    types: {
      seafood: "Seafood",
      meat: "Meat",
      chicken: "Chicken",
      pasta: "Pasta",
      soup: "Soup",
      other: "Other",
    },
    difficulties: { Easy: "Easy", Medium: "Medium", Hard: "Hard" },
    sectionKicker: "Notebook",
    sectionTitle: "Recipes",
    shoppingKicker: "Market",
    resultCount: (n) => `${n} recipe${n === 1 ? "" : "s"} found`,
    shoppingCount: (n) => `${n} pending item${n === 1 ? "" : "s"}`,
    emptyState: "No recipes here yet.",
    noSteps: "No instructions added.",
    addShopping: "Add to shopping",
    addButton: "Add",
    langButton: "PT",
  },
};

const storageKeys = {
  recipes: "mealPlanner.recipes",
  shopping: "mealPlanner.shopping",
};

const categories = ["breakfast", "lunch", "dinner", "dessert", "snack"];
const recipeTypes = ["seafood", "meat", "chicken", "pasta", "soup", "other"];

let lang = localStorage.getItem("mealPlanner.lang") || "pt";
let activeView = "recipes";
let activeCategoryFilter = "all";
let activeTypeFilter = "all";
let searchTerm = "";

const t = () => translations[lang];

function createId() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function svgPhoto(title, bg, accent, symbol) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
      <rect width="800" height="520" fill="${bg}"/>
      <path d="M0 410c160-90 295-35 418-112 101-64 174-145 382-96v318H0z" fill="${accent}" opacity=".22"/>
      <g fill="none" stroke="#243226" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity=".78">
        <path d="M182 180c70-48 145-48 226 0 76 45 145 42 210-10"/>
        <path d="M204 284c78-54 164-51 254 8 65 42 124 40 178-6"/>
      </g>
      <text x="72" y="126" fill="#243226" font-family="Georgia, serif" font-size="58" font-weight="700">${symbol}</text>
      <text x="72" y="430" fill="#243226" font-family="Georgia, serif" font-size="48" font-weight="700">${title}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const placeholderPhotos = {
  breakfast: svgPhoto("Breakfast", "#f7ddac", "#ba452f", "☕"),
  lunch: svgPhoto("Lunch", "#dfe9d2", "#2d6f73", "🍅"),
  dinner: svgPhoto("Dinner", "#d8e5e7", "#1f5b6e", "🍽"),
  dessert: svgPhoto("Dessert", "#f2d7d3", "#b54d72", "🍓"),
  snack: svgPhoto("Snack", "#eee4bd", "#9f6b28", "🫒"),
};

const seedRecipes = [
  {
    id: createId(),
    name: "Omelete de ervas",
    category: "breakfast",
    type: "other",
    time: 12,
    difficulty: "Easy",
    favorite: true,
    photo: placeholderPhotos.breakfast,
    ingredients: ["2 ovos", "1 colher de queijo", "salsinha", "tomate cereja"],
    steps: "Bata os ovos, misture os temperos e cozinhe em fogo baixo até firmar.",
  },
  {
    id: createId(),
    name: "Pasta de limão",
    category: "dinner",
    type: "pasta",
    time: 24,
    difficulty: "Medium",
    favorite: false,
    photo: svgPhoto("Pasta", "#f5e6c8", "#b63e2f", "🍋"),
    ingredients: ["massa", "limão siciliano", "parmesão", "manteiga"],
    steps: "Cozinhe a massa, emulsione o molho com limão e finalize com parmesão.",
  },
  {
    id: createId(),
    name: "Sopa rápida de legumes",
    category: "dinner",
    type: "soup",
    time: 28,
    difficulty: "Easy",
    favorite: false,
    photo: placeholderPhotos.dinner,
    ingredients: ["cenoura", "batata", "abobrinha", "caldo de legumes"],
    steps: "Corte tudo pequeno, cozinhe no caldo e finalize com azeite.",
  },
];

let recipes = load(storageKeys.recipes, seedRecipes).map(normalizeRecipe);
let shoppingItems = load(storageKeys.shopping, []).map((item) => ({
  id: item.id || createId(),
  name: item.name || String(item),
  done: Boolean(item.done),
}));

const recipeForm = document.querySelector("#recipeForm");
const recipeId = document.querySelector("#recipeId");
const recipePhotoData = document.querySelector("#recipePhotoData");
const recipePhoto = document.querySelector("#recipePhoto");
const photoPreview = document.querySelector("#photoPreview");
const removePhoto = document.querySelector("#removePhoto");
const recipeName = document.querySelector("#recipeName");
const recipeCategory = document.querySelector("#recipeCategory");
const recipeType = document.querySelector("#recipeType");
const recipeTime = document.querySelector("#recipeTime");
const recipeDifficulty = document.querySelector("#recipeDifficulty");
const recipeIngredients = document.querySelector("#recipeIngredients");
const recipeSteps = document.querySelector("#recipeSteps");
const recipeGrid = document.querySelector("#recipeGrid");
const recipeTemplate = document.querySelector("#recipeCardTemplate");
const searchInput = document.querySelector("#searchInput");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const shoppingList = document.querySelector("#shoppingList");
const shoppingEmpty = document.querySelector("#shoppingEmpty");
const shoppingForm = document.querySelector("#shoppingForm");
const shoppingInput = document.querySelector("#shoppingInput");
const shoppingDashboardForm = document.querySelector("#shoppingDashboardForm");
const shoppingDashboardInput = document.querySelector("#shoppingDashboardInput");
const shoppingDashboardList = document.querySelector("#shoppingDashboardList");
const shoppingDashboardEmpty = document.querySelector("#shoppingDashboardEmpty");
const shoppingCount = document.querySelector("#shoppingCount");
const typeFilter = document.querySelector("#typeFilter");
const recipesView = document.querySelector("#recipesView");
const shoppingView = document.querySelector("#shoppingView");

function load(key, fallback) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function save() {
  localStorage.setItem(storageKeys.recipes, JSON.stringify(recipes));
  localStorage.setItem(storageKeys.shopping, JSON.stringify(shoppingItems));
}

function normalize(value) {
  return value.trim().toLowerCase();
}

function normalizeRecipe(recipe) {
  const category = categories.includes(recipe.category) ? recipe.category : "dinner";
  return {
    id: recipe.id || createId(),
    name: recipe.name || "Receita sem nome",
    category,
    type: recipeTypes.includes(recipe.type) ? recipe.type : inferType(recipe),
    time: Number(recipe.time) || 30,
    difficulty: recipe.difficulty || "Easy",
    favorite: Boolean(recipe.favorite),
    photo: recipe.photo || placeholderPhotos[category],
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    steps: recipe.steps || "",
  };
}

function inferType(recipe) {
  const text = normalize(`${recipe.name || ""} ${(recipe.ingredients || []).join(" ")}`);
  if (text.includes("frango")) return "chicken";
  if (text.includes("carne") || text.includes("bife")) return "meat";
  if (text.includes("peixe") || text.includes("camarao") || text.includes("camarão")) return "seafood";
  if (text.includes("pasta") || text.includes("massa")) return "pasta";
  if (text.includes("sopa") || text.includes("caldo")) return "soup";
  return "other";
}

function getVisibleRecipes() {
  return recipes.filter((recipe) => {
    const matchesView = activeView !== "favorites" || recipe.favorite;
    const matchesCategory = activeCategoryFilter === "all" || recipe.category === activeCategoryFilter;
    const matchesType = activeTypeFilter === "all" || recipe.type === activeTypeFilter;
    const haystack = normalize(`${recipe.name} ${recipe.ingredients.join(" ")} ${recipe.category} ${recipe.type}`);
    return matchesView && matchesCategory && matchesType && haystack.includes(searchTerm);
  });
}

function render() {
  renderViews();
  renderRecipes();
  renderShopping();
  renderStats();
  save();
}

function renderViews() {
  const showShopping = activeView === "shopping";
  recipesView.hidden = showShopping;
  shoppingView.hidden = !showShopping;
  document.querySelector(".recipe-form-section").hidden = showShopping;
  document.querySelector(".filters-panel").hidden = showShopping;
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === activeView);
  });
}

function renderRecipes() {
  const tx = t();
  const visibleRecipes = getVisibleRecipes();
  recipeGrid.replaceChildren();
  emptyState.style.display = visibleRecipes.length ? "none" : "block";
  resultCount.textContent = tx.resultCount(visibleRecipes.length);

  visibleRecipes.forEach((recipe) => {
    const card = recipeTemplate.content.firstElementChild.cloneNode(true);
    const categoryPill = card.querySelector(".category-pill");
    const typePill = card.querySelector(".type-pill");
    const favorite = card.querySelector(".favorite-button");
    const image = card.querySelector("img");

    image.src = recipe.photo || placeholderPhotos[recipe.category];
    image.alt = recipe.name;
    categoryPill.textContent = tx.categories[recipe.category] || recipe.category;
    categoryPill.classList.add(recipe.category);
    typePill.textContent = tx.types[recipe.type] || recipe.type;
    card.querySelector("h3").textContent = recipe.name;
    card.querySelector(".time-meta").textContent = `${recipe.time} min`;
    card.querySelector(".difficulty-meta").textContent = tx.difficulties[recipe.difficulty] || recipe.difficulty;
    favorite.classList.toggle("active", recipe.favorite);

    const ingredientPreview = card.querySelector(".ingredient-preview");
    recipe.ingredients.slice(0, 4).forEach((ingredient) => {
      const item = document.createElement("li");
      item.textContent = ingredient;
      ingredientPreview.append(item);
    });

    card.querySelector(".steps-preview").textContent = recipe.steps || tx.noSteps;
    card.querySelector(".add-shopping").textContent = tx.addShopping;
    card.querySelector(".add-shopping").addEventListener("click", () => addIngredients(recipe.ingredients));
    card.querySelector(".edit-recipe").addEventListener("click", () => editRecipe(recipe.id));
    card.querySelector(".delete-recipe").addEventListener("click", () => deleteRecipe(recipe.id));
    favorite.addEventListener("click", () => toggleFavorite(recipe.id));
    recipeGrid.append(card);
  });
}

function renderShopping() {
  renderShoppingList(shoppingList, shoppingEmpty, true);
  renderShoppingList(shoppingDashboardList, shoppingDashboardEmpty, false);
  shoppingCount.textContent = t().shoppingCount(shoppingItems.filter((item) => !item.done).length);
}

function renderShoppingList(list, emptyElement, compact) {
  list.replaceChildren();
  emptyElement.style.display = shoppingItems.length ? "none" : "block";

  shoppingItems.forEach((item) => {
    const row = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("span");
    const deleteButton = document.createElement("button");

    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    label.textContent = item.name;
    label.classList.toggle("done", item.done);
    deleteButton.type = "button";
    deleteButton.className = "shopping-delete";
    deleteButton.setAttribute("aria-label", `Remover ${item.name}`);
    deleteButton.textContent = "×";

    checkbox.addEventListener("change", () => {
      item.done = checkbox.checked;
      render();
    });
    deleteButton.addEventListener("click", () => {
      shoppingItems = shoppingItems.filter((shoppingItem) => shoppingItem.id !== item.id);
      render();
    });

    row.classList.toggle("compact", compact);
    row.append(checkbox, label, deleteButton);
    list.append(row);
  });
}

function renderStats() {
  document.querySelector("#totalRecipes").textContent = recipes.length;
  document.querySelector("#totalFavorites").textContent = recipes.filter((recipe) => recipe.favorite).length;
  document.querySelector("#totalItems").textContent = shoppingItems.filter((item) => !item.done).length;
}

function addIngredients(ingredients) {
  const existing = new Set(shoppingItems.map((item) => normalize(item.name)));
  ingredients.forEach((ingredient) => {
    if (!existing.has(normalize(ingredient))) {
      existing.add(normalize(ingredient));
      shoppingItems.push({ id: createId(), name: ingredient, done: false });
    }
  });
  render();
}

function addShoppingItem(name) {
  const value = name.trim();
  if (!value) return;
  const exists = shoppingItems.some((item) => normalize(item.name) === normalize(value));
  if (!exists) {
    shoppingItems.push({ id: createId(), name: value, done: false });
  }
  shoppingInput.value = "";
  shoppingDashboardInput.value = "";
  render();
}

function setPhotoPreview(src) {
  recipePhotoData.value = src || "";
  photoPreview.replaceChildren();
  if (src) {
    const image = document.createElement("img");
    image.src = src;
    image.alt = "";
    photoPreview.append(image);
    photoPreview.classList.add("has-photo");
    return;
  }
  const label = document.createElement("span");
  label.textContent = t().formLabels.photo;
  photoPreview.append(label);
  photoPreview.classList.remove("has-photo");
}

function editRecipe(id) {
  const recipe = recipes.find((item) => item.id === id);
  recipeId.value = recipe.id;
  recipeName.value = recipe.name;
  recipeCategory.value = recipe.category;
  recipeType.value = recipe.type;
  recipeTime.value = recipe.time;
  recipeDifficulty.value = recipe.difficulty;
  recipeIngredients.value = recipe.ingredients.join("\n");
  recipeSteps.value = recipe.steps;
  setPhotoPreview(recipe.photo);
  activeView = "recipes";
  renderViews();
  recipeName.focus();
}

function deleteRecipe(id) {
  recipes = recipes.filter((recipe) => recipe.id !== id);
  if (recipeId.value === id) {
    recipeForm.reset();
    recipeId.value = "";
    setPhotoPreview("");
  }
  render();
}

function toggleFavorite(id) {
  recipes = recipes.map((recipe) => (recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe));
  render();
}

function applyTranslations() {
  const tx = t();

  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.querySelector("title").textContent = tx.h1;
  document.querySelector(".eyebrow").textContent = tx.eyebrow;
  document.querySelector(".sidebar h1").textContent = tx.h1;
  document.querySelector(".brand-note").textContent = tx.brandNote;
  document.querySelector("#totalRecipes").nextElementSibling.textContent = tx.stats.recipes;
  document.querySelector("#totalFavorites").nextElementSibling.textContent = tx.stats.favorites;
  document.querySelector("#totalItems").nextElementSibling.textContent = tx.stats.items;
  document.querySelector(".panel-title h2").textContent = tx.shoppingTitle;
  document.querySelector("#shoppingEmpty").textContent = tx.shoppingEmpty;
  document.querySelector("#shoppingDashboardEmpty").textContent = tx.shoppingDashboardEmpty;
  document.querySelector("#shoppingInput").placeholder = tx.shoppingPlaceholder;
  document.querySelector("#shoppingDashboardInput").placeholder = tx.shoppingDashboardPlaceholder;
  document.querySelector("#searchInput").placeholder = tx.searchPlaceholder;
  document.querySelector(".filter-label").textContent = tx.filterLabel;
  document.querySelector(".type-filter-label").firstChild.textContent = tx.typeFilterLabel;
  document.querySelector("#langToggle").textContent = tx.langButton;

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.textContent = tx.tabs[button.dataset.view];
  });
  document.querySelectorAll("[data-category-filter]").forEach((button) => {
    button.textContent = tx.categoryFilters[button.dataset.categoryFilter];
  });

  Array.from(typeFilter.options).forEach((option) => {
    option.textContent = tx.typeFilters[option.value];
  });
  Array.from(recipeCategory.options).forEach((option) => {
    option.textContent = tx.categories[option.value];
  });
  Array.from(recipeType.options).forEach((option) => {
    option.textContent = tx.types[option.value];
  });
  Array.from(recipeDifficulty.options).forEach((option) => {
    option.textContent = tx.difficulties[option.value];
  });

  const labels = document.querySelectorAll(".recipe-form label:not(.file-label)");
  labels[0].firstChild.textContent = tx.formLabels.name;
  labels[1].firstChild.textContent = tx.formLabels.category;
  labels[2].firstChild.textContent = tx.formLabels.type;
  labels[3].firstChild.textContent = tx.formLabels.time;
  labels[4].firstChild.textContent = tx.formLabels.difficulty;
  labels[5].firstChild.textContent = tx.formLabels.ingredients;
  labels[6].firstChild.textContent = tx.formLabels.steps;
  document.querySelector(".file-label").firstChild.textContent = tx.formLabels.addPhoto;
  document.querySelector("#removePhoto").textContent = tx.formLabels.removePhoto;
  document.querySelector("#resetForm").textContent = tx.formLabels.reset;
  document.querySelector(".recipe-form .primary-button").textContent = tx.formLabels.save;
  document.querySelector("#shoppingDashboardForm .primary-button").textContent = tx.addButton;
  document.querySelector("#recipesView .section-kicker").textContent = tx.sectionKicker;
  document.querySelector("#recipesView h2").textContent = tx.sectionTitle;
  document.querySelector("#shoppingView .section-kicker").textContent = tx.shoppingKicker;
  document.querySelector("#shoppingView h2").textContent = tx.shoppingTitle;
  if (!recipePhotoData.value) setPhotoPreview("");
  render();
}

recipeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ingredients = recipeIngredients.value
    .split("\n")
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);
  const existing = recipes.find((recipe) => recipe.id === recipeId.value);
  const category = recipeCategory.value;
  const data = {
    id: recipeId.value || createId(),
    name: recipeName.value.trim(),
    category,
    type: recipeType.value,
    time: Number(recipeTime.value),
    difficulty: recipeDifficulty.value,
    ingredients,
    steps: recipeSteps.value.trim(),
    favorite: existing?.favorite || false,
    photo: recipePhotoData.value || placeholderPhotos[category],
  };

  recipes = recipeId.value
    ? recipes.map((recipe) => (recipe.id === recipeId.value ? data : recipe))
    : [data, ...recipes];
  recipeForm.reset();
  recipeId.value = "";
  setPhotoPreview("");
  render();
});

recipeForm.addEventListener("reset", () => {
  recipeId.value = "";
  recipePhoto.value = "";
  setPhotoPreview("");
});

recipePhoto.addEventListener("change", () => {
  const file = recipePhoto.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => setPhotoPreview(String(reader.result)));
  reader.readAsDataURL(file);
});

removePhoto.addEventListener("click", () => {
  recipePhoto.value = "";
  setPhotoPreview("");
});

searchInput.addEventListener("input", (event) => {
  searchTerm = normalize(event.target.value);
  renderRecipes();
});

document.querySelectorAll("[data-category-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector("[data-category-filter].active").classList.remove("active");
    button.classList.add("active");
    activeCategoryFilter = button.dataset.categoryFilter;
    renderRecipes();
  });
});

typeFilter.addEventListener("change", () => {
  activeTypeFilter = typeFilter.value;
  renderRecipes();
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    activeView = button.dataset.view;
    render();
  });
});

shoppingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addShoppingItem(shoppingInput.value);
});

shoppingDashboardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addShoppingItem(shoppingDashboardInput.value);
});

document.querySelector("#clearShopping").addEventListener("click", () => {
  shoppingItems = [];
  render();
});

document.querySelector("#langToggle").addEventListener("click", () => {
  lang = lang === "pt" ? "en" : "pt";
  localStorage.setItem("mealPlanner.lang", lang);
  applyTranslations();
});

applyTranslations();
