declare interface IRound {
  id: string;
  name: string;
  status: string;
  createdAt?: Date;
}

declare interface INewRound {
  name: string;
  championshipId: string;
}

declare interface INewRoundForm {
  name: string;
}

declare interface IRoundWithMatchsAndChampionship {
  id: string;
  name: string;
  status: string;
  createdAt?: Date;
  matchs: IMatchRound[];
  championship: {
    name: string;
  };
}

declare interface IRoundWithMatchAndChampionship {
  id: string;
  name: string;
  status: string;
  createdAt?: Date;
  match: IMatchRound;
  championship: {
    name: string;
  };
}

declare interface IMatchRound {
  creator: {
    fullName: string;
  } | null;
  lastPlayerTeam: {
    id: string;
    name: string;
  } | null;
  scoreAway: number;
  scoreHome: number;
  status: string;
  date: string;
  teamAway: {
    name: string;
  };
  teamHome: {
    name: string;
  };
}

declare enum RoundStatus {
  "WAITING",
  "IN_PROGRESS",
  "DONE",
  "CANCELED",
  "INACTIVE",
}
