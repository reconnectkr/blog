import React from "react";
import { Button } from "./Button";

interface DialogProps {
  isOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
}

export default function Dialog({
  isOpen,
  onClick,
  onClose,
  title,
  children,
  confirmText = "확인",
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">{children}</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2 bg-gray-50 px-4 py-3 sm:px-6 sm:flex">
            <Button variant="default" onClick={onClick}>
              {confirmText}
            </Button>
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
