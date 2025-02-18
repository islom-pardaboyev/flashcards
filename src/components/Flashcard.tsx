import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation } from "swiper/modules";
import { getStore, setStore } from "../utils";

interface FlashcardInput {
  front: string;
  back: string;
}

type Flashcard = {
  id: number;
  front: string;
  back: string;
};

function FlashcardComponent() {
  const [cards, setCards] = useState<Flashcard[]>(getStore("flashcards") || []);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);
  const { register, handleSubmit, reset } = useForm<FlashcardInput>();

  const deleteFlashcard = (id: number) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setFlippedCards((prev) => {
      const updatedFlipped = { ...prev };
      delete updatedFlipped[id];
      return updatedFlipped;
    });
  };

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const shuffleArray = (array: Flashcard[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const handleSubmitForm = (data: FlashcardInput) => {
    const flashcardContext = {
      id: cards.length ? cards[0].id + 1 : 1,
      front: data.front,
      back: data.back,
    };
  
    const updatedCards = [flashcardContext, ...cards];
    setCards(shuffleArray(updatedCards));
    setIsAdding(false);
    reset();
  };

  setStore("flashcards", cards);

  return (
    <section className="min-h-screen p-8 bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center text-indigo-900">
          Flashcards
        </h1>

        {/* Adding flashcard section */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center w-full p-4 mb-8 text-indigo-600 border-2 border-indigo-300 border-dashed rounded-lg hover:border-indigo-500 hover:text-indigo-700 transition-colors"
          >
            <Plus className="mr-2" /> Add New Card
          </button>
        ) : (
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="p-6 mb-8 bg-white rounded-lg shadow-xl"
          >
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Front
                </label>
                <textarea
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  {...register("front")}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Back
                </label>
                <textarea
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  {...register("back")}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                  Add Card
                </button>
              </div>
            </div>
          </form>
        )}

        {cards.length ? (
          <div className="relative gap-5">
            <Swiper navigation={true} modules={[Navigation]} className="!static">
              {cards.map((card) => (
                <SwiperSlide key={card.id} className="relative">
                  <X
                    onClick={() => deleteFlashcard(card.id)}
                    className="absolute z-30 text-red-500 cursor-pointer top-5 right-5"
                  />
                  <div
                    className="bg-white rounded-xl min-h-[300px] cursor-pointer relative"
                    style={{
                      transform: flippedCards[card.id] ? "rotateY(180deg)" : "rotateY(0)",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.5s",
                    }}
                    onClick={() => toggleFlip(card.id)}
                  >
                    <div
                      className="absolute inset-0 flex items-center justify-center p-8 text-center backface-hidden"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <p className="text-2xl">{card.front}</p>
                    </div>
                    <div
                      className="absolute inset-0 flex items-center justify-center p-8 text-center backface-hidden"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <p className="text-2xl">{card.back}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">
            No flashcards yet. Add some to get started!
          </div>
        )}
      </div>
    </section>
  );
}

export default FlashcardComponent;