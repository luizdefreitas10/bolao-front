import { phoneRegExp } from '@/utils/phoneRegex'
import * as yup from 'yup'

export const schemaLogin = yup
  .object({
    phone: yup
      .string()
      .required('Campo Celular é obrigatório.')
      .matches(phoneRegExp, 'Insira um telefone válido.'),
    password: yup.string().required('Campo Senha é obrigatório.'),
  })
  .required()
