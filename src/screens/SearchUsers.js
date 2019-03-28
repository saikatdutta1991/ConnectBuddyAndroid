import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text, Content, Item, Input, View } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import customColor from '../../native-base-theme/variables/customColor';


export default class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {};
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
                        <Title>Search</Title>
                    </Body>
                    <Right />
                </Header>
                <View style={{ padding: 15, paddingTop: 0, backgroundColor: customColor.brandPrimary }}>
                    <Item rounded style={{ borderRadius: 5, backgroundColor: 'white' }}>
                        <Input placeholder="Type your keywords here.." placeholderTextColor="grey" />
                        <Icon name="search" type='FontAwesome' style={{ color: 'grey' }} />
                    </Item>
                </View>

                <Content>
                    <Text>Search</Text>
                </Content>

            </Container>
        );
    }

}

const styles = StyleSheet.create({

});