"use client";

import { useState } from "react";
import Image from "next/image";
import { useGetBeverages } from "@/hooks/useGetBeverages";
import { useBuyBeverage } from "@/hooks/useBuyBeverage";
import { ComicButton } from "../ui/buttons/ComicButton";
import HamsterLoader from "../ui/HamsterLoader";
import { Beverage } from "@/app/api/config";

const LOW_STOCK_THRESHOLD = 5;
const SUPABASE_STORAGE_BASE_URL =
  "https://rfegraoskgndulpspcqd.supabase.co/storage/v1/object/public";
const BEVERAGE_BUCKET = "beverages";

function isValidImageUrl(url: string) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  );
}

function getImageUrl(imagePath: string): string | null {
  if (!imagePath) return null;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    const isUnsplashPage =
      imagePath.includes("unsplash.com/de/fotos/") ||
      imagePath.includes("unsplash.com/photos/");

    if (isUnsplashPage) {
      return null;
    }

    return imagePath;
  }

  if (imagePath.startsWith("beverages/")) {
    return `${SUPABASE_STORAGE_BASE_URL}/${imagePath}`;
  }

 
  if (!isValidImageUrl(imagePath)) {
    return null;
  }

  return `${SUPABASE_STORAGE_BASE_URL}/${BEVERAGE_BUCKET}/${imagePath}`;
}

export default function BeverageManager() {
  const { data: beverages, isLoading, isError, error } = useGetBeverages();
  const buyBeverage = useBuyBeverage();
  const [selectedBeverage, setSelectedBeverage] = useState<Beverage | null>(
    null,
  );

  const handleConfirmPurchase = () => {
    if (!selectedBeverage) return;

    buyBeverage.mutate(
      { beverageId: selectedBeverage.id },
      {
        onSuccess: () => setSelectedBeverage(null),
      },
    );
  };

  if (isLoading) {
    return <p className="text-center text-secon">Lädt…</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-red-600">
        Fehler: {error?.message ?? "Unbekannter Fehler"}
      </p>
    );
  }

  return (
    <>
      <h2 className="comic-text-outline text-center text-4xl font-bold">
        Hier werden deine Getränkewünsche angenommen!!
      </h2>

      <section className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {beverages?.map((beverage) => {
          const soldOut = !beverage.is_available || (beverage.stock ?? 0) <= 0;
          const lowStock =
            !soldOut && (beverage.stock ?? 0) < LOW_STOCK_THRESHOLD;

          const imageUrl = beverage.image_path
            ? getImageUrl(beverage.image_path)
            : null;

          return (
            <div
              key={beverage.id}
              className="comic-card flex flex-col items-center bg-white text-center"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={beverage.name}
                  width={120}
                  height={120}
                  className="mb-2 h-30 w-30 object-contain"
                />
              ) : (
                <div className="mb-2 flex h-30 w-30 items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400">
                  Kein Bild
                </div>
              )}

              <h3 className="font-semibold text-secon">{beverage.name}</h3>

              <p className="text-sm text-secon/80">
                {beverage.price.toFixed(2)} €
              </p>

              {soldOut && (
                <p className="mt-1 text-xs text-red-600">Ausverkauft</p>
              )}

              {lowStock && (
                <p className="mt-1 text-xs text-orange-500">
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
