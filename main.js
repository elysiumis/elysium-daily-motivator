/**
 * Daily Motivator Plugin for Elysium
 * Shows inspirational quotes when habits are completed
 * and celebrates streak milestones.
 */

const quotes = {
  motivation: [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" }
  ],
  productivity: [
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" }
  ],
  mindfulness: [
    { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh" },
    { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" }
  ],
  success: [
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" }
  ]
};

const streakMessages = {
  3: "3 day streak! You're building momentum!",
  7: "One week streak! You're on fire!",
  14: "Two weeks strong! This is becoming a habit!",
  21: "21 days - they say it takes 21 days to form a habit. You did it!",
  30: "30 day streak! A full month of consistency!",
  50: "50 days! You're unstoppable!",
  100: "100 DAY STREAK! You're a legend!",
  365: "ONE YEAR STREAK! Absolutely incredible!"
};

function onLoad() {
  elysium.console.log("Daily Motivator plugin loaded!");
}

function onEnable() {
  elysium.console.log("Daily Motivator enabled");
}

function onDisable() {
  elysium.console.log("Daily Motivator disabled");
}

function getRandomQuote(category) {
  const categoryQuotes = quotes[category] || quotes.motivation;
  return categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
}

function getStreakCelebration(streak) {
  if (streakMessages[streak]) return streakMessages[streak];
  if (streak > 100 && streak % 100 === 0) return `${streak} day streak! Phenomenal!`;
  return null;
}

function onHabitCompleted(data) {
  const settings = elysium.storage.get() || {};
  const enableStreakCelebration = settings.enableStreakCelebration !== false;
  const quoteCategory = settings.quoteCategory || "motivation";

  elysium.habits.get(data.habitId).then(habit => {
    if (!habit) return;

    if (enableStreakCelebration && habit.currentStreak > 0) {
      const celebration = getStreakCelebration(habit.currentStreak);
      if (celebration) {
        elysium.ui.showNotification({ title: "Streak Milestone!", message: celebration, type: "success" });
        return;
      }
    }

    const quote = getRandomQuote(quoteCategory);
    elysium.ui.showNotification({
      title: "Great job!",
      message: `"${quote.text}" — ${quote.author}`,
      type: "info"
    });
  });
}

function showQuote() {
  const settings = elysium.storage.get() || {};
  const quote = getRandomQuote(settings.quoteCategory || "motivation");
  elysium.ui.showNotification({
    title: "Daily Quote",
    message: `"${quote.text}" — ${quote.author}`,
    type: "info"
  });
}

elysium.events.on("habit.completed", onHabitCompleted);
elysium.commands.register("show-quote", showQuote);

module.exports = { onLoad, onEnable, onDisable };
