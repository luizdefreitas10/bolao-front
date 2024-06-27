"use client";

import { Button, useDisclosure, Image } from "@nextui-org/react";
import { Open_Sans as OpenSans } from "next/font/google";
import CreateEventModal from "@/app/components/CreateEventModal/CreateEventModal";
import { useEventsContext } from "@/context/EventsContext";
import { MdPerson, MdEdit } from "react-icons/md";
import SetResultModal from "@/app/components/SetResultModal/SetResultModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { handleAxiosError } from "@/services/api/error";
import RoundService from "@/services/api/models/round";
import RoundMatchsCardAdmin from "@/app/components/RoundMatchsCardAdmin/RoundMatchsCardAdmin";

const fontOpenSans = OpenSans({ subsets: ["latin"] });

export default function HomeAdmin() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [rounds, setRounds] = useState<IRoundWithMatchsAndChampionship[]>([])
  const {
    isOpen: isOpenSetResultModal,
    onOpen: onOpenSetResultModal,
    onOpenChange: onOpenChangeSetResultModal,
  } = useDisclosure();
  const { setCurrentModalIndex } = useEventsContext();

  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    setLoading(true);
    try {
      const { fetchRoundsByStatus } = await RoundService();
      const response = await fetchRoundsByStatus("WAITING");
      setRounds(response);
    } catch (error) {
      const customError = handleAxiosError(error);
      toast.error(customError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${fontOpenSans.className}`}>
      <h1 className={`text-center text-[#00409F] text-[18px] font-bold mt-10`}>
        Lorem Ipsum
      </h1>
      <p className="text-[#00409F] mt-2 mb-4 text-center">
        Lorem ipsum dolor sit amet consectetur. Laoreet.
      </p>
      {rounds.map((round) => (
        <RoundMatchsCardAdmin round={round} key={round.id} />
      ))}
   
      <Button
        onClick={() => setCurrentModalIndex(0)}
        onPress={onOpen}
        startContent={<Image src="/addcircle.svg" alt="add circle" />}
        className="w-[90%] mx-auto mt-4 mb-6 bg-[#00409F] text-white font-bold text-[14px] py-[10px] px-[14px]"
      >
        Criar evento
      </Button>
      <div className="bg-[#00409F] w-full h-[250px] flex justify-center items-center">
        <div className="w-[90%] bg-black h-[160px] rounded-xl flex justify-center items-center">
          <h1>betvip banner</h1>
        </div>
      </div>
      <CreateEventModal isOpen={isOpen} onClose={onOpenChange} />
      {/* <SetResultModal
        isOpen={isOpenSetResultModal}
        onClose={onOpenChangeSetResultModal}
      /> */}
    </div>
  );
}
