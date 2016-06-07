import { addResizeListener, removeResizeListener } from 'detect-resize'
const should = require('chai').should()

/**
 * <AutoSizer /> factory
 * @param  {...Object} options  <AutoSizer /> dependencies.
 * @return {AutoSizer}          An <AutoSizer /> component.
 */
export default function createAutoSizer({ React }) {
  const { Component, PropTypes } = React
  class AutoSizer extends Component {
    static propTypes = createPropTypes(React);
    constructor(props) {
      super(props)
      this.state =  { height: 0
                    , width: 0
                    }
    }
    componentDidMount() {
      const { src } = this.props
      should.exist(src)
      addResizeListener(src, this._handleResize)
    }
    componentWillUnmount() {
      const { src } = this.props
      should.exist(src)
      removeResizeListener(src, this._handleResize)
    }
    _handleResize = e => {
      const { src, onResize, ...eventArgs } = this.props

      // Guard against AutoSizer component being removed from the DOM immediately after being added.
      // This can result in invalid style values which can result in NaN values if we don't handle them.

      const boundingRect = src.getBoundingClientRect()
      const height = boundingRect.height || 0
      const width = boundingRect.width || 0

      const style = getComputedStyle(src)
      const paddingLeft = parseInt(style.paddingLeft, 10) || 0
      const paddingRight = parseInt(style.paddingRight, 10) || 0
      const paddingTop = parseInt(style.paddingTop, 10) || 0
      const paddingBottom = parseInt(style.paddingBottom, 10) || 0

      this.setState({ height: height - paddingTop - paddingBottom
                    , width: width - paddingLeft - paddingRight
                    })

      onResize({ height, width }, eventArgs)
      console.warn('onResize executed', {height, width}, eventArgs)
    };
    _resizeTargets = (width, height) => {
      const { target } = this.props
      if(Array.isArray(target)) {
        target.forEach(x => {
          x.width = width
          x.height = height
        })
      } else {
        target.width = width
        target.height = height
      }
    }
    render() {
      const { children } = this.props
      return children || null
    }
  }
  return AutoSizer
}

/**
 * Interface factory for <Autosizer /> components.
 * @param  {[type]} options.PropTypes [description]
 * @return {[type]}                   [description]
 */
export const createPropTypes = ({ PropTypes }) => ( { src: PropTypes.object.isRequired
                                                    , target: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
                                                    , onResize: PropTypes.func
                                                    } )

/** Creates mapStateToProps for <Autosizer /> component */
export const createMapStateToProps = ({}) => state => state

/** Creates mapDispatchToProps for <Autosizer /> component */
export const createMapDispatchToProps = ({}) => dispatch => ({})

/**
 * Creates a react-redux style connect function tailed for <Autosizer />
 * @param  {function}  options.connect  react-redux connect function dependency.
 * @param  {...Object} options.rest     The rest of the connect related dependencies.
 * @return {Autosizer}                       A higher order <Autosizer /> component.
 */
export const createConnect = ({ connect, ...rest }) => {
  should.exist(connect, 'redux connect is required for <Autosizer /> connect')
  connect.should.be.a('function')
  const mapStateToProps = createMapStateToProps({ ...rest })
  should.exist(mapStateToProps, 'mapStateToProps is required for <Autosizer /> connect')
  mapStateToProps.should.be.a('function')
  const mapDispatchToProps = createMapDispatchToProps({ ...rest })
  should.exist(mapDispatchToProps, 'mapDispatchToProps is required for <Autosizer /> connect')
  mapDispatchToProps.should.be.a('function')
  return Component => connect(mapStateToProps, mapDispatchToProps)(Component)
}
