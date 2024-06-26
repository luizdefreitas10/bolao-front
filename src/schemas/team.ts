import * as yup from 'yup'

export const schemaTeams = yup.object().shape({
  names: yup
    .array()
    .of(
      yup.object().shape({
        name: yup
          .string()
          .required('Campo Nome Obrigatório.')
          .min(5, 'O nome deve ter no mínimo 5 caracteres.'),
      }),
    )
    .required('É necessário ter pelo menos um nome.'),
})
