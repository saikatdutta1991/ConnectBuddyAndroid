import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Container, Text, Button, H1, H3, Thumbnail } from 'native-base';

export default class AuthLoading extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.props.navigation.getParam('user', 'null')
        };

        this.props.navigation.addListener('willFocus', payload => {
            this._getUserFromParam();
        })
    }


    _getUserFromParam() {
        this.setState({
            user: this.props.navigation.getParam('user', 'null')
        });
    }


    async componentDidMount() {


    }

    _cancel = () => {
        this.props.navigation.navigate('Home');
    }


    // Render any loading content that you like here
    render() {
        return (
            <Container style={styles.container}>

                <H1 style={{ fontWeight: 'bold', marginBottom: 50 }}>Add as Friend ?</H1>

                <Thumbnail large source={{ uri: this.state.user.image_url }}
                    style={{ width: 150, height: 150, marginBottom: 15, overflow: 'hidden', borderRadius: 100 }}
                />

                <H3>{this.state.user.name}</H3>

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    bottom: 30

                }}>
                    <View style={{ flex: 1 }}>
                        <Button rounded warning block style={{ marginRight: 5 }} onPress={this._cancel}>
                            <Text>Cancel</Text>
                        </Button>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Button rounded success block style={{ marginLeft: 5 }}>
                            <Text>Send Request</Text>
                        </Button>
                    </View>
                </View>


            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: 15,
        paddingLeft: 15
    }
});