import React, { Component } from 'react';

export class List extends Component {
  constructor(props) {
    super(props);
    this.openNav = this.openNav.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.state = {
      width: '0',
      expanded: false,
      query: '',
      markers: [],
      matched: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ markers: nextProps.markers });
  }
  
  /**
   * Abre navbar com lista de lugares
   */
  openNav() {
    this.setState({
      width: '250px',
      expanded: true
    });
  }

  /**
   * Fecha navbar com lista de lugares
   */
  closeNav() {
    this.setState({
      width: '0',
      expanded: false
    });
  }
  
  /**
   * Manipula filtro
   */
  handleChange = e => {
    
    this.hideInfo();
    
    const matched = [];
    // eslint-disable-next-line
    const markers = this.props.markers.map( marker => {
      const isMatched = marker.name.toLowerCase().includes(e.target.value.toLowerCase());
      if (isMatched) {
        matched.push(marker);
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    })
    
    this.setState({
      query: e.target.value,
      matched
    })
    
  }
  
  /**
   * Exibe informações do marcador
   */
  handleInfo = (marker) => {
    this.hideInfo();
    this.closeNav();
    marker.openInfo(marker, this.props.myInfowindow);
  }
  
  hideInfo = () => {
    // eslint-disable-next-line
    const markers = this.props.markers.map( marker => {
      marker.closeInfo();
    });
  }

  render() {
    
    let listItem = this.state.markers;
    
    if ( this.state.matched.length > 0 ) {
      listItem = this.state.matched;
    }
    
    if ( this.state.query && this.state.matched.length === 0 ) {
      listItem = [];
    }
    
    const tabIndex = this.state.expanded ? '2' : '-1';
    
    return (
      <header>
        <button
          tabIndex="1"
          aria-label="Abrir lista"
          className="open-list"
          onClick={() => this.openNav()}
        >
          &#9776;
        </button>
        <div
          role="navigation"
          aria-label="Lista de lugares"
          aria-expanded={this.state.expanded}
          id="mySidenav"
          className="sidenav"
          style={{ width: this.state.width }}
        >
          <input
            tabIndex={tabIndex}
            type="text"
            id="filter"
            placeholder="Filtrar"
            onChange={this.handleChange}
          />
          <button
            tabIndex={tabIndex}
            className="closebtn"
            onClick={() => this.closeNav()}
          >
            &times;
          </button>
          {listItem.length ? (
            listItem.map(marker => (
              <button type="button" tabIndex={tabIndex} key={marker.id} onClick={() => this.handleInfo(marker) }>
                {marker.name}
              </button>
            ))
          ) : (
            <button type="button" tabIndex={tabIndex} key="">
              Nenhum resultado
            </button>
          )}
        </div>
        <h1 id="header-title">Conheça a Liberdade!</h1>
      </header>
    );
  }
}
