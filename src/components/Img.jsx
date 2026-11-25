// Responsive image: serves 414/828px WebP to phones and the full WebP to larger screens.
export default function Img({ src, sizes = '(max-width: 680px) 100vw, 50vw', priority, ...rest }) {
  const remote = /^https?:/.test(src); // not downloaded → single live-site file
  const at = (w) => src.replace(/\.webp$/, `-${w}.webp`);
  return (
    <img
      src={src}
      srcSet={remote ? undefined : `${at(414)} 414w, ${at(828)} 828w, ${src} 1400w`}
      sizes={remote ? undefined : sizes}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
      {...rest}
    />
  );
}
