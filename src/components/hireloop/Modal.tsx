import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onOpenChange?: (o: boolean) => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  image?: ReactNode;
  dismissable?: boolean;
};

/** Modal putih di tengah; Radix mengelola fokus & mengembalikannya ke pemicu. */
export function Modal({ open, onOpenChange, title, description, children, image, dismissable = true }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-deep/75 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          onEscapeKeyDown={(e) => !dismissable && e.preventDefault()}
          onPointerDownOutside={(e) => !dismissable && e.preventDefault()}
          className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[380px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-card p-6 text-center text-card-foreground shadow-card data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0"
        >
          {image && <div className="mx-auto mb-3 flex justify-center">{image}</div>}
          <Dialog.Title className="text-xl font-bold text-brand">{title}</Dialog.Title>
          {description ? (
            <Dialog.Description asChild>
              <div className="mt-2 text-sm text-muted-foreground">{description}</div>
            </Dialog.Description>
          ) : (
            <Dialog.Description className="sr-only">{title}</Dialog.Description>
          )}
          <div className="mt-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
