const should = require('chai').should()

/**
 * <Autosizer /> factory
 * @param  {...Object} options  <Autosizer /> dependencies.
 * @return {Autosizer}          An <Autosizer /> component.
 */
export default function reactAutosizer({ React }) {
  const { Component, PropTypes } = React
  class Autosizer extends Component {
    static propTypes = createPropTypes(React);
    componentDidMount() { this._addEvents() }
    componentWillUnmount() { this._removeEvents() }
    _addEvents = () => {
      const { src } = this.props
      should.exist(src)
      src.should.have.property('addEventListener', 'src should be an object with a resize event')
                      .that.is.a('function')
      src.addEventListener('resize', this._handleResize)
    };
    _removeEvents = () => {
      const { src } = this.props
      should.exist(src)
      src.should.have.property('removeEventListener', 'src should be an object with a resize event')
                      .that.is.a('function')
      src.removeEventListener('resize', this._handleResize)
    };
    _handleResize = e => {
      const { onUpdate, ...eventArgs } = this.props
      onUpdate(e, eventArgs)
      console.warn('handleResize called', e, eventArgs)
    };
    render() {
      const { children } = this.props
      return (
        <div>
          {children}
        </div>
      )
    }
  }
  return Autosizer
}

/**
 * Interface factory for <Autosizer /> components.
 * @param  {[type]} options.PropTypes [description]
 * @return {[type]}                   [description]
 */
export const createPropTypes = ({ PropTypes }) => ( { src: PropTypes.object.isRequired
                                                    , target: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired
                                                    , onUpdate: PropTypes.func
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
