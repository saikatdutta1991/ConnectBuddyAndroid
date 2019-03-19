import React, { Component } from 'react';
import { StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Thumbnail, Text } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import { DrawerActions } from 'react-navigation-drawer';
import Services from '../Services';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Triangle from 'react-native-triangle';
import gStorage from "../GInmemStorage";
import CustomColor from '../../native-base-theme/variables/customColor';

const pinMarkerImage = require('../images/map-pin2.png');

export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mapRegion: this._regionFrom(gStorage.currentPosition.coords.latitude, gStorage.currentPosition.coords.longitude, 100),
            nearbyusers: [],
            headerActivityIndicator: '',
        };
    }


    /**
     * calculate region form
     */
    _regionFrom(lat, lon, accuracy) {
        accuracy = accuracy * 10;
        const oneDegreeOfLongitudeInMeters = 111.32 * 1000;
        const circumference = (40075 / 360) * 1000;

        const latDelta = accuracy * (1 / (Math.cos(lat) * circumference));
        const lonDelta = (accuracy / oneDegreeOfLongitudeInMeters);

        return {
            latitude: lat,
            longitude: lon,
            latitudeDelta: Math.max(0, latDelta),
            longitudeDelta: Math.max(0, lonDelta)
        };
    }


    _mapReady = async () => {
        this._fetchNearbyUsers();
    }


    _regionChangeComplete = async (region) => {
        this.setState({ mapRegion: region })
        this._fetchNearbyUsers();
    }


    _fetchNearbyUsers = async () => {

        this.setState({ headerActivityIndicator: 'nearby users..' });

        /** get nearby users */
        let response = await Services.getNearbyUsers(this.state.mapRegion.latitude, this.state.mapRegion.longitude, 1000);

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }

        if (response.success) {
            this.setState({ nearbyusers: response.data, headerActivityIndicator: '' });
        } else {
            this.setState({ nearbyusers: [], headerActivityIndicator: '' });
        }

    }



    _currentUserMarker = () => {

        return (
            <View style={styles.markerFixed}>
                <Image style={styles.marker} source={pinMarkerImage} />
            </View>
        );
    }



    _markerPressed = (event) => {

        const coordinate = event.nativeEvent.coordinate;
        let markerUser = this.state.nearbyusers.find(user => {
            return user.location.coordinates[1] === coordinate.latitude && user.location.coordinates[0] === coordinate.longitude;
        });

        this.props.navigation.navigate('FriendRequestSend', { user: markerUser });

    }


    _nearbyuserMarkers = () => {

        return this.state.nearbyusers.map(user => (
            <MapView.Marker
                identifier={user._id}
                coordinate={{
                    latitude: user.location.coordinates[1],
                    longitude: user.location.coordinates[0]
                }}
                {...user}
                key={user._id}
                onPress={this._markerPressed}
            >
                <View style={styles.container}>
                    <Thumbnail style={styles.circle} source={{ uri: user.image_url }} />
                    <Triangle
                        style={{ top: -4 }}
                        width={20}
                        height={20}
                        color={'#ff5722'}
                        direction={'down'}
                    />
                </View>
            </MapView.Marker>
        ))

    }


    _getCurrentLocation = () => {

        this.setState({ headerActivityIndicator: 'fetching Loc..' });

        Services.getCurrentPosition().then(position => {

            let region = this._regionFrom(position.coords.latitude, position.coords.longitude, 100);
            this.setState({ mapRegion: region, headerActivityIndicator: '', });
            this.map.animateToRegion(region, 500);
            this._fetchNearbyUsers();

        }).catch(error => {
            this.setState({ headerActivityIndicator: '' });
            alert("Unable to fethc current location");
        })
    }

    _currentLocationButton = () => {
        return (
            <Icon style={styles.currentLocationBtn} active name='crosshairs' type='FontAwesome' onPress={this._getCurrentLocation} />
        );
    }

    _headerActivityIndicator = () => {
        if (!this.state.headerActivityIndicator) {
            return null;
        }

        return (
            <React.Fragment>
                <Text style={{ color: 'white', marginRight: 5 }}>{this.state.headerActivityIndicator}</Text>
                <ActivityIndicator size="small" color='white' />
            </React.Fragment>
        );
    }



    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.dispatch(DrawerActions.openDrawer())}>
                            <Icon name='menu' />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Home</Title>
                    </Body>
                    <Right>
                        {this._headerActivityIndicator()}
                    </Right>
                </Header>

                <Grid>
                    <Col style={styles.container}>


                        <MapView
                            ref={ref => { this.map = ref; }}
                            style={{ width: '100%', height: '100%' }}
                            provider={PROVIDER_GOOGLE}
                            initialRegion={this.state.mapRegion}
                            onRegionChangeComplete={this._regionChangeComplete}
                            loadingEnabled={true}
                            onMapReady={this._mapReady}
                            moveOnMarkerPress={false}
                        >
                            {this.state.nearbyusers.length ? this._nearbyuserMarkers() : null}
                        </MapView>
                        {this._currentUserMarker()}
                        {this._currentLocationButton()}
                    </Col>
                </Grid>

            </Container>
        );
    }

}

const styles = StyleSheet.create({
    currentLocationBtn: {
        position: 'absolute',
        right: 15,
        bottom: 15,
        color: 'white',
        borderRadius: 100,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 12,
        paddingLeft: 12,
        backgroundColor: CustomColor.brandPrimary
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        marginBottom: 15
    },
    circle: {
        borderColor: '#ff5722',
        borderWidth: 5,
    },
    markerFixed: {
        left: '50%',
        marginLeft: -21,
        marginTop: -42,
        position: 'absolute',
        top: '50%'
    },
    marker: {
        height: 42,
        width: 42
    }
});