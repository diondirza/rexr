import DOMPurify from 'isomorphic-dompurify';

export default function sanitize(dirtyHtml, options = null) {
  return DOMPurify.sanitize(dirtyHtml.replace(/\n/g, '<br />'), options);
}
