export type MutationFunc<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  onSettled?: () => void;
};
