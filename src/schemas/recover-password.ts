import { phoneRegExp } from '@/utils/phoneRegex'
import * as yup from 'yup'

export const recoverPasswordSchema = yup
  .object({
    phone: yup
      .string()
      .required('Campo Celular é obrigatório.')
      .matches(phoneRegExp, 'Insira um telefone válido.'),
  })
  .required()

export const resetPasswordSchema = yup
  .object({
    code: yup.string().required('Campo Código é obrigatório.'),
    newPassword: yup.string().required('Campo Nova Senha é obrigatório.'),
  })
  .required()
