import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './TiltedCard.css';

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showTooltip?: boolean;
  /** Disable 3D tilt — use when card is inside a parent with perspective transforms */
  disableTilt?: boolean;
  className?: string;
}

const fastSpring = { damping: 25, stiffness: 200, mass: 0.8 };
const softSpring = { damping: 28, stiffness: 180, mass: 1 };

export default function TiltedCard({
  imageSrc,
  altText = 'Card image',
  captionText = '',
  scaleOnHover = 1.08,
  rotateAmplitude = 14,
  showTooltip = true,
  disableTilt = false,
  className = '',
}: TiltedCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Cursor position for glare
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Tilt springs — only active when tilt is not disabled
  const rotateX = useSpring(useMotionValue(0), fastSpring);
  const rotateY = useSpring(useMotionValue(0), fastSpring);
  const scale = useSpring(1, softSpring);
  const glareOpacity = useSpring(useMotionValue(0), softSpring);

  // Tooltip springs
  const tooltipX = useSpring(useMotionValue(0), { damping: 30, stiffness: 300 });
  const tooltipY = useSpring(useMotionValue(0), { damping: 30, stiffness: 300 });
  const tooltipOpacity = useSpring(useMotionValue(0), softSpring);
  const tooltipRotate = useSpring(useMotionValue(0), { damping: 20, stiffness: 200 });

  const [lastY, setLastY] = useState(0);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Only apply tilt when not disabled
    if (!disableTilt) {
      const rY = (dx / (rect.width / 2)) * rotateAmplitude;
      const rX = (dy / (rect.height / 2)) * -rotateAmplitude;
      rotateX.set(rX);
      rotateY.set(rY);
    }

    // Tooltip follows cursor
    tooltipX.set(e.clientX - rect.left + 16);
    tooltipY.set(e.clientY - rect.top - 12);

    // Glare follows cursor
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);

    // Velocity for tooltip rotation
    const velocityY = dy - lastY;
    tooltipRotate.set(-velocityY * 0.8);
    setLastY(dy);
  }

  function handleMouseEnter() {
    setIsHovered(true);
    scale.set(scaleOnHover);
    glareOpacity.set(0.35);
    tooltipOpacity.set(1);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    scale.set(1);
    glareOpacity.set(0);
    tooltipOpacity.set(0);
    if (!disableTilt) {
      rotateX.set(0);
      rotateY.set(0);
    }
    tooltipRotate.set(0);
    setLastY(0);
  }

  const tiltStyle = disableTilt
    ? {}
    : { rotateX, rotateY };

  return (
    <div
      ref={wrapperRef}
      className={`tilted-card-wrapper ${isHovered ? 'is-hovered' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="tilted-card-inner"
        style={{ scale, ...tiltStyle }}
        transition={{ scale: { type: 'spring', damping: 25, stiffness: 200 } }}
      >
        {/* Hover zoom layer */}
        <motion.div
          className="tilted-card-zoom"
          animate={{ scale: isHovered ? 1.12 : 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        >
          <img
            src={imageSrc}
            alt={altText}
            className="tilted-card-img"
            draggable={false}
          />
        </motion.div>

        {/* Glare overlay */}
        <motion.div
          className="tilted-card-glare"
          style={{
            background: `radial-gradient(circle 200px at ${mouseX.get()}px ${mouseY.get()}px, rgba(245,245,220,0.3) 0%, transparent 60%)`,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Color grade */}
        <div className="tilted-card-grade" />
      </motion.div>

      {/* Cursor tooltip */}
      {showTooltip && captionText && (
        <motion.div
          className="tilted-card-tooltip"
          style={{ x: tooltipX, y: tooltipY, opacity: tooltipOpacity, rotate: tooltipRotate }}
        >
          {captionText}
        </motion.div>
      )}
    </div>
  );
}
