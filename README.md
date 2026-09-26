# Nigerian Meal Planner (Quick Diet)

Personalized Nigerian meal plans with calorie-scaled portions, a smart shopping list and progress tracking.

## Features
- **Accounts**: sign up, log in, log out and reset a forgotten password (Firebase Authentication)
- **Profile & calorie calculator**: age, sex, height, weight, activity and goal give a daily calorie target (Mifflin-St Jeor); diet (vegetarian/pescatarian) and foods to avoid (allergies)
- **Meal planner**: daily or 7-day plans scaled to your target, no back-to-back repeats, swap any meal with one click
- **Saved plans**: save plans to your account, reopen or delete them later
- **Meal browser**: search all meals by name or ingredient, filter by meal type, favourites, or "fits my diet"
- **Shopping list**: grouped by market section, tick items as you buy them, copy or send on WhatsApp
- **Progress**: log your weight and see it on a chart; tick off meals you've eaten to build a streak

## Setup

### 1. Install
```
npm install
```

### 2. Create a Firebase project
1. Go to https://console.firebase.google.com and click **Add project**.
2. **Build → Authentication → Get started → Sign-in method**: enable **Email/Password**.
3. **Build → Firestore Database → Create database** (production mode, pick a nearby region).
4. In **Firestore → Rules**, paste the contents of [`firestore.rules`](firestore.rules) and click **Publish**. This makes sure each user can only read their own data.
5. **Project settings (gear icon) → General → Your apps → Web (`</>`)**: register a web app and copy the `firebaseConfig` values.

### 3. Add your config
Copy `.env.example` to `.env.local` and fill in the values from step 5. `.env.local` is git-ignored.

### 4. Run
```
npm start
```
Restart `npm start` whenever you change `.env.local`.

### Deploying
When you deploy (Netlify, Vercel, Firebase Hosting…), add the same `REACT_APP_FIREBASE_*` variables in the host's environment settings, and add your site's domain under **Authentication → Settings → Authorized domains**.

## Scripts
- `npm start` – development server
- `npm test` – run tests
- `npm run build` – production build

## Project structure
```
src/
  meals.js            meal data (with diet tags)
  firebase.js         Firebase initialisation
  context/            auth + profile state
  services/db.js      Firestore reads/writes
  utils/              planner, calorie calculator, shopping list, dates (pure, tested)
  components/         navbar, meal card, plan view, shopping list, weight chart
  pages/              one file per route
```
