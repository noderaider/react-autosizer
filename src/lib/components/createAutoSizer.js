import { addResizeListener, removeResizeListener } from 'detect-resize'
const should = require('chai').should()

/**
 * <AutoSizer /> factory
 * @param  {...Object} options  <AutoSizer /> dependencies.
 * @return {AutoSizer}          An <AutoSizer /> component.
 */
export default function createAutoSizer({ React }) {
  const { Component, PropTypes, cloneElement } = React
  class AutoSizer extends Component {
    static propTypes = createPropTypes(React);
    set dimensions(value) {
      should.exist(value, 'dimensions should have a value specified.')
      const { width, height } = value
      console.warn('setting autosizer dimensions', value)
      this.setState({ width, height })
    }
    get dimensions() {
      const { height, width } = this.state
      return { height, width }
    }
    constructor(props) {
      super(props)
      this.state =  { height: 0
                    , width: 0
                    }
    }
    componentDidMount() {
      should.exist(this._src)
      addResizeListener(this._src, this._handleResize)
      this._handleResize()
    }
    componentWillUnmount() {
      should.exist(this._src)
      removeResizeListener(this._src, this._handleResize)
    }
    _handleResize = () => {
      const { direction, traverseSource, onResize, ...eventArgs } = this.props

      // Guard against AutoSizer component being removed from the DOM immediately after being added.
      // This can result in invalid style values which can result in NaN values if we don't handle them.

      const src = traverseSource ? traverseSource(this._src) : this._src
      console.dir(src)
      const boundingRect = src.getBoundingClientRect()
      console.warn('BOUNDINGRECT', boundingRect)
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

      const dimensions = { height, width }
      if(onResize)
        onResize(dimensions, eventArgs)
      console.warn('onResize executed', dimensions, eventArgs)
    };
    _resizeTargets = dimensions => {
      const { target } = this.props
      if(Array.isArray(target))
        target.forEach(x => { x.dimensions = dimensions })
      else
        target.dimensions = dimensions
    }
    render() {
      const { direction, children, disableHeight, disableWidth } = this.props
      const { height, width } = this.state
      const outerStyle = { overflow: 'visible' }

      if (!disableHeight)
        outerStyle.height = 0

      if (!disableWidth)
        outerStyle.width = 0

      if(direction === 'down') {
        return (
          <div
            ref={x => this._src = x && x.parentNode}
            onScroll={this._onScroll}
            style={outerStyle}
          >
            {children({ height, width }, this)}
          </div>
        )
      } else if(direction === 'up') {
        return (
          <div
            ref={x => this._src = x}
            onScroll={this._onScroll}
            //style={{position: 'absolute', height}}
          >
            {children}
          </div>
        )
      } else throw new Error('unsupported AutoSizer direction.')
    }

    // Prevent detectElementResize library from being triggered by this scroll event.
    _onScroll = e => e.stopPropagation();
  }

  return AutoSizer
}

/**
 * Interface factory for <AutoSizer /> components.
 * @param  {[type]} options.PropTypes [description]
 * @return {[type]}                   [description]
 */
export const createPropTypes = ({ PropTypes }) => ( { targets: PropTypes.array
                                                    , onResize: PropTypes.func
                                                    , direction: PropTypes.oneOf(['down', 'up']).isRequired
                                                    , traverseSource: PropTypes.func
                                                    , disableWidth: PropTypes.bool
                                                    , disableHeight: PropTypes.bool
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
