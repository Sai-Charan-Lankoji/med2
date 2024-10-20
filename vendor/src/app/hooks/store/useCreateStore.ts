import { StoreFormData } from "@/app/@types/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const baseUrl = process.env.NEXT_PUBLIC_API_URL 
const createStore = async (storeData: StoreFormData) => {
  const response = await fetch(`${baseUrl}/vendor/store`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(storeData),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create store: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      queryClient.invalidateQueries(['stores']);
    },
    onError: (error) => {
      console.error('Error creating store:', error);
    },
  });
};
