'use client';

import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { 
  Pencil, 
  Square, 
  Circle, 
  Minus, 
  Type, 
  Eraser, 
  Undo2, 
  Redo2, 
  Trash2, 
  ImagePlus,
  Download,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

type Tool = 'pencil' | 'marker' | 'eraser' | 'line' | 'rectangle' | 'circle' | 'text';

interface Point {
  x: number;
  y: number;
}

interface CanvasState {
  imageData: ImageData;
}

const COLORS = [
  '#000000', // Black
  '#ffffff', // White
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#6b7280', // Gray
];

const STROKE_WIDTHS = [2, 4, 8, 16];

export interface SketchCanvasRef {
  getImageData: () => string | null;
  clearCanvas: () => void;
  loadImage: (dataUrl: string) => void;
}

interface SketchCanvasProps {
  width?: number;
  height?: number;
  onChange?: (hasContent: boolean) => void;
  initialImage?: string;
}

const SketchCanvas = forwardRef<SketchCanvasRef, SketchCanvasProps>(function SketchCanvas({ 
  width = 800, 
  height = 600, 
  onChange,
  initialImage 
}, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<Point | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    getImageData: () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return canvas.toDataURL('image/png');
    },
    clearCanvas: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    loadImage: (dataUrl: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = dataUrl;
    },
  }));

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial state
    saveState();

    // Load initial image if provided
    if (initialImage) {
      loadImage(initialImage);
    }
  }, []);

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newState: CanvasState = { imageData };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newState);
      // Limit history to 20 states
      if (newHistory.length > 20) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const state = history[newIndex];
      if (state) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
          ctx.putImageData(state.imageData, 0, 0);
        }
      }
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const state = history[newIndex];
      if (state) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
          ctx.putImageData(state.imageData, 0, 0);
        }
      }
    }
  }, [history, historyIndex]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
      onChange?.(false);
    }
  }, [onChange, saveState]);

  const loadImage = useCallback((dataUrl: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = new Image();
    img.onload = () => {
      // Clear canvas first
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw image centered and scaled to fit
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height,
        1
      );
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      saveState();
      onChange?.(true);
    };
    img.src = dataUrl;
  }, [onChange, saveState]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        loadImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `sketch-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) / zoom,
      y: (clientY - rect.top) / zoom
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    setStartPoint(coords);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (tool === 'text') {
      setTextPosition(coords);
      setShowTextInput(true);
      setIsDrawing(false);
      return;
    }

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = strokeWidth * 2;
    } else if (tool === 'marker') {
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth * 2;
      ctx.globalAlpha = 0.5;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.globalAlpha = 1;
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !startPoint) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (tool === 'rectangle' || tool === 'circle' || tool === 'line') {
      // For shapes, restore the canvas state and redraw
      const state = history[historyIndex];
      if (state) {
        ctx.putImageData(state.imageData, 0, 0);
      }

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      if (tool === 'rectangle') {
        ctx.strokeRect(
          startPoint.x,
          startPoint.y,
          coords.x - startPoint.x,
          coords.y - startPoint.y
        );
      } else if (tool === 'circle') {
        const radius = Math.sqrt(
          Math.pow(coords.x - startPoint.x, 2) + Math.pow(coords.y - startPoint.y, 2)
        );
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (tool === 'line') {
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      }
    } else {
      // Freehand drawing
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setStartPoint(null);
    saveState();
    onChange?.(true);
  };

  const handleTextSubmit = () => {
    if (!textPosition || !textInput.trim()) {
      setShowTextInput(false);
      setTextInput('');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.font = `${strokeWidth * 4}px Inter, sans-serif`;
    ctx.fillStyle = color;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillText(textInput, textPosition.x, textPosition.y);

    saveState();
    onChange?.(true);
    setShowTextInput(false);
    setTextInput('');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-lg">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
        {/* Tools */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setTool('pencil')}
            className={`p-2 rounded-lg transition-colors ${tool === 'pencil' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Pencil"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('marker')}
            className={`p-2 rounded-lg transition-colors ${tool === 'marker' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Marker"
          >
            <div className="w-4 h-4 rounded-full border-2 border-current" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            onClick={() => setTool('line')}
            className={`p-2 rounded-lg transition-colors ${tool === 'line' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Line"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('rectangle')}
            className={`p-2 rounded-lg transition-colors ${tool === 'rectangle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Rectangle"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-2 rounded-lg transition-colors ${tool === 'circle' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Circle"
          >
            <Circle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('text')}
            className={`p-2 rounded-lg transition-colors ${tool === 'text' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Text"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? 'border-gray-800 scale-110' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        {/* Stroke Width */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          {STROKE_WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => setStrokeWidth(w)}
              className={`p-2 rounded-lg transition-colors ${strokeWidth === w ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
              title={`${w}px`}
            >
              <div 
                className="rounded-full bg-current" 
                style={{ width: Math.max(w, 8), height: Math.max(w, 8) }}
              />
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Upload Image"
          >
            <ImagePlus className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={downloadImage}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearCanvas}
            className="p-2 rounded-lg hover:bg-red-100 text-red-600"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-auto bg-gray-100 p-4 flex items-center justify-center">
        <div 
          className="relative bg-white shadow-lg"
          style={{ 
            width: width * zoom, 
            height: height * zoom,
            transform: `scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="cursor-crosshair touch-none"
            style={{ width: '100%', height: '100%' }}
          />
          
          {/* Text Input Overlay */}
          {showTextInput && textPosition && (
            <div 
              className="absolute z-10"
              style={{ 
                left: textPosition.x * zoom, 
                top: textPosition.y * zoom 
              }}
            >
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTextSubmit();
                  if (e.key === 'Escape') {
                    setShowTextInput(false);
                    setTextInput('');
                  }
                }}
                onBlur={handleTextSubmit}
                placeholder="Type..."
                className="px-2 py-1 border-2 border-blue-500 rounded bg-white/90 text-sm min-w-[150px]"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center justify-center gap-2 p-2 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
          className="p-1.5 rounded-lg hover:bg-gray-200"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-600 min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(2, z + 0.25))}
          className="p-1.5 rounded-lg hover:bg-gray-200"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});

export default SketchCanvas;

export function getCanvasImage(canvas: HTMLCanvasElement | null): string | null {
  if (!canvas) return null;
  return canvas.toDataURL('image/png');
}
