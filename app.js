// ── i18n ────────────────────────────────────────────────────────────────────
const translations = {
  pt: {
    eyebrow: "Receitas da Semana",
    h1: "Compras sem drama.",
    stats: { recipes: "receitas", favorites: "favoritas", items: "itens" },
    shoppingTitle: "Lista de compras",
    clearShopping: "Limpar lista",
    shoppingEmpty: "Adicione ingredientes de uma receita.",
    searchPlaceholder: "Buscar receita ou ingrediente",
    filters: { all: "Todas", breakfast: "Café da manhã", lunch: "Almoço", dinner: "Jantar", favorites: "Favoritas" },
    formLabels: {
      name: "Nome da receita",
      namePlaceholder: "Ex: Pasta cremosa de limão",
      category: "Categoria",
      time: "Tempo",
      timePlaceholder: "30",
      difficulty: "Dificuldade",
      ingredients: "Ingredientes",
      ingredientsPlaceholder: "Um por linha: 2 ovos, 1 tomate, arroz...",
      steps: "Preparo",
      stepsPlaceholder: "Passos rápidos para cozinhar",
      reset: "Novo",
      save: "Salvar receita",
    },
    categories: { breakfast: "Café da manhã", lunch: "Almoço", dinner: "Jantar" },
    difficulties: { Easy: "Fácil", Medium: "Médio", Hard: "Difícil" },
    sectionTitle: "Receitas",
    resultCount: (n) => `${n} receita${n === 1 ? "" : "s"} encontrada${n === 1 ? "" : "s"}`,
    emptyState: "Nenhuma receita por aqui ainda.",
    noSteps: "Sem preparo anotado.",
    addShopping: "Adicionar compras",
    favoriteLabel: "Favoritar receita",
    editLabel: "Editar receita",
    deleteLabel: "Excluir receita",
    langButton: "EN",
  },
  en: {
    eyebrow: "Weekly Recipes",
    h1: "Shopping made easy.",
    stats: { recipes: "recipes", favorites: "favorites", items: "items" },
    shoppingTitle: "Shopping list",
    clearShopping: "Clear list",
    shoppingEmpty: "Add ingredients from a recipe.",
    searchPlaceholder: "Search recipe or ingredient",
    filters: { all: "All", breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner", favorites: "Favorites" },
    formLabels: {
      name: "Recipe name",
      namePlaceholder: "e.g. Creamy lemon pasta",
      category: "Category",
      time: "Time",
      timePlaceholder: "30",
      difficulty: "Difficulty",
      ingredients: "Ingredients",
      ingredientsPlaceholder: "One per line: 2 eggs, 1 tomato, rice...",
      steps: "Instructions",
      stepsPlaceholder: "Quick cooking steps",
      reset: "New",
      save: "Save recipe",
    },
    categories: { breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner" },
    difficulties: { Easy: "Easy", Medium: "Medium", Hard: "Hard" },
    sectionTitle: "Recipes",
    resultCount: (n) => `${n} recipe${n === 1 ? "" : "s"} found`,
    emptyState: "No recipes here yet.",
    noSteps: "No instructions added.",
    addShopping: "Add to shopping",
    favoriteLabel: "Favorite recipe",
    editLabel: "Edit recipe",
    deleteLabel: "Delete recipe",
    langButton: "PT",
  },
};

let lang = localStorage.getItem("mealPlanner.lang") || "pt";
const t = () => translations[lang];

function applyTranslations() {
  const tx = t();
  document.querySelector(".eyebrow").textContent = tx.eyebrow;
  document.querySelector(".sidebar h1").textContent = tx.h1;
  document.querySelector("#totalRecipes").nextElementSibling.textContent = tx.stats.recipes;
  document.querySelector("#totalFavorites").nextElementSibling.textContent = tx.stats.favorites;
  document.querySelector("#totalItems").nextElementSibling.textContent = tx.stats.items;
  document.querySelector(".panel-title h2").textContent = tx.shoppingTitle;
  document.querySelector("#clearShopping").setAttribute("aria-label", tx.clearShopping);
  document.querySelector("#shoppingEmpty").textContent = tx.shoppingEmpty;
  document.querySelector("#searchInput").placeholder = tx.searchPlaceholder;

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.textContent = tx.filters[btn.dataset.filter];
  });

  const labels = document.querySelectorAll(".recipe-form label");
  const lf = tx.formLabels;
  [[0, lf.name, "#recipeName", lf.namePlaceholder],
   [1, lf.category, null, null],
   [2, lf.time, "#recipeTime", lf.timePlaceholder],
   [3, lf.difficulty, null, null]].forEach(([i, text, sel, ph]) => {
    labels[i].childNodes[0].textContent = text + "\n            ";
    if (sel && ph) document.querySelector(sel).placeholder = ph;
  });
  labels[4].childNodes[0].textContent = lf.ingredients + "\n            ";
  document.querySelector("#recipeIngredients").placeholder = lf.ingredientsPlaceholder;
  labels[5].childNodes[0].textContent = lf.steps + "\n            ";
  document.querySelector("#recipeSteps").placeholder = lf.stepsPlaceholder;

  document.querySelector("#resetForm").textContent = lf.reset;
  document.querySelector(".primary-button").textContent = lf.save;

  const catSelect = document.querySelector("#recipeCategory");
  catSelect.options[0].textContent = tx.categories.breakfast;
  catSelect.options[1].textContent = tx.categories.lunch;
  catSelect.options[2].textContent = tx.categories.dinner;

  const diffSelect = document.querySelector("#recipeDifficulty");
  diffSelect.options[0].textContent = tx.difficulties.Easy;
  diffSelect.options[1].textContent = tx.difficulties.Medium;
  diffSelect.options[2].textContent = tx.d