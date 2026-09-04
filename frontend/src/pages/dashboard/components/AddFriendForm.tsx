import { useState, type SubmitEvent } from "react";
import { useSendFriendRequestMutation } from "../../../services/friend-api";
import { toApiError, type ApiError } from "../../../api/errors";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

type Feedback = { tone: "success" | "error"; message: string };

function AddFriendForm() {
  const [username, setUsername] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [sendFriendRequest] = useSendFriendRequestMutation();

  const handleOnSendFriendRequest = async () => {
    try {
      await sendFriendRequest(username).unwrap();
    } catch (error: any) {
      console.log(error.data);
      const apiError: ApiError = error?.data;
      setFeedback({ tone: "error", message: apiError.message });
    } finally {
      setIsSending(false);
    }
  };

  const trimmed = username.trim();
  const canSubmit = trimmed.length > 0 && !isSending;

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSending(true);
    setFeedback(null);

    await handleOnSendFriendRequest();
  };

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
          className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-surface-container-lowest/50 bg-surface-container-lowest p-4"
        >
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Entre un nom d'utilisateur"
            aria-label="Nom d'utilisateur"
            autoComplete="off"
            className="w-full border-none bg-transparent text-[16px] text-on-surface placeholder:text-outline focus:ring-0"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="whitespace-nowrap rounded-sm bg-primary-container px-4 py-2 text-[14px] font-medium text-on-primary-container transition-colors hover:bg-primary-container/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Envoi..." : "Envoyer une demande d'ami"}
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
