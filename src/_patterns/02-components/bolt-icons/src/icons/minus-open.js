// import { Preact, h } from 'preact';
const MinusOpen = ({ color, size, ...otherProps }) => {
  color = color || 'currentColor';
  size = size || '24';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...otherProps}>
      <title>Icon/utility/Indigo/24px/Minus-open</title>
      <g fill="none" fill-rule="evenodd">
        <path d="M0 0h24v24H0z" />
        <g fill="#1F2555">
          <path d="M12 21c-4.962 0-9-4.038-9-9s4.038-9 9-9 9 4.038 9 9-4.038 9-9 9m0-20C5.937 1 1 5.938 1 12s4.938 11 11 11 11-4.938 11-11S18.062 1 12 1" />
          <path d="M16 11H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1" />
        </g>
      </g>
    </svg>
  );
};
export default MinusOpen;
