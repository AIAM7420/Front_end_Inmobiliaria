import React from 'react';

export interface ChatbotAvatarProps extends React.SVGAttributes<SVGSVGElement> {
  className?: string;
  isHovered?: boolean;
  isThinking?: boolean;
}

/**
 * Chatbot sphere avatar with expressive animated eyes.
 * Idle state: eyes open looking straight ahead, gentle alive breathing and natural blinking.
 * Hover state: eyes looking up-tilted matching the reference sphere avatar.
 * Colors: inmo-secondary & inmo-primary (inverted in dark mode).
 */
export const ChatbotAvatar: React.FC<ChatbotAvatarProps> = ({
  className = 'w-8 h-8',
  isHovered,
  isThinking,
  ...props
}) => {
  const forceHover = isHovered === true || isThinking === true;
  const forceIdle = isHovered === false && !isThinking;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inmo-chatbot-avatar select-none shrink-0 ${forceHover ? 'is-forced-hover' : ''} ${forceIdle ? 'is-forced-idle' : ''} ${className}`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <style>{`
        .inmo-chatbot-avatar {
          overflow: visible;
        }

        .inmo-avatar-body-float {
          animation: inmo-avatar-float 3.6s ease-in-out infinite;
          transform-origin: 50px 50px;
        }

        @keyframes inmo-avatar-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-2.5px);
          }
        }

        .inmo-avatar-left-eye {
          transform: translate(36.5px, 50px) rotate(0deg);
          transform-origin: 0 0;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }
        .inmo-avatar-right-eye {
          transform: translate(63.5px, 50px) rotate(0deg);
          transform-origin: 0 0;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }

        /* Natural blink animation when alive and not hovered */
        .inmo-avatar-blink-eye {
          transform-origin: 0px 0px;
          animation: inmo-avatar-blink 4.5s ease-in-out infinite;
        }

        @keyframes inmo-avatar-blink {
          0%, 88%, 94%, 100% {
            transform: scaleY(1);
          }
          91% {
            transform: scaleY(0.12);
          }
        }

        /* Hover states: direct hover, parent .group hover, or forced hover */
        .inmo-chatbot-avatar:not(.is-forced-idle):hover .inmo-avatar-left-eye,
        .group:hover .inmo-chatbot-avatar:not(.is-forced-idle) .inmo-avatar-left-eye,
        .inmo-chatbot-avatar.is-forced-hover .inmo-avatar-left-eye {
          transform: translate(33.5px, 29.2px) rotate(-4.3deg);
        }

        .inmo-chatbot-avatar:not(.is-forced-idle):hover .inmo-avatar-right-eye,
        .group:hover .inmo-chatbot-avatar:not(.is-forced-idle) .inmo-avatar-right-eye,
        .inmo-chatbot-avatar.is-forced-hover .inmo-avatar-right-eye {
          transform: translate(63.5px, 25.1px) rotate(-16.1deg);
        }

        /* When hovered, disable blink to keep eyes open */
        .inmo-chatbot-avatar:not(.is-forced-idle):hover .inmo-avatar-blink-eye,
        .group:hover .inmo-chatbot-avatar:not(.is-forced-idle) .inmo-avatar-blink-eye,
        .inmo-chatbot-avatar.is-forced-hover .inmo-avatar-blink-eye {
          animation: none !important;
          transform: scaleY(1) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .inmo-avatar-body-float,
          .inmo-avatar-blink-eye,
          .inmo-avatar-left-eye,
          .inmo-avatar-right-eye {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Floating Body Group */}
      <g className="inmo-avatar-body-float">
        {/* Sphere Body: Secondary in light mode, Primary in dark mode */}
        <circle
          cx="50"
          cy="50"
          r="50"
          className="fill-inmo-secondary dark:fill-inmo-primary transition-colors duration-300"
        />

        {/* Left Eye: Primary in light mode, Secondary in dark mode */}
        <g className="inmo-avatar-left-eye">
          <g className="inmo-avatar-blink-eye">
            <rect
              x="-9.5"
              y="-15.5"
              width="19"
              height="31"
              rx="9.5"
              className="fill-inmo-primary dark:fill-inmo-secondary transition-colors duration-300"
            />
          </g>
        </g>

        {/* Right Eye: Primary in light mode, Secondary in dark mode */}
        <g className="inmo-avatar-right-eye">
          <g className="inmo-avatar-blink-eye">
            <rect
              x="-9.5"
              y="-15"
              width="19"
              height="30"
              rx="9.5"
              className="fill-inmo-primary dark:fill-inmo-secondary transition-colors duration-300"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
