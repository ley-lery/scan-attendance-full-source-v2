import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { type FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  confirm: () => void;
  confirmLabel?: string;
  confirmIcon?: React.ReactNode;
  title?: string;
  message?: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  isOpen = false,
  onClose,
  confirm,
  confirmLabel = "Ok",
  confirmIcon,
  title = "Title",
  message = "Message",
}) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    confirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay with fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/10 dark:bg-black/50"
          />

          {/* Dialog container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto max-w-xs w-full mx-4"
            >
              <div className="backdrop-blur-sm transform-gpu p-6 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-3xl border border-white/40 dark:border-zinc-800/50 shadow-xl">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="flex flex-col gap-1 text-center pb-2"
                >
                  <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                    {title}
                  </h2>
                </motion.div>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: .3, duration: 0.3 }}
                  className="text-center text-sm text-zinc-700 dark:text-zinc-300 mb-6"
                >
                  {message}
                </motion.p>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="flex w-full items-center justify-center gap-3"
                >
                  <Button
                    type="button"
                    onPress={onClose}
                    className="btn-small-ui"
                    color="primary"
                    radius="full"
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="button"
                    onPress={handleConfirm}
                    className="btn-small-ui"
                    color="danger"
                    radius="full"
                    startContent={confirmIcon}
                  >
                    {confirmLabel}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;