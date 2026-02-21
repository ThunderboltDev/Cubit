import { ArrowLeftIcon, Home } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/link-button";

export function NotFound({ children }: PropsWithChildren) {
  const router = useRouter();

  return (
    <div className="flex h-dvh flex-col items-center justify-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-md text-center space-y-8">
        <div className="space-y-4">
          <p className="font-mono text-sm font-semibold tracking-wider text-accent uppercase">
            404 Error
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Page not found
          </h1>
          <div className="text-base text-muted-foreground">
            {children || (
              <p>Sorry, we couldn't find the page you're looking for.</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => router.history.back()}
          >
            <HugeiconsIcon icon={ArrowLeftIcon} />
            Go back
          </Button>
          <LinkButton to="/" theme="accent">
            <HugeiconsIcon icon={Home} />
            Go to home
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
