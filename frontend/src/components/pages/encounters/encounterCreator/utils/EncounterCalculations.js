// XP threshold data for D&D 5e
const xpThresholds = {
    1: {easy: 25, medium: 50, hard: 75, deadly: 100},
    2: {easy: 50, medium: 100, hard: 150, deadly: 200},
    3: {easy: 75, medium: 150, hard: 225, deadly: 300},
    4: {easy: 125, medium: 250, hard: 375, deadly: 500},
    5: {easy: 250, medium: 500, hard: 750, deadly: 1100},
    6: {easy: 300, medium: 600, hard: 900, deadly: 1400},
    7: {easy: 350, medium: 750, hard: 1100, deadly: 1700},
    8: {easy: 450, medium: 900, hard: 1400, deadly: 2100},
    9: {easy: 550, medium: 1100, hard: 1600, deadly: 2400},
    10: {easy: 600, medium: 1200, hard: 1900, deadly: 2800},
    11: {easy: 800, medium: 1600, hard: 2400, deadly: 3600},
    12: {easy: 1000, medium: 2000, hard: 3000, deadly: 4500},
    13: {easy: 1100, medium: 2200, hard: 3400, deadly: 5100},
    14: {easy: 1250, medium: 2500, hard: 3800, deadly: 5700},
    15: {easy: 1400, medium: 2800, hard: 4300, deadly: 6400},
    16: {easy: 1600, medium: 3200, hard: 4800, deadly: 7200},
    17: {easy: 2000, medium: 4100, hard: 6100, deadly: 9200},
    18: {easy: 2100, medium: 4900, hard: 7300, deadly: 10900},
    19: {easy: 2400, medium: 5700, hard: 8500, deadly: 12700},
    20: {easy: 2800, medium: 6600, hard: 9900, deadly: 14800},
};

// XP values for D&D 5e CR
const crToXp = {
    "0": 10, "1/8": 25, "1/4": 50, "1/2": 100, "1": 200, "2": 450, "3": 700, "4": 1100,
    "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900, "11": 7200, "12": 8400,
    "13": 10000, "14": 11500, "15": 13000, "16": 15000, "17": 18000, "18": 20000, "19": 22000,
    "20": 24000, "21": 28000, "22": 33000, "23": 41000, "24": 50000, "25": 62000, "26": 75000,
    "27": 90000, "28": 105000, "29": 120000, "30": 155000
};

export const calculatePartyXpThresholds = (selectedPlayers) => {
    return selectedPlayers.reduce((thresholds, player) => {
        const level = player.character_level;
        const playerThresholds = xpThresholds[level] || { easy: 0, medium: 0, hard: 0, deadly: 0 };
        thresholds.easy += playerThresholds.easy;
        thresholds.medium += playerThresholds.medium;
        thresholds.hard += playerThresholds.hard;
        thresholds.deadly += playerThresholds.deadly;
        return thresholds;
    }, { easy: 0, medium: 0, hard: 0, deadly: 0 });
};

export const calculateMonsterXp = (selectedMonsters) => {
    return selectedMonsters.reduce((sum, monster) => {
        const xpValue = crToXp[monster.cr];
        return sum + (xpValue || 0);
    }, 0);
};