const meals = [
  // BREAKFAST OPTIONS
  {
    name: "Pap & Akara",
    mealType: "breakfast",
    calories: 420,
    carbohydrate: 60,
    protein: 14,
    fat: 12,
    image: "/images/akarapap.jpg",
    instructions: "Serve hot pap with fried akara balls.",
    ingredients: ["Pap", "Beans", "Onion", "Palm oil or vegetable oil", "Salt"]
  },
  {
    name: "Moi Moi & Pap",
    mealType: "breakfast",
    calories: 380,
    carbohydrate: 55,
    protein: 16,
    fat: 9,
    image: "/images/moi&pap.jpg",
    instructions: "Steam moi moi and serve with hot pap.",
    ingredients: ["Beans", "Pepper", "Onion", "Palm oil", "Pap"]
  },
  {
    name: "Bread & Akara",
    mealType: "breakfast",
    calories: 450,
    carbohydrate: 65,
    protein: 15,
    fat: 14,
    image: "/images/break&akara.jpg",
    instructions: "Stuff akara inside soft agege bread.",
    ingredients: ["Bread", "Beans", "Onion", "Vegetable oil", "Salt"]
  },
  {
    name: "Yam & Egg Sauce",
    mealType: "breakfast",
    calories: 500,
    carbohydrate: 70,
    protein: 18,
    fat: 15,
    image: "/images/yam&eggsauce.jpg",
    instructions: "Boil yam and serve with fried egg sauce.",
    ingredients: ["Yam", "Eggs", "Tomatoes", "Onion", "Vegetable oil"]
  },
  {
    name: "Ogi or Akamu with Milk",
    mealType: "breakfast",
    calories: 350,
    carbohydrate: 55,
    protein: 12,
    fat: 8,
    image: "/images/ogi.jpg",
    instructions: "Serve pap with milk and sugar (optional).",
    ingredients: ["Pap (fermented maize)", "Milk", "Sugar (optional)"]
  },
  {
    name: "Plantain Frittata",
    mealType: "breakfast",
    calories: 480,
    carbohydrate: 50,
    protein: 20,
    fat: 16,
    image: "/images/plantainfri.jpg",
    instructions: "Bake sliced plantain with eggs and vegetables.",
    ingredients: ["Plantain", "Eggs", "Onion", "Tomatoes", "Vegetable oil"]
  },
  {
    name: "Beans Cake (Akara) & Custard",
    mealType: "breakfast",
    calories: 430,
    carbohydrate: 58,
    protein: 14,
    fat: 13,
    image: "/images/akara&custard.jpg",
    instructions: "Serve akara balls with custard.",
    ingredients: ["Beans", "Onion", "Vegetable oil", "Custard powder", "Milk"]
  },
  {
    name: "Boiled Sweet Potatoes & Sauce",
    mealType: "breakfast",
    calories: 410,
    carbohydrate: 62,
    protein: 12,
    fat: 10,
    image: "/images/potatoe&sauce.jpg",
    instructions: "Boil potatoes and serve with pepper sauce.",
    ingredients: ["Sweet potatoes", "Palm oil", "Onion", "Pepper", "Tomatoes"]
  },
  {
    name: "Nkwobi (light portion)",
    mealType: "breakfast",
    calories: 390,
    carbohydrate: 35,
    protein: 20,
    fat: 14,
    image: "/images/nkwobi.jpg",
    instructions: "Cow foot pepper soup, small portion.",
    ingredients: ["Cow foot", "Palm oil", "Utazi leaves", "Onion", "Pepper"]
  },
  {
    name: "Tea & Bread with Egg",
    mealType: "breakfast",
    calories: 440,
    carbohydrate: 60,
    protein: 18,
    fat: 12,
    image: "/images/bread&egg.jpg",
    instructions: "Serve hot tea with buttered bread and fried egg.",
    ingredients: ["Tea", "Bread", "Eggs", "Butter", "Milk"]
  },

  // LUNCH OPTIONS
  {
    name: "Jollof Rice & Chicken",
    mealType: "lunch",
    calories: 650,
    carbohydrate: 85,
    protein: 32,
    fat: 20,
    image: "/images/jollofrice.jpg",
    instructions: "Serve jollof rice with grilled chicken.",
    ingredients: ["Rice", "Tomatoes", "Pepper", "Onion", "Chicken", "Vegetable oil"]
  },
  {
    name: "Fried Rice & Plantain",
    mealType: "lunch",
    calories: 600,
    carbohydrate: 80,
    protein: 22,
    fat: 18,
    image: "/images/friedrice&plantain.jpg",
    instructions: "Serve fried rice with fried plantain.",
    ingredients: ["Rice", "Mixed vegetables", "Chicken stock", "Plantain", "Vegetable oil"]
  },
  {
    name: "Efo Riro & Semovita",
    mealType: "lunch",
    calories: 700,
    carbohydrate: 90,
    protein: 30,
    fat: 22,
    image: "/images/eforiro.jpg",
    instructions: "Serve efo riro with semo.",
    ingredients: ["Spinach/ugu leaves", "Palm oil", "Tomatoes", "Pepper", "Semovita"]
  },
  {
    name: "Egusi Soup & Pounded Yam",
    mealType: "lunch",
    calories: 750,
    carbohydrate: 95,
    protein: 28,
    fat: 25,
    image: "/images/egusi&poundedyam.jpg",
    instructions: "Serve egusi soup with pounded yam.",
    ingredients: ["Egusi (melon seeds)", "Palm oil", "Spinach", "Yam", "Stockfish"]
  },
  {
    name: "Okra Soup & Fufu",
    mealType: "lunch",
    calories: 680,
    carbohydrate: 88,
    protein: 26,
    fat: 20,
    image: "/images/okoroandfufu.jpg",
    instructions: "Serve okra soup with cassava fufu.",
    ingredients: ["Okra", "Palm oil", "Crayfish", "Cassava fufu", "Pepper"]
  },
  {
    name: "Beans & Plantain",
    mealType: "lunch",
    calories: 550,
    carbohydrate: 80,
    protein: 22,
    fat: 10,
    image: "/images/beans&plantain.jpg",
    instructions: "Serve beans porridge with fried plantain.",
    ingredients: ["Beans", "Palm oil", "Onion", "Plantain"]
  },
  {
    name: "Ofada Rice & Ayamase Sauce",
    mealType: "lunch",
    calories: 720,
    carbohydrate: 95,
    protein: 30,
    fat: 24,
    image: "/images/ayameseandofada.jpg",
    instructions: "Serve local ofada rice with spicy ayamase sauce.",
    ingredients: ["Ofada rice", "Green pepper", "Locust beans", "Palm oil", "Beef"]
  },
  {
    name: "Banga Soup & Starch",
    mealType: "lunch",
    calories: 760,
    carbohydrate: 92,
    protein: 27,
    fat: 28,
    image: "/images/banga&starch.jpg",
    instructions: "Serve banga soup with starch swallow.",
    ingredients: ["Palm nuts", "Spices", "Catfish", "Beef", "Starch"]
  },
  {
    name: "Afang Soup & Garri",
    mealType: "lunch",
    calories: 740,
    carbohydrate: 96,
    protein: 29,
    fat: 26,
    image: "/images/afang&garri.jpg",
    instructions: "Serve afang soup with garri.",
    ingredients: ["Afang leaves", "Waterleaf", "Palm oil", "Garri", "Stockfish"]
  },
  {
    name: "Oha Soup & Pounded Yam",
    mealType: "lunch",
    calories: 730,
    carbohydrate: 92,
    protein: 28,
    fat: 25,
    image: "/images/ohaandpoundedyam.jpg",
    instructions: "Serve oha soup with pounded yam.",
    ingredients: ["Oha leaves", "Palm oil", "Cocoyam", "Yam", "Beef"]
  },

  // DINNER OPTIONS
  {
    name: "Beans Porridge",
    mealType: "dinner",
    calories: 500,
    carbohydrate: 70,
    protein: 22,
    fat: 12,
    image: "/images/beans.jpg",
    instructions: "Serve beans porridge with dodo.",
    ingredients: ["Beans", "Palm oil", "Onion", "Pepper", "Plantain"]
  },
  {
    name: "Yam Porridge (Asaro)",
    mealType: "dinner",
    calories: 540,
    carbohydrate: 78,
    protein: 14,
    fat: 16,
    image: "/images/yamporridge.jpg",
    instructions: "Cook yam porridge with palm oil & veggies.",
    ingredients: ["Yam", "Palm oil", "Pepper", "Onion", "Vegetables"]
  },
  {
    name: "Ewa Agoyin & Bread",
    mealType: "dinner",
    calories: 520,
    carbohydrate: 74,
    protein: 18,
    fat: 14,
    image: "/images/ewa.jpg",
    instructions: "Serve mashed beans with agege bread.",
    ingredients: ["Beans", "Palm oil", "Pepper", "Onion", "Bread"]
  },
  {
    name: "Okpa (Steamed Bambara Nut Cake)",
    mealType: "dinner",
    calories: 450,
    carbohydrate: 65,
    protein: 16,
    fat: 11,
    image: "/images/okpa.jpg",
    instructions: "Steam okpa in banana leaves.",
    ingredients: ["Bambara nut flour", "Palm oil", "Onion", "Pepper"]
  },
  {
    name: "Nkwobi (Dinner Portion)",
    mealType: "dinner",
    calories: 600,
    carbohydrate: 40,
    protein: 32,
    fat: 28,
    image: "/images/nkwobi.jpg",
    instructions: "Serve spiced cow foot with palm oil sauce.",
    ingredients: ["Cow foot", "Palm oil", "Utazi leaves", "Onion", "Seasoning"]
  },
  {
    name: "Abacha (African Salad)",
    mealType: "dinner",
    calories: 490,
    carbohydrate: 68,
    protein: 16,
    fat: 15,
    image: "/images/abacha.jpg",
    instructions: "Mix cassava flakes with ugba, fish & palm oil.",
    ingredients: ["Cassava flakes (abacha)", "Ugba", "Palm oil", "Dry fish", "Pepper"]
  },
  {
    name: "Fish Pepper Soup",
    mealType: "dinner",
    calories: 420,
    carbohydrate: 10,
    protein: 36,
    fat: 12,
    image: "/images/fish-pepper.jpg",
    instructions: "Serve hot fish pepper soup with yam (optional).",
    ingredients: ["Fish (catfish/tilapia)", "Pepper", "Spices", "Onion", "Yam (optional)"]
  },
  {
    name: "Steamed White Rice & Vegetable Sauce",
    mealType: "dinner",
    calories: 530,
    carbohydrate: 76,
    protein: 18,
    fat: 14,
    image: "/images/rice&vegetable.jpg",
    instructions: "Serve plain rice with spicy vegetable sauce.",
    ingredients: ["Rice", "Vegetables", "Palm oil", "Pepper", "Onion"]
  },
  {
    name: "Plantain Porridge",
    mealType: "dinner",
    calories: 510,
    carbohydrate: 72,
    protein: 16,
    fat: 13,
    image: "/images/platain-porridge.jpg",
    instructions: "Cook unripe plantain porridge with vegetables.",
    ingredients: ["Unripe plantain", "Palm oil", "Pepper", "Onion", "Vegetables"]
  },
  {
    name: "Ogbono Soup & Eba",
    mealType: "dinner",
    calories: 720,
    carbohydrate: 95,
    protein: 26,
    fat: 24,
    image: "/images/ogbono-eba.jpg",
    instructions: "Serve ogbono soup with eba.",
    ingredients: ["Ogbono seeds", "Palm oil", "Stockfish", "Eba (garri)", "Pepper"]
  }
];

export default meals;
