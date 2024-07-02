declare interface IChampionship {
  id: string;
  name: string;
  status: string;
  createdAt?: Date;
}

declare interface INewChampionship {
  name: string;
}

declare interface IChampionshipWithRounds {
  id: string;
  name: string;
  status: string;
  rounds: {
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    matchs: {
      id: string;
      scoreAway: number;
      scoreHome: number;
      status: string;
      date: Date;
      players: {
        name: string;
        id: string;
      }[];
      lastPlayerTeam: {
        id: string;
        name: string;
      };
      teamAway: {
        name: string;
      };
      teamHome: {
        name: string;
      };
    }[];
  }[];
}
