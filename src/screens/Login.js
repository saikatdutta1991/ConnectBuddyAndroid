import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Input, Item, Text } from 'native-base';
import { Col, Grid } from 'react-native-easy-grid';
import { DrawerActions } from 'react-navigation-drawer';

export default class Login extends Component {

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
                        <Title>Login</Title>
                    </Body>
                    <Right />
                </Header>

                <Grid>
                    <Col style={styles.container}>
                        <Item rounded style={styles.item}>
                            <Icon active name='envelope' type='FontAwesome' />
                            <Input placeholder='Email' />
                        </Item>
                        <Item rounded style={styles.item}>
                            <Icon active name='key' type='FontAwesome' />
                            <Input placeholder='Password' />
                        </Item>

                        <Button rounded block style={styles.item}>
                            <Text>Login</Text>
                        </Button>

                    </Col>
                </Grid>

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
    },
    item: {
        marginBottom: 15
    }

});