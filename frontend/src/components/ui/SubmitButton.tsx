interface SubmitButtonProps {
  text?: string;
  pendingText?: string;
  isPending?: boolean;
}

function SubmitButton({
  text = "Register",
  pendingText = "Please wait...",
  isPending = false,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-sm "
    >
      {isPending ? pendingText : text}
    </button>
  );
}

export default SubmitButton;
