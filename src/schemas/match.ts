import * as yup from 'yup'

export const matchesSchema = yup.object().shape({
  matches: yup.array().of(
    yup.object().shape({
      homeTeam: yup.string().required('Time da casa é obrigatório'),
      awayTeam: yup
        .string()
        .required('Time visitante é obrigatório')
        .notOneOf(
          [yup.ref('homeTeam'), null],
          'Times da casa e visitante não podem ser iguais',
        ),
      round: yup.string().required('Rodada é obrigatória'),
      dateTime: yup.string().required('Data e hora são obrigatórias'),
    }),
  ),
})

export const schemaSetResultMatch = (
  players: IPlayer[],
): yup.ObjectSchema<ISetResultMatch> =>
  yup
    .object({
      scoreAway: yup.number().required('Campo Placa Fora Obrigatório.'),
      scoreHome: yup.number().required('Campo Placar Casa Obrigatório.'),
      lastPlayerId: yup
        .string()
        .test(
          'required-if-players',
          'Campo Último Jogador Obrigatório.',
          function (value) {
            const { createError, path } = this
            if (players.length > 0 && !value) {
              return createError({
                path,
                message: 'Campo Último Jogador Obrigatório.',
              })
            }
            return true
          },
        ),
    })
    .required()
