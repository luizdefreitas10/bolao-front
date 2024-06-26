import * as yup from 'yup'

export const schemaChampionship = yup
  .object({
    name: yup
      .string()
      .required('Campo Nome Obrigatório.')
      .min(5, 'O nome deve ter no mínimo 5 caracteres.'),
  })
  .required()
