# 🍽 Plately

> Planeje. Prepare. Aproveite.

🔗 **[Acesse o projeto ao vivo](https://mariwlima.github.io/plately/)**

---

## 📌 Sobre o projeto

O **Plately** é um caderno de receitas moderno que roda direto no navegador. Permite criar uma conta, salvar receitas com fotos, montar uma lista de compras automática, usar um timer de preparo e alternar entre português e inglês — tudo com seus dados salvos na nuvem.

---

## ✨ Funcionalidades

- Login com e-mail/senha ou conta do Google (Firebase Authentication)
- Dados salvos na nuvem por usuário (Firestore) — acesse de qualquer dispositivo
- Salvar, editar e excluir receitas
- Adicionar foto à receita (upload do dispositivo)
- Timer flutuante para acompanhar o tempo de preparo, com alarme sonoro
- Filtrar por refeição e por tipo de prato
- Buscar por nome de receita ou ingrediente
- Marcar receitas como favoritas
- Lista de compras integrada, com itens gerados a partir das receitas
- Configurações de conta: editar perfil, trocar senha, gerenciar privacidade
- Exportar e importar backup das receitas em JSON
- Exclusão de conta com confirmação de segurança
- Interface em português e inglês (alternável)
- Layout responsivo para celular

---

## 🚀 Como usar

Acesse o link ao vivo acima, crie uma conta e comece a planejar suas receitas da semana.

Para rodar localmente, é necessário um servidor local (ex: extensão Live Server do VS Code) por causa dos módulos do Firebase.

---

## 🛠 Tecnologias

- HTML5, CSS3, JavaScript (vanilla, ES modules)
- Firebase Authentication (e-mail/senha + Google)
- Firebase Firestore (banco de dados na nuvem)

---

## 📁 Estrutura

```
plately/
├── index.html
├── styles.css
├── app.js
├── firebase-init.js
├── favicon.svg
└── README.md
```
