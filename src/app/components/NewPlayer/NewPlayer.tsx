import { Button, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { FieldErrors, FieldErrorsImpl, useFieldArray } from "react-hook-form";
import { Control, UseFormRegister } from "react-hook-form";
import { MdAddCircleOutline, MdOutlineRemoveCircle } from "react-icons/md";
import { IFormInput } from "../CreateMatchesModal/CreateMatchesModal";

interface NewPlayerProps {
  matchId: number;
  register: UseFormRegister<any>;
  control?: Control<any, any>;
  errors: FieldErrors<IFormInput>;
}

export function NewPlayer({
  matchId,
  control,
  register,
  errors,
}: NewPlayerProps) {
  const [shouldDisableAddNewTeam, setShouldDisableAddNewTeam] = useState(true);
  const { fields, remove, append } = useFieldArray({
    control,
    name: `matches[${matchId}].players`,
  });

  const addPlayer = () => {
    append({
      name: "",
    });
  };

  return (
    <>
      {fields.map((player, indexPlayers) => (
        <div key={indexPlayers} className="flex space-x-2 items-center">
          {shouldDisableAddNewTeam ? (
            <Button
              className={`min-w-[1rem] bg-[#fff]`}
              onClick={() =>
                setShouldDisableAddNewTeam(!shouldDisableAddNewTeam)
              }
            >
              <MdAddCircleOutline className="text-[#1F66CE] text-[16px]" />
            </Button>
          ) : (
            <Button
              className={`min-w-[1rem] bg-[#E40000]`}
              onClick={() =>
                fields.length === 1
                  ? setShouldDisableAddNewTeam(true)
                  : remove(indexPlayers)
              }
            >
              <MdOutlineRemoveCircle className="text-[#fff]" />
            </Button>
          )}
          <Input
            type="text"
            isDisabled={indexPlayers === 0 && shouldDisableAddNewTeam}
            placeholder={`Nome novo jogador ${indexPlayers + 1}`}
            // isInvalid={
            //   !!(
            //     errors?.matches &&
            //     errors.matches[matchId]?.players?.length > 0 &&
            //     Array.isArray(errors?.matches[matchId]?.players) &&
            //     errors?.matches[matchId]?.players[indexPlayers] !== undefined &&
            //     errors?.matches[matchId]?.players[indexPlayers].name !== undefined &&
            //     errors?.matches[matchId]?.players[indexPlayers]?.name?.message
            //   )
            // }
            // errorMessage={
            //   (errors?.matches &&
            //     errors?.matches[matchId]?.lastPlayerTeam?.message) ||
            //   ""
            // }
            // color={
            //   errors?.names && errors?.names[index]?.name?.message
            //     ? "danger"
            //     : undefined
            // }
            // variant={
            //   errors?.names && errors?.names[index]?.name?.message
            //     ? "bordered"
            //     : undefined
            // }
            {...register(`matches.${matchId}.players.${indexPlayers}.name`)}
          />
        </div>
      ))}
      {!shouldDisableAddNewTeam && (
        <Button
          type="button"
          variant="bordered"
          className={`text-[14px] text-white font-bold border-white rounded-full w-full`}
          onClick={() => addPlayer()}
        >
          Novo Jogador
        </Button>
      )}
    </>
  );
}
