import React, { Component } from 'react';
import { mapStyle } from '../data/mapStyle';
import { List } from './List';
import { InfoModal } from './InfoModal';
import { MAPS_KEY, FS_ID, FS_SECRET } from '../data/credentials';
import mapIcon from '../images/restaurant-icon.png';
import fslogo from '../images/fs-icon.png';
import '../css/App.css';

let myMap = {};

class App extends Component {
  constructor(props) {
    super(props);
    this.loadMap = this.loadMap.bind(this);
    this.getVenues = this.getVenues.bind(this);
    this.initMap = this.initMap.bind(this);
    this.loadScript = this.loadScript.bind(this);
    this.state = {
      venues: [],
      markers: [],
      warning: true,
      warningMsg: 'welcomeMsg'
    };
  }

  
  componentDidMount() {
    this.getVenues('-23.528147,-46.695528800000034');
  }

  /**
   * Carrega mapa
   */
  loadMap = () => {
    this.loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places&callback=initMap`
    );
    window.initMap = this.initMap;
  };

  /**
   * A partir da API do foursquare, recupera restaurantes
   * para o lugar selecionado
   */
  getVenues = llneighborhood => {
    fetch(
      `https://api.foursquare.com/v2/venues/explore` +
        `?client_id=${FS_ID}` +
        `&client_secret=${FS_SECRET}` +
        `&limit=15` +
        `&section=food` +
        `&ll=${llneighborhood}` +
        `&radius=1000` +
        `&v=20190530`
    )
      .then(response => response.json())
      .then(data => {
        if (data.meta.code === 200) {
          this.setState(
            {
              venues: data.response.groups[0].items
            },
            () => this.loadMap()
          );
        } else {
          this.setState({
            warning: true,
            warningMsg: 'Ops! Desculpe, houve um erro na sua pesquisa. Por favor, tente novamente mais tarde.'
          });
        }
      })
      .catch(error => {
        this.setState({
          warning: true,
          warningMsg: 'Ops! Desculpe, houve um erro na sua pesquisa. Por favor, tente novamente mais tarde.'
        });
      });
  };

  /**
   * Inicia API do Google Maps
   */
  initMap = () => {
    
    /**
     * Seta limites do mapa
     */
    const SP_BOUNDS = {
      north: -23.45435,
      south: -23.68985,
      west: -46.79624,
      east: -46.34775
    };

    /**
     * Cria mapa na posição inicial
     */
    myMap = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: -23.528147, lng: -46.695528800000034 },
      zoom: 14,
      styles: mapStyle,
      restriction: {
        latLngBounds: SP_BOUNDS,
        strictBounds: true
      }
    });

    /**
     * Seta limites
     */
    const bounds = new window.google.maps.LatLngBounds();

    /**
     * Cria infowindow para exibição de detalhes
     * do restaurante
     */
    const infowindow = new window.google.maps.InfoWindow({ maxWidth: 300 });
    this.setState({
      myInfowindow: infowindow
    })

    /**
     * Caso existam restaurantes, cria marcador no mapa
     * e adiciona detalhes
     */
    if (this.state.venues.length > 0) {
      let markers = [];
      // eslint-disable-next-line
      this.state.venues.map(myVenue => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: myVenue.venue.location.lat,
            lng: myVenue.venue.location.lng
          },
          icon: mapIcon,
          map: myMap,
          name: myVenue.venue.name,
          id: myVenue.venue.id,
          animation: window.google.maps.Animation.DROP
        });

        marker.openInfo = (marker) => {
          this.state.myInfowindow.setContent(marker.content);
          this.state.myInfowindow.open(myMap, marker); 
        }
        
        marker.closeInfo = () => infowindow.close();
        
        myMap.center = marker.position;

        /**
         * Endereço
         */
        let venueAddress = '';
        if (myVenue.venue.location.formattedAddress.length > 0) {
          // eslint-disable-next-line
          myVenue.venue.location.formattedAddress.map(address => {
            venueAddress += `<span>${address}</span>`;
          });
        }

        let image = '';
        if (myVenue.venue.categories.length > 0) {
          image = `<img class="info-icon" src="${myVenue.venue.categories[0]
            .icon.prefix +
            '64' +
            myVenue.venue.categories[0].icon
              .suffix}" alt="Ícone da categoria"/>`;
        }

        let contentString = `<div class="info-content">
          <div class="info-img">
            ${image}
          </div>
          <div class="info-venue-name">
            <h2 class="venue-name">${myVenue.venue.name}</h2>
          </div>
          <div class="info-venue-categ">
            <h3 class="venue-category">${myVenue.venue.categories[0].name}</h3>
          </div>
          <div class="info-venue-address">
            ${venueAddress}
          </div>
          <div class="info-venue-credits">
            <img class="info-fslogo" src="${fslogo}" alt="Powered by Foursquare">
          </div>
        </div>`;
        
        marker.content = contentString;

        /**
         * Adiciona marcador, infowindow e anima
         * ícone ao clicar para maiores informações
         */
        marker.addListener('click', function() {
          this.openInfo(this);
          this.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(function() {
            marker.setAnimation(null);
          }, 900);
        });

        markers.push(marker);
        bounds.extend(marker.position);
      });

      this.setState({
        markers,
        infowindow
      })
      
      myMap.fitBounds(bounds);
    }
  };

  /**
   * Metodo passado como propriedade para
   * o componente InfoModal
   */
  setWarningFalse = () => {
    this.setState({
      warning: false,
      warningMsg: ''
    });
  };

  /**
   * Carrega script assincrono e carrega mapa
   */
  loadScript = url => {
    if (!window.document.scripts.maps) {
      const index = window.document.getElementsByTagName('script')[0];
      let script = window.document.createElement('script');
      [script.id, script.src, script.async, script.defer] = [
        'maps',
        url,
        true,
        true
      ];
      if (script.onerror) {
        this.setState({
          warning: true,
          warningMsg: 'Ops! Desculpe, não foi possível carregar a API do Google Maps. Por favor, tente novamente mais tarde.'
        });
      }
      index.parentNode.insertBefore(script, index);
    } else {
      this.initMap();
    }
  };

  render() {
    let infoModal;
    if (this.state.warning) {
      infoModal = (
        <InfoModal
          resetWarning={this.setWarningFalse}
          warningMsg={this.state.warningMsg}
        />
      );
    }
    return (
      <main>
        {infoModal}
        <List
          markers={this.state.markers}
          infowindows={this.state.infowindow}
          myInfowindow={this.state.myInfowindow}
          loadNeighborhood={this.getVenues}
          updateMarkers={this.updateMarkers}
        />
        <div id="map"></div>
      </main>
    );
  }
}

export default App;
