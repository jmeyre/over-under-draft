// export interface Team {
//   country: {
//     code: string;
//     flag: string;
//     id: number;
//     name: string;
//   };
//   description: string | null;
//   form: string;
//   games: {
//     lose: {
//       total: number;
//       percentage: string;
//     };
//     played: number;
//     win: {
//       total: number;
//       percentage: string;
//     };
//   };
//   group: {
//     points: string | null;
//     name: string;
//   };
//   league: {
//     id: number;
//     logo: string;
//     name: string;
//     season: string;
//     type: string;
//   };
//   points: {
//     against: number;
//     for: number;
//   };
//   position: number;
//   stage: string;
//   team: {
//     id: number;
//     logo: string;
//     name: string;
//   };
// }

// export interface ApiResponse {
//   errors: [];
//   get: string;
//   parameters: {
//     league: string;
//     season: string;
//   };
//   response: Team[][];
// };

export const getStandings = async () => {
  const response = await fetch("https://api-basketball.p.rapidapi.com/standings?league=12&season=2021-2022", {
    "method": "GET",
    "headers": {
        "x-rapidapi-host": "api-basketball.p.rapidapi.com",
        "x-rapidapi-key": process.env.REACT_APP_RAPIDAPI_KEY ?? ''
    }
  });
  const body = await response.json();
  return body;
}