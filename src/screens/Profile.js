import React, { Component } from 'react';
import { StyleSheet, Dimensions, View, Image } from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Item, Content, Input, Text, Toast, ActionSheet, Spinner } from 'native-base';
import { DrawerActions } from 'react-navigation-drawer';
import CustomColor from '../../native-base-theme/variables/customColor';
import authuser from "../AuthUser";
import ImagePicker from 'react-native-image-crop-picker';
import Services from '../Services';
import gStorage from "../GInmemStorage";
import { showMessage, hideMessage } from "react-native-flash-message";

export default class Proflie extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authuser_email: authuser.getEmail(),
            authuser_name: authuser.getName(),
            authuser_imageurl: authuser.getImageurl(),
            authuser_newpassword: '',
            uploadActivity: false,
            profileLoading: false,
            updateProfileLoading: false
        };
    }


    async componentDidMount() {

        /** fetch profile and update input */
        this.setState({ profileLoading: true });
        let response = await Services.getProfile();
        this.setState({ profileLoading: false });

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }

        /** successs  */
        await authuser.setId(response.data.user._id)
            .setName(response.data.user.name)
            .setEmail(response.data.user.email)
            .setImageurl(response.data.user.image_url)
            .save();

        this.setState({
            authuser_email: authuser.getEmail(),
            authuser_name: authuser.getName(),
            authuser_imageurl: authuser.getImageurl()
        });


    }




    /** update user profile */
    _doUpdate = async () => {

        this.setState({ updateProfileLoading: true });
        let response = await Services.updateProfile(this.state.authuser_name, this.state.authuser_email, this.state.authuser_newpassword);
        this.setState({ updateProfileLoading: false });

        /** check session expires */
        if (!response.success && response.type == 'session_expired') {
            this.props.navigation.navigate('Logout');
            return false;
        }

        /** check if v_error */
        if (!response.success && response.type == 'v_error') {

            showMessage({
                message: "Profile Update Failed",
                description: response.data[Object.keys(response.data)[0]],
                type: "danger",
                floating: true
            });

            return;
        }


        /** successs  */
        await authuser.setName(response.data.user.name)
            .setEmail(response.data.user.email)
            .save();

        this.setState({
            authuser_email: authuser.getEmail(),
            authuser_name: authuser.getName(),
            authuser_newpassword: ''
        });

        /** set image and name to sidebar */
        gStorage.mainMenu.setState({ authuser_name: authuser.getName() });

        showMessage({
            message: "Success",
            description: "Profile updated successfully",
            type: "success",
            floating: true
        });


    }


    _onUpdateImagePress = () => {

        ActionSheet.show(
            {
                options: ['Open Camera', "Choose from Gallery"],
                title: "Select an option"
            },
            buttonIndex => {

                /** open galllery */
                if (buttonIndex == 1) {
                    this._openGallery();
                } else if (buttonIndex == 0) {
                    this._openCamera();
                }
            }
        )
    }


    _openCamera() {
        this.setState({ uploadActivity: true });

        ImagePicker.openCamera({
            width: 200,
            height: 300,
            cropping: true,
            includeBase64: true,
        }).then(async image => {

            let imagebase64 = `data:${image.mime};base64,${image.data}`;
            let response = await Services.uploadPhoto(imagebase64);
            this.setState({ uploadActivity: false });

            if (!response) {

                showMessage({
                    message: "Failed",
                    description: "Failed to update image",
                    type: "danger",
                    floating: true
                });

                return false;
            }

            /** check if v_error */
            if (!response.success) {
                showMessage({
                    message: "Failed",
                    description: response.message,
                    type: "danger",
                    floating: true
                });

                return;
            }

            /** store auth user data */
            await authuser.setImageurl(response.data.user.image_url).save();

            this.setState({ authuser_imageurl: imagebase64 })

            /** set image and name to sidebar */
            gStorage.mainMenu.setState({ authuser_image: imagebase64 });


        }).catch(err => {
            showMessage({
                message: "Failed",
                description: 'Failed to upload image',
                type: "danger",
                floating: true
            });

            this.setState({ uploadActivity: false });
        })
    }




    _openGallery = () => {

        this.setState({ uploadActivity: true });

        ImagePicker.openPicker({
            width: 200,
            height: 300,
            cropping: true,
            includeBase64: true,
        }).then(async image => {

            let imagebase64 = `data:${image.mime};base64,${image.data}`;
            let response = await Services.uploadPhoto(imagebase64);
            this.setState({ uploadActivity: false });

            if (!response) {

                showMessage({
                    message: "Failed",
                    description: 'Failed to upload image',
                    type: "danger",
                    floating: true
                });

                return false;
            }

            /** check if v_error */
            if (!response.success) {
                showMessage({
                    message: "Failed",
                    description: response.message,
                    type: "danger",
                    floating: true
                });

                return;
            }

            /** store auth user data */
            await authuser.setImageurl(response.data.user.image_url).save();

            this.setState({ authuser_imageurl: imagebase64 })

            /** set image and name to sidebar */
            gStorage.mainMenu.setState({ authuser_image: imagebase64 });


        }).catch(err => {
            showMessage({
                message: "Failed",
                description: 'Failed to upload image',
                type: "danger",
                floating: true
            });

            this.setState({ uploadActivity: false });
        })

    }


    _imageContent() {
        return (
            <View style={styles.imageOuterContainer}>
                <View style={styles.imageInnerContainer}>
                    <Image resizeMode="cover" source={{ uri: this.state.authuser_imageurl }} style={styles.userImage} />
                    <View style={styles.cameraIconWrapper}>
                        {
                            this.state.uploadActivity ?
                                <Spinner size="small" color={CustomColor.brandPrimary} />
                                :
                                <Icon name="camera" type='FontAwesome' onPress={this._onUpdateImagePress} />
                        }
                    </View>
                </View>
            </View>
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
                        <Title>Profile</Title>
                    </Body>
                    <Right>
                        {
                            this.state.profileLoading ?
                                <Spinner size="small" color="white" />
                                : null
                        }

                    </Right>
                </Header>
                <Content style={styles.container}>

                    <View style={styles.topBackground}></View>

                    {this._imageContent()}

                    <View style={{ padding: 15 }}>
                        <Item rounded style={styles.item}>
                            <Icon style={styles.itemIcon} active name='text-width' type='FontAwesome' />
                            <Input placeholderTextColor={CustomColor.brandPrimary} style={styles.itemInput} placeholder='Name' value={this.state.authuser_name} onChangeText={(text) => this.setState({ authuser_name: text })} />
                        </Item>
                        <Item rounded style={styles.item}>
                            <Icon style={styles.itemIcon} active name='envelope' type='FontAwesome' />
                            <Input autoComplete="off" autoCapitalize='none' placeholderTextColor={CustomColor.brandPrimary} style={styles.itemInput} placeholder='Email' value={this.state.authuser_email} onChangeText={(text) => this.setState({ authuser_email: text })} />
                        </Item>
                        <Item rounded style={styles.item}>
                            <Icon style={styles.itemIcon} active name='key' type='FontAwesome' />
                            <Input placeholderTextColor={CustomColor.brandPrimary} style={styles.itemInput} placeholder='New Password' secureTextEntry={true} value={this.state.authuser_newpassword} onChangeText={(text) => this.setState({ authuser_newpassword: text })} />
                        </Item>

                        <Button rounded block style={[styles.item, styles.loginBtn]} onPress={this._doUpdate}>
                            <Text>Update</Text>
                            {
                                this.state.updateProfileLoading ?
                                    <Spinner size="small" color="white" />
                                    :
                                    null
                            }
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
        height: 100
    },
    userImage: {
        width: 130,
        height: 130,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 5,
        flex: 1,
    },
    item: {
        marginBottom: 15,
    },
    itemInput: {
        color: CustomColor.brandPrimary
    },
    itemIcon: {
        color: CustomColor.brandPrimary
    },
    loginBtn: {
        marginTop: 30
    },
    imageOuterContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    imageInnerContainer: {
        width: 130,
        height: 130,
        marginTop: -70
    },
    cameraIconWrapper: {
        borderRadius: 100,
        padding: 5,
        backgroundColor: 'white',
        position: "absolute",
        top: 0,
        right: 0,
    }
});