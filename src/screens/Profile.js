import React, { Component } from 'react';
import { StyleSheet, Dimensions, Image, View } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Item, Content, Input, Text, Thumbnail } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import CustomColor from '../../native-base-theme/variables/customColor';
import authuser from "../AuthUser";


export default class Proflie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authuser_name: authuser.getName(),
            authuser_imageurl: authuser.getImageurl()
        };



    }

    _doUpdate = () => {

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
                        <Title>Your Profile</Title>
                    </Body>
                    <Right />
                </Header>
                <Content style={styles.container}>

                    <View style={styles.topBackground}>
                    </View>

                    <Thumbnail source={{ uri: this.state.authuser_imageurl }}
                        style={styles.userImage} />

                    <View style={{ padding: 15 }}>
                        <Item rounded style={[styles.item, styles.itemInput]}>
                            <Icon active name='text-width' type='FontAwesome' />
                            <Input placeholder='Name' />
                        </Item>
                        <Item rounded style={[styles.item, styles.itemInput]}>
                            <Icon active name='envelope' type='FontAwesome' />
                            <Input placeholder='Email' />
                        </Item>
                        <Item rounded style={[styles.item, styles.itemInput]}>
                            <Icon active name='key' type='FontAwesome' />
                            <Input placeholder='Password' secureTextEntry={true} />
                        </Item>

                        <Button rounded dark block style={[styles.item, styles.loginBtn]} onPress={this._doUpdate}>
                            <Text>Update</Text>
                        </Button>
                    </View>

                </Content>
            </Container>
        );
    }

}

const styles = StyleSheet.create({
    topBackground: {
        backgroundColor: CustomColor.brandPrimary,
        width: Dimensions.get('window').width,
        height: 100,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    userImage: {
        marginTop: -70,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 130,
        height: 130,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 5
    },
    item: {
        marginBottom: 15,
    },
    itemInput: {
        backgroundColor: 'white'
    },
    loginBtn: {
        marginTop: 30
    }

});