export class EloCalculator {
  private static readonly K_FACTOR = 15
  private static readonly BASE_ELO = 2000

  static calculateEloChange(winnerElo: number, loserElo: number): number {
    const expectedScore = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400))
    return Math.round(this.K_FACTOR * (1 - expectedScore))
  }

  static calculateNewElos(winnerElo: number, loserElo: number): {
    winnerNewElo: number
    loserNewElo: number
    winnerChange: number
    loserChange: number
  } {
    const winnerChange = this.calculateEloChange(winnerElo, loserElo)
    const loserChange = -winnerChange

    return {
      winnerNewElo: winnerElo + winnerChange,
      loserNewElo: loserElo + loserChange,
      winnerChange,
      loserChange
    }
  }

  static getBaseElo(): number {
    return this.BASE_ELO
  }

  static getKFactor(): number {
    return this.K_FACTOR
  }
}

