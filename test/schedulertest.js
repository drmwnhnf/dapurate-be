async function ensureTodayScoreExists() {
    console.log('Ensuring today\'s score exists');

    setTimeout(ensureTodayScoreExists, 1000);
}

ensureTodayScoreExists();