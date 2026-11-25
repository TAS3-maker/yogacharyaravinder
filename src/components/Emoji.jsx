// Renders emoji as Twemoji images (the same artwork the original site used),
// so emoji look identical on every phone/OS. Files live in /public/emoji.
const CODES = {
  '🔥': '1f525', '❄️': '2744', '❄': '2744', '✨': '2728', '⭐': '2b50', '👥': '1f465', '🧘': '1f9d8',
  '🌍': '1f30d', '🎯': '1f3af', '⏰': '23f0', '🌆': '1f306', '🌇': '1f306', '🕯️': '1f56f', '🕯': '1f56f', '🌟': '1f31f', '⏳': '23f3',
};
const RE = new RegExp('(' + Object.keys(CODES).sort((a, b) => b.length - a.length).join('|') + ')', 'u');

export const Emoji = ({ e, size }) => (
  <img className="emoji" src={`/emoji/${CODES[e]}.svg`} alt="" aria-hidden="true" width="72" height="72" style={size ? { width: size, height: size } : undefined} draggable="false" />
);

// Replace emoji inside plain strings (or arrays of nodes) with Twemoji images
export function tx(node) {
  if (typeof node === 'string') {
    if (!RE.test(node)) return node;
    return node.split(RE).filter(Boolean).map((part, i) => (CODES[part] ? <Emoji key={i} e={part} /> : part));
  }
  if (Array.isArray(node)) return node.map((n) => tx(n));
  return node;
}
