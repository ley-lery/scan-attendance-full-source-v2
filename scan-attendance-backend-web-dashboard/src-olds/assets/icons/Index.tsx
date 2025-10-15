import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number; // Optional `size` prop for the icon
}

const UserOutlineIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 12.25a3.75 3.75 0 1 1 3.75-3.75A3.75 3.75 0 0 1 12 12.25m0-6a2.25 2.25 0 1 0 2.25 2.25A2.25 2.25 0 0 0 12 6.25m7 13a.76.76 0 0 1-.75-.75c0-1.95-1.06-3.25-6.25-3.25s-6.25 1.3-6.25 3.25a.75.75 0 0 1-1.5 0c0-4.75 5.43-4.75 7.75-4.75s7.75 0 7.75 4.75a.76.76 0 0 1-.75.75"
      />
    </svg>
  );
};
const RoomOutlineIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 7.5A4.5 4.5 0 0 1 7.5 3h17A4.5 4.5 0 0 1 29 7.5v17a4.5 4.5 0 0 1-4.5 4.5h-6.031a6 6 0 0 0 1.487-2H24.5a2.5 2.5 0 0 0 2.5-2.5v-17A2.5 2.5 0 0 0 24.5 5h-17A2.5 2.5 0 0 0 5 7.5v4.544a6 6 0 0 0-2 1.487zM7.5 13A4.5 4.5 0 0 0 3 17.5v7A4.5 4.5 0 0 0 7.5 29h7a4.5 4.5 0 0 0 4.5-4.5v-7a4.5 4.5 0 0 0-4.5-4.5zM5 17.5A2.5 2.5 0 0 1 7.5 15h7a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 5 24.5z"
      />
    </svg>
  );
};
const DashboardOutlineIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      {...props}
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M3.889 2.095a6.5 6.5 0 1 1 7.222 10.81A6.5 6.5 0 0 1 3.89 2.094zm.555 9.978A5.5 5.5 0 0 0 7.5 13A5.506 5.506 0 0 0 13 7.5a5.5 5.5 0 1 0-8.556 4.573M10.294 4l.706.707l-2.15 2.15a1.514 1.514 0 1 1-.707-.707L10.293 4zM7.221 7.916a.5.5 0 1 0 .556-.832a.5.5 0 0 0-.556.832m4.286-2.449l-.763.763c.166.403.253.834.255 1.27a3.46 3.46 0 0 1-.5 1.777l.735.735a4.48 4.48 0 0 0 .274-4.545zM8.733 4.242A3.4 3.4 0 0 0 7.5 4A3.5 3.5 0 0 0 4 7.5a3.46 3.46 0 0 0 .5 1.777l-.734.735A4.5 4.5 0 0 1 9.5 3.473z"
        clip-rule="evenodd"
      />
    </svg>
  );
};
const CustomerOutlineIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        color="currentColor"
      >
        <path d="M17 10.805c0-.346 0-.519.052-.673c.151-.448.55-.621.95-.803c.448-.205.672-.307.895-.325c.252-.02.505.034.721.155c.286.16.486.466.69.714c.943 1.146 1.415 1.719 1.587 2.35c.14.51.14 1.044 0 1.553c-.251.922-1.046 1.694-1.635 2.41c-.301.365-.452.548-.642.655a1.27 1.27 0 0 1-.721.155c-.223-.018-.447-.12-.896-.325c-.4-.182-.798-.355-.949-.803c-.052-.154-.052-.327-.052-.673zm-10 0c0-.436-.012-.827-.364-1.133c-.128-.111-.298-.188-.637-.343c-.449-.204-.673-.307-.896-.325c-.667-.054-1.026.402-1.41.87c-.944 1.145-1.416 1.718-1.589 2.35a2.94 2.94 0 0 0 0 1.553c.252.921 1.048 1.694 1.636 2.409c.371.45.726.861 1.363.81c.223-.018.447-.12.896-.325c.34-.154.509-.232.637-.343c.352-.306.364-.697.364-1.132z" />
        <path d="M5 9c0-3.314 3.134-6 7-6s7 2.686 7 6m0 8v.8c0 1.767-1.79 3.2-4 3.2h-2" />
      </g>
    </svg>
  );
};
const ReservationIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 2048 2048"
      {...props}
    >
      <path
        fill="currentColor"
        d="M896 512v128H512V512zM512 896V768h384v128zm0 256v-128h256v128zM384 512v128H256V512zm0 256v128H256V768zm-128 384v-128h128v128zM128 128v1792h640v128H0V0h1115l549 549v219h-128V640h-512V128zm1024 91v293h293zm640 805h256v1024H896V1024h256V896h128v128h384V896h128zm128 896v-512h-896v512zm0-640v-128h-896v128z"
      />
    </svg>
  );
};
const TrashOutlineIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="m112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
      />
      <path
        fill="currentColor"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-miterlimit="10"
        stroke-width="32"
        d="M80 112h352"
      />
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40m-64 64v224m-72-224l8 224m136-224l-8 224"
      />
    </svg>
  );
};
const PencilIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="M364.13 125.25L87 403l-23 45l44.99-23l277.76-277.13zm56.56-56.56l-22.62 22.62l22.62 22.63l22.62-22.63a16 16 0 0 0 0-22.62h0a16 16 0 0 0-22.62 0"
      />
    </svg>
  );
};
const PencilOutlineIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      role="presentation"
      viewBox="0 0 20 20"
      width={size}
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};
const EyeOutlineIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      width={size}
      role="presentation"
      viewBox="0 0 20 20"
      {...props}
    >
      <path
        d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

const TrashIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      role="presentation"
      viewBox="0 0 20 20"
      width={size}
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

const NotificationOutlineIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 36 36"
      {...props}
    >
      <path
        fill="currentColor"
        d="m32.85 28.13l-.34-.3A14.4 14.4 0 0 1 30 24.9a12.6 12.6 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.6 12.6 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93l-.34.3v2.82h29.8Z"
        className="clr-i-solid clr-i-solid-path-1"
      />
      <path
        fill="currentColor"
        d="M15.32 32a2.65 2.65 0 0 0 5.25 0Z"
        className="clr-i-solid clr-i-solid-path-2"
      />
      <path fill="none" d="M0 0h36v36H0z" />
    </svg>
  );
};

const SunIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 16.5A4.505 4.505 0 0 1 7.5 12c0-2.481 2.019-4.5 4.5-4.5s4.5 2.019 4.5 4.5s-2.019 4.5-4.5 4.5"
      />
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M12 3a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 12 3m6 9a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5M3 12a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 3 12m9 6a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5m6.354-12.354a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0m-10.5 10.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0m-2.208-10.5a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 1 1-.708.708l-1.5-1.5a.5.5 0 0 1 0-.708m10.5 10.5a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708l-1.5-1.5a.5.5 0 0 1 0-.708"
        clip-rule="evenodd"
      />
    </svg>
  );
};
const SunOutlineIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" stroke="currentColor">
        <path d="M12 16c-2.206 0-4-1.794-4-4s1.794-4 4-4s4 1.794 4 4s-1.794 4-4 4Z" />
        <path
          stroke-linecap="round"
          d="M12 3.5v2m8.5 6.5h-2m-13 0h-2m8.5 6.5v2m4.5-13L18 6M6 18l1.5-1.5M6 6l1.5 1.5m9 9L18 18"
        />
      </g>
    </svg>
  );
};
const MoonIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11.38 2.019a7.5 7.5 0 1 0 10.6 10.6C21.662 17.854 17.316 22 12.001 22C6.477 22 2 17.523 2 12c0-5.315 4.146-9.661 9.38-9.981"
      />
    </svg>
  );
};
const MoonOutlineIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M21 12.808c-.5 5.347-5.849 9.14-11.107 7.983C-.078 18.6 1.15 3.909 11.11 3C6.395 9.296 14.619 17.462 21 12.808"
      />
    </svg>
  );
};
const SearchIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none" fill-rule="evenodd">
        <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
        <path
          fill="currentColor"
          d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"
        />
      </g>
    </svg>
  );
};
const AddIcon = ({ size = 24, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M11 13H6q-.425 0-.712-.288T5 12t.288-.712T6 11h5V6q0-.425.288-.712T12 5t.713.288T13 6v5h5q.425 0 .713.288T19 12t-.288.713T18 13h-5v5q0 .425-.288.713T12 19t-.712-.288T11 18z"
      />
    </svg>
  );
};
export const Icons = {
  UserOutlineIcon,
  RoomOutlineIcon,
  DashboardOutlineIcon,
  CustomerOutlineIcon,
  ReservationIcon,
  TrashOutlineIcon,
  PencilIcon,
  PencilOutlineIcon,
  EyeOutlineIcon,
  TrashIcon,
  NotificationOutlineIcon,
  SunIcon,
  SunOutlineIcon,
  MoonIcon,
  MoonOutlineIcon,
  SearchIcon,
  AddIcon,
};
