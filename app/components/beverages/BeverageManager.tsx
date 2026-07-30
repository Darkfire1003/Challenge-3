"use client";

import { useState } from "react";
import Image from "next/image";
import { useGetBeverages } from "@/hooks/useGetBeverages";
import { useBuyBeverage } from "@/hooks/useBuyBeverage";
import { ComicButton } from "../ui/buttons/ComicButton";
import HamsterLoader from "../ui/HamsterLoader";
import { Beverage } from "@/app/api/config";

const LOW_STOCK_THRESHOLD = 5;

export default function BeverageManager() {
  const { data: beverages, isLoading, isError, error } = useGetBeverages();
  const buyBeverage = useBuyBeverage();
  const [selectedBeverage, setSelectedBeverage] = useState<Beverage | null>(
    null,
  );
  const BEVERAGE_IMAGE_BASE_URL =
    "https://rfegraoskgndulpspcqd.supabase.co/storage/v1/object/public";

  const handleConfirmPurchase = () => {
    if (!selectedBeverage) return;

    buyBeverage.mutate(
      { beverageId: selectedBeverage.id },
      { onSuccess: () => setSelectedBeverage(null) },
    );
  };

  if (isLoading) return <p className="text-center text-secon">Lädt…</p>;
  if (isError)
    return <p className="text-center text-red-600">Fehler: {error.message}</p>;

  return (
    <>
      <h2 className="comic-text-outline text-center text-4xl font-bold">
        Hier werden deine Getränkewünsche angenommen!!
      </h2>
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20">
        {beverages?.map((beverage) => {
          const soldOut = !beverage.is_available || (beverage.stock ?? 0) <= 0;
          const lowStock =
            !soldOut && (beverage.stock ?? 0) < LOW_STOCK_THRESHOLD;

          return (
            <div
              key={beverage.id}
              className="comic-card bg-white flex flex-col items-center text-center"
            >
              {beverage.image_path && (
                <Image
                  src={`${BEVERAGE_IMAGE_BASE_URL}/${beverage.image_path}`}
                  alt={beverage.name}
                  width={100}
                  height={100}
                  className="w-30 h-30 object-contain mb-2"
                />
              )}

              <h3 className="font-semibold text-secon">{beverage.name}</h3>
              <p className="text-sm text-secon/80">
                {beverage.price.toFixed(2)} €
              </p>

              {soldOut && (
                <p className="text-xs text-red-600 mt-1">Ausverkauft</p>
              )}
              {lowStock && (
                <p className="text-xs text-orange-500 mt-1">
                  Nur noch {beverage.stock} übrig
                </p>
              )}

              <ComicButton
                onClick={() => setSelectedBeverage(beverage)}
                disabled={soldOut}
                className="mt-3 bg-btn px-4 py-1.5 text-xl font-bold text-white disabled:opacity-40"
              >
                <span className="comic-text-outline">Kaufen</span>
              </ComicButton>
            </div>
          );
        })}
      </section>

      {selectedBeverage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-[0.4em] border-[3px] border-black bg-white p-6 text-center shadow-[0.1em_0.1em_0_#000]">
            {buyBeverage.isPending ? (
              <HamsterLoader />
            ) : (
              <>
                <h2 className="text-lg font-semibold text-secon">
                  Kauf bestätigen
                </h2>
                <p className="mt-2 text-sm text-secon/80">
                  Möchtest du <strong>{selectedBeverage.name}</strong> für{" "}
                  <strong>{selectedBeverage.price.toFixed(2)} €</strong> kaufen?
                </p>

                <div className="mt-4 flex justify-center gap-3">
                  <ComicButton
                    onClick={() => setSelectedBeverage(null)}
                    className="bg-white px-4 py-1.5 text-secon"
                  >
                    Abbrechen
                  </ComicButton>
                  <ComicButton
                    onClick={handleConfirmPurchase}
                    className="bg-btn px-4 py-1.5 text-white"
                  >
                    Bestätigen
                  </ComicButton>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
