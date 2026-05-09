'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCw, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';

interface ImageCropperModalProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedImage: Blob) => void;
  aspectRatio?: number;
}

export default function ImageCropperModal({ 
  image, 
  isOpen, 
  onClose, 
  onCropComplete,
  aspectRatio = 1
}: ImageCropperModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop: any) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onRotationChange = (rotation: number) => {
    setRotation(rotation);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0
  ): Promise<Blob | null> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(data, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = (rotation * Math.PI) / 180;
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  }

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <header className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Editor de <span className="text-indigo-600">Identidade</span></h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Ajuste seu logotipo para o padrão elite</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 relative bg-slate-50 min-h-[400px]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
            onRotationChange={onRotationChange}
          />
        </div>

        <footer className="p-8 bg-white border-t border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ZoomIn size={12} /> Zoom
                </span>
                <span className="text-[10px] font-black text-indigo-600">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <RotateCw size={12} /> Rotação
                </span>
                <span className="text-[10px] font-black text-indigo-600">{rotation}°</span>
              </div>
              <input
                type="range"
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-500 rounded-[18px] text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-100 transition-all italic"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 disabled:opacity-50 italic"
            >
              {isProcessing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {isProcessing ? "Processando..." : "Confirmar Recorte"}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
