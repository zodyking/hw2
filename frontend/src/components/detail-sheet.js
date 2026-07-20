/**
 * DetailSheet — bottom sheet / modal dialog. Mobile-aware.
 */

export class DetailSheet {
  constructor({ panel }) {
    this._panel = panel;
    this._isOpen = false;
    this._content = null;
  }

  get isOpen() { return this._isOpen; }

  open(content) {
    this._content = content;
    this._isOpen = true;
    this._render();
  }

  close() {
    this._isOpen = false;
    this._content = null;
    this._render();
  }

  _render() {
    // Remove existing
    if (this._el) this._el.remove();

    if (!this._isOpen) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'detail-sheet-backdrop is-open';

    const sheet = document.createElement('div');
    sheet.className = 'detail-sheet';

    // Handle for dragging
    const handle = document.createElement('div');
    handle.className = 'detail-sheet-handle';
    sheet.appendChild(handle);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-icon btn-ghost';
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = 'position:absolute;top:var(--space-3);right:var(--space-3)';
    closeBtn.addEventListener('click', () => this.close());
    sheet.appendChild(closeBtn);

    // Content
    const contentWrap = document.createElement('div');
    contentWrap.className = 'detail-sheet-content';
    if (typeof this._content === 'string') {
      contentWrap.innerHTML = this._content;
    } else if (this._content instanceof Node) {
      contentWrap.appendChild(this._content);
    }
    sheet.appendChild(contentWrap);

    backdrop.appendChild(sheet);

    // Close on backdrop click
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.close();
    });

    this._el = backdrop;
  }

  renderEl() {
    if (this._isOpen && this._el) return this._el;
    return document.createElement('div');
  }

  render() {
    return this._isOpen && this._el ? this._el : document.createElement('div');
  }
}
