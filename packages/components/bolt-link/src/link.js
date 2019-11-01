import { props, define } from '@bolt/core/utils';
import { html, render } from '@bolt/core/renderers/renderer-lit-html';
import { BoltAction } from '@bolt/core/elements/bolt-action';
import { convertInitialTags } from '@bolt/core/decorators';

import classNames from 'classnames/bind';

import styles from './link.scss';
import schema from '../link.schema.yml';

let cx = classNames.bind(styles);

@define
@convertInitialTags('a') // The first matching tag will have its attributes converted to component props
class BoltLink extends BoltAction {
  static is = 'bolt-link';

  static props = {
    ...BoltAction.props, // Provides: disabled, onClick, onClickTarget, target, url
    display: props.string,
    valign: props.string,
    isHeadline: props.boolean,
  };

  // https://github.com/WebReflection/document-register-element#upgrading-the-constructor-context
  constructor(self) {
    self = super(self);
    self.schema = schema;
    return self;
  }

  render() {
    // 1. Remove line breaks before and after lit-html template tags, causes unwanted space inside and around inline links
    // 2. Zero Width No-break Space (&#xfeff;) is needed to make the last word always stick with the icon, so the icon will never become an orphan.

    // Validate the original prop data passed along -- returns back the validated data w/ added default values
    const { display, valign, url, target, isHeadline } = this.validateProps(
      this.props,
    );

    const classes = cx('c-bolt-link', {
      [`c-bolt-link--display-${display}`]: display,
      [`c-bolt-link--valign-${valign}`]: valign,
      [`c-bolt-link--headline`]: isHeadline,
    });

    // Decide on if the rendered button tag should be a <button> or <a> tag, based on if a URL exists OR if a link was passed in from the getgo
    const hasUrl = this.props.url.length > 0 && this.props.url !== 'null';

    // Assign default target attribute value if one isn't specified
    const anchorTarget =
      this.props.target && hasUrl ? this.props.target : '_self';

    // The linkElement to render, based on the initial HTML passed alone.
    let renderedLink;

    // 1. Remove line breaks before and after lit-html template tags, causes unwanted space inside and around inline links
    // 2. Zero Width No-break Space (&#xfeff;) is needed to make the last word always stick with the icon, so the icon will never become an orphan.
    // prettier-ignore
    const innerSlots = html`${
      'before' in this.slots
        ? html`<span class="${cx(`c-bolt-link__icon`)}">&#xfeff;${this.slot('before')}</span>`
        : html`<slot name="before" />`}${
      'default' in this.slots
        ? html`<span class="${cx(`c-bolt-link__text`)}">${this.slot('default')}</span>`
        : html`<slot />`}${
      'after' in this.slots
        ? html`<span class="${cx(`c-bolt-link__icon`)}">&#xfeff;${this.slot('after')}</span>`
        : html`<slot name="after" />`}`;

    if (this.rootElement) {
      renderedLink = this.rootElement.firstChild.cloneNode(true);
      if (renderedLink.getAttribute('href') === null && hasUrl) {
        renderedLink.setAttribute('href', this.props.url);
      }
      renderedLink.className += ' ' + classes;
      render(innerSlots, renderedLink);
    } else {
      // [1]
      // prettier-ignore
      renderedLink = html`<a href="${this.props.url}" class="${classes}" target="${anchorTarget}"
          >${innerSlots}</a
        >`;
    }

    // [1]
    // prettier-ignore
    return html`${this.addStyles([styles])}${renderedLink}`;
  }
}

export { BoltLink };
