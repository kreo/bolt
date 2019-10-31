import { unsafeCSS } from 'lit-element';
import { render, html } from 'lit-html';
import { BoltActionElement } from '@bolt/element';
import { convertInitialTags } from '@bolt/core/decorators';
import { ifDefined } from 'lit-html/directives/if-defined';
import classNames from 'classnames/bind';

import buttonStyles from './button.scss';
// import schema from '../button.schema.yml';

let cx = classNames.bind(buttonStyles);

// @customElement('bolt-v3-button')
@convertInitialTags(['button', 'a'])
class BoltButton extends BoltActionElement {
  // static lazyStyles = [buttonStyles];

  static get styles() {
    return [unsafeCSS(buttonStyles)];
  }

  static get properties() {
    return {
      color: String,
      text: String,
      size: String,
      rounded: Boolean, // DEPRECATED.  Use border-radius instead of rounded.
      borderRadius: String,
      iconOnly: Boolean,
      width: String,
      align: String,
      transform: String,
      disabled: Boolean,
      type: String,
      tabindex: Number,
      inert: Boolean, // will eventually go hand in hand with https://github.com/WICG/inert#notes-on-the-polyfill
    };
  }

  render() {
    const classes = cx('c-bolt-button', {
      'c-bolt-button--medium': !this.size, // Default size
      [`c-bolt-button--${this.size}`]: this.size,
      'c-bolt-button--primary': !this.color, // Default color
      [`c-bolt-button--${this.color}`]: this.color,
      [`c-bolt-button--${this.width}`]:
        this.width && this.width !== 'auto',
      'c-bolt-button--border-radius-regular': !this.borderRadius, // Default border radius
      'c-bolt-button--border-radius-full':
        this.rounded && !this.borderRadius, // DEPRECATED.  Use the border-radius property instead of rounded.
      [`c-bolt-button--border-radius-${this.borderRadius}`]: this
        .borderRadius,
      'c-bolt-button--center': !this.align, // Default align
      [`c-bolt-button--${this.align}`]: this.align,
      [`c-bolt-button--${this.transform}`]:
        this.transform && this.transform !== 'none',
      'c-bolt-button--disabled': this.disabled,
      'c-bolt-button--inert': this.tabindex === -1 || this.inert,
      'c-bolt-button--icon-only': this.iconOnly,
    });

    console.log('render!');


    // Decide on if the rendered button tag should be a <button> or <a> tag, based on if a URL exists OR if a link was passed in from the getgo
    const hasUrl = this.url && this.url.length > 0 && this.url !== 'null';

    // Assign default target attribute value if one isn't specified
    const urlTarget = this.target && hasUrl ? this.target : '_self';

    // The buttonElement to render, based on the initial HTML passed alone.
    let buttonElement = null;
    const self = this;

    const slotMarkup = name => {
      switch (name) {
        case 'before':
        case 'after':
          const iconClasses = cx('c-bolt-button__icon', {
            'is-empty': this.slotify(name) === false,
          });

          return this.slotify(name) && html`<span class="${iconClasses}">
            <span class="c-bolt-button__icon-sizer">
              ${this.slotify(name)}
            </span>
          </span>`;
        default:
          const itemClasses = cx('c-bolt-button__item', {
            'is-empty': this.slotify(name) === false,
          });

          return this.slotify('default') && html`<span class="${itemClasses}">
            ${this.slotify('default')}
          </span>`;
      }
    };

    const innerSlots = [
      slotMarkup('before'),
      slotMarkup('default'),
      slotMarkup('after'),
    ];



    if (this.rootElement) {
      buttonElement = this.rootElement.firstChild.cloneNode(true);
      buttonElement.className += ' ' + classes;

      // @todo: find automatic way to dissolve original HTML elements into their respective props + custom attributes
      if (buttonElement.tagName === 'A') {
        const url = this.url || this.originalUrl;

        if (this.disabled) {
          this.originalUrl = buttonElement.getAttribute('href');
          buttonElement.setAttribute('aria-disabled', 'true');
          buttonElement.removeAttribute('href');
        } else {
          buttonElement.removeAttribute('aria-disabled');

          if (url) {
            buttonElement.setAttribute('href', url);
          }
        }

        if (this.target) {
          buttonElement.setAttribute('target', this.target);
        }
      } else {
        if (this.disabled) {
          buttonElement.setAttribute('disabled', '');
        } else {
          buttonElement.removeAttribute('disabled');
        }
      }

      if (this.tabindex) {
        buttonElement.setAttribute('tabindex', this.tabindex);
      }

      render(innerSlots, buttonElement);
    } else if (hasUrl) {
      buttonElement = html`
        <a
          href="${ifDefined(
            this.url && !this.disabled ? this.url : undefined,
          )}"
          class="${classes}"
          target="${urlTarget}"
          tabindex=${ifDefined(
            this.tabindex === -1
              ? '-1'
              : this.tabindex
              ? this.tabindex
              : undefined,
          )}
          aria-disabled=${ifDefined(this.disabled ? 'true' : undefined)}
          >${innerSlots}</a
        >
      `;
    } else {
      buttonElement = html`
        <button
          class="${classes}"
          tabindex=${ifDefined(
            this.tabindex === -1
              ? '-1'
              : this.tabindex
              ? this.tabindex
              : undefined,
          )}
          type=${ifDefined(this.type ? this.type : undefined)}
          disabled=${ifDefined(this.disabled ? '' : undefined)}
        >
          ${innerSlots}
        </button>
      `;
    }

    return html`
      ${buttonElement}
    `;
  }
}

customElements.define('bolt-button', BoltButton);

export { BoltButton };
