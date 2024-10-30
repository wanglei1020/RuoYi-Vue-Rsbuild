<script>
import draggable from 'vuedraggable'
import render from '@/utils/generator/render'
import { Col, FormItem, Row } from 'element-ui'
import Render from '@/utils/generator/render'
import Draggable from 'vuedraggable'

const components = {
  itemBtns(h, element, index, parent) {
    const { copyItem, deleteItem } = this.$listeners
    /*return [
      <span class="drawing-item-copy" title="复制" onClick={event => {
        copyItem(element, parent); event.stopPropagation()
      }}>
        <i class="el-icon-copy-document" />
      </span>,
      <span class="drawing-item-delete" title="删除" onClick={event => {
        deleteItem(index, parent); event.stopPropagation()
      }}>
        <i class="el-icon-delete" />
      </span>
    ]*/
    return [
      h('span', {
        class: 'drawing-item-copy',
        attrs: { title: '复制' },
        on: { click: (event) => {
            copyItem(element, parent);
            event.stopPropagation();
          }}
      }, [
        h('i', { class: 'el-icon-copy-document' })
      ]),
      h('span', {
        class: 'drawing-item-delete',
        attrs: { title: '删除' },
        on: { click: (event) => {
            deleteItem(index, parent);
            event.stopPropagation();
          }}
      }, [
        h('i', { class: 'el-icon-delete' })
      ])
    ];
  }
}

const layouts = {
  colFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    let className = this.activeId === element.formId ? 'drawing-item active-from-item' : 'drawing-item'
    if (this.formConf.unFocusedComponentBorder) className += ' unfocus-bordered'
    /*return (
      <el-col span={element.span} class={className}
        nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
        <el-form-item label-width={element.labelWidth ? `${element.labelWidth}px` : null}
          label={element.label} required={element.required}>
          <render key={element.renderKey} conf={element} onInput={ event => {
            this.$set(element, 'defaultValue', event)
          }} />
        </el-form-item>
        {components.itemBtns.apply(this, arguments)}
      </el-col>
    )*/
    return h(Col, {
      attrs: { span: element.span },
      class: className,
      on: { nativeOn:{ click: (event) => { activeItem(element); event.stopPropagation(); } } }
    }, [
      h(FormItem, {
        props: { labelWidth: element.labelWidth ? `${element.labelWidth}px` : null, label: element.label, required: element.required }
      }, [
        h(Render, {
          key: element.renderKey,
          props: { conf: element },
          on: { input: (event) => { this.$set(element, 'defaultValue', event); } }
        })
      ]),
      components.itemBtns.apply(this, arguments)
    ]);
  },

  rowFormItem(h, element, index, parent) {
    const { activeItem } = this.$listeners
    const className = this.activeId === element.formId ? 'drawing-row-item active-from-item' : 'drawing-row-item'
    let child = renderChildren.apply(this, arguments)
    if (element.type === 'flex') {
      /*child = <el-row type={element.type} justify={element.justify} align={element.align}>
              {child}
            </el-row>*/
      child = h(Row, { props: { type: element.type, justify: element.justify, align: element.align }})
    }
    /*return (
      <el-col span={element.span}>
        <el-row gutter={element.gutter} class={className}
          nativeOnClick={event => { activeItem(element); event.stopPropagation() }}>
          <span class="component-name">{element.componentName}</span>
          <draggable list={element.children} animation={340} group="componentsGroup" class="drag-wrapper">
            {child}
          </draggable>
          {components.itemBtns.apply(this, arguments)}
        </el-row>
      </el-col>
    )*/
    return h(Col, { props: { span: element.span } }, [
      h(Row, {
        props: { gutter: element.gutter },
        class: className,
        nativeOn: { click: (event) => { activeItem(element); event.stopPropagation(); } }
      }, [
        h('span', { class: 'component-name' }, element.componentName),
        h(Draggable, {
          props: { list: element.children, animation: 340, group: 'componentsGroup' },
          class: 'drag-wrapper',
        }, child),
        components.itemBtns.apply(this, arguments)
      ])
    ]);

  }
}

function renderChildren(h, element, index, parent) {
  if (!Array.isArray(element.children)) return null
  return element.children.map((el, i) => {
    const layout = layouts[el.layout]
    if (layout) {
      return layout.call(this, h, el, i, element.children)
    }
    return layoutIsNotFound()
  })
}

function layoutIsNotFound() {
  throw new Error(`没有与${this.element.layout}匹配的layout`)
}

export default {
  components: {
    render,
    draggable
  },
  props: [
    'element',
    'index',
    'drawingList',
    'activeId',
    'formConf'
  ],
  render(h) {
    const layout = layouts[this.element.layout]

    if (layout) {
      return layout.call(this, h, this.element, this.index, this.drawingList)
    }
    return layoutIsNotFound()
  }
}
</script>
