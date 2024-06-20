import * as yup from "yup";
import { differenceInYears } from "date-fns";
import { phoneRegExp } from "../utils/phoneRegex";

export const schemaRegisterUser = yup
  .object({
    fullName: yup.string().required("Campo Nome Completo é obrigatório."),
    phone: yup
      .string()
      .required("Campo Celular é obrigatório.")
      .matches(phoneRegExp, "Insira um telefone válido."),
    password: yup.string().required("Campo Senha é obrigatório."),
    confirmPassword: yup
      .string()
      .required("A confirmação de senha é obrigatória.")
      .oneOf([yup.ref("password")], "As senhas não coincidem."),
    birthdate: yup
      .date()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      })
      .required("Campo Data de Nascimento é obrigatório.")
      .test(
        "is-14-or-older",
        "Usuário deve ter no mínimo 14 anos.",
        (value) => {
          return value && differenceInYears(new Date(), value) >= 14;
        }
      ),
  })
  .required();
