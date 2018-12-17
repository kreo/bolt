import { define } from '@bolt/core/utils';
import { withLitHtml, html } from '@bolt/core/renderers/renderer-lit-html';

@define
class ReplaceWithChildren extends HTMLElement {
  static is = 'replace-with-children';

  connectedCallback() {
    const parentElement = this.parentElement;

    if (!parentElement) {
      Error(
        'The <replace-with-children> element needs a parent element to append to!',
      );
    }

    // Originally was this.replaceWith(...this.childNodes) but IE11 doesn't like that
    while (this.firstChild) {
      // double-check to confirm the parent element still exists
      if (parentElement) {
        parentElement.appendChild(this.firstChild);
      }
    }
    if (parentElement) {
      parentElement.removeChild(this);
    }
  }
}

export { ReplaceWithChildren };
