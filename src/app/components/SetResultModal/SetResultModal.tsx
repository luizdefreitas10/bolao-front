import { useEventsContext } from "@/context/EventsContext";
import { handleAxiosError } from "@/services/api/error";
import PlayerService from "@/services/api/models/players";
import { formatDateToCustomString } from "@/utils/formatDate";
import { getLogo } from "@/utils/getLogo";
import useWindowWidth from "@/utils/window-width-hook";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Image,
  RadioGroup,
  Radio,
  Input,
} from "@nextui-org/react";
import { Open_Sans as OpenSans } from "next/font/google";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const fontOpenSans = OpenSans({ subsets: ["latin"] });

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetResultModal({ isOpen, onClose }: CustomModalProps) {
  const { selectedMatchSetResult, setSelectedMatchSetResult } =
    useEventsContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [players, setPlayers] = useState<IPlayer[]>([]);

  useEffect(() => {
    console.log(selectedMatchSetResult);
    console.log(selectedMatchSetResult?.match.lastPlayerTeam?.name);
    if (
      selectedMatchSetResult &&
      selectedMatchSetResult?.match.lastPlayerTeam?.name
    )
      fetchPlayers();
  }, [selectedMatchSetResult]);

  async function fetchPlayers() {
    if (selectedMatchSetResult && selectedMatchSetResult.match.lastPlayerTeam) {
      setLoading(true);
      try {
        const { fetchPlayersByRoundAndTeam } = await PlayerService();
        const response = await fetchPlayersByRoundAndTeam(
          selectedMatchSetResult.id,
          selectedMatchSetResult.match.lastPlayerTeam?.id
        );
        console.log(response);
        setPlayers(response);
      } catch (error) {
        const customError = handleAxiosError(error);
        toast.error(customError.message);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Necessário selecionar um partida.");
    }
  }

  function handleOnClose(){
    setSelectedMatchSetResult(undefined)
    setPlayers([])
    onClose()
  }

  return (
    <Modal
      scrollBehavior="outside"
      isOpen={isOpen}
      onOpenChange={handleOnClose}
      size="4xl"
      closeButton={<img src="/closeicon.png" alt="close" />}
    >
      <ModalContent className={`${fontOpenSans.className} bg-[#1F67CE]`}>
        {(onClose) => (
          <>
            <ModalHeader className="flex space-x-2 items-center">
              <Image src="/historyicon.svg" alt="mail icon" />
              <h1>Definir resultado</h1>
            </ModalHeader>
            <ModalBody className="space-y-2">
              <p>Defina abaixo o resultado da partida:</p>
              <div className="flex flex-col p-4 bg-[#00409F] rounded-lg w-[90%] mx-auto">
                <div className="flex w-full justify-between">
                  <div className="flex space-x-2">
                    <Image src="/sportsicon.png" alt="sports icon" />
                    <h1 className="text-white text-[12px] font-normal">
                      {selectedMatchSetResult?.championship.name} -{" "}
                      {selectedMatchSetResult?.name}
                    </h1>
                  </div>
                  {selectedMatchSetResult && (
                    <h1 className="text-white text-[12px] font-normal">
                      {formatDateToCustomString(
                        new Date(selectedMatchSetResult?.match.date)
                      )}
                    </h1>
                  )}
                </div>
                <div className="flex justify-evenly items-center mt-4">
                  <div className="flex flex-col space-y-4">
                    <h1 className="text-center">
                      {selectedMatchSetResult?.match.teamHome.name}
                    </h1>
                    <div className="flex justify-center items-center">
                      <input
                        defaultValue="0"
                        type="number"
                        className="w-5 bg-transparent outline-none"
                      />
                    </div>
                  </div>
                  <h1 className="mx-4">X</h1>
                  <div className="flex flex-col space-y-4">
                    <h1 className="text-center">
                      {selectedMatchSetResult?.match.teamAway.name}
                    </h1>
                    <div className="flex justify-center items-center">
                      <input
                        defaultValue="0"
                        type="number"
                        className="w-5 bg-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
                <hr className="w-full h-[1px] border-t-[1px] border-t-[#1F67CE] mt-4" />
                <h1 className="text-[12px] font-semibold text-white my-4">
                  Selecione o marcador do último jogo do{" "}
                  {selectedMatchSetResult?.match.lastPlayerTeam?.name}:
                </h1>
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-full w-[28px] h-[28px] ${getLogo(selectedMatchSetResult?.match.lastPlayerTeam?.name) === "/defaultlogo.svg" && "bg-[#fff]"} `}
                  >
                    <Image
                      src={getLogo(
                        selectedMatchSetResult?.match.lastPlayerTeam?.name
                      )}
                      alt="sport logo"
                      className="w-[16px] h-[16px]"
                    />
                  </div>
                  <h1 className="text-white text-[16px] font-normal">
                    {selectedMatchSetResult?.match.lastPlayerTeam?.name}
                  </h1>
                </div>
                <RadioGroup className="mt-4 flex">
                  {players.map((player, index) => (
                    <div
                      className="bg-[#00409F] flex justify-between items-center p-2 space-x-2 rounded-sm"
                      key={player.id}
                    >
                      <div className="flex justify-center items-center space-x-2">
                        <div
                          className={`rounded-full w-[28px] h-[28px] ${getLogo(selectedMatchSetResult?.match.lastPlayerTeam?.name) === "/defaultlogo.svg" && "bg-[#fff]"} `}
                        >
                          <Image
                            src={getLogo(
                              selectedMatchSetResult?.match.lastPlayerTeam?.name
                            )}
                            alt={player.name}
                          />
                        </div>
                        <h1 className="">{player.name}</h1>
                      </div>
                      <Radio
                        color="success"
                        className="custom-radio-order justify-between"
                        value={`Jogador ${index + 1}`}
                        classNames={{
                          label: "hidden",
                        }}
                      >
                        {player.name}
                      </Radio>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </ModalBody>
            <ModalFooter className="flex flex-col space-y-4">
              <Button
                onPress={onClose}
                className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
              >
                Salvar resultado
              </Button>
              <Button
                onPress={onClose}
                className={`${fontOpenSans.className} text-[14px] text-white font-bold bg-[#E40000] rounded-full`}
              >
                Fechar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
