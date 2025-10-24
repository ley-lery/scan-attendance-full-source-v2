
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface PickerOption {
  value: string;
  label: string;
}

interface ScrollPickerProps {
  options: PickerOption[];
  value?: string;
  onChange?: (value: string) => void;
  itemHeight?: number;
}

const ScrollPicker: React.FC<ScrollPickerProps> = ({
  options,
  value,
  onChange,
  itemHeight = 40,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(
    options.findIndex(opt => opt.value === value) || 0
  );
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const snapToNearest = (currentY: number) => {
    const index = Math.round(-currentY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
    const targetY = -clampedIndex * itemHeight;
    
    animate(y, targetY, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
    
    setSelectedIndex(clampedIndex);
    onChange?.(options[clampedIndex].value);
  };

  useEffect(() => {
    const newIndex = options.findIndex(opt => opt.value === value);
    if (newIndex !== -1 && newIndex !== selectedIndex) {
      setSelectedIndex(newIndex);
      y.set(-newIndex * itemHeight);
    }
  }, [value, options, itemHeight]);

  return (
    <div className="relative w-48 h-40 overflow-hidden bg-white rounded-lg shadow-lg">
      {/* Top fade overlay */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      
      {/* Selection indicator */}
      <div 
        className="absolute left-0 right-0 border-t-2 border-b-2 border-blue-500 pointer-events-none z-10"
        style={{ 
          top: '50%', 
          transform: 'translateY(-50%)',
          height: `${itemHeight}px`
        }}
      />
      
      {/* Bottom fade overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      
      {/* Scrollable content */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          drag="y"
          dragConstraints={{
            top: -(options.length - 1) * itemHeight,
            bottom: 0,
          }}
          dragElastic={0.1}
          onDragStart={() => {
            isDragging.current = true;
          }}
          onDragEnd={() => {
            isDragging.current = false;
            snapToNearest(y.get());
          }}
          style={{ y }}
          className="w-full"
        >
          <div style={{ paddingTop: `${itemHeight * 2}px`, paddingBottom: `${itemHeight * 2}px` }}>
            {options.map((option, index) => {
              const offset = useTransform(
                y,
                (latest) => {
                  const distance = Math.abs(latest + index * itemHeight);
                  return Math.max(0, 1 - distance / (itemHeight * 2));
                }
              );

              const scale = useTransform(offset, [0, 1], [0.7, 1]);
              const opacity = useTransform(offset, [0, 1], [0.3, 1]);

              return (
                <motion.div
                  key={option.value}
                  style={{
                    height: `${itemHeight}px`,
                    scale,
                    opacity,
                  }}
                  className="flex items-center justify-center cursor-pointer select-none"
                  onClick={() => {
                    if (!isDragging.current) {
                      animate(y, -index * itemHeight, {
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      });
                      setSelectedIndex(index);
                      onChange?.(option.value);
                    }
                  }}
                >
                  <span className="text-lg font-medium text-gray-800">
                    {option.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};