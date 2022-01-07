export const getProjectedWins = (wins, losses) => {
  let gamesCount = wins + losses;
  let winRate = wins / gamesCount;
  return Math.round(winRate * 82);
};
