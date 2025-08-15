class TimeChefGame {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.gameData = {
      score: 0,
      level: 1,
      timeLeft: 60,
      gameRunning: false,
      isPaused: false,
      combo: 0,
      maxCombo: 0,
      selectedIngredients: [],
      currentRecipe: null,
      availableIngredients: [],
      recipesCompleted: 0,
      powerUps: {
        freezeTime: 3,
        hint: 5,
        comboBoost: 2,
        doublePoints: 1,
      },
      activeEffects: [],
      timer: null,
      // New challenging mechanics
      ingredientQuality: {}, // Track quality of each ingredient
      cookingTechnique: null, // Current cooking technique required
      timePressure: 1.0, // Time pressure multiplier
      difficultyMultiplier: 1.0, // Increases with level
      streakBonus: 0, // Bonus for consecutive perfect recipes
      mistakes: 0, // Track mistakes for penalties
      perfectRecipes: 0, // Track perfect recipes for bonuses
      lastRecipeTime: 0, // Time taken for last recipe
      averageRecipeTime: 0, // Average time per recipe
      challengeMode: false, // Special challenge mode
      bossRecipes: [], // Special boss recipes that appear
      ingredientDecay: {}, // Ingredients decay over time
      cookingPressure: 0, // Pressure builds up with mistakes
    };

    this.recipes = this.initializeRecipes();
    this.ingredients = this.initializeIngredients();
    this.achievements = this.initializeAchievements();
    this.shopItems = this.initializeShopItems();
    this.cookingTechniques = this.initializeCookingTechniques();

    this.initializeEventListeners();
    this.checkAuthentication();
  }

  // New cooking techniques system
  initializeCookingTechniques() {
    return {
      quick_fry: {
        name: "Quick Fry",
        timeBonus: 5,
        pointsMultiplier: 1.2,
        difficulty: 1,
      },
      slow_cook: {
        name: "Slow Cook",
        timeBonus: 15,
        pointsMultiplier: 1.5,
        difficulty: 2,
      },
      precise_cut: {
        name: "Precise Cut",
        timeBonus: 3,
        pointsMultiplier: 1.3,
        difficulty: 1,
      },
      perfect_timing: {
        name: "Perfect Timing",
        timeBonus: 8,
        pointsMultiplier: 1.8,
        difficulty: 3,
      },
      master_technique: {
        name: "Master Technique",
        timeBonus: 20,
        pointsMultiplier: 2.0,
        difficulty: 4,
      },
      speed_cooking: {
        name: "Speed Cooking",
        timeBonus: -5,
        pointsMultiplier: 1.4,
        difficulty: 2,
      },
      pressure_cook: {
        name: "Pressure Cook",
        timeBonus: 10,
        pointsMultiplier: 1.6,
        difficulty: 3,
      },
    };
  }

  // Enhanced recipe system with more complexity
  initializeRecipes() {
    return [
      {
        name: "🍕 Margherita Pizza",
        ingredients: ["🍅", "🧀", "🌿"],
        points: 100,
        timeBonus: 10,
        difficulty: 1,
        category: "Italian",
        technique: "quick_fry",
        qualityThreshold: 0.7,
        timeLimit: 15,
        funFact:
          "🍕 Named after Queen Margherita of Italy in 1889! The colors represent the Italian flag: red tomatoes, white mozzarella, and green basil.",
      },
      {
        name: "🍝 Pasta Carbonara",
        ingredients: ["🍝", "🥓", "🥚"],
        points: 120,
        timeBonus: 12,
        difficulty: 2,
        category: "Italian",
        technique: "slow_cook",
        qualityThreshold: 0.8,
        timeLimit: 20,
        funFact:
          "🍝 Carbonara was created by Italian coal miners! The black pepper represents coal dust, and the name comes from 'carbone' meaning coal.",
      },
      {
        name: "🥗 Caesar Salad",
        ingredients: ["🥬", "🧀", "🥖"],
        points: 80,
        timeBonus: 8,
        difficulty: 1,
        category: "Salad",
        technique: "precise_cut",
        qualityThreshold: 0.6,
        timeLimit: 12,
        funFact:
          "🥗 Invented in 1924 by Caesar Cardini in Tijuana, Mexico! It was created when the restaurant ran out of ingredients and had to improvise.",
      },
      {
        name: "🍔 Classic Burger",
        ingredients: ["🥩", "🧀", "🥬"],
        points: 150,
        timeBonus: 15,
        difficulty: 2,
        category: "American",
        technique: "quick_fry",
        qualityThreshold: 0.75,
        timeLimit: 18,
        funFact:
          "🍔 The hamburger was invented in 1900 by Louis Lassen! He put a beef patty between two slices of bread for a customer who wanted something quick to eat.",
      },
      {
        name: "🍜 Ramen Bowl",
        ingredients: ["🍜", "🥚", "🥬"],
        points: 130,
        timeBonus: 13,
        difficulty: 2,
        category: "Asian",
        technique: "slow_cook",
        qualityThreshold: 0.8,
        timeLimit: 25,
        funFact:
          "🍜 Ramen originated in China but became popular in Japan after WWII! The word 'ramen' comes from the Chinese 'la mian' meaning 'pulled noodles'.",
      },
      {
        name: "🥪 Club Sandwich",
        ingredients: ["🍞", "🥩", "🥬"],
        points: 110,
        timeBonus: 11,
        difficulty: 2,
        category: "American",
        technique: "precise_cut",
        qualityThreshold: 0.7,
        timeLimit: 16,
        funFact:
          "🥪 The Club Sandwich was invented in 1894 at the Saratoga Club House! It's called 'club' because it was served at exclusive gentlemen's clubs.",
      },
      {
        name: "🍣 Sushi Roll",
        ingredients: ["🍚", "🐟", "🥒"],
        points: 160,
        timeBonus: 16,
        difficulty: 3,
        category: "Asian",
        technique: "perfect_timing",
        qualityThreshold: 0.9,
        timeLimit: 30,
        funFact:
          "🍣 Sushi was originally a way to preserve fish! The rice was used to ferment and preserve the fish, and was thrown away before eating.",
      },
      {
        name: "🥘 Paella",
        ingredients: ["🍚", "🦐", "🥬"],
        points: 180,
        timeBonus: 18,
        difficulty: 3,
        category: "Spanish",
        technique: "slow_cook",
        qualityThreshold: 0.85,
        timeLimit: 35,
        funFact:
          "🥘 Paella gets its name from the pan it's cooked in! The word 'paella' means 'pan' in Valencian, the region where it originated.",
      },
      {
        name: "🍖 BBQ Ribs",
        ingredients: ["🥩", "🌽", "🥬"],
        points: 200,
        timeBonus: 20,
        difficulty: 3,
        category: "American",
        technique: "master_technique",
        qualityThreshold: 0.9,
        timeLimit: 40,
      },
      {
        name: "🥘 Curry",
        ingredients: ["🍚", "🥕", "🥩"],
        points: 140,
        timeBonus: 14,
        difficulty: 2,
        category: "Indian",
        technique: "pressure_cook",
        qualityThreshold: 0.8,
        timeLimit: 22,
      },
      // Boss recipes - extremely challenging
      {
        name: "👑 Royal Feast",
        ingredients: ["🥩", "🦐", "🧀", "🥬", "🍄"],
        points: 500,
        timeBonus: 30,
        difficulty: 5,
        category: "Boss",
        technique: "master_technique",
        qualityThreshold: 0.95,
        timeLimit: 60,
        bossRecipe: true,
      },
      {
        name: "🌟 Michelin Star Dish",
        ingredients: ["🐟", "🍝", "🥚", "🧈", "🌿"],
        points: 400,
        timeBonus: 25,
        difficulty: 4,
        category: "Boss",
        technique: "perfect_timing",
        qualityThreshold: 0.9,
        timeLimit: 45,
        bossRecipe: true,
      },
      // Special recipes for Hemal
      {
        name: "👑 Royal Chocolate Cake",
        ingredients: ["🍫", "🥚", "🧈"],
        points: 300,
        timeBonus: 25,
        difficulty: 3,
        category: "Dessert",
        special: "hemal",
        technique: "master_technique",
        qualityThreshold: 0.9,
        timeLimit: 35,
      },
      {
        name: "💎 Diamond Ice Cream",
        ingredients: ["🍦", "💎", "🍓"],
        points: 250,
        timeBonus: 20,
        difficulty: 2,
        category: "Dessert",
        special: "hemal",
        technique: "precise_cut",
        qualityThreshold: 0.8,
        timeLimit: 25,
      },
      {
        name: "👸 Princess Smoothie",
        ingredients: ["🍓", "🥭", "🥥"],
        points: 180,
        timeBonus: 15,
        difficulty: 1,
        category: "Drink",
        special: "hemal",
        technique: "speed_cooking",
        qualityThreshold: 0.7,
        timeLimit: 15,
      },
      {
        name: "🌟 Magic Macarons",
        ingredients: ["🍪", "🌈", "🍯"],
        points: 220,
        timeBonus: 18,
        difficulty: 3,
        category: "Dessert",
        special: "hemal",
        technique: "perfect_timing",
        qualityThreshold: 0.85,
        timeLimit: 30,
      },
      {
        name: "🥘 Pho",
        ingredients: ["🍜", "🥩", "🌿"],
        points: 160,
        timeBonus: 16,
        difficulty: 2,
        category: "Vietnamese",
        technique: "slow_cook",
        qualityThreshold: 0.8,
        timeLimit: 25,
        funFact:
          "🥘 Pho was created in the 1880s in northern Vietnam! The name comes from the French 'pot-au-feu' (pot on fire) and became Vietnam's national dish.",
      },
      {
        name: "🥘 Pad Thai",
        ingredients: ["🍜", "🥚", "🥜"],
        points: 150,
        timeBonus: 15,
        difficulty: 2,
        category: "Thai",
        technique: "stir-fry",
        qualityThreshold: 0.75,
        timeLimit: 20,
        funFact:
          "🥘 Pad Thai was invented in the 1930s by Thailand's prime minister to reduce rice consumption! It's now one of Thailand's most famous dishes.",
      },
      {
        name: "🥘 Falafel",
        ingredients: ["🫘", "🌿", "🥬"],
        points: 120,
        timeBonus: 12,
        difficulty: 2,
        category: "Middle Eastern",
        technique: "fry",
        qualityThreshold: 0.7,
        timeLimit: 18,
        funFact:
          "🥘 Falafel was invented by Egyptian Copts as a meat substitute during Lent! It's now Israel's national dish and a global street food favorite.",
      },
      {
        name: "🥘 Hummus",
        ingredients: ["🫘", "🧈", "🌿"],
        points: 100,
        timeBonus: 10,
        difficulty: 1,
        category: "Middle Eastern",
        technique: "blend",
        qualityThreshold: 0.6,
        timeLimit: 15,
        funFact:
          "🥘 Hummus dates back to ancient Egypt over 7000 years ago! The word 'hummus' means 'chickpea' in Arabic and it's eaten daily in many Middle Eastern countries.",
      },
      {
        name: "🥘 Poutine",
        ingredients: ["🍟", "🧀", "🥘"],
        points: 140,
        timeBonus: 14,
        difficulty: 1,
        category: "Canadian",
        technique: "assemble",
        qualityThreshold: 0.6,
        timeLimit: 15,
        funFact:
          "🥘 Poutine was invented in Quebec in the 1950s! The name comes from the Quebecois slang for 'mess' and it's now Canada's unofficial national dish.",
      },
      {
        name: "🥘 Ceviche",
        ingredients: ["🐟", "🍋", "🌿"],
        points: 150,
        timeBonus: 15,
        difficulty: 2,
        category: "Peruvian",
        technique: "cure",
        qualityThreshold: 0.75,
        timeLimit: 20,
        funFact:
          "🥘 Ceviche is Peru's national dish! The fish is 'cooked' by the acid in lime juice, not heat. It's over 2000 years old and was eaten by the Incas.",
      },
      {
        name: "🥘 Feijoada",
        ingredients: ["🫘", "🥩", "🥖"],
        points: 180,
        timeBonus: 18,
        difficulty: 3,
        category: "Brazilian",
        technique: "slow_cook",
        qualityThreshold: 0.8,
        timeLimit: 35,
        funFact:
          "🥘 Feijoada is Brazil's national dish! It was created by slaves using leftover meat parts and is traditionally served on Wednesdays and Saturdays.",
      },
      {
        name: "🥘 Jollof Rice",
        ingredients: ["🍚", "🥩", "🍅"],
        points: 150,
        timeBonus: 15,
        difficulty: 2,
        category: "West African",
        technique: "simmer",
        qualityThreshold: 0.75,
        timeLimit: 22,
        funFact:
          "🥘 Jollof rice is the most popular dish in West Africa! There's even a 'Jollof War' between Nigeria and Ghana about who makes it better.",
      },
      {
        name: "🥘 Moussaka",
        ingredients: ["🍆", "🥩", "🧀"],
        points: 180,
        timeBonus: 18,
        difficulty: 3,
        category: "Greek",
        technique: "bake",
        qualityThreshold: 0.8,
        timeLimit: 30,
        funFact:
          "🥘 Moussaka was introduced to Greece in the 1920s! It's inspired by the Arabic dish 'musakhkhan' and became Greece's national dish.",
      },
      {
        name: "🥘 Bibimbap",
        ingredients: ["🍚", "🥩", "🥬"],
        points: 170,
        timeBonus: 17,
        difficulty: 3,
        category: "Korean",
        technique: "assemble",
        qualityThreshold: 0.8,
        timeLimit: 25,
        funFact:
          "🥘 Bibimbap means 'mixed rice' in Korean! It was originally a way to use leftover vegetables and rice from the day before.",
      },
      {
        name: "🥘 Tom Yum Soup",
        ingredients: ["🦐", "🍄", "🌿"],
        points: 140,
        timeBonus: 14,
        difficulty: 2,
        category: "Thai",
        technique: "simmer",
        qualityThreshold: 0.75,
        timeLimit: 20,
        funFact:
          "🥘 Tom Yum is Thailand's most famous soup! The name means 'boiling mixed' and it's known for its perfect balance of sour, spicy, and savory flavors.",
      },
      {
        name: "🥘 Couscous",
        ingredients: ["🌾", "🥕", "🥩"],
        points: 140,
        timeBonus: 14,
        difficulty: 2,
        category: "Moroccan",
        technique: "steam",
        qualityThreshold: 0.7,
        timeLimit: 22,
        funFact:
          "🥘 Couscous is the national dish of Morocco! It's made from semolina wheat and was traditionally prepared by hand-rolling the grains.",
      },
      {
        name: "🥘 Tagine",
        ingredients: ["🥩", "🥕", "🌿"],
        points: 160,
        timeBonus: 16,
        difficulty: 2,
        category: "Moroccan",
        technique: "slow_cook",
        qualityThreshold: 0.8,
        timeLimit: 25,
        funFact:
          "🥘 Tagine gets its name from the clay pot it's cooked in! The conical lid helps steam circulate and creates incredibly tender meat.",
      },
      {
        name: "🥘 Bobotie",
        ingredients: ["🥩", "🥚", "🌾"],
        points: 160,
        timeBonus: 16,
        difficulty: 3,
        category: "South African",
        technique: "bake",
        qualityThreshold: 0.8,
        timeLimit: 28,
        funFact:
          "🥘 Bobotie is South Africa's national dish! It was brought by Dutch settlers and combines sweet and savory flavors with a custard topping.",
      },
    ];
  }

  // Enhanced ingredients with quality system
  initializeIngredients() {
    return [
      "🍅",
      "🧀",
      "🌿",
      "🍝",
      "🥓",
      "🥚",
      "🥬",
      "🥖",
      "🥩",
      "🍜",
      "🍞",
      "🍚",
      "🐟",
      "🥒",
      "🦐",
      "🌽",
      "🥕",
      "🍄",
      "🧅",
      // Special ingredients for Hemal's recipes
      "🍫",
      "🧈",
      "🍦",
      "💎",
      "🍓",
      "🥭",
      "🥥",
      "🍪",
      "🌈",
      "🍯",
      "🥔",
      "🥦",
      "🥑",
      "🍎",
      "🍌",
      "🍇",
      "🍊",
      "🍋",
      "🥝",
      "🍍",
    ];
  }

  initializeAchievements() {
    return [
      {
        id: "hemal_special",
        title: "👑 Queen Hemal",
        description: "Special achievement just for you, Queen!",
        icon: "👑",
        condition: (userData) =>
          userData.achievements.includes("hemal_special"),
        reward: { coins: 1000, xp: 2000 },
        special: true,
      },
      {
        id: "hemal_royal_cook",
        title: "👸 Royal Chef",
        description: "Complete 10 special royal recipes",
        icon: "👸",
        condition: (userData) => userData.royalRecipesCompleted >= 10,
        reward: { coins: 1500, xp: 2500 },
        special: true,
      },
      {
        id: "hemal_dessert_master",
        title: "🍰 Dessert Master",
        description: "Master the art of royal desserts",
        icon: "🍰",
        condition: (userData) => userData.dessertsCompleted >= 20,
        reward: { coins: 2000, xp: 3000 },
        special: true,
      },
      {
        id: "first_recipe",
        title: "First Steps",
        description: "Complete your first recipe",
        icon: "🎯",
        condition: (userData) => userData.gamesPlayed >= 1,
        reward: { coins: 50, xp: 100 },
      },
      {
        id: "combo_master",
        title: "Combo Master",
        description: "Achieve a 5x combo",
        icon: "🔥",
        condition: (userData) => userData.bestCombo >= 5,
        reward: { coins: 200, xp: 300 },
      },
      {
        id: "score_champion",
        title: "Score Champion",
        description: "Reach 1000 total score",
        icon: "🏆",
        condition: (userData) => userData.totalScore >= 1000,
        reward: { coins: 500, xp: 500 },
      },
      {
        id: "level_up",
        title: "Level Up",
        description: "Reach level 5",
        icon: "⭐",
        condition: (userData) => userData.level >= 5,
        reward: { coins: 300, xp: 400 },
      },
      {
        id: "recipe_collector",
        title: "Recipe Collector",
        description: "Complete 50 recipes",
        icon: "📚",
        condition: (userData) => userData.totalRecipesCompleted >= 50,
        reward: { coins: 1000, xp: 800 },
      },
    ];
  }

  initializeShopItems() {
    return {
      powerups: [
        {
          id: "freeze_time_pack",
          name: "Freeze Time Pack",
          description: "Get 5 freeze time power-ups",
          icon: "⏸️",
          price: { coins: 100 },
          type: "powerup",
          effect: { freezeTime: 5 },
        },
        {
          id: "hint_pack",
          name: "Hint Pack",
          description: "Get 10 hint power-ups",
          icon: "💡",
          price: { coins: 150 },
          type: "powerup",
          effect: { hint: 10 },
        },
      ],
      skins: [
        {
          id: "chef_hat",
          name: "Chef Hat",
          description: "Professional chef hat",
          icon: "👨‍🍳",
          price: { gems: 5 },
          type: "skin",
        },
        {
          id: "master_chef",
          name: "Master Chef",
          description: "Master chef outfit",
          icon: "👨‍🍳",
          price: { gems: 15 },
          type: "skin",
        },
      ],
      recipes: [
        {
          id: "special_pizza",
          name: "Special Pizza",
          description: "Unlock special pizza recipe",
          icon: "🍕",
          price: { coins: 500 },
          type: "recipe",
        },
      ],
    };
  }

  // Authentication Methods
  checkAuthentication() {
    const savedUser = localStorage.getItem("timeChefUser");
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.isAuthenticated = true;
      this.showScreen("main-menu");
      this.updateUserInterface();
    } else {
      this.showScreen("auth-screen");
    }
  }

  // Google Sign-In functionality removed - using local accounts only

  loginUser() {
    this.isAuthenticated = true;
    localStorage.setItem("timeChefUser", JSON.stringify(this.currentUser));
    this.initializeUserData();
    this.showScreen("main-menu");
    this.updateUserInterface();

    // Special message for hemal
    if (this.currentUser.username.toLowerCase() === "hemal") {
      this.showSpecialHemalMessage();
    } else {
      this.showNotification(
        "Welcome back, " + this.currentUser.username + "!",
        "success"
      );
    }
  }

  registerUser(username, email, password) {
    // In a real app, this would make an API call
    this.currentUser = {
      id: Date.now().toString(),
      username: username,
      email: email,
      avatar: "👨‍🍳",
      isGoogleUser: false,
    };
    this.loginUser();
  }

  showSpecialHemalMessage() {
    // Create a professional VIP welcome overlay for Hemal
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-gradient-to-br from-royal-600 via-royal-500 to-primary-600 bg-gradient-animate z-50 flex items-center justify-center p-6";

    const messageBox = document.createElement("div");
    messageBox.className =
      "bg-white/95 backdrop-blur-xl rounded-3xl p-12 text-center max-w-2xl border border-white/30 shadow-2xl relative overflow-hidden";

    // Add floating crown elements
    for (let i = 0; i < 8; i++) {
      const crown = document.createElement("div");
      crown.innerHTML = "👑";
      crown.className =
        "absolute text-2xl text-royal-400/40 animate-float pointer-events-none";
      crown.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-delay: ${Math.random() * 2}s;
      `;
      messageBox.appendChild(crown);
    }

    messageBox.innerHTML += `
      <div class="text-6xl mb-6 animate-bounce-slow">👑</div>
      <h2 class="text-4xl font-bold bg-gradient-to-r from-royal-600 to-primary-600 bg-clip-text text-transparent mb-6">
        Welcome, Queen Hemal!
      </h2>
      <p class="text-slate-700 text-lg leading-relaxed mb-6 font-medium">
        🎉 You've unlocked the exclusive VIP cooking experience! 🎉
      </p>
      <p class="text-royal-600 text-lg leading-relaxed mb-6 font-semibold">
        ✨ Special bonuses activated: Premium coins, gems, and exclusive royal recipes! ✨
      </p>
      <p class="text-slate-600 text-base leading-relaxed mb-8">
        🍳 Ready to become the ultimate Time Chef? Let's create culinary magic! 🍳
      </p>
      <div class="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 mb-8 border-2 border-royal-300">
        <p class="text-slate-800 font-bold text-lg">🎁 VIP Bonus: 2000 coins + 100 gems + Royal recipes unlocked! 🎁</p>
      </div>
      <button id="hemal-close-btn" class="
        bg-gradient-to-r from-royal-500 to-primary-500 hover:from-royal-600 hover:to-primary-600
        text-white font-bold text-lg py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105
        shadow-lg hover:shadow-xl uppercase tracking-wide
      ">
        👑 Start Your Royal Cooking Adventure! 👑
      </button>
    `;

    overlay.appendChild(messageBox);
    document.body.appendChild(overlay);

    // Add close functionality
    document.getElementById("hemal-close-btn").addEventListener("click", () => {
      overlay.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        overlay.remove();
        this.showNotification(
          "Welcome to your exclusive cooking adventure, Hemal! 👑",
          "success"
        );
      }, 300);
    });
  }

  logoutUser() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem("timeChefUser");
    this.showScreen("auth-screen");
    this.showNotification("Logged out successfully", "info");
  }

  initializeUserData() {
    if (!localStorage.getItem(`userData_${this.currentUser.id}`)) {
      const userData = {
        level: 1,
        xp: 0,
        coins: 100,
        gems: 10,
        totalScore: 0,
        bestCombo: 0,
        gamesPlayed: 0,
        achievements: [],
        unlockedSkins: ["👨‍🍳"],
        currentSkin: "👨‍🍳",
        unlockedRecipes: [],
        inventory: {
          freezeTime: 3,
          hint: 5,
          comboBoost: 2,
          doublePoints: 1,
        },
      };

      // Special bonus for Hemal
      if (this.currentUser.username.toLowerCase() === "hemal") {
        userData.coins = 2000; // Extra coins for Hemal
        userData.gems = 100; // Extra gems for Hemal
        userData.achievements.push("hemal_special"); // Special achievement
        userData.unlockedSkins.push("👸", "👑", "💎"); // Special skins for Hemal
        userData.currentSkin = "👸"; // Set special avatar
        userData.level = 5; // Start at higher level
        userData.xp = 500; // Bonus XP
        userData.inventory = {
          freezeTime: 10,
          hint: 15,
          comboBoost: 8,
          doublePoints: 5,
        }; // Extra power-ups
        userData.royalRecipesCompleted = 0; // Track royal recipes
        userData.dessertsCompleted = 0; // Track desserts
        userData.unlockedRecipes = [
          "👑 Royal Chocolate Cake",
          "💎 Diamond Ice Cream",
          "👸 Princess Smoothie",
          "🌟 Magic Macarons",
        ]; // Unlock special recipes
      }

      localStorage.setItem(
        `userData_${this.currentUser.id}`,
        JSON.stringify(userData)
      );
    }
  }

  getUserData() {
    if (!this.currentUser || !this.currentUser.id) {
      // Return default user data if no user is set
      return {
        level: 1,
        xp: 0,
        coins: 100,
        gems: 10,
        totalScore: 0,
        bestCombo: 0,
        gamesPlayed: 0,
        achievements: [],
        unlockedSkins: ["👨‍🍳"],
        currentSkin: "👨‍🍳",
        unlockedRecipes: [],
        inventory: {
          freezeTime: 3,
          hint: 5,
          comboBoost: 2,
          doublePoints: 1,
        },
      };
    }
    return JSON.parse(localStorage.getItem(`userData_${this.currentUser.id}`));
  }

  saveUserData(userData) {
    if (!this.currentUser || !this.currentUser.id) {
      console.warn("Cannot save user data: no user is set");
      return;
    }
    localStorage.setItem(
      `userData_${this.currentUser.id}`,
      JSON.stringify(userData)
    );
  }

  // Event Listeners
  initializeEventListeners() {
    // Authentication events
    document.querySelectorAll(".auth-tab").forEach((tab) => {
      tab.addEventListener("click", (e) =>
        this.switchAuthTab(e.target.dataset.tab)
      );
    });

    document
      .getElementById("login-btn")
      .addEventListener("click", () => this.handleLogin());
    document
      .getElementById("register-btn")
      .addEventListener("click", () => this.handleRegister());
    document
      .getElementById("guest-play")
      .addEventListener("click", () => this.playAsGuest());

    // Main menu events
    document
      .getElementById("start-game")
      .addEventListener("click", () => this.startGame());
    document
      .getElementById("how-to-play")
      .addEventListener("click", () => this.showScreen("how-to-play-screen"));
    document
      .getElementById("achievements")
      .addEventListener("click", () => this.showAchievements());
    document
      .getElementById("leaderboard")
      .addEventListener("click", () => this.showLeaderboard());
    document
      .getElementById("shop")
      .addEventListener("click", () => this.showShop());
    document
      .getElementById("profile")
      .addEventListener("click", () => this.showProfile());

    // Navigation events
    document
      .getElementById("back-to-menu")
      .addEventListener("click", () => this.showScreen("main-menu"));
    document
      .getElementById("back-to-menu-achievements")
      .addEventListener("click", () => this.showScreen("main-menu"));
    document
      .getElementById("back-to-menu-leaderboard")
      .addEventListener("click", () => this.showScreen("main-menu"));
    document
      .getElementById("back-to-menu-shop")
      .addEventListener("click", () => this.showScreen("main-menu"));
    document
      .getElementById("back-to-menu-profile")
      .addEventListener("click", () => this.showScreen("main-menu"));

    // Game events
    document
      .getElementById("pause-game")
      .addEventListener("click", () => this.pauseGame());
    document
      .getElementById("quit-game")
      .addEventListener("click", () => this.quitGame());
    document
      .getElementById("cook-recipe")
      .addEventListener("click", () => this.cookRecipe());

    // Power-up events
    document
      .getElementById("freeze-time")
      .addEventListener("click", () => this.usePowerUp("freezeTime"));
    document
      .getElementById("hint")
      .addEventListener("click", () => this.usePowerUp("hint"));
    document
      .getElementById("combo-boost")
      .addEventListener("click", () => this.usePowerUp("comboBoost"));
    document
      .getElementById("double-points")
      .addEventListener("click", () => this.usePowerUp("doublePoints"));

    // Game over events
    document
      .getElementById("play-again")
      .addEventListener("click", () => this.startGame());
    document
      .getElementById("back-to-main")
      .addEventListener("click", () => this.showScreen("main-menu"));

    // Pause events
    document
      .getElementById("resume-game")
      .addEventListener("click", () => this.resumeGame());
    document
      .getElementById("restart-game")
      .addEventListener("click", () => this.startGame());
    document
      .getElementById("quit-to-menu")
      .addEventListener("click", () => this.quitGame());

    // Profile events
    document
      .getElementById("logout")
      .addEventListener("click", () => this.logoutUser());

    // Shop category events
    document.querySelectorAll(".shop-category").forEach((category) => {
      category.addEventListener("click", (e) =>
        this.switchShopCategory(e.target.dataset.category)
      );
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));

    // Initialize Google Sign-In
    // Google Sign-In initialization removed
  }

  // Authentication Handlers
  switchAuthTab(tab) {
    // Update tab styling
    document.querySelectorAll(".auth-tab").forEach((t) => {
      t.classList.remove("bg-primary-500", "text-white");
      t.classList.add("bg-white/5", "text-slate-300");
    });

    // Update form visibility
    document.querySelectorAll(".auth-form").forEach((f) => {
      f.classList.add("hidden");
    });

    const activeTab = document.querySelector(`[data-tab="${tab}"]`);
    const activeForm = document.getElementById(`${tab}-form`);

    if (activeTab) {
      activeTab.classList.remove("bg-white/5", "text-slate-300");
      activeTab.classList.add("bg-primary-500", "text-white");
    }

    if (activeForm) {
      activeForm.classList.remove("hidden");
    }
  }

  handleLogin() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    if (!username || !password) {
      this.showNotification("Please fill in all fields", "error");
      return;
    }

    // Simple validation - in real app, this would be server-side
    const savedUsers = JSON.parse(
      localStorage.getItem("timeChefUsers") || "[]"
    );
    const user = savedUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      this.currentUser = { ...user, password: undefined };
      this.loginUser();
    } else {
      this.showNotification("Invalid username or password", "error");
    }
  }

  handleRegister() {
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirm = document.getElementById("register-confirm").value;

    if (!username || !email || !password || !confirm) {
      this.showNotification("Please fill in all fields", "error");
      return;
    }

    if (password !== confirm) {
      this.showNotification("Passwords do not match", "error");
      return;
    }

    const savedUsers = JSON.parse(
      localStorage.getItem("timeChefUsers") || "[]"
    );
    if (savedUsers.find((u) => u.username === username)) {
      this.showNotification("Username already exists", "error");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      avatar: "👨‍🍳",
    };
    savedUsers.push(newUser);
    localStorage.setItem("timeChefUsers", JSON.stringify(savedUsers));

    this.currentUser = { ...newUser, password: undefined };
    this.loginUser();
  }

  playAsGuest() {
    this.currentUser = {
      id: "guest_" + Date.now(),
      username: "Guest Chef",
      email: "",
      avatar: "👨‍🍳",
      isGoogleUser: false,
    };
    this.isAuthenticated = true;
    this.initializeUserData();
    this.showScreen("main-menu");
    this.updateUserInterface();
    this.showNotification("Playing as Guest", "info");
  }

  // UI Methods
  showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.add("hidden");
    });
    document.getElementById(screenId).classList.remove("hidden");
  }

  updateUserInterface() {
    if (!this.currentUser) return;

    const userData = this.getUserData();

    // Update main menu
    document.getElementById("user-name").textContent =
      this.currentUser.username;
    document.getElementById(
      "user-level"
    ).textContent = `Level ${userData.level} • ${userData.xp} XP`;
    document.getElementById("total-score").textContent = userData.totalScore;
    document.getElementById("best-combo").textContent = userData.bestCombo;
    document.getElementById("achievements-count").textContent =
      userData.achievements.length;

    // Update shop currency
    document.getElementById("user-coins").textContent = userData.coins;
    document.getElementById("user-gems").textContent = userData.gems;

    // Update profile
    document.getElementById("profile-avatar").textContent =
      userData.currentSkin;
    document.getElementById("profile-name").textContent =
      this.currentUser.username;
    document.getElementById("profile-title").textContent = this.getUserTitle(
      userData.level
    );
    document.getElementById("games-played").textContent = userData.gamesPlayed;
    document.getElementById("total-games-score").textContent =
      userData.totalScore;
    document.getElementById("best-games-combo").textContent =
      userData.bestCombo;
  }

  getUserTitle(level) {
    const titles = [
      "Novice Chef",
      "Apprentice Chef",
      "Junior Chef",
      "Sous Chef",
      "Head Chef",
      "Master Chef",
      "Executive Chef",
      "Celebrity Chef",
      "Legendary Chef",
      "Culinary God",
    ];
    return titles[Math.min(Math.floor(level / 10), titles.length - 1)];
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");

    // Set base classes
    let classes =
      "bg-white/90 backdrop-blur-sm text-slate-800 px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 translate-x-full";

    // Add type-specific styling
    switch (type) {
      case "success":
        classes += " border-l-4 border-green-500 bg-green-50/90";
        break;
      case "error":
        classes += " border-l-4 border-red-500 bg-red-50/90";
        break;
      case "warning":
        classes += " border-l-4 border-yellow-500 bg-yellow-50/90";
        break;
      default:
        classes += " border-l-4 border-blue-500 bg-blue-50/90";
    }

    notification.className = classes;
    notification.textContent = message;

    const container = document.getElementById("notification-container");
    container.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
      notification.classList.add("translate-x-0");
    }, 100);

    // Animate out
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Game Initialization
  initializeRecipes() {
    return [
      {
        name: "🍕 Margherita Pizza",
        ingredients: ["🍅", "🧀", "🌿"],
        points: 100,
        timeBonus: 10,
        difficulty: 1,
        category: "Italian",
        technique: "quick_fry",
        qualityThreshold: 0.7,
        timeLimit: 15,
      },
      {
        name: "🍝 Pasta Carbonara",
        ingredients: ["🍝", "🥓", "🥚"],
        points: 120,
        timeBonus: 12,
        difficulty: 2,
        category: "Italian",
        technique: "slow_cook",
        qualityThreshold: 0.8,
        timeLimit: 20,
      },
      {
        name: "🥗 Caesar Salad",
        ingredients: ["🥬", "🧀", "🥖"],
        points: 80,
        timeBonus: 8,
        difficulty: 1,
        category: "Salad",
        technique: "precise_cut",
        qualityThreshold: 0.6,
        timeLimit: 12,
      },
      {
        name: "🍔 Classic Burger",
        ingredients: ["🥩", "🧀", "🥬"],
        points: 150,
        timeBonus: 15,
        difficulty: 2,
        category: "American",
        technique: "quick_fry",
        qualityThreshold: 0.75,
        timeLimit: 18,
      },
      {
        name: "🍜 Ramen Bowl",
        ingredients: ["🍜", "🥚", "🥬"],
        points: 130,
        timeBonus: 13,
        difficulty: 2,
        category: "Asian",
        technique: "slow_cook",
        qualityThreshold: 0.8,
        timeLimit: 25,
      },
      {
        name: "🥪 Club Sandwich",
        ingredients: ["🍞", "🥩", "🥬"],
        points: 110,
        timeBonus: 11,
        difficulty: 2,
        category: "American",
        technique: "precise_cut",
        qualityThreshold: 0.7,
        timeLimit: 16,
      },
      {
        name: "🍣 Sushi Roll",
        ingredients: ["🍚", "🐟", "🥒"],
        points: 160,
        timeBonus: 16,
        difficulty: 3,
        category: "Asian",
        technique: "perfect_timing",
        qualityThreshold: 0.9,
        timeLimit: 30,
      },
      {
        name: "🥘 Paella",
        ingredients: ["🍚", "🦐", "🥬"],
        points: 180,
        timeBonus: 18,
        difficulty: 3,
        category: "Spanish",
        technique: "slow_cook",
        qualityThreshold: 0.85,
        timeLimit: 35,
      },
      {
        name: "🍖 BBQ Ribs",
        ingredients: ["🥩", "🌽", "🥬"],
        points: 200,
        timeBonus: 20,
        difficulty: 3,
        category: "American",
        technique: "master_technique",
        qualityThreshold: 0.9,
        timeLimit: 40,
      },
      {
        name: "🥘 Curry",
        ingredients: ["🍚", "🥕", "🥩"],
        points: 140,
        timeBonus: 14,
        difficulty: 2,
        category: "Indian",
        technique: "pressure_cook",
        qualityThreshold: 0.8,
        timeLimit: 22,
      },
      // Special recipes for Hemal
      {
        name: "👑 Royal Chocolate Cake",
        ingredients: ["🍫", "🥚", "🧈"],
        points: 300,
        timeBonus: 25,
        difficulty: 3,
        category: "Dessert",
        special: "hemal",
        technique: "master_technique",
        qualityThreshold: 0.9,
        timeLimit: 35,
      },
      {
        name: "💎 Diamond Ice Cream",
        ingredients: ["🍦", "💎", "🍓"],
        points: 250,
        timeBonus: 20,
        difficulty: 2,
        category: "Dessert",
        special: "hemal",
        technique: "precise_cut",
        qualityThreshold: 0.8,
        timeLimit: 25,
      },
      {
        name: "👸 Princess Smoothie",
        ingredients: ["🍓", "🥭", "🥥"],
        points: 180,
        timeBonus: 15,
        difficulty: 1,
        category: "Drink",
        special: "hemal",
        technique: "speed_cooking",
        qualityThreshold: 0.7,
        timeLimit: 15,
      },
      {
        name: "🌟 Magic Macarons",
        ingredients: ["🍪", "🌈", "🍯"],
        points: 220,
        timeBonus: 18,
        difficulty: 3,
        category: "Dessert",
        special: "hemal",
        technique: "perfect_timing",
        qualityThreshold: 0.85,
        timeLimit: 30,
      },
    ];
  }

  initializeIngredients() {
    return [
      "🍅",
      "🧀",
      "🌿",
      "🍝",
      "🥓",
      "🥚",
      "🥬",
      "🥖",
      "🥩",
      "🍜",
      "🍞",
      "🍚",
      "🐟",
      "🥒",
      "🦐",
      "🌽",
      "🥕",
      "🍄",
      "🧅",
      // Special ingredients for Hemal's recipes
      "🍫",
      "🧈",
      "🍦",
      "💎",
      "🍓",
      "🥭",
      "🥥",
      "🍪",
      "🌈",
      "🍯",
      "🥔",
      "🥦",
      "🥑",
      "🍎",
      "🍌",
      "🍓",
      "🍇",
      "🍊",
      "🍋",
      "🥝",
      "🍍",
    ];
  }

  initializeAchievements() {
    return [
      {
        id: "hemal_special",
        title: "👑 Queen Hemal",
        description: "Special achievement just for you, Queen!",
        icon: "👑",
        condition: (userData) =>
          userData.achievements.includes("hemal_special"),
        reward: { coins: 1000, xp: 2000 },
        special: true,
      },
      {
        id: "hemal_royal_cook",
        title: "👸 Royal Chef",
        description: "Complete 10 special royal recipes",
        icon: "👸",
        condition: (userData) => userData.royalRecipesCompleted >= 10,
        reward: { coins: 1500, xp: 2500 },
        special: true,
      },
      {
        id: "hemal_dessert_master",
        title: "🍰 Dessert Master",
        description: "Master the art of royal desserts",
        icon: "🍰",
        condition: (userData) => userData.dessertsCompleted >= 20,
        reward: { coins: 2000, xp: 3000 },
        special: true,
      },
      {
        id: "first_recipe",
        title: "First Steps",
        description: "Complete your first recipe",
        icon: "🎯",
        condition: (userData) => userData.gamesPlayed >= 1,
        reward: { coins: 50, xp: 100 },
      },
      {
        id: "combo_master",
        title: "Combo Master",
        description: "Achieve a 5x combo",
        icon: "🔥",
        condition: (userData) => userData.bestCombo >= 5,
        reward: { coins: 200, xp: 300 },
      },
      {
        id: "score_champion",
        title: "Score Champion",
        description: "Reach 1000 total score",
        icon: "🏆",
        condition: (userData) => userData.totalScore >= 1000,
        reward: { coins: 500, xp: 500 },
      },
      {
        id: "level_up",
        title: "Level Up",
        description: "Reach level 5",
        icon: "⭐",
        condition: (userData) => userData.level >= 5,
        reward: { coins: 300, xp: 400 },
      },
      {
        id: "recipe_collector",
        title: "Recipe Collector",
        description: "Complete 50 recipes",
        icon: "📚",
        condition: (userData) => userData.totalRecipesCompleted >= 50,
        reward: { coins: 1000, xp: 800 },
      },
    ];
  }

  initializeShopItems() {
    return {
      powerups: [
        {
          id: "freeze_time_pack",
          name: "Freeze Time Pack",
          description: "Get 5 freeze time power-ups",
          icon: "⏸️",
          price: { coins: 100 },
          type: "powerup",
          effect: { freezeTime: 5 },
        },
        {
          id: "hint_pack",
          name: "Hint Pack",
          description: "Get 10 hint power-ups",
          icon: "💡",
          price: { coins: 150 },
          type: "powerup",
          effect: { hint: 10 },
        },
      ],
      skins: [
        {
          id: "chef_hat",
          name: "Chef Hat",
          description: "Professional chef hat",
          icon: "👨‍🍳",
          price: { gems: 5 },
          type: "skin",
        },
        {
          id: "master_chef",
          name: "Master Chef",
          description: "Master chef outfit",
          icon: "👨‍🍳",
          price: { gems: 15 },
          type: "skin",
        },
      ],
      recipes: [
        {
          id: "special_pizza",
          name: "Special Pizza",
          description: "Unlock special pizza recipe",
          icon: "🍕",
          price: { coins: 500 },
          type: "recipe",
        },
      ],
    };
  }

  // Game Logic
  startGame() {
    // Check if user is authenticated
    if (!this.isAuthenticated || !this.currentUser) {
      this.showNotification("Please sign in or play as guest first", "error");
      return;
    }

    const userData = this.getUserData();
    this.gameData = {
      score: 0,
      level: userData.level,
      timeLeft: 60,
      gameRunning: true,
      isPaused: false,
      combo: 0,
      maxCombo: 0,
      selectedIngredients: [],
      currentRecipe: null,
      availableIngredients: [],
      recipesCompleted: 0,
      powerUps: { ...userData.inventory },
      activeEffects: [],
      timer: null,
      // Initialize new mechanics
      ingredientQuality: {},
      cookingTechnique: null,
      timePressure: 1.0 + userData.level * 0.1, // Increases with level
      difficultyMultiplier: 1.0 + userData.level * 0.15,
      streakBonus: 0,
      mistakes: 0,
      perfectRecipes: 0,
      lastRecipeTime: 0,
      averageRecipeTime: 0,
      challengeMode: Math.random() < 0.2, // 20% chance for challenge mode
      bossRecipes: [],
      ingredientDecay: {},
      cookingPressure: 0,
      recentRecipes: [], // Track recent recipes to prevent repetition
    };

    // Initialize ingredient quality and decay
    this.initializeIngredientQuality();

    this.updateGameUI();
    this.generateNewRecipe();
    this.generateIngredients();
    this.showScreen("game-screen");
    this.startTimer();
    this.updatePowerUps();

    // Show challenge mode notification
    if (this.gameData.challengeMode) {
      this.showNotification(
        "🔥 CHALLENGE MODE ACTIVATED! Time pressure increased!",
        "warning"
      );
    }
  }

  // Initialize ingredient quality system
  initializeIngredientQuality() {
    this.ingredients.forEach((ingredient) => {
      this.gameData.ingredientQuality[ingredient] = Math.random() * 0.4 + 0.6; // 0.6 to 1.0
      this.gameData.ingredientDecay[ingredient] = 0;
    });
  }

  // Enhanced timer with pressure system
  startTimer() {
    this.gameData.timer = setInterval(() => {
      if (!this.gameData.isPaused && this.gameData.gameRunning) {
        // Apply time pressure
        const timeReduction = this.gameData.timePressure;
        this.gameData.timeLeft -= timeReduction;

        // Update ingredient decay
        this.updateIngredientDecay();

        this.updateTimer();

        if (this.gameData.timeLeft <= 0) {
          this.gameOver();
        }
      }
    }, 1000);
  }

  // Update ingredient decay over time
  updateIngredientDecay() {
    Object.keys(this.gameData.ingredientDecay).forEach((ingredient) => {
      this.gameData.ingredientDecay[ingredient] += 0.01;
      if (this.gameData.ingredientDecay[ingredient] > 0.5) {
        this.gameData.ingredientQuality[ingredient] *= 0.99; // Decay quality
      }
    });
  }

  // Enhanced recipe generation with boss recipes and anti-repetition
  generateNewRecipe() {
    const userData = this.getUserData();
    let availableRecipes = this.recipes.filter(
      (recipe) =>
        recipe.ingredients.length <=
          Math.min(3 + Math.floor(this.gameData.level / 3), 5) &&
        (userData.unlockedRecipes.includes(recipe.name) ||
          recipe.difficulty <= 3)
    );

    // Add special recipes for Hemal
    if (
      this.currentUser &&
      this.currentUser.username.toLowerCase() === "hemal"
    ) {
      const specialRecipes = this.recipes.filter(
        (recipe) => recipe.special === "hemal"
      );
      availableRecipes = [...availableRecipes, ...specialRecipes];
    }

    // Add boss recipes based on level and challenge mode
    if (this.gameData.level >= 5 || this.gameData.challengeMode) {
      const bossRecipes = this.recipes.filter((recipe) => recipe.bossRecipe);
      if (bossRecipes.length > 0 && Math.random() < 0.3) {
        // 30% chance for boss recipe
        availableRecipes = [...availableRecipes, ...bossRecipes];
      }
    }

    // Anti-repetition logic: avoid recent recipes
    if (this.gameData.recentRecipes && this.gameData.recentRecipes.length > 0) {
      availableRecipes = availableRecipes.filter(
        (recipe) => !this.gameData.recentRecipes.includes(recipe.name)
      );
    }

    // If no recipes available after filtering, reset recent recipes
    if (availableRecipes.length === 0) {
      this.gameData.recentRecipes = [];
      availableRecipes = this.recipes.filter(
        (recipe) =>
          recipe.ingredients.length <=
            Math.min(3 + Math.floor(this.gameData.level / 3), 5) &&
          (userData.unlockedRecipes.includes(recipe.name) ||
            recipe.difficulty <= 3)
      );
    }

    this.gameData.currentRecipe =
      availableRecipes[Math.floor(Math.random() * availableRecipes.length)];

    // Track recent recipes (keep last 5)
    if (!this.gameData.recentRecipes) {
      this.gameData.recentRecipes = [];
    }
    this.gameData.recentRecipes.push(this.gameData.currentRecipe.name);
    if (this.gameData.recentRecipes.length > 5) {
      this.gameData.recentRecipes.shift();
    }

    // Set cooking technique if recipe has one
    if (
      this.gameData.currentRecipe.technique &&
      this.cookingTechniques[this.gameData.currentRecipe.technique]
    ) {
      this.gameData.cookingTechnique =
        this.cookingTechniques[this.gameData.currentRecipe.technique];
    } else {
      this.gameData.cookingTechnique = null;
    }

    this.gameData.lastRecipeTime = Date.now();

    this.displayRecipe();
  }

  // Enhanced recipe display with technique info
  displayRecipe() {
    const recipeName = document.querySelector(".recipe-name");
    const recipeIngredients = document.querySelector(".recipe-ingredients");
    const difficultyStars = document.querySelector(".difficulty-stars");

    recipeName.textContent = this.gameData.currentRecipe.name;
    recipeIngredients.innerHTML = "";

    this.gameData.currentRecipe.ingredients.forEach((ingredient) => {
      const tag = document.createElement("span");
      tag.className =
        "ingredient-tag bg-white/20 text-white px-3 py-1 rounded-full text-sm";
      tag.textContent = ingredient;
      recipeIngredients.appendChild(tag);
    });

    difficultyStars.textContent = "⭐".repeat(
      this.gameData.currentRecipe.difficulty
    );

    // Add technique display if cooking technique exists
    if (this.gameData.cookingTechnique) {
      const techniqueInfo = document.createElement("div");
      techniqueInfo.className = "mt-2 text-center";
      techniqueInfo.innerHTML = `
        <p class="text-slate-300 text-sm">Technique: <span class="text-primary-400 font-semibold">${
          this.gameData.cookingTechnique.name
        }</span></p>
        <p class="text-slate-300 text-xs">Time Limit: <span class="text-yellow-400">${
          this.gameData.currentRecipe.timeLimit || 20
        }s</span></p>
      `;
      recipeIngredients.appendChild(techniqueInfo);
    }
  }

  // Enhanced ingredient generation with quality indicators
  generateIngredients() {
    const container = document.getElementById("ingredients-container");
    container.innerHTML = "";

    const numIngredients = Math.min(
      12 + Math.floor(this.gameData.level / 2),
      20
    );
    this.gameData.availableIngredients = [];

    // Always include recipe ingredients
    this.gameData.currentRecipe.ingredients.forEach((ingredient) => {
      this.gameData.availableIngredients.push(ingredient);
    });

    // Add random ingredients
    const remainingSlots =
      numIngredients - this.gameData.currentRecipe.ingredients.length;
    for (let i = 0; i < remainingSlots; i++) {
      const randomIngredient =
        this.ingredients[Math.floor(Math.random() * this.ingredients.length)];
      this.gameData.availableIngredients.push(randomIngredient);
    }

    // Shuffle ingredients
    this.gameData.availableIngredients = this.shuffleArray(
      this.gameData.availableIngredients
    );

    // Create ingredient elements with quality indicators
    this.gameData.availableIngredients.forEach((ingredient, index) => {
      const element = document.createElement("div");
      const quality = this.gameData.ingredientQuality[ingredient] || 0.7;

      // Quality-based styling
      let qualityClass = "border-white/30";
      if (quality >= 0.9) qualityClass = "border-green-400 shadow-green-500/25";
      else if (quality >= 0.7)
        qualityClass = "border-yellow-400 shadow-yellow-500/25";
      else qualityClass = "border-red-400 shadow-red-500/25";

      element.className = `aspect-square border-2 ${qualityClass} rounded-xl flex items-center justify-center text-3xl cursor-pointer transition-all duration-300 bg-white/10 backdrop-blur-sm hover:scale-110 hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/25 relative`;
      element.textContent = ingredient;
      element.dataset.index = index;

      // Add quality indicator
      if (quality < 0.7) {
        const decayIndicator = document.createElement("div");
        decayIndicator.className =
          "absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full";
        element.appendChild(decayIndicator);
      }

      element.addEventListener("click", () => this.selectIngredient(index));
      container.appendChild(element);
    });
  }

  selectIngredient(index) {
    const ingredient = this.gameData.availableIngredients[index];
    const element = document.querySelector(`[data-index="${index}"]`);

    if (this.gameData.selectedIngredients.includes(ingredient)) {
      // Deselect ingredient
      this.gameData.selectedIngredients =
        this.gameData.selectedIngredients.filter((i) => i !== ingredient);
      element.classList.remove(
        "selected",
        "bg-gradient-to-br",
        "from-primary-500",
        "to-royal-500",
        "text-white",
        "scale-110",
        "rotate-3",
        "shadow-xl",
        "shadow-primary-500/50"
      );
      element.classList.add("bg-white/10", "border-white/30");
    } else {
      // Select ingredient
      this.gameData.selectedIngredients.push(ingredient);
      element.classList.remove("bg-white/10", "border-white/30");
      element.classList.add(
        "selected",
        "bg-gradient-to-br",
        "from-primary-500",
        "to-royal-500",
        "text-white",
        "scale-110",
        "rotate-3",
        "shadow-xl",
        "shadow-primary-500/50"
      );
    }

    this.updateCookingPot();
    this.checkRecipeMatch();
  }

  updateCookingPot() {
    const pot = document.getElementById("cooked-ingredients");
    pot.innerHTML = "";

    this.gameData.selectedIngredients.forEach((ingredient) => {
      const element = document.createElement("div");
      element.className =
        "bg-white/90 rounded-full w-8 h-8 flex items-center justify-center text-sm animate-pulse";
      element.textContent = ingredient;
      pot.appendChild(element);
    });
  }

  checkRecipeMatch() {
    const cookButton = document.getElementById("cook-recipe");
    const isMatch = this.isRecipeMatch();
    cookButton.disabled = !isMatch;

    if (isMatch) {
      cookButton.className =
        "w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105";
    } else {
      cookButton.className =
        "w-full bg-slate-500 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200";
    }
  }

  isRecipeMatch() {
    if (
      this.gameData.selectedIngredients.length !==
      this.gameData.currentRecipe.ingredients.length
    ) {
      return false;
    }

    const sortedSelected = [...this.gameData.selectedIngredients].sort();
    const sortedRequired = [...this.gameData.currentRecipe.ingredients].sort();

    return JSON.stringify(sortedSelected) === JSON.stringify(sortedRequired);
  }

  // Enhanced recipe cooking with quality and technique checks
  cookRecipe() {
    if (!this.isRecipeMatch()) return;

    const recipeTime = (Date.now() - this.gameData.lastRecipeTime) / 1000;
    const timeBonus = Math.max(
      0,
      this.gameData.currentRecipe.timeLimit - recipeTime
    );
    const qualityScore = this.calculateQualityScore();
    const techniqueBonus = this.calculateTechniqueBonus(recipeTime);

    // Calculate base points with all modifiers
    let points = this.gameData.currentRecipe.points;
    points *= this.gameData.difficultyMultiplier;
    points *= qualityScore;
    points *= techniqueBonus;

    // Apply combo bonus
    if (this.gameData.combo > 0) {
      points += Math.floor(points * (this.gameData.combo * 0.2));
    }

    // Apply double points effect
    if (this.gameData.activeEffects.includes("doublePoints")) {
      points *= 2;
    }

    // Apply streak bonus
    if (this.gameData.streakBonus > 0) {
      points += Math.floor(points * (this.gameData.streakBonus * 0.1));
    }

    // Check for perfect recipe
    const qualityThreshold =
      this.gameData.currentRecipe.qualityThreshold || 0.7;
    const timeLimit = this.gameData.currentRecipe.timeLimit || 20;
    const isPerfect =
      qualityScore >= qualityThreshold && recipeTime <= timeLimit;

    if (isPerfect) {
      this.gameData.perfectRecipes++;
      this.gameData.streakBonus++;
      points = Math.floor(points * 1.5); // 50% bonus for perfect
      this.showNotification("✨ PERFECT RECIPE! +50% bonus!", "success");
    } else {
      this.gameData.streakBonus = 0;
      this.gameData.mistakes++;
      this.gameData.cookingPressure += 0.1;
    }

    this.gameData.score += Math.floor(points);
    this.gameData.combo++;
    this.gameData.maxCombo = Math.max(
      this.gameData.maxCombo,
      this.gameData.combo
    );
    this.gameData.timeLeft += this.gameData.currentRecipe.timeBonus + timeBonus;
    this.gameData.recipesCompleted++;
    this.gameData.averageRecipeTime =
      (this.gameData.averageRecipeTime + recipeTime) / 2;

    // Special effects for Hemal
    if (
      this.currentUser &&
      this.currentUser.username.toLowerCase() === "hemal"
    ) {
      const userData = this.getUserData();
      if (this.gameData.currentRecipe.special === "hemal") {
        userData.royalRecipesCompleted =
          (userData.royalRecipesCompleted || 0) + 1;
      }
      if (this.gameData.currentRecipe.category === "Dessert") {
        userData.dessertsCompleted = (userData.dessertsCompleted || 0) + 1;
      }
      this.saveUserData(userData);
      this.showHemalSpecialEffect(Math.floor(points));
    } else {
      this.showSuccessMessage(
        `+${Math.floor(points)} points! ${isPerfect ? "✨" : ""}`
      );
    }

    this.highlightMatchedIngredients();
    this.gameData.selectedIngredients = [];
    this.clearIngredientSelection();

    // Generate new recipe and ingredients
    setTimeout(() => {
      this.generateNewRecipe();
      this.generateIngredients();
      this.updateCookingPot();
      this.checkRecipeMatch();
    }, 1000);

    this.updateGameUI();
  }

  // Calculate quality score based on ingredient quality
  calculateQualityScore() {
    let totalQuality = 0;
    this.gameData.selectedIngredients.forEach((ingredient) => {
      totalQuality += this.gameData.ingredientQuality[ingredient] || 0.7;
    });
    return totalQuality / this.gameData.selectedIngredients.length;
  }

  // Calculate technique bonus based on timing
  calculateTechniqueBonus(recipeTime) {
    const technique = this.gameData.cookingTechnique;
    const timeLimit = this.gameData.currentRecipe.timeLimit || 20;

    if (!technique) return 1.0; // No technique bonus if no technique

    if (recipeTime <= timeLimit * 0.5) return technique.pointsMultiplier * 1.2; // Perfect timing
    if (recipeTime <= timeLimit * 0.8) return technique.pointsMultiplier; // Good timing
    if (recipeTime <= timeLimit) return technique.pointsMultiplier * 0.8; // Acceptable timing
    return technique.pointsMultiplier * 0.5; // Poor timing
  }

  // Enhanced game UI with new mechanics
  updateGameUI() {
    document.getElementById("score").textContent = this.gameData.score;
    document.getElementById("level").textContent = this.gameData.level;
    document.getElementById("combo-display").textContent = this.gameData.combo;
    document.getElementById(
      "recipes-completed"
    ).textContent = `${this.gameData.recipesCompleted}/10`;

    const progressPercentage = (this.gameData.recipesCompleted / 10) * 100;
    document.getElementById(
      "recipe-progress-fill"
    ).style.width = `${progressPercentage}%`;

    // Add new UI elements for enhanced mechanics
    this.updateEnhancedUI();
  }

  // Update enhanced UI elements
  updateEnhancedUI() {
    // Update streak bonus display
    const streakElement = document.getElementById("streak-bonus");
    if (!streakElement) {
      const header = document.querySelector(".glass.rounded-b-3xl");
      if (header) {
        const streakDiv = document.createElement("div");
        streakDiv.className = "text-center";
        streakDiv.innerHTML = `
          <p class="text-slate-300 text-sm">Streak</p>
          <p class="text-purple-400 font-bold text-xl" id="streak-bonus">0</p>
        `;
        header.appendChild(streakDiv);
      }
    } else {
      streakElement.textContent = this.gameData.streakBonus;
    }

    // Update pressure indicator
    const pressureElement = document.getElementById("cooking-pressure");
    if (!pressureElement) {
      const header = document.querySelector(".glass.rounded-b-3xl");
      if (header) {
        const pressureDiv = document.createElement("div");
        pressureDiv.className = "text-center";
        pressureDiv.innerHTML = `
          <p class="text-slate-300 text-sm">Pressure</p>
          <p class="text-red-400 font-bold text-xl" id="cooking-pressure">0</p>
        `;
        header.appendChild(pressureDiv);
      }
    } else {
      pressureElement.textContent = Math.floor(
        this.gameData.cookingPressure * 100
      );
    }
  }

  // Enhanced power-up system
  usePowerUp(type) {
    if (
      this.gameData.powerUps[type] > 0 &&
      this.gameData.gameRunning &&
      !this.gameData.isPaused
    ) {
      this.gameData.powerUps[type]--;

      switch (type) {
        case "freezeTime":
          this.gameData.isPaused = true;
          setTimeout(() => {
            this.gameData.isPaused = false;
          }, 5000);
          this.showSuccessMessage("⏸️ Time Frozen!");
          break;

        case "hint":
          this.showHintMessage();
          this.showSuccessMessage("💡 Hint Used!");
          break;

        case "comboBoost":
          this.gameData.combo += 2;
          this.gameData.streakBonus += 1;
          this.showSuccessMessage("🔥 Combo Boost!");
          break;

        case "doublePoints":
          this.gameData.activeEffects.push("doublePoints");
          setTimeout(() => {
            this.gameData.activeEffects = this.gameData.activeEffects.filter(
              (e) => e !== "doublePoints"
            );
          }, 10000);
          this.showSuccessMessage("⚡ Double Points!");
          break;
      }

      this.updatePowerUps();
    }
  }

  updatePowerUps() {
    document.getElementById("freeze-count").textContent =
      this.gameData.powerUps.freezeTime;
    document.getElementById("hint-count").textContent =
      this.gameData.powerUps.hint;
    document.getElementById("combo-count").textContent =
      this.gameData.powerUps.comboBoost;
    document.getElementById("double-count").textContent =
      this.gameData.powerUps.doublePoints;

    document.getElementById("freeze-time").disabled =
      this.gameData.powerUps.freezeTime <= 0;
    document.getElementById("hint").disabled = this.gameData.powerUps.hint <= 0;
    document.getElementById("combo-boost").disabled =
      this.gameData.powerUps.comboBoost <= 0;
    document.getElementById("double-points").disabled =
      this.gameData.powerUps.doublePoints <= 0;
  }

  updateTimer() {
    const timerFill = document.getElementById("timer-fill");
    const timeLeft = document.getElementById("time-left");
    const percentage = (this.gameData.timeLeft / 60) * 100;

    timerFill.style.width = `${percentage}%`;
    timeLeft.textContent = Math.ceil(this.gameData.timeLeft);

    if (this.gameData.timeLeft <= 10) {
      timerFill.style.background = "linear-gradient(90deg, #e74c3c, #c0392b)";
    }
  }

  // Enhanced game over with new statistics
  gameOver() {
    this.gameData.gameRunning = false;
    if (this.gameData.timer) {
      clearInterval(this.gameData.timer);
    }

    // Calculate rewards with new factors
    const baseCoins = Math.floor(this.gameData.score / 10);
    const baseGems = Math.floor(this.gameData.score / 100);
    const baseXp = Math.floor(this.gameData.score / 5);

    // Bonus for perfect recipes
    const perfectBonus = this.gameData.perfectRecipes * 50;
    const mistakePenalty = this.gameData.mistakes * 10;

    const coinsEarned = Math.max(0, baseCoins + perfectBonus - mistakePenalty);
    const gemsEarned = Math.max(
      0,
      baseGems + Math.floor(this.gameData.perfectRecipes / 3)
    );
    const xpEarned = Math.max(0, baseXp + this.gameData.perfectRecipes * 20);

    // Update user data with new tracking
    const userData = this.getUserData();
    userData.coins += coinsEarned;
    userData.gems += gemsEarned;
    userData.xp += xpEarned;
    userData.totalScore += this.gameData.score;
    userData.bestCombo = Math.max(userData.bestCombo, this.gameData.maxCombo);
    userData.gamesPlayed++;
    userData.totalRecipesCompleted += this.gameData.recipesCompleted;

    // Track new statistics
    userData.perfectRecipesInGame = Math.max(
      userData.perfectRecipesInGame || 0,
      this.gameData.perfectRecipes
    );
    userData.fastestRecipeTime = Math.min(
      userData.fastestRecipeTime || Infinity,
      this.gameData.averageRecipeTime
    );
    userData.maxPerfectStreak = Math.max(
      userData.maxPerfectStreak || 0,
      this.gameData.streakBonus
    );
    userData.maxCookingPressure = Math.max(
      userData.maxCookingPressure || 0,
      Math.floor(this.gameData.cookingPressure * 100)
    );

    if (this.gameData.challengeMode) {
      userData.challengeModeWins = (userData.challengeModeWins || 0) + 1;
    }

    if (this.gameData.currentRecipe && this.gameData.currentRecipe.bossRecipe) {
      userData.bossRecipesCompleted = (userData.bossRecipesCompleted || 0) + 1;
    }

    // Level up logic
    const newLevel = Math.floor(userData.xp / 1000) + 1;
    if (newLevel > userData.level) {
      userData.level = newLevel;
      this.showNotification(
        `🎉 Level Up! You are now level ${newLevel}!`,
        "success"
      );
    }

    this.saveUserData(userData);
    this.checkAchievements(userData);

    // Update game over screen with new stats
    document.getElementById("final-score").textContent = this.gameData.score;
    document.getElementById("final-level").textContent = this.gameData.level;
    document.getElementById("final-combo").textContent = this.gameData.maxCombo;
    document.getElementById("final-recipes").textContent =
      this.gameData.recipesCompleted;
    document.getElementById("coins-earned").textContent = `+${coinsEarned}`;
    document.getElementById("gems-earned").textContent = `+${gemsEarned}`;
    document.getElementById("xp-earned").textContent = `+${xpEarned} XP`;

    // Add new statistics to game over screen
    const statsContainer = document.createElement("div");
    statsContainer.className = "grid grid-cols-2 gap-4 mb-6";
    statsContainer.innerHTML = `
      <div class="bg-white/10 rounded-lg p-4">
        <p class="text-slate-300 text-sm">Perfect Recipes</p>
        <p class="text-green-400 font-bold text-xl">${
          this.gameData.perfectRecipes
        }</p>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <p class="text-slate-300 text-sm">Mistakes</p>
        <p class="text-red-400 font-bold text-xl">${this.gameData.mistakes}</p>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <p class="text-slate-300 text-sm">Avg Recipe Time</p>
        <p class="text-blue-400 font-bold text-xl">${this.gameData.averageRecipeTime.toFixed(
          1
        )}s</p>
      </div>
      <div class="bg-white/10 rounded-lg p-4">
        <p class="text-slate-300 text-sm">Challenge Mode</p>
        <p class="text-purple-400 font-bold text-xl">${
          this.gameData.challengeMode ? "Yes" : "No"
        }</p>
      </div>
    `;

    const gameOverContent = document.querySelector(
      "#game-over-screen .text-center"
    );
    const existingStats = gameOverContent.querySelector(".grid.grid-cols-3");
    if (existingStats) {
      existingStats.parentNode.insertBefore(
        statsContainer,
        existingStats.nextSibling
      );
    }

    this.showScreen("game-over-screen");
  }

  checkAchievements(userData) {
    const newAchievements = [];

    this.achievements.forEach((achievement) => {
      if (
        !userData.achievements.includes(achievement.id) &&
        achievement.condition(userData)
      ) {
        userData.achievements.push(achievement.id);
        userData.coins += achievement.reward.coins;
        userData.xp += achievement.reward.xp;
        newAchievements.push(achievement);
      }
    });

    if (newAchievements.length > 0) {
      this.saveUserData(userData);
      this.displayAchievementsUnlocked(newAchievements);
    }
  }

  displayAchievementsUnlocked(achievements) {
    const container = document.getElementById("achievements-unlocked");
    container.innerHTML =
      "<h3 class='text-white text-xl font-bold mb-4'>🏆 New Achievements Unlocked!</h3>";

    achievements.forEach((achievement) => {
      const element = document.createElement("div");
      element.className =
        "bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 flex items-center space-x-4 mb-3 border-2 border-yellow-300";
      element.innerHTML = `
        <span class="text-3xl">${achievement.icon}</span>
        <div class="flex-1">
          <div class="text-slate-800 font-bold text-lg">${achievement.title}</div>
          <div class="text-slate-600 text-sm">${achievement.description}</div>
        </div>
      `;
      container.appendChild(element);
    });
  }

  // Screen Methods
  showAchievements() {
    const container = document.getElementById("achievements-container");
    container.innerHTML = "";

    const userData = this.getUserData();

    this.achievements.forEach((achievement) => {
      const isUnlocked = userData.achievements.includes(achievement.id);
      const element = document.createElement("div");

      if (achievement.special && isUnlocked) {
        // Special styling for Hemal's achievements
        element.className =
          "bg-gradient-to-r from-royal-500 to-primary-500 text-white p-6 rounded-2xl shadow-xl animate-pulse-slow border-2 border-white/20";
      } else if (isUnlocked) {
        element.className =
          "bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl shadow-lg border border-yellow-200";
      } else {
        element.className =
          "bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 opacity-60";
      }

      element.innerHTML = `
        <div class="flex items-center space-x-4">
          <span class="text-4xl">${achievement.icon}</span>
          <div class="flex-1">
            <h4 class="font-bold text-lg mb-2 ${
              isUnlocked ? "text-slate-800" : "text-slate-300"
            }">${achievement.title}</h4>
            <p class="text-sm ${
              isUnlocked ? "text-slate-600" : "text-slate-400"
            } mb-3">${achievement.description}</p>
            <div class="text-sm font-semibold ${
              isUnlocked ? "text-green-600" : "text-slate-400"
            }">
              ${isUnlocked ? "✅ Unlocked" : "🔒 Locked"}
            </div>
          </div>
        </div>
      `;
      container.appendChild(element);
    });

    this.showScreen("achievements-screen");
  }

  showLeaderboard() {
    const container = document.getElementById("leaderboard-container");
    container.innerHTML = "";

    // Get leaderboard data
    const leaderboardData = this.getLeaderboardData();

    leaderboardData.forEach((entry, index) => {
      const element = document.createElement("div");
      element.className =
        "bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-4 shadow-lg";

      let rankClass = "text-slate-400";
      if (index === 0) rankClass = "text-yellow-400";
      else if (index === 1) rankClass = "text-gray-400";
      else if (index === 2) rankClass = "text-amber-600";

      element.innerHTML = `
        <div class="text-2xl font-bold ${rankClass} min-w-[40px]">${
        index + 1
      }</div>
        <div class="flex items-center space-x-3 flex-1">
          <span class="text-2xl">${entry.avatar}</span>
          <span class="text-white font-semibold">${entry.username}</span>
        </div>
        <div class="text-white font-bold text-lg">${entry.score}</div>
      `;
      container.appendChild(element);
    });

    this.showScreen("leaderboard-screen");
  }

  getLeaderboardData() {
    // In a real app, this would fetch from a server
    // For now, we'll use local storage
    const allUsers = [];
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (key.startsWith("userData_")) {
        const userData = JSON.parse(localStorage.getItem(key));
        const userId = key.replace("userData_", "");
        const user = JSON.parse(localStorage.getItem("timeChefUser") || "{}");

        if (user.id === userId) {
          allUsers.push({
            username: user.username,
            avatar: userData.currentSkin,
            score: userData.totalScore,
          });
        }
      }
    });

    return allUsers.sort((a, b) => b.score - a.score).slice(0, 10);
  }

  showShop() {
    this.updateShopUI();
    this.showScreen("shop-screen");
  }

  switchShopCategory(category) {
    // Update active category styling
    document.querySelectorAll(".shop-category").forEach((cat) => {
      cat.classList.remove("bg-primary-500", "text-white");
      cat.classList.add("bg-white/10", "text-white");
    });

    const activeCategory = document.querySelector(
      `[data-category="${category}"]`
    );
    if (activeCategory) {
      activeCategory.classList.remove("bg-white/10");
      activeCategory.classList.add("bg-primary-500");
    }

    this.updateShopUI();
  }

  updateShopUI() {
    const container = document.getElementById("shop-container");
    container.innerHTML = "";

    const userData = this.getUserData();
    const currentCategory =
      document.querySelector(".shop-category.bg-primary-500")?.dataset
        .category || "powerups";
    const items = this.shopItems[currentCategory] || [];

    items.forEach((item) => {
      const element = document.createElement("div");
      element.className =
        "bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105";

      const canAfford = item.price.coins
        ? userData.coins >= item.price.coins
        : userData.gems >= item.price.gems;
      const isOwned =
        item.type === "skin" ? userData.unlockedSkins.includes(item.id) : false;

      element.innerHTML = `
        <div class="text-5xl mb-4">${item.icon}</div>
        <div class="text-white font-bold text-lg mb-2">${item.name}</div>
        <div class="text-slate-300 text-sm mb-4">${item.description}</div>
        <div class="text-primary-400 font-bold text-lg mb-4">
          ${
            item.price.coins
              ? `💰 ${item.price.coins}`
              : `💎 ${item.price.gems}`
          }
        </div>
        <button class="w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
          isOwned
            ? "bg-green-500/20 text-green-400 cursor-not-allowed"
            : canAfford
            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transform hover:scale-105"
            : "bg-slate-500/50 text-slate-400 cursor-not-allowed"
        }" data-item="${item.id}" ${!canAfford || isOwned ? "disabled" : ""}>
          ${isOwned ? "✅ Owned" : canAfford ? "Buy Now" : "Not Enough"}
        </button>
      `;

      element.querySelector("button").addEventListener("click", () => {
        this.buyShopItem(item);
      });

      container.appendChild(element);
    });
  }

  buyShopItem(item) {
    const userData = this.getUserData();

    if (item.price.coins && userData.coins >= item.price.coins) {
      userData.coins -= item.price.coins;
    } else if (item.price.gems && userData.gems >= item.price.gems) {
      userData.gems -= item.price.gems;
    } else {
      this.showNotification("Not enough currency!", "error");
      return;
    }

    switch (item.type) {
      case "powerup":
        Object.keys(item.effect).forEach((key) => {
          userData.inventory[key] += item.effect[key];
        });
        break;
      case "skin":
        userData.unlockedSkins.push(item.id);
        break;
      case "recipe":
        userData.unlockedRecipes.push(item.name);
        break;
    }

    this.saveUserData(userData);
    this.updateShopUI();
    this.showNotification(`Successfully purchased ${item.name}!`, "success");
  }

  showProfile() {
    this.updateUserInterface();
    this.showScreen("profile-screen");
  }

  // Utility Methods
  showHemalSpecialEffect(points) {
    // Create professional special effect for Hemal
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-gradient-to-br from-royal-500/30 to-primary-500/30 z-40 pointer-events-none transition-opacity duration-1000";
    document.body.appendChild(overlay);

    // Create special message
    const message = document.createElement("div");
    message.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-royal-500 to-primary-500 text-white p-8 rounded-3xl text-center border-2 border-white/30 shadow-2xl z-50";
    message.innerHTML = `
      <div class="text-5xl mb-4 animate-bounce">👑</div>
      <div class="text-2xl font-bold mb-2">Royal Recipe Complete!</div>
      <div class="text-xl font-semibold text-yellow-200">+${points} points!</div>
    `;
    document.body.appendChild(message);

    // Add floating crowns
    for (let i = 0; i < 6; i++) {
      const crown = document.createElement("div");
      crown.innerHTML = "👑";
      crown.className =
        "fixed text-3xl text-yellow-400 z-50 pointer-events-none animate-float";
      crown.style.cssText = `
        left: ${15 + Math.random() * 70}%;
        top: ${15 + Math.random() * 70}%;
        animation-delay: ${Math.random() * 1}s;
      `;
      document.body.appendChild(crown);
    }

    // Remove elements after animation
    setTimeout(() => {
      overlay.classList.add("opacity-0");
      message.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        overlay.remove();
        message.remove();
        document.querySelectorAll(".animate-float").forEach((el) => {
          if (el.innerHTML === "👑") el.remove();
        });
      }, 300);
    }, 1500);
  }

  showSuccessMessage(message) {
    const notification = document.createElement("div");
    notification.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-full text-xl font-semibold z-40 animate-bounce shadow-2xl";
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("opacity-0", "scale-95");
      setTimeout(() => notification.remove(), 300);
    }, 1500);
  }

  highlightMatchedIngredients() {
    this.gameData.selectedIngredients.forEach((ingredient) => {
      const elements = document.querySelectorAll(`[data-index]`);
      elements.forEach((element) => {
        if (element.textContent === ingredient) {
          element.classList.add(
            "bg-gradient-to-br",
            "from-green-500",
            "to-green-600",
            "text-white",
            "scale-125",
            "rotate-6",
            "shadow-2xl",
            "shadow-green-500/50"
          );
          setTimeout(() => {
            element.classList.remove(
              "bg-gradient-to-br",
              "from-green-500",
              "to-green-600",
              "text-white",
              "scale-125",
              "rotate-6",
              "shadow-2xl",
              "shadow-green-500/50"
            );
          }, 1000);
        }
      });
    });
  }

  clearIngredientSelection() {
    document.querySelectorAll("[data-index]").forEach((element) => {
      element.classList.remove(
        "selected",
        "bg-gradient-to-br",
        "from-primary-500",
        "to-royal-500",
        "text-white",
        "scale-110",
        "rotate-3",
        "shadow-xl",
        "shadow-primary-500/50"
      );
      element.classList.add("bg-white/10", "border-white/30");
    });
  }

  pauseGame() {
    if (this.gameData.gameRunning && !this.gameData.isPaused) {
      this.gameData.isPaused = true;
      this.showScreen("pause-screen");
    }
  }

  resumeGame() {
    if (this.gameData.gameRunning && this.gameData.isPaused) {
      this.gameData.isPaused = false;
      this.showScreen("game-screen");
    }
  }

  quitGame() {
    this.gameData.gameRunning = false;
    this.gameData.isPaused = false;
    if (this.gameData.timer) {
      clearInterval(this.gameData.timer);
    }
    this.showScreen("main-menu");
  }

  handleKeyPress(e) {
    if (!this.gameData.gameRunning || this.gameData.isPaused) return;

    switch (e.key.toLowerCase()) {
      case "f":
        this.usePowerUp("freezeTime");
        break;
      case "h":
        this.usePowerUp("hint");
        break;
      case "b":
        this.usePowerUp("comboBoost");
        break;
      case "d":
        this.usePowerUp("doublePoints");
        break;
      case "escape":
        this.pauseGame();
        break;
    }
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // New hint system that provides subtle clues
  showHintMessage() {
    const recipe = this.gameData.currentRecipe;
    const hints = [
      `💡 Think about ${recipe.category} cuisine...`,
      `💡 This dish has ${recipe.ingredients.length} main ingredients`,
      `💡 Look for ingredients that go well together`,
      `💡 Consider the cooking technique: ${
        recipe.technique
          ? this.cookingTechniques[recipe.technique].name
          : "Standard cooking"
      }`,
      `💡 This is a ${recipe.difficulty}-star difficulty recipe`,
      `💡 Focus on fresh, quality ingredients`,
      `💡 Remember the recipe name: ${recipe.name}`,
      `💡 Check the ingredient quality indicators`,
      `💡 This dish is popular in ${recipe.category} restaurants`,
      `💡 Think about traditional ${recipe.category} cooking methods`,
    ];

    // Get a random hint
    const randomHint = hints[Math.floor(Math.random() * hints.length)];

    // Create hint notification
    const hintNotification = document.createElement("div");
    hintNotification.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-6 rounded-2xl text-lg font-semibold z-50 shadow-2xl border-2 border-yellow-300 max-w-md text-center";
    hintNotification.innerHTML = `
      <div class="text-3xl mb-3">💡</div>
      <div class="text-white font-bold">${randomHint}</div>
    `;
    document.body.appendChild(hintNotification);

    // Add subtle ingredient glow effect (not direct highlighting)
    const ingredients = document.querySelectorAll(`[data-index]`);
    ingredients.forEach((element) => {
      if (recipe.ingredients.includes(element.textContent)) {
        element.classList.add("animate-pulse");
        element.style.filter = "brightness(1.2)";
      }
    });

    // Remove hint after 3 seconds
    setTimeout(() => {
      hintNotification.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        hintNotification.remove();
        // Remove glow effect
        ingredients.forEach((element) => {
          element.classList.remove("animate-pulse");
          element.style.filter = "";
        });
      }, 300);
    }, 3000);
  }
}

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new TimeChefGame();
});
