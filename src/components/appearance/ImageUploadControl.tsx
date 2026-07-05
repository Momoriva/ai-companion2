import { ChangeEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowCounterClockwise, ImageSquare, Scissors } from "@phosphor-icons/react";
import { useAppearance } from "../../appearance";
import { estimateImageTone } from "../../appearance/imageBrightness";
import type { AppearanceImageRole, BackgroundTone } from "../../appearance";
import { useToast } from "../feedback/ToastProvider";

const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

const roleLabels: Record<AppearanceImageRole, string> = {
  desktopBackground: "桌面背景",
  chatBackground: "聊天背景",
  aiAvatar: "AI 头像",
  userAvatar: "用户头像",
};

type CropSource = {
  fileName: string;
  mimeType: string;
  objectUrl: string;
  blob: Blob;
};

export function ImageUploadControl({
  role,
  selectedKey,
  onSelectDefault,
}: {
  role: AppearanceImageRole;
  selectedKey: string;
  onSelectDefault: () => void;
}) {
  const { showToast } = useToast();
  const { deleteCustomImage, saveCustomImage } = useAppearance();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [cropSource, setCropSource] = useState<CropSource | null>(null);
  const isAvatar = role === "aiAvatar" || role === "userAvatar";
  const maxSize = isAvatar ? 5 * 1024 * 1024 : 10 * 1024 * 1024;

  useEffect(() => () => {
    if (cropSource) URL.revokeObjectURL(cropSource.objectUrl);
  }, [cropSource]);

  const openFile = () => {
    setError("");
    inputRef.current?.click();
  };

  const openCropper = (blob: Blob, fileName: string, mimeType: string) => {
    if (cropSource) URL.revokeObjectURL(cropSource.objectUrl);
    setCropSource({
      blob,
      fileName,
      mimeType,
      objectUrl: URL.createObjectURL(blob),
    });
  };

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      setError("仅支持 PNG、JPG、JPEG 或 WebP 图片。");
      return;
    }
    if (file.size > maxSize) {
      setError(`${roleLabels[role]}最大支持 ${isAvatar ? "5MB" : "10MB"}。`);
      return;
    }
    openCropper(file, file.name, file.type);
  };

  const restoreDefault = async () => {
    if (selectedKey.startsWith("custom-")) await deleteCustomImage(selectedKey);
    onSelectDefault();
    showToast("success", `${roleLabels[role]}已恢复默认`);
  };

  const confirmCrop = async (blob: Blob, width: number, height: number) => {
    let tone: BackgroundTone | undefined;
    if (!isAvatar) tone = await estimateImageTone(blob);
    await saveCustomImage({
      role,
      blob,
      mimeType: blob.type || cropSource?.mimeType || "image/png",
      width,
      height,
      tone,
    });
    setCropSource(null);
    showToast("success", `${roleLabels[role]}已更新`);
  };

  return (
    <div className="image-upload-control">
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={chooseFile} />
      <button className="secondary-action compact theme-pressable" type="button" onClick={openFile}>
        <ImageSquare size={16} />
        修改
      </button>
      <button className="secondary-action compact theme-pressable" type="button" onClick={restoreDefault}>
        <ArrowCounterClockwise size={16} />
        恢复默认
      </button>
      {error && <span className="upload-error">{error}</span>}
      {cropSource &&
        createPortal(
          <ImageCropDialog
            aspectRatio={isAvatar ? 1 : 9 / 19.5}
            circularPreview={isAvatar}
            source={cropSource}
            onClose={() => setCropSource(null)}
            onConfirm={confirmCrop}
          />,
          document.body,
        )}
    </div>
  );
}

function ImageCropDialog({
  aspectRatio,
  circularPreview,
  source,
  onClose,
  onConfirm,
}: {
  aspectRatio: number;
  circularPreview: boolean;
  source: CropSource;
  onClose: () => void;
  onConfirm: (blob: Blob, width: number, height: number) => Promise<void>;
}) {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
  const [saving, setSaving] = useState(false);
  const outputSize = circularPreview ? { width: 512, height: 512 } : { width: 900, height: 1950 };

  const previewStyle = useMemo(() => {
    const frame = frameRef.current;
    const frameWidth = frame?.clientWidth ?? 260;
    const frameHeight = frame?.clientHeight ?? 260 / aspectRatio;
    const baseScale = Math.max(frameWidth / imageSize.width, frameHeight / imageSize.height);
    const width = imageSize.width * baseScale * zoom;
    const height = imageSize.height * baseScale * zoom;

    return {
      width,
      height,
      transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
    };
  }, [aspectRatio, imageSize, offset, zoom]);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    setOffset({
      x: dragRef.current.offsetX + event.clientX - dragRef.current.x,
      y: dragRef.current.offsetY + event.clientY - dragRef.current.y,
    });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const crop = async () => {
    const image = imageRef.current;
    const frame = frameRef.current;
    if (!image || !frame) return;

    setSaving(true);
    const frameWidth = frame.clientWidth;
    const frameHeight = frame.clientHeight;
    const renderedWidth = Number(previewStyle.width);
    const renderedHeight = Number(previewStyle.height);
    const left = frameWidth / 2 - renderedWidth / 2 + offset.x;
    const top = frameHeight / 2 - renderedHeight / 2 + offset.y;
    const sx = Math.max(0, (-left / renderedWidth) * image.naturalWidth);
    const sy = Math.max(0, (-top / renderedHeight) * image.naturalHeight);
    const sw = Math.min(image.naturalWidth - sx, (frameWidth / renderedWidth) * image.naturalWidth);
    const sh = Math.min(image.naturalHeight - sy, (frameHeight / renderedHeight) * image.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = outputSize.width;
    canvas.height = outputSize.height;
    const context = canvas.getContext("2d");

    if (!context) {
      setSaving(false);
      return;
    }

    context.drawImage(image, sx, sy, sw, sh, 0, 0, outputSize.width, outputSize.height);
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setSaving(false);
        return;
      }
      await onConfirm(blob, outputSize.width, outputSize.height);
      setSaving(false);
    }, source.mimeType || "image/png", 0.92);
  };

  return (
    <div className="crop-dialog-backdrop" role="dialog" aria-modal="true" aria-label="图片裁切">
      <div className="crop-dialog glass-card" data-level="1">
        <div className="crop-dialog-head">
          <div>
            <strong>裁切图片</strong>
            <span>{source.fileName}</span>
          </div>
          <button className="close-button theme-pressable" type="button" onClick={onClose} aria-label="关闭">×</button>
        </div>
        <div
          ref={frameRef}
          className="crop-frame"
          data-circular={circularPreview}
          style={{ aspectRatio }}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <img
            ref={imageRef}
            src={source.objectUrl}
            alt="待裁切图片"
            style={previewStyle}
            onLoad={(event) => setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
            draggable={false}
          />
        </div>
        <label className="range-field">
          <span>缩放 {Math.round(zoom * 100)}%</span>
          <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
        </label>
        <div className="crop-actions">
          <button className="secondary-action theme-pressable" type="button" onClick={onClose}>取消</button>
          <button className="primary-action theme-pressable" type="button" disabled={saving} onClick={crop}>
            <Scissors size={17} />
            {saving ? "处理中" : "确认裁切"}
          </button>
        </div>
      </div>
    </div>
  );
}
