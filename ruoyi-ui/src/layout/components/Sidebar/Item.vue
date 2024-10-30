<script>
import svgIcon from '../../../components/SvgIcon/index.vue'

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(h(svgIcon,{
        props: {
          iconClass: icon
        }
      }))
    }

    if (title) {
      if (title.length > 5) {
        vnodes.push(h('span',{
          title,
          slot: 'title'
        }, title))
      } else {
        vnodes.push(h('span',{
          slot:'title'
        },title))
      }
    }
    return vnodes
  }
}
</script>
