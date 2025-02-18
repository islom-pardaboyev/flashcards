import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getStore, setStore } from "./utils";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.css";

import { Navigation } from "swiper/modules";
interface FlashcardInput {
  front: string;
  back: string;
}

type Flashcard = {
  id: number;
  front: string;
  back: string;
};

function App() {
  const [cards, setCards] = useState<Flashcard[]>(getStore("flashcards") || []);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState(1)
  const { register, handleSubmit, reset } = useForm<FlashcardInput>();
  const handleSubmitForm = (data: FlashcardInput) => {
    console.log(data);
    const flashcardContext = {
      id: cards[0]?.id ? cards[0].id + 1 : 1,
      front: data.front,
      back: data.back,
    };
    setCards((p) => [flashcardContext, ...p]);
    setIsAdding(false);
    reset()
  };

  const deleteFlashcard = (id:number) => {
    console.log(id);
    setCards(p => p.filter(c => c.id!= id));
  }
  
  setStore("flashcards", cards);
  console.log(cards);

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          Flashcards
        </h1>

        {/* adding fleshcard section */}
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center w-full mb-8 p-4 border-2 border-dashed border-indigo-300 rounded-lg text-indigo-600 hover:border-indigo-500 hover:text-indigo-700 transition-colors"
          >
            <Plus className="mr-2" /> Add New Card
          </button>
        ) : (
          <form
            action=""
            onSubmit={handleSubmit(handleSubmitForm)}
            className="bg-white rounded-lg shadow-xl p-6 mb-8"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Front
                </label>
                <textarea
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  {...register("front")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Add Card
                </button>
              </div>
            </div>
          </form>
        )}
        {cards.length ? (
          <div className="relative gap-5">
            <Swiper
              navigation={true}
              modules={[Navigation]} className="!static"
            >
              {cards.map((card) => (
                <SwiperSlide key={card.id} className="relative">
                  <X onClick={() => deleteFlashcard(card.id)} className="absolute top-5 right-5 z-30 text-red-500 cursor-pointer" />
                  <div
                    className="bg-white rounded-xl min-h-[300px] cursor-pointer"
                    style={{
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                      transformStyle: "preserve-3d",
                    }}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div
                      className="absolute inset-0 backface-hidden p-8 flex items-center justify-center text-center"
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <p className="text-2xl">{card.front}</p>
                    </div>
                    <div
                      className="absolute inset-0 backface-hidden p-8 flex items-center justify-center text-center"
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
          <div className="text-center text-gray-500 mt-8">
            No flashcards yet. Add some to get started!
          </div>
        )}
      </div>
    </section>
  );
}

export default App;
