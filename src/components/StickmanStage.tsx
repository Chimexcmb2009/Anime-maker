import React, { useEffect, useState } from 'react';
import { SkitScene } from '../data/sounds.ts';

interface StickmanStageProps {
  scene: SkitScene;
  activeDialogue?: {
    speaker: string;
    text: string;
    pidginOrEnglish: string;
    mood: string;
  } | null;
  activeSoundCue?: string | null;
  isPlaying: boolean;
  characters: { name: string; color: string }[];
}

export const StickmanStage: React.FC<StickmanStageProps> = ({
  scene,
  activeDialogue,
  activeSoundCue,
  isPlaying,
  characters,
}) => {
  const [frame, setFrame] = useState(0);

  // Animation cycle tick for dynamic mouth movement, bobbing, and running
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 60);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const char1Pose = scene?.stickmanPoses?.character1Pose || 'standing';
  const char2Pose = scene?.stickmanPoses?.character2Pose || 'standing';
  const char1Name = characters[0]?.name || 'Character 1';
  const char2Name = characters[1]?.name || 'Character 2';
  const char1Color = characters[0]?.color || '#f59e0b';
  const char2Color = characters[1]?.color || '#10b981';

  const isChar1Speaking = !!(
    activeDialogue?.speaker &&
    char1Name &&
    activeDialogue.speaker.toLowerCase().includes(char1Name.toLowerCase())
  );
  const isChar2Speaking = !!(
    activeDialogue?.speaker &&
    char2Name &&
    activeDialogue.speaker.toLowerCase().includes(char2Name.toLowerCase())
  );

  // Render Stickman SVG figure with expressive cartoon styling
  const renderStickman = (
    pose: string,
    color: string,
    isSpeaking: boolean,
    direction: 'left' | 'right',
    name: string
  ) => {
    const isRight = direction === 'right';
    const mouthOpen = isSpeaking && frame % 2 === 0;
    const bounceY = isPlaying ? Math.sin(frame * 0.4) * 3 : 0;
    const runCycle = Math.sin(frame * 0.8) * 18;

    return (
      <g
        transform={`translate(${isRight ? 350 : 150}, ${250 + bounceY}) scale(${isRight ? -1 : 1}, 1)`}
        className="transition-transform duration-200"
      >
        {/* Name tag above head */}
        <text
          x="0"
          y="-135"
          textAnchor="middle"
          fill="#cbd5e1"
          fontSize="13"
          fontWeight="bold"
          transform={isRight ? 'scale(-1, 1)' : ''}
          className="select-none tracking-wide"
        >
          {name}
        </text>

        {/* Head */}
        <circle
          cx="0"
          cy="-90"
          r="28"
          fill="#fef08a"
          stroke={color}
          strokeWidth="4"
          className="shadow-lg"
        />

        {/* Eyes based on pose */}
        {pose === 'shocked' || pose === 'falling' ? (
          <>
            {/* Wide shocked eyes */}
            <circle cx="-9" cy="-94" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <circle cx="9" cy="-94" r="5" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <circle cx="-9" cy="-94" r="2" fill="#0f172a" />
            <circle cx="9" cy="-94" r="2" fill="#0f172a" />
            {/* Pop sweat marks */}
            <path d="M 28 -110 Q 35 -118 40 -110" stroke="#38bdf8" strokeWidth="3" fill="none" />
          </>
        ) : pose === 'slapping' ? (
          <>
            {/* Angry slanting eyes */}
            <line x1="-15" y1="-98" x2="-3" y2="-94" stroke="#0f172a" strokeWidth="3" />
            <line x1="3" y1="-94" x2="15" y2="-98" stroke="#0f172a" strokeWidth="3" />
            <circle cx="-8" cy="-92" r="2.5" fill="#0f172a" />
            <circle cx="8" cy="-92" r="2.5" fill="#0f172a" />
          </>
        ) : (
          <>
            {/* Normal smiling eyes */}
            <circle cx="-8" cy="-93" r="3" fill="#0f172a" />
            <circle cx="8" cy="-93" r="3" fill="#0f172a" />
          </>
        )}

        {/* Mouth */}
        {mouthOpen ? (
          <ellipse cx="0" cy="-78" rx="7" ry="6" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />
        ) : pose === 'shocked' ? (
          <ellipse cx="0" cy="-78" rx="8" ry="8" fill="#0f172a" />
        ) : pose === 'slapping' ? (
          <path d="M -10 -76 Q 0 -84 10 -76" stroke="#0f172a" strokeWidth="3" fill="none" />
        ) : (
          <path d="M -8 -78 Q 0 -70 8 -78" stroke="#0f172a" strokeWidth="3" fill="none" />
        )}

        {/* Traditional Cap or Headgear accent */}
        {isRight ? (
          // Nigerian Head Tie (Gele style shape)
          <path
            d="M -30 -110 C -10 -135 15 -135 32 -110 C 20 -105 0 -115 -30 -110"
            fill={color}
            stroke="#0f172a"
            strokeWidth="2"
          />
        ) : (
          // Red Igbo Chief / Yoruba Fila cap
          <path
            d="M -22 -112 Q 0 -130 22 -112 Z"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="2"
          />
        )}

        {/* Torso */}
        <line x1="0" y1="-62" x2="0" y2="10" stroke={color} strokeWidth="7" strokeLinecap="round" />

        {/* Arms */}
        {pose === 'slapping' ? (
          <>
            {/* Windup and slap strike arm */}
            <path
              d={`M 0 -45 Q 40 ${frame % 2 === 0 ? -90 : -20} 80 -10`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            {/* Hand with comic slipper / palm */}
            <circle cx="82" cy="-10" r="10" fill="#dc2626" stroke="#0f172a" strokeWidth="2" />
            <line x1="0" y1="-45" x2="-25" y2="-10" stroke={color} strokeWidth="6" strokeLinecap="round" />
          </>
        ) : pose === 'shocked' ? (
          <>
            {/* Both arms raised to cheeks */}
            <path d="M 0 -45 L -35 -80 L -25 -88" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 0 -45 L 35 -80 L 25 -88" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        ) : pose === 'dancing' ? (
          <>
            {/* Afrobeat groovy arms */}
            <path
              d={`M 0 -45 L -40 ${-20 + Math.sin(frame * 0.6) * 25} L -65 ${-40 + Math.cos(frame * 0.6) * 20}`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M 0 -45 L 40 ${-50 + Math.cos(frame * 0.6) * 25} L 65 ${-20 + Math.sin(frame * 0.6) * 20}`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : pose === 'running' ? (
          <>
            {/* Pumped running arms */}
            <path
              d={`M 0 -45 L -35 ${-45 + runCycle} L -60 ${-20 - runCycle}`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M 0 -45 L 35 ${-45 - runCycle} L 60 ${-20 + runCycle}`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* Expressive Talking / Gesturing arms */}
            <path
              d={`M 0 -45 L -35 ${isSpeaking ? -40 + Math.sin(frame * 0.5) * 15 : -25} L -55 -10`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M 0 -45 L 30 ${isSpeaking ? -50 + Math.cos(frame * 0.5) * 15 : -35} L 55 -55`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {/* Legs */}
        {pose === 'running' ? (
          <>
            {/* Comic running legs cycling */}
            <path
              d={`M 0 10 L ${-25 + runCycle} 55 L ${-45 + runCycle * 1.3} 90`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M 0 10 L ${25 - runCycle} 55 L ${45 - runCycle * 1.3} 90`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : pose === 'dancing' ? (
          <>
            <path
              d={`M 0 10 L ${-20 + Math.sin(frame * 0.5) * 12} 50 L -35 88`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M 0 10 L ${20 - Math.sin(frame * 0.5) * 12} 50 L 35 88`}
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : pose === 'falling' ? (
          <>
            {/* Legs kicked up in the air */}
            <path d="M 0 10 L -40 -15 L -60 -45" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 0 10 L -15 -25 L -25 -65" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            {/* Standing legs */}
            <path d="M 0 10 L -20 50 L -25 90" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M 0 10 L 20 50 L 25 90" stroke={color} strokeWidth="6" strokeLinecap="round" fill="none" />
          </>
        )}
      </g>
    );
  };

  return (
    <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center select-none">
      <svg
        viewBox="0 0 500 350"
        className="w-full h-full object-contain pointer-events-none"
      >
        <defs>
          <linearGradient id="floorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="stageSpotlight" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
            <stop offset="60%" stopColor="#1e1b4b" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Stage Backdrop / Setting Elements */}
        <rect x="0" y="0" width="500" height="350" fill="url(#stageSpotlight)" />

        {/* Ambient Room Furniture / Setting */}
        <g opacity="0.3">
          {/* Floor line */}
          <line x1="0" y1="290" x2="500" y2="290" stroke="#334155" strokeWidth="2" strokeDasharray="8 6" />
          {/* Wall Clock */}
          <circle cx="250" cy="55" r="22" stroke="#64748b" strokeWidth="3" fill="none" />
          <line x1="250" y1="55" x2="250" y2="42" stroke="#64748b" strokeWidth="2" />
          <line x1="250" y1="55" x2="260" y2="55" stroke="#64748b" strokeWidth="2" />
          {/* Ceiling Lamp */}
          <line x1="250" y1="0" x2="250" y2="25" stroke="#475569" strokeWidth="2" />
          <polygon points="235,32 265,32 250,22" fill="#eab308" opacity="0.6" />
        </g>

        {/* Scene Props if specified */}
        {scene?.stickmanPoses?.propInHand && (
          <g transform="translate(250, 200)" className="animate-pulse">
            <rect x="-40" y="-14" width="80" height="26" rx="13" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="0" y="4" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="bold">
              📦 {scene.stickmanPoses.propInHand.slice(0, 16)}
            </text>
          </g>
        )}

        {/* Character 1 (Left) */}
        {renderStickman(char1Pose, char1Color, isChar1Speaking ?? false, 'left', char1Name)}

        {/* Character 2 (Right) */}
        {renderStickman(char2Pose, char2Color, isChar2Speaking ?? false, 'right', char2Name)}

        {/* Impact / Slap FX Explosion Star */}
        {(char1Pose === 'slapping' || char2Pose === 'slapping' || activeSoundCue === 'sfx-loud-slap') && (
          <g transform="translate(250, 180)" className="animate-ping">
            <path
              d="M 0 -35 L 10 -10 L 35 -15 L 15 5 L 30 30 L 5 15 L -10 35 L -15 10 L -35 15 L -15 -5 Z"
              fill="#ef4444"
              opacity="0.9"
            />
            <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">
              POW!
            </text>
          </g>
        )}

        {/* Sound FX Cue Badge Indicator in Canvas */}
        {activeSoundCue && (
          <g transform="translate(250, 90)">
            <rect x="-85" y="-18" width="170" height="34" rx="17" fill="#0f172a" stroke="#10b981" strokeWidth="2" opacity="0.95" />
            <text x="0" y="4" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="bold">
              🔊 {activeSoundCue.replace('sfx-', '').replace(/-/g, ' ').toUpperCase()}
            </text>
          </g>
        )}

        {/* Speech Bubble on Canvas for the Speaking Character */}
        {activeDialogue && (
          <g
            transform={`translate(${isChar2Speaking ? 340 : 160}, 100)`}
            className="transition-all duration-300"
          >
            {/* Bubble background */}
            <path
              d="M -90 -45 L 90 -45 Q 100 -45 100 -35 L 100 15 Q 100 25 90 25 L 15 25 L 0 45 L -10 25 L -90 25 Q -100 25 -100 15 L -100 -35 Q -100 -45 -90 -45 Z"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="3"
            />
            {/* Speaker Tag */}
            <text x="-90" y="-30" fill="#3b82f6" fontSize="9" fontWeight="black">
              {activeDialogue.speaker.toUpperCase()}:
            </text>
            {/* Dialogue text preview */}
            <text
              x="0"
              y="-10"
              textAnchor="middle"
              fill="#0f172a"
              fontSize="11"
              fontWeight="bold"
            >
              {activeDialogue.pidginOrEnglish.length > 28
                ? activeDialogue.pidginOrEnglish.slice(0, 26) + '...'
                : activeDialogue.pidginOrEnglish}
            </text>
            <text
              x="0"
              y="10"
              textAnchor="middle"
              fill="#64748b"
              fontSize="9"
              fontStyle="italic"
            >
              [{activeDialogue.mood}]
            </text>
          </g>
        )}
      </svg>

      {/* Camera Angle & Setting Overlay Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
          {(scene?.cameraAngle || 'two_shot').replace('_', ' ')}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-600/40 text-[10px] font-semibold text-emerald-400">
          Stickman Mode
        </span>
      </div>
    </div>
  );
};
