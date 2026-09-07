import { useNavigate, useRouteError } from "react-router";
import { MdOutlineErrorOutline } from "react-icons/md";
import Button from "../../components/ui/Button";
import StrifeLogo from "../../components/ui/StrifeLogo";
import { toErrorDetails, type ErrorDetails } from "./error";

interface ErrorPageProps {
  /** Overrides the route error — lets the page be rendered directly. */
  error?: unknown;
  title?: string;
  message?: string;
  /** Hide the "Try again" action when a reload can't help (a 404, say). */
  canRetry?: boolean;
}

/**
 * Generic error screen. Used as a route `ErrorBoundary`, where it reads the
 * thrown error itself, or rendered directly with `error` / `title` / `message`.
 */
export default function ErrorPage({
  error,
  title,
  message,
  canRetry = true,
}: ErrorPageProps) {
  const navigate = useNavigate();
  const routeError = useRouteError();

  const details: ErrorDetails = toErrorDetails(error ?? routeError);
  const heading = title ?? details.title;
  const body = message ?? details.message;

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background px-6">
      <section className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg bg-surface-container-low p-8 text-center shadow-2xl">
        <StrifeLogo size={36} />

        <div className="flex flex-col items-center gap-2">
          {details.status !== undefined && (
            <span className="font-label text-[13px] font-medium tracking-widest text-outline">
              {details.status}
            </span>
          )}

          <h1 className="flex items-center gap-2 text-2xl font-bold text-on-surface">
            <MdOutlineErrorOutline size={26} className="text-error" />
            {heading}
          </h1>

          <p className="text-[15px] text-on-surface-variant">{body}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {canRetry && (
            <Button onClick={() => window.location.reload()}>Try again</Button>
          )}
          <Button variant="neutral" onClick={() => void navigate(-1)}>
            Go back
          </Button>
          <Button
            variant="ghost"
            onClick={() => void navigate("/", { replace: true })}
          >
            Back to Strife
          </Button>
        </div>

        {import.meta.env.DEV && details.detail && (
          <pre className="max-h-48 w-full overflow-auto rounded-sm bg-surface-container-lowest p-3 text-left font-label text-[12px] whitespace-pre-wrap text-on-surface-variant">
            {details.detail}
          </pre>
        )}
      </section>
    </main>
  );
}

/** Catch-all route for unmatched URLs. */
export function NotFoundPage() {
  return <ErrorPage error={{ status: 404 }} canRetry={false} />;
}
