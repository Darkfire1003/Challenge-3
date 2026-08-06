import { useMutation, useQueryClient } from "@tanstack/react-query"; // useMutation = Hook für POST / PATCH / DELETE
import { api, Beverage, NewBeverage } from "@/app/api/config"; // api = Verbindung zu Supabase, Beverage = Typ für Getränk
import { useAuth } from "@/app/context/AuthContext"; // Um an das Login Token zu kommen

export function useCreateBeverage() {
  const queryClient = useQueryClient(); // Cache Verwalter - merkt sich alle Getränke die schon geladen wurden
  const { accessToken } = useAuth();

  return useMutation({
    // was passsiert wenn man .mutate aufruft
    mutationFn: async (payload: NewBeverage) => {
      // payload = Das Objekt aus deinem Formular, z.B.
      // {
      //   organization_id: "org-99",
      //   name: "Cola",
      //   price: 1.5,
      //   stock: 10,
      //   is_available: true,
      //   image_path: "https://..."
      // }

      const { data } = await api.post<Beverage>("/beverages", payload, {
        headers: { Authorization: `Bearer ${accessToken}` }, // Ausweis vorzeigen, damit Supabase weiß wer du bist
      });
      // POST /beverages = INSERT INTO beverages VALUES (payload) in der DB
      // <Beverage> = TypeScript weiß dann: data ist ein fertiges Getränk mit id

      return data; // Gib das erstellte Getränk zurück
    },

    // 2. WAS PASSIERT NACH ERFOLG?
    onSuccess: () => {
      // Sag TanStack: Die Liste mit Key "beverages" ist jetzt alt, lade sie neu!
      // Dadurch taucht das neue Getränk sofort in der UI auf
      // useGetBeverages() wird automatisch nochmal ausgeführt
      queryClient.invalidateQueries({ queryKey: ["beverages"] });
    },
  });
}
