import Quill from "quill"
import { getRelativeRect } from '../utils'
import Header from './header'

const Break = Quill.import("blots/break")
const Block = Quill.import("blots/block")
const Container = Quill.import("blots/container")

const COL_ATTRIBUTES = ["width", 'table_left_indent', 'table_alignment', 'table_preffered_width'];
const COL_DEFAULT = {
  width: 100,
  table_left_indent: 0,
  table_alignment: 0,
  table_preffered_width: 0
};
const CELL_IDENTITY_KEYS = ["row", "cell"]
const CELL_ATTRIBUTES = ["rowspan", "colspan"]
const CELL_DEFAULT = {
  rowspan: 1,
  colspan: 1
}
const ERROR_LIMIT = 5

const TABLE_ALIGNMENT = {
  LEFT: '0',
  CENTER: '1',
  RIGHT: '2'
};
Object.freeze(TABLE_ALIGNMENT);

class TableCellLine extends Block {
  static create(value) {
    const node = super.create(value)

    CELL_IDENTITY_KEYS.forEach(key => {
      let identityMaker = key === 'row'
        ? rowId : cellId
      node.setAttribute(`data-${key}`, value[key] || identityMaker())
    })

    CELL_ATTRIBUTES.forEach(attrName => {
      node.setAttribute(`data-${attrName}`, value[attrName] || CELL_DEFAULT[attrName])
    })

    if (value['cell-bg']) {
      node.setAttribute('data-cell_bg', value['cell-bg'])
    }
    
    if (value['cell_vertical_alignment']) {
      node.setAttribute('data-cell_vertical_alignment', value['cell_vertical_alignment']);
    }

    if (value['cell_horizontal_alignment']) {
      node.setAttribute('data-cell_horizontal_alignment', value['cell_horizontal_alignment']);
    }

    if (value['cell_btc']) {
      node.setAttribute('data-cell_btc', value['cell_btc']);
    }

    if (value['cell_bbc']) {
      node.setAttribute('data-cell_bbc', value['cell_bbc']);
    }

    if (value['cell_brc']) {
      node.setAttribute('data-cell_brc', value['cell_brc']);
    }

    if (value['cell_blc']) {
      node.setAttribute('data-cell_blc', value['cell_blc']);
    }

    if (value['cell_bts']) {
      node.setAttribute('data-cell_bts', value['cell_bts']);
    }

    if (value['cell_bbs']) {
      node.setAttribute('data-cell_bbs', value['cell_bbs']);
    }

    if (value['cell_brs']) {
      node.setAttribute('data-cell_brs', value['cell_brs']);
    }

    if (value['cell_bls']) {
      node.setAttribute('data-cell_bls', value['cell_bls']);
    }

    if (value['row_height']) {
      node.setAttribute('data-row_height', value['row_height']);
    }
    return node
  }

  static formats(domNode) {
    const formats = {}

    return CELL_ATTRIBUTES
      .concat(CELL_IDENTITY_KEYS)
      .concat(['cell_bg', 
               'cell_vertical_alignment', 
               'cell_horizontal_alignment', 
               'cell_btc', 
               'cell_bbc', 
               'cell_brc', 
               'cell_blc', 
               'cell_bts', 
               'cell_bbs', 
               'cell_brs', 
               'cell_bls', 
               'row_height'])
      .reduce((formats, attribute) => {
        if (domNode.hasAttribute(`data-${attribute}`)) {
          formats[attribute] = domNode.getAttribute(`data-${attribute}`) || undefined
        }
        return formats
    }, formats)
  }

  format(name, value) {
    if (CELL_ATTRIBUTES.concat(CELL_IDENTITY_KEYS).indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(`data-${name}`, value)
      } else {
        this.domNode.removeAttribute(`data-${name}`)
      }
    } else if (name === 'cell-bg') {
      if (value) {
        this.domNode.setAttribute('data-cell_bg', value);
      } else {
        this.domNode.removeAttribute('data-cell_bg');
      }
    } else if (name === 'cell_vertical_alignment') {
      if (value) {
        this.domNode.setAttribute('data-cell_vertical_alignment', value);
      } else {
        this.domNode.removeAttribute('data-cell_vertical_alignment');
      }
    } else if (name === 'cell_horizontal_alignment') {
      if (value) {
        this.domNode.setAttribute('data-cell_horizontal_alignment', value);
      } else {
        this.domNode.removeAttribute('data-cell_horizontal_alignment');
      }
    } else if (name === 'cell_btc') {
        if (value) {
          this.domNode.setAttribute('data-cell_btc', value);
        } else {
          this.domNode.removeAttribute('data-cell_btc');
        }
    } else if (name === 'cell_bbc') {
        if (value) {
          this.domNode.setAttribute('data-cell_bbc', value);
        } else {
          this.domNode.removeAttribute('data-cell_bbc');
        }
    } else if (name === 'cell_brc') {
        if (value) {
          this.domNode.setAttribute('data-cell_brc', value);
        } else {
          this.domNode.removeAttribute('data-cell_brc');
        }
    } else if (name === 'cell_blc') {
        if (value) {
          this.domNode.setAttribute('data-cell_blc', value);
        } else {
          this.domNode.removeAttribute('data-cell_blc');
        }
    } else if (name === 'cell_bts') {
        if (value) {
          this.domNode.setAttribute('data-cell_bts', value);
        } else {
          this.domNode.removeAttribute('data-cell_bts');
        }
    } else if (name === 'cell_bbs') {
        if (value) {
          this.domNode.setAttribute('data-cell_bbs', value);
        } else {
          this.domNode.removeAttribute('data-cell_bbs');
        }
    } else if (name === 'cell_brs') {
        if (value) {
          this.domNode.setAttribute('data-cell_brs', value);
        } else {
          this.domNode.removeAttribute('data-cell_brs');
        }
    } else if (name === 'cell_bls') {
        if (value) {
          this.domNode.setAttribute('data-cell_bls', value);
        } else {
          this.domNode.removeAttribute('data-cell_bls');
        }
    } else if (name === 'row_height') {
        if (value) {
          this.domNode.setAttribute('data-row_height', value);
        } else {
          this.domNode.removeAttribute('data-row_height');
        }
    } else if (name === 'header') {
      if (!value) return;
      const { row, cell, rowspan, colspan } = TableCellLine.formats(this.domNode)
      super.format(name, {
        value,
        row,
        cell,
        rowspan,
        colspan
      })
    } else {
      super.format(name, value)
    }
  }

  optimize(context) {
    // cover shadowBlot's wrap call, pass params parentBlot initialize
    // needed
    const rowId = this.domNode.getAttribute('data-row');
    const rowspan = this.domNode.getAttribute('data-rowspan');
    const colspan = this.domNode.getAttribute('data-colspan');
    const cellBg = this.domNode.getAttribute('data-cell_bg');
    const verticalAlignment = this.domNode.getAttribute('data-cell_vertical_alignment');
    const horizontalAlignment = this.domNode.getAttribute('data-cell_horizontal_alignment');
    const borderTopColor = this.domNode.getAttribute('data-cell_btc');
    const borderBottomColor = this.domNode.getAttribute('data-cell_bbc');
    const borderRightColor = this.domNode.getAttribute('data-cell_brc');
    const borderLeftColor = this.domNode.getAttribute('data-cell_blc');
    const borderTopSize = this.domNode.getAttribute('data-cell_bts');
    const borderBottomSize = this.domNode.getAttribute('data-cell_bbs');
    const borderRightSize = this.domNode.getAttribute('data-cell_brs');
    const borderLeftSize = this.domNode.getAttribute('data-cell_bls');
    const rowHeight = this.domNode.getAttribute('data-row_height');
    if (this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)) {
      this.wrap(this.statics.requiredContainer.blotName, {
        row: rowId,
        colspan,
        rowspan,
        'cell-bg': cellBg,
        'cell_vertical_alignment': verticalAlignment,
        'cell_horizontal_alignment': horizontalAlignment,
        'cell_btc': borderTopColor,
        'cell_bbc': borderBottomColor,
        'cell_brc': borderRightColor,
        'cell_blc': borderLeftColor,
        'cell_bts': borderTopSize,
        'cell_bbs': borderBottomSize,
        'cell_brs': borderRightSize,
        'cell_bls': borderLeftSize,
        'row_height': rowHeight
      })
    }
    super.optimize(context)
  }

  tableCell() {
    return this.parent
  }
}
TableCellLine.blotName = "table-cell-line"
TableCellLine.className = "qlbt-cell-line"
TableCellLine.tagName = "P"

class TableCell extends Container {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const thisHead = this.children.head.formats()[this.children.head.statics.blotName]
      const thisTail = this.children.tail.formats()[this.children.tail.statics.blotName]
      const nextHead = this.next.children.head.formats()[this.next.children.head.statics.blotName]
      const nextTail = this.next.children.tail.formats()[this.next.children.tail.statics.blotName]
      return (
        thisHead.cell === thisTail.cell &&
        thisHead.cell === nextHead.cell &&
        thisHead.cell === nextTail.cell
      )
    }
    return false
  }

  static create(value) {
    const node = super.create(value)
    node.setAttribute("data-row", value.row)

    CELL_ATTRIBUTES.forEach(attrName => {
      if (value[attrName]) {
        node.setAttribute(attrName, value[attrName])
      }
    })

    if (value['cell-bg']) {
      node.setAttribute('data-cell_bg', value['cell-bg'])
      node.style.backgroundColor = value['cell-bg']
    }

    if (value['cell_vertical_alignment']) {
      node.setAttribute('data-cell_vertical_alignment', value['cell_vertical_alignment']);
      switch (value['cell_vertical_alignment'].toUpperCase()) {
          case 'TOP':
            node.style.verticalAlign = 'top';
          break;
          case 'CENTER':
            node.style.verticalAlign = 'middle';
          break;
          case 'BOTTOM':
            node.style.verticalAlign = 'bottom';
          break;
      }
    }

    if (value['cell_horizontal_alignment']) {
        node.setAttribute('data-cell_horizontal_alignment', value['cell_horizontal_alignment']);
        switch (value['cell_horizontal_alignment'].toUpperCase()) {
            case 'CENTER':
              node.style.textAlign = 'center';
            break;
            case 'RIGHT':
              node.style.textAlign = 'end';
            break;
            case 'JUSTIFY':
              node.style.textAlign = 'justify';
            break;
        }
    }

    if (value['cell_btc']) {
      node.setAttribute('data-cell_btc', value['cell_btc']);
      node.style.borderTopColor = value['cell_btc'];
    }

    if (value['cell_bbc']) {
      node.setAttribute('data-cell_bbc', value['cell_bbc']);
      node.style.borderBottomColor = value['cell_bbc'];
    }

    if (value['cell_brc']) {
      node.setAttribute('data-cell_brc', value['cell_brc']);
      node.style.borderRightColor = value['cell_brc'];
    }

    if (value['cell_blc']) {
      node.setAttribute('data-cell_blc', value['cell_blc']);
      node.style.borderLeftColor = value['cell_blc'];
    }

    if (value['cell_bts']) {
      node.setAttribute('data-cell_bts', value['cell_bts']);
      node.style.borderTopWidth = `${value['cell_bts']}pt`;
    }

    if (value['cell_bbs']) {
      node.setAttribute('data-cell_bbs', value['cell_bbs']);
      node.style.borderBottomWidth = `${value['cell_bbs']}pt`;
    }

    if (value['cell_brs']) {
      node.setAttribute('data-cell_brs', value['cell_brs']);
      node.style.borderRightWidth = `${value['cell_brs']}pt`;
    }

    if (value['cell_bls']) {
      node.setAttribute('data-cell_bls', value['cell_bls']);
      node.style.borderLeftWidth = `${value['cell_bls']}pt`;
    }

    if (value['row_height']) {
      node.setAttribute('data-row_height', value['row_height']);
    }

  return node
}

  static formats(domNode) {
    const formats = {}

    if (domNode.hasAttribute("data-row")) {
      formats["row"] = domNode.getAttribute("data-row")
    }

    if (domNode.hasAttribute("data-cell_bg")) {
      formats["cell_bg"] = domNode.getAttribute("data-cell_bg");
    }

    if (domNode.hasAttribute('data-cell_vertical_alignment')) {
      formats['cell_vertical_alignment'] = domNode.getAttribute('data-cell_vertical_alignment');
    }

    if (domNode.hasAttribute('data-cell_horizontal_alignment')) {
      formats['cell_horizontal_alignment'] = domNode.getAttribute('data-cell_horizontal_alignment');
    }

    if (domNode.hasAttribute('data-cell_btc')) {
      formats['cell_btc'] = domNode.getAttribute('data-cell_btc');
    }

    if (domNode.hasAttribute('data-cell_bbc')) {
      formats['cell_bbc'] = domNode.getAttribute('data-cell_bbc');
    }

    if (domNode.hasAttribute('data-cell_brc')) {
      formats['cell_brc'] = domNode.getAttribute('data-cell_brc');
    }

    if (domNode.hasAttribute('data-cell_blc')) {
      formats['cell_blc'] = domNode.getAttribute('data-cell_blc');
    }

    if (domNode.hasAttribute('data-cell_bts')) {
      formats['cell_bts'] = domNode.getAttribute('data-cell_bts');
    }

    if (domNode.hasAttribute('data-cell_bbs')) {
      formats['cell_bbs'] = domNode.getAttribute('data-cell_bbs');
    }

    if (domNode.hasAttribute('data-cell_brs')) {
      formats['cell_brs'] = domNode.getAttribute('data-cell_brs');
    }

    if (domNode.hasAttribute('data-cell_bls')) {
      formats['cell_bls'] = domNode.getAttribute('data-cell_bls');
    }

    if (domNode.hasAttribute('data-row_height')) {
      formats['row_height'] = domNode.getAttribute('data-row_height');
    }

    return CELL_ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute)
      }

      return formats
    }, formats)
  }

  cellOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this)
    }
    return -1
  }

  formats() {
    const formats = {}

    if (this.domNode.hasAttribute("data-row")) {
      formats["row"] = this.domNode.getAttribute("data-row")
    }

    if (this.domNode.hasAttribute("data-cell_bg")) {
      formats["cell_bg"] = this.domNode.getAttribute("data-cell_bg");
    }

    if (this.domNode.hasAttribute('data-cell_vertical_alignment')) {
      formats['cell_vertical_alignment'] = this.domNode.getAttribute('data-cell_vertical_alignment');
    }

    if (this.domNode.hasAttribute('data-cell_horizontal_alignment')) {
      formats['cell_horizontal_alignment'] = this.domNode.getAttribute('data-cell_horizontal_alignment');
    }

    if (this.domNode.hasAttribute('data-cell_btc')) {
      formats['cell_btc'] = this.domNode.getAttribute('data-cell_btc');
    }

    if (this.domNode.hasAttribute('data-cell_bbc')) {
      formats['cell_bbc'] = this.domNode.getAttribute('data-cell_bbc');
    }

    if (this.domNode.hasAttribute('data-cell_brc')) {
      formats['cell_brc'] = this.domNode.getAttribute('data-cell_brc');
    }

    if (this.domNode.hasAttribute('data-cell_blc')) {
      formats['cell_blc'] = this.domNode.getAttribute('data-cell_blc');
    }

    if (this.domNode.hasAttribute('data-cell_bts')) {
      formats['cell_bts'] = this.domNode.getAttribute('data-cell_bts');
    }

    if (this.domNode.hasAttribute('data-cell_bbs')) {
      formats['cell_bbs'] = this.domNode.getAttribute('data-cell_bbs');
    }

    if (this.domNode.hasAttribute('data-cell_brs')) {
      formats['cell_brs'] = this.domNode.getAttribute('data-cell_brs');
    }

    if (this.domNode.hasAttribute('data-cell_bls')) {
      formats['cell_bls'] = this.domNode.getAttribute('data-cell_bls');
    }

    if (this.domNode.hasAttribute('data-row_height')) {
      formats['row_height'] = this.domNode.getAttribute('data-row_height');
    }

    return CELL_ATTRIBUTES.reduce((formats, attribute) => {
      if (this.domNode.hasAttribute(attribute)) {
        formats[attribute] = this.domNode.getAttribute(attribute)
      }

      return formats
    }, formats)
  }

  toggleAttribute (name, value) {
    if (value) {
      this.domNode.setAttribute(name, value)
    } else {
      this.domNode.removeAttribute(name)
    }
  }

  formatChildren (name, value) {
    this.children.forEach(child => {
      child.format(name, value)
    })
  }

  format(name, value) {
    if (CELL_ATTRIBUTES.indexOf(name) > -1) {
      this.toggleAttribute(name, value)
      this.formatChildren(name, value)
    } else if (['row'].indexOf(name) > -1) {
      this.toggleAttribute(`data-${name}`, value)
      this.formatChildren(name, value)
    } else if (name === 'cell-bg') {
      this.toggleAttribute('data-cell_bg', value)
      this.formatChildren(name, value)

      if (value) {
        this.domNode.style.backgroundColor = value
      } else {
        this.domNode.style.backgroundColor = 'initial'
      }
    } else if (name === 'cell_vertical_alignment') {
        this.toggleAttribute('data-cell_vertical_alignment', value);
        this.formatChildren(name, value);

        switch (value.toUpperCase()) {
            case 'TOP':
              this.domNode.style.verticalAlign = 'top';
            break;
            case 'CENTER':
              this.domNode.style.verticalAlign = 'middle';
            break;
            case 'BOTTOM':
              this.domNode.style.verticalAlign = 'bottom';
            break;
            default:
              this.domNode.style.verticalAlign = 'initial';
            break;
        }
    } else if (name === 'cell_horizontal_alignment') {
        this.toggleAttribute('data-cell_horizontal_alignment', value);
        this.formatChildren(name, value);

        switch (value.toUpperCase()) {
            case 'CENTER':
              this.domNode.style.textAlign = 'center';
            break;
            case 'RIGHT':
              this.domNode.style.textAlign = 'end';
            break;
            case 'JUSTIFY':
              this.domNode.style.textAlign = 'justify';
            break;
            default:
              this.domNode.style.textAlign = 'initial';
            break;
        }
    } else if (name === 'cell_btc') {
      this.toggleAttribute('data-cell_btc', value);
      this.formatChildren(name, value);

      if (value) {
        this.domNode.style.borderTopColor = value;
      } else {
        this.domNode.style.borderTopColor = 'initial';
      }
    } else if (name === 'cell_bbc') {
      this.toggleAttribute('data-cell_bbc', value);
      this.formatChildren(name, value);

      if (value) {
        this.domNode.style.borderBottomColor = value;
      } else {
        this.domNode.style.borderBottomColor = 'initial';
      }
    } else if (name === 'cell_brc') {
      this.toggleAttribute('data-cell_brc', value);
      this.formatChildren(name, value);

      if (value) {
        this.domNode.style.borderRightColor = value;
      } else {
        this.domNode.style.borderRightColor = 'initial';
      }
    } else if (name === 'cell_blc') {
      this.toggleAttribute('data-cell_blc', value);
      this.formatChildren(name, value);

      if (value) {
        this.domNode.style.borderLeftColor = value;
      } else {
        this.domNode.style.borderLeftColor = 'initial';
      }
    } else if (name === 'cell_bts') {
      this.toggleAttribute('data-cell_bts', value);
      this.formatChildren(name, value);

      if (value) {
        this.domNode.style.borderTopWidth = `${value}pt`;
      } else {
        this.domNode.style.borderTopWidth = 'initial';
      }
    } else if (name === 'cell_bbs') {
      this.toggleAttribute('data-cell_bbs', value);
      this.formatChildren(name, value);

      if (value) {
        this.domNode.style.borderBottomWidth = `${value}pt`;
      } else {
        this.domNode.style.borderBottomWidth = 'initial';
      }
    } else if (name === 'cell_brs') {
      this.toggleAttribute('data-cell_brs', value);
      this.formatChildren(name, value);

      if (value) {
        this.domNode.style.borderRightWidth = `${value}pt`;
      } else {
        this.domNode.style.borderRightWidth = 'initial';
      }
    } else if (name === 'cell_bls') {
      this.toggleAttribute('data-cell_bls', value);
      this.formatChildren(name, value);

      if (value) {
        this.domNode.style.borderLeftWidth = `${value}pt`;
      } else {
        this.domNode.style.borderLeftWidth = 'initial';
      }
    } else if (name === 'row_height') {
      this.toggleAttribute('data-row_height', value);
      const currentRow = this.row();
      const rowNode = currentRow.domNode;
      rowNode.setAttribute('data-row_height', value);
      if (value) {
        rowNode.style.setProperty('height', `${convertPointToPixel(value)}px`);
      } else {
        rowNode.style.removeProperty('height');
      }

      this.formatChildren(name, value);
    } else {
      super.format(name, value);
    }
  }

  optimize(context) {
    const rowId = this.domNode.getAttribute("data-row");
    const rowHeight = this.domNode.getAttribute("data-row_height");

    if (this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)) {
        this.wrap(this.statics.requiredContainer.blotName, {
          row: rowId,
          'row_height': rowHeight
      });
    }
    super.optimize(context)
  }

  row() {
    return this.parent
  }

  rowOffset() {
    if (this.row()) {
      return this.row().rowOffset()
    }
    return -1
  }

  table() {
    return this.row() && this.row().table()
  }
}
TableCell.blotName = "table"
TableCell.tagName = "TD"

class TableRow extends Container {
  checkMerge() {
    if (super.checkMerge() && this.next.children.head != null) {
      const thisHead = this.children.head.formats()
      const thisTail = this.children.tail.formats()
      const nextHead = this.next.children.head.formats()
      const nextTail = this.next.children.tail.formats()

      return (
        thisHead.row === thisTail.row &&
        thisHead.row === nextHead.row &&
        thisHead.row === nextTail.row
      )
    }
    return false
  }

  static create(value) {
    const node = super.create(value)
    node.setAttribute("data-row", value.row)
    if (value.row_height) {
      node.setAttribute("data-row_height", value.row_height);
      node.style.setProperty('height', `${convertPointToPixel(value.row_height)}px`);
    }
    return node
  }

  formats() {
    return ["row", "row_height"].reduce((formats, attrName) => {
      if (this.domNode.hasAttribute(`data-${attrName}`)) {
        formats[attrName] = this.domNode.getAttribute(`data-${attrName}`)
      }
      return formats
    }, {})
  }

  optimize (context) {
    // optimize function of ShadowBlot
    if (
      this.statics.requiredContainer &&
      !(this.parent instanceof this.statics.requiredContainer)
    ) {
      this.wrap(this.statics.requiredContainer.blotName)
    }

    // optimize function of ParentBlot
    // note: modified this optimize function because
    // TableRow should not be removed when the length of its children was 0
    this.enforceAllowedChildren()
    if (this.uiNode != null && this.uiNode !== this.domNode.firstChild) {
      this.domNode.insertBefore(this.uiNode, this.domNode.firstChild)
    }

    // optimize function of ContainerBlot
    if (this.children.length > 0 && this.next != null && this.checkMerge()) {
      this.next.moveChildren(this)
      this.next.remove()
    }
  }

  rowOffset() {
    if (this.parent) {
      return this.parent.children.indexOf(this)
    }
    return -1
  }

  table() {
    return this.parent && this.parent.parent
  }
}
TableRow.blotName = "table-row"
TableRow.tagName = "TR"

class TableBody extends Container {}
TableBody.blotName = "table-body"
TableBody.tagName = "TBODY"

class TableCol extends Block {
  static create (value) {
    let node = super.create(value)
    COL_ATTRIBUTES.forEach(attrName => {
      node.setAttribute(`${attrName}`, value[attrName] || COL_DEFAULT[attrName])
    })
    return node
  }

  static formats(domNode) {
    return COL_ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(`${attribute}`)) {
        formats[attribute] =
          domNode.getAttribute(`${attribute}`) || undefined
      }
      return formats
    }, {})
  }

  format(name, value) {
    if (COL_ATTRIBUTES.indexOf(name) > -1) {
      this.domNode.setAttribute(`${name}`, value || COL_DEFAULT[name])
    } else {
      super.format(name, value)
    }
  }

  html () {
    return this.domNode.outerHTML
  }
}
TableCol.blotName = "table-col"
TableCol.tagName = "col"

class TableColGroup extends Container {}
TableColGroup.blotName = "table-col-group"
TableColGroup.tagName = "colgroup"

class TableContainer extends Container {
  static create() {
    let node = super.create()
    return node
  }

  constructor (scroll, domNode) {
    super(scroll, domNode)
    this.updateTableWidth()
    this.applyStylesToTable();
  }

  applyStylesToTable() {
    setTimeout(() => {
        if (!document.contains(this.domNode)) return;
        const colGroup = this.colGroup();
        if (!colGroup) return;

        const firstCol = colGroup.children.head;
        if (firstCol && firstCol.formats) {
            const formats = firstCol.formats();

            const tableMarginLeft = formats[TableCol.blotName].table_left_indent;
            const tableAlignment = formats[TableCol.blotName].table_alignment;
            const tablePrefferedWidth = formats[TableCol.blotName].table_preffered_width;

            this.setTableMarginLeft(tableMarginLeft);
            this.setTableAlignment(tableAlignment);
            this.setTableWidth(colGroup, tablePrefferedWidth, tableMarginLeft);
        }
    }, 0);
  }

  allColumnsHave100Width(colGroup) {
    return colGroup.children.reduce((acc, col) => { 
      return acc && col.formats()[TableCol.blotName].width === '100';
    }, true);
  }

  verifyTableWidthIsLargerThanPageWidth(tablePrefferedWidth, tableMarginLeft) {
    if (tablePrefferedWidth === '0') {
      return false;
    }

    var editor = document.querySelector('.ql-editor');
    let pageWidth, pageMargins;
    if (editor) {
      pageWidth = editor.offsetWidth;
      let editorStyle = window.getComputedStyle(editor);
      const marginLeft = editorStyle.paddingLeft ? parseFloat(editorStyle.paddingLeft) : 0;
      const marginRight = editorStyle.paddingRight ? parseFloat(editorStyle.paddingRight) : 0;

      pageMargins = marginLeft + marginRight;
    }

    if (tablePrefferedWidth.endsWith('%')) {
      tablePrefferedWidth = (parseFloat(tablePrefferedWidth) * pageWidth) / 100;
    }
    else {
      tablePrefferedWidth = parseFloat(tablePrefferedWidth.replaceAll('pt', ''));
    }

    return tablePrefferedWidth + Math.abs(tableMarginLeft) > (pageWidth - pageMargins);
  }

  setTableWidth(colGroup, tablePrefferedWidth, tableMarginLeft) {
    if (!tablePrefferedWidth || (tablePrefferedWidth === '0' && this.allColumnsHave100Width(colGroup)) || this.verifyTableWidthIsLargerThanPageWidth(tablePrefferedWidth, tableMarginLeft)) {
        this.domNode.style.setProperty('width', '100%');
        this.domNode.style.removeProperty('margin-left');
      } else {
        const tableWidth = colGroup.children.reduce((sumWidth, col) => {
          const colWidth = parseInt(col.formats()[TableCol.blotName].width, 10);
          sumWidth += colWidth;
          return sumWidth;
        }, 0);
        this.domNode.style.setProperty('width', ''.concat(tableWidth, 'pt'));
      }
  }

  setTableMarginLeft(tableMarginLeft) {
      if (tableMarginLeft) {
        this.domNode.style.setProperty('margin-left', ''.concat(tableMarginLeft, 'pt'));
      }
  }

  setTableAlignment(tableAlignment) {
      switch (tableAlignment) {
          case TABLE_ALIGNMENT.CENTER:
            this.domNode.parentNode.classList.add('table-alignment-center');
            this.domNode.parentNode.classList.remove('table-alignment-right');
          break;
          case TABLE_ALIGNMENT.RIGHT:
            this.domNode.parentNode.classList.add('table-alignment-right');
            this.domNode.parentNode.classList.remove('table-alignment-center');
          break;
          default:
            this.domNode.parentNode.classList.remove('table-alignment-center');
            this.domNode.parentNode.classList.remove('table-alignment-right');
          break;
      }
  }

  // updateTableWidth() {
  //     setTimeout(() => {
  //         const colGroup = this.colGroup();
  //         if (!colGroup) return;

  //         const firstCol = colGroup.children.head;
  //         if (!firstCol) return;

  //         const firstColFormats = firstCol.formats();
  //         const tablePrefferedWidth = firstColFormats[TableCol.blotName].table_preffered_width;
  //         const tableMarginLeft = firstColFormats[TableCol.blotName].table_left_indent;

  //         this.setTableWidth(colGroup, tablePrefferedWidth, tableMarginLeft);
  //     }, 0);
  // }

  updateTableWidth () {
    setTimeout(() => {
      const colGroup = this.colGroup()
      if (!colGroup) return
      const tableWidth = colGroup.children.reduce((sumWidth, col) => {
        sumWidth = sumWidth + parseInt(col.formats()[TableCol.blotName].width, 10)
        return sumWidth
      }, 0)
      this.domNode.style.width = `${tableWidth}px`
    }, 0)
  }

  cells(column) {
    return this.rows().map(row => row.children.at(column))
  }

  colGroup () {
    return this.children.head
  }

  updateColsTablePrefferedWidth() {
    setTimeout(() => {
        const colGroup = this.colGroup();
        if (!colGroup) return;

        const firstCol = colGroup.children.head;
        const tablePrefferedWidth = parseFloat(firstCol.formats()[TableCol.blotName].table_preffered_width);

        if (tablePrefferedWidth > 0) {
          const tableStyles = getComputedStyle(this.domNode);
          const tableWidth = parseFloat(tableStyles.width);
          const tableWidthInPoints = this.convertToPoints(tableWidth);

          colGroup.children.forEach(col => {
            col.format('table_preffered_width', ''.concat(tableWidthInPoints, 'pt'));
          });
        }
    }, 0);
  } 

  deleteColumns(compareRect, delIndexes = [], editorWrapper) {
    const [body] = this.descendants(TableBody)
    if (body == null || body.children.head == null) return

    const tableCells = this.descendants(TableCell)
    const removedCells = []
    const modifiedCells = []

    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(
        cell.domNode.getBoundingClientRect(),
        editorWrapper
      )

      if (
        cellRect.x + ERROR_LIMIT > compareRect.x &&
        cellRect.x1 - ERROR_LIMIT < compareRect.x1
      ) {
        removedCells.push(cell)
      } else if (
        cellRect.x < compareRect.x + ERROR_LIMIT &&
        cellRect.x1 > compareRect.x1 - ERROR_LIMIT
      ) {
        modifiedCells.push(cell)
      }
    })

    if (removedCells.length === tableCells.length) {
      this.tableDestroy()
      return true
    }

    // remove the matches column tool cell
    delIndexes.forEach((delIndex) => {
      this.colGroup().children.at(delIndexes[0]).remove()
    })

    removedCells.forEach(cell => {
      cell.remove()
    })

    modifiedCells.forEach(cell => {
      const cellColspan = parseInt(cell.formats().colspan, 10)
      const cellWidth = parseInt(cell.formats().width, 10)
      cell.format('colspan', cellColspan - delIndexes.length)
    })

    this.updateTableWidth();    
    this.updateColsTablePrefferedWidth();
  }

  deleteRow(compareRect, editorWrapper) {
    const [body] = this.descendants(TableBody)
    if (body == null || body.children.head == null) return

    const tableCells = this.descendants(TableCell)
    const tableRows = this.descendants(TableRow)
    const removedCells = []  // cells to be removed
    const modifiedCells = [] // cells to be modified
    const fallCells = []     // cells to fall into next row

    // compute rows to remove
    // bugfix: #21 There will be a empty tr left if delete the last row of a table
    const removedRows = tableRows.filter(row => {
      const rowRect = getRelativeRect(
        row.domNode.getBoundingClientRect(),
        editorWrapper
      )
      
      return rowRect.y > compareRect.y - ERROR_LIMIT &&
        rowRect.y1 < compareRect.y1 + ERROR_LIMIT
    })

    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(
        cell.domNode.getBoundingClientRect(),
        editorWrapper
      )

      if (
        cellRect.y > compareRect.y - ERROR_LIMIT &&
        cellRect.y1 < compareRect.y1 + ERROR_LIMIT
      ) {
        removedCells.push(cell)
      } else if (
        cellRect.y < compareRect.y + ERROR_LIMIT &&
        cellRect.y1 > compareRect.y1 - ERROR_LIMIT
      ) {
        modifiedCells.push(cell)

        if (Math.abs(cellRect.y - compareRect.y) < ERROR_LIMIT) {
          fallCells.push(cell)
        }
      }
    })

    if (removedCells.length === tableCells.length) {
      this.tableDestroy()
      return
    }

    // compute length of removed rows
    const removedRowsLength = this.rows().reduce((sum, row) => {
      let rowRect  = getRelativeRect(
        row.domNode.getBoundingClientRect(),
        editorWrapper
      )

      if (
        rowRect.y > compareRect.y - ERROR_LIMIT &&
        rowRect.y1 < compareRect.y1 + ERROR_LIMIT
      ) {
        sum += 1
      }
      return sum
    }, 0)

    // it must excute before the table layout changed with other operation
    fallCells.forEach(cell => {
      const cellRect = getRelativeRect(
        cell.domNode.getBoundingClientRect(),
        editorWrapper
      )
      const nextRow = cell.parent.next
      const cellsInNextRow = nextRow.children

      const refCell = cellsInNextRow.reduce((ref, compareCell) => {
        const compareRect = getRelativeRect(
          compareCell.domNode.getBoundingClientRect(),
          editorWrapper
        )
        if (Math.abs(cellRect.x1 - compareRect.x) < ERROR_LIMIT) {
          ref = compareCell
        }
        return ref
      }, null)

      nextRow.insertBefore(cell, refCell)
      cell.format('row', nextRow.formats().row)
    })

    removedCells.forEach(cell => {
      cell.remove()
    })

    modifiedCells.forEach(cell => {
      const cellRowspan = parseInt(cell.formats().rowspan, 10)
      cell.format("rowspan", cellRowspan - removedRowsLength)
    })

    // remove selected rows
    removedRows.forEach(row => row.remove())
  }

  tableDestroy() {
    const quill = Quill.find(this.scroll.domNode.parentNode)
    const tableModule = quill.getModule("better-table")
    this.remove()
    tableModule.hideTableTools()
    quill.update(Quill.sources.USER)
  }

  insertCell(tableRow, ref) {
    const id = cellId()
    const rId = tableRow.formats().row
    const tableCell = this.scroll.create(
      TableCell.blotName,
      Object.assign({}, CELL_DEFAULT, {
        row: rId
      })
    )
    const cellLine = this.scroll.create(TableCellLine.blotName, {
      row: rId,
      cell: id
    })
    tableCell.appendChild(cellLine)

    if (ref) {
      tableRow.insertBefore(tableCell, ref)
    } else {
      tableRow.appendChild(tableCell)
    }
  }

  convertToPixels(value) {
    return (value * 4) / 3;
  }

  convertToPoints(value) {
    return (value * 3) / 4;
  }

  getTableWidthAndMarginLeft() {
      let tableWidth = this.domNode.offsetWidth;
      let tableMarginLeft = this.domNode.style.getPropertyValue('margin-left');
      let tableMarginLeftValue = 0;

      if (tableMarginLeft && tableMarginLeft != 'auto') {
        const tableStyles = window.getComputedStyle(this.domNode);
        tableMarginLeftValue = parseFloat(tableStyles.marginLeft.replace('px', ''));
      }

    return { tableWidth, tableMarginLeftValue };
  }

  getPageWidthWorkingArea() {
    const pageWidth = this.scroll.domNode.offsetWidth;
    const pageStyles = window.getComputedStyle(this.scroll.domNode);
    const pagePaddingLeft = parseFloat(pageStyles.paddingLeft.replace('px', ''));
    const pagePaddingRight = parseFloat(pageStyles.paddingRight.replace('px', ''));

    return pageWidth - (pagePaddingLeft + pagePaddingRight);
  }

  updateColumnsWidth(colGroup, workingAreaWidth) {
    const widthPerCol = ((workingAreaWidth) / (colGroup.children.length + 1));
    const widthPerColInPoints = this.convertToPoints(widthPerCol);

    colGroup.children.forEach(col => {
      col.format('width', widthPerColInPoints);
    });

    const tableWidth = widthPerCol * (colGroup.children.length + 1);
    return { tableWidth, widthPerColInPoints };
  }

  getColAttributes(colRef) {
    let colAttributes = true;
    const colGroup = this.colGroup();

    if (colRef) {
      colAttributes = colRef.formats()[TableCol.blotName];
    } else {
      if (colGroup && colGroup.children && colGroup.children.length > 0) {
        const col = colGroup.children.tail;
        colAttributes = col.formats()[TableCol.blotName];
      }
    }

    const newColWidth = this.convertToPixels(parseFloat(colAttributes.width));
    const { tableWidth, tableMarginLeftValue } = this.getTableWidthAndMarginLeft();
    const workingAreaWidth = this.getPageWidthWorkingArea();
    let updatedTableWidth = tableWidth + newColWidth;

    if (updatedTableWidth + tableMarginLeftValue > workingAreaWidth) {
      const { tableWidth, widthPerColInPoints } = this.updateColumnsWidth(colGroup, workingAreaWidth - tableMarginLeftValue);
      updatedTableWidth = tableWidth;
      colAttributes.width = widthPerColInPoints;
    }
    
    const currentTablePrefferedWidth = parseFloat(colAttributes.table_preffered_width);
    if (currentTablePrefferedWidth > 0) {
        const tablePrefferedWidth = ''.concat(this.convertToPoints(updatedTableWidth), 'pt');
        colGroup.children.forEach(col => {
          col.format('table_preffered_width', tablePrefferedWidth);
        });
        colAttributes.table_preffered_width = tablePrefferedWidth;
    }

    return colAttributes;
  }

  insertColumn(compareRect, colIndex, isRight = true, editorWrapper) {
    const [body] = this.descendants(TableBody)
    const [tableColGroup] = this.descendants(TableColGroup)
    const tableCols = this.descendants(TableCol)
    let addAsideCells = []
    let modifiedCells = []
    let affectedCells = []

    if (body == null || body.children.head == null) return
    const tableCells = this.descendants(TableCell)
    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(
        cell.domNode.getBoundingClientRect(),
        editorWrapper
      )

      if (isRight) {
        if (Math.abs(cellRect.x1 - compareRect.x1) < ERROR_LIMIT) {
          // the right of selected boundary equal to the right of table cell,
          // add a new table cell right aside this table cell
          addAsideCells.push(cell)
        } else if (
          compareRect.x1 - cellRect.x > ERROR_LIMIT &&
          compareRect.x1 - cellRect.x1 < -ERROR_LIMIT
        ) {
          // the right of selected boundary is inside this table cell
          // colspan of this table cell will increase 1
          modifiedCells.push(cell)
        }
      } else {
        if (Math.abs(cellRect.x - compareRect.x) < ERROR_LIMIT) {
          // left of selected boundary equal to left of table cell,
          // add a new table cell left aside this table cell
          addAsideCells.push(cell)
        } else if (
          compareRect.x - cellRect.x > ERROR_LIMIT &&
          compareRect.x - cellRect.x1 < -ERROR_LIMIT
        ) {
          // the left of selected boundary is inside this table cell
          // colspan of this table cell will increase 1
          modifiedCells.push(cell)
        }
      }
    })

    addAsideCells.forEach(cell => {
      const ref = isRight ? cell.next : cell
      const id = cellId()
      const tableRow = cell.parent
      const rId = tableRow.formats().row
      const cellFormats = cell.formats()
      const tableCell = this.scroll.create(
        TableCell.blotName,
        Object.assign({}, CELL_DEFAULT, {
          row: rId,
          rowspan: cellFormats.rowspan
        })
      )
      const cellLine = this.scroll.create(TableCellLine.blotName, {
        row: rId,
        cell: id,
        rowspan: cellFormats.rowspan
      });
      tableCell.appendChild(cellLine)

      if (ref) {
        tableRow.insertBefore(tableCell, ref)
      } else {
        tableRow.appendChild(tableCell)
      }
      affectedCells.push(tableCell)
    })

    // insert new tableCol
    const tableCol = this.scroll.create(TableCol.blotName, this.getColAttributes(colRef));
    let colRef = isRight ? tableCols[colIndex].next : tableCols[colIndex]
    if (colRef) {
      tableColGroup.insertBefore(tableCol, colRef)
    } else {
      tableColGroup.appendChild(tableCol)
    }

    modifiedCells.forEach(cell => {
      const cellColspan = cell.formats().colspan
      cell.format('colspan', parseInt(cellColspan, 10) + 1)
      affectedCells.push(cell)
    })

    affectedCells.sort((cellA, cellB) => {
      let y1 = cellA.domNode.getBoundingClientRect().y
      let y2 = cellB.domNode.getBoundingClientRect().y
      return y1 - y2
    })

    this.updateTableWidth()
    return affectedCells
  }

  insertRow(compareRect, isDown, editorWrapper) {
    const [body] = this.descendants(TableBody)
    if (body == null || body.children.head == null) return

    const tableCells = this.descendants(TableCell)
    const rId = rowId()
    const newRow = this.scroll.create(TableRow.blotName, {
      row: rId
    })
    let addBelowCells = []
    let modifiedCells = []
    let affectedCells = []

    tableCells.forEach(cell => {
      const cellRect = getRelativeRect(
        cell.domNode.getBoundingClientRect(),
        editorWrapper
      )

      if (isDown) {
        if (Math.abs(cellRect.y1 - compareRect.y1) < ERROR_LIMIT) {
          addBelowCells.push(cell)
        } else if (
          compareRect.y1 - cellRect.y > ERROR_LIMIT &&
          compareRect.y1 - cellRect.y1 < -ERROR_LIMIT
        ) {
          modifiedCells.push(cell)
        }
      } else {
        if (Math.abs(cellRect.y - compareRect.y) < ERROR_LIMIT) {
          addBelowCells.push(cell)
        } else if (
          compareRect.y - cellRect.y > ERROR_LIMIT &&
          compareRect.y - cellRect.y1 < -ERROR_LIMIT
        ) {
          modifiedCells.push(cell)
        }
      }
    })

    // ordered table cells with rect.x, fix error for inserting
    // new table cell in complicated table with wrong order.
    const sortFunc = (cellA, cellB) => {
      let x1 = cellA.domNode.getBoundingClientRect().x
      let x2 = cellB.domNode.getBoundingClientRect().x
      return x1 - x2
    }
    addBelowCells.sort(sortFunc)

    addBelowCells.forEach(cell => {
      const cId = cellId()
      const cellFormats = cell.formats()

      const tableCell = this.scroll.create(TableCell.blotName, Object.assign(
        {}, CELL_DEFAULT, { row: rId, colspan: cellFormats.colspan }
      ))
      const cellLine = this.scroll.create(TableCellLine.blotName, {
        row: rId,
        cell: cId,
        colspan: cellFormats.colspan
      });
      const empty = this.scroll.create(Break.blotName)
      cellLine.appendChild(empty)
      tableCell.appendChild(cellLine)
      newRow.appendChild(tableCell)
      affectedCells.push(tableCell)
    })

    modifiedCells.forEach(cell => {
      const cellRowspan = parseInt(cell.formats().rowspan, 10)
      cell.format("rowspan", cellRowspan + 1)
      affectedCells.push(cell)
    })

    const refRow = this.rows().find(row => {
      let rowRect = getRelativeRect(
        row.domNode.getBoundingClientRect(),
        editorWrapper
      )
      if (isDown) {
        return Math.abs(rowRect.y - compareRect.y - compareRect.height) < ERROR_LIMIT
      } else {
        return Math.abs(rowRect.y - compareRect.y) < ERROR_LIMIT
      }
    })
    body.insertBefore(newRow, refRow)

    // reordering affectedCells
    affectedCells.sort(sortFunc)
    return affectedCells
  }

  insertEmptyRow(refRow, isDown) {
    const [body] = this.descendants(TableBody);
    if (body == null || body.children.head == null) return;

    //Criando a nova linha (tr) da tabela
    const rId = table_rowId();
    const newRow = this.scroll.create(TableRow.blotName, {
      row: rId
    });

    //Criando a nova célula (td) da tabela
    const cId = table_cellId();
    const colspan = this.colGroup().length();
    const tableCell = this.scroll.create(TableCell.blotName, Object.assign({}, CELL_DEFAULT, {
      row: rId,
      colspan: colspan
    }));
    const cellLine = this.scroll.create(TableCellLine.blotName, { row: rId, cell: cId, colspan: colspan });
    const empty = this.scroll.create(Break.blotName);
    cellLine.appendChild(empty);
    tableCell.appendChild(cellLine);
    newRow.appendChild(tableCell);

    if (isDown) {
      body.insertBefore(newRow, refRow.next);
    } else {
      body.insertBefore(newRow, refRow);
    }
  }

  mergeCells (compareRect, mergingCells, rowspan, colspan, editorWrapper) {
    const mergedCell = mergingCells.reduce((result, tableCell, index) => {
      if (index !== 0) {
        result && tableCell.moveChildren(result)
        tableCell.remove()
      } else {
        tableCell.format('colspan', colspan)
        tableCell.format('rowspan', rowspan)
        result = tableCell
      }

      return result
    }, null)

    let rowId = mergedCell.domNode.getAttribute('data-row')
    let cellId = mergedCell.children.head.domNode.getAttribute('data-cell')
    mergedCell.children.forEach(cellLine => {
      cellLine.format('cell', cellId)
      cellLine.format('row', rowId)
      cellLine.format('colspan', colspan)
      cellLine.format('rowspan', rowspan)
    })

    return mergedCell
  }

  unmergeCells (unmergingCells, editorWrapper) {
    let cellFormats = {}
    let cellRowspan = 1
    let cellColspan = 1

    unmergingCells.forEach(tableCell => {
      cellFormats = tableCell.formats()
      cellRowspan = cellFormats.rowspan
      cellColspan = cellFormats.colspan

      if (cellColspan > 1) {
        let ref = tableCell.next
        let row = tableCell.row()
        tableCell.format('colspan', 1)
        for (let i = cellColspan; i > 1; i--) {
          this.insertCell(row, ref)
        }
      }

      if (cellRowspan > 1) {
        let i = cellRowspan
        let nextRow = tableCell.row().next
        while (i > 1) {
          let refInNextRow = nextRow.children
            .reduce((result, cell) => {
              let compareRect = getRelativeRect(
                tableCell.domNode.getBoundingClientRect(),
                editorWrapper
              )
              let cellRect = getRelativeRect(
                cell.domNode.getBoundingClientRect(),
                editorWrapper
              )
              if (Math.abs(compareRect.x1 - cellRect.x) < ERROR_LIMIT) {
                result = cell
              }
              return result
            }, null)

          for (let i = cellColspan; i > 0; i--) {
            this.insertCell(nextRow, refInNextRow)
          }

          i -= 1
          nextRow = nextRow.next
        }

        tableCell.format('rowspan', 1)
      }
    })
  }

  rows() {
    const body = this.children.tail
    if (body == null) return []
    return body.children.map(row => row)
  }
}
TableContainer.blotName = "table-container"
TableContainer.className = "quill-better-table"
TableContainer.tagName = "TABLE"

class TableViewWrapper extends Container {
  constructor (scroll, domNode) {
    super(scroll, domNode)
    const quill = Quill.find(scroll.domNode.parentNode)
    domNode.addEventListener('scroll', (e) => {
      const tableModule = quill.getModule('better-table')
      if (tableModule.columnTool) {
        tableModule.columnTool.domNode.scrollLeft = e.target.scrollLeft
      }

      if (tableModule.tableSelection &&
        tableModule.tableSelection.selectedTds.length > 0) {
        tableModule.tableSelection.repositionHelpLines()
      }
    }, false)
  }

  table () {
    return this.children.head
  }
}
TableViewWrapper.blotName = "table-view"
TableViewWrapper.className = "quill-better-table-wrapper"
TableViewWrapper.tagName = "DIV"

TableViewWrapper.allowedChildren = [TableContainer]
TableContainer.requiredContainer = TableViewWrapper

TableContainer.allowedChildren = [TableBody, TableColGroup]
TableBody.requiredContainer = TableContainer

TableBody.allowedChildren = [TableRow]
TableRow.requiredContainer = TableBody

TableRow.allowedChildren = [TableCell]
TableCell.requiredContainer = TableRow

TableCell.allowedChildren = [TableCellLine, Header]
TableCellLine.requiredContainer = TableCell

TableColGroup.allowedChildren = [TableCol]
TableColGroup.requiredContainer = TableContainer

TableCol.requiredContainer = TableColGroup


function rowId() {
  const id = Math.random()
    .toString(36)
    .slice(2, 6)
  return `row-${id}`
}

function cellId() {
  const id = Math.random()
    .toString(36)
    .slice(2, 6)
  return `cell-${id}`
}

export {
  // blots
  TableCol,
  TableColGroup,
  TableCellLine,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableViewWrapper,

  // identity getters
  rowId,
  cellId,

  // attributes
  CELL_IDENTITY_KEYS,
  CELL_ATTRIBUTES
}

