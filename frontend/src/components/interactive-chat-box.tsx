import React from "react";
import { UploadImageInput } from "./upload-image-input";
import { ChatInput } from "./chat-input";
import { cn } from "#/utils/utils";
import { ImageCarousel } from "./image-carousel";

interface InteractiveChatBoxProps {
  isDisabled?: boolean;
  mode?: "stop" | "submit";
  onSubmit: (message: string, images: File[]) => void;
  onStop: () => void;
  value?: string;
  onChange?: (message: string) => void;
}

export function InteractiveChatBox({
  isDisabled,
  mode = "submit",
  onSubmit,
  onStop,
  value,
  onChange,
}: InteractiveChatBoxProps) {
  const [images, setImages] = React.useState<File[]>([]);

  const handleUpload = (files: File[]) => {
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const [inputValue, setInputValue] = React.useState(value || "");

  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleSubmit = (message: string) => {
    onSubmit(message, images);
    setImages([]);
    setInputValue("");
  };

  const handleChange = (message: string) => {
    setInputValue(message);
    onChange?.(message);
  };

  return (
    <div
      data-testid="interactive-chat-box"
      className="flex flex-col gap-[10px]"
    >
      {images.length > 0 && (
        <ImageCarousel
          size="small"
          images={images.map((image) => URL.createObjectURL(image))}
          onRemove={handleRemoveImage}
        />
      )}

      <div
        className={cn(
          "flex items-end gap-1",
          "bg-neutral-700 border border-neutral-600 rounded-lg px-2",
          "transition-colors duration-200",
          "hover:border-neutral-500 focus-within:border-neutral-500",
        )}
      >
        <UploadImageInput onUpload={handleUpload} />
        <ChatInput
          disabled={isDisabled}
          button={mode}
          placeholder="What do you want to build?"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onStop={onStop}
          value={inputValue}
          onImagePaste={handleUpload}
          className="py-[10px]"
          buttonClassName="py-[10px]"
        />
      </div>
    </div>
  );
}
