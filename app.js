// ── VARIÁVEIS GLOBAIS (declaradas no topo para evitar hoisting) ──
let lang = localStorage.getItem("mealPlanner.lang") || "pt";
const settingsStorageKey = (uid) => `mealPlanner.profile.${uid}`;

// ── TIMER STATE ──────────────────────────────────
let timerTotalSeconds = 10 * 60;
let timerRemainingSeconds = timerTotalSeconds;
let timerIntervalId = null;
let timerIsRunning = false;
let timerAlarmActive = false;
let audioCtx = null;

// ── TOAST NOTIFICATIONS ──────────────────────────
function showToast(message, type = "success") {
  const container = document.querySelector("#toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type === "error" ? "toast-error" : ""}`.trim();
  const icon = type === "error"
    ? `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;
  toast.innerHTML = `${icon}<span>${message}</span>`;
  container.append(toast);
  setTimeout(() => toast.remove(), 2600);
}

// ── AUTHENTICATION ───────────────────────────────
const authScreen = document.querySelector("#authScreen");
const appShell = document.querySelector("#appShell");
const authForm = document.querySelector("#authForm");
const authNameField = document.querySelector("#authNameField");
const authName = document.querySelector("#authName");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const authError = document.querySelector("#authError");
const authSubmitBtn = document.querySelector("#authSubmitBtn");
const authTabLogin = document.querySelector("#authTabLogin");
const authTabSignup = document.querySelector("#authTabSignup");
const googleSignInBtn = document.querySelector("#googleSignInBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const userEmailEl = document.querySelector("#userEmail");
const userAvatarEl = document.querySelector("#userAvatar");
const userAvatarImg = document.querySelector("#userAvatarImg");
const userAvatarInitial = document.querySelector("#userAvatarInitial");
const sidebarGreeting = document.querySelector("#sidebarGreeting");

function updateSidebarAvatar(name, photoUrl) {
  const initial = (name || "U").charAt(0).toUpperCase();
  userAvatarInitial.textContent = initial;
  if (photoUrl) {
    userAvatarImg.src = photoUrl;
    userAvatarImg.hidden = false;
    userAvatarInitial.hidden = true;
  } else {
    userAvatarImg.hidden = true;
    userAvatarInitial.hidden = false;
  }
}

function updateSidebarGreeting(name) {
  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
  const firstName = (name || "").split(" ")[0];
  if (firstName) {
    sidebarGreeting.textContent = langKey === "pt" ? `Olá, ${firstName}! 👋` : `Hello, ${firstName}! 👋`;
    sidebarGreeting.hidden = false;
  } else {
    sidebarGreeting.hidden = true;
  }
}
const passwordStrength = document.querySelector("#passwordStrength");
const authTermsField = document.querySelector("#authTermsField");
const authTermsCheckbox = document.querySelector("#authTermsCheckbox");
const termsOverlay = document.querySelector("#termsOverlay");
const privacyOverlay = document.querySelector("#privacyOverlay");
const closeTermsModalBtn = document.querySelector("#closeTermsModal");
const closePrivacyModalBtn = document.querySelector("#closePrivacyModal");

let authMode = "login"; // "login" | "signup"

const authTexts = {
  pt: {
    loginTitle: "Entre para acessar seu caderno de receitas",
    signupTitle: "Crie sua conta gratuita",
    loginTab: "Entrar",
    signupTab: "Criar conta",
    nameLabel: "Nome",
    emailLabel: "E-mail",
    passwordLabel: "Senha",
    confirmPasswordLabel: "Confirmar senha",
    loginSubmit: "Entrar",
    signupSubmit: "Criar conta",
    divider: "ou",
    google: "Continuar com Google",
    rules: { length: "Pelo menos 8 caracteres", upper: "Uma letra maiúscula", number: "Um número", symbol: "Um símbolo (!@#$...)" },
    errors: {
      "auth/invalid-email": "E-mail inválido.",
      "auth/user-not-found": "Usuário não encontrado.",
      "auth/wrong-password": "Senha incorreta.",
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/email-already-in-use": "Esse e-mail já está em uso.",
      "auth/weak-password": "A senha precisa ter ao menos 6 caracteres.",
      "weak-password-custom": "Sua senha precisa atender a todos os requisitos de segurança.",
      "terms-required": "Você precisa aceitar os Termos de Uso e a Política de Privacidade.",
      "passwords-dont-match": "As senhas não coincidem.",
      default: "Ocorreu um erro. Tente novamente.",
    },
  },
  en: {
    loginTitle: "Sign in to access your recipe notebook",
    signupTitle: "Create your free account",
    loginTab: "Sign in",
    signupTab: "Sign up",
    nameLabel: "Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm password",
    loginSubmit: "Sign in",
    signupSubmit: "Sign up",
    divider: "or",
    google: "Continue with Google",
    rules: { length: "At least 8 characters", upper: "One uppercase letter", number: "One number", symbol: "One symbol (!@#$...)" },
    errors: {
      "auth/invalid-email": "Invalid email.",
      "auth/user-not-found": "User not found.",
      "auth/wrong-password": "Wrong password.",
      "auth/invalid-credential": "Incorrect email or password.",
      "auth/email-already-in-use": "This email is already in use.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "weak-password-custom": "Your password needs to meet all security requirements.",
      "terms-required": "You need to accept the Terms of Use and Privacy Policy.",
      "passwords-dont-match": "Passwords don't match.",
      default: "Something went wrong. Please try again.",
    },
  },
};

function applyAuthTranslations() {
  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
  const tx = authTexts[langKey];
  document.querySelector("#authSubtitle").textContent = authMode === "login" ? tx.loginTitle : tx.signupTitle;
  authTabLogin.textContent = tx.loginTab;
  authTabSignup.textContent = tx.signupTab;
  document.querySelector("#authNameLabel").textContent = tx.nameLabel;
  document.querySelector("#authEmailLabel").textContent = tx.emailLabel;
  document.querySelector("#authPasswordLabel").textContent = tx.passwordLabel;
  document.querySelector("#authConfirmPasswordLabel").textContent = tx.confirmPasswordLabel;
  authSubmitBtn.textContent = authMode === "login" ? tx.loginSubmit : tx.signupSubmit;
  document.querySelector("#authDividerText").textContent = tx.divider;
  document.querySelector("#googleSignInText").textContent = tx.google;

  document.querySelectorAll("#strengthRules li, #newStrengthRules li").forEach((li) => {
    const rule = li.dataset.rule;
    li.textContent = tx.rules[rule];
  });

  const termsLabel = document.querySelector("#authTermsLabel");
  if (termsLabel) {
    termsLabel.innerHTML = langKey === "pt"
      ? `Li e aceito os <a href="#" id="openTermsLink">Termos de Uso</a> e a <a href="#" id="openPrivacyLink">Política de Privacidade</a>`
      : `I have read and accept the <a href="#" id="openTermsLink">Terms of Use</a> and the <a href="#" id="openPrivacyLink">Privacy Policy</a>`;
  }

  document.querySelector("#termsTitle").textContent = langKey === "pt" ? "Termos de Uso" : "Terms of Use";
  document.querySelector("#privacyTitle").textContent = langKey === "pt" ? "Política de Privacidade" : "Privacy Policy";
}

function setAuthMode(mode) {
  authMode = mode;
  authTabLogin.classList.toggle("active", mode === "login");
  authTabSignup.classList.toggle("active", mode === "signup");
  authPassword.autocomplete = mode === "login" ? "current-password" : "new-password";
  authNameField.hidden = mode !== "signup";
  authName.required = mode === "signup";
  passwordStrength.hidden = mode !== "signup";
  authTermsField.hidden = mode !== "signup";
  authTermsCheckbox.required = mode === "signup";
  document.querySelector("#authConfirmPasswordField").hidden = mode !== "signup";
  document.querySelector("#authConfirmPassword").required = mode === "signup";
  authError.hidden = true;
  applyAuthTranslations();
}

function togglePasswordVisibility(inputEl, toggleBtn) {
  const isPassword = inputEl.type === "password";
  inputEl.type = isPassword ? "text" : "password";
  toggleBtn.querySelector(".eye-icon").hidden = isPassword;
  toggleBtn.querySelector(".eye-off-icon").hidden = !isPassword;
}

document.querySelector("#toggleAuthPassword").addEventListener("click", () => {
  togglePasswordVisibility(document.querySelector("#authPassword"), document.querySelector("#toggleAuthPassword"));
});

document.querySelector("#toggleAuthConfirmPassword").addEventListener("click", () => {
  togglePasswordVisibility(document.querySelector("#authConfirmPassword"), document.querySelector("#toggleAuthConfirmPassword"));
});

function checkPasswordStrength(password) {
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
  const metCount = Object.values(rules).filter(Boolean).length;
  return { rules, metCount };
}

function updatePasswordStrengthUI(password, rulesListEl, barsContainerEl) {
  const { rules, metCount } = checkPasswordStrength(password);
  rulesListEl.querySelectorAll("li").forEach((li) => {
    const rule = li.dataset.rule;
    li.classList.toggle("met", rules[rule]);
  });
  const bars = barsContainerEl.querySelectorAll(".strength-bar");
  let strengthClass = "";
  if (metCount <= 1) strengthClass = "active-weak";
  else if (metCount <= 3) strengthClass = "active-medium";
  else strengthClass = "active-strong";

  bars.forEach((bar, index) => {
    bar.classList.remove("active-weak", "active-medium", "active-strong");
    if (index < metCount) bar.classList.add(strengthClass);
  });
  return metCount === 4;
}

authPassword.addEventListener("input", () => {
  if (authMode === "signup") {
    updatePasswordStrengthUI(authPassword.value, document.querySelector("#strengthRules"), document.querySelector("#passwordStrength"));
  }
});

// Delegação de eventos: funciona mesmo quando innerHTML recria os links
authTermsField.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  event.preventDefault();
  if (link.id === "openTermsLink") termsOverlay.hidden = false;
  if (link.id === "openPrivacyLink") privacyOverlay.hidden = false;
});

closeTermsModalBtn.addEventListener("click", () => { termsOverlay.hidden = true; });
closePrivacyModalBtn.addEventListener("click", () => { privacyOverlay.hidden = true; });

[termsOverlay, privacyOverlay].forEach((overlay) => {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) overlay.hidden = true;
  });
});

function showAuthError(code) {
  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
  const tx = authTexts[langKey];
  authError.textContent = tx.errors[code] || tx.errors.default;
  authError.hidden = false;
}

function showApp(user) {
  hideSplashWithMinimumDelay();
  authScreen.hidden = true;
  appShell.hidden = false;
  userEmailEl.textContent = user.email || "";

  const savedProfile = JSON.parse(localStorage.getItem(settingsStorageKey(user.uid)) || "{}");
  const displayName = user.displayName || savedProfile.name || "";
  const photoUrl = savedProfile.photoUrl || user.photoURL || "";

  updateSidebarAvatar(displayName || user.email, photoUrl);
  updateSidebarGreeting(displayName);

  if (currentUserId !== user.uid) {
    currentUserId = user.uid;
    dataLoaded = false;
    loadUserDataFromFirestore(user.uid);
  }
}

function showAuthScreen() {
  hideSplashWithMinimumDelay();
  appShell.hidden = true;
  authScreen.hidden = false;
  currentUserId = null;
  dataLoaded = false;
  recipes = [];
  shoppingItems = [];
}

const splashStartTime = Date.now();
const SPLASH_MIN_DISPLAY_MS = 2600;

function hideSplashWithMinimumDelay() {
  const splashScreen = document.querySelector("#splashScreen");
  if (!splashScreen || splashScreen.classList.contains("hidden")) return;
  const elapsed = Date.now() - splashStartTime;
  const remaining = Math.max(0, SPLASH_MIN_DISPLAY_MS - elapsed);
  setTimeout(() => splashScreen.classList.add("hidden"), remaining);
}

authTabLogin.addEventListener("click", () => setAuthMode("login"));
authTabSignup.addEventListener("click", () => setAuthMode("signup"));

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authError.hidden = true;

  if (authMode === "signup") {
    const { metCount } = checkPasswordStrength(authPassword.value);
    if (metCount < 4) {
      showAuthError("weak-password-custom");
      return;
    }
    const confirmPassword = document.querySelector("#authConfirmPassword").value;
    if (authPassword.value !== confirmPassword) {
      showAuthError("passwords-dont-match");
      return;
    }
    if (!authTermsCheckbox.checked) {
      showAuthError("terms-required");
      return;
    }
  }

  authSubmitBtn.disabled = true;
  try {
    if (authMode === "login") {
      await window.firebaseAuth.signIn(authEmail.value.trim(), authPassword.value);
    } else {
      const credential = await window.firebaseAuth.signUp(authEmail.value.trim(), authPassword.value);
      await window.firebaseAuth.updateDisplayName(authName.value.trim());
    }
  } catch (error) {
    showAuthError(error.code);
  } finally {
    authSubmitBtn.disabled = false;
  }
});

googleSignInBtn.addEventListener("click", async () => {
  authError.hidden = true;
  try {
    await window.firebaseAuth.signInWithGoogle();
  } catch (error) {
    showAuthError(error.code);
  }
});

logoutBtn.addEventListener("click", async () => {
  await window.firebaseAuth.signOut();
});

function initAuthListener() {
  window.firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      showApp(user);
    } else {
      showAuthScreen();
    }
  });
}

if (window.firebaseAuth) {
  initAuthListener();
} else {
  window.addEventListener("firebase-ready", initAuthListener, { once: true });
}

applyAuthTranslations();

// Auth page language toggle
function setAuthLang(newLang) {
  lang = newLang;
  localStorage.setItem("mealPlanner.lang", lang);
  document.querySelector("#authLangPT").classList.toggle("active", lang === "pt");
  document.querySelector("#authLangEN").classList.toggle("active", lang === "en");
  applyAuthTranslations();
}

document.querySelector("#authLangPT").addEventListener("click", () => setAuthLang("pt"));
document.querySelector("#authLangEN").addEventListener("click", () => setAuthLang("en"));

// Set initial state of auth lang buttons
document.querySelector("#authLangPT").classList.toggle("active", lang === "pt");
document.querySelector("#authLangEN").classList.toggle("active", lang === "en");

const translations = {
  pt: {
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
      all: "Todas", breakfast: "Café da manhã", lunch: "Almoço",
      dinner: "Jantar", dessert: "Sobremesas", snack: "Lanches",
    },
    typeFilters: {
      all: "Todos", seafood: "Frutos do mar", meat: "Carne",
      chicken: "Frango", pasta: "Massa", soup: "Sopa", other: "Outro",
    },
    formLabels: {
      photo: "Foto da receita", addPhoto: "Adicionar foto", removePhoto: "Remover foto",
      name: "Nome da receita", category: "Refeição", type: "Tipo", time: "Tempo",
      difficulty: "Dificuldade", ingredients: "Ingredientes", steps: "Preparo",
      reset: "Novo", save: "Salvar receita",
    },
    categories: {
      breakfast: "Café da manhã", lunch: "Almoço", dinner: "Jantar",
      dessert: "Sobremesas", snack: "Lanches",
    },
    types: {
      seafood: "Frutos do mar", meat: "Carne", chicken: "Frango",
      pasta: "Massa", soup: "Sopa", other: "Outro",
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
    newRecipe: "Nova receita",
    modalTitle: "Nova receita",
    modalEditTitle: "Editar receita",
  },
  en: {
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
      all: "All", breakfast: "Breakfast", lunch: "Lunch",
      dinner: "Dinner", dessert: "Desserts", snack: "Snacks",
    },
    typeFilters: {
      all: "All", seafood: "Seafood", meat: "Meat",
      chicken: "Chicken", pasta: "Pasta", soup: "Soup", other: "Other",
    },
    formLabels: {
      photo: "Recipe photo", addPhoto: "Add photo", removePhoto: "Remove photo",
      name: "Recipe name", category: "Meal", type: "Type", time: "Time",
      difficulty: "Difficulty", ingredients: "Ingredients", steps: "Instructions",
      reset: "New", save: "Save recipe",
    },
    categories: {
      breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner",
      dessert: "Desserts", snack: "Snacks",
    },
    types: {
      seafood: "Seafood", meat: "Meat", chicken: "Chicken",
      pasta: "Pasta", soup: "Soup", other: "Other",
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
    newRecipe: "New recipe",
    modalTitle: "New recipe",
    modalEditTitle: "Edit recipe",
  },
};

const categories = ["breakfast", "lunch", "dinner", "dessert", "snack"];
const recipeTypes = ["seafood", "meat", "chicken", "pasta", "soup", "other"];

let activeView = "recipes";
let activeCategoryFilter = "all";
let activeTypeFilter = "all";
let searchTerm = "";

const t = () => translations[lang];

function createId() {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function svgPhoto(title, bg, accent, symbol) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
    <rect width="800" height="520" fill="${bg}"/>
    <path d="M0 410c160-90 295-35 418-112 101-64 174-145 382-96v318H0z" fill="${accent}" opacity=".22"/>
    <g fill="none" stroke="#243226" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity=".78">
      <path d="M182 180c70-48 145-48 226 0 76 45 145 42 210-10"/>
      <path d="M204 284c78-54 164-51 254 8 65 42 124 40 178-6"/>
    </g>
    <text x="72" y="126" fill="#243226" font-family="Georgia,serif" font-size="58" font-weight="700">${symbol}</text>
    <text x="72" y="430" fill="#243226" font-family="Georgia,serif" font-size="48" font-weight="700">${title}</text>
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

let recipes = [];
let shoppingItems = [];
let currentUserId = null;
let dataLoaded = false;
let saveDebounceTimer = null;

// DOM refs
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
const shoppingDashboardForm = document.querySelector("#shoppingDashboardForm");
const shoppingDashboardInput = document.querySelector("#shoppingDashboardInput");
const shoppingDashboardList = document.querySelector("#shoppingDashboardList");
const shoppingDashboardEmpty = document.querySelector("#shoppingDashboardEmpty");
const shoppingCount = document.querySelector("#shoppingCount");
const recipesView = document.querySelector("#recipesView");
const shoppingView = document.querySelector("#shoppingView");
const modalOverlay = document.querySelector("#modalOverlay");
const openModalBtn = document.querySelector("#openModal");
const closeModalBtn = document.querySelector("#closeModal");
const modalTitle = document.querySelector("#modalTitle");

async function loadUserDataFromFirestore(uid) {
  try {
    const data = await window.firebaseData.loadUserData(uid);
    if (data) {
      recipes = (data.recipes || []).map(normalizeRecipe);
      shoppingItems = (data.shoppingItems || []).map((item) => ({
        id: item.id || createId(),
        name: item.name || String(item),
        done: Boolean(item.done),
      }));
    } else {
      recipes = [];
      shoppingItems = [];
    }
  } catch (error) {
    console.error("Erro ao carregar dados do Firestore:", error);
    recipes = [];
    shoppingItems = [];
  }
  dataLoaded = true;
  render();
}

function save() {
  if (!currentUserId || !dataLoaded) return;
  clearTimeout(saveDebounceTimer);
  saveDebounceTimer = setTimeout(async () => {
    try {
      await window.firebaseData.saveUserData(currentUserId, { recipes, shoppingItems });
    } catch (error) {
      console.error("Erro ao salvar dados no Firestore:", error);
      const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
      showToast(langKey === "pt" ? "Erro ao salvar. Verifique sua conexão." : "Error saving. Check your connection.", "error");
    }
  }, 500);
}

function normalize(value) { return value.trim().toLowerCase(); }

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

function openModal(editMode = false) {
  modalTitle.textContent = editMode ? t().modalEditTitle : t().modalTitle;
  modalOverlay.hidden = false;
  document.body.style.overflow = "hidden";
  recipeName.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = "";
  recipeForm.reset();
  recipeId.value = "";
  setPhotoPreview("");
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
  const showFavorites = activeView === "favorites";
  recipesView.hidden = showShopping;
  shoppingView.hidden = !showShopping;

  // Esconde elementos desnecessários nas views de compras e favoritas
  document.querySelector(".topbar").hidden = showShopping;
  document.querySelector(".stats-row").hidden = showShopping || showFavorites;

  document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === activeView);
  });
}

function renderRecipes() {
  const tx = t();
  const loadingState = document.querySelector("#loadingState");
  if (!dataLoaded) {
    recipeGrid.replaceChildren();
    emptyState.style.display = "none";
    if (loadingState) loadingState.hidden = false;
    resultCount.textContent = "";
    return;
  }
  if (loadingState) loadingState.hidden = true;
  const visibleRecipes = getVisibleRecipes();
  recipeGrid.replaceChildren();
  emptyState.style.display = visibleRecipes.length ? "none" : "flex";
  document.querySelector("#emptyStateText").textContent = tx.emptyState;
  const loadingStateText = document.querySelector("#loadingStateText");
  if (loadingStateText) {
    loadingStateText.textContent = lang === "pt" ? "Carregando suas receitas..." : "Loading your recipes...";
  }
  resultCount.textContent = tx.resultCount(visibleRecipes.length);

  visibleRecipes.forEach((recipe) => {
    const card = recipeTemplate.content.firstElementChild.cloneNode(true);
    const categoryPill = card.querySelector(".category-pill");
    const typePill = card.querySelector(".type-pill");
    const favorite = card.querySelector(".favorite-button");
    const image = card.querySelector("img:not(.food-circle-img)");
    const foodCircleImg = card.querySelector(".food-circle-img");

    image.src = recipe.photo || placeholderPhotos[recipe.category];
    image.alt = recipe.name;
    foodCircleImg.src = recipe.photo || placeholderPhotos[recipe.category];
    foodCircleImg.alt = recipe.name;

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
  renderShoppingList(shoppingDashboardList, shoppingDashboardEmpty);
  shoppingCount.textContent = t().shoppingCount(shoppingItems.filter((item) => !item.done).length);
}

// ── SHOPPING CATEGORIES ──────────────────────────
const shoppingCategories = {
  pt: {
    meat:    { label: "🥩 Carnes e frios", keywords: ["frango", "carne", "bife", "peixe", "atum", "salmão", "camarão", "presunto", "bacon", "linguiça", "salsicha", "peru", "cordeiro", "porco", "costela", "file", "filé", "patinho", "picanha"] },
    dairy:   { label: "🥛 Laticínios", keywords: ["leite", "queijo", "manteiga", "iogurte", "creme", "nata", "requeijão", "mussarela", "parmesão", "ricota", "cream cheese"] },
    produce: { label: "🥦 Hortifruti", keywords: ["cenoura", "batata", "cebola", "alho", "tomate", "alface", "rúcula", "espinafre", "brócolis", "abobrinha", "pepino", "pimentão", "milho", "beterraba", "couve", "inhame", "limão", "laranja", "maçã", "banana", "morango", "uva", "abacate", "manga", "abacaxi", "salsa", "salsinha", "coentro", "cebolinha", "manjericão", "hortelã"] },
    grains:  { label: "🌾 Mercearia", keywords: ["arroz", "massa", "macarrão", "farinha", "feijão", "lentilha", "grão", "aveia", "quinoa", "cuscuz", "chia", "granola", "fubá", "tapioca", "amido", "fermento", "açúcar", "sal", "chocolate", "cacau"] },
    oils:    { label: "🧴 Óleos e temperos", keywords: ["azeite", "óleo", "vinagre", "molho", "shoyu", "catchup", "mostarda", "maionese", "pimenta", "canela", "orégano", "cúrcuma", "colorau", "cominho", "noz-moscada", "louro", "ervas"] },
    bakery:  { label: "🍞 Padaria", keywords: ["pão", "torrada", "bisnaguinha", "bolo", "biscoito", "bolacha", "waffle"] },
    canned:  { label: "🥫 Conservas e enlatados", keywords: ["lata", "enlatado", "extrato", "polpa", "aveado", "sardinha", "atum em lata", "ervilha", "milho em lata", "palmito"] },
    drinks:  { label: "🧃 Bebidas", keywords: ["água", "suco", "refrigerante", "cerveja", "vinho", "café", "chá", "achocolatado"] },
    frozen:  { label: "🧊 Congelados", keywords: ["congelado", "sorvete", "nugget", "hambúrguer congelado"] },
    hygiene: { label: "🧹 Limpeza e higiene", keywords: ["sabão", "detergente", "desinfetante", "esponja", "papel", "shampoo", "xampu", "condicionador", "sabonete", "creme dental", "pasta de dente", "escova", "desodorante", "papel higiênico", "toalha", "alvejante", "água sanitária", "limpa", "limpeza", "saco de lixo", "lava", "coador"] },
    other:   { label: "🛒 Outros", keywords: [] },
  },
  en: {
    meat:    { label: "🥩 Meat & deli", keywords: ["chicken", "beef", "steak", "fish", "tuna", "salmon", "shrimp", "ham", "bacon", "sausage", "turkey", "lamb", "pork", "meat", "fillet", "ribs", "ground"] },
    dairy:   { label: "🥛 Dairy", keywords: ["milk", "cheese", "butter", "yogurt", "cream", "sour cream", "mozzarella", "parmesan", "ricotta", "cream cheese", "whey"] },
    produce: { label: "🥦 Produce", keywords: ["carrot", "potato", "onion", "garlic", "tomato", "lettuce", "spinach", "broccoli", "zucchini", "cucumber", "pepper", "corn", "beet", "lemon", "orange", "apple", "banana", "strawberry", "grape", "avocado", "mango", "pineapple", "parsley", "cilantro", "basil", "mint", "ginger", "mushroom", "celery", "cabbage", "cauliflower"] },
    grains:  { label: "🌾 Pantry", keywords: ["rice", "pasta", "flour", "beans", "lentils", "oats", "quinoa", "sugar", "salt", "chocolate", "cocoa", "baking powder", "yeast", "bread crumbs", "cornmeal", "tapioca", "chia", "granola"] },
    oils:    { label: "🧴 Oils & condiments", keywords: ["olive oil", "oil", "vinegar", "sauce", "soy sauce", "ketchup", "mustard", "mayonnaise", "pepper", "cinnamon", "oregano", "spice", "seasoning", "dressing", "broth", "stock"] },
    bakery:  { label: "🍞 Bakery", keywords: ["bread", "toast", "cake", "cookie", "cracker", "waffle", "muffin", "bagel", "bun", "roll"] },
    canned:  { label: "🥫 Canned goods", keywords: ["canned", "sardine", "tuna can", "peas", "corn can", "tomato paste", "coconut milk", "palm heart"] },
    drinks:  { label: "🧃 Drinks", keywords: ["water", "juice", "soda", "beer", "wine", "coffee", "tea", "milk tea", "energy drink", "smoothie"] },
    frozen:  { label: "🧊 Frozen", keywords: ["frozen", "ice cream", "nugget", "burger", "pizza frozen"] },
    hygiene: { label: "🧹 Cleaning & hygiene", keywords: ["soap", "detergent", "disinfectant", "sponge", "paper", "shampoo", "conditioner", "toothpaste", "toothbrush", "deodorant", "toilet paper", "tissue", "towel", "bleach", "cleaning", "trash bag", "dish", "laundry"] },
    other:   { label: "🛒 Other", keywords: [] },
  },
};

function categorizeShoppingItem(name) {
  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
  const categories = shoppingCategories[langKey] || shoppingCategories.pt;
  const normalized = name.toLowerCase().trim();

  for (const [key, cat] of Object.entries(categories)) {
    if (key === "other") continue;
    if (cat.keywords.some((kw) => {
      const re = new RegExp(`(^|\\s|,)${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|,|$)`, "i");
      return re.test(normalized);
    })) return key;
  }
  return "other";
}

function renderShoppingList(list, emptyElement) {
  list.replaceChildren();
  emptyElement.style.display = shoppingItems.length ? "none" : "block";
  if (!shoppingItems.length) return;

  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
  const categories = shoppingCategories[langKey] || shoppingCategories.pt;

  // Group items by category
  const grouped = {};
  shoppingItems.forEach((item) => {
    const cat = categorizeShoppingItem(item.name);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  // Render in category order
  const categoryOrder = Object.keys(categories);
  categoryOrder.forEach((catKey) => {
    const items = grouped[catKey];
    if (!items || items.length === 0) return;

    // Category header
    const header = document.createElement("li");
    header.className = "shopping-category-header";
    header.textContent = categories[catKey].label;
    list.append(header);

    // Items in this category
    items.forEach((item) => {
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

      checkbox.addEventListener("change", () => { item.done = checkbox.checked; render(); });
      deleteButton.addEventListener("click", () => {
        shoppingItems = shoppingItems.filter((s) => s.id !== item.id);
        render();
      });

      row.append(checkbox, label, deleteButton);
      list.append(row);
    });
  });
}

function renderStats() {
  document.querySelector("#totalRecipes").textContent = recipes.length;
  document.querySelector("#totalFavorites").textContent = recipes.filter((r) => r.favorite).length;
  document.querySelector("#totalItems").textContent = shoppingItems.filter((i) => !i.done).length;
  document.querySelector("#navBadgeRecipes").textContent = recipes.length;
  document.querySelector("#navBadgeFavorites").textContent = recipes.filter((r) => r.favorite).length;
  document.querySelector("#navBadgeShopping").textContent = shoppingItems.filter((i) => !i.done).length;
}

function addIngredients(ingredients) {
  const existing = new Set(shoppingItems.map((item) => normalize(item.name)));
  let addedCount = 0;
  ingredients.forEach((ingredient) => {
    if (!existing.has(normalize(ingredient))) {
      existing.add(normalize(ingredient));
      shoppingItems.push({ id: createId(), name: ingredient, done: false });
      addedCount += 1;
    }
  });
  render();
  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
  showToast(langKey === "pt" ? "Ingredientes adicionados à lista!" : "Ingredients added to list!");
}

function addShoppingItem(name) {
  const value = name.trim();
  if (!value) return;
  const exists = shoppingItems.some((item) => normalize(item.name) === normalize(value));
  if (!exists) shoppingItems.push({ id: createId(), name: value, done: false });
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
  openModal(true);
}

function deleteRecipe(id) {
  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
  if (!confirm(langKey === "pt" ? "Excluir esta receita?" : "Delete this recipe?")) return;
  recipes = recipes.filter((recipe) => recipe.id !== id);
  render();
  showToast(langKey === "pt" ? "Receita excluída." : "Recipe deleted.");
}

function toggleFavorite(id) {
  recipes = recipes.map((recipe) => (recipe.id === id ? { ...recipe, favorite: !recipe.favorite } : recipe));
  render();
}

function applyTranslations() {
  const tx = t();
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  document.querySelector("#searchInput").placeholder = tx.searchPlaceholder;
  document.querySelector("#shoppingDashboardEmpty").textContent = tx.shoppingDashboardEmpty;
  document.querySelector("#shoppingDashboardInput").placeholder = tx.shoppingDashboardPlaceholder;
  document.querySelector("#statRecipesLabel").textContent = tx.stats.recipes;
  document.querySelector("#statFavoritesLabel").textContent = tx.stats.favorites;
  document.querySelector("#statItemsLabel").textContent = tx.stats.items;
  document.querySelector(".new-recipe-btn").lastChild.textContent = ` ${tx.newRecipe}`;
  document.querySelector("#recipesView .section-kicker").textContent = tx.sectionKicker;
  document.querySelector("#recipesView h2").textContent = tx.sectionTitle;
  document.querySelector("#shoppingView .section-kicker").textContent = tx.shoppingKicker;
  document.querySelector("#shoppingView h2").textContent = tx.shoppingTitle;

  const settingsI18n = {
    pt: {
      settingsTitle: "Configurações da conta",
      tabProfile: "Perfil", tabPassword: "Senha", tabPrivacy: "Privacidade",
      profileNameLabel: "Nome", profileBirthdayLabel: "Data de nascimento",
      profilePhoneLabel: "Telefone", dietaryLabel: "Preferências alimentares",
      profilePhotoLabel: "Alterar foto", removeProfilePhotoLabel: "Remover foto",
      profileSaveBtn: "Salvar alterações",
      currentPasswordLabel: "Senha atual", newPasswordLabel: "Nova senha",
      passwordSaveBtn: "Alterar senha",
      privacyIntro: "Você pode revisar nossa Política de Privacidade e Termos de Uso a qualquer momento.",
      openPrivacy: "Política de Privacidade", openTerms: "Termos de Uso",
      dangerZoneTitle: "Excluir conta",
      dangerZoneText: "Essa ação é permanente. Todos os seus dados de perfil serão removidos e você perderá acesso à sua conta.",
      deleteAccountBtn: "Excluir minha conta",
      deleteConfirmLabel: "Confirme sua senha para excluir a conta",
      cancelDelete: "Cancelar", confirmDelete: "Confirmar exclusão",
    },
    en: {
      settingsTitle: "Account settings",
      tabProfile: "Profile", tabPassword: "Password", tabPrivacy: "Privacy",
      profileNameLabel: "Name", profileBirthdayLabel: "Date of birth",
      profilePhoneLabel: "Phone", dietaryLabel: "Dietary preferences",
      profilePhotoLabel: "Change photo", removeProfilePhotoLabel: "Remove photo",
      profileSaveBtn: "Save changes",
      currentPasswordLabel: "Current password", newPasswordLabel: "New password",
      passwordSaveBtn: "Change password",
      privacyIntro: "You can review our Privacy Policy and Terms of Use at any time.",
      openPrivacy: "Privacy Policy", openTerms: "Terms of Use",
      dangerZoneTitle: "Delete account",
      dangerZoneText: "This action is permanent. All your profile data will be removed and you will lose access to your account.",
      deleteAccountBtn: "Delete my account",
      deleteConfirmLabel: "Confirm your password to delete the account",
      cancelDelete: "Cancel", confirmDelete: "Confirm deletion",
    },
  };
  const sx = settingsI18n[lang];
  document.querySelector("#settingsTitle").textContent = sx.settingsTitle;
  document.querySelector("#settingsTabProfile").textContent = sx.tabProfile;
  document.querySelector("#settingsTabPassword").textContent = sx.tabPassword;
  document.querySelector("#settingsTabPrivacy").textContent = sx.tabPrivacy;
  document.querySelector("#profileNameLabel").textContent = sx.profileNameLabel;
  document.querySelector("#profileBirthdayLabel").textContent = sx.profileBirthdayLabel;
  document.querySelector("#profilePhoneLabel").textContent = sx.profilePhoneLabel;
  document.querySelector("#dietaryLabel").textContent = sx.dietaryLabel;
  document.querySelector("#profilePhotoLabel").textContent = sx.profilePhotoLabel;
  document.querySelector("#removeProfilePhotoLabel").textContent = sx.removeProfilePhotoLabel;
  document.querySelector("#profileSaveBtn").textContent = sx.profileSaveBtn;
  document.querySelector("#currentPasswordLabel").textContent = sx.currentPasswordLabel;
  document.querySelector("#newPasswordLabel").textContent = sx.newPasswordLabel;
  document.querySelector("#passwordSaveBtn").textContent = sx.passwordSaveBtn;
  document.querySelector("#privacyIntro").textContent = sx.privacyIntro;
  document.querySelector("#settingsOpenPrivacy").textContent = sx.openPrivacy;
  document.querySelector("#settingsOpenTerms").textContent = sx.openTerms;
  document.querySelector("#dangerZoneTitle").textContent = sx.dangerZoneTitle;
  document.querySelector("#dangerZoneText").textContent = sx.dangerZoneText;
  document.querySelector("#deleteAccountBtn").textContent = sx.deleteAccountBtn;
  document.querySelector("#deleteConfirmPasswordLabel").textContent = sx.deleteConfirmLabel;
  document.querySelector("#cancelDeleteBtn").textContent = sx.cancelDelete;
  document.querySelector("#confirmDeleteBtn").textContent = sx.confirmDelete;

  const backupI18n = {
    pt: { title: "Backup dos dados", text: "Exporte suas receitas e lista de compras em um arquivo, ou importe um backup salvo anteriormente.", exportLabel: "Exportar receitas", importLabel: "Importar backup" },
    en: { title: "Data backup", text: "Export your recipes and shopping list to a file, or import a previously saved backup.", exportLabel: "Export recipes", importLabel: "Import backup" },
  };
  const bx = backupI18n[lang];
  document.querySelector("#backupTitle").textContent = bx.title;
  document.querySelector("#backupText").textContent = bx.text;
  document.querySelector("#exportDataLabel").textContent = bx.exportLabel;
  document.querySelector("#importDataLabel").textContent = bx.importLabel;
  document.querySelector("#shoppingDashboardForm .primary-button").textContent = tx.addButton;

  // Lang toggle visual
  document.querySelector("#langPT").classList.toggle("active", lang === "pt");
  document.querySelector("#langEN").classList.toggle("active", lang === "en");

  // Nav items
  document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
    btn.querySelector("span:not(.nav-badge)").textContent = tx.tabs[btn.dataset.view];
  });

  // Category filters in sidebar
  document.querySelectorAll(".nav-item[data-category-filter]").forEach((btn) => {
    btn.querySelector("span:not(.nav-badge)").textContent = tx.categoryFilters[btn.dataset.categoryFilter];
  });

  // Type pills in sidebar
  document.querySelectorAll(".type-pill-nav[data-type-filter]").forEach((btn) => {
    btn.textContent = tx.typeFilters[btn.dataset.typeFilter];
  });

  // Form labels
  const labels = document.querySelectorAll(".recipe-form label:not(.file-label)");
  if (labels[0]) labels[0].firstChild.textContent = tx.formLabels.name;
  if (labels[1]) labels[1].firstChild.textContent = tx.formLabels.category;
  if (labels[2]) labels[2].firstChild.textContent = tx.formLabels.type;
  if (labels[3]) labels[3].firstChild.textContent = tx.formLabels.time;
  if (labels[4]) labels[4].firstChild.textContent = tx.formLabels.difficulty;
  if (labels[5]) labels[5].firstChild.textContent = tx.formLabels.ingredients;
  if (labels[6]) labels[6].firstChild.textContent = tx.formLabels.steps;

  document.querySelector(".file-label").firstChild.textContent = tx.formLabels.addPhoto;
  document.querySelector("#removePhoto").textContent = tx.formLabels.removePhoto;
  document.querySelector("#resetForm").textContent = tx.formLabels.reset;
  document.querySelector(".recipe-form .primary-button").textContent = tx.formLabels.save;

  Array.from(recipeCategory.options).forEach((o) => { o.textContent = tx.categories[o.value]; });
  Array.from(recipeType.options).forEach((o) => { o.textContent = tx.types[o.value]; });
  Array.from(recipeDifficulty.options).forEach((o) => { o.textContent = tx.difficulties[o.value]; });

  document.querySelectorAll("[data-placeholder-pt]").forEach((el) => {
    el.placeholder = lang === "pt" ? el.dataset.placeholderPt : el.dataset.placeholderEn;
  });

  if (!recipePhotoData.value) setPhotoPreview("");

  const timerMinutesLabel = document.querySelector("#timerMinutesLabel");
  if (timerMinutesLabel) timerMinutesLabel.textContent = lang === "pt" ? "Minutos" : "Minutes";
  const timerModalTitle = document.querySelector("#timerModalTitle");
  if (timerModalTitle) timerModalTitle.textContent = lang === "pt" ? "Timer de preparo" : "Cooking timer";
  const timerSetBtnEl = document.querySelector("#timerSetBtn");
  if (timerSetBtnEl) timerSetBtnEl.textContent = lang === "pt" ? "Definir" : "Set";
  const timerStartBtnEl = document.querySelector("#timerStartBtn");
  if (timerStartBtnEl && !timerIsRunning) {
    timerStartBtnEl.textContent = lang === "pt" ? "Iniciar" : "Start";
  }
  const timerPauseBtnEl = document.querySelector("#timerPauseBtn");
  if (timerPauseBtnEl) timerPauseBtnEl.textContent = lang === "pt" ? "Pausar" : "Pause";
  const timerResetBtnEl = document.querySelector("#timerResetBtn");
  if (timerResetBtnEl) timerResetBtnEl.textContent = lang === "pt" ? "Resetar" : "Reset";

  render();
}

// Events
openModalBtn.addEventListener("click", () => openModal(false));
closeModalBtn.addEventListener("click", closeModal);

recipeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const ingredients = recipeIngredients.value.split("\n").map((i) => i.trim()).filter(Boolean);
  const existing = recipes.find((r) => r.id === recipeId.value);
  const wasEditing = Boolean(recipeId.value);
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
    ? recipes.map((r) => (r.id === recipeId.value ? data : r))
    : [data, ...recipes];

  closeModal();
  render();

  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
  const message = wasEditing
    ? (langKey === "pt" ? "Receita atualizada!" : "Recipe updated!")
    : (langKey === "pt" ? "Receita salva!" : "Recipe saved!");
  showToast(message);
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

removePhoto.addEventListener("click", () => { recipePhoto.value = ""; setPhotoPreview(""); });

searchInput.addEventListener("input", (e) => { searchTerm = normalize(e.target.value); renderRecipes(); });

document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => { activeView = btn.dataset.view; render(); });
});

document.querySelectorAll(".nav-item[data-category-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item[data-category-filter]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategoryFilter = btn.dataset.categoryFilter;
    renderRecipes();
  });
});

document.querySelectorAll(".type-pill-nav[data-type-filter]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".type-pill-nav").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeTypeFilter = btn.dataset.typeFilter;
    renderRecipes();
  });
});

shoppingDashboardForm.addEventListener("submit", (e) => { e.preventDefault(); addShoppingItem(shoppingDashboardInput.value); });

document.querySelector("#langToggle").addEventListener("click", () => {
  lang = lang === "pt" ? "en" : "pt";
  localStorage.setItem("mealPlanner.lang", lang);
  applyTranslations();
  applyAuthTranslations();
  const user = window.firebaseAuth?.auth?.currentUser;
  if (user) updateSidebarGreeting(user.displayName || "");
});

applyTranslations();

// ── TIMER ────────────────────────────────────────
const timerFab = document.querySelector("#timerFab");
const timerOverlay = document.querySelector("#timerOverlay");
const timerModal = document.querySelector("#timerModal");
const closeTimerModalBtn = document.querySelector("#closeTimerModal");
const timerDisplay = document.querySelector("#timerDisplay");
const timerMinutesInput = document.querySelector("#timerMinutesInput");
const timerSetBtn = document.querySelector("#timerSetBtn");
const timerStartBtn = document.querySelector("#timerStartBtn");
const timerPauseBtn = document.querySelector("#timerPauseBtn");
const timerResetBtn = document.querySelector("#timerResetBtn");
const timerStatus = document.querySelector("#timerStatus");
const timerPresetButtons = document.querySelectorAll(".chip-preset");

// (variáveis do timer movidas para o topo do arquivo)

const timerTexts = {
  pt: { ready: "Pronto para começar", running: "Em andamento...", paused: "Pausado", done: "Tempo esgotado!" },
  en: { ready: "Ready to start", running: "Running...", paused: "Paused", done: "Time's up!" },
};

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timerRemainingSeconds);
}

function setTimerStatus(key) {
  timerStatus.textContent = timerTexts[lang][key];
  timerStatus.classList.toggle("alarm-active", key === "done");
}

function playAlarmSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    [0, 0.35, 0.7].forEach((offset) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, now + offset);
      gainNode.gain.setValueAtTime(0.0001, now + offset);
      gainNode.gain.exponentialRampToValueAtTime(0.3, now + offset + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.3);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.32);
    });
  } catch (error) {
    console.warn("Não foi possível tocar o alarme:", error);
  }
}

function triggerAlarm() {
  timerAlarmActive = true;
  timerIsRunning = false;
  clearInterval(timerIntervalId);
  timerFab.classList.remove("running");
  timerFab.classList.add("alarm");
  timerModal.classList.add("alarm-active");
  timerDisplay.classList.add("alarm-active");
  setTimerStatus("done");
  playAlarmSound();
  const alarmInterval = setInterval(playAlarmSound, 1200);
  timerModal.dataset.alarmInterval = alarmInterval;

  timerStartBtn.disabled = true;
  timerPauseBtn.disabled = true;
}

function stopAlarm() {
  timerAlarmActive = false;
  timerFab.classList.remove("alarm");
  timerModal.classList.remove("alarm-active");
  timerDisplay.classList.remove("alarm-active");
  const alarmInterval = timerModal.dataset.alarmInterval;
  if (alarmInterval) clearInterval(Number(alarmInterval));
}

function startTimer() {
  if (timerIsRunning || timerAlarmActive) return;
  if (timerRemainingSeconds <= 0) return;
  timerIsRunning = true;
  timerFab.classList.add("running");
  setTimerStatus("running");
  timerStartBtn.disabled = true;
  timerPauseBtn.disabled = false;

  timerIntervalId = setInterval(() => {
    timerRemainingSeconds -= 1;
    updateTimerDisplay();
    if (timerRemainingSeconds <= 0) {
      triggerAlarm();
    }
  }, 1000);
}

function pauseTimer() {
  if (!timerIsRunning) return;
  timerIsRunning = false;
  clearInterval(timerIntervalId);
  timerFab.classList.remove("running");
  setTimerStatus("paused");
  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
}

function resetTimer() {
  timerIsRunning = false;
  clearInterval(timerIntervalId);
  stopAlarm();
  timerRemainingSeconds = timerTotalSeconds;
  updateTimerDisplay();
  setTimerStatus("ready");
  timerFab.classList.remove("running");
  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
}

function setTimerMinutes(minutes) {
  const safeMinutes = Math.max(0, Math.min(180, Number(minutes) || 0));
  timerMinutesInput.value = safeMinutes;
  timerTotalSeconds = safeMinutes * 60;
  resetTimer();
}

function openTimerModal() {
  timerOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeTimerModal() {
  timerOverlay.hidden = true;
  document.body.style.overflow = "";
}

timerFab.addEventListener("click", openTimerModal);
closeTimerModalBtn.addEventListener("click", closeTimerModal);

timerOverlay.addEventListener("click", (event) => {
  if (event.target === timerOverlay) closeTimerModal();
});

timerSetBtn.addEventListener("click", () => setTimerMinutes(timerMinutesInput.value));

timerPresetButtons.forEach((button) => {
  button.addEventListener("click", () => setTimerMinutes(button.dataset.minutes));
});

timerStartBtn.addEventListener("click", () => {
  if (timerAlarmActive) {
    stopAlarm();
    resetTimer();
    return;
  }
  startTimer();
});

timerPauseBtn.addEventListener("click", pauseTimer);
timerResetBtn.addEventListener("click", resetTimer);

setTimerStatus("ready");
updateTimerDisplay();

// ── SPLASH SCREEN ────────────────────────────────
// O splash agora é escondido pelo showApp()/showAuthScreen() quando o
// Firebase confirma o estado de autenticação (login ou deslogado).
// Mantemos um fallback de segurança caso o Firebase demore demais.
window.addEventListener("DOMContentLoaded", () => {
  const splashScreen = document.querySelector("#splashScreen");
  if (!splashScreen) return;
  setTimeout(() => {
    splashScreen.classList.add("hidden");
  }, 4000);
});

// ── ACCOUNT SETTINGS ─────────────────────────────
const openSettingsBtn = document.querySelector("#openSettingsBtn");
const settingsOverlay = document.querySelector("#settingsOverlay");
const closeSettingsModalBtn = document.querySelector("#closeSettingsModal");
const settingsTabProfile = document.querySelector("#settingsTabProfile");
const settingsTabPassword = document.querySelector("#settingsTabPassword");
const profileForm = document.querySelector("#profileForm");
const passwordForm = document.querySelector("#passwordForm");
const profileName = document.querySelector("#profileName");
const profileBirthday = document.querySelector("#profileBirthday");
const profilePhone = document.querySelector("#profilePhone");
const profileEmailDisplay = document.querySelector("#profileEmailDisplay");
const profileError = document.querySelector("#profileError");
const profileSuccess = document.querySelector("#profileSuccess");
const profilePhotoInput = document.querySelector("#profilePhotoInput");
const profilePhotoImg = document.querySelector("#profilePhotoImg");
const profilePhotoInitial = document.querySelector("#profilePhotoInitial");
const removeProfilePhoto = document.querySelector("#removeProfilePhoto");
const currentPasswordInput = document.querySelector("#currentPassword");
const newPasswordInput = document.querySelector("#newPassword");
const passwordError = document.querySelector("#passwordError");
const passwordSuccess = document.querySelector("#passwordSuccess");

let currentProfilePhotoDataUrl = null;

function updateProfilePhotoPreview(url, initial) {
  if (url) {
    profilePhotoImg.src = url;
    profilePhotoImg.hidden = false;
    profilePhotoInitial.hidden = true;
    removeProfilePhoto.hidden = false;
  } else {
    profilePhotoImg.hidden = true;
    profilePhotoInitial.hidden = false;
    profilePhotoInitial.textContent = initial || "U";
    removeProfilePhoto.hidden = true;
  }
}

function openSettingsModal() {
  const user = window.firebaseAuth.auth.currentUser;
  if (!user) return;
  profileName.value = user.displayName || "";
  profileEmailDisplay.textContent = user.email || "";
  const savedProfile = JSON.parse(localStorage.getItem(settingsStorageKey(user.uid)) || "{}");
  profileBirthday.value = savedProfile.birthday || "";
  profilePhone.value = savedProfile.phone || "";

  const dietaryPrefs = savedProfile.dietary || [];
  ["Vegetarian", "Vegan", "GlutenFree", "LactoseFree", "LowCarb", "Halal"].forEach((pref) => {
    const el = document.querySelector(`#diet${pref}`);
    if (el) el.checked = dietaryPrefs.includes(el.value);
  });

  currentProfilePhotoDataUrl = savedProfile.photoUrl || user.photoURL || null;
  const initial = (user.displayName || user.email || "U").charAt(0).toUpperCase();
  updateProfilePhotoPreview(currentProfilePhotoDataUrl, initial);

  profileError.hidden = true;
  profileSuccess.hidden = true;
  passwordError.hidden = true;
  passwordSuccess.hidden = true;
  passwordForm.reset();
  document.querySelector("#deleteAccountForm").hidden = true;
  document.querySelector("#deleteAccountBtn").hidden = false;
  document.querySelector("#deleteAccountError").hidden = true;
  document.querySelector("#deleteAccountForm").reset();
  settingsOverlay.hidden = false;
}

function closeSettingsModal() {
  settingsOverlay.hidden = true;
}

openSettingsBtn.addEventListener("click", openSettingsModal);
closeSettingsModalBtn.addEventListener("click", closeSettingsModal);
settingsOverlay.addEventListener("click", (event) => {
  if (event.target === settingsOverlay) closeSettingsModal();
});

// Profile photo upload
profilePhotoInput.addEventListener("change", () => {
  const file = profilePhotoInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    currentProfilePhotoDataUrl = String(reader.result);
    updateProfilePhotoPreview(currentProfilePhotoDataUrl, profileName.value.charAt(0).toUpperCase());
  });
  reader.readAsDataURL(file);
});

removeProfilePhoto.addEventListener("click", () => {
  currentProfilePhotoDataUrl = null;
  profilePhotoInput.value = "";
  const initial = (profileName.value || "U").charAt(0).toUpperCase();
  updateProfilePhotoPreview(null, initial);
});

document.querySelectorAll(".settings-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".settings-tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.dataset.settingsTab;
    document.querySelectorAll(".settings-form").forEach((form) => {
      form.hidden = form.dataset.settingsPanel !== target;
    });
  });
});

profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  profileError.hidden = true;
  profileSuccess.hidden = true;
  const user = window.firebaseAuth.auth.currentUser;
  if (!user) return;

  const dietary = ["Vegetarian", "Vegan", "GlutenFree", "LactoseFree", "LowCarb", "Halal"]
    .map((pref) => document.querySelector(`#diet${pref}`))
    .filter((el) => el && el.checked)
    .map((el) => el.value);

  try {
    await window.firebaseAuth.updateDisplayName(profileName.value.trim());
    const profileData = {
      birthday: profileBirthday.value,
      phone: profilePhone.value.trim(),
      dietary,
      photoUrl: currentProfilePhotoDataUrl || "",
    };
    localStorage.setItem(settingsStorageKey(user.uid), JSON.stringify(profileData));

    const displayName = profileName.value.trim();
    userEmailEl.textContent = user.email || "";
    updateSidebarAvatar(displayName || user.email, currentProfilePhotoDataUrl || "");
    updateSidebarGreeting(displayName);

    const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
    profileSuccess.textContent = langKey === "pt" ? "Perfil atualizado com sucesso!" : "Profile updated successfully!";
    profileSuccess.hidden = false;
    showToast(langKey === "pt" ? "Perfil atualizado!" : "Profile updated!");
  } catch (error) {
    const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
    profileError.textContent = langKey === "pt" ? "Não foi possível salvar. Tente novamente." : "Could not save. Please try again.";
    profileError.hidden = false;
  }
});

newPasswordInput.addEventListener("input", () => {
  updatePasswordStrengthUI(newPasswordInput.value, document.querySelector("#newStrengthRules"), document.querySelector("#newPasswordStrength"));
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  passwordError.hidden = true;
  passwordSuccess.hidden = true;
  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";

  const { metCount } = checkPasswordStrength(newPasswordInput.value);
  if (metCount < 4) {
    passwordError.textContent = langKey === "pt"
      ? "A nova senha precisa atender a todos os requisitos de segurança."
      : "The new password needs to meet all security requirements.";
    passwordError.hidden = false;
    return;
  }

  try {
    await window.firebaseAuth.reauthenticate(currentPasswordInput.value);
    await window.firebaseAuth.updateUserPassword(newPasswordInput.value);
    passwordSuccess.textContent = langKey === "pt" ? "Senha alterada com sucesso!" : "Password changed successfully!";
    passwordSuccess.hidden = false;
    passwordForm.reset();
  } catch (error) {
    passwordError.textContent = langKey === "pt" ? "Senha atual incorreta." : "Current password is incorrect.";
    passwordError.hidden = false;
  }
});

// ── PRIVACY TAB / ACCOUNT DELETION ───────────────
const settingsOpenPrivacyBtn = document.querySelector("#settingsOpenPrivacy");
const settingsOpenTermsBtn = document.querySelector("#settingsOpenTerms");
const deleteAccountBtn = document.querySelector("#deleteAccountBtn");
const deleteAccountForm = document.querySelector("#deleteAccountForm");
const cancelDeleteBtn = document.querySelector("#cancelDeleteBtn");
const deleteConfirmPassword = document.querySelector("#deleteConfirmPassword");
const deleteAccountError = document.querySelector("#deleteAccountError");

settingsOpenPrivacyBtn.addEventListener("click", () => {
  privacyOverlay.hidden = false;
});

settingsOpenTermsBtn.addEventListener("click", () => {
  termsOverlay.hidden = false;
});

deleteAccountBtn.addEventListener("click", () => {
  deleteAccountForm.hidden = false;
  deleteAccountBtn.hidden = true;
  deleteConfirmPassword.focus();
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteAccountForm.hidden = true;
  deleteAccountBtn.hidden = false;
  deleteAccountForm.reset();
  deleteAccountError.hidden = true;
});

deleteAccountForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  deleteAccountError.hidden = true;
  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
  const confirmMessage = langKey === "pt"
    ? "Tem certeza? Essa ação não pode ser desfeita."
    : "Are you sure? This action cannot be undone.";
  if (!confirm(confirmMessage)) return;

  try {
    const user = window.firebaseAuth.auth.currentUser;
    await window.firebaseAuth.reauthenticate(deleteConfirmPassword.value);
    if (user) {
      localStorage.removeItem(settingsStorageKey(user.uid));
      await window.firebaseData.deleteUserData(user.uid);
    }
    await window.firebaseAuth.deleteAccount();
    closeSettingsModal();
  } catch (error) {
    deleteAccountError.textContent = langKey === "pt"
      ? "Senha incorreta. Não foi possível excluir a conta."
      : "Incorrect password. Could not delete account.";
    deleteAccountError.hidden = false;
  }
});

// ── MOBILE SIDEBAR TOGGLE ────────────────────────
const mobileSidebarToggle = document.querySelector("#mobileSidebarToggle");
const sidebarEl = document.querySelector("#sidebar");

if (mobileSidebarToggle && sidebarEl) {
  mobileSidebarToggle.addEventListener("click", () => {
    sidebarEl.classList.toggle("expanded");
  });

  document.querySelectorAll(".nav-item[data-view], .nav-item[data-category-filter], .type-pill-nav").forEach((el) => {
    el.addEventListener("click", () => {
      if (window.innerWidth <= 768) sidebarEl.classList.remove("expanded");
    });
  });
}

// ── EXPORT / IMPORT BACKUP ────────────────────────
const exportDataBtn = document.querySelector("#exportDataBtn");
const importDataInput = document.querySelector("#importDataInput");
const importError = document.querySelector("#importError");
const importSuccess = document.querySelector("#importSuccess");

exportDataBtn.addEventListener("click", () => {
  const backup = {
    exportedAt: new Date().toISOString(),
    app: "Plately",
    recipes,
    shoppingItems,
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const dateStamp = new Date().toISOString().slice(0, 10);
  link.download = `plately-backup-${dateStamp}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";
  showToast(langKey === "pt" ? "Backup exportado!" : "Backup exported!");
});

importDataInput.addEventListener("change", async () => {
  const file = importDataInput.files?.[0];
  if (!file) return;
  importError.hidden = true;
  importSuccess.hidden = true;
  const langKey = localStorage.getItem("mealPlanner.lang") || "pt";

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed.recipes)) throw new Error("invalid-format");

    const confirmMessage = langKey === "pt"
      ? "Importar vai substituir suas receitas e lista de compras atuais. Continuar?"
      : "Importing will replace your current recipes and shopping list. Continue?";
    if (!confirm(confirmMessage)) {
      importDataInput.value = "";
      return;
    }

    recipes = parsed.recipes.map(normalizeRecipe);
    shoppingItems = (parsed.shoppingItems || []).map((item) => ({
      id: item.id || createId(),
      name: item.name || String(item),
      done: Boolean(item.done),
    }));
    render();
    importSuccess.textContent = langKey === "pt" ? "Backup importado com sucesso!" : "Backup imported successfully!";
    importSuccess.hidden = false;
    showToast(langKey === "pt" ? "Backup importado!" : "Backup imported!");
  } catch (error) {
    importError.textContent = langKey === "pt"
      ? "Arquivo inválido. Verifique se é um backup do Plately."
      : "Invalid file. Make sure it's a Plately backup.";
    importError.hidden = false;
  } finally {
    importDataInput.value = "";
  }
});
