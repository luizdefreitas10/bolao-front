"use client";

import {
  Button,
  Input,
  Link,
  Checkbox,
  useDisclosure,
} from "@nextui-org/react";
import { Open_Sans as OpenSans } from "next/font/google";
import { useState } from "react";
import { EyeSlashFilledIcon } from "../../components/EyeSlashFilledIcon/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../../components/EyeFilledIcon/EyeFilledIcon";
import ConfirmationCodeModal from "@/app/components/ConfirmationCodeModal/ConfirmationCodeModal";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaRegisterUser } from "@/schemas/user";
import InputMask from "react-input-mask";
const fontOpenSans = OpenSans({ subsets: ["latin"] });

export default function Register() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<INewUser>({
    resolver: yupResolver(schemaRegisterUser),
    mode: "onSubmit",
    shouldFocusError: false,
  });

  function handleRegister(data: INewUser) {
    console.log(data);
    //onOpen()
  }

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="h-screen -mb-[148px] w-screen bg-[#1F67CE] flex flex-col">
      <h1
        className={`${fontOpenSans.className} mt-10 text-center text-[18px] font-bold text-white`}
      >
        Registrar
      </h1>
      <p
        className={`${fontOpenSans.className} text-center text-[12px] font-normal text-white my-2`}
      >
        Registre-se agora e participe!
      </p>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="flex flex-col w-[90%] mx-auto"
      >
        <Input
          size="md"
          type="text"
          label="Nome completo"
          labelPlacement="inside"
          placeholder="Digite seu nome completo"
          className="mt-4"
          errorMessage={errors.fullName?.message}
          isInvalid={!!errors.fullName?.message}
          color={errors.fullName?.message ? "danger" : undefined}
          variant={errors.fullName?.message ? "bordered" : undefined}
          {...register("fullName")}
        />
        <Input
          size="md"
          type="date"
          label="Data de nascimento"
          labelPlacement="inside"
          placeholder="DD/MM/YYYY"
          className="mt-4 text-[#000]"
          errorMessage={errors.birthdate?.message}
          isInvalid={!!errors.birthdate?.message}
          color={errors.birthdate?.message ? "danger" : undefined}
          variant={errors.birthdate?.message ? "bordered" : undefined}
          {...register("birthdate")}
        />
        <Controller
          control={control}
          name={"phone"}
          
          render={({ field }) => (
            <InputMask mask={"(99)99999-9999"} {...field} type="text">
              <Input
                placeholder={"(99)99999-9999"}
                className="mt-4"
                size="md"
                type="tel"
                label="Telefone"
                labelPlacement="inside"
                errorMessage={errors.phone?.message}
                isInvalid={!!errors.phone?.message}
                color={errors.phone?.message ? "danger" : undefined}
                variant={errors.phone?.message ? "bordered" : undefined}
              />
            </InputMask>
          )}
        />

        <Input
          size="md"
          {...register("password")}
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password?.message}
          color={errors.password?.message ? "danger" : undefined}
          variant={errors.password?.message ? "bordered" : undefined}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          label="Senha"
          labelPlacement="inside"
          placeholder="Digite sua senha"
          className="mt-4"
        />
        <Input
          size="md"
          {...register("confirmPassword")}
          errorMessage={errors.confirmPassword?.message}
          isInvalid={!!errors.confirmPassword?.message}
          color={errors.confirmPassword?.message ? "danger" : undefined}
          variant={errors.confirmPassword?.message ? "bordered" : undefined}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          label="Confirmar senha"
          labelPlacement="inside"
          placeholder="Digite sua senha novamente"
          className="mt-4"
        />

        <Button
          type="submit"
          className={`mt-6 rounded-3xl bg-[#00409F] text-white text-[14px] ${fontOpenSans.className}`}
        >
          Criar conta
        </Button>

        <Checkbox
          onClick={() => {
            setIsChecked(!isChecked);
            console.log(isChecked);
          }}
          checked={isChecked}
          value={"Eu aceito os Termos de Use e Políticas de Privacidade"}
          className="my-6"
          classNames={{
            label: "text-white",
          }}
        >
          Eu aceito os{" "}
          <span className="font-bold text-white">Termos de Use</span> e{" "}
          <span className="font-bold text-white">Políticas de Privacidade</span>
        </Checkbox>
      </form>
      <ConfirmationCodeModal isOpen={isOpen} onClose={onOpenChange} />
    </div>
  );
}
