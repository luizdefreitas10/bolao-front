import { isAfter, isPast } from "date-fns";
import * as yup from "yup";

export const matchesSchema = yup.object().shape({
  matches: yup.array().of(
    yup.object().shape({
      homeTeam: yup.string().required("Time da casa é obrigatório"),
      awayTeam: yup
        .string()
        .required("Time visitante é obrigatório")
        .notOneOf(
          [yup.ref("homeTeam"), null],
          "Times da casa e visitante não podem ser iguais"
        ),
      round: yup.string().required("Rodada é obrigatória"),
      dateTime: yup
        .date()
        .required("Data e hora são obrigatórias")
        .test(
          "is-future-date",
          "Data e hora não podem estar no passado",
          (value) => {
            return value ? !isPast(new Date(value)) : false;
          }
        ),
      // lastPlayerCheckbox: yup.boolean(),
      // lastPlayerTeam: yup
      //   .string()
      //   .when("lastPlayerCheckbox", (isRequired, schema) =>
      //     isRequired
      //       ? yup
      //           .string()
      //           .required(
      //             "Campo Selecione o time do último marcador obrigatório. "
      //           )
      //       : schema
      //   ),
      // players: yup
      //   .array()
      //   .of(
      //     yup.object().shape({
      //       name: yup
      //         .string()
      //         .required("Campo Nome Obrigatório.")
      //         .min(5, "O nome deve ter no mínimo 5 caracteres."),
      //     })
      //   )
      //   .required("É necessário ter pelo menos um nome."),
    })
  ),
});

export const schemaSetResultMatch = (
  players: IPlayer[]
): yup.ObjectSchema<ISetResultMatch> =>
  yup
    .object({
      scoreAway: yup.number().required("Campo Placa Fora Obrigatório."),
      scoreHome: yup.number().required("Campo Placar Casa Obrigatório."),
      lastPlayerId: yup
        .string()
        .test(
          "required-if-players",
          "Campo Último Jogador Obrigatório.",
          function (value) {
            const { createError, path } = this;
            if (players.length > 0 && !value) {
              return createError({
                path,
                message: "Campo Último Jogador Obrigatório.",
              });
            }
            return true;
          }
        ),
    })
    .required();
