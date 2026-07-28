"use client";

import Image from "next/image";
import { useGetBeverages } from "@/hooks/useGetBeverages";
import { useBuyBeverage } from "@/hooks/useBuyBeverage";
import { ComicButton } from "../ui/buttons/ComicButton";

const LOW_STOCK_THRESHOLD = 5;

export default function BeverageManager() {
  const { data: beverages, isLoading, isError, error } = useGetBeverages();
  const buyBeverage = useBuyBeverage();
  const BEVERAGE_IMAGE_BASE_URL =
    "https://rfegraoskgndulpspcqd.supabase.co/storage/v1/object/public";

  if (isLoading) return <p className="text-center text-secon">Lädt…</p>;
  if (isError)
    return <p className="text-center text-red-600">Fehler: {error.message}</p>;

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
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
              onClick={() => buyBeverage.mutate({ beverageId: beverage.id })}
              disabled={soldOut || buyBeverage.isPending}
              className="mt-3 bg-btn px-4 py-1.5 text-xl font-bold text-white disabled:opacity-40"
            >
              <span className="comic-text-outline">Kaufen</span>
            </ComicButton>
          </div>
        );
      })}
    </section>
  );
}
