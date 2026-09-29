import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSendFriendRequest } from "~/api/friend/friend.hooks";
import {
  addFriendValidationSchema,
  type AddFriendFormValues,
} from "./addFriend.schema";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message;
  }
  return "Une erreur est survenue";
}

function AddFriendForm() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const sendFriendRequest = useSendFriendRequest();
  const form = useForm<AddFriendFormValues>({
    resolver: zodResolver(addFriendValidationSchema),
    defaultValues: { username: "" },
  });

  const { errors, isSubmitting } = form.formState;
  const username = form.watch("username");
  const canSubmit = username.trim().length > 0 && !isSubmitting;

  const handleSubmit = form.handleSubmit(async ({ username }) => {
    setSuccessMessage(null);
    try {
      await sendFriendRequest.mutateAsync(username);
      form.reset({ username: "" });
      setSuccessMessage(`Demande d'ami envoyée à ${username}.`);
    } catch (error) {
      form.setError("username", { message: getErrorMessage(error) });
    }
  });

  const feedback = errors.username
    ? { tone: "error" as const, message: errors.username.message }
    : successMessage
      ? { tone: "success" as const, message: successMessage }
      : null;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:px-8">
      <div className="max-w-281.75">
        <h2 className="mb-2 text-[16px] font-bold uppercase text-on-surface">
          Ajouter
        </h2>
        <p className="text-[14px] text-on-surface-variant">
          Tu peux ajouter des amis grâce à leurs noms d'utilisateur Strife.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-surface-container-lowest/50 bg-surface-container-lowest p-4"
        >
          <input
            type="text"
            {...form.register("username")}
            placeholder="Entre un nom d'utilisateur"
            aria-label="Nom d'utilisateur"
            aria-invalid={!!errors.username}
            autoComplete="off"
            className="w-full border-none bg-transparent text-[16px] text-on-surface placeholder:text-outline focus:ring-0"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="whitespace-nowrap rounded-sm bg-primary-container px-4 py-2 text-[14px] font-medium text-on-primary-container transition-colors hover:bg-primary-container/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Envoi..." : "Envoyer une demande d'ami"}
          </button>
        </form>

        {feedback && (
          <p
            role="status"
            className={`mt-2 text-[13px] ${
              feedback.tone === "success" ? "text-secondary" : "text-error"
            }`}
          >
            {feedback.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AddFriendForm;
